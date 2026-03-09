import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "../components/Button";
import Input from "../components/Input";
import type { Room } from "../types/room";
import type { Guest } from "../types/guest";

interface Props {
  room: Room;
  guest: Guest;
  onClose: () => void;
  onSuccess: () => void;
}

const BookReservation: React.FC<Props> = ({ room, guest, onClose, onSuccess }) => {

  const [form, setForm] = useState({
    checkIn: "",
    checkOut: "",
    nights: 0,
    totalAmount: 0,
    paymentProof: null as File | null,
    paymentPreview: "",
  });

  const [errors, setErrors] = useState({
    checkIn: "",
    checkOut: "",
    paymentProof: "",
  });

  const [loading, setLoading] = useState(false);

  /* ------------------ Calculate nights + total ------------------ */
  useEffect(() => {
    if (form.checkIn && form.checkOut) {
      const inDate = new Date(form.checkIn);
      const outDate = new Date(form.checkOut);
      const diff = (outDate.getTime() - inDate.getTime()) / (1000 * 60 * 60 * 24);
      const nights = diff > 0 ? diff : 0;

      setForm(prev => ({
        ...prev,
        nights,
        totalAmount: nights * room.pricePerNight
      }));
    }
  }, [form.checkIn, form.checkOut, room.pricePerNight]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm({ ...form, [name]: value });

    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setForm({
        ...form,
        paymentProof: file,
        paymentPreview: URL.createObjectURL(file)
      });

      setErrors(prev => ({ ...prev, paymentProof: "" }));
    }
  };

  /* ------------------ Submit Booking ------------------ */
  const handleSubmit = async () => {

    let newErrors = {
      checkIn: "",
      checkOut: "",
      paymentProof: "",
    };

    if (!form.checkIn) newErrors.checkIn = "Check-in date is required.";
    if (!form.checkOut) newErrors.checkOut = "Check-out date is required.";
    if (!form.paymentProof) newErrors.paymentProof = "Please upload proof of payment.";

    setErrors(newErrors);

    if (newErrors.checkIn || newErrors.checkOut || newErrors.paymentProof) {
      return;
    }

    setLoading(true);

    try {

      const formData = new FormData();

      formData.append("guestId", guest._id);
      formData.append("guestName", guest.fullName);
      formData.append("guestEmail", guest.email || "");
      formData.append("guestPhone", guest.phoneNumber || "");

      formData.append("roomId", room._id);
      formData.append("roomNumber", room.roomNumber);
      formData.append("roomType", room.roomType);
      formData.append("pricePerNight", room.pricePerNight.toString());

      formData.append("checkInDate", form.checkIn);
      formData.append("checkOutDate", form.checkOut);
      formData.append("totalPrice", form.totalAmount.toString());

     if (form.paymentProof) {
  formData.append("paymentProof", form.paymentProof);
}

      const res = await axios.post(
        "https://avidturerhotel.onrender.com/api/reservations/book",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      await Swal.fire({
        icon: "success",
        title: "Reservation Successful",
        text: res.data.message,
        confirmButtonColor: "#2563eb"
      });

      onSuccess();
      onClose();

    } catch (err: any) {

      Swal.fire({
        icon: "error",
        title: "Booking Failed",
        text: err.response?.data?.message || "Failed to book reservation."
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">

      <div className="bg-white w-full max-w-2xl rounded-lg shadow flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="sticky top-0 bg-white z-10 border-b p-4">
          <h2 className="text-xl font-bold text-blue-700">
            Book Room: {room.roomType} - #{room.roomNumber}
          </h2>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          <p>Guest: <strong>{guest.fullName}</strong> ({guest.email || "No email"})</p>
          <p>Price per Night: <strong>₱{room.pricePerNight.toLocaleString()}</strong></p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div>
              <Input
                label="Check-in Date"
                type="date"
                name="checkIn"
                value={form.checkIn}
                onChange={handleChange}
              />
              {errors.checkIn && (
                <p className="text-red-500 text-sm mt-1">{errors.checkIn}</p>
              )}
            </div>

            <div>
              <Input
                label="Check-out Date"
                type="date"
                name="checkOut"
                value={form.checkOut}
                onChange={handleChange}
              />
              {errors.checkOut && (
                <p className="text-red-500 text-sm mt-1">{errors.checkOut}</p>
              )}
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="No. of Nights" value={form.nights} disabled />
            <Input label="Total Amount (₱)" value={form.totalAmount} disabled />
          </div>

          <div>

            <label className="text-sm font-medium">GCash Proof of Payment</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-2"
            />

            {errors.paymentProof && (
              <p className="text-red-500 text-sm mt-1">{errors.paymentProof}</p>
            )}

            {form.paymentPreview && (
              <img
                src={form.paymentPreview}
                alt="Payment Proof"
                className="mt-3 w-40 rounded border"
              />
            )}

          </div>

        </div>

        {/* FOOTER */}
        <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-2">
          <Button
            label={loading ? "Booking..." : "Submit Booking"}
            onClick={handleSubmit}
            disabled={loading}
          />
          <Button label="Close" variant="secondary" onClick={onClose} />
        </div>

      </div>
    </div>
  );
};

export default BookReservation;