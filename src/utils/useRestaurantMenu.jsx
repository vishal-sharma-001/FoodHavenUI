import { useEffect, useState } from "react";

const useResturantMenu = (prop) => {
  const [resInfo, setResInfo] = useState(null);

  useEffect(() => {
    fetch(`/public/fooditems?cloudimageid=${prop}`)
      .then((resp) => {
        if (!resp.ok)
          return new Error("Failed to fetch data" + resp.statusText);
        else return resp.json();
      })
      .then((res) => {
        setResInfo(res?.data);
      })
      .catch((err) => {
        console.error("Fetching data failed. " + err);
      });
  }, []);

  return resInfo;
};

export default useResturantMenu;
