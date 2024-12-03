import { useState, useEffect } from "react";

const useOnlineStatus = () => {
  const [onlineStatus, changeOnlineStatus] = useState(true);

  useEffect(() => {
    window.addEventListener("online", (event) => {
      changeOnlineStatus(true);
    });

    window.addEventListener("offline", (event) => {
      changeOnlineStatus(false);
    });
  }, []);

  return onlineStatus;
};

export default useOnlineStatus;
