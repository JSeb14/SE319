import React, { useState } from "react";

export const Context = React.createContext();
export const ContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [order, setOrder] = useState({});

  return (
    <Context.Provider value={{ cart: [cart, setCart], order: [order, setOrder] }}>{children}</Context.Provider>
  );
};
