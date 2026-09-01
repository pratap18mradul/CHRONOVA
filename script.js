/* =========================================================================
   WORLD PULSE — script.js
   Vanilla JS. No frameworks. D3 + topojson-client are used ONLY to render
   real country geometry on the map (loaded from a public world atlas
   dataset at runtime) — everything else (clock, weather, search, state)
   is hand-written vanilla JS.
   ========================================================================= */

(() => {
  'use strict';

  /* ======================================================================
     1. LOCATION DATABASE
     Structured list of countries with a representative capital/major city,
     coordinates and IANA timezone. Aliases help match this list against
     whatever "name" property the loaded map geometry happens to use.
     ====================================================================== */
  const LOCATIONS = [
    // ---- Asia ----
    { country: 'India', iso2: 'IN', flag: '', capital: 'New Delhi', lat: 28.6139, lon: 77.2090, tz: 'Asia/Kolkata', aliases: ['india'] },
    { country: 'Japan', iso2: 'JP', flag: '', capital: 'Tokyo', lat: 35.6762, lon: 139.6503, tz: 'Asia/Tokyo', aliases: ['japan'] },
    { country: 'China', iso2: 'CN', flag: '', capital: 'Beijing', lat: 39.9042, lon: 116.4074, tz: 'Asia/Shanghai', aliases: ['china', "people's republic of china"] },
    { country: 'South Korea', iso2: 'KR', flag: '', capital: 'Seoul', lat: 37.5665, lon: 126.9780, tz: 'Asia/Seoul', aliases: ['south korea', 'korea, republic of', 'republic of korea'] },
    { country: 'Singapore', iso2: 'SG', flag: '', capital: 'Singapore', lat: 1.3521, lon: 103.8198, tz: 'Asia/Singapore', aliases: ['singapore'] },
    { country: 'Indonesia', iso2: 'ID', flag: '', capital: 'Jakarta', lat: -6.2088, lon: 106.8456, tz: 'Asia/Jakarta', aliases: ['indonesia'] },
    { country: 'Thailand', iso2: 'TH', flag: '', capital: 'Bangkok', lat: 13.7563, lon: 100.5018, tz: 'Asia/Bangkok', aliases: ['thailand'] },
    { country: 'Vietnam', iso2: 'VN', flag: '', capital: 'Hanoi', lat: 21.0285, lon: 105.8542, tz: 'Asia/Ho_Chi_Minh', aliases: ['vietnam'] },
    { country: 'Philippines', iso2: 'PH', flag: '', capital: 'Manila', lat: 14.5995, lon: 120.9842, tz: 'Asia/Manila', aliases: ['philippines'] },
    { country: 'Malaysia', iso2: 'MY', flag: '', capital: 'Kuala Lumpur', lat: 3.1390, lon: 101.6869, tz: 'Asia/Kuala_Lumpur', aliases: ['malaysia'] },
    { country: 'Pakistan', iso2: 'PK', flag: '', capital: 'Islamabad', lat: 33.6844, lon: 73.0479, tz: 'Asia/Karachi', aliases: ['pakistan'] },
    { country: 'Bangladesh', iso2: 'BD', flag: '', capital: 'Dhaka', lat: 23.8103, lon: 90.4125, tz: 'Asia/Dhaka', aliases: ['bangladesh'] },
    { country: 'Sri Lanka', iso2: 'LK', flag: '', capital: 'Colombo', lat: 6.9271, lon: 79.8612, tz: 'Asia/Colombo', aliases: ['sri lanka'] },
    { country: 'Nepal', iso2: 'NP', flag: '', capital: 'Kathmandu', lat: 27.7172, lon: 85.3240, tz: 'Asia/Kathmandu', aliases: ['nepal'] },
    { country: 'United Arab Emirates', iso2: 'AE', flag: '', capital: 'Dubai', lat: 25.2048, lon: 55.2708, tz: 'Asia/Dubai', aliases: ['united arab emirates', 'uae'] },
    { country: 'Saudi Arabia', iso2: 'SA', flag: '', capital: 'Riyadh', lat: 24.7136, lon: 46.6753, tz: 'Asia/Riyadh', aliases: ['saudi arabia'] },
    { country: 'Israel', iso2: 'IL', flag: '', capital: 'Jerusalem', lat: 31.7683, lon: 35.2137, tz: 'Asia/Jerusalem', aliases: ['israel'] },
    { country: 'Turkey', iso2: 'TR', flag: '', capital: 'Ankara', lat: 39.9334, lon: 32.8597, tz: 'Europe/Istanbul', aliases: ['turkey', 'turkiye', 'türkiye'] },
    { country: 'Iran', iso2: 'IR', flag: '', capital: 'Tehran', lat: 35.6892, lon: 51.3890, tz: 'Asia/Tehran', aliases: ['iran', 'iran, islamic republic of'] },
    { country: 'Iraq', iso2: 'IQ', flag: '', capital: 'Baghdad', lat: 33.3152, lon: 44.3661, tz: 'Asia/Baghdad', aliases: ['iraq'] },
    { country: 'Qatar', iso2: 'QA', flag: '', capital: 'Doha', lat: 25.2854, lon: 51.5310, tz: 'Asia/Qatar', aliases: ['qatar'] },
    { country: 'Kazakhstan', iso2: 'KZ', flag: '', capital: 'Astana', lat: 51.1694, lon: 71.4491, tz: 'Asia/Almaty', aliases: ['kazakhstan'] },
    { country: 'Afghanistan', iso2: 'AF', flag: '', capital: 'Kabul', lat: 34.5553, lon: 69.2075, tz: 'Asia/Kabul', aliases: ['afghanistan'] },
    { country: 'Myanmar', iso2: 'MM', flag: '', capital: 'Naypyidaw', lat: 19.7633, lon: 96.0785, tz: 'Asia/Yangon', aliases: ['myanmar', 'burma'] },

    // ---- Europe ----
    { country: 'United Kingdom', iso2: 'GB', flag: '', capital: 'London', lat: 51.5072, lon: -0.1276, tz: 'Europe/London', aliases: ['united kingdom', 'uk', 'great britain', 'england'] },
    { country: 'France', iso2: 'FR', flag: '', capital: 'Paris', lat: 48.8566, lon: 2.3522, tz: 'Europe/Paris', aliases: ['france'] },
    { country: 'Germany', iso2: 'DE', flag: '', capital: 'Berlin', lat: 52.5200, lon: 13.4050, tz: 'Europe/Berlin', aliases: ['germany'] },
    { country: 'Italy', iso2: 'IT', flag: '', capital: 'Rome', lat: 41.9028, lon: 12.4964, tz: 'Europe/Rome', aliases: ['italy'] },
    { country: 'Spain', iso2: 'ES', flag: '', capital: 'Madrid', lat: 40.4168, lon: -3.7038, tz: 'Europe/Madrid', aliases: ['spain'] },
    { country: 'Netherlands', iso2: 'NL', flag: '', capital: 'Amsterdam', lat: 52.3676, lon: 4.9041, tz: 'Europe/Amsterdam', aliases: ['netherlands', 'holland'] },
    { country: 'Russia', iso2: 'RU', flag: '', capital: 'Moscow', lat: 55.7558, lon: 37.6173, tz: 'Europe/Moscow', aliases: ['russia', 'russian federation'] },
    { country: 'Sweden', iso2: 'SE', flag: '', capital: 'Stockholm', lat: 59.3293, lon: 18.0686, tz: 'Europe/Stockholm', aliases: ['sweden'] },
    { country: 'Norway', iso2: 'NO', flag: '', capital: 'Oslo', lat: 59.9139, lon: 10.7522, tz: 'Europe/Oslo', aliases: ['norway'] },
    { country: 'Switzerland', iso2: 'CH', flag: '', capital: 'Bern', lat: 46.9480, lon: 7.4474, tz: 'Europe/Zurich', aliases: ['switzerland'] },
    { country: 'Portugal', iso2: 'PT', flag: '', capital: 'Lisbon', lat: 38.7223, lon: -9.1393, tz: 'Europe/Lisbon', aliases: ['portugal'] },
    { country: 'Greece', iso2: 'GR', flag: '', capital: 'Athens', lat: 37.9838, lon: 23.7275, tz: 'Europe/Athens', aliases: ['greece'] },
    { country: 'Poland', iso2: 'PL', flag: '', capital: 'Warsaw', lat: 52.2297, lon: 21.0122, tz: 'Europe/Warsaw', aliases: ['poland'] },
    { country: 'Ireland', iso2: 'IE', flag: '', capital: 'Dublin', lat: 53.3498, lon: -6.2603, tz: 'Europe/Dublin', aliases: ['ireland'] },
    { country: 'Belgium', iso2: 'BE', flag: '', capital: 'Brussels', lat: 50.8503, lon: 4.3517, tz: 'Europe/Brussels', aliases: ['belgium'] },
    { country: 'Austria', iso2: 'AT', flag: '', capital: 'Vienna', lat: 48.2082, lon: 16.3738, tz: 'Europe/Vienna', aliases: ['austria'] },
    { country: 'Ukraine', iso2: 'UA', flag: '', capital: 'Kyiv', lat: 50.4501, lon: 30.5234, tz: 'Europe/Kyiv', aliases: ['ukraine'] },
    { country: 'Finland', iso2: 'FI', flag: '', capital: 'Helsinki', lat: 60.1699, lon: 24.9384, tz: 'Europe/Helsinki', aliases: ['finland'] },
    { country: 'Denmark', iso2: 'DK', flag: '', capital: 'Copenhagen', lat: 55.6761, lon: 12.5683, tz: 'Europe/Copenhagen', aliases: ['denmark'] },
    { country: 'Czechia', iso2: 'CZ', flag: '', capital: 'Prague', lat: 50.0755, lon: 14.4378, tz: 'Europe/Prague', aliases: ['czechia', 'czech republic'] },

    // ---- North America ----
    { country: 'United States of America', iso2: 'US', flag: '', capital: 'New York', lat: 40.7128, lon: -74.0060, tz: 'America/New_York', aliases: ['united states of america', 'united states', 'usa', 'us'] },
    { country: 'Canada', iso2: 'CA', flag: '', capital: 'Toronto', lat: 43.6532, lon: -79.3832, tz: 'America/Toronto', aliases: ['canada'] },
    { country: 'Mexico', iso2: 'MX', flag: '', capital: 'Mexico City', lat: 19.4326, lon: -99.1332, tz: 'America/Mexico_City', aliases: ['mexico'] },
    { country: 'Cuba', iso2: 'CU', flag: '', capital: 'Havana', lat: 23.1136, lon: -82.3666, tz: 'America/Havana', aliases: ['cuba'] },
    { country: 'Jamaica', iso2: 'JM', flag: '', capital: 'Kingston', lat: 17.9714, lon: -76.7936, tz: 'America/Jamaica', aliases: ['jamaica'] },
    { country: 'Panama', iso2: 'PA', flag: '', capital: 'Panama City', lat: 8.9824, lon: -79.5199, tz: 'America/Panama', aliases: ['panama'] },

    // ---- South America ----
    { country: 'Brazil', iso2: 'BR', flag: '', capital: 'Brasília', lat: -15.8267, lon: -47.9218, tz: 'America/Sao_Paulo', aliases: ['brazil'] },
    { country: 'Argentina', iso2: 'AR', flag: '', capital: 'Buenos Aires', lat: -34.6037, lon: -58.3816, tz: 'America/Argentina/Buenos_Aires', aliases: ['argentina'] },
    { country: 'Chile', iso2: 'CL', flag: '', capital: 'Santiago', lat: -33.4489, lon: -70.6693, tz: 'America/Santiago', aliases: ['chile'] },
    { country: 'Colombia', iso2: 'CO', flag: '', capital: 'Bogotá', lat: 4.7110, lon: -74.0721, tz: 'America/Bogota', aliases: ['colombia'] },
    { country: 'Peru', iso2: 'PE', flag: '', capital: 'Lima', lat: -12.0464, lon: -77.0428, tz: 'America/Lima', aliases: ['peru'] },
    { country: 'Venezuela', iso2: 'VE', flag: '', capital: 'Caracas', lat: 10.4806, lon: -66.9036, tz: 'America/Caracas', aliases: ['venezuela'] },
    { country: 'Ecuador', iso2: 'EC', flag: '', capital: 'Quito', lat: -0.1807, lon: -78.4678, tz: 'America/Guayaquil', aliases: ['ecuador'] },
    { country: 'Uruguay', iso2: 'UY', flag: '', capital: 'Montevideo', lat: -34.9011, lon: -56.1645, tz: 'America/Montevideo', aliases: ['uruguay'] },

    // ---- Africa ----
    { country: 'Egypt', iso2: 'EG', flag: '', capital: 'Cairo', lat: 30.0444, lon: 31.2357, tz: 'Africa/Cairo', aliases: ['egypt'] },
    { country: 'Nigeria', iso2: 'NG', flag: '', capital: 'Abuja', lat: 9.0765, lon: 7.3986, tz: 'Africa/Lagos', aliases: ['nigeria'] },
    { country: 'South Africa', iso2: 'ZA', flag: '', capital: 'Pretoria', lat: -25.7479, lon: 28.2293, tz: 'Africa/Johannesburg', aliases: ['south africa'] },
    { country: 'Kenya', iso2: 'KE', flag: '', capital: 'Nairobi', lat: -1.2921, lon: 36.8219, tz: 'Africa/Nairobi', aliases: ['kenya'] },
    { country: 'Morocco', iso2: 'MA', flag: '', capital: 'Rabat', lat: 34.0209, lon: -6.8416, tz: 'Africa/Casablanca', aliases: ['morocco'] },
    { country: 'Ethiopia', iso2: 'ET', flag: '', capital: 'Addis Ababa', lat: 9.0320, lon: 38.7469, tz: 'Africa/Addis_Ababa', aliases: ['ethiopia'] },
    { country: 'Ghana', iso2: 'GH', flag: '', capital: 'Accra', lat: 5.6037, lon: -0.1870, tz: 'Africa/Accra', aliases: ['ghana'] },
    { country: 'Algeria', iso2: 'DZ', flag: '', capital: 'Algiers', lat: 36.7538, lon: 3.0588, tz: 'Africa/Algiers', aliases: ['algeria'] },
    { country: 'Tanzania', iso2: 'TZ', flag: '', capital: 'Dodoma', lat: -6.1630, lon: 35.7516, tz: 'Africa/Dar_es_Salaam', aliases: ['tanzania', 'united republic of tanzania'] },
    { country: 'Tunisia', iso2: 'TN', flag: '', capital: 'Tunis', lat: 36.8065, lon: 10.1815, tz: 'Africa/Tunis', aliases: ['tunisia'] },

    // ---- Oceania ----
    { country: 'Australia', iso2: 'AU', flag: '', capital: 'Sydney', lat: -33.8688, lon: 151.2093, tz: 'Australia/Sydney', aliases: ['australia'] },
    { country: 'New Zealand', iso2: 'NZ', flag: '', capital: 'Wellington', lat: -41.2865, lon: 174.7762, tz: 'Pacific/Auckland', aliases: ['new zealand'] },
    { country: 'Fiji', iso2: 'FJ', flag: '', capital: 'Suva', lat: -18.1416, lon: 178.4419, tz: 'Pacific/Fiji', aliases: ['fiji'] },
    { country: 'Papua New Guinea', iso2: 'PG', flag: '', capital: 'Port Moresby', lat: -9.4438, lon: 147.1803, tz: 'Pacific/Port_Moresby', aliases: ['papua new guinea'] },
  ];

  // Extra independently-searchable cities (not national capitals) so search
  // isn't limited to capitals, per spec section 7.
  const EXTRA_CITIES = [
    { country: 'United States of America', iso2: 'US', flag: '', capital: 'Los Angeles', lat: 34.0522, lon: -118.2437, tz: 'America/Los_Angeles', aliases: [] },
    { country: 'United States of America', iso2: 'US', flag: '', capital: 'Chicago', lat: 41.8781, lon: -87.6298, tz: 'America/Chicago', aliases: [] },
    { country: 'India', iso2: 'IN', flag: '', capital: 'Mumbai', lat: 19.0760, lon: 72.8777, tz: 'Asia/Kolkata', aliases: [] },
    { country: 'India', iso2: 'IN', flag: '', capital: 'Bengaluru', lat: 12.9716, lon: 77.5946, tz: 'Asia/Kolkata', aliases: [] },
    { country: 'India', iso2: 'IN', flag: '', capital: 'Kolkata', lat: 22.5726, lon: 88.3639, tz: 'Asia/Kolkata', aliases: [] },
    { country: 'Australia', iso2: 'AU', flag: '', capital: 'Melbourne', lat: -37.8136, lon: 144.9631, tz: 'Australia/Melbourne', aliases: [] },
    { country: 'Canada', iso2: 'CA', flag: '', capital: 'Vancouver', lat: 49.2827, lon: -123.1207, tz: 'America/Vancouver', aliases: [] },
    { country: 'China', iso2: 'CN', flag: '', capital: 'Shanghai', lat: 31.2304, lon: 121.4737, tz: 'Asia/Shanghai', aliases: [] },
    { country: 'United Arab Emirates', iso2: 'AE', flag: '', capital: 'Abu Dhabi', lat: 24.4539, lon: 54.3773, tz: 'Asia/Dubai', aliases: [] },
    { country: 'Brazil', iso2: 'BR', flag: '', capital: 'São Paulo', lat: -23.5505, lon: -46.6333, tz: 'America/Sao_Paulo', aliases: [] },
    { country: 'United Kingdom', iso2: 'GB', flag: '', capital: 'Manchester', lat: 53.4808, lon: -2.2426, tz: 'Europe/London', aliases: [] },
    { country: 'Turkey', iso2: 'TR', flag: '', capital: 'Istanbul', lat: 41.0082, lon: 28.9784, tz: 'Europe/Istanbul', aliases: [] },
    { country: 'Russia', iso2: 'RU', flag: '', capital: 'Saint Petersburg', lat: 59.9311, lon: 30.3609, tz: 'Europe/Moscow', aliases: [] },
  ];

  const UPGRADE_CITIES = [
    { country: 'United States of America', iso2: 'US', flag: '', capital: 'Houston', lat: 29.7604, lon: -95.3698, tz: 'America/Chicago', aliases: [] },
    { country: 'United States of America', iso2: 'US', flag: '', capital: 'Phoenix', lat: 33.4484, lon: -112.0740, tz: 'America/Phoenix', aliases: [] },
    { country: 'United States of America', iso2: 'US', flag: '', capital: 'San Francisco', lat: 37.7749, lon: -122.4194, tz: 'America/Los_Angeles', aliases: [] },
    { country: 'United States of America', iso2: 'US', flag: '', capital: 'Seattle', lat: 47.6062, lon: -122.3321, tz: 'America/Los_Angeles', aliases: [] },
    { country: 'India', iso2: 'IN', flag: '', capital: 'Hyderabad', lat: 17.3850, lon: 78.4867, tz: 'Asia/Kolkata', aliases: [] },
    { country: 'India', iso2: 'IN', flag: '', capital: 'Chennai', lat: 13.0827, lon: 80.2707, tz: 'Asia/Kolkata', aliases: [] },
    { country: 'India', iso2: 'IN', flag: '', capital: 'Pune', lat: 18.5204, lon: 73.8567, tz: 'Asia/Kolkata', aliases: [] },
    { country: 'India', iso2: 'IN', flag: '', capital: 'Ahmedabad', lat: 23.0225, lon: 72.5714, tz: 'Asia/Kolkata', aliases: [] },
    { country: 'Japan', iso2: 'JP', flag: '', capital: 'Osaka', lat: 34.6937, lon: 135.5023, tz: 'Asia/Tokyo', aliases: [] },
    { country: 'Japan', iso2: 'JP', flag: '', capital: 'Kyoto', lat: 35.0116, lon: 135.7681, tz: 'Asia/Tokyo', aliases: [] },
    { country: 'Japan', iso2: 'JP', flag: '', capital: 'Yokohama', lat: 35.4437, lon: 139.6380, tz: 'Asia/Tokyo', aliases: [] },
    { country: 'Japan', iso2: 'JP', flag: '', capital: 'Nagoya', lat: 35.1815, lon: 136.9066, tz: 'Asia/Tokyo', aliases: [] },
    { country: 'United Kingdom', iso2: 'GB', flag: '', capital: 'Birmingham', lat: 52.4862, lon: -1.8904, tz: 'Europe/London', aliases: [] },
    { country: 'United Kingdom', iso2: 'GB', flag: '', capital: 'Liverpool', lat: 53.4084, lon: -2.9916, tz: 'Europe/London', aliases: [] },
    { country: 'United Kingdom', iso2: 'GB', flag: '', capital: 'Edinburgh', lat: 55.9533, lon: -3.1883, tz: 'Europe/London', aliases: [] },
  ];

  const INDIA_DISTRICT_CITIES = [
    ['Agra', 27.1767, 78.0081], ['Ajmer', 26.4499, 74.6399], ['Aligarh', 27.8974, 78.0880], ['Allahabad', 25.4358, 81.8463],
    ['Amritsar', 31.6340, 74.8723], ['Aurangabad', 19.8762, 75.3433], ['Bareilly', 28.3670, 79.4304], ['Bhopal', 23.2599, 77.4126],
    ['Bhubaneswar', 20.2961, 85.8245], ['Bikaner', 28.0229, 73.3119], ['Chandigarh', 30.7333, 76.7794], ['Coimbatore', 11.0168, 76.9558],
    ['Dehradun', 30.3165, 78.0322], ['Dhanbad', 23.7957, 86.4304], ['Faridabad', 28.4089, 77.3178], ['Ghaziabad', 28.6692, 77.4538],
    ['Gorakhpur', 26.7606, 83.3732], ['Gurugram', 28.4595, 77.0266], ['Guwahati', 26.1445, 91.7362], ['Gwalior', 26.2183, 78.1828],
    ['Indore', 22.7196, 75.8577], ['Jabalpur', 23.1815, 79.9864], ['Jaipur', 26.9124, 75.7873], ['Jalandhar', 31.3260, 75.5762],
    ['Jammu', 32.7266, 74.8570], ['Jamshedpur', 22.8046, 86.2029], ['Jodhpur', 26.2389, 73.0243], ['Kanpur', 26.4499, 80.3319],
    ['Kochi', 9.9312, 76.2673], ['Kozhikode', 11.2588, 75.7804], ['Lucknow', 26.8467, 80.9462], ['Ludhiana', 30.9010, 75.8573],
    ['Madurai', 9.9252, 78.1198], ['Meerut', 28.9845, 77.7064], ['Mysuru', 12.2958, 76.6394], ['Nagpur', 21.1458, 79.0882],
    ['Nashik', 19.9975, 73.7898], ['Noida', 28.5355, 77.3910], ['Patna', 25.5941, 85.1376], ['Prayagraj', 25.4358, 81.8463],
    ['Raipur', 21.2514, 81.6296], ['Rajkot', 22.3039, 70.8022], ['Ranchi', 23.3441, 85.3096], ['Srinagar', 34.0837, 74.7973],
    ['Surat', 21.1702, 72.8311], ['Thiruvananthapuram', 8.5241, 76.9366], ['Udaipur', 24.5854, 73.7125], ['Vadodara', 22.3072, 73.1812],
    ['Varanasi', 25.3176, 82.9739], ['Vijayawada', 16.5062, 80.6480], ['Visakhapatnam', 17.6868, 83.2185], ['Warangal', 17.9689, 79.5941],
    ['Adilabad', 19.6641, 78.5320], ['Ahmednagar', 19.0952, 74.7496], ['Aizawl', 23.7271, 92.7176], ['Akola', 20.7002, 77.0082],
    ['Alappuzha', 9.4981, 76.3388], ['Alwar', 27.5530, 76.6346], ['Ambala', 30.3782, 76.7767], ['Ambikapur', 23.1189, 83.1954],
    ['Anand', 22.5645, 72.9289], ['Anantapur', 14.6819, 77.6006], ['Anantnag', 33.7311, 75.1487], ['Arrah', 25.5560, 84.6603],
    ['Asansol', 23.6739, 86.9524], ['Azamgarh', 26.0737, 83.1859], ['Bagalkot', 16.1725, 75.6557], ['Bahraich', 27.5743, 81.5947],
    ['Balangir', 20.7074, 83.4843], ['Balasore', 21.4934, 86.9135], ['Ballia', 25.7585, 84.1489], ['Banda', 25.4763, 80.3397],
    ['Bankura', 23.2324, 87.0716], ['Baramulla', 34.2090, 74.3429], ['Baran', 25.1011, 76.5132], ['Bardhaman', 23.2324, 87.8615],
    ['Barmer', 25.7521, 71.3967], ['Bathinda', 30.2110, 74.9455], ['Begusarai', 25.4182, 86.1272], ['Belagavi', 15.8497, 74.4977],
    ['Bellary', 15.1394, 76.9214], ['Betul', 21.9108, 77.9012], ['Bhagalpur', 25.2425, 86.9842], ['Bharatpur', 27.2152, 77.5030],
    ['Bharuch', 21.7051, 72.9959], ['Bhavnagar', 21.7645, 72.1519], ['Bhilai', 21.1938, 81.3509], ['Bhilwara', 25.3463, 74.6364],
    ['Bhiwani', 28.7975, 76.1322], ['Bidar', 17.9104, 77.5199], ['Bijapur', 16.8302, 75.7100], ['Bijnor', 29.3724, 78.1358],
    ['Bilaspur', 22.0797, 82.1391], ['Bokaro', 23.6693, 86.1511], ['Budaun', 28.0337, 79.1205], ['Bulandshahr', 28.4069, 77.8498],
    ['Burhanpur', 21.3194, 76.2224], ['Buxar', 25.5647, 83.9777], ['Chamba', 32.5534, 76.1258], ['Chandrapur', 19.9615, 79.2961],
    ['Chhapra', 25.7802, 84.7471], ['Chhindwara', 22.0574, 78.9382], ['Chikkamagaluru', 13.3161, 75.7720], ['Chitradurga', 14.2251, 76.3980],
    ['Chittoor', 13.2172, 79.1003], ['Cuttack', 20.4625, 85.8830], ['Darbhanga', 26.1522, 85.8971], ['Darjeeling', 27.0410, 88.2663],
    ['Davangere', 14.4644, 75.9218], ['Deoghar', 24.4763, 86.6913], ['Dewas', 22.9676, 76.0534], ['Dharamshala', 32.2190, 76.3234],
    ['Dharwad', 15.4589, 75.0078], ['Dhule', 20.9042, 74.7749], ['Dibrugarh', 27.4728, 94.9120], ['Dimapur', 25.9091, 93.7266],
    ['Dindigul', 10.3673, 77.9803], ['Durgapur', 23.5204, 87.3119], ['Eluru', 16.7107, 81.0952], ['Erode', 11.3410, 77.7172],
    ['Etawah', 26.7769, 79.0213], ['Faizabad', 26.7730, 82.1458], ['Farrukhabad', 27.3905, 79.5801], ['Fatehpur', 25.9304, 80.8139],
    ['Firozabad', 27.1591, 78.3958], ['Gandhinagar', 23.2156, 72.6369], ['Gaya', 24.7914, 85.0002], ['Giridih', 24.1914, 86.2996],
    ['Godhra', 22.7788, 73.6143], ['Gonda', 27.1339, 81.9619], ['Gulbarga', 17.3297, 76.8343], ['Guntur', 16.3067, 80.4365],
    ['Haldwani', 29.2183, 79.5130], ['Hamirpur', 31.6862, 76.5213], ['Hapur', 28.7306, 77.7759], ['Hardoi', 27.3949, 80.1317],
    ['Haridwar', 29.9457, 78.1642], ['Hassan', 13.0033, 76.1004], ['Hazaribagh', 23.9926, 85.3616], ['Hisar', 29.1492, 75.7217],
    ['Hoshangabad', 22.7441, 77.7369], ['Hoshiarpur', 31.5328, 75.9120], ['Hubballi', 15.3647, 75.1240], ['Imphal', 24.8170, 93.9368],
    ['Itanagar', 27.0844, 93.6053], ['Jalgaon', 21.0077, 75.5626], ['Jalna', 19.8347, 75.8816], ['Jhansi', 25.4484, 78.5685],
    ['Jhunjhunu', 28.1289, 75.3995], ['Junagadh', 21.5222, 70.4579], ['Kadapa', 14.4673, 78.8242], ['Kakinada', 16.9891, 82.2475],
    ['Kancheepuram', 12.8342, 79.7036], ['Kannur', 11.8745, 75.3704], ['Karnal', 29.6857, 76.9905], ['Karur', 10.9601, 78.0766],
    ['Katni', 23.8343, 80.3894], ['Khandwa', 21.8257, 76.3526], ['Khargone', 21.8335, 75.6147], ['Kolhapur', 16.7050, 74.2433],
    ['Kollam', 8.8932, 76.6141], ['Korba', 22.3595, 82.7501], ['Kota', 25.2138, 75.8648], ['Kottayam', 9.5916, 76.5222],
    ['Kurnool', 15.8281, 78.0373], ['Kurukshetra', 29.9695, 76.8783], ['Latur', 18.4088, 76.5604], ['Leh', 34.1526, 77.5771],
    ['Malegaon', 20.5579, 74.5287], ['Mandi', 31.7085, 76.9320], ['Mangalore', 12.9141, 74.8560], ['Mathura', 27.4924, 77.6737],
    ['Moradabad', 28.8386, 78.7733], ['Morbi', 22.8173, 70.8377], ['Motihari', 26.6460, 84.9089], ['Muzaffarnagar', 29.4727, 77.7085],
    ['Muzaffarpur', 26.1197, 85.3910], ['Nadiad', 22.6916, 72.8634], ['Nanded', 19.1383, 77.3210], ['Nellore', 14.4426, 79.9865],
    ['Nizamabad', 18.6725, 78.0941], ['Ongole', 15.5057, 80.0499], ['Palakkad', 10.7867, 76.6548], ['Pali', 25.7711, 73.3234],
    ['Panipat', 29.3909, 76.9635], ['Pathankot', 32.2643, 75.6421], ['Puducherry', 11.9416, 79.8083], ['Puri', 19.8135, 85.8312],
    ['Purnia', 25.7771, 87.4753], ['Ratlam', 23.3315, 75.0367], ['Rewa', 24.5362, 81.3037], ['Rewari', 28.1990, 76.6183],
    ['Rohtak', 28.8955, 76.6066], ['Roorkee', 29.8543, 77.8880], ['Rourkela', 22.2604, 84.8536], ['Sagar', 23.8388, 78.7378],
    ['Saharanpur', 29.9671, 77.5510], ['Salem', 11.6643, 78.1460], ['Sambalpur', 21.4669, 83.9812], ['Satara', 17.6805, 74.0183],
    ['Satna', 24.6005, 80.8322], ['Shahjahanpur', 27.8837, 79.9122], ['Shimla', 31.1048, 77.1734], ['Shivamogga', 13.9299, 75.5681],
    ['Sikar', 27.6094, 75.1399], ['Silchar', 24.8333, 92.7789], ['Siliguri', 26.7271, 88.3953], ['Sirsa', 29.5336, 75.0177],
    ['Solapur', 17.6599, 75.9064], ['Sonipat', 28.9931, 77.0151], ['Tezpur', 26.6528, 92.7926], ['Thoothukudi', 8.7642, 78.1348],
    ['Thrissur', 10.5276, 76.2144], ['Tiruchirappalli', 10.7905, 78.7047], ['Tirunelveli', 8.7139, 77.7567], ['Tirupati', 13.6288, 79.4192],
    ['Tumakuru', 13.3379, 77.1173], ['Ujjain', 23.1765, 75.7885], ['Una', 31.4685, 76.2708], ['Vapi', 20.3893, 72.9106],
    ['Vellore', 12.9165, 79.1325], ['Vidisha', 23.5251, 77.8081], ['Yamunanagar', 30.1290, 77.2674],
  ].map(([capital, lat, lon]) => ({ country: 'India', iso2: 'IN', flag: '', capital, lat, lon, tz: 'Asia/Kolkata', aliases: [] }));

  const SEARCH_INDEX = [...LOCATIONS, ...EXTRA_CITIES, ...UPGRADE_CITIES, ...INDIA_DISTRICT_CITIES];

  const INDIA = LOCATIONS.find(l => l.iso2 === 'IN');
  const COMPARE_ACCENTS = ['cyan', 'purple', 'orange', 'green', 'gold', 'pink', 'blue', 'teal'];

  /* ======================================================================
     2. APP STATE
     ====================================================================== */
  const state = {
    selected: INDIA,
    unit: 'c',               // 'c' | 'f'
    headerRef: 'utc',        // 'utc' | 'ist'
    weather: null,           // last successful Open-Meteo payload for `selected`
    weatherCache: new Map(), // key "lat,lon" -> {data, ts}
    favorites: loadJSON('wp_favorites', []),
    recents: loadJSON('wp_recents', []),
    comparisonLocations: loadJSON('wp_compare_locations', []),
    newsCategory: 'all',
    newsCache: loadJSON('wp_news_cache', {}),
    isOffline: !navigator.onLine,
    timeTravelActive: false,
    timeTravelOffset: 0,
    activeWeatherController: null,
    activeNewsController: null,
    activeGeoController: null,
    geoCache: new Map(),
    mapReady: false,
    zoomBehavior: null,
  };

  const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
  const NEWS_CACHE_TTL_MS = 15 * 60 * 1000;
  const NEWS_FETCH_TIMEOUT_MS = 7000;
  const APP_CACHE_VERSION = '20260830-perfect-glass-1';

  /* ======================================================================
     3. GENERIC UTILITIES
     ====================================================================== */
  function loadJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) { return fallback; }
  }
  function saveJSON(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* storage unavailable — fail silently */ }
  }
  function clearLegacyCaches() {
    try {
      if (localStorage.getItem('wp_app_cache_version') === APP_CACHE_VERSION) return;
      localStorage.removeItem('wp_news_cache');
      localStorage.setItem('wp_app_cache_version', APP_CACHE_VERSION);
      if ('caches' in window) {
        caches.keys().then(keys => keys
          .filter(key => key.startsWith('world-pulse-'))
          .forEach(key => caches.delete(key)));
      }
    } catch (e) { /* cache APIs are optional */ }
  }
  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
  function round(v, d = 0) { const p = 10 ** d; return Math.round(v * p) / p; }
  function toF(c) { return c * 9 / 5 + 32; }
  function fmtTemp(celsius) {
    if (celsius === null || celsius === undefined || Number.isNaN(celsius)) return '--°';
    const v = state.unit === 'f' ? toF(celsius) : celsius;
    return `${round(v)}°`;
  }
  function normName(s) {
    return (s || '').toLowerCase().trim().replace(/^the\s+/, '').replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ');
  }
  function escapeHTML(s) {
    return String(s ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }
  function flagFor(iso2) {
    if (!iso2 || iso2.length !== 2) return '';
    return [...iso2.toUpperCase()].map(ch => String.fromCodePoint(127397 + ch.charCodeAt(0))).join('');
  }
  function locName(loc) { return `${loc.capital}, ${loc.country}`; }
  function encodedNewsQuery(loc, category = state.newsCategory) {
    const topic = category && category !== 'all' ? ` ${category}` : '';
    return `${loc.newsPlace || loc.capital} ${loc.country}${topic}`;
  }
  function isUsableNewsImage(url) {
    return /^https?:\/\//i.test(String(url || ''));
  }
  function newsImageUrl(item) {
    const image = String(item?.image || '').trim();
    if (!isUsableNewsImage(image)) return '';
    return `https://images.weserv.nl/?url=${encodeURIComponent(image.replace(/^https?:\/\//i, ''))}&w=960&h=540&fit=cover&output=webp`;
  }
  function newsArticlePreviewUrl(item) {
    const url = String(item?.url || '').trim();
    if (!isUsableNewsImage(url)) return '';
    return `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;
  }
  function proxiedNewsImageUrl(item) {
    return newsImageUrl(item);
  }
  function newsImageFallbackAttrs(item) {
    const fallbacks = [
      String(item?.image || '').trim(),
      newsArticlePreviewUrl(item),
    ].filter(isUsableNewsImage);
    if (!fallbacks.length) return '';
    return `data-fallback-srcs="${escapeHTML(fallbacks.join('|'))}" onerror="swapNewsImageFallback(this)"`;
  }
  function newsVisualMarkup(item, className) {
    const cover = newsImageUrl(item) || newsArticlePreviewUrl(item);
    const category = escapeHTML(item?.category || 'local');
    const source = escapeHTML(item?.source || 'News');
    if (cover) {
      return `<img class="${className}" src="${escapeHTML(cover)}" alt="" loading="lazy" referrerpolicy="no-referrer" ${newsImageFallbackAttrs(item)}>`;
    }
    return `<div class="${className} news-visual-fallback" data-news-visual="${category}" aria-hidden="true"><span>${category}</span><strong>${source}</strong><i></i></div>`;
  }
  function relativeTime(ts) {
    const delta = Date.now() - new Date(ts).getTime();
    if (!Number.isFinite(delta)) return 'recently';
    const mins = Math.max(0, Math.round(delta / 60000));
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    const days = Math.round(hours / 24);
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }
  function highlightMatch(value, query) {
    const text = escapeHTML(value);
    const q = String(query || '').trim();
    if (!q) return text;
    const idx = value.toLowerCase().indexOf(q.toLowerCase());
    if (idx < 0) return text;
    return `${escapeHTML(value.slice(0, idx))}<mark class="search-hit">${escapeHTML(value.slice(idx, idx + q.length))}</mark>${escapeHTML(value.slice(idx + q.length))}`;
  }
  function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371, toRad = d => d * Math.PI / 180;
    const dLat = toRad(lat2 - lat1), dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }
  function nearestLocation(lat, lon, pool = LOCATIONS) {
    let best = null, bestD = Infinity;
    for (const loc of pool) {
      const d = haversine(lat, lon, loc.lat, loc.lon);
      if (d < bestD) { bestD = d; best = loc; }
    }
    return { loc: best, distanceKm: bestD };
  }

  /* ---- timezone helpers (no hardcoded offsets — computed live) --------- */
  function tzOffsetMinutes(tz, date = new Date()) {
    try {
      const dtf = new Intl.DateTimeFormat('en-US', {
        timeZone: tz, hourCycle: 'h23',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
      });
      const p = dtf.formatToParts(date).reduce((acc, x) => (acc[x.type] = x.value, acc), {});
      const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour === 24 ? 0 : +p.hour, +p.minute, +p.second);
      return Math.round((asUTC - date.getTime()) / 60000);
    } catch (e) { return 0; }
  }
  function tzAbbrev(tz, date = new Date()) {
    try {
      const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short', hour: 'numeric' }).formatToParts(date);
      const p = parts.find(x => x.type === 'timeZoneName');
      return p ? p.value : tz;
    } catch (e) { return tz; }
  }
  function formatOffset(mins) {
    const sign = mins >= 0 ? '+' : '-';
    const abs = Math.abs(mins);
    return `UTC${sign}${String(Math.floor(abs / 60)).padStart(2, '0')}:${String(abs % 60).padStart(2, '0')}`;
  }
  function isDstObserved(tz) {
    const now = new Date();
    const jan = tzOffsetMinutes(tz, new Date(now.getFullYear(), 0, 1));
    const jul = tzOffsetMinutes(tz, new Date(now.getFullYear(), 6, 1));
    return jan !== jul;
  }
  function timeInZone(tz, date = new Date()) {
    return new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).format(date);
  }
  function dateInZone(tz, date = new Date()) {
    return new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(date);
  }

  /* ======================================================================
     4. WEATHER-CODE → CONDITION / ICON MAPPING (WMO codes, per Open-Meteo)
     ====================================================================== */
  const WEATHER_CODES = {
    0: { label: 'Clear Sky', icon: 'clear' },
    1: { label: 'Mainly Clear', icon: 'clear' },
    2: { label: 'Partly Cloudy', icon: 'partly-cloudy' },
    3: { label: 'Overcast', icon: 'cloudy' },
    45: { label: 'Fog', icon: 'fog' },
    48: { label: 'Rime Fog', icon: 'fog' },
    51: { label: 'Light Drizzle', icon: 'drizzle' },
    53: { label: 'Drizzle', icon: 'drizzle' },
    55: { label: 'Dense Drizzle', icon: 'drizzle' },
    56: { label: 'Freezing Drizzle', icon: 'drizzle' },
    57: { label: 'Dense Freezing Drizzle', icon: 'drizzle' },
    61: { label: 'Slight Rain', icon: 'rain' },
    63: { label: 'Rain', icon: 'rain' },
    65: { label: 'Heavy Rain', icon: 'heavy-rain' },
    66: { label: 'Freezing Rain', icon: 'rain' },
    67: { label: 'Heavy Freezing Rain', icon: 'heavy-rain' },
    71: { label: 'Slight Snow', icon: 'snow' },
    73: { label: 'Snow', icon: 'snow' },
    75: { label: 'Heavy Snow', icon: 'snow' },
    77: { label: 'Snow Grains', icon: 'snow' },
    80: { label: 'Slight Showers', icon: 'rain' },
    81: { label: 'Showers', icon: 'rain' },
    82: { label: 'Violent Showers', icon: 'heavy-rain' },
    85: { label: 'Slight Snow Showers', icon: 'snow' },
    86: { label: 'Heavy Snow Showers', icon: 'snow' },
    95: { label: 'Thunderstorm', icon: 'thunder' },
    96: { label: 'Thunderstorm + Hail', icon: 'thunder' },
    99: { label: 'Severe Thunderstorm', icon: 'thunder' },
  };
  function weatherInfo(code) { return WEATHER_CODES[code] || { label: 'Unknown', icon: 'cloudy' }; }

  function weatherIconSVG(kind, isDay = true) {
    const icons = {
      clear: isDay
        ? `<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="12" fill="currentColor"/><g stroke="currentColor" stroke-width="3" stroke-linecap="round">
             <line x1="32" y1="4" x2="32" y2="12"/><line x1="32" y1="52" x2="32" y2="60"/>
             <line x1="4" y1="32" x2="12" y2="32"/><line x1="52" y1="32" x2="60" y2="32"/>
             <line x1="12.7" y1="12.7" x2="18.3" y2="18.3"/><line x1="45.7" y1="45.7" x2="51.3" y2="51.3"/>
             <line x1="12.7" y1="51.3" x2="18.3" y2="45.7"/><line x1="45.7" y1="18.3" x2="51.3" y2="12.7"/>
           </g></svg>`
        : `<svg viewBox="0 0 64 64"><path d="M42 12a20 20 0 1 0 10 36 16 16 0 0 1-10-36Z" fill="currentColor"/></svg>`,
      'partly-cloudy': `<svg viewBox="0 0 64 64"><circle cx="26" cy="24" r="10" fill="currentColor" opacity="0.9"/><path class="wi-drift" d="M20 44a12 12 0 0 1 0-24 14 14 0 0 1 27-4 11 11 0 0 1-3 21.8H20Z" fill="currentColor"/></svg>`,
      cloudy: `<svg viewBox="0 0 64 64"><path class="wi-drift" d="M18 46a13 13 0 0 1 1-26 16 16 0 0 1 30-5 12.5 12.5 0 0 1-2 31H18Z" fill="currentColor"/></svg>`,
      fog: `<svg viewBox="0 0 64 64"><path d="M14 24a13 13 0 0 1 26-4 12 12 0 0 1 10 18H16" fill="currentColor" opacity="0.6"/><g stroke="currentColor" stroke-width="3" stroke-linecap="round" class="wi-drift"><line x1="10" y1="44" x2="54" y2="44"/><line x1="16" y1="52" x2="48" y2="52"/></g></svg>`,
      drizzle: `<svg viewBox="0 0 64 64"><path d="M18 38a13 13 0 0 1 1-26 16 16 0 0 1 30-3 12.5 12.5 0 0 1-2 29H18Z" fill="currentColor"/><g stroke="currentColor" stroke-width="3" stroke-linecap="round" class="wi-rain"><line x1="24" y1="48" x2="22" y2="56"/><line x1="34" y1="48" x2="32" y2="56"/><line x1="44" y1="48" x2="42" y2="56"/></g></svg>`,
      rain: `<svg viewBox="0 0 64 64"><path d="M18 36a13 13 0 0 1 1-26 16 16 0 0 1 30-2 12.5 12.5 0 0 1-2 28H18Z" fill="currentColor"/><g stroke="currentColor" stroke-width="3.5" stroke-linecap="round" class="wi-rain"><line x1="20" y1="46" x2="17" y2="58"/><line x1="32" y1="46" x2="29" y2="58"/><line x1="44" y1="46" x2="41" y2="58"/></g></svg>`,
      'heavy-rain': `<svg viewBox="0 0 64 64"><path d="M18 32a13 13 0 0 1 1-26 16 16 0 0 1 30-1 12.5 12.5 0 0 1-2 27H18Z" fill="currentColor"/><g stroke="currentColor" stroke-width="4" stroke-linecap="round" class="wi-rain-fast"><line x1="18" y1="42" x2="14" y2="58"/><line x1="30" y1="42" x2="26" y2="58"/><line x1="42" y1="42" x2="38" y2="58"/><line x1="50" y1="42" x2="46" y2="58"/></g></svg>`,
      snow: `<svg viewBox="0 0 64 64"><path d="M18 34a13 13 0 0 1 1-26 16 16 0 0 1 30-1 12.5 12.5 0 0 1-2 27H18Z" fill="currentColor"/><g stroke="currentColor" stroke-width="3" stroke-linecap="round" class="wi-snow"><line x1="22" y1="46" x2="22" y2="58"/><line x1="17" y1="52" x2="27" y2="52"/><line x1="42" y1="46" x2="42" y2="58"/><line x1="37" y1="52" x2="47" y2="52"/></g></svg>`,
      thunder: `<svg viewBox="0 0 64 64"><path d="M18 32a13 13 0 0 1 1-26 16 16 0 0 1 30-1 12.5 12.5 0 0 1-2 27H18Z" fill="currentColor"/><path d="M34 40l-8 12h6l-4 10 12-14h-6l4-8z" fill="#FACC15" class="wi-bolt"/></svg>`,
    };
    return icons[kind] || icons.cloudy;
  }

  /* ======================================================================
     5. MOON PHASE (calculated locally — Open-Meteo has no moon endpoint)
     ====================================================================== */
  function moonPhase(date = new Date()) {
    const synodic = 29.530588853;
    const knownNewMoon = Date.UTC(2000, 0, 6, 18, 14) / 1000;
    const days = (date.getTime() / 1000 - knownNewMoon) / 86400;
    let phase = (days % synodic) / synodic;
    if (phase < 0) phase += 1;
    return phase;
  }
  function moonPhaseName(phase) {
    if (phase < 0.03 || phase > 0.97) return 'New Moon';
    if (phase < 0.22) return 'Waxing Crescent';
    if (phase < 0.28) return 'First Quarter';
    if (phase < 0.47) return 'Waxing Gibbous';
    if (phase < 0.53) return 'Full Moon';
    if (phase < 0.72) return 'Waning Gibbous';
    if (phase < 0.78) return 'Last Quarter';
    return 'Waning Crescent';
  }
  function moonIllumination(phase) { return round((1 - Math.cos(2 * Math.PI * phase)) / 2 * 100); }

  /* ======================================================================
     6. WEATHER FETCHING (Open-Meteo — no API key required)
     ====================================================================== */
  async function getWeather(lat, lon, signal) {
    const key = `${round(lat, 2)},${round(lon, 2)}`;
    const cached = state.weatherCache.get(key);
    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) return cached.data;
    const stored = loadJSON(`wp_weather_${key}`, null);
    if (state.isOffline && stored?.data) return stored.data;

    const params = new URLSearchParams({
      latitude: lat, longitude: lon,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m',
      hourly: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,uv_index,visibility,precipitation,precipitation_probability',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,uv_index_max',
      timezone: 'auto',
      forecast_days: 7,
      past_days: 7,
    });
    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`Weather service returned ${res.status}`);
    const data = await res.json();
    state.weatherCache.set(key, { data, ts: Date.now() });
    saveJSON(`wp_weather_${key}`, { data, ts: Date.now() });
    return data;
  }

  /* ======================================================================
     7. UI: LOADING / ERROR STATES
     ====================================================================== */
  function showWeatherError(msg) {
    const el = document.getElementById('weather-error');
    el.textContent = msg;
    el.hidden = false;
  }
  function clearWeatherError() {
    document.getElementById('weather-error').hidden = true;
  }
  function setSkeleton(on) {
    document.querySelectorAll('.metric__value, #temp-value').forEach(el => {
      el.classList.toggle('skeleton-text', on);
    });
  }

  /* ======================================================================
     8. UI RENDER — LOCATION HEADER + CLOCKS
     ====================================================================== */
  function renderLocationHeader(loc) {
    document.getElementById('sel-country-flag-name').textContent = `${flagFor(loc.iso2)} ${loc.country}`;
    document.getElementById('sel-city-name').textContent = loc.capital;
    document.getElementById('forecast-loc-label').textContent = `${loc.capital}, ${loc.country}`;
    const snapshotLocation = document.getElementById('snapshot-location');
    if (snapshotLocation) snapshotLocation.textContent = `${loc.capital}, ${loc.country}`;
    const isFav = state.favorites.some(f => f.capital === loc.capital && f.country === loc.country);
    const favBtn = document.getElementById('fav-toggle');
    favBtn.setAttribute('aria-pressed', String(isFav));
  }

  function tickClocks() {
    const now = new Date();
    const loc = state.selected;

    document.getElementById('sel-time').textContent = timeInZone(loc.tz, now);
    document.getElementById('sel-date').textContent = dateInZone(loc.tz, now);
    const snapshotTime = document.getElementById('snapshot-time');
    const snapshotDate = document.getElementById('snapshot-date');
    if (snapshotTime) snapshotTime.textContent = timeInZone(loc.tz, now);
    if (snapshotDate) snapshotDate.textContent = dateInZone(loc.tz, now);
    document.getElementById('sel-tz-name').textContent = `${loc.tz.replace(/_/g, ' ')} · ${tzAbbrev(loc.tz, now)}`;
    document.getElementById('sel-tz-offset').textContent = formatOffset(tzOffsetMinutes(loc.tz, now));

    document.getElementById('india-time').textContent = timeInZone(INDIA.tz, now);

    const diffMins = tzOffsetMinutes(loc.tz, now) - tzOffsetMinutes(INDIA.tz, now);
    const badge = document.getElementById('time-diff-badge');
    if (Math.abs(diffMins) < 1) {
      badge.textContent = 'Same as IST';
    } else {
      const h = Math.floor(Math.abs(diffMins) / 60), m = Math.abs(diffMins) % 60;
      badge.textContent = `${diffMins > 0 ? '+' : '−'}${h}h${m ? ' ' + m + 'm' : ''}`;
    }

    // header reference clock
    const headerTz = state.headerRef === 'utc' ? 'UTC' : INDIA.tz;
    document.getElementById('header-clock').textContent = timeInZone(headerTz, now);
  }

  /* ======================================================================
     9. UI RENDER — CURRENT WEATHER, SUN/MOON, WIND, UV, HUMIDITY
     ====================================================================== */
  function updateWeatherUI(data, loc) {
    const cur = data.current;
    const info = weatherInfo(cur.weather_code);
    const isDay = cur.is_day === 1;

    document.getElementById('weather-icon').innerHTML = weatherIconSVG(info.icon, isDay);
    document.getElementById('temp-value').textContent = fmtTemp(cur.temperature_2m);
    document.getElementById('feels-like').textContent = `Feels like ${fmtTemp(cur.apparent_temperature)}`;
    document.getElementById('weather-condition').textContent = info.label;
    document.getElementById('snapshot-temp').textContent = fmtTemp(cur.temperature_2m);
    document.getElementById('snapshot-condition').textContent = info.label;
    document.getElementById('snapshot-wind').textContent = cur.wind_speed_10m != null ? `${round(cur.wind_speed_10m)} km/h` : '—';
    document.getElementById('snapshot-humidity').textContent = cur.relative_humidity_2m != null ? `Humidity ${round(cur.relative_humidity_2m)}%` : 'Humidity —';

    document.getElementById('m-humidity').textContent = cur.relative_humidity_2m != null ? `${round(cur.relative_humidity_2m)}%` : '—';
    document.getElementById('m-wind').textContent = cur.wind_speed_10m != null ? `${round(cur.wind_speed_10m)} km/h` : '—';
    document.getElementById('m-pressure').textContent = cur.pressure_msl != null ? `${round(cur.pressure_msl)} hPa` : '—';
    document.getElementById('m-cloud').textContent = cur.cloud_cover != null ? `${round(cur.cloud_cover)}%` : '—';

    // visibility + uv come from hourly (Open-Meteo doesn't expose them in `current`)
    const nowIdx = closestHourIndex(data);
    const visKm = nowIdx != null && data.hourly.visibility ? data.hourly.visibility[nowIdx] / 1000 : null;
    const uv = nowIdx != null && data.hourly.uv_index ? data.hourly.uv_index[nowIdx] : null;
    document.getElementById('m-visibility').textContent = visKm != null ? `${round(visKm, 1)} km` : '—';
    document.getElementById('m-uv').textContent = uv != null ? round(uv, 1) : '—';

    updateUVMeter(uv);
    updateHumidityRing(cur.relative_humidity_2m, cur.temperature_2m);
    updateWindCompass(cur.wind_speed_10m, cur.wind_direction_10m);

    // atmosphere grid
    document.getElementById('a-precip').textContent = cur.precipitation != null ? `${round(cur.precipitation, 1)} mm` : '—';
    document.getElementById('a-cloud').textContent = cur.cloud_cover != null ? `${round(cur.cloud_cover)}%` : '—';
    document.getElementById('a-pressure').textContent = cur.pressure_msl != null ? `${round(cur.pressure_msl)} hPa` : '—';
    document.getElementById('a-visibility').textContent = visKm != null ? `${round(visKm, 1)} km` : '—';
    document.getElementById('a-gust').textContent = cur.wind_gusts_10m != null ? `${round(cur.wind_gusts_10m)} km/h` : '—';
    const rainProb = data.daily.precipitation_probability_max ? data.daily.precipitation_probability_max[0] : null;
    document.getElementById('a-rainprob').textContent = rainProb != null ? `${round(rainProb)}%` : '—';

    updateSunMoon(data, loc);
    updateForecastUI(data);
    updateChart(data);
    renderTimeTravel();
    renderComparison();

    setSkeleton(false);
  }

  function closestHourIndex(data) {
    if (!data.hourly || !data.hourly.time) return null;
    const nowMs = Date.now();
    let best = 0, bestDiff = Infinity;
    data.hourly.time.forEach((t, i) => {
      const diff = Math.abs(new Date(t).getTime() - nowMs);
      if (diff < bestDiff) { bestDiff = diff; best = i; }
    });
    return best;
  }

  function updateUVMeter(uv) {
    const val = document.getElementById('uv-value');
    const label = document.getElementById('uv-label');
    const marker = document.getElementById('uv-bar-marker');
    if (uv == null) { val.textContent = '--'; label.textContent = '—'; marker.style.left = '0%'; return; }
    val.textContent = round(uv, 1);
    let cat = 'Low';
    if (uv >= 11) cat = 'Extreme'; else if (uv >= 8) cat = 'Very High'; else if (uv >= 6) cat = 'High'; else if (uv >= 3) cat = 'Moderate';
    label.textContent = cat;
    marker.style.left = `${clamp(uv / 12 * 100, 0, 100)}%`;
    marker.style.background = uvColor(uv);
    marker.style.boxShadow = `0 0 10px ${uvColor(uv)}`;
  }

  function uvColor(uv) {
    if (uv >= 11) return '#DB2777';
    if (uv >= 8) return '#EF4444';
    if (uv >= 6) return '#F97316';
    if (uv >= 3) return '#FACC15';
    return '#22C55E';
  }

  function updateHumidityRing(humidity, tempC) {
    const arc = document.getElementById('humidity-arc');
    const text = document.getElementById('humidity-pct-text');
    const dew = document.getElementById('dew-point-val');
    const r = 42, c = 2 * Math.PI * r;
    arc.style.strokeDasharray = `${c}`;
    if (humidity == null) { text.textContent = '--%'; arc.style.strokeDashoffset = c; return; }
    arc.style.strokeDashoffset = String(c - (humidity / 100) * c);
    text.textContent = `${round(humidity)}%`;
    if (tempC != null) {
      // Magnus-formula approximation — clearly a calculated value, not a live reading.
      const a = 17.62, b = 243.12;
      const gamma = Math.log(humidity / 100) + (a * tempC) / (b + tempC);
      const dp = (b * gamma) / (a - gamma);
      dew.textContent = fmtTemp(dp);
    } else {
      dew.textContent = '--°';
    }
  }

  function updateWindCompass(speed, dirDeg) {
    document.getElementById('wind-speed-val').textContent = speed != null ? round(speed) : '--';
    if (dirDeg == null) { document.getElementById('wind-dir-val').textContent = '—'; return; }
    const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const idx = Math.round(dirDeg / 22.5) % 16;
    document.getElementById('wind-dir-val').textContent = dirs[idx];
    document.getElementById('compass-needle').setAttribute('transform', `rotate(${dirDeg} 50 50)`);
  }

  function updateSunMoon(data, loc) {
    const sunrise = data.daily.sunrise ? data.daily.sunrise[0] : null;
    const sunset = data.daily.sunset ? data.daily.sunset[0] : null;
    document.getElementById('sunrise-val').textContent = sunrise ? timeInZone(loc.tz, new Date(sunrise)) : '—';
    document.getElementById('sunset-val').textContent = sunset ? timeInZone(loc.tz, new Date(sunset)) : '—';

    if (sunrise && sunset) {
      const mins = (new Date(sunset) - new Date(sunrise)) / 60000;
      document.getElementById('daylight-val').textContent = `${Math.floor(mins / 60)}h ${Math.round(mins % 60)}m`;
      document.getElementById('snapshot-daylight').textContent = `${Math.floor(mins / 60)}h ${Math.round(mins % 60)}m`;
      document.getElementById('snapshot-sun').textContent = `${timeInZone(loc.tz, new Date(sunrise))} to ${timeInZone(loc.tz, new Date(sunset))}`;

      // move the little sun indicator along the arc based on how far through the day we are
      const now = Date.now();
      const t = clamp((now - new Date(sunrise).getTime()) / (new Date(sunset).getTime() - new Date(sunrise).getTime()), 0, 1);
      const angle = Math.PI * (1 - t); // 180deg (sunrise) -> 0deg (sunset)
      const cx = 110, cy = 80, rx = 100, ry = 78;
      const x = cx - rx * Math.cos(angle);
      const y = cy - ry * Math.sin(angle);
      const sunEl = document.getElementById('sun-indicator');
      sunEl.setAttribute('cx', x.toFixed(1));
      sunEl.setAttribute('cy', y.toFixed(1));
      sunEl.setAttribute('fill', (now < new Date(sunrise).getTime() || now > new Date(sunset).getTime()) ? '#7C93B3' : '#FACC15');
    } else {
      document.getElementById('daylight-val').textContent = '—';
      document.getElementById('snapshot-daylight').textContent = '—';
      document.getElementById('snapshot-sun').textContent = 'Sun data unavailable';
    }

    const phase = moonPhase();
    document.getElementById('moon-phase-val').textContent = moonPhaseName(phase);
    document.getElementById('moon-illum-val').textContent = `${moonIllumination(phase)}%`;
    const moonFace = document.getElementById('moon-face');
    // shift the shadow horizontally to suggest the current phase (0=new,0.5=full)
    const offset = (phase <= 0.5 ? -1 : 1) * (1 - Math.abs(phase - 0.5) * 2) * 28 - (phase <= 0.5 ? 14 : -14);
    moonFace.style.boxShadow = `inset ${offset.toFixed(0)}px -6px 0 0 rgba(2,6,23,0.8), 0 0 20px rgba(148,197,255,0.25)`;
  }

  /* ======================================================================
     10. FORECAST + CHART
     ====================================================================== */
  function updateForecastUI(data) {
    const row = document.getElementById('forecast-row');
    if (!row) return;
    row.innerHTML = '';
    const daily = data.daily || {};
    const todayKey = String(data.current?.time || new Date().toISOString()).slice(0, 10);
    const startIndex = Math.max(0, (daily.time || []).findIndex(dateStr => dateStr >= todayKey));
    const days = (daily.time || []).slice(startIndex, startIndex + 5);

    if (!days.length) {
      row.innerHTML = '<div class="forecast-empty">5-day forecast is temporarily unavailable.</div>';
      return;
    }

    days.forEach((dateStr, offset) => {
      const i = startIndex + offset;
      const info = weatherInfo(daily.weather_code?.[i]);
      const d = new Date(dateStr + 'T12:00:00');
      const dayLabel = offset === 0 ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const rain = daily.precipitation_probability_max?.[i];
      const wind = daily.wind_speed_10m_max?.[i];
      const card = document.createElement('div');
      card.className = `forecast-card forecast-card--${info.icon}` + (offset === 0 ? ' is-today' : '');
      card.innerHTML = `
        <span class="forecast-card__day">${dayLabel}</span>
        <span class="forecast-card__date">${d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</span>
        <div class="forecast-card__icon">${weatherIconSVG(info.icon, true)}</div>
        <span class="forecast-card__temps">${fmtTemp(daily.temperature_2m_max?.[i])} <span class="lo">${fmtTemp(daily.temperature_2m_min?.[i])}</span></span>
        <span class="forecast-card__meta">Rain ${rain ?? '--'}%</span>
        <span class="forecast-card__meta">Wind ${wind == null ? '--' : round(wind)} km/h</span>
      `;
      row.appendChild(card);
    });
  }

  let chartHoverIdx = null;
  function updateChart(data) {
    const canvas = document.getElementById('temp-chart');
    const wrap = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = wrap.clientWidth * dpr;
    canvas.height = wrap.clientHeight * dpr;
    canvas.style.width = wrap.clientWidth + 'px';
    canvas.style.height = wrap.clientHeight + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const nowIdx = closestHourIndex(data);
    const start = state.timeTravelActive
      ? clamp((nowIdx ?? 0) + (state.timeTravelOffset * 24), 0, Math.max(0, data.hourly.temperature_2m.length - 24))
      : (nowIdx ?? 0);
    const temps = data.hourly.temperature_2m.slice(start, start + 24);
    const times = data.hourly.time.slice(start, start + 24);
    state._chartData = { temps, times };
    drawChart(ctx, wrap.clientWidth, wrap.clientHeight, temps, times, null);

    canvas.onmousemove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const idx = Math.round((x / rect.width) * (temps.length - 1));
      if (idx === chartHoverIdx) return;
      chartHoverIdx = clamp(idx, 0, temps.length - 1);
      drawChart(ctx, wrap.clientWidth, wrap.clientHeight, temps, times, chartHoverIdx);
      const tt = document.getElementById('chart-tooltip');
      tt.hidden = false;
      tt.style.left = x + 'px';
      tt.style.top = '10px';
      const hourLabel = new Date(times[chartHoverIdx]).toLocaleTimeString('en-US', { hour: 'numeric' });
      tt.textContent = `${hourLabel} · ${fmtTemp(temps[chartHoverIdx])}`;
    };
    canvas.onmouseleave = () => {
      chartHoverIdx = null;
      document.getElementById('chart-tooltip').hidden = true;
      drawChart(ctx, wrap.clientWidth, wrap.clientHeight, temps, times, null);
    };
  }

  function drawChart(ctx, w, h, temps, times, hoverIdx) {
    ctx.clearRect(0, 0, w, h);
    if (!temps.length) return;
    const styles = getComputedStyle(document.documentElement);
    const tempAccent = styles.getPropertyValue('--orange-400').trim() || '#FB923C';
    const tempGlow = styles.getPropertyValue('--saffron-400').trim() || '#F59E0B';
    const labelColor = styles.getPropertyValue('--text-dim').trim() || '#8EA1B5';
    const pointColor = styles.getPropertyValue('--text-hi').trim() || '#F8FAFC';
    const displayTemps = temps.map(t => state.unit === 'f' ? toF(t) : t);
    const pad = { top: 14, right: 10, bottom: 22, left: 6 };
    const min = Math.min(...displayTemps), max = Math.max(...displayTemps);
    const range = (max - min) || 1;
    const xAt = i => pad.left + (i / (temps.length - 1)) * (w - pad.left - pad.right);
    const yAt = v => pad.top + (1 - (v - min) / range) * (h - pad.top - pad.bottom);

    // gradient fill under the line
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, 'rgba(251,146,60,0.32)');
    grad.addColorStop(1, 'rgba(251,146,60,0)');

    ctx.beginPath();
    displayTemps.forEach((v, i) => { const x = xAt(i), y = yAt(v); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
    ctx.lineTo(xAt(temps.length - 1), h - pad.bottom);
    ctx.lineTo(xAt(0), h - pad.bottom);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.beginPath();
    displayTemps.forEach((v, i) => { const x = xAt(i), y = yAt(v); i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); });
    ctx.strokeStyle = tempAccent;
    ctx.lineWidth = 2.2;
    ctx.shadowColor = 'rgba(251,146,60,0.62)';
    ctx.shadowBlur = 8;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // hour labels every 4h
    ctx.fillStyle = labelColor;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    times.forEach((t, i) => {
      if (i % 4 !== 0) return;
      const label = new Date(t).toLocaleTimeString('en-US', { hour: 'numeric' });
      ctx.fillText(label, xAt(i), h - 6);
    });

    // current-point marker
    ctx.beginPath();
    ctx.arc(xAt(0), yAt(displayTemps[0]), 4, 0, Math.PI * 2);
    ctx.fillStyle = pointColor;
    ctx.fill();

    if (hoverIdx != null) {
      const x = xAt(hoverIdx), y = yAt(displayTemps[hoverIdx]);
      ctx.beginPath();
      ctx.moveTo(x, pad.top);
      ctx.lineTo(x, h - pad.bottom);
      ctx.strokeStyle = 'rgba(251,146,60,0.28)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = tempGlow;
      ctx.fill();
    }
  }

  /* ======================================================================
     10b. NEWS, ALERTS, TIME TRAVEL + COMPARISON
     ====================================================================== */
  function newsCacheKey(loc, category = state.newsCategory) {
    return `${loc.country}__${loc.capital}__${category}`.toLowerCase();
  }

  function newsTimestamp(item) {
    const time = new Date(item?.publishedAt || 0).getTime();
    return Number.isFinite(time) ? time : 0;
  }

  async function fetchLocationNews(loc, category, signal) {
    const providers = [
      fetchGdeltNews,
      fetchGdeltNewsJsonp,
      fetchGoogleNewsJson,
      fetchGoogleNewsRss,
      fetchBingNewsRss,
    ].map(provider => provider(loc, category, signal)
      .then(items => dedupeNewsItems(items).filter(item => item.title && item.url))
      .catch(err => {
        console.warn('News source unavailable', err);
        return [];
      }));
    const items = dedupeNewsItems((await Promise.all(providers)).flat());
    return items.sort((a, b) => newsTimestamp(b) - newsTimestamp(a));
  }

  function dedupeNewsItems(items) {
    const seen = new Set();
    return items.filter(item => {
      const key = normName(item.url || item.title);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 9);
  }

  async function fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), NEWS_FETCH_TIMEOUT_MS);
    const parentSignal = options.signal;
    if (parentSignal) {
      if (parentSignal.aborted) controller.abort();
      else parentSignal.addEventListener('abort', () => controller.abort(), { once: true });
    }
    try {
      return await fetch(url, { ...options, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  }

  async function fetchGdeltNews(loc, category, signal) {
    const res = await fetchWithTimeout(gdeltNewsUrl(loc, category), { signal });
    if (!res.ok) throw new Error(`News service returned ${res.status}`);
    return normalizeGdeltArticles(await res.json(), category);
  }

  async function fetchGdeltNewsJsonp(loc, category, signal) {
    const data = await fetchJsonp(gdeltNewsUrl(loc, category), 'callback', signal);
    return normalizeGdeltArticles(data, category);
  }

  function gdeltNewsUrl(loc, category) {
    const searchParts = category && category !== 'all'
      ? [`"${loc.capital}" ${category}`, `"${loc.country}" ${category}`]
      : [`"${loc.capital}"`, `"${loc.country}"`];
    const params = new URLSearchParams({
      query: searchParts.join(' OR '),
      mode: 'ArtList',
      format: 'json',
      maxrecords: '18',
      sort: 'DateDesc',
      timespan: '3d',
      sourcelang: 'english',
    });
    return `https://api.gdeltproject.org/api/v2/doc/doc?${params.toString()}`;
  }

  function normalizeGdeltArticles(data, category) {
    return (data.articles || []).map(article => ({
      title: article.title,
      description: article.seendate ? `Coverage detected ${relativeTime(article.seendate)}` : 'Location-relevant coverage from the publisher.',
      url: article.url,
      image: isUsableNewsImage(article.socialimage) ? article.socialimage : '',
      source: article.domain || 'Publisher',
      publishedAt: article.seendate || new Date().toISOString(),
      category: category === 'all' ? inferNewsCategory(article.title || '') : category,
    })).filter(item => item.title && item.url);
  }

  function fetchJsonp(url, callbackParam, signal) {
    return new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(new DOMException('Aborted', 'AbortError'));
        return;
      }
      const callbackName = `wpNewsJsonp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const script = document.createElement('script');
      const timeout = setTimeout(() => cleanup(() => reject(new Error('JSONP news request timed out'))), NEWS_FETCH_TIMEOUT_MS);
      const cleanup = (done) => {
        clearTimeout(timeout);
        delete window[callbackName];
        script.remove();
        signal?.removeEventListener('abort', onAbort);
        done();
      };
      const onAbort = () => cleanup(() => reject(new DOMException('Aborted', 'AbortError')));
      window[callbackName] = data => cleanup(() => resolve(data));
      script.onerror = () => cleanup(() => reject(new Error('JSONP news request failed')));
      script.src = `${url}${url.includes('?') ? '&' : '?'}${callbackParam}=${encodeURIComponent(callbackName)}`;
      signal?.addEventListener('abort', onAbort, { once: true });
      document.head.appendChild(script);
    });
  }

  async function fetchGoogleNewsRss(loc, category, signal) {
    const query = encodedNewsQuery(loc, category);
    const region = loc.iso2 || 'US';
    const rssUrl = `https://news.google.com/rss/search?${new URLSearchParams({
      q: query,
      hl: `en-${region}`,
      gl: region,
      ceid: `${region}:en`,
    }).toString()}`;
    const proxiedUrls = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(rssUrl)}`,
      `https://corsproxy.io/?url=${encodeURIComponent(rssUrl)}`,
    ];
    let xml = '';
    for (const proxiedUrl of proxiedUrls) {
      try {
        const res = await fetchWithTimeout(proxiedUrl, { signal });
        if (!res.ok) continue;
        xml = await res.text();
        if (xml) break;
      } catch (err) {
        console.warn('Google RSS proxy unavailable', err);
      }
    }
    if (!xml) throw new Error('Google RSS unavailable');
    return parseNewsRss(xml, category, 'Google News');
  }

  async function fetchGoogleNewsJson(loc, category, signal) {
    const query = encodedNewsQuery(loc, category);
    const region = loc.iso2 || 'US';
    const rssUrl = `https://news.google.com/rss/search?${new URLSearchParams({
      q: query,
      hl: `en-${region}`,
      gl: region,
      ceid: `${region}:en`,
    }).toString()}`;
    const res = await fetchWithTimeout(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`, { signal });
    if (!res.ok) throw new Error(`RSS JSON service returned ${res.status}`);
    const data = await res.json();
    return (data.items || []).slice(0, 9).map(item => ({
      title: item.title || '',
      description: stripHTML(item.description || item.content || '') || 'Location-relevant coverage from news publishers.',
      url: item.link || '',
      image: firstImageUrl(item.thumbnail || item.enclosure?.link || item.description || item.content || ''),
      source: item.author || data.feed?.title || 'Google News',
      publishedAt: item.pubDate || new Date().toISOString(),
      category: category === 'all' ? inferNewsCategory(item.title || '') : category,
    })).filter(item => item.title && item.url);
  }

  async function fetchBingNewsRss(loc, category, signal) {
    const rssUrl = `https://www.bing.com/news/search?${new URLSearchParams({
      q: encodedNewsQuery(loc, category),
      format: 'RSS',
    }).toString()}`;
    const res = await fetchWithTimeout(`https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`, { signal });
    if (!res.ok) throw new Error(`Bing RSS returned ${res.status}`);
    return parseNewsRss(await res.text(), category, 'Bing News');
  }

  function parseNewsRss(xml, category, fallbackSource) {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    if (doc.querySelector('parsererror')) throw new Error('News RSS could not be parsed');
    return [...doc.querySelectorAll('item')].slice(0, 9).map(item => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const source = item.querySelector('source')?.textContent || fallbackSource;
      const publishedAt = item.querySelector('pubDate')?.textContent || new Date().toISOString();
      const rawDescription = item.querySelector('description')?.textContent || '';
      const media = item.getElementsByTagName('media:thumbnail')[0]?.getAttribute('url')
        || item.getElementsByTagName('media:content')[0]?.getAttribute('url')
        || item.querySelector('enclosure')?.getAttribute('url')
        || '';
      return {
        title,
        description: stripHTML(rawDescription) || 'Location-relevant coverage from news publishers.',
        url: link,
        image: firstImageUrl(media || rawDescription),
        source: source || fallbackSource,
        publishedAt,
        category: category === 'all' ? inferNewsCategory(title) : category,
      };
    }).filter(item => item.title && item.url);
  }

  function stripHTML(value) {
    return String(value || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function firstImageUrl(value) {
    const text = decodeHTML(String(value || ''));
    const direct = isUsableNewsImage(text) ? text : '';
    const fromMarkup = text.match(/<img[^>]+src=["']([^"']+)["']/i)?.[1] || '';
    const fromUrlParam = text.match(/[?&](?:url|imgurl|mediaurl)=([^&"'\s]+)/i)?.[1] || '';
    const found = direct || fromMarkup || safeDecodeURIComponent(fromUrlParam);
    return isUsableNewsImage(found) ? found : '';
  }

  function decodeHTML(value) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = value;
    return textarea.value;
  }

  function safeDecodeURIComponent(value) {
    try { return decodeURIComponent(value || ''); }
    catch (e) { return value || ''; }
  }

  window.swapNewsImageFallback = function swapNewsImageFallback(img) {
    const sources = String(img?.dataset?.fallbackSrcs || '').split('|').filter(Boolean);
    const current = img.currentSrc || img.src || '';
    const next = sources.find(src => src && src !== current);
    if (next) {
      img.dataset.fallbackSrcs = sources.filter(src => src !== next).join('|');
      img.src = next;
      return;
    }
    const fallback = document.createElement('div');
    fallback.className = `${img.className} news-visual-fallback`;
    fallback.setAttribute('aria-hidden', 'true');
    fallback.innerHTML = '<span>News</span><strong>Publisher preview unavailable</strong><i></i>';
    img.replaceWith(fallback);
  };

  function inferNewsCategory(title) {
    const text = normName(title);
    if (/market|bank|stock|business|economy/.test(text)) return 'business';
    if (/tech|ai|software|cyber|startup/.test(text)) return 'technology';
    if (/science|space|climate|research/.test(text)) return 'science';
    if (/sport|match|league|cup/.test(text)) return 'sports';
    if (/election|minister|policy|government/.test(text)) return 'politics';
    if (/film|music|festival|celebrity/.test(text)) return 'entertainment';
    if (/health|hospital|disease|medical/.test(text)) return 'health';
    return 'local';
  }

  async function renderNews(loc, force = false) {
    const title = document.getElementById('news-title');
    const content = document.getElementById('news-content');
    if (!title || !content) return;
    title.textContent = `Latest From ${loc.capital}`;

    const key = newsCacheKey(loc);
    const cached = state.newsCache[key];
    const hasCachedItems = Array.isArray(cached?.items) && cached.items.length > 0;
    const fresh = hasCachedItems && Date.now() - cached.ts < NEWS_CACHE_TTL_MS;
    if (cached && !hasCachedItems) {
      delete state.newsCache[key];
      saveJSON('wp_news_cache', state.newsCache);
    }
    if (hasCachedItems && (fresh || state.isOffline || !force)) {
      renderNewsCards(cached.items, loc, cached.ts, !fresh);
      if (fresh || state.isOffline) return;
    }

    content.innerHTML = '<div class="news-empty"><div class="shimmer-line"></div><p>Loading verified publisher links...</p></div>';
    if (state.activeNewsController) state.activeNewsController.abort();
    const controller = new AbortController();
    state.activeNewsController = controller;
    try {
      const items = await fetchLocationNews(loc, state.newsCategory, controller.signal);
      if (controller.signal.aborted) return;
      state.newsCache[key] = { items, ts: Date.now() };
      saveJSON('wp_news_cache', state.newsCache);
      renderNewsCards(items, loc, Date.now(), false);
    } catch (err) {
      if (err.name === 'AbortError') return;
      if (hasCachedItems) renderNewsCards(cached.items, loc, cached.ts, true);
      else renderNewsCards([], loc, Date.now(), false);
    }
  }

  function renderNewsCards(items, loc, ts, stale) {
    const content = document.getElementById('news-content');
    if (!items.length) {
      content.innerHTML = `<div class="news-empty">No verified current news links found for ${escapeHTML(locName(loc))}. Try refreshing later.</div>`;
      return;
    }
    const sortedItems = [...items].sort((a, b) => newsTimestamp(b) - newsTimestamp(a));
    const [featured, ...rest] = sortedItems;
    const badge = stale ? `Cached · updated ${relativeTime(ts)}` : `Last updated ${relativeTime(ts)}`;
    content.innerHTML = `
      <article class="news-featured" data-category="${escapeHTML(featured.category)}">
        <div>
          <span class="news-kicker">${escapeHTML(featured.category)} · ${escapeHTML(featured.isSearchFallback ? 'Live search' : badge)}</span>
          <h3>${escapeHTML(featured.title)}</h3>
          <p class="news-meta">${escapeHTML(featured.source)} · ${relativeTime(featured.publishedAt)}</p>
          <p class="news-desc">${escapeHTML(featured.description)}</p>
          <a class="news-link" href="${escapeHTML(featured.url)}" target="_blank" rel="noopener">Read Article</a>
        </div>
      </article>
      <div class="news-list">
        ${rest.slice(0, 6).map(item => {
          return `
          <article class="news-item" data-category="${escapeHTML(item.category)}">
            <div class="news-item__body">
              <span class="news-kicker">${escapeHTML(item.category)}${item.isSearchFallback ? ' · Live search' : ''}</span>
              <h3>${escapeHTML(item.title)}</h3>
              <p class="news-meta">${escapeHTML(item.source)} · ${relativeTime(item.publishedAt)}</p>
              <a class="news-link" href="${escapeHTML(item.url)}" target="_blank" rel="noopener">Read Article</a>
            </div>
          </article>
        `;
        }).join('')}
      </div>
    `;
  }

  async function renderAlerts(loc) {
    const el = document.getElementById('alerts-status');
    if (!el) return;
    el.className = 'notice-card alert-card is-loading';
    el.innerHTML = alertCardMarkup({
      title: 'Weather Status',
      body: 'Checking verified severe-weather alert sources...',
      badge: 'Checking',
      meta: `${loc.capital}, ${loc.country}`,
    });
    if (loc.iso2 !== 'US') {
      renderConditionAlert(loc);
      return;
    }
    try {
      const point = await fetch(`https://api.weather.gov/points/${loc.lat},${loc.lon}`).then(r => r.ok ? r.json() : Promise.reject(r));
      const zone = point.properties?.forecastZone;
      if (!zone) throw new Error('No alert zone');
      const alerts = await fetch(`https://api.weather.gov/alerts/active?zone=${encodeURIComponent(zone.split('/').pop())}`).then(r => r.ok ? r.json() : Promise.reject(r));
      const features = alerts.features || [];
      if (!features.length) {
        el.className = 'notice-card alert-card notice-card--ok';
        el.innerHTML = alertCardMarkup({
          title: 'Weather Status',
          body: 'No active severe weather alerts for this location.',
          badge: 'No Alert',
          meta: `${loc.capital}, ${loc.country}`,
          href: 'https://www.weather.gov/',
          linkLabel: 'Open Weather.gov',
        });
        return;
      }
      const props = features[0].properties;
      el.className = 'notice-card alert-card notice-card--alert';
      el.innerHTML = alertCardMarkup({
        title: props.event || 'Severe Weather Alert',
        body: props.headline || props.description || 'See official alert source for details.',
        badge: 'Active',
        meta: `${loc.capital}, ${loc.country}`,
        href: props['@id'] || 'https://www.weather.gov/',
        linkLabel: 'Open Official Alert',
      });
    } catch (err) {
      renderConditionAlert(loc, true);
    }
  }

  function renderConditionAlert(loc, officialUnavailable = false) {
    const el = document.getElementById('alerts-status');
    if (!el) return;
    const current = locKey(loc) === locKey(state.selected) ? state.weather?.current : null;
    const weather = current ? weatherInfo(current.weather_code) : null;
    const wind = current?.wind_speed_10m;
    const precip = current?.precipitation;
    const rain = current?.rain;
    const showers = current?.showers;
    const isSevereCode = [65, 75, 82, 95, 96, 99].includes(current?.weather_code);
    const isHeavyWind = Number.isFinite(wind) && wind >= 45;
    const isHeavyPrecip = [precip, rain, showers].some(v => Number.isFinite(v) && v >= 10);
    const needsAttention = isSevereCode || isHeavyWind || isHeavyPrecip;
    const level = needsAttention ? 'notice-card--alert' : 'notice-card--ok';
    const sourceIntro = officialUnavailable
      ? 'Official alert feed could not be reached right now.'
      : loc.iso2 === 'IN'
        ? 'India alerts use the official IMD warning source.'
        : `Official alert feed for ${loc.country} is not connected inside this app.`;
    const observed = current
      ? `Observed now: ${weather?.label || 'Current weather'}${Number.isFinite(wind) ? `, wind ${round(wind)} km/h` : ''}${Number.isFinite(precip) && precip > 0 ? `, precipitation ${round(precip, 1)} mm` : ''}.`
      : 'Latest weather is still loading.';
    const signal = needsAttention
      ? 'Weather conditions look elevated. Check the official source before making plans.'
      : 'No severe-weather signal detected from current weather data.';
    el.className = `notice-card alert-card ${level}`;
    el.innerHTML = alertCardMarkup({
      title: needsAttention ? 'Weather Attention' : 'Weather Status',
      body: `${sourceIntro} ${observed} ${signal}`,
      badge: needsAttention ? 'Alert' : 'No Alert',
      meta: `${loc.capital}, ${loc.country}`,
      href: alertSourceUrl(loc),
      linkLabel: alertSourceLabel(loc),
    });
  }

  function alertCardMarkup({ title, body, badge, meta, href, linkLabel }) {
    return `
      <div class="alert-card__main">
        <span class="alert-card__badge">${escapeHTML(badge)}</span>
        <div class="alert-card__content">
          <div class="notice-card__title">${escapeHTML(title)}</div>
          <div class="notice-card__body">${escapeHTML(body)}</div>
          ${meta ? `<div class="alert-card__meta">${escapeHTML(meta)}</div>` : ''}
        </div>
      </div>
      ${href ? `<a class="notice-card__link alert-card__action" href="${escapeHTML(href)}" target="_blank" rel="noopener">${escapeHTML(linkLabel || 'Open official source')}</a>` : ''}
    `;
  }

  function alertSourceUrl(loc) {
    const officialSources = {
      IN: 'https://mausam.imd.gov.in/imd_latest/contents/subdivisionwise-warning.php',
      GB: 'https://www.metoffice.gov.uk/weather/warnings-and-advice/uk-warnings',
      CA: 'https://weather.gc.ca/warnings/index_e.html',
      AU: 'https://www.bom.gov.au/australia/warnings/',
      NZ: 'https://www.metservice.com/warnings/home',
      JP: 'https://www.jma.go.jp/bosai/warning/',
    };
    return officialSources[loc.iso2] || `https://www.google.com/search?${new URLSearchParams({ q: `${loc.country} official weather alerts` }).toString()}`;
  }

  function alertSourceLabel(loc) {
    return loc.iso2 === 'IN' ? 'Open IMD warnings' : 'Open official weather source';
  }

  function renderTimeTravel() {
    const body = document.getElementById('time-travel-body');
    if (!body || !state.weather) return;
    body.hidden = !state.timeTravelActive;
    const label = document.getElementById('time-travel-label');
    const offset = state.timeTravelOffset;
    label.textContent = offset === 0 ? 'Current' : offset < 0 ? `${Math.abs(offset)} day${offset === -1 ? '' : 's'} past` : `${offset} day${offset === 1 ? '' : 's'} future`;
    const idx = clamp((closestHourIndex(state.weather) ?? 0) + offset * 24, 0, state.weather.hourly.time.length - 1);
    document.getElementById('tt-temp').textContent = fmtTemp(state.weather.hourly.temperature_2m?.[idx]);
    document.getElementById('tt-feels').textContent = fmtTemp(state.weather.hourly.apparent_temperature?.[idx]);
    document.getElementById('tt-precip').textContent = `${round(state.weather.hourly.precipitation?.[idx] ?? 0, 1)} mm`;
    document.getElementById('tt-humidity').textContent = `${round(state.weather.hourly.relative_humidity_2m?.[idx] ?? 0)}%`;
    document.getElementById('tt-wind').textContent = `${round(state.weather.hourly.wind_speed_10m?.[idx] ?? 0)} km/h`;
    document.getElementById('tt-uv').textContent = round(state.weather.hourly.uv_index?.[idx] ?? 0, 1);
  }

  function comparisonAccent(loc) {
    let hash = 0;
    for (const ch of locKey(loc)) hash = ((hash << 5) - hash + ch.charCodeAt(0)) | 0;
    return COMPARE_ACCENTS[Math.abs(hash) % COMPARE_ACCENTS.length];
  }

  function renderComparison() {
    const body = document.getElementById('compare-body');
    if (!body) return;
    if (!state.comparisonLocations.length) {
      body.innerHTML = '<tr><td colspan="9">Add the current location to start comparing cities.</td></tr>';
      return;
    }
    body.innerHTML = state.comparisonLocations.map(loc => {
      const accent = comparisonAccent(loc);
      return `<tr class="compare-row compare-row--${accent}">
        <td>${flagFor(loc.iso2)} ${escapeHTML(loc.capital)}<br><span>${escapeHTML(loc.country)}</span></td>
        <td>${timeInZone(loc.tz)}</td>
        <td>${timeInZone(INDIA.tz)}</td>
        <td data-compare-temp="${escapeHTML(locKey(loc))}">--</td>
        <td data-compare-weather="${escapeHTML(locKey(loc))}">Loading</td>
        <td data-compare-humidity="${escapeHTML(locKey(loc))}">--</td>
        <td data-compare-wind="${escapeHTML(locKey(loc))}">--</td>
        <td data-compare-uv="${escapeHTML(locKey(loc))}">--</td>
        <td><button class="compare-remove" data-key="${escapeHTML(locKey(loc))}" type="button">Remove</button></td>
      </tr>`;
    }).join('');
    body.querySelectorAll('.compare-remove').forEach(btn => btn.addEventListener('click', () => {
      state.comparisonLocations = state.comparisonLocations.filter(loc => locKey(loc) !== btn.dataset.key);
      saveJSON('wp_compare_locations', state.comparisonLocations);
      renderComparison();
    }));
    hydrateComparisonWeather();
  }

  async function hydrateComparisonWeather() {
    for (const loc of state.comparisonLocations) {
      try {
        const data = locKey(loc) === locKey(state.selected) && state.weather ? state.weather : await getWeather(loc.lat, loc.lon);
        const cur = data.current;
        const nowIdx = closestHourIndex(data);
        const uv = nowIdx != null ? data.hourly.uv_index?.[nowIdx] : null;
        const key = locKey(loc);
        setCompareCell('temp', key, fmtTemp(cur.temperature_2m));
        setCompareCell('weather', key, weatherInfo(cur.weather_code).label);
        setCompareCell('humidity', key, `${round(cur.relative_humidity_2m ?? 0)}%`);
        setCompareCell('wind', key, `${round(cur.wind_speed_10m ?? 0)} km/h`);
        setCompareCell('uv', key, uv != null ? round(uv, 1) : '--');
      } catch (err) {
        setCompareCell('weather', locKey(loc), 'Unavailable');
      }
    }
  }

  function setCompareCell(type, key, value) {
    const attr = `data-compare-${type}`;
    const cell = [...document.querySelectorAll(`[${attr}]`)].find(el => el.getAttribute(attr) === key);
    if (cell) cell.textContent = value;
  }

  /* ======================================================================
     11. SELECT LOCATION — the central orchestrator
     ====================================================================== */
  async function selectLocation(loc, opts = {}) {
    if (state.activeWeatherController) state.activeWeatherController.abort();
    const controller = new AbortController();
    state.activeWeatherController = controller;
    state.selected = loc;
    renderLocationHeader(loc);
    updateMapSelection(loc);
    tickClocks();
    setSkeleton(true);
    clearWeatherError();

    if (!opts.skipRecent) pushRecent(loc);
    renderChipRows();
    renderNews(loc);
    renderAlerts(loc);

    try {
      const data = await getWeather(loc.lat, loc.lon, controller.signal);
      if (controller.signal.aborted) return;
      state.weather = data;
      updateWeatherUI(data, loc);
      renderAlerts(loc);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error(err);
      const key = `${round(loc.lat, 2)},${round(loc.lon, 2)}`;
      const stored = loadJSON(`wp_weather_${key}`, null);
      if (stored?.data) {
        state.weather = stored.data;
        updateWeatherUI(stored.data, loc);
        showWeatherError(`Offline mode. Showing last known weather from ${new Date(stored.ts).toLocaleString()}.`);
        return;
      }
      showWeatherError('Weather data temporarily unavailable. Showing time information only.');
      setSkeleton(false);
    }
  }

  /* ======================================================================
     12. SEARCH
     ====================================================================== */
  const searchInput = document.getElementById('search-input');
  const searchResultsEl = document.getElementById('search-results');
  let activeResultIdx = -1;
  let currentResults = [];
  const EXACT_LOCATION_OPTION = {
    type: 'exact-location',
    capital: 'Use exact location',
    country: 'GPS based weather',
    iso2: '',
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  };

  function searchLocations(query) {
    const raw = String(query || '').trim();
    const q = normName(raw);
    const isoQ = raw.toUpperCase();
    if (!q) return [];
    return SEARCH_INDEX
      .map(loc => {
        const name = normName(loc.capital);
        const country = normName(loc.country);
        const tz = normName(loc.tz.replace(/_/g, ' '));
        const aliases = (loc.aliases || []).map(normName);
        let score = -1;
        if (loc.iso2 === isoQ) score = 120;
        else if (name.startsWith(q)) score = 110;
        else if (country.startsWith(q)) score = 100;
        else if (aliases.some(a => a.startsWith(q))) score = 95;
        else if (name.includes(q)) score = 80;
        else if (country.includes(q)) score = 70;
        else if (tz.includes(q)) score = 55;
        return { loc, score };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(r => r.loc);
  }

  async function searchOnlineLocations(query) {
    const raw = String(query || '').trim();
    if (raw.length < 3 || state.isOffline) return [];
    const cacheKey = raw.toLowerCase();
    if (state.geoCache.has(cacheKey)) return state.geoCache.get(cacheKey);
    if (state.activeGeoController) state.activeGeoController.abort();
    const controller = new AbortController();
    state.activeGeoController = controller;
    const params = new URLSearchParams({
      name: raw,
      count: '10',
      language: 'en',
      format: 'json',
    });
    try {
      const res = await fetchWithTimeout(`https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`, { signal: controller.signal });
      if (!res.ok) return [];
      const data = await res.json();
      const locations = (data.results || []).map(place => ({
        country: place.country || place.country_code || 'Unknown',
        iso2: place.country_code || '',
        flag: '',
        capital: place.name,
        lat: place.latitude,
        lon: place.longitude,
        tz: place.timezone || 'UTC',
        aliases: [place.admin1, place.admin2, place.admin3].filter(Boolean),
        admin: [place.admin1, place.admin2].filter(Boolean).join(', '),
      })).filter(loc => loc.capital && Number.isFinite(loc.lat) && Number.isFinite(loc.lon));
      state.geoCache.set(cacheKey, locations);
      return locations;
    } catch (err) {
      if (err.name !== 'AbortError') console.warn('City search unavailable', err);
      return [];
    }
  }

  function mergeLocationResults(primary, secondary) {
    const seen = new Set();
    return [...primary, ...secondary].filter(loc => {
      const key = `${normName(loc.capital)}__${normName(loc.country)}__${round(loc.lat, 2)}__${round(loc.lon, 2)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 10);
  }

  function renderSearchResults(results, includeExact = true) {
    currentResults = includeExact ? [EXACT_LOCATION_OPTION, ...results] : results;
    activeResultIdx = currentResults.length ? 0 : -1;
    if (!currentResults.length) { searchResultsEl.hidden = true; searchResultsEl.innerHTML = ''; return; }
    searchResultsEl.innerHTML = currentResults.map((loc, i) => `
      <div class="search-result${loc.type === 'exact-location' ? ' search-result--exact' : ''}${i === activeResultIdx ? ' is-active' : ''}" role="option" data-idx="${i}">
        <span><strong>${flagFor(loc.iso2)} ${escapeHTML(loc.capital)}</strong> · ${escapeHTML(loc.country)}${loc.admin ? ` · ${escapeHTML(loc.admin)}` : ''}</span>
        <span>${loc.type === 'exact-location' ? 'GPS' : escapeHTML(loc.tz.split('/').pop().replace(/_/g, ' '))}</span>
      </div>
    `).join('');
    searchResultsEl.hidden = false;
    searchInput.setAttribute('aria-expanded', 'true');
  }

  searchInput.addEventListener('input', debounce(async (e) => {
    const query = e.target.value;
    const localResults = searchLocations(query);
    renderSearchResults(localResults);
    const onlineResults = await searchOnlineLocations(query);
    if (query !== searchInput.value) return;
    renderSearchResults(mergeLocationResults(localResults, onlineResults));
  }, 220));

  searchInput.addEventListener('focus', () => {
    if (!searchInput.value.trim()) renderSearchResults([]);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (searchResultsEl.hidden) return;
    const items = [...searchResultsEl.querySelectorAll('.search-result')];
    if (e.key === 'ArrowDown') { e.preventDefault(); activeResultIdx = Math.min(activeResultIdx + 1, items.length - 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); activeResultIdx = Math.max(activeResultIdx - 1, 0); }
    else if (e.key === 'Enter') { e.preventDefault(); if (currentResults[activeResultIdx]) commitSearchSelection(currentResults[activeResultIdx]); return; }
    else if (e.key === 'Escape') { closeSearch(); return; }
    else return;
    items.forEach((el, i) => el.classList.toggle('is-active', i === activeResultIdx));
    items[activeResultIdx]?.scrollIntoView({ block: 'nearest' });
  });

  searchResultsEl.addEventListener('click', (e) => {
    const item = e.target.closest('.search-result');
    if (!item) return;
    commitSearchSelection(currentResults[+item.dataset.idx]);
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.header__search')) closeSearch();
  });

  function closeSearch() {
    searchResultsEl.hidden = true;
    searchInput.setAttribute('aria-expanded', 'false');
  }
  function commitSearchSelection(loc) {
    if (loc?.type === 'exact-location') {
      useExactLocation();
      return;
    }
    searchInput.value = '';
    closeSearch();
    selectLocation(loc);
    centerMapOn(loc);
  }

  function useExactLocation() {
    searchInput.value = '';
    closeSearch();
    if (!('geolocation' in navigator)) {
      showWeatherError('Exact location is not available in this browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const { loc: nearest } = nearestLocation(latitude, longitude, SEARCH_INDEX);
        const exactLoc = {
          country: nearest?.country || 'Current Location',
          iso2: nearest?.iso2 || '',
          flag: '',
          capital: 'Exact Location',
          lat: latitude,
          lon: longitude,
          tz: nearest?.tz || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          aliases: [],
          admin: nearest ? `Near ${nearest.capital}` : '',
          newsPlace: nearest?.capital || 'current location',
        };
        selectLocation(exactLoc);
        centerMapOn(exactLoc);
      },
      () => showWeatherError('Location permission was denied or unavailable.'),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }

  /* ======================================================================
     13. FAVORITES + RECENTS
     ====================================================================== */
  function locKey(loc) { return `${loc.country}__${loc.capital}`; }

  function pushRecent(loc) {
    state.recents = [loc, ...state.recents.filter(r => locKey(r) !== locKey(loc))].slice(0, 6);
    saveJSON('wp_recents', state.recents);
  }
  function toggleFavorite(loc) {
    const exists = state.favorites.some(f => locKey(f) === locKey(loc));
    state.favorites = exists ? state.favorites.filter(f => locKey(f) !== locKey(loc)) : [...state.favorites, loc];
    saveJSON('wp_favorites', state.favorites);
    document.getElementById('fav-toggle').setAttribute('aria-pressed', String(!exists));
    renderChipRows();
  }
  function renderChipRows() {
    const favList = document.getElementById('favorites-list');
    favList.innerHTML = state.favorites.map(loc => `<button class="chip chip--favorite" data-key="${escapeHTML(locKey(loc))}">★ ${flagFor(loc.iso2)} ${escapeHTML(loc.capital)}</button>`).join('') || `<span class="trio__sub">None yet — tap the star to add one</span>`;
    favList.querySelectorAll('.chip').forEach((btn, i) => btn.addEventListener('click', () => { selectLocation(state.favorites[i]); centerMapOn(state.favorites[i]); }));

    const recList = document.getElementById('recents-list');
    recList.innerHTML = state.recents.map(loc => `<button class="chip" data-key="${escapeHTML(locKey(loc))}">${flagFor(loc.iso2)} ${escapeHTML(loc.capital)}</button>`).join('');
    recList.querySelectorAll('.chip').forEach((btn, i) => btn.addEventListener('click', () => { selectLocation(state.recents[i]); centerMapOn(state.recents[i]); }));
    document.getElementById('clear-recents').hidden = state.recents.length === 0;
  }
  document.getElementById('clear-recents').addEventListener('click', () => {
    state.recents = [];
    saveJSON('wp_recents', []);
    renderChipRows();
  });
  document.getElementById('fav-toggle').addEventListener('click', () => toggleFavorite(state.selected));

  /* ======================================================================
     14. HEADER TOGGLES
     ====================================================================== */
  document.querySelectorAll('[data-unit]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-unit]').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.unit = btn.dataset.unit;
      if (state.weather) updateWeatherUI(state.weather, state.selected);
    });
  });
  document.querySelectorAll('[data-ref-clock]').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-ref-clock]').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.headerRef = btn.dataset.refClock;
    });
  });

  document.querySelectorAll('.news-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.news-filter').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      state.newsCategory = btn.dataset.newsCategory;
      renderNews(state.selected, false);
    });
  });
  document.getElementById('news-refresh').addEventListener('click', () => renderNews(state.selected, true));

  const timeTravelToggle = document.getElementById('time-travel-toggle');
  const timeTravelSlider = document.getElementById('time-travel-slider');
  if (timeTravelToggle && timeTravelSlider) {
    timeTravelToggle.addEventListener('click', (e) => {
      state.timeTravelActive = !state.timeTravelActive;
      e.currentTarget.setAttribute('aria-pressed', String(state.timeTravelActive));
      e.currentTarget.textContent = state.timeTravelActive ? 'Active' : 'Activate';
      renderTimeTravel();
      if (state.weather) updateChart(state.weather);
    });
    timeTravelSlider.addEventListener('input', (e) => {
      state.timeTravelOffset = Number(e.target.value);
      renderTimeTravel();
      if (state.weather) updateChart(state.weather);
    });
  }

  document.getElementById('compare-add').addEventListener('click', () => {
    if (!state.comparisonLocations.some(loc => locKey(loc) === locKey(state.selected))) {
      state.comparisonLocations = [...state.comparisonLocations, state.selected].slice(-6);
      saveJSON('wp_compare_locations', state.comparisonLocations);
      renderComparison();
    }
  });
  document.getElementById('compare-clear').addEventListener('click', () => {
    state.comparisonLocations = [];
    saveJSON('wp_compare_locations', []);
    renderComparison();
  });

  function updateConnectionStatus() {
    state.isOffline = !navigator.onLine;
    const pill = document.getElementById('connection-status');
    pill.classList.toggle('is-offline', state.isOffline);
    pill.querySelector('.status-pill__label').textContent = state.isOffline ? 'Offline · cached data' : 'Live Global Data';
  }
  window.addEventListener('online', () => { updateConnectionStatus(); selectLocation(state.selected, { skipRecent: true }); });
  window.addEventListener('offline', updateConnectionStatus);

  /* ======================================================================
     15. GEOLOCATION ("Locate Me")
     ====================================================================== */
  document.getElementById('map-locate').addEventListener('click', useExactLocation);

  /* ======================================================================
     16. MAP — D3 render, zoom/pan, hover tooltip, click-to-select
     ====================================================================== */
  const MAP_W = 960, MAP_H = 500;
  let projection, pathGen, gMap, gCities, svgSel, zoomBehavior;

  async function initMap() {
    svgSel = d3.select('#world-map');
    gMap = svgSel.append('g').attr('class', 'g-countries');
    gCities = svgSel.append('g').attr('class', 'g-cities');

    projection = d3.geoNaturalEarth1().scale(160).translate([MAP_W / 2, MAP_H / 2 + 20]);
    pathGen = d3.geoPath(projection);

    let features = null;
    let hasNames = false;

    try {
      const geo = await d3.json('assets/map/world-v1.geojson');
      features = geo.features;
      hasNames = true;
    } catch (localMapErr) {
      try {
        const geo = await d3.json('https://cdn.jsdelivr.net/gh/holtzy/D3-graph-gallery@master/DATA/world.geojson');
        features = geo.features;
        hasNames = true;
      } catch (e1) {
        try {
          const topo = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json');
          features = topojson.feature(topo, topo.objects.countries).features;
          hasNames = false;
        } catch (e2) {
          console.error('Map geometry failed to load', localMapErr, e1, e2);
          renderFallbackDotMap();
          return;
        }
      }
    }

    projection.fitSize([MAP_W - 20, MAP_H - 20], { type: 'FeatureCollection', features });

    gMap.selectAll('path.country-shape')
      .data(features)
      .enter()
      .append('path')
      .attr('class', 'country-shape')
      .attr('d', pathGen)
      .each(function (f) {
        const match = hasNames ? matchByName(f.properties && (f.properties.name || f.properties.NAME || f.properties.admin))
          : null;
        const resolved = match || matchByCentroid(f);
        f.__wp_location = resolved;
        if (!resolved) d3.select(this).classed('is-unmapped', true);
      })
      .on('mousemove', onCountryHover)
      .on('mouseleave', hideTooltip)
      .on('click', onCountryClick);

    plotCityDots();

    zoomBehavior = d3.zoom().scaleExtent([1, 8]).on('zoom', (event) => {
      gMap.attr('transform', event.transform);
      gCities.attr('transform', event.transform);
    });
    svgSel.call(zoomBehavior);

    state.mapReady = true;
    document.getElementById('map-loading').classList.add('is-hidden');
    updateMapSelection(state.selected);
  }

  function matchByName(rawName) {
    if (!rawName) return null;
    const n = normName(rawName);
    return LOCATIONS.find(l => l.aliases.includes(n) || normName(l.country) === n) || null;
  }
  function matchByCentroid(feature) {
    try {
      const [lon, lat] = d3.geoCentroid(feature);
      const { loc, distanceKm } = nearestLocation(lat, lon, LOCATIONS);
      return distanceKm < 900 ? loc : null; // keep matches geographically plausible
    } catch (e) { return null; }
  }

  function plotCityDots() {
    gCities.selectAll('circle.city-dot')
      .data(LOCATIONS)
      .enter()
      .append('circle')
      .attr('class', 'city-dot')
      .attr('r', 2.2)
      .attr('cx', d => projection([d.lon, d.lat])[0])
      .attr('cy', d => projection([d.lon, d.lat])[1])
      .on('mousemove', (event, d) => showTooltip(event, d))
      .on('mouseleave', hideTooltip)
      .on('click', (event, d) => { selectLocation(d); });

    gCities.append('circle').attr('class', 'pulse-ring').attr('id', 'pulse-ring');
  }

  function onCountryHover(event, f) {
    const loc = f.__wp_location;
    if (loc) showTooltip(event, loc);
    else showTooltip(event, null, f.properties?.name || f.properties?.NAME || 'Unmapped region');
  }
  function onCountryClick(event, f) {
    const loc = f.__wp_location;
    if (loc) { selectLocation(loc); }
    else showTooltip(event, null, `Detailed data isn't available yet for ${f.properties?.name || f.properties?.NAME || 'this region'} — try searching a nearby major city.`, true);
  }

  function showTooltip(event, loc, fallbackText, persist) {
    const tip = document.getElementById('map-tooltip');
    const wrapRect = document.querySelector('.map-wrap').getBoundingClientRect();
    const x = (event.clientX ?? event.sourceEvent?.clientX ?? 0) - wrapRect.left;
    const y = (event.clientY ?? event.sourceEvent?.clientY ?? 0) - wrapRect.top;
    tip.style.left = `${x}px`;
    tip.style.top = `${y}px`;
    if (loc) {
      tip.innerHTML = `<strong>${flagFor(loc.iso2)} ${escapeHTML(loc.country)}</strong><span>${escapeHTML(loc.capital)} · ${timeInZone(loc.tz)} ${tzAbbrev(loc.tz)}</span>`;
    } else {
      tip.innerHTML = `<span>${fallbackText}</span>`;
    }
    tip.hidden = false;
    if (!persist) return;
    clearTimeout(showTooltip._t);
    showTooltip._t = setTimeout(hideTooltip, 2600);
  }
  function hideTooltip() { document.getElementById('map-tooltip').hidden = true; }

  function updateMapSelection(loc) {
    if (!state.mapReady) return;
    gMap.selectAll('path.country-shape').classed('is-selected', f => f.__wp_location && locKey(f.__wp_location) === locKey(loc));
    gCities.selectAll('circle.city-dot').classed('is-selected', d => locKey(d) === locKey(loc));
    const target = gCities.selectAll('circle.city-dot').filter(d => locKey(d) === locKey(loc));
    if (!target.empty()) {
      const cx = target.attr('cx'), cy = target.attr('cy');
      d3.select('#pulse-ring').attr('cx', cx).attr('cy', cy).classed('is-active', true);
    } else if (Number.isFinite(loc.lat) && Number.isFinite(loc.lon)) {
      const [cx, cy] = projection([loc.lon, loc.lat]);
      d3.select('#pulse-ring').attr('cx', cx).attr('cy', cy).classed('is-active', true);
    }
  }

  function centerMapOn(loc) {
    if (!state.mapReady || !zoomBehavior) return;
    const [x, y] = projection([loc.lon, loc.lat]);
    const scale = 2.4;
    const transform = d3.zoomIdentity.translate(MAP_W / 2 - x * scale, MAP_H / 2 - y * scale).scale(scale);
    svgSel.transition().duration(600).call(zoomBehavior.transform, transform);
  }

  document.getElementById('map-zoom-in').addEventListener('click', () => zoomBehavior && svgSel.transition().duration(300).call(zoomBehavior.scaleBy, 1.5));
  document.getElementById('map-zoom-out').addEventListener('click', () => zoomBehavior && svgSel.transition().duration(300).call(zoomBehavior.scaleBy, 1 / 1.5));
  document.getElementById('map-reset').addEventListener('click', () => zoomBehavior && svgSel.transition().duration(400).call(zoomBehavior.transform, d3.zoomIdentity));

  // Graceful degradation: if map geometry can never be loaded (e.g. offline),
  // still let people explore via clickable city dots on a plain starfield.
  function renderFallbackDotMap() {
    document.getElementById('map-loading').innerHTML = '<p>Live map geometry unavailable — showing city markers only.</p>';
    document.getElementById('map-loading').classList.add('is-hidden');
    plotCityDots();
    state.mapReady = true;
    updateMapSelection(state.selected);
  }

  /* ======================================================================
     17. BACKGROUND STARFIELD (subtle ambient canvas, decorative only)
     ====================================================================== */
  function initStarfield() {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let stars = [];
    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.floor((canvas.width * canvas.height) / 9000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.1 + 0.2,
        phase: Math.random() * Math.PI * 2,
      }));
    }
    let t = 0;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#CBD5E1';
      stars.forEach(s => {
        const twinkle = reduceMotion ? 0.6 : 0.4 + 0.4 * Math.sin(t + s.phase);
        ctx.globalAlpha = twinkle * 0.7;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      t += 0.01;
      if (!reduceMotion) requestAnimationFrame(draw);
    }
    resize();
    window.addEventListener('resize', debounce(resize, 300));
    draw();
  }

  /* ======================================================================
     18. INIT
     ====================================================================== */
  function init() {
    clearLegacyCaches();
    initStarfield();
    updateConnectionStatus();
    renderChipRows();
    renderComparison();
    renderLocationHeader(state.selected);
    tickClocks();
    setInterval(tickClocks, 1000);
    initMap();
    selectLocation(state.selected, { skipRecent: true });
    window.addEventListener('resize', debounce(() => { if (state.weather) updateChart(state.weather); }, 250));
    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      navigator.serviceWorker.register('service-worker.js?v=20260830-perfect-glass-1')
        .then(reg => reg.update && reg.update())
        .catch(() => {});
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();



