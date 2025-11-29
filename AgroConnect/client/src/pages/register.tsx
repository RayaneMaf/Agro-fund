import { useState, useEffect } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth, type UserRole } from "@/lib/auth";
import {
  insertFarmerSchema,
  insertInvestorSchema,
  insertJobSeekerSchema,
} from "@shared/schema";
import { getwilayaList, getwilayaBywilaya } from "@/lib/wilayas";
import { Sprout, TrendingUp, Briefcase, Loader2 } from "lucide-react";

const roleIcons = {
  farmer: Sprout,
  investor: TrendingUp,
  jobseeker: Briefcase,
};

const roleLabels = {
  farmer: "Farmer",
  investor: "Investor",
  jobseeker: "Job Seeker",
};

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const searchParams = useSearch();
  const { register } = useAuth();
  const { toast } = useToast();

  const roleFromUrl = new URLSearchParams(searchParams).get("role");
  const initialRole =
    roleFromUrl === "farmer" ||
    roleFromUrl === "investor" ||
    roleFromUrl === "jobseeker"
      ? roleFromUrl
      : "farmer";

  const [selectedRole, setSelectedRole] = useState<UserRole>(initialRole);
  const [isLoading, setIsLoading] = useState(false);

  const farmerForm = useForm({
    resolver: zodResolver(insertFarmerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      wilaya: "",
      address: "",
    },
  });

  const investorForm = useForm({
    resolver: zodResolver(insertInvestorSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      investor_type: undefined,
    },
  });

  const jobseekerForm = useForm({
    resolver: zodResolver(insertJobSeekerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      phone: "",
      wilaya: "",
    },
  });

  const wilayas = getwilayaList();

  const onSubmitFarmer = async (data: z.infer<typeof insertFarmerSchema>) => {
    setIsLoading(true);
    try {
      const success = await register(data, "farmer");
      if (success) {
        toast({
          title: "Account created!",
          description: "Welcome to AgroFund. Start posting your projects.",
        });
        setLocation("/farmer/projects");
      } else {
        toast({
          title: "Registration failed",
          description: "Email may already be in use. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitInvestor = async (
    data: z.infer<typeof insertInvestorSchema>
  ) => {
    setIsLoading(true);
    try {
      const success = await register(data, "investor");
      if (success) {
        toast({
          title: "Account created!",
          description: "Welcome to AgroFund. Start exploring projects.",
        });
        setLocation("/investor/projects");
      } else {
        toast({
          title: "Registration failed",
          description: "Email may already be in use. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitJobseeker = async (
    data: z.infer<typeof insertJobSeekerSchema>
  ) => {
    setIsLoading(true);
    try {
      const success = await register(data, "jobseeker");
      if (success) {
        toast({
          title: "Account created!",
          description: "Welcome to AgroFund. Start browsing jobs.",
        });
        setLocation("/jobseeker/jobs");
      } else {
        toast({
          title: "Registration failed",
          description: "Email may already be in use. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = roleIcons[selectedRole];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 bg-gradient-to-br from-primary/5 via-transparent to-accent/10">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <Link
              href="/"
              className="flex items-center gap-2"
              data-testid="link-home"
            >
              <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
                <Sprout className="h-5 w-5 text-primary-foreground" />
              </div>
            </Link>
          </div>
          <CardTitle className="text-2xl font-serif">Create Account</CardTitle>
          <CardDescription>Join AgroFund today</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Tabs
            value={selectedRole}
            onValueChange={(v) => setSelectedRole(v as UserRole)}
          >
            <TabsList className="grid grid-cols-3 w-full">
              {(Object.keys(roleLabels) as UserRole[]).map((role) => {
                const RoleIcon = roleIcons[role];
                return (
                  <TabsTrigger
                    key={role}
                    value={role}
                    className="gap-1.5 text-xs sm:text-sm"
                    data-testid={`tab-${role}`}
                  >
                    <RoleIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">{roleLabels[role]}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <TabsContent value="farmer" className="mt-4 space-y-4">
              <Form {...farmerForm}>
                <form
                  onSubmit={farmerForm.handleSubmit(onSubmitFarmer)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={farmerForm.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Ahmed"
                              {...field}
                              data-testid="input-first-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={farmerForm.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Benali"
                              {...field}
                              data-testid="input-last-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={farmerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            {...field}
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={farmerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password *</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="At least 6 characters"
                            {...field}
                            data-testid="input-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={farmerForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+213 XXX XXX XXX"
                            {...field}
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={farmerForm.control}
                    name="wilaya"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>wilaya (wilaya) *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-wilaya">
                              <SelectValue placeholder="Select your wilaya" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {wilayas.map((wilaya) => {
                              const wilayaa = getwilayaBywilaya(wilaya);
                              return (
                                <SelectItem key={wilaya} value={wilaya}>
                                  {wilaya} {wilayaa && `(${wilayaa.zone})`}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={farmerForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your farm address"
                            {...field}
                            data-testid="input-address"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    data-testid="button-register"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <Sprout className="mr-2 h-4 w-4" />
                        Register as Farmer
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="investor" className="mt-4 space-y-4">
              <Form {...investorForm}>
                <form
                  onSubmit={investorForm.handleSubmit(onSubmitInvestor)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={investorForm.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Karim"
                              {...field}
                              data-testid="input-first-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={investorForm.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Hadj"
                              {...field}
                              data-testid="input-last-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={investorForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            {...field}
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={investorForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password *</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="At least 6 characters"
                            {...field}
                            data-testid="input-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={investorForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+213 XXX XXX XXX"
                            {...field}
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={investorForm.control}
                    name="investor_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Investor Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-investor-type">
                              <SelectValue placeholder="Select investor type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="INDIVIDUAL">
                              Individual
                            </SelectItem>
                            <SelectItem value="COMPANY">Company</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    data-testid="button-register"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-4 w-4" />
                        Register as Investor
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="jobseeker" className="mt-4 space-y-4">
              <Form {...jobseekerForm}>
                <form
                  onSubmit={jobseekerForm.handleSubmit(onSubmitJobseeker)}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={jobseekerForm.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Youcef"
                              {...field}
                              data-testid="input-first-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={jobseekerForm.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Meziane"
                              {...field}
                              data-testid="input-last-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={jobseekerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            {...field}
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={jobseekerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password *</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="At least 6 characters"
                            {...field}
                            data-testid="input-password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={jobseekerForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+213 XXX XXX XXX"
                            {...field}
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={jobseekerForm.control}
                    name="wilaya"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>wilaya (wilaya) *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-wilaya">
                              <SelectValue placeholder="Select your wilaya" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {wilayas.map((wilaya) => {
                              const wilayaa = getwilayaBywilaya(wilaya);
                              return (
                                <SelectItem key={wilaya} value={wilaya}>
                                  {wilaya} {wilayaa && `(${wilayaa.zone})`}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                    data-testid="button-register"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      <>
                        <Briefcase className="mr-2 h-4 w-4" />
                        Register as Job Seeker
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
              data-testid="link-login"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
