import {
  getOrder,
  getRequest,
  onDeposit,
  onOrderConfirmation,
} from "./helper_functions";

export async function main(event, ctx) {
  const data = JSON.parse(event.body);

  console.log("req", data);

  switch (data.payload.event) {
    case "deposit.success":
      console.log("deposit success", data.payload.data.reference);
      try {
        const request = await getRequest(data.payload.data.reference);
        const buyOrder = await onDeposit(request);
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: `Go Serverless v2.0! `,
            request,
            buyOrder,
          }),
        };
      } catch (e) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: e.message,
          }),
        };
      }
      break;
    case "deposit.failed":
      console.log("deposit failure");
      break;
    case "order.succeeded":
      console.log("order succeeded", data.payload.data.orderId);
      try {
        const orderRequest = await getOrder(data.payload.data.orderId);
        const send = await onOrderConfirmation(orderRequest);
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: `Go Serverless v2.0! `,
            orderRequest,
            send,
          }),
        };
      } catch (e) {
        return {
          statusCode: 500,
          body: JSON.stringify({
            message: e.message,
          }),
        };
      }
      break;
    case "order.failed":
      console.log("order failed");
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }
}
