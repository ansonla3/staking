const { Keyring, encodeAddress } = require('@polkadot/keyring');
const { ApiPromise, WsProvider } = require('@polkadot/api');
const { hexToU8a } = require('@polkadot/util');

let api = null

const main = async () => {
    try {
        const wsProvider = new WsProvider(process.env.WS_ENDPOINT)
        api = await ApiPromise.create({  provider: wsProvider })

        const keyring = new Keyring({ type: 'sr25519' })
        const account = keyring.addFromMnemonic(process.env.MNEMONIC)
        // Support addFromSeed
        //const account = keyring.addFromSeed(hexToU8a(YOUR_SEED))

        const role = process.argv[2]
        const address = encodeAddress(account.address, 2)

        const currentEra = await api.query.staking.activeEra()
        const { raw } = await api.query.staking.ledger(address)
        const numOfUnclaimPayouts =  currentEra.toJSON().index - raw.toJSON().lastReward - 1

        console.log(`Your address is ${address}`)
        console.log(`You have ${numOfUnclaimPayouts} unclaim payouts.`)
        console.log(`You last payout era is ${raw.lastReward}`)
        
        if (numOfUnclaimPayouts > 0) {

            const payoutCalls = []
            let i = 1
            while (i <= numOfUnclaimPayouts) {
                const idx = raw.toJSON().lastReward + i
                payoutCalls.push(isNominator(role, idx))
                i+=1
            }

            const txHash = await api.tx.utility
                .batch(payoutCalls)
                .signAndSend(account)
            console.log(`Submitted with hash ${txHash.toHex()}`)

        } else {
            console.log("All payouts have been claimed.")
        }

    } catch (err) {
        console.log("Something is wrong with your address. :", err)
    }
}

// role: 0 => Nominator, 1 => Validator
const isNominator = (role, idx) => (
    roleResult = role == 0 ? api.tx.staking.payoutNominator(idx, []) : api.tx.staking.payoutValidator(idx)
)

main().then(() => { process.exit(0) })
