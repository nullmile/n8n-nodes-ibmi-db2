#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEST_HOME="${N8N_PACKAGED_TEST_HOME:-$HOME/.n8n-packaged-test}"
NODES_DIR="$TEST_HOME/.n8n/nodes"
N8N_PORT="${N8N_PACKAGED_TEST_PORT:-5680}"
BROKER_PORT="${N8N_PACKAGED_TEST_BROKER_PORT:-5681}"

cd "$ROOT_DIR"

echo "Cleaning previous build output..."
rm -rf dist

echo "Building node..."
npm run build

echo "Packing node..."
TARBALL="$(npm pack --silent | tail -n 1)"

echo "Preparing packaged-test profile at $TEST_HOME..."
mkdir -p "$NODES_DIR"
cd "$NODES_DIR"

if [[ ! -f package.json ]]; then
	npm init -y >/dev/null
fi

echo "Installing $TARBALL into packaged-test profile..."
npm install "$ROOT_DIR/$TARBALL"

echo
echo "Starting packaged n8n instance:"
echo "  UI:          http://localhost:$N8N_PORT"
echo "  User folder: $TEST_HOME"
echo

cd "$TEST_HOME"
exec env \
	N8N_USER_FOLDER="$TEST_HOME" \
	N8N_PORT="$N8N_PORT" \
	N8N_RUNNERS_BROKER_PORT="$BROKER_PORT" \
	N8N_RUNNERS_TASK_BROKER_URI="http://127.0.0.1:$BROKER_PORT" \
	npx -y n8n@latest start
