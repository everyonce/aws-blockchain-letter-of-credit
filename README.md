# aws-blockchain-letter-of-credit

This project will create an Amazon Managed Blockchain network, member, and peer node, as well as an EC2 instance with surrounding networking.  The script will use the EC2 to then do the following:
- create a hyperledger fabric channel
- join the peer node to the channel
- install letter-of-credit chaincode to peer node
- instantiate the letter-of-credit chaincode to blockchain network channel
- deploy react html front end site
- deploy golang api layer (that in this case, also serves the static content for the react site)

Use the cloudformation template in the cf-template.yaml file to deploy this using cloudformation.  I'd use us-east-1 for now until I have a chance to test elsewhere :-)
