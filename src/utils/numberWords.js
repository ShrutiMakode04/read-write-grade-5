const ONES = ['', 'one','two','three','four','five','six','seven','eight','nine'];
const TEENS = ['ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
const TENS = ['', '', 'twenty','thirty','forty','fifty','sixty','seventy','eighty','ninety'];

function twoDigitToWords(n) {
  if (n === 0) return '';
  if (n < 10) return ONES[n];
  if (n < 20) return TEENS[n - 10];
  const t = Math.floor(n / 10), o = n % 10;
  return TENS[t] + (o ? '-' + ONES[o] : '');
}

function threeDigitToWords(n) {
  const h = Math.floor(n / 100), rest = n % 100;
  const parts = [];
  if (h) parts.push(ONES[h] + ' hundred');
  if (rest) parts.push(twoDigitToWords(rest));
  return parts.join(' ');
}

export function numberToWords(n) {
  if (n === 0) return 'zero';
  const millions = Math.floor(n / 1000000);
  const thousands = Math.floor((n % 1000000) / 1000);
  const ones = n % 1000;
  const parts = [];
  if (millions) parts.push(threeDigitToWords(millions) + ' million');
  if (thousands) parts.push(threeDigitToWords(thousands) + ' thousand');
  if (ones) parts.push(threeDigitToWords(ones));
  return parts.join(' ').trim();
}

export function toIndianGrouping(n) {
  const s = String(n);
  if (s.length <= 3) return s;
  const last3 = s.slice(-3);
  let rest = s.slice(0, -3);
  const groups = [];
  while (rest.length > 2) { 
    groups.unshift(rest.slice(-2)); 
    rest = rest.slice(0, -2); 
  }
  if (rest.length) groups.unshift(rest);
  return groups.join(',') + ',' + last3;
}

export function numberToWordsIndian(n) {
  if (n === 0) return 'zero';
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const ones = n % 1000;
  const parts = [];
  if (crore) parts.push(threeDigitToWords(crore) + ' crore');
  if (lakh) parts.push(twoDigitToWords(lakh) + ' lakh');
  if (thousand) parts.push(twoDigitToWords(thousand) + ' thousand');
  if (ones) parts.push(threeDigitToWords(ones));
  return parts.join(' ').trim();
}

export function toExpandedForm(n) {
  return String(n).split('').reverse()
    .map((d, i) => Number(d) * Math.pow(10, i))
    .filter(v => v !== 0)
    .reverse();
}
