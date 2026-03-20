#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DESIGN_DIR = path.join(__dirname, '../../src/gallery/design');
const AQUARELLS_DIR = path.join(__dirname, '../../src/gallery/aquarells');
const GALLERY_CONFIG = path.join(__dirname, '../../src/gallery/gallery.yaml');

async function renameDesignToAquarells() {
	try {
		// Remove old aquarells folder if it exists and is empty
		if (fs.existsSync(AQUARELLS_DIR)) {
			const contents = fs.readdirSync(AQUARELLS_DIR).filter(f => !f.startsWith('.'));
			if (contents.length === 0) {
				fs.rmSync(AQUARELLS_DIR, { recursive: true });
				console.log('✅ Removed old aquarells folder');
			}
		}

		// Rename design folder to aquarells
		fs.renameSync(DESIGN_DIR, AQUARELLS_DIR);
		console.log('✅ Renamed design/ → aquarells/');

		// Get all design images
		const files = fs.readdirSync(AQUARELLS_DIR)
			.filter((file) => {
				const ext = path.extname(file).toLowerCase();
				return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
			})
			.sort();

		console.log(`\nRenaming ${files.length} images from *_design to *_aquarells...`);

		const fileMapping = {};

		for (const oldFile of files) {
			const newFile = oldFile.replace('_design', '_aquarells');
			const oldPath = path.join(AQUARELLS_DIR, oldFile);
			const newPath = path.join(AQUARELLS_DIR, newFile);

			fs.renameSync(oldPath, newPath);
			fileMapping[oldFile] = newFile;

			console.log(`✅ ${oldFile} → ${newFile}`);
		}

		// Update gallery.yaml with new file names and paths
		console.log('\nUpdating gallery.yaml...');
		let galleryContent = fs.readFileSync(GALLERY_CONFIG, 'utf-8');

		// Update design collection to aquarells collection
		galleryContent = galleryContent.replace('id: design', 'id: aquarells');
		galleryContent = galleryContent.replace('name: Design', 'name: Aquarells');

		// Update design paths to aquarells and image names
		for (const [oldName, newName] of Object.entries(fileMapping)) {
			const oldPath = `design/${oldName}`;
			const newPath = `aquarells/${newName}`;
			galleryContent = galleryContent.replaceAll(oldPath, newPath);
		}

		// Update collection tags from design to aquarells
		galleryContent = galleryContent.replaceAll('- design', '- aquarells');

		fs.writeFileSync(GALLERY_CONFIG, galleryContent, 'utf-8');

		console.log('✅ gallery.yaml updated successfully!');
		console.log(`\n✅ All changes complete! Folder renamed and ${files.length} images updated.`);
	} catch (err) {
		console.error('Error:', err.message);
		process.exit(1);
	}
}

renameDesignToAquarells();
