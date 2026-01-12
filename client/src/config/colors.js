/**
 * Centralized Color Configuration
 * Single source of truth for all colors used across the website
 * 
 * This file defines all color values used in the application.
 * Import these colors in components and use them via Tailwind classes.
 */

const colors = {
  // Base colors
  black: "#000000",
  white: "#FFFFFF",
  transparent: "transparent",

  // 10 shades of black (dark to light)
  black1: "#000000",
  black2: "#1a1a1a",
  black3: "#333333",
  black4: "#4d4d4d",
  black5: "#666666",
  black6: "#808080",
  black7: "#999999",
  black8: "#b3b3b3",
  black9: "#cccccc",
  black10: "#e6e6e6",
  blackBg: "#121212",

  // 10 shades of white (light to dark)
  white1: "#FFFFFF",
  white2: "#f2f2f2",
  white3: "#e6e6e6",
  white4: "#d9d9d9",
  white5: "#cccccc",
  white6: "#bfbfbf",
  white7: "#b3b3b3",
  white8: "#a6a6a6",
  white9: "#999999",
  white10: "#8c8c8c",

  // 10 shades of yellow (light to dark)
  yellow1: "#ffffe0",
  yellow2: "#fffacd",
  yellow3: "#fff8b2",
  yellow4: "#fff39e",
  yellow5: "#fff085",
  yellow6: "#ffeb70",
  yellow7: "#ffea57",
  yellow8: "#ffe344",
  yellow9: "#ffdd29",
  yellow10: "#ffd700",

  // 10 shades of blue (light to dark) - Primary brand color
  blue1: "#e0f7ff",
  blue2: "#b3eaff",
  blue3: "#80ddff",
  blue4: "#4dcfff",
  blue5: "#1ac2ff",
  blue6: "#00b5ff", // Primary blue
  blue7: "#0096cc", // Darker blue
  blue8: "#007799",
  blue9: "#005766",
  blue10: "#003833",

  // 10 shades of brown (light to dark)
  brown1: "#f5ebe0",
  brown2: "#eaddc8",
  brown3: "#d8bea0",
  brown4: "#c4a379",
  brown5: "#a3865b",
  brown6: "#856a45",
  brown7: "#6c5135",
  brown8: "#543927",
  brown9: "#3d2a1a",
  brown10: "#2b1a0f",

  // 10 shades of Caribbean green (light to dark)
  caribbeanGreen1: "#e0fff7",
  caribbeanGreen2: "#b3ffe5",
  caribbeanGreen3: "#80ffd2",
  caribbeanGreen4: "#4dffbf",
  caribbeanGreen5: "#1affad",
  caribbeanGreen6: "#00e69c",
  caribbeanGreen7: "#00b37a",
  caribbeanGreen8: "#008f62",
  caribbeanGreen9: "#006c4b",
  caribbeanGreen10: "#004932",

  // 10 shades of pink (light to dark)
  pink1: "#ffe0f7",
  pink2: "#ffb3ea",
  pink3: "#ff80dd",
  pink4: "#ff4dcf",
  pink5: "#ff1ac2",
  pink6: "#e600a9",
  pink7: "#b30086",
  pink8: "#800063",
  pink9: "#4d003f",
  pink10: "#1a001a",

  // 10 shades of grey (light to dark)
  grey1: "#f5f5f5",
  grey2: "#e0e0e0",
  grey3: "#cccccc",
  grey4: "#b8b8b8",
  grey5: "#a3a3a3",
  grey6: "#8f8f8f",
  grey7: "#7a7a7a",
  grey8: "#666666",
  grey9: "#525252",
  grey10: "#3d3d3d",

  // 5 shades of red (light to dark)
  red1: "#FF0000",
  red2: "#FF6666",
  red3: "#FF4C4C",
  red4: "#FF3232",
  red5: "#E60000",

  // 10 shades of purple (light to dark) - Softer, eye-friendly palette
  purple1: "#f5f3ff",
  purple2: "#ede9fe",
  purple3: "#ddd6fe",
  purple4: "#c4b5fd",
  purple5: "#a78bfa",
  purple6: "#8b5cf6", // Softer lavender - Primary purple
  purple7: "#7c3aed", // Muted purple
  purple8: "#6d28d9", // Deeper muted purple
  purple9: "#5b21b6", // Dark muted purple
  purple10: "#4c1d95", // Darkest muted purple
  
  // Framer button purple - Softer shade
  framerPurple: "#8b5cf6", // rgb(139, 92, 246) - Softer lavender
};

module.exports = { colors };
