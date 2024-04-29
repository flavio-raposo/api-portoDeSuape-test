# Use the official Node.js LTS image as the base image
FROM node:lts
# FROM arm64v8/node:lts

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3030

# Command to run the application
CMD ["node", "index.js"]