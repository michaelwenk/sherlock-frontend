FROM node:16.15-alpine
# Create app directory
WORKDIR /app

# Bundle app source
COPY . .

# install dependencies
RUN npm install --legacy-peer-deps
# for production mode
RUN node ./node_modules/rimraf/bin.js dist && node ./node_modules/typescript/bin/tsc && node --max_old_space_size=8192 ./node_modules/vite/bin/vite.js build

EXPOSE 5000
CMD npm run preview