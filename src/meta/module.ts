/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */


import {MetaDocumentPayload, MetaDocument, MetaDocumentType, MetaOptions} from "./type";
import path from "path";
import fs from "fs";
import {MetaImage, MetaGroup} from "../type";

export async function findMetaFile(
    baseDir: string,
    options?: MetaOptions
) {
    options ??= {};

    let content = await readMetaFile(
        baseDir,
        MetaDocument.IMAGE,
        options
    );

    if(typeof content === 'undefined') {
        return await readMetaFile(
            baseDir,
            MetaDocument.GROUP,
            options
        );
    }

    return content;
}

async function readMetaFile<T extends MetaDocumentType>(
    baseDir: string,
    type: T,
    options?: MetaOptions
) : Promise<MetaDocumentPayload<T>|undefined> {
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
    const directoryName: string = directorPath.split(path.sep).pop();

    const rawContent = await fs.promises.readFile(filePath);
    const data: MetaImage | MetaGroup = JSON.parse(rawContent.toString('utf-8'));

    switch (type) {
        case MetaDocument.IMAGE:
            const imageData: MetaImage = data as MetaImage;
            imageData.name ??= baseDir.split(path.sep).pop();
            imageData.path ??= baseDir;

            return {
                type,
                data: data as MetaImage
            } as MetaDocumentPayload<T>;
        case MetaDocument.GROUP:
            const groupData: MetaGroup = data as MetaGroup;
            groupData.id ??= directoryName;
            groupData.name ??= groupData.id;

            return {
                type: MetaDocument.GROUP,
                data: groupData
            } as MetaDocumentPayload<T>;
    }

    /* istanbul ignore next */
    return undefined;
}
