import { Metadata } from "next";
import SingleProductPage from "../screens/SingleProductPage";
import { getProductById } from "@/lib/actions/product.action";
type Props = {
  params: {
    productSlug: string;
  };
};
export const metadata: Metadata = {
  title: "المنتج",
};

const Product = async ({ params: { productSlug } }: Props) => {
  const product = await getProductById(productSlug);
  return <SingleProductPage product={product} />;
};

export default Product;
