import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "../../components/Button";
import TopBar from "../../components/TopBar";

import {
  HomeIcon,
  ClipboardDocumentListIcon,
  BuildingOffice2Icon,
  UsersIcon,
  RectangleStackIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const FrontDesk: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  /* ------------------ Fetch Checked-in Records ------------------ */
  const fetchCheckedInRecords = async () => {
    try {
      const res = await axios.get("https://avidturerhotel.onrender.com/api/reservations/checkedin");
      setRecords(res.data.records);
    } catch (error) {
      console.error("Failed to fetch checked-in reservations", error);
    }
  };

  /* ------------------ Real-time Polling ------------------ */
  useEffect(() => {
    fetchCheckedInRecords(); // Initial fetch

    const interval = setInterval(() => {
      fetchCheckedInRecords();
    }, 2000); // every 2 seconds

    return () => clearInterval(interval); // cleanup
  }, []);

  /* ------------------ Checkout ------------------ */
  const handleCheckout = async (record: any) => {
    const checkOutDate = new Date(record.checkOutDate);
    const today = new Date();
    checkOutDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (today < checkOutDate) {
      Swal.fire({
        icon: "error",
        title: "Cannot Checkout",
        text: `Guest cannot be checked out yet. Check-out date is ${record.checkOutDate.slice(0, 10)}.`,
      });
      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "Checkout Guest",
      text: `Are you sure you want to checkout ${record.fullName}?`,
      showCancelButton: true,
      confirmButtonText: "Yes, checkout",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await axios.put(`https://avidturerhotel.onrender.com/api/reservations/checkout/${record._id}`);
      await Swal.fire({
        icon: "success",
        title: "Checked Out",
        text: `${record.fullName} has been checked out successfully.`,
      });
      fetchCheckedInRecords(); // immediate refresh after checkout
    } catch (error) {
      console.error("Checkout failed", error);
      Swal.fire({
        icon: "error",
        title: "Checkout Failed",
        text: "Failed to checkout guest.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ Search & Pagination ------------------ */
  const filteredRecords = records.filter((r) =>
    (r.fullName ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedData = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ------------------ Topbar Items ------------------ */
  const AdminnavItems = [
    { label: "Dashboard", path: "/dashboard/home", icon: <HomeIcon className="w-5 h-5" /> },
    { label: "Reservations", path: "/dashboard/reservations", icon: <ClipboardDocumentListIcon className="w-5 h-5" /> },
    { label: "Rooms", path: "/dashboard/rooms", icon: <BuildingOffice2Icon className="w-5 h-5" /> },
    { label: "Front Desk", path: "/dashboard/frontdesk", icon: <UsersIcon className="w-5 h-5" /> },
    { label: "Reports", path: "/dashboard/reports", icon: <RectangleStackIcon className="w-5 h-5" /> },
    { label: "Accounts", path: "/dashboard/accounts", icon: <UserGroupIcon className="w-5 h-5" /> },
  ];

  return (
    <>
      <TopBar navItems={AdminnavItems} />

      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-blue-700">Front Desk - Checked In Guests</h1>

        {/* Search */}
        <input
          type="text"
          placeholder="Search guest name..."
          className="border rounded px-3 py-2 text-sm w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr className="text-center">
                <th className="p-3">Guest</th>
                <th className="p-3">Room</th>
                <th className="p-3">Check-in</th>
                <th className="p-3">Check-out</th>
                <th className="p-3">Total</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((r) => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const checkOutDate = new Date(r.checkOutDate);
                checkOutDate.setHours(0, 0, 0, 0);
                const canCheckout = today >= checkOutDate;

                return (
                  <tr key={r._id} className="border-t text-center">
                    <td className="p-3">{r.fullName}</td>
                    <td className="p-3">{r.roomId?.roomType} - #{r.roomId?.roomNumber}</td>
                    <td className="p-3">{r.checkInDate.slice(0, 10)}</td>
                    <td className="p-3">{r.checkOutDate.slice(0, 10)}</td>
                    <td className="p-3 font-semibold text-green-600">₱{r.totalPrice.toLocaleString()}</td>
                    <td className="p-3">
                      <Button
                        label={canCheckout ? "Checkout" : "Not Yet"}
                        onClick={() => handleCheckout(r)}
                        disabled={loading || !canCheckout}
                        variant={canCheckout ? "primary" : "secondary"}
                      />
                    </td>
                  </tr>
                );
              })}
              {paginatedData.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-3 text-center text-gray-500">
                    No checked-in guests.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded border ${currentPage === i + 1 ? "bg-blue-700 text-white" : ""}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FrontDesk;