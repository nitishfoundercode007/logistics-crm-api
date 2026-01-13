const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const HubAddress_details = sequelize.define('HubAddress_details', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hub_id:DataTypes.STRING,
  user_id: DataTypes.INTEGER,
  full_address: DataTypes.STRING,
  area:DataTypes.STRING,
  landmark: DataTypes.STRING,
  pincode: DataTypes.INTEGER,
  city: DataTypes.STRING,
  state_id: DataTypes.INTEGER,
  country_id: DataTypes.INTEGER,
  lat_long: DataTypes.STRING,
  status: DataTypes.INTEGER,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'hub_address_details',   // ✅ explicitly set table name
  timestamps: false     // agar aap createdAt / updatedAt nahi use kar rahe
});

const HubContact_details = sequelize.define('HubContact_details', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hub_id:DataTypes.STRING,
  ManagerName: DataTypes.STRING,
  ManagerMobile: DataTypes.STRING,
  ManagerAlternateNo: DataTypes.STRING,
  ManagerEmailId: DataTypes.STRING,
  dob: DataTypes.STRING,
  status: DataTypes.INTEGER,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'hub_contact_details',   // ✅ explicitly set table name
  timestamps: false     // agar aap createdAt / updatedAt nahi use kar rahe
});

const HubOperational_details = sequelize.define('HubOperational_details', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hub_id:DataTypes.STRING,
  opening_time: DataTypes.STRING,
  closing_time: DataTypes.STRING,
  working_days: DataTypes.STRING,
  service_radius: DataTypes.STRING,
  max_capacity: DataTypes.STRING,
  status: DataTypes.INTEGER,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'hub_operational_details',   // ✅ explicitly set table name
  timestamps: false     // agar aap createdAt / updatedAt nahi use kar rahe
});

const HubBank_details = sequelize.define('HubBank_details', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  hub_id:DataTypes.STRING,
  account_holder_name: DataTypes.STRING,
  bank_name: DataTypes.STRING,
  account_no: DataTypes.STRING,
  ifsc_code: DataTypes.STRING,
  upi_id: DataTypes.STRING,
  status: DataTypes.INTEGER,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'hub_bank_details',   // ✅ explicitly set table name
  timestamps: false     // agar aap createdAt / updatedAt nahi use kar rahe
});


module.exports = {HubAddress_details,HubContact_details,HubOperational_details,HubBank_details};
