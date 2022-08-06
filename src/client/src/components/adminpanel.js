import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table'
import ButtonGroup from 'react-bootstrap/ButtonGroup'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import { useNavigate } from 'react-router-dom';


const UserRow = ({ user, handleChange, index, isSelected }) => {
 
  return (
    <tr>
      <td>
        <Form.Check checked={isSelected} onChange={() => {
          handleChange(index)
        }} />
      </td>
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.lastLogin}</td>
      <td>{user.createdAt}</td>
      <td>{user.blocked ? 'Blocked ❌' : 'Active ✔'}</td>
    </tr>
  )
}


export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [checkedUsers, setCheckedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  const _id = localStorage.getItem('_id')
  axios.defaults.headers.common['Authorization'] = _id

  const fetchUsers = async () => {
    try {
      const result = await axios.get('http://localhost:3000/users')
      if (result.status === 200) {
        setUsers(result.data.users.filter(user => user._id !== localStorage.getItem("_id")))
      }

    } catch (err) {
      console.log(err);
      if (err.response.status === 404) {
        alert('There is no such user')
      } else if (err.response.status === 403) {
        alert('You are blocked')
      }
      navigate('/login')
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    let temp = new Array(users.length).fill(false)
    setCheckedUsers(temp)
    setSelectAll(false)
  }, [users])

  const handleSelectAll = () => {
    setSelectAll(!selectAll)
    let temp = new Array(users.length).fill(!selectAll)
    setCheckedUsers(temp)
  }

  const handleCheckboxChange = (index) => {
    const newCheckedUsers = [...checkedUsers]
    newCheckedUsers[index] = !newCheckedUsers[index]
    setCheckedUsers(newCheckedUsers)
  }

  const handleDeleteButton = async (e) => {
    e.preventDefault()
    const usersToBeDeleted = users.filter((user, index) => checkedUsers[index]).map(user => user._id)
    console.log(usersToBeDeleted);

    try {
      const result = await axios.delete('http://localhost:3000/users',
        {
          data: {
            checkedUsers: usersToBeDeleted
          }
        }
      )
      if (result.status === 200) {
        fetchUsers()
      }

    } catch (err) {
      console.log(err);
      if (err.response.status === 404) {
        alert('There is no such user')
      } else if (err.response.status === 403) {
        alert('You are blocked')
      }
      navigate('/login')
    }
  }

  const handleBlockButton = async (e) => {
    e.preventDefault()
    const usersToBeBlocked = users.filter((user, index) => checkedUsers[index]).map(user => user._id)

    // axios.patch(`http://localhost:3000/users/`, {
    //   checkedUsers: usersToBeBlocked,
    //   blocked: true
    // })
    //   .then(() => {
    //     fetchUsers()
    //   })
    try {
      const result = await axios.patch('http://localhost:3000/users', {
        checkedUsers: usersToBeBlocked,
        blocked: true
      })
      if (result.status === 200) {
        fetchUsers() 
      }

    } catch (err) {
      console.log(err);
      if (err.response.status === 404) {
        alert('There is no such user')
      } else if (err.response.status === 403) {
        alert('You are blocked')
      }
      navigate('/login')
    }
  }

  const handleUnblockButton = async (e) => {
    e.preventDefault()
    const usersToBeUnblocked = users.filter((user, index) => checkedUsers[index]).map(user => user._id)
    try {
      const result = await axios.patch('http://localhost:3000/users', {
        checkedUsers: usersToBeUnblocked,
        blocked: false
      })
      if (result.status === 200) {
        console.log(result);
        fetchUsers()
      }

    } catch (err) {
      console.log(err);
      if (err.response.status === 404) {
        alert('There is no such user')
      } else if (err.response.status === 403) {
        alert('You are blocked')
      }
      navigate('/login')
    }
  }


  return (
    <div className='AdminTable'>
      <h1 className='text-info'>AdminPanel</h1>
      <ButtonGroup aria-label="Basic example">
        <Button onClick={handleBlockButton} variant="warning">Block 🔏</Button>
        <Button onClick={handleUnblockButton} variant="secondary">Unblock 🔓 </Button>
        <Button variant="danger" onClick={handleDeleteButton}>Delete 🗑 </Button>
      </ButtonGroup>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Form.Check onChange={handleSelectAll} checked={selectAll} />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Last login</th>
            <th>Created At</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, index) => {
            return (<UserRow isSelected={checkedUsers[index]} index={index} user={user} handleChange={handleCheckboxChange} key={`row-${index}`} />)
          })}
        </tbody>
      </Table>
    </div>
  )
}
