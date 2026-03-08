import lunisolar from 'lunisolar';

// 星座計算
const ZODIAC_SIGNS = [
  { name: '摩羯座', symbol: '♑', start: [1, 1], end: [1, 19] },
  { name: '水瓶座', symbol: '♒', start: [1, 20], end: [2, 18] },
  { name: '雙魚座', symbol: '♓', start: [2, 19], end: [3, 20] },
  { name: '牡羊座', symbol: '♈', start: [3, 21], end: [4, 19] },
  { name: '金牛座', symbol: '♉', start: [4, 20], end: [5, 20] },
  { name: '雙子座', symbol: '♊', start: [5, 21], end: [6, 21] },
  { name: '巨蟹座', symbol: '♋', start: [6, 22], end: [7, 22] },
  { name: '獅子座', symbol: '♌', start: [7, 23], end: [8, 22] },
  { name: '處女座', symbol: '♍', start: [8, 23], end: [9, 22] },
  { name: '天秤座', symbol: '♎', start: [9, 23], end: [10, 23] },
  { name: '天蠍座', symbol: '♏', start: [10, 24], end: [11, 22] },
  { name: '射手座', symbol: '♐', start: [11, 23], end: [12, 21] },
  { name: '摩羯座', symbol: '♑', start: [12, 22], end: [12, 31] },
];

export function getZodiacSign(month: number, day: number): { name: string; symbol: string } {
  for (const sign of ZODIAC_SIGNS) {
    const afterStart = month > sign.start[0] || (month === sign.start[0] && day >= sign.start[1]);
    const beforeEnd = month < sign.end[0] || (month === sign.end[0] && day <= sign.end[1]);
    if (afterStart && beforeEnd) {
      return { name: sign.name, symbol: sign.symbol };
    }
  }
  return { name: '摩羯座', symbol: '♑' };
}

// 生肖
const ZODIAC_ANIMALS = ['鼠', '牛', '虎', '兔', '龍', '蛇', '馬', '羊', '猴', '雞', '狗', '豬'];
const ZODIAC_EMOJIS = ['🐭', '🐮', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑', '🐵', '🐔', '🐶', '🐷'];

export function getZodiacAnimal(year: number): { name: string; emoji: string } {
  const idx = (year - 4) % 12;
  return { name: ZODIAC_ANIMALS[idx], emoji: ZODIAC_EMOJIS[idx] };
}

// 星期
const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
export function getWeekday(date: Date): string {
  return `星期${WEEKDAYS[date.getDay()]}`;
}

export interface LunarResult {
  gregorianDate: Date;
  lunarYear: string;
  lunarMonth: string;
  lunarDay: string;
  isLeapMonth: boolean;
  zodiacAnimal: { name: string; emoji: string };
  zodiacSign: { name: string; symbol: string };
  heavenlyStemBranch: string;
  weekday: string;
  solarTerm: string | null;
}

export function gregorianToLunar(date: Date): LunarResult {
  const d = lunisolar(date);
  const lunar = d.lunar;
  const char8 = d.char8;

  const zodiacAnimal = getZodiacAnimal(date.getFullYear());
  const zodiacSign = getZodiacSign(date.getMonth() + 1, date.getDate());

  // Get solar term
  let solarTerm: string | null = null;
  try {
    const term = d.solarTerm;
    if (term) {
      solarTerm = term.toString();
    }
  } catch {
    // ignore
  }

  // Use format on the lunisolar instance, not on lunar
  const lunarYear = d.format('lY');
  const lunarMonth = d.format('lM');
  const lunarDay = d.format('lD');

  return {
    gregorianDate: date,
    lunarYear,
    lunarMonth,
    lunarDay,
    isLeapMonth: lunar.isLeapMonth,
    zodiacAnimal,
    zodiacSign,
    heavenlyStemBranch: `${char8.year} ${char8.month} ${char8.day}`,
    weekday: getWeekday(date),
    solarTerm,
  };
}

// 計算未來N年的農曆生日對應國曆日期
export function getFutureLunarBirthdays(
  lunarMonth: number,
  lunarDay: number,
  isLeapMonth: boolean,
  years: number = 5
): Array<{ year: number; gregorianDate: Date | null; isLeapMonth: boolean }> {
  const currentYear = new Date().getFullYear();
  const results: Array<{ year: number; gregorianDate: Date | null; isLeapMonth: boolean }> = [];

  for (let i = 0; i <= years; i++) {
    const year = currentYear + i;
    try {
      const d = lunisolar.fromLunar({
        year,
        month: lunarMonth,
        day: lunarDay,
        isLeapMonth,
      });
      results.push({
        year,
        gregorianDate: d.toDate(),
        isLeapMonth: false,
      });
    } catch {
      results.push({ year, gregorianDate: null, isLeapMonth: false });
    }
  }

  return results;
}
