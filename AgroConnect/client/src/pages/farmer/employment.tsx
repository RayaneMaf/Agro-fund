// import { useState } from "react";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Skeleton } from "@/components/ui/skeleton";
// import { EmptyState } from "@/components/empty-state";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/lib/auth";
// import { apiRequest, queryClient } from "@/lib/queryClient";
// import {
//   insertEmploymentSchema,
//   type InsertEmployment,
//   type EmploymentPost,
//   type ApplicationForEmployment,
//   type JobSeeker,
// } from "@shared/schema";
// import { getwilayaList, getwilayaBywilaya, getZoneColor } from "@/lib/wilayas";
// import {
//   Plus,
//   Briefcase,
//   Clock,
//   CheckCircle,
//   XCircle,
//   Users,
//   Loader2,
//   MapPin,
//   Banknote,
//   Calendar,
// } from "lucide-react";

// const jobTypes = [
//   "Harvesting",
//   "Planting",
//   "Pruning",
//   "Irrigation",
//   "Pest Control",
//   "Equipment Operation",
//   "Farm Management",
//   "Animal Care",
//   "General Labor",
//   "Other",
// ];

// const statusConfig = {
//   OPEN: {
//     label: "Open",
//     color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
//   },
//   ONGOING: {
//     label: "Ongoing",
//     color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
//   },
//   COMPLETED: {
//     label: "Completed",
//     color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
//   },
// };

// const appStatusConfig = {
//   PENDING: {
//     label: "Pending",
//     icon: Clock,
//     color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
//   },
//   ACCEPTED: {
//     label: "Accepted",
//     icon: CheckCircle,
//     color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
//   },
//   REJECTED: {
//     label: "Rejected",
//     icon: XCircle,
//     color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
//   },
// };

// export default function FarmerEmployment() {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const [showNewJobDialog, setShowNewJobDialog] = useState(false);

//   const wilayas = getwilayaList();

//   const { data: jobs = [], isLoading } = useQuery<
//     (EmploymentPost & {
//       applications?: (ApplicationForEmployment & { job_seeker?: JobSeeker })[];
//     })[]
//   >({
//     queryKey: ["/api/farmers", user?.id, "jobs"],
//     enabled: !!user?.id,
//   });

//   const form = useForm<InsertEmployment>({
//     resolver: zodResolver(insertEmploymentSchema),
//     defaultValues: {
//       job_type: "",
//       description: "",
//       payment: 0,
//       workers_needed: 1,
//       duration_days: 1,
//       wilaya: "",
//     },
//   });

//   const createJobMutation = useMutation({
//     mutationFn: async (data: InsertEmployment) => {
//       return apiRequest("POST", "/api/jobs", {
//         ...data,
//         farmer_id: user?.id,
//       });
//     },
//     onSuccess: () => {
//       toast({
//         title: "Job Posted",
//         description: "Your job posting has been created successfully.",
//       });
//       queryClient.invalidateQueries({
//         queryKey: ["/api/farmers", user?.id, "jobs"],
//       });
//       queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
//       setShowNewJobDialog(false);
//       form.reset();
//     },
//     onError: () => {
//       toast({
//         title: "Error",
//         description: "Failed to create job posting. Please try again.",
//         variant: "destructive",
//       });
//     },
//   });

//   const acceptWorkerMutation = useMutation({
//     mutationFn: async (applicationId: number) => {
//       return apiRequest(
//         "POST",
//         `/api/applications/job/${applicationId}/accept`,
//         {}
//       );
//     },
//     onSuccess: () => {
//       toast({
//         title: "Worker Accepted",
//         description: "The job seeker has been accepted for this position.",
//       });
//       queryClient.invalidateQueries({
//         queryKey: ["/api/farmers", user?.id, "jobs"],
//       });
//     },
//     onError: () => {
//       toast({
//         title: "Error",
//         description: "Failed to accept worker. Please try again.",
//         variant: "destructive",
//       });
//     },
//   });

//   const rejectWorkerMutation = useMutation({
//     mutationFn: async (applicationId: number) => {
//       return apiRequest(
//         "POST",
//         `/api/applications/job/${applicationId}/reject`,
//         {}
//       );
//     },
//     onSuccess: () => {
//       toast({
//         title: "Application Rejected",
//         description: "The application has been rejected.",
//       });
//       queryClient.invalidateQueries({
//         queryKey: ["/api/farmers", user?.id, "jobs"],
//       });
//     },
//     onError: () => {
//       toast({
//         title: "Error",
//         description: "Failed to reject application. Please try again.",
//         variant: "destructive",
//       });
//     },
//   });

//   const onSubmit = (data: InsertEmployment) => {
//     createJobMutation.mutate(data);
//   };

//   const stats = {
//     total: jobs.length,
//     open: jobs.filter((j) => j.status === "OPEN").length,
//     ongoing: jobs.filter((j) => j.status === "ONGOING").length,
//     totalApplications: jobs.reduce(
//       (sum, j) => sum + (j.applications?.length || 0),
//       0
//     ),
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
//         <div>
//           <h1 className="text-3xl font-serif font-bold mb-2">Job Postings</h1>
//           <p className="text-muted-foreground">
//             Post jobs and manage worker applications
//           </p>
//         </div>
//         <Dialog open={showNewJobDialog} onOpenChange={setShowNewJobDialog}>
//           <DialogTrigger asChild>
//             <Button className="gap-2" data-testid="button-new-job">
//               <Plus className="h-4 w-4" />
//               Post New Job
//             </Button>
//           </DialogTrigger>
//           <DialogContent className="max-w-lg">
//             <DialogHeader>
//               <DialogTitle>Post New Job</DialogTitle>
//             </DialogHeader>
//             <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(onSubmit)}
//                 className="space-y-4"
//               >
//                 <FormField
//                   control={form.control}
//                   name="job_type"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Job Type *</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         value={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger data-testid="select-job-type">
//                             <SelectValue placeholder="Select job type" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {jobTypes.map((type) => (
//                             <SelectItem key={type} value={type}>
//                               {type}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="description"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Description *</FormLabel>
//                       <FormControl>
//                         <Textarea
//                           placeholder="Describe the job requirements, skills needed, and working conditions..."
//                           rows={3}
//                           {...field}
//                           data-testid="input-description"
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="wilaya"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>wilaya (Wilaya) *</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         value={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger data-testid="select-wilaya">
//                             <SelectValue placeholder="Select wilaya" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {wilayas.map((wilaya) => {
//                             const wilayaa = getwilayaBywilaya(wilaya);
//                             return (
//                               <SelectItem key={wilaya} value={wilaya}>
//                                 {wilaya} {wilayaa && `(${wilayaa.zone})`}
//                               </SelectItem>
//                             );
//                           })}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <div className="grid grid-cols-3 gap-4">
//                   <FormField
//                     control={form.control}
//                     name="payment"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Payment (DZD) *</FormLabel>
//                         <FormControl>
//                           <Input
//                             type="number"
//                             placeholder="5000"
//                             {...field}
//                             onChange={(e) =>
//                               field.onChange(Number(e.target.value))
//                             }
//                             data-testid="input-payment"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="duration_days"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Days *</FormLabel>
//                         <FormControl>
//                           <Input
//                             type="number"
//                             placeholder="7"
//                             {...field}
//                             onChange={(e) =>
//                               field.onChange(Number(e.target.value))
//                             }
//                             data-testid="input-duration"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />

//                   <FormField
//                     control={form.control}
//                     name="workers_needed"
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormLabel>Workers *</FormLabel>
//                         <FormControl>
//                           <Input
//                             type="number"
//                             placeholder="5"
//                             {...field}
//                             onChange={(e) =>
//                               field.onChange(Number(e.target.value))
//                             }
//                             data-testid="input-workers"
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </div>

//                 <div className="flex justify-end gap-3 pt-4">
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => setShowNewJobDialog(false)}
//                   >
//                     Cancel
//                   </Button>
//                   <Button
//                     type="submit"
//                     disabled={createJobMutation.isPending}
//                     data-testid="button-submit-job"
//                   >
//                     {createJobMutation.isPending ? (
//                       <>
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         Posting...
//                       </>
//                     ) : (
//                       "Post Job"
//                     )}
//                   </Button>
//                 </div>
//               </form>
//             </Form>
//           </DialogContent>
//         </Dialog>
//       </div>

//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center gap-2 text-muted-foreground mb-1">
//               <Briefcase className="h-4 w-4" />
//               <span className="text-sm">Total Jobs</span>
//             </div>
//             {isLoading ? (
//               <Skeleton className="h-8 w-16" />
//             ) : (
//               <p className="text-2xl font-bold">{stats.total}</p>
//             )}
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center gap-2 text-muted-foreground mb-1">
//               <Clock className="h-4 w-4" />
//               <span className="text-sm">Open</span>
//             </div>
//             {isLoading ? (
//               <Skeleton className="h-8 w-16" />
//             ) : (
//               <p className="text-2xl font-bold">{stats.open}</p>
//             )}
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center gap-2 text-muted-foreground mb-1">
//               <Calendar className="h-4 w-4" />
//               <span className="text-sm">Ongoing</span>
//             </div>
//             {isLoading ? (
//               <Skeleton className="h-8 w-16" />
//             ) : (
//               <p className="text-2xl font-bold">{stats.ongoing}</p>
//             )}
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center gap-2 text-muted-foreground mb-1">
//               <Users className="h-4 w-4" />
//               <span className="text-sm">Applications</span>
//             </div>
//             {isLoading ? (
//               <Skeleton className="h-8 w-16" />
//             ) : (
//               <p className="text-2xl font-bold">{stats.totalApplications}</p>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {isLoading ? (
//         <div className="space-y-4">
//           {[1, 2, 3].map((i) => (
//             <Card key={i}>
//               <CardContent className="pt-6">
//                 <Skeleton className="h-24 w-full" />
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       ) : jobs.length === 0 ? (
//         <EmptyState
//           icon={Briefcase}
//           title="No job postings yet"
//           description="Start by posting your first job to find workers."
//           actionLabel="Post New Job"
//           onAction={() => setShowNewJobDialog(true)}
//         />
//       ) : (
//         <Accordion type="multiple" className="space-y-4">
//           {jobs.map((job) => {
//             const config = statusConfig[job.status];
//             const wilaya = getwilayaBywilaya(job.wilaya);
//             const zoneColor = wilaya ? getZoneColor(wilaya.zone) : "";
//             const pendingApps =
//               job.applications?.filter((a) => a.status === "PENDING") || [];
//             const acceptedCount =
//               job.applications?.filter((a) => a.status === "ACCEPTED").length ||
//               0;

//             return (
//               <AccordionItem
//                 key={job.job_id}
//                 value={String(job.job_id)}
//                 className="border rounded-lg px-4"
//                 data-testid={`accordion-job-${job.job_id}`}
//               >
//                 <AccordionTrigger className="hover:no-underline py-4">
//                   <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-left flex-1 mr-4">
//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-center gap-2 flex-wrap">
//                         <h3 className="font-semibold truncate">
//                           {job.job_type}
//                         </h3>
//                         <Badge className={config.color}>{config.label}</Badge>
//                       </div>
//                       <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
//                         <span className="flex items-center gap-1">
//                           <MapPin className="h-3.5 w-3.5" />
//                           {job.wilaya}
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <Banknote className="h-3.5 w-3.5" />
//                           {job.payment.toLocaleString()} DZD
//                         </span>
//                         <span className="flex items-center gap-1">
//                           <Calendar className="h-3.5 w-3.5" />
//                           {job.duration_days} days
//                         </span>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-4 shrink-0">
//                       <div className="text-center">
//                         <p className="text-lg font-bold">
//                           {acceptedCount}/{job.workers_needed}
//                         </p>
//                         <p className="text-xs text-muted-foreground">Workers</p>
//                       </div>
//                       {pendingApps.length > 0 && (
//                         <Badge variant="secondary" className="gap-1">
//                           <Users className="h-3 w-3" />
//                           {pendingApps.length} pending
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                 </AccordionTrigger>
//                 <AccordionContent className="pb-4">
//                   <div className="space-y-4 pt-2">
//                     <p className="text-muted-foreground">{job.description}</p>

//                     {job.applications && job.applications.length > 0 && (
//                       <div>
//                         <h4 className="font-semibold mb-3 flex items-center gap-2">
//                           <Users className="h-4 w-4" />
//                           Applications ({job.applications.length})
//                         </h4>
//                         <Card>
//                           <CardContent className="p-0">
//                             <Table>
//                               <TableHeader>
//                                 <TableRow>
//                                   <TableHead>Applicant</TableHead>
//                                   <TableHead>wilaya</TableHead>
//                                   <TableHead>Phone</TableHead>
//                                   <TableHead>Message</TableHead>
//                                   <TableHead>Status</TableHead>
//                                   <TableHead className="text-right">
//                                     Actions
//                                   </TableHead>
//                                 </TableRow>
//                               </TableHeader>
//                               <TableBody>
//                                 {job.applications.map((app) => {
//                                   const appConfig = appStatusConfig[app.status];
//                                   const AppIcon = appConfig.icon;
//                                   const canAcceptMore =
//                                     acceptedCount < job.workers_needed;
//                                   return (
//                                     <TableRow key={app.application_id}>
//                                       <TableCell className="font-medium">
//                                         {app.job_seeker
//                                           ? `${app.job_seeker.first_name} ${app.job_seeker.last_name}`
//                                           : `Applicant #${app.job_seeker_id}`}
//                                       </TableCell>
//                                       <TableCell>
//                                         {app.job_seeker?.wilaya || "-"}
//                                       </TableCell>
//                                       <TableCell>
//                                         {app.job_seeker?.phone || "-"}
//                                       </TableCell>
//                                       <TableCell className="max-w-[200px] truncate">
//                                         {app.message || "-"}
//                                       </TableCell>
//                                       <TableCell>
//                                         <Badge
//                                           className={`gap-1 ${appConfig.color}`}
//                                         >
//                                           <AppIcon className="h-3 w-3" />
//                                           {appConfig.label}
//                                         </Badge>
//                                       </TableCell>
//                                       <TableCell className="text-right">
//                                         {app.status === "PENDING" &&
//                                           canAcceptMore && (
//                                             <div className="flex justify-end gap-2">
//                                               <Button
//                                                 size="sm"
//                                                 onClick={() =>
//                                                   acceptWorkerMutation.mutate(
//                                                     app.application_id
//                                                   )
//                                                 }
//                                                 disabled={
//                                                   acceptWorkerMutation.isPending
//                                                 }
//                                                 data-testid={`button-accept-${app.application_id}`}
//                                               >
//                                                 Accept
//                                               </Button>
//                                               <Button
//                                                 size="sm"
//                                                 variant="outline"
//                                                 onClick={() =>
//                                                   rejectWorkerMutation.mutate(
//                                                     app.application_id
//                                                   )
//                                                 }
//                                                 disabled={
//                                                   rejectWorkerMutation.isPending
//                                                 }
//                                                 data-testid={`button-reject-${app.application_id}`}
//                                               >
//                                                 Reject
//                                               </Button>
//                                             </div>
//                                           )}
//                                       </TableCell>
//                                     </TableRow>
//                                   );
//                                 })}
//                               </TableBody>
//                             </Table>
//                           </CardContent>
//                         </Card>
//                       </div>
//                     )}

//                     {(!job.applications || job.applications.length === 0) && (
//                       <div className="text-center py-6 text-muted-foreground">
//                         <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
//                         <p>No applications yet</p>
//                       </div>
//                     )}
//                   </div>
//                 </AccordionContent>
//               </AccordionItem>
//             );
//           })}
//         </Accordion>
//       )}
//     </div>
//   );
// }
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  insertEmploymentSchema,
  type InsertEmployment,
  type EmploymentPost,
  type ApplicationForEmployment,
  type JobSeeker,
} from "@shared/schema";
import { getwilayaList, getwilayaBywilaya, getZoneColor } from "@/lib/wilayas";
import {
  Plus,
  Briefcase,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Loader2,
  MapPin,
  Banknote,
  Calendar,
} from "lucide-react";

const jobTypes = [
  "Harvesting",
  "Planting",
  "Pruning",
  "Irrigation",
  "Pest Control",
  "Equipment Operation",
  "Farm Management",
  "Animal Care",
  "General Labor",
  "Other",
];

const statusConfig = {
  OPEN: {
    label: "Open",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  ONGOING: {
    label: "Ongoing",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  },
};

const appStatusConfig = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  },
  ACCEPTED: {
    label: "Accepted",
    icon: CheckCircle,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
};

export default function FarmerEmployment() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showNewJobDialog, setShowNewJobDialog] = useState(false);

  const wilayas = getwilayaList();

  // FIXED: Updated to match backend route: GET /api/jobs/my/jobs
  const { data: jobsResponse, isLoading } = useQuery<{
    jobs: (EmploymentPost & {
      applications?: (ApplicationForEmployment & { job_seeker?: JobSeeker })[];
    })[];
  }>({
    queryKey: ["/api/jobs/my/jobs"],
    enabled: !!user?.id && user?.role === "farmer",
  });

  const jobs = jobsResponse?.jobs || [];

  const form = useForm<InsertEmployment>({
    resolver: zodResolver(insertEmploymentSchema),
    defaultValues: {
      job_type: "",
      description: "",
      payment: 0,
      workers_needed: 1,
      duration_days: 1,
      wilaya: "",
    },
  });

  // FIXED: Updated to match backend route: POST /api/jobs
  // Backend doesn't need farmer_id in body, it gets it from req.user
  const createJobMutation = useMutation({
    mutationFn: async (data: InsertEmployment) => {
      const response = await apiRequest("POST", "/api/jobs", {
        job_type: data.job_type,
        description: data.description,
        payment: data.payment,
        workers_needed: data.workers_needed,
        duration_days: data.duration_days,
        wilaya: data.wilaya,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Job Posted",
        description: "Your job posting has been created successfully.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/jobs/my/jobs"],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      setShowNewJobDialog(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description:
          error.message || "Failed to create job posting. Please try again.",
        variant: "destructive",
      });
    },
  });

  // FIXED: Updated to match backend route: PATCH /api/applications/job/:application_id/accept
  // Backend automatically decrements workers_needed and updates status
  const acceptWorkerMutation = useMutation({
    mutationFn: async (applicationId: number) => {
      const response = await apiRequest(
        "PATCH",
        `/api/applications/job/${applicationId}/accept`,
        {}
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Worker Accepted",
        description: "The job seeker has been accepted for this position.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/jobs/my/jobs"],
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description:
          error.message || "Failed to accept worker. Please try again.",
        variant: "destructive",
      });
    },
  });

  // FIXED: Updated to use POST /api/applications/job/:id/reject
  const rejectWorkerMutation = useMutation({
    mutationFn: async (applicationId: number) => {
      const response = await apiRequest(
        "POST",
        `/api/applications/job/${applicationId}/reject`,
        {}
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Rejected",
        description: "The application has been rejected.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/jobs/my/jobs"],
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description:
          error.message || "Failed to reject application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertEmployment) => {
    createJobMutation.mutate(data);
  };

  const stats = {
    total: jobs.length,
    open: jobs.filter((j) => j.status === "OPEN").length,
    ongoing: jobs.filter((j) => j.status === "ONGOING").length,
    totalApplications: jobs.reduce(
      (sum, j) => sum + (j.applications?.length || 0),
      0
    ),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">Job Postings</h1>
          <p className="text-muted-foreground">
            Post jobs and manage worker applications
          </p>
        </div>
        <Dialog open={showNewJobDialog} onOpenChange={setShowNewJobDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-new-job">
              <Plus className="h-4 w-4" />
              Post New Job
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Post New Job</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="job_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Type *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-job-type">
                            <SelectValue placeholder="Select job type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {jobTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the job requirements, skills needed, and working conditions..."
                          rows={3}
                          {...field}
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="wilaya"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wilaya (Region) *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-wilaya">
                            <SelectValue placeholder="Select wilaya" />
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

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="payment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment (DZD) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="5000"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            data-testid="input-payment"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration_days"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Days *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="7"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            data-testid="input-duration"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="workers_needed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workers *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="5"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            data-testid="input-workers"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewJobDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createJobMutation.isPending}
                    data-testid="button-submit-job"
                  >
                    {createJobMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post Job"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Briefcase className="h-4 w-4" />
              <span className="text-sm">Total Jobs</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">{stats.total}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Open</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">{stats.open}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Ongoing</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">{stats.ongoing}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">Applications</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">{stats.totalApplications}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No job postings yet"
          description="Start by posting your first job to find workers."
          actionLabel="Post New Job"
          onAction={() => setShowNewJobDialog(true)}
        />
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {jobs.map((job) => {
            const config = statusConfig[job.status];
            const wilaya = getwilayaBywilaya(job.wilaya);
            const zoneColor = wilaya ? getZoneColor(wilaya.zone) : "";
            const pendingApps =
              job.applications?.filter((a) => a.status === "PENDING") || [];
            const acceptedCount =
              job.applications?.filter((a) => a.status === "ACCEPTED").length ||
              0;

            return (
              <AccordionItem
                key={job.job_id}
                value={String(job.job_id)}
                className="border rounded-lg px-4"
                data-testid={`accordion-job-${job.job_id}`}
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-left flex-1 mr-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold truncate">
                          {job.job_type}
                        </h3>
                        <Badge className={config.color}>{config.label}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {job.wilaya}
                        </span>
                        <span className="flex items-center gap-1">
                          <Banknote className="h-3.5 w-3.5" />
                          {job.payment.toLocaleString()} DZD
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {job.duration_days} days
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-center">
                        <p className="text-lg font-bold">
                          {acceptedCount}/{job.workers_needed}
                        </p>
                        <p className="text-xs text-muted-foreground">Workers</p>
                      </div>
                      {pendingApps.length > 0 && (
                        <Badge variant="secondary" className="gap-1">
                          <Users className="h-3 w-3" />
                          {pendingApps.length} pending
                        </Badge>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <div className="space-y-4 pt-2">
                    <p className="text-muted-foreground">{job.description}</p>

                    {job.applications && job.applications.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Applications ({job.applications.length})
                        </h4>
                        <Card>
                          <CardContent className="p-0">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Applicant</TableHead>
                                  <TableHead>Wilaya</TableHead>
                                  <TableHead>Phone</TableHead>
                                  <TableHead>Message</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead className="text-right">
                                    Actions
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {job.applications.map((app) => {
                                  const appConfig = appStatusConfig[app.status];
                                  const AppIcon = appConfig.icon;
                                  const canAcceptMore =
                                    acceptedCount < job.workers_needed;
                                  return (
                                    <TableRow key={app.application_id}>
                                      <TableCell className="font-medium">
                                        {app.job_seeker
                                          ? `${app.job_seeker.first_name} ${app.job_seeker.last_name}`
                                          : `Applicant #${app.job_seeker_id}`}
                                      </TableCell>
                                      <TableCell>
                                        {app.job_seeker?.wilaya || "-"}
                                      </TableCell>
                                      <TableCell>
                                        {app.job_seeker?.phone || "-"}
                                      </TableCell>
                                      <TableCell className="max-w-[200px] truncate">
                                        {app.message || "-"}
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          className={`gap-1 ${appConfig.color}`}
                                        >
                                          <AppIcon className="h-3 w-3" />
                                          {appConfig.label}
                                        </Badge>
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {app.status === "PENDING" &&
                                          canAcceptMore && (
                                            <div className="flex justify-end gap-2">
                                              <Button
                                                size="sm"
                                                onClick={() =>
                                                  acceptWorkerMutation.mutate(
                                                    app.application_id
                                                  )
                                                }
                                                disabled={
                                                  acceptWorkerMutation.isPending
                                                }
                                                data-testid={`button-accept-${app.application_id}`}
                                              >
                                                Accept
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() =>
                                                  rejectWorkerMutation.mutate(
                                                    app.application_id
                                                  )
                                                }
                                                disabled={
                                                  rejectWorkerMutation.isPending
                                                }
                                                data-testid={`button-reject-${app.application_id}`}
                                              >
                                                Reject
                                              </Button>
                                            </div>
                                          )}
                                      </TableCell>
                                    </TableRow>
                                  );
                                })}
                              </TableBody>
                            </Table>
                          </CardContent>
                        </Card>
                      </div>
                    )}

                    {(!job.applications || job.applications.length === 0) && (
                      <div className="text-center py-6 text-muted-foreground">
                        <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No applications yet</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}
