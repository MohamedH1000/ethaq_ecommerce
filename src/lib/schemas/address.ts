import { z } from "zod";

export const addressSchema = z.object({
  street: z.string().min(5, "يجب أن يحتوي عنوان الشارع على الأقل 5 أحرف"),
  city: z.string().min(2, "يجب تحديد المدينة"),
  state: z.string().min(2, "يجب تحديد المنطقة"),
  // postcode: z
  //   .string()
  //   .regex(/^\d+$/, "يجب أن يحتوي الرمز البريدي على أرقام فقط"),
});
