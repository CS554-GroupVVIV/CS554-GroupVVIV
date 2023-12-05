import React, { useState, useEffect } from "react";

export default function ProductCard({ productData }) {
  return (
    <article>
      <h4>Name: {productData && productData.name}</h4>
      <ul>
        <li>Price: {productData && productData.price}</li>
        <li>Date: {productData && productData.date}</li>
        <li>Description: {productData && productData.description}</li>
        <li>Condition: {productData && productData.condition}</li>
        <li>Category: {productData && productData.category}</li>
        <li>
          <a href="">Detail {productData && productData._id}</a>
        </li>
      </ul>
    </article>
  );
}
