import { useAuthSuspense } from "@repo/auth/tanstack/hooks";
import { CalendarDays, CheckCircle2, Mail, ShieldCheck, User } from "lucide-react";

export function ProfilePage() {
  const { user } = useAuthSuspense();

  const name = user?.name ?? "Student";
  const email = user?.email ?? "";
  const initials = getInitials(name);

  return (
    <main className="flex-1 space-y-8 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and account details.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-xl border bg-card text-card-foreground shadow-sm lg:col-span-1">
          <div className="flex flex-col items-center p-6 text-center">
            <div className="flex size-24 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary ring-4 ring-primary/5">
              {user?.image ? (
                <img src={user.image} alt={name} className="size-24 rounded-full object-cover" />
              ) : (
                initials
              )}
            </div>

            <h2 className="mt-5 text-lg font-semibold">{name}</h2>

            <p className="mt-1 text-sm text-muted-foreground">{email}</p>

            <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <User className="size-3.5" />
              Student
            </div>

            <button
              type="button"
              className="mt-6 h-9 w-full rounded-md border px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              Change Profile Picture
            </button>
          </div>

          <div className="border-t p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                <ShieldCheck className="size-4" />
              </div>

              <div>
                <p className="text-sm font-medium">Account status</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {user?.emailVerified ? "Email verified" : "Email not verified"}
                </p>
              </div>

              {user?.emailVerified && <CheckCircle2 className="ml-auto size-4 text-primary" />}
            </div>
          </div>
        </section>

        <section className="rounded-xl border bg-card text-card-foreground shadow-sm lg:col-span-2">
          <div className="border-b p-6">
            <h2 className="font-semibold">Personal Information</h2>
            <p className="mt-1 text-sm text-muted-foreground">Your basic account information.</p>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-2">
            <ProfileField label="Full name" value={name} icon={<User className="size-4" />} />

            <ProfileField label="Email address" value={email} icon={<Mail className="size-4" />} />

            <ProfileField label="Role" value="Student" icon={<ShieldCheck className="size-4" />} />

            <ProfileField
              label="Member since"
              value={
                user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"
              }
              icon={<CalendarDays className="size-4" />}
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t bg-muted/20 p-6">
            <button
              type="button"
              className="h-9 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
            >
              Cancel
            </button>

            <button
              type="button"
              className="h-9 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Edit Profile
            </button>
          </div>
        </section>
      </div>

      <section className="rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="border-b p-6">
          <h2 className="font-semibold">Account Overview</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A summary of your ProjectLearn account.
          </p>
        </div>

        <div className="grid divide-y md:grid-cols-3 md:divide-x md:divide-y-0">
          <OverviewItem label="Role" value="Student" description="Learning account" />

          <OverviewItem
            label="Email"
            value={user?.emailVerified ? "Verified" : "Unverified"}
            description="Account verification"
          />

          <OverviewItem label="Projects" value="—" description="Projects created" />
        </div>
      </section>
    </main>
  );
}

function ProfileField({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      <div className="flex h-10 items-center gap-3 rounded-md border bg-muted/30 px-3">
        <span className="text-muted-foreground">{icon}</span>
        <span className="truncate text-sm">{value || "—"}</span>
      </div>
    </div>
  );
}

function OverviewItem({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="p-6">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-semibold">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function getInitials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "S"
  );
}
