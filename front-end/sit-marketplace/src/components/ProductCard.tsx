import React, { useState, useEffect } from "react";

export default function ProductCard({ productData }) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (productData) {
      if (productData._id) setId(productData._id);
      if (productData.name) setName(productData.name);
    }
  }, []);

  return (
    <article>
      <p>{name && name}</p>
      {/* <a href="">Detail</a> */}
    </article>
  );
}
