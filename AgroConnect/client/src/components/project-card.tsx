import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ProjectPost } from "@shared/schema";
import { getZoneColor, getRiskLevel } from "@/lib/wilayas";
import {
  MapPin,
  Calendar,
  Banknote,
  Percent,
  Droplets,
  Sprout,
  TrendingUp,
  Eye,
} from "lucide-react";

interface ProjectCardProps {
  project: ProjectPost;
  onViewDetails: (project: ProjectPost) => void;
  showApplyButton?: boolean;
}

export function ProjectCard({ project, onViewDetails, showApplyButton = true }: ProjectCardProps) {
  const riskScore = project.ai_risk_score ?? 50;
  const riskLevel = getRiskLevel(riskScore);
  const zoneColor = getZoneColor(project.zone);

  return (
    <Card className="flex flex-col hover-elevate" data-testid={`card-project-${project.project_id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="space-y-1 min-w-0 flex-1">
          <h3 className="font-semibold text-lg leading-tight line-clamp-1">
            {project.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sprout className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{project.crop_type}</span>
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-center">
          <div
            className={`relative h-14 w-14 rounded-full flex items-center justify-center border-4 ${
              riskScore < 35
                ? "border-green-500 bg-green-50 dark:bg-green-950"
                : riskScore < 65
                ? "border-amber-500 bg-amber-50 dark:bg-amber-950"
                : "border-red-500 bg-red-50 dark:bg-red-950"
            }`}
          >
            <span className={`text-lg font-bold ${riskLevel.color}`}>
              {riskScore}%
            </span>
          </div>
          <span className={`text-xs mt-1 font-medium ${riskLevel.color}`}>
            {riskLevel.label}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Banknote className="h-3.5 w-3.5" />
              <span className="text-xs">Budget</span>
            </div>
            <p className="font-semibold text-sm">
              {(project.budget_required / 1000).toFixed(0)}K DZD
            </p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs">Duration</span>
            </div>
            <p className="font-semibold text-sm">{project.duration_months} months</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Percent className="h-3.5 w-3.5" />
              <span className="text-xs">Profit</span>
            </div>
            <p className="font-semibold text-sm">{project.profit_share}%</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className={zoneColor}>
            <MapPin className="h-3 w-3 mr-1" />
            {project.zone}
          </Badge>
          {project.irrigation_type && project.irrigation_type !== "NONE" && (
            <Badge variant="outline">
              <Droplets className="h-3 w-3 mr-1" />
              {project.irrigation_type}
            </Badge>
          )}
          <Badge
            variant={
              project.status === "ACTIVE"
                ? "default"
                : project.status === "COMPLETED"
                ? "secondary"
                : "outline"
            }
          >
            {project.status}
          </Badge>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => onViewDetails(project)}
          data-testid={`button-view-project-${project.project_id}`}
        >
          <Eye className="h-4 w-4" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}

interface ProjectDetailProps {
  project: ProjectPost;
  onApply?: () => void;
  isApplying?: boolean;
  hasApplied?: boolean;
}

export function ProjectDetailContent({
  project,
  onApply,
  isApplying,
  hasApplied,
}: ProjectDetailProps) {
  const riskScore = project.ai_risk_score ?? 50;
  const riskLevel = getRiskLevel(riskScore);
  const zoneColor = getZoneColor(project.zone);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-serif font-bold">{project.title}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className={zoneColor}>
              <MapPin className="h-3 w-3 mr-1" />
              {project.zone}
            </Badge>
            <Badge variant="outline">
              <Sprout className="h-3 w-3 mr-1" />
              {project.crop_type}
            </Badge>
            {project.irrigation_type && project.irrigation_type !== "NONE" && (
              <Badge variant="outline">
                <Droplets className="h-3 w-3 mr-1" />
                {project.irrigation_type}
              </Badge>
            )}
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-center">
          <div
            className={`relative h-20 w-20 rounded-full flex items-center justify-center border-4 ${
              riskScore < 35
                ? "border-green-500 bg-green-50 dark:bg-green-950"
                : riskScore < 65
                ? "border-amber-500 bg-amber-50 dark:bg-amber-950"
                : "border-red-500 bg-red-50 dark:bg-red-950"
            }`}
          >
            <span className={`text-2xl font-bold ${riskLevel.color}`}>
              {riskScore}%
            </span>
          </div>
          <span className={`text-sm mt-1 font-medium ${riskLevel.color}`}>
            {riskLevel.label}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground">{project.description}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Investment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Banknote className="h-4 w-4" />
                  <span className="text-sm">Budget Required</span>
                </div>
                <p className="font-bold text-lg">
                  {project.budget_required.toLocaleString()} DZD
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Percent className="h-4 w-4" />
                  <span className="text-sm">Profit Share</span>
                </div>
                <p className="font-bold text-lg">{project.profit_share}%</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Duration</span>
                </div>
                <p className="font-bold text-lg">{project.duration_months} months</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm">Status</span>
                </div>
                <p className="font-bold text-lg">{project.status}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Farm Details</h3>
            <div className="space-y-3">
              {project.farm_size_ha && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Farm Size</span>
                  <span className="font-medium">{project.farm_size_ha} hectares</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Soil Quality</span>
                <Badge variant="outline" className="capitalize">
                  {project.soil_quality}
                </Badge>
              </div>
              {project.experience_years !== undefined && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Farmer Experience</span>
                  <span className="font-medium">{project.experience_years} years</span>
                </div>
              )}
              {project.altitude_m !== undefined && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Altitude</span>
                  <span className="font-medium">{project.altitude_m}m</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Environmental Factors</h3>
            <div className="space-y-3">
              {project.rainfall_mm !== undefined && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Rainfall</span>
                  <span className="font-medium">{project.rainfall_mm.toFixed(1)} mm/year</span>
                </div>
              )}
              {project.et0_mm !== undefined && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">ET0</span>
                  <span className="font-medium">{project.et0_mm.toFixed(1)} mm</span>
                </div>
              )}
              {project.drought_index !== undefined && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Drought Index</span>
                  <span className="font-medium">{(project.drought_index * 100).toFixed(1)}%</span>
                </div>
              )}
            </div>
          </div>

          {project.farmer && (
            <div className="p-4 rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">Farmer Information</h3>
              <p className="font-medium">
                {project.farmer.first_name} {project.farmer.last_name}
              </p>
              <p className="text-sm text-muted-foreground">{project.farmer.wilaya}</p>
              {project.farmer.phone && (
                <p className="text-sm text-muted-foreground mt-1">
                  Tel: {project.farmer.phone}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {onApply && (
        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={onApply}
            disabled={isApplying || hasApplied}
            className="min-w-[200px]"
            data-testid="button-apply-invest"
          >
            {hasApplied
              ? "Already Applied"
              : isApplying
              ? "Applying..."
              : "Apply to Invest"}
          </Button>
        </div>
      )}
    </div>
  );
}
