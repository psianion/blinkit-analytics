import SalesChart from './SalesChart';
import CitiesChart from './CitiesChart';
import QuantityChart from './QuantityChart';

const ChartsSection = () => {
  return (
    <div className='w-full flex gap-2'>
      <SalesChart />
      <QuantityChart />
      <CitiesChart />
    </div>
  );
};

export default ChartsSection;
