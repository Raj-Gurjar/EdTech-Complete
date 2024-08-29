import { useSelector } from "react-redux";
import {Login} from "../pages/Auth/Auth";


export default function ProtectedRoute({ children }) {
  const { token } = useSelector((state) => state.auth);

  return token ? children : <Login />;
}
