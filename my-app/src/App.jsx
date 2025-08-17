// import React from 'react';
// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './Pages/Login';
// import Register from './pages/Register';
// // import HomePage from './Home';
// import HomePage from './Home';
// import './App.css';

// function App() {
//   return (
//     <BrowserRouter>
//       <div className="app">
//         <Routes>
//           <Route path="/" element={<Navigate to="/register" />} />
//           <Route path="/register" element={<Register />} />
//           <Route path="/login" element={<Login />} />
//           {/* <Route path="/Home" element={<HomePage />} /> */}
//           <Route path="/home" element={<HomePage />} />

//         </Routes>
//       </div> 
//     </BrowserRouter>
//   );
// }

// export default App;


import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './pages/Register';
import HomePage from './Pages/Home'; // This is the only import for HomePage

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<HomePage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;