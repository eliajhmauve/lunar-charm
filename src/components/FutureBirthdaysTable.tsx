import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';

interface FutureBirthdaysTableProps {
  birthdays: Array<{ year: number; gregorianDate: Date | null; isLeapMonth: boolean }>;
  lunarMonth: string;
  lunarDay: string;
}

const FutureBirthdaysTable = ({ birthdays, lunarMonth, lunarDay }: FutureBirthdaysTableProps) => {
  return (
    <div className="bg-card rounded-2xl shadow-lantern border border-gold overflow-hidden">
      <div className="bg-gradient-red px-6 py-4">
        <h2 className="text-xl font-serif-tc font-bold text-primary-foreground text-center">
          🎂 未來農曆生日對照表
        </h2>
        <p className="text-center text-primary-foreground/80 text-sm mt-1">
          農曆 {lunarMonth}{lunarDay} 的國曆日期
        </p>
      </div>

      <div className="p-4">
        <div className="divide-y divide-border">
          {birthdays.map((b) => (
            <div key={b.year} className="flex items-center justify-between py-3 px-3 hover:bg-gradient-gold rounded-lg transition-colors">
              <span className="font-serif-tc font-semibold text-foreground">{b.year} 年</span>
              <span className="text-muted-foreground">
                {b.gregorianDate
                  ? format(b.gregorianDate, 'M 月 d 日（EEEE）', { locale: zhTW })
                  : '無此日期'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FutureBirthdaysTable;
