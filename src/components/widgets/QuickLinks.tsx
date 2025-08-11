
import React from "react";
import { Link } from "react-router-dom";
import { Calendar, FileText, User, MessageSquare, Download, Search } from "lucide-react";

interface QuickLinksProps {
  role: "Patient" | "Doctor" | "Admin";
}
const quickLinksData = {
  Patient: [
    { label: "Appointments", to: "/appointments", icon: <Calendar size={20} /> },
    { label: "Medical Records", to: "/medical-records", icon: <FileText size={20} /> },
    { label: "My Doctors", to: "/profile", icon: <User size={20} /> },
    { label: "Messages", to: "/messaging", icon: <MessageSquare size={20} /> }
  ],
  Doctor: [
    { label: "Today's Appointments", to: "/appointments", icon: <Calendar size={20} /> },
    { label: "Search Patients", to: "/patients", icon: <Search size={20} /> },
    { label: "Messages", to: "/messaging", icon: <MessageSquare size={20} /> },
    { label: "Profile", to: "/profile", icon: <User size={20} /> }
  ],
  Admin: [
    { label: "User Management", to: "/user-management", icon: <User size={20} /> },
    { label: "All Appointments", to: "/appointments", icon: <Calendar size={20} /> },
    { label: "Patient Records", to: "/patient-records", icon: <FileText size={20} /> },
    { label: "System Analytics", to: "/admin-panel", icon: <Search size={20} /> }
  ]
} as const;

const QuickLinks: React.FC<QuickLinksProps> = ({ role }) => (
  <div>
    <div className="text-sm font-semibold mb-2">Quick Links</div>
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2">
      {quickLinksData[role].map((q) => (
        <Link
          to={q.to}
          key={q.label}
          className="flex items-center gap-2 border bg-background rounded px-2 py-2 hover:bg-blue-50 transition text-blue-700 shadow hover:scale-105 hover:shadow-lg"
        >
          {q.icon}
          <span>{q.label}</span>
        </Link>
      ))}
    </div>
  </div>
);

export default QuickLinks;
