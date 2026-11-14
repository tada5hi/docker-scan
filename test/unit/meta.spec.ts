import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { readGroupMeta, readImageMeta } from '../../src/meta';

describe.each([
    { fileName: 'image.json', read: readImageMeta },
    { fileName: 'image-group.json', read: readGroupMeta },
])('$fileName', ({ fileName, read }) => {
    let directory: string;

    beforeEach(async () => {
        directory = await fs.mkdtemp(path.join(os.tmpdir(), 'docker-scan-meta-'));
    });

    afterEach(async () => {
        await fs.rm(directory, { recursive: true, force: true });
    });

    it('preserves metadata fields', async () => {
        const content = { id: 'custom', name: 'Custom', path: 'custom/path', license: 'MIT' };
        await fs.writeFile(path.join(directory, fileName), JSON.stringify(content));

        expect(await read(directory)).toMatchObject(content);
    });

    it('uses defaults for an empty object', async () => {
        await fs.writeFile(path.join(directory, fileName), '{}');

        const content = await read(directory);
        expect(content.name).toBe(path.basename(directory));
        if (fileName === 'image.json') {
            expect(content.path).toBe(directory);
        } else {
            expect(content.id).toBe(path.basename(directory));
        }
    });

    it.each(['null', '[]', '"text"', '42', 'true'])('rejects non-object JSON: %s', async (content) => {
        await fs.writeFile(path.join(directory, fileName), content);

        await expect(read(directory)).rejects.toThrow('The file content could not be read.');
    });

    it('rejects malformed JSON', async () => {
        await fs.writeFile(path.join(directory, fileName), '{');

        await expect(read(directory)).rejects.toThrow(SyntaxError);
    });

    it('propagates file read errors', async () => {
        await expect(read(directory)).rejects.toMatchObject({ code: 'ENOENT' });
    });
});
