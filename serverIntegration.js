require('./bootstrap');
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
  console.log({ body: req.body });

  switch (req.body.type) {
    case 'confirmation':
      return String(req.body.group_id) === '175055996' ? res.send('77f9b735') : res.send('fail');

    case 'vkpay_transaction':
      // Объект, содержащий поля:
      // from_id — идентификатор пользователя-отправителя перевода;
      // amount — сумма перевода в тысячных рубля;
      // description — комментарий к переводу;
      // date — время отправки перевода в Unixtime.
      const strategy = await models.Strategy.findByPk(req.body.object.description);
      if (null === strategy) {
        return res.send('fail');
      }
      await models.Transaction.create({
        strategy_id: strategy.id,
        amount: req.body.object.amount / 1000
      });
      return res.send('ok');

    default:
      return res.send('fail');
  }
});

app.listen(appConfig.portIntegration, () => {
  console.log('integration server started');
});
