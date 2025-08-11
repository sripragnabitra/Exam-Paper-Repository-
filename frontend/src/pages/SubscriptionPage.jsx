import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { createCheckout } from "../api/payments";

export default function SubscriptionPage() {
  const { token } = useContext(AuthContext);

  const handleCheckout = async (plan) => {
    try {
      const res = await createCheckout(plan.id, token);
      // backend should return URL or session id
      if (res.data.url) window.location.href = res.data.url;
      else alert("Checkout created. Follow backend instructions.");
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    }
  };

  const plans = [
    { id: "monthly", name: "Monthly Plan", price: 199 },
    { id: "yearly", name: "Yearly Plan", price: 1499 },
  ];

  return (
    <div>
      <h2 className="text-2xl mb-4">Subscription Plans</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plans.map(p => (
          <div key={p.id} className="bg-white border rounded p-4">
            <div className="font-semibold">{p.name}</div>
            <div className="text-gray-700">₹{p.price} / {p.id === "monthly" ? "month" : "year"}</div>
            <button onClick={() => handleCheckout(p)} className="mt-3 bg-blue-600 text-white px-3 py-1 rounded">Buy</button>
          </div>
        ))}
      </div>
    </div>
  );
}
