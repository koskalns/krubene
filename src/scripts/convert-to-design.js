#!/usr/bin/env node
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const RAW_DIR = path.join(__dirname, '../../pics_raw');
const OUTPUT_DIR = path.join(__dirname, '../../src/gallery/design');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
	fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	console.log(`✅ Created design folder`);
}

async function convertImages() {
	try {
		const files = fs.readdirSync(RAW_DIR).filter((file) => {
			const ext = path.extname(file).toLowerCase();
			return ['.jpg', '.jpeg', '.png', '.tiff', '.tif', '.webp'].includes(ext);
		});

		console.log(`Found ${files.length} images to convert...`);

		let counter = 1;

		for (const file of files) {
			const inputPath = path.join(RAW_DIR, file);
			const outputFilename = `${counter}_design.jpg`;
			const outputPath = path.join(OUTPUT_DIR, outputFilename);

			try {
				console.log(`Converting: ${file} → ${outputFilename}...`);

				// Resize to max 1200px width, optimize quality
				await sharp(inputPath)
					.resize(1200, 800, {
						fit: 'inside',
						withoutEnlargement: true,
					})
					.jpeg({ quality: 85, progressive: true })
					.toFile(outputPath);

				console.log(`✅ Converted: ${outputFilename}`);
				counter++;
			} catch (err) {
				console.error(`❌ Error converting ${file}:`, err.message);
			}
		}

		console.log(`\n✅ All images converted successfully!`);
		console.log(`\nNow run: npm run generate`);
	} catch (err) {
		console.error('Error:', err);
		process.exit(1);
	}
}

convertImages();
