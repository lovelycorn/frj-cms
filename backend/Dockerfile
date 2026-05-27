ARG NODE_IMAGE=node:20-alpine
ARG NPM_REGISTRY=https://registry.npmjs.org

FROM ${NODE_IMAGE} AS deps
ARG NPM_REGISTRY
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm config set registry ${NPM_REGISTRY} && npm ci

FROM ${NODE_IMAGE} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app .
EXPOSE 1337
CMD ["npm", "run", "start"]
