async function predict() {
  const data = {
    city: Number(city.value),
    locality: Number(locality.value),
    cuisines: Number(cuisines.value),
    aggregate_rating: Number(rating.value),
    votes: Number(votes.value)
  };

  const res = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(data)
  });

  const result = await res.json();
  document.getElementById("result").innerText =
    "Predicted Price for Two: ₹" + result.predicted_price;
}
