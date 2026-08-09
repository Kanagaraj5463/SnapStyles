import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings, Camera, Clock3, FileText, Edit3 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchOrders, Order } from "@/lib/orderService";

const Dashboard = () => {
  const { user, profile, signOut, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [displayName, setDisplayName] = useState(profile?.display_name || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "");
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatar_url || "");
    }
  }, [profile]);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    const { error } = await updateProfile({ display_name: displayName, bio, avatar_url: avatarUrl });
    setIsSaving(false);
    if (error) {
      console.error(error);
    }
  };

  const loadOrders = async () => {
    const fetched = await fetchOrders();
    setOrders(fetched);
  };

  const upcomingOrders = useMemo(
    () => orders.filter((order) => order.status === "Upcoming" || order.status === "Confirmed"),
    [orders]
  );

  const completedOrders = useMemo(
    () => orders.filter((order) => order.status === "Completed"),
    [orders]
  );

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
      <main className="flex-1 py-24 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="font-display text-4xl font-bold">Creator Hub</h1>
            <p className="text-slate-400 mt-2">Manage your profile, orders, and booking history in one place.</p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value);
              if (value === "orders" && orders.length === 0) {
                loadOrders();
              }
            }}
          >
            <TabsList className="grid w-full grid-cols-2 gap-2 rounded-2xl bg-slate-900 p-1">
              <TabsTrigger value="profile" className="rounded-xl">
                Profile
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-xl">
                Order History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-red-400" />
                      Profile Overview
                    </CardTitle>
                    <CardDescription>View your personal creator details.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center gap-4 text-center">
                      <Avatar className="h-28 w-28">
                        <AvatarImage src={avatarUrl || profile?.avatar_url || undefined} />
                        <AvatarFallback className="bg-red-500 text-slate-950 text-2xl">
                          {profile?.display_name
                            ? getInitials(profile.display_name)
                            : getInitials(displayName || "SS")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-xl font-semibold">{profile?.display_name || displayName || "Creator"}</h2>
                        <p className="text-sm text-slate-400">{user?.email}</p>
                      </div>
                      <p className="text-sm text-slate-300">
                        {profile?.bio || bio || "Update your bio and avatar to personalize your profile."}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-red-400" />
                      Edit Profile
                    </CardTitle>
                    <CardDescription>Update your name, bio, and avatar URL.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div>
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(event) => setDisplayName(event.target.value)}
                        placeholder="Enter your display name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(event) => setBio(event.target.value)}
                        placeholder="Share your creator story"
                        rows={4}
                      />
                    </div>

                    <div>
                      <Label htmlFor="avatarUrl">Avatar URL</Label>
                      <Input
                        id="avatarUrl"
                        value={avatarUrl}
                        onChange={(event) => setAvatarUrl(event.target.value)}
                        placeholder="Paste a profile image URL"
                      />
                    </div>

                    <Button
                      className="w-full bg-red-500 text-slate-950 hover:bg-red-400"
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Profile"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="mt-6">
              <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-red-400" />
                      Order History
                    </CardTitle>
                    <CardDescription>Review your past shoot bookings.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950 p-8 text-center">
                        <p className="text-slate-400">No orders available yet.</p>
                        <Button
                          className="mt-4 bg-red-500 text-slate-950 hover:bg-red-400"
                          onClick={() => navigate("/orders")}
                        >
                          Book a Shoot
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div key={order.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-5">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="text-sm text-slate-400">{order.shootType}</p>
                                <h3 className="text-lg font-semibold text-white">{order.id}</h3>
                              </div>
                              <span className="rounded-full bg-red-500/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-red-300">
                                {order.status}
                              </span>
                            </div>
                            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                              <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Date</p>
                                <p className="text-sm text-slate-200">{order.date}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Time</p>
                                <p className="text-sm text-slate-200">{order.time}</p>
                              </div>
                              <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Location</p>
                                <p className="text-sm text-slate-200">{order.location}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock3 className="w-5 h-5 text-red-400" />
                      Quick Summary
                    </CardTitle>
                    <CardDescription>Snapshot of your bookings.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-3xl bg-slate-950 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Upcoming Shoots</p>
                        <p className="mt-2 text-2xl font-semibold text-white">{upcomingOrders.length}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-950 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Completed Shoots</p>
                        <p className="mt-2 text-2xl font-semibold text-white">{completedOrders.length}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-950 p-4">
                        <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Recent Orders</p>
                        <p className="mt-2 text-2xl font-semibold text-white">{recentOrders.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
