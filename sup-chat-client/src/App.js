import { MainLayout } from "./UIkit/Layouts/MainLayout/MainLayout";
import "./App.css";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useEffect } from "react";

function App() {
  // const navigate = useNavigate();
  // const user = useSelector((state) => state.userSlice.user);
  // useEffect(() => {
  //   if (!user) {
  //     navigate("/login");
  //   }
  // }, [user]);

  return (
    <div className="App">
      <MainLayout>
        <Outlet />
      </MainLayout>
    </div>
  );
}

export default App;
