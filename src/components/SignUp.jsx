import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import userIcon from "../img/user.svg";
import emailIcon from "../img/email.svg";
import passwordIcon from "../img/password.svg";
import { validate } from "./validate";
import styles from "./SignUp.module.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { notify } from "./toast";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { auth, firestore } from '../firebase'; // Ensure proper import paths

const SignUp = ({ setCurrentUserUID }) => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    IsAccepted: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setErrors(validate(data, "signUp"));
  }, [data, touched]);

  const changeHandler = (event) => {
    const { name, value, checked } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: name === "IsAccepted" ? checked : value,
    }));
  };

  const focusHandler = (event) => {
    const { name } = event.target;
    setTouched((prevTouched) => ({ ...prevTouched, [name]: true }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!Object.keys(errors).length) {
      try {
        const { email, password, name } = data;
        const uniqueId = uuidv4();
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        setCurrentUserUID(user.uid);
        
        try {
          await setDoc(doc(firestore, 'users', user.uid), {
            name,
            email,
            uid: user.uid,
            uniqueId
          });

          notify("You signed up successfully", "success");
          navigate("/signin");
        } catch (firestoreError) {
          console.error("Error writing user to Firestore: ", firestoreError);
          notify("Something went wrong with saving user data!", "error");
        }

      } catch (authError) {
        console.error("Error during user creation: ", authError);
        if (authError.code === 'auth/email-already-in-use') {
          notify("You have already registered, log in to your account", "warning");
        } else {
          notify("Something went wrong!", "error");
        }
      }
    } else {
      notify("Please check fields again", "error");
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
        IsAccepted: true,
      });
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.formLogin} onSubmit={submitHandler} autoComplete="off">
        <h2>Sign Up</h2>
        <div>
          <div className={errors.name && touched.name ? styles.unCompleted : !errors.name && touched.name ? styles.completed : undefined}>
            <input type="text" name="name" value={data.name} placeholder="Name" onChange={changeHandler} onFocus={focusHandler} autoComplete="off" />
            <img src={userIcon} alt="User Icon" />
          </div>
          {errors.name && touched.name && <span className={styles.error}>{errors.name}</span>}
        </div>
        <div>
          <div className={errors.email && touched.email ? styles.unCompleted : !errors.email && touched.email ? styles.completed : undefined}>
            <input type="text" name="email" value={data.email} placeholder="E-mail" onChange={changeHandler} onFocus={focusHandler} autoComplete="off" />
            <img src={emailIcon} alt="Email Icon" />
          </div>
          {errors.email && touched.email && <span className={styles.error}>{errors.email}</span>}
        </div>
        <div>
          <div className={errors.password && touched.password ? styles.unCompleted : !errors.password && touched.password ? styles.completed : undefined}>
            <input type="password" name="password" value={data.password} placeholder="Password" onChange={changeHandler} onFocus={focusHandler} autoComplete="off" />
            <img src={passwordIcon} alt="Password Icon" />
          </div>
          {errors.password && touched.password && <span className={styles.error}>{errors.password}</span>}
        </div>
        <div>
          <div className={errors.confirmPassword && touched.confirmPassword ? styles.unCompleted : !errors.confirmPassword && touched.confirmPassword ? styles.completed : undefined}>
            <input type="password" name="confirmPassword" value={data.confirmPassword} placeholder="Confirm Password" onChange={changeHandler} onFocus={focusHandler} autoComplete="off" />
            <img src={passwordIcon} alt="Password Icon" />
          </div>
          {errors.confirmPassword && touched.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
        </div>
        <div>
          <div className={styles.terms}>
            <input type="checkbox" name="IsAccepted" checked={data.IsAccepted} id="accept" onChange={changeHandler} onFocus={focusHandler} />
            <label htmlFor="accept">I accept terms of privacy policy</label>
          </div>
          {errors.IsAccepted && touched.IsAccepted && <span className={styles.error}>{errors.IsAccepted}</span>}
        </div>
        <div>
          <button type="submit">Create Account</button>
          <span style={{ color: "black", textAlign: "center", display: "inline-block", width: "100%" , fontSize: "1rem", fontFamily: "Arial, Helvetica, sans-serif", fontWeight: "bold"}}>
            Already have an account? 
            <Link to="/signin" style={{ color: "Red", textDecoration: "underline" , cursor: "pointer", fontWeight: "bold" , transition: "all 0.3s ease-in-out", fontFamily: "Arial, Helvetica, sans-serif" , fontSize: "1rem", marginLeft: "5px"}}>Sign In</Link>
          </span>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
