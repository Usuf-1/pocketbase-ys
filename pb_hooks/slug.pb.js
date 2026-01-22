// This hook runs before a record is created in the "posts" collection
onRecordBeforeCreateRequest((e) => {
    const title = e.record.get("title");

    // Only generate slug if title exists and slug is currently empty
    if (title && !e.record.get("slug")) {
        const slug = title
            .toLowerCase()
            .replace(/[^\w ]+/g, '')  // Remove special characters
            .replace(/ +/g, '-')       // Replace spaces with hyphens
            .replace(/^-+|-+$/g, '');  // Trim hyphens from ends

        e.record.set("slug", slug);
    }
}, "posts"); // Replace "posts" with your actual collection name

// Optional: Update slug when title changes (be careful with SEO/broken links)
onRecordBeforeUpdateRequest((e) => {
    const title = e.record.get("title");
    
    // Logic to update slug only if you want it to stay synced with the title
    if (title) {
        const slug = title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-').replace(/^-+|-+$/g, '');
        e.record.set("slug", slug);
    }
}, "posts");
