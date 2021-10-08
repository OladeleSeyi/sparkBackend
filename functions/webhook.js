export async function main(event, ctx) {
  const data = JSON.parse(event.body);

  console.log("req", data);

  switch (data.payload.event) {
    case "deposit.success":
      console.log("deposit success");
      break;
    case "deposit.failed":
      console.log("deposit failure");
      break;
    case "order.succeeded":
      console.log("order succeeded");
      break;
    case "order.failed":
      console.log("order failed");
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Go Serverless v2.0! `,
    }),
  };
}
