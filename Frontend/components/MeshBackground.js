import React from 'react';
import Svg, { Defs, RadialGradient, LinearGradient, Stop, Rect, Ellipse } from 'react-native-svg';

// Soft blue "mesh" like the reference design, drawn with a few blurred radial blobs.
const blob = (id, color, a = 0.95) => (
  <RadialGradient id={id} cx="50%" cy="50%" r="50%">
    <Stop offset="0" stopColor={color} stopOpacity={a} />
    <Stop offset="1" stopColor={color} stopOpacity="0" />
  </RadialGradient>
);

const MeshBackground = ({ style }) => (
  <Svg width="100%" height="100%" viewBox="0 0 100 200" preserveAspectRatio="xMidYMid slice" style={style}>
    <Defs>
      {blob('pale', '#8fb6de')}
      {blob('vivid', '#1c45e8')}
      {blob('azure', '#1288dc')}
      {blob('deep', '#0a2a8a', 0.8)}
      <LinearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
        <Stop offset="0.38" stopColor="#0c0c26" stopOpacity="0" />
        <Stop offset="0.72" stopColor="#0c0c26" stopOpacity="1" />
      </LinearGradient>
    </Defs>
    <Rect width="100" height="200" fill="#1a6fd6" />
    <Ellipse cx="22" cy="38" rx="46" ry="42" fill="url(#azure)" />
    <Ellipse cx="88" cy="62" rx="52" ry="48" fill="url(#vivid)" />
    <Ellipse cx="40" cy="48" rx="34" ry="30" fill="url(#pale)" />
    <Ellipse cx="70" cy="110" rx="60" ry="40" fill="url(#deep)" />
    <Rect width="100" height="200" fill="url(#fade)" />
  </Svg>
);

export default MeshBackground;
