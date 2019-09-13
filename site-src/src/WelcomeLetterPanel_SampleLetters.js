const uuidv4 = require('uuid/v4');

export default function SampleLetters(memberId) { 
    return (
[
{
    "letterId": uuidv4(),
    "letterDescription": "Coal Purchase",
    "productDetails": [
      { "productSku": "HICARBONCOAL",
        "quantity": "50000",
        "quantity_unit": "TON",
        "delivery": "freight"},
      { "productSku": "MIDCARBONCOAL",
          "quantity": "10000",
          "quantity_unit": "TON",
          "delivery": "barge-freight"}
    ],
    "rules": [
      { "ruleNum": "4",
        "ruleType": "autoMetrics",
        "metric": "WATER_PERCENTAGE",
        "metricRuleOperation": "GT",
        "metricRuleThreshold": "0.05",
        "metricProviders": [
          {
            "role": "THIRDPARTY",
            "mspid": memberId,
            "org": "DemoOrg"
          }
        ] },
      { "ruleNum":"1",
          "ruleType":"manualCertification",
          "metric":"WEIGHT",
          "manualRuleDescription":"must weight within 5% of agreed amount" }
    ],
    "roleIdentities": [
      { "role": "SELLER",
        "mspid": memberId,
        "org": "DemoOrg" },
      { "role": "SELLERBANK",
        "mspid": memberId,
        "org": "DemoOrg"},
      { "role": "BUYER",
        "mspid": memberId,
        "org": "DemoOrg"},
      { "role": "BUYERBANK",
        "mspid": memberId,
        "org": "DemoOrg"},
      { "role": "THIRDPARTY",
        "mspid": memberId,
        "org": "DemoOrg" }
    ]
  },


  {
    "letterId": uuidv4(),
    "letterDescription": "Widgets Int'l",
    "letterTotalPayment": "",
    "productDetails": [
      { "productSku": "SpinToy",
        "quantity": "1000",
        "quantity_unit": "CASE_1000_PER",
        "delivery": "freight"}
    ],
    "rules": [
      { "ruleNum": "1",
        "ruleType": "autoMetrics",
        "metric": "SKU_SCAN",
        "metricRuleOperation": "EQ",
        "metricRuleThreshold": "100%",
        "metricProviders": [
          {
            "role": "THIRDPARTY",
            "mspid": memberId,
            "org": "DemoOrg"
          }
        ] }
    ],
    "roleIdentities": [
      { "role": "SELLER",
        "mspid": memberId,
        "org": "DemoOrg" },
      { "role": "SELLERBANK",
        "mspid": memberId,
        "org": "DemoOrg"},
      { "role": "BUYER",
        "mspid": memberId,
        "org": "DemoOrg"},
      { "role": "BUYERBANK",
        "mspid": memberId,
        "org": "DemoOrg"},
      { "role": "THIRDPARTY",
        "mspid": memberId,
        "org": "DemoOrg" }
    ]
  },

]


    )};