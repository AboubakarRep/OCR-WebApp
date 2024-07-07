import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import AuthService from "../services/auth.service";

const Register = () => {
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: ""
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters")
        .required("Username is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .max(40, "Password must be at most 40 characters")
        .required("Password is required")
    }),
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      AuthService.register(values.username, values.email, values.password)
        .then((response) => {
          formik.resetForm();
          formik.setStatus({ success: true, message: response.data.message });
        })
        .catch((error) => {
          const errorMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
          formik.setStatus({ success: false, message: errorMessage });
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  });

  return (
    <div className="col-md-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
        />

        <form onSubmit={formik.handleSubmit}>
          {!formik.status?.success && (
            <div>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  className="form-control"
                  {...formik.getFieldProps("username")}
                />
                {formik.touched.username && formik.errors.username ? (
                  <div className="alert alert-danger" role="alert">
                    {formik.errors.username}
                  </div>
                ) : null}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  id="email"
                  className="form-control"
                  {...formik.getFieldProps("email")}
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="alert alert-danger" role="alert">
                    {formik.errors.email}
                  </div>
                ) : null}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  className="form-control"
                  {...formik.getFieldProps("password")}
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className="alert alert-danger" role="alert">
                    {formik.errors.password}
                  </div>
                ) : null}
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  disabled={formik.isSubmitting}
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}

          {formik.status?.message && (
            <div className="form-group">
              <div
                className={
                  formik.status.success
                    ? "alert alert-success"
                    : "alert alert-danger"
                }
                role="alert"
              >
                {formik.status.message}
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Register;
