#!/usr/bin/env node
const {decryptFile, encryptFile} = require('./index');
async function main() {
    const [,,passwordOrCommand, password] = process.argv;
    if(passwordOrCommand === `enc` && password) {
        await encryptFile(password);
        console.log('File was encrypted');
        return;
    }
    if(passwordOrCommand !== `enc`) {
        await decryptFile(passwordOrCommand);
        console.log('File was decrypted');
        return;
    }
    throw new Error('Please pass ags');
}

main()
    .then(console.log)
    .catch(console.error);
