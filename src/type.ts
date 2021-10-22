/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {MetaOptions} from "./meta";

export type Group = {
    id: string,
    name: string,
    version?: string,
    license?: string,
    description?: string
}

export type Image = {
    path: string,
    name: string,
    groupId?: string
};

export type ScanResult = {
    groups: Group[],
    images: Image[]
}

export type ScanOptions = {
    meta?: MetaOptions,
    path: string,
    groupId?: string
}
