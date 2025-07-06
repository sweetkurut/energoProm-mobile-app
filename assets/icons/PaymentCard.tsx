import React from "react";
import Svg, { Path, G, Mask, Rect } from "react-native-svg";

const PaymentCard = () => {
  return (
    <Svg width={22} height={16} viewBox="0 0 22 16" fill="none">
      <Mask
        id="mask0"
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={22}
        height={4}
      >
        <Path d="M0.619141 0.5H21.3805V3.46698H0.619141V0.5Z" fill="white" />
      </Mask>
      <G mask="url(#mask0)">
        <Path
          d="M18.6845 0.51709H3.31527C1.83241 0.51709 0.619141 1.7303 0.619141 3.2135V3.46493H21.3805V3.2135C21.3805 1.73034 20.1673 0.51709 18.6846 0.51709H18.6845Z"
          fill="#FEA94B"
        />
      </G>
      <Path
        d="M15.4629 10.5171C15.445 10.2978 15.4214 9.97733 15.4035 9.73462H15.3918C15.2908 9.97752 15.178 10.2858 15.0713 10.5171L14.6738 11.3766H15.54L15.4629 10.5171Z"
        fill="#FEA94B"
      />
      <Mask
        id="mask1"
        maskUnits="userSpaceOnUse"
        x={0}
        y={6}
        width={22}
        height={10}
      >
        <Path d="M0.619141 6.88757H21.3805V15.5001H0.619141V6.88757Z" fill="white" />
      </Mask>
      <G mask="url(#mask1)">
        <Path
          d="M0.619219 12.7861C0.619219 14.2689 1.83245 15.4822 3.31535 15.4822H18.6846C20.1674 15.4822 21.3807 14.269 21.3807 12.7861L21.3805 6.92468H0.619141L0.619219 12.7861Z"
          fill="#FEA94B"
        />
      </G>
    </Svg>
  );
};

export default PaymentCard;
