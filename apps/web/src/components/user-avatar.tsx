import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/components/avatar";

export function getInitials(name?: string | null) {
  return (
    (name ?? "")
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0])
      .join("")
      .toUpperCase() || "U"
  );
}

export function UserAvatar({
  name,
  image,
  className,
}: {
  name?: string | null;
  image?: string | null;
  className?: string;
}) {
  return (
    <Avatar className={className}>
      <AvatarImage src={image ?? undefined} alt="" referrerPolicy="no-referrer" />
      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
