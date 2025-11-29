// // // import { useState } from "react";
// // // import { Link, useLocation } from "wouter";
// // // import { useForm } from "react-hook-form";
// // // import { zodResolver } from "@hookform/resolvers/zod";
// // // import { Button } from "@/components/ui/button";
// // // import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// // // import { Input } from "@/components/ui/input";
// // // import { Label } from "@/components/ui/label";
// // // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // // import {
// // //   Form,
// // //   FormControl,
// // //   FormField,
// // //   FormItem,
// // //   FormLabel,
// // //   FormMessage,
// // // } from "@/components/ui/form";
// // // import { useToast } from "@/hooks/use-toast";
// // // import { useAuth, type UserRole } from "@/lib/auth";
// // // import { loginSchema, type LoginData } from "@shared/schema";
// // // import { Sprout, TrendingUp, Briefcase, Loader2 } from "lucide-react";

// // // const roleIcons = {
// // //   farmer: Sprout,
// // //   investor: TrendingUp,
// // //   jobseeker: Briefcase,
// // // };

// // // const roleLabels = {
// // //   farmer: "Farmer",
// // //   investor: "Investor",
// // //   jobseeker: "Job Seeker",
// // // };

// // // const roleDescriptions = {
// // //   farmer: "Access your projects and job postings",
// // //   investor: "Browse and manage your investments",
// // //   jobseeker: "Find and apply for farming jobs",
// // // };

// // // export default function LoginPage() {
// // //   const [, setLocation] = useLocation();
// // //   const { login } = useAuth();
// // //   const { toast } = useToast();
// // //   const [selectedRole, setSelectedRole] = useState<UserRole>("farmer");
// // //   const [isLoading, setIsLoading] = useState(false);

// // //   const form = useForm<LoginData>({
// // //     resolver: zodResolver(loginSchema),
// // //     defaultValues: {
// // //       email: "",
// // //       password: "",
// // //     },
// // //   });

// // //   const onSubmit = async (data: LoginData) => {
// // //     setIsLoading(true);
// // //     try {
// // //       const success = await login(data.email, data.password, selectedRole);
// // //       if (success) {
// // //         toast({
// // //           title: "Welcome back!",
// // //           description: `You're now logged in as a ${roleLabels[selectedRole]}.`,
// // //         });
// // //         switch (selectedRole) {
// // //           case "farmer":
// // //             setLocation("/farmer/projects/");
// // //             break;
// // //           case "investor":
// // //             setLocation("/investor/projects/");
// // //             break;
// // //           case "jobseeker":
// // //             setLocation("/jobseeker/jobs/");
// // //             break;
// // //         }
// // //       } else {
// // //         toast({
// // //           title: "Login failed",
// // //           description: "Invalid email or password. Please try again.",
// // //           variant: "destructive",
// // //         });
// // //       }
// // //     } catch (error) {
// // //       toast({
// // //         title: "Error",
// // //         description: "Something went wrong. Please try again.",
// // //         variant: "destructive",
// // //       });
// // //     } finally {
// // //       setIsLoading(false);
// // //     }
// // //   };

// // //   const Icon = roleIcons[selectedRole];

// // //   return (
// // //     <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-transparent to-accent/10">
// // //       <Card className="w-full max-w-md">
// // //         <CardHeader className="text-center space-y-2">
// // //           <div className="flex justify-center mb-2">
// // //             <Link href="/" className="flex items-center gap-2" data-testid="link-home">
// // //               <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
// // //                 <Sprout className="h-5 w-5 text-primary-foreground" />
// // //               </div>
// // //             </Link>
// // //           </div>
// // //           <CardTitle className="text-2xl font-serif">Welcome Back</CardTitle>
// // //           <CardDescription>Sign in to your AgroFund account</CardDescription>
// // //         </CardHeader>
// // //         <CardContent className="space-y-6">
// // //           <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)}>
// // //             <TabsList className="grid grid-cols-3 w-full">
// // //               {(Object.keys(roleLabels) as UserRole[]).map((role) => {
// // //                 const RoleIcon = roleIcons[role];
// // //                 return (
// // //                   <TabsTrigger
// // //                     key={role}
// // //                     value={role}
// // //                     className="gap-1.5 text-xs sm:text-sm"
// // //                     data-testid={`tab-${role}`}
// // //                   >
// // //                     <RoleIcon className="h-4 w-4" />
// // //                     <span className="hidden sm:inline">{roleLabels[role]}</span>
// // //                   </TabsTrigger>
// // //                 );
// // //               })}
// // //             </TabsList>

// // //             {(Object.keys(roleLabels) as UserRole[]).map((role) => (
// // //               <TabsContent key={role} value={role} className="mt-4">
// // //                 <div className="text-center mb-4 p-3 rounded-lg bg-muted/50">
// // //                   <p className="text-sm text-muted-foreground">
// // //                     {roleDescriptions[role]}
// // //                   </p>
// // //                 </div>
// // //               </TabsContent>
// // //             ))}
// // //           </Tabs>

// // //           <Form {...form}>
// // //             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
// // //               <FormField
// // //                 control={form.control}
// // //                 name="email"
// // //                 render={({ field }) => (
// // //                   <FormItem>
// // //                     <FormLabel>Email</FormLabel>
// // //                     <FormControl>
// // //                       <Input
// // //                         type="email"
// // //                         placeholder="your@email.com"
// // //                         {...field}
// // //                         data-testid="input-email"
// // //                       />
// // //                     </FormControl>
// // //                     <FormMessage />
// // //                   </FormItem>
// // //                 )}
// // //               />

// // //               <FormField
// // //                 control={form.control}
// // //                 name="password"
// // //                 render={({ field }) => (
// // //                   <FormItem>
// // //                     <FormLabel>Password</FormLabel>
// // //                     <FormControl>
// // //                       <Input
// // //                         type="password"
// // //                         placeholder="Enter your password"
// // //                         {...field}
// // //                         data-testid="input-password"
// // //                       />
// // //                     </FormControl>
// // //                     <FormMessage />
// // //                   </FormItem>
// // //                 )}
// // //               />

// // //               <Button
// // //                 type="submit"
// // //                 className="w-full"
// // //                 disabled={isLoading}
// // //                 data-testid="button-login"
// // //               >
// // //                 {isLoading ? (
// // //                   <>
// // //                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// // //                     Signing in...
// // //                   </>
// // //                 ) : (
// // //                   <>
// // //                     <Icon className="mr-2 h-4 w-4" />
// // //                     Sign in as {roleLabels[selectedRole]}
// // //                   </>
// // //                 )}
// // //               </Button>
// // //             </form>
// // //           </Form>

// // //           <div className="text-center text-sm text-muted-foreground">
// // //             Don't have an account?{" "}
// // //             <Link
// // //               href="/register"
// // //               className="text-primary hover:underline font-medium"
// // //               data-testid="link-register"
// // //             >
// // //               Create one
// // //             </Link>
// // //           </div>
// // //         </CardContent>
// // //       </Card>
// // //     </div>
// // //   );
// // // }
// // import { useState } from "react";
// // import { Link, useLocation } from "wouter";
// // import { useForm } from "react-hook-form";
// // import { zodResolver } from "@hookform/resolvers/zod";
// // import { Button } from "@/components/ui/button";
// // import {
// //   Card,
// //   CardContent,
// //   CardDescription,
// //   CardHeader,
// //   CardTitle,
// // } from "@/components/ui/card";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import {
// //   Form,
// //   FormControl,
// //   FormField,
// //   FormItem,
// //   FormLabel,
// //   FormMessage,
// // } from "@/components/ui/form";
// // import { useToast } from "@/hooks/use-toast";
// // import { useAuth, type UserRole } from "@/lib/auth";
// // import { loginSchema, type LoginData } from "@shared/schema";
// // import { Sprout, TrendingUp, Briefcase, Loader2 } from "lucide-react";

// // const roleIcons = {
// //   farmer: Sprout,
// //   investor: TrendingUp,
// //   jobseeker: Briefcase,
// // };

// // const roleLabels = {
// //   farmer: "Farmer",
// //   investor: "Investor",
// //   jobseeker: "Job Seeker",
// // };

// // const roleDescriptions = {
// //   farmer: "Access your projects and job postings",
// //   investor: "Browse and manage your investments",
// //   jobseeker: "Find and apply for farming jobs",
// // };

// // export default function LoginPage() {
// //   const [, setLocation] = useLocation();
// //   const { login } = useAuth();
// //   const { toast } = useToast();
// //   const [selectedRole, setSelectedRole] = useState<UserRole>("farmer");
// //   const [isLoading, setIsLoading] = useState(false);

// //   const form = useForm<LoginData>({
// //     resolver: zodResolver(loginSchema),
// //     defaultValues: {
// //       email: "",
// //       password: "",
// //     },
// //   });

// //   const onSubmit = async (data: LoginData) => {
// //     setIsLoading(true);
// //     try {
// //       const success = await login(data.email, data.password, selectedRole);
// //       if (success) {
// //         toast({
// //           title: "Welcome back!",
// //           description: `You're now logged in as a ${roleLabels[selectedRole]}.`,
// //         });

// //         // Fix: Remove trailing slashes and use proper navigation
// //         const routes = {
// //           farmer: "/farmer/projects",
// //           investor: "/investor/projects",
// //           jobseeker: "/jobseeker/jobs",
// //         };

// //         console.log(`Navigating to: ${routes[selectedRole]}`); // Debug log
// //         setLocation(routes[selectedRole]);

// //         // Alternative: Force navigation after a brief delay if setLocation doesn't work
// //         // setTimeout(() => {
// //         //   window.location.href = routes[selectedRole];
// //         // }, 100);
// //       } else {
// //         toast({
// //           title: "Login failed",
// //           description: "Invalid email or password. Please try again.",
// //           variant: "destructive",
// //         });
// //       }
// //     } catch (error) {
// //       console.error("Login error:", error); // Debug log
// //       toast({
// //         title: "Error",
// //         description: "Something went wrong. Please try again.",
// //         variant: "destructive",
// //       });
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const Icon = roleIcons[selectedRole];

// //   return (
// //     <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-transparent to-accent/10">
// //       <Card className="w-full max-w-md">
// //         <CardHeader className="text-center space-y-2">
// //           <div className="flex justify-center mb-2">
// //             <Link
// //               href="/"
// //               className="flex items-center gap-2"
// //               data-testid="link-home"
// //             >
// //               <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
// //                 <Sprout className="h-5 w-5 text-primary-foreground" />
// //               </div>
// //             </Link>
// //           </div>
// //           <CardTitle className="text-2xl font-serif">Welcome Back</CardTitle>
// //           <CardDescription>Sign in to your AgroFund account</CardDescription>
// //         </CardHeader>
// //         <CardContent className="space-y-6">
// //           <Tabs
// //             value={selectedRole}
// //             onValueChange={(v) => setSelectedRole(v as UserRole)}
// //           >
// //             <TabsList className="grid grid-cols-3 w-full">
// //               {(Object.keys(roleLabels) as UserRole[]).map((role) => {
// //                 const RoleIcon = roleIcons[role];
// //                 return (
// //                   <TabsTrigger
// //                     key={role}
// //                     value={role}
// //                     className="gap-1.5 text-xs sm:text-sm"
// //                     data-testid={`tab-${role}`}
// //                   >
// //                     <RoleIcon className="h-4 w-4" />
// //                     <span className="hidden sm:inline">{roleLabels[role]}</span>
// //                   </TabsTrigger>
// //                 );
// //               })}
// //             </TabsList>

// //             {(Object.keys(roleLabels) as UserRole[]).map((role) => (
// //               <TabsContent key={role} value={role} className="mt-4">
// //                 <div className="text-center mb-4 p-3 rounded-lg bg-muted/50">
// //                   <p className="text-sm text-muted-foreground">
// //                     {roleDescriptions[role]}
// //                   </p>
// //                 </div>
// //               </TabsContent>
// //             ))}
// //           </Tabs>

// //           <Form {...form}>
// //             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
// //               <FormField
// //                 control={form.control}
// //                 name="email"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Email</FormLabel>
// //                     <FormControl>
// //                       <Input
// //                         type="email"
// //                         placeholder="your@email.com"
// //                         {...field}
// //                         data-testid="input-email"
// //                       />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />

// //               <FormField
// //                 control={form.control}
// //                 name="password"
// //                 render={({ field }) => (
// //                   <FormItem>
// //                     <FormLabel>Password</FormLabel>
// //                     <FormControl>
// //                       <Input
// //                         type="password"
// //                         placeholder="Enter your password"
// //                         {...field}
// //                         data-testid="input-password"
// //                       />
// //                     </FormControl>
// //                     <FormMessage />
// //                   </FormItem>
// //                 )}
// //               />

// //               <Button
// //                 type="submit"
// //                 className="w-full"
// //                 disabled={isLoading}
// //                 data-testid="button-login"
// //               >
// //                 {isLoading ? (
// //                   <>
// //                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //                     Signing in...
// //                   </>
// //                 ) : (
// //                   <>
// //                     <Icon className="mr-2 h-4 w-4" />
// //                     Sign in as {roleLabels[selectedRole]}
// //                   </>
// //                 )}
// //               </Button>
// //             </form>
// //           </Form>

// //           <div className="text-center text-sm text-muted-foreground">
// //             Don't have an account?{" "}
// //             <Link
// //               href="/register"
// //               className="text-primary hover:underline font-medium"
// //               data-testid="link-register"
// //             >
// //               Create one
// //             </Link>
// //           </div>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // }
// import { useState, useEffect } from "react";
// import { Link, useLocation } from "wouter";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth, type UserRole } from "@/lib/auth";
// import { loginSchema, type LoginData } from "@shared/schema";
// import { Sprout, TrendingUp, Briefcase, Loader2 } from "lucide-react";

// const roleIcons = {
//   farmer: Sprout,
//   investor: TrendingUp,
//   jobseeker: Briefcase,
// };

// const roleLabels = {
//   farmer: "Farmer",
//   investor: "Investor",
//   jobseeker: "Job Seeker",
// };

// const roleDescriptions = {
//   farmer: "Access your projects and job postings",
//   investor: "Browse and manage your investments",
//   jobseeker: "Find and apply for farming jobs",
// };

// export default function LoginPage() {
//   const [location, setLocation] = useLocation();
//   const { login, user } = useAuth();
//   const { toast } = useToast();
//   const [selectedRole, setSelectedRole] = useState<UserRole>("farmer");
//   const [isLoading, setIsLoading] = useState(false);

//   const form = useForm<LoginData>({
//     resolver: zodResolver(loginSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   // Debug: Log current location
//   useEffect(() => {
//     console.log("Current location:", location);
//     console.log("Current user:", user);
//   }, [location, user]);

//   const onSubmit = async (data: LoginData) => {
//     console.log("Login attempt started", {
//       email: data.email,
//       role: selectedRole,
//     });
//     setIsLoading(true);

//     try {
//       const success = await login(data.email, data.password, selectedRole);
//       console.log("Login result:", success);

//       if (success) {
//         const routes = {
//           farmer: "/farmer/projects",
//           investor: "/investor/projects",
//           jobseeker: "/jobseeker/jobs",
//         };

//         const targetRoute = routes[selectedRole];
//         console.log("Attempting navigation to:", targetRoute);

//         toast({
//           title: "Welcome back!",
//           description: `You're now logged in as a ${roleLabels[selectedRole]}.`,
//         });

//         // Try navigation
//         setLocation(targetRoute);

//         // Check if navigation worked after a brief delay
//         setTimeout(() => {
//           console.log(
//             "Location after navigation attempt:",
//             window.location.pathname
//           );
//           if (window.location.pathname !== targetRoute) {
//             console.error(
//               "Navigation failed! Current path:",
//               window.location.pathname,
//               "Expected:",
//               targetRoute
//             );
//             // Force navigation as fallback
//             window.location.href = targetRoute;
//           }
//         }, 100);
//       } else {
//         console.error("Login failed - invalid credentials");
//         toast({
//           title: "Login failed",
//           description: "Invalid email or password. Please try again.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       toast({
//         title: "Error",
//         description: "Something went wrong. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const Icon = roleIcons[selectedRole];

//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-transparent to-accent/10">
//       <Card className="w-full max-w-md">
//         <CardHeader className="text-center space-y-2">
//           <div className="flex justify-center mb-2">
//             <Link
//               href="/"
//               className="flex items-center gap-2"
//               data-testid="link-home"
//             >
//               <div className="h-10 w-10 rounded-md bg-primary flex items-center justify-center">
//                 <Sprout className="h-5 w-5 text-primary-foreground" />
//               </div>
//             </Link>
//           </div>
//           <CardTitle className="text-2xl font-serif">Welcome Back</CardTitle>
//           <CardDescription>Sign in to your AgroFund account</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {/* Debug info - remove in production */}
//           <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
//             <div>Current Path: {location}</div>
//             <div>
//               User: {user ? `${user.email} (${user.role})` : "Not logged in"}
//             </div>
//           </div>

//           <Tabs
//             value={selectedRole}
//             onValueChange={(v) => setSelectedRole(v as UserRole)}
//           >
//             <TabsList className="grid grid-cols-3 w-full">
//               {(Object.keys(roleLabels) as UserRole[]).map((role) => {
//                 const RoleIcon = roleIcons[role];
//                 return (
//                   <TabsTrigger
//                     key={role}
//                     value={role}
//                     className="gap-1.5 text-xs sm:text-sm"
//                     data-testid={`tab-${role}`}
//                   >
//                     <RoleIcon className="h-4 w-4" />
//                     <span className="hidden sm:inline">{roleLabels[role]}</span>
//                   </TabsTrigger>
//                 );
//               })}
//             </TabsList>

//             {(Object.keys(roleLabels) as UserRole[]).map((role) => (
//               <TabsContent key={role} value={role} className="mt-4">
//                 <div className="text-center mb-4 p-3 rounded-lg bg-muted/50">
//                   <p className="text-sm text-muted-foreground">
//                     {roleDescriptions[role]}
//                   </p>
//                 </div>
//               </TabsContent>
//             ))}
//           </Tabs>

//           <Form {...form}>
//             <div onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="email"
//                         placeholder="your@email.com"
//                         {...field}
//                         data-testid="input-email"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="password"
//                         placeholder="Enter your password"
//                         {...field}
//                         data-testid="input-password"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <Button
//                 type="button"
//                 onClick={form.handleSubmit(onSubmit)}
//                 className="w-full"
//                 disabled={isLoading}
//                 data-testid="button-login"
//               >
//                 {isLoading ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Signing in...
//                   </>
//                 ) : (
//                   <>
//                     <Icon className="mr-2 h-4 w-4" />
//                     Sign in as {roleLabels[selectedRole]}
//                   </>
//                 )}
//               </Button>
//             </div>
//           </Form>

//           <div className="text-center text-sm text-muted-foreground">
//             Don't have an account?{" "}
//             <Link
//               href="/register"
//               className="text-primary hover:underline font-medium"
//               data-testid="link-register"
//             >
//               Create one
//             </Link>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth, type UserRole } from "@/lib/auth";
import { loginSchema, type LoginData } from "@shared/schema";
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

const roleDescriptions = {
  farmer: "Access your projects and job postings",
  investor: "Browse and manage your investments",
  jobseeker: "Find and apply for farming jobs",
};

export default function LoginPage() {
  const [location, setLocation] = useLocation();
  const { login, user } = useAuth();
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState<UserRole>("farmer");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Debug: Log current location and user
  useEffect(() => {
    console.log("📍 Current location:", location);
    console.log("👤 Current user:", user);
  }, [location, user]);

  const onSubmit = async (data: LoginData) => {
    console.log("🔐 Login attempt started:", {
      email: data.email,
      role: selectedRole,
    });
    setIsLoading(true);

    try {
      const success = await login(data.email, data.password, selectedRole);
      console.log("✅ Login result:", success);

      if (success) {
        const routes = {
          farmer: "/farmer/projects",
          investor: "/investor/projects",
          jobseeker: "/jobseeker/jobs",
        };

        const targetRoute = routes[selectedRole];
        console.log("🚀 Attempting navigation to:", targetRoute);

        toast({
          title: "Welcome back!",
          description: `You're now logged in as a ${roleLabels[selectedRole]}.`,
        });

        // Navigate using wouter
        setLocation(targetRoute);

        // Check if navigation worked after a brief delay
        setTimeout(() => {
          console.log(
            "📍 Location after navigation attempt:",
            window.location.pathname
          );
          if (window.location.pathname !== targetRoute) {
            console.warn("⚠️ Navigation failed! Forcing navigation...");
            console.log(
              "Expected:",
              targetRoute,
              "Got:",
              window.location.pathname
            );
            // Force navigation as fallback
            window.location.href = targetRoute;
          } else {
            console.log("✅ Navigation successful!");
          }
        }, 100);
      } else {
        console.error("❌ Login failed - invalid credentials");
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("❌ Login error:", error);
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-transparent to-accent/10">
      <Card className="w-full max-w-md">
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
          <CardTitle className="text-2xl font-serif">Welcome Back</CardTitle>
          <CardDescription>Sign in to your AgroFund account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Debug info - REMOVE THIS IN PRODUCTION */}
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded border">
            <div>
              <strong>Debug Info:</strong>
            </div>
            <div>Current Path: {location}</div>
            <div>
              User: {user ? `${user.email} (${user.role})` : "Not logged in"}
            </div>
          </div>

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

            {(Object.keys(roleLabels) as UserRole[]).map((role) => (
              <TabsContent key={role} value={role} className="mt-4">
                <div className="text-center mb-4 p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    {roleDescriptions[role]}
                  </p>
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <Form {...form}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
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
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        data-testid="input-password"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            form.handleSubmit(onSubmit)();
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                onClick={form.handleSubmit(onSubmit)}
                className="w-full"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Icon className="mr-2 h-4 w-4" />
                    Sign in as {roleLabels[selectedRole]}
                  </>
                )}
              </Button>
            </div>
          </Form>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/register"
              className="text-primary hover:underline font-medium"
              data-testid="link-register"
            >
              Create one
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
