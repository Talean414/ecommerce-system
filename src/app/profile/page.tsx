import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions";
import { ProfileManagement } from "@/components/ProfileManagement";
import { Session } from "next-auth"; // Import the Session type

export const metadata = {
  title: "User  Profile - E-Shop",
  description: "Manage your E-Shop account profile.",
};

export default async function ProfilePage() {
  const session: Session | null = await getServerSession(authOptions); // Specify the type for session

  if (!session) {
    redirect("/auth/signin?callbackUrl=/profile");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <ProfileManagement />
    </div>
  );
}