const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const models = require('./src/models');
const appConfig = require('./src/config/app');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/vk', async (req, res) => {
  const {
    type,
    group_id
  } = req.body;

  if (type === 'confirmation' && group_id === 175055996) {
    return res.send('77f9b735');
  }

  // fkm44kGzdPGJa7eHVekrPmQrOOo
});

app.listen(appConfig.portIntegration, () => {
  console.log('integration server started');
});