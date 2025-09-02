
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

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
    <section className="max-w-6xl mx-auto w-full px-6 sm:px-12 flex flex-col-reverse md:flex-row items-center gap-12 py-20">
      {/* Left Content */}
      <div className="w-full md:w-1/2 animate-fade-in space-y-6">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          CleverHeal Private Hospital
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
          Your trusted healthcare partner providing expert medical care with 
          cutting-edge technology. Book appointments, search doctors by symptoms, 
          and manage your health records seamlessly.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 pt-4">
          <Link to="/auth?tab=register">
            <Button size="lg" className="rounded-xl shadow-md hover:shadow-xl transition">
              Register as Patient
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="rounded-xl border-2 hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white transition"
            asChild
          >
            <a href="#features">Our Services</a>
          </Button>
        </div>
      </div>

      {/* Right Image */}
      <div className="w-full md:w-1/2 flex justify-center relative">
        <div className="absolute -z-10 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full top-12 right-12 animate-pulse"></div>
        <img
          src={heroImg}
          alt="CleverHeal Hospital"
          className="rounded-2xl shadow-2xl max-h-[400px] w-full object-cover hover:scale-[1.02] transition-transform duration-500"
          loading="lazy"
        />
      </div>
    </section>

    <section
      id="features"
      className="py-16 px-6 sm:px-0 max-w-6xl mx-auto w-full"
    >
      {/* Title */}
      <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Our Services
      </h2>

      {/* Features Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {features.map((feature, i) => (
          <div
            key={feature.name}
            className="rounded-2xl border border-gray-100 bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
          >
            {/* Icon Placeholder (optional) */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
              <span className="text-xl font-bold">{i + 1}</span>
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
              {feature.name}
            </h3>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>

    <section className="py-20 px-6 sm:px-0 max-w-6xl mx-auto w-full">
  {/* How It Works */}
  <h2 className="text-4xl font-extrabold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
    How It Works
  </h2>

  <div className="grid md:grid-cols-3 gap-10">
    {[
      {
        step: "1",
        color: "from-blue-500 to-blue-700",
        title: "Register & Login",
        desc: "Create your patient account or login as a doctor/admin with your credentials.",
      },
      {
        step: "2",
        color: "from-green-500 to-emerald-600",
        title: "Find Doctors",
        desc: "Search for doctors based on your symptoms and find the right specialist for your needs.",
      },
      {
        step: "3",
        color: "from-purple-500 to-pink-600",
        title: "Book Appointment",
        desc: "Schedule your appointment with your preferred date and time slot.",
      },
    ].map(({ step, color, title, desc }) => (
      <div
        key={step}
        className="text-center rounded-2xl bg-white/80 dark:bg-gray-900/70 backdrop-blur-lg p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
      >
        <div
          className={`w-16 h-16 bg-gradient-to-r ${color} rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold shadow-md`}
        >
          {step}
        </div>
        <h3 className="text-xl font-semibold mb-3">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          {desc}
        </p>
      </div>
    ))}
  </div>
</section>

{/* Get Started CTA */}
<section
  id="get-started"
  className="max-w-5xl px-6 mx-auto bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl mt-20 py-16 text-center shadow-lg"
>
  <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 text-primary">
    Ready to Get Started?
  </h2>
  <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
    Join CleverHeal today and experience the future of healthcare management. 
    Whether you're a patient seeking care or a medical professional, we have the tools you need.
  </p>

  <div className="flex flex-wrap gap-4 justify-center">
    <Link to="/auth?tab=register">
      <Button size="lg" className="rounded-xl shadow-md hover:shadow-xl transition">
        Register as Patient
      </Button>
    </Link>
    <Link to="/auth?tab=login">
      <Button variant="outline" size="lg" className="rounded-xl">
        Patient Login
      </Button>
    </Link>
    <Link to="/auth?tab=doctor-login">
      <Button variant="outline" size="lg" className="rounded-xl">
        Doctor Login
      </Button>
    </Link>
    <Link to="/auth?tab=admin-login">
      <Button variant="outline" size="lg" className="rounded-xl">
        Admin Login
      </Button>
    </Link>
  </div>
</section>
</main>

{/* Footer */}
<footer className="w-full text-center text-sm text-gray-500 dark:text-gray-400 py-8 mt-16 border-t border-gray-200 dark:border-gray-700">
<p>
    &copy; {new Date().getFullYear()} <span className="font-semibold text-primary">CleverHeal Private Hospital</span>. All rights reserved.  
  </p>
</footer>
</div>
);

export default Landing;
