//solana.js
const solanaWeb3 = require('@solana/web3.js');
const Solana = new solanaWeb3.Connection(
  "YOUR QUICKNODE RPC LINK HERE"
);




const getRecentBlockInfo = async () => {
    const recentInfo = await Solana.getEpochInfo()
    console.log("~~~~~~~~~~~~~~~~~EPOCH INFO~~~~~~~~~~~~\n", recentInfo);
}


//----------------Nueva seccion del codigo---------------//

const firstBlock = async () => {
  const recentBlock = await Solana.getEpochInfo();
  console.log("~~~~~~~~~~~~~~~~~NEW BLOCK~~~~~~~~~~~~\n", recentBlock);
  const keyPair = solanaWeb3.Keypair.generate();

  console.log("Public Key:", keyPair.publicKey.toString());
  console.log("Secret Key:",keyPair.secretKey)
};

firstBlock();

//getRecentBlockInfo();