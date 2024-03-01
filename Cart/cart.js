class Cart {
  constructor(customer_id) {
    this.customer_id = customer_id;
    this.items = {};
    this.discounts = {};
    this.freebies = {};
  }

  static create(customer_id) {
    return new Cart(customer_id);
  }

  add(product_id, quantity) {
    if (this.items.hasOwnProperty(product_id)) {
      this.items[product_id] += quantity;
    } else {
      this.items[product_id] = quantity;
    }
  }

  update(product_id, quantity) {
    if (this.items.hasOwnProperty(product_id)) {
      if (quantity > 0) {
        this.items[product_id] = quantity;
      } else {
        delete this.items[product_id];
      }
    }
  }

  remove(product_id) {
    if (this.items.hasOwnProperty(product_id)) {
      delete this.items[product_id];
    }
  }

  has(product_id) {
    return this.items.hasOwnProperty(product_id);
  }

  isEmpty() {
    return Object.keys(this.items).length === 0;
  }

  count() {
    return this.items;
  }

  quantity() {
    return Object.keys(this.items).length;
  }

  total() {
    let total = 0;
    for (const [product_id, quantity] of Object.entries(this.items)) {
      total += quantity;
    }
    return total;
  }

  addDiscount(name, discount) {
    this.discounts[name] = discount;
  }

  removeDiscount(name) {
    if (this.discounts.hasOwnProperty(name)) {
      delete this.discounts[name];
    }
  }

  applyDiscounts(total) {
    for (const discount of Object.values(this.discounts)) {
      if (discount.type === "fixed") {
        total -= discount.amount;
      } else if (discount.type === "percentage") {
        const discountAmount = Math.min(
          (total * discount.amount) / 100,
          discount.max || total
        );
        total -= discountAmount;
      }
    }
    return total;
  }

  addFreebie(name, condition, reward) {
    this.freebies[name] = { condition, reward };
  }

  applyFreebies() {
    for (const [name, { condition, reward }] of Object.entries(this.freebies)) {
      const { type, product_id } = condition;
      if (type === "contains" && this.items.hasOwnProperty(product_id)) {
        const { product_id: rewardProductId, quantity } = reward;
        this.add(rewardProductId, quantity);
      }
    }
  }
}
