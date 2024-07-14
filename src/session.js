export const addDataToLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
export const clearDataFromLocalStorage = () => {
  localStorage.clear();
};
export const getUserFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem("user"));
};
export const getTokenFromLocalStorage = () => {
  return localStorage.getItem("access_token");
};