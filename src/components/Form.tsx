import React from "react";

interface FormProps {
  title?: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  children?: React.ReactNode;
  FormName?: string;
  className?:string;
}

const Form: React.FC<FormProps> = ({ title, onSubmit, children, FormName, className }) => {

    const basestyles = "bg-white p-6 rounded-lg space-y-4";
  return (
    <form
      onSubmit={onSubmit}
      className={`${basestyles} ${className}`}
    >
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      {children}
    </form>
  );
};

export default Form;
