"use client";

import { useState } from "react";
import DashNavbar from "@/components/navbar/DashNavbar";
import { User, Shield, FileText, Settings as SettingsIcon, LogOut, ChevronRight, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("general");

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      <DashNavbar />
      <div className="min-h-screen bg-bg-main pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="md:w-64 space-y-2">
            <h1 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2">
              <SettingsIcon className="w-6 h-6 text-brand-primary" /> Settings
            </h1>
            
            <button 
              onClick={() => setActiveTab("general")}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${activeTab === "general" ? "bg-brand-primary/10 text-brand-primary font-semibold" : "text-text-secondary hover:bg-bg-hover"}`}
            >
              <span className="flex items-center gap-3"><User className="w-5 h-5"/> General</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button 
              onClick={() => setActiveTab("privacy")}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${activeTab === "privacy" ? "bg-brand-primary/10 text-brand-primary font-semibold" : "text-text-secondary hover:bg-bg-hover"}`}
            >
              <span className="flex items-center gap-3"><Shield className="w-5 h-5"/> Privacy</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            
            <button 
              onClick={() => setActiveTab("legal")}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${activeTab === "legal" ? "bg-brand-primary/10 text-brand-primary font-semibold" : "text-text-secondary hover:bg-bg-hover"}`}
            >
              <span className="flex items-center gap-3"><FileText className="w-5 h-5"/> Legal</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="pt-8 mt-8 border-t border-border-default">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-status-error hover:bg-status-error/10 transition-colors"
              >
                <LogOut className="w-5 h-5"/> Logout
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === "general" && (
              <div className="space-y-6">
                <div className="bg-bg-card border border-border-default rounded-2xl p-6 shadow-sm">
                  <h2 className="text-xl font-bold text-text-primary mb-4">Profile Settings</h2>
                  <p className="text-text-secondary mb-6 text-sm">Update your personal details, summary, and links.</p>
                  <Link href="/profile/edit" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg transition-colors font-medium">
                    Edit Profile
                  </Link>
                </div>

                <div className="bg-bg-card border border-status-error/20 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-status-error"></div>
                  <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-status-error" /> Danger Zone
                  </h2>
                  <p className="text-text-secondary mb-6 text-sm">Permanently delete your account and all associated data.</p>
                  <button 
                    disabled
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-bg-main border border-status-error text-status-error rounded-lg opacity-50 cursor-not-allowed font-medium"
                    title="Account deletion is temporarily disabled"
                  >
                    Delete Account
                  </button>
                  <p className="text-xs text-text-muted mt-3 italic">This feature is temporarily disabled for maintenance.</p>
                </div>
              </div>
            )}

            {activeTab === "privacy" && (
              <div className="bg-bg-card border border-border-default rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-text-primary mb-4">Privacy Policy</h2>
                <div className="text-text-secondary text-sm space-y-4">
                  <p>Your privacy is important to us. This privacy policy explains how we collect, use, and share your personal information.</p>
                  <h3 className="text-text-primary font-semibold text-base mt-6">Data Collection</h3>
                  <p>We collect data you provide directly to us, such as when you create an account, update your profile, or upload a resume.</p>
                  <h3 className="text-text-primary font-semibold text-base mt-6">Data Usage</h3>
                  <p>We use your data to provide and improve our services, match you with relevant jobs, and communicate with you.</p>
                  <h3 className="text-text-primary font-semibold text-base mt-6">Data Protection</h3>
                  <p>We implement strict security measures to protect your data from unauthorized access or disclosure.</p>
                </div>
              </div>
            )}

            {activeTab === "legal" && (
              <div className="bg-bg-card border border-border-default rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-text-primary mb-4">Terms of Service</h2>
                <div className="text-text-secondary text-sm space-y-4">
                  <p>By using our services, you agree to these Terms of Service.</p>
                  <h3 className="text-text-primary font-semibold text-base mt-6">User Conduct</h3>
                  <p>You agree not to use the service for any illegal or unauthorized purpose. You must not, in the use of the service, violate any laws in your jurisdiction.</p>
                  <h3 className="text-text-primary font-semibold text-base mt-6">Account Responsibility</h3>
                  <p>You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
