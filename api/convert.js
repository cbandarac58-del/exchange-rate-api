// /api/convert.js

export default async function handler(req, res) {
  try {
    const { from, to, amount } = req.query;

    // basic validation
    if (!from || !to || !amount) {
      return res.status(400).json({
        error: "Please provide 'from', 'to' and 'amount'"
      });
    }

    const amt = parseFloat(amount);
    if (isNaN(amt)) {
      return res.status(400).json({ error: "Amount must be a number" });
    }

    const base = from.toUpperCase();
    const target = to.toUpperCase();

    // NEW API (supports LKR)
    const response = await fetch(
      `https://open.er-api.com/v6/latest/${base}`
    );

    const data = await response.json();

    if (!data.rates || !data.rates[target]) {
      return res.status(400).json({
        error: "Invalid currency code or rate not available"
      });
    }

    const rate = data.rates[target];
    const result = amt * rate;

    return res.status(200).json({
      from: base,
      to: target,
      amount: amt,
      rate,
      result
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
