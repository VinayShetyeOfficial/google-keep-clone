import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import FormatColorResetOutlinedIcon from "@mui/icons-material/FormatColorResetOutlined";
import ImageNotSupportedOutlinedIcon from "@mui/icons-material/ImageNotSupportedOutlined";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

/**
 * BgOptions component for note background customization
 *
 * Props:
 * - selectedBgColor: function - Callback for color selection
 * - activeBgColor: string - Currently active color
 * - selectedBgImage: function - Callback for image selection
 * - activeBgImage: string - Currently active image
 *
 * Features:
 * - Solid color options
 * - Background image options
 * - Active state indicators
 */
function BgOptions({
  selectedBgColor,
  activeBgColor,
  selectedBgImage,
  activeBgImage,
}) {
  const [bgColor, setBgColor] = useState(activeBgColor);
  const [bgImage, setBgImage] = useState(activeBgImage);

  function updateBgColor(bgColor) {
    setBgColor(bgColor);
    selectedBgColor(bgColor);
    // console.log(bgColor)
  }

  function updateBgImage(bgImage) {
    setBgImage(bgImage);
    selectedBgImage(bgImage);
    // console.log(bgImage)
  }

  //  Checked Tick
  const Checked = <CheckCircleRoundedIcon className="checked" />;

  return (
    /*--- Bakcground Options ---*/
    <div className="bgOptionsContainer">
      {/* Solids Colors Background Options  */}
      <div className="backgrounds solid_colors ">
        <Tooltip title="Default">
          <div>
            <div
              className={
                bgColor === "default" ? "bg-default bg-active" : "bg-default"
              }
              onClick={() => updateBgColor("default")}
            >
              <FormatColorResetOutlinedIcon />
              {bgColor === "default" && Checked}
            </div>
          </div>
        </Tooltip>

        <Tooltip title="Coral">
          <div>
            <div
              className={bgColor === "red" ? "bg-red bg-active" : "bg-red"}
              onClick={() => updateBgColor("red")}
            >
              {bgColor === "red" && Checked}
            </div>
          </div>
        </Tooltip>

        <Tooltip title="Peach">
          <div>
            <div
              className={
                bgColor === "orange" ? "bg-orange bg-active" : "bg-orange"
              }
              onClick={() => updateBgColor("orange")}
            >
              {bgColor === "orange" && Checked}
            </div>
          </div>
        </Tooltip>

        <Tooltip title="Sand">
          <div>
            <div
              className={
                bgColor === "yellow" ? "bg-yellow bg-active" : "bg-yellow"
              }
              onClick={() => updateBgColor("yellow")}
            >
              {bgColor === "yellow" && Checked}
            </div>
          </div>
        </Tooltip>

        <Tooltip title="Mint">
          <div>
            <div
              className={
                bgColor === "green" ? "bg-green bg-active" : "bg-green"
              }
              onClick={() => updateBgColor("green")}
            >
              {bgColor === "green" && Checked}
            </div>
          </div>
        </Tooltip>

        <Tooltip title="Sage">
          <div>
            <div
              className={bgColor === "teal" ? "bg-teal bg-active" : "bg-teal"}
              onClick={() => updateBgColor("teal")}
            >
              {bgColor === "teal" && Checked}
            </div>
          </div>
        </Tooltip>

        <Tooltip title="Fog">
          <div>
            <div
              className={bgColor === "blue" ? "bg-blue bg-active" : "bg-blue"}
              onClick={() => updateBgColor("blue")}
            >
              {bgColor === "blue" && Checked}
            </div>
          </div>
        </Tooltip>

        <Tooltip title="Storm">
          <div>
            <div
              className={
                bgColor === "dark-blue"
                  ? "bg-dark-blue bg-active"
                  : "bg-dark-blue"
              }
              onClick={() => updateBgColor("dark-blue")}
            >
              {bgColor === "dark-blue" && Checked}
            </div>
          </div>
        </Tooltip>

        <Tooltip title="Dusk">
          <div>
            <div
              className={
                bgColor === "purple" ? "bg-purple bg-active" : "bg-purple"
              }
              onClick={() => updateBgColor("purple")}
            >
              {bgColor === "purple" && Checked}
            </div>
          </div>
        </Tooltip>

        <Tooltip title="Blossom">
          <div>
            <div
              className={bgColor === "pink" ? "bg-pink bg-active" : "bg-pink"}
              onClick={() => updateBgColor("pink")}
            >
              {bgColor === "pink" && Checked}
            </div>
          </div>
        </Tooltip>

        <Tooltip title="Clay">
          <div>
            <div
              className={
                bgColor === "brown" ? "bg-brown bg-active" : "bg-brown"
              }
              onClick={() => updateBgColor("brown")}
            >
              {bgColor === "brown" && Checked}
            </div>
          </div>
        </Tooltip>

        <Tooltip title="Chalk">
          <div>
            <div
              className={bgColor === "gray" ? "bg-gray bg-active" : "bg-gray"}
              onClick={() => updateBgColor("gray")}
            >
              {bgColor === "gray" && Checked}
            </div>
          </div>
        </Tooltip>
      </div>

      <hr />

      {/* Picture Background Options */}
      <div className="backgrounds awesome_backgrounds">
        <Tooltip title="Default">
          <div>
            <div
              className={
                bgImage === "default"
                  ? "bg-img-default bg-active"
                  : "bg-img-default"
              }
              onClick={() => updateBgImage("default")}
            >
              <ImageNotSupportedOutlinedIcon />
              {bgImage === "default" && Checked}
            </div>
          </div>
        </Tooltip>

        <Tooltip title="Groceries">
          <div>
            <div
              className={
                bgImage === "img1" ? "bg-img-img1 bg-active" : "bg-img-img1"
              }
              onClick={() => updateBgImage("img1")}
            >
              {bgImage === "img1" && Checked}
            </div>
          </div>
        </Tooltip>

        <Tooltip title="Food">
          <div>
            <div
              className={
                bgImage === "img2" ? "bg-img-img2 bg-active" : "bg-img-img2"
              }
              onClick={() => updateBgImage("img2")}
            >
              {bgImage === "img2" && Checked}
            </div>
          </div>
        </Tooltip>

        <Tooltip title="Music">
          <div>
            <div
              className={
                bgImage === "img3" ? "bg-img-img3 bg-active" : "bg-img-img3"
              }
              onClick={() => updateBgImage("img3")}
            >
              {bgImage === "img3" && Checked}
            </div>
          </div>
        </Tooltip>

        <Tooltip title="Recepies">
          <div>
            <div
              className={
                bgImage === "img4" ? "bg-img-img4 bg-active" : "bg-img-img4"
              }
              onClick={() => updateBgImage("img4")}
            >
              {bgImage === "img4" && Checked}
            </div>
          </div>
        </Tooltip>

        <Tooltip title="Notes">
          <div>
            <div
              className={
                bgImage === "img5" ? "bg-img-img5 bg-active" : "bg-img-img5"
              }
              onClick={() => updateBgImage("img5")}
            >
              {bgImage === "img5" && Checked}
            </div>
          </div>
        </Tooltip>

        <Tooltip title="Places">
          <div>
            <div
              className={
                bgImage === "img6" ? "bg-img-img6 bg-active" : "bg-img-img6"
              }
              onClick={() => updateBgImage("img6")}
            >
              {bgImage === "img6" && Checked}
            </div>
          </div>
        </Tooltip>

        <Tooltip title="Travel">
          <div>
            <div
              className={
                bgImage === "img7" ? "bg-img-img7 bg-active" : "bg-img-img7"
              }
              onClick={() => updateBgImage("img7")}
            >
              {bgImage === "img7" && Checked}
            </div>
          </div>
        </Tooltip>

        <Tooltip title="Video">
          <div>
            <div
              className={
                bgImage === "img8" ? "bg-img-img8 bg-active" : "bg-img-img8"
              }
              onClick={() => updateBgImage("img8")}
            >
              {bgImage === "img8" && Checked}
            </div>
          </div>
        </Tooltip>

        <Tooltip title="Celebration">
          <div>
            <div
              className={
                bgImage === "img9" ? "bg-img-img9 bg-active" : "bg-img-img9"
              }
              onClick={() => updateBgImage("img9")}
            >
              {bgImage === "img9" && Checked}
            </div>
          </div>
        </Tooltip>
      </div>
    </div>
  );
}

export default BgOptions;
