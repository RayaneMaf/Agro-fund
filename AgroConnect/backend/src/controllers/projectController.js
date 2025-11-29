const prisma = require("../config/prisma");

const projectController = {
  // Create Project (Farmer only)
  createProject: async (req, res) => {
    try {
      if (req.user.userType !== "farmer") {
        return res
          .status(403)
          .json({ error: "Only farmers can create projects" });
      }

      const {
        title,
        description,
        budget_required,
        duration_months,
        profit_share,
        crop_type,
        farm_size_ha, // CHANGED: land_size_ha → farm_size_ha
        soil_quality, // CHANGED: String? → Soil enum
        soil_quality_score, // NEW FIELD
        soil_salinity,
        rainfall_mm, // NEW FIELD
        altitude_m,
        et0_mm, // NEW FIELD
        drought_index, // NEW FIELD
        zone, // NEW FIELD: Zone enum
        irrigation_type,
        experience_years,
      } = req.body;

      // Validation for required fields
      if (
        !title ||
        !description ||
        !budget_required ||
        !duration_months ||
        !crop_type ||
        !farm_size_ha ||
        !zone
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Validate enum values
      const validZones = ["Coastal", "Highlands", "Steppe", "Sahara"];
      const validSoilQualities = ["poor", "average", "good", "excellent"];

      if (!validZones.includes(zone)) {
        return res.status(400).json({ error: "Invalid zone value" });
      }

      if (soil_quality && !validSoilQualities.includes(soil_quality)) {
        return res.status(400).json({ error: "Invalid soil quality value" });
      }

      const project = await prisma.projectPost.create({
        data: {
          title,
          description,
          budget_required: parseFloat(budget_required),
          duration_months: parseInt(duration_months),
          profit_share: parseFloat(profit_share),
          crop_type,
          farm_size_ha: parseFloat(farm_size_ha), // CHANGED
          soil_quality: soil_quality || "average", // CHANGED + default
          soil_quality_score: soil_quality_score
            ? parseFloat(soil_quality_score)
            : null,
          soil_salinity: soil_salinity ? parseFloat(soil_salinity) : null,
          rainfall_mm: rainfall_mm ? parseFloat(rainfall_mm) : null, // NEW
          altitude_m: altitude_m ? parseFloat(altitude_m) : null,
          et0_mm: et0_mm ? parseFloat(et0_mm) : null, // NEW
          drought_index: drought_index ? parseFloat(drought_index) : null, // NEW
          zone: zone, // NEW
          irrigation_type: irrigation_type || "NONE",
          experience_years: experience_years
            ? parseInt(experience_years)
            : null,
          farmer_id: req.user.userId,
        },
        include: {
          farmer: {
            select: {
              first_name: true,
              last_name: true,
              wilaya: true,
            },
          },
        },
      });

      res.status(201).json({
        message: "Project created successfully",
        project,
      });
    } catch (error) {
      console.error("Create project error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get All Projects (Public/Investor)
  getAllProjects: async (req, res) => {
    try {
      const { status, zone, crop_type, soil_quality } = req.query;

      // Build filter object
      const whereClause = {};

      if (status) whereClause.status = status;
      else whereClause.status = "PENDING"; // Default filter

      if (zone) whereClause.zone = zone;
      if (crop_type)
        whereClause.crop_type = { contains: crop_type, mode: "insensitive" };
      if (soil_quality) whereClause.soil_quality = soil_quality;

      const projects = await prisma.projectPost.findMany({
        where: whereClause,
        include: {
          farmer: {
            select: {
              first_name: true,
              last_name: true,
              wilaya: true,
            },
          },
          _count: {
            select: {
              applications: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
      });

      // Function to get risk assessment for a single project
      const getRiskAssessment = async (project) => {
        try {
          // Prepare the data for the model
          const requestData = {
            wilaya: project.farmer?.wilaya || "Unknown",
            zone: project.zone,
            crop_type: project.crop_type,
            farm_size_ha: project.farm_size_ha || 0,
            soil_quality: project.soil_quality || 0.5,
            soil_salinity: project.soil_salinity || 0.1,
            altitude_m: project.altitude_m || 100,
            rainfall_mm: project.rainfall_mm || 500,
            et0_mm: project.et0_mm || 1000,
            drought_index: project.drought_index || 0.3,
            experience_years: project.experience_years || 1,
            irrigation_type: project.irrigation_type || "NONE",
            budget_needed: project.budget_required || 0,
          };

          console.log(
            `Sending request for project ${project.id}:`,
            requestData
          );

          const response = await fetch("http://0.0.0.0:8000/predict", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();

          // Use the correct field name: risk_score
          return result.risk_score || 50;
        } catch (error) {
          console.error(
            `Error getting risk assessment for project ${project.id}:`,
            error
          );
          // Return a default risk score in case of error
          return 50;
        }
      };

      // Process all projects with risk assessment
      const projectsWithRisk = await Promise.all(
        projects.map(async (project) => {
          const riskScore = await getRiskAssessment(project);
          return {
            ...project,
            risk_score: riskScore,
          };
        })
      );

      // Sort projects by risk score in increasing order (lowest risk first)
      const sortedProjects = projectsWithRisk.sort(
        (a, b) => a.risk_score - b.risk_score
      );

      res.json({
        success: true,
        count: sortedProjects.length,
        projects: sortedProjects,
        risk_summary: {
          lowest_risk: sortedProjects[0]?.risk_score,
          highest_risk: sortedProjects[sortedProjects.length - 1]?.risk_score,
          average_risk:
            sortedProjects.reduce(
              (acc, project) => acc + project.risk_score,
              0
            ) / sortedProjects.length,
        },
      });
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({
        success: false,
        error: "Internal server error",
        message: error.message,
      });
    }
  },

  // Get My Projects (Farmer)
  getMyProjects: async (req, res) => {
    try {
      const projects = await prisma.projectPost.findMany({
        where: {
          farmer_id: req.user.userId,
        },
        include: {
          applications: {
            include: {
              investor: {
                select: {
                  first_name: true,
                  last_name: true,
                  investor_type: true,
                  email: true,
                },
              },
            },
          },
          investment: true,
        },
        orderBy: {
          created_at: "desc",
        },
      });

      res.json({
        projects,
      });
    } catch (error) {
      console.error("Get my projects error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get Project by ID
  getProjectById: async (req, res) => {
    try {
      const { id } = req.params;

      const project = await prisma.projectPost.findUnique({
        where: { project_id: parseInt(id) },
        include: {
          farmer: {
            select: {
              first_name: true,
              last_name: true,
              wilaya: true,
              email: true,
              phone: true,
            },
          },
          applications: {
            include: {
              investor: {
                select: {
                  first_name: true,
                  last_name: true,
                  investor_type: true,
                  email: true,
                },
              },
            },
          },
          investment: true,
        },
      });

      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }

      res.json({
        project,
      });
    } catch (error) {
      console.error("Get project by ID error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // NEW: Get available filters (zones, soil types, etc.)
  getProjectFilters: async (req, res) => {
    try {
      const zones = await prisma.projectPost.findMany({
        distinct: ["zone"],
        select: { zone: true },
      });

      const soilQualities = await prisma.projectPost.findMany({
        distinct: ["soil_quality"],
        select: { soil_quality: true },
      });

      const cropTypes = await prisma.projectPost.findMany({
        distinct: ["crop_type"],
        select: { crop_type: true },
      });

      res.json({
        filters: {
          zones: zones.map((z) => z.zone),
          soil_qualities: soilQualities.map((sq) => sq.soil_quality),
          crop_types: cropTypes.map((ct) => ct.crop_type),
          project_status: ["PENDING", "ACTIVE", "COMPLETED"],
        },
      });
    } catch (error) {
      console.error("Get project filters error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

module.exports = projectController;
