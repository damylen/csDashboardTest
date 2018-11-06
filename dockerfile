FROM node:8 as builder
COPY . .
RUN yarn global add @vue/cli
# RUN yarn global add typescript
WORKDIR /packages/maatregelen-importer
RUN yarn
RUN yarn build
WORKDIR /
RUN yarn
RUN yarn build

FROM node:8-slim
RUN mkdir /client
RUN mkdir -p /server/server/node_modules
RUN mkdir -p /server/server/static
RUN mkdir -p /maatregelen-importer/node_modules
COPY --from=builder ./packages/maatregelen-importer/dist /maatregelen-importer
COPY --from=builder ./packages/maatregelen-importer/node_modules /maatregelen-importer/node_modules
COPY --from=builder ./packages/dashboard/dist /client
COPY --from=builder ./packages/server/node_modules /server/node_modules
COPY --from=builder ./packages/server/static /server/static
COPY --from=builder ./packages/server/dist /server
COPY --from=builder ./run.sh ./run.sh
RUN yarn global add http-server
RUN ["chmod", "+x", "./run.sh"]
EXPOSE 8080 3000
CMD ./run.sh
