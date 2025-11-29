const prisma = require('../config/prisma');

const jobController = {
  // Create Employment Post (Farmer only)
  createJob: async (req, res) => {
    try {
      if (req.user.userType !== 'farmer') {
        return res.status(403).json({ error: 'Only farmers can create job posts' });
      }

      const {
        job_type,
        description,
        payment,
        workers_needed,
        duration_days,
        wilaya
      } = req.body;

      // Validation
      if (!job_type || !description || !payment || !workers_needed || !duration_days || !wilaya) {
        return res.status(400).json({ error: 'All required fields must be provided' });
      }

      const job = await prisma.employmentPost.create({
        data: {
          job_type,
          description,
          payment: parseFloat(payment),
          workers_needed: parseInt(workers_needed),
          duration_days: parseInt(duration_days),
          wilaya,
          farmer_id: req.user.userId
        },
        include: {
          farmer: {
            select: {
              first_name: true,
              last_name: true,
              phone: true
            }
          }
        }
      });

      res.status(201).json({
        message: 'Job post created successfully',
        job
      });
    } catch (error) {
      console.error('Create job error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get All Jobs (Public/Job Seeker)
  getAllJobs: async (req, res) => {
    try {
      const { status, wilaya, job_type } = req.query;
      
      // Build filter object
      const whereClause = {};
      
      if (status) whereClause.status = status;
      else whereClause.status = 'OPEN'; // Default filter
      
      if (wilaya) whereClause.wilaya = { contains: wilaya, mode: 'insensitive' };
      if (job_type) whereClause.job_type = { contains: job_type, mode: 'insensitive' };

      const jobs = await prisma.employmentPost.findMany({
        where: whereClause,
        include: {
          farmer: {
            select: {
              first_name: true,
              last_name: true,
              wilaya: true,
              phone: true
            }
          },
          _count: {
            select: {
              applications: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      res.json({
        jobs
      });
    } catch (error) {
      console.error('Get jobs error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get My Jobs (Farmer)
  getMyJobs: async (req, res) => {
    try {
      if (req.user.userType !== 'farmer') {
        return res.status(403).json({ error: 'Only farmers can view their jobs' });
      }

      const jobs = await prisma.employmentPost.findMany({
        where: {
          farmer_id: req.user.userId
        },
        include: {
          applications: {
            include: {
              job_seeker: {
                select: {
                  first_name: true,
                  last_name: true,
                  email: true,
                  phone: true,
                  wilaya: true
                }
              }
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      res.json({
        jobs
      });
    } catch (error) {
      console.error('Get my jobs error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get Job by ID
  getJobById: async (req, res) => {
    try {
      const { id } = req.params;

      const job = await prisma.employmentPost.findUnique({
        where: { job_id: parseInt(id) },
        include: {
          farmer: {
            select: {
              first_name: true,
              last_name: true,
              wilaya: true,
              email: true,
              phone: true
            }
          },
          applications: {
            include: {
              job_seeker: {
                select: {
                  first_name: true,
                  last_name: true,
                  email: true,
                  phone: true
                }
              }
            }
          }
        }
      });

      if (!job) {
        return res.status(404).json({ error: 'Job not found' });
      }

      res.json({
        job
      });
    } catch (error) {
      console.error('Get job by ID error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // Get available job filters
  getJobFilters: async (req, res) => {
    try {
      const wilayas = await prisma.employmentPost.findMany({
        distinct: ['wilaya'],
        select: { wilaya: true }
      });

      const jobTypes = await prisma.employmentPost.findMany({
        distinct: ['job_type'],
        select: { job_type: true }
      });

      res.json({
        filters: {
          wilayas: wilayas.map(r => r.wilaya),
          job_types: jobTypes.map(jt => jt.job_type),
          job_status: ['OPEN', 'ONGOING', 'COMPLETED']
        }
      });
    } catch (error) {
      console.error('Get job filters error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = jobController;