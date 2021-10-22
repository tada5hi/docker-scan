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
        const directory = await scanDirectory(path.join(__dirname, '..', 'data'));

        expect(directory).toEqual({
            images: [
                {name: 'Cool image', groupId: 'group', path: 'group/image'},
                {name: 'image', groupId: undefined, path: 'image'}
            ],
            groups: [
                {name: 'Group', license: 'MIT', id: 'group'}
            ]
        } as ScanResult);
    });
});
