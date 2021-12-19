/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import fs from "fs";
import path from "path";

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
