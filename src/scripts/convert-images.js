#!/usr/bin/env node
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAW_DIR = path.join(__dirname, '../../pics_raw');
const OUTPUT_DIR = path.join(__dirname, '../../src/gallery/paintings');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function convertImages() {
	try {
		const files = fs.readdirSync(RAW_DIR).filter((file) => {
			const ext = path.extname(file).toLowerCase();
			return ['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.webp'].includes(ext);
		});

		console.log(`Found ${files.length} images to convert...`);

		for (const file of files) {
			const inputPath = path.join(RAW_DIR, file);
			const outputFilename = path.basename(file, path.extname(file)) + '.jpg';
			const outputPath = path.join(OUTPUT_DIR, outputFilename);

			try {
				console.log(`Converting: ${file}...`);

				// Resize so longest edge is max 2400px, keep quality high
				await sharp(inputPath)
					.resize(2400, 2400, {
						fit: 'inside',
						withoutEnlargement: true,
					})
					.jpeg({ quality: 92, progressive: true, mozjpeg: true })
					.toFile(outputPath);

				console.log(`✅ Converted: ${file} → ${outputFilename}`);
			} catch (err) {
				console.error(`❌ Error converting ${file}:`, err.message);
			}
		}

		console.log('\n✅ All images converted successfully!');
		console.log(
			`\nNext steps:\n1. Review images in src/gallery/paintings/\n2. Run: npm run generate\n3. Update gallery.yaml with titles and descriptions`,
		);
	} catch (err) {
		console.error('Error:', err);
		process.exit(1);
	}
}

convertImages();
