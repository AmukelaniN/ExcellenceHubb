import React, { useEffect, useState } from 'react';
import './main.css';
import './signup-modal.css';

const emptyForm = { firstName: '', lastName: '', organisation: '', email: '', password: '', confirmPassword: '', phoneNumber: '' };

function SignUpModal({ isOpen, onClose, onSignUp, accountType = 'learner' }) {
  const [formData, setFormData] = useState(emptyForm);
  const [selectedType, setSelectedType] = useState(accountType);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEmployer = selectedType === 'employer';

  useEffect(() => setSelectedType(accountType), [accountType]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Those passwords do not match. Please check and try again.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await onSignUp?.(selectedType, formData);
    } catch (requestError) {
      setError(requestError.message || 'Account creation failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay signup-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="signup-title">
      <div className="modal signup-modal-shell">
        <div className="modal-header signup-modal-header">
          <div className="signup-heading-copy"><span>EXCELLENCEHUB · ACCOUNT SETUP</span><h3 id="signup-title">{isEmployer ? 'Create employer account' : 'Create student account'}</h3></div>
          <button type="button" className="modal-close signup-modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <form className="modal-body signup-form" onSubmit={handleSubmit}>
          <p className="demo-login-note signup-demo-note">Your account is created in ExcellenceHub. Sign in with your email and password after registration.</p>
          <label className="signup-account-type">Account type<select name="accountType" value={selectedType} onChange={(event) => setSelectedType(event.target.value)}><option value="learner">Student / Learner</option><option value="employer">Employer / Recruiter</option></select></label>
          {isEmployer && <label className="signup-organisation">Company or organisation<input type="text" name="organisation" value={formData.organisation} onChange={handleChange} required maxLength="100" placeholder="Company name" autoComplete="organization" /></label>}
          <div className="input-row signup-name-row">
            <label>First name<input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="First name" autoComplete="given-name" /></label>
            <label>Last name<input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Last name" autoComplete="family-name" /></label>
          </div>
          <label className="signup-email">{isEmployer ? 'Work email' : 'Email'}<input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder={isEmployer ? 'you@company.co.za' : 'email@example.com'} autoComplete="email" /></label>
          <label className="signup-phone">Phone number<input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required placeholder="+27 00 000 0000" autoComplete="tel" /></label>
          <div className="signup-password-row">
            <label>Password<div className="password-field"><input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} required minLength="8" autoComplete="new-password" placeholder="At least 8 characters" /><button type="button" className="password-toggle" aria-pressed={showPassword} aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword((show) => !show)}>{showPassword ? 'Hide' : 'Show'}</button></div></label>
            <label>Confirm password<div className="password-field"><input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required minLength="8" autoComplete="new-password" placeholder="Re-enter password" /><button type="button" className="password-toggle" aria-pressed={showConfirm} aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'} onClick={() => setShowConfirm((show) => !show)}>{showConfirm ? 'Hide' : 'Show'}</button></div></label>
          </div>
          {error && <p role="alert" className="signup-error">{error}</p>}
          <div className="modal-footer signup-actions"><button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button><button type="submit" className="btn-primary" disabled={isSubmitting}>{isSubmitting ? 'Creating account…' : `Continue to ${isEmployer ? 'employer' : 'learner'} dashboard`}</button></div>
        </form>
      </div>
    </div>
  );
}

export default SignUpModal;
