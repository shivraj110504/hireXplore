"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";

interface ResumeUploadProps {
  onJobsFetched: (jobs: any[]) => void;
  isFetching: boolean;
  setIsFetching: (val: boolean) => void;
}

import { authClient } from "@/lib/auth-client";

function base64ToFile(base64String: string, filename: string, mimeType: string): File {
  const byteString = atob(base64String);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([ab], { type: mimeType });
  return new File([blob], filename, { type: mimeType });
}

export default function ResumeUpload({ onJobsFetched, isFetching, setIsFetching }: ResumeUploadProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const { data: session } = authClient.useSession();
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // Fetch saved resume on mount
  useEffect(() => {
    async function loadSavedResume() {
      if (!session) return;
      try {
        const res = await fetch("/api/resume");
        if (res.ok) {
          const data = await res.json();
          if (data.resume) {
            const savedFile = base64ToFile(data.resume.data, data.resume.fileName, data.resume.fileType);
            setFile(savedFile);
          }
        }
      } catch (err) {
        console.error("Failed to load saved resume:", err);
      } finally {
        setIsLoadingSaved(false);
      }
    }
    loadSavedResume();
  }, [session]);

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

  const saveResumeToDB = async (selectedFile: File) => {
    if (!session) return;
    const formData = new FormData();
    formData.append("resume", selectedFile);
    try {
      await fetch("/api/resume", {
        method: "POST",
        body: formData,
      });
      toast.success("Resume saved to your profile!");
      
      setPendingFile(selectedFile);
      setShowPopup(true);
      
    } catch (e) {
      console.error("Failed to save resume", e);
    }
  };

  const handlePopupYes = async () => {
    setShowPopup(false);
    if (!pendingFile) return;
    const formData = new FormData();
    formData.append("resume", pendingFile);
    toast.info("Extracting details from resume...");
    try {
      const res = await fetch("/api/resume/parse", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.details || `Server returned ${res.status}`);
      }
      
      toast.success("Profile updated successfully!");
      router.refresh();
    } catch(err: any) {
      console.error(err);
      toast.error(`Failed to update profile: ${err.message}`);
    }
    setPendingFile(null);
  };

  const handlePopupNo = () => {
    setShowPopup(false);
    setPendingFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf" && !selectedFile.name.endsWith(".doc") && !selectedFile.name.endsWith(".docx")) {
        toast.error("Invalid file format. Please upload PDF, DOC, or DOCX.");
        return;
      }
      setFile(selectedFile);
      saveResumeToDB(selectedFile);
      
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
      saveResumeToDB(selectedFile);

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

  if (isLoadingSaved) {
    return (
      <NeonGradientCard className="w-full max-w-2xl mx-auto !bg-bg-card [&>*]:!bg-bg-card">
        <div className="p-8 text-center flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-2 border-border-focus border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-text-muted">Loading your profile...</p>
        </div>
      </NeonGradientCard>
    );
  }

  return (
    <NeonGradientCard className="w-full max-w-2xl mx-auto !bg-bg-card [&>*]:!bg-bg-card">
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-text-primary mb-2">Upload Your Resume</h2>
        <p className="text-text-muted mb-6">Supported formats: PDF, DOC, DOCX</p>
        
          <div 
            className={`border-2 border-dashed rounded-xl p-10 mb-6 cursor-pointer transition-colors ${file ? 'border-border-focus bg-brand-primary/10 shadow-[0_0_20px_var(--color-brand-primary)]' : 'border-border-default hover:border-brand-accent/50 hover:bg-bg-hover/30'}`}
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
              <p className="text-text-primary font-medium">{file.name}</p>
              <p className="text-sm text-brand-accent mt-2 font-medium bg-brand-primary/20 px-4 py-1.5 rounded-full border border-brand-primary/30">Click or drag to replace</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-4xl mb-2">☁️</span>
              <p className="text-text-primary font-medium">Drag & drop your resume here</p>
              <p className="text-sm text-text-disabled mt-2">or click to browse</p>
            </div>
          )}
        </div>

        {timeLeft !== null && (
          <div className="mb-6 p-4 rounded-lg border border-border-focus bg-brand-primary/20 shadow-[0_0_20px_var(--color-brand-primary)]">
            <p className="text-brand-accent font-semibold mb-2">AI is analyzing and matching your profile...</p>
            <div className="text-4xl font-mono font-bold text-text-primary tracking-wider">
              {formatTime(timeLeft)}
            </div>
            <p className="text-xs text-text-secondary mt-2">Expected processing time</p>
          </div>
        )}

        <button 
          onClick={handleSearch}
          disabled={!file || isFetching}
          className={`w-full py-3 rounded-lg font-bold text-lg transition-all ${
            !file 
              ? 'bg-bg-hover text-text-disabled cursor-not-allowed' 
              : isFetching 
                ? 'bg-border-hover text-brand-primary cursor-wait' 
                : 'bg-brand-primary hover:bg-brand-primary-hover text-text-primary shadow-[0_0_15px_rgba(8,145,178,0.5)]'
          }`}
        >
          {isFetching ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-5 h-5 border-2 border-border-default border-t-transparent rounded-full animate-spin"></span>
              Finding Matches...
            </span>
          ) : (
            "🚀 Find Matching Jobs"
          )}
        </button>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-bg-card-elevated border border-border-focus rounded-2xl p-6 shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-text-primary mb-2">Update Profile?</h3>
            <p className="text-text-secondary text-sm mb-6">
              Would you like us to automatically extract your skills, education, and experience from this resume and update your profile?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={handlePopupNo}
                className="flex-1 py-2 rounded-lg bg-bg-hover text-text-primary font-medium hover:bg-border-default transition-colors"
              >
                No, skip
              </button>
              <button 
                onClick={handlePopupYes}
                className="flex-1 py-2 rounded-lg bg-brand-primary hover:bg-brand-primary-hover text-white font-medium transition-colors shadow-lg"
              >
                Yes, update it
              </button>
            </div>
          </div>
        </div>
      )}
    </NeonGradientCard>
  );
}
