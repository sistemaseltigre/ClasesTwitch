//Wallet de ejemplo
//2CUh9pSRWbSr7RLrfxfhFNrx8bme1hsuvhF4cgwdE45h

//importar modulo de la carpeta node modules
const web3 = require('@solana/web3.js');

//destructurar el modulo web3 para obtener las funciones que necesitamos
const { Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } = web3;

//import secret from './secret.json';
const fs = require('fs');
const secret = JSON.parse(fs.readFileSync(".secret").toString().trim());

const QUICKNODE_RPC = 'https://clean-blissful-patron.solana-devnet.quiknode.pro/0c1c6fd14118b66a3e7f4f5edc764738e801996d/';
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);

async function logMemo (message) {

    // 1. Declare Keypair to sign transaction 
    const fromKeypair = Keypair.fromSecretKey(new Uint8Array(secret));
    
    // 2. Create Solana Transaction
    let tx = new Transaction();

    // 3. Add Memo Instruction
    await tx.add(
        new TransactionInstruction({
          keys: [{ pubkey: fromKeypair.publicKey, isSigner: true, isWritable: true }],
          data: Buffer.from(message, "utf-8"),
          programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
        })
      )
    // 4. Send Transaction
    let result = await sendAndConfirmTransaction(SOLANA_CONNECTION, tx, [fromKeypair]);
    // 5. Log Tx URL
    console.log("complete: ", `https://explorer.solana.com/tx/${result}?cluster=devnet`);
    return result;
}

async function fetchMemo() {
    const wallet = Keypair.fromSecretKey(new Uint8Array(secret)).publicKey;
    let signatureDetail = await SOLANA_CONNECTION.getSignaturesForAddress(wallet);
    console.log('Fetched Memo: ', signatureDetail[0].memo);
}

//logMemo("Aprendiendo en twitch con Jesus Silva");
fetchMemo();