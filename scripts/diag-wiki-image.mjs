// Verify the exact API shapes the enrichment rotation collector will rely on.
const UA = { 'User-Agent': 'CultureClick/0.1 (rotation research)' };

// 1. Does pageimages give a 1920 thumbnail (standard step), and what happens when
//    the original is SMALLER than 1920?
for (const [title, note] of [
  ['Ajanta Caves', 'big original'],
  ['Toorji Ka Jhalra', 'possibly small original'],
]) {
  const u =
    'https://en.wikipedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query',
      titles: title,
      prop: 'pageimages',
      piprop: 'thumbnail|original',
      pithumbsize: '1920',
      redirects: '1',
      format: 'json',
      origin: '*',
    });
  const res = await fetch(u, { headers: UA });
  const json = await res.json();
  const page = Object.values(json.query.pages)[0];
  console.log(`\n[${note}] ${title}`);
  console.log('  thumb:', page.thumbnail?.source ?? '(none)');
  console.log('  orig: ', page.original?.source ?? '(none)');
}

// 2. prop=images shape: article → file titles (need per-article mapping).
{
  const u =
    'https://en.wikipedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query',
      titles: 'Red Fort',
      prop: 'images',
      imlimit: '30',
      redirects: '1',
      format: 'json',
      origin: '*',
    });
  const res = await fetch(u, { headers: UA });
  const json = await res.json();
  const page = Object.values(json.query.pages)[0];
  console.log(`\n[images list] Red Fort → ${(page.images ?? []).length} files:`);
  for (const f of (page.images ?? []).slice(0, 12)) console.log('   ', f.title);
}

// 3. Batched imageinfo for File: titles — thumburl at a standard step?
{
  const u =
    'https://en.wikipedia.org/w/api.php?' +
    new URLSearchParams({
      action: 'query',
      titles: 'File:Delhi fort.jpg|File:Lal Qila metro station (Delhi).jpg',
      prop: 'imageinfo',
      iiprop: 'url|size|mime',
      iiurlwidth: '1920',
      format: 'json',
      origin: '*',
    });
  const res = await fetch(u, { headers: UA });
  const json = await res.json();
  for (const page of Object.values(json.query.pages)) {
    const ii = page.imageinfo?.[0];
    console.log(`\n[imageinfo] ${page.title} → missing=${page.missing !== undefined}`);
    if (ii) {
      console.log('   mime:', ii.mime, 'size:', ii.width, '×', ii.height);
      console.log('   thumburl:', ii.thumburl ?? '(none)');
      console.log('   url:', ii.url);
    }
  }
}
