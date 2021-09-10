import DateFnsUtils from "@date-io/date-fns";
import { Button, Grid, Hidden, Typography, withWidth } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import axios from "axios";
import { withSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { failureToast } from "../util/util";

export const formatDate = (data: string) => {
  if (data) {
    let hours: any = new Date(data).getHours();
    if (hours < 10) {
      hours = "0" + hours;
    }
    return (
      <Typography
        variant="caption"
        display="block"
        gutterBottom
        style={{ marginBottom: "0px" }}
      >
        {new Date(data).getDate() +
          "/" +
          new Date(data).getMonth() +
          " " +
          hours +
          ":" +
          new Date(data).getMinutes()}
      </Typography>
    );
  }
};
export const formatTableData = (data: string) => {
  return (
    <Typography
      variant="caption"
      display="block"
      gutterBottom
      style={{ marginBottom: "0px" }}
    >
      {data}
    </Typography>
  );
};
export const formatState = (data: string) => {
  if (data) {
    return (
      <Typography
        variant="caption"
        display="block"
        gutterBottom
        style={{ marginBottom: "0px" }}
      >
        {data[0].toUpperCase() + data.slice(1).toLowerCase()}
      </Typography>
    );
  }
};
const useStyles = makeStyles((theme: any) => ({
  table: {},
  grow: {
    flexGrow: 1,
  },
}));

const OrderList = (props: any) => {
  const history = useHistory();
  const [orderList, setOrderList] = useState<any>([]);
  function navigateToCreateOrder(id: any) {
    localStorage.removeItem("salesOrder");
    localStorage.removeItem("fieldsDisabled");
    localStorage.removeItem("elRefs");
    history.push("/createOrder/" + id);
  }
  function navigateToConfirmedOrderDetails(id: any) {
    localStorage.removeItem("salesOrder");
    localStorage.removeItem("fieldsDisabled");
    localStorage.removeItem("elRefs");
    history.push("/confirmedOrderDetails/" + id);
  }
  const classes = useStyles();
  const fetchOrderList = () => {
    const url = "/api/v1/sales_order";
    axios
      .get(url)
      .then((response: any) => {
        setOrderList(response.data?.data);
      })
      .catch((reponse: any) => {
        if (reponse?.error) {
          props.enqueueSnackbar(reponse.error, failureToast);
        }
      });
  };
  useEffect(() => {
    fetchOrderList();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const { width } = props;

  const search = () => {
    const url =
      "/api/v1/sales_order?from=" +
      selectedStartDate +
      "&to=" +
      selectedEndDate;
    axios
      .get(url)
      .then((response: any) => {
        setOrderList(response.data?.data);
      })
      .catch((reponse: any) => {
        if (reponse?.error) {
          props.enqueueSnackbar(reponse.error, failureToast);
        }
      });
  };
  const [selectedStartDate, setSelectedStartDate] = React.useState<Date | null>(
    null
  );
  const [selectedEndDate, setSelectedEndDate] = React.useState<Date | null>(
    null
  );
  const handleStartDateChange = (date: Date | null) => {
    setSelectedStartDate(date);
  };
  const handleEndDateChange = (date: Date | null) => {
    setSelectedEndDate(date);
  };
  return (
    <>
      <Grid container>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid item sm={2} xs={4}>
            <KeyboardDatePicker
              autoOk={true}
              InputLabelProps={{
                shrink: true,
              }}
              disableToolbar
              style={{ maxWidth: "100px" }}
              variant="inline"
              format="MM/dd"
              margin="normal"
              id="date-picker-inline1"
              label="Start Date"
              onChange={handleStartDateChange}
              value={selectedStartDate}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </Grid>
          <Grid item sm={2} xs={4}>
            <KeyboardDatePicker
              autoOk={true}
              InputLabelProps={{
                shrink: true,
              }}
              style={{ maxWidth: "100px" }}
              disableToolbar
              variant="inline"
              format="MM/dd"
              margin="normal"
              id="date-picker-inline2"
              label="End Date"
              onChange={handleEndDateChange}
              value={selectedEndDate}
              KeyboardButtonProps={{
                "aria-label": "change date",
              }}
            />
          </Grid>
          <Grid
            item
            sm={2}
            xs={4}
            style={{
              marginBottom: "1em",
              padding: "27px",
              paddingBottom: "0px",
            }}
          >
            <Button
              color="primary"
              variant="contained"
              size="small"
              onClick={() => {
                // navigateToCreateOrder(row.id);
                search();
              }}
            >
              Search
            </Button>
          </Grid>
        </MuiPickersUtilsProvider>
      </Grid>
      <TableContainer component={Paper} className="order-list">
        <Table
          className={classes.table}
          aria-label="simple table"
          size={"small"}
        >
          <TableHead>
            <TableRow>
              <TableCell>
                <b>ID</b>
              </TableCell>
              <TableCell align="center" variant="head">
                <b>Retailer</b>
              </TableCell>
              <TableCell align="center">
                <b>Quantity</b>
              </TableCell>
              <Hidden smDown>
                <TableCell align="center">
                  <b>Placed At</b>
                </TableCell>
              </Hidden>
              <Hidden smDown>
                <TableCell align="center">
                  <b>Status</b>
                </TableCell>
              </Hidden>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orderList?.map((row: any, index: any) => {
              return (
                <React.Fragment key={index}>
                  <TableRow key={"main" + index}>
                    <TableCell
                      component="th"
                      scope="row"
                      style={
                        width === "sm" || width === "xs"
                          ? {
                              borderBottom: "0px",
                              paddingTop: "0px",
                              paddingBottom: "0px",
                            }
                          : {}
                      }
                    >
                      {formatTableData(row.id)}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={
                        width === "sm" || width === "xs"
                          ? {
                              borderBottom: "0px",
                              paddingTop: "0px",
                              paddingBottom: "0px",
                            }
                          : {}
                      }
                    >
                      {formatTableData(row.retailer)}
                    </TableCell>
                    <TableCell
                      align="center"
                      style={
                        width === "sm" || width === "xs"
                          ? {
                              borderBottom: "0px",
                              paddingTop: "0px",
                              paddingBottom: "0px",
                            }
                          : {}
                      }
                    >
                      {formatTableData(row.items_count)}
                    </TableCell>
                    <Hidden smDown>
                      <TableCell
                        align="center"
                        style={
                          width === "sm" || width === "xs"
                            ? {
                                borderBottom: "0px",
                                paddingTop: "0px",
                                paddingBottom: "0px",
                              }
                            : {}
                        }
                      >
                        {formatDate(row?.placed_at)}
                      </TableCell>
                    </Hidden>
                    <Hidden smDown>
                      <TableCell
                        align="center"
                        style={
                          width === "sm" || width === "xs"
                            ? {
                                borderBottom: "0px",
                                paddingTop: "0px",
                                paddingBottom: "0px",
                              }
                            : {}
                        }
                      >
                        {formatState(row.status)}
                      </TableCell>
                    </Hidden>
                    <TableCell
                      align="right"
                      style={
                        width === "sm" || width === "xs"
                          ? {
                              borderBottom: "0px",
                              paddingBottom: "0px",
                            }
                          : {}
                      }
                    >
                      {row.status === "placed" ? (
                        <Button
                          style={{ margin: "5px" }}
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => {
                            navigateToCreateOrder(row.id);
                          }}
                        >
                          Modify
                        </Button>
                      ) : (
                        <Button
                          style={{ margin: "5px" }}
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => {
                            navigateToConfirmedOrderDetails(row.id);
                          }}
                        >
                          Track
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                  <Hidden mdUp key={"sub" + index}>
                    <TableRow>
                      <TableCell
                        component="th"
                        scope="row"
                        style={{ paddingTop: "0px", paddingBottom: "0px" }}
                      >
                        {formatDate(row?.placed_at)}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ paddingTop: "0px", paddingBottom: "0px" }}
                      ></TableCell>
                      <TableCell
                        align="center"
                        style={{ paddingTop: "0px", paddingBottom: "0px" }}
                      >
                        {formatState(row.status)}
                      </TableCell>
                      <TableCell
                        align="center"
                        style={{ paddingTop: "0px", paddingBottom: "0px" }}
                      ></TableCell>
                    </TableRow>
                  </Hidden>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
const OrderListComponent = withSnackbar(OrderList);
export default withWidth()(OrderListComponent);
