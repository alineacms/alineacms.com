#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGE_JSON_PATH="${ROOT_DIR}/package.json"
REPO_URL="https://github.com/alineacms/alinea.git"
TARGET_PATH="${ROOT_DIR}/.cache/alinea"

if [[ ! -f "${PACKAGE_JSON_PATH}" ]]; then
  echo "Missing file: ${PACKAGE_JSON_PATH}" >&2
  exit 1
fi

read_package_value() {
  node --input-type=module -e '
    import fs from "node:fs";
    const [, packagePath, key] = process.argv;
    const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
    const value =
      pkg.dependencies?.[key] ??
      pkg.devDependencies?.[key] ??
      "";
    if (!value || typeof value !== "string") process.exit(2);
    process.stdout.write(value);
  ' "${PACKAGE_JSON_PATH}" "$1"
}

VERSION_SPEC="$(read_package_value alinea || true)"

if [[ -z "${VERSION_SPEC}" ]]; then
  echo "Could not resolve \"alinea\" version from package.json dependencies/devDependencies" >&2
  exit 1
fi

REF_NAME="$(node --input-type=module -e '
  const spec = process.argv[1].trim();
  const match = spec.match(/(\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?)/);
  if (!match) process.exit(2);
  process.stdout.write(`v${match[1]}`);
' "${VERSION_SPEC}" || true)"

if [[ -z "${REF_NAME}" ]]; then
  echo "Unsupported alinea version spec in package.json: ${VERSION_SPEC}" >&2
  exit 1
fi

mkdir -p "$(dirname "${TARGET_PATH}")"

if [[ ! -d "${TARGET_PATH}/.git" ]]; then
  rm -rf "${TARGET_PATH}"
  git clone --filter=blob:none "${REPO_URL}" "${TARGET_PATH}" >&2
fi

git -C "${TARGET_PATH}" remote set-url origin "${REPO_URL}" >&2
git -C "${TARGET_PATH}" fetch --tags --prune origin >&2

if git -C "${TARGET_PATH}" rev-parse --verify --quiet "refs/tags/${REF_NAME}" >/dev/null; then
  RESOLVED_REF="refs/tags/${REF_NAME}"
else
  RESOLVED_REF="${REF_NAME}"
fi

TARGET_OID="$(git -C "${TARGET_PATH}" rev-parse "${RESOLVED_REF}")"
CURRENT_OID="$(git -C "${TARGET_PATH}" rev-parse HEAD)"

if [[ "${TARGET_OID}" != "${CURRENT_OID}" ]]; then
  git -C "${TARGET_PATH}" checkout --detach -q "${TARGET_OID}" >&2
fi

printf '%s\n' "${TARGET_PATH}"
