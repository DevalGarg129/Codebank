# Codebank

Codebank is a full-stack, GitHub-like application that brings together authentication, repository management, issue tracking, and lightweight collaboration features. The project is organized as a monorepo with a Node.js/Express backend and a React/Vite frontend.

## What this project does

The current codebase includes:

- User authentication and profile management
- Repository creation and repository listing flows
- Issue creation, update, and retrieval workflows
- AWS S3-backed repository commit storage for push/pull-style operations
- Real-time collaboration support through Socket.IO
- A modern frontend built with React Router and Vite

## Tech stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens for authentication
- Socket.IO for real-time events
- AWS SDK for S3 integration

### Frontend
- React
- Vite
- React Router
- Axios

## Repository structure

- backend/: Express API, models, controllers, routes, and AWS config
- frontend/: Vite + React client application
- .gitignore: repository ignore rules for dependencies, local secrets, and deployment artifacts

## Prerequisites

Before running the project locally, make sure you have:

- Node.js 18+ and npm
- A MongoDB instance or MongoDB Atlas connection string
- An AWS account with:
  - an S3 bucket
  - access keys
  - a configured AWS region

## Environment variables

Create a backend environment file at backend/.env using the values from backend/.env.example.

Required variables:

- PORT
- MONGODB_URI
- JWT_SECRET_KEY
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION
- S3_BUCKET

## Local development

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Start the backend

```bash
cd backend
npm run dev
```

The API will start on the port defined by PORT (default: 3000).

### 3. Start the frontend

```bash
cd frontend
npm run dev
```

The Vite development server will start and provide the client UI locally.

## Production build

### Frontend build

```bash
cd frontend
npm run build
```

The production output is created in the frontend/dist directory.

## AWS deployment guidance

This project is suitable for deployment on AWS with a split architecture:

- Backend: deploy to EC2, Elastic Beanstalk, ECS, or App Runner
- Frontend: deploy the built Vite app to S3 + CloudFront or a static hosting service
- Database: use MongoDB Atlas instead of running MongoDB locally
- File storage: use the configured S3 bucket for commit/object storage

### Recommended production setup

1. Provision a MongoDB Atlas cluster and set MONGODB_URI.
2. Create an S3 bucket and grant the backend IAM role or credentials access to it.
3. Set the required environment variables in your AWS hosting environment.
4. Build the frontend and deploy the dist folder to a static host.
5. Configure CORS and allowed origins for the deployed frontend URL.

### Security notes for AWS

- Keep secrets in environment variables or AWS Secrets Manager.
- Avoid committing .env files to source control.
- Restrict IAM permissions to the minimum required for S3 access.
- Use HTTPS in production and configure proper domain/CORS settings.

## Notes

The repository includes CLI-style backend commands for repository initialization and Git-like operations. These are intended to be used from the backend service context and may require additional refinement for production-grade workflows.
