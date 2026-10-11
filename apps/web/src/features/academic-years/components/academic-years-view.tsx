import { Button } from "@repo/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";

import { Page } from "#/components/page-kit";

import { listAcademicYears } from "../academic-years.functions";
import { ACADEMIC_YEARS_KEY, type AcademicYearRow } from "../types";
import { AcademicYearDialog } from "./academic-year-dialog";
import { AcademicYearsTable, type YearAction } from "./academic-years-table";
import { DeleteAcademicYearDialog } from "./delete-academic-year-dialog";
import { SetActiveDialog } from "./set-active-dialog";

type Dialog = null | { kind: "create" } | { kind: YearAction; row: AcademicYearRow };

export function AcademicYearsView() {
  const [dialog, setDialog] = useState<Dialog>(null);
  const close = () => setDialog(null);

  const { data, isPending, isFetching, error } = useQuery({
    queryKey: ACADEMIC_YEARS_KEY,
    queryFn: () => listAcademicYears(),
  });

  return (
    <Page
      title="Academic years"
      subtitle="Define school years. Classes belong to a year, and one year is active at a time."
    >
      <div className="flex justify-end">
        <Button onClick={() => setDialog({ kind: "create" })}>
          <Plus /> Add academic year
        </Button>
      </div>

      <AcademicYearsTable
        rows={data}
        isLoading={isPending}
        isFetching={isFetching}
        error={error}
        onAction={(kind, row) => setDialog({ kind, row })}
      />

      {dialog?.kind === "create" && <AcademicYearDialog onClose={close} />}
      {dialog?.kind === "edit" && <AcademicYearDialog row={dialog.row} onClose={close} />}
      {dialog?.kind === "activate" && <SetActiveDialog row={dialog.row} onClose={close} />}
      {dialog?.kind === "delete" && <DeleteAcademicYearDialog row={dialog.row} onClose={close} />}
    </Page>
  );
}
