/* eslint-disable prettier/prettier */
const punctuationKeys = [
  "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "_",
  "+", "-", "=", "[", "]", "{", "}", "\\", "|", ";", ":",
  "'", '"', ",", ".", "/", "<", ">", "?", "`", "~",
];

const specialKeys = [
  "CapsLock", "Space", "Tab", "Control", "Alt", "Shift",
  "Enter", "Backspace", "Delete", "Home", "End",
];

const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];

const functionKeys = [
  "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8",
  "F9", "F10", "F11", "F12",
];


const allowedKeys = [
  ...punctuationKeys,
  ...specialKeys,
  ...arrowKeys,
  " ", // Space
];

export {
  allowedKeys,
  punctuationKeys,
  specialKeys,
  arrowKeys,
  functionKeys,
};
