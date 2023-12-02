// pages/index.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function getItems() {
      const { data } = await axios.get("http://localhost:3000/api/items");
      setItems(data);
    }

    getItems();
  }, []);

  return (
    <div>
      <h1>Home</h1>
      {items &&
        items.map((item) => {
          return <p key={item._id}>{item.title}</p>;
        })}
    </div>
  );
};

export default Home;
