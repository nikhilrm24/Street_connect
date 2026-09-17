import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { BrowserRouter, Routes,Route} from "react-router-dom";
import Vendors from "./pages/Vendors";
import VendorDetails from "./pages/VendorDetails";

function App(){
    return(
        <>
         <BrowserRouter>
             <Routes>
                <Route path="/home" element={
                    <ProtectedRoute>
                    <Home/>
                </ProtectedRoute>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/vendors" element={<Vendors/>}/>
                <Route path="/vendors/:id" element={<VendorDetails/>}/>
             </Routes>
         
         </BrowserRouter>
       
        </>
    )
}
export default App;