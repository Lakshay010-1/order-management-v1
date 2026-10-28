import React, { useEffect, useState } from "react";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signOut } from "../store/slices/authSlice";
import styles from "./styles/Profile.module.css";
import { resetHeaderState } from "../store/slices/headerSlice";

export default function Profile() {
  const dispatch = useAppDispatch();
  const { username, is_verified: is_user_verified } = useAppSelector(
    (state) => state.auth,
  );
  const [usernameValue, setUsernameValue] = useState(username);
  useEffect(() => {
    if (is_user_verified) {
      setUsernameValue(username);
    }
  }, [is_user_verified]);
  return (
    <div className={styles.profileContainer}>
      <div>
        <AccountCircleIcon />
        <h3>{usernameValue}</h3>
      </div>
      <button
        onClick={async () => {
          await dispatch(resetHeaderState());
          await dispatch(signOut());
        }}
      >
        Logout
      </button>
    </div>
  );
}
