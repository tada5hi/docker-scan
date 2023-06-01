/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import path from 'node:path';
import fs from 'node:fs';
import { distinctArray, merge } from 'smob';
import type {
    Group, Image, ScanOptions, ScanResult,
} from './type';
import {
    MetaType, detectMetaTypeOfDirectory, readGroupMeta, readImageMeta,
} from './meta';
import { extendPath, extractDirectoryName, isImageDirectory } from './utils';

export async function scanDirectory(
    directoryPath: string,
    options?: ScanOptions,
) {
    options ??= {
        groupId: undefined,
        path: '',
        virtualPath: '',
    };

    const response : ScanResult = {
        images: [],
        groups: [],
    };

    const type = await detectMetaTypeOfDirectory(directoryPath);
    if (type === MetaType.GROUP) {
        const meta = await readGroupMeta(directoryPath);
        const group : Group = {
            ...meta,
            virtualPath: extendPath('virtual', options.virtualPath, meta.id),
            path: options.path,
        };

        response.groups.push(group);

        options.groupId = group.id;
        options.virtualPath = group.virtualPath;
    } else if (type === MetaType.IMAGE) {
        const meta = await readImageMeta(directoryPath);
        const image : Image = {
            ...meta,
            id: meta.id || extractDirectoryName(directoryPath),
            groupId: options.groupId,
            virtualPath: options.virtualPath,
            path: options.path,
        };
        image.virtualPath = extendPath('virtual', image.virtualPath, image.id);

        response.images.push(image);

        return response;
    } else if (await isImageDirectory(directoryPath)) {
        const id = extractDirectoryName(directoryPath);

        response.images.push({
            id,
            name: id,
            groupId: options.groupId,
            virtualPath: extendPath('virtual', options.virtualPath, id),
            path: options.path,
        });

        return response;
    }

    const entries = await fs.promises.opendir(directoryPath, { encoding: 'utf-8' });

    // eslint-disable-next-line no-restricted-syntax
    for await (const dirent of entries) {
        if (!dirent.isDirectory()) {
            // eslint-disable-next-line no-continue
            continue;
        }

        const result = await scanDirectory(path.join(directoryPath, dirent.name), {
            ...options,
            path: extendPath('fs', options.path, dirent.name),
            virtualPath: options.virtualPath,
            groupId: options.groupId,
        });

        response.images = merge(response.images, result.images);
        response.groups = merge(response.groups, result.groups);
    }

    response.images = distinctArray(response.images);
    response.groups = distinctArray(response.groups);

    return response;
}
