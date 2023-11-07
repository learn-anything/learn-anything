FROM gitpod/workspace-bun

# Install EdgeDB
RUN curl https://sh.edgedb.com --proto '=https' -sSf1 | sh -s -- -y