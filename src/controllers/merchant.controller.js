const {Merchant_details,Merchant_pickup_address,Address_details,Pickup_incharge_details,Orders,Transaction_History,Settings} = require('../models');

function generateRandomString(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return result;
}

async function get_minRechargeamount() {
  const  data= await Settings.findOne({ where: { key:  'min_recharge_amount' }} );
  return data['value'];
}

exports.store_details = async (req, res) => {
    try {
        const { user_id, business_type, document_type, company_name,website_url,is_gst,aadhar_no,document_front,document_back,gst_no,business_registered_address,gst_certificate_image,pan_no,dob } = req.body || {};
    
        if (!user_id || !business_type || !document_type || !company_name || !website_url || !is_gst || !business_registered_address) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        // Check if user already exists
        const existingDetails = await Merchant_details.findOne({ where: { user_id } });
        if (existingDetails) {
          return res.status(400).json({ success: false, message: 'Details already Filled' });
        }
        
        if(document_type==1)  // Aadhar
        {
            if (!aadhar_no || !document_front || !document_back ) {
                return res.status(400).json({ success: false, message: 'Missing Aadhar No OR Aadhar Front Image OR Aadhar Back Image' });
            }
        }
        else if(document_type==2) // Pan
        {
            if (!document_front) {
                return res.status(400).json({ success: false, message: 'Missing Pan Front Image ' });
            }
        }
        else if(document_type==3)  // Voter ID
        {
            if (!document_front || !document_back ) {
                return res.status(400).json({ success: false, message: 'Missing Voter ID Front Image OR Voter ID Back Image' });
            }
        }
        if(is_gst==1)  // Aadhar
        {
            if (!gst_no) {
                return res.status(400).json({ success: false, message: 'Missing Gst No ' });
            }
            
            if (!gst_certificate_image) {
                return res.status(400).json({ success: false, message: 'Missing Gst Certificate Image ' });
            }
        }
        else{
            if (!pan_no) {
                return res.status(400).json({ success: false, message: 'Missing Pan Card No ' });
            }
        }
        
        const user = await Merchant_details.create({
          user_id,
          business_type,
          document_type,
          company_name,
          website_url,
          is_gst,
          gst_no,
          aadhar_no,
          document_front,
          document_back,
          registered_business_address:business_registered_address,
          pan_no,
          gst_certificate_upload:gst_certificate_image
        });
        
        res.status(201).json({
          success: true,
          message: 'Details Successfully Inserted',
        //   data: User_data
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.add_pickup_address = async (req, res) => {
    try {
        const data = req.body || {};

        const {
            user_id,
            address_type,
            address_nick_name,
            is_you_present,
            complete_address,
            landmark,
            pincode,
            city,
            state,
            country,
            latitude,
            longitude,
            incharge_details
        } = data;

        // 🔹 Required field validation
        if (
            !user_id ||
            !address_type ||
            is_you_present === undefined ||
            !complete_address ||
            !pincode ||
            !city ||
            !state ||
            !country || !latitude || !longitude ||
            !Array.isArray(incharge_details) ||
            incharge_details.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        // 🔹 Address type = Other
        if (Number(address_type) === 4 && !address_nick_name) {
            return res.status(400).json({
                success: false,
                message: 'Missing Address Nick Name'
            });
        }

        // 🔹 Address details insert
        const address_data = {
            complete_address,
            landmark,
            pincode,
            city,
            state,
            country,
            latitude,
            longitude,
            userid: user_id
        };

        const address_add = await Address_details.create(address_data);

        // 🔹 Pickup address insert
        const pickup_address = {
            user_id,
            address_type,
            address_nick_name,
            is_you_present,
            address_detail_id: address_add.id
        };

        const pickup_address_add = await Merchant_pickup_address.create(pickup_address);

        // 🔹 Incharge details insert (multiple)
        const inchargePayload = incharge_details.map(item => ({
            ...item,
            pickup_address_id: pickup_address_add.id
        }));

        await Pickup_incharge_details.bulkCreate(inchargePayload);

        return res.status(201).json({
            success: true,
            message: 'Pickup Address Successfully Added'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.get_pickup_address = async (req, res) => {
    try {
        const { user_id } = req.body;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }

        // 🔹 Get pickup addresses
        const pickupAddresses = await Merchant_pickup_address.findAll({
            where: { user_id },
            include: [
                {
                    model: Address_details,
                    as: 'address_details',   // 👈 association name
                    attributes: [
                        'id',
                        'complete_address',
                        'landmark',
                        'pincode',
                        'city',
                        'state',
                        'country'
                    ]
                },
                {
                    model: Pickup_incharge_details,
                    as: 'incharge_details', // 👈 association name
                    attributes: [
                        'id',
                        'name',
                        'contact_number',
                        'email_address',
                        'working_role',
                        'is_optional'
                    ]
                }
            ],
            order: [['id', 'DESC']]
        });

        if (!pickupAddresses || pickupAddresses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No pickup address found',
                data:[]
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Pickup address fetched successfully',
            data: pickupAddresses
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message:    `Server error ${error}`
        });
    }
};

exports.get_pickup_address_byId = async (req, res) => {
    try {
        const { user_id,id } = req.body;

        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
        }
        if (!id) {
            return res.status(400).json({
                success: false,
                message: 'ID is required'
            });
        }

        // 🔹 Get pickup addresses
        const pickupAddresses = await Merchant_pickup_address.findOne({
            where: { id,user_id },
            include: [
                {
                    model: Address_details,
                    as: 'address_details',   // 👈 association name
                    required: true,
                    attributes: [
                        'id',
                        'complete_address',
                        'landmark',
                        'pincode',
                        'city',
                        'state',
                        'country'
                    ]
                },
                {
                    model: Pickup_incharge_details,
                    as: 'incharge_details', // 👈 association name
                    required: true,
                    attributes: [
                        'id',
                        'name',
                        'contact_number',
                        'email_address',
                        'working_role',
                        'is_optional'
                    ]
                }
            ]
        });

        if (!pickupAddresses || pickupAddresses.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No pickup address found',
                data:[]
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Pickup address fetched successfully',
            data: pickupAddresses
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: `Server error ${error}`
        });
    }
};

exports.update_pickup_address = async (req, res) => {
    try {
        const data = req.body || {};

        const {
            user_id,
            pickup_address_id,   // REQUIRED
            address_type,
            address_nick_name,
            is_you_present,

            complete_address,
            landmark,
            pincode,
            city,
            state,
            country,
            latitude,
            longitude,

            incharge_details
        } = data;
        
        if (!user_id) {
            return res.status(400).json({
                success: false,
                message: 'User Id is required'
            });
        }
        
        if (!pickup_address_id) {
            return res.status(400).json({
                success: false,
                message: 'Pickup Address Id is required'
            });
        }

        // 🔹 Existing pickup address
        const pickup = await Merchant_pickup_address.findByPk(pickup_address_id);

        if (!pickup) {
            return res.status(404).json({
                success: false,
                message: 'Pickup address not found'
            });
        }
        
        const authorize = await Merchant_pickup_address.findOne({where: { user_id }});

        if (!authorize) {
            return res.status(404).json({
                success: false,
                message: 'You Are Not Authorized'
            });
        }

        // 🔹 Address Type = Other validation
        if (Number(address_type) === 4 && !address_nick_name) {
            return res.status(400).json({
                success: false,
                message: 'Address Nick Name required for Other'
            });
        }

        /* ===============================
           1️⃣ Update Address Details
        =============================== */
        const addressUpdate = {};

        if (complete_address !== undefined) addressUpdate.complete_address = complete_address;
        if (landmark !== undefined) addressUpdate.landmark = landmark;
        if (pincode !== undefined) addressUpdate.pincode = pincode;
        if (city !== undefined) addressUpdate.city = city;
        if (state !== undefined) addressUpdate.state = state;
        if (country !== undefined) addressUpdate.country = country;
        if (latitude !== undefined) addressUpdate.latitude = latitude;
        if (longitude !== undefined) addressUpdate.longitude = longitude;

        if (Object.keys(addressUpdate).length > 0) {
            await Address_details.update(
                addressUpdate,
                { where: { id: pickup.address_detail_id } }
            );
        }

        /* ===============================
           2️⃣ Update Pickup Address
        =============================== */
        const pickupUpdate = {};

        if (address_type !== undefined) pickupUpdate.address_type = address_type;
        if (address_nick_name !== undefined) pickupUpdate.address_nick_name = address_nick_name;
        if (is_you_present !== undefined) pickupUpdate.is_you_present = is_you_present;

        if (Object.keys(pickupUpdate).length > 0) {
            await Merchant_pickup_address.update(
                pickupUpdate,
                { where: { id: pickup_address_id } }
            );
        }

        /* ===============================
           3️⃣ Update Incharge Details (Optional)
        =============================== */
        if (Array.isArray(incharge_details)) {
            // Pehle old delete
            await Pickup_incharge_details.destroy({
                where: { pickup_address_id }
            });

            // Naye insert
            const payload = incharge_details.map(item => ({
                ...item,
                pickup_address_id
            }));

            if (payload.length > 0) {
                await Pickup_incharge_details.bulkCreate(payload);
            }
        }

        return res.status(200).json({
            success: true,
            message: 'Pickup Address Successfully Updated'
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.create_order = async (req, res) => {
  try {
    let {
      user_id,
      pickup_address_id,
      delivery_details,
      is_same_billng,
      billing_details,
      product_details,
      products_total,
      is_other_charges,
      other_charges,
      discount,
      order_total_price,
      payment_method,
      package_details,
      applicable_weight,
      orderId
    } = req.body || {};

    // ✅ Proper validation
    if (
      !user_id ||
      !pickup_address_id ||
      !delivery_details ||
      is_same_billng === undefined ||
      !product_details ||
      !products_total ||
      is_other_charges === undefined ||
      !order_total_price ||
      !payment_method ||
      !package_details ||
      !applicable_weight ||
      !orderId
    ) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // ✅ Same billing logic
    if (String(is_same_billng) === '1') {
      billing_details = delivery_details;
    }

    await Orders.create({
      user_id,
      order_id: orderId,
      pickup_address_id,
      delivery_details: JSON.stringify(delivery_details),
      is_same_billng,
      billing_details: JSON.stringify(billing_details),
      product_details: JSON.stringify(product_details),
      products_total,
      is_other_charges,
      other_charges,
      discount,
      order_total_price,
      payment_method,
      package_details: JSON.stringify(package_details),
      applicable_weight
    });

    res.status(201).json({
      success: true,
      message: 'Successfully Ordered'
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.recharge_wallet = async (req, res) => {
  try {
    let {user_id,amount,gateway_id,is_cupon_applied,cupon_code} = req.body || {};

    // ✅ Proper validation
    if (!user_id || !amount || !gateway_id || !is_cupon_applied) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    const min_amount=await get_minRechargeamount();
    console.log("min_amount",min_amount,typeof(min_amount),typeof(amount))
    if(Number(min_amount)>Number(amount))
    {
        return res.status(400).json({
            success: false,
            message: 'Minimum 200 Amount Required'
          });
    }
    const txn_id=await generateRandomString(16);
    
    await Transaction_History.create({
        user_id,
        amount,
        type:"1",
        txn_id,
        purpose:'1',
        gateway_id,
        status:'0',
        is_cupon_applied
    })
    
    
    res.status(201).json({
      success: true,
      message: 'Successfully Ordered'
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: `Server error ${err}`
    });
  }
};

