import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Stethoscope } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const AppointmentBooking: React.FC = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const { user, profile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('id, full_name, specialization, consultation_fee')
        .eq('is_active', true)
        .order('full_name');

      if (error) throw error;
      setDoctors(data || []);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      toast({
        title: "Error",
        description: "Failed to load doctors",
        variant: "destructive",
      });
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedDoctor || !appointmentDate || !appointmentTime || !symptoms.trim()) {
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
          doctor_id: selectedDoctor,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          symptoms: symptoms,
          status: 'scheduled'
        });

      if (appointmentError) throw appointmentError;

      toast({
        title: "Success",
        description: "Appointment booked successfully!",
      });

      // Reset form
      setSelectedDoctor("");
      setAppointmentDate("");
      setAppointmentTime("");
      setSymptoms("");
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

  const selectedDoctorData = doctors.find(d => d.id === selectedDoctor);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Book New Appointment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Select Doctor</label>
          <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
            <SelectTrigger>
              <SelectValue placeholder={loadingDoctors ? "Loading doctors..." : "Choose a doctor"} />
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id}>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="w-4 h-4" />
                    <div>
                      <div className="font-medium">{doctor.full_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {doctor.specialization} • ${doctor.consultation_fee}
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <Input
              type="date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Time</label>
            <Input
              type="time"
              value={appointmentTime}
              onChange={(e) => setAppointmentTime(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Symptoms</label>
          <Textarea
            placeholder="Describe your symptoms and reason for visit..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={3}
          />
        </div>

        {selectedDoctorData && (
          <div className="bg-muted p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4" />
              <span className="font-medium">{selectedDoctorData.full_name}</span>
              <span className="text-muted-foreground">•</span>
              <span>{selectedDoctorData.specialization}</span>
              <span className="text-muted-foreground">•</span>
              <span className="font-medium">${selectedDoctorData.consultation_fee}</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleBooking}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Booking..." : "Book Appointment"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AppointmentBooking;