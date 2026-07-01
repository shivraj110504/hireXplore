"use client";

import DashNavbar from "@/components/navbar/DashNavbar";
import { Bell } from "lucide-react";

export default function NotificationsPage() {
  return (
    <>
      <DashNavbar />
      <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-4">
        <div className="bg-bg-card border border-border-default rounded-2xl p-12 shadow-2xl flex flex-col items-center max-w-md w-full text-center">
          <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6 border border-brand-primary/30 shadow-[0_0_15px_rgba(123,63,228,0.2)]">
            <Bell className="w-10 h-10 text-brand-primary animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-3">Notifications</h1>
          <p className="text-text-secondary">
            We are working hard on bringing you real-time job alerts and profile updates.
          </p>
          <div className="mt-8 px-6 py-2 bg-brand-accent/10 text-brand-accent rounded-full text-sm font-semibold border border-brand-accent/20">
            Coming Soon 🚀
          </div>
        </div>
      </div>
    </>
  );
}
