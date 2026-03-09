import React, { useState } from "react";
import Form from "../components/Form";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import type { Room } from "../types/room";

interface Props {
  room?: Room | null;
  onClose: () => void;
  onSuccess: () => void;
}

const RoomFormModal: React.FC<Props> = ({ room, onClose, onSuccess }) => {
  const isEdit = Boolean(room);

  const [form, setForm] = useState({
    roomNumber: room?.roomNumber || "",
    roomType: room?.roomType || "",
    capacity: room?.capacity || 1,
    pricePerNight: room?.pricePerNight || 0,
    status: room?.status || "available",
  });

  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value.toString())
    );
    if (image) formData.append("image", image);

    const url = isEdit
      ? `https://avidturerhotel.onrender.com/api/rooms/${room?._id}`
      : `https://avidturerhotel.onrender.com/api/rooms`;

    const method = isEdit ? "PUT" : "POST";

    await fetch(url, {
      method,
      body: formData,
    });

    setLoading(false);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-bold">
            {isEdit ? "Update Room" : "Add Room"}
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        <Form onSubmit={handleSubmit}>
          <Input label="Room Number" name="roomNumber" value={form.roomNumber} onChange={handleChange} />
          <Input label="Room Type" name="roomType" value={form.roomType} onChange={handleChange} />
          <Input label="Capacity" type="number" name="capacity" value={form.capacity} onChange={handleChange} />
          <Input label="Price Per Night" type="number" name="pricePerNight" value={form.pricePerNight} onChange={handleChange} />

          <Select
            label="Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={[
              { label: "Available", value: "available" },
              { label: "Occupied", value: "occupied" },
              { label: "Maintenance", value: "maintenance" },
            ]}
          />

          <Input
            label="Room Image"
            type="file"
            name="image"
            onChange={(e: any) => setImage(e.target.files[0])}
          />

          <Button
            type="submit"
            label={isEdit ? "Update" : "Submit"}
            className="w-full mt-4"
            disabled={loading}
          />
        </Form>
      </div>
    </div>
  );
};

export default RoomFormModal;
