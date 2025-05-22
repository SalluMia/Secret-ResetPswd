const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const useAPI = () => {
  const verifyResetToken = async (token) => {
    console.log('token hit')
    const res = await fetch(`${API_BASE_URL}/auth/verify-reset-token/${token}`);
    console.log('reset-token-response', res)
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Token verification failed');
    return data;
  };

  const resetPassword = async (token, newPassword) => {
    const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Password reset failed');
    return data;
  };
  return { verifyResetToken, resetPassword };
};
