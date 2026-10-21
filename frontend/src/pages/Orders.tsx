import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Orders() {
  const [searchParams] = useSearchParams();
  const partyName = searchParams.get("party");
  const statusType = searchParams.get("status");
  const navigate = useNavigate();

  useEffect(() => {
    if (!partyName && !statusType) {
      navigate("/dashboard", { replace: true });
    }
  }, [partyName, statusType, navigate]);

  //   if (!partyName && !statusType) {
  //     console.log("Both values are empty");
  //     navigate("/dashboard");
  //     console.log("Not Returned from page");
  //     return null;
  //   } else {
  // }
  return <div>Orders : {partyName ? partyName : statusType}</div>;
}
