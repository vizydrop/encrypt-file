const crypto = require('crypto');
const fs = require('fs');

const algorithm = 'aes-256-cbc';
const blockSize = 16;

const getKey = function(password) {
    const sha256 = crypto.createHash(`sha256`);
    sha256.update(password);
    return sha256.digest();
};

const encryptFile = function(password, inputPath = `.env`, outputPath = `.env.enc`) {
    const iv = crypto.randomBytes(blockSize);
    const key = getKey(password);
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    const input = fs.createReadStream(inputPath);
    const output = fs.createWriteStream(outputPath);
    input.pipe(cipher).pipe(output);
    output.write(Buffer.from(iv).toString(`hex`));
};

const decryptFile = async function(password, inputPath = `.env.enc`, outputPath = `.env`) {
    const stream = fs.createReadStream(inputPath, { start: 0, end: 2*blockSize - 1 });
    let iv = '';
    for await (const chunk of stream) {
        iv += chunk;
    }
    const decipher = crypto.createDecipheriv(algorithm, getKey(password), Buffer.from(iv, `hex`));
    const input = fs.createReadStream(inputPath,{ start: blockSize * 2});
    const output = fs.createWriteStream(outputPath);

    input.pipe(decipher).pipe(output);
};

module.exports = {
    encryptFile,
    decryptFile,
};



