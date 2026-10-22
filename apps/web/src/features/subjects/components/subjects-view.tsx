import { Button } from "@repo/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import { Page } from "#/components/page-kit";
import { SearchInput } from "#/components/search-input";

import { listSubjects } from "../subjects.functions";
import { SUBJECTS_KEY, type SubjectRow } from "../types";
import { DeleteSubjectDialog } from "./delete-subject-dialog";
import { SubjectDialog } from "./subject-dialog";
import { SubjectsTable, type SubjectAction } from "./subjects-table";

type Dialog = null | { kind: "create" } | { kind: SubjectAction; row: SubjectRow };

export function SubjectsView() {
  const [dialog, setDialog] = useState<Dialog>(null);
  const [q, setQ] = useState("");
  const close = () => setDialog(null);

  const { data, isPending, isFetching, error } = useQuery({
    queryKey: SUBJECTS_KEY,
    queryFn: () => listSubjects(),
  });

  // the list is small, so filter in the browser
  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return needle
      ? data?.filter((s) => `${s.code} ${s.name}`.toLowerCase().includes(needle))
      : data;
  }, [data, q]);

  return (
    <Page
      title="Subjects"
      subtitle="The subjects taught at your school. Teachers are assigned to a subject within a class."
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput
          className="flex-1"
          value={q}
          onChange={setQ}
          placeholder="Search code or name…"
        />
        <Button onClick={() => setDialog({ kind: "create" })}>
          <Plus /> Add subject
        </Button>
      </div>

      <SubjectsTable
        rows={rows}
        isLoading={isPending}
        isFetching={isFetching}
        error={error}
        filtered={q.trim() !== ""}
        onAction={(kind, row) => setDialog({ kind, row })}
      />

      {dialog?.kind === "create" && <SubjectDialog onClose={close} />}
      {dialog?.kind === "edit" && <SubjectDialog row={dialog.row} onClose={close} />}
      {dialog?.kind === "delete" && <DeleteSubjectDialog row={dialog.row} onClose={close} />}
    </Page>
  );
}
