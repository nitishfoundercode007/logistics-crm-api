const {Cupons,Payment_gateway,Settings} = require('../models');
const { Op } = require('sequelize');

exports.get_all_gateway = async (req, res) => {
  try {
    const gateway_data = await Payment_gateway.findAll();
    
    return res.status(200).json({
      success: true,
      message: 'Get successfully',
      data: gateway_data
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: `Server error ${err}`
    });
  }
};

exports.get_all_cupons = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({
            success: false,
            message: 'User ID is required'
        });
    }
    const cupons_data = await Cupons.findAll();
    
    
    return res.status(200).json({
      success: true,
      message: 'Get successfully',
      data: cupons_data
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.get_settings_data = async (req, res) => {
  try {
    const settings_data = await Settings.findAll({
      where: {
        id: {
          [Op.notIn]: [3, 4,5,6,16,17]
        }
      }
    });
    
    if (settings_data.length>0){
        data={
            name:settings_data[0].value,
            logo:settings_data[1].value,
            company_phone:settings_data[3].value,
            company_email:settings_data[4].value,
            country:settings_data[5].value,
            address:settings_data[6].value,
            lat_long:settings_data[8].value,
            favIcon:settings_data[7].value,
            copyRight:settings_data[9].value,
            map_key:JSON.parse(settings_data[10].value),
            min_recharge_wallet:settings_data[2].value
        }
    }
    else{
        data={
            
        }
    }
    console.log(`data`,data)
    // data=settings_data;
    return res.status(200).json({
      success: true,
      message: 'Get successfully',
      data: data
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.action_map_key = async (req, res) => {
  try {
    const { client_key, server_key, type } = req.body;

    // ✅ Proper validation
    if (type === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Missing type'
      });
    }

    let data = {};

    // ================== SAVE MAP KEYS ==================
    if (type == '1') {

      if (!client_key || !server_key) {
        return res.status(400).json({
          success: false,
          message: 'Missing Client Key or Server Key'
        });
      }

      const values = {
        client_key: client_key.toString(),
        server_key: server_key.toString()
      };
        
        valuesn=JSON.stringify(values)
      await Settings.update(
        { value: valuesn },
        { where: { key: 'map_key' } }
      );

      data = valuesn;
    }

    // ================== GET MAP KEYS ==================
    if (type == '2') {

      const settings_data = await Settings.findOne({
        where: { key: 'map_key' }
      });

      if (settings_data) {
        data = settings_data.value;
      } else {
        data = {};
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Map key action completed successfully',
      data: JSON.parse(data)
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

exports.action_cupon = async (req, res) => {
  try {
    const { action_type, cupon_id } = req.body;

    // ✅ Proper validation
    if (action_type === undefined || !cupon_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing Cupon Id or Action Type'
      });
    }

    let update_data = {
      status: action_type
    };

    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    if (action_type === '1') {
      update_data.active_date = today;
    }

    if (action_type === '2') {
      update_data.valid_till = today;
    }

    // action_type === '0' → only status update (already handled)

    await Cupons.update(update_data, {
      where: { id: cupon_id }
    });

    return res.status(200).json({
      success: true,
      message: 'Coupon status updated successfully'
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

exports.store_cupon = async (req, res) => {
    try {
        const { user_id, cupon_code, description, active_date,valid_days,valid_till,cashback_amount_percentage,min_amount,is_percent} = req.body || {};
    
        if (!user_id || !cupon_code || !description || !active_date || !valid_days || !valid_till || !cashback_amount_percentage || !min_amount || !is_percent) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        
        
        const user = await Cupons.create({
          cuponcode:cupon_code,
          description,
          active_date,
          valid_days,
          valid_till,
          min_amount,
          cashback_amount_percentage,
          is_percent
        });
        
        res.status(201).json({
          success: true,
          message: 'Cupon Successfully Inserted',
        //   data: User_data
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.enable_gateway = async (req, res) => {
    try {
        const { user_id, gateway_id, environment, client_id,client_secret,payment_gateway_title,status} = req.body || {};
    
        if (!user_id || !gateway_id) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        
        if(environment)
        {
            await Payment_gateway.update(
                { environment: environment },
                { where: { id: gateway_id } }
              );
        }
        
        if(client_id)
        {
            await Payment_gateway.update(
                { client_id: client_id },
                { where: { id: gateway_id } }
              );
        }
        
        if(client_secret)
        {
            await Payment_gateway.update(
                { client_secret: client_secret },
                { where: { id: gateway_id } }
              );
        }
        
        if(payment_gateway_title)
        {
            await Payment_gateway.update(
                { payment_gateway_title: payment_gateway_title },
                { where: { id: gateway_id } }
              );
        }
        
        if(status)
        {
            await Payment_gateway.update(
                { status: status },
                { where: { id: gateway_id } }
              );
        }
        
        res.status(201).json({
          success: true,
          message: 'Gateway Update Successfully',
        //   data: User_data
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.update_general_settings = async (req, res) => {
  try {
    const {
      user_id,
      project_name,
      logo,
      phone,
      company_email,
      country,
      company_address,
      lattitude,
      longitude,
      fav_icon,
      min_recharge_amount
    } = req.body || {};

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing User Id'
      });
    }

    // key-value mapping
    const settingsMap = {
      project_name: project_name,
      logo: logo,
      phone: phone,
      company_email: company_email,
      country: country,
      company_address: company_address,
      favicon: fav_icon,
      min_recharge_amount:min_recharge_amount
    };

    // normal fields update
    for (const [key, value] of Object.entries(settingsMap)) {
      if (value) {
        await Settings.update(
          { value: value },
          { where: { key } }
        );
      }
    }

    // latitude & longitude combined
    if (lattitude && longitude) {
      await Settings.update(
        { value: `${lattitude},${longitude}` },
        { where: { key: 'lat-long' } }
      );
    }

    return res.status(200).json({
      success: true,
      message: 'General settings updated successfully'
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};

exports.update_logistics_support = async (req, res) => {
  try {
    const {
      user_id,
      description,
      email,
      phone,
      avl_time,
      location
    } = req.body || {};

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'Missing User Id'
      });
    }

    const values = {
        description: description,
        email: email,
        phone:phone,
        time:avl_time,
        location:location
    };
        
    valuesn=JSON.stringify(values)
    await Settings.update(
        { value: valuesn },
        { where: { key: 'Logistics-Support' } }
    );

    return res.status(200).json({
      success: true,
      message: 'Logistics Support updated successfully'
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: err.message
    });
  }
};