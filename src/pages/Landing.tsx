
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";

const heroImg = "/hospital.jpg.jpg";

const features = [
  {
    name: "Expert Medical Care",
    description: "Access to specialist doctors across cardiology, neurology, orthopedics, and more with easy appointment booking.",
  },
  {
    name: "Symptom-Based Doctor Search",
    description: "Find the right doctor quickly by searching through symptoms and getting matched with specialists.",
  },
  {
    name: "Comprehensive Health Management",
    description: "Complete patient records, appointment tracking, and seamless communication between patients and doctors.",
  },
  {
    name: "Advanced Admin Dashboard",
    description: "Full administrative control over doctors, patients, and appointments with detailed analytics.",
  },
];

const Landing: React.FC = () => (
  <div className="bg-gradient-to-b from-blue-50 via-white to-white min-h-screen flex flex-col">
    <header className="w-full px-4 sm:px-8 py-6">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        <span className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-primary">
          <span className="text-blue-600">Clever</span>
          <span className="text-green-600">Heal</span>
        </span>
        <div className="flex items-center gap-4">
          <Link to="/auth?tab=login">
            <Button variant="ghost" size="sm" className="font-medium">
              Patient Login
            </Button>
          </Link>
          <Link to="/auth?tab=doctor-login">
            <Button variant="ghost" size="sm" className="font-medium">
              Doctor Login
            </Button>
          </Link>
          <Link to="/auth?tab=admin-login">
            <Button variant="ghost" size="sm" className="font-medium">
              Admin Login
            </Button>
          </Link>
          <Link to="/auth?tab=register">
            <Button size="sm">Register as Patient</Button>
          </Link>
        </div>
      </div>
    </header>
    <main className="flex-1 flex flex-col justify-center">
      <section className="max-w-4xl mx-auto w-full px-4 sm:px-8 flex flex-col-reverse md:flex-row items-center gap-12 py-12">
        <div className="w-full md:w-1/2 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6 text-primary">
            CleverHeal Private Hospital
          </h1>
          <p className="mb-6 text-lg text-muted-foreground">
            Your trusted healthcare partner providing expert medical care with cutting-edge technology. Book appointments, search doctors by symptoms, and manage your health records seamlessly.
          </p>
          <div className="flex gap-4">
            <Link to="/auth?tab=register">
              <Button size="lg">Register as Patient</Button>
            </Link>
            <Button variant="outline" size="lg" asChild>
              <a href="#features">Our Services</a>
            </Button>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <img
            src={heroImg}
            alt="CleverHeal Hospital"
            className="rounded-xl shadow-lg max-h-[320px] w-full object-cover"
            loading="lazy"
          />
        </div>
      </section>
      <section id="features" className="py-8 px-4 sm:px-0 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">Our Services</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="rounded-lg border bg-white p-6 shadow hover-scale transition"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-2">{feature.name}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      <section className="py-12 px-4 sm:px-0 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-center mb-8 text-primary">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Register & Login</h3>
            <p className="text-muted-foreground text-sm">Create your patient account or login as a doctor/admin with your credentials.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-green-600">2</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Find Doctors</h3>
            <p className="text-muted-foreground text-sm">Search for doctors based on your symptoms and find the right specialist for your needs.</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-lg font-semibold mb-2">Book Appointment</h3>
            <p className="text-muted-foreground text-sm">Schedule your appointment with your preferred date and time slot.</p>
          </div>
        </div>
      </section>

      <section
        id="get-started"
        className="max-w-4xl px-4 mx-auto bg-blue-50 rounded-xl mt-16 py-12 flex flex-col items-center"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-primary text-center">Ready to Get Started?</h2>
        <p className="text-muted-foreground mb-8 text-center max-w-2xl">
          Join CleverHeal today and experience the future of healthcare management. Whether you're a patient seeking care or a medical professional, we have the tools you need.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/auth?tab=register">
            <Button size="lg">Register as Patient</Button>
          </Link>
          <Link to="/auth?tab=login">
            <Button variant="outline" size="lg">Patient Login</Button>
          </Link>
          <Link to="/auth?tab=doctor-login">
            <Button variant="outline" size="lg">Doctor Login</Button>
          </Link>
          <Link to="/auth?tab=admin-login">
            <Button variant="outline" size="lg">Admin Login</Button>
          </Link>
        </div>
      </section>
    </main>
  <Footer />
  </div>
);

export default Landing;
