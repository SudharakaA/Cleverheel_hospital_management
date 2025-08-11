
import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Phone, Mail, MapPin, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Doctors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState<any[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Auto-filter as user types
  useEffect(() => {
    handleSearch();
  }, [searchTerm, doctors]);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;
      setDoctors(data || []);
      setFilteredDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Failed to load doctors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const filtered = doctors.filter(doctor =>
      doctor.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.symptoms.some((symptom: string) => 
        symptom.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      doctor.qualifications.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDoctors(filtered);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setFilteredDoctors(doctors);
  };

  const handleBookAppointment = (doctor: any) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  return (
    <AppLayout
      topbar={
        <div className="flex justify-between items-center w-full">
          <h1 className="text-xl font-semibold">Search Doctors</h1>
          <div className="text-sm text-muted-foreground">
            {filteredDoctors.length} doctors found
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Search Section */}
        <Card>
          <CardHeader>
            <CardTitle>Find a Doctor</CardTitle>
            <CardDescription>
              Search by name, specialty, symptoms, or qualifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by doctor name, specialty, or symptoms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchTerm && (
                <Button variant="outline" onClick={handleClearSearch}>
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>
              {filteredDoctors.length === 0 ? "No doctors found" : `${filteredDoctors.length} doctors found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading doctors...</div>
            ) : filteredDoctors.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Specialization</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead>Symptoms Treated</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Availability</TableHead>
                    <TableHead>Fee</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDoctors.map((doctor) => (
                    <TableRow key={doctor.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div>{doctor.full_name}</div>
                          <div className="text-sm text-muted-foreground">
                            {doctor.qualifications}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{doctor.specialization.replace('_', ' ')}</TableCell>
                      <TableCell>{doctor.experience_years} years</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {doctor.symptoms.slice(0, 3).map((symptom: string, index: number) => (
                            <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                              {symptom}
                            </span>
                          ))}
                          {doctor.symptoms.length > 3 && (
                            <span className="text-muted-foreground text-xs">
                              +{doctor.symptoms.length - 3} more
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {doctor.phone && (
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="w-3 h-3" />
                              {doctor.phone}
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-sm">
                            <Mail className="w-3 h-3" />
                            {doctor.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{doctor.available_days.join(', ')}</div>
                          <div className="text-muted-foreground">{doctor.available_hours}</div>
                        </div>
                      </TableCell>
                      <TableCell>${doctor.consultation_fee}</TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          onClick={() => handleBookAppointment(doctor)}
                        >
                          <Calendar className="w-3 h-3 mr-1" />
                          Book
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No doctors found matching your search criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <BookingModal
          doctor={selectedDoctor}
          onClose={() => setShowBookingModal(false)}
          onSuccess={() => {
            setShowBookingModal(false);
            toast({
              title: "Success",
              description: "Appointment booked successfully!",
            });
          }}
        />
      )}
    </AppLayout>
  );
};

// Booking Modal Component
const BookingModal: React.FC<{
  doctor: any;
  onClose: () => void;
  onSuccess: () => void;
}> = ({ doctor, onClose, onSuccess }) => {
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const handleBooking = async () => {
    if (!appointmentDate || !appointmentTime || !symptoms.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Get or create patient record
      const { data: patientData, error: patientError } = await supabase
        .from('patients')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (patientError) throw patientError;

      let patientId = patientData?.id;

      if (!patientId) {
        const fullName = `${profile?.first_name ?? ''} ${profile?.last_name ?? ''}`.trim() || (user?.email?.split('@')[0] || 'Patient');
        const email = profile?.email || user?.email || '';
        const { data: newPatient, error: insertError } = await supabase
          .from('patients')
          .insert({
            user_id: user?.id,
            full_name: fullName,
            email,
            phone: profile?.phone ?? null
          })
          .select('id')
          .single();
        if (insertError) throw insertError;
        patientId = newPatient.id;
      }

      // Create the appointment
      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert({
          patient_id: patientId,
          doctor_id: doctor.id,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          symptoms: symptoms,
          status: 'scheduled'
        });

      if (appointmentError) throw appointmentError;

      onSuccess();
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast({
        title: "Error",
        description: "Failed to book appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Book Appointment</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Booking with {doctor.full_name} - {doctor.specialization}
        </p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <Input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Time</label>
            <Input
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Symptoms</label>
            <textarea
              className="w-full border rounded-md p-2 h-20"
              placeholder="Describe your symptoms..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex gap-2 mt-6">
          <Button
            onClick={handleBooking}
            disabled={loading}
            className="flex-1"
          >
            {loading ? "Booking..." : "Book Appointment"}
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Doctors;
