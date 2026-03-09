import React from "react";
import Button from "./Button";

interface Props {
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteModal: React.FC<Props> = ({
  title,
  message,
  onCancel,
  onConfirm,
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6 space-y-4">
        <h2 className="text-lg font-semibold text-red-600">{title}</h2>
        <p className="text-sm text-gray-600">{message}</p>

        <div className="flex justify-end gap-2">
          <Button label="Cancel" onClick={onCancel} />
          <Button label="Delete" variant="danger" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
