"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashNavbar from "@/components/navbar/DashNavbar";
import { authClient } from "@/lib/auth-client";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return null;
  const user = session.user;

  return (
    <>
      <DashNavbar />

      <div className="min-h-screen bg-black pt-24 px-4 pb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Your Profile</h1>

          <NeonGradientCard className="w-full !bg-[#171717] [&>*]:!bg-[#171717]">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Account Information</h2>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400 w-32 font-medium mb-1 sm:mb-0">Name</span>
                  <span className="text-white">{user.name || "N/A"}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400 w-32 font-medium mb-1 sm:mb-0">Email</span>
                  <span className="text-white">{user.email}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-gray-800">
                  <span className="text-gray-400 w-32 font-medium mb-1 sm:mb-0">Status</span>
                  <span className="text-white">
                    {user.emailVerified ? (
                      <span className="text-green-400 bg-green-900/30 px-2 py-1 rounded text-sm border border-green-800">Verified</span>
                    ) : (
                      <span className="text-yellow-400 bg-yellow-900/30 px-2 py-1 rounded text-sm border border-yellow-800">Pending Verification</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-800 flex justify-between items-center">
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-red-600/20 hover:bg-red-600/40 border border-red-800 text-red-400 rounded-md transition-colors font-medium"
                >
                  Logout
                </button>
                
                <button
                  onClick={() => router.push('/savedJobs')}
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors font-medium shadow-[0_0_15px_rgba(8,145,178,0.3)]"
                >
                  See All Saved Jobs
                </button>
              </div>
            </div>
          </NeonGradientCard>
        </div>
      </div>
    </>
  );
}
