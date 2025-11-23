export default async function handler(req, res) {
  try {
    const { from, to, amount } = req.query;

    if (!from || !to || !amount) {
      return res.status(400).json({
        error: "Please provide 'from', 'to' and 'amount'"
      });
    }

    const amt = parseFloat(amount);
    if (isNaN(amt)) {
      return res.status(400).json({ error: "Amount must be a number" });
    }

    const response = await fetch(
      `https://api.exchangerate.host/latest?base=${from.toUpperCase()}&symbols=${to.toUpperCase()}`
    );

    const data = await response.json();

    if (!data.rates || !data.rates[to.toUpperCase()]) {
      return res.status(400).json({ error: "Invalid currency code" });
    }

    const rate = data.rates[to.toUpperCase()];
    const result = amt * rate;

    return res.status(200).json({
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      amount: amt,
      rate,
      result
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
