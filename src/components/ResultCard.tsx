import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import type { LunarResult } from '@/lib/lunar-utils';

interface ResultCardProps {
  result: LunarResult;
}

const ResultCard = ({ result }: ResultCardProps) => {
  return (
    <div className="bg-card rounded-2xl shadow-lantern border border-gold overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-red px-6 py-4">
        <h2 className="text-xl font-serif-tc font-bold text-primary-foreground text-center">
          轉換結果
        </h2>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Main info grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow
            emoji="📅"
            label="國曆"
            value={`${format(result.gregorianDate, 'yyyy 年 M 月 d 日', { locale: zhTW })}（${result.weekday}）`}
          />
          <InfoRow
            emoji="🏮"
            label="農曆"
            value={`${result.lunarYear}年 ${result.isLeapMonth ? '閏' : ''}${result.lunarMonth}${result.lunarDay}`}
          />
          <InfoRow
            emoji={result.zodiacAnimal.emoji}
            label="生肖"
            value={result.zodiacAnimal.name}
          />
          <InfoRow
            emoji={result.zodiacSign.symbol}
            label="星座"
            value={result.zodiacSign.name}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-gold my-2" />

        {/* Detailed info */}
        <div className="space-y-3">
          <InfoRow
            emoji="🌿"
            label="天干地支"
            value={result.heavenlyStemBranch}
          />
          {result.solarTerm && (
            <InfoRow
              emoji="☀️"
              label="節氣"
              value={result.solarTerm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

function InfoRow({ emoji, label, value }: { emoji: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 bg-gradient-gold rounded-xl px-4 py-3">
      <span className="text-xl flex-shrink-0">{emoji}</span>
      <div>
        <span className="text-xs font-medium text-muted-foreground block">{label}</span>
        <span className="text-base font-serif-tc font-semibold text-foreground">{value}</span>
      </div>
    </div>
  );
}

export default ResultCard;
