FROM gitpod/workspace-node-lts


# Install bun
ENV BUN_INSTALL="${HOME}/.bun"
ENV PATH="${BUN_INSTALL}/bin:${PATH}"

ENV BUN_VERSION="1.0.8"

RUN curl -fsSL https://bun.sh/install | bash -s "bun-v${BUN_VERSION}"

# Custom bug config for Gitpod
COPY --chown=gitpod:gitpod .bunfig.toml "$HOME"


# Install EdgeDB
RUN curl https://sh.edgedb.com --proto '=https' -sSf1 | sh -s -- -y