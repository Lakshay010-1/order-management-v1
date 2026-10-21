import React, { useEffect, useRef, useState } from "react";
import styles from "./styles/Login.module.css";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signIn, validateUser } from "../store/slices/authSlice";

function Login() {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isRegistered, setIsRegistered] = useState(true);
  const dispatch = useAppDispatch();
  // const { is_verified: is_user_verified } = useAppSelector(
  //   (state) => state.auth,
  // );

  function handleFormSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isRegistered) {
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

  // useEffect(() => {
  //   if (is_user_verified) {
  //     dispatch(setUsername(usernameRef.current?.value ?? ""));
  //   }
  // }, [is_user_verified]);

  return (
    <div className={styles.container}>
      <h1>{isRegistered ? "Login" : "Register"}</h1>
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
              <a onClick={() => setIsRegistered((prev) => !prev)} href="#">
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
