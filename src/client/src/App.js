
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Register from './components/register';
import Login from './components/login';
import { Routes } from 'react-router-dom';
import AdminPanel from './components/adminpanel';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const user = localStorage.getItem('user');
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' exact element={
            <ProtectedRoute user={user} >
              <AdminPanel />
              
            </ProtectedRoute>
          } />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
