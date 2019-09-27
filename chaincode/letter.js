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

/**
 * Create LC
 * 
 * 
 * @param {*} letter - the initial letter of credit. This will be JSON, as follows:
 * {
 *   "docType": "letter",
 *   "letterId": "1231-sdfsd-1231-dsfw",  -guid
 *   "letterDescription": "Delias Dainty Delights",
 *   "productDetails": [] - see product structure below
 *   "rules": [], - see rule structure below
 *   "roleIdentities": [], 
 *   "createDate": "2018-09-20T12:41:59.582Z",
 *   "closeReason": ""
 * }
 * 
 * roleIdentities: {
 *   [{"role": "SELLER",  // SELLER, SELLERBANK, BUYER, BUYERBANK, THIRDPARTY
 *     "mspid": "sdfvsdfsdfsdf"
 *     "org": "Company Name"}]
 * ]}
 * 
 * approvalRecord: [
 * {"STAGE": "NEW",
 * "ROLE":"SELLERBANK",
 * "ACTION":"ACKNOWLEDGE"}
 * ]
 * 
 * letterRequirements: [
 *   {"type":"document",
 *    "from":"msp"}
 * ]
 * 
 * productDetails: [
 * {"product": "coal",
 *  "detail1": "afsf",
 *  "detail2":"afafad"},
 * ]
 * 
 */
async createLetter(stub, args) {
  try {
   // let mylog = [];
    console.log('============= START : createLetter ===========');
    let letter = JSON.parse(args[0]);
    let Key = "LETTER."+letter.letterId;
    letter.docType= 'letter';
    letter.letterStatus= 'NEW';
    letter.approvalRecord=[];
    //verify each entity only has one role
    
    var eventMessage=Buffer.from(JSON.stringify({"result":"SUCCESS","action":"CREATE","caller":stub.getCreator().mspid,"newStatus":letter.letterStatus}));
    stub.setEvent("letterAction",eventMessage);
    await stub.putState(Key, Buffer.from(JSON.stringify(letter)));
    console.info('============= END : createLetter ===========');

  } catch(error) {
    throw new Error(error);
  }
}
async getLetter(stub, args) {
  console.log('============= START : getletter ===========');
  let letterId = args[0];
  let key = 'LETTER.' + letterId;
  
  let letterAsBytes = await stub.getState(key);
  if (!letterAsBytes || letterAsBytes.toString().length <= 0) {
    throw new Error(args[0] + ' (the arg0) does not exist: ' + Buffer.from(letterId) + ' [key searched:]' + key );
  }
  //console.log(letterAsBytes.toString());
  return letterAsBytes;
}
async deleteAllLetters(stub) {
  //var logger = shim.NewLogger("myChaincode")
  try {
    console.log('============= START : rmrf ===========');
    let iterator = await stub.getStateByRange('', '');
    while (true) {
      const res = await iterator.next();
      console.log('##### RMRF: ' + util.inspect(res));
      let jsonRes = {};
      jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
      if (jsonRes.Record.docType == 'letter') {
        console.log('##### DELETING: ' + util.inspect(res.value.key));
        await stub.deleteState(res.value.key);
      }
      if (res.done) {
        console.log('end of data - closing iterator');
        var resultAsBytes=Buffer.from(JSON.stringify({"result":"SUCCESS","action":"DELETE","caller":stub.getCreator().mspid}));
        stub.setEvent("letterAction",resultAsBytes);  

        await iterator.close();
        return;
      }
    }
  } catch(error) {
    throw new Error(error);
  }
}
async listLetters(stub, args) {
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
      if (jsonRes.Record.docType == 'letter') {
          allResults.push({
            "letterId":jsonRes.Record.letterId, 
            "letterDescription":jsonRes.Record.letterDescription, 
            "letterStatus":jsonRes.Record.letterStatus});
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
async action(stub, args) {
  try {
    let incoming = JSON.parse(args[0]);
    let key = 'LETTER.' + incoming["letterId"];
    let action = incoming["action"];
    let letterAsBytes = await stub.getState(key);
    if (!letterAsBytes || letterAsBytes.length==0) {
      throw new Error("couldn't find "+key);
    }
    let letter = JSON.parse(letterAsBytes.toString());
    var caller = stub.getCreator();
    let callerRoles = letter.roleIdentities.filter(role => role.mspid==caller.mspid).map(y => y.role).reduce((a, b) => a.concat(b), []);
    console.log(">>> ACTION: "+ "Caller: " + caller.mspid + ", Action: " + action + ", Status: " + letter.letterStatus + ", MSP-roles:"+callerRoles.join(","));
    let badAction = function(){
      var errorText="{'error':'Caller: " + caller.mspid + "(ROLES: " + callerRoles.join(",") + ") not permitted to " + action + " while letter status is " + letter.letterStatus + "'}";
      var resultAsBytes=Buffer.from(JSON.stringify({"letterId":letter.letterId,"result":"ERROR","action":action,"caller":caller.mspid,"newStatus":letter.letterStatus}));
      stub.setEvent("letterAction",resultAsBytes);  
      throw new Error(errorText);
    };

    var actorRoles=[];
    switch (letter.letterStatus) {
      case "NEW":
        actorRoles=["SELLERBANK"];
        if (action=="CONFIRM" && callerRoles.includes("SELLERBANK")) {
          callerRoles.filter(x=> actorRoles.includes(x)).forEach(role=>{
            letter.approvalRecord.push({"STAGE": letter.letterStatus, "ROLE":role, "MSP":caller.mspid, "ACTION":action, "TIMESTAMP":stub.getTxTimestamp()});
          });
          letter.letterStatus="TERMS_SELLER_APPROVAL";
        } else {
          return badAction();
        }
        break;
      case "TERMS_SELLER_APPROVAL":
      case "TERMS_BUYER_APPROVAL":
        var actor = (letter.letterStatus=="TERMS_SELLER_APPROVAL")?"SELLER":"BUYER";
        actorRoles=[actor+"BANK",actor];
        // actor APPROVE
        if (action=="APPROVE" && callerRoles.some(x=> actorRoles.includes(x))) {
          console.log("Running APPROVE on letter " + letter.letterId + " as actor: " + actor);
          callerRoles.filter(x=> actorRoles.includes(x)).forEach(role=>{
            letter.approvalRecord.push({"STAGE": letter.letterStatus, "ROLE":role, "MSP":caller.mspid, "ACTION":action, "TIMESTAMP":stub.getTxTimestamp()});
          });
          console.log("approval records: " + util.inspect(letter.approvalRecord));
          console.log("actor Roles: " + util.inspect(actorRoles));
          //full actor approval means we can skip buyer re-approval
          if (actorRoles.every(role => letter.approvalRecord.map(y => y.ROLE).reduce((a, b) => a.concat(b), []).includes(role))) {
             letter.letterStatus="TERMS_APPROVED";
             console.log("All required approval roles have approved, setting to APPROVED.");
          } else {
             console.log("Still waiting on additional approvals.");
          }
             
        // actor COUNTER
        } else if (action=="COUNTER" && callerRoles.some(x=> actorRoles.includes(x))) {
          console.log("Running COUNTER on letter " + letter.letterId + " as actor: " + actor);
          //remove all approvals due to counter
          letter.approvalRecord = letter.approvalRecord.filter(x => ["TERMS_SELLER_APPROVAL","TERMS_BUYER_APPROVAL"].includes(x["STAGE"]));
          letter.productDetails = incoming["counter"].productDetails;
          letter.rules = incoming["counter"].rules;
          letter.letterStatus=( (actor=="SELLER")?"TERMS_BUYER_APPROVAL":"TERMS_SELLER_APPROVAL" );
        } else {
          return badAction();
        }
        break;
      case "TERMS_APPROVED":
        actorRoles=["SELLER"];
        if (action=="CONFIRM" && callerRoles.some(x=> actorRoles.includes(x))) {
          callerRoles.filter(x=> actorRoles.includes(x)).forEach(role=>{
            letter.approvalRecord.push({"STAGE": letter.letterStatus, "ROLE":role, "MSP":caller.mspid, "ACTION":action, "TIMESTAMP":stub.getTxTimestamp()});
          });
          letter.letterStatus="SHIPPED";
        } else {
          return badAction();
        }
        break;
      case "SHIPPED":
        actorRoles=["SELLER", "THIRDPARTY"];
        if (action=="CONFIRM" && callerRoles.includes("SELLER")){
          //CHECK FOR EXISTENCE OF REQUIRED AUTOMATIC RULES
          //CHECK FOR SIGNOFF ON MANUAL RULES
          callerRoles.filter(x=> actorRoles.includes(x)).forEach(role=>{
            letter.approvalRecord.push({"STAGE": letter.letterStatus, "ROLE":role, "MSP":caller.mspid, "ACTION":action, "TIMESTAMP":stub.getTxTimestamp()});
          });
          letter.letterStatus="PACKET_SELLER_READY";
        } else if (action=="ADD_DOCUMENT" && callerRoles.some(x=> actorRoles.includes(x))) {
          //add documents
        } else {
          return badAction();
        }
        break;
      case "PACKET_SELLER_READY":
        actorRoles=["SELLERBANK"];
        if (action=="APPROVE" && callerRoles.some(x=> actorRoles.includes(x))) {
          callerRoles.filter(x=> actorRoles.includes(x)).forEach(role=>{
            letter.approvalRecord.push({"STAGE": letter.letterStatus, "ROLE":role, "MSP":caller.mspid, "ACTION":action, "TIMESTAMP":stub.getTxTimestamp()});
          });
          letter.letterStatus="PACKET_BUYER_READY";
        } else {
          return badAction();
        }
        break;
      case "PACKET_BUYER_READY":
        actorRoles=["BUYERBANK"];
        if (action=="APPROVE" && callerRoles.some(x=> actorRoles.includes(x))) {
          callerRoles.filter(x=> actorRoles.includes(x)).forEach(role=>{
            letter.approvalRecord.push({"STAGE": letter.letterStatus, "ROLE":role, "MSP":caller.mspid, "ACTION":action, "TIMESTAMP":stub.getTxTimestamp()});
          });
          letter.letterStatus="CLOSED";
        } else {
          return badAction();
        }
        break;
      default:
          if (action=="FORCEUPDATESTATUS") {
            letter.letterStatus=incoming.status;
            //force=true;
          } else {
             return badAction();
          }
    }
    var resultAsBytes=Buffer.from(JSON.stringify({"letterId":letter.letterId,"result":"SUCCESS","action":action,"caller":caller.mspid,"newStatus":letter.letterStatus}));
    stub.setEvent("letterAction",resultAsBytes);
    await stub.putState("LETTER."+letter.letterId, Buffer.from(JSON.stringify(letter)));
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
  
}
shim.start(new Chaincode());
