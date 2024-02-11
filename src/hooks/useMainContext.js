import { useContext } from "react";
import { MainContext } from "../contexts/MainContext";

export const useMainContext = () => {
  const data = useContext(MainContext);

  if (!data?.isInProvider) {
    throw new Error("useMainContext must be used within <MainContextProvider>");
  }

  return data;
};
