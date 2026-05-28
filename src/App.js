import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import LoginModal from './components/LoginModal';
import SignUpModal from './components/SignUpModal';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import About from "./components/About";
import Sidebar from "./components/Sidebar";



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
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path= "/About" element={<About/>}/>
          <Route path="/Sidebar" element={<Sidebar/>} />

        </Routes>
      </BrowserRouter>

      <LoginModal isOpen={isLoginOpen} onClose={closeLogin} />
      <SignUpModal isOpen={isSignUpOpen} onClose={closeSignUp} />
    </>
  );
}

export default App;
