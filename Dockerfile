# Stage 1: Downloader
FROM alpine:3.20 AS downloader
ARG PB_VERSION=0.36.1
RUN apk add --no-cache curl unzip ca-certificates
WORKDIR /tmp/pb
RUN curl -fsSL -o pocketbase.zip "https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip" \
    && unzip pocketbase.zip \
    && chmod +x pocketbase

# Stage 2: Final Image
FROM alpine:3.20
RUN apk add --no-cache ca-certificates tini wget su-exec && update-ca-certificates

# Create a non-root user
RUN addgroup -S pocketbase && adduser -S -G pocketbase -u 65532 pocketbase

# Set the working directory to /app
WORKDIR /app

# Copy the binary
COPY --from=downloader /tmp/pb/pocketbase /usr/local/bin/pocketbase

# Copy the entrypoint script
COPY ./entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

# IMPORTANT: Copy hooks and migrations with proper ownership
# This ensures the 'pocketbase' user can actually read and execute them
COPY --chown=pocketbase:pocketbase ./pb_migrations ./pb_migrations
COPY --chown=pocketbase:pocketbase ./pb_hooks ./pb_hooks

ENV PORT=8080
ENV DATA_DIR=/app/pb_data

EXPOSE 8080

# Start with tini to handle signals correctly
ENTRYPOINT ["/sbin/tini", "--", "/usr/local/bin/entrypoint.sh"]
