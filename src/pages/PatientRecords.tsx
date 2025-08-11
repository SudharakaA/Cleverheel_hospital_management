
import React from "react";
import AppLayout from "@/components/AppLayout";

const PatientRecords: React.FC = () => (
  <AppLayout>
    <section>
      <h2 className="text-2xl font-bold mb-2">Patient Records Management</h2>
      <p className="text-muted-foreground mb-6">
        Search, view, and update patient records. (Coming soon)
      </p>
      <div className="rounded border p-8 text-center text-gray-400">
        (Patient Records page placeholder)
      </div>
    </section>
  </AppLayout>
);

export default PatientRecords;
