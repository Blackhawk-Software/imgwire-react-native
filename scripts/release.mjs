import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const packageJsonPath = resolve(process.cwd(), "package.json");

const command = process.argv[2];

if (!command) {
  printUsageAndExit();
}

if (command === "prepare") {
  const version = process.argv[3];
  prepareRelease(version);
} else if (command === "verify-tag") {
  const tag = process.argv[3];
  verifyTag(tag);
} else {
  printUsageAndExit();
}

function prepareRelease(version) {
  if (!isValidSemver(version)) {
    fail(
      `Invalid version "${version}". Expected semver like 0.2.0 or 1.0.0-beta.1.`
    );
  }

  const packageJson = readJson(packageJsonPath);
  packageJson.version = version;
  writeJson(packageJsonPath, packageJson);

  console.log(`Updated package.json to version ${version}.`);
  console.log("Next steps:");
  console.log("1. Run yarn ci.");
  console.log("2. Review the diff.");
  console.log("3. Commit and push the version bump.");
  console.log(`4. Publish or tag a release for v${version}.`);
}

function verifyTag(tag) {
  if (!tag) {
    fail("Missing release tag. Usage: yarn release:verify-tag v0.1.0");
  }

  const packageJson = readJson(packageJsonPath);
  const expectedTag = `v${packageJson.version}`;

  if (tag !== expectedTag) {
    fail(
      `Release tag ${tag} does not match package.json version ${packageJson.version}. Expected ${expectedTag}.`
    );
  }

  console.log(
    `Release tag ${tag} matches package.json version ${packageJson.version}.`
  );
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function isValidSemver(version) {
  return /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/.test(
    version
  );
}

function printUsageAndExit() {
  console.error("Usage:");
  console.error("  yarn release:prepare <version>");
  console.error("  yarn release:verify-tag <tag>");
  process.exit(1);
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
