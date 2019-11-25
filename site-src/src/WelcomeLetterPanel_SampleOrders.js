const uuidv4 = require('uuid/v4');

export default function SampleData(memberId) { 
  console.log("Defining demo letter structures for memberId:" + memberId);
  let id1 = uuidv4();
  let id2 = uuidv4();
  let data=
[
   {
    "id": id1,
    "docType":"ORDER",
    "data":{
      "description": "Phone Parts Order 1234",
      "lineItems": [
        { "sku": "iPhone6S_Battery",
          "quantity": "700",
          "quantity_unit": "item",
          "delivery": "freight",
          "costPer": "15",
        "totalCost": "10500"},
        { "sku": "iPhone6S_Display",
          "quantity": "150",
          "quantity_unit": "item",
          "delivery": "barge-freight",
        "costPer":"50",
      "totalCost":"7500"}
      ],
      "fulfillmentSteps" : [
        "PRODUCTION",
        "SHIPPED_PARTIAL",
        "SHIPPED_FULL",
        "WAREHOUSE",
        "DELIVERED"
      ]
    }
  },
  {
    "id": id2,
    "docType":"ORDER",
    "data":{
      "description": "Android Phones Order 1887",
      "lineItems": [
        { "sku": "Galaxy10",
          "quantity": "100",
          "quantity_unit": "item",
          "delivery": "freight",
          "costPer":"500",
        "totalCost":"50000"},
        { "sku": "GalaxyNote3",
          "quantity": "75",
          "quantity_unit": "item",
          "delivery": "barge-freight",
          "costPer":"400",
        "totalCost":"30000"}
      ]
    }
  },
    {
      "id":uuidv4(),
      "docType":"SHIPMENT",
      "data":{
        
        "shipmentItems":[
          {
            "orderId":id1,
            "sku": "iPhone6S_Battery",
            "quantity":"5"
          },
          {
            "orderId":id1,
            "sku": "iPhone6S_Display",
            "quantity":"10"
          },
          {
            "orderId":id2,
            "sku": "Galaxy10",
            "quantity":"10"
          },
        ]
      }
    }
  ];

  return data;
}
