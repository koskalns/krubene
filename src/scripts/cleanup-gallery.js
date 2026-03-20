#!/usr/bin/env node
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GALLERY_CONFIG = path.join(__dirname, '../../src/gallery/gallery.yaml');
const GALLERY_DIR = path.join(__dirname, '../../src/gallery');

async function cleanupGallery() {
	try {
		// Read gallery.yaml
		const galleryContent = fs.readFileSync(GALLERY_CONFIG, 'utf-8');
		const gallery = yaml.load(galleryContent);

		console.log(`Found ${gallery.images.length} image entries in gallery.yaml`);

		// Filter to only keep entries where files exist
		const validImages = [];
		const removedImages = [];

		for (const image of gallery.images) {
			const filePath = path.join(GALLERY_DIR, image.path);
			if (fs.existsSync(filePath)) {
				validImages.push(image);
			} else {
				removedImages.push(image.path);
			}
		}

		console.log(`\n✅ Valid images: ${validImages.length}`);
		console.log(`❌ Removed missing images: ${removedImages.length}`);

		if (removedImages.length > 0) {
			console.log('\nRemoved entries:');
			removedImages.forEach((p) => console.log(`  - ${p}`));
		}

		// Update gallery with only valid images
		gallery.images = validImages;

		// Write back to file
		const cleanedYaml = yaml.dump(gallery, {
			indent: 2,
			lineWidth: -1,
		});

		fs.writeFileSync(GALLERY_CONFIG, cleanedYaml, 'utf-8');

		console.log(`\n✅ gallery.yaml cleaned! Now has ${validImages.length} images.`);
	} catch (err) {
		console.error('Error:', err.message);
		process.exit(1);
	}
}

cleanupGallery();
