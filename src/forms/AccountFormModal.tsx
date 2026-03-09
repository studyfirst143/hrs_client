import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";

/* ✅ INLINE TYPE */
type Account = {
  _id?: string;
  fullName: string;
  username: string;
  email: string;
  password?: string;
  role: "admin" | "staff";
  assignedBranch: string;
};

type Props = {
  account: Account | null;
  onClose: () => void;
  onSuccess: () => void;
};

const roles = [
  { label: "Admin", value: "admin" },
  { label: "Staff", value: "staff" },
];

const AccountFormModal: React.FC<Props> = ({ account, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<Account>({
    fullName: account?.fullName || "",
    username: account?.username || "",
    email: account?.email || "",
    password: "",
    role: account?.role || "staff",
    assignedBranch: account?.assignedBranch || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = account?._id
      ? `https://avidturerhotel.onrender.com/api/users/${account._id}`
      : "https://avidturerhotel.onrender.com/api/users/register";

    const method = account?._id ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold text-blue-700">
          {account ? "Edit Account" : "Add Account"}
        </h2>

        <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
        <Input label="Username" name="username" value={formData.username} onChange={handleChange} />
        <Input label="Email" name="email" value={formData.email} onChange={handleChange} />

        {!account && (
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        )}

        <Input
          label="Assigned Branch"
          name="assignedBranch"
          value={formData.assignedBranch}
          onChange={handleChange}
        />

        <Select
          label="Role"
          name="role"
          value={formData.role}
          options={roles}
          onChange={handleChange}
        />

        <div className="flex justify-end gap-2">
          <Button type="button" label="Cancel" variant="secondary" onClick={onClose} />
          <Button type="submit" label="Save" />
        </div>
      </form>
    </div>
  );
};

export default AccountFormModal;
