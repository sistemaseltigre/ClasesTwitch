//import solana web3
const web3 = require("@solana/web3.js");
const { Transaction, SystemProgram, Keypair, LAMPORTS_PER_SOL, Connection, PublicKey, sendAndConfirmTransaction, TransactionInstruction} = web3;

//import solanapay
const solpay = require("@solana/pay");
const { encodeURL, validateTransfer, parseURL, TransferRequestURL, findReference} = solpay;

//import bigNumber
const BigNumberpkg = require("bignumber.js");
const { BigNumber } = BigNumberpkg;

//importamos wallet
const fs = require('fs');
const secret = JSON.parse(fs.readFileSync("frasesemilla.json").toString().trim());
const userWallet = Keypair.fromSecretKey(new Uint8Array(secret));

// CONSTANTS
//wallet recipient's config
const myWallet = 'GKzwank3rqV73sJPM1QWbmDN4sL9tcy3KTNhTnZDVaoT'; 
const recipient = new PublicKey(myWallet);

//config endpoint and cluster
const quickNodeEndpoint = "YOUR QUICKNODE RPC LINK HERE";
const connection = new Connection(quickNodeEndpoint, 'confirmed');

//Product parameters
const amount = new BigNumber(1.75); // 0.1 SOL
const reference = new Keypair().publicKey;
const label = 'Elchuo160 Swag';
const message = `Elchuo160 - Order ID #EL-0${Math.floor(Math.random() * 999999) + 1}`;
const memo = 'Elchuo160 Solana Pay Demo - Public Memo';



async function generateUrl(recipient,amount,reference,label,message,memo) {
    console.log('1. Create a payment request link');
    const url = encodeURL({ recipient, amount, reference, label, message, memo });
    console.log('Payment request link:', url);
    return url;
}

(async () => {
    try {
        const url = await generateUrl(recipient, amount, reference, label, message, memo);
        console.log('Success');
    } catch (err) {
        console.error(err);
    }
})();































