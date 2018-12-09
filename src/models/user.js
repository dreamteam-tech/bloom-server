module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    is_active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    is_admin: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    is_trader: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    first_name: { type: DataTypes.STRING, allowNull: false },
    last_name: { type: DataTypes.STRING, allowNull: false },
    phone: { type: DataTypes.STRING, allowNull: true },
    token: { type: DataTypes.STRING, allowNull: true },
    refresh_token: { type: DataTypes.STRING, allowNull: true },
    password: { type: DataTypes.STRING, allowNull: true },
    vk_id: { type: DataTypes.STRING, allowNull: true }
  }, {
    tableName: 'user',
    timestamps: true
  });

  return User;
};
