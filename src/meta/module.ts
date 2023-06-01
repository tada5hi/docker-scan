/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import path from 'path';
import fs from 'fs';
import type { MetaDocumentPayload, MetaDocumentType, MetaOptions } from './type';
import {
    MetaDocument,
} from './type';
import type { Group, Image } from '../type';

export async function findMetaFile(
    baseDir: string,
    options?: MetaOptions,
) {
    options ??= {};

    const content = await readMetaFile(
        baseDir,
        MetaDocument.IMAGE,
        options,
    );

    if (typeof content === 'undefined') {
        return readMetaFile(
            baseDir,
            MetaDocument.GROUP,
            options,
        );
    }

    return content;
}

async function readMetaFile<T extends MetaDocumentType>(
    baseDir: string,
    type: T,
    options?: MetaOptions,
) : Promise<MetaDocumentPayload<T> | undefined> {
    options ??= {};

    const fileName: string = type === MetaDocument.IMAGE ?
        (options.imageFileName ?? 'image.json') :
        (options.groupFileName ?? 'image-group.json');

    const filePath: string = path.join(baseDir, fileName);

    try {
        await fs.promises.access(filePath);
    } catch (e) {
        return undefined;
    }

    const directorPath: string = path.dirname(filePath);
    const directoryName = directorPath.split(path.sep).pop() as string;

    const rawContent = await fs.promises.readFile(filePath);
    const data: Image | Group = JSON.parse(rawContent.toString('utf-8'));

    switch (type) {
        case MetaDocument.IMAGE: {
            const imageData: Image = data as Image;
            imageData.name ??= baseDir.split(path.sep).pop() as string;
            imageData.path ??= baseDir;

            return {
                type,
                data: data as Image,
            } as MetaDocumentPayload<T>;
        }
        case MetaDocument.GROUP: {
            const groupData: Group = data as Group;
            groupData.id ??= directoryName;
            groupData.name ??= groupData.id;

            return {
                type: MetaDocument.GROUP,
                data: groupData,
            } as MetaDocumentPayload<T>;
        }
    }

    /* istanbul ignore next */
    return undefined;
}
