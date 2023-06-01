/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import fs from 'node:fs';
import path from 'node:path';

export async function isImageDirectory(dirPath: string) {
    try {
        await fs.promises.access(path.join(dirPath, 'Dockerfile'), fs.constants.F_OK | fs.constants.R_OK);
        return true;
    } catch (e) {
        return false;
    }
}

export function extendPath(type: 'fs' | 'virtual', base: string, value: string) : string {
    const separator : string = type === 'fs' ? path.sep : '/';

    return !!base && base.length > 0 ?
        base + separator + value :
        value;
}

export function extractDirectoryName(input: string) {
    const index = input.lastIndexOf(path.sep);
    if (index === -1 || index === input.length - 1) {
        throw new SyntaxError('The directory name could not be extracted.');
    }

    return input.substring(index + 1);
}
