//Wallet de ejemplo
//2CUh9pSRWbSr7RLrfxfhFNrx8bme1hsuvhF4cgwdE45h


//importamos todo lo necesario
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } from "@solana/web3.js";
import secret from './secret.json';
const QUICKNODE_RPC = 'https://clean-blissful-patron.solana-devnet.quiknode.pro/0c1c6fd14118b66a3e7f4f5edc764738e801996d/';
const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);

async function logMemo (message: string) {

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

logMemo("Aprendiendo en twitch con Jesus Silva");