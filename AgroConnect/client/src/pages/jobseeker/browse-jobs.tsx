// // import { useState, useMemo } from "react";
// // import { useQuery, useMutation } from "@tanstack/react-query";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Card, CardContent } from "@/components/ui/card";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue,
// // } from "@/components/ui/select";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Label } from "@/components/ui/label";
// // import { JobCard, JobDetailContent } from "@/components/job-card";
// // import { JobCardSkeleton } from "@/components/loading-skeleton";
// // import { EmptyState } from "@/components/empty-state";
// // import { useToast } from "@/hooks/use-toast";
// // import { useAuth } from "@/lib/auth";
// // import { apiRequest, queryClient } from "@/lib/queryClient";
// // import type { EmploymentPost } from "@shared/schema";
// // import { wilayasDetailed } from "@/lib/wilayas";
// // import {
// //   Search,
// //   SlidersHorizontal,
// //   Briefcase,
// //   X,
// //   Loader2,
// // } from "lucide-react";

// // const jobTypes = [
// //   "Harvesting",
// //   "Planting",
// //   "Pruning",
// //   "Irrigation",
// //   "Pest Control",
// //   "Equipment Operation",
// //   "Farm Management",
// //   "Animal Care",
// //   "General Labor",
// //   "Other",
// // ];

// // export default function JobSeekerBrowseJobs() {
// //   const { user } = useAuth();
// //   const { toast } = useToast();
// //   const [searchQuery, setSearchQuery] = useState("");
// //   const [zoneFilter, setZoneFilter] = useState<string>("all");
// //   const [jobTypeFilter, setJobTypeFilter] = useState<string>("all");
// //   const [selectedJob, setSelectedJob] = useState<EmploymentPost | null>(null);
// //   const [applicationMessage, setApplicationMessage] = useState("");
// //   const [showFilters, setShowFilters] = useState(false);

// //   const { data: jobs = [], isLoading } = useQuery<EmploymentPost[]>({
// //     queryKey: ["/api/jobs"],
// //   });

// //   const { data: myApplications = [] } = useQuery<{ job_id: number }[]>({
// //     queryKey: ["/api/jobseekers", user?.id, "applications"],
// //     enabled: !!user?.id,
// //   });

// //   const appliedJobIds = new Set(myApplications.map((a) => a.job_id));

// //   const applyMutation = useMutation({
// //     mutationFn: async ({ jobId, message }: { jobId: number; message: string }) => {
// //       return apiRequest("POST", "/api/applications/job", {
// //         job_id: jobId,
// //         message,
// //         job_seeker_id: user?.id,
// //       });
// //     },
// //     onSuccess: () => {
// //       toast({
// //         title: "Application Submitted",
// //         description: "Your job application has been sent to the farmer.",
// //       });
// //       queryClient.invalidateQueries({ queryKey: ["/api/jobseekers", user?.id, "applications"] });
// //       setSelectedJob(null);
// //       setApplicationMessage("");
// //     },
// //     onError: () => {
// //       toast({
// //         title: "Error",
// //         description: "Failed to submit application. Please try again.",
// //         variant: "destructive",
// //       });
// //     },
// //   });

// //   const filteredJobs = useMemo(() => {
// //     return jobs.filter((job) => {
// //       if (job.status !== "OPEN") return false;

// //       if (searchQuery) {
// //         const query = searchQuery.toLowerCase();
// //         if (
// //           !job.job_type.toLowerCase().includes(query) &&
// //           !job.description.toLowerCase().includes(query) &&
// //           !job.wilaya.toLowerCase().includes(query)
// //         ) {
// //           return false;
// //         }
// //       }

// //       if (zoneFilter !== "all") {
// //         const wilaya = wilayasDetailed.find((r) => r.wilaya === job.wilaya);
// //         if (!wilaya || wilaya.zone !== zoneFilter) return false;
// //       }

// //       if (jobTypeFilter !== "all" && job.job_type !== jobTypeFilter) {
// //         return false;
// //       }

// //       return true;
// //     });
// //   }, [jobs, searchQuery, zoneFilter, jobTypeFilter]);

// //   const handleApply = () => {
// //     if (!selectedJob || !user?.id) return;
// //     applyMutation.mutate({
// //       jobId: selectedJob.job_id,
// //       message: applicationMessage,
// //     });
// //   };

// //   const clearFilters = () => {
// //     setSearchQuery("");
// //     setZoneFilter("all");
// //     setJobTypeFilter("all");
// //   };

// //   const hasActiveFilters =
// //     searchQuery || zoneFilter !== "all" || jobTypeFilter !== "all";

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       <div className="mb-8">
// //         <h1 className="text-3xl font-serif font-bold mb-2">Browse Jobs</h1>
// //         <p className="text-muted-foreground">
// //           Find agricultural employment opportunities across Algeria
// //         </p>
// //       </div>

// //       <div className="space-y-4 mb-8">
// //         <div className="flex flex-col sm:flex-row gap-4">
// //           <div className="relative flex-1">
// //             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// //             <Input
// //               placeholder="Search jobs by type, description, or location..."
// //               value={searchQuery}
// //               onChange={(e) => setSearchQuery(e.target.value)}
// //               className="pl-10"
// //               data-testid="input-search"
// //             />
// //           </div>
// //           <Button
// //             variant="outline"
// //             onClick={() => setShowFilters(!showFilters)}
// //             className="gap-2 shrink-0"
// //             data-testid="button-toggle-filters"
// //           >
// //             <SlidersHorizontal className="h-4 w-4" />
// //             Filters
// //             {hasActiveFilters && (
// //               <span className="h-2 w-2 rounded-full bg-primary" />
// //             )}
// //           </Button>
// //         </div>

// //         {showFilters && (
// //           <Card>
// //             <CardContent className="pt-6">
// //               <div className="grid sm:grid-cols-2 gap-4">
// //                 <div className="space-y-2">
// //                   <Label>Zone</Label>
// //                   <Select value={zoneFilter} onValueChange={setZoneFilter}>
// //                     <SelectTrigger data-testid="select-zone">
// //                       <SelectValue placeholder="All zones" />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       <SelectItem value="all">All Zones</SelectItem>
// //                       <SelectItem value="Coastal">Coastal</SelectItem>
// //                       <SelectItem value="Highlands">Highlands</SelectItem>
// //                       <SelectItem value="Steppe">Steppe</SelectItem>
// //                       <SelectItem value="Sahara">Sahara</SelectItem>
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
// //                 <div className="space-y-2">
// //                   <Label>Job Type</Label>
// //                   <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
// //                     <SelectTrigger data-testid="select-job-type">
// //                       <SelectValue placeholder="All job types" />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       <SelectItem value="all">All Types</SelectItem>
// //                       {jobTypes.map((type) => (
// //                         <SelectItem key={type} value={type}>
// //                           {type}
// //                         </SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                 </div>
// //               </div>
// //               {hasActiveFilters && (
// //                 <div className="flex justify-end mt-4">
// //                   <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-2">
// //                     <X className="h-4 w-4" />
// //                     Clear Filters
// //                   </Button>
// //                 </div>
// //               )}
// //             </CardContent>
// //           </Card>
// //         )}
// //       </div>

// //       {isLoading ? (
// //         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
// //           {[1, 2, 3, 4, 5, 6].map((i) => (
// //             <JobCardSkeleton key={i} />
// //           ))}
// //         </div>
// //       ) : filteredJobs.length === 0 ? (
// //         <EmptyState
// //           icon={Briefcase}
// //           title="No jobs found"
// //           description={
// //             hasActiveFilters
// //               ? "Try adjusting your filters to find more jobs."
// //               : "There are no open jobs available at the moment. Check back later!"
// //           }
// //           actionLabel={hasActiveFilters ? "Clear Filters" : undefined}
// //           onAction={hasActiveFilters ? clearFilters : undefined}
// //         />
// //       ) : (
// //         <>
// //           <p className="text-sm text-muted-foreground mb-4">
// //             Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}
// //           </p>
// //           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
// //             {filteredJobs.map((job) => (
// //               <JobCard
// //                 key={job.job_id}
// //                 job={job}
// //                 onViewDetails={setSelectedJob}
// //               />
// //             ))}
// //           </div>
// //         </>
// //       )}

// //       <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
// //         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
// //           <DialogHeader>
// //             <DialogTitle className="sr-only">Job Details</DialogTitle>
// //           </DialogHeader>
// //           {selectedJob && (
// //             <div className="space-y-6">
// //               <JobDetailContent
// //                 job={selectedJob}
// //                 hasApplied={appliedJobIds.has(selectedJob.job_id)}
// //               />

// //               {!appliedJobIds.has(selectedJob.job_id) && selectedJob.status === "OPEN" && (
// //                 <div className="border-t pt-6 space-y-4">
// //                   <div className="space-y-2">
// //                     <Label htmlFor="message">Application Message (Optional)</Label>
// //                     <Textarea
// //                       id="message"
// //                       placeholder="Introduce yourself and explain your relevant experience..."
// //                       value={applicationMessage}
// //                       onChange={(e) => setApplicationMessage(e.target.value)}
// //                       rows={4}
// //                       data-testid="input-application-message"
// //                     />
// //                   </div>
// //                   <div className="flex justify-end">
// //                     <Button
// //                       onClick={handleApply}
// //                       disabled={applyMutation.isPending}
// //                       className="min-w-[200px]"
// //                       data-testid="button-submit-application"
// //                     >
// //                       {applyMutation.isPending ? (
// //                         <>
// //                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
// //                           Submitting...
// //                         </>
// //                       ) : (
// //                         "Apply for Job"
// //                       )}
// //                     </Button>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           )}
// //         </DialogContent>
// //       </Dialog>
// //     </div>
// //   );
// // }
// import { useState, useMemo } from "react";
// import { useQuery, useMutation } from "@tanstack/react-query";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { JobCard, JobDetailContent } from "@/components/job-card";
// import { JobCardSkeleton } from "@/components/loading-skeleton";
// import { EmptyState } from "@/components/empty-state";
// import { useToast } from "@/hooks/use-toast";
// import { useAuth } from "@/lib/auth";
// import { apiRequest, queryClient } from "@/lib/queryClient";
// import type { EmploymentPost } from "@shared/schema";
// import { wilayasDetailed } from "@/lib/wilayas";
// import { Search, SlidersHorizontal, Briefcase, X, Loader2 } from "lucide-react";

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

// export default function JobSeekerBrowseJobs() {
//   const { user } = useAuth();
//   const { toast } = useToast();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [zoneFilter, setZoneFilter] = useState<string>("all");
//   const [jobTypeFilter, setJobTypeFilter] = useState<string>("all");
//   const [selectedJob, setSelectedJob] = useState<EmploymentPost | null>(null);
//   const [applicationMessage, setApplicationMessage] = useState("");
//   const [showFilters, setShowFilters] = useState(false);

//   // FIXED: Updated to handle { jobs: [...] } response
//   const { data: jobsResponse, isLoading } = useQuery<{
//     jobs: EmploymentPost[];
//   }>({
//     queryKey: ["/api/jobs"],
//   });

//   const jobs = jobsResponse?.jobs || [];

//   // FIXED: Updated endpoint and response structure
//   const { data: applicationsResponse } = useQuery<{
//     applications: Array<{
//       application_id: number;
//       job_id: number;
//       status: string;
//       message: string | null;
//       created_at: string;
//     }>;
//   }>({
//     queryKey: ["/api/applications/my/job-applications"],
//     enabled: !!user?.id && user?.role === "jobseeker",
//   });

//   const myApplications = applicationsResponse?.applications || [];
//   const appliedJobIds = new Set(myApplications.map((a) => a.job_id));

//   // FIXED: Updated to use correct endpoint and remove job_seeker_id from body
//   const applyMutation = useMutation({
//     mutationFn: async ({
//       jobId,
//       message,
//     }: {
//       jobId: number;
//       message: string;
//     }) => {
//       const response = await apiRequest("POST", `/api/jobs/${jobId}/apply`, {
//         message: message || null,
//       });
//       return response.json();
//     },
//     onSuccess: () => {
//       toast({
//         title: "Application Submitted",
//         description: "Your job application has been sent to the farmer.",
//       });
//       // FIXED: Updated query key
//       queryClient.invalidateQueries({
//         queryKey: ["/api/applications/my/job-applications"],
//       });
//       setSelectedJob(null);
//       setApplicationMessage("");
//     },
//     onError: (error: Error) => {
//       toast({
//         title: "Error",
//         description:
//           error.message || "Failed to submit application. Please try again.",
//         variant: "destructive",
//       });
//     },
//   });

//   const filteredJobs = useMemo(() => {
//     return jobs.filter((job) => {
//       if (job.status !== "OPEN") return false;

//       if (searchQuery) {
//         const query = searchQuery.toLowerCase();
//         if (
//           !job.job_type.toLowerCase().includes(query) &&
//           !job.description.toLowerCase().includes(query) &&
//           !job.wilaya.toLowerCase().includes(query)
//         ) {
//           return false;
//         }
//       }

//       if (zoneFilter !== "all") {
//         const wilaya = wilayasDetailed.find((r) => r.wilaya === job.wilaya);
//         if (!wilaya || wilaya.zone !== zoneFilter) return false;
//       }

//       if (jobTypeFilter !== "all" && job.job_type !== jobTypeFilter) {
//         return false;
//       }

//       return true;
//     });
//   }, [jobs, searchQuery, zoneFilter, jobTypeFilter]);

//   const handleApply = () => {
//     if (!selectedJob || !user?.id) return;
//     applyMutation.mutate({
//       jobId: selectedJob.job_id,
//       message: applicationMessage,
//     });
//   };

//   const clearFilters = () => {
//     setSearchQuery("");
//     setZoneFilter("all");
//     setJobTypeFilter("all");
//   };

//   const hasActiveFilters =
//     searchQuery || zoneFilter !== "all" || jobTypeFilter !== "all";

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-serif font-bold mb-2">Browse Jobs</h1>
//         <p className="text-muted-foreground">
//           Find agricultural employment opportunities across Algeria
//         </p>
//       </div>

//       <div className="space-y-4 mb-8">
//         <div className="flex flex-col sm:flex-row gap-4">
//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//             <Input
//               placeholder="Search jobs by type, description, or location..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="pl-10"
//               data-testid="input-search"
//             />
//           </div>
//           <Button
//             variant="outline"
//             onClick={() => setShowFilters(!showFilters)}
//             className="gap-2 shrink-0"
//             data-testid="button-toggle-filters"
//           >
//             <SlidersHorizontal className="h-4 w-4" />
//             Filters
//             {hasActiveFilters && (
//               <span className="h-2 w-2 rounded-full bg-primary" />
//             )}
//           </Button>
//         </div>

//         {showFilters && (
//           <Card>
//             <CardContent className="pt-6">
//               <div className="grid sm:grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label>Zone</Label>
//                   <Select value={zoneFilter} onValueChange={setZoneFilter}>
//                     <SelectTrigger data-testid="select-zone">
//                       <SelectValue placeholder="All zones" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Zones</SelectItem>
//                       <SelectItem value="Coastal">Coastal</SelectItem>
//                       <SelectItem value="Highlands">Highlands</SelectItem>
//                       <SelectItem value="Steppe">Steppe</SelectItem>
//                       <SelectItem value="Sahara">Sahara</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Job Type</Label>
//                   <Select
//                     value={jobTypeFilter}
//                     onValueChange={setJobTypeFilter}
//                   >
//                     <SelectTrigger data-testid="select-job-type">
//                       <SelectValue placeholder="All job types" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Types</SelectItem>
//                       {jobTypes.map((type) => (
//                         <SelectItem key={type} value={type}>
//                           {type}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//               {hasActiveFilters && (
//                 <div className="flex justify-end mt-4">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={clearFilters}
//                     className="gap-2"
//                   >
//                     <X className="h-4 w-4" />
//                     Clear Filters
//                   </Button>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       {isLoading ? (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {[1, 2, 3, 4, 5, 6].map((i) => (
//             <JobCardSkeleton key={i} />
//           ))}
//         </div>
//       ) : filteredJobs.length === 0 ? (
//         <EmptyState
//           icon={Briefcase}
//           title="No jobs found"
//           description={
//             hasActiveFilters
//               ? "Try adjusting your filters to find more jobs."
//               : "There are no open jobs available at the moment. Check back later!"
//           }
//           actionLabel={hasActiveFilters ? "Clear Filters" : undefined}
//           onAction={hasActiveFilters ? clearFilters : undefined}
//         />
//       ) : (
//         <>
//           <p className="text-sm text-muted-foreground mb-4">
//             Showing {filteredJobs.length} job
//             {filteredJobs.length !== 1 ? "s" : ""}
//           </p>
//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredJobs.map((job) => (
//               <JobCard
//                 key={job.job_id}
//                 job={job}
//                 onViewDetails={setSelectedJob}
//               />
//             ))}
//           </div>
//         </>
//       )}

//       <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
//         <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//           <DialogHeader>
//             <DialogTitle className="sr-only">Job Details</DialogTitle>
//           </DialogHeader>
//           {selectedJob && (
//             <div className="space-y-6">
//               <JobDetailContent
//                 job={selectedJob}
//                 hasApplied={appliedJobIds.has(selectedJob.job_id)}
//               />

//               {!appliedJobIds.has(selectedJob.job_id) &&
//                 selectedJob.status === "OPEN" && (
//                   <div className="border-t pt-6 space-y-4">
//                     <div className="space-y-2">
//                       <Label htmlFor="message">
//                         Application Message (Optional)
//                       </Label>
//                       <Textarea
//                         id="message"
//                         placeholder="Introduce yourself and explain your relevant experience..."
//                         value={applicationMessage}
//                         onChange={(e) => setApplicationMessage(e.target.value)}
//                         rows={4}
//                         data-testid="input-application-message"
//                       />
//                     </div>
//                     <div className="flex justify-end">
//                       <Button
//                         onClick={handleApply}
//                         disabled={applyMutation.isPending}
//                         className="min-w-[200px]"
//                         data-testid="button-submit-application"
//                       >
//                         {applyMutation.isPending ? (
//                           <>
//                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                             Submitting...
//                           </>
//                         ) : (
//                           "Apply for Job"
//                         )}
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
import { useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { JobCard, JobDetailContent } from "@/components/job-card";
import { JobCardSkeleton } from "@/components/loading-skeleton";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { EmploymentPost } from "@shared/schema";
import { wilayasDetailed } from "@/lib/wilayas";
import { Search, SlidersHorizontal, Briefcase, X, Loader2 } from "lucide-react";

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

export default function JobSeekerBrowseJobs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [jobTypeFilter, setJobTypeFilter] = useState<string>("all");
  const [selectedJob, setSelectedJob] = useState<EmploymentPost | null>(null);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // FIXED: Updated to handle { jobs: [...] } response
  const { data: jobsResponse, isLoading } = useQuery<{
    jobs: EmploymentPost[];
  }>({
    queryKey: ["/api/jobs"],
  });

  const jobs = jobsResponse?.jobs || [];

  // FIXED: Updated endpoint and response structure
  const { data: applicationsResponse } = useQuery<{
    applications: Array<{
      application_id: number;
      job_id: number;
      status: string;
      message: string | null;
      created_at: string;
    }>;
  }>({
    queryKey: ["/api/applications/my/job-applications"],
    enabled: !!user?.id && user?.role === "jobseeker",
  });

  const myApplications = applicationsResponse?.applications || [];
  const appliedJobIds = new Set(myApplications.map((a) => a.job_id));

  // FIXED: Corrected endpoint to /api/applications/job/:job_id/apply
  const applyMutation = useMutation({
    mutationFn: async ({
      jobId,
      message,
    }: {
      jobId: number;
      message: string;
    }) => {
      const response = await apiRequest(
        "POST",
        `/api/applications/job/${jobId}/apply`, // ✅ CORRECT ENDPOINT
        {
          message: message || null,
        }
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your job application has been sent to the farmer.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/applications/my/job-applications"],
      });
      setSelectedJob(null);
      setApplicationMessage("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description:
          error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (job.status !== "OPEN") return false;

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !job.job_type.toLowerCase().includes(query) &&
          !job.description.toLowerCase().includes(query) &&
          !job.wilaya.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      if (zoneFilter !== "all") {
        const wilaya = wilayasDetailed.find((r) => r.wilaya === job.wilaya);
        if (!wilaya || wilaya.zone !== zoneFilter) return false;
      }

      if (jobTypeFilter !== "all" && job.job_type !== jobTypeFilter) {
        return false;
      }

      return true;
    });
  }, [jobs, searchQuery, zoneFilter, jobTypeFilter]);

  const handleApply = () => {
    if (!selectedJob || !user?.id) return;
    applyMutation.mutate({
      jobId: selectedJob.job_id,
      message: applicationMessage,
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setZoneFilter("all");
    setJobTypeFilter("all");
  };

  const hasActiveFilters =
    searchQuery || zoneFilter !== "all" || jobTypeFilter !== "all";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Browse Jobs</h1>
        <p className="text-muted-foreground">
          Find agricultural employment opportunities across Algeria
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs by type, description, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2 shrink-0"
            data-testid="button-toggle-filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="h-2 w-2 rounded-full bg-primary" />
            )}
          </Button>
        </div>

        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Zone</Label>
                  <Select value={zoneFilter} onValueChange={setZoneFilter}>
                    <SelectTrigger data-testid="select-zone">
                      <SelectValue placeholder="All zones" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Zones</SelectItem>
                      <SelectItem value="Coastal">Coastal</SelectItem>
                      <SelectItem value="Highlands">Highlands</SelectItem>
                      <SelectItem value="Steppe">Steppe</SelectItem>
                      <SelectItem value="Sahara">Sahara</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Job Type</Label>
                  <Select
                    value={jobTypeFilter}
                    onValueChange={setJobTypeFilter}
                  >
                    <SelectTrigger data-testid="select-job-type">
                      <SelectValue placeholder="All job types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {jobTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {hasActiveFilters && (
                <div className="flex justify-end mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="gap-2"
                  >
                    <X className="h-4 w-4" />
                    Clear Filters
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs found"
          description={
            hasActiveFilters
              ? "Try adjusting your filters to find more jobs."
              : "There are no open jobs available at the moment. Check back later!"
          }
          actionLabel={hasActiveFilters ? "Clear Filters" : undefined}
          onAction={hasActiveFilters ? clearFilters : undefined}
        />
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            Showing {filteredJobs.length} job
            {filteredJobs.length !== 1 ? "s" : ""}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.job_id}
                job={job}
                onViewDetails={setSelectedJob}
              />
            ))}
          </div>
        </>
      )}

      <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Job Details</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <div className="space-y-6">
              <JobDetailContent
                job={selectedJob}
                hasApplied={appliedJobIds.has(selectedJob.job_id)}
              />

              {!appliedJobIds.has(selectedJob.job_id) &&
                selectedJob.status === "OPEN" && (
                  <div className="border-t pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="message">
                        Application Message (Optional)
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Introduce yourself and explain your relevant experience..."
                        value={applicationMessage}
                        onChange={(e) => setApplicationMessage(e.target.value)}
                        rows={4}
                        data-testid="input-application-message"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        onClick={handleApply}
                        disabled={applyMutation.isPending}
                        className="min-w-[200px]"
                        data-testid="button-submit-application"
                      >
                        {applyMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Apply for Job"
                        )}
                      </Button>
                    </div>
                  </div>
                )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
