import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { EmploymentPost } from "@shared/schema";
import { getZoneColor, getwilayaBywilaya } from "@/lib/wilayas";
import {
  MapPin,
  Calendar,
  Banknote,
  Users,
  Briefcase,
  Eye,
  Phone,
} from "lucide-react";

interface JobCardProps {
  job: EmploymentPost;
  onViewDetails: (job: EmploymentPost) => void;
}

export function JobCard({ job, onViewDetails }: JobCardProps) {
  const wilaya = getwilayaBywilaya(job.wilaya);
  const zoneColor = wilaya ? getZoneColor(wilaya.zone) : "";

  const statusColor = {
    OPEN: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    ONGOING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    COMPLETED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };

  return (
    <Card className="flex flex-col hover-elevate" data-testid={`card-job-${job.job_id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="font-semibold text-lg leading-tight line-clamp-1">
            {job.job_type}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{job.wilaya}</span>
          </div>
        </div>
        <Badge className={statusColor[job.status]}>{job.status}</Badge>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Banknote className="h-3.5 w-3.5" />
              <span className="text-xs">Payment</span>
            </div>
            <p className="font-semibold text-sm">
              {job.payment.toLocaleString()} DZD
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs">Duration</span>
            </div>
            <p className="font-semibold text-sm">{job.duration_days} days</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs">Workers</span>
            </div>
            <p className="font-semibold text-sm">{job.workers_needed}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {wilaya && (
            <Badge variant="secondary" className={zoneColor}>
              {wilaya.zone}
            </Badge>
          )}
          <Badge variant="outline">
            <Briefcase className="h-3 w-3 mr-1" />
            {job.job_type}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {job.description}
        </p>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => onViewDetails(job)}
          data-testid={`button-view-job-${job.job_id}`}
        >
          <Eye className="h-4 w-4" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

interface JobDetailProps {
  job: EmploymentPost;
  onApply?: () => void;
  isApplying?: boolean;
  hasApplied?: boolean;
}

export function JobDetailContent({
  job,
  onApply,
  isApplying,
  hasApplied,
}: JobDetailProps) {
  const wilaya = getwilayaBywilaya(job.wilaya);
  const zoneColor = wilaya ? getZoneColor(wilaya.zone) : "";

  const statusColor = {
    OPEN: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    ONGOING: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    COMPLETED: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold">{job.job_type}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className={zoneColor}>
              <MapPin className="h-3 w-3 mr-1" />
              {job.wilaya}
            </Badge>
            {wilaya && (
              <Badge variant="outline">{wilaya.zone} Zone</Badge>
            )}
            <Badge className={statusColor[job.status]}>{job.status}</Badge>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Job Description</h3>
            <p className="text-muted-foreground">{job.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Job Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Banknote className="h-4 w-4" />
                  <span className="text-sm">Payment</span>
                </div>
                <p className="font-bold text-lg">
                  {job.payment.toLocaleString()} DZD
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Duration</span>
                </div>
                <p className="font-bold text-lg">{job.duration_days} days</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Workers Needed</span>
                </div>
                <p className="font-bold text-lg">{job.workers_needed}</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-sm">Job Type</span>
                </div>
                <p className="font-bold text-lg">{job.job_type}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {wilaya && (
            <div>
              <h3 className="font-semibold mb-2">Location Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Wilaya</span>
                  <span className="font-medium">{job.wilaya}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Zone</span>
                  <Badge variant="outline" className={zoneColor}>
                    {wilaya.zone}
                  </Badge>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Altitude</span>
                  <span className="font-medium">{wilaya.altitude_m}m</span>
                </div>
              </div>
            </div>
          )}

          {job.farmer && (
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">Employer Information</h3>
              <p className="font-medium">
                {job.farmer.first_name} {job.farmer.last_name}
              </p>
              <p className="text-sm text-muted-foreground">{job.farmer.wilaya}</p>
              {job.farmer.phone && (
                <div className="mt-3 pt-3 border-t">
                  <a
                    href={`tel:${job.farmer.phone}`}
                    className="inline-flex items-center gap-2 text-primary hover:underline"
                  >
                    <Phone className="h-4 w-4" />
                    {job.farmer.phone}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {onApply && job.status === "OPEN" && (
        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={onApply}
            disabled={isApplying || hasApplied}
            className="min-w-[200px]"
            data-testid="button-apply-job"
          >
            {hasApplied
              ? "Already Applied"
              : isApplying
              ? "Applying..."
              : "Apply for Job"}
          </Button>
        </div>
      )}
    </div>
  );
}
