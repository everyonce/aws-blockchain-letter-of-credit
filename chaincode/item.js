'use strict';
const shim = require('fabric-shim');
const util = require('util');

let Chaincode = class {

/**
* Initialize the state when the chaincode is either instantiated or upgraded
* 
* @param {*} stub 
*/
async Init(stub) {
console.log('=========== Init: Instantiated / Upgraded ngo chaincode ===========');
return shim.success();
}
/**
* The Invoke method will call the methods below based on the method name passed by the calling
* program.
* 
* @param {*} stub 
*/
async Invoke(stub) {
  console.log('============= START : Invoke ===========');
  let ret = stub.getFunctionAndParameters();
  console.log('##### Invoke args: ' + JSON.stringify(ret));
  
  let method = this[ret.fcn];
  if (!method) {
    console.error('##### Invoke - error: no chaincode function with name: ' + ret.fcn + ' found');
    throw new Error('No chaincode function with name: ' + ret.fcn + ' found');
  }
  try {
    let response = await method(stub, ret.params);
    console.log('##### Invoke response payload: ' + response);
    return shim.success(response);
  } catch (err) {
    console.log('##### Invoke - error: ' + err);
    return shim.error(err);
  }
}
/**
* Initialize the state. This should be explicitly called if required.
* 
* @param {*} stub 
* @param {*} args 
*/
async initLedger(stub, args) {
console.log('============= START : Initialize Ledger ===========');
console.log('============= END : Initialize Ledger ===========');
}

async create(stub, args) {
  try {
    let item = JSON.parse(args[0]);
    let Key = item.docType+'.'+item.id;
    item.status= 'NEW';
    item.history=[];
    var caller = stub.getCreator();

    //verify each entity only has one role
    
    var eventMessage=Buffer.from(JSON.stringify({"result":"SUCCESS","action":"CREATE","caller":stub.getCreator().mspid,"newStatus":item.status}));

    stub.setEvent("itemAction",eventMessage);
    await stub.putState(Key, Buffer.from(JSON.stringify(item)));

    // if it's a shipment, add a reference within the relevant orders
    if (item.docType=='SHIPMENT') {
      const uniqueOrderIds = [...new Set(item.data.shipmentItems.map(item => item.orderId))];
      uniqueOrderIds.forEach(async orderId =>  {
        //add this shipment to the order shipment list
        let orderKey = 'ORDER.'+orderId;
        let orderBytes = await stub.getState(orderKey);
        if (!orderBytes || orderBytes.length==0) {
          throw new Error("couldn't find "+orderKey);
        }
        let order = JSON.parse(orderBytes.toString());
        var historyEntry = {"result":"SUCCESS","action":"update","caller":caller.mspid,"newStatus":order.status};
        order.history.push(historyEntry);
        if (!order.data.shipments)
          order.data.shipments = [];
        order.data.shipments.push(item.id);
        await stub.putState(orderKey, Buffer.from(JSON.stringify(order)));
      });
      
    }
  } catch(error) {
    throw new Error(error);
  }
}
async get(stub, args) {
  console.log('============= START : get ===========');
  let key = args[0];
  let itemAsBytes = await stub.getState(key);
  if (!itemAsBytes || itemAsBytes.toString().length <= 0) {
    throw new Error(args[0] + ' (the arg0) does not exist: [key searched:]' + key );
  }
  return itemAsBytes;
}

async list(stub, args) {
  let docType = args[0];
  let noType = false;
  if (docType==null || docType=='') noType=true;
  let iterator = await stub.getStateByRange('','');
  let allResults = [];
  while (true) {
    let res = await iterator.next();

    if (res.value && res.value.value.toString()) {
      let jsonRes = {};
      console.log(res.value.value.toString('utf8'));

      jsonRes.Key = res.value.key;
      try {
        jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
      } catch (err) {
        console.log(err);
        jsonRes.Record = res.value.value.toString('utf8');
      }
      if (noType || jsonRes.Record.docType == docType) {
          allResults.push(jsonRes.Record);
      }
    }
    
    if (res.done) {
      console.log('end of data');
      await iterator.close();
      console.info(allResults);
      return Buffer.from(JSON.stringify(allResults));
    }
  }
}

async update(stub, args) {
  try {
    let item = JSON.parse(args[0]);
    let key = item.docType+'.'+item.id;
    //let action = item.action;

    let itemBytes = await stub.getState(key);
    if (!itemBytes || itemBytes.length==0) {
      throw new Error("couldn't find "+key);
    }
    let origItem = JSON.parse(itemBytes.toString());

    var caller = stub.getCreator();
    var response = {"result":"SUCCESS","action":"update","caller":caller.mspid,"newStatus":item.status};
    origItem.history.push(response);
    item.history=origItem.history;
    response.updatedKey=key;
    response.item=item.id;
    response.docType=item.docType;

    var resultAsBytes=Buffer.from(JSON.stringify(response));
    stub.setEvent("update",resultAsBytes);
    await stub.putState(key, Buffer.from(JSON.stringify(item)));
    return resultAsBytes;
  } catch(error) {
    throw new Error(error);
  }
} 

/**
 * Retrieves the Fabric block and transaction details for a key or an array of keys
 * 
 * @param {*} stub 
 * @param {*} args - JSON as follows:
 * [
 *    {"key": "a207aa1e124cc7cb350e9261018a9bd05fb4e0f7dcac5839bdcd0266af7e531d-1"}
 * ]
 * 
 */
async queryHistoryForKey(stub, args) {
  console.log('============= START : queryHistoryForKey ===========');
  console.log('##### queryHistoryForKey arguments: ' + JSON.stringify(args));

  // args is passed as a JSON string
  let json = JSON.parse(args);
  let key = json['key'];
  let docType = json['docType']
  console.log('##### queryHistoryForKey key: ' + key);
  let historyIterator = await stub.getHistoryForKey(docType + key);
  console.log('##### queryHistoryForKey historyIterator: ' + util.inspect(historyIterator));
  let history = [];
  while (true) {
    let historyRecord = await historyIterator.next();
    console.log('##### queryHistoryForKey historyRecord: ' + util.inspect(historyRecord));
    if (historyRecord.value && historyRecord.value.value.toString()) {
      let jsonRes = {};
      console.log('##### queryHistoryForKey historyRecord.value.value: ' + historyRecord.value.value.toString('utf8'));
      jsonRes.TxId = historyRecord.value.tx_id;
      jsonRes.Timestamp = historyRecord.value.timestamp;
      jsonRes.IsDelete = historyRecord.value.is_delete.toString();
    try {
        jsonRes.Record = JSON.parse(historyRecord.value.value.toString('utf8'));
      } catch (err) {
        console.log('##### queryHistoryForKey error: ' + err);
        jsonRes.Record = historyRecord.value.value.toString('utf8');
      }
      console.log('##### queryHistoryForKey json: ' + util.inspect(jsonRes));
      history.push(jsonRes);
    }
    if (historyRecord.done) {
      await historyIterator.close();
      console.log('##### queryHistoryForKey all results: ' + JSON.stringify(history));
      console.log('============= END : queryHistoryForKey ===========');
      return Buffer.from(JSON.stringify(history));
    }
  }
}
  
async deleteAll(stub, args) {
  //var logger = shim.NewLogger("myChaincode")
  try {
    console.log('============= START : rmrf ===========');
    let iterator = await stub.getStateByRange('', '');
    while (true) {
      const res = await iterator.next();
      console.log('##### RMRF: ' + util.inspect(res));
      if (res.value && res.value.key) {
         await stub.deleteState(res.value.key);
      }
      if (res.done) {
        console.log('end of data - closing iterator');
        var resultAsBytes=Buffer.from(JSON.stringify({"result":"SUCCESS","action":"DELETE","caller":stub.getCreator().mspid}));
        stub.setEvent("action",resultAsBytes);  
        await iterator.close();
        return;
      }
    }
  } catch(error) {
    throw new Error(error);
  }
}

}
shim.start(new Chaincode());
