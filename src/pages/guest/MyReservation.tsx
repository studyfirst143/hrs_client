import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthClient } from "../../context/AuthClientContext";
import type { Room } from "../../types/room";

interface Reservation {
  _id: string;
  roomId: Room; 
  checkInDate: string;
  checkOutDate: string;
  totalPrice: number;
  status: string;
  paymentProof?: string;
  createdAt: string;
}

export default function MyReservation() {
  const { guest, isAuthenticated } = useAuthClient();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  /* ------------------ Fetch Reservations ------------------ */
  const fetchReservations = async () => {
    if (!guest) return;

    try {
      const res = await axios.get(
        `https://avidturerhotel.onrender.com/api/reservations/guest/${guest._id}`
      );
      setReservations(res.data.reservations);
    } catch (err) {
      console.error("Failed to fetch reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ Initial Fetch ------------------ */
  useEffect(() => {
    if (isAuthenticated) fetchReservations();
  }, [guest, isAuthenticated]);

  /* ------------------ Polling / Realtime-ish ------------------ */
  useEffect(() => {
    if (!isAuthenticated || !guest) return;

    const interval = setInterval(() => {
      fetchReservations();
    }, 2000); // every 5 seconds

    return () => clearInterval(interval);
  }, [guest, isAuthenticated]);

  return (
    <section className="bg-white py-16 px-6 md:px-12" id="reservations">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-gray-800 text-center">
          My Reservations
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-12 text-center">
          View your current and past bookings. Keep track of your hotel stays and manage your reservations with ease.
        </p>

        {loading ? (
          <p className="text-center text-gray-600">Loading reservations...</p>
        ) : reservations.length === 0 ? (
          <p className="text-center text-gray-600">No reservations found.</p>
        ) : (
          <div className="overflow-x-auto shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Check-in
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Check-out
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Total Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                    Payment Proof
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reservations.map((res) => (
                  <tr
                    key={res._id}
                    className="hover:bg-gray-50 transition duration-200 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 font-medium">
                      {res.roomId.roomType} - #{res.roomId.roomNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {new Date(res.checkInDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {new Date(res.checkOutDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      ₱{res.totalPrice.toLocaleString()}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap font-semibold ${
                        res.status === "confirmed" || res.status === "available"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {res.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {res.paymentProof ? (
                        <a
                          href={`https://avidturerhotel.onrender.com${res.paymentProof}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}