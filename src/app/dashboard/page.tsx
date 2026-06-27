"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashNavbar from "@/components/navbar/DashNavbar";
import { authClient } from "@/lib/auth-client";
import { HeroSparkles } from "@/components/hero/HeroSparkles";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [isPending, session, router]);

  if (isPending) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;
  const user = session.user;

  return (
    <>
      <DashNavbar />
      <HeroSparkles isDashboard={true} userName={user.name || "User"} />
    </>
  );
}
