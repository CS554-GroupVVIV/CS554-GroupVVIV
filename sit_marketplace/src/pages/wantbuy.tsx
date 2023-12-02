import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import moment, { Moment } from "moment";
import axios from "axios";

export default function WantBuy() {
  const nameRef = useRef<HTMLInputElement | null>(null);
  const quantityRef = useRef<HTMLInputElement | null>(null);
  const priceRef = useRef<HTMLInputElement | null>(null);
  const conditionRef = useRef<HTMLSelectElement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);
  const additionRef = useRef<HTMLTextAreaElement | null>(null);
  const [name, setName] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [contidion, setCondition] = useState<string>("");
  const [date, setDate] = useState<object>();
  const [addition, setAddition] = useState<string>("");
  const [nameError, setNameError] = useState<boolean>(false);
  const [priceError, setPriceError] = useState<boolean>(false);
  const [quantityError, setQuantityError] = useState<boolean>(false);
  const [conditionError, setConditionError] = useState<boolean>(false);
  const [dateError, setDateError] = useState<boolean>(false);
  const [additionError, setAdditionError] = useState<boolean>(false);

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

    checkQuantity(): void {
      setQuantityError(false);
      setQuantity(0);
      let input: string | undefined | number = quantityRef.current?.value;
      if (!input || input.trim() == "") {
        setQuantityError(true);
        return;
      }

      input = input.trim();
      let num: number = parseInt(input);
      if (Number.isNaN(num) || num < 1 || num > 999) {
        setQuantityError(true);
        return;
      }
      if (quantityRef.current) {
        quantityRef.current.value = input;
      }
      setQuantity(num);
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

    checkDate(): void {
      setDateError(false);
      let date: string | undefined = dateRef.current?.value;
      if (!date || date.trim() == "") {
        setDateError(true);
        return;
      }
      date = date.trim();
      let dateFormatted: Moment = moment(date, "YYYY-MM-DD");
      if (!dateFormatted.isValid()) {
        setDateError(true);
        return;
      }
      let today: object = moment().startOf("day");
      if (dateFormatted < today) {
        setDateError(true);
        return;
      }
      setDate(dateFormatted);
    },

    checkAddition(): void {
      setAdditionError(false);
      let addition: string | undefined = additionRef.current?.value;
      if (addition && addition.trim() != "") {
        addition = addition.trim();
        if (addition.length > 100) {
          setAdditionError(true);
          return;
        } else {
          if (additionRef.current) {
            additionRef.current.value = addition;
            setAddition(addition);
          }
        }
      }
    },
  };

  useEffect(() => {
    setTotal(price * quantity);
  }, [price, quantity]);

  const router = useRouter();

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    helper.checkName();
    helper.checkQuantity();
    helper.checkPrice();
    helper.checkCondition();
    helper.checkDate();
    helper.checkAddition();
    if (
      nameError ||
      quantityError ||
      priceError ||
      conditionError ||
      dateError ||
      additionError
    ) {
      return;
    }
    let newItem = {
      //getAuth
      userId: "123",
      item: name,
      quantity: quantity,
      price: price,
      condition: contidion,
      beforeDate: date,
      addition: addition,
    };
    try {
      var { data } = await axios.post("http://localhost:3000/api/posts", {
        item: newItem,
      });
      if (data == "success") {
        alert("Sucess");
        router.push("/");
      }
    } catch (e: any) {
      const code: number = e.response.status;
      if (code == 400) {
        alert("Please check your input");
      } else if (code == 500) {
        alert("Server error. Please try again later");
      }
    }
  };

  return (
    <form onSubmit={submit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Request Form
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            We're excited to help you find the perfect item you're looking for!
            Please fill out the form with as much detail as possible. Your
            responses will not only help with the matching process but also
            increase the likelihood of finding your ideal item.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="item"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Item Name
              </label>
              <div className="mt-2">
                <input
                  id="item"
                  name="item"
                  type="text"
                  ref={nameRef}
                  minLength={1}
                  maxLength={20}
                  onBlur={helper.checkName}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {nameError && (
                <p>
                  Item name should be within range 1-20 characters and only
                  contain letters, numbers and spaces
                </p>
              )}
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="quantity"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Quantity
              </label>
              <div className="mt-2">
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  ref={quantityRef}
                  onBlur={helper.checkQuantity}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
              {quantityError && (
                <p>Quantity should be an integer in range from 1 to 999</p>
              )}
            </div>

            <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Price
                </label>
                <div className="mt-2">
                  <input
                    id="price"
                    name="price"
                    type="number"
                    ref={priceRef}
                    onBlur={helper.checkPrice}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {priceError && (
                  <p>
                    Price should be in range from 0 to 100000 and have at most 2
                    demical places.
                  </p>
                )}
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="total"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Total Amount
                </label>
                <div className="mt-2">
                  <input
                    id="total"
                    name="total"
                    type="number"
                    disabled
                    value={total}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="condition"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Condition
                </label>
                <div className="mt-2">
                  <select
                    id="condition"
                    name="condition"
                    defaultValue={""}
                    ref={conditionRef}
                    onBlur={helper.checkCondition}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  >
                    <option disabled></option>
                    <option>Brand New</option>
                    <option>Like New</option>
                    <option>Gently Used</option>
                    <option>Functional</option>
                  </select>
                </div>
                {conditionError && <p>Please select from provided options</p>}
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Need it before
                </label>
                <div className="mt-2">
                  <input
                    type="date"
                    name="date"
                    id="date"
                    ref={dateRef}
                    onBlur={helper.checkDate}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                {dateError && <p>Date should be no earlier than today </p>}
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="about"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Additional Preference(100 letters max)
                </label>
                <div className="mt-2">
                  <textarea
                    id="about"
                    name="about"
                    rows={3}
                    maxLength={100}
                    ref={additionRef}
                    onBlur={helper.checkAddition}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={""}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
}
