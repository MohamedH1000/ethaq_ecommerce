"use client";
import { Button } from "@/components/ui/button";
import Counter from "@/components/ui/counter";
import { Icons } from "@/components/ui/icons";
import usePrice from "@/hooks/use-price";
import { useCartStore } from "@/store/cart/cart.store";
import { useGlobalModalStateStore } from "@/store/modal";
import { IProduct } from "@/types";
import { generateCartItem } from "@/utils/generate-cart-item";
import { getVariations } from "@/utils/get-variations";
import { isEmpty, isEqual } from "lodash";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductAttributes from "../product-attributes";
import ThumbnailCarousel from "../thumbnail-carousel";
import VariationPrice from "../variation-price";
import QuickViewShortDetails from "./quick-view-short-details";
import { addProductToCart } from "@/lib/actions/order.action";
import { getCurrentUser } from "@/lib/actions/user.action";
import { Loader } from "lucide-react";
export const QuickViewProduct = () => {
  const [attributes, setAttributes] = useState<{ [key: string]: string }>({});
  const globalModal = useGlobalModalStateStore((state) => state);
  const { addItemToCart, isInCart, getItemFromCart, isInStock } = useCartStore(
    (state) => state
  );
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [addToCartLoader, setAddToCartLoader] = useState<boolean>(false);
  const product = globalModal.quickViewState as IProduct;
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  const variations = getVariations(product?.variations);
  const { price, basePrice, discount } = usePrice({
    amount: product?.sale_price ? product?.sale_price : product?.price,
    baseAmount: product?.price,
    currencyCode: "SAR",
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsUserLoading(true);
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load user data");
      } finally {
        setIsUserLoading(false);
      }
    };
    fetchUser();
  }, []);

  const isSelected = !isEmpty(variations)
    ? !isEmpty(attributes) &&
      Object.keys(variations).every((variation) =>
        attributes.hasOwnProperty(variation)
      )
    : true;

  let selectedVariation: any = {};
  if (isSelected) {
    selectedVariation = product?.variation_options?.find((o: any) =>
      isEqual(
        o.options.map((v: any) => v.value).sort(),
        Object.values(attributes).sort()
      )
    );
  }

  const item = generateCartItem(product, selectedVariation);
  const outOfStock = isInCart(item._id) && !isInStock(item._id);

  async function addToCart() {
    if (!user) {
      toast.error("برجاء تسجيل الدخول لامكانية اضافة منتجات لعربة التسوق");
      return;
    }

    setIsLoading(true);
    try {
      await addProductToCart(
        user?.id,
        product?.id,
        selectedQuantity,
        product.price
      );
      toast.success("تم اضافة المنتج لعربة التسوق بنجاح");
      globalModal.setQuickViewState(false, null);
    } catch (error) {
      toast.error("حصل خطأ اثناء اضافة المنتج");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isUserLoading) {
    return (
      <div className="flex justify-center items-center px-6 py-4">
        <Loader className="animate-spin" />
      </div>
    );
  }
  return (
    <div className="px-6 py-4">
      <div className="mt-4 flex flex-col sm:flex-row gap-5">
        <div className="w-full sm:w-1/2 product-gallery  ">
          {!!product?.gallery?.length ? (
            <ThumbnailCarousel
              gallery={product?.gallery}
              isSingleProductPage={false}
            />
          ) : (
            <div className="flex items-center justify-center w-auto ">
              <Image
                src={product?.images[0] as string}
                alt={name!}
                width={450}
                height={390}
                style={{ width: "auto" }}
                className="rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="w-full sm:w-1/2 ">
          <div className="flex flex-col space-y-3 justify-center">
            <div className="flex flex-col gap-2 justify-center">
              <h2 className="text-xl font-medium text-gray-800 dark:text-white">
                {product?.name}
              </h2>
              {product?.unit && isEmpty(variations) ? (
                <div className="text-sm font-medium md:text-15px">
                  {product?.unit}
                </div>
              ) : (
                <VariationPrice
                  selectedVariation={selectedVariation}
                  minPrice={product?.min_price}
                  maxPrice={product?.max_price}
                />
              )}
              {isEmpty(variations) && (
                <div className="flex items-center mt-5 ">
                  <div className="text-primary font-bold text-base md:text-xl xl:text-[22px]">
                    {price}
                  </div>
                  {discount && (
                    <>
                      <del className="text-sm text-opacity-50 md:text-15px pl-3  text-gray-500 ">
                        {basePrice}
                      </del>
                      <span className="inline-block rounded font-bold text-xs md:text-sm bg-primary/10  text-primary uppercase px-2 py-1 ml-2.5 ">
                        {discount} off
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
            <span className="border-t border-dashed w-full" />

            <div className="">
              <h3 className="text-xl text-gray-800 dark:text-white font-medium">
                تفاصيل المنتج:
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-200">
                {product?.description}
              </p>
            </div>
            <span className="border-t border-dashed w-full" />

            {/* <QuickViewShortDetails {...{ product, selectedVariation }} /> */}
          </div>
          <div className="py-4">
            {Object.keys(variations).map((variation) => {
              return (
                <ProductAttributes
                  key={`popup-attribute-key${variation}`}
                  variations={variations}
                  attributes={attributes}
                  setAttributes={setAttributes}
                />
              );
            })}
          </div>
          <div className="flex items-center space-x-4">
            <Counter
              variant="single"
              value={selectedQuantity}
              onIncrement={() => setSelectedQuantity((prev) => prev + 1)}
              onDecrement={() =>
                setSelectedQuantity((prev) => (prev !== 1 ? prev - 1 : 1))
              }
              disabled={
                isInCart(item._id)
                  ? getItemFromCart(item._id).quantity + selectedQuantity >=
                    Number(item.stock)
                  : selectedQuantity >= Number(item.stock)
              }
            />
            <Button
              onClick={addToCart}
              className="  flex items-center gap-3"
              disabled={isLoading}

              // loading={addToCartLoader}
            >
              <Icons.cart className="ml-3 w-4 " />
              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <Loader className="animate-spin" />
                  <p>اضافة لعربة التسوق</p>
                </div>
              ) : (
                <p>اضافة لعربة التسوق</p>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
