# Haven - Agentic Real Estate App

## Project Overview

Haven is an AI-powered, agentic real estate application designed to simplify the property search process. Users can express their needs in natural language, and Haven's AI agent will understand, search, and present the most relevant properties. This P-MVP (Pioneering Minimum Viable Product) focuses on the core AI agent experience, removing the complexity of user authentication to showcase the power of an agentic interface.

## Design and Features

### Visual Design

*   **Theme:** Clean, modern, and minimalist, with an off-white background (`#F7F7F7`) to create a sense of space and calm.
*   **Typography:** Clear and legible, with a focus on readability. We will use a sans-serif font like Inter.
*   **Iconography:** We will use `@radix-ui/react-icons` for a consistent and modern look and feel.
*   **Layout:** The layout will be responsive and mobile-first, ensuring a seamless experience across all devices.

### Key Features

*   **Agentic Interface:** A chat-based interface where users can interact with the Haven AI agent.
*   **Natural Language Property Search:** Users can describe their desired property in plain English (e.g., "a two-bedroom apartment in Brooklyn with a balcony and a budget of $4,000").
*   **Property Display:** The AI agent will present a curated list of properties that match the user's criteria, with high-quality images and key details.
*   **No User Authentication:** To focus on the core AI experience, the P-MVP will not have user accounts or login.

## Development Plan

### Sprint Goal (7 Days)

To build the P-MVP of Haven, demonstrating the core functionality of the agentic real estate search.

### Completed Tasks

*   **Project Scaffolding:**
    *   Set up a monorepo structure with a `frontend` (Next.js) and `backend` (FastAPI) directory.
    *   Initialized the Next.js project with the App Router, React 19, and TypeScript.
    *   Configured Tailwind CSS and Shadcn/UI for the frontend.
    *   Set up the Python backend with FastAPI and the necessary dependencies for LangChain and Groq.
    *   Created a multi-stage Dockerfile for the backend.
    *   Established a comprehensive `.gitignore` file.
*   **Dependency Management:**
    *   Resolved the initial dependency conflict between `lucide-react` and React 19 by replacing `lucide-react` with `@radix-ui/react-icons`.

### Next Steps

*   Build the basic UI for the chat interface.
*   Develop the backend API endpoint to handle chat messages.
*   Integrate the LangChain agent with the Groq Llama 3 model.
*   Implement the logic for the AI agent to understand and respond to user queries.
*   Connect the frontend to the backend to create a fully functional chat experience.
