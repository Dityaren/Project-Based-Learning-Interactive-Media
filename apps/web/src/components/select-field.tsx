import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

export type Option = { value: string; label: string };

type Props = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
};

export function SelectField({
  value,
  onChange,
  options,
  placeholder,
  id,
  disabled,
  className,
  ...rest
}: Props) {
  return (
    <Select
      value={value}
      onValueChange={(v) => v != null && onChange(v)}
      items={options}
      disabled={disabled}
    >
      <SelectTrigger id={id} aria-label={rest["aria-label"]} className={className ?? "w-full"}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
