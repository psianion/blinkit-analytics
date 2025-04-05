import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { ChartLine, ChevronDown } from 'lucide-react';
import initConfig from '@/assets/init.json';
import { sendQuery } from '@/utils/FetchUtils';
import Loader from '../Loader';

interface TableData {
  id: string;
  name: string;
  sales: string;
  percentage: string;
  change: number;
  isExpanded?: boolean;
  [key: string]: string | number | boolean | TableData[] | undefined;
}

interface ApiResponseItem {
  'blinkit_insights_city.name': string;
  'blinkit_insights_city.sales_mrp_sum': string;
}

type TableValue = string | number;

export interface CityData {
  cityName: string;
  sales: string;
  percentage: string;
  change: string;
  subRows?: CityData[];
}

const CityTable = () => {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({
    totalSales: '',
    totalPercentage: '',
    totalChange: 0
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const cardConfig = initConfig.cards.find(
        (card: any) => card.id === 'blinkit-insights-city'
      );

      if (!cardConfig || !cardConfig.query) {
        console.error('Card config or query not found');
        return;
      }

      const queryObject = JSON.parse(cardConfig.query);

      const response = await sendQuery(queryObject);
      const thisMonthData = response[0].data;
      const lastMonthData = response[1].data;

      const totalSales = thisMonthData.reduce(
        (sum: number, item: ApiResponseItem) =>
          sum + Number(item['blinkit_insights_city.sales_mrp_sum']),
        0
      );

      const formattedData = thisMonthData.map(
        (item: ApiResponseItem, index: number) => {
          const sales = Number(item['blinkit_insights_city.sales_mrp_sum']);
          const percentage = ((sales / totalSales) * 100).toFixed(1);

          const lastMonthItem = lastMonthData.find(
            (lastItem: ApiResponseItem) =>
              lastItem['blinkit_insights_city.name'] ===
              item['blinkit_insights_city.name']
          );

          const lastMonthSales = lastMonthItem
            ? Number(lastMonthItem['blinkit_insights_city.sales_mrp_sum'])
            : 0;
          const change = ((sales - lastMonthSales) / lastMonthSales) * 100;

          return {
            id: index.toString(),
            name: item['blinkit_insights_city.name'],
            sales: `₹${(sales / 100000).toFixed(1)}L`,
            percentage: percentage,
            change: parseFloat(change.toFixed(1))
          };
        }
      );

      const totalChange = formattedData.reduce(
        (sum, city) => sum + (city.change || 0),
        0
      );

      setTotals({
        totalSales: `₹${(totalSales / 100000).toFixed(1)}L`,
        totalPercentage: '100%',
        totalChange: parseFloat(totalChange.toFixed(1))
      });

      const displayData = formattedData.map((city) => ({
        ...city,
        percentage: `${Number(city.percentage).toFixed(1)}%`
      }));

      setData(displayData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className='w-full bg-[#F9F9F9] rounded-[8px] shadow-[0px_1px_0px_0px_#0000001F]'>
      <div className='flex items-center justify-between mb-4'>
        <div className='flex flex-col'>
          <h2 className='text-[20px] leading-6 font-bold text-[#031B15]'>
            City level data
          </h2>
          <p className='text-sm font-normal leading-4.5 text-[#4F4D55]'>
            Analytics for all your Cities
          </p>
        </div>
        <Button className='flex w-[109px] h-[40px] items-center justify-center gap-2 bg-[#027056] hover:bg-[#027056] shadow-[0px_1px_4px_0px_#0000000A] text-white rounded-[10px] text-sm font-medium'>
          Filters(1) <ChevronDown size={20} />
        </Button>
      </div>

      <div className='bg-white rounded-[8px] border border-gray-200 w-full'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  rowSpan={2}
                  className='w-1/6 border-r border-[#F1F1F1]'
                >
                  <div className='flex items-center justify-center gap-1'>
                    <ChartLine
                      size={20}
                      strokeWidth={1.5}
                      className='text-[#031B15]'
                    />
                    <p className='text-[15px] font-semibold leading-4'>
                      City Name
                    </p>
                  </div>
                </TableHead>
                <TableHead
                  colSpan={3}
                  className='text-center text-[15px] font-bold text-[#013025]'
                >
                  Sales Metrics
                </TableHead>
              </TableRow>

              <TableRow>
                <TableHead>
                  <div className='flex justify-center items-center gap-1'>
                    <p className='text-[15px] font-semibold leading-4 text-[#013025]'>
                      Sales
                    </p>
                    <ChevronDown size={12} className='text-[#031B15]' />
                  </div>
                </TableHead>
                <TableHead>
                  <div className='flex justify-center items-center gap-1'>
                    <p className='text-[15px] font-semibold leading-4 text-[#013025]'>
                      Percentage
                    </p>
                    <ChevronDown size={12} className='text-[#031B15]' />
                  </div>
                </TableHead>
                <TableHead>
                  <div className='flex justify-center items-center gap-1'>
                    <p className='text-[15px] font-semibold leading-4 text-[#013025]'>
                      Change
                    </p>
                    <ChevronDown size={12} className='text-[#031B15]' />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((city, index) => (
                <React.Fragment key={index}>
                  <TableRow className='text-[14px] text-[#4E5E5A] font-medium'>
                    <TableCell className='border-r border-[#F1F1F1]'>
                      <div className='flex items-center gap-2'>
                        <Checkbox defaultChecked />
                        {city.name}
                      </div>
                    </TableCell>
                    <TableCell className='text-center'>{city.sales}</TableCell>
                    <TableCell className='text-center'>
                      {city.percentage}
                    </TableCell>
                    <TableCell className='text-center'>{city.change}</TableCell>
                  </TableRow>
                </React.Fragment>
              ))}

              <TableRow className='font-bold text-[15px] text-[#0A090B]'>
                <TableCell>Total</TableCell>
                <TableCell className='text-center'>
                  {totals.totalSales}
                </TableCell>
                <TableCell className='text-center'>
                  {totals.totalPercentage}
                </TableCell>
                <TableCell className='text-center'>
                  {totals.totalChange}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CityTable;
