
import React from "react";
import { Calendar, MessageSquare, User, FileText } from "lucide-react";
import NotificationsCard from "./NotificationsCard";
import QuickLinks from "./QuickLinks";

type UserRole = 'patient' | 'doctor' | 'admin';

interface HomeDashboardProps {
  role: UserRole;
  userName: string;
}

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 18) return "Good Afternoon";
  return "Good Evening";
};

// Helper function to convert role to display format
const getRoleDisplay = (role: UserRole): "Patient" | "Doctor" | "Admin" => {
  switch (role) {
    case 'patient':
      return 'Patient';
    case 'doctor':
      return 'Doctor';
    case 'admin':
      return 'Admin';
    default:
      return 'Patient';
  }
};

const HomeDashboard: React.FC<HomeDashboardProps> = ({ role, userName }) => {
  const displayRole = getRoleDisplay(role);
  
  return (
    <div className="w-full flex flex-col gap-5">
      {/* Greeting */}
      <div className="flex justify-between flex-wrap gap-2 items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            {getGreeting()}, {displayRole === "Doctor" ? "Dr. " : ""}
            {userName ? userName : "User"}!
          </h1>
          <p className="text-muted-foreground text-sm">
            {displayRole === "Patient" && "Here's a quick summary of your upcoming care, records, and health stats."}
            {displayRole === "Doctor" && "Stay on top of your schedule, patient updates, and recent activity."}
            {displayRole === "Admin" && "Monitor system activity, analytics, and manage users all in one place."}
          </p>
        </div>
        <NotificationsCard role={displayRole} />
      </div>
      <div className="w-full grid md:grid-cols-2 gap-6">
        <div>
          {/* Demo next appointment/activity */}
          <div className="bg-white border rounded-lg shadow px-6 py-4 mb-4">
            <span className="block text-md font-medium mb-1">
              {displayRole === "Patient" && "Upcoming Appointment"}
              {displayRole === "Doctor" && "Your Next Patient"}
              {displayRole === "Admin" && "Latest System Event"}
            </span>
            <span className="text-xl font-bold">
              {displayRole === "Patient" && "Mon, 11:30 AM – Dr. James | General Checkup"}
              {displayRole === "Doctor" && "Samantha H. – 12:00 PM (Checkup)"}
              {displayRole === "Admin" && "5 users added | 8:15 AM"}
            </span>
            <div className="text-xs text-muted-foreground mt-1">
              (All data sample/demo)
            </div>
          </div>
          <QuickLinks role={displayRole} />
        </div>
        <div className="flex h-full items-center">
          {/* Simple Activity Feed */}
          <div className="w-full">
            <h3 className="font-semibold mb-2 text-base text-gray-700">Recent Activity</h3>
            <ul className="text-sm space-y-2">
              {displayRole === "Patient" && (
                <>
                  <li className="flex items-center gap-2 text-blue-700">
                    <Calendar size={18} /> Appointment confirmed for tomorrow, 9 AM.
                  </li>
                  <li className="flex items-center gap-2 text-green-700">
                    <FileText size={18} /> Lab report available for download.
                  </li>
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <User size={18} /> New doctor assigned: Dr. James
                  </li>
                </>
              )}
              {displayRole === "Doctor" && (
                <>
                  <li className="flex items-center gap-2 text-blue-700">
                    <Calendar size={18} /> 3 new appointments booked today.
                  </li>
                  <li className="flex items-center gap-2 text-orange-700">
                    <MessageSquare size={18} /> 2 unread messages from patients.
                  </li>
                  <li className="flex items-center gap-2 text-green-700">
                    <FileText size={18} /> Prescription issued to Michael C.
                  </li>
                </>
              )}
              {displayRole === "Admin" && (
                <>
                  <li className="flex items-center gap-2 text-blue-700">
                    <User size={18} /> System user roles updated (2).
                  </li>
                  <li className="flex items-center gap-2 text-green-700">
                    <FileText size={18} /> 1 new analytics report generated.
                  </li>
                  <li className="flex items-center gap-2 text-red-700">
                    <MessageSquare size={18} /> Security alert: unusual login detected.
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
