import React, { useEffect, useState } from "react";
import Button from "../../components/Button";
import DeleteModal from "../../components/DeleteModal";
import RoomFormModal from "../../forms/RoomFormModal";
import TopBar from "../../components/TopBar";
import type{ Room } from "../../types/room";

import {
  HomeIcon,
  ClipboardDocumentListIcon,
  BuildingOffice2Icon,
  UsersIcon,
  RectangleStackIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
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

  const fetchRooms = async () => {
    const res = await fetch("https://avidturerhotel.onrender.com/api/rooms");
    const data = await res.json();
    setRooms(data);
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const deleteRoom = async () => {
    if (!selectedRoom?._id) return;

    await fetch(`https://avidturerhotel.onrender.com/api/rooms/${selectedRoom._id}`, {
      method: "DELETE",
    });

    setShowDelete(false);
    fetchRooms();
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      room.roomType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <TopBar navItems={AdminnavItems} />

      <div className="p-6 space-y-6 mt-15">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-700">Room Management</h1>
          <Button
            label="Add Room"
            onClick={() => {
              setSelectedRoom(null);
              setShowForm(true);
            }}
          />
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search room..."
          className="border px-3 py-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Room</th>
                <th className="p-3">Type</th>
                <th className="p-3">Capacity</th>
                <th className="p-3">Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredRooms.map((room) => (
                <tr key={room._id} className="border-t text-center">
                  <td className="p-3 ">{room.roomNumber}</td>
                  <td className="p-3">{room.roomType}</td>
                  <td className="p-3">{room.capacity}</td>
                  <td className="p-3">₱{room.pricePerNight}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                      {room.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    <Button
                      size="sm"
                      label="Edit"
                      onClick={() => {
                        setSelectedRoom(room);
                        setShowForm(true);
                      }}
                    />
                    <Button
                      size="sm"
                      variant="danger"
                      label="Delete"
                      onClick={() => {
                        setSelectedRoom(room);
                        setShowDelete(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modals */}
        {showForm && (
          <RoomFormModal
            room={selectedRoom}
            onClose={() => setShowForm(false)}
            onSuccess={fetchRooms}
          />
        )}

        {showDelete && (
          <DeleteModal
            title="Delete Room"
            message="Are you sure you want to delete this room?"
            onCancel={() => setShowDelete(false)}
            onConfirm={deleteRoom}
          />
        )}
      </div>
    </>
  );
};

export default Rooms;
