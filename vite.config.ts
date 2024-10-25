import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	css: {
		preprocessorOptions: {
			scss: {
				api: 'modern-compiler'
				// additionalData: `
				// @use '$lib/scss/_variables' as *;
				// @use '$lib/scss/_mixins' as *;
				// `
			},
			sass: {
				quietDeps: true
			}
		}
	},
	plugins: [sveltekit()],
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
