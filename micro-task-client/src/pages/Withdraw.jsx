import { useState } from "react";

const Withdraw = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("");

  const handleWithdraw = async (e) => {
    e.preventDefault();

    const numericAmount = Number(amount);


    if (numericAmount < 10) {
      return alert("Minimum withdrawal amount is 10 coins.");
    }

    if (numericAmount > user.coins) {
      return alert("You do not have enough coins.");
    }

    const res = await fetch("http://localhost:5000/api/tasks/withdraw", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        amount: numericAmount,
        method,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      const updatedUser = { ...user, coins: user.coins - numericAmount };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert(data.message || "Withdrawal request submitted!");
      window.location.reload();
    } else {
      alert(data.message || "Withdrawal failed.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Withdraw Coins</h2>
      <form onSubmit={handleWithdraw} className="space-y-4 max-w-sm">
        <input
          type="number"
          placeholder="Amount (min 10)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="input input-bordered w-full"
        />
        <input
          type="text"
          placeholder="Payment Method (e.g. PayPal email)"
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          required
          className="input input-bordered w-full"
        />
        <button type="submit" className="btn btn-primary w-full">Request Withdraw</button>
      </form>
    </div>
  );
};

export default Withdraw;
