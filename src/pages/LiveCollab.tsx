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
  profileType: "photographer" | "creator";
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

const LiveCollab = () => {
  const { toast } = useToast();
  const [permissionState, setPermissionState] = useState<"idle" | "requesting" | "granted" | "denied" | "unsupported" | "error">("idle");
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [searchRadiusKm, setSearchRadiusKm] = useState(10);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<CreatorProfile | null>(null);
  const [userRole, setUserRole] = useState<LiveCollabRole | null>(null);

  const googleMapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const nearbyCreators = useMemo(() => {
    if (!position) return [];
    return sampleCreators
      .filter((creator) => creator.availableForCollab)
      .map((creator) => ({
        ...creator,
        distanceKm: getDistanceKm(position.lat, position.lng, creator.lat, creator.lng),
      }))
      .filter((creator) => creator.distanceKm <= searchRadiusKm)
      .filter((creator) => {
        if (!userRole) return true;
        if (userRole === "creator") {
          return creator.profileType === "photographer";
        }
        if (userRole === "photographer") {
          return creator.profileType === "creator" || creator.profileType === "photographer";
        }
        if (userRole === "business") {
          return creator.profileType === "photographer";
        }
        return true;
      })
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

  useEffect(() => {
    if (position && permissionState === "granted") {
      setIsSearching(true);
      const timer = window.setTimeout(() => setIsSearching(false), 900);
      return () => window.clearTimeout(timer);
    }
  }, [position, searchRadiusKm, permissionState, userRole]);

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
        return nearbyCreators.length > 0
          ? "Creators available nearby. Start a collaboration!"
          : "No collaborators found within 10 km yet.";
      case "denied":
      case "unsupported":
      case "error":
        return errorMessage || "Location access is required to discover collaborators.";
      default:
        return "Requesting your location to find creators nearby.";
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
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-red-200">
                    <Sparkles className="h-4 w-4 text-red-400" /> Live Collab
                  </div>
                  <h1 className="mt-6 text-4xl md:text-5xl font-display font-bold text-white">
                    Find nearby photographers and creators for free creative shoots.
                  </h1>
                  <p className="mt-4 max-w-2xl text-base leading-8 text-slate-300">
                    Allow location access and discover nearby collaborators who are open to low-cost and creative partnership shoots.
                  </p>
                  <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/90 p-6 text-slate-100 shadow-lg shadow-slate-950/20">
                    <p className="text-sm uppercase tracking-[0.32em] text-slate-400">What are you looking for?</p>
                    <p className="mt-3 text-lg font-semibold text-white">Choose the role that best fits your goal.</p>
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {[
                        {
                          value: "creator" as LiveCollabRole,
                          title: "Creator",
                          description: "Looking for paid promotional opportunities from restaurants, brands, and local businesses.",
                        },
                        {
                          value: "photographer" as LiveCollabRole,
                          title: "Photographer",
                          description: "Looking for models or creators for collaborations, either paid or unpaid.",
                        },
                        {
                          value: "business" as LiveCollabRole,
                          title: "Restaurant / Business",
                          description: "Looking for photographers and creators for promotions, social media content, and marketing shoots.",
                        },
                      ].map((roleOption) => (
                        <button
                          key={roleOption.value}
                          type="button"
                          onClick={() => setUserRole(roleOption.value)}
                          className={`rounded-3xl border p-5 text-left transition shadow-sm ${
                            userRole === roleOption.value
                              ? "border-emerald-400 bg-emerald-400/10 text-white shadow-emerald-500/20"
                              : "border-slate-800 bg-slate-900 text-slate-300 hover:border-emerald-400 hover:bg-slate-900/95"
                          }`}
                        >
                          <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{roleOption.title}</p>
                          <p className="mt-3 text-sm leading-6 text-slate-300">{roleOption.description}</p>
                        </button>
                      ))}
                    </div>
                    <p className="mt-5 text-sm text-slate-400">
                      {userRole
                        ? userRole === "creator"
                          ? "You’ll see photographers and promotional partners best suited for paid campaigns."
                          : userRole === "photographer"
                          ? "You’ll see creators and models that are open to collaborative and paid shoots."
                          : "You’ll see photographers and creators suited for restaurant and business promotions."
                        : "Select a role to customize your experience and search results."}
                    </p>
                  </div>
                  <motion.div
                    animate={{ x: [0, 8, -8, 0], opacity: [0.8, 0.3, 0.8, 0.8] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    className="mt-8 h-1 rounded-full bg-gradient-to-r from-emerald-400/50 via-cyan-300/30 to-sky-400/10"
                  />
                </div>

                <Card className="w-full rounded-3xl border border-red-500/10 bg-slate-950/95 p-6 shadow-2xl sm:w-[380px]">
                  <CardHeader>
                    <CardTitle className="text-white">Live search status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="rounded-3xl bg-slate-900/80 p-5">
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Radius</p>
                      <p className="mt-2 text-3xl font-semibold text-white">{searchRadiusKm} km</p>
                      <p className="mt-3 text-sm leading-6 text-slate-300">Creators will appear on the map and results list within this search radius.</p>
                    </div>

                    <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 text-sm text-slate-300">
                      {statusMessage()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </ScrollReveal>

          <div className="grid gap-6 xl:grid-cols-[1.3fr,0.7fr]">
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
                      <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Nearby Creators</p>
                      <h2 className="mt-2 text-3xl font-semibold text-white">Collaborators within 10 km</h2>
                    </div>
                    <div className="rounded-full bg-slate-950/90 px-4 py-2 text-sm font-medium text-slate-300">
                      {nearbyCreators.length} available within {searchRadiusKm} km
                    </div>
                  </div>

                  {permissionState !== "granted" && (
                    <div className="mt-8 rounded-3xl border border-dashed border-slate-700 bg-slate-950/80 p-8 text-center text-slate-300">
                      <p className="text-lg font-semibold text-white">Enable location access to discover creators nearby.</p>
                      <p className="mt-3 text-sm leading-7">If you have denied permission, use the button below to retry the request.</p>
                      <Button className="mt-5 bg-red-500 text-slate-950 hover:bg-red-400" onClick={requestLocation}>
                        Retry Location Access
                      </Button>
                    </div>
                  )}

                  {permissionState === "granted" && nearbyCreators.length === 0 && (
                    <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-950/80 p-8 text-center text-slate-300">
                      <p className="text-lg font-semibold text-white">No collaborators found nearby yet.</p>
                      <p className="mt-3 text-sm leading-7">Check back later or expand your search area in the future.</p>
                    </div>
                  )}

                  {permissionState === "granted" && nearbyCreators.length > 0 && (
                    <div className="mt-8 space-y-4">
                      {nearbyCreators.map((creator) => (
                        <Card key={creator.id} className="rounded-3xl border border-slate-800 bg-slate-950/95 p-6">
                          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div className="space-y-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm uppercase tracking-[0.24em] text-slate-400">{creator.role}</p>
                                <Badge variant="secondary">{creator.city}</Badge>
                              </div>
                              <h3 className="text-2xl font-semibold text-white">{creator.name}</h3>
                              <p className="max-w-2xl text-sm leading-7 text-slate-300">{creator.bio}</p>
                              <div className="flex flex-wrap gap-2">
                                {creator.tags.map((tag) => (
                                  <Badge key={tag}>{tag}</Badge>
                                ))}
                              </div>
                            </div>

                            <div className="flex flex-col gap-3 text-right sm:text-left lg:text-right">
                              <div className="rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Distance</p>
                                <p className="mt-1 text-lg font-semibold text-white">{creator.distanceKm.toFixed(1)} km</p>
                              </div>
                              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end lg:flex-col">
                                <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => setSelectedCreator(creator)}>
                                  View Profile
                                </Button>
                                <Button className="bg-red-500 text-slate-950 hover:bg-red-400" onClick={() => handleStartChat(creator)}>
                                  <MessageCircle className="w-4 h-4" /> Start Chat
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
