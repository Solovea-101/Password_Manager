const crypto = require('crypto');
const fs = require('fs');

class PasswordManager {
    constructor() {
        this.kvs = {};  // Key-Value Store (for domains and passwords)
        this.salt = crypto.randomBytes(16).toString('hex');
    }

    // Helper function to derive encryption key from master password and salt
    _getKey(masterPassword) {
        return crypto.pbkdf2Sync(masterPassword, this.salt, 100000, 32, 'sha256');
    }

    // Set a password for a domain
    async set(masterPassword, domain, password) {
        const key = this._getKey(masterPassword);
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
        let encryptedPassword = cipher.update(password, 'utf8', 'hex');
        encryptedPassword += cipher.final('hex');
        this.kvs[domain] = { encryptedPassword, iv: iv.toString('hex') };
    }

    // Get a password for a domain
    async get(masterPassword, domain) {
        if (this.kvs[domain]) {
            const { encryptedPassword, iv } = this.kvs[domain];
            const key = this._getKey(masterPassword);
            const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'hex'));
            let decryptedPassword = decipher.update(encryptedPassword, 'hex', 'utf8');
            decryptedPassword += decipher.final('utf8');
            return decryptedPassword;
        } else {
            return null; // No password found for the domain
        }
    }

    // Remove a password for a domain
    async remove(masterPassword, domain) {
        if (this.kvs[domain]) {
            delete this.kvs[domain];
            return true;
        }
        return false; // No password found for the domain
    }

    // Dump the database contents
    async dump() {
        const dumpContents = JSON.stringify(this.kvs);
        const checksum = crypto.createHash('sha256').update(dumpContents).digest('hex');
        return [dumpContents, checksum];
    }

    // Load the database from dump contents
    async load(masterPassword, dumpContents, checksum) {
        const newChecksum = crypto.createHash('sha256').update(dumpContents).digest('hex');
        if (newChecksum !== checksum) {
            return false; // Checksum mismatch
        }
        const parsedContents = JSON.parse(dumpContents);
        this.kvs = parsedContents;
        return true;
    }
}

module.exports = PasswordManager;
