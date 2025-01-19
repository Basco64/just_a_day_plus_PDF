import { generateMonthlyPDF } from "./PDFGenerator";
import {
  getMonthlyTotals,
  saveMonthlyTotals,
  clearMonthlyTotals,
} from "./storage";

export const closeMonth = () => {
  const monthlyTotals = getMonthlyTotals();
  const dailySummaries = JSON.parse(
    localStorage.getItem("dailySummaries") || "[]"
  );

  if (dailySummaries.length === 0) {
    alert("Aucune entrée pour le mois.");
    return;
  }

  const monthYear = localStorage.getItem("currentMonthYear");
  generateMonthlyPDF(dailySummaries, monthlyTotals);

  saveMonthlyTotals({ CB: 0, cheque: 0, espece: 0 });
  localStorage.removeItem("dailySummaries");
  localStorage.removeItem("currentMonthYear");
  alert("Mois clôturé et PDF généré.");
};