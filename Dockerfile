# Use the official Node.js runtime as the base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml for dependency installation
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm run build

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mastra -u 1001

# Change ownership of the app directory to the nodejs user
RUN chown -R mastra:nodejs /app

# Switch to the non-root user
USER mastra

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["pnpm", "start"]
