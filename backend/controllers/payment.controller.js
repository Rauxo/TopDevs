const planModel = require("../models/plan.model");
const userModel = require("../models/user.models");
const companyModel = require("../models/company.model");
const { Cashfree } = require("cashfree-pg");

const cashfree = new Cashfree(
  Cashfree.SANDBOX,
  process.env.CASHFREE_APP_ID,
  process.env.CASHFREE_SECRET_KEY,
);

exports.createOrder = async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = await planModel.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const user = req.user || req.company;
    const orderId = `ORDER_${Date.now()}_${user._id.toString().slice(-4)}`;

    const request = {
      order_amount: plan.price,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: user._id.toString(),
        customer_phone: user.phone || "9999999999",
        customer_email: user.email || "test@topdevs.com",
      },
      order_meta: {
        return_url: `http://localhost:5173/payment-status?order_id=${orderId}&plan_id=${planId}`,
      },
    };

    const response = await cashfree.PGCreateOrder({
      order_amount: plan.price,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: user._id.toString(),
        customer_phone: user.phone || "9999999999",
        customer_email: user.email || "test@topdevs.com",
      },
      order_meta: {
        return_url: `http://localhost:5173/payment-status?order_id=${orderId}`,
      },
    });

    if (response.data && response.data.payment_session_id) {
      res.status(200).json({
        orderId: response.data.order_id,
        payment_session_id: response.data.payment_session_id,
        localOrderId: orderId,
      });
    } else {
      res
        .status(400)
        .json({ message: "Failed to create Cashfree order session" });
    }
  } catch (error) {
    // console.error("Cashfree Create Order Error:", error.response?.data || error.message);
    console.log(error);
    console.log(error.response);
    console.log(error.response?.data);
    res.status(500).json({ message: "Failed to initiate payment" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { order_id, planId } = req.body;
    const userId = req.user?._id || req.company?._id;
    const type = req.user ? "User" : "Company";

    // Fetch the order status directly from Cashfree
    const response = await Cashfree.PGFetchOrder("2023-08-01", order_id);

    if (response.data && response.data.order_status === "PAID") {
      // Payment verified, upgrade user plan
      const plan = await planModel.findById(planId);
      const model = type === "User" ? userModel : companyModel;

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + plan.durationInDays);

      await model.findByIdAndUpdate(userId, {
        isPremium: true,
        plan: planId,
        premiumExpiry: expiryDate,
        messagesSent: 0,
      });

      res
        .status(200)
        .json({ message: "Payment verified and subscription activated" });
    } else {
      res.status(400).json({
        message: "Payment not completed or failed",
        status: response.data?.order_status,
      });
    }
  } catch (error) {
    console.error(
      "Cashfree Verify Payment Error:",
      error.response?.data || error.message,
    );
    res.status(500).json({ message: "Payment verification failed" });
  }
};

exports.getPlans = async (req, res) => {
  try {
    const { type } = req.query;
    const plans = await planModel.find({ type });
    res.status(200).json({ plans });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};
