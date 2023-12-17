export default function calCulatorAllProductInCart(arrProduct) {
  let price = 0;
  for (const product of arrProduct) {
    price += product.products.price + product.size.price;
    if (product.toppingIDs.length != 0) {
      price += toppingIDs.price;
    }
  }
  return price;
}
