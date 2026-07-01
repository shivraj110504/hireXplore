"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import DashNavbar from "@/components/navbar/DashNavbar";
import { authClient } from "@/lib/auth-client";
import { Save, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function EditProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profile, setProfile] = useState<any>({
    personalInfo: { name: "", email: "", phone: "", location: "", title: "", portfolio: "", github: "", linkedin: "" },
    summary: "",
    skills: [],
    experience: [],
    education: [],
    profilePicture: ""
  });

  const [skillsText, setSkillsText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
      return;
    }

    if (session) {
      fetch(`/api/profile?t=${Date.now()}`)
        .then(res => res.json())
        .then(data => {
          if (data.profile) {
            setProfile(data.profile);
            if (data.profile.skills) {
              setSkillsText(data.profile.skills.join(", "));
            }
            if(!data.profile.personalInfo) {
               setProfile((p: any) => ({...p, personalInfo: { name: session.user.name, email: session.user.email }}));
            }
          }
        })
        .catch(err => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, [isPending, session, router]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const skillsArray = skillsText.split(",").map(s => s.trim()).filter(Boolean);
      const updatedProfile = { ...profile, skills: skillsArray };
      
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedProfile)
      });
      
      if (res.ok) {
        toast.success("Profile saved successfully");
        router.push("/profile");
      } else {
        toast.error("Failed to save profile");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    if (field === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }
    setProfile({
      ...profile,
      personalInfo: { ...profile.personalInfo, [field]: value }
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setProfile({ ...profile, profilePicture: event.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  if (isPending || isLoading) return <div className="min-h-screen bg-bg-main flex items-center justify-center"><div className="w-8 h-8 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <>
      <DashNavbar />
      <div className="min-h-screen bg-bg-main pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary">Edit Profile</h1>
            <div className="flex gap-4">
              <Link href="/profile" className="px-4 py-2 rounded-lg text-text-secondary hover:bg-bg-hover transition-colors flex items-center gap-2">
                <X className="w-4 h-4"/> Cancel
              </Link>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="px-4 py-2 bg-brand-primary hover:bg-brand-primary-hover text-white rounded-lg transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(123,63,228,0.4)]"
              >
                <Save className="w-4 h-4"/> {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          <div className="bg-bg-card border border-border-default rounded-2xl p-8 shadow-lg space-y-8">
            
            {/* Profile Picture */}
            <section className="flex flex-col items-center border-b border-border-default pb-8">
              <div 
                className="w-32 h-32 rounded-full border-4 border-bg-main bg-bg-hover overflow-hidden flex items-center justify-center cursor-pointer mb-4 shadow-lg group relative"
                onClick={() => fileInputRef.current?.click()}
              >
                {profile.profilePicture ? (
                  <img src={profile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl text-brand-primary font-bold">
                    {profile.personalInfo?.name ? profile.personalInfo.name.charAt(0).toUpperCase() : session?.user.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <span className="text-white text-xs font-bold">Upload Image</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload} 
                />
                <p className="text-text-muted text-xs">Max size: 2MB</p>
                {profile.profilePicture && (
                  <button 
                    type="button"
                    onClick={() => setProfile({ ...profile, profilePicture: "" })}
                    className="text-status-error text-xs hover:underline mt-1"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </section>

            {/* Personal Info */}
            <section>
              <h2 className="text-xl font-bold text-brand-primary mb-4 border-b border-border-default pb-2">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={profile.personalInfo?.name || ""} onChange={(e) => handlePersonalInfoChange("name", e.target.value)} className="bg-bg-main" />
                </div>
                <div className="space-y-2">
                  <Label>Professional Title</Label>
                  <Input value={profile.personalInfo?.title || ""} onChange={(e) => handlePersonalInfoChange("title", e.target.value)} placeholder="e.g. Senior Frontend Developer" className="bg-bg-main" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={profile.personalInfo?.email || ""} onChange={(e) => handlePersonalInfoChange("email", e.target.value)} className="bg-bg-main" disabled />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input 
                    type="tel"
                    value={profile.personalInfo?.phone || ""} 
                    onChange={(e) => handlePersonalInfoChange("phone", e.target.value)} 
                    className="bg-bg-main" 
                    placeholder="10 digit mobile number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input value={profile.personalInfo?.location || ""} onChange={(e) => handlePersonalInfoChange("location", e.target.value)} placeholder="e.g. San Francisco, CA" className="bg-bg-main" />
                </div>
              </div>
            </section>

            {/* Summary */}
            <section>
              <h2 className="text-xl font-bold text-brand-primary mb-4 border-b border-border-default pb-2">Professional Summary</h2>
              <textarea 
                value={profile.summary || ""} 
                onChange={(e) => setProfile({...profile, summary: e.target.value})}
                className="w-full h-32 bg-bg-main border border-border-default rounded-md p-3 text-sm text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                placeholder="Write a brief summary of your background and career goals..."
              />
            </section>

            {/* Links */}
            <section>
              <h2 className="text-xl font-bold text-brand-primary mb-4 border-b border-border-default pb-2">Social & Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>LinkedIn</Label>
                  <Input value={profile.personalInfo?.linkedin || ""} onChange={(e) => handlePersonalInfoChange("linkedin", e.target.value)} placeholder="https://linkedin.com/in/..." className="bg-bg-main" />
                </div>
                <div className="space-y-2">
                  <Label>GitHub</Label>
                  <Input value={profile.personalInfo?.github || ""} onChange={(e) => handlePersonalInfoChange("github", e.target.value)} placeholder="https://github.com/..." className="bg-bg-main" />
                </div>
                <div className="space-y-2">
                  <Label>Portfolio</Label>
                  <Input value={profile.personalInfo?.portfolio || ""} onChange={(e) => handlePersonalInfoChange("portfolio", e.target.value)} placeholder="https://yourwebsite.com" className="bg-bg-main" />
                </div>
              </div>
            </section>

            {/* Skills */}
            <section>
              <h2 className="text-xl font-bold text-brand-primary mb-4 border-b border-border-default pb-2">Skills (Comma separated)</h2>
              <textarea 
                value={skillsText} 
                onChange={(e) => setSkillsText(e.target.value)}
                className="w-full h-24 bg-bg-main border border-border-default rounded-md p-3 text-sm text-text-primary focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                placeholder="React, TypeScript, Node.js, Python, CSS..."
              />
            </section>
            
            {/* Experience */}
            <section>
              <div className="flex justify-between items-center mb-4 border-b border-border-default pb-2">
                <h2 className="text-xl font-bold text-brand-primary">Experience</h2>
                <button 
                  onClick={() => setProfile({...profile, experience: [...(profile.experience || []), {company: "", role: "", duration: "", description: ""}]})}
                  className="px-3 py-1 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary rounded-md text-sm font-semibold transition-colors"
                >
                  + Add Experience
                </button>
              </div>
              
              <div className="space-y-6">
                {profile.experience?.map((exp: any, index: number) => (
                  <div key={index} className="bg-bg-main p-4 rounded-xl border border-border-default relative">
                    <button 
                      onClick={() => setProfile({...profile, experience: profile.experience.filter((_: any, i: number) => i !== index)})}
                      className="absolute top-4 right-4 text-status-error hover:opacity-70"
                      title="Remove this experience"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                      <div className="space-y-2">
                        <Label>Role / Job Title</Label>
                        <Input 
                          value={exp.role || ""} 
                          onChange={(e) => {
                            const newExp = [...profile.experience];
                            newExp[index].role = e.target.value;
                            setProfile({...profile, experience: newExp});
                          }} 
                          placeholder="Software Engineer" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Company</Label>
                        <Input 
                          value={exp.company || ""} 
                          onChange={(e) => {
                            const newExp = [...profile.experience];
                            newExp[index].company = e.target.value;
                            setProfile({...profile, experience: newExp});
                          }} 
                          placeholder="Tech Corp" 
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Duration</Label>
                        <Input 
                          value={exp.duration || ""} 
                          onChange={(e) => {
                            const newExp = [...profile.experience];
                            newExp[index].duration = e.target.value;
                            setProfile({...profile, experience: newExp});
                          }} 
                          placeholder="Jan 2020 - Present" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <textarea 
                        value={exp.description || ""} 
                        onChange={(e) => {
                          const newExp = [...profile.experience];
                          newExp[index].description = e.target.value;
                          setProfile({...profile, experience: newExp});
                        }} 
                        className="w-full h-24 bg-bg-card border border-border-default rounded-md p-3 text-sm text-text-primary focus:outline-none focus:border-brand-primary"
                        placeholder="Key responsibilities and achievements..."
                      />
                    </div>
                  </div>
                ))}
                {(!profile.experience || profile.experience.length === 0) && (
                  <p className="text-text-muted text-sm italic">No experience added yet.</p>
                )}
              </div>
            </section>

            {/* Education */}
            <section>
              <div className="flex justify-between items-center mb-4 border-b border-border-default pb-2">
                <h2 className="text-xl font-bold text-brand-primary">Education</h2>
                <button 
                  onClick={() => setProfile({...profile, education: [...(profile.education || []), {institution: "", degree: "", year: "", description: ""}]})}
                  className="px-3 py-1 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary rounded-md text-sm font-semibold transition-colors"
                >
                  + Add Education
                </button>
              </div>
              
              <div className="space-y-6">
                {profile.education?.map((edu: any, index: number) => (
                  <div key={index} className="bg-bg-main p-4 rounded-xl border border-border-default relative">
                    <button 
                      onClick={() => setProfile({...profile, education: profile.education.filter((_: any, i: number) => i !== index)})}
                      className="absolute top-4 right-4 text-status-error hover:opacity-70"
                      title="Remove this education"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 pr-8">
                      <div className="space-y-2">
                        <Label>Degree / Certificate</Label>
                        <Input 
                          value={edu.degree || ""} 
                          onChange={(e) => {
                            const newEdu = [...profile.education];
                            newEdu[index].degree = e.target.value;
                            setProfile({...profile, education: newEdu});
                          }} 
                          placeholder="B.S. Computer Science" 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Institution</Label>
                        <Input 
                          value={edu.institution || ""} 
                          onChange={(e) => {
                            const newEdu = [...profile.education];
                            newEdu[index].institution = e.target.value;
                            setProfile({...profile, education: newEdu});
                          }} 
                          placeholder="University Name" 
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Year (or Duration)</Label>
                        <Input 
                          value={edu.year || ""} 
                          onChange={(e) => {
                            const newEdu = [...profile.education];
                            newEdu[index].year = e.target.value;
                            setProfile({...profile, education: newEdu});
                          }} 
                          placeholder="2018 - 2022" 
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description / Details</Label>
                      <textarea 
                        value={edu.description || ""} 
                        onChange={(e) => {
                          const newEdu = [...profile.education];
                          newEdu[index].description = e.target.value;
                          setProfile({...profile, education: newEdu});
                        }} 
                        className="w-full h-24 bg-bg-card border border-border-default rounded-md p-3 text-sm text-text-primary focus:outline-none focus:border-brand-primary"
                        placeholder="Relevant coursework, honors, GPA..."
                      />
                    </div>
                  </div>
                ))}
                {(!profile.education || profile.education.length === 0) && (
                  <p className="text-text-muted text-sm italic">No education added yet.</p>
                )}
              </div>
            </section>
            
            <p className="text-text-muted text-sm italic">
              Note: You can still upload your resume to have our AI attempt to automatically extract your skills, experience, and education!
            </p>

          </div>
        </div>
      </div>
    </>
  );
}
