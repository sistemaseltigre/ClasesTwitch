const Web3 = require('@solana/web3.js');
const { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } = Web3;

const SOLANA_CONNECTION = new Connection('YOUR QUICKNODE RPC LINK HERE');
const WALLET_ADDRESS = 'GKzwank3rqV73sJPM1QWbmDN4sL9tcy3KTNhTnZDVaoT'; //👈 Replace with your wallet address
const MyPublicKey =  new PublicKey(WALLET_ADDRESS);
const AIRDROP_AMOUNT = 1 * LAMPORTS_PER_SOL; // 1 SOL 

(async () => {
    console.log(`Requesting airdrop for ${WALLET_ADDRESS}`);
    console.log(`esta es mi direccion wallet ${WALLET_ADDRESS}`);
    console.log(`esta es mi PublicKey ${MyPublicKey}`);

    // 1 - Request Airdrop
    const signature = await SOLANA_CONNECTION.requestAirdrop(
       	MyPublicKey,
        AIRDROP_AMOUNT
    );
    // 2 - Fetch the latest blockhash
    const { blockhash, lastValidBlockHeight } = await SOLANA_CONNECTION.getLatestBlockhash();
    // 3 - Confirm transaction success
    await SOLANA_CONNECTION.confirmTransaction({
        blockhash,
        lastValidBlockHeight,
        signature
    },'finalized');
    // 4 - Log results
    console.log(`Tx Complete: https://explorer.solana.com/tx/${signature}?cluster=devnet`)
})();