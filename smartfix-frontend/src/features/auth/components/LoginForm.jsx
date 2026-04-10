// src/features/auth/components/LoginForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../services/authApi';
import { setCredentials } from '../../../store/slices/authSlice';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

export const LoginForm = () => {
  const [showMfa, setShowMfa] = useState(false);
  const [mfaCode, setMfaCode] = useState('');
  const [tempUser, setTempUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Quick login function for demo purposes
  const quickLogin = (email, password) => {
    setValue('email', email);
    setValue('password', password);
    handleSubmit(onSubmit)();
  };

  const onSubmit = async (data) => {
    try {
      const result = await login(data).unwrap();
      if (result.requiresMfa) {
        setTempUser(result.user);
        setShowMfa(true);
        toast.success('Please enter MFA code');
      } else {
        dispatch(setCredentials({ user: result.user, token: result.token }));
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        toast.success(`Welcome back, ${result.user.fullName}!`);
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error?.data?.message || error?.data?.detail || 'Invalid credentials');
    }
  };

  const handleMfaSubmit = async () => {
    if (mfaCode === '123456') {
      dispatch(setCredentials({ user: tempUser, token: 'mfa-token' }));
      localStorage.setItem('token', 'mfa-token');
      localStorage.setItem('user', JSON.stringify(tempUser));
      toast.success('MFA verified successfully!');
      navigate('/dashboard');
    } else {
      toast.error('Invalid MFA code. Use 123456 for demo.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 7h14M5 17h14M5 7v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">SmartFix</h1>
          <p className="text-gray-600 mt-2">AI-Powered Device Management System</p>
        </div>

        {!showMfa ? (
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  {...register('email')}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="technician@smartfix.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  {...register('password')}
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="••••••"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" {...register('rememberMe')} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo Accounts Section */}
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Demo Accounts</span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 gap-2">
                <button
                  onClick={() => quickLogin('admin@smartfix.com', 'admin123')}
                  className="text-left px-4 py-2 bg-purple-50 hover:bg-purple-100 rounded-lg transition flex items-center justify-between group"
                >
                  <div>
                    <div className="font-medium text-purple-900">Administrator</div>
                    <div className="text-xs text-purple-600">admin@smartfix.com</div>
                  </div>
                  <div className="text-purple-400 group-hover:text-purple-600">→</div>
                </button>
                
                <button
                  onClick={() => quickLogin('technician@smartfix.com', 'tech123')}
                  className="text-left px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg transition flex items-center justify-between group"
                >
                  <div>
                    <div className="font-medium text-green-900">Technician</div>
                    <div className="text-xs text-green-600">technician@smartfix.com</div>
                  </div>
                  <div className="text-green-400 group-hover:text-green-600">→</div>
                </button>
                
                <button
                  onClick={() => quickLogin('manager@smartfix.com', 'manager123')}
                  className="text-left px-4 py-2 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition flex items-center justify-between group"
                >
                  <div>
                    <div className="font-medium text-yellow-900">Manager</div>
                    <div className="text-xs text-yellow-600">manager@smartfix.com</div>
                  </div>
                  <div className="text-yellow-400 group-hover:text-yellow-600">→</div>
                </button>
                
                <button
                  onClick={() => quickLogin('inventory@smartfix.com', 'inv123')}
                  className="text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg transition flex items-center justify-between group"
                >
                  <div>
                    <div className="font-medium text-blue-900">Inventory Manager</div>
                    <div className="text-xs text-blue-600">inventory@smartfix.com</div>
                  </div>
                  <div className="text-blue-400 group-hover:text-blue-600">→</div>
                </button>
                
                <button
                  onClick={() => quickLogin('sales@smartfix.com', 'sales123')}
                  className="text-left px-4 py-2 bg-pink-50 hover:bg-pink-100 rounded-lg transition flex items-center justify-between group"
                >
                  <div>
                    <div className="font-medium text-pink-900">Sales Staff</div>
                    <div className="text-xs text-pink-600">sales@smartfix.com</div>
                  </div>
                  <div className="text-pink-400 group-hover:text-pink-600">→</div>
                </button>
              </div>
              
              <p className="text-xs text-center text-gray-500 mt-4">
                Click any demo account to login instantly
              </p>
            </div>

            <div className="mt-6 text-center text-sm text-gray-600">
              <a href="/register" className="text-blue-600 hover:underline">
                Create new account
              </a>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-500 mt-1">Enter the verification code from your authenticator app</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={mfaCode}
                onChange={(e) => setMfaCode(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="000000"
                autoFocus
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Demo code: <span className="font-mono font-bold">123456</span>
              </p>
            </div>
            
            <button
              onClick={handleMfaSubmit}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-medium"
            >
              Verify & Continue
            </button>
            
            <button
              onClick={() => setShowMfa(false)}
              className="w-full text-gray-600 py-2 rounded-lg hover:bg-gray-50 transition text-sm"
            >
              Back to login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};