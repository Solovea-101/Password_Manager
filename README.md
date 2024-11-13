
# Password Manager - Computer Security Project

## Project Description

This project is a password manager designed to securely store and retrieve passwords for various domains. The manager is implemented in Node.js, utilizing AES encryption to protect stored passwords. The primary focus of this project is on implementing robust security features to safeguard passwords from unauthorized access, including defense against common attacks like swap attacks and rollback attacks. This project also explores various cryptographic techniques such as HMAC for domain-specific password hashing and ensuring that the system leaks minimal information about the stored passwords.

## Features

- **Master Password**: Uses a master password to generate encryption keys for encrypting and decrypting individual passwords for each domain.

- **Password Storage**: Securely stores encrypted passwords using AES-256-CBC encryption and a randomly generated IV (Initialization Vector).

- **Password Retrieval**: Retrieves encrypted passwords and decrypts them using the correct master password.

- **Database Dump**: Allows users to dump the entire password database along with a checksum for integrity verification.

- **Database Loading**: Loads the password database from a dump file after verifying the checksum.

- **Password Removal**: Users can remove passwords from the database securely.

## Installation

To run the project locally, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/password-manager.git
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Run the command-line interface:
   ```bash
   node cli.js
   ```

## Questions

### 1. How do you prevent adversaries from learning the lengths of the passwords stored in your password manager?

To hide password lengths from an attacker, we use AES encryption with a fixed key length. This ensures that no matter the original password length, the ciphertext always has a consistent size. Additionally, we pad the password before encryption, so all encrypted passwords have the same length, further preventing any patterns that could reveal information about the password length.

### 2. How do you prevent swap attacks, and why does your method work?

We protect against swap attacks by using deterministic encryption, meaning the ciphertext for the same input is always the same length. Padding ensures that all encrypted passwords are the same size, regardless of the original password length. Since attackers can’t tell the difference in size between passwords, they cannot swap them without detection.

### 3. Is it necessary to store the SHA-256 hash in a trusted location to defend against rollback attacks? Why?

Yes, it is essential to have a trusted location for storing the SHA-256 hash. The hash acts as a marker for the most recent, valid state of the password database. Without this secure reference, an attacker could modify the database and roll it back to an earlier state without being detected. The trusted location allows us to verify the database’s integrity by comparing the current hash with the trusted one.

### 4. How would you handle lookups if using a randomized MAC instead of HMAC, and would this introduce a performance penalty?

With a randomized MAC, since the output varies on each run, directly comparing MAC tags for lookups wouldn’t work. To address this, we would store the MAC tag for each domain separately, so each tag is consistent for a given domain. However, this approach would introduce a performance penalty, as calculating and comparing randomized MACs is slower than using deterministic HMACs.

### 5. How can you reduce information leakage about the number of records in the password manager?

To limit the leakage of record count information, we can pad the database by adding dummy entries. This ensures that the number of actual records remains hidden and is always close to a power of two. This way, an attacker cannot easily differentiate between different record counts, as the size of the database only reveals the logarithmic value of the number of records.

### 6. How can you add multi-user support for specific sites without compromising security for other sites?

To enable multi-user support, we can encrypt each password with a unique key for each user. For instance, if Alice and Bob need access to the same password (e.g., for nytimes), they would both have their own keys to decrypt it. This ensures that while they can share access to certain passwords, they cannot access passwords for other domains. This method maintains the privacy of passwords across different users while enabling secure shared access where necessary.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


