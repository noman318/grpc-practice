import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);

const todoPackage = grpcObject.todoPackage;

const client = new todoPackage.Todo(
  "localhost:4000",
  grpc.credentials.createInsecure()
);

let text = process.argv[2];
client.createTodo(
  {
    id: 122,
    text: text,
  },
  (err, response) => {
    if (err) {
      console.log("Error In grpc call", err);
    } else {
      console.log("Response from server for create", JSON.stringify(response));
    }
  }
);

// client.readTodos({}, (err, response) => {
//   if (err) {
//     console.log("Error In grpc call", err);
//   } else {
//     if (!response.items) {
//       response?.items?.forEach((a) => a?.text);
//     }
//     console.log("Response from server", JSON.stringify(response));
//   }
// });

const call = client.readTodoStream();
call.on("data", (response) => {
  console.log("Response from server stream", JSON.stringify(response));
});
call.on("end", () => {
  console.log("Server Done");
});
