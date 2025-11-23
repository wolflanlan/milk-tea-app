
import React, { useState, useEffect } from 'react';
import { TeaRecord, ViewMode, BrandConfig } from './types';
import { getRecords, saveRecords, getStoredBrands, saveStoredBrands } from './services/storage';
import TeaList from './components/TeaList';
import TeaForm from './components/TeaForm';
import Stats from './components/Stats';
import BrandManager from './components/BrandManager';
import { PlusCircle, List, PieChart } from 'lucide-react';

function App() {
  const [records, setRecords] = useState<TeaRecord[]>([]);
  const [brands, setBrands] = useState<BrandConfig[]>([]);
  const [view, setView] = useState<ViewMode>('list');
  const [editingRecord, setEditingRecord] = useState<TeaRecord | null>(null);

  // Load initial data
  useEffect(() => {
    setRecords(getRecords());
    setBrands(getStoredBrands());
  }, []);

  // Save whenever records change
  useEffect(() => {
    saveRecords(records);
  }, [records]);

  const handleSaveRecord = (record: TeaRecord, newBrandName?: string) => {
    if (editingRecord) {
      // Update existing
      setRecords(prev => prev.map(r => r.id === record.id ? record : r));
    } else {
      // Add new
      setRecords(prev => [record, ...prev]);
    }

    // If a new brand was used, add it to the list automatically
    if (newBrandName) {
        setBrands(prev => {
            const updated = [...prev, { name: newBrandName, visible: true }];
            saveStoredBrands(updated);
            return updated;
        });
    }

    setView('list');
    setEditingRecord(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      setRecords(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleEdit = (record: TeaRecord) => {
    setEditingRecord(record);
    setView('edit');
  };

  const handleAddNew = () => {
    setEditingRecord(null);
    setView('add');
  };
  
  const handleBrandUpdate = (newBrands: BrandConfig[]) => {
      setBrands(newBrands);
      saveStoredBrands(newBrands);
  };

  // Mobile Bottom Navigation
  const NavItem = ({ mode, icon: Icon, label }: { mode: ViewMode, icon: any, label: string }) => {
    const isActive = view === mode && !editingRecord && mode !== 'add';
    const colorClass = isActive ? 'text-milk-600' : 'text-milk-400';
    
    return (
        <button 
            onClick={() => {
                if(mode === 'add') {
                    handleAddNew();
                } else {
                    setView(mode); 
                    setEditingRecord(null);
                }
            }}
            className={`flex flex-col items-center justify-center w-full py-1 ${colorClass}`}
        >
            <Icon size={mode === 'add' ? 32 : 24} className={mode === 'add' ? 'text-milk-500 mb-1' : 'mb-0.5'} />
            <span className={`text-[10px] font-medium ${mode === 'add' ? 'text-milk-600' : ''}`}>{label}</span>
        </button>
    );
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-milk-50 flex flex-col shadow-2xl relative overflow-hidden">
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {(view === 'add' || view === 'edit') ? (
            <div className="absolute inset-0 z-20 bg-white animate-slide-up">
                <TeaForm 
                    initialData={editingRecord}
                    availableBrands={brands}
                    onSave={handleSaveRecord}
                    onCancel={() => {
                        setView('list');
                        setEditingRecord(null);
                    }}
                />
            </div>
        ) : view === 'brands' ? (
            <div className="absolute inset-0 z-20 bg-white animate-slide-up">
                <BrandManager 
                    brands={brands}
                    onUpdate={handleBrandUpdate}
                    onClose={() => setView('list')}
                />
            </div>
        ) : (
            <>
                {view === 'list' && (
                    <TeaList 
                        records={records} 
                        onEdit={handleEdit} 
                        onDelete={handleDelete}
                        onManageBrands={() => setView('brands')}
                    />
                )}
                {view === 'stats' && <Stats records={records} />}
            </>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      {view !== 'add' && view !== 'edit' && view !== 'brands' && (
        <div className="h-[80px] bg-white border-t border-milk-200 flex items-start pt-3 justify-around pb-safe z-10 px-6">
            <NavItem mode="list" icon={List} label="记录" />
            
            {/* Floating ADD Button effect within Nav */}
            <div className="relative -top-6">
                <button 
                    onClick={handleAddNew}
                    className="w-14 h-14 bg-milk-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-milk-50 active:scale-95 transition-transform"
                >
                    <PlusCircle size={32} />
                </button>
            </div>

            <NavItem mode="stats" icon={PieChart} label="统计" />
        </div>
      )}

      <style>{`
        @keyframes slide-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
        }
        .animate-slide-up {
            animation: slide-up 0.3s ease-out forwards;
        }
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.2s ease-out forwards;
        }
        /* Safe area for iPhone home indicator */
        .pb-safe {
            padding-bottom: env(safe-area-inset-bottom, 20px);
        }
      `}</style>
    </div>
  );
}

export default App;
