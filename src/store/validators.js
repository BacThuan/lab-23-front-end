export const required = (value) => value.trim().length > 0;

export const lengthValue = (config, value) => {
  let isValid = true;
  if (config.min) {
    isValid = isValid && value.trim().length >= config.min;
  }
  if (config.max) {
    isValid = isValid && value.trim().length <= config.max;
  }
  return isValid;
};

export const isEmail = (value) =>
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(
    value
  );
