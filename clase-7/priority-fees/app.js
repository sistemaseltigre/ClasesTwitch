//importar libreria web3 solana
const web3 = require("@solana/web3.js");

//destructurar el modulo web3 para obtener las funciones que necesitamos
const { ComputeBudgetProgram, Connection, LAMPORTS_PER_SOL, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } = web3;

// Connect to cluster
//const SOLANA_CONNECTION = new Connection(QUICKNODE_RPC);
const SOLANA_CONNECTION = new Connection(
  "YOUR QUICKNODE RPC LINK HERE",
  'confirmed',
);

//import secret from './secret.json';
const fs = require('fs');
const secret = JSON.parse(fs.readFileSync(".secret").toString().trim());
const from = Keypair.fromSecretKey(new Uint8Array(secret));
const toKeypair = Keypair.generate();

const PRIORITY_RATE = 10000; // MICRO_LAMPORTS 
const SEND_AMT = 0.01 * LAMPORTS_PER_SOL;
const PRIORITY_FEE_IX = ComputeBudgetProgram.setComputeUnitPrice({microLamports: PRIORITY_RATE});

function generateTxExample() {
    return new Transaction().add(SystemProgram.transfer({
        fromPubkey: from.publicKey,
        toPubkey: toKeypair.publicKey,
        lamports: SEND_AMT
    }));
}

async function createAndSendTransactions() {
    // Step 1 - Generate base and priority transactions
    const txBase = generateTxExample();
    const txPriority = generateTxExample().add(PRIORITY_FEE_IX);
    const { blockhash, lastValidBlockHeight } = await SOLANA_CONNECTION.getLatestBlockhash();
    txBase.recentBlockhash = blockhash;
    txPriority.recentBlockhash = blockhash;
    txBase.lastValidBlockHeight = lastValidBlockHeight;
    txPriority.lastValidBlockHeight = lastValidBlockHeight;

    // Step 2 - Generate promises for each transaction
    const [txBaseRequest, txPriorityRequest] = [txBase, txPriority].map(tx => sendAndConfirmTransaction(SOLANA_CONNECTION, tx, [from]));

    try {
        // Step 3 - Send transactions to the cluster
        const [txBaseId, txPriorityId] = await Promise.all([txBaseRequest, txPriorityRequest]);

        // Step 4 - Fetch tx results, and log fees
        const [txBaseResult, txPriorityResult] = await Promise.all([SOLANA_CONNECTION.getTransaction(txBaseId), SOLANA_CONNECTION.getTransaction(txPriorityId)]);
        console.log(`txBase URL: https://explorer.solana.com/tx/${txBaseId}?cluster=devnet`);
        console.log(`txBase Fee: ${txBaseResult?.meta?.fee} Lamports`);
        console.log(`txPriority URL: https://explorer.solana.com/tx/${txPriorityId}?cluster=devnet`);
        console.log(`txPriority Fee: ${txPriorityResult?.meta?.fee} Lamports`);
    } catch (error) {
        console.log(error);
    }
}

createAndSendTransactions();