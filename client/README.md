# Academic Learning Outcome Dashboard - Frontend

A React-based frontend for managing and tracking student learning outcomes.

## Features

- 📊 View all learning outcomes organized by category
- ➕ Add new learning outcomes with title, description, category, and progress tracking
- ✏️ Edit existing learning outcomes
- 🗑️ Delete learning outcomes
- 📈 Visual progress bars for each outcome
- 🎨 Modern, responsive UI design
- 🔄 Real-time API integration with backend server

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on port 5000

## Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode
```bash
npm start
```
The app will open at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── OutcomeCard.js       # Individual outcome card component
│   │   ├── OutcomeCard.css      # Card styling
│   │   ├── OutcomeForm.js       # Form for adding/editing outcomes
│   │   ├── OutcomeForm.css      # Form styling
│   │   ├── OutcomeList.js       # List container for outcomes
│   │   └── OutcomeList.css      # List styling
│   ├── App.js                   # Main application component
│   ├── App.css                  # Main application styles
│   ├── index.js                 # React entry point
│   └── index.css                # Global styles
├── public/
│   ├── index.html               # HTML template
│   ├── manifest.json            # PWA manifest
│   └── robots.txt               # SEO robots file
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## API Integration

The frontend expects a backend server running on `http://localhost:5000` with the following endpoints:

- `GET /api/outcomes` - Fetch all learning outcomes
- `GET /api/outcomes/:id` - Fetch a specific outcome
- `POST /api/outcomes` - Create a new outcome
- `PUT /api/outcomes/:id` - Update an outcome
- `DELETE /api/outcomes/:id` - Delete an outcome

## Key Components

### App.js
Main component that manages:
- API communication
- State management for outcomes
- Error handling
- Loading states

### OutcomeList.js
Displays outcomes organized by category in a responsive grid layout.

### OutcomeCard.js
Individual card displaying:
- Outcome title and status
- Description
- Progress bar
- Edit and delete buttons

### OutcomeForm.js
Form component for:
- Adding new outcomes
- Editing existing outcomes
- Input validation
- Error messages

## Styling

The application uses CSS Grid and Flexbox for responsive layouts with:
- Mobile-first design approach
- Color scheme: Purple (#667eea) and related gradients
- Accessible buttons and form elements
- Smooth transitions and animations

## Configuration

The proxy setting in `package.json` automatically forwards API calls from `http://localhost:3000/api/*` to `http://localhost:5000/api/*`.

## Future Enhancements

- User authentication
- Search and filter outcomes
- Sort outcomes by status or progress
- Export data to CSV/PDF
- Charts and analytics dashboard
- Student progress tracking
- Outcome templates
- Comments and feedback section
- Timeline view

## Troubleshooting

### Backend connection error
- Ensure the backend server is running on port 5000
- Check that `axios` package is installed

### Styling issues
- Clear browser cache (Ctrl+Shift+Delete or Cmd+Shift+Delete)
- Verify CSS files are in the correct location

### Form validation issues
- Check browser console for error messages
- Ensure all required fields are filled

## License

ISC
