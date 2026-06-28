"use client";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";

interface ResumeUploadProps {
  onJobsFetched: (jobs: any[]) => void;
  isFetching: boolean;
  setIsFetching: (val: boolean) => void;
}

import { authClient } from "@/lib/auth-client";

export default function ResumeUpload({ onJobsFetched, isFetching, setIsFetching }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isFetching && timeLeft !== null && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isFetching, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".doc") && !selectedFile.name.endsWith(".docx")) {
        toast.error("Invalid file format. Please upload PDF, DOC, or DOCX.");
        return;
      }
      setFile(selectedFile);
      // Clear job duplicate cache so re-uploading ensures a fresh search
      if (session?.user?.id) {
        localStorage.removeItem(`seen_jobs_${session.user.id}`);
      }
    }
  };

  const handleInputClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // Reset the input value so selecting the same file again triggers onChange
    (e.target as HTMLInputElement).value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".doc") && !selectedFile.name.endsWith(".docx")) {
        toast.error("Invalid file format. Please upload PDF, DOC, or DOCX.");
        return;
      }
      setFile(selectedFile);
      if (session?.user?.id) {
        localStorage.removeItem(`seen_jobs_${session.user.id}`);
      }
    }
  };

  const handleSearch = async () => {
    if (!file) {
      toast.error("Please upload a resume first.");
      return;
    }
    if (!session?.user?.id) {
      toast.error("Please log in to search for jobs.");
      return;
    }

    setIsFetching(true);
    setTimeLeft(90); // 1.5 minutes countdown
    toast.info("Scraping live jobs and matching with your profile... This may take a minute.");
    
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('email', session.user.email);
      formData.append('name', session.user.name || "User");

      // Add a timestamp to bypass aggressive browser caching (prevents 304 Not Modified)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/jobs/fetch-all?t=${Date.now()}`, {
        method: "POST",
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        },
        body: formData
      });
      if (!res.ok) throw new Error("Failed to fetch jobs");
      
      const data = await res.json();
      const fetchedJobs = data.jobs || [];

      // Client-side deduplication using localStorage
      const seenKey = `seen_jobs_${session.user.id}`;
      const seenIds = new Set(JSON.parse(localStorage.getItem(seenKey) || "[]"));
      
      const newJobs = fetchedJobs.filter((job: any) => !seenIds.has(job.id));
      
      // Add new jobs to seen set
      newJobs.forEach((job: any) => seenIds.add(job.id));
      localStorage.setItem(seenKey, JSON.stringify(Array.from(seenIds)));
      
      if (data.message && fetchedJobs.length === 0) {
        toast.info(data.message);
      } else if (newJobs.length === 0 && fetchedJobs.length > 0) {
        toast.info("AI found jobs, but you have already seen them all in previous searches!");
      } else {
        toast.success(`Found ${newJobs.length} new matching jobs!`);
      }
      
      onJobsFetched(newJobs);
    } catch (error) {
      console.error(error);
      toast.error("Failed to find jobs. Please try again.");
    } finally {
      setIsFetching(false);
      setTimeLeft(null);
    }
  };

  return (
    <NeonGradientCard className="w-full max-w-2xl mx-auto !bg-[#171717] [&>*]:!bg-[#171717]">
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Upload Your Resume</h2>
        <p className="text-gray-400 mb-6">Supported formats: PDF, DOC, DOCX</p>
        
        <div 
          className={`border-2 border-dashed rounded-xl p-10 mb-6 cursor-pointer transition-colors ${file ? 'border-cyan-500 bg-cyan-950/20' : 'border-gray-600 hover:border-gray-400'}`}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            className="hidden"
            id="resume-upload"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
            onClick={handleInputClick}
            ref={fileInputRef}
          />
          
          {file ? (
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">📄</span>
              <p className="text-white font-medium">{file.name}</p>
              <p className="text-sm text-cyan-400 mt-2">Click or drag to replace</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">☁️</span>
              <p className="text-white font-medium">Drag & drop your resume here</p>
              <p className="text-sm text-gray-500 mt-2">or click to browse</p>
            </div>
          )}
        </div>

        {timeLeft !== null && (
          <div className="mb-6 p-4 rounded-lg border border-cyan-900 bg-cyan-950/30">
            <p className="text-cyan-300 font-semibold mb-2">AI is analyzing and matching your profile...</p>
            <div className="text-4xl font-mono font-bold text-white tracking-wider">
              {formatTime(timeLeft)}
            </div>
            <p className="text-xs text-cyan-500/70 mt-2">Expected processing time</p>
          </div>
        )}

        <button 
          onClick={handleSearch}
          disabled={!file || isFetching}
          className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${
            !file 
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
              : isFetching 
                ? 'bg-cyan-800 text-cyan-200 cursor-wait' 
                : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(8,145,178,0.5)]'
          }`}
        >
          {isFetching ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Finding Matches...
            </span>
          ) : (
            "🔍 Find Matching Jobs"
          )}
        </button>
      </div>
    </NeonGradientCard>
  );
}
