
const solanaWeb3 = require('@solana/web3.js');
const searchAddress = '2CUh9pSRWbSr7RLrfxfhFNrx8bme1hsuvhF4cgwdE45h'; 
const endpoint = 'YOUR QUICKNODE RPC LINK HERE';
const solanaConnection = new solanaWeb3.Connection(endpoint);

const getTransactions = async(address, numTx) => {
    const pubKey = new solanaWeb3.PublicKey(address);
    let transactionList = await solanaConnection.getSignaturesForAddress(pubKey, {limit:numTx});

    transactionList.forEach((transaction, i) => {
        const date = new Date(transaction.blockTime*1000);
        console.log(`Transaction No: ${i+1}`);
        console.log(`Signature: ${transaction.signature}`);
        console.log(`Time: ${date}`);
        console.log(`Status: ${transaction.confirmationStatus}`);
        console.log(("-").repeat(20));
    })
}

getTransactions(searchAddress,3);