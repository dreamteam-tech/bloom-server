module.exports = {
  port: process.env.PORT || 4000,
  portIntegration: process.env.PORT_INTEGRATION || 4001,
  jwt_secret: process.env.JWT_SECRET || '123456',
  bcrypt_rounds: 13
};
