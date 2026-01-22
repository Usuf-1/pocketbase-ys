/// <reference path="../pb_data/types.d.ts" />

// REMOVED the collection name filter at the end so it triggers for EVERYTHING
onRecordBeforeCreateRequest((e) => {
    console.log("-----------------------------------------");
    console.log("HOOK TRIGGERED!");
    console.log("Collection Name: " + e.collection.name);
    
    const title = e.record.get("title");
    console.log("Found Title: " + title);

    if (title) {
        const slug = title.toLowerCase().replace(/ /g, '-');
        e.record.set("slug", slug);
        console.log("New Slug Set: " + slug);
    } else {
        console.log("ERROR: No 'title' field found on this record.");
    }

    return e.next();
}); // No collection name here for testing
