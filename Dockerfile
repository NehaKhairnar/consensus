FROM node:latest

#RUN git clone https://github.com/akveo/ng2-admin.git /var/www \
COPY . /var/www

WORKDIR /var/www

RUN cd /var/www \

    #&& npm install --global rimraf \
    #&& npm run clean \
    #&& npm install --global webpack webpack-dev-server typescript@beta \
    && npm install
    #&& npm run prebuild:prod && npm run build:prod
    # && npm run build:prod:aot

EXPOSE 4200

ENTRYPOINT ["npm", "start"]
