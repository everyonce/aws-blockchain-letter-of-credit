

export default function getStatusTypes() 
{
    return  (
[{
    status: "NEW",
    desc: "Waiting on Selling Bank to CONFIRM receipt",
    whoCan: [
        {"SellerBank": ["CONFIRM"]}
    ]
},
{
    status: "TERMS_SELLER_APPROVAL",
    desc: "Waiting on Selling Bank to APPROVE terms or COUNTER",
    whoCan: [
        {"SellerBank": ["APPROVE", "COUNTER"]}
    ]
},
{
    status: "TERMS_BUYER_APPROVAL",
    desc: "Waiting on Buying Bank to APPROVE terms or COUNTER",
    whoCan: [
        {"BuyerBank": ["APPROVE", "COUNTER"]}
    ]
},
{
    status: "TERMS_APPROVED",
    desc: "Waiting on Seller to CONFIRM shipment",
    whoCan: [
        {"Seller": ["CONFIRM"]}
    ]
},
{
    status: "SHIPPED",
    desc: "Waiting on Seller and ThirdParties to add documents and once complete, CONFIRM packet",
    whoCan: [
        {"Seller": ["CONFIRM"]}
    ]
},
{
    status: "PACKET_SELLER_READY",
    desc: "Waiting on Selling Bank to APPROVE packet",
    whoCan: [
        {"SellerBank": ["APPROVE"]}
    ]
},
{
    status: "PACKET_BUYER_READY",
    desc: "Waiting on Buying Bank to APPROVE packet",
    whoCan: [
        {"BuyerBank": "APPROVE"}
    ]
},
{
    status: "CLOSED",
    desc: "No further actions needed",
    whoCan: []
}
]
    )};