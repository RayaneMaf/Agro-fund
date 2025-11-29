import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sprout,
  TrendingUp,
  Briefcase,
  Users,
  Shield,
  MapPin,
  ChartBar,
  Handshake,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

const userTypes = [
  {
    title: "Farmer",
    description:
      "Post your farming projects, find investors for your land, and hire workers for seasonal work",
    icon: Sprout,
    href: "/register?role=farmer",
    color: "bg-green-500",
    features: ["Post agricultural projects", "Find investors", "Hire workers"],
  },
  {
    title: "Investor",
    description:
      "Browse farming projects, analyze risks with AI, and invest in agriculture across Algeria",
    icon: TrendingUp,
    href: "/register?role=investor",
    color: "bg-blue-500",
    features: ["Browse projects", "AI risk assessment", "Track investments"],
  },
  {
    title: "Job Seeker",
    description:
      "Find employment opportunities in agriculture, from harvesting to equipment operation",
    icon: Briefcase,
    href: "/register?role=jobseeker",
    color: "bg-purple-500",
    features: ["Browse job listings", "Apply easily", "Track applications"],
  },
];

const howItWorks = [
  {
    step: 1,
    title: "Create Your Profile",
    description:
      "Sign up as a farmer, investor, or job seeker and complete your profile",
    icon: Users,
  },
  {
    step: 2,
    title: "Connect & Discover",
    description:
      "Browse projects, find opportunities, or post your own farming projects",
    icon: MapPin,
  },
  {
    step: 3,
    title: "Invest & Grow",
    description:
      "Make secure investments, hire workers, and grow your agricultural business",
    icon: Handshake,
  },
];

const features = [
  {
    title: "AI-Powered Risk Assessment",
    description:
      "Our advanced AI analyzes environmental factors, soil quality, and wilayaal data to provide accurate risk scores for every project",
    icon: ChartBar,
  },
  {
    title: "58 wilayas Covered",
    description:
      "Access farming projects and job opportunities across all wilayas of Algeria, from Coastal areas to the Sahara",
    icon: MapPin,
  },
  {
    title: "Secure Investments",
    description:
      "Track your investments with real-time updates, transparent profit sharing, and complete project visibility",
    icon: Shield,
  },
];

const stats = [
  { value: "500+", label: "Active Projects" },
  { value: "2M+ DZD", label: "Total Investments" },
  { value: "1,200+", label: "Jobs Posted" },
  { value: "94%", label: "Success Rate" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  Grow Agriculture,{" "}
                  <span className="text-primary">Together</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl">
                  AgroFund connects farmers with investors and job seekers,
                  creating opportunities for growth across Algeria's
                  agricultural sector.
                </p>
              </div>

              <div className="space-y-4">
                {userTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Link key={type.title} href={type.href}>
                      <Card
                        className="group hover-elevate cursor-pointer transition-all duration-200"
                        data-testid={`card-usertype-${type.title.toLowerCase()}`}
                      >
                        <CardContent className="flex items-center gap-4 p-4">
                          <div
                            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${type.color}`}
                          >
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg">
                              {type.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {type.description}
                            </p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    data-testid="button-login-hero"
                  >
                    Log in to your account
                  </Button>
                </Link>
              </div>
            </div>

            <div className="hidden lg:block relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 p-8">
                <div className="h-full w-full rounded-xl bg-card border flex items-center justify-center">
                  <div className="text-center space-y-4 p-8">
                    <div className="flex justify-center">
                      <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                        <Sprout className="h-12 w-12 text-primary" />
                      </div>
                    </div>
                    <h3 className="font-serif text-2xl font-bold">
                      Agricultural Investment Platform
                    </h3>
                    <p className="text-muted-foreground">
                      Connecting farmers, investors, and workers across 58
                      Algerian wilayas
                    </p>
                    <div className="flex justify-center gap-2 pt-4">
                      {["Coastal", "Highlands", "Steppe", "Sahara"].map(
                        (zone) => (
                          <span
                            key={zone}
                            className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                          >
                            {zone}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps and begin your agricultural
              journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {howItWorks.map((item) => {
              const Icon = item.icon;
              return (
                <Card key={item.step} className="text-center">
                  <CardContent className="pt-8 pb-6 space-y-4">
                    <div className="relative inline-flex">
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <span className="absolute -top-1 -right-1 h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="font-semibold text-xl">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
              Key Features
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Powerful tools to help you succeed in agricultural investment and
              employment
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title}>
                  <CardContent className="pt-6 space-y-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-xl">{feature.title}</h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl sm:text-5xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary/5 to-accent/10 border-0">
            <CardContent className="py-12 px-8 text-center">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                Join thousands of farmers, investors, and job seekers already
                using AgroFund to grow Algeria's agricultural sector.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="gap-2"
                    data-testid="button-cta-register"
                  >
                    Create Your Account
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    size="lg"
                    variant="outline"
                    data-testid="button-cta-login"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <Sprout className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-serif text-lg font-bold">AgroFund</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting Algeria's agricultural community
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
