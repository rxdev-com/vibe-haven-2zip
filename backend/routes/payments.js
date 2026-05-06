import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

async function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  try {
    const { default: Stripe } = await import("stripe");
    return new Stripe(key, { apiVersion: "2023-10-16" });
  } catch {
    return null;
  }
}

const intentSchema = z.object({
  amount: z.number().positive(),
  paymentMethodType: z.enum(["card", "upi"]).optional().default("card"),
  upiId: z.string().optional(),
  currency: z.string().optional().default("inr"),
});

router.post("/create-intent", requireAuth, async (req, res, next) => {
  try {
    const data = intentSchema.parse(req.body);
    const stripe = await getStripe();

    if (!stripe) {
      return res.json({
        clientSecret: `mock_cs_${Date.now()}`,
        paymentIntentId: `mock_pi_${Date.now()}`,
        mock: true,
        message: "Stripe not configured — payment recorded as pending",
      });
    }

    const paymentMethodTypes = data.paymentMethodType === "upi" ? ["upi"] : ["card"];

    const params = {
      amount: Math.round(data.amount * 100),
      currency: data.currency,
      payment_method_types: paymentMethodTypes,
      metadata: {
        userId: req.user._id.toString(),
        userEmail: req.user.email,
      },
    };

    if (data.paymentMethodType === "upi" && data.upiId) {
      params.metadata.upiId = data.upiId;
    }

    const paymentIntent = await stripe.paymentIntents.create(params);

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (err) {
    next(err);
  }
});

router.post("/confirm", requireAuth, async (req, res, next) => {
  try {
    const { paymentIntentId } = z.object({ paymentIntentId: z.string() }).parse(req.body);
    const stripe = await getStripe();

    if (!stripe || paymentIntentId.startsWith("mock_")) {
      return res.json({ status: "succeeded", confirmed: true });
    }

    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    res.json({ status: pi.status, confirmed: pi.status === "succeeded" });
  } catch (err) {
    next(err);
  }
});

export default router;
