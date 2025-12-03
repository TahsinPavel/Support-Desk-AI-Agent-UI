# AI Support Desk UI (Frontend)

This is the official frontend for the AI Support Desk multi-tenant SaaS platform.

## Tech Stack
- Next.js 14+
- React
- Tailwind CSS
- shadcn/ui
- TypeScript

## Project Structure
ai_support_desk_ui/
 ├── src/
 │   ├── app/
 │   ├── components/
 │   ├── lib/
 │   └── styles/
 ├── public/
 ├── package.json
 ├── README.md
 └── ...

## Development
To run the dev server:

npm install
npm run dev

The app runs at: http://localhost:3000

## Deployment
Deploy on Vercel for best performance:
- Push to GitHub
- Import repository on Vercel
- Deploy

## Backend Connection
This UI connects to the backend API running at:

https://your-backend-domain.com/api

You can set this in:
.env.local

NEXT_PUBLIC_API_URL="http://localhost:8000"

## Notes
The UI includes:
- Multi-tenant dashboard
- Channel management (SMS, Email, Voice, Chat)
- Tenant onboarding
- AI conversation logs
- User management
- Settings pages
