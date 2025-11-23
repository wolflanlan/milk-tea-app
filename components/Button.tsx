import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-milk-600 text-white hover:bg-milk-700 active:bg-milk-800 focus:ring-milk-500",
    secondary: "bg-milk-200 text-milk-900 hover:bg-milk-300 active:bg-milk-400 focus:ring-milk-400",
    danger: "bg-red-100 text-red-600 hover:bg-red-200 active:bg-red-300 focus:ring-red-500",
    ghost: "bg-transparent text-milk-700 hover:bg-milk-100 focus:ring-milk-300",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-11 px-5 text-base",
    lg: "h-14 px-8 text-lg",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;