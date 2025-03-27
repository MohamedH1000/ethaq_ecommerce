import { IUser } from "@/types";
import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون 6 أحرف على الأقل"),
});

export type TLogin = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  username: z.string().min(3, "الاسم يجب أن يكون 3 أحرف على الأقل"),
  email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
  phoneNumber: z.string().min(10, "رقم الهاتف يجب أن يكون صحيحاً"),
});

export type TSignup = z.infer<typeof signupSchema>;

export const verfifyEmailSchema = z.object({
  email: z.string().email("يرجى إدخال بريد إلكتروني صحيح"),
  code: z.string().min(6, "الرمز يجب أن يكون 6 أرقام"),
});

export type TVerify = z.infer<typeof verfifyEmailSchema>;

export type LoginWithGoogleParams = {
  credential: string;
};

export interface mutationResponseSchema {
  message: string;
}
export interface loginResponseSchema {
  message: string;
  token: string;
  expires_in: string;
  user: IUser;
}

export interface mutationActivationResponse {
  message: string;
  role: string;
}

// export const signupSchema = authSchema.refine(
//   data => data.password === data.passwordConfirm,
//   {
//     message: 'Passwords do not match',
//     path: ['passwordConfirm'],
//   }
// );
// export type TSignup = z.infer<typeof signupSchema>;

// export const loginSchema = authSchema.omit({
//   firstName: true,
//   lastName: true,
//   passwordConfirm: true,
// });

// export const activateSchema = z.object({
//   token: z.string(),
// });

// export type TVerify = z.infer<typeof activateSchema>;

// export type TLogin = z.infer<typeof loginSchema>;

// export const profileSchema = authSchema.omit({
//   password: true,
//   passwordConfirm: true,
// });
// export type TProfile = z.infer<typeof profileSchema>;

// export const verfifyEmailSchema = z.object({
//   token: z
//     .string()
//     .min(6, {
//       message: 'Verification code must be 6 characters long',
//     })
//     .max(6),
// });

export const changePassSchema = z.object({
  oldPassword: z.string().min(8, {
    message: "Password must be at least 8 characters long",
  }),
  newPassword: z.string().min(8),
  newPasswordConfirm: z.string().min(8),
});

export const changePasswordSchema = changePassSchema.refine(
  (data) => data.newPassword === data.newPasswordConfirm,
  {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  }
);

export type TChangePassword = z.infer<typeof changePasswordSchema>;
