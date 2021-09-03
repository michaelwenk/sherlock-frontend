FROM node:15

# Create app directory
WORKDIR /app

# Bundle app source
COPY . .

# install dependencies
RUN npm install --legacy-peer-deps
RUN npm install serve -g
# for production mode
RUN npm run build

EXPOSE 5000
CMD [ "npm", "run", "prod" ]