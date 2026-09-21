import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Clock3, FileText, Edit3, Mail, MapPin, Phone, Camera, ImagePlus, Instagram, BadgeCheck, X } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { fetchOrders, Order } from "@/lib/orderService";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user, profile, signOut, updateProfile, uploadAvatar } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [displayName, setDisplayName] = useState(profile?.displayName || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || "");
  const [username, setUsername] = useState(profile?.username || profile?.instagramUsername || "");
  const [instagramUsername, setInstagramUsername] = useState(profile?.instagramUsername || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [address, setAddress] = useState(profile?.address || {
    street: "", city: "", state: "", postalCode: "", country: "",
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || "");
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatarUrl || "");
      setUsername(profile.username || profile.instagramUsername || "");
      setInstagramUsername(profile.instagramUsername || "");
      setPhone(profile.phone || "");
      setAddress(profile.address);
    }
  }, [profile]);

  useEffect(() => {
    if (!cameraOpen) return;
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(() => {
        setCameraOpen(false);
        toast({ variant: "destructive", title: "Camera unavailable", description: "Allow camera access or choose an image from your device." });
      });
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [cameraOpen, toast]);

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
    const { error } = await updateProfile({ displayName, bio, avatarUrl, username, instagramUsername, phone, address });
    setIsSaving(false);
    if (error) {
      toast({ variant: "destructive", title: "Unable to save profile", description: error.message });
      return;
    }
    toast({ title: "Profile updated", description: "Your account information has been saved." });
  };

  const uploadProfileImage = async (file: Blob) => {
    setIsUploading(true);
    const { error } = await uploadAvatar(file);
    setIsUploading(false);
    if (error) {
      toast({ variant: "destructive", title: "Unable to update photo", description: error.message });
      return;
    }
    setCameraOpen(false);
    toast({ title: "Profile photo updated" });
  };

  const handleImageSelection = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void uploadProfileImage(file);
    event.target.value = "";
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video?.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);
    canvas.toBlob((blob) => {
      if (blob) void uploadProfileImage(blob);
    }, "image/jpeg", 0.9);
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
            <h1 className="font-display text-4xl font-bold">My Account</h1>
            <p className="text-slate-400 mt-2">Manage your profile, contact information, address, and bookings.</p>
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
                      <Avatar className="h-28 w-28 ring-4 ring-slate-800">
                        <AvatarImage src={avatarUrl || profile?.avatarUrl || undefined} />
                        <AvatarFallback className="bg-red-500 text-slate-950 text-2xl">
                          {profile?.displayName
                            ? getInitials(profile.displayName)
                            : getInitials(displayName || "SS")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="flex items-center justify-center gap-1.5 text-xl font-semibold">
                          {profile?.displayName || displayName || "Creator"}
                          {profile?.verified && <BadgeCheck className="h-5 w-5 fill-blue-500 text-white" aria-label="Verified user" />}
                        </h2>
                        <p className="flex items-center justify-center gap-2 text-sm text-slate-400"><Mail className="h-4 w-4" />{user?.email}</p>
                        {phone && <p className="mt-2 flex items-center justify-center gap-2 text-sm text-slate-400"><Phone className="h-4 w-4" />{phone}</p>}
                      </div>
                      <p className="text-sm text-slate-300">
                        {profile?.bio || bio || "Update your bio and avatar to personalize your profile."}
                      </p>
                      {profile?.username && <p className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200">@{profile.username}</p>}
                      {profile?.instagramUsername && (
                        <a className="flex items-center gap-2 text-sm text-pink-400 hover:text-pink-300" href={`https://instagram.com/${profile.instagramUsername}`} target="_blank" rel="noreferrer">
                          <Instagram className="h-4 w-4" />@{profile.instagramUsername}
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-900 border-slate-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-red-400" />
                      Edit Profile
                    </CardTitle>
                    <CardDescription>Keep your personal and contact details current.</CardDescription>
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

                    <div className="space-y-3">
                      <Label>Profile Picture</Label>
                      <div className="flex flex-wrap gap-3">
                        <Button variant="outline" type="button" disabled={isUploading} asChild>
                          <label className="cursor-pointer">
                            <ImagePlus className="mr-2 h-4 w-4" />
                            Choose from device
                            <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageSelection} />
                          </label>
                        </Button>
                        <Button variant="outline" type="button" disabled={isUploading} onClick={() => setCameraOpen(true)}>
                          <Camera className="mr-2 h-4 w-4" />Use camera
                        </Button>
                      </div>
                      <p className="text-xs text-slate-400">JPEG, PNG, or WebP. Maximum size 5 MB.</p>
                    </div>

                    {cameraOpen && (
                      <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-black p-3">
                        <Button className="absolute right-5 top-5 z-10 h-8 w-8 rounded-full" variant="secondary" size="icon" onClick={() => setCameraOpen(false)} aria-label="Close camera">
                          <X className="h-4 w-4" />
                        </Button>
                        <video ref={videoRef} autoPlay playsInline muted className="aspect-video w-full rounded-xl object-cover" />
                        <Button type="button" className="mt-3 w-full" disabled={isUploading} onClick={capturePhoto}>
                          <Camera className="mr-2 h-4 w-4" />{isUploading ? "Uploading..." : "Capture photo"}
                        </Button>
                      </div>
                    )}

                    <div>
                      <Label htmlFor="username">SnapStyles Username</Label>
                      <Input id="username" value={username} onChange={(event) => setUsername(event.target.value.toLowerCase().replace(/^@/, "").replace(/[^a-z0-9._]/g, ""))} placeholder="your.creator.name" minLength={3} maxLength={30} />
                      <p className="mt-1 text-xs text-slate-400">Used in your profile and live-stream links. Your Instagram username is suggested automatically.</p>
                    </div>

                    <div>
                      <Label htmlFor="instagramUsername">Instagram Username</Label>
                      <div className="relative">
                        <Instagram className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-pink-400" />
                        <Input id="instagramUsername" className="pl-10" value={instagramUsername} onChange={(event) => setInstagramUsername(event.target.value.replace(/^@/, ""))} placeholder="your.creator.name" />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone">Contact Number</Label>
                      <Input id="phone" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91 98765 43210" />
                    </div>

                    <div className="border-t border-slate-800 pt-5">
                      <h3 className="mb-4 flex items-center gap-2 font-semibold"><MapPin className="h-4 w-4 text-red-400" />Address</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <Label htmlFor="street">Street Address</Label>
                          <Input id="street" value={address.street} onChange={(event) => setAddress({ ...address, street: event.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input id="city" value={address.city} onChange={(event) => setAddress({ ...address, city: event.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Input id="state" value={address.state} onChange={(event) => setAddress({ ...address, state: event.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input id="postalCode" value={address.postalCode} onChange={(event) => setAddress({ ...address, postalCode: event.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Input id="country" value={address.country} onChange={(event) => setAddress({ ...address, country: event.target.value })} />
                        </div>
                      </div>
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
