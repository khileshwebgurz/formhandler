"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup
    .string()
    .min(8, "Password must be 8 characters long")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol"),
});

const AdminLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("password", data.password);

    console.log(data);
    try {
      const res = await axios.post("/api/admin/adminLogin", formData);

      const result = res.data;
      console.log("Result:", result);
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Name:
          <input type="text" {...register("username")} />
          <p>{errors.username?.message}</p>
        </label>

        <label>
          Password:
          <input type="password" {...register("password")} />
          <p>{errors.password?.message}</p>
        </label>

        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

export default AdminLogin;
