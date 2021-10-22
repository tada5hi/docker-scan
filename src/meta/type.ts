/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {
    Image,
    Group
} from "../type";

export enum MetaDocument {
    IMAGE = 'image',
    GROUP = 'group'
}

export type MetaDocumentType = `${MetaDocument}`;

export type MetaDocumentPayload<T extends MetaDocumentType> = {
    type: T,
    data: T extends 'image' | MetaDocument.IMAGE ? Image : Group
};

export type MetaOptions = {
    imageFileName?: string,
    groupFileName?: string
}

