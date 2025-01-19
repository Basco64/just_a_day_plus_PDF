import jsPDF from "jspdf";
import "jspdf-autotable";
import { clearDailyEntries, clearMonthlyTotals } from "./storage";

export const generateDailyPDF = (dailyEntries) => {
  const pdf = new jsPDF();
  const dailyHeader = [["Client", "Prestation", "Montant", "Mode de paiement"]];
  const currentDate = localStorage.getItem("currentDate");

  const totals = dailyEntries.reduce(
    (acc, entry) => {
      acc.total += entry.amount;
      if (entry.payment === "CB") acc.CB += entry.amount;
      if (entry.payment === "cheque") acc.cheque += entry.amount;
      if (entry.payment === "espece") acc.espece += entry.amount;
      return acc;
    },
    { total: 0, CB: 0, cheque: 0, espece: 0 }
  );

  const dailyBody = dailyEntries.map((entry) => [
    entry.client,
    entry.service,
    entry.amount,
    entry.payment,
  ]);

  const dailyFooter = [
    [
      `Total ${totals.total} €`,
      `CB: ${totals.CB} €`,
      `Chèque: ${totals.cheque} €`,
      `Espèces: ${totals.espece} €`,
    ],
  ];

  pdf.setFont("times", "bold");
  pdf.setFontSize(30);
  pdf.text(`Rapport journalier - ${currentDate}`, 15, 10);

  pdf.autoTable({
    head: dailyHeader,
    body: dailyBody,
    foot: dailyFooter,
    startY: 20,
  });

  pdf.save(`Rapport_${currentDate.replace(/\//g, "_")}.pdf`);
  localStorage.removeItem("currentDate");
  clearDailyEntries();
};

export const generateMonthlyPDF = (dailySummaries, monthlyTotals) => {
  const pdf = new jsPDF();
  const monthYear = localStorage.getItem("currentMonthYear");

  pdf.setFont("times", "bold");
  pdf.setFontSize(30);
  pdf.text(`Clôture du mois - ${monthYear}`, 15, 10);

  const headers = [["Date", "CB", "Chèque", "Espèces", "Total"]];
  const body = dailySummaries.map((summary) => [
    summary.date,
    `${summary.CB} €`,
    `${summary.cheque} €`,
    `${summary.espece} €`,
    `${summary.total} €`,
  ]);

  body.push([
    "Total",
    `${monthlyTotals.CB} €`,
    `${monthlyTotals.cheque} €`,
    `${monthlyTotals.espece} €`,
    `${monthlyTotals.CB + monthlyTotals.cheque + monthlyTotals.espece} €`,
  ]);

  pdf.autoTable({
    head: headers,
    body: body,
    startY: 20,
  });

  pdf.save(`Cloture_Mois_${monthYear.replace(/ /g, "_")}.pdf`);
  clearMonthlyTotals();
};