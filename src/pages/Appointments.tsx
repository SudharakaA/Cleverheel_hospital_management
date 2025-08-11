import React, { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, userRole } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchAppointments();
  }, [user, userRole]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      let query = supabase.from('appointments').select(`
        *,
        patients (
          full_name,
          email,
          phone
        ),
        doctors (
          full_name,
          specialization,
          email
        )
      `);

      if (userRole === 'patient') {
        // Get patient's appointments
        const { data: patientData } = await supabase
          .from('patients')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (patientData) {
          query = query.eq('patient_id', patientData.id);
        }
      } else if (userRole === 'doctor') {
        // Get doctor's appointments
        const { data: doctorData } = await supabase
          .from('doctors')
          .select('id')
          .eq('user_id', user.id)
          .single();
        
        if (doctorData) {
          query = query.eq('doctor_id', doctorData.id);
        }
      }
      // Admin can see all appointments (no additional filtering)

      const { data, error } = await query.order('appointment_date', { ascending: true });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: 'scheduled' | 'completed' | 'cancelled' | 'no_show') => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', appointmentId);

      if (error) throw error;

      setAppointments(prev => 
        prev.map(apt => 
          apt.id === appointmentId ? { ...apt, status } : apt
        )
      );

      toast({
        title: "Success",
        description: `Appointment ${status} successfully`,
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Error",
        description: "Failed to update appointment",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      scheduled: "default",
      completed: "default",
      cancelled: "destructive",
      no_show: "secondary"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "default"}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const canUpdateStatus = (appointment: any) => {
    if (userRole === 'admin') return true;
    if (userRole === 'doctor') return true;
    if (userRole === 'patient' && appointment.status === 'scheduled') return true;
    return false;
  };

  return (
    <AppLayout
      topbar={
        <div className="flex justify-between items-center w-full">
          <h1 className="text-xl font-semibold">
            {userRole === 'patient' ? 'My Appointments' : 
             userRole === 'doctor' ? 'Patient Appointments' : 
             'All Appointments'}
          </h1>
          <div className="text-sm text-muted-foreground">
            {appointments.length} appointments
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Appointments
            </CardTitle>
            <CardDescription>
              {userRole === 'patient' 
                ? 'View and manage your upcoming and past appointments'
                : userRole === 'doctor'
                ? 'Manage your patient appointments'
                : 'View and manage all appointments in the system'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading appointments...</div>
            ) : appointments.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    {userRole !== 'patient' && <TableHead>Patient</TableHead>}
                    {userRole !== 'doctor' && <TableHead>Doctor</TableHead>}
                    <TableHead>Symptoms</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.map((appointment) => (
                    <TableRow key={appointment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">
                              {new Date(appointment.appointment_date).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {appointment.appointment_time}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      
                      {userRole !== 'patient' && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            <div>
                              <div className="font-medium">
                                {appointment.patients?.full_name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {appointment.patients?.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      )}
                      
                      {userRole !== 'doctor' && (
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {appointment.doctors?.full_name}
                            </div>
                            <div className="text-sm text-muted-foreground capitalize">
                              {appointment.doctors?.specialization?.replace('_', ' ')}
                            </div>
                          </div>
                        </TableCell>
                      )}
                      
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm truncate" title={appointment.symptoms}>
                            {appointment.symptoms}
                          </p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {getStatusBadge(appointment.status)}
                      </TableCell>
                      
                      <TableCell>
                        <div className="max-w-xs">
                          {appointment.notes ? (
                            <p className="text-sm truncate" title={appointment.notes}>
                              {appointment.notes}
                            </p>
                          ) : (
                            <span className="text-muted-foreground text-sm">No notes</span>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex gap-1">
                          {canUpdateStatus(appointment) && appointment.status === 'scheduled' && (
                            <>
                              {userRole === 'doctor' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateAppointmentStatus(appointment.id, 'completed')}
                                >
                                  Complete
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateAppointmentStatus(appointment.id, 'cancelled')}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No appointments found.</p>
                {userRole === 'patient' && (
                  <p className="text-sm mt-2">
                    Visit the <a href="/doctors" className="text-primary hover:underline">Doctors</a> page to book an appointment.
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Appointments;