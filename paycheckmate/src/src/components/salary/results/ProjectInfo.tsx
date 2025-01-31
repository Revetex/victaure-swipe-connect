import { JobInfo } from "@/types/salary";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, Calendar, MapPin, Hash } from "lucide-react";

interface ProjectInfoProps {
  jobInfo: JobInfo;
}

export const ProjectInfo = ({ jobInfo }: ProjectInfoProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead colSpan={2} className="text-sm font-semibold text-blue-800 dark:text-blue-200 border-b border-blue-200 dark:border-blue-800">
            Information du projet
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-sm">
        <TableRow className="hover:bg-blue-50/50 dark:hover:bg-blue-900/50">
          <TableCell className="py-1 flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            Semaine se terminant le
          </TableCell>
          <TableCell className="py-1">{jobInfo.weekEnding || "Non spécifié"}</TableCell>
        </TableRow>
        <TableRow className="hover:bg-blue-50/50 dark:hover:bg-blue-900/50">
          <TableCell className="py-1 flex items-center gap-2">
            <Building className="h-3 w-3" />
            Compagnie
          </TableCell>
          <TableCell className="py-1">{jobInfo.companyName || "Non spécifié"}</TableCell>
        </TableRow>
        <TableRow className="hover:bg-blue-50/50 dark:hover:bg-blue-900/50">
          <TableCell className="py-1 flex items-center gap-2">
            <Hash className="h-3 w-3" />
            Numéro du projet
          </TableCell>
          <TableCell className="py-1">{jobInfo.jobNumber || "Non spécifié"}</TableCell>
        </TableRow>
        <TableRow className="hover:bg-blue-50/50 dark:hover:bg-blue-900/50">
          <TableCell className="py-1 flex items-center gap-2">
            <MapPin className="h-3 w-3" />
            Chantier
          </TableCell>
          <TableCell className="py-1">{jobInfo.jobSiteAddress || "Non spécifié"}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};