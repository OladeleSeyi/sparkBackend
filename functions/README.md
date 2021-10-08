User stories
User picks tip amount.
User gets informed of the current price
If the order is agreed on … User gets a bill and is asked to deposit the

Routes

- Generate request to buy: collect the email of the buyer, and the amount they are to pay in Naira and save it. Generate a deposit order.

  id
  email
  amount
  createdAt
  id (depositId)
  link
  reference
  btcAmount (amount to buy)
  networkFee (transactionAmount)
  totalBtcAmount (money +fee)
  safetyAmount (small change to save us incase BTC rise)

Webhook (to confirm payment reciept )

Email once the confirmation of the payment (eNaira has been made)
