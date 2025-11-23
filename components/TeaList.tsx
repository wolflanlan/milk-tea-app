import React, { useState, useMemo } from 'react';
import { TeaRecord } from '../types';
import { Search, Calendar, Trash2, Edit2, Droplets, Snowflake, Settings } from 'lucide-react';

interface TeaListProps {
  records: TeaRecord[];
  onEdit: (record: TeaRecord) => void;
  onDelete: (id: string) => void;
  onManageBrands: () => void;
}

const TeaList: React.FC<TeaListProps> = ({ records, onEdit, onDelete, onManageBrands }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredRecords = useMemo(() => {
    return records
      .filter(record => 
        record.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
        record.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.createdAt - a.createdAt);
  }, [records, searchTerm]);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const calculateTotalSpent = () => {
    return records.reduce((sum, r) => sum + r.price, 0).toFixed(1);
  };

  if (records.length === 0) {
    return (
        <div className="flex flex-col h-full bg-milk-50">
             {/* Header even when empty to show settings */}
            <div className="bg-white p-4 shadow-sm z-10 sticky top-0 flex justify-between items-center">
                <h1 className="text-lg font-bold text-milk-900">奶茶手帐</h1>
                <button onClick={onManageBrands} className="text-milk-400 hover:text-milk-600 p-2 rounded-full hover:bg-milk-50">
                    <Settings size={20} />
                </button>
            </div>
            <div className="flex flex-col items-center justify-center flex-1 text-milk-400 p-8 text-center">
                <div className="w-24 h-24 bg-milk-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">🧋</span>
                </div>
                <h3 className="text-lg font-bold text-milk-600 mb-2">还没有记录</h3>
                <p className="text-sm">点击底部的 "+" 按钮记录第一杯奶茶吧！</p>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-milk-50">
        {/* Header Summary */}
        <div className="bg-white p-4 shadow-sm z-10 sticky top-0">
             <div className="flex justify-between items-center mb-3 pb-2 border-b border-milk-50">
                 <h1 className="text-lg font-bold text-milk-900">奶茶手帐</h1>
                 <button onClick={onManageBrands} className="text-milk-400 hover:text-milk-600 p-2 -mr-2 rounded-full hover:bg-milk-50">
                    <Settings size={20} />
                 </button>
             </div>

             <div className="flex justify-between items-end mb-4">
                <div>
                    <p className="text-xs text-milk-500 font-medium">累计消费</p>
                    <h2 className="text-2xl font-bold text-milk-800">¥{calculateTotalSpent()}</h2>
                </div>
                <div className="text-right">
                    <p className="text-xs text-milk-500 font-medium">累计杯数</p>
                    <h2 className="text-xl font-bold text-milk-800">{records.length} <span className="text-xs font-normal">杯</span></h2>
                </div>
             </div>
             
             {/* Search Bar */}
             <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-milk-400" size={18} />
                <input
                    type="text"
                    placeholder="搜索品牌或奶茶名称..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-milk-50 border border-milk-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-milk-300 text-milk-800 placeholder-milk-300"
                />
             </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
            {filteredRecords.map(record => (
                <div 
                    key={record.id} 
                    onClick={() => toggleExpand(record.id)}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-milk-100 active:bg-milk-50 transition-colors cursor-pointer"
                >
                    <div className="flex justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold text-white bg-milk-500 px-2 py-0.5 rounded-md">
                                    {record.brand}
                                </span>
                                <span className="text-xs text-milk-400 flex items-center gap-1">
                                    <Calendar size={10} /> {record.date}
                                </span>
                            </div>
                            <h3 className="font-bold text-milk-900 text-lg mb-1">{record.name}</h3>
                            <div className="flex gap-3 text-xs text-milk-500">
                                <span className="flex items-center gap-1"><Droplets size={10}/> {record.sugar}</span>
                                <span className="flex items-center gap-1"><Snowflake size={10}/> {record.ice}</span>
                            </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                            <span className="text-lg font-bold text-milk-800">¥{record.price}</span>
                            <div className="flex mt-1">
                                {[...Array(5)].map((_, i) => (
                                    <StarIcon key={i} filled={i < record.rating} size={12} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Expanded Content */}
                    {expandedId === record.id && (
                        <div className="mt-4 pt-4 border-t border-milk-50 animate-fade-in">
                            {record.note && (
                                <p className="text-sm text-milk-600 bg-milk-50 p-2 rounded-lg mb-3 italic">
                                    "{record.note}"
                                </p>
                            )}
                            <div className="flex justify-end gap-3">
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onDelete(record.id); }}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-red-500 bg-red-50 rounded-lg active:bg-red-100"
                                >
                                    <Trash2 size={14} /> 删除
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); onEdit(record); }}
                                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-milk-700 bg-milk-100 rounded-lg active:bg-milk-200"
                                >
                                    <Edit2 size={14} /> 编辑
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ))}
            
            {filteredRecords.length === 0 && searchTerm && (
                <div className="text-center py-8 text-milk-400 text-sm">
                    没有找到匹配的记录
                </div>
            )}
        </div>
    </div>
  );
};

const StarIcon: React.FC<{ filled: boolean; size: number }> = ({ filled, size }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill={filled ? "#cf9f58" : "none"} 
    stroke={filled ? "#cf9f58" : "#d6d3d1"} 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export default TeaList;