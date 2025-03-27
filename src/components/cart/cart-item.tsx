import { fadeInOut } from "@/lib/motion/fade-in-out";
import { motion } from "framer-motion";
import Image from "next/image";
import Counter from "../ui/counter";
import { Trash2Icon } from "lucide-react";
import {
  decreaseOrderItem,
  deleteOrderItem,
  increaseOrderItem,
} from "@/lib/actions/order.action";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface CartItemProps {
  item: any;
}

const CartItem = ({ item }: CartItemProps) => {
  // Local state for optimistic updates
  const [quantity, setQuantity] = useState(item.quantity);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleIncrement = async () => {
    if (isPending) return;

    // Optimistic update
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    setIsPending(true);

    try {
      const response = await increaseOrderItem(item.id);
      if (!response.success) {
        // Revert on failure
        setQuantity(quantity);
      }
    } catch (error) {
      // Revert on error
      setQuantity(quantity);
      console.error("Failed to increase quantity:", error);
    } finally {
      setIsPending(false);
    }
  };

  const handleDecrement = async () => {
    // Optimistic update
    const newQuantity = quantity - 1;
    setQuantity(newQuantity);
    setIsPending(true);

    try {
      const response = await decreaseOrderItem(item.id);
      if (!response.success) {
        // Revert on failure
        setQuantity(quantity);
      } else if (response.data === null) {
        // Item was deleted on server (quantity reached 0)
        setQuantity(0);
      }
    } catch (error) {
      // Revert on error
      setQuantity(quantity);
      console.error("Failed to decrease quantity:", error);
    } finally {
      setIsPending(false);
    }
  };
  const deleteItem = async (id: string) => {
    try {
      const response = await deleteOrderItem(id);
      if (response.success) {
        toast.success("تم حذف المنتج بنجاح من عربة التسوق");
      }
    } catch (error) {
      toast.error("حصل خطا اثناء حذف المنتج من عربة التسوق");
      console.log(error);
    } finally {
      router.refresh();
    }
  };
  // Optional: Handle item removal when quantity is 0
  if (quantity === 0) {
    return null; // or a custom "item removed" message
  }

  return (
    <motion.div
      layout
      initial="from"
      animate="to"
      exit="from"
      variants={fadeInOut(0.25)}
      className="flex items-center justify-between py-4 text-sm border-b border-solid border-border border-opacity-75"
    >
      <div className="flex items-center gap-4 w-full">
        <div className="max-w-[120px] w-full grid place-items-center bg-gray-100">
          <Image
            src={item?.product?.images[0] as string}
            alt={item?.product.name}
            width={80}
            height={80}
            className="w-20 h-20"
          />
        </div>
        <div className="flex flex-col justify-center w-full">
          <h4 className="text-base font-semibold text-gray-800 dark:text-white">
            {item?.product?.name}
          </h4>
          <p className="text-base text-gray-700 dark:text-white">
            {item.product.price.toFixed(2)} SAR
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-6 justify-between items-center">
        <button
          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 self-end grid place-items-center shadow-sm"
          onClick={() => deleteItem(item.id)}
        >
          <Trash2Icon className="w-4" />
          <span className="sr-only">ازالة العنصر</span>
        </button>

        <Counter
          value={quantity}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
          variant="cart"
          disabled={isPending}
        />
      </div>
    </motion.div>
  );
};

export default CartItem;
