import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://krubene.pages.dev',
	vite: {
		plugins: [tailwindcss()],
	},
});
