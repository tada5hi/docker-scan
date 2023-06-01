/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

// eslint-disable-next-line no-shadow
export enum MetaType {
    IMAGE = 'image',
    GROUP = 'group',
}

export enum MetaFileName {
    IMAGE = 'image.json',
    GROUP = 'image-group.json',
}

export type ImageMeta = {
    name: string,
    path: string,
    [key: string]: any
};

export type GroupMeta = {
    id: string,
    name: string,
    [key: string]: any
};
