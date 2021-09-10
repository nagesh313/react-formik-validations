import axios from "axios";
import { withSnackbar } from "notistack";
import React, { useEffect } from "react";
import { Route, Switch, useHistory } from "react-router-dom";
import "./App.css";
import { dashboardRoutes } from "./routes/routes";
import { failureToast } from "./util/util";

export function AppComponent(props: any) {
  const history = useHistory();
  useEffect(() => {
    axios.interceptors.request.use(
      (req) => {
        return req;
      },
      (err) => {
        if (err?.response?.status === 401) {
          history.push("/signIn");
          props.enqueueSnackbar(
            "Invalid Session.Please log in again",
            failureToast
          );
        } else {
          return Promise.reject(err);
        }
      }
    );

    // For POST requests
    axios.interceptors.response.use(
      (res) => {
        return res;
      },
      (err) => {
        if (err?.response?.status === 401) {
          history.push("/signIn");
          props.enqueueSnackbar(
            "Invalid Session.Please log in again",
            failureToast
          );
        } else {
          return Promise.reject(err);
        }
      }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="App">
      <Switch>
        {dashboardRoutes.map((route: any) => {
          return (
            <Route path={route.path} key={route.path}>
              {route.component}
            </Route>
          );
        })}
      </Switch>
    </div>
  );
}
export const App = withSnackbar(AppComponent);
