import { useState, useRef, useEffect } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import moment, { Moment } from "moment";
import axios from "axios";

export default function WantSell() {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const priceRef = useRef<HTMLInputElement | null>(null);
  const conditionRef = useRef<HTMLSelectElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const categoryRef = useRef<HTMLSelectElement | null>(null);
  const imageRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [contidion, setCondition] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [nameError, setNameError] = useState<boolean>(false);
  const [priceError, setPriceError] = useState<boolean>(false);
  const [conditionError, setConditionError] = useState<boolean>(false);
  const [descriptionError, setDescriptionError] = useState<boolean>(false);
  const [category, setCategory] = useState<string>("");
  const [categoryError, setCategoryError] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);

  const helper = {
    checkName(): void {
      setNameError(false);
      let input: string | undefined = nameRef.current?.value;
      if (!input || input.trim() == "") {
        setNameError(true);
        return;
      }
      input = input.trim();
      if (input.length < 0 || input.length > 20) {
        setNameError(true);
        return;
      }
      const alphanumericRegex = /^[a-zA-Z0-9 ]+$/;
      if (!alphanumericRegex.test(input)) {
        setNameError(true);
        return;
      }
      setName(input);
      return;
    },

    checkPrice(): void {
      setPriceError(false);
      setPrice(0);
      let price: string | undefined = priceRef.current?.value;
      if (!price || price.trim() == "") {
        setPriceError(true);
        return;
      }
      price = price.trim();
      let value: number = parseFloat(price);
      if (Number.isNaN(value)) {
        setPriceError(true);
        return;
      }
      price = (Math.round(value * 100) / 100).toFixed(2);
      if (value < 0 || value > 100000) {
        setPriceError(true);
        return;
      }
      if (priceRef.current) {
        priceRef.current.value = price;
      }
      setPrice(value);
      return;
    },

    checkCondition(): void {
      setConditionError(false);
      let condition: string | undefined = conditionRef.current?.value;
      if (!condition || condition.trim() == "") {
        setConditionError(true);
        return;
      }
      condition = condition.trim();
      let conditionLower: string = condition.toLowerCase();
      if (
        conditionLower != "brand new" &&
        conditionLower != "like new" &&
        conditionLower != "gently used" &&
        conditionLower != "functional"
      ) {
        setConditionError(true);
        return;
      }
      setCondition(condition);
    },

    checkDescription(): void {
      setDescriptionError(false);
      let description: string | undefined = descriptionRef.current?.value;
      if (description && description.trim() != "") {
        description = description.trim();
        if (description.length > 100) {
          setDescriptionError(true);
          return;
        } else {
          if (descriptionRef.current) {
            descriptionRef.current.value = description;
            setDescription(description);
          }
        }
      }
    },

    checkCategory(): void {
      setCategoryError(false);
      let category: string | undefined = categoryRef.current?.value;
      if (!category || category.trim() == "") {
        setCategoryError(true);
        return;
      }
      category = category.trim();
      let categoryLower: string = category.toLowerCase();
      if (
        categoryLower != "electronics" &&
        categoryLower != "clothing" &&
        categoryLower != "furniture" &&
        categoryLower != "books" &&
        categoryLower != "other"
      ) {
        setCategoryError(true);
        return;
      }
      setCategory(category);
    },

    checkImage(): void {
        setImage(null);
        let image: File | undefined = imageRef.current?.files?.[0];
        if (!image) {
            return;
        }
        if (image.size > 10000000) {
            return;
        }
        setImage(image);
        }
  };

  const router = useRouter();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    helper.checkName();
    helper.checkPrice();
    helper.checkCondition();
    helper.checkDescription();
    helper.checkCategory();
    helper.checkImage();

    if (
      nameError ||
      priceError ||
      conditionError ||
      descriptionError ||
      categoryError
    ) {
      return;
    }

    const formData = new FormData();
    formData.append("title", name);
    formData.append("price", price.toString());
    formData.append("condition", contidion);
    formData.append("description", description);
    formData.append("category", category);
    if(image) {
        formData.append("image", image);
    }

    try {
      const res = await axios.post(
        "http://localhost:3000/api/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h2>Upload Item</h2>
      <div className="main">
        <div className="description">
          <p>
            Please fill out the form below to upload an item to the marketplace.
            Please ensure that all fields are filled out correctly.
          </p>
        </div>
        <div className="form">
          <form onSubmit={submit} encType="multipart/form-data">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              ref={nameRef}
              onBlur={helper.checkName}
            />
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              maxLength={100}
              ref={descriptionRef}
              onBlur={helper.checkDescription}
              defaultValue={""}
            />
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              ref={priceRef}
              onBlur={helper.checkPrice}
            />
            <label htmlFor="category">Category</label>
            <select
              name="category"
              id="category"
              ref={categoryRef}
              onBlur={helper.checkCategory}
              defaultValue={""}
            >
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="furniture">Furniture</option>
              <option value="books">Books</option>
              <option value="other">Other</option>
            </select>
            <label htmlFor="condition">Condition</label>
            <select
              name="condition"
              id="condition"
              ref={conditionRef}
              onBlur={helper.checkCondition}
              defaultValue={""}
            >
              <option value="brand new">Brand New</option>
              <option value="like new">Like New</option>
              <option value="gently used">Gently Used</option>
              <option value="functional">Functional</option>
            </select>
            <label htmlFor="image">Image</label>
            <input type="file" id="image" name="image" />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}
