//importar libreria web3 solana
const web3 = require("@solana/web3.js");

//destructurar el modulo web3 para obtener las funciones que necesitamos
const { Connection, LAMPORTS_PER_SOL, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction, TransactionInstruction } = web3;

var dropList = [
	{
		walletAddress: '2wGXoPVVyGe5WmtccuuiBP5RiuRiLt4r7B73gPABd7Es',
		numLamports: '10000000',
	},
	{
		walletAddress: '3equYJpjXA68fdJCzsTMX33VLfjkoTvYjeLCN7zTSJeK',
		numLamports: '10000000',
	},
	{
		walletAddress: '3equYJpjXA68fdJCzsTMX33VLfjkoTvYjeLCN7zTSJeK',
		numLamports: '10000000',
	},
	{
		walletAddress: '3equYJpjXA68fdJCzsTMX33VLfjkoTvYjeLCN7zTSJeK',
		numLamports: '10000000',
	},
	{
		walletAddress: '3equYJpjXA68fdJCzsTMX33VLfjkoTvYjeLCN7zTSJeK',
		numLamports: '10000000',
	},
	{
		walletAddress: '3equYJpjXA68fdJCzsTMX33VLfjkoTvYjeLCN7zTSJeK',
		numLamports: '10000000',
	},
	{
		walletAddress: '3equYJpjXA68fdJCzsTMX33VLfjkoTvYjeLCN7zTSJeK',
		numLamports: '10000000',
	},
	{
		walletAddress: '3equYJpjXA68fdJCzsTMX33VLfjkoTvYjeLCN7zTSJeK',
		numLamports: '10000000',
	},
	{
		walletAddress: '3equYJpjXA68fdJCzsTMX33VLfjkoTvYjeLCN7zTSJeK',
		numLamports: '10000000',
	},
	{
		walletAddress: '3equYJpjXA68fdJCzsTMX33VLfjkoTvYjeLCN7zTSJeK',
		numLamports: '10000000',
	}
]


// Connect to cluster
const connection = new Connection(
  "YOUR QUICKNODE RPC LINK HERE",
  'confirmed',
);

//import secret from './secret.json';
const fs = require('fs');
const secret = JSON.parse(fs.readFileSync(".secret").toString().trim());
const from = Keypair.fromSecretKey(new Uint8Array(secret));

//variables basicas
const FROM_KEY_PAIR = from;
const NUM_DROPS_PER_TX = 1; 
const TX_INTERVAL = 1000;

//generar lista de tx
function generateTransactions(batchSize, dropList, fromWallet) {
    let result = [];
    let txInstructions = dropList.map(drop => {return SystemProgram.transfer({
        fromPubkey: fromWallet,
        toPubkey: new PublicKey(drop.walletAddress),
        lamports: drop.numLamports

    })})
     console.log("instrucciones",txInstructions);
     console.log(txInstructions.length);
     console.log(batchSize);
    const numTransactions = Math.ceil(txInstructions.length / batchSize);
    console.log(numTransactions);
    for (let i = 0; i < numTransactions; i++){
        let bulkTransaction = new Transaction();
        let lowerIndex = i * batchSize;
        let upperIndex = (i+1) * batchSize;
        for (let j = lowerIndex; j < upperIndex; j++){
            if (txInstructions[j]) bulkTransaction.add(txInstructions[j]);  
        }
        result.push(bulkTransaction);
    }
    return result;
}

//ejecutamos las tx
async function executeTransactions(solanaConnection, transactionList, payer){
    let result = [];
    let staggeredTransactions = transactionList.map((transaction, i, allTx) => {
        return (new Promise((resolve) => {
            setTimeout(() => {
                console.log(`Requesting Transaction ${i+1}/${allTx.length}`);                
                solanaConnection.getLatestBlockhash()
                    .then(recentHash=>transaction.recentBlockhash = recentHash.blockhash)
                    .then(()=>sendAndConfirmTransaction(solanaConnection,transaction,[payer])).then(resolve);
            }, i * TX_INTERVAL);
         })
    )})
    result = await Promise.allSettled(staggeredTransactions);
    return result;
}

(async () => {
    console.log(`Initiating SOL drop from ${FROM_KEY_PAIR.publicKey.toString()}`);
    const transactionList = generateTransactions(NUM_DROPS_PER_TX,dropList,FROM_KEY_PAIR.publicKey);
    const txResults = await executeTransactions(connection,transactionList,FROM_KEY_PAIR);
    console.log(await txResults);
})()