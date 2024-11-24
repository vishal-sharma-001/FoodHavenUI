import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { FOODHAVEN_API } from '../utils/constants';
import { setAuthUser } from '../utils/userSlice';
import { useDispatch } from 'react-redux';

const Signup = ({ isOpen, onClose }) => {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState(null);
  const modalRef = useRef(null);
  
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOnClick = async (e) => {
    const url = isSignup ? `${FOODHAVEN_API}/public/user/signup` : `${FOODHAVEN_API}/public/user/login`;
    const payload = isSignup 
      ? { name: formData.name, email: formData.email, phone: formData.phone, password: formData.password }
      : { email: formData.email, password: formData.password };
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      
      const data = await response.json();
      if (response.ok) {  
        dispatch(setAuthUser(data))
        console.log('Success:', data);
        onClose();  
      } else {
        console.error('Error:', data);
        setError(data || 'An unknown error occurred');
      }
    } catch (error) {
      console.error('Request failed:', error);
      setError('Failed to connect to the server');
    }
  };

  const formFields = [
    { label: 'Name', type: 'text', name: 'name', placeholder: 'Enter your name', show: isSignup },
    { label: 'Email', type: 'email', name: 'email', placeholder: 'Enter your email' },
    { label: 'Phone Number', type: 'tel', name: 'phone', placeholder: 'Enter your phone number', show: isSignup },
    { label: 'Password', type: 'password', name: 'password', placeholder: 'Enter your password' }
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <motion.div
        ref={modalRef}
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? '0%' : '100%' }}
        transition={{ duration: 0.3 }}
        className="fixed right-0 top-0 bottom-0 bg-white w-full sm:w-96 p-8 shadow-lg overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <IoClose size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{isSignup ? 'Sign Up' : 'Log In'}</h2>
        <form onSubmit={(e)=>e.preventDefault()} className="space-y-4">
          {formFields.map(({ label, type, name, placeholder, show = true }) =>
            show && (
              <div key={name}>
                <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
                <input
                  type={type} id={name} name={name} value={formData[name]} onChange={handleChange}
                  required className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 bg-gray-100 text-gray-700"
                  placeholder={placeholder}
                />
              </div>
            )
          )}
          <button
            className="w-full bg-gray-800 text-white py-3 rounded-md hover:bg-gray-900 transition"
            onClick={handleOnClick}
          >
            {isSignup ? 'Sign Up' : 'Log In'}
          </button>
          {error && (
            <p className="text-sm text-red-500 mt-2 text-center">
              {error}
            </p>
          )}
        </form>
        <p className="text-sm text-gray-600 mt-4 text-center">
          {isSignup ? (
            <>
              Already have an account?{' '}
              <button onClick={() => setIsSignup(false)} className="text-gray-800 hover:underline">Log in</button>
            </>
          ) : (
            <>
              Don't have an account?{' '}
              <button onClick={() => setIsSignup(true)} className="text-gray-800 hover:underline">Create one</button>
            </>
          )}
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
