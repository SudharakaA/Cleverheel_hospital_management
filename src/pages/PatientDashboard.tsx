
import React, { useState } from "react";
import Layout from "@/components/Layout";
import HomeDashboard from "@/components/widgets/HomeDashboard";
import PatientDashboard from "@/components/widgets/PatientDashboard";
import AppointmentBooking from "@/components/widgets/AppointmentBooking";
import AppointmentsList from "@/components/widgets/AppointmentsList";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PatientDashboardPage: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const commonSymptoms = [
    "Fever", "Headache", "Cough", "Chest Pain", "Stomach Pain",
    "Back Pain", "Fatigue", "Nausea", "Dizziness", "Skin Rash"
  ];

  const filteredSymptoms = commonSymptoms.filter(symptom =>
    symptom.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchDoctors = () => {
    const q = searchTerm.trim();
    navigate(`/doctors${q ? `?q=${encodeURIComponent(q)}` : ""}`);
  };

  const handleScrollToBooking = () => {
    document.getElementById("booking-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Patient Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {`${profile?.first_name || ''} ${profile?.last_name || ''}`.trim()}</p>
        </div>
      {/* Top action bar */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-xl border px-4 py-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          <div className="flex-1 flex items-center gap-2">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search doctors by name or specialty"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleScrollToBooking}>
              <Calendar className="w-4 h-4 mr-2" />
              Schedule
            </Button>
            <Button onClick={handleSearchDoctors}>
              Find Doctors
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <HomeDashboard 
          role="patient" 
          userName={`${profile?.first_name || 'Patient'} ${profile?.last_name || ''}`.trim()} 
        />
        
        {/* Symptom Search Section */}
        {/* Quick Doctor Search */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Quick Doctor Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Search symptoms (e.g., fever, headache, cough)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleSearchDoctors}>
                  Find Doctors
                </Button>
              </div>
              
              {searchTerm && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Common symptoms:</p>
                  <div className="flex flex-wrap gap-2">
                    {filteredSymptoms.map((symptom) => (
                      <Button
                        key={symptom}
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchTerm(symptom)}
                        className="text-xs"
                      >
                        {symptom}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="text-center pt-4">
                <Button 
                  onClick={handleSearchDoctors}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  <User className="w-4 h-4 mr-2" />
                  Browse All Doctors
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div id="booking-section">
            <AppointmentBooking />
          </div>
          <div className="lg:col-span-1">
            <div className="border-t lg:border-t-0 pt-6 lg:pt-0">
              <h2 className="text-lg font-semibold mb-4">Health Overview</h2>
              <PatientDashboard />
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <AppointmentsList />

      </div>
      </div>
    </Layout>
  );
};

export default PatientDashboardPage;
