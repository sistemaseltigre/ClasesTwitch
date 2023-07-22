import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CounterSolang } from "../target/types/counter_solang";
import { assert } from "chai"

describe("counter-solang", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  // Generate a new random keypair for the data account.
  const dataAccount = anchor.web3.Keypair.generate()
  const signAccount = anchor.web3.Keypair.generate()
  const wallet = provider.wallet
  
  

  const program = anchor.workspace.CounterSolang as Program<CounterSolang>

  it("Is initialized!", async () => {
    console.log("Your data account address", dataAccount.publicKey.toBase58())
    // Initialize new Counter account
    const tx = await program.methods
      .new(wallet.publicKey) // wallet.publicKey is the payer for the new account
      .accounts({ dataAccount: dataAccount.publicKey, payer: wallet.publicKey, systemProgram: anchor.web3.SystemProgram.programId })
      .signers([dataAccount]) // dataAccount keypair is a required signer because we're using it to create a new account
      .rpc().catch((err) => { console.log(err) })
    console.log("Your transaction signature", tx)

    // Fetch the counter value
    const val = await program.methods
      .get()
      .accounts({ dataAccount: dataAccount.publicKey })
      .view()

    assert(Number(val) === 0)
    console.log("Count:", Number(val))
  })

  it("Increment", async () => {
    // Increment the counter
    const tx = await program.methods
      .inc()
      .accounts({ dataAccount: dataAccount.publicKey })
      .rpc()
    console.log("Your transaction signature", tx)

    // Fetch the counter value
    const val = await program.methods
      .get()
      .accounts({ dataAccount: dataAccount.publicKey })
      .view()

    assert(Number(val) === 1)
    console.log("Count:", Number(val))
  })
  

});
