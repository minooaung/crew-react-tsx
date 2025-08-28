import { useMutation } from "@tanstack/react-query";
import { useAxios } from "../useAxios";
import { useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import { AuthResponseBase, LoginCredentials, SignupData } from "../../types";

export const useLogin = () => {
  const axios = useAxios();
  const dispatch = useDispatch();

  console.log("Backend framework:", import.meta.env.VITE_BACKEND_FRAMEWORK);

  let loginURL = "/login";
  if (import.meta.env.VITE_BACKEND_FRAMEWORK === "ASP.NET") {
    loginURL = "/auth/login"; // Adjust URL for ASP.NET backend
  }

  console.log("Using login URL:", loginURL);

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await axios.post<AuthResponseBase>(
        loginURL,
        credentials
      );
      return data;
    },
    onSuccess: (data) => {
      dispatch(authActions.settingUser(data.user));
    },
  });
};

export const useSignup = () => {
  const axios = useAxios();
  const dispatch = useDispatch();

  let signupURL = "/signup";
  if (import.meta.env.VITE_BACKEND_FRAMEWORK === "ASP.NET") {
    signupURL = "/auth/signup"; // Adjust URL for ASP.NET backend
  }

  return useMutation({
    mutationFn: async (userData: SignupData) => {
      const { data } = await axios.post<AuthResponseBase>(signupURL, userData);
      return data;
    },
    onSuccess: (data) => {
      console.log("Signup successful:", data.user);
      dispatch(authActions.settingUser(data.user));
    },
  });
};

export const useLogout = () => {
  const axios = useAxios();
  const dispatch = useDispatch();

  let logoutURL = "/logout";
  if (import.meta.env.VITE_BACKEND_FRAMEWORK === "ASP.NET") {
    logoutURL = "/auth/logout"; // Adjust URL for ASP.NET backend
  }

  return useMutation({
    mutationFn: async () => {
      await axios.post(logoutURL);
    },
    onSuccess: () => {
      dispatch(authActions.logout());
    },
  });
};
