import React from "react";

interface InputProps {
  label?: string;
  name?: string;
  type?: "text" | "email" | "password" | "number" | "date" | "file";
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?:boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  required = false,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>

      <input
      required = {required}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`border rounded px-3 py-2 text-sm
          ${error ? "border-red-500" : "border-gray-300"}
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
        `}
      />

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Input;
