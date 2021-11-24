FROM node:latest
WORKDIR /app/src
COPY package*.json ./
RUN npm install 
COPY . .
# EXPOSE 3000 


# FROM nginx 
# COPY nginx/nginx.conf /etc/nginx/nginx.conf


CMD node server.js


