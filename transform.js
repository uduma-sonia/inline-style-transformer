const fs = require("fs");
const { styles } = require("./inlineStyles");

const breakpoints = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

const shortHandMap = {
  p: ["padding"],
  pt: ["paddingTop"],
  pb: ["paddingBottom"],
  pl: ["paddingLeft"],
  pr: ["paddingRight"],
  px: ["paddingLeft", "paddingRight"],
  py: ["paddingTop", "paddingBottom"],
  m: ["margin"],
  mt: ["marginTop"],
  mb: ["marginBottom"],
  ml: ["marginLeft"],
  mr: ["marginRight"],
  mx: ["marginLeft", "marginRight"],
  my: ["marginTop", "marginBottom"],
  bg: ["backgroundColor"],
};

const expandShorthand = (key, value) => {
  const multiplier = 8;
  const resolvedValue =
    typeof value === "number" ? `${value * multiplier}px` : value;

  if (shortHandMap[key]) {
    return shortHandMap[key].reduce((acc, prop) => {
      acc[prop] = resolvedValue;
      return acc;
    }, {});
  }

  return { [key]: resolvedValue };
};

const toKebabCase = (prop) =>
  prop.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);

const convertToCSS = (styles) => {
  let css = "";
  const mediaQueries = {};
  const pseudoClasses = {};

  for (const className in styles) {
    const classStyles = styles[className];
    const baseStyles = {};

    for (const key in classStyles) {
      const value = classStyles[key];

      if (key.startsWith(":")) {
        pseudoClasses[className] ??= {};
        pseudoClasses[className][key] = value;
        continue;
      }

      if (typeof value === "object" && !Array.isArray(value)) {
        for (const bp in value) {
          const expanded = expandShorthand(key, value[bp]);
          if (bp === "xs") {
            Object.assign(baseStyles, expanded);
          } else {
            mediaQueries[bp] ??= {};
            mediaQueries[bp][className] ??= {};
            Object.assign(mediaQueries[bp][className], expanded);
          }
        }
      } else {
        Object.assign(baseStyles, expandShorthand(key, value));
      }
    }

    css += `.${className} {\n`;
    for (const prop in baseStyles) {
      css += `  ${toKebabCase(prop)}: ${baseStyles[prop]};\n`;
    }
    css += `}\n\n`;
  }

  for (const className in pseudoClasses) {
    for (const pseudo in pseudoClasses[className]) {
      css += `.${className}${pseudo} {\n`;
      const rawStyles = pseudoClasses[className][pseudo];
      const expandedStyles = {};

      for (const key in rawStyles) {
        Object.assign(expandedStyles, expandShorthand(key, rawStyles[key]));
      }

      for (const prop in expandedStyles) {
        css += `  ${toKebabCase(prop)}: ${expandedStyles[prop]};\n`;
      }

      css += `}\n\n`;
    }
  }

  for (const bp in mediaQueries) {
    css += `@media (min-width: ${breakpoints[bp]}px) {\n`;
    for (const className in mediaQueries[bp]) {
      css += `  .${className} {\n`;
      for (const prop in mediaQueries[bp][className]) {
        css += `    ${toKebabCase(prop)}: ${
          mediaQueries[bp][className][prop]
        };\n`;
      }
      css += `  }\n`;
    }
    css += `}\n\n`;
  }

  return css;
};

const cssOutput = convertToCSS(styles);
fs.writeFileSync("outputStyles.css", cssOutput, "utf8");
