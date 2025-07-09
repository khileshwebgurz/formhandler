"use client";
import React, { useState,useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
const page =  () => {

  const [mydata, setMyData] = useState([]);
  useEffect(() => {
    fetch("/api/getData")
      .then((res) => res.json())
      .then((data) => setMyData(data));
  }, []);

  return (
    <>
      <div>
      <h1>User List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mydata.map((user) => (
          <div key={user.id} className="border p-4 rounded shadow-md">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            {user.image && (
              <Image src={user.image} width={140} height={140} alt="User Image" />
            )}
            <p><strong>Video:</strong> <a href={user.video}>{user.video}</a></p>
            <p><strong>Resume:</strong> <a href={user.resume}>{user.resume}</a></p>

            <Link href={`/myFormPage/${user.id}`}>
              <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
                Edit
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default page;
