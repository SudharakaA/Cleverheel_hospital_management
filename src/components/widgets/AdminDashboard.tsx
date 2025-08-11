
import React from "react";
import StatCard from "./StatCard";
import { Users, BarChart, Calendar } from "lucide-react";

const AdminDashboard: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <StatCard
      label="Active Users"
      value={61}
      icon={<Users className="w-6 h-6" />}
      colorClass="border-blue-200"
      trend="up"
      trendValue="+8% this month"
    />
    <StatCard
      label="Appointments This Month"
      value={183}
      icon={<Calendar className="w-6 h-6" />}
      colorClass="border-green-200"
      trend="up"
      trendValue="+15% from last month"
    />
    <StatCard
      label="Open Issues"
      value={7}
      icon={<BarChart className="w-6 h-6" />}
      colorClass="border-red-200"
      trend="down"
      trendValue="-3 resolved today"
    />
  </div>
);

export default AdminDashboard;
