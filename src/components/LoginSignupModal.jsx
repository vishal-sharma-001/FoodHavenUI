import React, { useState } from 'react';

const LoginSignupModal = ({ isOpen, onClose }) => {
    const [isLoginMode, setIsLoginMode] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-black"
                    onClick={onClose}
                >
                    ✕
                </button>
                <h2 className="text-xl font-semibold mb-4 text-black">
                    {isLoginMode ? 'Login' : 'Sign Up'}
                </h2>
                <form>
                    {/* Email Input */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-black">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="border p-2 rounded w-full"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-black">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="border p-2 rounded w-full"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-black text-white py-2 px-4 rounded w-full hover:bg-gray-800"
                    >
                        {isLoginMode ? 'Login' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-sm text-center text-gray-600 mt-4">
                    {isLoginMode
                        ? "Don't have an account? "
                        : 'Already have an account? '}
                    <button
                        className="text-blue-600 hover:underline"
                        onClick={() => setIsLoginMode(!isLoginMode)}
                    >
                        {isLoginMode ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
};

export default LoginSignupModal;
