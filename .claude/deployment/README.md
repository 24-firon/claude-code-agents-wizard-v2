# Deployment Workflows

Comprehensive deployment templates and scripts for multiple platforms and orchestration systems.

## Table of Contents

- [Overview](#overview)
- [Directory Structure](#directory-structure)
- [Platform Guides](#platform-guides)
  - [Docker](#docker)
  - [Vercel](#vercel)
  - [Netlify](#netlify)
  - [Railway](#railway)
  - [AWS ECS](#aws-ecs)
  - [Kubernetes](#kubernetes)
- [Deployment Scripts](#deployment-scripts)
- [Environment Variables](#environment-variables)
- [Common Deployment Patterns](#common-deployment-patterns)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)

## Overview

This directory contains production-ready deployment templates and automation scripts for deploying applications to various platforms. All templates follow security best practices and include comprehensive configuration options.

### Supported Platforms

- **Docker** - Containerization with multi-stage builds
- **Vercel** - Serverless deployment for frontend apps
- **Netlify** - JAMstack deployment platform
- **Railway** - Full-stack deployment platform
- **AWS ECS** - Container orchestration on AWS
- **Kubernetes** - Cloud-native container orchestration

## Directory Structure

```
deployment/
├── README.md                      # This file
├── templates/
│   ├── docker/
│   │   ├── Dockerfile.node        # Node.js Dockerfile
│   │   ├── Dockerfile.python      # Python Dockerfile
│   │   ├── docker-compose.yml     # Multi-service setup
│   │   └── .dockerignore          # Docker ignore patterns
│   ├── vercel/
│   │   ├── vercel.json            # Vercel configuration
│   │   └── .vercelignore          # Vercel ignore patterns
│   ├── netlify/
│   │   └── netlify.toml           # Netlify configuration
│   ├── railway/
│   │   └── railway.json           # Railway configuration
│   ├── aws/
│   │   ├── cloudformation.yml     # CloudFormation template
│   │   └── ecs-task-definition.json # ECS task definition
│   └── kubernetes/
│       ├── deployment.yaml        # K8s deployment
│       ├── service.yaml           # K8s service
│       └── ingress.yaml           # K8s ingress with TLS
└── scripts/
    ├── deploy-docker.sh           # Docker deployment automation
    ├── deploy-vercel.sh           # Vercel deployment automation
    └── health-check.sh            # Universal health check script
```

## Platform Guides

### Docker

Docker provides containerization for consistent deployments across environments.

#### Quick Start

1. **Copy the appropriate Dockerfile to your project root:**

   ```bash
   # For Node.js projects
   cp .claude/deployment/templates/docker/Dockerfile.node ./Dockerfile

   # For Python projects
   cp .claude/deployment/templates/docker/Dockerfile.python ./Dockerfile
   ```

2. **Copy docker-compose.yml for multi-service setup:**

   ```bash
   cp .claude/deployment/templates/docker/docker-compose.yml ./
   cp .claude/deployment/templates/docker/.dockerignore ./
   ```

3. **Build and run:**

   ```bash
   docker build -t my-app:latest .
   docker run -p 3000:3000 my-app:latest

   # Or use docker-compose
   docker-compose up -d
   ```

#### Features

- **Multi-stage builds** - Optimized image size
- **Security hardening** - Non-root user, minimal base images
- **Health checks** - Built-in container health monitoring
- **Production-ready** - Proper signal handling with dumb-init

#### Customization

Edit the Dockerfile to customize:
- Node/Python version
- Build commands
- Port numbers
- Health check endpoints
- Volume mounts

#### Docker Compose Services

The docker-compose template includes:
- Application container
- PostgreSQL database
- Redis cache
- Nginx reverse proxy (optional)

To start specific services:

```bash
docker-compose up app db        # Just app and database
docker-compose up --profile with-nginx  # Include nginx
```

---

### Vercel

Vercel is ideal for Next.js, React, Vue, and other frontend frameworks.

#### Quick Start

1. **Copy configuration files:**

   ```bash
   cp .claude/deployment/templates/vercel/vercel.json ./
   cp .claude/deployment/templates/vercel/.vercelignore ./
   ```

2. **Install Vercel CLI:**

   ```bash
   npm install -g vercel
   ```

3. **Deploy:**

   ```bash
   # Preview deployment
   vercel

   # Production deployment
   vercel --prod

   # Or use the deployment script
   ./.claude/deployment/scripts/deploy-vercel.sh
   ```

#### Configuration Options

Edit `vercel.json` to configure:

- **Build settings** - Custom build commands
- **Environment variables** - Scoped to environments
- **Headers** - Security headers, caching
- **Redirects/Rewrites** - URL routing
- **Functions** - Serverless function configuration
- **Cron jobs** - Scheduled function execution

#### Environment Variables

Set environment variables in Vercel dashboard or CLI:

```bash
vercel env add NEXT_PUBLIC_API_URL production
vercel env add DATABASE_URL production
```

---

### Netlify

Netlify excels at static sites and JAMstack applications.

#### Quick Start

1. **Copy configuration:**

   ```bash
   cp .claude/deployment/templates/netlify/netlify.toml ./
   ```

2. **Deploy via Git:**

   - Connect your repository to Netlify
   - Netlify auto-deploys on push to main branch

3. **Or deploy via CLI:**

   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

#### Features

- **Build settings** - Configure build commands and output directory
- **Headers** - Security and caching headers
- **Redirects** - URL redirects and SPA fallback
- **Functions** - Netlify Functions for serverless backend
- **Edge Functions** - Deploy logic to the edge
- **Plugins** - Lighthouse, sitemap generation, etc.

#### Netlify Functions

Create functions in `netlify/functions/`:

```javascript
// netlify/functions/hello.js
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World" })
  };
};
```

Access at: `https://yoursite.com/.netlify/functions/hello`

---

### Railway

Railway provides full-stack deployment with databases and services.

#### Quick Start

1. **Copy configuration:**

   ```bash
   cp .claude/deployment/templates/railway/railway.json ./
   ```

2. **Install Railway CLI:**

   ```bash
   npm install -g @railway/cli
   ```

3. **Login and deploy:**

   ```bash
   railway login
   railway init
   railway up
   ```

#### Features

- **Automatic deployments** - Git push to deploy
- **Built-in databases** - PostgreSQL, MySQL, Redis, MongoDB
- **Environment variables** - Managed through dashboard or CLI
- **Health checks** - Automatic service health monitoring
- **Zero-config** - Works out of the box for most frameworks

#### Adding a Database

```bash
# Add PostgreSQL
railway add postgresql

# Add Redis
railway add redis

# Environment variables are automatically injected
```

---

### AWS ECS

AWS Elastic Container Service provides production-grade container orchestration.

#### Quick Start

1. **Prerequisites:**

   - AWS CLI installed and configured
   - Docker installed
   - AWS ECR repository created

2. **Copy templates:**

   ```bash
   cp .claude/deployment/templates/aws/cloudformation.yml ./infrastructure/
   cp .claude/deployment/templates/aws/ecs-task-definition.json ./
   ```

3. **Deploy infrastructure:**

   ```bash
   aws cloudformation create-stack \
     --stack-name my-app-stack \
     --template-body file://infrastructure/cloudformation.yml \
     --parameters ParameterKey=ContainerImage,ParameterValue=123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:latest \
     --capabilities CAPABILITY_IAM
   ```

4. **Deploy application:**

   ```bash
   # Build and push image
   docker build -t my-app:latest .
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789.dkr.ecr.us-east-1.amazonaws.com
   docker tag my-app:latest 123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:latest
   docker push 123456789.dkr.ecr.us-east-1.amazonaws.com/my-app:latest

   # Update ECS service
   aws ecs update-service --cluster my-app-cluster --service my-app-service --force-new-deployment
   ```

#### CloudFormation Template Features

- **VPC and Networking** - Public/private subnets across AZs
- **Application Load Balancer** - HTTP/HTTPS traffic distribution
- **ECS Fargate** - Serverless container execution
- **Auto-scaling** - CPU-based scaling policies
- **CloudWatch Logs** - Centralized logging

#### ECS Task Definition

The task definition includes:
- Container specifications
- Resource limits (CPU/memory)
- Environment variables and secrets
- Health checks
- Volume mounts (EFS support)
- CloudWatch logging

---

### Kubernetes

Kubernetes provides cloud-native container orchestration.

#### Quick Start

1. **Prerequisites:**

   - kubectl installed and configured
   - Access to a Kubernetes cluster (EKS, GKE, AKS, or local)

2. **Copy manifests:**

   ```bash
   mkdir -p k8s
   cp .claude/deployment/templates/kubernetes/*.yaml ./k8s/
   ```

3. **Customize values:**

   Edit the YAML files to set:
   - Image name and tag
   - Resource limits
   - Environment variables
   - Ingress domain

4. **Apply manifests:**

   ```bash
   # Create namespace
   kubectl create namespace production

   # Create secrets
   kubectl create secret generic my-app-secrets \
     --from-literal=database-url="postgresql://..." \
     --from-literal=api-key="..." \
     -n production

   # Apply configurations
   kubectl apply -f k8s/deployment.yaml -n production
   kubectl apply -f k8s/service.yaml -n production
   kubectl apply -f k8s/ingress.yaml -n production
   ```

5. **Verify deployment:**

   ```bash
   kubectl get pods -n production
   kubectl get services -n production
   kubectl get ingress -n production
   ```

#### Kubernetes Resources

**Deployment** (`deployment.yaml`):
- Pod specification with security context
- Resource requests and limits
- Liveness, readiness, and startup probes
- ConfigMaps and Secrets
- Volume mounts
- Pod anti-affinity

**Service** (`service.yaml`):
- LoadBalancer (cloud providers)
- ClusterIP (internal)
- NodePort (development)
- Headless service (StatefulSets)

**Ingress** (`ingress.yaml`):
- NGINX ingress controller support
- TLS/SSL with cert-manager
- Path-based routing
- Security headers
- Rate limiting
- CORS configuration

#### TLS Certificates

The ingress template includes cert-manager integration for automatic TLS:

```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml

# Certificates are automatically provisioned via Let's Encrypt
```

#### Scaling

```bash
# Manual scaling
kubectl scale deployment my-app --replicas=5 -n production

# Horizontal Pod Autoscaler
kubectl autoscale deployment my-app \
  --cpu-percent=70 \
  --min=2 \
  --max=10 \
  -n production
```

---

## Deployment Scripts

### deploy-docker.sh

Automates Docker image building, tagging, pushing, and deployment.

#### Usage

```bash
# Basic usage
./claude/deployment/scripts/deploy-docker.sh

# With custom parameters
APP_NAME=my-app \
VERSION=1.0.0 \
ENVIRONMENT=production \
REGISTRY=123456789.dkr.ecr.us-east-1.amazonaws.com \
./claude/deployment/scripts/deploy-docker.sh

# Deploy to production
APP_NAME=my-app VERSION=1.0.0 DEPLOY=true ./claude/deployment/scripts/deploy-docker.sh
```

#### Environment Variables

- `APP_NAME` - Application name (default: my-app)
- `VERSION` - Image version tag (default: latest)
- `ENVIRONMENT` - Deployment environment (default: production)
- `REGISTRY` - Container registry URL (default: docker.io)
- `REGISTRY_USERNAME` - Registry username
- `REGISTRY_PASSWORD` - Registry password
- `DOCKERFILE` - Dockerfile path (default: Dockerfile)
- `BUILD_CONTEXT` - Build context path (default: .)
- `PLATFORMS` - Target platforms (default: linux/amd64)
- `PUSH` - Push to registry (default: true)
- `DEPLOY` - Deploy after push (default: false)

#### Features

- Multi-registry support (Docker Hub, ECR, GCR, ACR)
- Automatic authentication
- Multi-platform builds (buildx)
- Security scanning with Trivy
- Automatic cleanup

---

### deploy-vercel.sh

Automates Vercel deployment with environment checks.

#### Usage

```bash
# Preview deployment
./claude/deployment/scripts/deploy-vercel.sh

# Production deployment
ENVIRONMENT=production ./claude/deployment/scripts/deploy-vercel.sh

# With custom environment file
BUILD_ENV=.env.staging ENVIRONMENT=staging ./claude/deployment/scripts/deploy-vercel.sh
```

#### Environment Variables

- `ENVIRONMENT` - Target environment (default: production)
- `PROJECT_NAME` - Vercel project name
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `VERCEL_TOKEN` - Vercel authentication token (required)
- `BUILD_ENV` - Environment file to load (default: .env.production)
- `PROMOTE` - Promote preview to production (default: true)

#### Features

- Automatic dependency installation
- Environment variable loading
- Health checks after deployment
- Promotion to production
- Deployment URL output

---

### health-check.sh

Universal health check script for deployed applications.

#### Usage

```bash
# Basic health check
./claude/deployment/scripts/health-check.sh

# Custom URL and endpoint
URL=https://myapp.com HEALTH_ENDPOINT=/api/health ./claude/deployment/scripts/health-check.sh

# Full health check with database and Redis
URL=http://localhost:3000 \
CHECK_DATABASE=true \
CHECK_REDIS=true \
DATABASE_URL="postgresql://..." \
REDIS_URL="redis://..." \
./claude/deployment/scripts/health-check.sh

# Verbose output
VERBOSE=true ./claude/deployment/scripts/health-check.sh
```

#### Environment Variables

- `URL` - Base URL to check (default: http://localhost:3000)
- `HEALTH_ENDPOINT` - Health check path (default: /health)
- `READY_ENDPOINT` - Readiness check path (default: /ready)
- `MAX_RETRIES` - Maximum retry attempts (default: 30)
- `RETRY_INTERVAL` - Seconds between retries (default: 2)
- `TIMEOUT` - Request timeout in seconds (default: 10)
- `CHECK_DATABASE` - Check database connectivity (default: false)
- `CHECK_REDIS` - Check Redis connectivity (default: false)
- `VERBOSE` - Verbose output (default: false)

#### Features

- HTTP health checks with retries
- Database connectivity checks (PostgreSQL, MySQL, MongoDB)
- Redis connectivity checks
- SSL certificate validation
- Performance metrics
- Detailed timing information

---

## Environment Variables

### Common Environment Variables

Most deployment platforms require these environment variables:

```bash
# Application
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Redis
REDIS_URL=redis://host:6379

# API Keys
API_KEY=your-api-key
SECRET_KEY=your-secret-key

# URLs
APP_URL=https://yourapp.com
API_URL=https://api.yourapp.com
```

### Managing Secrets

**Never commit secrets to version control!**

#### Docker

Use Docker secrets or environment files:

```bash
docker run --env-file .env.production my-app:latest
```

#### Kubernetes

Use Kubernetes Secrets:

```bash
kubectl create secret generic my-app-secrets \
  --from-literal=database-url="postgresql://..." \
  --from-literal=api-key="..." \
  -n production
```

#### AWS ECS

Use AWS Secrets Manager:

```json
{
  "secrets": [
    {
      "name": "DATABASE_URL",
      "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789:secret:database-url"
    }
  ]
}
```

#### Vercel/Netlify

Use platform environment variable management:

```bash
vercel env add DATABASE_URL production
netlify env:set DATABASE_URL "postgresql://..."
```

---

## Common Deployment Patterns

### Blue-Green Deployment

Deploy new version alongside old, then switch traffic:

```bash
# Kubernetes
kubectl apply -f deployment-v2.yaml
kubectl set image deployment/my-app app=my-app:v2
kubectl rollout status deployment/my-app
```

### Canary Deployment

Gradually roll out to subset of users:

```yaml
# Kubernetes with Istio
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: my-app
spec:
  http:
  - match:
    - headers:
        user-agent:
          regex: ".*canary.*"
    route:
    - destination:
        host: my-app-v2
  - route:
    - destination:
        host: my-app-v1
      weight: 90
    - destination:
        host: my-app-v2
      weight: 10
```

### Rolling Update

Default Kubernetes strategy:

```bash
kubectl set image deployment/my-app app=my-app:v2
kubectl rollout status deployment/my-app

# Rollback if needed
kubectl rollout undo deployment/my-app
```

### Multi-Region Deployment

Deploy to multiple regions for high availability:

```bash
# AWS CloudFormation
aws cloudformation create-stack --stack-name my-app-us-east-1 --region us-east-1 ...
aws cloudformation create-stack --stack-name my-app-eu-west-1 --region eu-west-1 ...

# Kubernetes (multi-cluster)
kubectl --context=us-east-1 apply -f deployment.yaml
kubectl --context=eu-west-1 apply -f deployment.yaml
```

---

## Troubleshooting

### Docker Issues

**Image build fails:**

```bash
# Clear build cache
docker builder prune -a

# Build without cache
docker build --no-cache -t my-app:latest .

# Check build logs
docker build --progress=plain -t my-app:latest .
```

**Container exits immediately:**

```bash
# Check logs
docker logs container-name

# Run interactively
docker run -it my-app:latest /bin/sh

# Check health
docker inspect --format='{{json .State.Health}}' container-name
```

**Permission denied:**

```bash
# Ensure non-root user has proper permissions
RUN chown -R nodejs:nodejs /app
USER nodejs
```

### Kubernetes Issues

**Pods not starting:**

```bash
# Check pod status
kubectl describe pod pod-name -n namespace

# Check logs
kubectl logs pod-name -n namespace

# Check events
kubectl get events -n namespace --sort-by='.lastTimestamp'
```

**Image pull errors:**

```bash
# Check image pull secrets
kubectl get secrets -n namespace

# Create image pull secret
kubectl create secret docker-registry regcred \
  --docker-server=registry.example.com \
  --docker-username=user \
  --docker-password=password \
  -n namespace
```

**Health checks failing:**

```bash
# Test health endpoint manually
kubectl exec -it pod-name -n namespace -- curl http://localhost:3000/health

# Adjust probe timing
initialDelaySeconds: 30
periodSeconds: 10
timeoutSeconds: 5
failureThreshold: 3
```

### Vercel Issues

**Build fails:**

```bash
# Check build logs in Vercel dashboard
# Or run build locally
npm run build

# Check Node version
node --version  # Should match Vercel's Node version
```

**Environment variables not working:**

```bash
# Verify variables are set
vercel env ls

# For client-side variables, ensure NEXT_PUBLIC_ prefix
NEXT_PUBLIC_API_URL=https://api.example.com
```

### AWS ECS Issues

**Tasks failing to start:**

```bash
# Check task logs
aws logs tail /ecs/my-app --follow

# Describe task
aws ecs describe-tasks --cluster my-app-cluster --tasks task-id

# Check service events
aws ecs describe-services --cluster my-app-cluster --services my-app-service
```

**Load balancer health checks failing:**

- Ensure security groups allow traffic from ALB to tasks
- Verify health check path returns 200
- Check task is listening on correct port

---

## Security Best Practices

### General

1. **Never commit secrets** - Use environment variables and secret managers
2. **Use HTTPS** - Always encrypt data in transit
3. **Implement authentication** - Protect sensitive endpoints
4. **Regular updates** - Keep dependencies and base images updated
5. **Principle of least privilege** - Minimal permissions for services

### Docker Security

```dockerfile
# Use specific versions, not 'latest'
FROM node:20-alpine

# Run as non-root user
RUN addgroup -g 1001 nodejs && adduser -S nodejs -u 1001
USER nodejs

# Read-only root filesystem
securityContext:
  readOnlyRootFilesystem: true

# Drop all capabilities
securityContext:
  capabilities:
    drop:
      - ALL
```

### Kubernetes Security

```yaml
# Network policies
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: my-app-network-policy
spec:
  podSelector:
    matchLabels:
      app: my-app
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: nginx-ingress
    ports:
    - protocol: TCP
      port: 3000

# Pod Security Standards
apiVersion: v1
kind: Namespace
metadata:
  name: production
  labels:
    pod-security.kubernetes.io/enforce: restricted
```

### Cloud Platform Security

- **AWS**: Use IAM roles, not access keys
- **GCP**: Use service accounts with minimal scopes
- **Azure**: Use managed identities
- **Enable MFA** on all cloud accounts
- **Use VPCs** to isolate resources
- **Enable audit logging**

---

## Additional Resources

### Documentation Links

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Railway Documentation](https://docs.railway.app/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)

### Tools

- **Trivy** - Container security scanning
- **Hadolint** - Dockerfile linting
- **k9s** - Kubernetes CLI UI
- **Lens** - Kubernetes IDE
- **Docker Desktop** - Local Docker environment
- **Minikube/Kind** - Local Kubernetes

---

## Support

For issues or questions:

1. Check the troubleshooting section above
2. Review platform-specific documentation
3. Check container/pod logs
4. Verify environment variables are set correctly
5. Test health endpoints manually

---

**Happy Deploying!** 🚀
