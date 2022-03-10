import "./App.css";
import Card from "./components/Card";
import LoadingBar from "react-top-loading-bar";
import React, { useState } from "react";
function App() {
  const [progress, setProgress] = useState(0);
  return (
    <>
      <LoadingBar color="blue" progress={progress} />
      <Card setProgress={setProgress} />
    </>
  );
}

export default App;
