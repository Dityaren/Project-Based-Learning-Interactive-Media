import { Button } from "@repo/ui/components/button";
import { Plus } from "lucide-react";

import { SearchInput } from "#/components/search-input";
import { SelectField } from "#/components/select-field";

import { ROLE_LABEL, ROLES, type Role } from "../constants";
import type { UsersSearch } from "../types";

const ROLE_OPTIONS = [
  { value: "all", label: "All roles" },
  ...ROLES.map((r) => ({ value: r, label: ROLE_LABEL[r] })),
];
const STATUS_OPTIONS = [
  { value: "all", label: "Any status" },
  { value: "active", label: "Active" },
  { value: "banned", label: "Deactivated" },
];

type Props = {
  search: UsersSearch;
  onSearch: (patch: Partial<UsersSearch>) => void;
  onCreate?: () => void; // omit to hide the button
};

export function UsersToolbar({ search, onSearch, onCreate }: Props) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <SearchInput
        className="flex-1"
        value={search.q ?? ""}
        onChange={(q) => onSearch({ q: q || undefined, page: undefined })}
        placeholder="Search name or email…"
      />
      <SelectField
        aria-label="Filter by role"
        className="w-full lg:w-40"
        value={search.role ?? "all"}
        options={ROLE_OPTIONS}
        onChange={(v) => onSearch({ role: v === "all" ? undefined : (v as Role), page: undefined })}
      />
      <SelectField
        aria-label="Filter by status"
        className="w-full lg:w-40"
        value={search.status ?? "all"}
        options={STATUS_OPTIONS}
        onChange={(v) =>
          onSearch({
            status: v === "all" ? undefined : (v as UsersSearch["status"]),
            page: undefined,
          })
        }
      />
      {onCreate && (
        <Button onClick={onCreate}>
          <Plus /> Add user
        </Button>
      )}
    </div>
  );
}
