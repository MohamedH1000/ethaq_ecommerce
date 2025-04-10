import { getOrderById } from "@/lib/actions/order.action";
import OrderDetails from "./components/OrderDetails";

const Page = async ({ params }: { params: { orderId: string } }) => {
  const order = await getOrderById(params.orderId);

  return <OrderDetails order={order} />;
};

export default Page;
