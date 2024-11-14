import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Sensor from "../pages/Sensor";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "/sensor",
    element: <Sensor />,
  },
]);

export default router;
