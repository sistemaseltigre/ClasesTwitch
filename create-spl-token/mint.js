const web3 = require("@solana/web3.js");
const { Transaction, SystemProgram, Keypair, Connection, PublicKey, sendAndConfirmTransaction} = web3;

const spl = require("@solana/spl-token");
const { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMintInstruction, getMinimumBalanceForRentExemptMint, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction, createMintToInstruction } = spl;

const mpl = require("@metaplex-foundation/mpl-token-metadata");
const {  DataV2, createCreateMetadataAccountV3Instruction } = mpl;

const mpljs = require("@metaplex-foundation/js");
const {  bundlrStorage, findMetadataPda, keypairIdentity, Metaplex, UploadMetadataInput } = mpljs;

const endpoint = "YOUR QUICKNODE RPC LINK HERE";

const solanaConnection = new Connection(
  "YOUR QUICKNODE RPC LINK HERE",
  'confirmed',
);

const fs = require('fs');

const secret = JSON.parse(fs.readFileSync("frasesemilla.json").toString().trim());
const userWallet = Keypair.fromSecretKey(new Uint8Array(secret));
const metaplex = Metaplex.make(solanaConnection)
    .use(keypairIdentity(userWallet))
    .use(bundlrStorage({
        address: 'https://devnet.bundlr.network',
        providerUrl: endpoint,
        timeout: 60000,
    }));

const MINT_CONFIG = {
    numDecimals: 5,
    numberTokens: 777
}

const MY_TOKEN_METADATA = {
    name: "elchuo160",
    symbol: "EL160",
    description: "This is a elchuo160 token for free acces to workshops!",
    image: "https://pbs.twimg.com/profile_images/1554070084401889282/w8yjj7W__400x400.jpg" //add public URL to image you'd like to use
};
const ON_CHAIN_METADATA = {
    name: MY_TOKEN_METADATA.name, 
    symbol: MY_TOKEN_METADATA.symbol,
    uri: 'TO_UPDATE_LATER',
    sellerFeeBasisPoints: 0,
    creators: null,
    collection: null,
    uses: null
};


/**
 * 
 * @param wallet Solana Keypair
 * @param tokenMetadata Metaplex Fungible Token Standard object 
 * @returns Arweave url for our metadata json file
 */
// const uploadMetadata = async(tokenMetadata: UploadMetadataInput):Promise<string> => {
 
const uploadMetadata = async (tokenMetadata) => {
    //Upload to Arweave
    const { uri } = await metaplex.nfts().uploadMetadata(tokenMetadata);
    console.log(`Arweave URL: `, uri);
    return uri;
}

const createNewMintTransaction = async (connection, payer, mintKeypair, destinationWallet, mintAuthority, freezeAuthority)=>{
    //Get the minimum lamport balance to create a new account and avoid rent payments
    const requiredBalance = await getMinimumBalanceForRentExemptMint(connection);
    //metadata account associated with mint
    const metadataPDA = await metaplex.nfts().pdas().metadata({ mint: mintKeypair.publicKey });
    //get associated token account of your wallet
    const tokenATA = await getAssociatedTokenAddress(mintKeypair.publicKey, destinationWallet);   
    

    const createNewTokenTransaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: mintKeypair.publicKey,
            space: MINT_SIZE,
            lamports: requiredBalance,
            programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
          mintKeypair.publicKey, //Mint Address
          MINT_CONFIG.numDecimals, //Number of Decimals of New mint
          mintAuthority, //Mint Authority
          freezeAuthority, //Freeze Authority
          TOKEN_PROGRAM_ID),
        createAssociatedTokenAccountInstruction(
          payer.publicKey, //Payer 
          tokenATA, //Associated token account 
          payer.publicKey, //token owner
          mintKeypair.publicKey, //Mint
        ),
        createMintToInstruction(
          mintKeypair.publicKey, //Mint
          tokenATA, //Destination Token Account
          mintAuthority, //Authority
          MINT_CONFIG.numberTokens * Math.pow(10, MINT_CONFIG.numDecimals),//number of tokens
        ),
        createCreateMetadataAccountV3Instruction({
            metadata: metadataPDA,
            mint: mintKeypair.publicKey,
            mintAuthority: mintAuthority,
            payer: payer.publicKey,
            updateAuthority: mintAuthority,
        }, {
            createMetadataAccountArgsV3: {
                data: ON_CHAIN_METADATA,
                isMutable: true,
                collectionDetails: null
            }
        })
    );

    return createNewTokenTransaction;
}



const main = async() => {
    console.log(`---STEP 1: Uploading MetaData---`);
    const userWallet = Keypair.fromSecretKey(new Uint8Array(secret));
    let metadataUri = await uploadMetadata(MY_TOKEN_METADATA);
    ON_CHAIN_METADATA.uri = metadataUri;

    console.log(`---STEP 2: Creating Mint Transaction---`);
    let mintKeypair = Keypair.generate();   
    console.log(`New Mint Address: `, mintKeypair.publicKey.toString());

    const newMintTransaction = await createNewMintTransaction(
        solanaConnection,
        userWallet,
        mintKeypair,
        userWallet.publicKey,
        userWallet.publicKey,
        userWallet.publicKey
    );

    console.log(`---STEP 3: Executing Mint Transaction---`);
    let { lastValidBlockHeight, blockhash } = await solanaConnection.getLatestBlockhash('finalized');
    newMintTransaction.recentBlockhash = blockhash;
    newMintTransaction.lastValidBlockHeight = lastValidBlockHeight;
    newMintTransaction.feePayer = userWallet.publicKey;
    const transactionId = await sendAndConfirmTransaction(solanaConnection,newMintTransaction,[userWallet,mintKeypair]); 
    console.log(`Transaction ID: `, transactionId);
    console.log(`Succesfully minted ${MINT_CONFIG.numberTokens} ${ON_CHAIN_METADATA.symbol} to ${userWallet.publicKey.toString()}.`);
    console.log(`View Transaction: https://explorer.solana.com/tx/${transactionId}?cluster=devnet`);
    console.log(`View Token Mint: https://explorer.solana.com/address/${mintKeypair.publicKey.toString()}?cluster=devnet`)
}


main();