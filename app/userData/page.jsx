import React from "react";
import Image from "next/image";

const page = async () => {
  const res = await fetch("http://localhost:3000/api/getData", {
    cache: "no-store", // disable cache for fresh data every time (optional)
  });

  const mydata = await res.json();
  return (
    <>
      <div>
        <h1>User List</h1>
        {mydata.map((user) => (
          <div key={user.id} style={{ marginBottom: "1rem" }}>
            <p>
              <strong>Name:</strong> {user.name}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Image:</strong> 
              <Image src={user.image} width={140} height={140} alt="hello"/>
            </p>
            <p>
              <strong>Video:</strong> <a href={user.video}>{user.video}</a>
            </p>
            <p>
              <strong>Resume:</strong> <a href={user.resume}>{user.resume}</a>
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default page;
