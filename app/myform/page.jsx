"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import Image from "next/image";

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

const MyForm = ({ initialData, userId }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  // prefill if editing
  useEffect(() => {
    if (initialData) {
      setValue("name", initialData.name);
      setValue("email", initialData.email);
      setValue("image", initialData.image);
      setValue("video", initialData.video);
      setValue("resume", initialData.resume);
    }
  }, [initialData, setValue]);

  console.log("dat is", initialData);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("image", data.image[0]);
    formData.append("resume", data.resume[0]);
    formData.append("video", data.video[0]);

    const endPoint = initialData.id ? `/api/update/${initialData.id }` : "/api/upload";
    const method = initialData.id  ? "PUT" : "POST";

    const res = await fetch(endPoint, {
      method,
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
          {initialData?.image && (
            <Image src={initialData?.image} width={50} height={50} alt="tata" />
          )}
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
          
          {initialData?.video && (
            <div style={{ marginTop: "10px" }}>
              <p>Current Video:</p>
              <video width="320" height="240" controls>
                <source src={initialData.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </label>
        <input type="submit" value={initialData.id ? "Update" : "Submit"} />
      </form>
    </>
  );
};

export default MyForm;
