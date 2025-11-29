import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useAuth, type UserRole } from "@/lib/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Sprout,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Briefcase,
  FolderKanban,
  Users,
  Search,
} from "lucide-react";
import { useState } from "react";

const roleLabels: Record<UserRole, string> = {
  investor: "Investor",
  farmer: "Farmer",
  jobseeker: "Job Seeker",
};

const roleColors: Record<UserRole, string> = {
  investor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  farmer: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  jobseeker: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
};

interface NavLink {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
}

const investorLinks: NavLink[] = [
  { href: "/investor/projects", label: "Browse Projects", icon: Search },
  { href: "/investor/investments", label: "My Investments", icon: FolderKanban },
];

const farmerLinks: NavLink[] = [
  { href: "/farmer/projects", label: "My Projects", icon: FolderKanban },
  { href: "/farmer/employment", label: "Job Postings", icon: Users },
];

const jobseekerLinks: NavLink[] = [
  { href: "/jobseeker/jobs", label: "Browse Jobs", icon: Search },
  { href: "/jobseeker/applications", label: "My Applications", icon: Briefcase },
];

export function Navigation() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getNavLinks = (): NavLink[] => {
    if (!user) return [];
    switch (user.role) {
      case "investor":
        return investorLinks;
      case "farmer":
        return farmerLinks;
      case "jobseeker":
        return jobseekerLinks;
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link href="/" className="flex items-center gap-2" data-testid="link-home">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <Sprout className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-serif text-xl font-bold">AgroFund</span>
        </Link>

        {isAuthenticated && navLinks.length > 0 && (
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="gap-2"
                    data-testid={`link-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-2">
          <ThemeToggle />

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 px-2" data-testid="button-user-menu">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {user.first_name[0]}
                      {user.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline-block font-medium">
                    {user.first_name}
                  </span>
                  <Badge
                    variant="secondary"
                    className={`hidden sm:inline-flex text-xs ${roleColors[user.role]}`}
                  >
                    {roleLabels[user.role]}
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive"
                  data-testid="button-logout"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" data-testid="link-login">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button data-testid="link-register">Get Started</Button>
              </Link>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {isAuthenticated ? (
              <>
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location === link.href;
                  return (
                    <Link key={link.href} href={link.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className="w-full justify-start gap-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Icon className="h-4 w-4" />
                        {link.label}
                      </Button>
                    </Link>
                  );
                })}
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    className="w-full"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
