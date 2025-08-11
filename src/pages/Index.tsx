
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Eye, Download, MessageSquare, Book, BarChart2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import HomeDashboard from "@/components/widgets/HomeDashboard";

// Logo placeholder, can be swapped for actual logo later
const Logo = () => (
  <span className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-primary">
    <span className="text-blue-600">Medi</span>
    <span className="text-green-600">Track</span>
  </span>
);

const SERVICES = [
  {
    icon: Calendar,
    label: "Book Appointments",
    desc: "Schedule and manage appointments with your preferred doctor."
  },
  {
    icon: Eye,
    label: "View Medical Records",
    desc: "Access your medical history, prescriptions, and diagnoses."
  },
  {
    icon: Download,
    label: "Download Lab Reports",
    desc: "View and download your lab test results securely."
  },
  {
    icon: MessageSquare,
    label: "Chat with Doctors",
    desc: "Communicate with doctors for follow-ups or questions."
  },
  {
    icon: BarChart2,
    label: "Health Monitoring",
    desc: "Visualize blood pressure, sugar, and other health stats."
  },
  {
    icon: Book,
    label: "Upcoming Visits",
    desc: "Get reminders for your next visit or appointment."
  },
];

const WHY_US = [
  { label: "Secure & Private" },
  { label: "Available 24/7" },
  { label: "Verified Medical Professionals" },
  { label: "Easy-to-use Interface" },
  { label: "Access From Any Device" },
];

const Index: React.FC = () => {
  const { user, userRole, profile, signOut, loading } = useAuth();
  const navigate = useNavigate();

  // Use effect to handle redirects to prevent infinite loops
  useEffect(() => {
    if (user && userRole && !loading) {
      const userName = profile?.first_name || profile?.email || 'User';
      
      console.log('User authenticated with role:', userRole, 'User:', userName);
      console.log('Full user object:', user);
      console.log('Loading state:', loading);
      console.log('Profile:', profile);
      
      // Redirect admin users to admin panel
      if (userRole === 'admin') {
        console.log('Redirecting admin to admin panel');
        navigate('/admin-panel', { replace: true });
        return;
      }
      
      // Redirect doctor users to doctor dashboard
      if (userRole === 'doctor') {
        console.log('Redirecting doctor to doctor dashboard');
        navigate('/doctor-dashboard', { replace: true });
        return;
      }
      
      // Redirect patient users to patient dashboard
      if (userRole === 'patient') {
        console.log('Redirecting patient to patient dashboard');
        navigate('/patient-dashboard', { replace: true });
        return;
      }
    }
  }, [user, userRole, loading, profile, navigate]);

  // If user is authenticated and we have a role, show loading or fallback
  if (user && userRole && !loading) {
    const userName = profile?.first_name || profile?.email || 'User';
    
    // Show fallback dashboard while redirect is happening
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <HomeDashboard role={userRole} userName={userName} />
        </div>
      </Layout>
    );
  }

  // Add debug logging for when user is authenticated but conditions aren't met
  if (user && !loading) {
    console.log('User authenticated but not redirecting - userRole:', userRole, 'loading:', loading);
    console.log('User:', user);
    console.log('Profile:', profile);
  }

  // Show loading state
  if (loading) {
    return (
      <Layout showFooter={false}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Logo />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // Show landing page for non-authenticated users
  return (
    <Layout showFooter={true}>
      <div className="bg-gradient-to-b from-blue-50 via-white to-white">
        {/* Hero Section */}
        <section className="w-full flex flex-col items-center justify-center text-center py-12 px-4 animate-fade-in">
          <Logo />
          <h1 className="text-3xl sm:text-5xl font-bold mt-3 mb-2 text-primary">
            Your health, your records — all in one secure place.
          </h1>
          <p className="mb-8 text-lg text-muted-foreground max-w-xl mx-auto">
            Welcome to CleverHeal, your trusted companion for managing appointments, accessing records, and staying connected with your healthcare team.
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
            >
              Get Started
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/auth')}
            >
              Sign In
            </Button>
          </div>
        </section>

        {/* Services We Provide */}
        <section className="max-w-5xl mx-auto w-full px-4 py-8 sm:py-14">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center text-primary">Services We Provide</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {SERVICES.map((svc) => {
              const Icon = svc.icon;
              return (
                <Card
                  key={svc.label}
                  className="group hover:shadow-lg hover:scale-105 transition-all duration-200 border-primary/10"
                >
                  <CardContent className="flex flex-col items-center p-6 gap-4">
                    <div className="rounded-full bg-blue-100 group-hover:bg-blue-50 transition p-3 mb-2">
                      <Icon className="text-primary" size={32} />
                    </div>
                    <h3 className="font-semibold text-lg text-blue-900 text-center">{svc.label}</h3>
                    <p className="text-muted-foreground text-center text-sm">{svc.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="max-w-4xl mx-auto w-full px-4 py-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center text-primary">Why Choose Us?</h2>
          <ul className="flex flex-wrap gap-6 justify-center">
            {WHY_US.map((item) => (
              <li key={item.label} className="min-w-[170px] flex items-center gap-2 bg-green-50 border border-green-100 px-5 py-4 rounded-lg shadow-sm text-green-900 font-medium text-base justify-center">
                <span className="inline-block w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                {item.label}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Layout>
  );
};

export default Index;
