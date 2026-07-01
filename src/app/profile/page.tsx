"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashNavbar from "@/components/navbar/DashNavbar";
import { authClient } from "@/lib/auth-client";
import { Pencil, MapPin, Mail, Phone, ExternalLink, Briefcase, GraduationCap, Code, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingJobs, setIsFetchingJobs] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
      return;
    }

    if (session) {
      fetch(`/api/profile?t=${Date.now()}`)
        .then(res => res.json())
        .then(data => {
          if (data.profile) setProfile(data.profile);
        })
        .catch(err => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [isPending, session, router]);

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen bg-bg-main flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return null;

  const info = profile?.personalInfo || {};

  return (
    <>
      <DashNavbar />
      
      <div className="min-h-screen bg-bg-main pt-24 px-4 pb-12">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Main Content */}
          <div className="flex-1 space-y-6">
            
            {/* Header / Hero Section */}
            <div className="bg-bg-card border border-border-default rounded-2xl overflow-hidden relative shadow-lg">
              <div className="h-32 bg-gradient-to-r from-brand-primary to-brand-secondary opacity-80"></div>
              
              <Link href="/profile/edit" className="absolute top-4 right-4 bg-bg-main/50 hover:bg-bg-main p-2 rounded-full text-white backdrop-blur-md transition-all">
                <Pencil className="w-5 h-5" />
              </Link>
              
              <div className="px-8 pb-8">
                <div className="w-32 h-32 bg-bg-hover border-4 border-bg-card rounded-full -mt-16 flex items-center justify-center overflow-hidden shadow-xl z-10 relative">
                  {profile?.profilePicture ? (
                    <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl text-brand-primary font-bold">
                      {info.name ? info.name.charAt(0).toUpperCase() : session.user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
                <div className="mt-4">
                  <h1 className="text-3xl font-bold text-text-primary">
                    {info.name || session.user.name}
                  </h1>
                  <p className="text-xl text-brand-accent mt-1">{info.title || "Add a professional title"}</p>
                  
                  <div className="flex flex-wrap gap-4 mt-4 text-text-secondary text-sm">
                    {info.location && (
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {info.location}</span>
                    )}
                    <span className="flex items-center gap-1"><Mail className="w-4 h-4"/> {info.email || session.user.email}</span>
                    {info.phone && (
                      <span className="flex items-center gap-1"><Phone className="w-4 h-4"/> {info.phone}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-bg-card border border-border-default rounded-2xl p-8 shadow-lg relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-text-primary">Summary</h2>
                <Link href="/profile/edit" className="text-text-muted hover:text-brand-primary transition-colors"><Pencil className="w-4 h-4"/></Link>
              </div>
              <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                {profile?.summary || "Add a summary to highlight your professional experience."}
              </p>
            </div>

            {/* Experience */}
            <div className="bg-bg-card border border-border-default rounded-2xl p-8 shadow-lg relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-primary" /> Experience
                </h2>
                <Link href="/profile/edit" className="text-text-muted hover:text-brand-primary transition-colors"><Pencil className="w-4 h-4"/></Link>
              </div>
              
              {profile?.experience && profile.experience.length > 0 ? (
                <div className="space-y-6">
                  {profile.experience.map((exp: any, idx: number) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-border-focus">
                      <div className="absolute w-3 h-3 bg-brand-primary rounded-full -left-[7px] top-1.5"></div>
                      <h3 className="text-lg font-bold text-text-primary">{exp.role}</h3>
                      <p className="text-brand-accent font-medium">{exp.company}</p>
                      <p className="text-text-muted text-sm mt-1">{exp.duration}</p>
                      <p className="text-text-secondary mt-2 text-sm whitespace-pre-wrap">{exp.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-muted text-sm">No experience added yet. Upload your resume to auto-fill this section!</p>
              )}
            </div>

            {/* Education */}
            <div className="bg-bg-card border border-border-default rounded-2xl p-8 shadow-lg relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-brand-primary" /> Education
                </h2>
                <Link href="/profile/edit" className="text-text-muted hover:text-brand-primary transition-colors"><Pencil className="w-4 h-4"/></Link>
              </div>
              
              {profile?.education && profile.education.length > 0 ? (
                <div className="space-y-6">
                  {profile.education.map((edu: any, idx: number) => (
                    <div key={idx}>
                      <h3 className="text-lg font-bold text-text-primary">{edu.institution}</h3>
                      <p className="text-brand-accent font-medium">{edu.degree}</p>
                      <p className="text-text-muted text-sm mt-1">{edu.year}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-muted text-sm">No education added yet.</p>
              )}
            </div>
            
          </div>
          
          {/* RIGHT COLUMN: Sidebar */}
          <div className="lg:w-80 space-y-6">

            {/* Skills */}
            <div className="bg-bg-card border border-border-default rounded-2xl p-6 shadow-lg relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <Code className="w-5 h-5 text-brand-primary" /> Skills
                </h2>
                <Link href="/profile/edit" className="text-text-muted hover:text-brand-primary transition-colors"><Pencil className="w-4 h-4"/></Link>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {profile?.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill: string, idx: number) => (
                    <span key={idx} className="px-3 py-1 bg-brand-primary/20 text-brand-accent rounded-full text-sm font-medium border border-brand-primary/30">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-text-muted text-sm">No skills added.</p>
                )}
              </div>
            </div>

            {/* Links */}
            <div className="bg-bg-card border border-border-default rounded-2xl p-6 shadow-lg relative">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <LinkIcon className="w-5 h-5 text-brand-primary" /> Links
                </h2>
                <Link href="/profile/edit" className="text-text-muted hover:text-brand-primary transition-colors"><Pencil className="w-4 h-4"/></Link>
              </div>
              
              <div className="space-y-3">
                {info.linkedin && (
                  <a href={info.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors text-sm">
                    <ExternalLink className="w-4 h-4" /> LinkedIn
                  </a>
                )}
                {info.github && (
                  <a href={info.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors text-sm">
                    <ExternalLink className="w-4 h-4" /> GitHub
                  </a>
                )}
                {info.portfolio && (
                  <a href={info.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-text-secondary hover:text-brand-primary transition-colors text-sm">
                    <ExternalLink className="w-4 h-4" /> Portfolio
                  </a>
                )}
                {!info.linkedin && !info.github && !info.portfolio && (
                  <p className="text-text-muted text-sm">No links added.</p>
                )}
              </div>
            </div>
            
          </div>

        </div>
      </div>
    </>
  );
}
