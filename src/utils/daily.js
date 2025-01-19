import { generateDailyPDF } from "./PDFGenerator";
import {
  getDailyEntries,
  clearDailyEntries,
  getMonthlyTotals,
  saveMonthlyTotals,
} from "./storage";
import { calculateTotals } from "./helpers";

export const finishTheDay = (list, setList, setTotals) => {
  if (list.length === 0) {
    alert("Aucune entrée pour la journée.");
    return;
  }

  const dailyTotals = calculateTotals(list);
  const currentDate = localStorage.getItem("currentDate");

  const dailySummary = {
    date: currentDate,
    CB: dailyTotals.CB.amount,
    cheque: dailyTotals.cheque.amount,
    espece: dailyTotals.espece.amount,
    total:
      dailyTotals.CB.amount +
      dailyTotals.cheque.amount +
      dailyTotals.espece.amount,
  };

  const dailySummaries = JSON.parse(
    localStorage.getItem("dailySummaries") || "[]"
  );
  dailySummaries.push(dailySummary);
  localStorage.setItem("dailySummaries", JSON.stringify(dailySummaries));

  generateDailyPDF(list, currentDate);

  const monthlyTotals = getMonthlyTotals();
  const updatedMonthlyTotals = {
    CB: monthlyTotals.CB + dailyTotals.CB.amount,
    cheque: monthlyTotals.cheque + dailyTotals.cheque.amount,
    espece: monthlyTotals.espece + dailyTotals.espece.amount,
  };

  saveMonthlyTotals(updatedMonthlyTotals);
  clearDailyEntries();
  setList([]);
  setTotals({ CB: 0, cheque: 0, espece: 0 });
  alert(`Journée du ${currentDate} clôturée et PDF généré.`);
};