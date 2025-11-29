import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/empty-state";
import { useAuth } from "@/lib/auth";
import type {
  ApplicationForProjects,
  Investment,
  ProjectPost,
} from "@shared/schema";
import {
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Banknote,
  FolderKanban,
  Calendar,
  ArrowRight,
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

const investmentStatusConfig = {
  ACTIVE: {
    label: "Active",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  COMPLETED: {
    label: "Completed",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  },
};

export default function MyInvestments() {
  const { user } = useAuth();

  const { data: applicationsResponse, isLoading: loadingApplications } =
    useQuery({
      queryKey: ["/api/applications/my/applications"],
      queryFn: async () => {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/api/applications/my/applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) throw new Error("Failed to fetch applications");
        return response.json();
      },
      enabled: !!user?.id && user?.role === "investor",
    });

  const { data: investments = [], isLoading: loadingInvestments } = useQuery<
    (Investment & { project?: ProjectPost })[]
  >({
    queryKey: ["/api/investors", user?.id, "investments"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/api/investors/${user?.id}/investments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch investments");
      return response.json();
    },
    enabled: !!user?.id && user?.role === "investor",
  });

  const applications = applicationsResponse?.applications || [];

  const stats = {
    totalApplications: applications.length,
    pendingApplications: applications.filter((a: any) => a.status === "PENDING")
      .length,
    acceptedApplications: applications.filter(
      (a: any) => a.status === "ACCEPTED"
    ).length,
    activeInvestments: investments.filter((i) => i.status === "ACTIVE").length,
    totalInvested: investments.reduce((sum, i) => sum + i.amount, 0),
  };

  const isLoading = loadingApplications || loadingInvestments;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold mb-2">My Investments</h1>
        <p className="text-muted-foreground">
          Track your applications and active investments
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <FolderKanban className="h-4 w-4" />
              <span className="text-sm">Total Applications</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p
                className="text-2xl font-bold"
                data-testid="text-total-applications"
              >
                {stats.totalApplications}
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
                className="text-2xl font-bold"
                data-testid="text-pending-applications"
              >
                {stats.pendingApplications}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Active Investments</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p
                className="text-2xl font-bold"
                data-testid="text-active-investments"
              >
                {stats.activeInvestments}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Banknote className="h-4 w-4" />
              <span className="text-sm">Total Invested</span>
            </div>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p
                className="text-2xl font-bold"
                data-testid="text-total-invested"
              >
                {(stats.totalInvested / 1000).toFixed(0)}K
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="applications" className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications" data-testid="tab-applications">
            Applications ({applications.length})
          </TabsTrigger>
          <TabsTrigger value="investments" data-testid="tab-investments">
            Active Investments (
            {investments.filter((i) => i.status === "ACTIVE").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applications">
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
              icon={FolderKanban}
              title="No applications yet"
              description="You haven't applied to any projects yet. Browse available projects to start investing."
            />
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Crop Type</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Applied On</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.map((app: any) => {
                      const config =
                        statusConfig[app.status as keyof typeof statusConfig];
                      const StatusIcon = config.icon;
                      return (
                        <TableRow
                          key={app.application_id}
                          data-testid={`row-application-${app.application_id}`}
                        >
                          <TableCell className="font-medium">
                            {app.project?.title || `Project #${app.project_id}`}
                          </TableCell>
                          <TableCell>{app.project?.crop_type || "-"}</TableCell>
                          <TableCell>
                            {app.project
                              ? `${(app.project.budget_required / 1000).toFixed(
                                  0
                                )}K DZD`
                              : "-"}
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
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="investments">
          {isLoading ? (
            <div className="grid gap-6">
              {[1, 2].map((i) => (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : investments.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              title="No active investments"
              description="You don't have any active investments yet. Apply to projects to start investing."
            />
          ) : (
            <div className="grid gap-6">
              {investments.map((investment) => {
                const config = investmentStatusConfig[investment.status];
                const startDate = new Date(investment.start_date);
                const endDate = investment.end_date
                  ? new Date(investment.end_date)
                  : new Date(
                      startDate.getTime() +
                        (investment.project?.duration_months || 6) *
                          30 *
                          24 *
                          60 *
                          60 *
                          1000
                    );
                const now = new Date();
                const totalDuration = endDate.getTime() - startDate.getTime();
                const elapsed = now.getTime() - startDate.getTime();
                const progress = Math.min(
                  100,
                  Math.max(0, (elapsed / totalDuration) * 100)
                );

                return (
                  <Card
                    key={investment.investment_id}
                    data-testid={`card-investment-${investment.investment_id}`}
                  >
                    <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
                      <div>
                        <CardTitle className="text-xl">
                          {investment.project?.title ||
                            `Project #${investment.project_id}`}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {investment.project?.crop_type ||
                            "Agricultural Project"}
                        </p>
                      </div>
                      <Badge className={config.color}>{config.label}</Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Investment Amount
                          </p>
                          <p className="font-semibold">
                            {investment.amount.toLocaleString()} DZD
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Profit Share
                          </p>
                          <p className="font-semibold">
                            {investment.project?.profit_share || 0}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Start Date
                          </p>
                          <p className="font-semibold">
                            {startDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Expected End
                          </p>
                          <p className="font-semibold">
                            {endDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {investment.status === "ACTIVE" && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Progress
                            </span>
                            <span className="font-medium">
                              {progress.toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={progress} />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
