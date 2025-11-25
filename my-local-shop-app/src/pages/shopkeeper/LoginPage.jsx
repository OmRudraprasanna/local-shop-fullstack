import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShopAuth } from '../../context/ShopAuthContext';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { shopLogin } = useShopAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const result = await shopLogin(email, password);

    setIsLoading(false);

    if (result.success) {
      navigate('/shop/dashboard/home');
    } else if (result.isExpired) { 
      // --- NEW: Redirect to Expired Page ---
      navigate('/shop/expired');
    } else {
      setError(result.message);
    }
  };
  
  // ... (Rest of the UI remains exactly the same) ...
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-lg shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Shopkeeper Login</h2>
          <p className="mt-2 text-center text-sm text-gray-600">Welcome back to your dashboard!</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded">{error}</div>}

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineMail className="h-5 w-5 text-gray-400" />
                </div>
                <input id="email-address" name="email" type="email" required className="appearance-none rounded-none relative block w-full pl-10 px-3 py-3 border border-gray-300 rounded-t-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                </div>
                <input id="password" name="password" type="password" required className="appearance-none rounded-none relative block w-full pl-10 px-3 py-3 border border-gray-300 rounded-b-md focus:outline-none focus:ring-violet-500 focus:border-violet-500 sm:text-sm" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="text-sm">
              <Link to="/shop/forgot-password" class="font-medium text-violet-600 hover:text-violet-500">Forgot your password?</Link>
            </div>
          </div>

          <div>
            <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300">
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <p className="text-gray-600">Don't have a shop account? <Link to="/shop/register" className="font-medium text-violet-600 hover:text-violet-500">Register here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;