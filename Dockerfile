FROM node

# Install zopfli for a better gzip
RUN apt-get update && apt-get install -y zopfli && rm -rf /var/lib/apt/lists/*

# Install rust
RUN set -eux; curl https://sh.rustup.rs -sSf | sh -s -- -y && \
  . ~/.cargo/env && \
  curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh -s

# Build rust dependencies
RUN . ~/.cargo/env && USER=root cargo new --lib --name rl-web /usr/src/rl-web/crate
COPY ./crate/Cargo.toml ./crate/Cargo.lock /usr/src/rl-web/crate/
RUN . ~/.cargo/env && cd /usr/src/rl-web/crate && wasm-pack build --release

WORKDIR /usr/src/rl-web

# Gather js dependencies
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN set -eux; . ~/.cargo/env && \
  npm run build && \
  zopfli dist/*.js dist/*.wasm dist/*.css dist/*.html dist/*.png

FROM nginx:stable-alpine
COPY --from=0 /usr/src/rl-web/dist /usr/share/nginx/html
COPY assets/nginx.conf /etc/nginx/conf.d/default.conf
