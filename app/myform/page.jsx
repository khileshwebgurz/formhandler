"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  image: yup
    .mixed()
    .required("Image is required")
    .test("fileType", "Only images allowed", (value) => {
      return value && value[0] && value[0].type.startsWith("image/");
    }),
  resume: yup
    .mixed()
    .required("Resume is required")
    .test("fileType", "Only PDF allowed", (value) => {
      return value && value[0] && value[0].type === "application/pdf";
    }),
  video: yup
    .mixed()
    .required("Video is required")
    .test("fileType", "Only videos allowed", (value) => {
      return value && value[0] && value[0].type.startsWith("video/");
    }),
});

const MyForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("image", data.image[0]);
    formData.append("resume", data.resume[0]);
    formData.append("video", data.video[0]);

    fetch("/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((result) => {
        console.log("Upload result:", result);
      })
      .catch((error) => {
        console.error("Upload failed:", error);
      });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Name:
          <input type="text" {...register("name")} />
          <p>{errors.name?.message}</p>
        </label>

        <label>
          Email:
          <input type="email" {...register("email")} />
          <p>{errors.email?.message}</p>
        </label>

        <label>
          Image:
          <input type="file" {...register("image")} />
          <p>{errors.image?.message}</p>
        </label>

        <label>
          Resume:
          <input type="file" {...register("resume")} />
          <p>{errors.resume?.message}</p>
        </label>

        <label>
          Video:
          <input type="file" {...register("video")} />
          <p>{errors.video?.message}</p>
        </label>
        <input type="submit" value="Submit" />
      </form>
    </>
  );
};

export default MyForm;
