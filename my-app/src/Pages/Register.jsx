import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaGoogle, FaApple } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agree: true,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(form),
});


      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed");
      }

      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-400 to-sky-300">
      <div className="flex bg-[#2a2540] rounded-2xl overflow-hidden shadow-2xl max-w-5xl w-full">
        {/* Left side */}
        <div
          className="w-1/2 flex flex-col justify-between p-6 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80')",
          }}
        >
          <button className="self-end bg-white/10 text-white px-4 py-1 rounded-full text-sm hover:bg-white/20">
            Back to website →
          </button>
          <div className="flex-grow flex items-center justify-center">
            <h1 className="text-white text-3xl font-bold text-center drop-shadow-lg">
              Your Digital Companion, <br /> Anytime, Anywhere
            </h1>
          </div>
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-3 h-1 rounded-full bg-white/30"></div>
            <div className="w-3 h-1 rounded-full bg-white"></div>
            <div className="w-3 h-1 rounded-full bg-white/30"></div>
          </div>
        </div>

        {/* Right side */}
        <div className="w-1/2 p-10">
          <h2 className="text-3xl font-bold text-white mb-2">
            Create an account
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-400 hover:underline">
              Log in
            </Link>
          </p>

          {error && <p className="text-red-400 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex space-x-4">
              <input
                type="text"
                name="firstName"
                placeholder="First name"
                value={form.firstName}
                onChange={handleChange}
                className="w-1/2 p-3 rounded-lg bg-[#1e1b2e] text-white placeholder-gray-500 border border-gray-600 focus:outline-none focus:border-purple-500"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last name"
                value={form.lastName}
                onChange={handleChange}
                className="w-1/2 p-3 rounded-lg bg-[#1e1b2e] text-white placeholder-gray-500 border border-gray-600 focus:outline-none focus:border-purple-500"
                required
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1e1b2e] text-white placeholder-gray-500 border border-gray-600 focus:outline-none focus:border-purple-500"
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1e1b2e] text-white placeholder-gray-500 border border-gray-600 focus:outline-none focus:border-purple-500"
              required
            />

            <label className="flex items-center text-gray-400 text-sm">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                className="mr-2 accent-purple-500"
                required
              />
              I agree to the{" "}
              <a href="#" className="text-purple-400 hover:underline ml-1">
                Terms & Conditions
              </a>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-600"></div>
            <span className="px-4 text-gray-400 text-sm">Or register with</span>
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



// import { Link, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import { FaGoogle, FaApple } from "react-icons/fa";

// export default function Register() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: "",
//     agree: false,
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setForm({ ...form, [name]: type === "checkbox" ? checked : value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Registration failed");
//       }

//       alert("Registration successful! Please log in.");
//       navigate("/login");
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-400 to-sky-300">
//       <div className="flex bg-[#2a2540] rounded-2xl overflow-hidden shadow-2xl max-w-5xl w-full">
        
//         {/* Left side */}
//         <div
//           className="w-1/2 flex flex-col justify-between p-6 bg-cover bg-center"
//           style={{
//             backgroundImage:
//               "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80')",
//           }}
//         >
//           <button className="self-end bg-white/10 text-white px-4 py-1 rounded-full text-sm hover:bg-white/20">
//             Back to website →
//           </button>
//           <div className="flex-grow flex items-center justify-center">
//             <h1 className="text-white text-3xl font-bold text-center drop-shadow-lg">
//               Your Digital Companion, <br /> Anytime, Anywhere
//             </h1>
//           </div>
//           <div className="flex justify-center space-x-2 mb-4">
//             <div className="w-3 h-1 rounded-full bg-white/30"></div>
//             <div className="w-3 h-1 rounded-full bg-white"></div>
//             <div className="w-3 h-1 rounded-full bg-white/30"></div>
//           </div>
//         </div>

//         {/* Right side */}
//         <div className="w-1/2 p-10">
//           <h2 className="text-3xl font-bold text-white mb-2">Create an account</h2>
//           <p className="text-sm text-gray-400 mb-6">
//             Already have an account?{" "}
//             <Link to="/login" className="text-purple-400 hover:underline">
//               Log in
//             </Link>
//           </p>

//           {error && <p className="text-red-400 mb-4">{error}</p>}

//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div className="flex space-x-4">
//               <input
//                 type="text"
//                 name="firstName"
//                 placeholder="First name"
//                 value={form.firstName}
//                 onChange={handleChange}
//                 className="w-1/2 p-3 rounded-lg bg-[#1e1b2e] text-white placeholder-gray-500 border border-gray-600 focus:outline-none focus:border-purple-500"
//                 required
//               />
//               <input
//                 type="text"
//                 name="lastName"
//                 placeholder="Last name"
//                 value={form.lastName}
//                 onChange={handleChange}
//                 className="w-1/2 p-3 rounded-lg bg-[#1e1b2e] text-white placeholder-gray-500 border border-gray-600 focus:outline-none focus:border-purple-500"
//                 required
//               />
//             </div>

//             <input
//               type="email"
//               name="email"
//               placeholder="Email"
//               value={form.email}
//               onChange={handleChange}
//               className="w-full p-3 rounded-lg bg-[#1e1b2e] text-white placeholder-gray-500 border border-gray-600 focus:outline-none focus:border-purple-500"
//               required
//             />

//             <input
//               type="password"
//               name="password"
//               placeholder="Enter your password"
//               value={form.password}
//               onChange={handleChange}
//               className="w-full p-3 rounded-lg bg-[#1e1b2e] text-white placeholder-gray-500 border border-gray-600 focus:outline-none focus:border-purple-500"
//               required
//             />

//             <label className="flex items-center text-gray-400 text-sm">
//               <input
//                 type="checkbox"
//                 name="agree"
//                 checked={form.agree}
//                 onChange={handleChange}
//                 className="mr-2 accent-purple-500"
//                 required
//               />
//               I agree to the{" "}
//               <a href="#" className="text-purple-400 hover:underline ml-1">
//                 Terms & Conditions
//               </a>
//             </label>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-lg font-semibold transition disabled:opacity-50"
//             >
//               {loading ? "Creating..." : "Create account"}
//             </button>
//           </form>

//           <div className="flex items-center my-6">
//             <div className="flex-grow h-px bg-gray-600"></div>
//             <span className="px-4 text-gray-400 text-sm">Or register with</span>
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
