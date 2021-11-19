FROM node:6 
COPY package.json /src/package.json 
RUN cd /src/; npm install 
COPY . /src 
EXPOSE 3000 
WORKDIR /src 
CMD node index.js

