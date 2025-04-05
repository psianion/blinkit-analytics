import Dashboard from './components/Dashboard/Dashboard';
import Sidebar from './components/Sidebar/Sidebar';

function App() {
  return (
    <div className='w-full h-screen flex'>
      <Sidebar />
      <Dashboard />
    </div>
  );
}

export default App;
