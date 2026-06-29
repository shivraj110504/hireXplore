import PublicNavbar from "@/components/navbar/Navbar";
import { HeroSparkles } from "@/components/hero/HeroSparkles";
import { NeonGradientCard } from "@/components/ui/neon-gradient-card";
import FooterComponent from "@/components/footer/Footer";

export default function Home() {
  return (
    <>
      <PublicNavbar />
      <HeroSparkles />

      <div id="features" className="bg-bg-main flex flex-col items-center justify-center space-y-12 py-24 px-4 relative z-10">
        <div className="text-center max-w-2xl mt-5">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
            Powerful Job Search Features
          </h2>
          <p className="mt-2 text-text-muted text-sm md:text-base">
            Experience the next generation of job searching with our advanced AI automation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-[1400px]">
          <NeonGradientCard className="w-full h-auto flex items-start justify-center !bg-bg-card [&>*]:!bg-bg-card">
            <div className="p-6 text-text-primary text-left flex flex-col h-full">
              <div className="mb-4 text-4xl">🤖</div>
              <h3 className="text-xl font-semibold mb-2">Smart Resume Parsing</h3>
              <p className="text-sm text-text-secondary">
                AI extracts your skills, experience, and education from your resume automatically.
              </p>
            </div>
          </NeonGradientCard>

          <NeonGradientCard className="w-full h-auto flex items-start justify-center !bg-bg-card [&>*]:!bg-bg-card">
            <div className="p-6 text-text-primary text-left flex flex-col h-full">
              <div className="mb-4 text-4xl">🌐</div>
              <h3 className="text-xl font-semibold mb-2">Multi-Platform Scraping</h3>
              <p className="text-sm text-text-secondary">
                We search LinkedIn, Internshala, Indeed, and more to find hidden gems.
              </p>
            </div>
          </NeonGradientCard>

          <NeonGradientCard className="w-full h-auto flex items-start justify-center !bg-bg-card [&>*]:!bg-bg-card">
            <div className="p-6 text-text-primary text-left flex flex-col h-full">
              <div className="mb-4 text-4xl">🎯</div>
              <h3 className="text-xl font-semibold mb-2">AI Job Matching</h3>
              <p className="text-sm text-text-secondary">
                Advanced algorithms score jobs against your profile for the perfect fit.
              </p>
            </div>
          </NeonGradientCard>

          <NeonGradientCard className="w-full h-auto flex items-start justify-center !bg-bg-card [&>*]:!bg-bg-card">
            <div className="p-6 text-text-primary text-left flex flex-col h-full">
              <div className="mb-4 text-4xl">✉️</div>
              <h3 className="text-xl font-semibold mb-2">Automated Alerts</h3>
              <p className="text-sm text-text-secondary">
                Get the best matches delivered straight to your inbox daily.
              </p>
            </div>
          </NeonGradientCard>
        </div>
      </div>

      <div className="bg-bg-nav py-24 px-4 relative z-10 border-t border-border-default">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-text-primary mb-6">
              How HireXplore Works
            </h2>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              We've completely re-engineered the job search process. From resume parsing to one-click applications, everything is driven by our state-of-the-art AI.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 mt-16">
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-brand-primary/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(123,63,228,0.3)]">
                <span className="text-3xl text-brand-primary font-bold">1</span>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">Upload Resume</h3>
              <p className="text-text-muted">Drop in your PDF or DOCX. Our AI instantly extracts your precise skill tree and experience level.</p>
            </div>
            
            <div className="hidden md:block w-32 h-[2px] bg-gradient-to-r from-brand-primary/0 via-brand-primary to-brand-primary/0"></div>
            
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-brand-primary/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(123,63,228,0.3)]">
                <span className="text-3xl text-brand-primary font-bold">2</span>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">AI Matching</h3>
              <p className="text-text-muted">Our agent scrapes live portals (LinkedIn, Internshala, Indeed) and ranks jobs based on a strict compatibility score.</p>
            </div>
            
            <div className="hidden md:block w-32 h-[2px] bg-gradient-to-r from-brand-primary/0 via-brand-primary to-brand-primary/0"></div>
            
            <div className="flex-1 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-brand-primary/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(123,63,228,0.3)]">
                <span className="text-3xl text-brand-primary font-bold">3</span>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-3">Apply instantly</h3>
              <p className="text-text-muted">Skip the search engine. Click 'Apply Now' to be routed instantly to the exact native job application portal.</p>
            </div>
          </div>
        </div>
      </div>

      <FooterComponent />
    </>
  );
}
