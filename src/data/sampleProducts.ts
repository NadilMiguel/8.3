// Generate 50 sample products with realistic dimensions and prices
export const sampleProducts = Array.from({ length: 50 }, (_, index) => {
  // Generate realistic dimensions
  const height = (Math.random() * 48 + 2).toFixed(1); // 2-50 inches
  const width = (Math.random() * 36 + 2).toFixed(1);  // 2-38 inches
  const length = (Math.random() * 36 + 2).toFixed(1); // 2-38 inches
  const weight = (Math.random() * 49 + 1).toFixed(1); // 1-50 pounds
  
  // Generate realistic costs and prices
  const cost = Math.random() * 490 + 10; // $10-500
  const margin = Math.floor(Math.random() * 30 + 25); // 25-55% margin
  const price = cost * (1 + margin / 100);
  const profit = price - cost;

  return {
    upc: `${100000000000 + index}`,
    cost: cost.toFixed(2),
    price: price.toFixed(2),
    profit: profit.toFixed(2),
    margin: `${margin}%`,
    height: `${height}"`,
    width: `${width}"`,
    length: `${length}"`,
    weight: `${weight} lbs`
  };
});