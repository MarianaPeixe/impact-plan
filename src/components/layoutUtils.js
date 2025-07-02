//calcula estilos css (posições, alturas, etc) para os cenários/botões, com base no numero de cenários filtrados
export function getScenarioLayout(index, total) {
  const defaultHeight = "273px";
  const baseStyle = {
    height: defaultHeight
  };

  if (total === 1) {
    return {
      ...baseStyle,
      left: "50%",
      width: "35%",
      transform: "translateX(-50%)"
    };
  }

  if (total === 2) {
    const positions = ["19.5%", "50.5%"];
    return {
      ...baseStyle,
      left: positions[index],
      width: "30%"
    };
  }

  if (total === 3) {
    if (index === 0) {
      return { ...baseStyle, left: "12%", width: "25%" };
    } else if (index === 1) {
      return { ...baseStyle, left: "50%", width: "25%", transform: "translateX(-50%)" };
    } else if (index === 2) {
      return { ...baseStyle, left: "63%", width: "25%" };
    }
  }

  if (total === 4) {
    const positions = ["9%", "30%", "51%", "72%"];
    return {
      ...baseStyle,
      left: positions[index],
      width: "20%"
    };
  }

  // Default fallback (os 5 cenários)
  const positions = ["5%", "23%", "41%", "59%", "77%"];
  return {
    ...baseStyle,
    left: positions[index],
    width: "17%"
  };
}