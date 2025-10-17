import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerSuccess } from '../../redux/slices/userSlice';
import { Building } from '../../components/icons';

// Define form input types directly
type RegisterFormInputs = {
  fullName: string;
  email: string;
  companyName: string;
  role: 'buyer' | 'vendor' | '';
  password: string;
  confirmPassword: string;
};

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormInputs>({
      defaultValues: {
          role: ''
      }
  });
  
  // watch password field to validate confirmPassword
  const password = watch('password');

  const onSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
    setLoading(true);
    setError(null);
    // Mock API call
    setTimeout(() => {
      // In a real app, you would check for existing users, etc.
      console.log('Registering user:', data);
      dispatch(registerSuccess());
      setLoading(false);
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
           <Link to="/" className="mx-auto h-12 w-auto flex items-center justify-center text-3xl font-bold text-gray-900 dark:text-white">
            <Building className="w-10 h-10 text-blue-600" />
            <span className="ml-2">Marketplace</span>
          </Link>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Create your account
          </h2>
           <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
           <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input 
                {...register('fullName', { required: 'Full name is required' })} 
                placeholder="Full Name" 
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
              />
              <p className="text-red-500 text-xs mt-1">{errors.fullName?.message}</p>
            </div>
            <div>
              <input 
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'Invalid email address'
                  }
                })} 
                placeholder="Email address" 
                type="email" 
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
              <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
            </div>
            <div>
              <input 
                {...register('companyName', { required: 'Company name is required' })} 
                placeholder="Company Name" 
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
              />
              <p className="text-red-500 text-xs mt-1">{errors.companyName?.message}</p>
            </div>
             <div>
              <select 
                {...register('role', { required: 'Role is required' })} 
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="">Select your business type</option>
                <option value="buyer">Buyer</option>
                <option value="vendor">Vendor</option>
              </select>
              <p className="text-red-500 text-xs mt-1">{errors.role?.message}</p>
            </div>
            <div>
              <input 
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  }
                })} 
                placeholder="Password" 
                type="password" 
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
              />
              <p className="text-red-500 text-xs mt-1">{errors.password?.message}</p>
            </div>
            <div>
              <input 
                {...register('confirmPassword', {
                  required: 'Confirm password is required',
                  validate: value => value === password || 'Passwords must match'
                })} 
                placeholder="Confirm Password" 
                type="password" 
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" 
              />
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword?.message}</p>
            </div>
          </div>
          
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300">
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;