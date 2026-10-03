export type WorkshopDefinition = {
  id: string;
  title: string;
  description: string;
};

export type WorkshopTrackDefinition = {
  id: string;
  title: string;
  description: string;
  workshops: readonly WorkshopDefinition[];
};

export type WorkshopProgramDefinition = {
  id: string;
  title: string;
  description: string;
  focusAreas: readonly string[];
  philosophy?: string;
};

export const WORKSHOP_TRACKS = [
  {
    id: "ai-tools-prompting",
    title: "AI Tools & Prompting",
    description:
      "Learn how to communicate with AI, use modern AI tools effectively, and build practical AI-powered workflows for study, work and everyday tasks.",
    workshops: [
      {
        id: "ai-foundations-everyday-ai",
        title: "AI Foundations & Everyday AI",
        description:
          "Understand modern AI tools, what they can do, where they are useful, and how to use them effectively in everyday life.",
      },
      {
        id: "prompt-engineering-fundamentals",
        title: "Prompt Engineering Fundamentals",
        description:
          "Learn how context, instructions, constraints and refinement help you get clearer and more useful results from AI.",
      },
      {
        id: "ai-study-learning",
        title: "AI for Study & Learning",
        description:
          "Use AI for understanding concepts, research, notes, brainstorming, presentations and smarter learning workflows.",
      },
      {
        id: "ai-work-productivity",
        title: "AI for Work & Productivity",
        description:
          "Use AI for emails, documents, planning, analysis, ideas and everyday professional workflows.",
      },
      {
        id: "ai-content-creativity",
        title: "AI for Content & Creativity",
        description:
          "Explore practical AI-assisted ideation, writing, presentations and creative workflows.",
      },
      {
        id: "smart-ai-workflows",
        title: "Smart AI Workflows",
        description:
          "Learn how prompts and different AI tools can work together to complete practical tasks more efficiently.",
      },
    ],
  },
  {
    id: "ai-coding-developer-growth",
    title: "AI for Coding & Developer Growth",
    description:
      "Use AI as a development partner while strengthening your understanding, problem-solving ability and software-engineering workflow.",
    workshops: [
      {
        id: "ai-assisted-coding-foundations",
        title: "AI-Assisted Coding Foundations",
        description:
          "Learn how to communicate coding requirements to AI, evaluate generated solutions and understand the code you work with.",
      },
      {
        id: "build-applications-with-ai",
        title: "Build Applications with AI",
        description:
          "Learn an AI-assisted approach for moving from an idea toward functioning websites and applications while understanding the implementation.",
      },
      {
        id: "debugging-problem-solving-ai",
        title: "Debugging & Problem Solving with AI",
        description:
          "Use AI to investigate errors, understand root causes and approach debugging systematically.",
      },
      {
        id: "code-review-refactoring-ai",
        title: "Code Review & Refactoring with AI",
        description:
          "Use AI to improve code readability, structure, maintainability and overall quality.",
      },
      {
        id: "git-github-ai-workflow",
        title: "Git, GitHub & AI Developer Workflow",
        description:
          "Learn how AI can assist during real development, version-control and project workflows.",
      },
      {
        id: "ai-powered-software-engineering",
        title: "AI-Powered Software Engineering",
        description:
          "Learn an AI-assisted workflow across planning, building, debugging, reviewing, testing, documenting and improving software.",
      },
    ],
  },
] as const satisfies readonly WorkshopTrackDefinition[];

export const WORKSHOP_PROGRAMS = [
  {
    id: "ai-tools-prompting",
    title: "AI Tools & Prompting",
    description:
      "Learn to use modern AI tools, write better prompts, and build practical workflows for learning, work and creativity.",
    focusAreas: [
      "AI Foundations",
      "Prompt Engineering",
      "Study & Research with AI",
      "Work & Productivity",
      "Content & Creativity",
      "Smart AI Workflows",
    ],
  },
  {
    id: "ai-coding-developer-growth",
    title: "AI for Coding & Developer Growth",
    description:
      "Use AI as a development partner to build, debug, review and improve software while strengthening your own understanding.",
    focusAreas: [
      "AI-Assisted Coding",
      "Build Applications with AI",
      "Debugging & Problem Solving",
      "Code Review & Refactoring",
      "Git & GitHub Workflow",
      "AI-Powered Software Engineering",
    ],
    philosophy:
      "Use AI to become a stronger developer — not to replace understanding.",
  },
  {
    id: "ai-robotics",
    title: "AI & Robotics",
    description:
      "Explore how artificial intelligence, electronics and automation come together to create intelligent robotic systems.",
    focusAreas: [
      "Robotics Foundations",
      "Sensors & Actuators",
      "Microcontrollers & Control",
      "AI-Powered Decision Making",
      "Computer Vision & Automation",
      "Smart Robotics Projects",
    ],
  },
] as const satisfies readonly WorkshopProgramDefinition[];

export type WorkshopProgramId = (typeof WORKSHOP_PROGRAMS)[number]["id"];

export type WorkshopTrackId = (typeof WORKSHOP_TRACKS)[number]["id"];
export type WorkshopId =
  (typeof WORKSHOP_TRACKS)[number]["workshops"][number]["id"];

const EMPTY_WORKSHOPS: readonly WorkshopDefinition[] = [];

export function getWorkshopTrack(trackId: string) {
  return WORKSHOP_TRACKS.find((track) => track.id === trackId);
}

export function getWorkshopsForTrack(
  trackId: string,
): readonly WorkshopDefinition[] {
  return getWorkshopTrack(trackId)?.workshops ?? EMPTY_WORKSHOPS;
}

export function getWorkshop(workshopId: string) {
  for (const track of WORKSHOP_TRACKS) {
    const workshop = track.workshops.find((item) => item.id === workshopId);

    if (workshop) {
      return workshop;
    }
  }

  return undefined;
}

export function isWorkshopTrackId(value: string): value is WorkshopTrackId {
  return getWorkshopTrack(value) !== undefined;
}

export function isWorkshopId(value: string): value is WorkshopId {
  return getWorkshop(value) !== undefined;
}

export function isWorkshopInTrack(
  trackId: string,
  workshopId: string,
): boolean {
  return getWorkshopsForTrack(trackId).some(
    (workshop) => workshop.id === workshopId,
  );
}
