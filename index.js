import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);

const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();

server.bindAsync(
  "0.0.0.0:4000",
  grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error("Server failed to bind:", err);
    } else {
      console.log(`Server is running on port ${port}`);
    }
  }
);
server.addService(todoPackage.Todo.service, {
  createTodo: createTodo,
  readTodos: readTodos,
  readTodoStream: readTodoStream,
});

const todos = [];
function createTodo(call, callback) {
  const todoItem = {
    id: todos.length + 1,
    text: call?.request?.text,
  };
  todos.push(todoItem);
  callback(null, todoItem);
}

function readTodos(call, callback) {
  callback(null, { items: todos });
}

function readTodoStream(call, callback) {
  todos.forEach((todo) => call.write(todo));
  call.end();
}
