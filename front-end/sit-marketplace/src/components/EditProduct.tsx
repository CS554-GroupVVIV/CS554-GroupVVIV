import React, { useState, useEffect, useRef, useContext } from "react";
import { EDIT_PRODUCT } from "../queries";
import { useMutation } from "@apollo/client";
import {
    checkName,
    checkPrice,
    checkDescription,
    checkCategory,
    checkCondition,
    checkStatus,
} from "../helper.tsx"
import { uploadFileToS3 } from "../aws.tsx";

const EditProduct = ({ productData }) => {
  const [image, setImage] = useState<File | undefined>(undefined);
  const [currentStatus, setCurrentStatus] = useState<string>("active");
  const [editProduct] = useMutation(EDIT_PRODUCT);

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const image: File | undefined = e.target.files?.[0];
    if (!image) {
      return;
    }
    if (image.size > 10000000) {
      console.log("image size", image.size);
      return;
    }
    if (!image.type.match(/image.*/)) {
      console.log("image type", image.type);
      return;
    }
    setImage(image);
  };

  let name;
  let price;
  let condition;
  let category;
  let description;
  let status;
  let buyer;

  const statusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentStatus(e.target.value);
  };

  const editSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
        console.log("category", category.value);
        let variables = {
            id: productData._id,
            name: checkName(name.value),
            description: checkDescription(description.value),
            sellerId: productData.seller_id,
            price: checkPrice(price.value),
            category: checkCategory(category.value),
            condition: checkCondition(condition.value),
            status: checkStatus(status.value),
        }
        if (image) {
            const imageUrl = await uploadFileToS3(image, variables.name);
            variables.image = imageUrl;
        } else{
            variables.image = "";
        }
        if (variables.status == "completed") {
            variables.buyerId = buyer.value;
        }
        console.log("variables", variables);
        await editProduct({variables: variables});
    } catch (err) {
        console.log(err);
    }
  };

  console.log("productData", productData);

  return (
    <div className="editProduct">
      <form onSubmit={editSubmit} encType="multipart/form-data">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          ref={(node) => {
            name = node;
          }}
          defaultValue={productData.name}
          placeholder={productData.name}
        />
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={100}
          ref={(node) => {
            description = node;
          }}
          placeholder={productData.description}
          defaultValue={productData.description}
        />
        <label htmlFor="price">Price</label>
        <input
          type="number"
          step="0.01"
          id="price"
          name="price"
          placeholder={productData.price}
          ref={(node) => {
            price = node;
          }}
          defaultValue={productData.price}
        />
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          placeholder={productData.category}
          ref={(node) => {
            category = node;
          }}
          defaultValue={productData.category}
        >
          <option value="books">Books</option>
          <option value="electronics">Electronics</option>
          <option value="furniture">Furniture</option>
          <option value="clothing">Clothing</option>
          <option value="stationary">Stationary</option>
          <option value="others">Others</option>
        </select>
        <label htmlFor="condition">Condition</label>
        <select
          id="condition"
          name="condition"
          placeholder={productData.condition}
          ref={(node) => {
            condition = node;
          }}
          defaultValue={productData.condition}
        >
          <option value="brand new">Brand New</option>
          <option value="like new">Like New</option>
          <option value="gently used">Gently Used</option>
          <option value="functional">Functional</option>
        </select>
        <label htmlFor="image">Image</label>
        <input type="file" id="image" name="image" onChange={uploadImage} />
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          placeholder={productData.status}
          onChange={statusChange}
          ref={(node) => {
            status = node;
          }}
          defaultValue={productData.status}
        >
          <option value="active">active</option>
          <option value="inactive">inactive</option>
          <option value="completed">completed</option>
        </select>
        {currentStatus == "completed" ? (
          <>
            <label htmlFor="buyer">Buyer</label>
            <select
                id="buyer"
                name="buyer"
                placeholder="nospecific"
                ref={(node) => {
                    buyer = node;
                }}
                defaultValue="nospecific"
            >
              <option value="nospecific">No specific buyer</option>
              {productData.possible_buyers.map((buyer) => {
                return (
                  <option key={buyer._id} value={buyer._id}>
                    {buyer.firstname} {buyer.lastname}
                  </option>
                );
              })}
            </select>
          </>
        ) : null}

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default EditProduct;
