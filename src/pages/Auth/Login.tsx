import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { useStore } from '../../store/useStore';
import { Zap, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

const USE_FIREBASE_BACKEND = true; // This should match the constant in useStore.ts

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { 
    setCurrentUser, 
    academies, 
    setActiveAcademy, 
    signIn, 
    isLoading, 
    authError,
    currentUser 
  } = useStore();
  
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError('');

    if (!email || !password) {
      setLocalError('Please enter both email and password');
      return;
    }

    try {
      if (USE_FIREBASE_BACKEND) {
        // Firebase authentication
        await signIn(email, password);
        
        // Set active academy to first available after successful login
        if (academies.length > 0) {
          setActiveAcademy(academies[0].id);
        }
        
        // Navigation will happen automatically via useEffect when currentUser is set
      } else {
        // Mock authentication (existing logic)
        const mockUser = {
          id: 'user-1',
          name: 'Admin User',
          email: 'admin@academypro.com',
          role: 'admin' as const,
          permissions: ['all'],
          academyIds: academies.map(a => a.id)
        };

        setCurrentUser(mockUser);
        
        // Set active academy to first available
        if (academies.length > 0) {
          setActiveAcademy(academies[0].id);
        }

        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setLocalError(error.message || 'Login failed. Please try again.');
    }
  };

  // Get the appropriate error message
  const errorMessage = localError || authError;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
            AcademyPro
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Sign in to your academy management system
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Error Message */}
            {errorMessage && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                  <p className="text-sm text-red-700 dark:text-red-200">
                    {errorMessage}
                  </p>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={USE_FIREBASE_BACKEND ? "Enter your email" : "admin@academypro.com"}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={USE_FIREBASE_BACKEND ? "Enter your password" : "password123"}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Remember me
                </span>
              </label>
              {USE_FIREBASE_BACKEND && (
                <button
                  type="button"
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
                  disabled={isLoading}
                >
                  Forgot password?
                </button>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Demo Credentials - Only show in mockup mode */}
          {!USE_FIREBASE_BACKEND && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                Demo Credentials
              </h4>
              <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <p><strong>Email:</strong> admin@academypro.com</p>
                <p><strong>Password:</strong> password123</p>
              </div>
            </div>
          )}

          {/* Firebase Mode Instructions */}
          {USE_FIREBASE_BACKEND && (
            <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <h4 className="text-sm font-medium text-amber-900 dark:text-amber-200 mb-2">
                Firebase Authentication
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Please use your Firebase account credentials to sign in.
              </p>
            </div>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © 2024 AcademyPro. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};