import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../../components/Button";
import ReservationFormModal from "../../forms/ReservationFormModal";
import DeleteModal from "../../components/DeleteModal";
import TopBar from "../../components/TopBar";

import {
  HomeIcon,
  ClipboardDocumentListIcon,
  BuildingOffice2Icon,
  UsersIcon,
  RectangleStackIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const Reservations: React.FC = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  /* ------------------ FETCH RESERVATIONS ------------------ */
  const fetchReservations = async () => {
    try {
      const res = await axios.get(
        "https://avidturerhotel.onrender.com/api/reservations/pending"
      );
      setReservations(res.data.reservations);
    } catch (err) {
      console.error("Failed to fetch reservations", err);
    }
  };

  /* ------------------ INITIAL + REALTIME POLLING ------------------ */
  useEffect(() => {
    // Initial fetch
    fetchReservations();

    // Poll every 5 seconds
    const interval = setInterval(() => {
      fetchReservations();
    }, 2000);

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  /* ------------------ DELETE ------------------ */
  const handleDelete = async () => {
    if (!reservationToDelete) return;

    try {
      await axios.delete(
        `https://avidturerhotel.onrender.com/api/reservations/${reservationToDelete._id}`
      );
      setShowDelete(false);
      setReservationToDelete(null);
      fetchReservations(); // refresh after delete
    } catch (err) {
      console.error("Failed to delete reservation", err);
    }
  };

  const AdminnavItems = [
    { label: "Dashboard", path: "/dashboard/home", icon: <HomeIcon className="w-5 h-5" /> },
    { label: "Reservations", path: "/dashboard/reservations", icon: <ClipboardDocumentListIcon className="w-5 h-5" /> },
    { label: "Rooms", path: "/dashboard/rooms", icon: <BuildingOffice2Icon className="w-5 h-5" /> },
    { label: "Front Desk", path: "/dashboard/frontdesk", icon: <UsersIcon className="w-5 h-5" /> },
    { label: "Reports", path: "/dashboard/reports", icon: <RectangleStackIcon className="w-5 h-5" /> },
    { label: "Accounts", path: "/dashboard/accounts", icon: <UserGroupIcon className="w-5 h-5" /> },
  ];

  /* ------------------ SEARCH ------------------ */
  const filteredReservations = reservations.filter((r) =>
    (r.guestId?.fullName ?? "").toLowerCase().includes(search.toLowerCase())
  );

  /* ------------------ PAGINATION ------------------ */
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  const paginatedData = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  return (
    <>
      <TopBar navItems={AdminnavItems} />

      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-blue-700">Reservation Records</h1>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search guest name..."
          className="border rounded px-3 py-2 text-sm w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* TABLE */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr className="text-center">
                <th className="p-3">Guest</th>
                <th className="p-3">Email</th>
                <th className="p-3">Room</th>
                <th className="p-3">Check-in</th>
                <th className="p-3">Check-out</th>
                <th className="p-3">Total</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((res) => (
                <tr key={res._id} className="border-t text-center">
                  <td className="p-3">{res.fullName}</td>
                  <td className="p-3">{res.email}</td>
                  <td className="p-3">
                    {res.roomId?.roomType} - #{res.roomId?.roomNumber}
                  </td>
                  <td className="p-3">{res.checkInDate.slice(0, 10)}</td>
                  <td className="p-3">{res.checkOutDate.slice(0, 10)}</td>
                  <td className="p-3 font-semibold text-green-600">
                    ₱{res.totalPrice.toLocaleString()}
                  </td>
                  <td className="p-3">
                    {res.paymentProof ? (
                      <a
                        href={`http://localhost:4000${res.paymentProof}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 underline text-xs"
                      >
                        View Proof
                      </a>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-700 capitalize">
                      {res.status}
                    </span>
                  </td>
                  <td className="p-3 flex gap-2 justify-center">
                    <Button
                      label="View"
                      size="sm"
                      onClick={() => {
                        setSelectedReservation(res);
                        setShowForm(true);
                      }}
                    />

                    {res.status === "pending" && (
                      <Button
                        label="Delete"
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setReservationToDelete(res);
                          setShowDelete(true);
                        }}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            className="px-3 py-1 border rounded"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-white"
              }`}
              onClick={() => goToPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="px-3 py-1 border rounded"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next
          </button>
        </div>

        {/* MODALS */}
        {showForm && (
          <ReservationFormModal
            reservation={selectedReservation}
            onClose={() => setShowForm(false)}
          />
        )}

        {showDelete && reservationToDelete && (
          <DeleteModal
            title="Delete Reservation"
            message="Are you sure you want to delete this reservation?"
            onCancel={() => setShowDelete(false)}
            onConfirm={handleDelete}
          />
        )}
      </div>
    </>
  );
};

export default Reservations;