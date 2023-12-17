export default function (arrTopping) {
  let price = 0;
  if (arrTopping.length == 0) return 0;
  for (let topping of arrTopping) price += parseInt(topping.price);
  return price;
}
