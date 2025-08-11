
import React from "react";
import AppLayout from "@/components/AppLayout";

const MedicalRecords: React.FC = () => (
  <AppLayout>
    <section>
      <h2 className="text-2xl font-bold mb-2">Medical Records</h2>
      <p className="text-muted-foreground mb-6">Review your diagnoses, prescriptions, lab files, and more.</p>
      <div className="rounded border p-8 text-center text-gray-400">
        (Medical Records page coming soon)
      </div>
    </section>
  </AppLayout>
);

export default MedicalRecords;
