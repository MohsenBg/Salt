import React, { FunctionComponent } from "react";
import Image from "next/image";
import RollingSvg from "../../../public/assets/loading/Rolling-1s-200px.svg";

interface props {
  backGroundColor?: string;
  height?: string;
  width?: string;
}
const Rolling: FunctionComponent<props> = ({
  backGroundColor,
  width,
  height,
}) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: backGroundColor,
      }}
    >
      <div style={{ width, height }}>
        <Image src={RollingSvg} />
      </div>
    </div>
  );
};

Rolling.defaultProps = {
  backGroundColor: "transparent",
  width: "auto",
  height: "auto",
};
export default Rolling;
