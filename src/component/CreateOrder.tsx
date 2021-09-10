import {
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { Autocomplete } from "@material-ui/lab";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import axios from "axios";
import { Form, Formik } from "formik";
import { withSnackbar } from "notistack";
import React, { createRef, useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import * as Yup from "yup";
import { failureToast, successToast } from "../util/util";
import { NavbarComponent } from "./Navbar";
import * as _ from "lodash";
import CloseIcon from "@material-ui/icons/Close";
declare const document: any;
function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

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
const CreateOrderSchema = Yup.object().shape({
  product: Yup.string()
    .min(2, "Too Short!")
    .max(100, "Too Long!")
    .required("Required"),
  price: Yup.number(),
  brand: Yup.string()
    .min(2, "Too Short!")
    .max(100, "Too Long!")
    .required("Required"),
  type_of_sell: Yup.string(),
  qty: Yup.number().required("Required"),
  remarks: Yup.string(),
});

function CreateOrderComponent(props: any) {
  const [open, setOpen] = React.useState<any>([]);
  const [brandOpen, setBrandOpen] = React.useState<any>([]);

  const [options, setOptions] = React.useState<any>([[]]);
  const [retailer, setRetailer] = React.useState<any>("");
  const [retailersList, setRetailersList] = useState<any>([]);
  const [fieldsDisabled, setFieldsDisabled] = useState<any>([]);
  const [successMessage, setSuccessMessage] = useState<any>(null);
  const [newOrderId, setNewOrderId] = useState<any>(null);
  const [renderCount, setRenderCount] = useState<number>(1);
  const [brandList, setBrandList] = useState<any>([[]]);
  const [elRefs, setElrefs] = useState<any>([]);
  const [salesOrder, setSalesOrder] = useState<any>([]);
  const classes = useStyles();
  const { params }: any = useRouteMatch();
  function resetAllOrder() {
    localStorage.removeItem("salesOrder");
    localStorage.removeItem("fieldsDisabled");
    localStorage.removeItem("elRefs");
    setElrefs([]);
    setFieldsDisabled([false]);
    setRetailer("");
    setSalesOrder([]);
  }
  function addItem() {
    let newSalesOrder = _.cloneDeep(salesOrder);
    const newFieldsDisabled = _.cloneDeep(fieldsDisabled);
    const newElRefs = _.cloneDeep(elRefs);
    newSalesOrder.push({ qty: 0, price: 0 });
    const newRef: any = createRef();
    newElRefs.push(newRef);
    newFieldsDisabled.push(false);

    const items = [];
    for (let i = 0; i < newElRefs.length; i++) {
      if (salesOrder[i]?.isDeleted) {
        items.push({ isDeleted: true });
      } else {
        items.push(newElRefs[i]?.current?.values ?? {});
      }
    }
    setSalesOrder(newSalesOrder);
    setFieldsDisabled(newFieldsDisabled);
    setElrefs(newElRefs);
    localStorage.setItem("salesOrder", JSON.stringify(items));
    localStorage.setItem("fieldsDisabled", JSON.stringify(fieldsDisabled));
    localStorage.setItem("elRefs", JSON.stringify(newElRefs));
  }
  function deleteItem(index: any) {
    let newSalesOrder = _.cloneDeep(salesOrder);
    const newFieldsDisabled = _.cloneDeep(fieldsDisabled);
    newSalesOrder[index].isDeleted = true;
    const items = [];
    for (let i = 0; i < elRefs.length; i++) {
      if (salesOrder[i]?.isDeleted || i === index) {
        items.push({ isDeleted: true });
      } else {
        items.push(elRefs[i]?.current?.values ?? {});
      }
    }
    setSalesOrder(items);
    localStorage.setItem("salesOrder", JSON.stringify(items));
    localStorage.setItem("fieldsDisabled", JSON.stringify(newFieldsDisabled));
    localStorage.setItem("elRefs", JSON.stringify(elRefs));
  }

  const history = useHistory();
  function navigateToConfirmedOrderDetails(orderId: any) {
    history.push("/confirmedOrderDetails/" + orderId);
  }
  const CreateOrderSubmit = async (values: any) => {
    let isValid = true;
    const items = [];
    for (let i = 0; i < elRefs.length; i++) {
      if (salesOrder[i].isDeleted) {
      } else {
        items.push(elRefs[i].current.values);
        await elRefs[i].current.validateForm();
        const valid = elRefs[i].current.isValid;
        if (!valid) {
          isValid = false;
        }
      }
    }
    if (!isValid) {
      props.enqueueSnackbar("Correct Form Errors to save", failureToast);
      return;
    }
    if (params.id) {
      axios
        .patch("/api/v1/sales_order/" + params.id, {
          retailer,
          items: items,
        })
        .then((response: any) => {
          if (response.data.success) {
            props.enqueueSnackbar("Order Updated Successfully", successToast);
            setSuccessMessage("Updated");
          } else {
            props.enqueueSnackbar(response.data.error, failureToast);
          }
        })
        .catch((reponse: any) => {
          if (reponse?.error) {
            props.enqueueSnackbar(reponse.message, failureToast);
          }
        });
    } else {
      axios
        .post("/api/v1/sales_order", { retailer, items: items })
        .then((response: any) => {
          if (response.data.success) {
            setElrefs([]);
            setSalesOrder([]);
            setRetailer([]);
            setFieldsDisabled([]);
            setNewOrderId(response.data.data.order_id);
            props.enqueueSnackbar("Order Created Successfully", successToast);
          } else {
            props.enqueueSnackbar(response.data.error, failureToast);
          }
        })
        .catch((reponse: any) => {
          if (reponse?.error) {
            props.enqueueSnackbar(reponse.message, failureToast);
          }
        });
    }
  };
  const fetchBrands = async (productName: string, index: any) => {
    const url = "/api/v1/products/" + productName + "/brand";
    const brand = await axios
      .get(url)
      .then((response: any) => {
        return response.data?.brand;
      })
      .catch((reponse: any) => {
        if (reponse?.error) {
          props.enqueueSnackbar("Error While fetching brands", failureToast);
        }
      });
    return brand;
  };
  const fetchRetailers = () => {
    const url = "/api/v1/retailers";
    axios
      .get(url)
      .then((response: any) => {
        setRetailersList(response.data?.retailers);
      })
      .catch((reponse: any) => {
        if (reponse?.error) {
          props.enqueueSnackbar(reponse.error, failureToast);
        }
      });
  };
  const fetchBrandList = async (index: any, value: any) => {
    if (value?.length < 3) {
      return;
    }
    const response = await fetch("/api/v1/brands?prefix=" + value);
    const data = await response.json();
    const newOptions: any = [...brandList];
    if (data?.brands?.length > 0) {
      newOptions[index] = Object.keys(data?.brands).map(
        (key) => data?.brands[key]
      );
      setBrandList(newOptions);
    } else {
      newOptions[index] = [];
      setBrandList(newOptions);
    }
  };

  const fetchSalesOrder = () => {
    if (localStorage.getItem("salesOrder") !== null) {
      setSalesOrder(JSON.parse(localStorage.getItem("salesOrder") || "[]"));
    }
    if (localStorage.getItem("fieldsDisabled") !== null) {
      setFieldsDisabled(
        JSON.parse(localStorage.getItem("fieldsDisabled") || "[]")
      );
    }
    if (localStorage.getItem("elRefs") !== null) {
      setElrefs(JSON.parse(localStorage.getItem("elRefs") || "[]"));
    }

    if (params.id) {
      const url = "/api/v1/sales_order/" + params.id;
      axios
        .get(url)
        .then((response: any) => {
          setRetailer(response.data?.data?.retailer);
          setSalesOrder(response.data?.data?.orders);
          let newFieldsDisabled: any = [];
          let newElefs: any = [];
          response.data?.data?.orders?.forEach((data: any, index: number) => {
            let newRef: any = React.createRef();
            newElefs.push(newRef);
            newFieldsDisabled[index] = true;
          });
          setElrefs(newElefs);
          setFieldsDisabled(newFieldsDisabled);
        })
        .catch((reponse: any) => {
          props.enqueueSnackbar(
            "Error while fetching sales order",
            failureToast
          );
        });
    } else {
      if (localStorage.getItem("salesOrder") === null) {
        addItem();
      }
    }
  };
  useEffect(() => {
    fetchRetailers();
    fetchSalesOrder();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateLocalStorageForData = () => {
    const items = [];
    for (let i = 0; i < elRefs.length; i++) {
      if (salesOrder[i]?.isDeleted) {
        items.push({ isDeleted: true });
      } else {
        items.push(elRefs[i]?.current?.values ?? []);
      }
    }
    localStorage.setItem("salesOrder", JSON.stringify(items));
    localStorage.setItem("fieldsDisabled", JSON.stringify(fieldsDisabled));
    localStorage.setItem("elRefs", JSON.stringify(elRefs));
  };
  const onChangeHandle = async (index: any, value: any) => {
    if (value?.length < 3) {
      return;
    }
    const response = await fetch("/api/v1/products?prefix=" + value);
    const products = await response.json();
    const newOptions: any = [...options];
    newOptions[index] = Object.keys(products.data).map(
      (key) => products.data[key]
    );
    setOptions(newOptions);
  };

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);
  React.useEffect(() => {
    if (!brandOpen) {
      setBrandOpen([]);
    }
  }, [brandOpen]);

  return (
    <React.Fragment>
      <NavbarComponent></NavbarComponent>
      <Container component="main" maxWidth="lg">
        <Grid container spacing={2}>
          {successMessage !== null && (
            <Grid
              item
              xs={12}
              style={{ marginBottom: "10px", cursor: "pointer" }}
            >
              <Alert severity="success">{successMessage}</Alert>
            </Grid>
          )}
          {newOrderId !== null && (
            <Grid
              item
              xs={12}
              style={{ marginBottom: "10px", cursor: "pointer" }}
              onClick={() => {
                navigateToConfirmedOrderDetails(newOrderId);
              }}
            >
              <Alert severity="success">
                New Order with order ID {newOrderId} created
              </Alert>
            </Grid>
          )}

          <Grid item xs={6} style={{ textAlign: "left" }}>
            <FormControl
              variant="outlined"
              className={classes.formControl}
              size="small"
            >
              <InputLabel id="demo-simple-select-helper-label">
                Retailer
              </InputLabel>
              <Select
                style={{ background: "white" }}
                value={retailer}
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                onChange={(value1: any, value2: any) => {
                  setRetailer(value2.props.value);
                }}
                label="Retailer"
              >
                {retailersList?.map((retailer: any) => {
                  return (
                    <MenuItem value={retailer.name} key={retailer.name}>
                      {retailer.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} style={{ textAlign: "right" }}>
            {!params.id && (
              <Button
                variant="outlined"
                color="primary"
                onClick={resetAllOrder}
                style={{ backgroundColor: "white", marginRight: "5px" }}
              >
                Reset
              </Button>
            )}
          </Grid>
        </Grid>
        {salesOrder?.length > 0 &&
          salesOrder?.map((saleOrder: any, index: any) => {
            let initialValues = {
              product: saleOrder.product,
              price:
                saleOrder.price === null || saleOrder.price === undefined
                  ? ""
                  : saleOrder.price,

              brand:
                saleOrder.brand === null || saleOrder.brand === undefined
                  ? ""
                  : saleOrder.brand,

              type_of_sell:
                saleOrder.type_of_sell === null ||
                saleOrder.type_of_sell === undefined
                  ? ""
                  : saleOrder.type_of_sell,
              qty: saleOrder.qty,
              remarks:
                saleOrder.remarks === null || saleOrder.remarks === undefined
                  ? ""
                  : saleOrder.remarks,
            };
            let quantityRef: any = React.createRef();
            initialValues = _.cloneDeep(initialValues);
            return (
              <React.Fragment key={"Frag" + index}>
                {!saleOrder.isDeleted && (
                  <Paper
                    hidden={true}
                    className={classes.paper}
                    key={"Paper" + index}
                    elevation={4}
                    style={{ marginTop: "24px" }}
                  >
                    <Formik
                      enableReinitialize
                      innerRef={elRefs[index]}
                      initialValues={initialValues}
                      key={"Formik" + index}
                      id={"Formik" + index + renderCount}
                      name={"Formik" + index + renderCount}
                      validationSchema={CreateOrderSchema}
                      onSubmit={(values: any) => {
                        CreateOrderSubmit(values);
                      }}
                    >
                      {({
                        errors,
                        touched,
                        handleBlur,
                        values,
                        handleChange,
                        setFieldValue,
                      }) => {
                        return (
                          <Form
                            className={classes.form}
                            noValidate
                            key={"Form" + index}
                            style={{ marginTop: "0px" }}
                            onKeyUp={(value: any) => {
                              updateLocalStorageForData();
                            }}
                            onBlur={(value: any) => {
                              updateLocalStorageForData();
                            }}
                            onChange={(value: any) => {
                              updateLocalStorageForData();
                            }}
                          >
                            <div
                              key={index}
                              style={{
                                padding: "0px",
                                margin: "0px",
                                textAlign: "right",
                                position: "relative",
                                lineHeight: 0,
                                top: "-8px",
                              }}
                            >
                              <CloseIcon
                                key={index}
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  deleteItem(index);
                                }}
                              ></CloseIcon>
                            </div>
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Autocomplete
                                  freeSolo
                                  id={"product" + index}
                                  size="small"
                                  value={saleOrder.product}
                                  open={open[index]}
                                  onOpen={() => {
                                    const newOpen = [...open];
                                    newOpen[index] = true;
                                    setOpen(newOpen);
                                  }}
                                  onClose={() => {
                                    const newOpen = [...open];
                                    newOpen[index] = false;
                                    setOpen(newOpen);
                                  }}
                                  getOptionSelected={(option, value) =>
                                    option.name === value.name
                                  }
                                  getOptionLabel={(option) =>
                                    option.name || values.product
                                  }
                                  renderOption={(option, state) => {
                                    return (
                                      <Grid container>
                                        <Grid item>{option.name}</Grid>
                                        <Grid container>
                                          <Grid item xs={6}>
                                            <Typography
                                              variant="caption"
                                              display="block"
                                            >
                                              {option.type_of_sell}
                                            </Typography>
                                          </Grid>
                                          <Grid
                                            item
                                            xs={6}
                                            style={{ textAlign: "right" }}
                                          >
                                            <Typography
                                              variant="caption"
                                              display="block"
                                            >
                                              {option.price}
                                            </Typography>
                                          </Grid>
                                        </Grid>
                                      </Grid>
                                    );
                                  }}
                                  onChange={async (ev: any, value: any) => {
                                    const newFieldsEnabled = [
                                      ...fieldsDisabled,
                                    ];
                                    newFieldsEnabled[index] = false;
                                    setFieldsDisabled(newFieldsEnabled);
                                    setFieldValue("price", 0);
                                    setFieldValue("type_of_sell", "");
                                    setFieldValue("brand", "");
                                    if (value === null) {
                                      const newFieldsEnabled = [
                                        ...fieldsDisabled,
                                      ];
                                      newFieldsEnabled[index] = false;
                                      setFieldsDisabled(newFieldsEnabled);
                                    } else {
                                      setFieldValue("product", value.name);
                                      setFieldValue("price", value.price);
                                      setFieldValue(
                                        "type_of_sell",
                                        value.type_of_sell
                                      );
                                      const brand = await fetchBrands(
                                        value.name,
                                        index
                                      );
                                      setFieldValue("brand", brand);
                                      const newFieldsEnabled = [
                                        ...fieldsDisabled,
                                      ];
                                      newFieldsEnabled[index] = true;
                                      setFieldsDisabled(newFieldsEnabled);
                                      document
                                        .getElementById("qty" + index)
                                        .focus();
                                    }
                                    setRenderCount(renderCount + 1);
                                  }}
                                  options={options[index] || []}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="Product"
                                      id={"product-text" + index}
                                      variant="outlined"
                                      error={
                                        errors.product && touched.product
                                          ? true
                                          : false
                                      }
                                      helperText={
                                        touched.product && errors.product
                                      }
                                      name="product"
                                      value={values.product}
                                      onBlur={handleBlur}
                                      onChange={(ev) => {
                                        const newFieldsEnabled = [
                                          ...fieldsDisabled,
                                        ];
                                        newFieldsEnabled[index] = false;
                                        setFieldsDisabled(newFieldsEnabled);
                                        setFieldValue("price", 0);
                                        setFieldValue("type_of_sell", "");
                                        setFieldValue("brand", "");
                                        // dont fire API if the user delete or not entered anything
                                        if (
                                          ev.target.value !== "" ||
                                          ev.target.value !== null
                                        ) {
                                          onChangeHandle(
                                            index,
                                            ev.target.value
                                          );
                                        }
                                        setFieldValue(
                                          "product",
                                          ev.target.value
                                        );
                                        setRenderCount(renderCount + 1);
                                      }}
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={4} sm={6}>
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  disabled={fieldsDisabled[index]}
                                  id={"price" + index}
                                  type="number"
                                  label="MRP"
                                  name="price"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.price}
                                  error={
                                    errors.price && touched.price ? true : false
                                  }
                                  helperText={touched.price && errors.price}
                                />
                              </Grid>
                              <Grid item xs={8} sm={6}>
                                <TextField
                                  variant="outlined"
                                  disabled={fieldsDisabled[index]}
                                  fullWidth
                                  size="small"
                                  id={"type_of_sell" + index}
                                  label="Type Of Sell"
                                  name="type_of_sell"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.type_of_sell}
                                  error={
                                    errors.type_of_sell && touched.type_of_sell
                                      ? true
                                      : false
                                  }
                                  helperText={
                                    touched.type_of_sell && errors.type_of_sell
                                  }
                                />
                              </Grid>
                              <Grid item xs={8} sm={6}>
                                <Autocomplete
                                  fullWidth
                                  size="small"
                                  disabled={fieldsDisabled[index]}
                                  id={"brand-auto" + index}
                                  open={brandOpen[index]}
                                  value={values.brand}
                                  getOptionSelected={(
                                    option: any,
                                    value: any
                                  ) => option.name === value.name}
                                  getOptionLabel={(option) =>
                                    option.name || values.brand
                                  }
                                  onOpen={() => {
                                    const newOpen = [...brandOpen];
                                    newOpen[index] = true;
                                    setBrandOpen(newOpen);
                                  }}
                                  onClose={() => {
                                    const newOpen = [...brandOpen];
                                    newOpen[index] = false;
                                    setBrandOpen(newOpen);
                                  }}
                                  // getOptionLabel={(option) => brandList.name}
                                  options={brandList[index] || []}
                                  onChange={(ev: any, value: any) => {
                                    setFieldValue("brand", value?.name);
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      value={values.brand}
                                      name="brand"
                                      label="Company"
                                      required
                                      {...params}
                                      variant="outlined"
                                      InputProps={{
                                        ...params.InputProps,
                                      }}
                                      onChange={(ev) => {
                                        // dont fire API if the user delete or not entered anything
                                        if (
                                          ev.target.value !== "" ||
                                          ev.target.value !== null
                                        ) {
                                          fetchBrandList(
                                            index,
                                            ev.target.value
                                          );
                                        }
                                        setFieldValue("brand", ev.target.value);
                                        setRenderCount(renderCount + 1);
                                      }}
                                    />
                                  )}
                                />
                              </Grid>
                              <Grid item xs={4} sm={6}>
                                <TextField
                                  innerRef={quantityRef}
                                  variant="outlined"
                                  required
                                  fullWidth
                                  size="small"
                                  name="qty"
                                  label="Quantity"
                                  id={"qty" + index}
                                  type="number"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.qty}
                                  error={
                                    errors.qty && touched.qty ? true : false
                                  }
                                  helperText={touched.qty && errors.qty}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  size="small"
                                  name="remarks"
                                  label="Remarks"
                                  id={"remarks" + index}
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.remarks}
                                  inputProps={{ maxLength: 100 }}
                                  error={
                                    errors.remarks && touched.remarks
                                      ? true
                                      : false
                                  }
                                  helperText={touched.remarks && errors.remarks}
                                />
                              </Grid>
                            </Grid>
                          </Form>
                        );
                      }}
                    </Formik>
                  </Paper>
                )}
              </React.Fragment>
            );
          })}
        <Button
          fullWidth
          size="small"
          variant="contained"
          color="primary"
          onClick={addItem}
          className={classes.submit}
          style={{ marginTop: "1em" }}
        >
          Add Item
        </Button>
        <Button
          type="submit"
          fullWidth
          size="small"
          variant="contained"
          color="primary"
          style={{ marginBottom: "3em" }}
          onClick={CreateOrderSubmit}
          disabled={elRefs.length === 0}
        >
          {params.id ? "Update Order" : "Create Order"}
        </Button>
      </Container>
    </React.Fragment>
  );
}
export const CreateOrder = withSnackbar(CreateOrderComponent);
