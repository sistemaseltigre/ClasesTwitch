
//importar modulo de la carpeta node modules
const web3 = require('@solana/web3.js');

//destructurar el modulo web3 para obtener las funciones que necesitamos
const { Connection, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } = web3;

//declaramos el rpc de quicknode para conectarnos al cluster devnet
const QUICKNODE_RPC = 'YOUR QUICKNODE RPC LINK HERE';

//establecer conexion con el cluster en devnet
const SOLANA_CONNECTION_TX = new Connection(QUICKNODE_RPC);

//elegimos la direccion wallet con la que queremos trabajar
const WALLET_ADDRESS_CHUO = 'GKzwank3rqV73sJPM1QWbmDN4sL9tcy3KTNhTnZDVaoT';

//crear una funcion que ejecute todo lo anterior y nos de el balance
async function sergiotechx(PX) {
	let wallet_test = new PublicKey(PX);
	console.log("pubky",wallet_test);
	let saldo_en_la_wallet = await SOLANA_CONNECTION_TX.getBalance(wallet_test);
	console.log(`La wallet es: ${PX}`)
	console.log(`saldo sin dividir: ${saldo_en_la_wallet}`)
	console.log(`Saldo wallet es: ${saldo_en_la_wallet/LAMPORTS_PER_SOL}`)
}

//ejecutamos la funcion
sergiotechx("GKzwank3rqV73sJPM1QWbmDN4sL9tcy3KTNhTnZDVaoT");