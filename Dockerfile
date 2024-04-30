FROM node:18.16.1
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

RUN npm install --force

EXPOSE 80

CMD ["npm", "run", "dev"]