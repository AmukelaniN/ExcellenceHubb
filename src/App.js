import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import LoginModal from './components/LoginModal';
import SignUpModal from './components/SignUpModal';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from './components/About';




function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);
  
  const openSignUp = () => setIsSignUpOpen(true);
  const closeSignUp = () => setIsSignUpOpen(false);

  return (
    <>
      <BrowserRouter>
        {/* Header rendered once at top so it appears on all pages */}
        <Header onOpenLogin={openLogin} onOpenSignUp={openSignUp} />

        <Routes>
          <Route index element={<Home />} />
          
          {/*  <Route path="/Plots" element={<Plots />} /> */}
           <Route path="/about" element={<About/>} />
        </Routes>
      </BrowserRouter>

      <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
      <SignUpModal isOpen={isSignUpOpen} onClose={closeSignUp} />
    </>
  );
}

export default App;
