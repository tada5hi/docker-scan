import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: [
            'test/unit/**/*.{js,jsx,ts,tsx}',
            'test/**/*.{test,spec}.{js,jsx,ts,tsx}',
        ],
        exclude: ['**/node_modules/**', '**/dist/**', 'test/unit/mock-util.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov', 'clover', 'json'],
            reportsDirectory: 'writable/coverage',
            include: [
                'src/**/*.{ts,tsx,js,jsx}',
            ],
            exclude: [
                'src/**/*.d.ts',
                'src/api/index.ts',
                'src/api/utils/**/*.{ts,js}',
                'src/cli/**/*.{ts,js}',
                'src/database/**/*.{ts,js}',
                'src/utils/**/*.{ts,js}',
                'src/seeder/**/*.{ts,js}',
            ],
            thresholds: {
                branches: 80,
                functions: 80,
                lines: 80,
                statements: 80,
            },
        },
    },
});
