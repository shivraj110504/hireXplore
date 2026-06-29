"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashNavbar from "@/components/navbar/DashNavbar";
import { authClient } from "@/lib/auth-client";
import { HeroSparkles } from "@/components/hero/HeroSparkles";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-border-focus border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-primary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;
  const user = session.user;

  return (
    <>
      <DashNavbar />
      <HeroSparkles isDashboard={true} userName={user.name || "User"} />
      
      <div className="bg-bg-main py-16 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Welcome to your AI Hub</h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Your personalized command center for navigating the modern job market. Our AI is continuously scanning and ranking opportunities tailored specifically to your unique skill set.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-bg-card rounded-2xl p-8 border border-border-default shadow-lg hover:border-brand-primary transition-all duration-300">
              <div className="w-14 h-14 bg-brand-primary/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">AI-Powered Search</h3>
              <p className="text-text-muted">
                Our proprietary matching algorithm analyzes your resume against millions of active job listings across multiple platforms simultaneously.
              </p>
            </div>
            
            <div className="bg-bg-card rounded-2xl p-8 border border-border-default shadow-lg hover:border-brand-primary transition-all duration-300">
              <div className="w-14 h-14 bg-brand-primary/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">Precision Matching</h3>
              <p className="text-text-muted">
                Stop wasting time on irrelevant roles. We calculate a precise match score based on required skills, missing skills, and your exact experience level.
              </p>
            </div>
            
            <div className="bg-bg-card rounded-2xl p-8 border border-border-default shadow-lg hover:border-brand-primary transition-all duration-300">
              <div className="w-14 h-14 bg-brand-primary/20 rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">💼</span>
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-3">One-Click Apply</h3>
              <p className="text-text-muted">
                Found the perfect match? Our dynamic routing system instantly connects you to the exact application page on the native platform.
              </p>
            </div>
          </div>
          
          <div className="mt-16 bg-bg-card-elevated rounded-3xl p-10 border border-brand-primary/30 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_0_40px_rgba(123,63,228,0.15)]">
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">Ready to find your next role?</h3>
              <p className="text-text-secondary">Upload your latest resume and let our AI do the heavy lifting.</p>
            </div>
            <button 
              onClick={() => router.push('/findJobs')}
              className="px-8 py-4 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-xl font-bold transition-all shadow-[0_0_20px_var(--color-brand-primary)] flex-shrink-0"
            >
              Start AI Search
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
