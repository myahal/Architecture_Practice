const express = require("express")
const app = express()

app.get('/api/ping', (req, res) => {
  res.json({params: 'Ping OK!'});
 });

app.listen(3000, () => console.log('Example app listening on port 3000'))