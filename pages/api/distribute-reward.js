const { DefenderRelayProvider, DefenderRelaySigner } = require("defender-relay-client/lib/ethers");
const { Contract } = require("ethers");
const { RelayClient } = require( 'defender-relay-client');
import {ChainConfig} from '../../config'
const bodyParser = require('body-parser');
import * as dotenv from 'dotenv'
dotenv.config()
//server.use(bodyParser.json()); // for parsing application/json

let Rewardabi = ChainConfig.bnb.testnet.Rewardabi;

let RewardcontractAddress = ChainConfig.bnb.testnet.address;
const credentials = { apiKey: process.env.APIKEY,
                      apiSecret: process.env.SECRET };

export default async function handle(req, res) {
  if (req.method === 'POST') {
    try {
      const jsonParser = bodyParser.json()
      jsonParser(req, null, () => {});
      const {address, amount} = req.body;
      let tx = await DistReward(address, amount);
          await tx.wait();
          res.status(200).json({ message: 'Transaction sent and confirmed',tx });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error' });
  }
} else {
  res.status(404).json({ message: 'Invalid request method' });
}
}



async function DistReward(address,amount) {

  const provider = new DefenderRelayProvider(credentials);
  const signer = new DefenderRelaySigner(credentials, provider, { speed: "fast" });

  const RewardContract = new Contract(RewardcontractAddress, Rewardabi, signer);
  let tx = await RewardContract.distributeReward(address,amount);
  // await tx.wait();

  console.log(tx);
  return tx;

}

//("0x7B1599fd58dA00DC505157F783Ef4d4D39145b81","1000000000")
