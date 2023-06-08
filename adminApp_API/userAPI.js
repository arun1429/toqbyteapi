const moment = require('moment');
const { connection, Types } = require('mongoose');
const { pagination } = require('../helper/comFunction');
const userModel = connection.collection('users');
const { sms91 } = require('../helper/comFunction');

const findUserList = async function (req, res) {
  try {
    const {
      notVerified,
      start,
      end,
      sortBy,
      userId,
      paginationValue,
    } = req.query;
    const { first, last, sort } = pagination(start, end, sortBy);
    let findQuery = {};
    if (notVerified == 'mobile') {
      findQuery = { otpVerified: false };
    }
    if (notVerified == 'email') {
      findQuery = { emailVerified: false };
    }
    if (userId) {
      findQuery['userId'] = Types.ObjectId(userId);
    }
    let userData = await userModel
      .find(findQuery)
      .sort({ [sort]: -1 })
      .skip(first)
      .limit(last)
      .toArray();
    if (paginationValue == 'false') {
      userData = await userModel
        .find(findQuery)
        .sort({ [sort]: -1 })
        .toArray();
    }
    const { allUsers, currentDay } = await numberOfUsers();
    return res.json({
      meta: { msg: 'Successfully Found Users', status: true },
      data: userData,
      allUsers: allUsers.length || 0,
      currentDay: currentDay.length || 0,
    });
  } catch (error) {
    return res.json({
      meta: { msg: error.message, status: false },
    });
  }
};

const sendSmsToUser = async function (req, res) {
  try {
    const { mobile, textMsg, subject } = req.body;
    mobile
      ? mobile.forEach(async (el) => {
          let name = `Hello ${el.name}, \n` + textMsg;
          await sms91(el.mobile, name, subject);
        })
      : [];
    return res.json({
      meta: { msg: 'Successfully Send Message To User', status: true },
    });
  } catch (error) {
    return res.json({
      meta: { msg: error.message, status: false },
    });
  }
};

const searchUser = async function (req, res) {
  try {
    const { searchKey } = req.body;
    const { notVerified } = req.query;
    let findQuery = { $match: {} };
    if (notVerified == 'mobile') {
      findQuery = { $match: { otpVerified: false } };
    }
    if (notVerified == 'email') {
      findQuery = { $match: { emailVerified: false } };
    }
    const pipeline = searchUserPipeline(findQuery, searchKey);
    const result = await userModel.aggregate(pipeline).toArray();
    return res.json({
      meta: { msg: 'Successfully Found Users', status: true },
      data: result,
    });
  } catch (error) {
    return res.json({
      meta: { msg: error.message, status: false },
    });
  }
};

module.exports = { findUserList, sendSmsToUser, searchUser };

const numberOfUsers = async function () {
  const startDay = moment().startOf('days').valueOf();
  const allUsers = await userModel.find({}).toArray();
  const currentDay = await userModel
    .find({ createdAt: { $gt: startDay - 1 } })
    .toArray();
  return { allUsers, currentDay };
};

const searchUserPipeline = function (findQuery, keyword) {
  return [
    findQuery,
    {
      $match: {
        $or: [
          { userEmailId: { $regex: `^${keyword}.*`, $options: 'i' } },
          { fullName: { $regex: `${keyword}`, $options: 'i' } },
          { mobile: { $regex: `${keyword}`, $options: 'i' } },
        ],
      },
    },
  ];
};
