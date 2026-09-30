import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, Menu, X } from "lucide-react"; 
import { Button } from "@/components/ui/button"; 
import { useAuthStore } from "@/store/authStore"; 
import { useLogout } from "@/hooks/useAuth"; 

export default function Navbar() {
  const { user, isAuthenticated } = useAuthStore();
  const logout = useLogout();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout.mutate(undefined, { 
      onSuccess: () => {
        setOpen(false);
        navigate("/"); 
      }
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold text-lg">
          <Leaf className="h-6 w-6 text-primary" /> OnlineMedicalCard
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <a href="/#how-it-works" className="text-muted-foreground hover:text-primary">How it works</a>
          <a href="/#pricing" className="text-muted-foreground hover:text-primary">Pricing</a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="text-sm font-medium text-muted-foreground">
                Hi, {user?.fullName ? user.fullName.split(" ")[0] : "User"} {/* ⚡ FIXED HERE */}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout} disabled={logout.isPending}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/register">Get your card</Link>
              </Button>
            </>
          )}
        </div>

        <button className="block md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
    </header>
  );
}
