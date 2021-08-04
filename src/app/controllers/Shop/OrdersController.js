const knex = require("../../../database/pg");

module.exports = {
  async Store(req, res) {
    const {
      client_id,
      employee_id,
      products,
      grand_total,
      discount,
      total_to_pay,
      order_date,
      waiting,
      obs,
    } = req.body;

    try {
      const data = new Date(order_date);

      const order = await knex("orders")
        .insert({
          client_id,
          cashier_id: 1,
          employee_id,
          from: "shop",
          products: JSON.stringify(products),
          status_order_shop: "billed",
          status_order_site: "preSale",
          grand_total,
          discount,
          total_to_pay,
          order_date,
          waiting,
          month: data.toLocaleString("pt-BR", { month: "long" }),
          year: data.getFullYear().toString(),
          obs,
        })
        .returning("*");
      return res.status(201).json(order);
    } catch (error) {
      const errorMessage = error.message;
      return res.status(400).json({
        message: "Ocorreu um erro ao salvar o pedido",
        errorMessage,
      });
    }
  },
};
