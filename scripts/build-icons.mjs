/**
 * Writes both icon sets beside the built doc web.
 *
 * The glyphs live as JSX inside the kit, so until now the only way to get
 * an Ingot icon into a design tool was to redraw it. From the first redraw
 * the product has two sets, and they part company one glyph at a time.
 *
 * What this writes into ``dist/icons``:
 *
 * - ``ui/*.svg`` and ``op/*.svg`` — one file per glyph, rendered by the
 *   components themselves (see ``iconExport.tsx``), so a file cannot show
 *   a different icon than the product does.
 * - ``ingot-icons.svg`` — both sets as one sprite of ``<symbol>``s.
 * - ``ingot-icons.zip`` — the same files in one download, because a page
 *   offering 92 links is a page nobody uses.
 *
 * Runs after the SSR build of ``src/ingot-docs/iconExport.tsx``.
 */
// Imported rather than taken from the global scope: the lint config gives
// these scripts node's globals and not this one, and an explicit import is
// the answer that does not loosen a rule for every other file.
import { Buffer } from "node:buffer";
import { deflateRawSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { iconFiles, iconSprite } from "../dist-ssr/iconExport.js";

const OUT = join("dist", "icons");

const files = iconFiles();
for (const file of files) {
  const path = join(OUT, `${file.path}.svg`);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${file.svg}\n`);
}

writeFileSync(join(OUT, "ingot-icons.svg"), iconSprite(files));

// --- the archive ---------------------------------------------------------
//
// Written by hand rather than with a library, for the same reason the
// sitemap is: this is one entry header, one central directory record and a
// checksum, and a dependency for that is a dependency to keep up to date
// forever. A round trip through a real unzip is part of the check.

const CRC_TABLE = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

/** A ZIP holding `entries` ({ name, data }), deflated. */
function zip(entries) {
  const locals = [];
  const central = [];
  let offset = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry.name, "utf-8");
    const data = Buffer.from(entry.data, "utf-8");
    const deflated = deflateRawSync(data);
    const crc = crc32(data);

    const local = Buffer.alloc(30 + name.length);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0, 6); // flags
    local.writeUInt16LE(8, 8); // deflate
    local.writeUInt16LE(0, 10); // time — a fixed stamp keeps the archive
    local.writeUInt16LE(0x21, 12); // date   reproducible across builds
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(deflated.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28); // extra field length
    name.copy(local, 30);
    locals.push(local, deflated);

    const record = Buffer.alloc(46 + name.length);
    record.writeUInt32LE(0x02014b50, 0);
    record.writeUInt16LE(20, 4); // version made by
    record.writeUInt16LE(20, 6); // version needed
    record.writeUInt16LE(0, 8);
    record.writeUInt16LE(8, 10);
    record.writeUInt16LE(0, 12);
    record.writeUInt16LE(0x21, 14);
    record.writeUInt32LE(crc, 16);
    record.writeUInt32LE(deflated.length, 20);
    record.writeUInt32LE(data.length, 24);
    record.writeUInt16LE(name.length, 28);
    record.writeUInt16LE(0, 30); // extra
    record.writeUInt16LE(0, 32); // comment
    record.writeUInt16LE(0, 34); // disk
    record.writeUInt16LE(0, 36); // internal attrs
    record.writeUInt32LE(0, 38); // external attrs
    record.writeUInt32LE(offset, 42);
    name.copy(record, 46);
    central.push(record);

    offset += local.length + deflated.length;
  }

  const directory = Buffer.concat(central);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4); // this disk
  end.writeUInt16LE(0, 6); // disk with directory
  end.writeUInt16LE(entries.length, 8);
  end.writeUInt16LE(entries.length, 10);
  end.writeUInt32LE(directory.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20); // comment length

  return Buffer.concat([...locals, directory, end]);
}

writeFileSync(
  join(OUT, "ingot-icons.zip"),
  zip([
    ...files.map((file) => ({ name: `${file.path}.svg`, data: `${file.svg}\n` })),
    { name: "ingot-icons.svg", data: iconSprite(files) },
  ]),
);

const counts = files.reduce((tally, file) => {
  tally[file.set] = (tally[file.set] ?? 0) + 1;
  return tally;
}, {});

console.log(
  `icons: wrote ${files.length} svg (${counts.ui} interface, ${counts.op} operations) + sprite + zip`,
);
