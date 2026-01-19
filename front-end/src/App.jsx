import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import { LampCeiling } from 'lucide-react';
import Login from './pages/Login' 
 import Homelayout from './layout/Homelayout ';
 import Blogdetails from './pages/Blogdetails';// Ye tumhara home page hai
 import Createblog from './pages/Createblog';
 import Explore from './pages/Explore';
 import Profile from './pages/Profile'; 

function App() {
  return (
    <>
      <Router>
        <Routes>
              <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route element={<Homelayout />}>  

          <Route path="/" element={<Home />} />
          <Route path="blog/:id" element={<Blogdetails />} />
          <Route path="createblog" element={<Createblog />} />
          <Route path ="explore" element={< Explore/>}/>
          <Route path ="profile/:userId" element={< Profile/>}/>

          
          </Route>
          
        </Routes>
      </Router>
    </>
  );
}

export default App;

