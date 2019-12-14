FROM node

# Install zopfli for a better gzip and sponge from moreutils
RUN apt-get update && apt-get install -y moreutils zopfli && rm -rf /var/lib/apt/lists/*

# Install wasm-opt
RUN set -eux; curl -O -L "https://github.com/WebAssembly/binaryen/releases/download/1.39.1/binaryen-1.39.1-x86_64-linux.tar.gz" && \
    tar -xzf binaryen*.tar.gz && \
    rm binaryen*.tar.gz && \
    mv binaryen-*/wasm-opt /usr/bin/.

# Install rust
RUN set -eux; curl https://sh.rustup.rs -sSf | sh -s -- -y && \
  . ~/.cargo/env && \
  curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh -s

# Build rust dependencies
COPY ./crate /usr/src/rl-web
RUN . ~/.cargo/env && cd /usr/src/rl-web && wasm-pack build --release

WORKDIR /usr/src/rl-web

# Gather js dependencies
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN set -eux; . ~/.cargo/env && \
  npm run build && \
  wasm-opt -Oz -o - dist/*.wasm | sponge dist/*.wasm && \
  zopfli dist/*.js dist/*.wasm dist/*.css dist/*.html dist/*.png

FROM nginx:stable-alpine
COPY --from=0 /usr/src/rl-web/dist /usr/share/nginx/html
COPY assets/nginx.conf /etc/nginx/conf.d/default.conf
