// src/features/auth/components/RegistrationForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Check, X, User, Mail, Phone, Briefcase, Shield, Award } from 'lucide-react';
import { useRegisterMutation } from '../services/authApi';

// Validation schema - Fixed without TypeScript syntax
const registrationSchema = z.object({
  fullName: z.string().min(3, 'Full name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  employeeId: z.string().min(3, 'Employee ID is required'),
  role: z.enum(['technician', 'inventory', 'sales', 'manager'], {
    required_error: 'Please select a role',
  }),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  specialization: z.string().optional(),
  certifications: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const RegistrationForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      role: 'technician',
      termsAccepted: false,
    },
  });

  const selectedRole = watch('role');
  const password = watch('password');

  // Calculate password strength
  const checkPasswordStrength = (pass) => {
    let strength = 0;
    if (pass?.length >= 8) strength++;
    if (pass?.match(/[A-Z]/)) strength++;
    if (pass?.match(/[0-9]/)) strength++;
    if (pass?.match(/[^A-Za-z0-9]/)) strength++;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-yellow-500';
    if (passwordStrength <= 3) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 2) return 'Fair';
    if (passwordStrength <= 3) return 'Good';
    return 'Strong';
  };

  const onSubmit = async (data) => {
    try {
      await registerUser({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        employeeId: data.employeeId,
        role: data.role,
        password: data.password,
        specialization: data.specialization || '',
        certifications: data.certifications || ''
      }).unwrap();
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error?.data?.message || error?.data?.detail || 'Registration failed');
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      technician: 'bg-green-100 text-green-800 border-green-200',
      inventory: 'bg-blue-100 text-blue-800 border-blue-200',
      sales: 'bg-purple-100 text-purple-800 border-purple-200',
      manager: 'bg-orange-100 text-orange-800 border-orange-200'
    };
    return colors[role];
  };

  const getRoleTitle = (role) => {
    const titles = {
      technician: 'Repair Technician',
      inventory: 'Inventory Manager',
      sales: 'Sales Staff',
      manager: 'Operations Manager'
    };
    return titles[role];
  };

  const getRoleDescription = (role) => {
    const descriptions = {
      technician: 'Perform diagnostics, repairs, and maintenance',
      inventory: 'Manage stock, suppliers, and purchase orders',
      sales: 'Handle sales, customers, and POS transactions',
      manager: 'Oversee operations, reports, and team management'
    };
    return descriptions[role];
  };

  const getRoleIcon = (role) => {
    const icons = {
      technician: <Award className="w-5 h-5" />,
      inventory: <Briefcase className="w-5 h-5" />,
      sales: <User className="w-5 h-5" />,
      manager: <Shield className="w-5 h-5" />
    };
    return icons[role];
  };

  const roles = ['technician', 'inventory', 'sales', 'manager'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <User className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
            <p className="text-gray-600 mt-1">Join SmartFix AI-Powered Support System</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Personal Information Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="w-5 h-5 mr-2 text-blue-600" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register('fullName')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    {...register('email')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    {...register('phone')}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+1234567890"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Employee ID *
                </label>
                <input
                  type="text"
                  {...register('employeeId')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="EMP001"
                />
                {errors.employeeId && (
                  <p className="text-red-500 text-xs mt-1">{errors.employeeId.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Role Selection Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Briefcase className="w-5 h-5 mr-2 text-blue-600" />
              Select Your Role *
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <label
                  key={role}
                  className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${
                    selectedRole === role
                      ? getRoleColor(role)
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <input
                      type="radio"
                      value={role}
                      {...register('role')}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(role)}
                        <p className="font-medium">{getRoleTitle(role)}</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {getRoleDescription(role)}
                      </p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
            {errors.role && (
              <p className="text-red-500 text-xs mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Role-Specific Fields */}
          {selectedRole === 'technician' && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              <h3 className="font-medium text-gray-900">Technician Information</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialization *
                </label>
                <select
                  {...register('specialization')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select specialization</option>
                  <option value="Laptop Repair">Laptop Repair</option>
                  <option value="Desktop Repair">Desktop Repair</option>
                  <option value="Smartphone Repair">Smartphone Repair</option>
                  <option value="Component Level">Component Level</option>
                  <option value="Data Recovery">Data Recovery</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certifications (comma-separated)
                </label>
                <input
                  type="text"
                  {...register('certifications')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="CompTIA A+, Apple Certified, etc."
                />
              </div>
            </div>
          )}

          {/* Password Section */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    onChange={(e) => {
                      register('password').onChange(e);
                      checkPasswordStrength(e.target.value);
                    }}
                    className="w-full pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex space-x-1">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 w-8 rounded-full ${
                              level <= passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-600">{getPasswordStrengthText()}</span>
                    </div>
                    <div className="space-y-1 text-xs text-gray-500">
                      <p className={password?.length >= 8 ? 'text-green-600' : ''}>
                        {password?.length >= 8 ? <Check className="w-3 h-3 inline" /> : <X className="w-3 h-3 inline" />}
                        {' '}At least 8 characters
                      </p>
                      <p className={password?.match(/[A-Z]/) ? 'text-green-600' : ''}>
                        {password?.match(/[A-Z]/) ? <Check className="w-3 h-3 inline" /> : <X className="w-3 h-3 inline" />}
                        {' '}At least one uppercase letter
                      </p>
                      <p className={password?.match(/[0-9]/) ? 'text-green-600' : ''}>
                        {password?.match(/[0-9]/) ? <Check className="w-3 h-3 inline" /> : <X className="w-3 h-3 inline" />}
                        {' '}At least one number
                      </p>
                    </div>
                  </div>
                )}
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword')}
                    className="w-full pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              {...register('termsAccepted')}
              className="mt-1"
            />
            <label className="text-sm text-gray-700">
              I accept the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and 
              {' '}<a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
            </label>
          </div>
          {errors.termsAccepted && (
            <p className="text-red-500 text-xs">{errors.termsAccepted.message}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Sign in here
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};