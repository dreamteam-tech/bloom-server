const models = require('../models');

module.exports = {
  rawQuery(sql, replacements) {
    return models.sequelize.query(sql, {
      type: models.sequelize.QueryTypes.SELECT,
      replacements
    });
  },

  getSummaryChart(replacements) {
    const sql = `
      select to_char(d, 'YYYY-MM') as date, COALESCE(sum("b"."amount"), 0) as value
      from generate_series(date('now') - interval '1 year', date('now'), interval '1 day') d
             left join lateral (
          select "b"."amount"
          from "transaction" "b"
          where date("b"."created_at") <= d and "b"."strategy_id" = :strategy_id
          group by "b"."amount"
          ) b ON true
      group by date
      order by date;
    `;

    return this.rawQuery(sql, replacements);
  },

  getChart(replacements) {
    const sql = `
      select to_char(d, 'YYYY-MM') as date, COALESCE(sum("b"."amount"), 0) as value
      from generate_series(date('now') - interval '1 year', date('now'), interval '1 day') d
             left join lateral (
          select "b"."amount"
          from "transaction" "b"
          where
            date("b"."created_at") = d
            and "b"."user_id" = :user_id
            and "b"."strategy_id" = :strategy_id
          group by "b"."amount"
          ) b ON true
      group by date
      order by date;
    `;

    return this.rawQuery(sql, replacements);
  }
};
