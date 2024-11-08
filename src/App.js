import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Detect, NotFound } from "./components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  return (
    <>
      {/* <Navbar notifyMsg={notifyMsg} /> */}
      {children}
      {/* <Footer /> */}
    </>
  );
};

function App() {
  return (
    <div className="App">
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Layout notifyMsg={notifyMsg}>
              <Detect />
            </Layout>
          }
        />

        <Route exact path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
