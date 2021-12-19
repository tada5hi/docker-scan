# Docker Scan 💾
This is a library to scan for docker images in a defined directory and associate them to (nested) groups 🔥.

[![npm version](https://badge.fury.io/js/docker-scan.svg)](https://badge.fury.io/js/docker-scan)
[![CI](https://github.com/Tada5hi/docker-scan/actions/workflows/main.yml/badge.svg)](https://github.com/Tada5hi/docker-scan/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/tada5hi/docker-scan/branch/master/graph/badge.svg?token=4A8WTC7XGF)](https://codecov.io/gh/tada5hi/docker-scan)

**Table of Contents**

- [Installation](#installation)
- [Specification](#specification)
  - [Image](#image)
  - [Group](#group)
- [Usage](#usage)

## Installation

```bash
npm install docker-scan --save
```

## Specification

### Image
An image is in most cases represented by a Dockerfile in a directory. In some cases
the image is also described with some meta information by an image descriptor file (`image.json`). But the descriptor file can also be
a replacement for the Dockerfile.

The scan result object has the following 5 base properties:
- `id`
The Identifier is a way to identify the image beside the name property.


- `name`
Like already mentioned in th description for the `id` property.


- `groupId`
The groupId is the directory name of the last group, if not otherwise specified with the id property in an image-group.json file.


- `path`
The path is the relative path on the host machine, with different path separators (windows: `\\`, linux: `/`)
depending on the operating system.


- `virtualPath`
The virtualPath is a path only containing group ids and the own image id, seperated with `/`.

These properties can be extended by providing a `image.json` file in
the same directory as the Dockerfile.

### Group
A group has the same base properties as an image, expect of the **groupId** property. The only other difference
is, that the descriptor file must be named `image-group.json`.

## Usage

To demonstrate the usage of the package, the test data directory path (`test/data`) is used as scan path,
to simplify how to replicate the code example and use it for an own use cases.

```typescript
import {scanDirectory} from "docker-scan";

(async () => {
    // Provide a base directory path to scan
    const directoryPath = 'test/data';

    const scanResult = scanDirectory(directoryPath);

    console.log(scanResult);
});
```
**Output**
```json
{
      "images": [
        {
          "id": "image",
          "name": "Cool image",
          "groupId": "group",
          "path": "group\\image",
          "virtualPath": "group/image"
        },
        {
          "id": "meta-id",
          "name": "MetaId",
          "groupId": "sub-sub-group",
          "path": "group\\undefined\\sub-sub-group\\image",
          "virtualPath": "group/sub-sub-group/meta-id"
        },
        {
          "id": "image",
          "name": "image",
          "groupId": null,
          "path": "image",
          "virtualPath": "image"
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
              "path": "group\\sub-group"
          },
          {
              "name": "SubSubGroup",
              "id": "sub-sub-group",
              "virtualPath": "group/sub-sub-group",
              "path": "group\\undefined\\sub-sub-group"
          }
      ]
    }
```
The above output was captured on a Windows machine. Therefore, the path values are seperated with `\\` instead
of a `/` like on a linux machine.
