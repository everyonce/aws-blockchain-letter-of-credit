// THIS FILE IS OVERWRITTEN AND POPULATED BY THE CLOUDFORMATION 
// SCRIPT.  ONLY USE FOR DEV/TEST OUTSIDE OF CLOUDFORMATION 
// DEPLOYMENT
export default function NetworkConstants() { 
    return {
"NetworkId":(process.env.REACT_APP_NETWORKID || "n-XXXX"),
"MemberId":(process.env.REACT_APP_MEMBERID || "m-XXXX")
}};