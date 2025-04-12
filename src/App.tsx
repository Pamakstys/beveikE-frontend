
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from './components/container/Layout';
import MainPage from './pages/MainPage';
import Books from "./components/Book/Book";

function App() {

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage/>} />
          <Route path="/books" element={<Books/>} />
        </Routes>
      </Layout>
    
    </BrowserRouter>
  )
}

export default App
