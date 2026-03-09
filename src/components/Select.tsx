import React from "react";

type Option = {
  label: string;
  value: string | number;
};

interface SelectProps {
  label: string;
  name?: string;
  value: string | number;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  disabled?: boolean;
}

const Select: React.FC<SelectProps> = ({
  label,
  name,
  value,
  options,
  onChange,
  error,
  disabled = false,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`border rounded px-3 py-2 text-sm
          ${error ? "border-red-500" : "border-gray-300"}
          ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
        `}
      >
        <option value="">Select option</option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Select;
