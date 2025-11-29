// import { useQuery } from "@tanstack/react-query";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
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
// import { useAuth } from "@/lib/auth";
// import type { ApplicationForEmployment, EmploymentPost } from "@shared/schema";
// import {
//   Clock,
//   CheckCircle,
//   XCircle,
//   Briefcase,
//   Banknote,
//   Calendar,
//   MapPin,
//   Phone,
// } from "lucide-react";

// const statusConfig = {
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

// export default function JobSeekerMyApplications() {
//   const { user } = useAuth();

//   const { data: applications = [], isLoading } = useQuery<
//     (ApplicationForEmployment & { job?: EmploymentPost })[]
//   >({
//     queryKey: ["/api/jobseekers", user?.id, "applications"],
//     enabled: !!user?.id,
//   });

//   const stats = {
//     total: applications.length,
//     pending: applications.filter((a) => a.status === "PENDING").length,
//     accepted: applications.filter((a) => a.status === "ACCEPTED").length,
//     rejected: applications.filter((a) => a.status === "REJECTED").length,
//   };

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <h1 className="text-3xl font-serif font-bold mb-2">My Applications</h1>
//         <p className="text-muted-foreground">
//           Track the status of your job applications
//         </p>
//       </div>

//       <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center gap-2 text-muted-foreground mb-1">
//               <Briefcase className="h-4 w-4" />
//               <span className="text-sm">Total Applications</span>
//             </div>
//             {isLoading ? (
//               <Skeleton className="h-8 w-16" />
//             ) : (
//               <p className="text-2xl font-bold" data-testid="text-total-applications">
//                 {stats.total}
//               </p>
//             )}
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center gap-2 text-muted-foreground mb-1">
//               <Clock className="h-4 w-4" />
//               <span className="text-sm">Pending</span>
//             </div>
//             {isLoading ? (
//               <Skeleton className="h-8 w-16" />
//             ) : (
//               <p className="text-2xl font-bold text-amber-600" data-testid="text-pending">
//                 {stats.pending}
//               </p>
//             )}
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center gap-2 text-muted-foreground mb-1">
//               <CheckCircle className="h-4 w-4" />
//               <span className="text-sm">Accepted</span>
//             </div>
//             {isLoading ? (
//               <Skeleton className="h-8 w-16" />
//             ) : (
//               <p className="text-2xl font-bold text-green-600" data-testid="text-accepted">
//                 {stats.accepted}
//               </p>
//             )}
//           </CardContent>
//         </Card>
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center gap-2 text-muted-foreground mb-1">
//               <XCircle className="h-4 w-4" />
//               <span className="text-sm">Rejected</span>
//             </div>
//             {isLoading ? (
//               <Skeleton className="h-8 w-16" />
//             ) : (
//               <p className="text-2xl font-bold text-red-600" data-testid="text-rejected">
//                 {stats.rejected}
//               </p>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {isLoading ? (
//         <Card>
//           <CardContent className="pt-6">
//             <div className="space-y-4">
//               {[1, 2, 3].map((i) => (
//                 <Skeleton key={i} className="h-16 w-full" />
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       ) : applications.length === 0 ? (
//         <EmptyState
//           icon={Briefcase}
//           title="No applications yet"
//           description="You haven't applied to any jobs yet. Browse available jobs to start applying."
//         />
//       ) : (
//         <div className="space-y-6">
//           {applications.filter((a) => a.status === "ACCEPTED").length > 0 && (
//             <div>
//               <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//                 <CheckCircle className="h-5 w-5 text-green-600" />
//                 Accepted Applications
//               </h2>
//               <div className="grid gap-4">
//                 {applications
//                   .filter((a) => a.status === "ACCEPTED")
//                   .map((app) => (
//                     <Card key={app.application_id} className="border-green-200 dark:border-green-900">
//                       <CardContent className="pt-6">
//                         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//                           <div>
//                             <h3 className="font-semibold text-lg">
//                               {app.job?.job_type || `Job #${app.job_id}`}
//                             </h3>
//                             <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
//                               {app.job?.wilaya && (
//                                 <span className="flex items-center gap-1">
//                                   <MapPin className="h-3.5 w-3.5" />
//                                   {app.job.wilaya}
//                                 </span>
//                               )}
//                               {app.job?.payment && (
//                                 <span className="flex items-center gap-1">
//                                   <Banknote className="h-3.5 w-3.5" />
//                                   {app.job.payment.toLocaleString()} DZD
//                                 </span>
//                               )}
//                               {app.job?.duration_days && (
//                                 <span className="flex items-center gap-1">
//                                   <Calendar className="h-3.5 w-3.5" />
//                                   {app.job.duration_days} days
//                                 </span>
//                               )}
//                             </div>
//                           </div>
//                           <div className="flex items-center gap-4">
//                             {app.job?.farmer?.phone && (
//                               <a
//                                 href={`tel:${app.job.farmer.phone}`}
//                                 className="flex items-center gap-2 text-primary hover:underline"
//                               >
//                                 <Phone className="h-4 w-4" />
//                                 {app.job.farmer.phone}
//                               </a>
//                             )}
//                             <Badge className={statusConfig.ACCEPTED.color}>
//                               <CheckCircle className="h-3 w-3 mr-1" />
//                               Accepted
//                             </Badge>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//               </div>
//             </div>
//           )}

//           <Card>
//             <CardContent className="p-0">
//               <Table>
//                 <TableHeader>
//                   <TableRow>
//                     <TableHead>Job</TableHead>
//                     <TableHead>wilaya</TableHead>
//                     <TableHead>Payment</TableHead>
//                     <TableHead>Duration</TableHead>
//                     <TableHead>Applied On</TableHead>
//                     <TableHead>Status</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {applications.map((app) => {
//                     const config = statusConfig[app.status];
//                     const StatusIcon = config.icon;
//                     return (
//                       <TableRow
//                         key={app.application_id}
//                         data-testid={`row-application-${app.application_id}`}
//                       >
//                         <TableCell className="font-medium">
//                           {app.job?.job_type || `Job #${app.job_id}`}
//                         </TableCell>
//                         <TableCell>{app.job?.wilaya || "-"}</TableCell>
//                         <TableCell>
//                           {app.job ? `${app.job.payment.toLocaleString()} DZD` : "-"}
//                         </TableCell>
//                         <TableCell>
//                           {app.job ? `${app.job.duration_days} days` : "-"}
//                         </TableCell>
//                         <TableCell>
//                           {new Date(app.created_at).toLocaleDateString()}
//                         </TableCell>
//                         <TableCell>
//                           <Badge className={`gap-1 ${config.color}`}>
//                             <StatusIcon className="h-3 w-3" />
//                             {config.label}
//                           </Badge>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// }
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { useAuth } from "@/lib/auth";
import type { ApplicationForEmployment, EmploymentPost } from "@shared/schema";
import {
  Clock,
  CheckCircle,
  XCircle,
  Briefcase,
  Banknote,
  Calendar,
  MapPin,
  Phone,
} from "lucide-react";

const statusConfig = {
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

export default function JobSeekerMyApplications() {
  const { user } = useAuth();

  // FIXED: Updated to match backend route: GET /api/applications/my/job-applications
  // Backend returns: { applications: [...] } with full job and farmer details
  const { data: applicationsResponse, isLoading } = useQuery<{
    applications: (ApplicationForEmployment & {
      job: EmploymentPost & {
        farmer: {
          first_name: string;
          last_name: string;
          wilaya: string;
          phone: string | null;
        };
      };
    })[];
  }>({
    queryKey: ["/api/applications/my/job-applications"],
    enabled: !!user?.id && user?.role === "jobseeker",
  });

  const applications = applicationsResponse?.applications || [];

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "PENDING").length,
    accepted: applications.filter((a) => a.status === "ACCEPTED").length,
    rejected: applications.filter((a) => a.status === "REJECTED").length,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">My Applications</h1>
        <p className="text-muted-foreground">
          Track the status of your job applications
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Briefcase className="h-4 w-4" />
              <span className="text-sm">Total Applications</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p
                className="text-2xl font-bold"
                data-testid="text-total-applications"
              >
                {stats.total}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Pending</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p
                className="text-2xl font-bold text-amber-600"
                data-testid="text-pending"
              >
                {stats.pending}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Accepted</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p
                className="text-2xl font-bold text-green-600"
                data-testid="text-accepted"
              >
                {stats.accepted}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <XCircle className="h-4 w-4" />
              <span className="text-sm">Rejected</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p
                className="text-2xl font-bold text-red-600"
                data-testid="text-rejected"
              >
                {stats.rejected}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No applications yet"
          description="You haven't applied to any jobs yet. Browse available jobs to start applying."
        />
      ) : (
        <div className="space-y-6">
          {applications.filter((a) => a.status === "ACCEPTED").length > 0 && (
            <div>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Accepted Applications
              </h2>
              <div className="grid gap-4">
                {applications
                  .filter((a) => a.status === "ACCEPTED")
                  .map((app) => (
                    <Card
                      key={app.application_id}
                      className="border-green-200 dark:border-green-900"
                    >
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">
                              {app.job.job_type}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {app.job.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {app.job.wilaya}
                              </span>
                              <span className="flex items-center gap-1">
                                <Banknote className="h-3.5 w-3.5" />
                                {app.job.payment.toLocaleString()} DZD
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3.5 w-3.5" />
                                {app.job.duration_days} days
                              </span>
                            </div>
                            <div className="mt-2 text-sm">
                              <span className="text-muted-foreground">
                                Farmer:{" "}
                              </span>
                              <span className="font-medium">
                                {app.job.farmer.first_name}{" "}
                                {app.job.farmer.last_name}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            {app.job.farmer.phone && (
                              <a
                                href={`tel:${app.job.farmer.phone}`}
                                className="flex items-center gap-2 text-primary hover:underline text-sm"
                              >
                                <Phone className="h-4 w-4" />
                                {app.job.farmer.phone}
                              </a>
                            )}
                            <Badge className={statusConfig.ACCEPTED.color}>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Accepted
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold mb-4">All Applications</h2>
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Job Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Farmer</TableHead>
                        <TableHead>Applied On</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.map((app) => {
                        const config = statusConfig[app.status];
                        const StatusIcon = config.icon;
                        return (
                          <TableRow
                            key={app.application_id}
                            data-testid={`row-application-${app.application_id}`}
                          >
                            <TableCell className="font-medium">
                              {app.job.job_type}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                                {app.job.wilaya}
                              </div>
                            </TableCell>
                            <TableCell>
                              {app.job.payment.toLocaleString()} DZD
                            </TableCell>
                            <TableCell>{app.job.duration_days} days</TableCell>
                            <TableCell>
                              {app.job.farmer.first_name}{" "}
                              {app.job.farmer.last_name}
                            </TableCell>
                            <TableCell>
                              {new Date(app.created_at).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge className={`gap-1 ${config.color}`}>
                                <StatusIcon className="h-3 w-3" />
                                {config.label}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
