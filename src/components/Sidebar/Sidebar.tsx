import {
  Calendar,
  ChevronDown,
  ChevronsUpDown,
  CircleHelp,
  Home,
  Images,
  Inbox,
  Search,
  Settings,
  Tv,
  UsersRound
} from 'lucide-react';
import {
  Sidebar as ShadSidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar';
import React, { useState } from 'react';
import SidebarItem, { SidebarGroupItem } from './SidebarItem';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../ui/collapsible';

const companyImages = [
  '/Sidebar/perfora.webp',
  '/Sidebar/mamaearth.png',
  '/Sidebar/boat.png'
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<Boolean>(true);
  const [selectedCompany, setSelectedCompany] = useState(0);

  return (
    <div
      className={`h-full flex ${
        isOpen ? 'min-w-[288px]' : 'min-w-[51px]'
      } transition-all duration-300`}
    >
      <div className='w-[51px] h-full flex flex-col items-center justify-between'>
        <div className='flex flex-col items-center'>
          <div className='w-full h-[80px] flex items-center justify-center'>
            <img
              key={companyImages[selectedCompany]}
              src={companyImages[selectedCompany]}
              onClick={() => setIsOpen(!isOpen)}
              className='w-[40px] h-[40px] cursor-pointer rounded-[12px] border-2 border-solid border-[#139C53]'
            />
          </div>
          <div>
            {companyImages
              .filter((_, index) => index !== selectedCompany)
              .map((image, index) => {
                const originalIndex = companyImages.findIndex(
                  (img) => img === image
                );
                return (
                  <div
                    key={image}
                    className='h-[52px] w-[50px] flex items-center justify-center'
                  >
                    <img
                      src={image}
                      onClick={() => {
                        setSelectedCompany(originalIndex);
                      }}
                      className={`w-[40px] h-[40px] cursor-pointer rounded-[12px] border-[0.5px] border-solid border-[#0000000d] border-opacity-20`}
                    />
                  </div>
                );
              })}
          </div>
        </div>
        <div className='flex flex-col items-center mb-5 gap-3 cursor-pointer'>
          <UsersRound size={20} color='#7E8986' />
          <div className='w-[28px] h-[28px] flex items-center justify-center rounded-full bg-[#9106FF] text-white text-sm cursor-pointer'>
            SS
          </div>
        </div>
      </div>

      <div
        className={`transition-all duration-300 bg-white flex flex-col ${
          isOpen ? 'w-[237px] opacity-100' : 'w-0 opacity-0'
        }`}
      >
        {isOpen && (
          <SidebarProvider>
            <ShadSidebar>
              <SidebarContent className='w-[237px] h-full flex flex-col bg-white'>
                <div className='w-full h-[80px] flex items-center justify-center'>
                  <div className='w-[180px] h-[36px] flex items-center p-[6px] justify-between border border-solid border-[#000]/12 rounded-[12px] cursor-pointer'>
                    <div className='flex items-center gap-2'>
                      <div className='w-6 h-6 bg-[#309E96] rounded-[7px] flex items-center justify-center text-white text-[11px] font-semibold'>
                        SS
                      </div>
                      <p className='font-semibold text-[16px] text-[#031B15]'>
                        Test_brand
                      </p>
                    </div>
                    <ChevronsUpDown size={16} />
                  </div>
                  <SidebarTrigger
                    onClick={() => setIsOpen(false)}
                    className='ml-2 cursor-pointer'
                  />
                </div>
                <div className='w-full h-full bg-[#F8F8F8] flex flex-col items-center justify-between p-4'>
                  <div className='flex flex-col items-center gap-1'>
                    <SidebarItem
                      text='Overview'
                      icon={
                        <Home size={20} color='#7E8986' strokeWidth={1.3} />
                      }
                    />
                    <Collapsible defaultOpen className='group/collapsible'>
                      <SidebarGroup>
                        <SidebarGroupLabel asChild>
                          <CollapsibleTrigger className='flex items-center justify-between w-[205px] h-[36px] p-2 gap-2 rounded-sm hover:bg-zinc-200 transition-all duration-300 cursor-pointer'>
                            <div className='flex items-center gap-2'>
                              <Tv size={20} color='#7E8986' strokeWidth={1.3} />
                              <p className='text-[14px] font-medium leading-5 text-[#031B15]'>
                                Channels
                              </p>
                            </div>
                            <ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
                          </CollapsibleTrigger>
                        </SidebarGroupLabel>
                        <CollapsibleContent>
                          <SidebarGroupContent className='flex flex-col items-start gap-1 mt-1'>
                            <SidebarGroupItem text='Meta Ads' />
                            <SidebarGroupItem text='Google Ads' />
                            <SidebarGroupItem text='Quick Commerce' isActive />
                          </SidebarGroupContent>
                        </CollapsibleContent>
                      </SidebarGroup>
                    </Collapsible>
                    <SidebarItem
                      text='Creatives'
                      icon={
                        <Images size={20} color='#7E8986' strokeWidth={1.3} />
                      }
                    />
                  </div>
                  <div className='flex flex-col items-center gap-1'>
                    <SidebarItem
                      text='Help'
                      icon={
                        <CircleHelp
                          size={20}
                          color='#7E8986'
                          strokeWidth={1.3}
                        />
                      }
                    />
                    <SidebarItem
                      text='Settings'
                      icon={
                        <Settings size={20} color='#7E8986' strokeWidth={1.3} />
                      }
                    />
                  </div>
                </div>
              </SidebarContent>
            </ShadSidebar>
          </SidebarProvider>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
