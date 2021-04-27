FROM node:15

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 3001
CMD [ "npm", "start" ]