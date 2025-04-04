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
import React, { useEffect, useState } from 'react';
import { sendQuery } from '@/utils/FetchUtils';
import initConfig from '@/assets/init.json';
import { formatNumber } from '@/lib/utils';

type TableData = {
  id: string;
  name: string;
  sales: string;
  outOfStock: string;
  totalInventory: string;
  averageRank: number;
  estTraffic: number;
  estImpressions: number;
  isExpanded?: boolean;
  [key: string]: string | number | boolean | TableData[] | undefined;
};

type ApiResponseItem = {
  'blinkit_insights_sku.id': string;
  'blinkit_insights_sku.name': string;
  'blinkit_insights_sku.sales_mrp_sum': string;
  'blinkit_insights_sku.qty_sold': string;
  'blinkit_insights_sku.drr_7': string;
  'blinkit_insights_sku.drr_14': string;
  'blinkit_insights_sku.drr_30': string;
  'blinkit_insights_sku.sales_mrp_max': string;
  'blinkit_insights_sku.month_to_date_sales': string;
  'blinkit_insights_sku.be_inv_qty': string;
  'blinkit_insights_sku.fe_inv_qty': string;
  'blinkit_insights_sku.inv_qty': string;
  'blinkit_insights_sku.days_of_inventory_14': string;
  'blinkit_insights_sku.days_of_inventory_max': string;
  'blinkit_scraping_stream.on_shelf_availability': string | null;
  'blinkit_scraping_stream.rank_avg': string | null;
  'blinkit_scraping_stream.selling_price_avg': string | null;
  'blinkit_scraping_stream.discount_avg': string | null;
};

export default function SKUTable() {
  const [data, setData] = useState<TableData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const cardConfig = initConfig.cards.find(
        (card: any) => card.id === 'blinkit-insights-sku'
      );

      if (!cardConfig || !cardConfig.query) {
        console.error('Card config or query not found');
        return;
      }

      const queryObject = JSON.parse(cardConfig.query);

      const response = await sendQuery(queryObject);
      const rawData = response[0].data;
      const formattedData = rawData.map((item: ApiResponseItem) => ({
        id: item['blinkit_insights_sku.id'],
        name: item['blinkit_insights_sku.name'],
        sales: `₹${Number(
          item['blinkit_insights_sku.sales_mrp_sum']
        ).toLocaleString()}`,
        outOfStock: item['blinkit_scraping_stream.on_shelf_availability']
          ? `${(
              100 -
              Number(item['blinkit_scraping_stream.on_shelf_availability'])
            ).toFixed(2)}%`
          : 'N/A',
        totalInventory: item['blinkit_insights_sku.inv_qty'],
        averageRank: item['blinkit_scraping_stream.rank_avg']
          ? Number(item['blinkit_scraping_stream.rank_avg'])
          : 0,
        estTraffic: Number(item['blinkit_insights_sku.qty_sold']),
        estImpressions: Number(item['blinkit_insights_sku.month_to_date_sales'])
      }));

      setData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalSales = data.reduce((sum, item) => {
    const salesValue = Number(item.sales.replace(/[^0-9.-]+/g, '')); // Remove currency symbols and commas
    return sum + salesValue;
  }, 0);

  const totalOutOfStock = data.reduce((sum, item) => {
    const outOfStockValue = parseFloat(item.outOfStock.replace('%', '')) || 0;
    return sum + outOfStockValue;
  }, 0);

  const totalInventory = data.reduce(
    (sum, item) => sum + Number(item.totalInventory || 0),
    0
  );

  const totalAverageRank = data.reduce(
    (sum, item) => sum + Number(item.averageRank || 0),
    0
  );

  const totalTraffic = data.reduce(
    (sum, item) => sum + Number(item.estTraffic || 0),
    0
  );

  const totalImpressions = data.reduce(
    (sum, item) => sum + Number(item.estImpressions),
    0
  );

  return (
    <div>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h2 className='text-[20px] leading-6 font-bold text-[#031B15]'>
            SKU level data
          </h2>
          <p className='text-sm font-normal leading-4.5 text-[#4F4D55]'>
            Analytics for all your SKUs
          </p>
        </div>
        <Button
          variant='outline'
          className='flex w-[109px] h-[40px] items-center gap-2 bg-[#027056] text-white rounded-[10px] text-sm font-medium'
        >
          Filters(1) <ChevronDown size={25} />
        </Button>
      </div>
      <div className='bg-white rounded-lg border border-gray-200  w-full'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  rowSpan={2}
                  className='w-1/6 border-r border-[#F1F1F1]'
                >
                  <div className='flex items-center justify-center gap-1'>
                    {' '}
                    <ChartLine size={20} className='text-[#031B15]' />
                    <p>SKU Name</p>
                  </div>
                </TableHead>
                <TableHead
                  colSpan={3}
                  className='text-center text-[15px] font-bold border-r border-[#F1F1F1]'
                >
                  Availability
                </TableHead>
                <TableHead
                  colSpan={4}
                  className='text-center text-[15px] font-bold'
                >
                  Visibility
                </TableHead>
              </TableRow>
              <TableRow>
                <TableHead>
                  <div className='flex justify-center items-center gap-1'>
                    <p className='text-[15px] font-semibold leading-4'>Sales</p>
                    <ChevronDown size={14} className='text-[#031B15]' />
                  </div>
                </TableHead>
                <TableHead className='text-center'>
                  <div className='flex justify-center items-center gap-1'>
                    <p className='text-[15px] font-semibold leading-4'>
                      Out of Stock
                    </p>
                    <ChevronDown size={14} className='text-[#031B15]' />
                  </div>
                </TableHead>
                <TableHead className='border-r border-[#F1F1F1]'>
                  <div className='flex justify-center items-center gap-1'>
                    <p className='text-[15px] font-semibold leading-4'>
                      Total Inventory
                    </p>
                    <ChevronDown size={14} className='text-[#031B15]' />
                  </div>
                </TableHead>
                <TableHead>
                  <div className='flex justify-center items-center gap-1'>
                    <p className='text-[15px] font-semibold leading-4'>
                      Avg. Rank
                    </p>
                    <ChevronDown size={14} className='text-[#031B15]' />
                  </div>
                </TableHead>
                <TableHead>
                  <div className='flex justify-center items-center gap-1'>
                    <p className='text-[15px] font-semibold leading-4'>
                      Est. Traffic
                    </p>
                    <ChevronDown size={14} className='text-[#031B15]' />
                  </div>
                </TableHead>
                <TableHead>
                  <div className='flex justify-center items-center gap-1'>
                    <p className='text-[15px] font-semibold leading-4'>
                      Est. Impressions
                    </p>
                    <ChevronDown size={14} className='text-[#031B15]' />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.map((el, index) => (
                <React.Fragment key={index}>
                  <TableRow>
                    <TableCell className=' border-r border-[#F1F1F1]'>
                      <div className='flex items-center gap-2'>
                        <Checkbox defaultChecked />
                        {el.name}
                      </div>
                    </TableCell>
                    <TableCell className='text-center'>{el.sales}</TableCell>
                    <TableCell className='text-center'>
                      {el.outOfStock}
                    </TableCell>
                    <TableCell className='text-center border-r border-[#F1F1F1]'>
                      {el.totalInventory}
                    </TableCell>
                    <TableCell className='text-center'>
                      {el.averageRank.toFixed(1)}
                    </TableCell>
                    <TableCell className='text-center'>
                      {el.estTraffic}
                    </TableCell>
                    <TableCell className='text-center'>
                      {formatNumber(el.estImpressions)}
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              ))}

              <TableRow className='font-semibold bg-gray-100'>
                <TableCell>Total</TableCell>
                <TableCell className='text-center'>{totalSales}</TableCell>
                <TableCell className='text-center'>
                  {totalOutOfStock} %
                </TableCell>
                <TableCell className='text-center border-r border-[#F1F1F1]'>
                  {totalInventory}
                </TableCell>
                <TableCell className='text-center'>
                  {totalAverageRank.toFixed(1)}
                </TableCell>
                <TableCell className='text-center'>{totalTraffic}</TableCell>
                <TableCell className='text-center'>
                  {formatNumber(totalImpressions)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
