import { equals, indexOf, lastIndexOf, startsWith } from "../bytes/mod.ts";
import { copyN } from "../io/ioutil.ts";
import { MultiReader } from "../io/readers.ts";
import { extname } from "../path/mod.ts";
import { BufReader, BufWriter } from "../io/bufio.ts";
import { assert } from "../_util/assert.ts";
import { TextProtoReader } from "../textproto/mod.ts";
import { hasOwnProperty } from "../_util/has_own_property.ts";
import { Buffer } from "../io/buffer.ts";
export function isFormFile(x) {
    return hasOwnProperty(x, "filename") && hasOwnProperty(x, "type");
}
function randomBoundary() {
    let boundary = "--------------------------";
    for (let i = 0; i < 24; i++) {
        boundary += Math.floor(Math.random() * 16).toString(16);
    }
    return boundary;
}
const encoder = new TextEncoder();
export function matchAfterPrefix(buf, prefix, eof) {
    if (buf.length === prefix.length) {
        return eof ? 1 : 0;
    }
    const c = buf[prefix.length];
    if (c === " ".charCodeAt(0) ||
        c === "\t".charCodeAt(0) ||
        c === "\r".charCodeAt(0) ||
        c === "\n".charCodeAt(0) ||
        c === "-".charCodeAt(0)) {
        return 1;
    }
    return -1;
}
export function scanUntilBoundary(buf, dashBoundary, newLineDashBoundary, total, eof) {
    if (total === 0) {
        if (startsWith(buf, dashBoundary)) {
            switch (matchAfterPrefix(buf, dashBoundary, eof)) {
                case -1:
                    return dashBoundary.length;
                case 0:
                    return 0;
                case 1:
                    return null;
            }
        }
        if (startsWith(dashBoundary, buf)) {
            return 0;
        }
    }
    const i = indexOf(buf, newLineDashBoundary);
    if (i >= 0) {
        switch (matchAfterPrefix(buf.slice(i), newLineDashBoundary, eof)) {
            case -1:
                return i + newLineDashBoundary.length;
            case 0:
                return i;
            case 1:
                return i > 0 ? i : null;
        }
    }
    if (startsWith(newLineDashBoundary, buf)) {
        return 0;
    }
    const j = lastIndexOf(buf, newLineDashBoundary.slice(0, 1));
    if (j >= 0 && startsWith(newLineDashBoundary, buf.slice(j))) {
        return j;
    }
    return buf.length;
}
class PartReader {
    mr;
    headers;
    n = 0;
    total = 0;
    constructor(mr, headers) {
        this.mr = mr;
        this.headers = headers;
    }
    async read(p) {
        const br = this.mr.bufReader;
        let peekLength = 1;
        while (this.n === 0) {
            peekLength = Math.max(peekLength, br.buffered());
            const peekBuf = await br.peek(peekLength);
            if (peekBuf === null) {
                throw new Deno.errors.UnexpectedEof();
            }
            const eof = peekBuf.length < peekLength;
            this.n = scanUntilBoundary(peekBuf, this.mr.dashBoundary, this.mr.newLineDashBoundary, this.total, eof);
            if (this.n === 0) {
                assert(eof === false);
                peekLength++;
            }
        }
        if (this.n === null) {
            return null;
        }
        const nread = Math.min(p.length, this.n);
        const buf = p.subarray(0, nread);
        const r = await br.readFull(buf);
        assert(r === buf);
        this.n -= nread;
        this.total += nread;
        return nread;
    }
    close() { }
    contentDisposition;
    contentDispositionParams;
    getContentDispositionParams() {
        if (this.contentDispositionParams)
            return this.contentDispositionParams;
        const cd = this.headers.get("content-disposition");
        const params = {};
        assert(cd != null, "content-disposition must be set");
        const comps = decodeURI(cd).split(";");
        this.contentDisposition = comps[0];
        comps
            .slice(1)
            .map((v) => v.trim())
            .map((kv) => {
            const [k, v] = kv.split("=");
            if (v) {
                const s = v.charAt(0);
                const e = v.charAt(v.length - 1);
                if ((s === e && s === '"') || s === "'") {
                    params[k] = v.substr(1, v.length - 2);
                }
                else {
                    params[k] = v;
                }
            }
        });
        return (this.contentDispositionParams = params);
    }
    get fileName() {
        return this.getContentDispositionParams()["filename"];
    }
    get formName() {
        const p = this.getContentDispositionParams();
        if (this.contentDisposition === "form-data") {
            return p["name"];
        }
        return "";
    }
}
function skipLWSPChar(u) {
    const ret = new Uint8Array(u.length);
    const sp = " ".charCodeAt(0);
    const ht = "\t".charCodeAt(0);
    let j = 0;
    for (let i = 0; i < u.length; i++) {
        if (u[i] === sp || u[i] === ht)
            continue;
        ret[j++] = u[i];
    }
    return ret.slice(0, j);
}
export class MultipartReader {
    boundary;
    newLine;
    newLineDashBoundary;
    dashBoundaryDash;
    dashBoundary;
    bufReader;
    constructor(reader, boundary) {
        this.boundary = boundary;
        this.newLine = encoder.encode("\r\n");
        this.newLineDashBoundary = encoder.encode(`\r\n--${boundary}`);
        this.dashBoundaryDash = encoder.encode(`--${this.boundary}--`);
        this.dashBoundary = encoder.encode(`--${this.boundary}`);
        this.bufReader = new BufReader(reader);
    }
    async readForm(maxMemory = 10 << 20) {
        const fileMap = new Map();
        const valueMap = new Map();
        let maxValueBytes = maxMemory + (10 << 20);
        const buf = new Buffer(new Uint8Array(maxValueBytes));
        for (;;) {
            const p = await this.nextPart();
            if (p === null) {
                break;
            }
            if (p.formName === "") {
                continue;
            }
            buf.reset();
            if (!p.fileName) {
                const n = await copyN(p, buf, maxValueBytes);
                maxValueBytes -= n;
                if (maxValueBytes < 0) {
                    throw new RangeError("message too large");
                }
                const value = new TextDecoder().decode(buf.bytes());
                valueMap.set(p.formName, value);
                continue;
            }
            let formFile;
            const n = await copyN(p, buf, maxValueBytes);
            const contentType = p.headers.get("content-type");
            assert(contentType != null, "content-type must be set");
            if (n > maxMemory) {
                const ext = extname(p.fileName);
                const filepath = await Deno.makeTempFile({
                    dir: ".",
                    prefix: "multipart-",
                    suffix: ext,
                });
                const file = await Deno.open(filepath, { write: true });
                try {
                    const size = await Deno.copy(new MultiReader(buf, p), file);
                    file.close();
                    formFile = {
                        filename: p.fileName,
                        type: contentType,
                        tempfile: filepath,
                        size,
                    };
                }
                catch (e) {
                    await Deno.remove(filepath);
                    throw e;
                }
            }
            else {
                formFile = {
                    filename: p.fileName,
                    type: contentType,
                    content: buf.bytes(),
                    size: buf.length,
                };
                maxMemory -= n;
                maxValueBytes -= n;
            }
            if (formFile) {
                const mapVal = fileMap.get(p.formName);
                if (mapVal !== undefined) {
                    if (Array.isArray(mapVal)) {
                        mapVal.push(formFile);
                    }
                    else {
                        fileMap.set(p.formName, [mapVal, formFile]);
                    }
                }
                else {
                    fileMap.set(p.formName, formFile);
                }
            }
        }
        return multipartFormData(fileMap, valueMap);
    }
    currentPart;
    partsRead = 0;
    async nextPart() {
        if (this.currentPart) {
            this.currentPart.close();
        }
        if (equals(this.dashBoundary, encoder.encode("--"))) {
            throw new Error("boundary is empty");
        }
        let expectNewPart = false;
        for (;;) {
            const line = await this.bufReader.readSlice("\n".charCodeAt(0));
            if (line === null) {
                throw new Deno.errors.UnexpectedEof();
            }
            if (this.isBoundaryDelimiterLine(line)) {
                this.partsRead++;
                const r = new TextProtoReader(this.bufReader);
                const headers = await r.readMIMEHeader();
                if (headers === null) {
                    throw new Deno.errors.UnexpectedEof();
                }
                const np = new PartReader(this, headers);
                this.currentPart = np;
                return np;
            }
            if (this.isFinalBoundary(line)) {
                return null;
            }
            if (expectNewPart) {
                throw new Error(`expecting a new Part; got line ${line}`);
            }
            if (this.partsRead === 0) {
                continue;
            }
            if (equals(line, this.newLine)) {
                expectNewPart = true;
                continue;
            }
            throw new Error(`unexpected line in nextPart(): ${line}`);
        }
    }
    isFinalBoundary(line) {
        if (!startsWith(line, this.dashBoundaryDash)) {
            return false;
        }
        const rest = line.slice(this.dashBoundaryDash.length, line.length);
        return rest.length === 0 || equals(skipLWSPChar(rest), this.newLine);
    }
    isBoundaryDelimiterLine(line) {
        if (!startsWith(line, this.dashBoundary)) {
            return false;
        }
        const rest = line.slice(this.dashBoundary.length);
        return equals(skipLWSPChar(rest), this.newLine);
    }
}
function multipartFormData(fileMap, valueMap) {
    function file(key) {
        return fileMap.get(key);
    }
    function value(key) {
        return valueMap.get(key);
    }
    function* entries() {
        yield* fileMap;
        yield* valueMap;
    }
    async function removeAll() {
        const promises = [];
        for (const val of fileMap.values()) {
            if (Array.isArray(val)) {
                for (const subVal of val) {
                    if (!subVal.tempfile)
                        continue;
                    promises.push(Deno.remove(subVal.tempfile));
                }
            }
            else {
                if (!val.tempfile)
                    continue;
                promises.push(Deno.remove(val.tempfile));
            }
        }
        await Promise.all(promises);
    }
    return {
        file,
        value,
        entries,
        removeAll,
        [Symbol.iterator]() {
            return entries();
        },
    };
}
class PartWriter {
    writer;
    boundary;
    headers;
    closed = false;
    partHeader;
    headersWritten = false;
    constructor(writer, boundary, headers, isFirstBoundary) {
        this.writer = writer;
        this.boundary = boundary;
        this.headers = headers;
        let buf = "";
        if (isFirstBoundary) {
            buf += `--${boundary}\r\n`;
        }
        else {
            buf += `\r\n--${boundary}\r\n`;
        }
        for (const [key, value] of headers.entries()) {
            buf += `${key}: ${value}\r\n`;
        }
        buf += `\r\n`;
        this.partHeader = buf;
    }
    close() {
        this.closed = true;
    }
    async write(p) {
        if (this.closed) {
            throw new Error("part is closed");
        }
        if (!this.headersWritten) {
            await this.writer.write(encoder.encode(this.partHeader));
            this.headersWritten = true;
        }
        return this.writer.write(p);
    }
}
function checkBoundary(b) {
    if (b.length < 1 || b.length > 70) {
        throw new Error(`invalid boundary length: ${b.length}`);
    }
    const end = b.length - 1;
    for (let i = 0; i < end; i++) {
        const c = b.charAt(i);
        if (!c.match(/[a-zA-Z0-9'()+_,\-./:=?]/) || (c === " " && i !== end)) {
            throw new Error("invalid boundary character: " + c);
        }
    }
    return b;
}
export class MultipartWriter {
    writer;
    _boundary;
    get boundary() {
        return this._boundary;
    }
    lastPart;
    bufWriter;
    isClosed = false;
    constructor(writer, boundary) {
        this.writer = writer;
        if (boundary !== void 0) {
            this._boundary = checkBoundary(boundary);
        }
        else {
            this._boundary = randomBoundary();
        }
        this.bufWriter = new BufWriter(writer);
    }
    formDataContentType() {
        return `multipart/form-data; boundary=${this.boundary}`;
    }
    createPart(headers) {
        if (this.isClosed) {
            throw new Error("multipart: writer is closed");
        }
        if (this.lastPart) {
            this.lastPart.close();
        }
        const part = new PartWriter(this.writer, this.boundary, headers, !this.lastPart);
        this.lastPart = part;
        return part;
    }
    createFormFile(field, filename) {
        const h = new Headers();
        h.set("Content-Disposition", `form-data; name="${field}"; filename="${filename}"`);
        h.set("Content-Type", "application/octet-stream");
        return this.createPart(h);
    }
    createFormField(field) {
        const h = new Headers();
        h.set("Content-Disposition", `form-data; name="${field}"`);
        h.set("Content-Type", "application/octet-stream");
        return this.createPart(h);
    }
    async writeField(field, value) {
        const f = await this.createFormField(field);
        await f.write(encoder.encode(value));
    }
    async writeFile(field, filename, file) {
        const f = await this.createFormFile(field, filename);
        await Deno.copy(file, f);
    }
    flush() {
        return this.bufWriter.flush();
    }
    async close() {
        if (this.isClosed) {
            throw new Error("multipart: writer is closed");
        }
        if (this.lastPart) {
            this.lastPart.close();
            this.lastPart = void 0;
        }
        await this.writer.write(encoder.encode(`\r\n--${this.boundary}--\r\n`));
        await this.flush();
        this.isClosed = true;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGlwYXJ0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibXVsdGlwYXJ0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDeEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6QyxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUM1QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDdEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzlELE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQW9CekMsTUFBTSxVQUFVLFVBQVUsQ0FBQyxDQUFNO0lBQy9CLE9BQU8sY0FBYyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsSUFBSSxjQUFjLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3BFLENBQUM7QUFFRCxTQUFTLGNBQWM7SUFDckIsSUFBSSxRQUFRLEdBQUcsNEJBQTRCLENBQUM7SUFDNUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUMzQixRQUFRLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ3pEO0lBQ0QsT0FBTyxRQUFRLENBQUM7QUFD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