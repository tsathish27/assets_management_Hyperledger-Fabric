require('dotenv').config();
const express = require('express');
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());

async function getContract() {
   const ccpPath = path.resolve(__dirname, '..', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
   
   
   
   const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

   const walletPath = process.env.WALLET_PATH || path.join(process.cwd(), 'wallet');
   const wallet = await Wallets.newFileSystemWallet(walletPath);

   const gateway = new Gateway();
   await gateway.connect(ccp, {
      wallet,
      identity: 'appUser', // Make this dynamic if needed
      discovery: { enabled: true, asLocalhost: true }
   });

   const network = await gateway.getNetwork(process.env.CHANNEL_NAME);
   return network.getContract(process.env.CONTRACT_NAME);
}

app.post('/createAsset', async (req, res) => {
   const { dealerID, msisdn, mpin, balance, status, transAmount, transType, remarks } = req.body;

   try {
      const contract = await getContract();
      await contract.submitTransaction('createAsset', dealerID, msisdn, mpin, balance, status, transAmount, transType, remarks);
      res.status(200).send('Asset created successfully');
   } catch (error) {
      res.status(500).send(error.toString());
   }
});

app.get('/readAsset/:msisdn', async (req, res) => {
   try {
      const contract = await getContract();
      const result = await contract.evaluateTransaction('readAsset', req.params.msisdn);
      res.status(200).json(JSON.parse(result.toString()));
   } catch (error) {
      res.status(500).send(error.toString());
   }
});

app.get('/', (req, res) => {
   res.send('Welcome to the Fabric REST API!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});
