import { useState } from 'react';
import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { Calendar, ArrowRightLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { gregorianToLunar, getFutureLunarBirthdays, type LunarResult } from '@/lib/lunar-utils';
import ResultCard from '@/components/ResultCard';
import FutureBirthdaysTable from '@/components/FutureBirthdaysTable';
import ShareCard from '@/components/ShareCard';
import heroBg from '@/assets/hero-bg.jpg';

const Index = () => {
  const [gregorianInput, setGregorianInput] = useState('');
  const [result, setResult] = useState<LunarResult | null>(null);
  const [error, setError] = useState('');
  const [showShare, setShowShare] = useState(false);

  const handleConvert = () => {
    setError('');
    setResult(null);

    try {
      // Parse as local date to avoid timezone issues
      const parts = gregorianInput.split('-');
      const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      if (isNaN(date.getTime())) {
        setError('請輸入有效的日期格式，例如：1995/07/15');
        return;
      }
      if (date.getFullYear() < 1900 || date.getFullYear() > 2100) {
        setError('僅支援 1900-2100 年的日期');
        return;
      }
      const lunarResult = gregorianToLunar(date);
      setResult(lunarResult);
    } catch {
      setError('轉換失敗，請確認日期格式正確');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleConvert();
  };

  const futureBirthdays = result
    ? getFutureLunarBirthdays(
        result.lunarMonthNum,
        result.lunarDayNum,
        result.isLeapMonth
      )
    : [];

  return (
    <div className="min-h-screen pattern-chinese relative overflow-hidden">
      <LanternDecoration />

      {/* Hero */}
      <header className="relative z-10 pt-16 pb-10 text-center px-4">
        <div className="inline-block mb-4">
          <span className="text-6xl">🏮</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-serif-tc text-foreground mb-3">
          農曆生日轉換器
        </h1>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          國曆農曆雙向轉換 · 生肖星座 · 天干地支
        </p>
      </header>

      {/* Main converter */}
      <main className="relative z-10 max-w-2xl mx-auto px-4 pb-20">
        <div className="bg-card rounded-2xl shadow-lantern border border-gold p-6 md:p-8 mb-8">
          <Tabs defaultValue="gregorian" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted">
              <TabsTrigger value="gregorian" className="font-serif-tc text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                📅 國曆 → 農曆
              </TabsTrigger>
              <TabsTrigger value="lunar" className="font-serif-tc text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground" disabled>
                🏮 農曆 → 國曆
              </TabsTrigger>
            </TabsList>

            <TabsContent value="gregorian">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    輸入國曆日期
                  </label>
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
                    <Button
                      onClick={handleConvert}
                      className="h-12 px-6 bg-gradient-red text-primary-foreground hover:opacity-90 font-serif-tc text-base"
                    >
                      <ArrowRightLeft className="w-4 h-4 mr-2" />
                      轉換
                    </Button>
                  </div>
                </div>

                {error && (
                  <p className="text-destructive text-sm">{error}</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ResultCard result={result} />

            {/* Future birthdays */}
            {futureBirthdays.length > 0 && (
              <FutureBirthdaysTable birthdays={futureBirthdays} lunarMonth={result.lunarMonth} lunarDay={result.lunarDay} />
            )}

            {/* Share button */}
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

            {showShare && (
              <ShareCard result={result} onClose={() => setShowShare(false)} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-8 text-sm text-muted-foreground">
        <p>支援 1900-2100 年 · 資料來源：lunisolar</p>
      </footer>
    </div>
  );
};

export default Index;
