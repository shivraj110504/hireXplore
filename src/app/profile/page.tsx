"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import DashNavbar from "@/components/navbar/DashNavbar";
import { authClient } from "@/lib/auth-client";
import { MagicCard } from "@/components/magicui/magic-card";
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [savedResume, setSavedResume] = useState<{ fileName: string; updatedAt: string } | null>(null);
  const [isLoadingResume, setIsLoadingResume] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const fetchResume = async () => {
    setIsLoadingResume(true);
    try {
      const res = await fetch("/api/resume");
      if (res.ok) {
        const data = await res.json();
        setSavedResume(data.resume || null);
      }
    } catch (err) {
      console.error("Failed to fetch resume", err);
    } finally {
      setIsLoadingResume(false);
    }
  };

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    } else if (session) {
      fetchResume();
    }
  }, [isPending, session, router]);

  const handleDeleteResume = async () => {
    if (!confirm("Are you sure you want to delete your saved resume?")) return;
    try {
      const res = await fetch("/api/resume", { method: "DELETE" });
      if (res.ok) {
        toast.success("Resume deleted successfully");
        setSavedResume(null);
      } else {
        toast.error("Failed to delete resume");
      }
    } catch (err) {
      console.error("Delete resume error", err);
      toast.error("An error occurred while deleting your resume");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.endsWith(".doc") && !file.name.endsWith(".docx")) {
      toast.error("Invalid file format. Please upload PDF, DOC, or DOCX.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Resume updated successfully!");
        fetchResume(); // Refresh the resume data
      } else {
        toast.error("Failed to upload resume.");
      }
    } catch (err) {
      console.error("Upload error", err);
      toast.error("An error occurred during upload.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-border-focus border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return null;
  const user = session.user;

  return (
    <>
      <DashNavbar />

      <div className="min-h-screen bg-bg-main pt-24 px-4 pb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-text-primary mb-8">Your Profile</h1>

          <MagicCard className="w-full mb-8 flex-col bg-bg-card border border-border-default shadow-2xl" gradientColor="#2A2345">
            <div className="p-6 relative z-10">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Account Information</h2>

              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-border-default">
                  <span className="text-text-muted w-32 font-medium mb-1 sm:mb-0">Name</span>
                  <span className="text-text-primary">{user.name || "N/A"}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-border-default">
                  <span className="text-text-muted w-32 font-medium mb-1 sm:mb-0">Email</span>
                  <span className="text-text-primary">{user.email}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center py-3 border-b border-border-default">
                  <span className="text-text-muted w-32 font-medium mb-1 sm:mb-0">Status</span>
                  <span className="text-text-primary">
                    {user.emailVerified ? (
                      <span className="text-status-success bg-status-success/20 px-2 py-1 rounded text-sm border border-status-success">Verified</span>
                    ) : (
                      <span className="text-status-warning bg-status-warning/20 px-2 py-1 rounded text-sm border border-status-warning">Pending Verification</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border-default flex justify-between items-center">
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-status-error/20 hover:bg-status-error/40 border border-status-error/50 text-status-error rounded-md transition-colors font-medium"
                >
                  Logout
                </button>
                
                <button
                  onClick={() => router.push('/savedJobs')}
                  className="px-6 py-2 bg-brand-primary hover:bg-brand-primary-hover text-text-primary rounded-md transition-colors font-medium shadow-[0_0_15px_rgba(8,145,178,0.3)]"
                >
                  See All Saved Jobs
                </button>
              </div>
            </div>
          </MagicCard>

          <MagicCard className="w-full flex-col bg-bg-card border border-border-default shadow-2xl" gradientColor="#2A2345">
            <div className="p-6 relative z-10">
              <h2 className="text-2xl font-bold text-text-primary mb-6">Your Resume</h2>
              
              {isLoadingResume ? (
                <div className="flex items-center space-x-3 text-text-muted">
                  <div className="w-5 h-5 border-2 border-border-default border-t-transparent rounded-full animate-spin"></div>
                  <span>Loading resume data...</span>
                </div>
              ) : savedResume ? (
                <div className="bg-bg-card border border-border-default rounded-lg p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="bg-bg-selected/30 p-3 rounded-lg border border-border-hover/50">
                        <span className="text-2xl">📄</span>
                      </div>
                      <div>
                        <p className="text-text-primary font-medium text-lg">{savedResume.fileName}</p>
                        <p className="text-sm text-text-muted mt-1">
                          Last updated: {new Date(savedResume.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-4 py-2 bg-bg-hover hover:bg-bg-hover border border-border-default text-text-primary rounded-md transition-colors text-sm font-medium"
                      >
                        {isUploading ? "Uploading..." : "Update"}
                      </button>
                      <button
                        onClick={handleDeleteResume}
                        disabled={isUploading}
                        className="px-4 py-2 bg-status-error/20 hover:bg-status-error border border-status-error text-status-error rounded-md transition-colors text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-bg-card border border-dashed border-border-default rounded-lg p-8 text-center">
                  <span className="text-4xl block mb-3">☁️</span>
                  <p className="text-text-primary font-medium mb-1">No resume uploaded</p>
                  <p className="text-sm text-text-muted mb-5">Upload your resume to speed up your job search.</p>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-6 py-2 bg-brand-primary hover:bg-brand-primary-hover text-text-primary rounded-md transition-colors font-medium shadow-[0_0_10px_rgba(8,145,178,0.3)]"
                  >
                    {isUploading ? "Uploading..." : "Upload Resume"}
                  </button>
                </div>
              )}

              <input
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                ref={fileInputRef}
              />
            </div>
          </MagicCard>
        </div>
      </div>
    </>
  );
}
