import useQueryParam from "@/hooks/use-query-params";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

const priceFilterItems = [
  {
    id: "1",
    name: "تحت 50 ريال سعودي",
    slug: "0-50",
  },
  {
    id: "2",
    name: "50 الى 100 ريال سعودي",
    slug: "50-100",
  },
  {
    id: "3",
    name: "100 الى 150 ريال سعودي",
    slug: "100-150",
  },
  {
    id: "4",
    name: "150 الى 200 ريال سعودي",
    slug: "150-200",
  },
  {
    id: "5",
    name: "200 الى 300 ريال سعودي",
    slug: "200-300",
  },
  {
    id: "6",
    name: "300 الى 500 ريال سعودي",
    slug: "300-500",
  },
  {
    id: "7",
    name: "500 الى 1000 ريال سعودي",
    slug: "500-1000",
  },
  {
    id: "8",
    name: "فوق 1000 ريال سعودي",
    slug: "1000-",
  },
];
export const PriceFilter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { updateQueryparams } = useQueryParam(pathname ?? "/");
  const [formState, setFormState] = useState<string[]>([]);

  const hasQueryKey = searchParams?.get("price");

  useEffect(() => {
    updateQueryparams("price", formState.toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]);

  useEffect(() => {
    setFormState(hasQueryKey?.split(",") ?? []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasQueryKey]);

  const items = priceFilterItems;

  function handleItemClick(slug: string) {
    setFormState((prevFormState) =>
      prevFormState.includes(slug)
        ? prevFormState.filter((item) => item !== slug)
        : [...prevFormState, slug]
    );
  }

  return (
    <div className="block border-b border-gray-300 pb-7 mb-7">
      <h3 className="text-heading text-sm md:text-base font-semibold mb-7">
        السعر
      </h3>
      <div className="mt-2 flex flex-col space-y-4">
        {items?.map((item: any) => (
          <div key={item.slug} className="flex items-center gap-3">
            <Checkbox
              name={item.name.toLowerCase()}
              checked={formState.includes(item.slug)}
              onCheckedChange={() => handleItemClick(item.slug)} // Pass the slug to handleItemClick
            />

            <Label>{item.name}</Label>
          </div>
        ))}
      </div>
    </div>
  );
};
