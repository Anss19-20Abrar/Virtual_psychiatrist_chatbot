import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, getAuth, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import emailIcon from "../img/email.svg";
import passwordIcon from "../img/password.svg";
import googleIcon from "../img/google.svg";
import { validate } from "./validate";
import styles from "./SignUp.module.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { notify } from "./toast";
import { auth } from '../firebase'; // Ensure proper import paths

const SignIn = ({ setCurrentUserUID }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [resetEmail, setResetEmail] = useState("");
  const [showResetPopup, setShowResetPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setErrors(validate(data, "signIn"));
  }, [data, touched]);

  const changeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
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
        const { email, password } = data;
        console.log("Attempting to sign in with email: ", email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("User signed in successfully: ", user);
        setCurrentUserUID(user.uid);
        notify("You logged in successfully", "success");
        navigate("/chatapp");
      } catch (error) {
        console.error("Error during sign in: ", error);
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          notify("Your password or email is wrong", "error");
        } else {
          notify("Something went wrong!", "error");
        }
      }
    } else {
      notify("Please check fields again", "error");
      setTouched({
        email: true,
        password: true,
      });
    }
  };

  const googleSignInHandler = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed in with Google successfully: ", user);
      setCurrentUserUID(user.uid);
      notify("You logged in successfully with Google", "success");
      navigate("/chatapp");
    } catch (error) {
      console.error("Error during Google sign-in: ", error);
      notify("Something went wrong with Google sign-in!", "error");
    }
  };

  const resetPasswordHandler = async (event) => {
    event.preventDefault();
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      notify("Password reset email sent!", "success");
      setShowResetPopup(false);
    } catch (error) {
      console.error("Error sending password reset email: ", error);
      notify("Error sending password reset email", "error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-cover bg-center relative" style={{ backgroundImage: "url('../../LoginBG.jpg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
      <form className="relative bg-white bg-opacity-75 p-8 rounded-lg shadow-md w-full max-w-md z-10" onSubmit={submitHandler} autoComplete="off">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign In</h2>
        <div className="mb-4">
          <div className={errors.email && touched.email ? styles.unCompleted : !errors.email && touched.email ? styles.completed : undefined}>
            <input
              type="text"
              name="email"
              value={data.email}
              placeholder="E-mail"
              autoComplete="on"
              onChange={changeHandler}
              onFocus={focusHandler}
              className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <img src={emailIcon} alt="Email Icon" className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6" />
          </div>
          {errors.email && touched.email && <span className={styles.error}>{errors.email}</span>}
        </div>
        <div className="mb-4">
          <div className={errors.password && touched.password ? styles.unCompleted : !errors.password && touched.password ? styles.completed : undefined}>
            <input
              type="password"
              name="password"
              value={data.password}
              placeholder="Password"
              onChange={changeHandler}
              onFocus={focusHandler}
              className="appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <img src={passwordIcon} alt="Password Icon" className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6" />
          </div>
          {errors.password && touched.password && <span className={styles.error}>{errors.password}</span>}
        </div>
        <div className="mb-6">
          <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Login
          </button>
          <button type="button" onClick={googleSignInHandler} className="w-full mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center">
            <img src={googleIcon} alt="Google" className="w-6 h-6 mr-2" /> Sign in with Google
          </button>
        </div>
        <div className="text-center">
          <span className="text-black font-bold">
            Don't have an account? <Link to="/signup" className="text-red-500 underline">Create account</Link>
          </span>
          <br />
          <span className="text-black font-bold mt-2">
            <a href="#" onClick={() => setShowResetPopup(true)} className="text-blue-500 underline">Forgot Password?</a>
          </span>
        </div>
      </form>
      {showResetPopup && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4">Reset Password</h3>
            <form onSubmit={resetPasswordHandler}>
              <input
                type="email"
                name="resetEmail"
                value={resetEmail}
                placeholder="Enter your email"
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="appearance-none bg-transparent border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
              />
              <div className="flex justify-between">
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Send Reset Email</button>
                <button type="button" onClick={() => setShowResetPopup(false)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default SignIn;
