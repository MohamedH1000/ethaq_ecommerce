import { fadeInOut } from "@/lib/motion/fade-in-out";
import { motion } from "framer-motion";
import Image from "next/image";
import Counter from "../ui/counter";
import { Trash2Icon } from "lucide-react";

interface CartItemProps {
  item: any;
  handleIncrement: any;
  handleDecrement: any;
  handleDelete: any;
}

const CartItem = ({
  item,
  handleIncrement,
  handleDecrement,
  handleDelete,
}: CartItemProps) => {
  // Local state for optimistic updates
  console.log(item);
  // Optional: Handle item removal when quantity is 0
  if (item.quantity === 0) {
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
            {(item.product.price * item.quantity).toFixed(2)} SAR
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-6 justify-between items-center">
        <button
          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 self-end grid place-items-center shadow-sm"
          onClick={() => handleDelete(item.id)}
        >
          <Trash2Icon className="w-4" />
          <span className="sr-only">ازالة العنصر</span>
        </button>

        <Counter
          value={item.quantity}
          onIncrement={() => handleIncrement(item.id)}
          onDecrement={() => handleDecrement(item.id)}
          variant="cart"
          // disabled={isPending}
        />
      </div>
    </motion.div>
  );
};

export default CartItem;
