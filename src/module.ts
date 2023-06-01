/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import path from 'path';
import fs from 'fs';
import type { Image, ScanOptions, ScanResult } from './type';
import { MetaDocument, findMetaFile } from './meta';
import { extendPath, isImageDirectory } from './utils';

export async function scanDirectory(dirPath: string, options?: ScanOptions) {
    options ??= {
        groupId: undefined,
        path: '',
        virtualPath: '',
    };

    options.meta ??= {};

    const response : ScanResult = {
        images: [],
        groups: [],
    };

    const metaFile = await findMetaFile(dirPath, options.meta);

    const dirName: string = dirPath.split(path.sep).pop() || 'unknown';

    const isImage = (metaFile && metaFile.type === MetaDocument.IMAGE) || await isImageDirectory(dirPath);
    if (isImage) {
        const image : Image = {
            id: metaFile ? metaFile.data.id ?? dirName : dirName,
            name: metaFile ? metaFile.data.name : dirName,
            groupId: options.groupId,
            path: options.path,
            virtualPath: options.virtualPath,
        };

        image.virtualPath = extendPath('virtual', image.virtualPath, image.id);

        response.images.push(image);

        return response;
    }

    const isImageGroup = metaFile && metaFile.type === MetaDocument.GROUP;
    if (isImageGroup) {
        metaFile.data.id ??= dirName;
        metaFile.data.name ??= dirName;
        metaFile.data.virtualPath = extendPath('virtual', options.virtualPath, metaFile.data.id);
        metaFile.data.path = options.path;

        response.groups.push(metaFile.data);

        options.virtualPath = metaFile.data.virtualPath;
    }

    const entries = await fs.promises.opendir(dirPath, { encoding: 'utf-8' });
    // eslint-disable-next-line no-restricted-syntax
    for await (const dirent of entries) {
        if (!dirent.isDirectory()) {
            // eslint-disable-next-line no-continue
            continue;
        }

        const result = await scanDirectory(path.join(dirPath, dirent.name), {
            ...options,
            path: extendPath('fs', options.path, dirent.name),
            virtualPath: options.virtualPath,
            groupId: isImageGroup ? metaFile.data.id : options.groupId,
        });

        response.images = [...response.images, ...result.images];
        response.groups = [...response.groups, ...result.groups];
    }

    return response;
}
