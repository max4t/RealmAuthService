FROM node:alpine

USER node
WORKDIR /app

EXPOSE 8080

CMD ["npm", "start"]
