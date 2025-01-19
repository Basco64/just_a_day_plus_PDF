import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@components/ui/table";
import { Button } from "@components/ui/button";
import { useState } from "react";
import { ConfirmationDialog } from "@components/ConfirmationDialog";

export default function JustTable({ list, onEdit, onDelete }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleConfirmDelete = () => {
    if (selectedId) {
      onDelete(selectedId);
      setIsDeleteDialogOpen(false);
      setSelectedId(null);
    }
  };

  return (
    <>
      <Table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mt-10">
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Prestation</TableHead>
            <TableHead>Montant</TableHead>
            <TableHead>Mode de paiement</TableHead>
            <TableHead>Modification</TableHead>
            <TableHead>Suppression</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.length === 0 ? (
            <TableRow>
              <TableCell colSpan="6" className="text-center py-4">
                Aucun client pour le moment.
              </TableCell>
            </TableRow>
          ) : (
            list.map((element) => (
              <TableRow key={element.id}>
                <TableCell>{element.client}</TableCell>
                <TableCell>{element.service}</TableCell>
                <TableCell>{element.amount} €</TableCell>
                <TableCell>{element.payment}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => onEdit(element.id)}
                    variant="outline"
                    className="bg-yellow-500 text-white hover:bg-yellow-600"
                  >
                    Modifier
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      setSelectedId(element.id);
                      setIsDeleteDialogOpen(true);
                    }}
                    variant="outline"
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    Supprimer
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        description="Êtes-vous sûr de vouloir supprimer cette entrée ? Cette action est irréversible."
      />
    </>
  );
}
