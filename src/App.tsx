import Dashboard from './components/Dashboard/Dashboard';
import Divider from './components/Divider';
import Sidebar from './components/Sidebar/Sidebar';
import { ThemeProvider } from './lib/theme-provider';

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <div className='w-full h-screen flex'>
        <Sidebar />
        <Dashboard />
      </div>
    </ThemeProvider>
  );
}

export default App;
