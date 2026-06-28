"use client";

import React from "react";
import Navbar from "@/components/navbar/Navbar";
import { SparklesCore } from "@/components/ui/sparkles";
import { MagicCard } from "@/components/magicui/magic-card";
import { FaRobot, FaSearch, FaBolt, FaGlobe, FaUserShield, FaRocket, FaHandshake, FaChartLine } from "react-icons/fa";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30 flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative h-[40rem] w-full bg-black flex flex-col items-center justify-center overflow-hidden rounded-md">
        <div className="w-full absolute inset-0 h-screen">
          <SparklesCore
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-full"
            particleColor="#0891b2"
          />
        </div>
        <h1 className="md:text-7xl text-5xl lg:text-8xl font-bold text-center text-white relative z-20 tracking-tighter">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">HireXplore</span>
        </h1>
        <p className="mt-6 text-xl text-gray-400 max-w-3xl text-center relative z-20 px-4 leading-relaxed">
          We are revolutionizing the job search experience by harnessing the power of Artificial Intelligence.
          HireXplore is designed to seamlessly connect elite tech talent with world-class opportunities.
        </p>
      </div>

      {/* Mission Section */}
      <section className="py-24 px-4 md:px-8 max-w-7xl mx-auto z-10 relative bg-black w-full">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-extrabold mb-8 text-white tracking-tight leading-tight">
              Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Mission</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-6 font-light">
              Finding the right job shouldn&apos;t feel like searching for a needle in a haystack. 
              Our mission is to eliminate the noise, automate the tedious tasks, and bring the most highly relevant opportunities directly to your inbox.
            </p>
            <p className="text-xl text-gray-300 leading-relaxed font-light">
              We aggregate data from across the web—LinkedIn, Internshala, Indeed, Naukri, and more—and use an advanced <span className="text-cyan-400 font-semibold">AI matching engine</span> to parse your resume, map your unique skills, and deliver personalized job alerts straight to your email.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] p-8 rounded-3xl border border-indigo-500/30 flex flex-col items-center text-center shadow-[0_0_30px_rgba(59,130,246,0.1)] hover:shadow-[0_0_40px_rgba(59,130,246,0.2)] hover:-translate-y-2 transition-all duration-300">
              <FaRobot className="text-5xl text-cyan-400 mb-5 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              <h3 className="text-xl font-bold text-white mb-2">AI Powered</h3>
              <p className="text-sm text-indigo-200">Smart resume parsing and deep semantic matching algorithms.</p>
            </div>
            <div className="bg-gradient-to-bl from-[#0f172a] to-[#064e3b] p-8 rounded-3xl border border-emerald-500/30 flex flex-col items-center text-center shadow-[0_0_30px_rgba(16,185,129,0.1)] hover:shadow-[0_0_40px_rgba(16,185,129,0.2)] hover:-translate-y-2 transition-all duration-300">
              <FaGlobe className="text-5xl text-emerald-400 mb-5 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
              <h3 className="text-xl font-bold text-white mb-2">Omni-Search</h3>
              <p className="text-sm text-emerald-200">Aggregating thousands of listings from 6+ major job boards.</p>
            </div>
            <div className="bg-gradient-to-tr from-[#2e1065] to-[#0f172a] p-8 rounded-3xl border border-purple-500/30 flex flex-col items-center text-center shadow-[0_0_30px_rgba(168,85,247,0.1)] hover:shadow-[0_0_40px_rgba(168,85,247,0.2)] hover:-translate-y-2 transition-all duration-300">
              <FaBolt className="text-5xl text-purple-400 mb-5 drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
              <h3 className="text-xl font-bold text-white mb-2">Lightning Fast</h3>
              <p className="text-sm text-purple-200">Real-time alerts sent instantly to your inbox.</p>
            </div>
            <div className="bg-gradient-to-tl from-[#4c1d95] to-[#1e3a8a] p-8 rounded-3xl border border-blue-500/30 flex flex-col items-center text-center shadow-[0_0_30px_rgba(96,165,250,0.1)] hover:shadow-[0_0_40px_rgba(96,165,250,0.2)] hover:-translate-y-2 transition-all duration-300">
              <FaUserShield className="text-5xl text-blue-400 mb-5 drop-shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
              <h3 className="text-xl font-bold text-white mb-2">Privacy First</h3>
              <p className="text-sm text-blue-200">Your resume data is strictly encrypted and securely stored.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-32 px-4 md:px-8 bg-gradient-to-b from-black via-[#0a0a0a] to-[#111] border-y border-gray-900 w-full relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-extrabold mb-6">
              The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600">Technology</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Built with modern tech stacks, HireXplore operates autonomously so you don&apos;t have to.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <MagicCard className="p-10 cursor-pointer bg-[#0f0f0f] border-gray-800 hover:border-cyan-500/50 transition-colors">
              <FaRocket className="text-6xl text-cyan-400 mb-8" />
              <h3 className="text-2xl font-bold text-white mb-4">Dynamic Scraper</h3>
              <p className="text-gray-400 leading-relaxed text-lg font-light">
                Our proprietary scraping engine bypasses standard limitations, intelligently querying top job boards simultaneously to bring you opportunities minutes after they are posted.
              </p>
            </MagicCard>

            <MagicCard className="p-10 cursor-pointer bg-[#0f0f0f] border-gray-800 hover:border-blue-500/50 transition-colors">
              <FaChartLine className="text-6xl text-blue-500 mb-8" />
              <h3 className="text-2xl font-bold text-white mb-4">Precision Scoring</h3>
              <p className="text-gray-400 leading-relaxed text-lg font-light">
                We don&apos;t just keyword match. Our algorithm scores jobs based on skill density, location priority (e.g. Pune &gt; Mumbai &gt; Remote), and role relevance.
              </p>
            </MagicCard>

            <MagicCard className="p-10 cursor-pointer bg-[#0f0f0f] border-gray-800 hover:border-purple-500/50 transition-colors">
              <FaHandshake className="text-6xl text-purple-500 mb-8" />
              <h3 className="text-2xl font-bold text-white mb-4">Seamless Delivery</h3>
              <p className="text-gray-400 leading-relaxed text-lg font-light">
                Forget manually checking portals. We format the best matches into a beautiful HTML email and drop it into your inbox every day.
              </p>
            </MagicCard>
          </div>
        </div>
      </section>

      {/* Team / Closing */}
      <section className="py-40 px-4 text-center z-10 relative max-w-4xl mx-auto bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-black to-black rounded-[100%]">
        <h2 className="text-5xl md:text-7xl font-extrabold mb-8 text-white tracking-tighter">Join the Future of Hiring</h2>
        <p className="text-2xl text-gray-400 mb-12 leading-relaxed font-light">
          Whether you&apos;re a recent graduate looking for your first internship, or a senior developer seeking the next big challenge, <span className="text-cyan-400 font-semibold">HireXplore</span> is built for you.
        </p>
        <a 
          href="/signup" 
          className="inline-flex items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg px-10 py-5 rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_rgba(6,182,212,0.4)] hover:shadow-[0_0_60px_rgba(6,182,212,0.6)]"
        >
          Create Your Free Account
        </a>
      </section>

    </main>
  );
}
