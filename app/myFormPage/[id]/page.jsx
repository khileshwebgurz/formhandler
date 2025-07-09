// app/myform/page.jsx
'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MyForm from "../../myform/page"
const MyFormPage = () => {
  const data = useParams();
  const userId = data.id;
  

  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (userId) {
      fetch(`/api/getData/${userId}`)
        .then(res => res.json())
        .then(data => setInitialData(data));
    }
  }, [userId]);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">{userId ? "Edit User" : "Create User"}</h1>
      <MyForm initialData={initialData} userId={userId} />
    </>
  );
};

export default MyFormPage;
