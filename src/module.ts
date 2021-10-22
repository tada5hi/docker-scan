/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {ScanOptions, ScanResult} from "./type";
import path from "path";
import fs from "fs";
import {findMetaFile, MetaDocument} from "./meta";
import {isImageDirectory} from "./utils";

export async function scanDirectory(dirPath: string, options?: ScanOptions) {
    options ??= {
        path: '',
        groupId: undefined
    };
    options.meta ??= {};

    const response : ScanResult = {
        images: [],
        groups: []
    }

    const metaFile = await findMetaFile(dirPath, options.meta);

    let groupId : string | undefined = options.groupId;

    if(
        typeof metaFile !== 'undefined' &&
        metaFile.type === MetaDocument.GROUP
    ) {
        groupId = metaFile.data.id;
    }

    const isImage = (metaFile && metaFile.type === MetaDocument.IMAGE) || await isImageDirectory(dirPath);
    if(isImage) {
        response.images.push({
            name: metaFile ? metaFile.data.name : dirPath.split(path.sep).pop(),
            groupId,
            path: options.path
        });
    } else {
        const isImageGroup = metaFile && metaFile.type === MetaDocument.GROUP;
        if(isImageGroup) {
            const dirName : string =  dirPath.split(path.sep).pop();

            metaFile.data.id ??= dirName;
            metaFile.data.name ??= dirName;

            groupId ??= metaFile.data.id;

            response.groups.push(metaFile.data);
        }

        const entries = await fs.promises.opendir(dirPath, {encoding: 'utf-8'});
        for await (const dirent of entries) {
            if(!dirent.isDirectory()) {
                continue;
            }

            let newPath : string = options.path === '' ? dirent.name :  options.path + '/' + dirent.name;

            const result = await scanDirectory(path.join(dirPath, dirent.name), {
                ...options,
                path: newPath,
                groupId
            });

            response.images = [...response.images, ...result.images];
            response.groups = [...response.groups, ...result.groups];
        }
    }

    return response;
}
