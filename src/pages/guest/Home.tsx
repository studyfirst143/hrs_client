import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuthClient } from "../../context/AuthClientContext";

interface Room {
  _id: string;
  roomNumber: string;
  roomType: string;
  capacity: number;
  pricePerNight: number;
  status: "available" | "occupied" | "inactive";
  image?: string;
}

export default function Home() {
  const { isAuthenticated } = useAuthClient();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);

  // Scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove("opacity-0", "translate-y-10");
          entry.target.classList.add("opacity-100", "translate-y-0");
        }
      },
      { threshold: 0.2 }
    );

    if (heroRef.current) observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(false);
      return;
    }

    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          "https://avidturerhotel.onrender.com/api/rooms/viewrooms"
        );
        setRooms(response.data);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [isAuthenticated]);

  return (
    <section id="home" className="space-y-12">

      {/* ================= HERO SECTION ================= */}
      <div
        ref={heroRef}
        className="relative h-[70vh] rounded-2xl overflow-hidden shadow-lg transition-all duration-1000 opacity-0 translate-y-10"
      >
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
          alt="Hotel Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-black/70 to-black/30"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-10 text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome to <span className="text-blue-400">AvidTurer Hotel</span>
          </h1>
          <p className="max-w-2xl text-lg text-gray-200 leading-relaxed">
            Experience luxury, comfort, and convenience in one place.  
            Book your stay today and enjoy world-class hospitality.
          </p>
        </div>
      </div>

      {/* ================= ABOUT SECTION ================= */}
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <p className="text-gray-700 leading-relaxed text-lg">
          At AvidTurer Hotel, we provide modern rooms, easy booking, and excellent
          services to make your stay unforgettable. Whether for business or leisure,
          we guarantee comfort and relaxation.
        </p>
      </div>

      {/* ================= ROOM LIST ================= */}
      {!isAuthenticated && (
        <>
          <h2 className="text-2xl font-bold">Available Rooms</h2>

          {loading ? (
            <p>Loading rooms...</p>
          ) : rooms.length === 0 ? (
            <p>No rooms available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
                >
                  {room.image && (
                    <div className="h-56 overflow-hidden">
                      <img
                        src={`https://avidturerhotel.onrender.com${room.image}`}
                        alt={`Room ${room.roomNumber}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-5">
                    <h2 className="text-xl font-bold mb-2">
                      {room.roomType} - #{room.roomNumber}
                    </h2>

                    <p className="text-gray-600">Capacity: {room.capacity} person(s)</p>
                    <p className="text-gray-600">
                      Price: ₱{room.pricePerNight.toLocaleString()} / night
                    </p>

                    <p
                      className={`mt-2 font-semibold ${
                        room.status === "available"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {room.status === "available" ? "Available" : "Occupied"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
