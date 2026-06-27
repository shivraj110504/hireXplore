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
    job.matchScore >= 80 ? "text-green-400 border-green-400" :
    job.matchScore >= 60 ? "text-yellow-400 border-yellow-400" :
    "text-red-400 border-red-400";

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

  return (
    <MagicCard
      className="w-full h-full flex-col p-6 shadow-2xl transition-transform hover:scale-[1.02] bg-[#111]"
      gradientColor="#1e293b"
    >
      <div className="flex flex-col h-full z-10 relative">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-cyan-400 mb-1">{job.title}</h3>
            <p className="text-gray-300 font-medium">{job.company}</p>
            <p className="text-gray-400 text-sm mt-1">📍 {job.location}</p>
          </div>
          <div className={`px-3 py-1 rounded-full border ${scoreColor} font-bold text-sm whitespace-nowrap`}>
            {job.matchScore}% Match
          </div>
        </div>

        <div className="mt-4 flex-grow">
          <div className="mb-3">
            <p className="text-xs text-gray-400 mb-2">MATCHED SKILLS</p>
            <div className="flex flex-wrap gap-2">
              {job.matchedSkills.length > 0 ? (
                job.matchedSkills.map((skill, idx) => (
                  <span key={idx} className="bg-green-900/30 text-green-400 border border-green-800 px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-xs">None</span>
              )}
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-400 mb-2">MISSING SKILLS</p>
            <div className="flex flex-wrap gap-2">
              {job.missingSkills.length > 0 ? (
                job.missingSkills.map((skill, idx) => (
                  <span key={idx} className="bg-red-900/30 text-red-400 border border-red-800 px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 text-xs">None</span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-between items-center border-t border-gray-800 pt-4 gap-4">
          <span className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded whitespace-nowrap">
            {job.source}
          </span>
          <div className="flex flex-wrap gap-2">
            {isProfileView ? (
              <button
                onClick={handleRemove}
                disabled={isSaving}
                className="px-3 py-2 bg-red-900/50 hover:bg-red-900/80 text-red-400 border border-red-800 rounded-md text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {isSaving ? "Removing..." : "Remove"}
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={isSaved || isSaving}
                className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors border ${
                  isSaved 
                    ? "bg-gray-800 text-gray-400 border-gray-700 cursor-not-allowed" 
                    : "bg-gray-800 hover:bg-gray-700 text-white border-gray-700"
                }`}
              >
                {isSaving ? "..." : isSaved ? "Saved" : "Save Job"}
              </button>
            )}
            <a
              href={job.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-semibold transition-colors"
            >
              Apply Now
            </a>
          </div>
        </div>
      </div>
    </MagicCard>
  );
}
