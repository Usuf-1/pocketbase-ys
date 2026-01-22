/// <reference path="../pb_data/types.d.ts" />

onRecordBeforeCreateRequest((e) => {
    // IMPORTANT: Match this to your collection name in the Admin UI
    if (e.collection.name !== "posts") return e.next(); 

    const title = e.record.get("title");
    if (title && !e.record.get("slug")) {
        const slug = title.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-')
            .replace(/^-+|-+$/g, '');
        
        const suffix = Math.random().toString(36).substring(2, 7);
        e.record.set("slug", `${slug}-${suffix}`);
    }

    return e.next();
}, "posts");

onRecordBeforeUpdateRequest((e) => {
    if (e.collection.name !== "posts") return e.next();

    const newTitle = e.record.get("title");
    const oldTitle = e.record.originalCopy().get("title");

    if (newTitle && newTitle !== oldTitle) {
        const slug = newTitle.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
        const suffix = Math.random().toString(36).substring(2, 7);
        e.record.set("slug", `${slug}-${suffix}`);
    }

    return e.next();
}, "posts");
