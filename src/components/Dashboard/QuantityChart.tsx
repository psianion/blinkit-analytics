import { CircleHelp } from 'lucide-react';
import Divider from '../Divider';
import { HiOutlineArrowUp } from 'react-icons/hi';
import {
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  ComposedChart
} from 'recharts';
import { curveCardinal } from 'd3-shape';
import { useEffect, useState } from 'react';
import initConfig from '@/assets/init.json';
import { sendQuery } from '@/utils/FetchUtils';

type SalesData = {
  'blinkit_insights_sku.created_at.day': string;
  'blinkit_insights_sku.created_at': string;
  'blinkit_insights_sku.qty_sold': string;
  'time.day': string;
};
type ChartData = {
  value: number;
  lastValue: number;
  date: string;
};

type ResultData = {
  query: {
    measures: ['blinkit_insights_sku.qty_sold'];
    timeDimensions: [
      {
        dimension: 'blinkit_insights_sku.created_at';
        granularity: 'day';
        dateRange: string[];
      }
    ];
  };
  data: SalesData[];
  lastRefreshTime: string;
  annotation: {
    measures: {
      'blinkit_insights_sku.qty_sold': {
        title: string;
        shortTitle: string;
        type: string;
        meta: {
          format: string;
          metricCategory: string;
        };
        drillMembers: string[];
        drillMembersGrouped: {
          measures: string[];
          dimensions: string[];
        };
      };
    };
    dimensions: object;
    segments: object;
    timeDimensions: {
      'blinkit_insights_sku.created_at.day': {
        title: string;
        shortTitle: string;
        type: string;
        granularity: {
          name: string;
          title: string;
          interval: string;
        };
      };
      'blinkit_insights_sku.created_at': {
        title: string;
        shortTitle: string;
        type: string;
      };
    };
    dataSource: string;
    dbType: string;
    extDbType: string;
    external: boolean;
    slowQuery: boolean;
    total: number | null;
  };
};

const processSalesData = (data: ResultData[]): ChartData[] => {
  return data[1].data.map((item: SalesData, index: number) => ({
    value: Number(item['blinkit_insights_sku.qty_sold']),
    lastValue: Number(
      data[0]?.data[index]?.['blinkit_insights_sku.qty_sold'] ?? 0
    ),
    date: new Date(item['blinkit_insights_sku.created_at']).toLocaleDateString(
      'en-US',
      { day: 'numeric' }
    )
  }));
};

const QuantityChart = () => {
  const [loading, setLoading] = useState(false);
  const [totalSales, setTotalSales] = useState(0);
  const [lastMonthTotalSales, setLastMonthTotalSales] = useState(0);
  const [change, setChange] = useState(0);
  const [data, setData] = useState<ChartData[]>([]);

  const fetchSalesData = async () => {
    setLoading(true);
    try {
      const cardConfig = initConfig.cards.find(
        (card: any) => card.id === 'blinkit-insights-sku-qty_sold'
      );

      if (!cardConfig || !cardConfig.query) {
        console.error('Card config or query not found');
        return;
      }

      const queryObject = JSON.parse(cardConfig.query);

      const response = await sendQuery(queryObject);
      const processedData = processSalesData(response);
      setData(processedData);
      const total = processedData.reduce((sum, item) => sum + item.value, 0);
      const lastTotal = processedData.reduce(
        (sum, item) => sum + item.lastValue,
        0
      );

      setTotalSales(Number((total / 100000).toFixed(1)));
      setLastMonthTotalSales(Number((lastTotal / 100000).toFixed(1)));
      setChange(Number((((total - lastTotal) / lastTotal) * 100).toFixed(1)));
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  return (
    <div className='flex-1 h-[292px] bg-white border border-solid border-[#EBEBEB] rounded-[12px]'>
      <div className='w-full px-3 flex items-center justify-between h-[44px]'>
        <p className='font-semibold text-[14px] text-[#515153]'>
          Total Quantity Sold
        </p>
        <CircleHelp size={16} />
      </div>
      <Divider />
      <div className='flex flex-col items-center justify-between w-full h-[208px] p-3'>
        <div className='w-full flex items-center justify-between h-[36px]'>
          <h2 className='text-[24px] text-[#031B15] font-bold'>
            {totalSales} L
          </h2>
          <div className='flex flex-col items-end'>
            <p className='text-[15px] text-[#1D874F] font-bold leading-4 flex items-center gap-1'>
              <HiOutlineArrowUp /> {change} %
            </p>
            <p className='text-[13px] text-[#031B15]/60 font-regular leading-4'>
              vs {lastMonthTotalSales} L last month
            </p>
          </div>
        </div>
        <ResponsiveContainer width='100%' height='100%'>
          <ComposedChart
            data={data}
            margin={{ top: -10, right: 0, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id='greenGradient' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#2EB76F' stopOpacity={1} />
                <stop offset='100%' stopColor='#2EB76F' stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tick={{
                fontFamily: 'Mulish',
                fontSize: 12,
                fontWeight: '500',
                color: '#6B7583'
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              ticks={[(totalSales * 100000) / 60, (totalSales * 100000) / 30]}
              tickFormatter={(value) => `${(value / 1000).toFixed(1)}K`}
              tickCount={4}
              tick={{
                fontFamily: 'Mulish',
                fontSize: 12,
                fontWeight: '500',
                color: '#8C9198'
              }}
            />
            <CartesianGrid
              horizontal={true}
              vertical={false}
              stroke='#EDEDED'
            />
            <Area
              type={curveCardinal.tension(0.6)}
              dataKey='value'
              strokeWidth={1.5}
              stroke='#22c55e'
              fill='url(#greenGradient)'
              fillOpacity={0.2}
            />
            <Line
              type={curveCardinal.tension(0.8)}
              dataKey='lastValue'
              strokeDasharray='4 4 '
              stroke='#f97316'
              strokeWidth={1.5}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <Divider />
      <div className='flex h-[36px] items-center p-3 gap-4'>
        <div className='flex items-center gap-2'>
          <div className='w-[6px] h-[6px] bg-[#1D874F] rounded-full' />
          <p className='text-[13px] text-[#7D7D7E]/60 font-regular leading-4'>
            This Month
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-[6px] h-[6px] bg-[#E25D33] rounded-full' />
          <p className='text-[13px] text-[#7D7D7E]/60 font-regular leading-4'>
            Last Month
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuantityChart;
