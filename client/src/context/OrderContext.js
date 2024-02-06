import { createContext, useEffect, useMemo, useState } from "react";
import Products from "../components/Products";
export const OrderContext = createContext();
export function OrderContextProvider(props) {
  const [orderCounts, setOrderCounts] = useState({
    products: new Map(),
    options: new Map(),
  });
  const [totals, setTotals] = useState({
    products: 0,
    options: 0,
    total: 0,
  });
  const pricePerItem = {
    products: 1000,
    options: 500,
  };
  const calculateSubtotal = (orderType, orderCounts) => {
    let optionCount = 0;
    for (const count of orderCounts[orderType].values()) {
      optionCount += count;
    }
    return optionCount * pricePerItem[orderType];
  };
  useEffect(() => {
    const productsTotal = calculateSubtotal("products", orderCounts);
    const optionsTotal = calculateSubtotal("options", orderCounts);
    const total = productsTotal + optionsTotal;
    setTotals({
      products: productsTotal,
      options: optionsTotal,
      total,
    });
  }, [orderCounts]);
  //멘토링질문!
  const value = useMemo(() => {
    function updateItemCount(itemName, newItemCount, orderType) {
      //객체 불변성 위해 스프레드
      const newOrderCounts = { ...orderCounts };
      // 타입 잡아주기
      const orderCountMap = orderCounts[orderType];
      orderCountMap.set(itemName, parseInt(newItemCount));
      setOrderCounts(newOrderCounts);
    }
    return [{ ...orderCounts, totals }, updateItemCount];
  }, [orderCounts, totals]);
  return <OrderContext.Provider value={value} {...props} />;
}
