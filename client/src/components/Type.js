import React, { useContext } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import Products from "./Products";
import Options from "./Options";
import ErrorBanner from "./ErrorBanner";
import { OrderContext } from "../context/OrderContext";

export default function Type({ orderType }) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(false);
  const [orderData, updateItemCount] = useContext(OrderContext);
  //console.log("orderData,updateItemCount", orderData, updateItemCount);
  console.log("orderData", orderData.totals);
  useEffect(() => {
    loadItems(orderType);
  }, [orderType]);

  const loadItems = async (orderType) => {
    try {
      let response = await axios.get(`http://localhost:4000/${orderType}`);
      setItems(response.data);
      console.log("response.data:", response.data);
    } catch (error) {
      console.log(error);
      setError(true);
    }
  };

  const ItemComponent = orderType === "products" ? Products : Options;
  const optionItems = items.map((item) => {
    return (
      <ItemComponent
        key={item.name}
        name={item.name}
        imagePath={item.imagePath}
        updateItemCount={(itemName, newItemCount) =>
          updateItemCount(itemName, newItemCount, orderType)
        }
      />
    );
  });

  console.log("orderType", orderType);
  //에러가 발생했을 때
  if (error) {
    return <ErrorBanner message="에러가 발생했습니다" />;
  }
  //에러없이 정상적으로 렌더링 됐을 때
  return (
    <div>
      <h2>주문종류</h2>
      <p>하나의 가격</p>
      <p>총 가격:{orderData.totals[orderType]} </p>
      <div
        style={{
          display: "flex",
          flexDirection: orderType === "options" ? "column" : "row",
        }}
      >
        {" "}
        {optionItems}
      </div>
    </div>
  );
}
