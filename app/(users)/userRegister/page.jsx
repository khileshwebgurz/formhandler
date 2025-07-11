"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";


const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be 8 characters long")
    .matches(/[0-9]/, "Password requires a number")
    .matches(/[a-z]/, "Password requires a lowercase letter")
    .matches(/[A-Z]/, "Password requires an uppercase letter")
    .matches(/[^\w]/, "Password requires a symbol"),
});

const UserRegister = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);

    const res = await fetch("http://localhost:3000/api/users/userRegister", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();
    console.log(result);
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
          Email:
          <input type="email" {...register("email")} />
          <p>{errors.email?.message}</p>
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

export default UserRegister;
