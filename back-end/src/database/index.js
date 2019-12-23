const mongoose = require("mongoose");

global.db = mongoose.connect("mongodb://localhost:27017/api", {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.on("connected", function() {
  console.log("=====Conexão estabelecida com sucesso=====");
});
mongoose.connection.on("error", function(err) {
  console.log("=====Ocorreu um erro: " + err);
});
mongoose.connection.on("disconnected", function() {
  console.log("=====Conexão finalizada=====");
});

module.exports = mongoose;
