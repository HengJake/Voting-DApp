import { useState } from "react";
import { Box, Heading, Button } from "@chakra-ui/react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./component/header.jsx";
import Home from "./pages/home.jsx";

function App() {
  return (
    <Box display={"flex"} flexDir={"column"} height={"100vh"}>
      <Header />

      <Box flex={1} bg={"teal.100"}>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
