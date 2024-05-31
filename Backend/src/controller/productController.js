// controllers.js
const axios = require("axios");
const ProductTransaction = require("./models");

const THIRD_PARTY_API_URL =
  "https://s3.amazonaws.com/roxiler.com/product_transaction.json";

exports.initializeDatabase = async (req, res) => {
  try {
    const { data } = await axios.get(THIRD_PARTY_API_URL);
    await ProductTransaction.deleteMany({});
    await ProductTransaction.insertMany(data);
    res.status(200).send("Database initialized successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.listTransactions = async (req, res) => {
  const { month, search, page = 1, perPage = 10 } = req.query;
  const regex = new RegExp(search, "i");
  const start = (page - 1) * perPage;

  try {
    const transactions = await ProductTransaction.find({
      dateOfSale: { $regex: `-${month}-` },
      $or: [{ title: regex }, { description: regex }, { price: regex }],
    })
      .skip(start)
      .limit(Number(perPage));
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getStatistics = async (req, res) => {
  const { month } = req.query;

  try {
    const transactions = await ProductTransaction.find({
      dateOfSale: { $regex: `-${month}-` },
    });

    const totalSaleAmount = transactions.reduce(
      (acc, item) => acc + item.price,
      0
    );
    const totalSoldItems = transactions.filter((item) => item.sold).length;
    const totalNotSoldItems = transactions.filter((item) => !item.sold).length;

    res.status(200).json({
      totalSaleAmount,
      totalSoldItems,
      totalNotSoldItems,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getBarChart = async (req, res) => {
  const { month } = req.query;

  try {
    const transactions = await ProductTransaction.find({
      dateOfSale: { $regex: `-${month}-` },
    });

    const priceRanges = {
      "0-100": 0,
      "101-200": 0,
      "201-300": 0,
      "301-400": 0,
      "401-500": 0,
      "501-600": 0,
      "601-700": 0,
      "701-800": 0,
      "801-900": 0,
      "901-above": 0,
    };

    transactions.forEach((item) => {
      if (item.price <= 100) priceRanges["0-100"]++;
      else if (item.price <= 200) priceRanges["101-200"]++;
      else if (item.price <= 300) priceRanges["201-300"]++;
      else if (item.price <= 400) priceRanges["301-400"]++;
      else if (item.price <= 500) priceRanges["401-500"]++;
      else if (item.price <= 600) priceRanges["501-600"]++;
      else if (item.price <= 700) priceRanges["601-700"]++;
      else if (item.price <= 800) priceRanges["701-800"]++;
      else if (item.price <= 900) priceRanges["801-900"]++;
      else priceRanges["901-above"]++;
    });

    res.status(200).json(priceRanges);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getPieChart = async (req, res) => {
  const { month } = req.query;

  try {
    const transactions = await ProductTransaction.find({
      dateOfSale: { $regex: `-${month}-` },
    });

    const categoryCount = transactions.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    res.status(200).json(categoryCount);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getCombinedData = async (req, res) => {
  const { month } = req.query;

  try {
    const statistics = await exports.getStatistics(req, res);
    const barChart = await exports.getBarChart(req, res);
    const pieChart = await exports.getPieChart(req, res);

    res.status(200).json({
      statistics: statistics,
      barChart: barChart,
      pieChart: pieChart,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
