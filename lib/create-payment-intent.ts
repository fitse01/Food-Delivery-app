// src/index.ts
import { Client, Databases } from "node-appwrite";
import Stripe from "stripe";

export default async ({ req, res, log, error }: any) => {
    try {
        // ✅ Setup Appwrite client
        const client = new Client()
            .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT!)
            .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID!)
            .setKey(process.env.APPWRITE_API_KEY!);

        const databases = new Databases(client);

        // ✅ Setup Stripe client
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
            apiVersion: "2023-10-16",
        });

        // ✅ Parse request body
        const { amount, currency, userId } = JSON.parse(req.body);

        if (!amount || !currency || !userId) {
            return res.json({ error: "Missing parameters" }, 400);
        }

        // ✅ Create PaymentIntent in Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata: { userId },
        });

        // ✅ Save payment in Appwrite Collection
        await databases.createDocument(
            process.env.DATABASE_ID!,
            process.env.PAYMENTS_COLLECTION_ID!,
            "unique()",
            {
                userId,
                amount,
                currency,
                paymentIntentId: paymentIntent.id,
                status: paymentIntent.status,
            }
        );

        return res.json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err: any) {
        error("Payment Intent Error: " + err.message);
        return res.json({ error: err.message }, 500);
    }
};
