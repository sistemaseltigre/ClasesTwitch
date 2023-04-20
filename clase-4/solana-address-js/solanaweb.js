//solana.js
const solanaWeb3 = require('@solana/web3.js');
const Solana = new solanaWeb3.Connection(
  "https://clean-blissful-patron.solana-devnet.quiknode.pro/0c1c6fd14118b66a3e7f4f5edc764738e801996d/"
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