import { useRef, useState } from 'react';
import { X, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { toPng } from 'html-to-image';
import { format } from 'date-fns';
import type { LunarResult } from '@/lib/lunar-utils';

interface ShareCardProps {
  result: LunarResult;
  onClose: () => void;
}

const ShareCard = ({ result, onClose }: ShareCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const shareText = `我的農曆生日是${result.lunarMonth}${result.lunarDay} 🏮\n生肖：${result.zodiacAnimal.emoji} ${result.zodiacAnimal.name}\n星座：${result.zodiacSign.symbol} ${result.zodiacSign.name}\n\n你的農曆生日是幾號呢？`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      toast.success('已複製到剪貼簿！');
    } catch {
      toast.error('複製失敗');
    }
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        backgroundColor: '#f5ede4',
      });
      const link = document.createElement('a');
      link.download = `農曆生日-${result.lunarMonth}${result.lunarDay}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('圖片已下載！');
    } catch {
      toast.error('下載失敗，請重試');
    } finally {
      setDownloading(false);
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
        {/* Capturable card */}
        <div ref={cardRef} className="rounded-xl overflow-hidden mb-4" style={{ background: 'linear-gradient(145deg, #fdf6ec 0%, #f9e8d0 50%, #f5dcc0 100%)' }}>
          <div className="px-6 py-8 text-center space-y-3">
            <p className="text-5xl">{result.zodiacAnimal.emoji}</p>
            <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: '22px', fontWeight: 700, color: '#3d1a1a' }}>
              我的農曆生日是
            </p>
            <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: '32px', fontWeight: 900, color: '#8b1a1a' }}>
              {result.lunarMonth}{result.lunarDay}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '15px', color: '#6b4226' }}>
              <span>{result.zodiacSign.symbol} {result.zodiacSign.name}</span>
              <span>·</span>
              <span>{result.zodiacAnimal.emoji} {result.zodiacAnimal.name}</span>
            </div>
            <p style={{ fontSize: '13px', color: '#9b7b5e', marginTop: '4px' }}>
              國曆 {format(result.gregorianDate, 'yyyy/MM/dd')}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '8px', fontSize: '28px' }}>
              <span>🏮</span>
              <span>🏮</span>
              <span>🏮</span>
            </div>
            <p style={{ fontSize: '11px', color: '#b8956a', marginTop: '8px' }}>
              你的農曆生日是幾號呢？
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleCopy} variant="outline" className="flex-1 border-gold text-foreground hover:bg-chinese-gold/10 font-serif-tc">
            <Copy className="w-4 h-4 mr-2" />
            複製文字
          </Button>
          <Button onClick={handleDownload} disabled={downloading} className="flex-1 bg-gradient-red text-primary-foreground hover:opacity-90 font-serif-tc">
            <Download className="w-4 h-4 mr-2" />
            {downloading ? '生成中...' : '下載圖片'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareCard;
