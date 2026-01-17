const {User,User_Role,Merchant_details,Merchant_pickup_address,Pickup_incharge_details,Address_details,ForgetPasswordRequest} = require('./users.model');
const {Settings,sequelize,Cupons,Payment_gateway,Shipping_help_QA} = require('./settings.model');
const {Orders,Transaction_History} = require('./orders.model');
const {HubAddress_details,HubContact_details,HubOperational_details,HubBank_details} = require('./hub.model');

module.exports = { User,User_Role,Settings,sequelize,Merchant_details,Merchant_pickup_address,Address_details,Pickup_incharge_details,Orders,Transaction_History,Cupons,Payment_gateway,Shipping_help_QA,HubAddress_details,HubContact_details,HubOperational_details,HubBank_details,ForgetPasswordRequest };  // ✅ export as object
