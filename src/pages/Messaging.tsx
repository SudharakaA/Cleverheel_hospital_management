
import React from "react";
import AppLayout from "@/components/AppLayout";

const Messaging: React.FC = () => (
  <AppLayout>
    <section>
      <h2 className="text-2xl font-bold mb-2">Messages</h2>
      <p className="text-muted-foreground mb-6">Securely chat with your care providers and review previous messages.</p>
      <div className="rounded border p-8 text-center text-gray-400">
        (Messaging system coming soon)
      </div>
    </section>
  </AppLayout>
);

export default Messaging;
