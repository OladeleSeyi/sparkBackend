const queries = {
  getBalances: `
  { getBalances(cryptocurrency: naira_token){
     id
     confirmedBalance
     cryptocurrency
   }}
   `,
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
};

export { queries, mutations };
