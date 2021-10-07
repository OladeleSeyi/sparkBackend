export async function main(event, ctx) {
  const data = JSON.parse(event.body)

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Go Serverless v2.0! ${await message({
        time: 1,
        copy: "Your function executed successfully!",
      })}`,
    }),
  };
}
