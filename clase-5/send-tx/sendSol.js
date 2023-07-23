//sendSol.js
const web3 = require("@solana/web3.js");

//destructurar el modulo web3 para obtener las funciones que necesitamos
const { Connection, LAMPORTS_PER_SOL, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } = web3;


// Connect to cluster
const connection = new Connection(
  "YOUR QUICKNODE RPC LINK HERE",
  'confirmed',
);

//import secret from './secret.json';
const fs = require('fs');
const secret = JSON.parse(fs.readFileSync(".secret").toString().trim());
const from = Keypair.fromSecretKey(new Uint8Array(secret));

// Generate a random address to send to
const from2 = Keypair.generate();
const to = Keypair.generate();

(async () => {
    const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: from2.publicKey,
          toPubkey: to.publicKey,
          lamports: LAMPORTS_PER_SOL / 100,
        }),
      );
    
      // Sign transaction, broadcast, and confirm
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from],
      );

      console.log('SIGNATURE', signature);
})()