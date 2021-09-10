import React from "react";
import { ConfirmedOrderDetails } from "../component/ConfirmedOrderDetails";
import { CreateOrder } from "../component/CreateOrder";
import { CreateRetailer } from "../component/CreateRetailer";
import { Dashboard } from "../component/Dashboard";
import { SignIn } from "../component/SignIn";
export const dashboardRoutes = [
  {
    path: "/signin",
    component: <SignIn></SignIn>,
  },
  {
    path: "/dashboard",
    component: <Dashboard></Dashboard>,
  },
  {
    path: "/createOrder/:id",
    component: <CreateOrder></CreateOrder>,
  },
  {
    path: "/createOrder",
    component: <CreateOrder></CreateOrder>,
  },
  {
    path: "/confirmedOrderDetails/:id",
    component: <ConfirmedOrderDetails></ConfirmedOrderDetails>,
  },
  {
    path: "/create-retailer",
    component: <CreateRetailer></CreateRetailer>,
  },

  {
    path: "/",
    component: <SignIn></SignIn>,
  },
];
