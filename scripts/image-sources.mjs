/**
 * CURATED IMAGE SOURCES
 * =====================
 * One hand-picked Wikipedia article per entity. This is the only place where
 * "which photo represents this place" is decided — `fetch-images.mjs` reads this
 * map, resolves each article's lead photograph on Wikimedia, captures the
 * author/license, and writes `src/data/imageManifest.json`.
 *
 * Why curated titles instead of a search query: a blind search for
 * "French Quarter, Pondicherry" returns the generic *Pondicherry* article, which
 * would put a wrong-but-present photo on the page. Specific titles avoid that.
 *
 * Deliberate rule: a state never reuses the photo of a place it already
 * catalogues, so State -> District -> Place drilldowns show three different
 * views rather than the same hero three times.
 *
 * To add a 37th region: add its key here and re-run `npm run fetch:images`.
 * Any key left out (or unresolvable) simply falls back to the gradient motif.
 */

export const IMAGE_SOURCES = {
  // ---------------------------------------------------------------- STATES
  'state:rajasthan': 'Mehrangarh',
  'state:uttar-pradesh': 'Bara Imambara',
  'state:kerala': 'Munnar',
  'state:karnataka': 'Mysore Palace',
  'state:meghalaya': 'Nohkalikai Falls',
  'state:ladakh': 'Thikse Monastery',
  'state:tamil-nadu': 'Meenakshi Temple',
  'state:goa': 'Basilica of Bom Jesus',
  'state:andhra-pradesh': 'Veerabhadra Temple, Lepakshi',
  'state:arunachal-pradesh': 'Namdapha National Park',
  'state:assam': 'Kaziranga National Park',
  'state:bihar': 'Nalanda mahavihara',
  'state:chhattisgarh': 'Chitrakoot Falls',
  'state:gujarat': 'Somnath temple',
  'state:haryana': 'Pinjore Gardens',
  'state:himachal-pradesh': 'Key Monastery',
  'state:jharkhand': 'Hundru Falls',
  'state:madhya-pradesh': 'Sanchi Stupa',
  'state:maharashtra': 'Ellora Caves',
  'state:manipur': 'Loktak Lake',
  'state:mizoram': 'Phawngpui',
  'state:nagaland': 'Hornbill Festival',
  'state:odisha': 'Lingaraja Temple',
  'state:punjab': ['Virasat-e-Khalsa', 'Gobindgarh Fort', 'Wagah', 'Qila Mubarak, Bathinda'],
  'state:sikkim': 'Kangchenjunga',
  'state:telangana': 'Golconda Fort',
  'state:tripura': 'Ujjayanta Palace',
  'state:uttarakhand': 'Valley of Flowers National Park',
  'state:west-bengal': 'Dakshineswar Kali Temple',
  'state:andaman-nicobar': 'Radhanagar Beach',
  'state:chandigarh': 'Sukhna Lake',
  'state:dnh-daman-diu': ['Fort of Saint Jerome', 'Jampore Beach', 'Daman, India'],
  'state:delhi': 'Qutb Minar',
  'state:jammu-kashmir': 'Gulmarg',
  'state:lakshadweep': 'Minicoy',
  'state:puducherry': 'Matrimandir',

  // ------------------------------------------------------------- DISTRICTS
  'district:rajasthan/jaipur': 'City Palace, Jaipur',
  'district:rajasthan/jaisalmer': 'Jaisalmer Fort',
  'district:rajasthan/udaipur': 'Lake Pichola',
  'district:uttar-pradesh/agra': 'Agra Fort',
  'district:uttar-pradesh/varanasi': 'Dashashwamedh Ghat',
  'district:kerala/alappuzha': ['Nehru Trophy Boat Race', 'Alappuzha Beach', 'Vembanad'],
  'district:karnataka/ballari': 'Hampi',
  'district:meghalaya/east-khasi': 'Cherrapunji',
  'district:ladakh/leh': 'Leh Palace',
  'district:tamil-nadu/chengalpattu': 'Pancha Rathas',
  'district:goa/north-goa': 'Aguada Fort',
  'district:andhra-pradesh/tirupati': ['Chandragiri Fort, Andhra Pradesh', 'Kapila Theertham', 'Tirumala Hills'],
  'district:arunachal-pradesh/tawang': 'Sela Pass',
  'district:assam/kamrup-metropolitan': 'Umananda Temple',
  'district:bihar/gaya': 'Vishnupad Temple, Gaya',
  'district:chhattisgarh/kabirdham': 'Kawardha',
  'district:gujarat/patan': 'Sun Temple, Modhera',
  'district:haryana/kurukshetra': 'Sthaneshwar Mahadev Temple',
  'district:himachal-pradesh/kullu': 'Great Himalayan National Park',
  'district:jharkhand/deoghar': 'Naulakha Mandir',
  'district:madhya-pradesh/chhatarpur': 'Kandariya Mahadeva Temple',
  'district:maharashtra/aurangabad': 'Bibi Ka Maqbara',
  'district:manipur/imphal-west': 'Shree Govindajee Temple',
  'district:mizoram/mamit': 'Dampa Tiger Reserve',
  'district:nagaland/kohima': 'Kohima War Cemetery',
  'district:odisha/puri': 'Jagannath Temple, Puri',
  'district:punjab/amritsar': 'Jallianwala Bagh',
  'district:sikkim/east-sikkim': 'Tsomgo Lake',
  'district:telangana/hyderabad': 'Chowmahalla Palace',
  'district:tripura/sepahijala': 'Sepahijala Wildlife Sanctuary',
  'district:uttarakhand/rudraprayag': 'Alaknanda River',
  'district:west-bengal/kolkata': 'Howrah Bridge',
  'district:andaman-nicobar/south-andaman': ['Swaraj Dweep', 'Ross Island, Andaman and Nicobar Islands'],
  'district:chandigarh/chandigarh-district': 'Capitol Complex, Chandigarh',
  'district:dnh-daman-diu/diu': 'Diu Island',
  'district:delhi/central-delhi': 'India Gate',
  'district:jammu-kashmir/srinagar': 'Dal Lake',
  'district:lakshadweep/lakshadweep-district': 'Kavaratti',
  'district:puducherry/puducherry-district': 'Basilica of the Sacred Heart of Jesus, Puducherry',

  // ---------------------------------------------------------------- PLACES
  'place:rajasthan/jaipur/hawa-mahal': 'Hawa Mahal',
  'place:rajasthan/jaipur/amer-fort': 'Amber Fort',
  'place:uttar-pradesh/agra/taj-mahal': 'Taj Mahal',
  'place:kerala/alappuzha/backwaters': 'Kerala backwaters',
  'place:karnataka/ballari/virupaksha': 'Virupaksha Temple, Hampi',
  'place:meghalaya/east-khasi/root-bridge': 'Living root bridge',
  'place:ladakh/leh/pangong': 'Pangong Tso',
  'place:tamil-nadu/chengalpattu/shore-temple': 'Shore Temple',
  'place:andhra-pradesh/tirupati/tirumala-temple': 'Venkateswara Temple, Tirumala',
  'place:arunachal-pradesh/tawang/tawang-monastery': 'Tawang Monastery',
  'place:assam/kamrup-metropolitan/kamakhya-temple': 'Kamakhya Temple',
  'place:bihar/gaya/mahabodhi-temple': 'Mahabodhi Temple',
  'place:chhattisgarh/kabirdham/bhoramdeo-temple': 'Bhoramdeo Temple',
  'place:gujarat/patan/rani-ki-vav': 'Rani ki Vav',
  'place:haryana/kurukshetra/brahma-sarovar': 'Brahma Sarovar',
  'place:himachal-pradesh/kullu/hidimba-devi-temple': ['Hidimba Devi Temple', 'Manali'],
  'place:jharkhand/deoghar/baidyanath-temple': 'Baidyanath Temple',
  'place:madhya-pradesh/chhatarpur/khajuraho-temples': 'Khajuraho Group of Monuments',
  'place:maharashtra/aurangabad/ajanta-caves': 'Ajanta Caves',
  'place:manipur/imphal-west/kangla-fort': 'Kangla Fort',
  'place:mizoram/mamit/reiek-heritage-village': 'Reiek',
  'place:nagaland/kohima/khonoma-village': 'Khonoma',
  'place:odisha/puri/konark-sun-temple': 'Konark Sun Temple',
  'place:punjab/amritsar/golden-temple': 'Golden Temple',
  'place:sikkim/east-sikkim/rumtek-monastery': 'Rumtek Monastery',
  'place:telangana/hyderabad/charminar': 'Charminar',
  'place:tripura/sepahijala/neermahal': 'Neermahal',
  'place:uttarakhand/rudraprayag/kedarnath-temple': 'Kedarnath Temple',
  'place:west-bengal/kolkata/victoria-memorial': 'Victoria Memorial, Kolkata',
  'place:andaman-nicobar/south-andaman/cellular-jail': 'Cellular Jail',
  'place:chandigarh/chandigarh-district/rock-garden': 'Rock Garden, Chandigarh',
  'place:dnh-daman-diu/diu/diu-fort': 'Diu Fort',
  'place:delhi/central-delhi/red-fort': 'Red Fort',
  'place:jammu-kashmir/srinagar/shalimar-bagh': 'Shalimar Bagh, Srinagar',
  'place:lakshadweep/lakshadweep-district/agatti-island': 'Agatti',
  'place:puducherry/puducherry-district/french-quarter': ['Aayi Mandapam', 'French Institute of Pondicherry'],
};
