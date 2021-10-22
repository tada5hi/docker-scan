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
        await fs.promises.access(path.join(dirPath, 'Dockerfile'), fs.constants.R_OK);
        return true;
    } catch (e) {
        return false;
    }
}
