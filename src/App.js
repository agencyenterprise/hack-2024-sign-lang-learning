import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Detect, NotFound } from "./components";
import LandingPage from "./components/LandingPage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Freestyle from "./components/Freestyle";
import TextToSpeech from "./components/Tts";
import SignLanguageChat from "./components/SignLanguageChat";
import Presentation from "./components/Presentation";

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
          path="/tts"
          element={
            <Layout>
              <TextToSpeech />
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
          path="/freestyle"
          element={
            <Layout>
              <Freestyle />
            </Layout>
          }
        />
        <Route
          exact
          path="/chat"
          element={
            <Layout>
              <SignLanguageChat />
            </Layout>
          }
        />
        <Route
          exact
          path="/presentation"
          element={
            <Layout>
              <Presentation />
            </Layout>
          }
        />
        <Route exact path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
