const app = require("./app");
const port = process.env.PORT || 8081

app.listen(port, () => console.log(`server starting on port ${port}!`));