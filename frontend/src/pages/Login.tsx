import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/Login.module.css";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signIn, validateUser } from "../store/slices/authSlice";
import { setUserAuthStatus } from "../store/slices/headerSlice";

function Login() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isRegistered, setIsRegistered] = useState(true);
  const dispatch = useAppDispatch();

  function handleFormSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isRegistered) {
      dispatch(setUserAuthStatus(!isRegistered));
      setIsRegistered((prev) => !prev);
    } else {
      dispatch(
        signIn({
          username: usernameRef.current?.value ?? "",
          password: passwordRef.current?.value ?? "",
        }),
      );
    }
  }

  return (
    <div className={styles.container}>
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
            />
          </div>
          <button type="submit">{isRegistered ? "Login" : "Register"}</button>
        </form>
        <div>
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
        </div>
      </div>
    </div>
  );
}

export default Login;
