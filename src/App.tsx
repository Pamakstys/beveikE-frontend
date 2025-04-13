
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from './components/container/Layout';
import MainPage from './pages/MainPage';
import Books from "./components/Book/Books";
import ViewBookPage from './components/Book/ViewBookPage';
import EditBookPage from './components/Book/EditBookPage';
import UnregisteredBooks from "./components/Book/UnregisteredBooks";
import RegisterPage from "./components/QrCode/RegisterPage";

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
        <Route path="/unregistered-books/register" element={<RegisterPage/>} />
      </Route>
    </Routes>
      
    </BrowserRouter>
  )
}

export default App
