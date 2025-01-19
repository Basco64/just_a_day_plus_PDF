export default function Footer({ totals }) {
  return (
    <div className="mt-10 p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold text-center">Totaux</h3>
      <div className="flex justify-between mt-2">
        <div className="text-left">
          <p>
            CB: {totals.CB.count} transaction{totals.CB.count > 1 && "s"},{" "}
            {totals.CB.amount} €
          </p>
        </div>

        <div className="text-center">
          <p>
            Chèque: {totals.cheque.count} transaction
            {totals.cheque.count > 1 && "s"}, {totals.cheque.amount} €
          </p>
        </div>

        <div className="text-right">
          <p>
            Espèces: {totals.espece.count} transaction
            {totals.espece.count > 1 && "s"}, {totals.espece.amount} €
          </p>
        </div>
      </div>
    </div>
  );
}
