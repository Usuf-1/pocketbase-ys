/// <reference path="../pb_data/types.d.ts" />

/* ---------- CREATE ---------- */

onRecordCreateRequest((e) => {
    function randomSuffix() {
    return Math.floor(1000 + Math.random() * 9000)
    }

    function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
    }
  const record = e.record
  if (!record) return e.next()

  const title = record.get("title")
  if (!title) return e.next()

  let baseSlug = slugify(title)
  let slug

  while (true) {
    slug = `${baseSlug}-${randomSuffix()}`
    try {
      $app.findFirstRecordByFilter(
        e.collection.name,
        "slug = {:slug}",
        { slug }
      )
    } catch {
      break // unique
    }
  }

  record.set("slug", slug)
  e.next()
})

/* ---------- UPDATE ---------- */

onRecordUpdateRequest((e) => {
    function randomSuffix() {
    return Math.floor(1000 + Math.random() * 9000)
    }

    function slugify(str) {
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
    }
  const record = e.record
  if (!record) return e.next()

  const title = record.get("title")
  if (!title) return e.next()

  let baseSlug = slugify(title)
  let slug

  while (true) {
    slug = `${baseSlug}-${randomSuffix()}`
    try {
      const found = $app.findFirstRecordByFilter(
        e.collection.name,
        "slug = {:slug}",
        { slug }
      )

      if (found.id === record.id) break
    } catch {
      break // unique
    }
  }

  record.set("slug", slug)
  e.next()
})
