
import React, { useState } from 'react';
import { Buckets, GameState, GameEvent } from './types';
import { INITIAL_TOTAL, TOTAL_ROUNDS, EVENTS } from './constants';
import Jar from './components/Jar';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('SETUP');
  const [isPresentationMode, setIsPresentationMode] = useState(false);
  const [round, setRound] = useState(1);
  const [buckets, setBuckets] = useState<Buckets>({ spending: 0, saving: 0, sharing: 0 });
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [eventDelta, setEventDelta] = useState(0);
  const [adjustedBuckets, setAdjustedBuckets] = useState<Buckets>({ spending: 0, saving: 0, sharing: 0 });
  const [newTotal, setNewTotal] = useState(INITIAL_TOTAL);

  const currentSum = adjustedBuckets.spending + adjustedBuckets.saving + adjustedBuckets.sharing;
  const isSetupValid = currentSum === INITIAL_TOTAL;
  const isAdjustmentValid = currentSum === newTotal;

  const handleStartGame = () => {
    if (isPresentationMode) {
      const defaultBuckets = { 
        spending: 100, 
        saving: 80, 
        sharing: 20 
      };
      setBuckets(defaultBuckets);
      triggerEvent(1, defaultBuckets);
      setGameState('PLAYING');
    } else if (isSetupValid) {
      setBuckets(adjustedBuckets);
      triggerEvent(1, adjustedBuckets);
      setGameState('PLAYING');
    }
  };

  const triggerEvent = (currentRound: number, currentBuckets: Buckets) => {
    const randomEvent = EVENTS[Math.floor(Math.random() * EVENTS.length)];
    const result = randomEvent.impact(currentBuckets);
    
    const baselineBuckets = { ...currentBuckets };
    if (result.saving !== undefined) baselineBuckets.saving = result.saving;
    if (result.spending !== undefined) baselineBuckets.spending = result.spending;
    if (result.sharing !== undefined) baselineBuckets.sharing = result.sharing;

    const totalMoneyLeft = (currentBuckets.spending + currentBuckets.saving + currentBuckets.sharing) + result.totalImpact;
    
    if (isPresentationMode && result.saving === undefined && result.spending === undefined && result.sharing === undefined) {
      // Logic for presentation: auto-deduct from spending first, then saving
      if (result.totalImpact < 0) {
        const absImpact = Math.abs(result.totalImpact);
        if (baselineBuckets.spending >= absImpact) {
          baselineBuckets.spending -= absImpact;
        } else {
          const remaining = absImpact - baselineBuckets.spending;
          baselineBuckets.spending = 0;
          baselineBuckets.saving = Math.max(0, baselineBuckets.saving - remaining);
        }
      } else {
        baselineBuckets.spending += result.totalImpact;
      }
    }

    setCurrentEvent(randomEvent);
    setEventDelta(result.totalImpact);
    setNewTotal(totalMoneyLeft);
    setAdjustedBuckets(baselineBuckets);
  };

  const handleNextRound = () => {
    if (round < TOTAL_ROUNDS) {
      const nextR = round + 1;
      setRound(nextR);
      setBuckets(adjustedBuckets);
      triggerEvent(nextR, adjustedBuckets);
    } else {
      setBuckets(adjustedBuckets);
      setGameState('RESULT');
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val * 1000) + 'đ';
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center py-6 px-4 font-sans text-slate-900">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-black text-blue-900 tracking-tight drop-shadow-sm mb-1">
          FINANCIAL STRESS TEST
        </h1>
        <div className="inline-block bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">
          Phát triển kỹ năng tài chính
        </div>
      </header>

      <main className="w-full max-w-3xl bg-white rounded-[2.5rem] shadow-2xl p-6 md:p-10 border border-slate-200">
        
        {/* SCREEN 1: SETUP */}
        {gameState === 'SETUP' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-3xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-blue-900">Bạn là Người hướng dẫn?</h3>
                <p className="text-sm text-blue-700/80">Kích hoạt chế độ trình chiếu để bỏ qua bước nhập liệu và chỉ tập trung vào các tình huống.</p>
              </div>
              <button 
                onClick={() => setIsPresentationMode(!isPresentationMode)}
                className={`relative w-16 h-8 rounded-full transition-all duration-300 shadow-inner ${isPresentationMode ? 'bg-blue-600' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow transition-transform duration-300 ${isPresentationMode ? 'translate-x-8' : 'translate-x-0'}`} />
              </button>
            </div>

            {!isPresentationMode && (
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-extrabold text-slate-800">Lập Ngân Sách</h2>
                  <p className="text-slate-500 font-medium">Bạn có <span className="text-blue-600 font-bold">{formatCurrency(INITIAL_TOTAL)}</span> (200 đơn vị). Phân bổ vào 3 hũ:</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { key: 'spending' as keyof Buckets, label: 'Chi Tiêu', color: 'border-red-200 text-red-700 focus:ring-red-500', icon: '🛒' },
                    { key: 'saving' as keyof Buckets, label: 'Tiết Kiệm', color: 'border-green-200 text-green-700 focus:ring-green-500', icon: '🐷' },
                    { key: 'sharing' as keyof Buckets, label: 'Chia Sẻ', color: 'border-amber-200 text-amber-700 focus:ring-amber-500', icon: '🤝' }
                  ].map(field => (
                    <div key={field.key} className="space-y-2 group">
                      <label className="flex items-center text-sm font-bold uppercase tracking-wider text-slate-600">
                        <span className="mr-2 text-lg">{field.icon}</span> {field.label}
                      </label>
                      <div className="relative">
                        <input 
                          type="number" 
                          className={`w-full border-2 ${field.color} rounded-2xl p-4 text-xl font-bold bg-slate-50 outline-none transition-all group-hover:bg-white`}
                          placeholder="0"
                          value={adjustedBuckets[field.key] || ''}
                          onChange={(e) => setAdjustedBuckets({...adjustedBuckets, [field.key]: Number(e.target.value)})}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">k</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`text-xl font-black p-5 rounded-2xl w-full text-center transition-all ${isSetupValid ? 'bg-green-100 text-green-700 border-2 border-green-200' : 'bg-red-50 text-red-600 border-2 border-red-100'}`}>
                   {currentSum} / {INITIAL_TOTAL} k
                   <p className="text-xs font-medium mt-1 uppercase tracking-widest">
                    {isSetupValid ? 'Ngân sách hợp lệ' : `Còn thiếu/dư: ${INITIAL_TOTAL - currentSum}k`}
                   </p>
                </div>
              </div>
            )}

            <button 
              onClick={handleStartGame}
              disabled={!isPresentationMode && !isSetupValid}
              className={`w-full py-5 rounded-[1.5rem] font-black text-xl text-white shadow-xl transition-all active:scale-95 ${isPresentationMode || isSetupValid ? 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1' : 'bg-slate-300 cursor-not-allowed opacity-50'}`}
            >
              {isPresentationMode ? 'BẮT ĐẦU TRÌNH CHIẾU (5 VÒNG)' : 'BẮT ĐẦU THỬ THÁCH (5 VÒNG)'}
            </button>
          </div>
        )}

        {/* SCREEN 2: PLAYING */}
        {gameState === 'PLAYING' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-end">
                <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Tiến trình thử thách</span>
                <span className="text-sm font-bold text-slate-400">Vòng {round} / {TOTAL_ROUNDS}</span>
              </div>
              <div className="w-full bg-slate-100 h-4 rounded-full p-1 border border-slate-200">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-1000 shadow-sm" 
                  style={{ width: `${(round / TOTAL_ROUNDS) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className={`relative bg-gradient-to-r from-slate-900 to-slate-800 p-8 rounded-[2rem] shadow-2xl overflow-hidden ${isPresentationMode ? 'py-14' : ''}`}>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="text-8xl font-black italic">!</span>
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl text-2xl ${eventDelta >= 0 ? 'bg-green-500' : 'bg-red-500'}`}>
                    {eventDelta >= 0 ? '💰' : '📉'}
                  </div>
                  <h3 className="text-white font-black text-2xl uppercase tracking-tight">
                    {currentEvent?.title}
                  </h3>
                </div>
                <p className="text-slate-300 text-lg font-medium leading-snug">
                  {currentEvent?.description}
                </p>
                <div className={`inline-flex items-center px-4 py-2 rounded-2xl font-black text-2xl shadow-lg ${eventDelta >= 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                  {eventDelta >= 0 ? '+' : ''}{eventDelta}k
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              {/* Visual Jars */}
              <div className="space-y-4">
                <div className="flex gap-4 items-end">
                  <Jar label="Chi Tiêu" amount={adjustedBuckets.spending} color="bg-red-500" maxAmount={Math.max(newTotal, INITIAL_TOTAL)} />
                  <Jar label="Tiết Kiệm" amount={adjustedBuckets.saving} color="bg-green-500" maxAmount={Math.max(newTotal, INITIAL_TOTAL)} />
                  <Jar label="Chia Sẻ" amount={adjustedBuckets.sharing} color="bg-amber-500" maxAmount={Math.max(newTotal, INITIAL_TOTAL)} />
                </div>
                {isPresentationMode && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-dashed border-slate-300 text-center">
                    <p className="text-sm font-bold text-slate-500">Tổng tài sản hiện tại: <span className="text-blue-600 text-xl">{newTotal}k</span></p>
                  </div>
                )}
              </div>

              {/* Adjustment Controls */}
              {!isPresentationMode ? (
                <div className="space-y-4 bg-slate-50 p-6 rounded-3xl border border-slate-200">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <h4 className="text-slate-800 font-black text-sm uppercase">Cân đối lại ngân sách:</h4>
                    <span className="text-xs font-bold text-slate-400 tracking-tighter">Tổng cần có: {newTotal}k</span>
                  </div>
                  
                  <div className="space-y-5">
                    {[
                      { key: 'spending' as keyof Buckets, label: 'Chi Tiêu', color: 'accent-red-500', bg: 'bg-red-50' },
                      { key: 'saving' as keyof Buckets, label: 'Tiết Kiệm', color: 'accent-green-500', bg: 'bg-green-50' },
                      { key: 'sharing' as keyof Buckets, label: 'Chia Sẻ', color: 'accent-amber-500', bg: 'bg-amber-50' }
                    ].map((item) => (
                      <div key={item.key} className={`${item.bg} p-4 rounded-2xl space-y-2 shadow-sm`}>
                        <div className="flex justify-between items-center">
                          <label className="text-xs font-black text-slate-500 uppercase">{item.label}</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="number"
                              className="w-16 bg-white border border-slate-200 rounded-lg px-2 py-1 text-sm font-bold text-center outline-none focus:border-blue-500"
                              value={adjustedBuckets[item.key]}
                              onChange={(e) => setAdjustedBuckets({...adjustedBuckets, [item.key]: Number(e.target.value)})}
                            />
                            <span className="text-xs font-bold text-slate-400">k</span>
                          </div>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max={Math.max(newTotal, currentSum)} 
                          step="1"
                          className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${item.color} bg-slate-200`}
                          value={adjustedBuckets[item.key]}
                          onChange={(e) => setAdjustedBuckets({...adjustedBuckets, [item.key]: Number(e.target.value)})}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center h-full space-y-4">
                   <div className="p-6 bg-blue-50 border-2 border-blue-100 rounded-3xl text-center">
                      <p className="text-blue-800 font-bold italic">Chế độ trình chiếu đang tự động điều chỉnh các hũ tiền để minh họa tác động của tình huống.</p>
                   </div>
                </div>
              )}
            </div>

            <div className="flex flex-col items-center space-y-4 pt-4 border-t border-slate-100">
              {!isPresentationMode && (
                <div className={`text-xl font-black p-4 rounded-2xl w-full text-center transition-all ${isAdjustmentValid ? 'bg-green-500 text-white shadow-lg' : 'bg-red-50 text-red-600 border border-red-200'}`}>
                  CÂN ĐỐI: {currentSum} / {newTotal} k
                </div>
              )}
              <button 
                onClick={handleNextRound}
                disabled={!isPresentationMode && !isAdjustmentValid}
                className={`w-full py-5 rounded-2xl font-black text-xl text-white shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${isPresentationMode || isAdjustmentValid ? 'bg-blue-600 hover:bg-blue-700 hover:-translate-y-1' : 'bg-slate-300 cursor-not-allowed grayscale'}`}
              >
                {round < TOTAL_ROUNDS ? 'TÌNH HUỐNG TIẾP THEO' : 'XEM KẾT QUẢ CUỐI CÙNG'}
                <span>➜</span>
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 3: RESULT */}
        {gameState === 'RESULT' && (
          <div className="text-center space-y-8 animate-in zoom-in duration-500">
            <div className="space-y-2">
              <div className="text-6xl mb-4">🏆</div>
              <h2 className="text-4xl font-black text-slate-800 tracking-tighter">TỔNG KẾT</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Sau 5 vòng thử thách khắc nghiệt</p>
            </div>

            <div className="bg-slate-50 rounded-[2.5rem] p-10 border-2 border-slate-200 shadow-inner space-y-8">
              <div className="space-y-1">
                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Tài sản còn lại</span>
                <div className="text-6xl font-black text-blue-600 tracking-tighter">
                  {formatCurrency(buckets.spending + buckets.saving + buckets.sharing)}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-5 bg-white rounded-3xl shadow-sm border border-red-100">
                  <div className="text-[10px] font-black text-red-400 uppercase mb-2">Chi Tiêu</div>
                  <div className="text-lg font-black text-red-600">{buckets.spending}k</div>
                </div>
                <div className="p-5 bg-white rounded-3xl shadow-sm border border-green-100 scale-110 ring-4 ring-green-100">
                  <div className="text-[10px] font-black text-green-400 uppercase mb-2">Tiết Kiệm</div>
                  <div className="text-lg font-black text-green-600">{buckets.saving}k</div>
                </div>
                <div className="p-5 bg-white rounded-3xl shadow-sm border border-amber-100">
                  <div className="text-[10px] font-black text-amber-400 uppercase mb-2">Chia Sẻ</div>
                  <div className="text-lg font-black text-amber-600">{buckets.sharing}k</div>
                </div>
              </div>
            </div>

            <div className={`p-8 rounded-[2rem] border-4 ${buckets.saving > 40 ? 'bg-green-50 border-green-200 text-green-900' : 'bg-red-50 border-red-200 text-red-900'}`}>
              <h3 className="text-2xl font-black mb-3 italic">
                {buckets.saving > 40 ? 'XUẤT SẮC!' : 'CẢNH BÁO RỦI RO!'}
              </h3>
              <p className="font-bold text-lg leading-snug">
                {buckets.saving > 40 
                  ? 'Bạn là một nhà quản lý tài chính tài ba. Với hơn 40k tiết kiệm, bạn hoàn toàn có thể đối mặt với những biến cố lớn hơn nữa!'
                  : 'Quỹ tiết kiệm của bạn đã xuống mức báo động. Trong đời thực, điều này có nghĩa là bạn đang đứng trước rủi ro nợ nần nếu có thêm bất kỳ sự cố nào xảy ra.'}
              </p>
            </div>

            <button 
              onClick={() => {
                setGameState('SETUP');
                setRound(1);
                setAdjustedBuckets({ spending: 0, saving: 0, sharing: 0 });
              }}
              className="px-10 py-5 bg-slate-900 text-white font-black text-xl rounded-2xl hover:bg-black transition-all shadow-xl active:scale-95"
            >
              THIẾT LẬP LẠI THỬ THÁCH
            </button>
          </div>
        )}
      </main>

      <footer className="mt-8 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
        Financial Literacy Training Tool &bull; 2024
      </footer>
    </div>
  );
};

export default App;
