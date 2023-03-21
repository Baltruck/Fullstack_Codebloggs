import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

const Main = () => {
  const [initials, setInitials] = useState("");

  useEffect(() => {
    const userName = Cookies.get("userName");
    if (userName) {
      const nameParts = userName.split(" ");
      console.log("UserName:", userName);
      console.log("nameParts:", nameParts);
     
      if (nameParts.length === 2) {
        const firstInitial = nameParts[0].charAt(0).toUpperCase();
        const secondInitial = nameParts[1].charAt(0).toUpperCase();
        const userInitials = `${firstInitial}${secondInitial}`;
        setInitials(userInitials);
        console.log("User initials:", userInitials);
      }
    }
  }, []);

  return (
    <div>
      
      <div className="initials-container animated-border-initials-container">{initials}</div>
    </div>
  );
};

export default Main;
