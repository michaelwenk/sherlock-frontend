FROM node:16.13.1-alpine

# Create app directory
WORKDIR /app

# Bundle app source
COPY . .

# install dependencies
RUN npm install --legacy-peer-deps
# for production mode
RUN npm run build

EXPOSE 5000
CMD npm run preview