import * as Yup from "yup";

export const ProductSchema = Yup.object({
  id: Yup.string().required(),
  title: Yup.string().required().default(""),
  description: Yup.string().default(""),
  price: Yup.number().positive().required().defined().default(0),
});

export const StockSchema = Yup.object({
  product_id: Yup.string().required(),
  count: Yup.number().positive().required().defined().default(0),
});

export type Product = Yup.InferType<typeof ProductSchema>;
export type Stock = Yup.InferType<typeof StockSchema>;
