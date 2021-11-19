FROM node:12
WORKDIR /src
COPY package*.json ./
RUN npm install 
COPY . .
EXPOSE 3000 
CMD node index.js



FROM nginx 
COPY nginx.conf /etc/nginx/nginx.conf


