FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --no-audit --progress=false

COPY . .
RUN npm run build


EXPOSE 3000
CMD ["npm", "run", "dev"]