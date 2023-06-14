import { useState, useEffect } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { useLoaderData } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { auth } from "~/utils/firebaseConfig";


export const loader = async ({ request }) => {
    return new Promise((resolve) => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          // If user is logged in, redirect to index page
          resolve(redirect("/", { headers: { "Set-Cookie": `userId=${user.uid}` } }));
        } else {
          // If user is not logged in, just continue loading the login page
          console.log('test');
          resolve(json({ user: null }));
        }
      });
    });
  };

export default function Login() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    // Clean up subscription on unmount
    return () => unsubscribe();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // ... Do something with user object
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ... Handle error
    }
  };

  const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // ... Do something with user object
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ... Handle error
    }
  };

  const signInWithFacebook = async () => {
    const auth = getAuth();
    const provider = new FacebookAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      // ... Do something with user object
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // ... Handle error
    }
  };

  return (
    <div className="bg-white lg:w-4/12 md:6/12 w-10/12 m-auto my-10 shadow-md">
      <div className="py-8 px-8 rounded-xl">
        <h1 className="font-medium text-2xl mt-3 text-center">Login</h1>

        <form action="" className="mt-6" onSubmit={onSubmit}>
          <div className="my-5 text-sm">
            <label htmlFor="email" className="block text-black">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full"
              placeholder="Email"
            />
          </div>
          <div className="my-5 text-sm">
            <label htmlFor="password" className="block text-black">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-sm px-4 py-3 mt-3 focus:outline-none bg-gray-100 w-full"
              placeholder="Password"
            />
            <div className="flex justify-end mt-2 text-xs text-gray-600">
              <a href="#">Forget Password?</a>
            </div>
          </div>

          <button
            type="submit"
            className="block text-center text-white bg-gray-800 p-3 duration-300 rounded-sm hover:bg-black w-full"
          >
            Login
          </button>
        </form>

        <div className="flex md:justify-between justify-center items-center mt-10">
          <div
            style={{ height: "1px" }}
            className="bg-gray-300 md:block hidden w-4/12"
          ></div>
          <p className="md:mx-2 text-sm font-light text-gray-400">
            {" "}
            Login Social
          </p>
          <div
            style={{ height: "1px" }}
            className="bg-gray-300 md:block hidden w-4/12"
          ></div>
        </div>

        <div className="grid md:grid-cols-2 gap-2 mt-7">
          <div>
            <button
              className="text-center w-full text-white bg-blue-900 p-3 duration-300 rounded-sm hover:bg-blue-700"
              onClick={signInWithFacebook}
            >
              Facebook
            </button>
          </div>
          <div>
            <button
              className="text-center w-full text-white bg-red-400 p-3 duration-300 rounded-sm hover:bg-red-500"
              onClick={signInWithGoogle}
            >
              Gmail
            </button>
          </div>
        </div>

        <p className="mt-12 text-xs text-center font-light text-gray-400">
          {" "}
          Don't have an account?{" "}
          <a href="#" className="text-black font-medium">
            {" "}
            Create One{" "}
          </a>{" "}
        </p>
      </div>
    </div>
  );
}
