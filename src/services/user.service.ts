// import { API_ENDPOINTS } from "@/utils/api/api-endpoints";
// import { HttpClient } from "@/utils/api/http";
// import {
//   TChangePassword,
//   TLogin,
//   TProfile,
//   TSignup,
//   TVerify,
//   loginResponseSchema,
//   mutationResponseSchema,
// } from "@/validations/auth";
// import { IUser } from "@/types";

// export const userClient = {
//   me: () => {
//     return HttpClient.get<IUser>(`/users/${API_ENDPOINTS.ME}`);
//   },
//   login: (variables: TLogin) => {
//     return HttpClient.post<loginResponseSchema>(
//       `/auth/${API_ENDPOINTS.LOGIN}`,
//       variables
//     );
//   },
//   emailVerify: (variables: TVerify) => {
//     return HttpClient.post<loginResponseSchema>(
//       `/auth/${API_ENDPOINTS.ACTIVATE}`,
//       variables
//     );
//   },

//   changePassword: (variables: TChangePassword) => {
//     return HttpClient.post<{ message: string }>(
//       `/auth/${API_ENDPOINTS.CHANGE_PASSWORD}`,
//       variables
//     );
//   },

//   updateUser: (variables: TProfile) => {
//     return HttpClient.patch<{ message: string }>(`/users`, variables);
//   },
//   logout: () => {
//     return HttpClient.post<any>(`/auth/${API_ENDPOINTS.LOGOUT}`, {});
//   },

//   loginWithGoogle: (variables: { credential: string }) => {
//     return HttpClient.post<loginResponseSchema>(
//       `/auth/${API_ENDPOINTS.GOOGLE}`,
//       variables
//     );
//   },

//   register: (variables: TSignup) => {
//     return HttpClient.post<mutationResponseSchema>(
//       `/auth/${API_ENDPOINTS.REGISTER}`,
//       variables
//     );
//   },
// };
// @/services/user.service.ts
import { axiosClient } from "@/utils/api/http";
import { TChangePassword, TLogin, TSignup, TVerify } from "@/validations/auth";

class UserClient {
  async register(data: TSignup) {
    const response = await axiosClient.post("/api/auth/register", data);
    return response.data;
  }

  async login(data: TLogin) {
    const response = await axiosClient.post("/api/auth/login", data);
    return response.data;
  }

  async emailVerify(data: TVerify) {
    const response = await axiosClient.post("/api/auth/verify", data);
    return response.data;
  }

  async changePassword(data: TChangePassword) {
    const response = await axiosClient.post("/api/auth/change-password", data);
    return response.data;
  }

  async logout() {
    const response = await axiosClient.post("/api/auth/logout");
    return response.data;
  }
}

export const userClient = new UserClient();
