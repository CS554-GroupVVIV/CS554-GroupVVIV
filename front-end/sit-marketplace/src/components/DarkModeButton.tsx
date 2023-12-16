import React from "react";
import { BsMoonStarsFill, BsFillSunFill } from "react-icons/bs";
import { toggleTheme } from "../redux/action";
import { useDispatch } from "react-redux";

function DarkModeButton({ isdarkMode }) {
  const dispatch = useDispatch();


  return (
    <>
      <div
        className="darkmode"
      >
        <input
          type="checkbox"
          className="checkbox"
          id="checkbox"
          onChange={switchDarkMode}
          checked={isdarkMode}
        />
        <label htmlFor="checkbox" className="label">
          <BsMoonStarsFill color="white" />
          <BsFillSunFill color="yellow" />
          <div className="ball"></div>
        </label>
      </div>
    </>
  );
}

export default DarkModeButton;
