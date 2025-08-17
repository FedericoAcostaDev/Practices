import React from 'react';

// Define the shape of our props using a TypeScript interface.
interface ButtonProps {
  // A button can have different styles, like 'primary' or 'secondary'.
  variant: 'primary' | 'secondary'; 
  // The text displayed on the button.
  label: string;
  // An optional click handler function.
  onClick?: () => void;
  // A boolean to disable the button.
  disabled?: boolean;
}

// The component itself is a functional component that accepts our defined props.
const Button: React.FC<ButtonProps> = ({ variant, label, onClick, disabled }) => {
  // We can use the variant prop to apply different CSS classes.
  const baseClasses = 'px-4 py-2 rounded font-semibold text-white transition-colors duration-200';
  const variantClasses = variant === 'primary' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-500 hover:bg-gray-600';

  return (
    <button
      className={`${baseClasses} ${variantClasses}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;