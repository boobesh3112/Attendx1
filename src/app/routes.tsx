import { createBrowserRouter } from "react-router";
import { Splash } from "./pages/Splash";
import { SignUp } from "./pages/SignUp";
import { Login } from "./pages/Login";
import { InitialSetup } from "./pages/InitialSetup";
import { MainLayout } from "./layouts/MainLayout";
import { Home } from "./pages/Home";
import { Mark } from "./pages/Mark";
import { Analytics } from "./pages/Analytics";
import { Students } from "./pages/Students";
import { Profile } from "./pages/Profile";
import { Timetable } from "./pages/Timetable";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Splash,
  },
  {
    path: "/signup",
    Component: SignUp,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/setup",
    Component: InitialSetup,
  },
  {
    path: "/app",
    Component: MainLayout,
    children: [
      { index: true, Component: Home },
      { path: "mark", Component: Mark },
      { path: "analytics", Component: Analytics },
      { path: "students", Component: Students },
      { path: "timetable", Component: Timetable },
      { path: "profile", Component: Profile },
    ],
  },
]);
