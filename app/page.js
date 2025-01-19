"use client";

import { useState, useEffect } from "react";
import Form from "@components/Form";
import Table from "@components/Table";
import Footer from "@components/Footer";
import {
  handleValidation,
  handleDelete,
  handleEdit,
  calculateTotals,
} from "@utils/helpers";
import { finishTheDay } from "@utils/daily";
import { closeMonth } from "@utils/monthly";
import {
  getDailyEntries,
  saveDailyEntries,
  getMonthlyTotals,
  saveMonthlyTotals,
  clearDailyEntries,
  clearStorage,
} from "@utils/storage";
import { Button } from "@components/ui/button";
import DateDisplay from "@components/DateDisplay";
import { ConfirmationDialog } from "@components/ConfirmationDialog";
import { generateDailyPDF } from "@/src/utils/PDFGenerator";

export default function Home() {
  const [list, setList] = useState([]);
  const [totals, setTotals] = useState({ CB: 0, cheque: 0, espece: 0 });
  const [isDayDialogOpen, setIsDayDialogOpen] = useState(false);
  const [isMonthDialogOpen, setIsMonthDialogOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const dailyEntries = getDailyEntries();
    const monthlyTotals = getMonthlyTotals();
    const currentDate = localStorage.getItem("currentDate");
    setList(dailyEntries);
    setTotals(calculateTotals(dailyEntries));
  }, []);

  const handleConfirmDay = () => {
    const dailyTotals = calculateTotals(list);

    generateDailyPDF(list);

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
    setIsDayDialogOpen(false);
    alert(`Journée du ${currentDate} clôturée et PDF généré.`);
  };

  const handleConfirmMonth = () => {
    const monthlyTotals = getMonthlyTotals();
    closeMonth(monthlyTotals);
    saveMonthlyTotals({ CB: 0, cheque: 0, espece: 0 });
    setIsMonthDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center my-14 mx-16">
        <h1 className="text-2xl font-bold">Comptabilité Journalière</h1>
        <DateDisplay />
      </div>
      <Form
  onValidation={() =>
    handleValidation(list, setList, (newList) => {
      saveDailyEntries(newList);
      setTotals(calculateTotals(newList));

      if (!localStorage.getItem("currentDate")) {
        const currentDate = new Date().toLocaleDateString("fr");
        localStorage.setItem("currentDate", currentDate);
        setCurrentDate(currentDate);
      }

      if (!localStorage.getItem("currentMonthYear")) {
        const currentMonthYear = new Date().toLocaleDateString("fr", {
          month: "long",
          year: "numeric",
        });
        localStorage.setItem("currentMonthYear", currentMonthYear);
      }
    })
  }
/>
      <Table
        list={list}
        onEdit={(id) =>
          handleEdit(id, list, setList, (newList) => {
            saveDailyEntries(newList);
            setList(newList);
            setTotals(calculateTotals(newList));
          })
        }
        onDelete={(id) =>
          handleDelete(id, list, setList, (newList) => {
            saveDailyEntries(newList);
            setList(newList);
            setTotals(calculateTotals(newList));
          })
        }
      />
      <Footer totals={totals} />
      <div className="mt-4 flex gap-10 justify-center">
        <Button
          onClick={() => setIsDayDialogOpen(true)}
          className="bg-green-500 hover:bg-green-600"
        >
          Clôturer la journée
        </Button>
        <Button
          onClick={() => setIsMonthDialogOpen(true)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Clôturer le mois
        </Button>
        {/* <Button onClick={clearStorage} className="bg-red-500 hover:bg-red-600">
          clean storage
        </Button> */}
      </div>

      <ConfirmationDialog
        isOpen={isDayDialogOpen}
        onClose={() => setIsDayDialogOpen(false)}
        onConfirm={handleConfirmDay}
        title={`Confirmer la clôture de la journée du ${currentDate}`}
        description={`Êtes-vous sûr de vouloir clôturer la journée du ${currentDate} ? Cette action est irréversible.`}
      />

      <ConfirmationDialog
        isOpen={isMonthDialogOpen}
        onClose={() => setIsMonthDialogOpen(false)}
        onConfirm={handleConfirmMonth}
        title="Confirmer la clôture du mois"
        description="Êtes-vous sûr de vouloir clôturer le mois ? Cette action est irréversible."
      />
    </div>
  );
}
