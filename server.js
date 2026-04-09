const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8181;

app.use('/ml', express.static(path.join(__dirname, 'www', 'browser')));

app.get('/ml/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'www', 'browser', 'index.html'));
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});