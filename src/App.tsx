
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from './components/container/Layout';
import MainPage from './pages/MainPage';
import Books from "./components/Book/Books";
import ViewBookPage from './components/Book/ViewBookPage';
import EditBookPage from './components/Book/EditBookPage';
import UnregisteredBooks from "./components/Book/UnregisteredBooks";
import QrRegisterPage from "./components/QrCode/QrRegisterPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AddRegisteredBook from './components/QrCode/AddRegisteredBook';
import FavouriteBooks from "./components/Book/FavouriteBooks";
import Orders from './components/Order/Orders';
import ReturnBook from './components/QrCode/ReturnBook';
import CreateOrder from './components/Order/CreateOrder';
import ViewOrderPage from './components/Order/ViewOrderPage';
import BookBuyRecommendationsPage from './components/Book/BookBuyRecommendationsPage';
import ViewFinePage from './components/Order/ViewFinePage';
function App() {

  return (
    <BrowserRouter>
      {/* <Layout>
        <Routes>
          <Route path="/" element={<MainPage/>} />
          <Route path="/books" element={<Books/>}/>
          <Route path="/books/view" element={<ViewBookPage/>}/>
          <Route path="/unregistered-books" element={<UnregisteredBooks/>} />
          <Route path="/unregistered-books/register" element={<RegisterPage/>} />
        </Routes>
      </Layout> */}

      {/* Cia yra senas react routing kodas virsuj, dabar yra naudojama Outlet vietoj children */}
    
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<MainPage/>} />
        <Route path="/books" element={<Books/>}/>
        <Route path="/books/view" element={<ViewBookPage/>}/>
        <Route path="/books/edit" element={<EditBookPage/>}/>
        <Route path="/unregistered-books" element={<UnregisteredBooks/>} />
        <Route path="/unregistered-books/register" element={<QrRegisterPage/>} />
        <Route path="/add-to-bookcase" element={<AddRegisteredBook/>} />
        <Route path="/unregistered-books/register" element={<RegisterPage/>} />
        <Route path="/favourites" element={<FavouriteBooks />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/return-book" element={<ReturnBook />} />
        <Route path="/orders/create-order" element={<CreateOrder />} />
        <Route path="/orders/get-order" element={<ViewOrderPage />} />
        <Route path="/BookBuyRecommendationsPage" element={<BookBuyRecommendationsPage/>} />
        <Route path="/fine" element={<ViewFinePage/>} />
      </Route>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
      
    </Routes>
      
    </BrowserRouter>
  )
}

export default App
