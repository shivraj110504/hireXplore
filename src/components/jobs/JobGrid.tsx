"use client";
import { useState, useMemo } from "react";
import JobCard from "./JobCard";

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

export default function JobGrid({ 
  jobs, 
  isProfileView = false,
  onRemove
}: { 
  jobs: Job[], 
  isProfileView?: boolean,
  onRemove?: (id: string) => void 
}) {
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [minScore, setMinScore] = useState(0);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchSearch =
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase());
      const matchSource = sourceFilter ? job.source === sourceFilter : true;
      const matchScore = job.matchScore >= minScore;
      
      return matchSearch && matchSource && matchScore;
    });
  }, [jobs, search, sourceFilter, minScore]);

  const sources = useMemo(() => Array.from(new Set(jobs.map((j) => j.source))), [jobs]);

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-400">
        No jobs found. {isProfileView ? "You haven't saved any jobs yet." : "Please upload your resume to see matches."}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-[#111] p-4 rounded-xl border border-gray-800">
        <input
          type="text"
          placeholder="Filter by title, company..."
          className="flex-grow bg-black border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="bg-black border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-500"
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
        >
          <option value="">All Sources</option>
          {sources.map(src => <option key={src} value={src}>{src}</option>)}
        </select>
        <select
          className="bg-black border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-cyan-500"
          value={minScore}
          onChange={(e) => setMinScore(Number(e.target.value))}
        >
          <option value={0}>All Scores</option>
          <option value={70}>70%+</option>
          <option value={80}>80%+</option>
          <option value={90}>90%+</option>
        </select>
      </div>

      <div className="mb-4 text-gray-400">
        Showing {filteredJobs.length} of {jobs.length} matched jobs
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredJobs.map((job) => (
          <JobCard 
            key={job.id} 
            job={job} 
            isProfileView={isProfileView} 
            onRemove={onRemove} 
          />
        ))}
      </div>

      {filteredJobs.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No jobs match your current filters.
        </div>
      )}
    </div>
  );
}
