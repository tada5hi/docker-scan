/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

export type Group = {
    description?: string,
    id: string,
    license?: string,
    name: string,
    path: string,
    virtualPath: string,
    version?: string,
    [key: string]: any
};

export type Image = {
    id: string,
    name: string,
    path: string,
    groupId?: string,
    virtualPath: string,
    [key: string]: any
};

export type ScanResult = {
    groups: Group[],
    images: Image[]
};

export type ScanOptions = {
    path: string,
    groupId?: string,
    virtualPath: string
};
