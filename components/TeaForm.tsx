
import React, { useState, useEffect } from 'react';
import { TeaRecord, BrandConfig, SugarLevel, IceLevel } from '../types';
import { SUGAR_OPTIONS, ICE_OPTIONS } from '../constants';
import Button from './Button';
import { generateId } from '../services/storage';
import { Star, X } from 'lucide-react';

interface TeaFormProps {
  initialData?: TeaRecord | null;
  availableBrands: BrandConfig[];
  onSave: (record: TeaRecord, newBrand?: string) => void;
  onCancel: () => void;
}

const TeaForm: React.FC<TeaFormProps> = ({ initialData, availableBrands, onSave, onCancel }) => {
  const [brand, setBrand] = useState('');
  const [customBrand, setCustomBrand] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sugar, setSugar] = useState<string>(SugarLevel.Five);
  const [ice, setIce] = useState<string>(IceLevel.Less);
  const [rating, setRating] = useState(4);
  const [note, setNote] = useState('');
  const [isCustomBrand, setIsCustomBrand] = useState(false);

  // Filter only visible brands for selection
  const visibleBrands = availableBrands.filter(b => b.visible);

  useEffect(() => {
    if (initialData) {
      setBrand(initialData.brand);
      // If the initial brand is not in our VISIBLE list, check if it's hidden or completely custom
      const knownBrand = availableBrands.find(b => b.name === initialData.brand);
      
      if (!knownBrand || !knownBrand.visible) {
        // It's either hidden or custom. 
        // If it's hidden, we technically could select the button if we showed hidden ones, 
        // but simple approach: treat as custom input mode for editing clarity
        setIsCustomBrand(true);
        setCustomBrand(initialData.brand);
      } else {
        setIsCustomBrand(false);
      }

      setName(initialData.name);
      setPrice(initialData.price.toString());
      setDate(initialData.date);
      setSugar(initialData.sugar);
      setIce(initialData.ice);
      setRating(initialData.rating);
      setNote(initialData.note || '');
    }
  }, [initialData, availableBrands]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let finalBrand = isCustomBrand ? customBrand.trim() : brand;
    
    if (!finalBrand || !name || !price) {
        alert('请填写完整的品牌、名称和价格');
        return;
    }

    const record: TeaRecord = {
      id: initialData?.id || generateId(),
      brand: finalBrand,
      name,
      price: parseFloat(price),
      date,
      sugar,
      ice,
      rating,
      note,
      createdAt: initialData?.createdAt || Date.now()
    };

    // Check if this is a truly new brand that needs to be added to the list
    const brandExists = availableBrands.some(b => b.name === finalBrand);
    const newBrandToAdd = (isCustomBrand && !brandExists) ? finalBrand : undefined;

    onSave(record, newBrandToAdd);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-milk-100">
        <h2 className="text-lg font-bold text-milk-900">
            {initialData ? '编辑记录' : '记一杯'}
        </h2>
        <button onClick={onCancel} className="p-2 rounded-full hover:bg-milk-50 text-milk-600">
            <X size={24} />
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Brand Selection */}
        <div className="space-y-2">
            <label className="text-sm font-medium text-milk-700">品牌</label>
            <div className="flex flex-wrap gap-2">
                {visibleBrands.map(b => (
                    <button
                        key={b.name}
                        type="button"
                        onClick={() => { setBrand(b.name); setIsCustomBrand(false); }}
                        className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                            !isCustomBrand && brand === b.name
                            ? 'bg-milk-600 text-white border-milk-600 shadow-sm' 
                            : 'bg-white text-milk-800 border-milk-200 hover:border-milk-400'
                        }`}
                    >
                        {b.name}
                    </button>
                ))}
                <button
                    type="button"
                    onClick={() => setIsCustomBrand(true)}
                    className={`px-3 py-1.5 text-sm rounded-lg border transition-all ${
                        isCustomBrand
                        ? 'bg-milk-600 text-white border-milk-600 shadow-sm' 
                        : 'bg-white text-milk-800 border-milk-200 hover:border-milk-400'
                    }`}
                >
                    其他/手输
                </button>
            </div>
            {isCustomBrand && (
                <div className="mt-2">
                    <input
                        type="text"
                        value={customBrand}
                        onChange={(e) => setCustomBrand(e.target.value)}
                        placeholder="输入品牌名称"
                        className="w-full p-3 rounded-xl bg-milk-50 border border-milk-200 focus:outline-none focus:ring-2 focus:ring-milk-400 text-milk-900"
                    />
                    <p className="text-xs text-milk-400 mt-1 ml-1">保存后将自动添加到品牌列表</p>
                </div>
            )}
        </div>

        {/* Name & Price */}
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-milk-700">名称</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="例如：杨枝甘露"
                    className="w-full p-3 rounded-xl bg-milk-50 border border-milk-200 focus:outline-none focus:ring-2 focus:ring-milk-400 text-milk-900"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-milk-700">价格 (元)</label>
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    step="0.1"
                    className="w-full p-3 rounded-xl bg-milk-50 border border-milk-200 focus:outline-none focus:ring-2 focus:ring-milk-400 text-milk-900"
                />
            </div>
        </div>

        {/* Date */}
        <div className="space-y-2">
            <label className="text-sm font-medium text-milk-700">日期</label>
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 rounded-xl bg-milk-50 border border-milk-200 focus:outline-none focus:ring-2 focus:ring-milk-400 text-milk-900"
            />
        </div>

        {/* Customizations */}
        <div className="grid grid-cols-1 gap-4">
             <div className="space-y-2">
                <label className="text-sm font-medium text-milk-700">糖度</label>
                <div className="flex flex-wrap gap-2">
                    {SUGAR_OPTIONS.map(opt => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => setSugar(opt)}
                            className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                                sugar === opt 
                                ? 'bg-milk-200 text-milk-900 border-milk-300 font-bold' 
                                : 'bg-transparent text-milk-600 border-milk-200'
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-milk-700">温度</label>
                <div className="flex flex-wrap gap-2">
                    {ICE_OPTIONS.map(opt => (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => setIce(opt)}
                            className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                                ice === opt 
                                ? 'bg-blue-50 text-blue-900 border-blue-200 font-bold' 
                                : 'bg-transparent text-milk-600 border-milk-200'
                            }`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Rating */}
        <div className="space-y-2">
            <label className="text-sm font-medium text-milk-700">评分</label>
            <div className="flex gap-4 items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none transform active:scale-110 transition-transform"
                    >
                        <Star 
                            size={32} 
                            fill={star <= rating ? "#cf9f58" : "none"} 
                            color={star <= rating ? "#cf9f58" : "#d6d3d1"}
                            strokeWidth={2}
                        />
                    </button>
                ))}
                <span className="text-milk-600 text-sm ml-2 font-medium">
                    {rating === 5 ? '好喝到爆！' : rating === 4 ? '很不错' : rating === 3 ? '普通' : '避雷'}
                </span>
            </div>
        </div>

        {/* Note */}
        <div className="space-y-2 pb-20">
            <label className="text-sm font-medium text-milk-700">备注</label>
            <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="记录一下此时的心情或口味..."
                rows={3}
                className="w-full p-3 rounded-xl bg-milk-50 border border-milk-200 focus:outline-none focus:ring-2 focus:ring-milk-400 text-milk-900 resize-none"
            />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-milk-100 bg-white sticky bottom-0 z-10">
        <Button onClick={handleSubmit} fullWidth size="lg">
            保存记录
        </Button>
      </div>
    </div>
  );
};

export default TeaForm;
