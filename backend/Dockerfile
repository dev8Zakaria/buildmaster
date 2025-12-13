FROM node:20-alpine

WORKDIR /usr/src/app

# Accept DATABASE_URL as build arg
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Generate Prisma client using real DATABASE_URL
RUN npx prisma generate

EXPOSE 3000

# Command will be overridden by docker-compose
CMD ["npm", "run", "dev"]