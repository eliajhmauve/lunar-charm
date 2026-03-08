import { X, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { LunarResult } from '@/lib/lunar-utils';

interface ShareCardProps {
  result: LunarResult;
  onClose: () => void;
}

const ShareCard = ({ result, onClose }: ShareCardProps) => {
  const shareText = `我的農曆生日是${result.lunarMonth}${result.lunarDay} 🏮\n生肖：${result.zodiacAnimal.emoji} ${result.zodiacAnimal.name}\n星座：${result.zodiacSign.symbol} ${result.zodiacSign.name}\n\n你的農曆生日是幾號呢？`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('已複製到剪貼簿！');
    } catch {
      toast.error('複製失敗');
    }
  };

  return (
    <div className="bg-card rounded-2xl shadow-lantern border border-gold overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-gradient-red px-6 py-3 flex items-center justify-between">
        <h3 className="font-serif-tc font-bold text-primary-foreground">分享卡片</h3>
        <button onClick={onClose} className="text-primary-foreground/80 hover:text-primary-foreground">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6">
        {/* Preview card */}
        <div className="bg-gradient-gold rounded-xl p-5 mb-4 border border-gold text-center space-y-2">
          <p className="text-3xl">{result.zodiacAnimal.emoji}</p>
          <p className="font-serif-tc text-lg font-bold text-foreground">
            我的農曆生日是{result.lunarMonth}{result.lunarDay}
          </p>
          <p className="text-muted-foreground text-sm">
            {result.zodiacSign.symbol} {result.zodiacSign.name} · {result.zodiacAnimal.emoji} {result.zodiacAnimal.name}
          </p>
          <p className="text-2xl mt-2">🏮</p>
        </div>

        <Button onClick={handleCopy} className="w-full bg-gradient-red text-primary-foreground hover:opacity-90 font-serif-tc">
          <Copy className="w-4 h-4 mr-2" />
          複製分享文字
        </Button>
      </div>
    </div>
  );
};

export default ShareCard;
