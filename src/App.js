import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Detect, NotFound } from "./components";
import LandingPage from "./components/LandingPage";
import CustomWordDetect from "./components/CustomWordDetect";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Freestyle from "./components/Freestyle";

const notifyMsg = (type, msg) => {
  if (type === "success") {
    const notify = () => toast.success(msg);
    notify();
  } else {
    const notify = () => toast.error(msg);
    notify();
  }
};

const Layout = ({ children }) => {
  return <>{children}</>;
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />
        <Route
          exact
          path="/spell"
          element={
            <Layout notifyMsg={notifyMsg}>
              <Detect />
            </Layout>
          }
        />
        <Route
          exact
          path="/custom"
          element={
            <Layout notifyMsg={notifyMsg}>
              <CustomWordDetect />
            </Layout>
          }
        />
        <Route
          exact
          path="/freestyle"
          element={
            <Layout>
              <Freestyle />
            </Layout>
          }
        />
        <Route exact path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
