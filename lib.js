// Converts string to buffer
function stringToBuffer(string) {
    return new TextEncoder().encode(string);
}

// Converts buffer back to string
function bufferToString(buffer) {
    return new TextDecoder().decode(buffer);
}

// Converts a buffer to Base64 encoded string
function encodeBuffer(buffer) {
    return Buffer.from(buffer).toString('base64');
}

// Decodes a Base64 string back to a buffer
function decodeBuffer(base64) {
    return Buffer.from(base64, 'base64');
}

// Generates random bytes
function getRandomBytes(length) {
    const bytes = new Uint8Array(length);
    window.crypto.getRandomValues(bytes);
    return bytes;
}

module.exports = { stringToBuffer, bufferToString, encodeBuffer, decodeBuffer, getRandomBytes };
