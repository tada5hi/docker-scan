/*
 * Copyright (c) 2023.
 * Author Peter Placzek (tada5hi)
 * For the full copyright and license information,
 * view the LICENSE file that was distributed with this source code.
 */

import path from "node:path";
import {extractDirectoryName} from "../../src/utils";

describe('src/utils', () => {
    it('should extract directory name', () => {
        let name = extractDirectoryName('test' + path.sep + 'data');
        expect(name).toEqual('data');

        try {
            extractDirectoryName('foo');
            expect(true).toBeFalsy()
        } catch (e) {
            expect(true).toBeTruthy()
        }
    })
})
