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
  return (
    <div className='mt-[40px]'>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h2 className='text-[20px] leading-6 font-bold text-[#031B15]'>
            City level data
          </h2>
          <p className='text-sm font-normal leading-4.5 text-[#4F4D55]'>
            Analytics for all cities
          </p>
        </div>
        <Button
          variant='outline'
          className='flex w-[109px] h-[40px] items-center gap-2 bg-[#027056] text-white rounded-[10px] text-sm font-medium'
        >
          Filters(1) <ChevronDown size={25} />
        </Button>
      </div>

      <div className='bg-white rounded-lg border border-gray-200 w-full'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  rowSpan={2}
                  className='w-1/6 border-r border-[#F1F1F1]'
                >
                  <div className='flex items-center justify-center gap-1'>
                    <ChartLine size={20} className='text-[#031B15]' />
                    <p>City Name</p>
                  </div>
                </TableHead>
                <TableHead
                  colSpan={3}
                  className='text-center text-[15px] font-bold'
                >
                  Sales Metrics
                </TableHead>
              </TableRow>

              <TableRow>
                <TableHead>
                  <div className='flex justify-center items-center gap-1'>
                    <p className='text-[15px] font-semibold leading-4'>Sales</p>
                    <ChevronDown size={14} className='text-[#031B15]' />
                  </div>
                </TableHead>
                <TableHead>
                  <div className='flex justify-center items-center gap-1'>
                    <p className='text-[15px] font-semibold leading-4'>
                      Percentage
                    </p>
                    <ChevronDown size={14} className='text-[#031B15]' />
                  </div>
                </TableHead>
                <TableHead>
                  <div className='flex justify-center items-center gap-1'>
                    <p className='text-[15px] font-semibold leading-4'>
                      Change
                    </p>
                    <ChevronDown size={14} className='text-[#031B15]' />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((city, index) => (
                <React.Fragment key={index}>
                  <TableRow>
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

              <TableRow className='font-semibold bg-gray-100'>
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
