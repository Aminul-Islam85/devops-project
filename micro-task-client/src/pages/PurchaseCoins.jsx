const PurchaseCoins = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const handlePurchase = async (coins) => {
    const res = await fetch("http://localhost:5000/api/tasks/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, coins }),
    });

    const data = await res.json();
    if (res.ok) {
      const updatedUser = { ...user, coins: user.coins + coins };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert(data.message || "Purchase successful!");
      window.location.reload(); // to reflect new coin count
    }

  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Purchase Coins</h2>
      <div className="flex gap-4">
        {[10, 50, 100].map((amount) => (
          <button
            key={amount}
            onClick={() => handlePurchase(amount)}
            className="btn btn-outline btn-primary"
          >
            Buy {amount} Coins
          </button>
        ))}
      </div>
    </div>
  );
};

export default PurchaseCoins;
