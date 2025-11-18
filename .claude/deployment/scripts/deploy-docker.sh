#!/bin/bash

# ==============================================================================
# Docker Deployment Script
# ==============================================================================
# This script automates Docker image building, tagging, pushing, and deployment
# Supports Docker Hub, AWS ECR, Google Container Registry, and private registries
# ==============================================================================

set -e  # Exit on error
set -u  # Exit on undefined variable
set -o pipefail  # Exit on pipe failure

# ------------------------------------------------------------------------------
# Configuration
# ------------------------------------------------------------------------------
APP_NAME="${APP_NAME:-my-app}"
VERSION="${VERSION:-latest}"
ENVIRONMENT="${ENVIRONMENT:-production}"
REGISTRY="${REGISTRY:-docker.io}"
REGISTRY_USERNAME="${REGISTRY_USERNAME:-}"
DOCKERFILE="${DOCKERFILE:-Dockerfile}"
BUILD_CONTEXT="${BUILD_CONTEXT:-.}"
PLATFORMS="${PLATFORMS:-linux/amd64}"
PUSH="${PUSH:-true}"
DEPLOY="${DEPLOY:-false}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ------------------------------------------------------------------------------
# Helper Functions
# ------------------------------------------------------------------------------

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

check_command() {
    if ! command -v "$1" &> /dev/null; then
        error "$1 is required but not installed. Please install $1."
        exit 1
    fi
}

# ------------------------------------------------------------------------------
# Validation
# ------------------------------------------------------------------------------

validate_environment() {
    log "Validating environment..."

    check_command docker

    if [ ! -f "$DOCKERFILE" ]; then
        error "Dockerfile not found: $DOCKERFILE"
        exit 1
    fi

    if [ -z "$APP_NAME" ]; then
        error "APP_NAME is required"
        exit 1
    fi

    success "Environment validation complete"
}

# ------------------------------------------------------------------------------
# Registry Authentication
# ------------------------------------------------------------------------------

authenticate_registry() {
    log "Authenticating with registry: $REGISTRY"

    case "$REGISTRY" in
        *ecr.*.amazonaws.com*)
            check_command aws
            AWS_REGION=$(echo "$REGISTRY" | cut -d. -f4)
            log "Logging into AWS ECR in region $AWS_REGION..."
            aws ecr get-login-password --region "$AWS_REGION" | \
                docker login --username AWS --password-stdin "$REGISTRY"
            ;;

        *gcr.io*)
            check_command gcloud
            log "Logging into Google Container Registry..."
            gcloud auth configure-docker
            ;;

        *azurecr.io*)
            check_command az
            log "Logging into Azure Container Registry..."
            az acr login --name "$(echo "$REGISTRY" | cut -d. -f1)"
            ;;

        docker.io|"")
            if [ -n "$REGISTRY_USERNAME" ]; then
                log "Logging into Docker Hub..."
                echo "$REGISTRY_PASSWORD" | docker login -u "$REGISTRY_USERNAME" --password-stdin
            fi
            ;;

        *)
            if [ -n "$REGISTRY_USERNAME" ]; then
                log "Logging into private registry..."
                echo "$REGISTRY_PASSWORD" | docker login "$REGISTRY" -u "$REGISTRY_USERNAME" --password-stdin
            fi
            ;;
    esac

    success "Registry authentication complete"
}

# ------------------------------------------------------------------------------
# Build Image
# ------------------------------------------------------------------------------

build_image() {
    log "Building Docker image..."

    # Generate image tags
    IMAGE_TAG="${REGISTRY}/${APP_NAME}:${VERSION}"
    IMAGE_TAG_LATEST="${REGISTRY}/${APP_NAME}:latest"
    IMAGE_TAG_ENV="${REGISTRY}/${APP_NAME}:${ENVIRONMENT}"

    log "Image tag: $IMAGE_TAG"

    # Build arguments
    BUILD_ARGS=(
        --file "$DOCKERFILE"
        --tag "$IMAGE_TAG"
        --tag "$IMAGE_TAG_LATEST"
        --tag "$IMAGE_TAG_ENV"
        --build-arg "NODE_ENV=$ENVIRONMENT"
        --build-arg "VERSION=$VERSION"
        --build-arg "BUILD_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
        --label "version=$VERSION"
        --label "environment=$ENVIRONMENT"
    )

    # Multi-platform build if specified
    if [ "$PLATFORMS" != "linux/amd64" ]; then
        check_command docker-buildx
        log "Building for platforms: $PLATFORMS"
        docker buildx build \
            "${BUILD_ARGS[@]}" \
            --platform "$PLATFORMS" \
            ${PUSH:+--push} \
            "$BUILD_CONTEXT"
    else
        docker build "${BUILD_ARGS[@]}" "$BUILD_CONTEXT"
    fi

    success "Docker image built successfully"
}

# ------------------------------------------------------------------------------
# Security Scan
# ------------------------------------------------------------------------------

scan_image() {
    log "Scanning image for vulnerabilities..."

    if command -v trivy &> /dev/null; then
        trivy image --severity HIGH,CRITICAL "$IMAGE_TAG" || warning "Vulnerabilities found"
    elif command -v docker &> /dev/null && docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy --version &> /dev/null; then
        docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
            aquasec/trivy image --severity HIGH,CRITICAL "$IMAGE_TAG" || warning "Vulnerabilities found"
    else
        warning "Trivy not available, skipping security scan"
    fi
}

# ------------------------------------------------------------------------------
# Push Image
# ------------------------------------------------------------------------------

push_image() {
    if [ "$PUSH" = "true" ]; then
        log "Pushing Docker image to registry..."

        docker push "$IMAGE_TAG"
        docker push "$IMAGE_TAG_LATEST"
        docker push "$IMAGE_TAG_ENV"

        success "Docker image pushed successfully"
    else
        log "Skipping push (PUSH=false)"
    fi
}

# ------------------------------------------------------------------------------
# Deploy
# ------------------------------------------------------------------------------

deploy_image() {
    if [ "$DEPLOY" = "true" ]; then
        log "Deploying application..."

        if [ -f "docker-compose.yml" ]; then
            log "Using Docker Compose for deployment..."
            docker-compose pull
            docker-compose up -d
        elif command -v kubectl &> /dev/null; then
            log "Using Kubernetes for deployment..."
            kubectl set image deployment/"$APP_NAME" "$APP_NAME=$IMAGE_TAG"
            kubectl rollout status deployment/"$APP_NAME"
        else
            log "Running container with docker run..."
            docker stop "$APP_NAME" 2>/dev/null || true
            docker rm "$APP_NAME" 2>/dev/null || true
            docker run -d \
                --name "$APP_NAME" \
                --restart unless-stopped \
                -p 3000:3000 \
                "$IMAGE_TAG"
        fi

        success "Deployment complete"
    else
        log "Skipping deployment (DEPLOY=false)"
    fi
}

# ------------------------------------------------------------------------------
# Cleanup
# ------------------------------------------------------------------------------

cleanup() {
    log "Cleaning up dangling images..."
    docker image prune -f
    success "Cleanup complete"
}

# ------------------------------------------------------------------------------
# Main
# ------------------------------------------------------------------------------

main() {
    log "Starting Docker deployment script"
    log "App: $APP_NAME | Version: $VERSION | Environment: $ENVIRONMENT"

    validate_environment
    authenticate_registry
    build_image
    scan_image
    push_image
    deploy_image
    cleanup

    success "Docker deployment completed successfully!"
    log "Image: $IMAGE_TAG"
}

# ------------------------------------------------------------------------------
# Execute
# ------------------------------------------------------------------------------

main "$@"
