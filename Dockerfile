# FROM docker.io/node:16.15.0-alpine # Last known working alpine image

# RedHat Image Catalog references
# https://catalog.redhat.com/software/containers/ubi9/nodejs-18/62e8e7ed22d1d3c2dfe2ca01
# https://catalog.redhat.com/software/containers/ubi8/nodejs-16/615aee9fc739c0a4123a87e1
# https://catalog.redhat.com/software/containers/ubi9/nodejs-18-minimal/62e8e919d4f57d92a9dee838

#
# Build the application
#
FROM registry.access.redhat.com/ubi9/nodejs-18:1-48 as application

ENV NO_UPDATE_NOTIFIER=true

USER 0
COPY --chown=1001:0 app /tmp/src/app
WORKDIR /tmp/src/app
USER 1001
RUN npm ci --omit=dev

#
# Build the frontend
#
FROM registry.access.redhat.com/ubi8/nodejs-16:1-105.1684740145 as frontend

ENV NO_UPDATE_NOTIFIER=true
USER 0
COPY --chown=1001:0 app/frontend /tmp/src/app/frontend

WORKDIR /tmp/src/app/frontend
USER 1001

RUN npm ci && npm run build

#
# Create the final container image
#
FROM registry.access.redhat.com/ubi9/nodejs-18-minimal:1-51

ENV APP_PORT=8080 \
    NO_UPDATE_NOTIFIER=true

COPY --from=application /tmp/src/app ${HOME}
COPY --from=frontend /tmp/src/app/frontend/dist ${HOME}/frontend/dist
COPY .git ${HOME}/.git
WORKDIR ${HOME}

EXPOSE ${APP_PORT}
CMD ["npm", "run", "start"]
