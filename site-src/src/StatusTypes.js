

export default function getStatusTypes() 
{
    let order =
[{
    status: "NEW",
    desc: "Waiting on system approvals"
},
{
    status: "PRODUCTION",
    desc: "Item(s) in manufacturing"
},
{
    status: "DIST_SHIPPED_PARTIAL",
    desc: "Part of this order has been shipped to distribution"
},
{
    status: "DIST_SHIPPED_FULL",
    desc: "Full order has been shipped to distribution"
},
{
    status: "FULFILLED",
    desc: "Order has been fulfilled to warehouses"
}
];
let shipment = [
    {
        status: "SHIPPED",
        desc: "Shipment has been shipped"
    },
    {
        status: "DELIVERED",
        desc: "Shipment has been delivered"
    }
    ];
    let val={};
val.order=order;
val.shipment=shipment;
return val;
    };