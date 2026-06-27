"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashNavbar from "@/components/navbar/DashNavbar";
import ResumeUpload from "@/components/resume/ResumeUpload";
import JobGrid from "@/components/jobs/JobGrid";
import { authClient } from "@/lib/auth-client";

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

  if (isPending) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <>
      <DashNavbar />

      <div className="min-h-screen bg-black pt-24 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h1 className="text-center text-4xl md:text-5xl font-bold text-white mb-4">
              Find Your Perfect Match
            </h1>
            <p className="text-center text-gray-400 text-lg">
              Upload your resume and let AI scan the web for your perfect job matches.
            </p>
          </div>

          <div className="text-center mb-12">
            <p className="font-bold text-white mb-4">
              We are currently searching for PUNE, BENGLURU, MUMBAI and REMOTE
            </p>
            <p className="text-gray-400 text-lg">
              We will be available to all locations soon.
            </p>
          </div>

          <div className="mb-16">
            <ResumeUpload 
              onJobsFetched={setJobs} 
              isFetching={isFetching} 
              setIsFetching={setIsFetching} 
            />
          </div>

          {(jobs.length > 0 || isFetching) && (
            <div id="results" className="mt-12">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Your Job Matches</h2>
                <p className="text-gray-400 mb-4">
                  AI has scored and ranked these jobs based on your resume.
                </p>
                <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-lg p-4 flex items-start space-x-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-1">Temporary Results</h4>
                    <p className="text-yellow-200/80 text-sm">
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
