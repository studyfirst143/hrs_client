import  { useEffect, useState } from "react";
import axios from "axios";
import TopBar from "../../components/TopBar";
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

const AdminnavItems = [
  { label: "Dashboard", path: "/dashboard/home" },
  { label: "Reservations", path: "/dashboard/reservations" },
  { label: "Rooms", path: "/dashboard/rooms" },
  { label: "Front Desk", path: "/dashboard/frontdesk" },
  { label: "Reports", path: "/dashboard/reports" },
  { label: "Accounts", path: "/dashboard/accounts" },
];

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("https://avidturerhotel.onrender.com/api/dashboard/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = stats && [
    {
      label: "Sales Today",
      value: `₱${stats.salesToday}`,
      icon: <CurrencyDollarIcon className="w-6 h-6 text-white" />,
      color: "bg-green-500",
    },
    {
      label: "Sales This Month",
      value: `₱${stats.salesMonth}`,
      icon: <CurrencyDollarIcon className="w-6 h-6 text-white" />,
      color: "bg-blue-500",
    },
    {
      label: "Sales This Year",
      value: `₱${stats.salesYear}`,
      icon: <CurrencyDollarIcon className="w-6 h-6 text-white" />,
      color: "bg-purple-500",
    },
    {
      label: "Admins",
      value: stats.users.admins,
      icon: <UserGroupIcon className="w-6 h-6 text-white" />,
      color: "bg-red-500",
    },
    {
      label: "Staff",
      value: stats.users.staff,
      icon: <UserGroupIcon className="w-6 h-6 text-white" />,
      color: "bg-orange-500",
    },
    {
      label: "Guests",
      value: stats.users.guests,
      icon: <UserGroupIcon className="w-6 h-6 text-white" />,
      color: "bg-yellow-500",
    },
    {
      label: "Check-Ins Today",
      value: stats.todayGuests.checkIn,
      icon: <UserGroupIcon className="w-6 h-6 text-white" />,
      color: "bg-teal-500",
    },
    {
      label: "Check-Outs Today",
      value: stats.todayGuests.checkOut,
      icon: <UserGroupIcon className="w-6 h-6 text-white" />,
      color: "bg-indigo-500",
    },
    {
      label: "Total Rooms",
      value: stats.rooms.total,
      icon: <BuildingOffice2Icon className="w-6 h-6 text-white" />,
      color: "bg-gray-500",
    },
    {
      label: "Occupied Rooms",
      value: stats.rooms.occupied,
      icon: <ClipboardDocumentListIcon className="w-6 h-6 text-white" />,
      color: "bg-rose-500",
    },
    {
      label: "Available Rooms",
      value: stats.rooms.available,
      icon: <BuildingOffice2Icon className="w-6 h-6 text-white" />,
      color: "bg-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar navItems={AdminnavItems} />

      <div className="pt-20 px-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

        {/* ================= LOADING SKELETON ================= */}
        {loading && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 11 }).map((_, i) => (
              <div
                key={i}
                className="p-4 bg-white rounded-lg shadow animate-pulse"
              >
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= DASHBOARD CARDS ================= */}
        {!loading && (
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cards.map((card: any) => (
              <div
                key={card.label}
                className="flex items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
              >
                <div className={`${card.color} p-3 rounded-full mr-4 flex items-center justify-center`}>
                  {card.icon}
                </div>

                <div>
                  <p className="text-xl font-bold">{card.value}</p>
                  <p className="text-gray-500">{card.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
