import {
    Connection,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    PublicKey, Transaction, TransactionInstruction, sendAndConfirmTransaction
} from "@solana/web3.js";


const connection = new Connection(clusterApiUrl("devnet"), "single");

const privateKeyString =
    "65eacfc4f94dbfe60519a8771195053c17cd8148589750938cb9471ee44949381f5b7042354a7aba5f1168d383d7c1c4f43f640479259fd7e7c41f9bc880ccfa";

const privateKeyBytes = new Uint8Array(
    // @ts-ignore
    privateKeyString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16))
);
const payer = Keypair.fromSecretKey(privateKeyBytes);

console.log(payer.secretKey);

const program_id = new PublicKey("CrMWLPYrya9Y99EUNsL1WpdEvZBDtFH3vUd7EmCux7ei");

(async () => {
    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    console.log("Payer address:", payer.publicKey.toBase58());

    //////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    // get the current balance of the `payer` account on chain
    var currentBalance = await connection.getBalance(payer.publicKey);
    console.log("Current balance of 'payer' (in lamports):", currentBalance);
    console.log(
        "Current balance of 'payer' (in SOL):",
        currentBalance / LAMPORTS_PER_SOL
    );

    // airdrop on low balance
    if (currentBalance <= LAMPORTS_PER_SOL) {
        console.log("Low balance, requesting an airdrop...");
        await connection.requestAirdrop(payer.publicKey, LAMPORTS_PER_SOL);
        currentBalance = await connection.getBalance(payer.publicKey);
        console.log("Current balance of 'payer' (in lamports):", currentBalance);
        console.log(
            "Current balance of 'payer' (in SOL):",
            currentBalance / LAMPORTS_PER_SOL
        );
    }
    // create an empty transaction
    const transaction = new Transaction();

    // add a hello world program instruction to the transaction
    transaction.add(
        new TransactionInstruction({
            keys: [
                {
                    isSigner: false,
                    isWritable: false,
                    pubkey: payer.publicKey,
                },
            ],
            programId: program_id,
            data: Buffer.from([]),
        })
    );

    // send the transaction to the Solana cluster
    console.log("Sending transaction...");
    const txHash = await sendAndConfirmTransaction(connection, transaction, [
        payer,
    ]);
    console.log("Transaction sent with hash:", txHash);
})();
