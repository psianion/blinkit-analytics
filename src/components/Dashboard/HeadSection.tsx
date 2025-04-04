import React from 'react';
import { PiChartLine } from 'react-icons/pi';
import { Switch } from '../ui/switch';

const HeadSection = ({
  isChecked,
  setIsChecked
}: {
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <div className='w-full flex items-center justify-between h-[64px] px-6'>
      <p className='font-medium text-[14px] text-[#031B15]'>Quick Commerce</p>
      <div className='flex items-center gap-2'>
        <div className='flex items-center justify-center gap-2 border border-solid border-[#EBEBEB] rounded-[10px] w-20 h-10'>
          <PiChartLine className='w-5 h-5' />
          <Switch
            className='data-[state=checked]:bg-[#027056]'
            checked={isChecked}
            onCheckedChange={setIsChecked}
          />
        </div>
      </div>
    </div>
  );
};

export default HeadSection;
