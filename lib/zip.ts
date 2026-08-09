/** Minimal zero-dependency ZIP writer ("store" method, no compression). */

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c;
  }
  return table;
})();

export function crc32(data: Uint8Array): number {
  let crc = -1;
  for (let i = 0; i < data.length; i += 1) {
    crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ -1) >>> 0;
}

interface ZipEntry {
  name: string;
  data: Uint8Array;
}

function dosDateTime(date = new Date()) {
  const time =
    (date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() / 2);
  const day =
    ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time: time & 0xffff, day: day & 0xffff };
}

export function createZip(entries: ZipEntry[]): Buffer {
  const buffers: Uint8Array[] = [];
  const centralDirectory: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const name = Buffer.from(entry.name, "utf8");
    const data = Buffer.from(entry.data);
    const crc = crc32(data);
    const { time, day } = dosDateTime(new Date());

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(time, 12);
    local.writeUInt16LE(day, 14);
    local.writeUInt32LE(crc, 16);
    local.writeUInt32LE(data.length, 20);
    local.writeUInt32LE(data.length, 24);
    local.writeUInt16LE(name.length, 28);
    local.writeUInt16LE(0, 30);

    buffers.push(local, name, data);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(0, 12);
    central.writeUInt16LE(time, 14);
    central.writeUInt16LE(day, 16);
    central.writeUInt32LE(crc, 18);
    central.writeUInt32LE(data.length, 22);
    central.writeUInt32LE(data.length, 26);
    central.writeUInt16LE(name.length, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt16LE(0, 38);
    central.writeUInt32LE(0, 40);
    central.writeUInt32LE(offset, 42);
    central.writeUInt16LE(0, 44);

    centralDirectory.push(central, name);
    offset += local.length + name.length + data.length;
  }

  const centralOffset = offset;
  const centralBuffer = Buffer.concat([Buffer.concat(centralDirectory), Buffer.concat(buffers)]);

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralDirectory.length, 12);
  eocd.writeUInt32LE(centralOffset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([Buffer.concat(buffers), centralBuffer, eocd] as unknown as Uint8Array[]);
}