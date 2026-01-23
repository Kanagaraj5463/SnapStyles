import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings, Camera } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold">Welcome back!</h1>
            <p className="text-muted-foreground mt-1">
              Manage your SnapStyles account and content
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Profile Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Your Profile
                </CardTitle>
                <CardDescription>
                  Your public creator profile information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="text-2xl bg-accent text-accent-foreground">
                        {profile?.display_name
                          ? getInitials(profile.display_name)
                          : "SS"}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">
                      {profile?.display_name || "Creator"}
                    </h3>
                    <p className="text-muted-foreground text-sm">{user?.email}</p>
                    {profile?.bio && (
                      <p className="mt-3 text-sm">{profile.bio}</p>
                    )}
                    {!profile?.bio && (
                      <p className="mt-3 text-sm text-muted-foreground italic">
                        No bio added yet
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Stats</CardTitle>
                <CardDescription>
                  Track your creator performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-accent">0</p>
                    <p className="text-xs text-muted-foreground">Snaps Created</p>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-accent">0</p>
                    <p className="text-xs text-muted-foreground">Total Views</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
