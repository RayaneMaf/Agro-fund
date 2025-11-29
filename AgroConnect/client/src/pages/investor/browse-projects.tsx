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
import { ProjectCard, ProjectDetailContent } from "@/components/project-card";
import { ProjectCardSkeleton } from "@/components/loading-skeleton";
import { EmptyState } from "@/components/empty-state";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { ProjectPost } from "@shared/schema";
import { wilayasDetailed } from "@/lib/wilayas";
import {
  Search,
  SlidersHorizontal,
  FolderSearch,
  X,
  Loader2,
} from "lucide-react";

// Define the API response type from your backend
interface ProjectsResponse {
  success: boolean;
  count: number;
  projects: ProjectPost[];
  risk_summary: {
    lowest_risk: number;
    highest_risk: number;
    average_risk: number;
  };
}

export default function InvestorBrowseProjects() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<ProjectPost | null>(
    null
  );
  const [applicationMessage, setApplicationMessage] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Updated to handle the backend response format
  const { data: projectsData, isLoading } = useQuery<ProjectsResponse>({
    queryKey: ["/api/projects"],
  });

  // Extract projects array from response
  const projects = projectsData?.projects || [];

  const { data: myApplicationsData } = useQuery<{
    applications: { project_id: number }[];
  }>({
    queryKey: ["/api/applications/my/projects"],
    enabled: !!user?.id,
  });

  // Extract applications from response
  const myApplications = myApplicationsData?.applications || [];
  const appliedProjectIds = new Set(myApplications.map((a) => a.project_id));

  const applyMutation = useMutation({
    mutationFn: async ({
      projectId,
      message,
    }: {
      projectId: number;
      message: string;
    }) => {
      return apiRequest(
        "POST",
        `/api/applications/project/${projectId}/apply`,
        {
          project_id: projectId,
          message,
          investor_id: user?.id,
        }
      );
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your investment application has been sent to the farmer.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/applications/my/projects"],
      });
      setSelectedProject(null);
      setApplicationMessage("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !project.title.toLowerCase().includes(query) &&
          !project.crop_type.toLowerCase().includes(query) &&
          !project.description.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      if (zoneFilter !== "all" && project.zone !== zoneFilter) {
        return false;
      }

      if (statusFilter !== "all" && project.status !== statusFilter) {
        return false;
      }

      if (riskFilter !== "all") {
        const score = project.risk_score ?? 50;
        if (riskFilter === "low" && score >= 35) return false;
        if (riskFilter === "medium" && (score < 35 || score >= 65))
          return false;
        if (riskFilter === "high" && score < 65) return false;
      }

      return true;
    });
  }, [projects, searchQuery, zoneFilter, statusFilter, riskFilter]);

  const handleApply = () => {
    if (!selectedProject || !user?.id) return;
    applyMutation.mutate({
      projectId: selectedProject.project_id,
      message: applicationMessage,
    });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setZoneFilter("all");
    setStatusFilter("all");
    setRiskFilter("all");
  };

  const hasActiveFilters =
    searchQuery ||
    zoneFilter !== "all" ||
    statusFilter !== "all" ||
    riskFilter !== "all";

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">Browse Projects</h1>
        <p className="text-muted-foreground">
          Discover agricultural investment opportunities across Algeria
        </p>
        {projectsData?.risk_summary && (
          <div className="mt-2 text-sm text-muted-foreground">
            Risk Range: {projectsData.risk_summary.lowest_risk.toFixed(1)}% -{" "}
            {projectsData.risk_summary.highest_risk.toFixed(1)}% (Avg:{" "}
            {projectsData.risk_summary.average_risk.toFixed(1)}%)
          </div>
        )}
      </div>

      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects by name, crop, or description..."
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
              <div className="grid sm:grid-cols-3 gap-4">
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
                  <Label>Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Risk Level</Label>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger data-testid="select-risk">
                      <SelectValue placeholder="All risk levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="low">Low Risk (&lt;35%)</SelectItem>
                      <SelectItem value="medium">
                        Medium Risk (35-65%)
                      </SelectItem>
                      <SelectItem value="high">High Risk (&gt;65%)</SelectItem>
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
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderSearch}
          title="No projects found"
          description={
            hasActiveFilters
              ? "Try adjusting your filters to find more projects."
              : "There are no projects available at the moment. Check back later!"
          }
          actionLabel={hasActiveFilters ? "Clear Filters" : undefined}
          onAction={hasActiveFilters ? clearFilters : undefined}
        />
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            Showing {filteredProjects.length} project
            {filteredProjects.length !== 1 ? "s" : ""}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.project_id}
                project={project}
                onViewDetails={setSelectedProject}
              />
            ))}
          </div>
        </>
      )}

      <Dialog
        open={!!selectedProject}
        onOpenChange={() => setSelectedProject(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="sr-only">Project Details</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6">
              <ProjectDetailContent
                project={selectedProject}
                hasApplied={appliedProjectIds.has(selectedProject.project_id)}
              />

              {!appliedProjectIds.has(selectedProject.project_id) &&
                selectedProject.status === "PENDING" && (
                  <div className="border-t pt-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="message">
                        Application Message (Optional)
                      </Label>
                      <Textarea
                        id="message"
                        placeholder="Introduce yourself and explain why you're interested in this project..."
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
                          "Apply to Invest"
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
