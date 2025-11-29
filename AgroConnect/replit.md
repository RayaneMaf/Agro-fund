# AgroFund - Agricultural Investment Platform

## Overview
AgroFund is a web platform connecting farmers, investors, and job seekers in Algeria's agricultural sector. Farmers can post farming projects seeking investment and employment opportunities, investors can browse and apply to fund projects, and job seekers can find agricultural employment.

## Project Architecture

### Tech Stack
- **Frontend**: React with TypeScript, Wouter for routing, TanStack Query for data fetching
- **Backend**: Express.js with in-memory storage
- **Styling**: Tailwind CSS with Shadcn UI components
- **Fonts**: Inter (sans-serif), Merriweather (serif headings)

### Directory Structure
```
client/src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── navigation.tsx  # Main navigation bar
│   ├── project-card.tsx # Project display card
│   ├── job-card.tsx    # Job listing card
│   ├── empty-state.tsx # Empty state displays
│   └── loading-skeleton.tsx # Loading states
├── pages/
│   ├── landing.tsx     # Public landing page
│   ├── login.tsx       # Authentication login
│   ├── register.tsx    # User registration
│   ├── investor/       # Investor dashboard pages
│   ├── farmer/         # Farmer dashboard pages
│   └── jobseeker/      # Job seeker dashboard pages
├── lib/
│   ├── auth.tsx        # Authentication context
│   ├── wilayas.ts      # Algerian wilayas data & calculations
│   └── queryClient.ts  # TanStack Query setup
└── App.tsx             # Main app with routing

server/
├── routes.ts           # API endpoints
├── storage.ts          # In-memory data storage
└── index.ts           # Server entry

shared/
└── schema.ts          # TypeScript types & Zod schemas
```

### User Types
1. **Farmer**: Posts projects and job listings, manages applications
2. **Investor**: Browses projects, applies to invest, tracks investments  
3. **Job Seeker**: Browses jobs, applies for positions, tracks applications

### Key Features
- AI Risk Score calculation for projects based on environmental factors
- 58 Algerian wilayas with zone and altitude data
- Environmental metrics (rainfall, ET0, drought index) calculated by zone
- Soil quality assessment using beta distribution
- Role-based authentication and navigation
- Dark/light theme support

### Data Models
- **Investor**: investor_id, name, email, phone, investor_type
- **Farmer**: farmer_id, name, email, phone, wilaya, address
- **JobSeeker**: job_seeker_id, name, email, phone, wilaya
- **ProjectPost**: project_id, title, description, budget, duration, profit_share, crop_type, soil_quality, zone, irrigation_type, ai_risk_score
- **EmploymentPost**: job_id, job_type, description, payment, workers_needed, duration_days, wilaya
- **ApplicationForProjects**: application_id, project_id, investor_id, message, status
- **ApplicationForEmployment**: application_id, job_id, job_seeker_id, message, status
- **Investment**: investment_id, project_id, investor_id, amount, start_date, status

### API Endpoints
- `POST /api/auth/login` - Login for all user types
- `POST /api/auth/register/:role` - Registration by role
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `GET /api/farmers/:id/projects` - Farmer's projects
- `GET /api/jobs` - List all jobs
- `POST /api/jobs` - Create new job
- `GET /api/farmers/:id/jobs` - Farmer's jobs
- `POST /api/applications/project` - Apply to project
- `POST /api/applications/project/:id/accept` - Accept investor
- `POST /api/applications/project/:id/reject` - Reject investor
- `GET /api/investors/:id/applications` - Investor's applications
- `GET /api/investors/:id/investments` - Investor's investments
- `POST /api/applications/job` - Apply to job
- `POST /api/applications/job/:id/accept` - Accept worker
- `POST /api/applications/job/:id/reject` - Reject worker
- `GET /api/jobseekers/:id/applications` - Job seeker's applications

### Demo Accounts
- **Farmer**: ahmed@farm.dz / password123
- **Investor**: mohamed@invest.dz / password123
- **Job Seeker**: youcef@job.dz / password123

### Zones
- **Coastal**: High rainfall (400-800mm), low ET0, low drought risk
- **Highlands**: Medium rainfall (200-400mm), medium-high ET0
- **Steppe**: Low rainfall (80-200mm), high ET0
- **Sahara**: Very low rainfall (0-80mm), very high ET0, high drought risk
