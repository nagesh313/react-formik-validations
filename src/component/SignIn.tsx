import { AppBar, Toolbar } from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import axios from "axios";
import { Form, Formik } from "formik";
import { withSnackbar } from "notistack";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { failureToast } from "../util/util";
const SignInSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Too Short!")
    .max(20, "Too Long!")
    .required("Required"),
  password: Yup.string()
    .min(2, "Too Short!")
    .max(20, "Too Long!")
    .required("Required"),
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

export function SignInComponent(props: any) {
  const classes = useStyles();
  const history = useHistory();
  const sessionActive = () => {};
  useEffect(() => {
    sessionActive();
  }, []);
  function navigateToDashboard() {
    history.push("/dashboard");
  }
  const signInSubmit = (values: any) => {
    axios
      .post("/api/login", {
        user: {
          ...values,
        },
      })
      .then((response: any) => {
        if (response.data?.success) {
          sessionStorage.setItem("user", JSON.stringify(response.data.user));
          navigateToDashboard();
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
      <AppBar position="static" style={{ marginBottom: "40px" }}>
        <Toolbar variant="dense">
          <Typography variant="h6" color="inherit">
            Hustler
          </Typography>
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="xs">
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Formik
            initialValues={{
              username: "",
              password: "",
            }}
            validationSchema={SignInSchema}
            onSubmit={(values: any) => {
              signInSubmit(values);
            }}
          >
            {({ errors, touched, values, handleChange }) => (
              <Form className={classes.form} noValidate>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  onChange={handleChange}
                  value={values.username}
                  error={errors.username && touched.username ? true : false}
                  helperText={touched.username && errors.username}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={handleChange}
                  value={values.password}
                  error={errors.password && touched.password ? true : false}
                  helperText={touched.password && errors.password}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  Sign In
                </Button>
                <Grid container>
                  <Grid item xs></Grid>
                </Grid>
              </Form>
            )}
          </Formik>
        </div>
      </Container>
    </React.Fragment>
  );
}
export const SignIn = withSnackbar(SignInComponent);
