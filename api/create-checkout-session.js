const Stripe = require("stripe");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "eur",

            product_data: {
              name: "GTA6VI Demo Product"
            },

            unit_amount: 1000
          },

          quantity: 1
        }
      ],

      customer_creation: "always",

      success_url:
        `${process.env.BASE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${process.env.BASE_URL}/cancel.html`
    });

    return res.status(200).json({
      url: session.url
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: error.message
    });
  }
};
