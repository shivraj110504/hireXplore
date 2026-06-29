"use client";
import { SparklesCore } from "@/components/ui/sparkles";
import Link from "next/link";
import { ShimmerButton } from "@/components/ui/shimmer-button";

interface HeroSparklesProps {
  isDashboard?: boolean;
  userName?: string;
}

export function HeroSparkles({ isDashboard = false, userName = "User" }: HeroSparklesProps) {
  return (
    <div className="h-[70vh] w-full bg-bg-main flex flex-col items-center justify-center overflow-hidden relative mt-20">
      <h1 className="md:text-7xl text-4xl lg:text-9xl font-bold text-center text-text-primary relative z-20">
        HireXplore
      </h1>

      <div className="w-[40rem] h-40 relative mt-8 max-w-full">
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-brand-accent to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-brand-accent to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-brand-accent to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-brand-accent to-transparent h-px w-1/4" />

        <SparklesCore
          background="transparent"
          minSize={0.4}
          maxSize={1}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#FFFFFF"
        />

        <div className="absolute inset-0 w-full h-full bg-bg-main [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>

      <div className="text-center mt-4 space-y-4 max-w-3xl absolute bottom-12 z-20 px-4">
        {isDashboard ? (
          <div className="space-y-6 mt-4">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
              Welcome back, {userName}!
            </h2>
            <p className="text-lg md:text-xl font-medium text-text-secondary mb-8">
              Ready to find your next big opportunity?
            </p>
            <Link href="/findJobs">
              <ShimmerButton 
                background="var(--color-brand-primary)"
                className="mx-auto shadow-[0_0_40px_var(--color-brand-primary)] text-white text-xl px-10 py-5 font-bold tracking-wide"
              >
                Upload Resume to Find Jobs
              </ShimmerButton>
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-xl md:text-2xl font-semibold text-text-primary">
              AI-Powered Job Search Assistant
            </h2>
            <ul className="flex flex-col md:flex-row items-center justify-center gap-6 mt-4 text-text-secondary text-sm md:text-base font-medium">
              <li className="before:content-['•'] before:text-brand-primary before:mr-2">Smart Resume Parsing</li>
              <li className="before:content-['•'] before:text-brand-primary before:mr-2">Multi-Platform Scraping</li>
              <li className="before:content-['•'] before:text-brand-primary before:mr-2">AI Job Matching</li>
              <li className="before:content-['•'] before:text-brand-primary before:mr-2">Automated Email Alerts</li>
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
