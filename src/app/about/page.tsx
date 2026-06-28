"use client";

import React from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/footer/Footer";
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
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto z-10 relative bg-black w-full">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-white tracking-tight">Our <span className="text-cyan-500">Mission</span></h2>
            <p className="text-lg text-gray-400 leading-relaxed mb-6">
              Finding the right job shouldn&apos;t feel like searching for a needle in a haystack. 
              Our mission is to eliminate the noise, automate the tedious tasks, and bring the most highly relevant opportunities directly to your inbox.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed">
              We aggregate data from across the web—LinkedIn, Internshala, Indeed, Naukri, and more—and use an advanced AI engine to parse your resume, match your skills, and deliver personalized job alerts.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 flex flex-col items-center text-center hover:border-cyan-500/50 transition-colors">
              <FaRobot className="text-4xl text-cyan-500 mb-4" />
              <h3 className="font-bold text-white mb-2">AI Powered</h3>
              <p className="text-sm text-gray-500">Smart resume parsing and semantic matching.</p>
            </div>
            <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 flex flex-col items-center text-center hover:border-cyan-500/50 transition-colors">
              <FaGlobe className="text-4xl text-blue-500 mb-4" />
              <h3 className="font-bold text-white mb-2">Omni-Search</h3>
              <p className="text-sm text-gray-500">Aggregating from 6+ major job boards.</p>
            </div>
            <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 flex flex-col items-center text-center hover:border-cyan-500/50 transition-colors">
              <FaBolt className="text-4xl text-yellow-500 mb-4" />
              <h3 className="font-bold text-white mb-2">Lightning Fast</h3>
              <p className="text-sm text-gray-500">Real-time alerts directly to your email.</p>
            </div>
            <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 flex flex-col items-center text-center hover:border-cyan-500/50 transition-colors">
              <FaUserShield className="text-4xl text-green-500 mb-4" />
              <h3 className="font-bold text-white mb-2">Privacy First</h3>
              <p className="text-sm text-gray-500">Your data is encrypted and securely stored.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-24 px-4 md:px-8 bg-[#0a0a0a] border-y border-gray-900 w-full relative z-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">Technology</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <MagicCard className="p-8 cursor-pointer bg-[#111] border-gray-800">
              <FaRocket className="text-5xl text-cyan-500 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Dynamic Scraper</h3>
              <p className="text-gray-400 leading-relaxed">
                Our proprietary scraping engine bypasses standard limitations, intelligently querying top job boards simultaneously to bring you opportunities minutes after they are posted.
              </p>
            </MagicCard>

            <MagicCard className="p-8 cursor-pointer bg-[#111] border-gray-800">
              <FaChartLine className="text-5xl text-blue-500 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Precision Scoring</h3>
              <p className="text-gray-400 leading-relaxed">
                We don&apos;t just keyword match. Our algorithm scores jobs based on skill density, location priority (e.g. Pune &gt; Mumbai &gt; Remote), and role relevance.
              </p>
            </MagicCard>

            <MagicCard className="p-8 cursor-pointer bg-[#111] border-gray-800">
              <FaHandshake className="text-5xl text-purple-500 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">Seamless Delivery</h3>
              <p className="text-gray-400 leading-relaxed">
                Forget manually checking portals. We format the best matches into a beautiful HTML email and drop it into your inbox every day.
              </p>
            </MagicCard>
          </div>
        </div>
      </section>

      {/* Team / Closing */}
      <section className="py-32 px-4 text-center z-10 relative max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">Join the Future of Hiring</h2>
        <p className="text-xl text-gray-400 mb-10 leading-relaxed">
          Whether you&apos;re a recent graduate looking for your first internship, or a senior developer seeking the next big challenge, HireXplore is built for you.
        </p>
        <a 
          href="/signup" 
          className="inline-block bg-white text-black font-bold px-8 py-4 rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          Create Your Free Account
        </a>
      </section>

      <Footer />
    </main>
  );
}
