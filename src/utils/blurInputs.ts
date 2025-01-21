export const blurAllInputs = () => {
  const inputs = document.querySelectorAll<HTMLInputElement>("input");
  inputs.forEach((input) => input.blur());
};
