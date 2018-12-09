const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const timeout = require('connect-timeout');
const models = require('./src/models');
const appConfig = require('./src/config/app');

const app = express();
app.disable('etag');
app.disable('x-powered-by');
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(timeout('5s'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/vk', async (req, res) => {
  const {
    type,
    group_id
  } = req.body;

  console.log({ body: req.body });

  if (type === 'confirmation' && String(group_id) === '175055996') {
    return res.send('77f9b735');
  }

  return res.send('fail');
});

app.listen(appConfig.portIntegration, () => {
  console.log('integration server started');
});
