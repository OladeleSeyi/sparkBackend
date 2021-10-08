const queries = {
  getBalances: `
  { getBalances(cryptocurrency: naira_token){
     id
     confirmedBalance
     cryptocurrency
   }}
   `,
  getPrice: `{
    getPrices(cryptocurrency: bitcoin, side: buy) {
      id
      buyPricePerCoin
      sellPricePerCoin
      cryptocurrency
      expiresAt
      status
      minBuy
    }
  }`,
  destroyDeposit: ``,
};

const mutations = {
  createDeposit: `mutation createDeposit($amount: BigDecimal!, $redirectLink: String){
        createSendCashPayDeposit(amount: $amount, redirectLink: $redirectLink){
        amount
        createdAt
        fee
        reference
        link
        id
        totalAmount
        type
  }
    }`,
  destroyDeposit: `mutation destroyDeposit($payment: ID!){
        cancelSendCashPayDeposit(payment: $payment){
            amount
            createdAt
            fee
            id
            link
            reference
            status
            totalAmount
            type
        }
    }`,
  buyCoins: `mutation buyCoins($price: ID!, $amount: BigDecimal!){
    buy(cryptocurrency:bitcoin, price: $price , coin_amount: $amount){
      createdAt
      filledCoinAmount
      id
      price {
        minBuy
      }
      status
    }
  }`,
  sendCoins: `mutation sendCoins($address: String!, $amount: BigDecimal!){
    send(cryptocurrency: bitcoin, address: $address, amount: $amount, chain: BTC) {
      id
      address
      amount
      cryptocurrency
      fee
      status
      transaction {
        txhash
        id
      }
    }
  }`,
};

export { queries, mutations };
