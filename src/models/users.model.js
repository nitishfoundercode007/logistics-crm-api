const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  status: DataTypes.INTEGER,
  phone: DataTypes.STRING,
  wallet: DataTypes.DECIMAL(10, 2),
  dob:DataTypes.STRING,
  comission_percent:DataTypes.INTEGER,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'users',   // ✅ explicitly set table name
  timestamps: false     // agar aap createdAt / updatedAt nahi use kar rahe
});

const User_Role = sequelize.define('User_Role', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: DataTypes.INTEGER,
  role_id: { type: DataTypes.INTEGER, unique: true },
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'user_roles',   // ✅ explicitly set table name
  timestamps: false     // agar aap createdAt / updatedAt nahi use kar rahe
});

const Merchant_details = sequelize.define('Merchant_details', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  business_type: DataTypes.INTEGER,
  aadhar_no: DataTypes.STRING,
  document_front: DataTypes.STRING,
  document_back: DataTypes.STRING,
  document_type: DataTypes.INTEGER,  // naya column
  user_id: DataTypes.INTEGER,
  company_name: DataTypes.STRING, 
  website_url: DataTypes.STRING,
  is_gst: DataTypes.INTEGER, 
  gst_no: DataTypes.STRING,
  status: DataTypes.INTEGER,
  registered_business_address:DataTypes.STRING,
  gst_certificate_upload:DataTypes.STRING,
  pan_no:DataTypes.STRING,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'merchant_details',   // ✅ explicitly set table name
  timestamps: false     // agar aap createdAt / updatedAt nahi use kar rahe
});

const Merchant_pickup_address = sequelize.define('Merchant_pickup_address', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: DataTypes.INTEGER,
  address_type: DataTypes.INTEGER,
  address_nick_name: DataTypes.STRING,
  is_you_present: DataTypes.INTEGER,
  address_detail_id: DataTypes.INTEGER,
  status: DataTypes.INTEGER,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'merchants_pickup_address',   // ✅ explicitly set table name
  timestamps: false     // agar aap createdAt / updatedAt nahi use kar rahe
});

const Pickup_incharge_details = sequelize.define('Pickup_incharge_details', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: DataTypes.INTEGER,
  pickup_address_id: DataTypes.INTEGER,
  name: DataTypes.STRING,
  contact_number: DataTypes.STRING,
  email_address: DataTypes.STRING,
  working_role: DataTypes.INTEGER,
  is_optional: DataTypes.INTEGER,
  alternate_number: DataTypes.STRING,
  id_proof: DataTypes.STRING,
  preferred_communication_mode: DataTypes.STRING,
  status: DataTypes.INTEGER,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'pickup_incharge_details',   // ✅ explicitly set table name
  timestamps: false     // agar aap createdAt / updatedAt nahi use kar rahe
});

const Address_details = sequelize.define('Address_details', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userid: DataTypes.INTEGER,
  complete_address: DataTypes.STRING,
  landmark: DataTypes.STRING,
  pincode: DataTypes.INTEGER,
  city: DataTypes.STRING,
  state: DataTypes.STRING,
  country: DataTypes.STRING,
  latitude: DataTypes.STRING,
  longitude: DataTypes.STRING,
  status: DataTypes.INTEGER,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: 'merchants_address_details',   // ✅ explicitly set table name
  timestamps: false     // agar aap createdAt / updatedAt nahi use kar rahe
});


// Address → Pickup Address
Address_details.hasMany(Merchant_pickup_address, {
  foreignKey: 'address_detail_id',
  as: 'pickup_addresses'
});

Merchant_pickup_address.belongsTo(Address_details, {
  foreignKey: 'address_detail_id',
  as: 'address_details'
});

// Pickup Address → Incharge
Merchant_pickup_address.hasMany(Pickup_incharge_details, {
  foreignKey: 'pickup_address_id',
  as: 'incharge_details'
});

Pickup_incharge_details.belongsTo(Merchant_pickup_address, {
  foreignKey: 'pickup_address_id',
  as: 'pickup_address'
});



module.exports = {User,User_Role,Merchant_details,Merchant_pickup_address,Pickup_incharge_details,Address_details};
