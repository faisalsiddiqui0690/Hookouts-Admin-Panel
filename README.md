# Hookouts Admin - React + TypeScript Dashboard

A modern admin dashboard built with React, TypeScript, and Vite, migrated from the Velok_v1.0 HTML template.

## 🚀 Features

- ✅ **React 19** with TypeScript
- ✅ **Vite** for fast development and building
- ✅ **React Router** for navigation
- ✅ **Lucide Icons** for beautiful, consistent icons
- ✅ **ApexCharts** ready for data visualization
- ✅ **Responsive Design** inherited from Velok template
- ✅ **Dark/Light Mode** support
- ✅ **Reusable Components** (Sidebar, Header, Cards)
- ✅ **Type-safe** with strict TypeScript typing

## 📁 Project Structure

```
hookouts.admin/
├── public/
│   └── assets/           # Copied from Velok_v1.0
│       ├── css/          # Stylesheets
│       ├── js/           # JavaScript files
│       ├── images/       # Images and icons
│       ├── fonts/        # Font files
│       └── vendor/       # Third-party libraries
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Sidebar.tsx   # Navigation sidebar
│   │   ├── Header.tsx    # Top header bar
│   │   └── index.ts      # Component exports
│   ├── pages/            # Page components
│   │   ├── Dashboard.tsx # Main dashboard page
│   │   ├── Contacts.tsx  # Contacts page
│   │   └── Settings.tsx  # Settings page
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts      # Shared types
│   ├── data/             # Mock data for development
│   │   └── mockData.ts   # Sample data
│   ├── assets/           # React-specific assets
│   │   └── styles/       # Custom styles
│   ├── App.tsx           # Main app component with routing
│   ├── main.tsx          # Entry point
│   └── index.css         # Global styles
└── package.json
```

## 🛠️ Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎨 Components

### Sidebar
- Collapsible navigation menu
- Submenu support with expand/collapse
- Active route highlighting
- Responsive design

### Header
- Search bar
- Dark/Light mode toggle
- Notifications dropdown
- User profile dropdown

### Dashboard
- Stats cards with icons
- Chart placeholders (ready for ApexCharts)
- User list with ratings
- Outlet locations
- Payment status table

## 📊 Types

All TypeScript types are defined in `src/types/index.ts`:

- `User` - User profile information
- `Product` - Product details
- `Outlet` - Location/branch information
- `Payment` - Payment transaction records
- `DashboardStats` - Dashboard statistics

## 🎯 Routing

Routes are configured in `App.tsx`:

- `/` → Redirects to `/dashboard`
- `/dashboard` → Main dashboard page
- `/contacts` → Contacts page
- `/settings` → Settings page

## 🎨 Styling

The project uses the original Velok admin template styles:

- Bootstrap 5 utility classes
- Custom Velok theme
- Responsive grid system
- Flexbox utilities

## 📝 Mock Data

Static data is available in `src/data/mockData.ts`:

- Users list
- Outlet locations
- Payment transactions
- Dashboard statistics

## 🔄 Next Steps (Future Enhancements)

1. **Charts Integration**
   - Initialize ApexCharts for dashboard visualizations
   - Add real-time data updates

2. **API Integration**
   - Replace mock data with API calls
   - Add authentication

3. **Additional Pages**
   - Complete all sidebar routes
   - Add forms and tables

4. **State Management**
   - Consider adding Redux or Zustand for global state

5. **Form Validation**
   - Add form validation libraries
   - Implement error handling

## 📄 License

This project was migrated from Velok_v1.0 admin template.

## 👨‍💻 Development

### Adding New Components

```tsx
// src/components/YourComponent.tsx
export const YourComponent = () => {
  return (
    <div className="your-component">
      {/* Your JSX here */}
    </div>
  );
};
```

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `App.tsx`
3. Add menu item in `Sidebar.tsx`

### Type Safety

Always use TypeScript types:

```tsx
import type { User } from '../types';

interface Props {
  user: User;
}

export const UserCard: React.FC<Props> = ({ user }) => {
  // Component implementation
};
```

## 🎉 Success!

The dashboard is now running with:
- ✅ Full navigation structure
- ✅ Responsive layout
- ✅ Modern React + TypeScript setup
- ✅ Ready for further development

Happy coding! 🚀
