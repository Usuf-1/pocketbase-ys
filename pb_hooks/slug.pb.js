/// <reference path="../pb_data/types.d.ts" />

// --- CONFIGURATION ---
const COLLECTION_NAME = "posts"; 

/**
 * 1. HANDLE CREATION
 */
onRecordBeforeCreateRequest((e) => {
    const title = e.record.get("title");
    
    // Generate slug if title exists
    if (title) {
        e.record.set("slug", createUniqueSlug(title));
    }

    return e.next();
}, COLLECTION_NAME);

/**
 * 2. HANDLE UPDATES
 */
onRecordBeforeUpdateRequest((e) => {
    const newTitle = e.record.get("title");
    const oldTitle = e.record.originalCopy().get("title");

    // Only update the slug if the title was actually modified
    if (newTitle && newTitle !== oldTitle) {
        e.record.set("slug", createUniqueSlug(newTitle));
        console.log(`[Hook] Title changed. Updated slug to: ${e.record.get("slug")}`);
    }

    return e.next();
}, COLLECTION_NAME);

/**
 * HELPER: Slugify + Random Suffix
 */
function createUniqueSlug(text) {
    const base = text
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-');
    
    const suffix = Math.random().toString(36).substring(2, 7);
    return `${base}-${suffix}`;
}
