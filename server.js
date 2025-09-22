const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

const startServer = (port, corsPolicy) => {
  app.use(cors({ origin: corsPolicy }));

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

module.exports = startServer;