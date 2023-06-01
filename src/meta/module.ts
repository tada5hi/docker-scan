/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import { isObject, load } from 'locter';
import path from 'node:path';
import fs from 'node:fs';
import { extractDirectoryName } from '../utils';
import type {
    GroupMeta,
    ImageMeta,
} from './type';
import {
    MetaFileName,
    MetaType,
} from './type';

async function loadJSONRecord(filePath: string) {
    const content = await load(filePath);
    /* istanbul ignore next */
    if (!isObject(content)) {
        throw new Error('The file content could not be read.');
    }

    return content;
}

export async function detectMetaTypeOfDirectory(
    directory: string,
): Promise<`${MetaType}` | undefined> {
    try {
        await fs.promises.access(
            path.join(directory, MetaFileName.IMAGE),
            fs.constants.F_OK | fs.constants.R_OK,
        );

        return MetaType.IMAGE;
    } catch (e) {
        // don't do anything
    }

    try {
        await fs.promises.access(
            path.join(directory, MetaFileName.GROUP),
            fs.constants.F_OK | fs.constants.R_OK,
        );

        return MetaType.GROUP;
    } catch (e) {
        // don't do anything
    }

    return undefined;
}

export async function readImageMeta(directory: string) : Promise<ImageMeta> {
    const content = await loadJSONRecord(
        path.join(directory, MetaFileName.IMAGE),
    );

    return {
        ...content,
        name: content.name || extractDirectoryName(directory),
        path: content.path || directory,
    };
}

export async function readGroupMeta(directory: string) : Promise<GroupMeta> {
    const content = await loadJSONRecord(
        path.join(directory, MetaFileName.GROUP),
    );

    return {
        ...content,
        id: content.id || extractDirectoryName(directory),
        name: content.name || extractDirectoryName(directory),
    };
}
