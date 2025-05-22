import { useEffect, useState } from 'react';
import InputField from '../components/InputField';
import Alert from '../components/Alert';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAPI } from '../hooks/useAPI';

export default function ResetPassword() {
  const [formData, setFormData] = useState({
    token: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [alert, setAlert] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [email, setEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const { verifyResetToken, resetPassword } = useAPI();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setFormData(prev => ({ ...prev, token }));
      verifyToken(token);
    } else {
      setVerifying(false);
      setAlert({ type: 'error', message: 'No token provided in URL.' });
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const result = await verifyResetToken(token);
      setEmail(result.email);
      setTokenValid(true);
      setAlert({ type: 'success', message: 'Token is valid. You can reset your password.' });
    } catch (err) {
      setTokenValid(false);
      setAlert({ type: 'error', message: err.message });
    } finally {
      setVerifying(false);
    }
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.newPassword || formData.newPassword.length < 6)
      errs.newPassword = 'Password must be at least 6 characters';
    if (formData.newPassword !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result = await resetPassword(formData.token, formData.newPassword);
      setResetSuccess(true);
      setAlert({ type: 'success', message: 'Password updated successfully. You may now log in.' });

      // ✅ Auto-close window after short delay
      setTimeout(() => {
        window.close(); // Will close the tab/window (only works if opened via script)
      }, 2500);
    } catch (err) {
      setAlert({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="glass-effect rounded-2xl p-8 shadow-2xl max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-white text-center mb-4">Reset Password</h2>

      {alert && <Alert {...alert} onClose={() => setAlert(null)} />}

      {verifying ? (
        <div className="flex justify-center mt-6"><LoadingSpinner /></div>
      ) : resetSuccess ? (
        <div className="text-center text-green-300 mt-6">
          Your password has been successfully updated. This window will now close.
        </div>
      ) : tokenValid ? (
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <InputField
            label="New Password"
            type="password"
            value={formData.newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
            placeholder="Enter new password"
            error={errors.newPassword}
            required
            icon="🔒"
          />
          <InputField
            label="Confirm Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            placeholder="Confirm new password"
            error={errors.confirmPassword}
            required
            icon="🔒"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary text-white font-semibold py-3 px-6 rounded-xl flex justify-center"
          >
            {loading ? <LoadingSpinner /> : 'Reset Password'}
          </button>
        </form>
      ) : (
        <p className="text-center text-red-300 mt-6">The token is invalid or expired.</p>
      )}
    </div>
  );
}
