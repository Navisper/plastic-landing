import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
    integrations: [tailwind({
        applyBaseStyles: false,
    })],
    site: 'https://plasticapp.com',
    compressHTML: true,
    output: 'static',
});