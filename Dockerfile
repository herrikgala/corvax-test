FROM node:18.16.1
WORKDIR /app

COPY package*.json ./

# Copy the current directory contents into the container at /app
COPY . .

RUN npm install --force

EXPOSE 5173

CMD ["npm", "run", "dev"]