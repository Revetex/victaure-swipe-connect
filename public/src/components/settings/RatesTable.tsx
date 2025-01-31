import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function RatesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Description</TableHead>
          <TableHead>Taux</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Taux horaire de base</TableCell>
          <TableCell>25.00 CAD</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Taux horaire supplémentaire</TableCell>
          <TableCell>37.50 CAD</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}