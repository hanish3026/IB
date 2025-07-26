import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft,faRightToBracket } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import "../css/LandingHeader.css"
import { useNavigate } from "react-router-dom";
const LandingHeader = () => {
  const nav = useNavigate()
  function handleLogin(){
    nav("/login")
  }
  return (
    <header className="container-fluid py-3 background">
      <div className="row align-items-center">
        {/* Left Section - Back Icon */}
        <div className="col-4 text-start d-flex">
          <h4><FontAwesomeIcon icon={faArrowLeft} className="fs-4 cursor-pointer"/></h4>
        <h4 className="mb-0 mx-3 header-title">Net Banking</h4>

        </div>

        {/* Right Section - Icon & Login */}
        <div className="col-8 text-end d-flex justify-content-end align-items-center gap-3">
        <h4><FontAwesomeIcon icon={faRightToBracket} /></h4>
        <h4 className="header-title" onClick={handleLogin} style={{cursor:"pointer"}}>Login </h4>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
