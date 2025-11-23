
import React, { useMemo } from 'react';
import { TeaRecord } from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';

interface StatsProps {
  records: TeaRecord[];
}

const COLORS = ['#cf9f58', '#b68145', '#926338', '#785132', '#d9bb7f', '#e4d2a8', '#f7f3e8'];

const Stats: React.FC<StatsProps> = ({ records }) => {
  
  const brandStats = useMemo(() => {
    const stats: Record<string, number> = {};
    records.forEach(r => {
      stats[r.brand] = (stats[r.brand] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5
  }, [records]);

  const weeklyStats = useMemo(() => {
    const weeks: Record<string, { 
      count: number; 
      amount: number; 
      startDate: Date 
    }> = {};

    records.forEach(r => {
      const d = new Date(r.date);
      // Adjust to get Monday of the week
      const day = d.getDay() || 7; // 1 (Mon) to 7 (Sun)
      const monday = new Date(d);
      monday.setDate(d.getDate() - day + 1);
      
      const key = monday.toISOString().split('T')[0]; // YYYY-MM-DD of Monday
      
      if (!weeks[key]) {
        weeks[key] = { count: 0, amount: 0, startDate: monday };
      }
      
      weeks[key].count += 1;
      weeks[key].amount += r.price;
    });

    // Convert to array
    return Object.entries(weeks).map(([key, data]) => {
      const endDate = new Date(data.startDate);
      endDate.setDate(endDate.getDate() + 6);

      const format = (d: Date) => `${d.getMonth() + 1}.${d.getDate()}`;
      const label = `${format(data.startDate)}-${format(endDate)}`;

      return {
        key,
        label,
        count: data.count,
        amount: data.amount
      };
    }).sort((a, b) => a.key.localeCompare(b.key));
  }, [records]);

  const priceTrend = useMemo(() => {
      // Group by month
      const stats: Record<string, number> = {};
      records.forEach(r => {
          const month = r.date.substring(5, 7) + '月';
          stats[month] = (stats[month] || 0) + r.price;
      });
       return Object.entries(stats)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => parseInt(a.name) - parseInt(b.name));
  }, [records]);

  const sugarStats = useMemo(() => {
    const stats: Record<string, number> = {};
    records.forEach(r => {
      stats[r.sugar] = (stats[r.sugar] || 0) + 1;
    });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [records]);

  const avgPrice = useMemo(() => {
      if (records.length === 0) return 0;
      const total = records.reduce((acc, cur) => acc + cur.price, 0);
      return (total / records.length).toFixed(1);
  }, [records]);

  if (records.length === 0) {
      return (
          <div className="flex items-center justify-center h-full text-milk-400">
              <p>暂无数据，快去记录吧！</p>
          </div>
      );
  }

  return (
    <div className="h-full overflow-y-auto bg-milk-50 p-4 space-y-4 pb-24">
      <h2 className="text-xl font-bold text-milk-900 mb-2">消费分析</h2>
      
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-milk-100">
              <p className="text-xs text-milk-500 mb-1">累计消费</p>
              <h3 className="text-xl font-bold text-milk-800">¥{records.reduce((a,b) => a + b.price, 0).toFixed(1)}</h3>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-milk-100">
              <p className="text-xs text-milk-500 mb-1">平均单价</p>
              <h3 className="text-xl font-bold text-milk-800">¥{avgPrice}</h3>
          </div>
      </div>

      {/* Weekly Stats Section */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-milk-100">
        <h3 className="text-sm font-bold text-milk-600 mb-4">周度消费记录</h3>
        
        {/* Weekly Chart */}
        <div className="h-48 w-full mb-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyStats.slice(-8)}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f7f3e8" />
                    <XAxis dataKey="label" tick={{fontSize: 10, fill: '#b68145'}} axisLine={false} tickLine={false} interval={0} />
                    <YAxis orientation="left" tick={{fontSize: 10, fill: '#cf9f58'}} axisLine={false} tickLine={false} unit="¥" width={30} />
                    <Tooltip 
                        cursor={{fill: '#fdfbf7'}}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        labelStyle={{ color: '#926338', marginBottom: '0.2rem' }}
                    />
                    <Bar dataKey="amount" name="消费金额" fill="#cf9f58" radius={[4, 4, 0, 0]} barSize={16} />
                </BarChart>
            </ResponsiveContainer>
        </div>

        {/* Weekly List */}
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
            {weeklyStats.slice().reverse().map(stat => (
                <div key={stat.key} className="flex items-center justify-between p-3 bg-milk-50 rounded-xl border border-milk-100">
                    <span className="font-bold text-milk-900 text-sm">{stat.label}</span>
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-milk-800">¥{stat.amount.toFixed(1)}</span>
                        <span className="text-xs text-milk-500 bg-white px-2 py-1 rounded-lg border border-milk-100 shadow-sm min-w-[40px] text-center">
                            {stat.count} 杯
                        </span>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* Top Brands Card */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-milk-100">
        <h3 className="text-sm font-bold text-milk-600 mb-4">品牌偏好 (Top 5)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={brandStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {brandStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#785132' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-2">
            {brandStats.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1 text-xs text-milk-700">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    {entry.name} ({entry.value})
                </div>
            ))}
        </div>
      </div>

      {/* Monthly Spending */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-milk-100">
        <h3 className="text-sm font-bold text-milk-600 mb-4">月度消费趋势</h3>
        <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priceTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f7f3e8" />
                    <XAxis dataKey="name" tick={{fontSize: 12, fill: '#b68145'}} axisLine={false} tickLine={false} />
                    <YAxis tick={{fontSize: 12, fill: '#b68145'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                        cursor={{fill: '#fdfbf7'}}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" name="消费金额" fill="#cf9f58" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

       {/* Sugar Preference */}
       <div className="bg-white p-4 rounded-2xl shadow-sm border border-milk-100">
        <h3 className="text-sm font-bold text-milk-600 mb-2">糖度偏好</h3>
        <div className="space-y-2">
            {sugarStats.map((stat, idx) => (
                <div key={stat.name} className="flex items-center text-sm">
                    <span className="w-16 text-milk-500">{stat.name}</span>
                    <div className="flex-1 h-3 bg-milk-100 rounded-full overflow-hidden mx-2">
                        <div 
                            className="h-full bg-milk-400 rounded-full" 
                            style={{ width: `${(stat.value / records.length) * 100}%` }}
                        ></div>
                    </div>
                    <span className="w-8 text-right text-milk-700">{stat.value}</span>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;
