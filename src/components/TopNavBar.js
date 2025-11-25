import React from "react";
import "../App";
import ReactModal from "react-modal";
import { useState } from "react";

function TopNavBar() {
  const [helpModalOpen, setHelpModalOpen] = useState(false);

  const closeHelpModal = () => {
    setHelpModalOpen(false);
  };

  const handleButtonPress = () => {
    setHelpModalOpen(true);
  };

  return (
    <div className="navBar">
      <div className="logo">
        <div className="logoText1">GRID</div>

        <div className="logoGrid">
          <div className="purpleLogoBox"></div>
          <div className="greyLogoBox"></div>
          <div className="greyLogoBox"></div>
          <div className="purpleLogoBox"></div>
        </div>
        <div className="logoText2">LINKER</div>
      </div>
      <button className="helpButton" onClick={handleButtonPress}>
        How to Play
      </button>
      <ReactModal className="tutorial" isOpen={helpModalOpen}>
        <button className="closeButton" onClick={() => closeHelpModal()}>
          &times;
        </button>
        <div>
          <div className="modalText1Tut">How to Play:</div>

          <div className="modalText3">
            <ul>
              <li style={{ paddingBottom: "7px" }}>
                {" "}
                Each box⬛ is assigned a random number.
              </li>
              <li style={{ paddingBottom: "7px" }}>
                Selecting a box🟪 will reveal the boxes⬜ around it, but also
                add to your score.
              </li>
              <li style={{ paddingBottom: "7px" }}>
                You must create a path that links the top and bottom of the
                grid, while keeping your score as{" "}
                <b>
                  <u>low</u>
                </b>{" "}
                as possible.
              </li>
              <li style={{ paddingBottom: "7px" }}>
                The
                <b> rightmost</b> column🟨 shows the total score of each row.
              </li>
              <li style={{ paddingBottom: "7px" }}>
                The game resets every 24h🕛,
                <b> try to beat the lowest daily score!</b>
              </li>
            </ul>
          </div>
        </div>
        <video
          className="video"
          autoPlay
          loop // Set the loop attribute to make the video play continuously
          muted // You can mute the video if needed
          width="200"
          height="300"
        >
          <source src="../gridLinkerTut3.mp4" type="video/mp4" />
          {/* Add additional <source> elements for different formats (WebM, Ogg, etc.) */}
          Your browser does not support the video tag.
        </video>
      </ReactModal>
    </div>
  );
}

export default TopNavBar;
