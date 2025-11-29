const prisma = require("../config/prisma");

const applicationController = {
  applyToProject: async (req, res) => {
    try {
      const { project_id } = req.params;
      const { message } = req.body;

      // Check if project exists and is open for applications
      const project = await prisma.projectPost.findUnique({
        where: { project_id: parseInt(project_id) },
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      if (project.status !== "PENDING") {
        return res
          .status(400)
          .json({ error: "Project is not accepting applications" });
      }

      // Check if investor already applied
      const existingApplication = await prisma.applicationForProjects.findFirst(
        {
          where: {
            project_id: parseInt(project_id),
            investor_id: req.user.userId,
          },
        }
      );

      if (existingApplication) {
        return res
          .status(400)
          .json({ error: "You have already applied to this project" });
      }

      const application = await prisma.applicationForProjects.create({
        data: {
          project_id: parseInt(project_id),
          investor_id: req.user.userId,
          message: message || null,
        },
        include: {
          project: {
            select: {
              title: true,
              farmer: {
                select: {
                  first_name: true,
                  last_name: true,
                },
              },
            },
          },
          investor: {
            select: {
              first_name: true,
              last_name: true,
            },
          },
        },
      });

      res.status(201).json({
        message: "Application submitted successfully",
        application,
      });
    } catch (error) {
      console.error("Apply to project error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getProjectApplications: async (req, res) => {
    try {
      const { project_id } = req.params;

      // Verify the project belongs to the farmer
      const project = await prisma.projectPost.findFirst({
        where: {
          project_id: parseInt(project_id),
          farmer_id: req.user.userId,
        },
      });

      if (!project) {
        return res
          .status(404)
          .json({ error: "Project not found or access denied" });
      }

      const applications = await prisma.applicationForProjects.findMany({
        where: {
          project_id: parseInt(project_id),
        },
        include: {
          investor: {
            select: {
              first_name: true,
              last_name: true,
              email: true,
              phone: true,
              investor_type: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });

      res.json({
        applications,
      });
    } catch (error) {
      console.error("Get project applications error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  acceptApplication: async (req, res) => {
    try {
      const { application_id } = req.params;
      const { amount, start_date } = req.body;

      if (!amount || !start_date) {
        return res
          .status(400)
          .json({ error: "Amount and start date are required" });
      }

      const result = await prisma.$transaction(async (tx) => {
        // 1. Get application and verify ownership
        const application = await tx.applicationForProjects.findFirst({
          where: {
            application_id: parseInt(application_id),
            project: {
              farmer_id: req.user.userId,
            },
          },
          include: {
            project: true,
          },
        });

        if (!application) {
          throw new Error("Application not found or access denied");
        }

        if (application.status !== "PENDING") {
          throw new Error("Application is not pending");
        }

        // 2. Update application to ACCEPTED
        const updatedApplication = await tx.applicationForProjects.update({
          where: { application_id: parseInt(application_id) },
          data: { status: "ACCEPTED" },
        });

        // 3. Update project to ACTIVE
        const updatedProject = await tx.projectPost.update({
          where: { project_id: application.project_id },
          data: { status: "ACTIVE" },
        });

        // 4. Create investment record
        const investment = await tx.investment.create({
          data: {
            amount: parseFloat(amount),
            start_date: new Date(start_date),
            project_id: application.project_id,
            investor_id: application.investor_id,
          },
        });

        // 5. Reject all other applications for this project
        await tx.applicationForProjects.updateMany({
          where: {
            project_id: application.project_id,
            application_id: { not: parseInt(application_id) },
            status: "PENDING",
          },
          data: { status: "REJECTED" },
        });

        return {
          application: updatedApplication,
          project: updatedProject,
          investment,
        };
      });

      res.json({
        message: "Application accepted successfully",
        data: result,
      });
    } catch (error) {
      console.error("Accept application error:", error);
      if (
        error.message.includes("not found") ||
        error.message.includes("not pending")
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getMyApplications: async (req, res) => {
    try {
      const applications = await prisma.applicationForProjects.findMany({
        where: {
          investor_id: req.user.userId,
        },
        include: {
          project: {
            include: {
              farmer: {
                select: {
                  first_name: true,
                  last_name: true,
                  wilaya: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });

      res.json({
        applications,
      });
    } catch (error) {
      console.error("Get my applications error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // =========================================
  // 🚜 JOB APPLICATION METHODS
  // =========================================

  applyToJob: async (req, res) => {
    try {
      if (req.user.userType !== "jobseeker") {
        return res
          .status(403)
          .json({ error: "Only job seekers can apply to jobs" });
      }

      const { job_id } = req.params;
      const { message } = req.body;

      // Check if job exists and is open
      const job = await prisma.employmentPost.findUnique({
        where: { job_id: parseInt(job_id) },
      });

      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }

      if (job.status !== "OPEN") {
        return res
          .status(400)
          .json({ error: "Job is not accepting applications" });
      }

      // Check if already applied
      const existingApplication =
        await prisma.applicationForEmployment.findFirst({
          where: {
            job_id: parseInt(job_id),
            job_seeker_id: req.user.userId,
          },
        });

      if (existingApplication) {
        return res
          .status(400)
          .json({ error: "You have already applied to this job" });
      }

      const application = await prisma.applicationForEmployment.create({
        data: {
          job_id: parseInt(job_id),
          job_seeker_id: req.user.userId,
          message: message || null,
        },
        include: {
          job: {
            select: {
              job_type: true,
              description: true,
              farmer: {
                select: {
                  first_name: true,
                  last_name: true,
                },
              },
            },
          },
          job_seeker: {
            select: {
              first_name: true,
              last_name: true,
            },
          },
        },
      });

      res.status(201).json({
        message: "Job application submitted successfully",
        application,
      });
    } catch (error) {
      console.error("Apply to job error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getJobApplications: async (req, res) => {
    try {
      if (req.user.userType !== "farmer") {
        return res
          .status(403)
          .json({ error: "Only farmers can view job applications" });
      }

      const { job_id } = req.params;

      // Verify the job belongs to the farmer
      const job = await prisma.employmentPost.findFirst({
        where: {
          job_id: parseInt(job_id),
          farmer_id: req.user.userId,
        },
      });

      if (!job) {
        return res
          .status(404)
          .json({ error: "Job not found or access denied" });
      }

      const applications = await prisma.applicationForEmployment.findMany({
        where: {
          job_id: parseInt(job_id),
        },
        include: {
          job_seeker: {
            select: {
              first_name: true,
              last_name: true,
              email: true,
              phone: true,
              wilaya: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });

      res.json({
        applications,
      });
    } catch (error) {
      console.error("Get job applications error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  acceptJobApplication: async (req, res) => {
    try {
      if (req.user.userType !== "farmer") {
        return res
          .status(403)
          .json({ error: "Only farmers can accept job applications" });
      }

      const { application_id } = req.params;

      const result = await prisma.$transaction(async (tx) => {
        // 1. Get the application and verify it belongs to farmer's job
        const application = await tx.applicationForEmployment.findFirst({
          where: {
            application_id: parseInt(application_id),
            job: {
              farmer_id: req.user.userId,
            },
          },
          include: {
            job: true,
          },
        });

        if (!application) {
          throw new Error("Application not found or access denied");
        }

        if (application.status !== "PENDING") {
          throw new Error("Application is not pending");
        }

        if (application.job.workers_needed <= 0) {
          throw new Error("No more workers needed for this job");
        }

        // 2. Update the specific application status to 'ACCEPTED'
        const updatedApplication = await tx.applicationForEmployment.update({
          where: { application_id: parseInt(application_id) },
          data: { status: "ACCEPTED" },
        });

        // 3. Decrease workers_needed by 1
        const updatedJob = await tx.employmentPost.update({
          where: { job_id: application.job_id },
          data: {
            workers_needed: {
              decrement: 1,
            },
          },
        });

        // 4. If workers_needed reaches 0, update job status to ONGOING
        if (updatedJob.workers_needed === 0) {
          await tx.employmentPost.update({
            where: { job_id: application.job_id },
            data: { status: "ONGOING" },
          });
        }

        // 5. Update all other applications for this job to 'REJECTED' if job is filled
        if (updatedJob.workers_needed === 0) {
          await tx.applicationForEmployment.updateMany({
            where: {
              job_id: application.job_id,
              application_id: { not: parseInt(application_id) },
              status: "PENDING",
            },
            data: { status: "REJECTED" },
          });
        }

        return {
          application: updatedApplication,
          job: updatedJob,
        };
      });

      res.json({
        message: "Job application accepted successfully",
        data: result,
      });
    } catch (error) {
      console.error("Accept job application error:", error);
      if (
        error.message.includes("not found") ||
        error.message.includes("not pending") ||
        error.message.includes("No more workers")
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getMyJobApplications: async (req, res) => {
    try {
      if (req.user.userType !== "jobseeker") {
        return res
          .status(403)
          .json({ error: "Only job seekers can view their job applications" });
      }

      const applications = await prisma.applicationForEmployment.findMany({
        where: {
          job_seeker_id: req.user.userId,
        },
        include: {
          job: {
            include: {
              farmer: {
                select: {
                  first_name: true,
                  last_name: true,
                  wilaya: true,
                  phone: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });

      res.json({
        applications,
      });
    } catch (error) {
      console.error("Get my job applications error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  createProjectApplication: async (req, res) => {
    try {
      const { project_id, investor_id, message } = req.body;

      const application = await prisma.applicationForProjects.create({
        data: {
          project_id: parseInt(project_id),
          investor_id: parseInt(investor_id),
          message: message || null,
        },
      });

      res.status(201).json(application);
    } catch (error) {
      console.error("Create project application error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  acceptProjectApplication: async (req, res) => {
    try {
      const { id } = req.params;

      const application = await prisma.applicationForProjects.update({
        where: { application_id: parseInt(id) },
        data: { status: "ACCEPTED" },
      });

      res.json(application);
    } catch (error) {
      console.error("Accept application error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  rejectProjectApplication: async (req, res) => {
    try {
      const { id } = req.params;

      const application = await prisma.applicationForProjects.update({
        where: { application_id: parseInt(id) },
        data: { status: "REJECTED" },
      });

      res.json(application);
    } catch (error) {
      console.error("Reject application error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  createJobApplication: async (req, res) => {
    try {
      const { job_id, job_seeker_id, message } = req.body;

      const application = await prisma.applicationForEmployment.create({
        data: {
          job_id: parseInt(job_id),
          job_seeker_id: parseInt(job_seeker_id),
          message: message || null,
        },
      });

      res.status(201).json(application);
    } catch (error) {
      console.error("Create job application error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  acceptJobApplication: async (req, res) => {
    try {
      const { id } = req.params;

      const application = await prisma.applicationForEmployment.update({
        where: { application_id: parseInt(id) },
        data: { status: "ACCEPTED" },
      });

      res.json(application);
    } catch (error) {
      console.error("Accept job application error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  rejectJobApplication: async (req, res) => {
    try {
      const { id } = req.params;

      const application = await prisma.applicationForEmployment.update({
        where: { application_id: parseInt(id) },
        data: { status: "REJECTED" },
      });

      res.json(application);
    } catch (error) {
      console.error("Reject job application error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Add this to your existing applicationController.js
  // Replace the getMyApplications function with this:

  getMyApplications: async (req, res) => {
    try {
      const applications = await prisma.applicationForProjects.findMany({
        where: {
          investor_id: req.user.userId,
        },
        include: {
          project: {
            include: {
              farmer: {
                select: {
                  first_name: true,
                  last_name: true,
                  wilaya: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });

      // Return in the format frontend expects
      res.json({
        applications,
      });
    } catch (error) {
      console.error("Get my applications error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = applicationController;
