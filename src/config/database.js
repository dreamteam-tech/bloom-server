const defaultOptions = {
  username: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
  database: process.env.RDS_DB_NAME,
  host: process.env.RDS_HOSTNAME,
  port: process.env.RDS_PORT,
  dialect: 'postgres',

  migrationStorageTableName: 'migration_meta',
  freezeTableName: true,
  operatorsAliases: false,
  dialectOptions: {
    /**
     * Обязательный параметр для корректного сохранения данных в
     * decimal(27, 18) (миллионы и 18 чисел после запятой)
     * и корректного прокидывания из бд вместо строк - float
     */
    decimalNumbers: true
  },
  define: {
    timestamps: false,
    underscored: true,
    freezeTableName: true,
    charset: 'utf8',
    paranoid: false,
    version: false
  }
};

module.exports = {
  production: defaultOptions,
  development: { ...defaultOptions, logging: console.log },
  test: { ...defaultOptions, logging: false }
};
