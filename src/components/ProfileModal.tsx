import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative animate-fadeIn">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          My Profile
        </h2>

        <div className="space-y-3 text-gray-700">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium">{user?.fullName}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{user?.email}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium capitalize">{user?.role}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Assigned Branch</p>
            <p className="font-medium">{user?.assignedBranch || "N/A"}</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
