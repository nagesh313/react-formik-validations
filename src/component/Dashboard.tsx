import { Container, Grid, Typography } from "@material-ui/core";
import { withSnackbar } from "notistack";
import React from "react";
import { NavbarComponent } from "./Navbar";
import OrderListComponent from "./OrderList";

const DashboardComponent = () => {
  return (
    <>
      <NavbarComponent></NavbarComponent>
      <Container>
        <Grid container>
          <Grid item xs={12}>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
              style={{ textAlign: "left", margin: "0px" }}
            >
              Past Orders
            </Typography>
          </Grid>
        </Grid>

        <OrderListComponent></OrderListComponent>
      </Container>
    </>
  );
};
export const Dashboard = withSnackbar(DashboardComponent);
