import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

const CounterIcon = () => (
  <Svg width={18} height={22} viewBox="0 0 18 22" fill="none">
    <Path
      d="M0.893753 4C0.893753 2.34315 2.10046 1 3.589 1H14.411C15.8996 1 17.1063 2.34315 17.1063 4V18C17.1063 19.6569 15.8996 21 14.411 21H3.589C2.10046 21 0.893753 19.6569 0.893753 18V4Z"
      stroke="#666360"
      strokeWidth={1.5}
      strokeMiterlimit={1.00463}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect x={4.47212} y={4.99683} width={9.05615} height={6.10223} stroke="#666360" strokeWidth={1.5} />
  </Svg>
);

export default CounterIcon;
