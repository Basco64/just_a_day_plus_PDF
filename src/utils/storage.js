export const getDailyEntries = () => {
  const data = localStorage.getItem("dailyEntries");
  return data ? JSON.parse(data) : [];
};

export const saveDailyEntries = (data) => {
  localStorage.setItem("dailyEntries", JSON.stringify(data));
};

export const clearDailyEntries = () => {
  localStorage.removeItem("dailyEntries");
};

export const getMonthlyTotals = () => {
  const data = localStorage.getItem("monthlyTotals");
  return data ? JSON.parse(data) : { CB: 0, cheque: 0, espece: 0 };
};

export const saveMonthlyTotals = (data) => {
  localStorage.setItem("monthlyTotals", JSON.stringify(data));
};

export const clearMonthlyTotals = () => {
  localStorage.removeItem("monthlyTotals");
};

export const clearStorage = () => {
  localStorage.clear();
  alert("LocalStorage vidé");
  window.location.reload();
};

export const getServices = () => {
  const data = localStorage.getItem("services");
  return data ? JSON.parse(data) : [];
};

export const saveService = (service) => {
  const services = getServices();
  if (!services.includes(service)) {
    services.push(service);
    localStorage.setItem("services", JSON.stringify(services));
  }
};