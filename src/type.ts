/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {MetaOptions} from "./meta";

export type MetaGroup = {
    id: string,
    name: string,
    version?: string,
    license?: string,
    description?: string
}

export type MetaImage = {
    path: string,
    name: string,
    groupId?: string
};

export type ScanResult = {
    groups: MetaGroup[],
    images: MetaImage[]
}

export type ScanOptions = {
    meta?: MetaOptions,
    path: string,
    groupId?: string
}
