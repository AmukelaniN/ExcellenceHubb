import React, { useState } from 'react';
import './main.css';

function LoginModal({ isOpen, onClose, onLogin, accountType = 'learner' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEmployer = accountType === 'employer';
  if (!isOpen) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await onLogin?.({ email: email.trim(), password });
    } catch (requestError) {
      setError(requestError.message || 'Sign in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="login-title">
      <div className="modal">
        <div className="modal-header"><h3 id="login-title">{isEmployer ? 'Employer sign in' : 'Sign in'}</h3><button type="button" className="modal-close" onClick={onClose} aria-label="Close">×</button></div>
        <form className="modal-body" onSubmit={handleSubmit}>
          <p className="demo-login-note">Sign in with the email and password you used to register. Your account type determines which dashboard opens.</p>
          <label>{isEmployer ? 'Work email' : 'Email'}<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder={isEmployer ? 'you@company.co.za' : 'email@example.com'} autoComplete="email" /></label>
          <label>Password<div className="password-field"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required placeholder="••••••••" autoComplete="current-password" /><button type="button" className="password-toggle" aria-pressed={showPassword} aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((show) => !show)}>{showPassword ? 'Hide' : 'Show'}</button></div></label>
          {error && <p className="auth-form-error" role="alert">{error}</p>}
          <div className="modal-footer"><button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button><button type="submit" className="btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Signing in…' : 'Sign in'}</button></div>
        </form>
      </div>
    </div>
  );
}

export default LoginModal;
