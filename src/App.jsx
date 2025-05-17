

import PeriodicTable from './components/PeriodicTable';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        <PeriodicTable />
      </div>
    </ThemeProvider>
  )
}

export default App
