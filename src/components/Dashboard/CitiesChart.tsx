'use client';
import { CircleHelp } from 'lucide-react';
import Divider from '../Divider';
import { HiOutlineArrowUp } from 'react-icons/hi';
import { PieChart, Pie, Cell } from 'recharts';
import { useEffect, useState } from 'react';
import { sendQuery } from '@/utils/FetchUtils';
import initConfig from '@/assets/init.json';

type City = {
  name: string;
  value: string;
  percentage: string;
  change: number;
  color: string;
};
type Response = {
  'blinkit_insights_city.name': string;
  'blinkit_insights_city.sales_mrp_sum': string;
};

const Colors = ['#6C4FED', '#EA6153', '#F7C245', '#D9D9D9'];

const CitiesChart = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [total, setTotal] = useState<string>('');
  const [totalChange, setTotalChange] = useState<number>(0);

  const fetchData = async () => {
    try {
      const cardConfig = initConfig.cards.find(
        (card: any) => card.id === 'blinkit-insights-city-sales_mrp_sum'
      );

      if (!cardConfig || !cardConfig.query) {
        console.error('Card config or query not found');
        return;
      }

      const queryObject = JSON.parse(cardConfig.query);

      const response = await sendQuery(queryObject);
      const thisMonthData = response?.[0]?.data;
      const lastMonthData = response?.[1]?.data;

      const totalSales = thisMonthData.reduce(
        (sum: number, item: Response) =>
          sum + Number(item['blinkit_insights_city.sales_mrp_sum']),
        0
      );

      const lastMonthTotalSales = lastMonthData.reduce(
        (sum: number, item: Response) =>
          sum + Number(item['blinkit_insights_city.sales_mrp_sum']),
        0
      );

      const change =
        ((totalSales - lastMonthTotalSales) / lastMonthTotalSales) * 100;

      const formattedData = thisMonthData.map(
        (item: Response, index: number) => {
          const sales = Number(item['blinkit_insights_city.sales_mrp_sum']);
          const percentage = Number(((sales / totalSales) * 100).toFixed(1));

          const lastMonthItem = lastMonthData.find(
            (lastItem: Response) =>
              lastItem['blinkit_insights_city.name'] ===
              item['blinkit_insights_city.name']
          );

          const lastMonthSales = lastMonthItem
            ? Number(lastMonthItem['blinkit_insights_city.sales_mrp_sum'])
            : 0;
          const cityChange = ((sales - lastMonthSales) / lastMonthSales) * 100;

          return {
            name: item['blinkit_insights_city.name'],
            value: (sales / 100000).toFixed(1) + 'L',
            percentage: percentage,
            change: parseFloat(cityChange.toFixed(1)),
            color: Colors[index % Colors.length]
          };
        }
      );

      setTotal((totalSales / 100000).toFixed(1) + 'L');
      setTotalChange(parseFloat(change.toFixed(1)));
      setCities(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='flex-1 h-[292px] bg-white border border-solid border-[#EBEBEB] rounded-[12px]'>
      <div className='w-full px-3 flex items-center justify-between h-[44px]'>
        <p className='font-semibold text-[14px] text-[#515153]'>Top Cities</p>
        <CircleHelp size={16} />
      </div>
      <Divider />
      <div className='flex flex-col items-center justify-between w-full h-[208px] p-3'>
        <div className='flex items-center justify-center relative'>
          <PieChart width={193} height={104}>
            <Pie
              data={cities}
              dataKey='percentage'
              cx='50%'
              cy='100%'
              startAngle={180}
              endAngle={0}
              outerRadius={95}
              innerRadius={77}
            >
              {cities.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
          <div className='absolute flex flex-col items-center top-[36px]'>
            <p className='text-[13px] font-regular text-[#7D7D7E]'>Total</p>
            <p className='text-lg font-bold text-black'>₹{total}</p>
            <p className='text-[13px] font-medium text-[#1D874F] flex items-center gap-1'>
              <HiOutlineArrowUp size={14} /> {totalChange} %
            </p>
          </div>
        </div>
        <div className='flex flex-col w-full mt-3 gap-2'>
          {cities.map((city, index) => (
            <div
              className='flex items-center justify-between w-full'
              key={index}
            >
              <div className='flex items-center gap-2'>
                <div
                  className={`h-[6px] w-[6px] rounded-full`}
                  style={{ backgroundColor: city.color }}
                />
                <p className='text-[13px] text-[#7d7d7e]'>{city.name}</p>
              </div>
              <div className='flex items-center gap-2 justify-between'>
                <p className='text-[13px] font-bold text-black'>{`₹ ${city.value}`}</p>
                <p className='flex items-center justify-center w-[36px] h-[20px] bg-[#F7F7F7] text-[13px] text-[#7d7d7e]'>
                  {Math.round(parseInt(city.percentage))}%
                </p>
                <p className='font-medium text-[#1D874F] text-[13px] flex items-center gap-1'>
                  <HiOutlineArrowUp size={14} /> {city.change}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CitiesChart;
