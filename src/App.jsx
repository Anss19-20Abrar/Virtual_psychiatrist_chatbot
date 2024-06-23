import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Intro from './components/Intro';
import ChatApp from './components/ChatApp';
import ContactUs from './components/ContactUs';
import About from './components/About';
import { auth } from './firebase';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUserUID, setCurrentUserUID] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // console.log('Auth state changed:', user);
      if (user) {
        setUser(user);
        setCurrentUserUID(user.uid); // Ensure currentUserUID is set
      } else {
        setUser(null);
        setCurrentUserUID(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className='center'>Loading...</div>;
  }

  const PrivateRoute = ({ element }) => {
    // console.log('PrivateRoute user:', user);
    return user ? element : <Navigate to="/signin" />;
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/signup" element={<SignUp setCurrentUserUID={setCurrentUserUID} />} />
          <Route path="/signin" element={<SignIn setCurrentUserUID={setCurrentUserUID} />} />

          <Route
            path="/chatapp"
            element={
              <PrivateRoute element={<ChatApp currentUserUID={currentUserUID} />} />
            }
          />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
