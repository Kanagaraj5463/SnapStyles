import { useEffect, useMemo, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { Compass, MapPin, MessageCircle, Sparkles, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type LiveCollabRole = "creator" | "photographer" | "business";

interface CreatorProfile {
  id: string;
  name: string;
  role: string;
  city: string;
  bio: string;
  email: string;
  lat: number;
  lng: number;
  tags: string[];
  profileType: "photographer" | "creator" | "business" | "cinematographer";
  collabType: string;
  availableForCollab: boolean;
}

const sampleCreators: CreatorProfile[] = [
  {
    id: "aria-kapoor",
    name: "Aria Kapoor",
    role: "Portrait Photographer",
    city: "South Delhi",
    bio: "Creative portrait and editorial shoots with a cinematic touch.",
    email: "aria.kapoor@example.com",
    lat: 28.545, // near Delhi
    lng: 77.192,
    tags: ["Portrait", "Fashion", "Editorial"],
    profileType: "photographer",
    collabType: "Brand promotions & editorial shoots",
    availableForCollab: true,
  },
  {
    id: "sam-rathi",
    name: "Sam Rathi",
    role: "Creative Filmmaker",
    city: "Gurgaon",
    bio: "Short films, motion stories, and collaborative creative content.",
    email: "sam.rathi@example.com",
    lat: 28.4595,
    lng: 77.0266,
    tags: ["Video", "Film", "Lifestyle"],
    profileType: "photographer",
    collabType: "Lifestyle campaigns & social video shoots",
    availableForCollab: true,
  },
  {
    id: "mira-shah",
    name: "Mira Shah",
    role: "Stylist & Creator",
    city: "Noida",
    bio: "Style-led creative direction for shoots, campaigns, and content.",
    email: "mira.shah@example.com",
    lat: 28.5355,
    lng: 77.3910,
    tags: ["Styling", "Brand", "Fashion"],
    profileType: "creator",
    collabType: "Fashion campaigns & model collaborations",
    availableForCollab: false,
  },
  {
    id: "arya-verma",
    name: "Arya Verma",
    role: "Lifestyle Photographer",
    city: "Central Delhi",
    bio: "Natural light, candid storytelling, and creative brand imagery.",
    email: "arya.verma@example.com",
    lat: 28.6139,
    lng: 77.2090,
    tags: ["Lifestyle", "Travel", "Brand"],
    profileType: "photographer",
    collabType: "Travel & brand storytelling shoots",
    availableForCollab: true,
  },
  {
    id: "dev-kumar",
    name: "Dev Kumar",
    role: "Cinematographer",
    city: "Ghaziabad",
    bio: "Cinematic storytelling for events, brands, and social campaigns.",
    email: "dev.kumar@example.com",
    lat: 28.6692,
    lng: 77.4538,
    tags: ["Cinema", "Video", "Storytelling"],
    profileType: "cinematographer",
    collabType: "Branded film campaigns and motion content",
    availableForCollab: true,
  },
  {
    id: "skyline-bistro",
    name: "Skyline Bistro",
    role: "Restaurant Owner",
    city: "South Delhi",
    bio: "Modern bistro looking for creative food and lifestyle shoots for launch campaigns.",
    email: "contact@skylinebistro.example.com",
    lat: 28.5445,
    lng: 77.1928,
    tags: ["Food", "Lifestyle", "Brand"],
    profileType: "business",
    collabType: "Food, drink, and brand marketing collaborations",
    availableForCollab: true,
  },
];

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

const getDistanceKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
};

const radiusOptions = [1, 2, 5, 10, 20, 30, 50];

const getZoomFromRadius = (radiusKm: number) => {
  if (radiusKm <= 1) return 15;
  if (radiusKm <= 2) return 14;
  if (radiusKm <= 5) return 13;
  if (radiusKm <= 10) return 12;
  if (radiusKm <= 20) return 11;
  if (radiusKm <= 30) return 10;
  return 9;
};

const roleOptions: Array<{
  value: LiveCollabRole;
  title: string;
  description: string;
}> = [
  {
    value: "creator",
    title: "Creator",
    description: "Looking for paid promotional opportunities from restaurants, brands, and local businesses.",
  },
  {
    value: "photographer",
    title: "Photographer",
    description: "Looking for models or creators for collaborations, either paid or unpaid.",
  },
  {
    value: "business",
    title: "Restaurant / Business",
    description: "Looking for photographers and creators for promotions, social media content, and marketing shoots.",
  },
];

const LiveCollab = () => {
  const { toast } = useToast();
  const [permissionState, setPermissionState] = useState<"idle" | "requesting" | "granted" | "denied" | "unsupported" | "error">("idle");
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [searchRadiusKm, setSearchRadiusKm] = useState(10);
  const [searchStarted, setSearchStarted] = useState(false);
  const [autoChatTriggered, setAutoChatTriggered] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<CreatorProfile | null>(null);
  const [userRole, setUserRole] = useState<LiveCollabRole | null>(null);

  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const searchTargetTypes: Record<LiveCollabRole, CreatorProfile["profileType"][]> = {
    photographer: ["creator", "business"],
    creator: ["photographer", "cinematographer", "business"],
    business: ["photographer", "creator"],
  };

  const searchTargetLabel = (role: LiveCollabRole | null) => {
    if (role === "photographer") return "Creators, businesses, and restaurants";
    if (role === "creator") return "Photographers, cinematographers, and businesses";
    if (role === "business") return "Photographers and creators";
    return "collaborators";
  };

  const nearbyCreators = useMemo(() => {
    if (!position || !userRole) return [];
    return sampleCreators
      .filter((creator) => creator.availableForCollab)
      .map((creator) => ({
        ...creator,
        distanceKm: getDistanceKm(position.lat, position.lng, creator.lat, creator.lng),
      }))
      .filter((creator) => creator.distanceKm <= searchRadiusKm)
      .filter((creator) => searchTargetTypes[userRole].includes(creator.profileType))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [position, searchRadiusKm, userRole]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setPermissionState("unsupported");
      setErrorMessage("Location access is not supported by your browser.");
      return;
    }

    setPermissionState("requesting");
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({ lat: position.coords.latitude, lng: position.coords.longitude });
        setPermissionState("granted");
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setPermissionState("denied");
          setErrorMessage("Location permission was denied. Enable it to discover nearby collaborators.");
        } else {
          setPermissionState("error");
          setErrorMessage("Unable to fetch your location. Try again or check your browser settings.");
        }
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 300000 },
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const startSearch = () => {
    if (!userRole || !position || permissionState !== "granted") {
      toast({
        title: "Search unavailable",
        description: "Select your role, allow location access, and then start searching.",
      });
      return;
    }

    setSearchStarted(true);
    setAutoChatTriggered(false);
    setIsSearching(true);

    window.setTimeout(() => {
      setIsSearching(false);
    }, 1200);
  };

  useEffect(() => {
    if (searchStarted && nearbyCreators.length > 0 && !autoChatTriggered) {
      setAutoChatTriggered(true);
      const first = nearbyCreators[0];
      toast({
        title: "Collaborator found",
        description: `Found ${nearbyCreators.length} nearby. Starting chat with ${first.name}.`,
      });
      setTimeout(() => handleStartChat(first), 600);
    }
  }, [searchStarted, nearbyCreators, autoChatTriggered]);

  const mapZoom = getZoomFromRadius(searchRadiusKm);
  const mapUrl = position
    ? googleMapsKey
      ? `https://www.google.com/maps/embed/v1/view?key=${googleMapsKey}&center=${position.lat},${position.lng}&zoom=${mapZoom}&maptype=roadmap`
      : `https://www.google.com/maps?q=${position.lat},${position.lng}&z=${mapZoom}&output=embed`
    : "";

  const creatorEmailLink = (creator: CreatorProfile) =>
    `mailto:${creator.email}?subject=Live Collab%20Invitation&body=Hi%20${encodeURIComponent(
      creator.name,
    )}%2C%0A%0AI%27m%20interested%20in%20collaborating%20on%20a%20free%20creative%20shoot.%20Let%27s%20connect%21`;

  const handleStartChat = (creator: CreatorProfile) => {
    window.location.href = creatorEmailLink(creator);
    toast({ title: "Chat started", description: `Preparing an email to ${creator.name}.` });
  };

  const statusMessage = () => {
    switch (permissionState) {
      case "requesting":
        return "Waiting for location permission...";
      case "granted":
        if (!searchStarted) {
          return "Ready to search. Choose a role and radius, then tap Start Search.";
        }
        return nearbyCreators.length > 0
          ? `Found ${nearbyCreators.length} ${searchTargetLabel(userRole).toLowerCase()} nearby. Starting chat now...`
          : `No ${searchTargetLabel(userRole).toLowerCase()} found within ${searchRadiusKm} km yet.`;
      case "denied":
      case "unsupported":
      case "error":
        return errorMessage || "Location access is required to discover collaborators.";
      default:
        return "Requesting your location to find collaborators nearby.";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative overflow-hidden mb-10 rounded-[2rem] border border-red-500/10 bg-slate-900/90 p-10 shadow-[0_40px_120px_-50px_rgba(248,113,113,0.4)]"
            >
              <motion.div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.18),transparent_35%)]"
                animate={{ opacity: [0.22, 0.06, 0.22] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="pointer-events-none absolute right-4 top-10 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl"
                animate={{ scale: [1, 1.18, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              />
              <div className="grid gap-8 lg:grid-cols-[1.35fr,0.85fr]">
                <div className="space-y-8">
                  <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-red-200">
                    <Sparkles className="h-4 w-4 text-red-400" /> Live Collab
                  </div>
                  <div className="max-w-2xl">
                    <h1 className="mt-6 text-4xl md:text-5xl font-display font-bold text-white">
                      Discover creators, photographers, and businesses near you.
                    </h1>
                    <p className="mt-4 text-lg leading-8 text-slate-300">
                      Start by selecting who you are, choose the distance you want to search within, and let the map show the best nearby collaborators based on your goal.
                    </p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/95 p-6">
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Your location</p>
                      <p className="mt-3 text-lg font-semibold text-white">
                        {permissionState === "granted" && position
                          ? `${position.lat.toFixed(4)}, ${position.lng.toFixed(4)}`
                          : permissionState === "requesting"
                          ? "Finding your current GPS location..."
                          : permissionState === "denied"
                          ? "Location disabled"
                          : "Waiting for permission..."}
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        {permissionState === "granted" && position
                          ? "Your map is centered on your current position."
                          : permissionState === "denied"
                          ? "Allow location access for better nearby search results."
                          : "Grant location permission to see nearby collaborators."}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/95 p-6">
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Role selected</p>
                      <p className="mt-3 text-lg font-semibold text-white">
                        {userRole ? roleOptions.find((option) => option.value === userRole)?.title : "None selected"}
                      </p>
                      <p className="mt-2 text-sm text-slate-400">
                        {userRole
                          ? roleOptions.find((option) => option.value === userRole)?.description
                          : "Pick the role that matches why you’re using Live Collab."}
                      </p>
                    </div>
                    <div className="rounded-3xl border border-slate-800 bg-slate-950/95 p-6">
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Search radius</p>
                      <p className="mt-3 text-lg font-semibold text-white">{searchRadiusKm} km</p>
                      <p className="mt-2 text-sm text-slate-400">Change the radius to automatically refresh nearby results.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <Card className="rounded-3xl border border-red-500/10 bg-slate-950/95 p-6 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-white">Who are you?</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Choose the role that matches your search</p>
                      <div className="grid gap-3">
                        {roleOptions.map((roleOption) => (
                          <button
                            key={roleOption.value}
                            type="button"
                            onClick={() => setUserRole(roleOption.value)}
                            className={`rounded-3xl border p-4 text-left transition ${
                              userRole === roleOption.value
                                ? "border-emerald-400 bg-emerald-400/10 text-white"
                                : "border-slate-800 bg-slate-900 text-slate-300 hover:border-emerald-400"
                            }`}
                          >
                            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{roleOption.title}</p>
                            <p className="mt-2 text-sm leading-6 text-slate-300">{roleOption.description}</p>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-3xl border border-red-500/10 bg-slate-950/95 p-6 shadow-2xl">
                    <CardHeader>
                      <CardTitle className="text-white">Search radius</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Select radius</p>
                      <div className="grid grid-cols-2 gap-3">
                        {radiusOptions.map((radius) => (
                          <button
                            key={radius}
                            type="button"
                            onClick={() => setSearchRadiusKm(radius)}
                            className={`rounded-3xl border px-4 py-3 text-sm transition ${
                              searchRadiusKm === radius
                                ? "border-emerald-400 bg-emerald-400/15 text-emerald-200"
                                : "border-slate-800 bg-slate-900 text-slate-300 hover:border-emerald-400"
                            }`}
                          >
                            {radius} km
                          </button>
                        ))}
                      </div>
                      <div className="mt-4 rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
                        <p className="font-medium text-white">Search trigger</p>
                        <p className="mt-2 text-slate-400">Tap Start Search when your role and radius are set.</p>
                        <Button
                          className="mt-4 w-full bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                          onClick={startSearch}
                          disabled={!userRole || permissionState !== "granted"}
                        >
                          Start Search
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </ScrollReveal>

          <ScrollReveal>
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="rounded-3xl border border-red-500/10 bg-slate-900/95 p-8 shadow-[0_40px_120px_-50px_rgba(248,113,113,0.3)]"
            >
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Live map search</p>
                  <h2 className="mt-2 text-3xl font-semibold text-white">Your current search radius and active map</h2>
                </div>
                <div className="rounded-full bg-slate-950/90 px-4 py-2 text-sm font-medium text-slate-300">
                  {userRole ? `Role: ${roleOptions.find((option) => option.value === userRole)?.title}` : "Select a role to begin"}
                </div>
              </div>

              <div className="mt-8 grid gap-6 xl:grid-cols-[1.4fr,0.8fr]">
                <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-black/30 shadow-xl">
                  {position ? (
                    <>
                      <iframe
                        title="Live Collab Map"
                        src={mapUrl}
                        className="h-[420px] w-full"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                      <div className="pointer-events-none absolute inset-0">
                        <motion.div
                          animate={{ scale: [1, 1.04, 1], opacity: [0.15, 0.06, 0.15] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/20 bg-emerald-400/10 blur-2xl"
                        />
                        <motion.div
                          animate={{ scale: [0.95, 1.15, 0.95], opacity: [0.7, 0.22, 0.7] }}
                          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute left-1/2 top-1/2 h-[120px] w-[120px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-300/40"
                        />
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                          className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/10"
                        />
                        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                          <div className="h-5 w-5 rounded-full bg-emerald-400 shadow-[0_0_0_12px_rgba(16,185,129,0.18)]" />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex h-[420px] items-center justify-center rounded-3xl bg-slate-950 text-center text-sm text-slate-400 px-4">
                      {permissionState === "denied" ? (
                        <div>
                          <p className="font-semibold text-white">Location permission is required.</p>
                          <p className="mt-2 text-slate-400">Allow location access to show the map and nearby results.</p>
                        </div>
                      ) : (
                        <p className="font-semibold text-white">Waiting for location...</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/95 p-6 shadow-lg">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Search pulse</p>
                    <div className="mt-4 flex items-center gap-4">
                      <div className="relative flex h-14 w-14 items-center justify-center">
                        <motion.div
                          animate={isSearching ? { scale: [0.9, 1.22, 0.95], opacity: [0.4, 0.08, 0.4] } : { scale: 1, opacity: 0.15 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute h-16 w-16 rounded-full bg-emerald-400/15 blur-3xl"
                        />
                        <motion.div
                          animate={isSearching ? { scale: [1, 1.2, 1], opacity: [0.9, 0.3, 0.9] } : { scale: 1, opacity: 0.35 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                          className="absolute h-12 w-12 rounded-full bg-emerald-400/25"
                        />
                        <motion.div
                          animate={isSearching ? { scale: [1.05, 1.3, 1.05], opacity: [1, 0.5, 1] } : { scale: 1, opacity: 0.6 }}
                          transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
                          className="relative flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400 shadow-[0_0_0_16px_rgba(16,185,129,0.18)]"
                        >
                          <motion.span
                            animate={isSearching ? { opacity: [1, 0.2, 1] } : { opacity: 0.8 }}
                            transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
                            className="h-4 w-4 rounded-full bg-slate-950"
                          />
                        </motion.div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{isSearching ? "Actively scanning your search radius..." : "Search ready."}</p>
                        <p className="text-sm text-slate-300">{isSearching ? "Live scan in progress across your selected radius." : "Pick a role and radius to start scanning."}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-400">
                      {userRole
                        ? `Searching for ${searchTargetLabel(userRole).toLowerCase()} in your area.`
                        : "Select a role to enable search and results."}
                    </p>
                  </div>
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/95 p-6 shadow-lg">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Search status</p>
                    <p className="mt-3 text-lg font-semibold text-white">{statusMessage()}</p>
                    <div className="mt-4 grid gap-3">
                      <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
                        <p className="uppercase tracking-[0.24em] text-slate-500">Role</p>
                        <p className="mt-1 text-white">{userRole ? roleOptions.find((option) => option.value === userRole)?.title : "Not selected"}</p>
                      </div>
                      <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-300">
                        <p className="uppercase tracking-[0.24em] text-slate-500">Radius</p>
                        <p className="mt-1 text-white">{searchRadiusKm} km</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          </ScrollReveal>

          <div className="grid gap-6 xl:grid-cols-[1.4fr,0.8fr]">
            <div className="space-y-6">
              <ScrollReveal>
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="rounded-3xl border border-red-500/10 bg-slate-900/95 p-8 shadow-[0_40px_120px_-50px_rgba(248,113,113,0.3)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Nearby results</p>
                      <h2 className="mt-2 text-3xl font-semibold text-white">Matched collaborators</h2>
                    </div>
                    <div className="rounded-full bg-slate-950/90 px-4 py-2 text-sm font-medium text-slate-300">
                      {nearbyCreators.length} found
                    </div>
                  </div>

                  {!userRole ? (
                    <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/80 p-8 text-center text-slate-300">
                      <p className="text-lg font-semibold text-white">Start by selecting who you are.</p>
                      <p className="mt-3 text-sm leading-7">Choose Creator, Photographer, or Restaurant / Business to see the best matches.</p>
                    </div>
                  ) : permissionState !== "granted" ? (
                    <div className="mt-8 rounded-3xl border border-dashed border-slate-700 bg-slate-950/80 p-8 text-center text-slate-300">
                      <p className="text-lg font-semibold text-white">Location access is required.</p>
                      <p className="mt-3 text-sm leading-7">Allow location permission to reveal nearby collaborators on the map.</p>
                    </div>
                  ) : !searchStarted ? (
                    <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/80 p-8 text-center text-slate-300">
                      <p className="text-lg font-semibold text-white">Ready to search.</p>
                      <p className="mt-3 text-sm leading-7">Tap Start Search once your role and radius are set.</p>
                    </div>
                  ) : nearbyCreators.length === 0 ? (
                    <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/80 p-8 text-center text-slate-300">
                      <p className="text-lg font-semibold text-white">No collaborators found nearby.</p>
                      <p className="mt-3 text-sm leading-7">Try increasing your search radius or check back later.</p>
                    </div>
                  ) : (
                    <div className="mt-8 space-y-4">
                      {nearbyCreators.map((creator) => (
                        <Card key={creator.id} className="rounded-3xl border border-slate-800 bg-slate-950/95 p-6">
                          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-900 text-xl font-semibold text-white">
                                {creator.name
                                  .split(" ")
                                  .map((part) => part[0])
                                  .join("")
                                  .slice(0, 2)}
                              </div>
                              <div>
                                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{creator.role}</p>
                                <h3 className="text-2xl font-semibold text-white">{creator.name}</h3>
                                <p className="mt-2 text-sm text-slate-300">{creator.bio}</p>
                              </div>
                            </div>
                            <div className="flex flex-col gap-4 sm:items-end lg:items-end">
                              <div className="rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Distance</p>
                                <p className="mt-1 text-lg font-semibold text-white">{creator.distanceKm.toFixed(1)} km</p>
                                <p className="mt-2 text-xs uppercase tracking-[0.24em] text-slate-500">Collab type</p>
                                <p className="mt-1 text-sm text-slate-300">{creator.collabType}</p>
                              </div>
                              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setSelectedCreator(creator)}>
                                  View Profile
                                </Button>
                                <Button className={`text-slate-950 ${creator.availableForCollab ? "bg-red-500 hover:bg-red-400" : "bg-slate-700 cursor-not-allowed"}`} onClick={() => creator.availableForCollab && handleStartChat(creator)}>
                                  <MessageCircle className="w-4 h-4" /> {creator.availableForCollab ? "Start Chat" : "Unavailable"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </motion.section>
              </ScrollReveal>
            </div>

            <div className="space-y-6">
              <ScrollReveal>
                <motion.section
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="rounded-3xl border border-red-500/10 bg-slate-900/95 p-8 shadow-[0_40px_120px_-50px_rgba(248,113,113,0.3)]"
                >
                  <div className="flex items-center gap-3 text-sm text-slate-300 uppercase tracking-[0.24em]">
                    <Users className="h-5 w-5 text-red-400" />
                    Collaboration tips
                  </div>
                  <div className="mt-6 space-y-4 text-sm leading-7 text-slate-300">
                    <p>Use this page to find creative partners and launch free shoots with local photographers and storytellers.</p>
                    <p>Look for creators with a strong style fit and start the chat with a friendly collaboration pitch.</p>
                    <p>Enable your location and refresh the page if you move more than 10 km from your current spot.</p>
                    <p>Creators are shown only when they’ve enabled the Live Collab option.</p>
                  </div>
                </motion.section>

                {selectedCreator && (
                  <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="rounded-3xl border border-red-500/10 bg-slate-950/95 p-8 shadow-[0_40px_120px_-50px_rgba(248,113,113,0.3)]"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Selected Creator</p>
                        <h2 className="mt-2 text-3xl font-semibold text-white">{selectedCreator.name}</h2>
                      </div>
                      <Button variant="outline" className="border-slate-700 text-slate-300 hover:border-red-400 hover:text-white" onClick={() => setSelectedCreator(null)}>
                        Close
                      </Button>
                    </div>

                    <div className="mt-6 space-y-4 text-slate-300">
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">About</p>
                      <p>{selectedCreator.bio}</p>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="rounded-3xl bg-slate-900/80 p-4">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Role</p>
                          <p className="mt-2 font-semibold text-white">{selectedCreator.role}</p>
                        </div>
                        <div className="rounded-3xl bg-slate-900/80 p-4">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-500">City</p>
                          <p className="mt-2 font-semibold text-white">{selectedCreator.city}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedCreator.tags.map((tag) => (
                          <Badge key={tag}>{tag}</Badge>
                        ))}
                      </div>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Button className="bg-red-500 text-slate-950 hover:bg-red-400" onClick={() => handleStartChat(selectedCreator)}>
                          <MessageCircle className="w-4 h-4" /> Email {selectedCreator.name}
                        </Button>
                        <a
                          href={creatorEmailLink(selectedCreator)}
                          className="text-sm text-slate-400 underline hover:text-white"
                        >
                          {selectedCreator.email}
                        </a>
                      </div>
                    </div>
                  </motion.section>
                )}
              </ScrollReveal>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LiveCollab;
