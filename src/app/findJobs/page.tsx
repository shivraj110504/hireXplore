"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashNavbar from "@/components/navbar/DashNavbar";
import ResumeUpload from "@/components/resume/ResumeUpload";
import JobGrid from "@/components/jobs/JobGrid";
import { authClient } from "@/lib/auth-client";
import confetti from "canvas-confetti";

export default function FindJobsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [jobs, setJobs] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  const handleJobsFetched = (fetchedJobs: any[]) => {
    setJobs(fetchedJobs);
    if (fetchedJobs.length > 0) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  };

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

  return (
    <>
      <DashNavbar />

      <div className="min-h-screen bg-bg-main pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-center text-4xl md:text-5xl font-bold text-text-primary mb-4">
              Find Your Perfect Match
            </h1>
            <p className="text-center text-text-muted text-lg">
              Upload your resume and let AI scan the web for your perfect job matches.
            </p>
          </div>

          <div className="text-center mb-12">
            <p className="font-bold text-text-primary mb-4">
              We are currently searching for PUNE, BENGLURU, MUMBAI and REMOTE
            </p>
            <p className="text-text-muted text-lg">
              We will be available to all locations soon.
            </p>
          </div>

          {!(jobs.length > 0 && !isFetching) && (
            <div className="mb-16">
              <ResumeUpload 
                onJobsFetched={handleJobsFetched} 
                isFetching={isFetching} 
                setIsFetching={setIsFetching} 
              />
            </div>
          )}

          {(jobs.length > 0) && !isFetching && (
            <div className="mb-12 p-6 rounded-xl bg-status-success/10 border border-status-success/30 text-center shadow-[0_0_20px_var(--color-status-success)]">
              <span className="text-3xl mb-2 block">✅</span>
              <h2 className="text-2xl font-bold text-status-success">Here's all your matching jobs!</h2>
            </div>
          )}

          {(jobs.length > 0 || isFetching) && (
            <div id="results" className="mt-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-text-primary mb-2">Your Job Matches</h2>
                <p className="text-text-muted mb-4">
                  AI has scored and ranked these jobs based on your resume.
                </p>
                <div className="bg-status-warning/20 border border-status-warning rounded-lg p-4 flex items-start space-x-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <h4 className="text-status-warning font-semibold mb-1">Temporary Results</h4>
                    <p className="text-status-warning text-sm">
                      These jobs are fetched dynamically and will be lost if you refresh the page. 
                      If you want to keep them, please click the <strong>Save Job</strong> button on the cards below.
                    </p>
                  </div>
                </div>
              </div>
              
              <JobGrid jobs={jobs} />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
