import React from "react";
import Svg, { ClipPath, Defs, G, Path, Rect } from "react-native-svg";

const LocationIcon = () => (
  <Svg width={11} height={10} viewBox="0 0 11 10" fill="none">
    <Defs>
      <ClipPath id="clip0">
        <Rect width={10.94} height={10} fill="white" />
      </ClipPath>
    </Defs>
    <G clipPath="url(#clip0)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.47 4.16665C4.78079 4.16665 4.21998 3.60576 4.21998 2.91663C4.21998 2.22743 4.78079 1.66662 5.47 1.66662C6.15913 1.66662 6.72001 2.22743 6.72001 2.91663C6.72001 3.60576 6.15913 4.16665 5.47 4.16665ZM5.47 0C3.86163 0 2.55322 1.30831 2.55322 2.91677C2.55322 4.27177 4.83245 9.20168 5.09247 9.75923C5.16078 9.90593 5.30787 10.0001 5.47 10.0001C5.63166 10.0001 5.77874 9.90632 5.84752 9.75963C6.1075 9.20387 8.38677 4.28892 8.38677 2.91677C8.38677 1.30841 7.07838 0 5.47 0Z"
        fill="#666360"
      />
    </G>
  </Svg>
);

export default LocationIcon;
