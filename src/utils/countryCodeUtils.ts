/**
 * Country dialing-code → flag emoji + country name lookup.
 * Sorted by code length DESCENDING so longer (more specific) codes match first.
 */
export interface CountryInfo {
  code: string; // numeric code without '+'
  flag: string;
  name: string;
}

const RAW: CountryInfo[] = [
  // 3-digit codes (most specific – must come first in the sorted list)
  { code: '212', flag: '🇲🇦', name: 'Morocco' },
  { code: '213', flag: '🇩🇿', name: 'Algeria' },
  { code: '216', flag: '🇹🇳', name: 'Tunisia' },
  { code: '218', flag: '🇱🇾', name: 'Libya' },
  { code: '220', flag: '🇬🇲', name: 'Gambia' },
  { code: '221', flag: '🇸🇳', name: 'Senegal' },
  { code: '222', flag: '🇲🇷', name: 'Mauritania' },
  { code: '223', flag: '🇲🇱', name: 'Mali' },
  { code: '224', flag: '🇬🇳', name: 'Guinea' },
  { code: '225', flag: '🇨🇮', name: 'Ivory Coast' },
  { code: '226', flag: '🇧🇫', name: 'Burkina Faso' },
  { code: '227', flag: '🇳🇪', name: 'Niger' },
  { code: '228', flag: '🇹🇬', name: 'Togo' },
  { code: '229', flag: '🇧🇯', name: 'Benin' },
  { code: '230', flag: '🇲🇺', name: 'Mauritius' },
  { code: '231', flag: '🇱🇷', name: 'Liberia' },
  { code: '232', flag: '🇸🇱', name: 'Sierra Leone' },
  { code: '233', flag: '🇬🇭', name: 'Ghana' },
  { code: '234', flag: '🇳🇬', name: 'Nigeria' },
  { code: '235', flag: '🇹🇩', name: 'Chad' },
  { code: '236', flag: '🇨🇫', name: 'Central African Republic' },
  { code: '237', flag: '🇨🇲', name: 'Cameroon' },
  { code: '238', flag: '🇨🇻', name: 'Cape Verde' },
  { code: '239', flag: '🇸🇹', name: 'Sao Tome & Principe' },
  { code: '240', flag: '🇬🇶', name: 'Equatorial Guinea' },
  { code: '241', flag: '🇬🇦', name: 'Gabon' },
  { code: '242', flag: '🇨🇬', name: 'Congo' },
  { code: '243', flag: '🇨🇩', name: 'DR Congo' },
  { code: '244', flag: '🇦🇴', name: 'Angola' },
  { code: '245', flag: '🇬🇼', name: 'Guinea-Bissau' },
  { code: '248', flag: '🇸🇨', name: 'Seychelles' },
  { code: '249', flag: '🇸🇩', name: 'Sudan' },
  { code: '250', flag: '🇷🇼', name: 'Rwanda' },
  { code: '251', flag: '🇪🇹', name: 'Ethiopia' },
  { code: '252', flag: '🇸🇴', name: 'Somalia' },
  { code: '253', flag: '🇩🇯', name: 'Djibouti' },
  { code: '254', flag: '🇰🇪', name: 'Kenya' },
  { code: '255', flag: '🇹🇿', name: 'Tanzania' },
  { code: '256', flag: '🇺🇬', name: 'Uganda' },
  { code: '257', flag: '🇧🇮', name: 'Burundi' },
  { code: '258', flag: '🇲🇿', name: 'Mozambique' },
  { code: '260', flag: '🇿🇲', name: 'Zambia' },
  { code: '261', flag: '🇲🇬', name: 'Madagascar' },
  { code: '263', flag: '🇿🇼', name: 'Zimbabwe' },
  { code: '264', flag: '🇳🇦', name: 'Namibia' },
  { code: '265', flag: '🇲🇼', name: 'Malawi' },
  { code: '266', flag: '🇱🇸', name: 'Lesotho' },
  { code: '267', flag: '🇧🇼', name: 'Botswana' },
  { code: '268', flag: '🇸🇿', name: 'Eswatini' },
  { code: '269', flag: '🇰🇲', name: 'Comoros' },
  { code: '291', flag: '🇪🇷', name: 'Eritrea' },
  { code: '297', flag: '🇦🇼', name: 'Aruba' },
  { code: '298', flag: '🇫🇴', name: 'Faroe Islands' },
  { code: '299', flag: '🇬🇱', name: 'Greenland' },
  { code: '350', flag: '🇬🇮', name: 'Gibraltar' },
  { code: '351', flag: '🇵🇹', name: 'Portugal' },
  { code: '352', flag: '🇱🇺', name: 'Luxembourg' },
  { code: '353', flag: '🇮🇪', name: 'Ireland' },
  { code: '354', flag: '🇮🇸', name: 'Iceland' },
  { code: '355', flag: '🇦🇱', name: 'Albania' },
  { code: '356', flag: '🇲🇹', name: 'Malta' },
  { code: '357', flag: '🇨🇾', name: 'Cyprus' },
  { code: '358', flag: '🇫🇮', name: 'Finland' },
  { code: '359', flag: '🇧🇬', name: 'Bulgaria' },
  { code: '370', flag: '🇱🇹', name: 'Lithuania' },
  { code: '371', flag: '🇱🇻', name: 'Latvia' },
  { code: '372', flag: '🇪🇪', name: 'Estonia' },
  { code: '373', flag: '🇲🇩', name: 'Moldova' },
  { code: '374', flag: '🇦🇲', name: 'Armenia' },
  { code: '375', flag: '🇧🇾', name: 'Belarus' },
  { code: '376', flag: '🇦🇩', name: 'Andorra' },
  { code: '377', flag: '🇲🇨', name: 'Monaco' },
  { code: '378', flag: '🇸🇲', name: 'San Marino' },
  { code: '380', flag: '🇺🇦', name: 'Ukraine' },
  { code: '381', flag: '🇷🇸', name: 'Serbia' },
  { code: '382', flag: '🇲🇪', name: 'Montenegro' },
  { code: '385', flag: '🇭🇷', name: 'Croatia' },
  { code: '386', flag: '🇸🇮', name: 'Slovenia' },
  { code: '387', flag: '🇧🇦', name: 'Bosnia and Herzegovina' },
  { code: '389', flag: '🇲🇰', name: 'North Macedonia' },
  { code: '420', flag: '🇨🇿', name: 'Czech Republic' },
  { code: '421', flag: '🇸🇰', name: 'Slovakia' },
  { code: '423', flag: '🇱🇮', name: 'Liechtenstein' },
  { code: '501', flag: '🇧🇿', name: 'Belize' },
  { code: '502', flag: '🇬🇹', name: 'Guatemala' },
  { code: '503', flag: '🇸🇻', name: 'El Salvador' },
  { code: '504', flag: '🇭🇳', name: 'Honduras' },
  { code: '505', flag: '🇳🇮', name: 'Nicaragua' },
  { code: '506', flag: '🇨🇷', name: 'Costa Rica' },
  { code: '507', flag: '🇵🇦', name: 'Panama' },
  { code: '509', flag: '🇭🇹', name: 'Haiti' },
  { code: '590', flag: '🇬🇵', name: 'Guadeloupe' },
  { code: '591', flag: '🇧🇴', name: 'Bolivia' },
  { code: '592', flag: '🇬🇾', name: 'Guyana' },
  { code: '593', flag: '🇪🇨', name: 'Ecuador' },
  { code: '595', flag: '🇵🇾', name: 'Paraguay' },
  { code: '597', flag: '🇸🇷', name: 'Suriname' },
  { code: '598', flag: '🇺🇾', name: 'Uruguay' },
  { code: '599', flag: '🇨🇼', name: 'Curaçao' },
  { code: '670', flag: '🇹🇱', name: 'East Timor' },
  { code: '673', flag: '🇧🇳', name: 'Brunei' },
  { code: '674', flag: '🇳🇷', name: 'Nauru' },
  { code: '675', flag: '🇵🇬', name: 'Papua New Guinea' },
  { code: '676', flag: '🇹🇴', name: 'Tonga' },
  { code: '677', flag: '🇸🇧', name: 'Solomon Islands' },
  { code: '678', flag: '🇻🇺', name: 'Vanuatu' },
  { code: '679', flag: '🇫🇯', name: 'Fiji' },
  { code: '680', flag: '🇵🇼', name: 'Palau' },
  { code: '685', flag: '🇼🇸', name: 'Samoa' },
  { code: '686', flag: '🇰🇮', name: 'Kiribati' },
  { code: '687', flag: '🇳🇨', name: 'New Caledonia' },
  { code: '688', flag: '🇹🇻', name: 'Tuvalu' },
  { code: '689', flag: '🇵🇫', name: 'French Polynesia' },
  { code: '691', flag: '🇫🇲', name: 'Micronesia' },
  { code: '692', flag: '🇲🇭', name: 'Marshall Islands' },
  { code: '850', flag: '🇰🇵', name: 'North Korea' },
  { code: '852', flag: '🇭🇰', name: 'Hong Kong' },
  { code: '853', flag: '🇲🇴', name: 'Macao' },
  { code: '855', flag: '🇰🇭', name: 'Cambodia' },
  { code: '856', flag: '🇱🇦', name: 'Laos' },
  { code: '880', flag: '🇧🇩', name: 'Bangladesh' },
  { code: '886', flag: '🇹🇼', name: 'Taiwan' },
  { code: '960', flag: '🇲🇻', name: 'Maldives' },
  { code: '961', flag: '🇱🇧', name: 'Lebanon' },
  { code: '962', flag: '🇯🇴', name: 'Jordan' },
  { code: '963', flag: '🇸🇾', name: 'Syria' },
  { code: '964', flag: '🇮🇶', name: 'Iraq' },
  { code: '965', flag: '🇰🇼', name: 'Kuwait' },
  { code: '966', flag: '🇸🇦', name: 'Saudi Arabia' },
  { code: '967', flag: '🇾🇪', name: 'Yemen' },
  { code: '968', flag: '🇴🇲', name: 'Oman' },
  { code: '970', flag: '🇵🇸', name: 'Palestine' },
  { code: '971', flag: '🇦🇪', name: 'UAE' },
  { code: '972', flag: '🇮🇱', name: 'Israel' },
  { code: '973', flag: '🇧🇭', name: 'Bahrain' },
  { code: '974', flag: '🇶🇦', name: 'Qatar' },
  { code: '975', flag: '🇧🇹', name: 'Bhutan' },
  { code: '976', flag: '🇲🇳', name: 'Mongolia' },
  { code: '977', flag: '🇳🇵', name: 'Nepal' },
  { code: '992', flag: '🇹🇯', name: 'Tajikistan' },
  { code: '993', flag: '🇹🇲', name: 'Turkmenistan' },
  { code: '994', flag: '🇦🇿', name: 'Azerbaijan' },
  { code: '995', flag: '🇬🇪', name: 'Georgia' },
  { code: '996', flag: '🇰🇬', name: 'Kyrgyzstan' },
  { code: '998', flag: '🇺🇿', name: 'Uzbekistan' },
  // 2-digit codes
  { code: '20', flag: '🇪🇬', name: 'Egypt' },
  { code: '27', flag: '🇿🇦', name: 'South Africa' },
  { code: '30', flag: '🇬🇷', name: 'Greece' },
  { code: '31', flag: '🇳🇱', name: 'Netherlands' },
  { code: '32', flag: '🇧🇪', name: 'Belgium' },
  { code: '33', flag: '🇫🇷', name: 'France' },
  { code: '34', flag: '🇪🇸', name: 'Spain' },
  { code: '36', flag: '🇭🇺', name: 'Hungary' },
  { code: '39', flag: '🇮🇹', name: 'Italy' },
  { code: '40', flag: '🇷🇴', name: 'Romania' },
  { code: '41', flag: '🇨🇭', name: 'Switzerland' },
  { code: '43', flag: '🇦🇹', name: 'Austria' },
  { code: '44', flag: '🇬🇧', name: 'United Kingdom' },
  { code: '45', flag: '🇩🇰', name: 'Denmark' },
  { code: '46', flag: '🇸🇪', name: 'Sweden' },
  { code: '47', flag: '🇳🇴', name: 'Norway' },
  { code: '48', flag: '🇵🇱', name: 'Poland' },
  { code: '49', flag: '🇩🇪', name: 'Germany' },
  { code: '51', flag: '🇵🇪', name: 'Peru' },
  { code: '52', flag: '🇲🇽', name: 'Mexico' },
  { code: '54', flag: '🇦🇷', name: 'Argentina' },
  { code: '55', flag: '🇧🇷', name: 'Brazil' },
  { code: '56', flag: '🇨🇱', name: 'Chile' },
  { code: '57', flag: '🇨🇴', name: 'Colombia' },
  { code: '58', flag: '🇻🇪', name: 'Venezuela' },
  { code: '60', flag: '🇲🇾', name: 'Malaysia' },
  { code: '61', flag: '🇦🇺', name: 'Australia' },
  { code: '62', flag: '🇮🇩', name: 'Indonesia' },
  { code: '63', flag: '🇵🇭', name: 'Philippines' },
  { code: '64', flag: '🇳🇿', name: 'New Zealand' },
  { code: '65', flag: '🇸🇬', name: 'Singapore' },
  { code: '66', flag: '🇹🇭', name: 'Thailand' },
  { code: '81', flag: '🇯🇵', name: 'Japan' },
  { code: '82', flag: '🇰🇷', name: 'South Korea' },
  { code: '84', flag: '🇻🇳', name: 'Vietnam' },
  { code: '86', flag: '🇨🇳', name: 'China' },
  { code: '90', flag: '🇹🇷', name: 'Turkey' },
  { code: '91', flag: '🇮🇳', name: 'India' },
  { code: '92', flag: '🇵🇰', name: 'Pakistan' },
  { code: '93', flag: '🇦🇫', name: 'Afghanistan' },
  { code: '94', flag: '🇱🇰', name: 'Sri Lanka' },
  { code: '95', flag: '🇲🇲', name: 'Myanmar' },
  { code: '98', flag: '🇮🇷', name: 'Iran' },
  // 1-digit code
  { code: '1', flag: '🇺🇸', name: 'US / Canada' },
  { code: '7', flag: '🇷🇺', name: 'Russia / Kazakhstan' },
];

// Sort by code length descending (longest / most specific first)
export const COUNTRY_CODES: CountryInfo[] = [...RAW].sort(
  (a, b) => b.code.length - a.code.length,
);

/**
 * Given a phone string (e.g. "+256701234567" or "256701234567"),
 * return the matched CountryInfo or null.
 */
export function detectCountry(phone: string): CountryInfo | null {
  const digits = phone.startsWith('+') ? phone.slice(1) : phone;
  for (const c of COUNTRY_CODES) {
    if (digits.startsWith(c.code)) return c;
  }
  return null;
}

/**
 * Validate a full international phone number.
 * Returns error string or null if valid.
 */
export function validateInternationalPhone(phone: string): string | null {
  if (!phone.startsWith('+')) {
    return 'Phone number must start with + followed by country code (e.g. +256...)';
  }
  const digits = phone.slice(1).replace(/\D/g, '');
  if (digits.length < 7) {
    return 'Phone number is too short';
  }
  if (digits.length > 15) {
    return 'Phone number is too long';
  }
  if (!detectCountry(phone)) {
    return 'Unrecognised country code. Please include a valid international prefix.';
  }
  return null;
}
