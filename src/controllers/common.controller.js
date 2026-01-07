const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Response = require('../utils/response');
// const { User } = require('/../models'); // Sequelize User model
const { User,User_Role,Settings,sequelize,Cupons,Payment_gateway,Shipping_help_QA } = require('../models');  // ✅ correct relative path
console.log('User',User)
const { Op } = require('sequelize');

const { JWT_SECRET, JWT_EXPIRES } = process.env;

// ----------------- REGISTER -----------------


exports.get_settings = async (req, res) => {
  try {
    const settings_data = await Settings.findAll({
      where: {
        id: {
          [Op.in]: [1, 2]
        }
      }
    });
    
    if (settings_data.length>0){
        data={
            name:settings_data[0].value,
            logo:settings_data[1].value
        }
    }
    else{
        data={
            
        }
    }
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

function buildMenuTree(items) {
  const map = {};
  const tree = [];

  // Map each item by id
  items.forEach(item => {
    map[item.id] = { ...item, children: [] };
  });

  // Attach children to parents
  items.forEach(item => {
    if (item.parent_id && item.parent_id !== 0) {
      if (map[item.parent_id]) {
        map[item.parent_id].children.push(map[item.id]);
      }
    } else {
      // parent_id = 0 → main menu
      tree.push(map[item.id]);
    }
  });

  return tree;
}

// ---------------- GET SIDEBAR -----------------
exports.get_sidebar = async (req, res) => {
  try {
    const { userid,roleid } = req.body; // frontend sends user id
    if (!userid) {
      return Response.error(res, 'User ID is required', 400);
    }

    // Fetch sidebar permissions assigned to the user via roles
    const sidebar_data = await sequelize.query(
      `
      SELECT p.*
      FROM permissions p
      JOIN role_permission rp ON rp.permission_id = p.id
      JOIN user_roles ur ON ur.role_id = rp.role_id
      WHERE ur.user_id = :userid
        AND rp.use_for IN ('sidebar','both')
        AND p.is_menu = 1
      ORDER BY p.menu_order;
      `,
      {
        replacements: { userid },
        type: sequelize.QueryTypes.SELECT
      }
    );

    // Build hierarchical menu
    const menuTree = buildMenuTree(sidebar_data);
    
    const  themedata= await Settings.findOne({
      where: { key:  roleid }
    });
    
    datas={
        themedata:JSON.parse(themedata.value),
        sidebardata:menuTree
    }
    
    return Response.success(res, datas, 'Sidebar fetched successfully');

  } catch (err) {
    console.error(err);
    return Response.error(res, 'Server error');
  }
};

exports.get_Weight = async (req, res) => {
  try {
    const {length,bredth,height}=req.body;
    if(!length || !bredth || !height)
    {
        return res.status(400).json({
          success: true,
          message: 'Missing Required Fields',
        });
    }
    const Weight=(length*bredth*height)/5000
    return res.status(200).json({
      success: true,
      message: 'Get successfully',
      Weight: Weight,
      Units:"kg"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

exports.get_active_cupons = async (req, res) => {
  try {
    const cupons_data = await Cupons.findAll({where: { status:  1 }});
    
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

exports.get_active_gateway = async (req, res) => {
  try {
    const gateway_data = await Payment_gateway.findAll({where: { status:  1 },attributes: ['id', 'payment_gateway_title', 'status']});
    
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

const { decryptPayload } = require('../utils/decrypt');

exports.decryptTest = (req, res) => {
  try {
    const decrypted = decryptPayload(req.body);

    return res.json({
      success: true,
      decrypted
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.get_support_data = async (req, res) => {
  try {
    const settings_data = await Settings.findAll({
      where: {
        id: {
          [Op.in]: [16]
        }
      }
    });
    
    const QA = await Shipping_help_QA.findAll({
      where: {
        status:'1'
      }
    });
    
    if (settings_data.length>0){
        data={
            logistics_support:JSON.parse(settings_data[0].value),
            shipping_help_Center:QA
        }
    }
    else{
        data={
            
        }
    }
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