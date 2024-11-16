import { UserInfo } from "@/types/user";
import { create } from "zustand";

type UserInfoStore = {
  userInfo: UserInfo | null;
  setUserInfo: (info: UserInfo) => void;
};

export const useUserInfoStore = create<UserInfoStore>((set) => ({
  userInfo: null,
  setUserInfo: (info) => set({ userInfo: info }),
}));
