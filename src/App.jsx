

import PeriodicTable from './components/PeriodicTable';
import ThemeToggle from './components/ThemeToggle';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black dark:from-gray-950 dark:to-black transition-colors relative overflow-hidden">
        {/* Decorative elements - neon glows */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 -right-24 w-72 h-72 bg-blue-500/10 dark:bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-pink-500/10 dark:bg-pink-600/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>
        
        <div className="relative z-10">
          <PeriodicTable />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
