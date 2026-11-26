import React from 'react';
import { FontAwesome6 } from '@expo/vector-icons';

// Same Font Awesome 6 solid icons as the web version (names without the "fa-" prefix)
const Icon = ({ name, size = 16, color = '#000', style }) => (
  <FontAwesome6 name={name} size={size} color={color} solid style={style} />
);

export default Icon;
