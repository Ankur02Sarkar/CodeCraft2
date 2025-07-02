import dedent from "dedent";

export default {
  SUGGESTIONS: [
    "Create ToDo App in React",
    "Create Budget Track App",
    "Create Gym Management Portal Dashboard",
    "Create Quiz App On History",
    "Create Login Signup Screen",
  ],
  HERO_HEADING: "What do you want to build?",
  HERO_DESC: "Prompt, run, edit, and deploy full-stack web apps.",
  INPUT_PLACEHOLDER: "What you want to build?",
  SIGNIN_HEADING: "Continue With CodeCraft",
  SIGNIN_SUBHEADING:
    "To use CodeCraft you must log into an existing account or create one.",
  SIGNIN_AGREEMENT_TEXT:
    "By using CodeCraft, you agree to the collection of usage data for analytics.",

  DEFAULT_FILE: {
    "/public/index.html": {
      code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
    },
    "/App.css": {
      code: `/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f5f5f5;
}

#root {
  min-height: 100vh;
}

/* Common utility classes */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.flex {
  display: flex;
}

.flex-column {
  flex-direction: column;
}

.justify-center {
  justify-content: center;
}

.align-center {
  align-items: center;
}

.text-center {
  text-align: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}`,
    },
  },
  DEPENDENCY: {
    "@codesandbox/sandpack-react": "^2.20.0",
    "@google/generative-ai": "^0.22.0",
    "@radix-ui/react-dialog": "^1.1.6",
    "@radix-ui/react-slot": "^1.1.2",
    "@react-oauth/google": "^0.12.1",
    "@types/uuid4": "^2.0.3",
    axios: "^1.7.9",
    "class-variance-authority": "^0.7.1",
    clsx: "^2.1.1",
    convex: "^1.19.2",
    dedent: "^1.5.3",
    "lucide-react": "^0.475.0",
    next: "15.1.7",
    "next-themes": "^0.4.4",
    react: "^18.0.0",
    "react-dom": "^18.0.0",
    "react-markdown": "^10.0.0",
    uuid4: "^2.0.3",
  },
  PRICING_DESC:
    "Start with a free account to speed up your workflow on public projects or boost your entire team with instantly-opening production environments.",
  PRICING_OPTIONS: [
    {
      name: "Basic",
      tokens: "50K",
      value: 50000,
      desc: "Ideal for hobbyists and casual users for light, exploratory use.",
      price: 4.99,
    },
    {
      name: "Starter",
      tokens: "120K",
      value: 120000,
      desc: "Designed for professionals who need to use CodeCraft a few times per week.",
      price: 9.99,
    },
    {
      name: "Pro",
      tokens: "2.5M",
      value: 2500000,
      desc: "Designed for professionals who need to use CodeCraft a few times per week.",
      price: 19.99,
    },
    {
      name: "Unlimted (License)",
      tokens: "Unmited",
      value: 999999999,
      desc: "Designed for professionals who need to use CodeCraft a few times per week.",
      price: 49.99,
    },
  ],
};
