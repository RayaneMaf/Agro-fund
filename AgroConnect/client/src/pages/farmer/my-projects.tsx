import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  insertProjectSchema,
  type InsertProject,
  type ProjectPost,
  type ApplicationForProjects,
  type Investor,
} from "@shared/schema";
import {
  getwilayaList,
  getwilayaBywilaya,
  calculateEnvironmentalMetrics,
  calculateAIRiskScore,
  getZoneColor,
  getRiskLevel,
} from "@/lib/wilayas";
import {
  Plus,
  FolderKanban,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Loader2,
  Sprout,
  MapPin,
  Banknote,
  Calendar,
  TrendingUp,
} from "lucide-react";

const statusConfig = {
  PENDING: {
    label: "Pending",
    color: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  },
  ACTIVE: {
    label: "Active",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
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

export default function FarmerMyProjects() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

  const wilayas = getwilayaList();

  // FIXED: Updated to match backend route: GET /api/projects/my/projects
  const { data: projectsResponse, isLoading } = useQuery<{
    projects: (ProjectPost & {
      applications?: (ApplicationForProjects & { investor?: Investor })[];
      investment?: any;
    })[];
  }>({
    queryKey: ["/api/projects/my/projects"],
    enabled: !!user?.id && user?.role === "farmer",
  });

  const projects = projectsResponse?.projects || [];

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      budget_required: 0,
      duration_months: 6,
      profit_share: 20,
      crop_type: "",
      farm_size_ha: undefined,
      soil_quality: "average",
      irrigation_type: undefined,
      experience_years: undefined,
      wilaya: "",
    },
  });

  // FIXED: Updated to match backend route: POST /api/projects
  const createProjectMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const wilaya = getwilayaBywilaya(data.wilaya);
      const envMetrics = wilaya
        ? calculateEnvironmentalMetrics(wilaya.zone)
        : null;

      const projectData = {
        title: data.title,
        description: data.description,
        budget_required: data.budget_required,
        duration_months: data.duration_months,
        profit_share: data.profit_share,
        crop_type: data.crop_type,
        farm_size_ha: data.farm_size_ha,
        soil_quality: data.soil_quality || "average",
        soil_quality_score: envMetrics?.soil_quality_score,
        soil_salinity: undefined,
        rainfall_mm: envMetrics?.rainfall_mm,
        altitude_m: wilaya?.altitude_m,
        et0_mm: envMetrics?.et0_mm,
        drought_index: envMetrics?.drought_index,
        zone: wilaya?.zone || "Coastal",
        irrigation_type: data.irrigation_type || "NONE",
        experience_years: data.experience_years,
      };

      const response = await apiRequest("POST", "/api/projects", projectData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Project Created",
        description: "Your project has been posted successfully.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/projects/my/projects"],
      });
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setShowNewProjectDialog(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description:
          error.message || "Failed to create project. Please try again.",
        variant: "destructive",
      });
    },
  });

  // FIXED: Updated to match backend route: PATCH /api/applications/project/:application_id/accept
  // Backend expects: { amount, start_date } in body
  const acceptInvestorMutation = useMutation({
    mutationFn: async ({
      applicationId,
      projectId,
    }: {
      applicationId: number;
      projectId: number;
    }) => {
      // Get project details to determine investment amount
      const project = projects.find((p) => p.project_id === projectId);

      const response = await apiRequest(
        "PATCH",
        `/api/applications/project/${applicationId}/accept`,
        {
          amount: project?.budget_required || 0,
          start_date: new Date().toISOString(),
        }
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Investor Accepted",
        description: "The investor has been accepted for this project.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/projects/my/projects"],
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description:
          error.message || "Failed to accept investor. Please try again.",
        variant: "destructive",
      });
    },
  });

  // FIXED: There's no reject endpoint in your backend for projects
  // Using the POST /api/applications/project/:id/reject route instead
  const rejectInvestorMutation = useMutation({
    mutationFn: async (applicationId: number) => {
      const response = await apiRequest(
        "POST",
        `/api/applications/project/${applicationId}/reject`,
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
        queryKey: ["/api/projects/my/projects"],
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

  const onSubmit = (data: InsertProject) => {
    createProjectMutation.mutate(data);
  };

  const stats = {
    total: projects.length,
    pending: projects.filter((p) => p.status === "PENDING").length,
    active: projects.filter((p) => p.status === "ACTIVE").length,
    totalApplications: projects.reduce(
      (sum, p) => sum + (p.applications?.length || 0),
      0
    ),
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold mb-2">My Projects</h1>
          <p className="text-muted-foreground">
            Manage your farming projects and investor applications
          </p>
        </div>
        <Dialog
          open={showNewProjectDialog}
          onOpenChange={setShowNewProjectDialog}
        >
          <DialogTrigger asChild>
            <Button className="gap-2" data-testid="button-new-project">
              <Plus className="h-4 w-4" />
              Post New Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Post New Project</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Wheat Farming Project 2024"
                          {...field}
                          data-testid="input-title"
                        />
                      </FormControl>
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
                          placeholder="Describe your project, expected outcomes, and investment needs..."
                          rows={4}
                          {...field}
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="crop_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Crop Type *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Wheat, Olives, Dates"
                            {...field}
                            data-testid="input-crop-type"
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
                        <FormLabel>wilaya (wilaya) *</FormLabel>
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
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="budget_required"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Budget (DZD) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="500000"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            data-testid="input-budget"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="duration_months"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (months) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="6"
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
                    name="profit_share"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profit Share (%) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="20"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            data-testid="input-profit-share"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="farm_size_ha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Farm Size (hectares)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="10"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
                              )
                            }
                            value={field.value ?? ""}
                            data-testid="input-farm-size"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="experience_years"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience (years)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="5"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
                              )
                            }
                            value={field.value ?? ""}
                            data-testid="input-experience"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="soil_quality"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Soil Quality</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-soil-quality">
                              <SelectValue placeholder="Select quality" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="poor">Poor</SelectItem>
                            <SelectItem value="average">Average</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="excellent">Excellent</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="irrigation_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Irrigation Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || ""}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-irrigation">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="DRIP">Drip</SelectItem>
                            <SelectItem value="SPRINKLER">Sprinkler</SelectItem>
                            <SelectItem value="FLOOD">Flood</SelectItem>
                            <SelectItem value="NONE">None</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewProjectDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createProjectMutation.isPending}
                    data-testid="button-submit-project"
                  >
                    {createProjectMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Post Project"
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
              <FolderKanban className="h-4 w-4" />
              <span className="text-sm">Total Projects</span>
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
              <span className="text-sm">Pending</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">{stats.pending}</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Active</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">{stats.active}</p>
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
      ) : projects.length === 0 ? (
        <EmptyState
          icon={Sprout}
          title="No projects yet"
          description="Start by posting your first farming project to attract investors."
          actionLabel="Post New Project"
          onAction={() => setShowNewProjectDialog(true)}
        />
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {projects.map((project) => {
            const config = statusConfig[project.status];
            const riskLevel = getRiskLevel(project.risk_score ?? 50);
            const zoneColor = getZoneColor(project.zone);
            const pendingApps =
              project.applications?.filter((a) => a.status === "PENDING") || [];
            const hasAcceptedInvestor = project.applications?.some(
              (a) => a.status === "ACCEPTED"
            );

            return (
              <AccordionItem
                key={project.project_id}
                value={String(project.project_id)}
                className="border rounded-lg px-4"
                data-testid={`accordion-project-${project.project_id}`}
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-left flex-1 mr-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold truncate">
                          {project.title}
                        </h3>
                        <Badge className={config.color}>{config.label}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-1">
                          <Sprout className="h-3.5 w-3.5" />
                          {project.crop_type}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {project.zone}
                        </span>
                        <span className="flex items-center gap-1">
                          <Banknote className="h-3.5 w-3.5" />
                          {(project.budget_required / 1000).toFixed(0)}K DZD
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
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
                    <p className="text-muted-foreground">
                      {project.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-muted-foreground">Duration</p>
                        <p className="font-semibold">
                          {project.duration_months} months
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-muted-foreground">Profit Share</p>
                        <p className="font-semibold">{project.profit_share}%</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-muted-foreground">Farm Size</p>
                        <p className="font-semibold">
                          {project.farm_size_ha || "-"} ha
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50">
                        <p className="text-muted-foreground">Soil Quality</p>
                        <p className="font-semibold capitalize">
                          {project.soil_quality}
                        </p>
                      </div>
                    </div>

                    {project.applications &&
                      project.applications.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Investor Applications ({project.applications.length}
                            )
                          </h4>
                          <Card>
                            <CardContent className="p-0">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Investor</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Message</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">
                                      Actions
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {project.applications.map((app) => {
                                    const appConfig =
                                      appStatusConfig[app.status];
                                    const AppIcon = appConfig.icon;
                                    return (
                                      <TableRow key={app.application_id}>
                                        <TableCell className="font-medium">
                                          {app.investor
                                            ? `${app.investor.first_name} ${app.investor.last_name}`
                                            : `Investor #${app.investor_id}`}
                                        </TableCell>
                                        <TableCell>
                                          {app.investor?.investor_type || "-"}
                                        </TableCell>
                                        <TableCell className="max-w-[200px] truncate">
                                          {app.message || "-"}
                                        </TableCell>
                                        <TableCell>
                                          {new Date(
                                            app.created_at
                                          ).toLocaleDateString()}
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
                                            !hasAcceptedInvestor && (
                                              <div className="flex justify-end gap-2">
                                                <Button
                                                  size="sm"
                                                  onClick={() =>
                                                    acceptInvestorMutation.mutate(
                                                      {
                                                        applicationId:
                                                          app.application_id,
                                                        projectId:
                                                          project.project_id,
                                                      }
                                                    )
                                                  }
                                                  disabled={
                                                    acceptInvestorMutation.isPending
                                                  }
                                                  data-testid={`button-accept-${app.application_id}`}
                                                >
                                                  Accept
                                                </Button>
                                                <Button
                                                  size="sm"
                                                  variant="outline"
                                                  onClick={() =>
                                                    rejectInvestorMutation.mutate(
                                                      app.application_id
                                                    )
                                                  }
                                                  disabled={
                                                    rejectInvestorMutation.isPending
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

                    {(!project.applications ||
                      project.applications.length === 0) && (
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
