#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PAINTINGS_DIR = path.join(__dirname, '../../src/gallery/paintings');
const GALLERY_CONFIG = path.join(__dirname, '../../src/gallery/gallery.yaml');

async function renameImages() {
	try {
		// Get all image files
		const files = fs.readdirSync(PAINTINGS_DIR)
			.filter((file) => {
				const ext = path.extname(file).toLowerCase();
				return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
			})
			.sort();

		console.log(`Found ${files.length} images to rename...`);

		const fileMapping = {}; // Old name -> new name mapping

		for (let i = 0; i < files.length; i++) {
			const oldFile = files[i];
			const newFile = `${i + 1}_painting.jpg`;
			const oldPath = path.join(PAINTINGS_DIR, oldFile);
			const newPath = path.join(PAINTINGS_DIR, newFile);

			fs.renameSync(oldPath, newPath);
			fileMapping[oldFile] = newFile;

			console.log(`✅ ${i + 1}/${files.length}: ${oldFile} → ${newFile}`);
		}

		// Update gallery.yaml with new file names
		console.log('\nUpdating gallery.yaml...');
		let galleryContent = fs.readFileSync(GALLERY_CONFIG, 'utf-8');

		for (const [oldName, newName] of Object.entries(fileMapping)) {
			const oldPath = `paintings/${oldName}`;
			const newPath = `paintings/${newName}`;
			galleryContent = galleryContent.replaceAll(oldPath, newPath);
		}

		fs.writeFileSync(GALLERY_CONFIG, galleryContent, 'utf-8');

		console.log('✅ gallery.yaml updated successfully!');
		console.log(`\n✅ All ${files.length} images renamed and catalog updated!`);
	} catch (err) {
		console.error('Error:', err.message);
		process.exit(1);
	}
}

renameImages();
