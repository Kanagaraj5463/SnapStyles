import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-lg rounded-b-xl transition-all duration-300" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 md:h-20 py-2 md:py-0">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <span className="text-white font-bold text-base">SS</span>
            </div>
            <span className="font-display text-2xl font-bold text-foreground group-hover:text-accent transition-colors">
              Snap<span className="text-accent">Styles</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            <Link to="/" className="text-base font-semibold px-2 py-1 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 hover:bg-accent/10 hover:text-accent data-[active=true]:underline data-[active=true]:text-accent" tabIndex={0}>
              Home
            </Link>
            <Link to="/services" className="text-base font-semibold px-2 py-1 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 hover:bg-accent/10 hover:text-accent data-[active=true]:underline data-[active=true]:text-accent" tabIndex={0}>
              Services
            </Link>
            <Link to="/snap-stream" className="text-base font-semibold px-2 py-1 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 hover:bg-accent/10 hover:text-accent data-[active=true]:underline data-[active=true]:text-accent" tabIndex={0}>
              Snap Stream
            </Link>
            <Link to="/contact" className="text-base font-semibold px-2 py-1 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 hover:bg-accent/10 hover:text-accent data-[active=true]:underline data-[active=true]:text-accent" tabIndex={0}>
              Contact
            </Link>
          </nav>

          {/* CTA Buttons */}
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
                        {profile?.display_name ? getInitials(profile.display_name) : "SS"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{profile?.display_name || "Creator"}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" className="rounded-lg px-4 py-2 hover:bg-accent/10 transition-all" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button className="bg-accent hover:bg-orange-500 text-accent-foreground font-semibold rounded-lg px-4 py-2 shadow-md transition-all" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            tabIndex={0}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border rounded-b-xl shadow-lg bg-background/95 animate-fade-in-down">
            <nav className="flex flex-col gap-4">
              <Link to="/" className="text-base font-semibold px-2 py-2 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 hover:bg-accent/10 hover:text-accent" onClick={() => setIsMenuOpen(false)} tabIndex={0}>
                Home
              </Link>
              <Link to="/services" className="text-base font-semibold px-2 py-2 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 hover:bg-accent/10 hover:text-accent" onClick={() => setIsMenuOpen(false)} tabIndex={0}>
                Services
              </Link>
              <Link to="/snap-stream" className="text-base font-semibold px-2 py-2 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 hover:bg-accent/10 hover:text-accent" onClick={() => setIsMenuOpen(false)} tabIndex={0}>
                Snap Stream
              </Link>
              <Link to="/contact" className="text-base font-semibold px-2 py-2 rounded-lg transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 hover:bg-accent/10 hover:text-accent" onClick={() => setIsMenuOpen(false)} tabIndex={0}>
                Contact
              </Link>
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                {user ? (
                  <>
                    <Button variant="outline" className="rounded-lg px-4 py-2" asChild>
                      <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="text-destructive hover:text-destructive rounded-lg px-4 py-2"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="rounded-lg px-4 py-2" asChild>
                      <Link to="/login" onClick={() => setIsMenuOpen(false)}>Log in</Link>
                    </Button>
                    <Button className="bg-accent hover:bg-orange-500 text-accent-foreground font-semibold rounded-lg px-4 py-2 shadow-md transition-all" asChild>
                      <Link to="/signup" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
