# Better Note 📝

**Better Note** is a modern, feature-rich note-taking application designed to help you organize your thoughts beautifully. Built with the latest web technologies, it offers a seamless writing experience, robust organization tools, and a stunning user interface.

## 🚀 Features

- **Rich Text Editor**: A powerful, notion-style editor powered by [Tiptap](https://tiptap.dev/), supporting formatting, images, links, and more.
- **Smart Organization**: Group your notes into Notebooks to keep everything structured.
- **Secure Authentication**: Full support for Email and Google Sign-in using [Better Auth](https://better-auth.com/).
- **Modern Design**: A sleek, responsive interface built with [Shadcn UI](https://ui.shadcn.com/) and [Tailwind CSS v4](https://tailwindcss.com/).
- **Dark Mode**: Built-in dark mode support for comfortable writing at night.
- **Fast Search**: Instantly find your notes and notebooks with real-time filtering.
- **Responsive**: Works perfectly on desktop, tablet, and mobile devices.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/) (via [Neon](https://neon.tech/))
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Motion](https://motion.dev/) (Framer Motion)
- **Forms**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **State Management**: [Nuqs](https://nuqs.47ng.com/) (URL-based state)

## 📦 Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- pnpm (recommended) or npm/yarn
- A PostgreSQL database (e.g., Neon)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/yourusername/better-note.git
    cd better-note
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up Environment Variables:**

    Create a `.env` file in the root directory and add the following variables:

    ```env
    DATABASE_URL=postgresql://user:password@host/dbname
    BETTER_AUTH_SECRET=your_generated_secret
    BETTER_AUTH_URL=http://localhost:3000
    <!-- NEXT_PUBLIC_BASE_URL=http://localhost:3000 -->

    # Google OAuth (Optional)
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```

4.  **Setup Database:**

    Push the schema to your database:

    ```bash
    pnpm drizzle-kit push
    ```

5.  **Run the development server:**

    ```bash
    pnpm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

```
better-note/
├── app/                  # Next.js App Router pages and layouts
│   ├── (auth)/           # Authentication routes
│   ├── dashboard/        # Protected dashboard routes
│   └── api/              # API routes
├── components/           # Reusable UI components
│   ├── ui/               # Shadcn UI primitives
│   ├── form/             # Form components
│   └── ...
├── db/                   # Database configuration and schema
├── lib/                  # Utility functions and shared logic
├── hooks/                # Custom React hooks
├── public/               # Static assets
└── ...
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
