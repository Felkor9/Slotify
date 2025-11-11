# ---------- STAGE 1: Build ----------
FROM node:20 AS build
WORKDIR /app

# Kopiera package.json + package-lock.json först (för cache)
COPY package*.json ./
RUN npm ci

# Kopiera resten av frontend-koden
COPY . .

# Bygg produktion
RUN npm run build

# ---------- STAGE 2: Serve ----------
FROM nginx:alpine

# Ta bort default Nginx-sida
RUN rm -rf /usr/share/nginx/html/*

# Kopiera din custom Nginx config
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Kopiera byggda filer från stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Exponera porten Nginx lyssnar på
EXPOSE 80

# Starta Nginx i förgrunden
CMD ["nginx", "-g", "daemon off;"]
