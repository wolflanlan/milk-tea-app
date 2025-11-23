
import React, { useState } from 'react';
import { Plus, RotateCcw, ArrowLeft, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react';
import Button from './Button';
import { BrandConfig } from '../types';
import { POPULAR_BRANDS } from '../constants';

interface BrandManagerProps {
    brands: BrandConfig[];
    onUpdate: (brands: BrandConfig[]) => void;
    onClose: () => void;
}

const BrandManager: React.FC<BrandManagerProps> = ({ brands, onUpdate, onClose }) => {
    const [newBrand, setNewBrand] = useState('');

    const handleAdd = () => {
        const trimmed = newBrand.trim();
        if (trimmed && !brands.some(b => b.name === trimmed)) {
            onUpdate([...brands, { name: trimmed, visible: true }]);
            setNewBrand('');
        } else if (brands.some(b => b.name === trimmed)) {
            alert('该品牌已存在');
        }
    };

    const handleToggleVisibility = (index: number) => {
        const newBrands = [...brands];
        newBrands[index].visible = !newBrands[index].visible;
        onUpdate(newBrands);
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === brands.length - 1) return;

        const newBrands = [...brands];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        // Swap
        [newBrands[index], newBrands[targetIndex]] = [newBrands[targetIndex], newBrands[index]];
        onUpdate(newBrands);
    };

    const handleReset = () => {
        if(window.confirm('确定要恢复默认品牌列表吗？所有自定义排序和隐藏设置将重置。')) {
            onUpdate(POPULAR_BRANDS.map(b => ({ name: b, visible: true })));
        }
    }

    return (
        <div className="flex flex-col h-full bg-white">
             <div className="flex items-center justify-between px-4 py-3 border-b border-milk-100">
                <button onClick={onClose} className="p-2 -ml-2 rounded-full hover:bg-milk-50 text-milk-600">
                    <ArrowLeft size={24} />
                </button>
                <h2 className="text-lg font-bold text-milk-900">品牌管理</h2>
                <div className="w-10"></div> {/* Spacer */}
            </div>

            <div className="p-4 flex-1 overflow-y-auto pb-20">
                <p className="text-sm text-milk-500 mb-4">管理记录页面可见的品牌。隐藏不常喝的品牌，或拖动排序。</p>

                {/* Add New */}
                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        value={newBrand}
                        onChange={(e) => setNewBrand(e.target.value)}
                        placeholder="添加新品牌..."
                        className="flex-1 p-3 rounded-xl bg-milk-50 border border-milk-200 focus:outline-none focus:ring-2 focus:ring-milk-400 text-milk-900"
                        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                    />
                    <button
                        onClick={handleAdd}
                        disabled={!newBrand.trim()}
                        className="bg-milk-600 text-white px-4 rounded-xl disabled:opacity-50 hover:bg-milk-700 transition-colors"
                    >
                        <Plus size={24} />
                    </button>
                </div>

                {/* List */}
                <div className="space-y-2">
                    {brands.map((brand, index) => (
                        <div key={brand.name} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${brand.visible ? 'bg-white border-milk-100' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
                            
                            <div className="flex items-center gap-3 flex-1">
                                <button 
                                    onClick={() => handleToggleVisibility(index)}
                                    className={`p-2 rounded-lg ${brand.visible ? 'text-milk-600 bg-milk-50' : 'text-gray-400 bg-gray-100'}`}
                                >
                                    {brand.visible ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                                <span className={`font-medium ${brand.visible ? 'text-milk-900' : 'text-gray-500'}`}>
                                    {brand.name}
                                </span>
                            </div>

                            <div className="flex items-center gap-1">
                                <div className="flex flex-col gap-1">
                                    <button 
                                        onClick={() => handleMove(index, 'up')}
                                        disabled={index === 0}
                                        className="p-1 text-milk-400 hover:text-milk-600 disabled:opacity-30"
                                    >
                                        <ArrowUp size={16} />
                                    </button>
                                    <button 
                                        onClick={() => handleMove(index, 'down')}
                                        disabled={index === brands.length - 1}
                                        className="p-1 text-milk-400 hover:text-milk-600 disabled:opacity-30"
                                    >
                                        <ArrowDown size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 pt-4 border-t border-milk-50">
                    <Button variant="ghost" fullWidth onClick={handleReset} className="flex items-center justify-center gap-2 text-xs text-milk-400">
                        <RotateCcw size={14} />
                        恢复默认设置
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default BrandManager;
