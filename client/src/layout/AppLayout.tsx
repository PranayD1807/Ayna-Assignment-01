import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import React from "react";
import { Box } from "@chakra-ui/react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const AppLayout = () => {
  return (
    <React.Fragment>
      <ToastContainer
        position="bottom-left"
        theme="dark"
        toastClassName="text-sm"
      />
      <Box position="sticky" top="0" left="0" width="100%" zIndex="1000">
        <Header />
      </Box>
      <Box overflowY="auto" style={{ maxHeight: "calc(100vh - 80px)" }}>
        <Outlet />
      </Box>
    </React.Fragment>
  );
};

export default AppLayout;
