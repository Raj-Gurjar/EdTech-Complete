import { useSelector } from "react-redux";
import Login from "../pages/Auth/Login";


export default function ProtectedRoute({ children }) {
  const { token } = useSelector((state) => state.auth);

  return token ? children : <Login />;
}
