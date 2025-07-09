# 1. Build React với .env.production
FROM node:18 AS build
WORKDIR /app

# Copy mã nguồn và .env.production
COPY package*.json ./
COPY .env.production ./
RUN npm install

COPY . ./
RUN npm run build

# 2. NGINX để serve build
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
