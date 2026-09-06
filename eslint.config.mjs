import coreWebVitals from "eslint-config-next/core-web-vitals";

export default [
  {
    ignores: [".next/**", "out/**", "crate/pkg/**", "node_modules/**"],
  },
  ...coreWebVitals,
];
