/*
 * Copyright (c) 2021.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import {scanDirectory, ScanResult} from "../../src";
import * as path from "path";

describe('src/api/sort.ts', () => {
    it('should scan directory correctly', async () => {
        const directory = await scanDirectory('test/data');

        directory.images = directory.images.sort((a,b) => a.name.localeCompare(b.name));
        directory.groups = directory.groups.sort((a,b) => a.name.localeCompare(b.name));

        expect(directory).toEqual({
            images: [
                {id: 'image', name: 'Cool image', groupId: 'group', path: `group${path.sep}image`, virtualPath: 'group/image'},
                {id: 'image', name: 'image', groupId: undefined, path: 'image', virtualPath: 'image'},
                {id: 'meta-id', name: 'MetaId', groupId: 'sub-sub-group', path: `group${path.sep}undefined${path.sep}sub-sub-group${path.sep}image`, virtualPath: 'group/sub-sub-group/meta-id'}
            ],
            groups: [
                {id: 'group', name: 'Group', license: 'MIT', path: 'group', virtualPath: 'group'},
                {id: 'sub-group', name: 'SubGroup', path: `group${path.sep}sub-group`, virtualPath: 'group/sub-group'},
                {id: 'sub-sub-group', name: 'SubSubGroup', path: `group${path.sep}undefined${path.sep}sub-sub-group`, virtualPath: 'group/sub-sub-group'}
            ]
        } as ScanResult);
    });
});
