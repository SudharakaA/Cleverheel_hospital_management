
import React from "react";
import AppLayout from "@/components/AppLayout";

const Profile: React.FC = () => (
  <AppLayout>
    <section>
      <h2 className="text-2xl font-bold mb-2">My Profile</h2>
      <p className="text-muted-foreground mb-6">Manage your contact info, photo, and account details.</p>
      <div className="rounded border p-8 text-center text-gray-400">
        (Profile page coming soon)
      </div>
    </section>
  </AppLayout>
);

export default Profile;
