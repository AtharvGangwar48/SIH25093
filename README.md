# Smart Student Hub

A comprehensive platform to centralize student achievements, track activities, and generate verified digital portfolios.

## Features

- **Role-based Authentication**: Separate dashboards for students, faculty, and administrators
- **Achievement Tracking**: Students can log achievements with faculty verification
- **Event Management**: Faculty can create and manage institutional events
- **Digital Portfolios**: Auto-generated portfolios showcasing student accomplishments
- **Analytics Dashboard**: Comprehensive reporting for institutional decision-making
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A Supabase account and project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your Supabase project URL and anon key

4. Start the development server:
   ```bash
   npm run dev
   ```

### Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Add these to your `.env` file
4. Run the database migrations (they will be applied automatically when you connect)

## User Roles

### Students
- Track personal achievements and activities
- View upcoming events and register for participation
- Generate and manage digital portfolios
- View achievement verification status

### Faculty
- Verify student achievements and certificates
- Create and manage institutional events
- View students from their institution
- Track event participation

### Administrators
- Access comprehensive analytics and reporting
- Manage users and institutional settings
- Oversee all achievements and events
- View system-wide statistics

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Build Tool**: Vite

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── dashboards/     # Role-specific dashboards
│   └── Navbar.tsx      # Navigation component
├── contexts/           # React contexts
├── lib/               # Utility libraries
├── types/             # TypeScript type definitions
└── main.tsx           # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.