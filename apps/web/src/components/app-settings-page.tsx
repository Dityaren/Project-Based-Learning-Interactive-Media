import {
  Bell,
  Check,
  Globe,
  Lock,
  Monitor,
  Moon,
  Palette,
  Shield,
  Sun,
  UserRound,
} from "lucide-react";
import { useState } from "react";

export function SettingsPage() {
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("id");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [projectNotifications, setProjectNotifications] = useState(true);
  const [discussionNotifications, setDiscussionNotifications] = useState(true);

  return (
    <main className="flex-1 space-y-8 p-6 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and account settings.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <nav className="sticky top-6 space-y-1">
            <SettingsNavItem icon={<UserRound className="size-4" />} label="Preferences" active />
            <SettingsNavItem icon={<Palette className="size-4" />} label="Appearance" />
            <SettingsNavItem icon={<Bell className="size-4" />} label="Notifications" />
            <SettingsNavItem icon={<Shield className="size-4" />} label="Security" />
          </nav>
        </aside>

        <div className="max-w-3xl space-y-6">
          <SettingsSection
            icon={<UserRound className="size-4" />}
            title="Preferences"
            description="Configure your general ProjectLearn preferences."
          >
            <SettingsRow
              title="Language"
              description="Choose the language used throughout the application."
            >
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="h-9 w-full rounded-md border bg-background px-3 text-sm outline-none focus:border-ring focus:ring-1 focus:ring-ring sm:w-44"
              >
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>
            </SettingsRow>
          </SettingsSection>

          <SettingsSection
            icon={<Palette className="size-4" />}
            title="Appearance"
            description="Customize how ProjectLearn looks on your device."
          >
            <SettingsRow title="Theme" description="Select how the application should appear.">
              <div className="grid grid-cols-3 gap-2 sm:w-72">
                <ThemeOption
                  icon={<Sun className="size-4" />}
                  label="Light"
                  value="light"
                  selected={theme === "light"}
                  onClick={() => setTheme("light")}
                />
                <ThemeOption
                  icon={<Moon className="size-4" />}
                  label="Dark"
                  value="dark"
                  selected={theme === "dark"}
                  onClick={() => setTheme("dark")}
                />
                <ThemeOption
                  icon={<Monitor className="size-4" />}
                  label="System"
                  value="system"
                  selected={theme === "system"}
                  onClick={() => setTheme("system")}
                />
              </div>
            </SettingsRow>
          </SettingsSection>

          <SettingsSection
            icon={<Bell className="size-4" />}
            title="Notifications"
            description="Choose which notifications you want to receive."
          >
            <div className="divide-y">
              <SettingsToggle
                title="Email notifications"
                description="Receive important updates and announcements by email."
                checked={emailNotifications}
                onChange={setEmailNotifications}
              />

              <SettingsToggle
                title="Project notifications"
                description="Get notified about project assignments, deadlines, and updates."
                checked={projectNotifications}
                onChange={setProjectNotifications}
              />

              <SettingsToggle
                title="Discussion notifications"
                description="Get notified when someone replies to your discussions."
                checked={discussionNotifications}
                onChange={setDiscussionNotifications}
              />
            </div>
          </SettingsSection>

          <SettingsSection
            icon={<Shield className="size-4" />}
            title="Security"
            description="Manage your account security."
          >
            <SettingsRow title="Password" description="Change your account password.">
              <button
                type="button"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Lock className="size-3.5" />
                Change password
              </button>
            </SettingsRow>

            <SettingsRow
              title="Active sessions"
              description="Review the devices currently signed in to your account."
            >
              <button
                type="button"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                <Globe className="size-3.5" />
                Manage sessions
              </button>
            </SettingsRow>
          </SettingsSection>

          <div className="flex items-center justify-end gap-3 border-t pt-6">
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
              Save changes
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function SettingsSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <div className="flex items-start gap-3 border-b p-6">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          {icon}
        </div>

        <div>
          <h2 className="font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
      </div>

      <div>{children}</div>
    </section>
  );
}

function SettingsRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 max-w-xl text-sm leading-5 text-muted-foreground">{description}</p>
      </div>

      <div className="shrink-0">{children}</div>
    </div>
  );
}

function SettingsToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-6 p-6">
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={[
          "relative h-6 w-11 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-muted",
        ].join(" ")}
      >
        <span
          className={[
            "absolute top-0.5 size-5 rounded-full bg-background shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5",
          ].join(" ")}
        />
      </button>
    </div>
  );
}

function ThemeOption({
  icon,
  label,
  value,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`Select ${value} theme`}
      onClick={onClick}
      className={[
        "relative flex h-16 flex-col items-center justify-center gap-1.5 rounded-lg border text-xs transition-colors",
        selected
          ? "border-primary bg-primary/5 text-primary"
          : "bg-background text-muted-foreground hover:bg-muted",
      ].join(" ")}
    >
      {icon}
      <span>{label}</span>

      {selected && (
        <span className="absolute top-1.5 right-1.5">
          <Check className="size-3.5" />
        </span>
      )}
    </button>
  );
}

function SettingsNavItem({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={[
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
        active
          ? "bg-muted font-medium text-foreground"
          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      ].join(" ")}
    >
      {icon}
      {label}
    </button>
  );
}
