
import React from "react";
import { Bell, FileText, Calendar, User } from "lucide-react";

interface NotificationsCardProps {
  role: "Patient" | "Doctor" | "Admin";
}
const notificationsData = {
  Patient: [
    { icon: <FileText className="w-5 h-5 text-green-600" />, message: "Lab report ready to download" },
    { icon: <Calendar className="w-5 h-5 text-blue-600" />, message: "Appointment approved for tomorrow" }
  ],
  Doctor: [
    { icon: <User className="w-5 h-5 text-blue-600" />, message: "3 new patients assigned today" },
    { icon: <Bell className="w-5 h-5 text-orange-600" />, message: "New message from patient" }
  ],
  Admin: [
    { icon: <User className="w-5 h-5 text-blue-600" />, message: "User account created: Susan" },
    { icon: <Bell className="w-5 h-5 text-red-600" />, message: "Critical system update required" }
  ]
} as const;

const NotificationsCard: React.FC<NotificationsCardProps> = ({ role }) => (
  <div className="bg-white border border-yellow-200 px-4 py-2 rounded-lg shadow text-sm min-w-[230px]">
    <div className="font-semibold flex items-center gap-1 mb-1 text-yellow-700">
      <Bell size={18} /> Notifications
    </div>
    <ul className="space-y-1">
      {notificationsData[role].map((n, i) => (
        <li key={i} className="flex gap-2 items-center">
          {n.icon}
          <span>{n.message}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default NotificationsCard;
