FROM node:20-alpine

WORKDIR /usr/src/app

# Accept DATABASE_URL as build arg
ARG DATABASE_URL
ARG CLOUDINARY_CLOUD_NAME
ARG CLOUDINARY_API_KEY
ARG CLOUDINARY_API_SECRET
ENV DATABASE_URL=$DATABASE_URL
ENV CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME
ENV CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY
ENV CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET


# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Generate Prisma client using real DATABASE_URL
RUN npx prisma generate

EXPOSE 3000

# Command will be overridden by docker-compose
CMD ["npm", "run", "dev"]