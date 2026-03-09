import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "../components/Button";

interface Props {
  reservation?: any;
  onClose: () => void;
  onUpdate?: () => void; // callback para i-refresh ang list
}

const ReservationFormModal: React.FC<Props> = ({ reservation, onClose, onUpdate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (reservation) setData(reservation);
  }, [reservation]);

  if (!data) return null;

  /* ------------------ APPROVE ------------------ */
  const handleApprove = async () => {
    // Compare check-in date with today
    const checkInDate = new Date(data.checkInDate);
    const today = new Date();
    checkInDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (checkInDate.getTime() !== today.getTime()) {
      Swal.fire({
        icon: "error",
        title: "Cannot Approve",
        text: "Reservation cannot be approved. Check-in date is not today.",
      });
      return;
    }

    try {
      setLoading(true);
      await axios.put(`https://avidturerhotel.onrender.com/api/reservations/approve/${data._id}`);
      await Swal.fire({
        icon: "success",
        title: "Reservation Approved",
        text: "The reservation has been approved successfully.",
      });
      onUpdate?.();
      onClose();
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Approval Failed",
        text: error.response?.data?.message || "Failed to approve reservation.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ DECLINE ------------------ */
  const handleDecline = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Decline Reservation",
      text: "Are you sure you want to decline this reservation?",
      showCancelButton: true,
      confirmButtonText: "Yes, decline it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await axios.put(`https://avidturerhotel.onrender.com/api/reservations/decline/${data._id}`);
      await Swal.fire({
        icon: "success",
        title: "Reservation Declined",
        text: "The reservation has been declined.",
      });
      onUpdate?.();
      onClose();
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Decline Failed",
        text: error.response?.data?.message || "Failed to decline reservation.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ DELETE ------------------ */
  const handleDelete = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Reservation",
      text: "Are you sure you want to delete this reservation?",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      setLoading(true);
      await axios.delete(`https://avidturerhotel.onrender.com/api/reservations/${data._id}`);
      await Swal.fire({
        icon: "success",
        title: "Reservation Deleted",
        text: "The reservation has been deleted successfully.",
      });
      onUpdate?.();
      onClose();
    } catch (error: any) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: error.response?.data?.message || "Failed to delete reservation.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-xl rounded-lg shadow max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="border-b p-4">
          <h2 className="text-xl font-bold text-blue-700">Reservation Details</h2>
        </div>

        {/* BODY */}
        <div className="p-6 space-y-3 text-sm">
          <p><b>Guest Name:</b> {data.fullName}</p>
          <p><b>Email:</b> {data.email || "N/A"}</p>
          <p><b>Phone:</b> {data.phoneNumber}</p>

          <hr />

          <p><b>Room Type:</b> {data.roomId?.roomType}</p>
          <p><b>Room Number:</b> {data.roomId?.roomNumber}</p>
          <p><b>Price / Night:</b> ₱{data.roomId?.pricePerNight}</p>

          <hr />

          <p><b>Check-in:</b> {data.checkInDate.slice(0, 10)}</p>
          <p><b>Check-out:</b> {data.checkOutDate.slice(0, 10)}</p>
          <p><b>Total Price:</b> ₱{data.totalPrice.toLocaleString()}</p>

          <p>
            <b>Status:</b>{" "}
            <span className={`capitalize font-medium ${
              data.status === "pending" ? "text-yellow-600" :
              data.status === "confirmed" ? "text-green-600" :
              data.status === "cancelled" ? "text-red-600" :
              "text-gray-600"
            }`}>
              {data.status}
            </span>
          </p>

          {/* PAYMENT PROOF */}
          {data.paymentProof ? (
            <div>
              <p className="font-medium mb-1">Payment Proof:</p>
              <img
                src={`https://avidturerhotel.onrender.com${data.paymentProof}`}
                alt="Payment Proof"
                className="w-full rounded border"
              />
            </div>
          ) : <p>No payment proof uploaded.</p>}
        </div>

        {/* FOOTER */}
        <div className="border-t p-4  gap-2 grid grid-cols-2">
          {data.status === "pending" && (
            <>
              <Button label={loading ? "Approving..." : "Approve"} onClick={handleApprove} disabled={loading} />
              <Button label={loading ? "Declining..." : "Decline"} variant="secondary" onClick={handleDecline} disabled={loading} />
            </>
          )}
          <Button label={loading ? "Deleting..." : "Delete"} variant="danger" onClick={handleDelete} disabled={loading} />
          <Button label="Close" variant="secondary" onClick={onClose} disabled={loading} />
        </div>

      </div>
    </div>
  );
};

export default ReservationFormModal;