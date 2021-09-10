import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { Form, Formik } from "formik";
import { withSnackbar } from "notistack";
import React from "react";
import * as Yup from "yup";
import { failureToast, successToast } from "../util/util";
import { NavbarComponent } from "./Navbar";
const CreateRetailerSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(20, "Too Long!")
    .required("Required"),
  shop_name: Yup.string(),
  city: Yup.string(),
  address: Yup.string(),
  dl: Yup.string(),
  gstin: Yup.string(),
  contact_person: Yup.string(),
  contact_number: Yup.string(),
  avg_daily_sales: Yup.string(),
});
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  paper: {
    marginTop: theme.spacing(8),
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
}));

export function CreateRetailerComponent(props: any) {
  const classes = useStyles();
  const CreateRetailerSubmit = (values: any, form: any) => {
    axios
      .post("/api/v1/retailers", {
        ...values,
      })
      .then((response: any) => {
        if (response.data?.success) {
          props.enqueueSnackbar("Success", successToast);
        } else {
          props.enqueueSnackbar(response?.data?.error, failureToast);
        }
      })
      .catch((response: any) => {
        if (response?.error) {
          props.enqueueSnackbar(response.error, failureToast);
        }
      });
  };
  return (
    <React.Fragment>
      <NavbarComponent></NavbarComponent>
      <Container component="main" maxWidth="lg">
        <div className={classes.paper}>
          <Formik
            initialValues={{
              name: "",
              shop_name: "",
              city: "",
              address: "",
              dl: "",
              gstin: "",
              contact_person: "",
              contact_number: "",
              avg_daily_sales: "",
            }}
            validationSchema={CreateRetailerSchema}
            onSubmit={(values: any, form: any) => {
              CreateRetailerSubmit(values, form);
            }}
          >
            {({ errors, touched, values, handleChange }) => (
              <Form className={classes.form} noValidate>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      required
                      fullWidth
                      id="name"
                      label="Name"
                      name="name"
                      autoComplete="name"
                      autoFocus
                      onChange={handleChange}
                      value={values.name}
                      error={errors.name && touched.name ? true : false}
                      helperText={touched.name && errors.name}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="shop_name"
                      label="Shop Name"
                      name="shop_name"
                      autoComplete="shop_name"
                      autoFocus
                      onChange={handleChange}
                      value={values.shop_name}
                      error={
                        errors.shop_name && touched.shop_name ? true : false
                      }
                      helperText={touched.shop_name && errors.shop_name}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="contact_number"
                      label="Contact Number"
                      name="contact_number"
                      autoComplete="contact_number"
                      autoFocus
                      onChange={handleChange}
                      value={values.contact_number}
                      error={
                        errors.contact_number && touched.contact_number
                          ? true
                          : false
                      }
                      helperText={
                        touched.contact_number && errors.contact_number
                      }
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="address"
                      label="Address"
                      name="address"
                      autoComplete="address"
                      autoFocus
                      onChange={handleChange}
                      value={values.address}
                      error={errors.address && touched.address ? true : false}
                      helperText={touched.address && errors.address}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="dl"
                      label="DL No"
                      name="dl"
                      autoComplete="dl"
                      autoFocus
                      onChange={handleChange}
                      value={values.dl}
                      error={errors.dl && touched.dl ? true : false}
                      helperText={touched.dl && errors.dl}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="city"
                      label="City"
                      name="city"
                      autoComplete="city"
                      autoFocus
                      onChange={handleChange}
                      value={values.city}
                      error={errors.city && touched.city ? true : false}
                      helperText={touched.city && errors.city}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="gstin"
                      label="GST No"
                      name="gstin"
                      autoComplete="gstin"
                      autoFocus
                      onChange={handleChange}
                      value={values.gstin}
                      error={errors.gstin && touched.gstin ? true : false}
                      helperText={touched.gstin && errors.gstin}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="contact_person"
                      label="Contact Person"
                      name="contact_person"
                      autoComplete="contact_person"
                      autoFocus
                      onChange={handleChange}
                      value={values.contact_person}
                      error={
                        errors.contact_person && touched.contact_person
                          ? true
                          : false
                      }
                      helperText={
                        touched.contact_person && errors.contact_person
                      }
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      variant="outlined"
                      fullWidth
                      id="avg_daily_sales"
                      label="Average Daily Sales"
                      name="avg_daily_sales"
                      autoComplete="avg_daily_sales"
                      autoFocus
                      onChange={handleChange}
                      value={values.avg_daily_sales}
                      error={
                        errors.avg_daily_sales && touched.avg_daily_sales
                          ? true
                          : false
                      }
                      helperText={
                        touched.avg_daily_sales && errors.avg_daily_sales
                      }
                    />
                  </Grid>
                </Grid>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Create Retailer
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </Container>
    </React.Fragment>
  );
}
export const CreateRetailer = withSnackbar(CreateRetailerComponent);
