FROM node:6.10.0

COPY . /var/www

WORKDIR /var/www/consensus-backend/server

RUN cd /var/www/consensus-backend/server

 
RUN npm install

RUN npm install jwks-rsa


EXPOSE 3001

ENTRYPOINT ["npm", "start"]
