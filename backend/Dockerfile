FROM node:20-alpine

WORKDIR /usr/src/app

# Fix DNS + install native build deps
RUN apk update && apk add --no-cache \
    python3 \
    build-base \
    libc6-compat

# Build args
ARG DATABASE_URL
ARG CLOUDINARY_CLOUD_NAME
ARG CLOUDINARY_API_KEY
ARG CLOUDINARY_API_SECRET

ENV DATABASE_URL=$DATABASE_URL
ENV CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME
ENV CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY
ENV CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

RUN npx prisma generate

EXPOSE 3000
CMD ["npm", "run", "dev"]
