import { useEffect, useState, useRef } from "react"; 
import axios from "axios";
import { useAuthClient } from "../../context/AuthClientContext";
import BookReservation from "../../forms/BookReservation";
import Button from "../../components/Button";
import type { Room } from "../../types/room";

export default function BookRoom() {
  const { guest, isAuthenticated } = useAuthClient();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const roomRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* ------------------ Fetch Rooms ------------------ */
  const fetchRooms = async () => {
    try {
      const res = await axios.get("https://avidturerhotel.onrender.com/api/rooms/viewrooms");
      setRooms(res.data.filter((r: Room) => r.status === "available"));
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ------------------ Real-time Polling ------------------ */
  useEffect(() => {
    fetchRooms(); // Initial fetch

    const interval = setInterval(() => {
      fetchRooms();
    }, 2000); // every 2 seconds

    return () => clearInterval(interval); // Cleanup
  }, []);

  /* ------------------ Intersection Observer for Animation ------------------ */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("opacity-100", "translate-y-0");
            entry.target.classList.remove("opacity-0", "translate-y-8");
          }
        });
      },
      { threshold: 0.1 }
    );

    roomRefs.current.forEach(ref => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, [rooms]);

  /* ------------------ Book Now ------------------ */
  const handleBookNow = (room: Room) => {
    if (!isAuthenticated || !guest) {
      alert("Please login first to book a room.");
      return;
    }
    setSelectedRoom(room);
  };

  /* ------------------ After Successful Booking ------------------ */
  const handleBookingSuccess = () => {
    setSelectedRoom(null);
    fetchRooms(); // refresh immediately after booking
  };

  return (
    <section className="bg-white py-16 px-6 md:px-12" id="book">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-800 text-center">
          Book Your Room
        </h1>
        <p className="text-gray-600 text-lg md:text-xl mb-12 text-center">
          Select and reserve your preferred room easily. Check availability and
          choose your desired dates for a hassle-free booking experience.
        </p>

        {loading ? (
          <p className="text-center text-gray-600">Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <p className="text-center text-gray-600">No rooms available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room, index) => (
              <div
                key={room._id}
                ref={el => { roomRefs.current[index] = el; }}
                className="bg-white rounded-xl overflow-hidden shadow-lg transform transition duration-700 ease-out opacity-0 translate-y-8 hover:scale-105 hover:shadow-2xl"
              >
                {room.image && (
                  <div className="relative h-64">
                    <img
                      src={`https://avidturerhotel.onrender.com${room.image}`}
                      alt={`Room ${room._id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-6 flex flex-col justify-between gap-4">
                  <h2 className="text-xl font-bold text-gray-800">{room.roomType} - #{room.roomNumber}</h2>
                  <p className="text-gray-600">Capacity: {room.capacity} person(s)</p>
                  <p className="text-gray-600">
                    Price per night: <strong>₱{room.pricePerNight.toLocaleString()}</strong>
                  </p>
                  <Button label="Book Now" onClick={() => handleBookNow(room)} className="mt-2 w-full" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reservation Modal */}
      {selectedRoom && guest && (
        <BookReservation
          room={selectedRoom}
          guest={guest}
          onClose={() => setSelectedRoom(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </section>
  );
}