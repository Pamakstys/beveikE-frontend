
import './App.css'
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from './components/container/Layout';
import MainPage from './pages/MainPage';

function App() {

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage/>} />
          <Route path="/books" element={<h1>Books</h1>} />
        </Routes>
      </Layout>
    
    </BrowserRouter>
  )
}

export default App
