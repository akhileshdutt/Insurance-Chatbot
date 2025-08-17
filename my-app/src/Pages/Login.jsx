// import React, { useState } from "react";
// import { FaGoogle, FaApple } from "react-icons/fa";
// import { Link } from "react-router-dom";

// export default function Login() {
//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//     remember: false,
//   });

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ?  checked : value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Login Data:", form);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-fuchsia-400 to-sky-300">
//       <div className="flex bg-[#2a2540] rounded-2xl overflow-hidden shadow-2xl max-w-5xl w-full">
        
//         {/* Left side - background image */}
//         <div
//           className="w-1/2 flex flex-col justify-between p-6 bg-cover bg-center"
//           style={{
//             backgroundImage:
//               "url('https://img.freepik.com/free-photo/ai-technology-h…tion_23-2151977843.jpg?semt=ais_hybrid&w=740&q=80')",
//           }}
//         >
//           <button className="self-end bg-white/10 text-white px-4 py-1 rounded-full text-sm hover:bg-white/20">
//             Back to website →
//           </button>
//           <div className="flex-grow flex items-center justify-center">
//             {/* <h1 className="text-white text-3xl font-bold text-center drop-shadow-lg">
//               Welcome Back! <br /> Let’s get you signed in.
//             </h1> */}
//           </div>
//           <div className="flex justify-center space-x-2 mb-4">
//             <div className="w-3 h-1 rounded-full bg-white/30"></div>
//             <div className="w-3 h-1 rounded-full bg-white"></div>
//             <div className="w-3 h-1 rounded-full bg-white/30"></div>
//           </div>
//         </div>

//         {/* Right side - login form */}
//         <div className="w-1/2 p-10">
//           <h2 className="text-3xl font-bold text-white mb-2">Log in to your account</h2>
//           <p className="text-sm text-gray-400 mb-6">
//             Don’t have an account?{" "}
//             <Link to="/register" className="text-purple-400 hover:underline">
//             Sign up
//             </Link>
//           </p>

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={form.email}
//               onChange={handleChange}
//               className="w-full p-3 rounded-lg bg-[#1e1b2e] text-white placeholder-gray-500 border border-gray-600 focus:outline-none focus:border-purple-500"
//             />

//             <input
//               type="password"
//               name="password"
//               placeholder="Enter your password"
//               value={form.password}
//               onChange={handleChange}
//               className="w-full p-3 rounded-lg bg-[#1e1b2e] text-white placeholder-gray-500 border border-gray-600 focus:outline-none focus:border-purple-500"
//             />

//             <label className="flex items-center justify-between text-gray-400 text-sm">
//               <div className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="remember"
//                   checked={form.remember}
//                   onChange={handleChange}
//                   className="mr-2 accent-purple-500"
//                 />
//                 Remember me
//               </div>
//               <a href="#" className="text-purple-400 hover:underline">
//                 Forgot password?
//               </a>
//             </label>

//             <button
//               type="submit"
//               className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition"
//             >
//               Log in
//             </button>
//           </form>

//           <div className="flex items-center my-6">
//             <div className="flex-grow h-px bg-gray-600"></div>
//             <span className="px-4 text-gray-400 text-sm">Or log in with</span>
//             <div className="flex-grow h-px bg-gray-600"></div>
//           </div>

//           <div className="flex space-x-4">
//             <button className="flex items-center justify-center w-1/2 border border-gray-600 py-3 rounded-lg text-white hover:bg-white/10 transition">
//               <FaGoogle className="mr-2" /> Google
//             </button>
//             <button className="flex items-center justify-center w-1/2 border border-gray-600 py-3 rounded-lg text-white hover:bg-white/10 transition">
//               <FaApple className="mr-2" /> Apple
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState } from "react";
import { FaGoogle, FaApple } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

export default function Login() {
  const navigate = useNavigate(); // Initialize the hook

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setLoading(true); // Start loading

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      // If login is successful
      console.log("Login successful:", data);
      localStorage.setItem("token", data.token); // Store the token
      alert("Login successful!");
      navigate("/home"); // Redirect to the homepage
    } catch (err) {
      console.error("Login Error:", err);
      setError(err.message);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-fuchsia-400 to-sky-300">
      <div className="flex bg-[#2a2540] rounded-2xl overflow-hidden shadow-2xl max-w-5xl w-full">
        {/* Left side - background image */}
        <div
          className="w-1/2 flex flex-col justify-between p-6 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://img.freepik.com/free-photo/ai-technology-h...tion_23-2151977843.jpg?semt=ais_hybrid&w=740&q=80')",
          }}
        >
          <button className="self-end bg-white/10 text-white px-4 py-1 rounded-full text-sm hover:bg-white/20">
            Back to website →
          </button>
          <div className="flex-grow flex items-center justify-center">
            {/* <h1 className="text-white text-3xl font-bold text-center drop-shadow-lg">
              Welcome Back! <br /> Let’s get you signed in.
            </h1> */}
          </div>
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-3 h-1 rounded-full bg-white/30"></div>
            <div className="w-3 h-1 rounded-full bg-white"></div>
            <div className="w-3 h-1 rounded-full bg-white/30"></div>
          </div>
        </div>

        {/* Right side - login form */}
        <div className="w-1/2 p-10">
          <h2 className="text-3xl font-bold text-white mb-2">Log in to your account</h2>
          <p className="text-sm text-gray-400 mb-6">
            Don’t have an account?{" "}
            <Link to="/register" className="text-purple-400 hover:underline">
              Sign up
            </Link>
          </p>

          {error && <p className="text-red-400 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1e1b2e] text-white placeholder-gray-500 border border-gray-600 focus:outline-none focus:border-purple-500"
            />

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1e1b2e] text-white placeholder-gray-500 border border-gray-600 focus:outline-none focus:border-purple-500"
            />

            <label className="flex items-center justify-between text-gray-400 text-sm">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  className="mr-2 accent-purple-500"
                />
                Remember me
              </div>
              <a href="#" className="text-purple-400 hover:underline">
                Forgot password?
              </a>
            </label>

            <button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-600"></div>
            <span className="px-4 text-gray-400 text-sm">Or log in with</span>
            <div className="flex-grow h-px bg-gray-600"></div>
          </div>

          <div className="flex space-x-4">
            <button className="flex items-center justify-center w-1/2 border border-gray-600 py-3 rounded-lg text-white hover:bg-white/10 transition">
              <FaGoogle className="mr-2" /> Google
            </button>
            <button className="flex items-center justify-center w-1/2 border border-gray-600 py-3 rounded-lg text-white hover:bg-white/10 transition">
              <FaApple className="mr-2" /> Apple
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}