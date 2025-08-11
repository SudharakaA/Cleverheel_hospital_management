
import React from "react";
import StatCard from "./StatCard";
import { Calendar, FileText, Activity } from "lucide-react";

const PatientDashboard: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <StatCard
      label="Upcoming Appointments"
      value={2}
      icon={<Calendar className="w-6 h-6" />}
      colorClass="border-green-200"
      trend="up"
      trendValue="+1 this week"
    />
    <StatCard
      label="Prescriptions"
      value={4}
      icon={<FileText className="w-6 h-6" />}
      colorClass="border-blue-200"
      trend="neutral"
      trendValue="2 active"
    />
    <StatCard
      label="Lab Reports"
      value={1}
      icon={<Activity className="w-6 h-6" />}
      colorClass="border-pink-200"
      trend="up"
      trendValue="New result"
    />
  </div>
);

export default PatientDashboard;
