import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?:string;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className

}) => {
  const baseStyle =
    "rounded font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantStyle: Record<ButtonVariant, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
  };

  const sizeStyle: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={` ${className}
        ${baseStyle}
        ${variantStyle[variant]}
        ${sizeStyle[size]}
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {label}
    </button>
  );
};

export default Button;
