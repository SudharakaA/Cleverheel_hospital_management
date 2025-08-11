
import React from "react";
import Layout from "@/components/Layout";
import HomeDashboard from "@/components/widgets/HomeDashboard";
import DoctorDashboard from "@/components/widgets/DoctorDashboard";
import { useAuth } from "@/contexts/AuthContext";

const DoctorDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  
  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, Dr. {`${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()}</p>
        </div>
        <HomeDashboard role="doctor" userName={`${profile?.first_name || 'Doctor'} ${profile?.last_name || ''}`.trim()} />
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Doctor Analytics</h2>
          <DoctorDashboard />
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDashboardPage;
