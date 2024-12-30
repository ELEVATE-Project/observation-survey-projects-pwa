const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 1818;

app.use(express.static(path.join(__dirname, 'www')));

app.get('*', (req, res) => {
    res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.sendFile(path.join(__dirname, 'www', 'index.html'));
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});