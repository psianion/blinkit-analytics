import React from 'react';

export const SidebarGroupItem = ({
  text,
  isActive = false
}: {
  text: string;
  isActive?: boolean;
}) => {
  return (
    <div
      className={`flex items-center w-[205px] h-[36px] p-2 gap-2 rounded-[10px] transition-all duration-300 cursor-pointer ${
        !isActive ? 'hover:bg-zinc-200' : 'bg-[#DFEAE8] hover:bg-[#027056]/20'
      }`}
    >
      <p
        className={`text-[14px] leading-5 text-[#031B15]/80 pl-5 ${
          !isActive
            ? 'text-[#031B15]/80 font-regular'
            : 'text-[#027056] font-semibold'
        }`}
      >
        {text}
      </p>
    </div>
  );
};
const SidebarItem = ({
  text,
  icon
}: {
  text: string;
  icon: React.ReactNode;
}) => {
  return (
    <div className='flex items-center w-[205px] h-[36px] p-2 gap-2 rounded-[10px] hover:bg-zinc-200 transition-all duration-300 cursor-pointer'>
      {icon}
      <p className='text-[14px] font-medium leading-5 text-[#031B15]'>{text}</p>
    </div>
  );
};

export default SidebarItem;
