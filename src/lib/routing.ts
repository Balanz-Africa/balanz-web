import type { Screen } from "../types/balanz";

const screenPaths: Record<Screen, string> = {
  landing: "/",
  signin: "/signin",
  signup: "/signup",
  "verify-email": "/verify-email",
  "forgot-password": "/forgot-password",
  "reset-password": "/reset-password",
  dashboard: "/dashboard",
};

export function pathForScreen(screen: Screen) {
  return screenPaths[screen];
}

export function screenFromPath(pathname: string): Screen {
  switch (pathname) {
    case "/signin":
      return "signin";
    case "/signup":
      return "signup";
    case "/verify-email":
      return "verify-email";
    case "/forgot-password":
      return "forgot-password";
    case "/reset-password":
      return "reset-password";
    case "/dashboard":
      return "dashboard";
    default:
      return "landing";
  }
}
