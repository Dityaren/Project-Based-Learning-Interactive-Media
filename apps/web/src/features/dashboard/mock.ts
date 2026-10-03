export const student = {
  stats: { active: 3, dueThisWeek: 5, avgScore: 86, milestonesDone: "7/12" },
  projects: [
    {
      title: "Renewable Energy Prototype",
      subject: "Physics",
      progress: 72,
      next: "Build the prototype",
      due: "Oct 14",
    },
    {
      title: "Community Health Survey",
      subject: "Biology",
      progress: 45,
      next: "Analyze survey data",
      due: "Oct 21",
    },
    {
      title: "Digital Storytelling",
      subject: "Language Arts",
      progress: 18,
      next: "Write the script",
      due: "Nov 02",
    },
  ],
  deadlines: [
    {
      title: "Prototype v1 submission",
      project: "Renewable Energy",
      due: "Oct 6",
      tone: "soon" as const,
    },
    {
      title: "Survey questions draft",
      project: "Community Health",
      due: "Oct 9",
      tone: "ok" as const,
    },
    {
      title: "Reflection: Milestone 2",
      project: "Renewable Energy",
      due: "Oct 1",
      tone: "late" as const,
    },
  ],
  feedback: [
    {
      project: "Renewable Energy",
      from: "Ms. Rahma",
      text: "Strong research. Add a cost comparison to the proposal.",
      score: 88,
    },
    {
      project: "Community Health",
      from: "Mr. Budi",
      text: "Good survey structure. Revise question 4 for clarity.",
      score: null,
    },
  ],
};

export const teacher = {
  stats: { classes: 4, activeProjects: 6, pending: 14, late: 3 },
  review: [
    { student: "Team Alpha", project: "Renewable Energy", submitted: "2h ago", late: false },
    { student: "Sari Dewi", project: "Digital Storytelling", submitted: "5h ago", late: false },
    { student: "Team Delta", project: "Community Health", submitted: "1d ago", late: true },
    { student: "Raka Putra", project: "Digital Storytelling", submitted: "2d ago", late: true },
  ],
  classes: [
    { name: "X-A · Physics", progress: 68 },
    { name: "X-B · Physics", progress: 54 },
    { name: "XI-A · Biology", progress: 81 },
    { name: "XI-B · Biology", progress: 37 },
  ],
  deadlines: [
    { title: "Prototype v1 due", cls: "X-A", due: "Oct 6" },
    { title: "Survey draft due", cls: "XI-A", due: "Oct 9" },
    { title: "Final presentations", cls: "X-B", due: "Oct 28" },
  ],
};

export const admin = {
  stats: { students: 428, teachers: 24, classes: 18, activeProjects: 31 },
  activity: [
    { who: "admin@pjbl.local", what: "created user teacher02@school.id", when: "10 min ago" },
    { who: "admin@pjbl.local", what: "enrolled 32 students in X-A", when: "1h ago" },
    { who: "master@pjbl.local", what: "changed session lifetime to 7 days", when: "3h ago" },
    { who: "admin@pjbl.local", what: "deactivated account sari.dewi", when: "Yesterday" },
  ],
};
