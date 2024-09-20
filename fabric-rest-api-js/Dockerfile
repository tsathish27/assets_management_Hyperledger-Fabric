FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .

# Add this line to copy the connection-org1.json file to the correct directory
COPY ./organizations/peerOrganizations/org1.example.com/connection-org1.json /usr/src/test-network/organizations/peerOrganizations/org1.example.com/


EXPOSE 3000
CMD [ "node", "app.js" ]
