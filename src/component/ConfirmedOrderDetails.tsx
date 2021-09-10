import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import Container from "@material-ui/core/Container";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import { withSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { failureToast } from "../util/util";
import { NavbarComponent } from "./Navbar";

const useStyles = makeStyles((theme) => ({
  formControl: {
    minWidth: 120,
  },
  grow: {
    flexGrow: 1,
  },
  paper: {
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  sectionDesktop: {
    display: "flex",
  },
}));
function ConfirmedOrderDetailsComponent(props: any) {
  const [salesOrder, setSalesOrder] = useState<any>([]);
  const classes = useStyles();

  const { params }: any = useRouteMatch();
  const fetchSalesOrder = () => {
    if (params.id) {
      const url = "/api/v1/sales_order/" + params.id;
      axios
        .get(url)
        .then((response: any) => {
          setSalesOrder(response.data?.data);
        })
        .catch((reponse: any) => {
          if (reponse?.error) {
            props.enqueueSnackbar(
              "Error while fetching sales order",
              failureToast
            );
          }
        });
    }
  };
  useEffect(() => {
    fetchSalesOrder();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const date = salesOrder?.placed_at?.split("T")[0];
  let dateTime = "";
  if (date) {
    dateTime = date + " " + salesOrder.placed_at?.split("T")[1]?.split(".")[0];
  }

  return (
    <React.Fragment>
      <NavbarComponent></NavbarComponent>
      <Container component="main" maxWidth="lg">
        <Paper className={classes.paper} style={{ textAlign: "left" }}>
          <Grid container>
            <Grid item xs={3}>
              OrderId :
            </Grid>
            <Grid item xs={3}>
              {salesOrder.order_id}
            </Grid>
            <Grid item xs={3}>
              Status
            </Grid>
            <Grid item xs={3}>
              {salesOrder.state === "placed" ? "Placed" : "Confirmed"}
            </Grid>
          </Grid>
          <Grid container>
            <Grid item xs={3}>
              Retailer Name
            </Grid>
            <Grid item xs={3}>
              {salesOrder.retailer}
            </Grid>
            <Grid item xs={3}>
              Placed Time
            </Grid>
            <Grid item xs={3}>
              {dateTime}
            </Grid>
          </Grid>
        </Paper>
        <Paper style={{ marginTop: "20px" }}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="left" variant="head">
                    <b>Product Name</b>
                  </TableCell>
                  <TableCell align="center">
                    <b>Quantity</b>
                  </TableCell>
                  <TableCell align="center">
                    <b>Confirmed Quantity</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {salesOrder?.orders?.map((row: any, index: any) => {
                  return (
                    <TableRow key={index}>
                      <TableCell align="left">{row.product}</TableCell>
                      <TableCell align="center">{row.qty}</TableCell>
                      <TableCell align="center">
                        {row.confirmed_quantity}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </React.Fragment>
  );
}
export const ConfirmedOrderDetails = withSnackbar(
  ConfirmedOrderDetailsComponent
);
