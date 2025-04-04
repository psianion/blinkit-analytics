import { useState } from 'react';
import Divider from '../Divider';
import HeadSection from './HeadSection';
import AppSelectSection from './AppSelectSection';
import ChartsSection from './ChartsSection';
import SKUTable from './SKUDataTable';
import CityTable from './CityDataTable';

const Dashboard = () => {
  const [isChecked, setIsChecked] = useState<boolean>(true);

  return (
    <div className='flex-1 h-full overflow-y-auto p-3'>
      <div className='w-full h-fit bg-white border border-solid border-[#EBEBEB] rounded-[10px]'>
        <HeadSection isChecked={isChecked} setIsChecked={setIsChecked} />
        <Divider />
        <AppSelectSection />
        <Divider />
        <div
          className={`bg-[#FAFAFA] w-full p-4 transition-all duration-300 ${
            isChecked ? 'h-auto opacity-100' : 'h-0 opacity-0 overflow-hidden'
          }`}
        >
          <ChartsSection />
        </div>
        <div className='flex flex-col gap-5 p-4 bg-[#FAFAFA]'>
          <SKUTable />
          <CityTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
