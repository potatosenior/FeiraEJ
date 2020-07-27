const app = require('./App');

app.listen(process.env.PORT || 3333);

console.log("Server started at ", process.env.PORT || 3333);