const { orderModel } = require('../module/order/model/orderModel');

const bestSellProduct = async function (req, res) {
  try {
    const pipeline = bestSellProductPipe();
    const result = await orderModel.aggregate(pipeline);
    return res.json({
      meta: { msg: 'Successfully found sell product', status: true },
      data: result,
    });
  } catch (error) {
    return res.json({
      meta: { msg: error.message, status: false },
    });
  }
};

module.exports = { bestSellProduct };

const bestSellProductPipe = function () {
  return [
    {
      $project: {
        productDetails: 1,
      },
    },
    {
      $unwind: {
        path: '$productDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: '$productDetails.productId',
        productId: { $first: '$productDetails.productId' },
        productName: { $first: '$productDetails.productName' },
        quantity: { $sum: '$productDetails.quantity' },
      },
    },
    {
      $lookup: {
        from: 'products',
        localField: 'productId',
        foreignField: 'productId',
        as: 'product',
      },
    },
    {
      $unwind: {
        path: '$product',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        productId: 1,
        productName: 1,
        quantity: 1,
        productImg: '$product.productImg',
        categoryId: '$product.categoryId',
        categoryName: '$product.categoryName',
        subCategoryId: '$product.subCategoryId',
        subCategoryName: '$product.subCategoryName',
      },
    },
    {
      $sort: {
        quantity: -1,
      },
    },
    {
      $project: {
        _id: 0,
      },
    },
  ];
};
