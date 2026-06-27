"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashNavbar from "@/components/navbar/DashNavbar";
import { authClient } from "@/lib/auth-client";
import JobGrid from "@/components/jobs/JobGrid";

export default function SavedJobsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (!session) return;
    
    const fetchSavedJobs = async () => {
      try {
        const res = await fetch("/api/saved-jobs");
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
        }
      } catch (err) {
        console.error("Failed to fetch saved jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSavedJobs();
  }, [session]);

  const handleRemove = (id: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <>
      <DashNavbar />

      <div className="min-h-screen bg-black pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Saved Jobs</h1>
          </div>
          
          <div className="w-full">
            {jobs.length === 0 ? (
              <div className="text-center py-20 bg-[#171717] rounded-xl border border-gray-800">
                <span className="text-5xl mb-4 block">🔖</span>
                <h3 className="text-xl font-medium text-white mb-2">No saved jobs yet</h3>
                <p className="text-gray-400 mb-6">Jobs you save will appear here for easy access.</p>
                <button 
                  onClick={() => router.push('/findJobs')}
                  className="px-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-md transition-colors font-medium shadow-[0_0_15px_rgba(8,145,178,0.3)]"
                >
                  Find Jobs Now
                </button>
              </div>
            ) : (
              <JobGrid jobs={jobs} isProfileView={true} onRemove={handleRemove} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
