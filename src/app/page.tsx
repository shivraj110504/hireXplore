import PublicNavbar from "@/components/navbar/Navbar";
import { HeroSparkles } from "@/components/hero/HeroSparkles";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";

export default function Home() {
  return (
    <>
      <PublicNavbar />
      <HeroSparkles />

      <div id="features" className="bg-black flex flex-col items-center justify-center space-y-12 py-24 px-4 relative z-10">
        <div className="text-center max-w-2xl mt-5">
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Powerful Job Search Features
          </h2>
          <p className="mt-2 text-gray-400 text-sm md:text-base">
            Experience the next generation of job searching with our advanced AI automation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-[1400px]">
          <NeonGradientCard className="w-full h-auto flex items-start justify-center !bg-[#171717] [&>*]:!bg-[#171717]">
            <div className="p-6 text-white text-left flex flex-col h-full">
              <div className="mb-4 text-4xl">🤖</div>
              <h3 className="text-xl font-semibold mb-2">Smart Resume Parsing</h3>
              <p className="text-sm text-gray-300">
                AI extracts your skills, experience, and education from your resume automatically.
              </p>
            </div>
          </NeonGradientCard>

          <NeonGradientCard className="w-full h-auto flex items-start justify-center !bg-[#171717] [&>*]:!bg-[#171717]">
            <div className="p-6 text-white text-left flex flex-col h-full">
              <div className="mb-4 text-4xl">🌐</div>
              <h3 className="text-xl font-semibold mb-2">Multi-Platform Scraping</h3>
              <p className="text-sm text-gray-300">
                We search LinkedIn, Internshala, Indeed, and more to find hidden gems.
              </p>
            </div>
          </NeonGradientCard>

          <NeonGradientCard className="w-full h-auto flex items-start justify-center !bg-[#171717] [&>*]:!bg-[#171717]">
            <div className="p-6 text-white text-left flex flex-col h-full">
              <div className="mb-4 text-4xl">🎯</div>
              <h3 className="text-xl font-semibold mb-2">AI Job Matching</h3>
              <p className="text-sm text-gray-300">
                Advanced algorithms score jobs against your profile for the perfect fit.
              </p>
            </div>
          </NeonGradientCard>

          <NeonGradientCard className="w-full h-auto flex items-start justify-center !bg-[#171717] [&>*]:!bg-[#171717]">
            <div className="p-6 text-white text-left flex flex-col h-full">
              <div className="mb-4 text-4xl">✉️</div>
              <h3 className="text-xl font-semibold mb-2">Automated Alerts</h3>
              <p className="text-sm text-gray-300">
                Get the best matches delivered straight to your inbox daily.
              </p>
            </div>
          </NeonGradientCard>
        </div>
      </div>
    </>
  );
}
