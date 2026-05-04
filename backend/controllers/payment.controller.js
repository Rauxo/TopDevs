const axios = require("axios");
const qs = require("qs");
const planModel = require("../models/plan.model");
const userModel = require("../models/user.models");
const companyModel = require("../models/company.model");

const CODESHOP_TOKEN = process.env.CODESHOP_TOKEN;
const CREATE_ORDER_URL = "https://codeshop.in/api/create-order";
const CHECK_STATUS_URL = "https://codeshop.in/api/check-order-status";

exports.createOrder = async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = await planModel.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const user = req.user || req.company;
    const orderId = `ORDER_${Date.now()}_${user._id.toString().slice(-4)}`;

    const payload = {
      customer_mobile: user.phone || "8145344963", // Default if not present, but user/company should have phone
      user_token: CODESHOP_TOKEN,
      amount: plan.price.toString(),
      order_id: orderId,
      redirect_url: `http://localhost:5173/payment-status?order_id=${orderId}&plan_id=${planId}`,
      remark1: plan.name,
      remark2: user._id.toString(),
    };

    const response = await axios.post(CREATE_ORDER_URL, qs.stringify(payload), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (response.data.status) {
      res.status(200).json({ 
        orderId: response.data.result.orderId, 
        paymentUrl: response.data.result.payment_url,
        localOrderId: orderId
      });
    } else {
      res.status(400).json({ message: response.data.message || "Failed to create order" });
    }
  } catch (error) {
    console.error("CodeShop Create Order Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to initiate payment" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { order_id, planId } = req.body;
    const userId = req.user?._id || req.company?._id;
    const type = req.user ? "User" : "Company";

    const payload = {
      user_token: CODESHOP_TOKEN,
      order_id: order_id,
    };

    const response = await axios.post(CHECK_STATUS_URL, qs.stringify(payload), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (response.data.status === "COMPLETED") {
      // Payment verified
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

      res.status(200).json({ message: "Payment verified and subscription activated" });
    } else {
      res.status(400).json({ 
        message: response.data.message || "Payment not completed", 
        status: response.data.status 
      });
    }
  } catch (error) {
    console.error("CodeShop Verify Payment Error:", error.response?.data || error.message);
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
