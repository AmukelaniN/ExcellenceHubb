import React, { useState } from 'react';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';
import LoginModal from './components/LoginModal';
import SignUpModal from './components/SignUpModal';
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import StudyPage from "./components/StudyPage";
import AdminDashboard from "./components/AdminDashboard";
import Sidebar from "./components/Sidebar";
import { OpportunityProvider, useOpportunities } from "./OpportunityContext";
import { ManagerDashboard, RecruiterDashboard } from "./components/OpportunityPortals";

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'https://localhost:7142').replace(/\/$/, '');
const AUTH_SESSION_KEY = 'excellencehub-api-session';

async function postAuthRequest(endpoint, body) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/api/Auth/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(`Could not reach the ExcellenceHub API at ${API_BASE_URL}. Start the API and try again.`);
  }

  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    const validationMessages = result.errors ? Object.values(result.errors).flat() : [];
    throw new Error(validationMessages[0] || result.message || result.title || 'The request could not be completed.');
  }
  return result;
}

function workspaceRole(accountType) {
  if (accountType === 'manager') return 'administrator';
  if (accountType === 'employer') return 'employer';
  return 'learner';
}

function readSavedSession() {
  try {
    return JSON.parse(sessionStorage.getItem(AUTH_SESSION_KEY) || 'null');
  } catch {
    return null;
  }
}

function AppRoutes() {
  const navigate = useNavigate();
  const { refreshOpportunities } = useOpportunities();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isAuthChoiceOpen, setIsAuthChoiceOpen] = useState(false);
  const [authRole, setAuthRole] = useState('learner');
  const [session, setSession] = useState(readSavedSession);
  const accountRole = session?.role || 'learner';
  const isLoggedIn = Boolean(session?.user && session?.role);

  const openLogin = (role = 'learner') => { setAuthRole(role); setIsLoginOpen(true); };
  const openSignUp = (role = 'learner') => { setAuthRole(role); setIsSignUpOpen(true); };
  const enterWorkspace = (user) => {
    const role = workspaceRole(user.accountType);
    const nextSession = { role, user };
    sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(nextSession));
    setSession(nextSession);
    refreshOpportunities(role).catch(() => {});
    setIsLoginOpen(false);
    setIsSignUpOpen(false);
    navigate(role === 'employer' ? '/Recruiter' : role === 'administrator' ? '/Admin' : '/Dashboard');
  };
  const handleLogin = async (credentials) => {
    const result = await postAuthRequest('login', credentials);
    enterWorkspace(result.user);
  };
  const handleSignUp = async (requestedRole, profile) => {
    const result = await postAuthRequest('register', {
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phoneNumber: profile.phoneNumber,
      accountType: requestedRole,
      password: profile.password,
      confirmPassword: profile.confirmPassword,
    });
    enterWorkspace(result.user);
  };
  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/Auth/logout`, { method: 'POST', credentials: 'include' });
    } catch {
      // Clear the local view even if the API is temporarily unavailable.
    }
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    setSession(null);
    refreshOpportunities("").catch(() => {});
    navigate('/');
  };
  const openAccessChoice = (role) => { setAuthRole(role); setIsAuthChoiceOpen(true); };

  return (
    <>
      <Header onOpenLogin={() => openLogin('learner')} onOpenSignUp={() => openSignUp('learner')} onOpenLearnerHub={() => openAccessChoice('learner')} onOpenEmployer={() => openAccessChoice('employer')} isLoggedIn={isLoggedIn} accountRole={accountRole} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home onOpenSignUp={() => openSignUp('learner')} onOpenLearnerHub={() => openAccessChoice('learner')} onOpenEmployer={() => openAccessChoice('employer')} />} />
        <Route path="/Dashboard" element={isLoggedIn && accountRole === 'learner' ? <Dashboard currentUser={session.user} /> : <Navigate to="/" replace />} />
        <Route path="/Study" element={isLoggedIn && accountRole === 'learner' ? <StudyPage currentUser={session.user} /> : <Navigate to="/" replace />} />
        <Route path="/Recruiter" element={isLoggedIn && accountRole === 'employer' ? <RecruiterDashboard currentUser={session.user} /> : <Navigate to="/" replace />} />
        <Route path="/Admin" element={isLoggedIn && accountRole === 'administrator' ? <AdminDashboard currentUser={session.user} /> : <Navigate to="/" replace />} />
        <Route path="/Manager" element={isLoggedIn && accountRole === 'administrator' ? <ManagerDashboard /> : <Navigate to="/" replace />} />
        <Route path="/Sidebar" element={isLoggedIn ? <Sidebar /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {isAuthChoiceOpen && <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="access-title">
        <div className="modal auth-choice-modal">
          <div className="modal-header"><h3 id="access-title">{authRole === 'employer' ? 'Welcome to the Employer Portal' : 'Welcome to the Learner Hub'}</h3><button type="button" className="modal-close" onClick={() => setIsAuthChoiceOpen(false)} aria-label="Close">×</button></div>
          <div className="modal-body"><p className="auth-choice-copy">{authRole === 'employer' ? 'Sign in to manage your listings, or create an employer account to start sharing opportunities.' : 'Sign in to continue, or create a learner account to explore study and career opportunities.'}</p><div className="auth-choice-actions"><button type="button" className="btn-primary" onClick={() => { setIsAuthChoiceOpen(false); openLogin(authRole); }}>Sign in</button><button type="button" className="btn-secondary" onClick={() => { setIsAuthChoiceOpen(false); openSignUp(authRole); }}>Create account</button></div></div>
        </div>
      </div>}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} onLogin={handleLogin} accountType={authRole} />
      <SignUpModal isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} onSignUp={handleSignUp} accountType={authRole} />
    </>
  );
}

function App() {
  return <BrowserRouter><OpportunityProvider><AppRoutes /></OpportunityProvider></BrowserRouter>;
}

export default App;



