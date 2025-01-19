import { saveDailyEntries } from "./storage";

export const calculateTotals = (list) => {
  return list.reduce(
    (acc, element) => {
      acc[element.payment].count++;
      acc[element.payment].amount += element.amount;
      return acc;
    },
    {
      CB: { count: 0, amount: 0 },
      cheque: { count: 0, amount: 0 },
      espece: { count: 0, amount: 0 },
    }
  );
};

export const getCurrentDate = () => {
  const today = new Date();
  return today.toLocaleDateString("fr");
};

export const handleValidation = (list, setList, callback) => {
  const client = document.getElementById("client").value;
  const service = document.getElementById("service").value;
  const amount = parseFloat(document.getElementById("amount").value);
  const payment = document.querySelector('input[name="payment"]:checked').value;

  if (client && service && amount) {
    const newEntry = { id: Date.now(), client, service, amount, payment };
    const newList = [...list, newEntry];
    setList(newList);
    callback(newList);
    refresh();

    if (list.length === 0) {
      localStorage.setItem("currentDate", getCurrentDate());
    }
  }
};

export const handleDelete = (id, list, setList, callback) => {
  const newList = list.filter((item) => item.id !== id);
  setList(newList);
  callback(newList);
};

export const handleEdit = (id, list, setList, callback) => {
  const itemToEdit = list.find((item) => item.id === id);

  if (itemToEdit) {
    document.getElementById("client").value = itemToEdit.client;
    document.getElementById("service").value = itemToEdit.service;
    document.getElementById("amount").value = itemToEdit.amount;
    document.querySelector(
      `input[name="payment"][value="${itemToEdit.payment}"]`
    ).checked = true;

    const newList = list.filter((item) => item.id !== id);
    setList(newList);
    callback(newList);
  }
};

export const refresh = () => {
  document.getElementById("client").value = "";
  document.getElementById("service").value = "";
  document.getElementById("amount").value = "";
  document.querySelector('input[name="payment"][value="CB"]').checked = true;
};
