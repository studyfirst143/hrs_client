import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import DeleteModal from "../../components/DeleteModal";
import AccountFormModal from "../../forms/AccountFormModal";
import TopBar from "../../components/TopBar";

import {
  HomeIcon,
  ClipboardDocumentListIcon,
  BuildingOffice2Icon,
  UsersIcon,
  RectangleStackIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

/* ✅ INLINE TYPE */
type Account = {
  _id?: string;
  fullName: string;
  username: string;
  email: string;
  role: "admin" | "staff";
  assignedBranch: string;
};

const Accounts: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [search, setSearch] = useState("");

  const AdminnavItems = [
    { label: "Dashboard", path: "/dashboard/home", icon: <HomeIcon className="w-5 h-5" /> },
    { label: "Reservations", path: "/dashboard/reservations", icon: <ClipboardDocumentListIcon className="w-5 h-5" /> },
    { label: "Rooms", path: "/dashboard/rooms", icon: <BuildingOffice2Icon className="w-5 h-5" /> },
    { label: "Front Desk", path: "/dashboard/frontdesk", icon: <UsersIcon className="w-5 h-5" /> },
    { label: "Reports", path: "/dashboard/reports", icon: <RectangleStackIcon className="w-5 h-5" /> },
    { label: "Accounts", path: "/dashboard/accounts", icon: <UserGroupIcon className="w-5 h-5" /> },
  ];

  const fetchAccounts = async () => {
    const res = await fetch("https://avidturerhotel.onrender.com/api/users");
    const data = await res.json();
    setAccounts(data);
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const deleteAccount = async () => {
    if (!selectedAccount?._id) return;

    await fetch(`https://avidturerhotel.onrender.com/users/${selectedAccount._id}`, {
      method: "DELETE",
    });

    setShowDelete(false);
    fetchAccounts();
  };

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.fullName.toLowerCase().includes(search.toLowerCase()) ||
      acc.username.toLowerCase().includes(search.toLowerCase()) ||
      acc.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <TopBar navItems={AdminnavItems} />

      <div className="p-6 space-y-6 mt-15">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">Account Management</h1>
          <Button
            label="Add Account"
            onClick={() => {
              setSelectedAccount(null);
              setShowForm(true);
            }}
          />
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search account..."
          className="border px-3 py-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr className="text-left">
                <th className="p-3">Full Name</th>
                <th className="p-3">Username</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Branch</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredAccounts.map((acc) => (
                <tr
                  key={acc._id}
                  className="border-t hover:bg-gray-50 transition duration-200"
                >
                  <td className="p-3">{acc.fullName}</td>
                  <td className="p-3">{acc.username}</td>
                  <td className="p-3">{acc.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        acc.role === "admin"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {acc.role}
                    </span>
                  </td>
                  <td className="p-3">{acc.assignedBranch}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <Button
                      size="sm"
                      label="Edit"
                      onClick={() => {
                        setSelectedAccount(acc);
                        setShowForm(true);
                      }}
                    />
                    <Button
                      size="sm"
                      variant="danger"
                      label="Delete"
                      onClick={() => {
                        setSelectedAccount(acc);
                        setShowDelete(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
              {filteredAccounts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-3 text-center text-gray-500">
                    No accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Modals */}
        {showForm && (
          <AccountFormModal
            account={selectedAccount}
            onClose={() => setShowForm(false)}
            onSuccess={fetchAccounts}
          />
        )}

        {showDelete && (
          <DeleteModal
            title="Delete Account"
            message="Are you sure you want to delete this account?"
            onCancel={() => setShowDelete(false)}
            onConfirm={deleteAccount}
          />
        )}
      </div>
    </>
  );
};

export default Accounts;