const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Orders = sequelize.define('Orders', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: DataTypes.INTEGER,
  order_id: DataTypes.STRING,
  pickup_address_id: DataTypes.INTEGER,
  delivery_details: DataTypes.STRING,
  is_same_billng: DataTypes.INTEGER,  // naya column
  billing_details: DataTypes.STRING,
  product_details: DataTypes.STRING,
  products_total: DataTypes.DECIMAL(10, 2),
  is_other_charges: DataTypes.INTEGER,
  other_charges: DataTypes.STRING,  // naya column
  discount: DataTypes.DECIMAL(10, 2),
  order_total_price: DataTypes.DECIMAL(10, 2),
  payment_method: DataTypes.INTEGER,
  package_details: DataTypes.STRING,
  applicable_weight: DataTypes.STRING,  // naya column
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'orders',   // ✅ explicitly set table name
  timestamps: false     // agar aap createdAt / updatedAt nahi use kar rahe
});

const Transaction_History = sequelize.define('Transaction_History', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: DataTypes.INTEGER,
  amount: DataTypes.DECIMAL(10, 2),
  type: DataTypes.INTEGER,
  txn_id: DataTypes.STRING,
  purpose: DataTypes.INTEGER,  // naya column
  status: DataTypes.INTEGER,
  gateway_id: DataTypes.INTEGER,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'transaction_history',   // ✅ explicitly set table name
  timestamps: false     // agar aap createdAt / updatedAt nahi use kar rahe
});



module.exports = {Orders,Transaction_History};
