const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const { dualAuth } = require("../middlewares/dualAuth");

router.get("/plans", paymentController.getPlans);
router.post("/create-order", dualAuth, paymentController.createOrder);
router.post("/verify-payment", dualAuth, paymentController.verifyPayment);

module.exports = router;
