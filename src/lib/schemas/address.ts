import { z } from "zod";

export const addressSchema = z.object({
  name: z.string().min(2, "يجب أن يكون الاسم على الأقل حرفين"),
  country: z.string().min(2, "يجب تحديد الدولة"),
  street: z.string().min(5, "يجب أن يحتوي عنوان الشارع على الأقل 5 أحرف"),
  city: z.string().min(2, "يجب تحديد المدينة"),
  state: z.string().min(2, "يجب تحديد المنطقة"),
  postcode: z
    .string()
    .regex(/^\d+$/, "يجب أن يحتوي الرمز البريدي على أرقام فقط"),
  email: z.string().email("يجب إدخال بريد إلكتروني صحيح"),
  phone: z.string().regex(/^\+?\d{10,15}$/, "يجب إدخال رقم هاتف صحيح"),
  default: z.boolean().optional(),
});
