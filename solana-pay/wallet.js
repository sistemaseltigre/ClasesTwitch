const web3 = require("@solana/web3.js");
const {Keypair, LAMPORTS_PER_SOL, Connection} = web3;
const fs = require('fs');

//STEP 1 - Connect to Solana Network
const endpoint = "YOUR QUICKNODE RPC LINK HERE"; //Replace with your RPC Endpoint
const solanaConnection = new Connection(endpoint);

//STEP 2 - Generate a New Solana Wallet
const keypair = Keypair.generate();
console.log(`Generated new KeyPair. Wallet PublicKey: `, keypair.publicKey.toString());

//STEP 3 - Write Wallet Secret Key to a .JSON
const secret_array = keypair.secretKey    
    .toString() //convert secret key to string
    .split(',') //delimit string by commas and convert to an array of strings
    .map(value=>Number(value)); //convert string values to numbers inside the array

const secret = JSON.stringify(secret_array); //Covert to JSON string

fs.writeFile('frasesemilla.json', secret, 'utf8', function(err) {
    if (err) throw err;
    console.log('Wrote secret key to frasesemilla.json.');
    });

//STEP 4 - Airdrop 1 SOL to new wallet
(async()=>{
    const airdropSignature = solanaConnection.requestAirdrop(
        keypair.publicKey,
        LAMPORTS_PER_SOL,
    );
    try{
        const txId = await airdropSignature;     
        console.log(`Airdrop Transaction Id: ${txId}`);        
        console.log(`https://explorer.solana.com/tx/${txId}?cluster=devnet`)
    }
    catch(err){
        console.log(err);
    }    
})()
