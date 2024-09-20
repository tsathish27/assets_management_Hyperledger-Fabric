'use strict';

const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

   // Create a new asset
   async createAsset(ctx, dealerID, msisdn, mpin, balance, status, transAmount, transType, remarks) {
      const asset = {
         dealerID,
         msisdn,
         mpin,
         balance: parseInt(balance),
         status,
         transAmount: parseInt(transAmount),
         transType,
         remarks
      };

      // Ensure the asset doesn't already exist
      const assetExists = await this.assetExists(ctx, msisdn);
      if (assetExists) {
         throw new Error(`Asset with MSISDN ${msisdn} already exists`);
      }

      // Store the asset on the ledger
      await ctx.stub.putState(msisdn, Buffer.from(JSON.stringify(asset)));
      return JSON.stringify(asset);
   }

   // Read an asset from the world state
   async readAsset(ctx, msisdn) {
      const assetJSON = await ctx.stub.getState(msisdn); // Get asset from the ledger
      if (!assetJSON || assetJSON.length === 0) {
         throw new Error(`Asset with MSISDN ${msisdn} does not exist`);
      }
      return assetJSON.toString();
   }

   // Update an existing asset on the ledger
   async updateAsset(ctx, dealerID, msisdn, mpin, balance, status, transAmount, transType, remarks) {
      const assetExists = await this.assetExists(ctx, msisdn);
      if (!assetExists) {
         throw new Error(`Asset with MSISDN ${msisdn} does not exist`);
      }

      const updatedAsset = {
         dealerID,
         msisdn,
         mpin,
         balance: parseInt(balance),
         status,
         transAmount: parseInt(transAmount),
         transType,
         remarks
      };

      await ctx.stub.putState(msisdn, Buffer.from(JSON.stringify(updatedAsset)));
      return JSON.stringify(updatedAsset);
   }

   // Delete an asset from the ledger
   async deleteAsset(ctx, msisdn) {
      const assetExists = await this.assetExists(ctx, msisdn);
      if (!assetExists) {
         throw new Error(`Asset with MSISDN ${msisdn} does not exist`);
      }

      await ctx.stub.deleteState(msisdn);
      return `Asset with MSISDN ${msisdn} has been deleted`;
   }

   // Check if an asset exists on the ledger
   async assetExists(ctx, msisdn) {
      const assetJSON = await ctx.stub.getState(msisdn);
      return assetJSON && assetJSON.length > 0;
   }

   // Query transaction history for a given asset
   async getAssetHistory(ctx, msisdn) {
      const historyIterator = await ctx.stub.getHistoryForKey(msisdn);
      const history = [];

      while (true) {
         const res = await historyIterator.next();
         if (res.value) {
            const record = {
               txId: res.value.txId,
               timestamp: res.value.timestamp,
               isDelete: res.value.isDelete,
               value: res.value.isDelete ? undefined : JSON.parse(res.value.value.toString('utf8')),
            };
            history.push(record);
         }

         if (res.done) {
            await historyIterator.close();
            return JSON.stringify(history);
         }
      }
   }

   // Query all assets in the ledger
   async queryAllAssets(ctx) {
      const startKey = '';
      const endKey = '';
      const iterator = await ctx.stub.getStateByRange(startKey, endKey);
      const allResults = [];

      while (true) {
         const res = await iterator.next();
         if (res.value) {
            const asset = JSON.parse(res.value.value.toString('utf8'));
            allResults.push(asset);
         }
         if (res.done) {
            await iterator.close();
            return JSON.stringify(allResults);
         }
      }
   }
}

module.exports = AssetTransfer;
