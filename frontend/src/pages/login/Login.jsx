import { useState } from 'react';
import { login } from '../../http/api';
import { userAuthStore } from '../../store';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { setUser } = userAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = useMutation({
    mutationFn: (credentials) => login(credentials).then(res => res.data),
    onSuccess: (data) => {
      setUser(data.user || data);
      navigate('/');
    },
    onError: (err) => {
      const msg = err?.response?.data?.message || err.message || 'Login failed';
      alert(msg);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser.mutate({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
      <div className="card w-full max-w-md shadow-md bg-base-100">
        <div className="card-body">
          <h2 className="card-title">Sign in</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label"><span className="label-text">Email</span></label>
              <input type="email" className="input input-bordered w-full" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
              <label className="label"><span className="label-text">Password</span></label>
              <input type="password" className="input input-bordered w-full" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="btn btn-primary" disabled={loginUser.isLoading}>
                {loginUser.isLoading ? 'Signing...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
