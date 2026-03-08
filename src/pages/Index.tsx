import { useState } from 'react';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { ArrowRightLeft, Share2, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { gregorianToLunar, lunarToGregorian, getFutureLunarBirthdays, type LunarResult } from '@/lib/lunar-utils';
import ResultCard from '@/components/ResultCard';
import FutureBirthdaysTable from '@/components/FutureBirthdaysTable';
import ShareCard from '@/components/ShareCard';
import heroBg from '@/assets/hero-bg.jpg';

const LUNAR_MONTHS = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '臘月'];
const LUNAR_DAYS = [
  '初一','初二','初三','初四','初五','初六','初七','初八','初九','初十',
  '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
  '廿一','廿二','廿三','廿四','廿五','廿六','廿七','廿八','廿九','三十',
];

const Index = () => {
  const [gregorianDate, setGregorianDate] = useState<Date | undefined>();
  const [gregorianInput, setGregorianInput] = useState('');
  const [lunarYear, setLunarYear] = useState('');
  const [lunarMonth, setLunarMonth] = useState('');
  const [lunarDay, setLunarDay] = useState('');
  const [isLeapMonth, setIsLeapMonth] = useState(false);
  const [result, setResult] = useState<LunarResult | null>(null);
  const [error, setError] = useState('');
  const [showShare, setShowShare] = useState(false);
  const [activeTab, setActiveTab] = useState('gregorian');

  const handleGregorianConvert = () => {
    setError('');
    setResult(null);
    try {
      const parts = gregorianInput.split('-');
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      if (isNaN(date.getTime())) {
        setError('請輸入有效的日期格式');
        return;
      }
      if (date.getFullYear() < 1900 || date.getFullYear() > 2100) {
        setError('僅支援 1900-2100 年的日期');
        return;
      }
      setResult(gregorianToLunar(date));
    } catch {
      setError('轉換失敗，請確認日期格式正確');
    }
  };

  const handleLunarConvert = () => {
    setError('');
    setResult(null);
    try {
      const y = parseInt(lunarYear);
      const m = parseInt(lunarMonth);
      const d = parseInt(lunarDay);
      if (!y || !m || !d) {
        setError('請完整填寫農曆年月日');
        return;
      }
      if (y < 1900 || y > 2100) {
        setError('僅支援 1900-2100 年的日期');
        return;
      }
      setResult(lunarToGregorian(y, m, d, isLeapMonth));
    } catch {
      setError('轉換失敗，該農曆日期可能不存在');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (activeTab === 'gregorian') handleGregorianConvert();
      else handleLunarConvert();
    }
  };

  const futureBirthdays = result
    ? getFutureLunarBirthdays(result.lunarMonthNum, result.lunarDayNum, result.isLeapMonth)
    : [];


  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Hero background */}
      <div className="absolute inset-0 z-0">
        <img src={heroBg} alt="中國風背景" className="w-full h-[420px] object-cover object-top" />
        <div className="absolute inset-0 h-[420px] bg-gradient-to-b from-transparent via-transparent to-background" />
      </div>

      {/* Hero */}
      <header className="relative z-10 pt-20 pb-12 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-bold font-serif-tc text-chinese-ink mb-3 drop-shadow-sm">
          農曆生日轉換器
        </h1>
        <p className="text-lg text-chinese-ink/70 max-w-md mx-auto font-medium">
          國曆農曆雙向轉換 · 生肖星座 · 天干地支
        </p>
      </header>

      {/* Main converter */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 pb-20">
        <div className="bg-card rounded-2xl shadow-lantern border border-gold p-6 md:p-8 mb-8">
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setResult(null); setError(''); }} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted">
              <TabsTrigger value="gregorian" className="font-serif-tc text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                📅 國曆 → 農曆
              </TabsTrigger>
              <TabsTrigger value="lunar" className="font-serif-tc text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                🏮 農曆 → 國曆
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gregorian">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">輸入國曆日期</label>
                  <div className="flex gap-3">
                    <Input
                      type="date"
                      value={gregorianInput}
                      onChange={(e) => setGregorianInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 text-lg h-12 border-gold bg-background"
                      min="1900-01-01"
                      max="2100-12-31"
                    />
                    <Button onClick={handleGregorianConvert} className="h-12 px-6 bg-gradient-red text-primary-foreground hover:opacity-90 font-serif-tc text-base">
                      <ArrowRightLeft className="w-4 h-4 mr-2" />
                      轉換
                    </Button>
                  </div>
                </div>
                {error && <p className="text-destructive text-sm">{error}</p>}
              </div>
            </TabsContent>

            <TabsContent value="lunar">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-muted-foreground mb-2">輸入農曆日期</label>
                <div className="grid grid-cols-3 gap-3">
                  <Input
                    type="number"
                    value={lunarYear}
                    onChange={(e) => setLunarYear(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="年（如 1995）"
                    className="h-12 border-gold bg-background font-serif-tc"
                    min={1900}
                    max={2100}
                  />

                  <Select value={lunarMonth} onValueChange={setLunarMonth}>
                    <SelectTrigger className="h-12 border-gold bg-background font-serif-tc">
                      <SelectValue placeholder="月" />
                    </SelectTrigger>
                    <SelectContent>
                      {LUNAR_MONTHS.map((m, i) => (
                        <SelectItem key={i} value={String(i + 1)}>{m}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={lunarDay} onValueChange={setLunarDay}>
                    <SelectTrigger className="h-12 border-gold bg-background font-serif-tc">
                      <SelectValue placeholder="日" />
                    </SelectTrigger>
                    <SelectContent>
                      {LUNAR_DAYS.map((d, i) => (
                        <SelectItem key={i} value={String(i + 1)}>{d}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    id="leapMonth"
                    checked={isLeapMonth}
                    onCheckedChange={(checked) => setIsLeapMonth(checked === true)}
                  />
                  <label htmlFor="leapMonth" className="text-sm text-muted-foreground cursor-pointer">
                    閏月
                  </label>
                </div>

                <Button onClick={handleLunarConvert} className="w-full h-12 bg-gradient-red text-primary-foreground hover:opacity-90 font-serif-tc text-base">
                  <ArrowRightLeft className="w-4 h-4 mr-2" />
                  轉換為國曆
                </Button>

                {error && <p className="text-destructive text-sm">{error}</p>}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ResultCard result={result} />

            {futureBirthdays.length > 0 && (
              <FutureBirthdaysTable birthdays={futureBirthdays} lunarMonth={result.lunarMonth} lunarDay={result.lunarDay} />
            )}

            <div className="text-center">
              <Button
                onClick={() => setShowShare(true)}
                variant="outline"
                className="border-gold text-chinese-red hover:bg-chinese-gold/10 font-serif-tc"
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享我的農曆生日
              </Button>
            </div>

            {showShare && <ShareCard result={result} onClose={() => setShowShare(false)} />}
          </div>
        )}
      </main>

      <footer className="relative z-10 text-center py-8 text-sm text-muted-foreground">
        <p>支援 1900-2100 年 · 資料來源：lunisolar</p>
      </footer>
    </div>
  );
};

export default Index;
