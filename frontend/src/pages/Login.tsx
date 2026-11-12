import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/Login.module.css";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  enrollUser,
  resetRegisterMsg,
  signIn,
  validateUser,
} from "../store/slices/authSlice";
import { setUserAuthStatus } from "../store/slices/headerSlice";
import Loader from "../components/Loader";

function Login({ isRegistered }: { isRegistered: boolean }) {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // const [isRegistered, setIsRegistered] = useState(true);
  const dispatch = useAppDispatch();
  const { registerLoading, registerMsg } = useAppSelector(
    (state) => state.auth,
  );

  function handleFormSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const username = usernameRef.current?.value ?? "";
    const password = passwordRef.current?.value ?? "";
    usernameRef.current.value = "";
    passwordRef.current.value = "";
    if (!isRegistered) {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      dispatch(enrollUser({ username, password }));
      timeoutRef.current = setTimeout(() => {
        dispatch(resetRegisterMsg());
      }, 3000);
    } else {
      dispatch(signIn({ username, password }));
    }
  }

  return (
    <div className={styles.container}>
      {!isRegistered && <h2>Register New User</h2>}
      <div>
        <form
          onSubmit={(e) => handleFormSubmit(e)}
          className={styles.loginForm}
        >
          <div>
            <label>Username:</label>
            <input
              type="text"
              name="username"
              ref={usernameRef}
              required
              placeholder="Username"
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              ref={passwordRef}
              placeholder="Password"
              required
            />
          </div>
          <button className={styles.loginSubmitBtn} type="submit">
            {isRegistered ? "Login" : "Register New User"}
          </button>
        </form>
        {/* <div>
          <p>
            {(isRegistered ? "Don't" : "Already") + " have an Account?"}{" "}
            <span>
              <a
                onClick={() => {
                  dispatch(setUserAuthStatus(!isRegistered));
                  setIsRegistered((prev) => !prev);
                }}
                href="#"
              >
                {!isRegistered ? "Login" : "Register"}
              </a>
            </span>
          </p>
        </div> */}
        {!isRegistered && (
          <>
            {registerLoading ? (
              <Loader message={registerMsg} />
            ) : (
              <p>{registerMsg}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Login;
