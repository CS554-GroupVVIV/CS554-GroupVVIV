import React, { useState, useEffect } from "react";

export default function PostCard({ postData }) {
  const [id, setId] = useState(undefined);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (postData) {
      if (postData._id) setId(postData._id);
      if (postData.name) setTitle(postData.name);
    }
  }, []);

  return (
    <article>
      <p>{title && title}</p>
      {/* <a href="">Detail</a> */}
    </article>
  );
}
