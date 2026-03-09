import React, { useEffect, useState } from "react";
import axios from "axios";
import TopBar from "../../components/TopBar";
import {
  HomeIcon,
  ClipboardDocumentListIcon,
  BuildingOffice2Icon,
  UsersIcon,
  RectangleStackIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const monthNames = [
  { name: "All", value: "" },
  { name: "January", value: "01" },
  { name: "February", value: "02" },
  { name: "March", value: "03" },
  { name: "April", value: "04" },
  { name: "May", value: "05" },
  { name: "June", value: "06" },
  { name: "July", value: "07" },
  { name: "August", value: "08" },
  { name: "September", value: "09" },
  { name: "October", value: "10" },
  { name: "November", value: "11" },
  { name: "December", value: "12" },
];

const Reports: React.FC = () => {
  const [records, setRecords] = useState<any[]>([]);
  const [month, setMonth] = useState<string>(""); // "01".."12" or "" for all
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [filteredRecords, setFilteredRecords] = useState<any[]>([]);

  const AdminnavItems = [
    { label: "Dashboard", path: "/dashboard/home", icon: <HomeIcon className="w-5 h-5" /> },
    { label: "Reservations", path: "/dashboard/reservations", icon: <ClipboardDocumentListIcon className="w-5 h-5" /> },
    { label: "Rooms", path: "/dashboard/rooms", icon: <BuildingOffice2Icon className="w-5 h-5" /> },
    { label: "Front Desk", path: "/dashboard/frontdesk", icon: <UsersIcon className="w-5 h-5" /> },
    { label: "Reports", path: "/dashboard/reports", icon: <RectangleStackIcon className="w-5 h-5" /> },
    { label: "Accounts", path: "/dashboard/accounts", icon: <UserGroupIcon className="w-5 h-5" /> },
  ];

  /* 🔽 FETCH CHECKED-OUT RECORDS */
  const fetchCheckedOutRecords = async () => {
    try {
      const res = await axios.get("https://avidturerhotel.onrender.com/api/reservations/checkedout");
      setRecords(res.data.records);
    } catch (error) {
      console.error("Failed to fetch checked-out records", error);
    }
  };

  useEffect(() => {
    fetchCheckedOutRecords();
  }, []);

  /* 🔹 FILTER LOGIC */
  useEffect(() => {
    let data = [...records];

    if (year) {
      data = data.filter(
        (r) => new Date(r.checkOutDate).getFullYear().toString() === year
      );
    }
    if (month) {
      data = data.filter(
        (r) => (new Date(r.checkOutDate).getMonth() + 1).toString().padStart(2, "0") === month
      );
    }

    setFilteredRecords(data);
  }, [records, month, year]);

  const totalRevenue = filteredRecords.reduce(
    (sum, r) => sum + r.totalPrice,
    0
  );

  /* 🔹 PRINT LOGIC */
  const handlePrint = () => {
    const printContent = document.getElementById("reportTable");
    if (printContent) {
      const selectedMonthName = monthNames.find((m) => m.value === month)?.name || "All Months";
      const titleMonthYear = month ? `${selectedMonthName} ${year}` : `Year ${year}`;

      const newWin = window.open("", "Print-Window");
      newWin?.document.write(`
        <html>
          <head>
            <title>AvidTurer Hotel - Checked-Out Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; color: #111; }
              .header { text-align: center; margin-bottom: 20px; }
              .logo { width: 100px; height: auto; margin-bottom: 10px; }
              h1 { margin: 0; font-size: 28px; color: #1E3A8A; }
              h2 { margin: 5px 0 20px 0; font-size: 20px; color: #374151; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { border: 1px solid #333; padding: 10px; text-align: center; }
              th { background-color: #1E3A8A; color: white; font-weight: bold; }
              tr:nth-child(even) { background-color: #f0f4f8; }
              tr:hover { background-color: #e2e8f0; }
              .total { font-weight: bold; text-align: right; margin-top: 10px; font-size: 18px; padding: 5px 0; }
              @media print {
                table { page-break-inside: auto; }
                tr { page-break-inside: avoid; page-break-after: auto; }
                thead { display: table-header-group; }
                tfoot { display: table-footer-group; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <img src="../../assets/logo.jpg" class="logo" />
              <h1>AvidTurer Hotel</h1>
              <h2>Checked-Out Guests Report - ${titleMonthYear}</h2>
            </div>
            ${printContent.outerHTML}
            <div class="total">Total Revenue: ₱${totalRevenue.toLocaleString()}</div>
          </body>
        </html>
      `);
      newWin?.document.close();
      newWin?.print();
    }
  };

  return (
    <>
      <TopBar navItems={AdminnavItems} />

      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-blue-700">Reports - Checked Out Guests</h1>

        {/* FILTER */}
        <div className="flex gap-2 items-center">
          <label>
            Month:
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="border px-2 py-1 rounded ml-1"
            >
              {monthNames.map((m) => (
                <option key={m.value} value={m.value}>{m.name}</option>
              ))}
            </select>
          </label>

          <label>
            Year:
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="border px-2 py-1 rounded ml-1 w-24"
            />
          </label>

          <button
            onClick={handlePrint}
            className="bg-blue-700 text-white px-4 py-2 rounded"
          >
            Print
          </button>
        </div>

        {/* TABLE */}
        <div className="bg-white shadow rounded-lg overflow-x-auto mt-4">
          <table className="w-full text-sm" id="reportTable">
            <thead className="bg-gray-100">
              <tr className="text-center">
                <th className="p-3">Guest</th>
                <th className="p-3">Room</th>
                <th className="p-3">Check-in</th>
                <th className="p-3">Check-out</th>
                <th className="p-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r._id} className="border-t text-center">
                  <td className="p-3">{r.fullName}</td>
                  <td className="p-3">{r.roomId?.roomType} - #{r.roomId?.roomNumber}</td>
                  <td className="p-3">{r.checkInDate.slice(0, 10)}</td>
                  <td className="p-3">{r.checkOutDate.slice(0, 10)}</td>
                  <td className="p-3 font-semibold text-green-600">₱{r.totalPrice.toLocaleString()}</td>
                </tr>
              ))}
              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-3 text-center text-gray-500">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* TOTAL REVENUE */}
          <div className="mt-2 p-3 font-bold text-right">
            Total Revenue: ₱{totalRevenue.toLocaleString()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Reports;
