
import React from "react";
import StatCard from "./StatCard";
import { Calendar, Users, FileEdit } from "lucide-react";

const DoctorDashboard: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <StatCard
      label="Today's Appointments"
      value={6}
      icon={<Calendar className="w-6 h-6" />}
      colorClass="border-indigo-200"
      trend="up"
      trendValue="+2 from yesterday"
    />
    <StatCard
      label="My Patients"
      value={24}
      icon={<Users className="w-6 h-6" />}
      colorClass="border-teal-200"
      trend="up"
      trendValue="+3 new patients"
    />
    <StatCard
      label="Pending Reports"
      value={3}
      icon={<FileEdit className="w-6 h-6" />}
      colorClass="border-yellow-200"
      trend="down"
      trendValue="-2 completed"
    />
  </div>
);

export default DoctorDashboard;
