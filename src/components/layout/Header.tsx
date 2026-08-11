import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, Loader2, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { useAnimation } from "@/contexts/AnimationContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, loading, signOut } = useAuth();
  const { animationsEnabled } = useAnimation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setIsMenuOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const Logo = () => (
    <Link to="/" className="flex items-center gap-1 group">
      <motion.div
        className="relative flex items-center"
        whileHover={animationsEnabled ? { scale: 1.02 } : undefined}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        <span className="font-display text-2xl font-bold">
          <span className={scrolled ? "text-primary" : "text-white"}>Snap</span>
          <span className="text-accent relative">
            Styles
            {animationsEnabled ? (
              <motion.span
                className="absolute -top-1 -right-3"
                animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.2, 0.9, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                <Sparkles className="w-4 h-4 text-accent" />
              </motion.span>
            ) : (
              <span className="absolute -top-1 -right-3">
                <Sparkles className="w-4 h-4 text-accent" />
              </span>
            )}
          </span>
        </span>
      </motion.div>
    </Link>
  );

  const resolvePath = (item: string) => {
    if (item === "Home") return "/";
    if (item === "Snap Levels") return "/creator-levels";
    if (item === "Orders") return "/orders";
    return `/${item.toLowerCase().replace(" ", "-")}`;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-transparent border-transparent"
      }`}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo />

          {/* ================= DESKTOP NAV ================= */}
          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
          >
            {["Home", "Services", "Live Collab", "Snap Stream", "Orders", "Snap Levels", "Contact"].map(
              (item) => (
                <Link
                  key={item}
                  to={resolvePath(item)}
                  className={`text-base font-medium px-2 py-1 rounded-lg transition-all duration-200 hover:text-accent ${
                    scrolled
                      ? "text-foreground"
                      : "text-white/90 hover:text-white"
                  }`}
                >
                  {item === "Snap Levels" ? (
                    <span className="flex items-center gap-1">
                      Snap Levels
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400 text-black">
                        NEW
                      </span>
                    </span>
                  ) : (
                    item
                  )}
                </Link>
              )
            )}
          </nav>

          {/* ================= CTA / AUTH ================= */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-accent text-accent-foreground text-sm">
                        {profile?.display_name
                          ? getInitials(profile.display_name)
                          : "SS"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">
                      {profile?.display_name || "Creator"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className={`rounded-lg px-4 py-2 transition-all ${
                    scrolled
                      ? "hover:bg-accent/10"
                      : "text-white hover:bg-white/10"
                  }`}
                  asChild
                >
                  <Link to="/login">Log in</Link>
                </Button>
                <Button
                  className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl px-5 py-2 shadow-lg hover:shadow-xl transition-all"
                  asChild
                >
                  <Link to="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* ================= MOBILE TOGGLE ================= */}
          <button
            className={`md:hidden p-2 rounded-lg transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              scrolled ? "hover:bg-accent/10" : "text-white hover:bg-white/10"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden py-4 border-t border-border bg-background/95 backdrop-blur-md"
          >
            <nav className="flex flex-col gap-2">
              {['Home', 'Services', 'Live Collab', 'Snap Stream', 'Orders', 'Snap Levels', 'Contact'].map(
                (item) => (
                  <Link
                    key={item}
                    to={resolvePath(item)}
                    className="text-base font-medium px-4 py-3 rounded-lg hover:bg-accent/10 hover:text-accent transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item}
                  </Link>
                )
              )}

              <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-border">
                {user ? (
                  <>
                    <Button variant="outline" className="rounded-lg" asChild>
                      <Link
                        to="/dashboard"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-destructive hover:text-destructive rounded-lg"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="rounded-lg" asChild>
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Log in
                      </Link>
                    </Button>
                    <Button
                      className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg"
                      asChild
                    >
                      <Link
                        to="/signup"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
