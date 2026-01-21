const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Settings = sequelize.define('Settings', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  key:  DataTypes.STRING,
  value: DataTypes.STRING,
  status: DataTypes.INTEGER,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'business_settings',   // ✅ explicitly set table name
  timestamps: false     // agar aap createdAt / updatedAt nahi use kar rahe
});

const Cupons = sequelize.define('Cupons', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  cuponcode: DataTypes.STRING,
  description:  DataTypes.STRING,
  active_date: { type: DataTypes.DATE},
  valid_days: DataTypes.INTEGER,
  valid_till:  { type: DataTypes.DATE},
  min_amount: DataTypes.STRING,
  cashback_amount_percentage:  DataTypes.STRING,
  is_percent: DataTypes.INTEGER,
  status: DataTypes.INTEGER,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'cupons',   // ✅ explicitly set table name
  timestamps: false     // agar aap createdAt / updatedAt nahi use kar rahe
});

const Payment_gateway = sequelize.define('Payment_gateway', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  payment_gateway_title: DataTypes.STRING,
  images:DataTypes.STRING,
  environment:  DataTypes.STRING,
  client_id: DataTypes.STRING,
  client_secret: DataTypes.STRING,
  status: DataTypes.INTEGER,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'payment_gateway',   // ✅ explicitly set table name
  timestamps: false     // agar aap createdAt / updatedAt nahi use kar rahe
});

const Shipping_help_QA = sequelize.define('Shipping_help_QA', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  question: DataTypes.STRING,
  answer:  DataTypes.STRING,
  status: DataTypes.INTEGER,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'Shipping_help_QA',   // ✅ explicitly set table name
  timestamps: false     // agar aap createdAt / updatedAt nahi use kar rahe
});

module.exports = {Settings,sequelize,Cupons,Payment_gateway,Shipping_help_QA};