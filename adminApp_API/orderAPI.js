const moment = require('moment');
const { connection, Types } = require('mongoose');
let ObjectId = Types.ObjectId;
const { pagination } = require('../helper/comFunction');

// For Admin App
const findOrder = async function (req, res) {
  try {
    const { start, end, sortBy, orderId, type } = req.query;
    const { first, last, sort } = pagination(start, end, sortBy);
    let findQuery = {};
    if (orderId) {
      findQuery['orderId'] = orderId;
    }
    if (type == 'Pending') {
      findQuery = {
        isPacked: null,
        isShipped: null,
        isOrdered: null,
        isDelivered: null,
        isCancelled: null,
      };
    }
    if (type == 'Processing') {
      findQuery = { isOrdered: true, isDelivered: null, isCancelled: null };
    }
    if (type == 'Complete') {
      findQuery = { isDelivered: true };
    }
    if (type == 'Cancelled') {
      findQuery = { isCancelled: true };
    }
    const order = await connection
      .collection('orders')
      .find(findQuery)
      .sort({ [sort]: -1 })
      .skip(first)
      .limit(last)
      .toArray();
    return res.json({
      meta: { msg: 'Successfully Found Orders', status: true },
      data: order,
    });
  } catch (error) {
    return res.json({
      meta: { msg: error.message, status: false },
    });
  }
};

const usersOrders = async function (req, res) {
  try {
    const { start, end, sortBy } = req.query;
    const { first, last, sort } = pagination(start, end, sortBy);
    let findQuery = {};
    const userData = await connection
      .collection('orders')
      .find({})
      .project({ _id: 0, userId: 1 })
      .toArray();
    let userIds = userData.map((el) => {
      return ObjectId(el.userId);
    });
    if (req.query.userOrder == 'false') {
      findQuery = { $match: { userId: { $nin: userIds } } };
    }
    if (req.query.userOrder == 'true') {
      findQuery = { $match: { userId: { $in: userIds } } };
    }
    const pipeline = orderPipeline(findQuery, first, last, sort);
    const data = await connection
      .collection('users')
      .aggregate(pipeline)
      .toArray();
    return res.json({
      meta: { msg: 'Successfully Found UserList', status: true },
      data: data,
    });
  } catch (error) {
    return res.json({
      meta: { msg: error.message, status: false },
    });
  }
};

const topUsers = async function (req, res) {
  try {
    const { start, end, sortBy } = req.query;
    const { first, last, sort } = pagination(start, end, sortBy);
    const pipeline = topUserPipeline(first, last, sort);
    const data = await connection
      .collection('orders')
      .aggregate(pipeline)
      .toArray();
    return res.json({
      meta: { msg: 'Successfully Found Top UserList', status: true },
      data: data,
    });
  } catch (error) {
    return res.json({
      meta: { msg: error.message, status: false },
    });
  }
};

const totalDailyOrder = async function (req, res) {
  try {
    const startDay = moment().startOf('days').valueOf();
    const result = await connection
      .collection('orders')
      .find({ createdAt: { $gte: startDay - 1 } })
      .toArray();
    return res.json({
      meta: { msg: 'Successfully Found DailyOrders.', status: true },
      data: result,
    });
  } catch (error) {
    return res.json({
      meta: { msg: error.message, status: false },
    });
  }
};

const totalDailySales = async function (req, res) {
  try {
    let totalAmount = 0;
    const startDay = moment().startOf('days').valueOf();
    const result = await connection
      .collection('orders')
      .find({ createdAt: { $gte: startDay - 1 }, isDelivered: true })
      .toArray();
    result.length
      ? result.forEach((el) => {
          return (totalAmount += el.grandAmount);
        })
      : 0;
    return res.json({
      meta: { msg: 'Successfully Found DailyOrders.', status: true },
      data: totalAmount,
    });
  } catch (error) {
    return res.json({
      meta: { msg: error.message, status: false },
    });
  }
};

const DailyWalletRecharge = async function (req, res) {
  try {
    const { start, end, sortBy } = req.query;
    const { first, last, sort } = pagination(start, end, sortBy);
    const result = await connection
      .collection('transactions')
      .find({
        txnType: 'WALLET RECHARGE',
        status: 'authorized',
      })
      .sort({ [sort]: -1 })
      .skip(first)
      .limit(last)
      .toArray();
    return res.json({
      meta: { msg: 'Successfully Found Wallet Recharge.', status: true },
      data: result,
    });
  } catch (error) {
    return res.json({
      meta: { msg: error.message, status: false },
    });
  }
};

module.exports = {
  findOrder,
  usersOrders,
  topUsers,
  totalDailyOrder,
  totalDailySales,
  DailyWalletRecharge,
};

const orderPipeline = function (findQuery, skip, limit, sortBy) {
  return [
    findQuery,
    {
      $group: {
        _id: '$userId',
        userId: { $first: '$userId' },
        userEmailId: { $first: '$userEmailId' },
        fullName: { $first: '$fullName' },
        mobile: { $first: '$mobile' },
        createdAt: { $first: '$createdAt' },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { [sortBy]: -1 },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];
};

const topUserPipeline = function (skip, limit, sortBy) {
  return [
    {
      $match: {
        isDelivered: true,
      },
    },
    {
      $group: {
        _id: '$userId',
        totalAmount: { $sum: '$grandAmount' },
        totalOrder: { $sum: 1 },
        userEmailId: { $first: '$userEmailId' },
        userId: { $first: '$userId' },
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: {
        totalAmount: -1,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ];
};
