"use client";
import { useState } from "react";
import { MagicCard } from "@/components/magicui/magic-card";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  applyLink: string;
  source: string;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

interface JobCardProps {
  job: Job;
  isProfileView?: boolean;
  onRemove?: (id: string) => void;
}

export default function JobCard({ job, isProfileView = false, onRemove }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const scoreColor =
    job.matchScore >= 80 ? "text-status-success border-status-success" :
    job.matchScore >= 60 ? "text-status-warning border-status-warning" :
    "text-status-error border-status-error";

  const handleSave = async () => {
    if (isSaved || isSaving) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/saved-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(job),
      });
      if (res.ok) setIsSaved(true);
    } catch (err) {
      console.error("Failed to save job:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/saved-jobs?id=${job.id}`, {
        method: "DELETE",
      });
      if (res.ok && onRemove) {
        onRemove(job.id);
      }
    } catch (err) {
      console.error("Failed to remove job:", err);
    } finally {
      setIsSaving(false);
    }
  };

  // By hook or by crook: If the scraper didn't provide a direct link or provided a search page,
  // we use DuckDuckGo's "I'm Feeling Ducky" (!ducky) to instantly redirect the user to the 
  // exact direct job description for that title and company on that specific platform!
  let finalApplyLink = job.applyLink;
  const sourceLower = job.source.toLowerCase();
  
  if (finalApplyLink === '#' || finalApplyLink.includes('/jobs?q=') || finalApplyLink.includes('Job/jobs.htm') || finalApplyLink.includes('apna.co/jobs?search')) {
    const query = `!ducky ${job.title} ${job.company} site:${sourceLower}.com`;
    finalApplyLink = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
  } else if (!finalApplyLink.startsWith('http')) {
    if (sourceLower === 'linkedin') {
      finalApplyLink = `https://www.linkedin.com${finalApplyLink.startsWith('/') ? '' : '/'}${finalApplyLink}`;
    } else {
      finalApplyLink = `https://${finalApplyLink}`;
    }
  }

  const finalHref = finalApplyLink;

  return (
    <MagicCard
      className="w-full h-full flex-col p-6 shadow-2xl transition-transform hover:scale-[1.02] bg-bg-card"
      gradientColor="#1e293b"
    >
      <div className="flex flex-col h-full z-10 relative">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-brand-primary mb-1">{job.title}</h3>
            <p className="text-text-secondary font-medium">{job.company}</p>
            <p className="text-text-muted text-sm mt-1">📍 {job.location}</p>
          </div>
          <div className={`px-3 py-1 rounded-full border ${scoreColor} font-bold text-sm whitespace-nowrap`}>
            {job.matchScore}% Match
          </div>
        </div>

        <div className="mt-4 flex-grow">
          <div className="mb-3">
            <p className="text-xs text-text-muted mb-2">MATCHED SKILLS</p>
            <div className="flex flex-wrap gap-2">
              {job.matchedSkills.length > 0 ? (
                job.matchedSkills.map((skill, idx) => (
                  <span key={idx} className="bg-status-success/20 text-status-success border border-status-success px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-text-disabled text-xs">None</span>
              )}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-text-muted mb-2">MISSING SKILLS</p>
            <div className="flex flex-wrap gap-2">
              {job.missingSkills.length > 0 ? (
                job.missingSkills.map((skill, idx) => (
                  <span key={idx} className="bg-status-error/20 text-status-error border border-status-error px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-text-disabled text-xs">None</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-between items-center border-t border-border-default pt-4 gap-4">
          <span className="text-xs bg-bg-hover text-text-secondary px-2 py-1 rounded whitespace-nowrap">
            {job.source}
          </span>
          <div className="flex flex-wrap gap-2">
            {isProfileView ? (
              <button
                onClick={handleRemove}
                disabled={isSaving}
                className="px-3 py-2 bg-status-error/20 hover:bg-status-error/40 text-status-error border border-status-error/50 rounded-md text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {isSaving ? "Removing..." : "Remove"}
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={isSaved || isSaving}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors border ${
                  isSaved 
                    ? "bg-bg-hover text-text-muted border-border-default cursor-not-allowed" 
                    : "bg-bg-hover hover:bg-bg-hover text-text-primary border-border-default"
                }`}
              >
                {isSaving ? "..." : isSaved ? "Saved" : "Save Job"}
              </button>
            )}
            
            <a
              href={finalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-status-success/20 hover:bg-status-success/40 text-status-success border border-status-success/50 rounded-md text-sm font-semibold transition-colors"
            >
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </MagicCard>
  );
}
