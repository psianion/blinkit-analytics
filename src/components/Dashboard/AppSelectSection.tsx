import React from 'react';

const data = [
  {
    name: 'Blinkit',
    image: '/Dashboard/blinkit.png'
  },
  {
    name: 'Zepto',
    image: '/Dashboard/zepto.jpg'
  },
  {
    name: 'Instamart',
    image: '/Dashboard/instamart.jpg'
  }
];
const AppSelectSection = () => {
  return (
    <div className='w-full flex items-center h-[64px] pl-3'>
      <div className='flex h-[40px] border-[0.5px] border-solid border-[#EBEBEB] rounded-[12px] p-1 gap-[15px] pr-3'>
        {data.map((item, index) => {
          return (
            <div
              key={index}
              className={`flex items-center justify-center w-[91px] ${
                index === 0
                  ? 'bg-[#DFEAE8] text-[#027056]'
                  : 'bg-white text-[#031B15]/70'
              } rounded-[10px]`}
            >
              <img
                src={item.image}
                alt={item.name}
                className={`w-[16px] h-[16px] ${
                  index === 0 ? 'opacity-100' : 'opacity-50'
                }`}
              />
              <p className='text-[14px] font-medium ml-2'>{item.name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AppSelectSection;
