<p align="center"><img src=".github/assets/logo.svg" width="144" height="144" alt="Docker Scan logo" /></p>
<h1 align="center">Docker Scan</h1>
<p align="center"><strong>Scan filesystem directory for Dockerfiles and create metadata output.</strong></p>
<p align="center">Turn a directory tree into image and group records without contacting a Docker daemon.</p>
<p align="center">
  <a href="https://www.npmjs.com/package/docker-scan"><img src="https://img.shields.io/npm/v/docker-scan" alt="npm version" /></a>
  <a href="https://github.com/tada5hi/docker-scan/actions"><img src="https://img.shields.io/github/actions/workflow/status/tada5hi/docker-scan/main.yml" alt="CI status" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/npm/l/docker-scan" alt="License" /></a>
</p>
<p align="center"><a href="#installation">Installation</a> · <a href="#usage">Usage</a> · <a href="#api">API</a> · <a href="#notes">Notes</a></p>

---

## Why Docker Scan?

Turn a directory tree into image and group records without contacting a Docker daemon.

| Concern | Without it | With it |
|---|---|---|
| Discovery | Write a recursive filesystem walk | Recognize Dockerfile and metadata directories |
| Grouping | Track parent group IDs yourself | Attach nearest group and virtual path |
| Metadata | Load descriptors separately | Read image.json and image-group.json during scanning |

Docker Scan checks image.json first, then image-group.json, then Dockerfile. Images stop recursion; groups and unclassified directories recurse into child directories.

<img src=".github/assets/mechanism.svg" width="960" alt="Docker Scan checks image.json first, then image-group.json, then Dockerfile. Images stop recursion; groups and unclassified directories recurse into child directories." />

**Table of Contents**

- [Why Docker Scan?](#why-docker-scan)
- [Installation](#installation)
- [Usage](#usage)
- [Specification](#specification)
  - [Image](#image)
  - [Group](#group)
  - [Repository fixture example](#repository-fixture-example)
- [Directory metadata](#directory-metadata)
- [API](#api)
- [Notes](#notes)
- [Contributing](#contributing)
- [License](#license)

## Installation

```bash
npm install docker-scan
```

Requires Node `>=20.0.0`. ESM, CommonJS and TypeScript declarations are included. Import the documented package entrypoint rather than undeclared `dist/` paths.

## Usage

```typescript
import { scanDirectory } from 'docker-scan';

const result = await scanDirectory('./images');
for (const image of result.images) {
    console.log(image.id, image.path, image.virtualPath, image.groupId);
}
console.log(result.groups);
```

## Specification

### Image

An image directory contains a `Dockerfile` or `image.json`. The descriptor can replace the Dockerfile for discovery. Image records have the following fields, plus any additional descriptor fields:

| Field | Meaning |
|---|---|
| `id` | Descriptor ID, or the directory name when absent |
| `name` | Descriptor display name, or the directory name when absent |
| `groupId` | ID of the nearest enclosing group, or `undefined` outside a group |
| `path` | Path relative to the scan root, using host-platform separators |
| `virtualPath` | Enclosing group IDs and the image ID joined with `/` |

### Group

`image-group.json` marks a group. Its `id` and `name` fall back to the directory name. Group records include `path` and `virtualPath` but do not receive a scanner-derived `groupId`. Descriptor fields such as `description`, `license` and `version` are preserved. Nested groups extend the virtual path with their IDs; ordinary intermediate directories extend only the filesystem path.

### Repository fixture example

From a repository checkout, run this against the included `test/data` tree. `scanDirectory` is asynchronous, so await it before reading the arrays.

```typescript
import { scanDirectory } from 'docker-scan';

const result = await scanDirectory('test/data');
console.log(JSON.stringify(result, null, 2));
```

The fixture includes an image named `Cool image`, an image with the explicit ID `meta-id`, nested groups and an ungrouped image. The complete output from the included fixture is shown below; filesystem enumeration order is not an API guarantee.

```json
{
  "images": [
    {
      "name": "Cool image",
      "path": "group/image",
      "id": "image",
      "groupId": "group",
      "virtualPath": "group/image"
    },
    {
      "id": "meta-id",
      "name": "MetaId",
      "path": "group/undefined/sub-sub-group/image",
      "groupId": "sub-sub-group",
      "virtualPath": "group/sub-sub-group/meta-id"
    },
    {
      "id": "image",
      "name": "image",
      "virtualPath": "image",
      "path": "image"
    }
  ],
  "groups": [
    {
      "name": "Group",
      "license": "MIT",
      "id": "group",
      "virtualPath": "group",
      "path": "group"
    },
    {
      "name": "SubGroup",
      "id": "sub-group",
      "virtualPath": "group/sub-group",
      "path": "group/sub-group"
    },
    {
      "name": "SubSubGroup",
      "id": "sub-sub-group",
      "virtualPath": "group/sub-sub-group",
      "path": "group/undefined/sub-sub-group"
    }
  ]
}
```

This path uses POSIX separators. Windows uses `\` in filesystem paths (escaped as `\\` in JSON); virtual paths always use `/`. `undefined` in the fixture path is a literal directory name, not a missing value. An ungrouped image has `groupId: undefined` in memory, so JSON serialization omits that field rather than emitting `null`.

## Directory metadata

```text
images/
  services/
    image-group.json
    api/
      Dockerfile
      image.json
```

`image-group.json` can contain `{ "id": "services", "name": "Services" }`. `image.json` can contain `{ "id": "api", "name": "API" }`. Additional descriptor fields are retained in the result, but scanner-derived `path`, `virtualPath` and group association take precedence.

| Input | Meaning |
|---|---|
| `image.json` | Image descriptor; name defaults to directory name |
| `image-group.json` | Group descriptor; ID and name default to directory name |
| `Dockerfile` | Image without a descriptor; ID and name use directory name |
| `ScanOptions.path` | Initial relative filesystem path |
| `ScanOptions.virtualPath` | Initial virtual parent path |
| `ScanOptions.groupId` | Initial parent group ID |

When supplying options, include both `path` and `virtualPath`. Omit the whole object for the default empty prefixes.

## API

All names below are exported from `docker-scan`. Types have no runtime value.

| Export | Kind | Purpose |
|---|---|---|
| `detectMetaTypeOfDirectory` | function | Detect readable image or group descriptors |
| `readImageMeta` | function | Load an image descriptor with default name/path |
| `readGroupMeta` | function | Load a group descriptor with default ID/name |
| `MetaType` | enum | Image and group categories |
| `MetaFileName` | enum | image.json and image-group.json filenames |
| `ImageMeta` | type | Type contract for image meta |
| `GroupMeta` | type | Type contract for group meta |
| `scanDirectory` | function | Discover image and group directories recursively |
| `Group` | type | Type contract for group |
| `Image` | type | Type contract for image |
| `ScanResult` | type | Type contract for scan result |
| `ScanOptions` | type | Type contract for scan options |

## Notes

- **Images are leaves.** Once a directory is recognized as an image, scanning returns that image without traversing its children. Group and ordinary directories are traversed.
- **Descriptor precedence.** A readable `image.json` wins over `image-group.json`; a group descriptor wins over a bare `Dockerfile`. An image descriptor does not require a Dockerfile.
- **Not a Docker validator.** Scanning does not build images, parse Dockerfile instructions or verify that an image can run. Invalid descriptor content or filesystem errors can reject the scan.
- **Options are mutable.** A supplied `ScanOptions` object is updated when a group is encountered. Supply a fresh object for independent calls.
- **Path meaning.** `path` is relative to the scan root, using host separators. `virtualPath` joins group IDs and image IDs with `/`; image IDs fall back to directory names.

## Contributing

Use the verified development commands in [the agent guide](AGENTS.md).

## License

Made with 💚

Published under the [MIT License](LICENSE).
