import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import About from './pages/About';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listing from './pages/Listing';
import Search from './pages/Search';
import GeminiChat from './components/GeminiChat';
import { useSelector } from 'react-redux';
import PricePrediction from "./pages/PricePrediction";

import PriceTrend from './components/PriceTrend.jsx';

export default function App() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/about' element={<About />} />
        <Route path='/search' element={<Search />} />
        
        <Route path='/listing/:listingId' element={<Listing />} />

        {/* ✅ Protect routes that require login */}
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route path='/predict' element={<PricePrediction />} />
          <Route path='/update-listing/:listingId' element={<UpdateListing />} />
        
          <Route path="/price-trend" element={<PriceTrend />} />
        </Route>
      </Routes>

      {/* GeminiChat visible everywhere for logged in users */}
      {currentUser && <GeminiChat />}
    </BrowserRouter>
  );
}
