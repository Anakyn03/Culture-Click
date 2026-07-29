// Full dataset: all 28 states + 8 Union Territories, each with at least one district and
// one fully-detailed heritage place. Rajasthan, Uttar Pradesh, Kerala, Karnataka, Meghalaya,
// Ladakh, Tamil Nadu and Goa carry extra depth (2 districts / 2 places) from earlier passes.
export const DATA = {
  "states": [
    {
      "id": "rajasthan",
      "name": "Rajasthan",
      "region": "North",
      "media": "m-hawa",
      "tagline": "Land of Kings",
      "unesco": true,
      "blurb": "A desert kingdom of sandstone forts, painted havelis and courtly ceremony, where every dune seems to remember a battle and every courtyard a wedding song.",
      "stats": {
        "area": "342,239 km²",
        "districts": "50",
        "language": "Rajasthani, Hindi",
        "founded": "1949 (unified)"
      },
      "culture": {
        "festivals": [
          {
            "name": "Pushkar Camel Fair",
            "month": "November"
          },
          {
            "name": "Teej",
            "month": "August"
          },
          {
            "name": "Gangaur",
            "month": "March"
          },
          {
            "name": "Desert Festival, Jaisalmer",
            "month": "February"
          }
        ],
        "dance": [
          "Ghoomar",
          "Kalbelia"
        ],
        "cuisine": [
          "Dal Baati Churma",
          "Laal Maas",
          "Ker Sangri",
          "Ghevar"
        ],
        "dress": "Bandhani odhnis, angrakha, mojari juttis"
      },
      "districts": [
        {
          "id": "jaipur",
          "name": "Jaipur",
          "blurb": "The Pink City — planned in 1727 on principles of Vastu Shastra, its old quarter still glows terracotta at dusk.",
          "media": "m-hawa",
          "places": [
            {
              "id": "hawa-mahal",
              "name": "Hawa Mahal",
              "type": "Palace",
              "media": "m-hawa",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "Just after sunrise, facing east into the jharokhas",
              "blurb": "A five-storey honeycomb façade of 953 sandstone jharokhas, built so royal women could watch street life unseen.",
              "rating": 4.6,
              "entry": "₹50 (Indian) / ₹200 (Foreign)",
              "open": "9:00 AM – 4:30 PM",
              "bestSeason": "Oct – Mar",
              "history": "Commissioned in 1799 by Maharaja Sawai Pratap Singh, Hawa Mahal was designed by Lal Chand Ustad as an extension of the City Palace. Its purpose was intimate rather than grand: it let the women of the royal household observe everyday processions and festivals on the street below from behind carved screens, honouring purdah while denying them nothing of the city's life.",
              "architecture": "Built in red and pink sandstone, the façade is shaped like the crown of Krishna. Its 953 small windows, or jharokhas, are latticed with intricate jali work that draws cooling air through the palace even in peak summer — giving the building its name, the 'Palace of Winds'. Despite its five storeys, the structure is barely a room deep in places, essentially a screen wall.",
              "timeline": [
                {
                  "y": 1799,
                  "label": "Construction completed under Maharaja Sawai Pratap Singh."
                },
                {
                  "y": 1876,
                  "label": "Facade restored ahead of a visit by the Prince of Wales."
                },
                {
                  "y": 2006,
                  "label": "Major renovation funded by a private-public heritage partnership."
                }
              ],
              "facts": [
                "Has no direct main entrance — accessed via the City Palace complex.",
                "The five floors have poetic names: Sharad Mandir, Ratan Mandir, Vichitra Mandir, Prakash Mandir and Hawa Mandir.",
                "Faces east, so morning light spills straight through the jharokhas."
              ],
              "hiddenGems": [
                "Climb to Hawa Mandir at sunrise before the tour groups arrive",
                "Panna Meena ka Kund stepwell, a 5-minute walk away",
                "Tripolia Bazaar for lac bangles and hand-block textiles"
              ],
              "food": [
                "Rawat Mishthan Bhandar for pyaaz kachori",
                "Laxmi Misthan Bhandar for ghewar",
                "Masala chai from the street stalls facing the palace"
              ],
              "experiences": [
                "Heritage walk through the Pink City bazaars",
                "Block-printing workshop in Sanganer",
                "Sunset photography from a rooftop café opposite the Mahal"
              ],
              "travel": {
                "railway": "Jaipur Junction, 4.5 km",
                "airport": "Jaipur Intl (JAI), 13 km",
                "parking": "Limited; use City Palace lot",
                "tip": "Visit right at opening — the interior light is best before 10 AM."
              }
            },
            {
              "id": "amer-fort",
              "name": "Amer Fort",
              "type": "Fort-Palace",
              "media": "m-amer",
              "budget": "Medium",
              "difficulty": "Moderate (hill climb)",
              "bestPhoto": "Golden hour in the Sheesh Mahal courtyard",
              "blurb": "A hilltop citadel of ochre and marble overlooking Maota Lake, blending Rajput and Mughal architecture across four grand courtyards.",
              "rating": 4.7,
              "entry": "₹100 (Indian) / ₹550 (Foreign)",
              "open": "8:00 AM – 5:30 PM",
              "bestSeason": "Nov – Feb",
              "history": "Begun in 1592 by Raja Man Singh I on the ruins of an earlier fort, Amer was the seat of the Kachwaha Rajputs for over six centuries before the capital moved to Jaipur. Successive rulers added palaces within its walls, layering Rajput military pragmatism with increasingly ornate Mughal-influenced interiors.",
              "architecture": "Built from pale yellow and pink sandstone with white marble accents, the fort unfolds through four courtyards. The Sheesh Mahal, or Mirror Palace, lines its walls and ceiling with thousands of convex mirror fragments and coloured glass, designed so a single candle could illuminate the entire hall in a field of stars.",
              "timeline": [
                {
                  "y": 1592,
                  "label": "Foundations laid by Raja Man Singh I."
                },
                {
                  "y": 1727,
                  "label": "Capital shifts to newly built Jaipur; Amer remains ceremonial."
                },
                {
                  "y": 2013,
                  "label": "Inscribed as part of the UNESCO Hill Forts of Rajasthan."
                }
              ],
              "facts": [
                "A 12-km wall — the \"Great Wall of India\" — connects it to neighbouring Jaigarh Fort.",
                "The Sheesh Mahal was said to sparkle like the night sky from a single flame.",
                "An underground tunnel once let royals flee to Jaigarh in times of siege."
              ],
              "hiddenGems": [
                "Jaigarh Fort tunnel walk, rarely crowded",
                "Sound-and-light show in the Kesar Kyari gardens after dusk",
                "Panna Meena ka Kund stepwell at the base of the hill"
              ],
              "food": [
                "Chowki Dhani thali experience nearby",
                "Local kachori stalls near the fort base"
              ],
              "experiences": [
                "Guided history walk with a local storyteller",
                "Elephant path viewpoint (elephant rides not recommended for animal welfare)",
                "Photography tour of the Sheesh Mahal at golden hour"
              ],
              "travel": {
                "railway": "Jaipur Junction, 13 km",
                "airport": "Jaipur Intl (JAI), 22 km",
                "parking": "Large lot at base, short walk or jeep up",
                "tip": "Arrive by 8:30 AM to have the Sheesh Mahal nearly to yourself."
              }
            }
          ]
        },
        {
          "id": "jaisalmer",
          "name": "Jaisalmer",
          "blurb": "The Golden City, its fort still a living town of sandstone rising from the Thar desert.",
          "media": "m-hampi",
          "places": []
        },
        {
          "id": "udaipur",
          "name": "Udaipur",
          "blurb": "City of Lakes, where marble palaces float on still water.",
          "media": "m-amer",
          "places": []
        }
      ]
    },
    {
      "id": "uttar-pradesh",
      "name": "Uttar Pradesh",
      "region": "North",
      "media": "m-taj",
      "tagline": "Heartland of Empires",
      "unesco": true,
      "blurb": "From Mughal marble to the ghats of the Ganga, Uttar Pradesh holds the layered memory of sultanates, empires and the sacred, side by side.",
      "stats": {
        "area": "240,928 km²",
        "districts": "75",
        "language": "Hindi, Urdu",
        "founded": "1950"
      },
      "culture": {
        "festivals": [
          {
            "name": "Ganga Aarti, Varanasi",
            "month": "Daily"
          },
          {
            "name": "Ram Navami, Ayodhya",
            "month": "April"
          },
          {
            "name": "Taj Mahotsav, Agra",
            "month": "February"
          }
        ],
        "dance": [
          "Kathak"
        ],
        "cuisine": [
          "Tunday Kababi",
          "Petha",
          "Banarasi Paan"
        ],
        "dress": "Chikankari kurtas, Banarasi silk sarees"
      },
      "districts": [
        {
          "id": "agra",
          "name": "Agra",
          "blurb": "Mughal capital turned marble monument to love and empire.",
          "media": "m-taj",
          "places": [
            {
              "id": "taj-mahal",
              "name": "Taj Mahal",
              "type": "Mausoleum",
              "media": "m-taj",
              "budget": "High (foreign entry)",
              "difficulty": "Easy",
              "bestPhoto": "Sunrise from the eastern gate, or Mehtab Bagh across the river",
              "blurb": "An ivory-white marble mausoleum built by Emperor Shah Jahan for his wife Mumtaz Mahal — the definitive symbol of Mughal architecture.",
              "rating": 4.8,
              "entry": "₹50 (Indian) / ₹1300 (Foreign)",
              "open": "Sunrise – Sunset (closed Fridays)",
              "bestSeason": "Oct – Mar",
              "history": "Construction began in 1632 after the death of Mumtaz Mahal during childbirth, and continued for roughly two decades under a workforce said to number 20,000. Shah Jahan later spent his final years imprisoned by his son Aurangzeb in Agra Fort, from where, legend holds, he could only gaze at the tomb across the river.",
              "architecture": "The complex follows strict Mughal charbagh symmetry: a reflecting pool, four minarets tilted slightly outward for stability, and a central dome that appears to change colour with the light — blush at dawn, blinding white at noon, golden at dusk. Pietra dura inlay of semi-precious stone forms floral motifs across the marble.",
              "timeline": [
                {
                  "y": 1631,
                  "label": "Death of Mumtaz Mahal."
                },
                {
                  "y": 1632,
                  "label": "Construction begins on the Yamuna riverbank."
                },
                {
                  "y": 1653,
                  "label": "Mausoleum substantially complete."
                },
                {
                  "y": 1983,
                  "label": "Declared a UNESCO World Heritage Site."
                }
              ],
              "facts": [
                "The four minarets lean fractionally outward so they would fall away from the tomb in an earthquake.",
                "No two flowers in the inlay work are exactly alike.",
                "It appears to shift colour through the day depending on the light."
              ],
              "hiddenGems": [
                "Mehtab Bagh garden across the river for the classic reflected view",
                "Agra Fort's Musamman Burj, Shah Jahan's final view of the Taj",
                "Kinari Bazaar for marble inlay craft"
              ],
              "food": [
                "Petha (translucent sweet) from Panchhi Petha",
                "Mughlai-style bedai and jalebi for breakfast"
              ],
              "experiences": [
                "Sunrise viewing from the eastern gate",
                "Marble inlay workshop with local artisans",
                "Heritage walk through Agra Fort"
              ],
              "travel": {
                "railway": "Agra Cantt, 6 km",
                "airport": "Agra Airport, 13 km",
                "parking": "Electric shuttle only near monument",
                "tip": "Book the first entry slot — light and crowds are both kindest at sunrise."
              }
            }
          ]
        },
        {
          "id": "varanasi",
          "name": "Varanasi",
          "blurb": "One of the world's oldest continuously inhabited cities, its ghats alive with ritual at every hour.",
          "media": "m-varanasi",
          "places": []
        }
      ]
    },
    {
      "id": "kerala",
      "name": "Kerala",
      "region": "South",
      "media": "m-kerala",
      "tagline": "God's Own Country",
      "unesco": false,
      "blurb": "Backwaters threaded with houseboats, spice-scented hill towns, and a coastline where Portuguese, Dutch and Arab traders all left their mark.",
      "stats": {
        "area": "38,852 km²",
        "districts": "14",
        "language": "Malayalam",
        "founded": "1956"
      },
      "culture": {
        "festivals": [
          {
            "name": "Onam",
            "month": "August/September"
          },
          {
            "name": "Thrissur Pooram",
            "month": "April/May"
          },
          {
            "name": "Vallam Kali boat races",
            "month": "August"
          }
        ],
        "dance": [
          "Kathakali",
          "Mohiniyattam"
        ],
        "cuisine": [
          "Appam & Stew",
          "Sadya",
          "Karimeen Pollichathu"
        ],
        "dress": "Kasavu mundu-veshti"
      },
      "districts": [
        {
          "id": "alappuzha",
          "name": "Alappuzha",
          "blurb": "The \"Venice of the East\", its backwaters webbed with canals and paddy fields below sea level.",
          "media": "m-kerala",
          "places": [
            {
              "id": "backwaters",
              "name": "Alleppey Backwaters",
              "type": "Wetland Network",
              "media": "m-kerala",
              "budget": "Medium",
              "difficulty": "Easy",
              "bestPhoto": "Late afternoon light on the water from a canoe, low angle",
              "blurb": "A 900-km network of lagoons, canals and lakes lined with coconut palms and rice paddies, traditionally navigated by kettuvallam houseboats.",
              "rating": 4.7,
              "entry": "Varies by houseboat operator",
              "open": "Day cruises & overnight stays",
              "bestSeason": "Nov – Feb",
              "history": "The backwaters formed over centuries as rivers met the Arabian Sea along a low coastal plain, and were historically the region's trade highway for spices and coir. Kettuvallams — literally 'tied boats' — were once rice barges, their hulls lashed together with coir rope and no metal nails, later converted into the houseboats travellers know today.",
              "architecture": "A kettuvallam's hull is built from jackwood planks stitched with coconut coir and waterproofed with cashew resin, topped by an arched roof of woven palm leaf (kaitha) matting — an entirely wood-and-fibre construction with no iron.",
              "timeline": [
                {
                  "y": 1850,
                  "label": "Kettuvallams used widely to transport rice and spices to Kochi port."
                },
                {
                  "y": 1990,
                  "label": "First conversions into tourist houseboats."
                }
              ],
              "facts": [
                "Some canals run below sea level, held back by ancient mud embankments.",
                "Punnamada Lake hosts the Nehru Trophy Boat Race each August.",
                "A single kettuvallam roof can take weeks to weave by hand."
              ],
              "hiddenGems": [
                "Kainakary village canals, far quieter than the main routes",
                "Pathiramanal, a river island reachable only by boat",
                "Local toddy shops serving fresh appam with fish curry"
              ],
              "food": [
                "Karimeen (pearl spot fish) pollichathu",
                "Kappa and meen curry",
                "Fresh toddy from village shops"
              ],
              "experiences": [
                "Overnight houseboat stay",
                "Canoe paddle through narrow village canals",
                "Coir-making demonstration"
              ],
              "travel": {
                "railway": "Alappuzha Railway Station, 3 km",
                "airport": "Cochin Intl (COK), 85 km",
                "parking": "At houseboat jetties",
                "tip": "Choose a smaller canoe tour over a big houseboat to reach the narrow village canals."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "karnataka",
      "name": "Karnataka",
      "region": "South",
      "media": "m-hampi",
      "tagline": "Empire in Ruins",
      "unesco": true,
      "blurb": "Home to Hampi's boulder-strewn ruins, Mysuru's palace grandeur, and Bengaluru's restless modern energy — old and new in constant conversation.",
      "stats": {
        "area": "191,791 km²",
        "districts": "31",
        "language": "Kannada",
        "founded": "1956"
      },
      "culture": {
        "festivals": [
          {
            "name": "Mysuru Dasara",
            "month": "September/October"
          },
          {
            "name": "Hampi Utsav",
            "month": "November"
          }
        ],
        "dance": [
          "Yakshagana"
        ],
        "cuisine": [
          "Bisi Bele Bath",
          "Mysore Pak"
        ],
        "dress": "Ilkal sarees, mysore peta turban"
      },
      "districts": [
        {
          "id": "ballari",
          "name": "Hampi (Ballari)",
          "blurb": "Boulder-strewn capital of the once-mighty Vijayanagara Empire.",
          "media": "m-hampi",
          "places": [
            {
              "id": "virupaksha",
              "name": "Virupaksha Temple, Hampi",
              "type": "Temple",
              "media": "m-hampi",
              "budget": "Low",
              "difficulty": "Easy–Moderate (site is spread out)",
              "bestPhoto": "Sunrise from Matanga Hill overlooking the gopuram",
              "blurb": "A still-active temple complex at the heart of the ruined Vijayanagara Empire capital, its gopuram rising nine tiers above the Tungabhadra plain.",
              "rating": 4.6,
              "entry": "Free (camera fee applicable)",
              "open": "6:00 AM – 9:00 PM",
              "bestSeason": "Oct – Feb",
              "history": "Predating the Vijayanagara Empire itself, the core shrine has been in continuous worship since at least the 7th century, later expanded dramatically under Vijayanagara rulers in the 15th and 16th centuries into the empire's ceremonial and spiritual centre, before the city was sacked in 1565.",
              "architecture": "The 50-metre eastern gopuram dominates the boulder landscape, built in tiers of diminishing stucco figures. A pinhole in the inner chamber projects an inverted shadow of the tower onto an inner wall — an early camera obscura, whether by design or accident.",
              "timeline": [
                {
                  "y": 650,
                  "label": "Earliest shrine on the site."
                },
                {
                  "y": 1500,
                  "label": "Major expansion under Vijayanagara kings."
                },
                {
                  "y": 1565,
                  "label": "City sacked after the Battle of Talikota; temple survives."
                }
              ],
              "facts": [
                "Remains an active site of worship despite the ruins surrounding it.",
                "Its gopuram casts a natural inverted image inside a dark chamber.",
                "Part of the UNESCO Group of Monuments at Hampi."
              ],
              "hiddenGems": [
                "Sunrise from Matanga Hill above the temple",
                "Hemakuta Hill's pre-Vijayanagara shrines, usually empty at dawn",
                "Coracle ride across the Tungabhadra to Anegundi village"
              ],
              "food": [
                "Banana plantation thalis near Hampi Bazaar",
                "Fresh sugarcane juice along the bazaar street"
              ],
              "experiences": [
                "Bicycle tour of the wider ruins field",
                "Coracle river crossing",
                "Boulder-hopping to Sanapur Lake at sunset"
              ],
              "travel": {
                "railway": "Hospet Junction, 13 km",
                "airport": "Hubli Airport, 143 km",
                "parking": "At Hampi Bazaar",
                "tip": "Rent a bicycle — the ruins are spread over 4 sq. km, too far to cover on foot."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "meghalaya",
      "name": "Meghalaya",
      "region": "Northeast",
      "media": "m-meghalaya",
      "tagline": "Abode of Clouds",
      "unesco": false,
      "blurb": "The wettest place on Earth, where Khasi communities have grown living bridges from rubber-fig roots for over five centuries.",
      "stats": {
        "area": "22,429 km²",
        "districts": "11",
        "language": "Khasi, Garo",
        "founded": "1972"
      },
      "culture": {
        "festivals": [
          {
            "name": "Wangala Festival",
            "month": "November"
          },
          {
            "name": "Shad Suk Mynsiem",
            "month": "April"
          }
        ],
        "dance": [
          "Wangala dance"
        ],
        "cuisine": [
          "Jadoh",
          "Tungrymbai"
        ],
        "dress": "Jainsem"
      },
      "districts": [
        {
          "id": "east-khasi",
          "name": "East Khasi Hills",
          "blurb": "Home to the double-decker living root bridges near Nongriat village.",
          "media": "m-meghalaya",
          "places": [
            {
              "id": "root-bridge",
              "name": "Double-Decker Living Root Bridge",
              "type": "Living Structure",
              "media": "m-meghalaya",
              "budget": "Low",
              "difficulty": "Hard (3,000+ steps)",
              "bestPhoto": "Midday, when light reaches the gorge floor through the canopy",
              "blurb": "A bridge of two stacked levels, grown over generations by training the aerial roots of rubber fig trees across a gorge in Nongriat village.",
              "rating": 4.9,
              "entry": "₹30 village fee",
              "open": "Daylight hours",
              "bestSeason": "Oct – Apr",
              "history": "War-Khasi communities began training Ficus elastica roots across streams centuries ago, guiding new growth through betel-nut trunk scaffolds until the roots fused into a load-bearing structure — a technique passed down orally between generations rather than recorded.",
              "architecture": "Unlike built bridges, a living root bridge strengthens with age; some in the region are over 100 years old and still growing. The double-decker at Nongriat is the most famous example, its two tiers formed decades apart.",
              "timeline": [
                {
                  "y": 1840,
                  "label": "Estimated founding growth of the lower deck."
                },
                {
                  "y": 1890,
                  "label": "Upper deck trained above it."
                }
              ],
              "facts": [
                "Some root bridges can bear the weight of 50 people at once.",
                "They require no maintenance beyond periodic root-guiding.",
                "Reaching it involves a steep 3,000-plus-step descent and climb."
              ],
              "hiddenGems": [
                "Rainbow Falls, a further 30-minute trek past the bridge",
                "Village homestays in Nongriat run by Khasi families",
                "Single-decker root bridges in nearby Riwai, an easier alternative"
              ],
              "food": [
                "Jadoh (smoked pork rice) at village eateries",
                "Fresh pineapple sold along the trail"
              ],
              "experiences": [
                "Guided trek to the bridge and Rainbow Falls",
                "Overnight homestay in Nongriat village",
                "Swimming in the natural rock pools below the bridge"
              ],
              "travel": {
                "railway": "Guwahati, 135 km (nearest major station)",
                "airport": "Shillong Airport, 78 km",
                "parking": "At Tyrna village, trailhead",
                "tip": "Start the trek by 8 AM — the return climb is steep and best done before peak heat."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "ladakh",
      "name": "Ladakh",
      "region": "North",
      "media": "m-ladakh",
      "tagline": "Land of High Passes",
      "unesco": false,
      "blurb": "A high-altitude desert of Buddhist monasteries, turquoise lakes and passes that sit above the clouds — India at its starkest and most serene.",
      "stats": {
        "area": "59,146 km²",
        "districts": "2",
        "language": "Ladakhi",
        "founded": "2019 (UT)"
      },
      "culture": {
        "festivals": [
          {
            "name": "Hemis Festival",
            "month": "June/July"
          },
          {
            "name": "Losar",
            "month": "December"
          }
        ],
        "dance": [
          "Cham mask dance"
        ],
        "cuisine": [
          "Thukpa",
          "Momos",
          "Butter Tea"
        ],
        "dress": "Goncha robe"
      },
      "districts": [
        {
          "id": "leh",
          "name": "Leh",
          "blurb": "Former capital of the Namgyal dynasty, ringed by monasteries and mountain passes.",
          "media": "m-ladakh",
          "places": [
            {
              "id": "pangong",
              "name": "Pangong Tso",
              "type": "High-altitude Lake",
              "media": "m-ladakh",
              "budget": "Medium–High (permits + distance)",
              "difficulty": "Moderate (altitude)",
              "bestPhoto": "Midday, when the water shows its fullest colour range",
              "blurb": "A 134-km endorheic lake stretching from India into Tibet, changing colour through blues and greens across the day at 4,225 metres.",
              "rating": 4.8,
              "entry": "Inner Line Permit required",
              "open": "May – Sep road access",
              "bestSeason": "Jun – Sep",
              "history": "Formed by tectonic activity in the Himalayan uplift, Pangong Tso has long sat along Ladakhi trade and grazing routes, its far shore crossing into what is now Tibet. It entered wider popular awareness after appearing in Hindi cinema in the 2000s, drawing a new wave of travellers.",
              "architecture": "Not built, but shaped — the lake's basin is bordered by stark, mineral-striped mountains with almost no vegetation, giving its water an unusually vivid, shifting palette against bare rock.",
              "timeline": [
                {
                  "y": 2009,
                  "label": "Featured in the film 3 Idiots, boosting tourism sharply."
                }
              ],
              "facts": [
                "Roughly two-thirds of the lake lies across the border in Tibet.",
                "Its water is brackish, not fresh, despite its high-altitude clarity.",
                "Freezes completely in winter, though the road closes long before then."
              ],
              "hiddenGems": [
                "Merak and Man villages along the quieter southern shore",
                "Chushul valley, further from the main viewpoint crowds",
                "Spangmik campsite for stargazing away from generator noise"
              ],
              "food": [
                "Butter tea and thukpa at lakeside dhabas",
                "Apricot dishes from nearby Nubra-grown fruit"
              ],
              "experiences": [
                "Overnight camping by the lake shore",
                "Sunrise photography as the water shifts colour",
                "Cycling the Chang La pass route toward the lake"
              ],
              "travel": {
                "railway": "No rail; nearest is Jammu Tawi, ~700 km",
                "airport": "Kushok Bakula Rimpochee Airport, Leh, 160 km",
                "parking": "Informal roadside near viewpoint",
                "tip": "Acclimatise in Leh for at least 2 days before the drive — altitude sickness is common and serious."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "tamil-nadu",
      "name": "Tamil Nadu",
      "region": "South",
      "media": "m-mahabs",
      "tagline": "Land of Temples",
      "unesco": true,
      "blurb": "Dravidian temple towers rise like carved mountains over a coastline of granite shore temples and Chola-era bronze traditions still practiced today.",
      "stats": {
        "area": "130,058 km²",
        "districts": "38",
        "language": "Tamil",
        "founded": "1969"
      },
      "culture": {
        "festivals": [
          {
            "name": "Pongal",
            "month": "January"
          },
          {
            "name": "Mahabalipuram Dance Festival",
            "month": "December/January"
          }
        ],
        "dance": [
          "Bharatanatyam"
        ],
        "cuisine": [
          "Chettinad cuisine",
          "Filter coffee"
        ],
        "dress": "Kanjeevaram silk saree"
      },
      "districts": [
        {
          "id": "chengalpattu",
          "name": "Mahabalipuram",
          "blurb": "A 7th-century Pallava port town carved almost entirely from single rock outcrops.",
          "media": "m-mahabs",
          "places": [
            {
              "id": "shore-temple",
              "name": "Shore Temple",
              "type": "Temple",
              "media": "m-mahabs",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "Sunrise with the temple silhouetted against the sea",
              "blurb": "A granite temple standing directly against the Bay of Bengal surf, among the earliest structural (as opposed to rock-cut) temples in South India.",
              "rating": 4.5,
              "entry": "₹40 (Indian) / ₹600 (Foreign)",
              "open": "6:00 AM – 6:00 PM",
              "bestSeason": "Nov – Feb",
              "history": "Built under Pallava king Narasimhavarman II around 700 CE, the Shore Temple marks a shift from carving temples directly out of rock outcrops to constructing them from dressed stone blocks, a technique that would define later South Indian temple building.",
              "architecture": "Two main towers face the sea and the mainland respectively, wrapped in a boundary wall of Nandi (bull) sculptures. Centuries of sea spray have softened much of the carved detail, giving the granite a weathered, almost dissolving quality.",
              "timeline": [
                {
                  "y": 700,
                  "label": "Constructed under Narasimhavarman II."
                },
                {
                  "y": 1984,
                  "label": "Inscribed as UNESCO World Heritage Site."
                },
                {
                  "y": 2004,
                  "label": "Tsunami exposes traces of submerged structures offshore."
                }
              ],
              "facts": [
                "Popularly linked to the legend of the \"Seven Pagodas\", six said to be submerged offshore.",
                "Erosion from sea salt has worn much of its original carving smooth.",
                "Built from granite rather than the sandstone common further north."
              ],
              "hiddenGems": [
                "Pancha Rathas, five monolithic rock-cut chariots nearby",
                "Krishna's Butterball, a giant balanced boulder in the village",
                "Arjuna's Penance rock relief at dawn light"
              ],
              "food": [
                "Fresh seafood shacks along the Mahabalipuram coast road",
                "South Indian filter coffee at village tea stalls"
              ],
              "experiences": [
                "Sunrise viewing with the temple silhouetted against the sea",
                "Stone-carving workshop with local sculptor families",
                "Coastal cycling route linking the major monuments"
              ],
              "travel": {
                "railway": "Chengalpattu, 29 km",
                "airport": "Chennai Intl (MAA), 58 km",
                "parking": "At the site entrance",
                "tip": "Visit at sunrise — by mid-morning the light flattens the carved detail and crowds build fast."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "goa",
      "name": "Goa",
      "region": "West",
      "media": "m-goa",
      "tagline": "Where Coasts Meet Cultures",
      "unesco": false,
      "blurb": "Four and a half centuries of Portuguese rule left whitewashed churches and Indo-Portuguese mansions along a coastline of laterite forts and spice-scented villages.",
      "stats": {
        "area": "3,702 km²",
        "districts": "2",
        "language": "Konkani",
        "founded": "1961 (liberation)"
      },
      "culture": {
        "festivals": [
          {
            "name": "Carnival",
            "month": "February"
          },
          {
            "name": "Shigmo",
            "month": "March"
          }
        ],
        "dance": [
          "Fugdi"
        ],
        "cuisine": [
          "Fish Curry Rice",
          "Bebinca"
        ],
        "dress": "Kunbi saree"
      },
      "districts": [
        {
          "id": "north-goa",
          "name": "North Goa",
          "blurb": "Old Portuguese quarters, spice plantations and the state's liveliest coastline.",
          "media": "m-goa",
          "places": []
        }
      ]
    },
    {
      "id": "andhra-pradesh",
      "name": "Andhra Pradesh",
      "region": "South",
      "media": "temple",
      "tagline": "Coastal Temple State",
      "unesco": false,
      "blurb": "A long Bay of Bengal coastline backing onto temple towns and hill shrines, where Telugu devotional culture runs as deep as its rice-growing deltas.",
      "stats": {
        "area": "162,970 km²",
        "districts": "26",
        "language": "Telugu",
        "founded": "1956 (2014 post-bifurcation)"
      },
      "culture": {
        "festivals": [
          {
            "name": "Tirupati Brahmotsavam",
            "month": "September/October"
          },
          {
            "name": "Ugadi",
            "month": "March/April"
          }
        ],
        "dance": [
          "Kuchipudi"
        ],
        "cuisine": [
          "Pesarattu",
          "Gongura Pachadi",
          "Pulihora"
        ],
        "dress": "Kalamkari-printed sarees"
      },
      "districts": [
        {
          "id": "tirupati",
          "name": "Tirupati",
          "blurb": "A pilgrim town built around one of the world's most-visited religious sites, Tirumala hill.",
          "media": "temple",
          "places": [
            {
              "id": "tirumala-temple",
              "name": "Tirumala Venkateswara Temple",
              "type": "Temple",
              "media": "temple",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "Early morning at the golden temple tower",
              "blurb": "One of the world's most-visited pilgrimage sites, this Dravidian-style hilltop temple to Lord Venkateswara draws hundreds of thousands of devotees a day.",
              "rating": 4.7,
              "entry": "Free (special entry darshan tickets available)",
              "open": "3:00 AM – 1:30 AM (nearly 24 hrs, phased)",
              "bestSeason": "Sep – Feb",
              "history": "Dedicated to Lord Venkateswara (a form of Vishnu), the temple's core structure dates to the 9th–10th century under the Pallavas, with major expansion during the Vijayanagara Empire — particularly under Krishnadevaraya, who funded the temple lavishly with gold and jewels in the early 16th century.",
              "architecture": "Built in Dravidian style with a gold-plated Ananda Nilayam vimana over the sanctum, the temple complex is considered one of the richest in the world by daily donations, its gopurams and corridors added across successive dynasties.",
              "timeline": [
                {
                  "y": 900,
                  "label": "Earliest core shrine structures established under Pallava-era patronage."
                },
                {
                  "y": 1517,
                  "label": "Krishnadevaraya donates gold and jewels, funding major temple expansion."
                },
                {
                  "y": 1933,
                  "label": "Tirumala Tirupati Devasthanams (TTD) trust formally established to administer the temple."
                }
              ],
              "facts": [
                "Reputed to be the richest temple in the world by daily donations.",
                "Pilgrims traditionally shave their heads as an offering, a ritual called tonsuring.",
                "The temple feeds free prasadam laddus to hundreds of thousands of pilgrims daily."
              ],
              "hiddenGems": [
                "Akasa Ganga waterfall, a short walk from the main temple",
                "Papavinasanam dam and reservoir nearby",
                "Silathoranam, a natural rock arch formation on the hill"
              ],
              "food": [
                "Tirupati laddu, the temple's iconic prasadam",
                "South Indian thalis at the free pilgrim dining halls"
              ],
              "experiences": [
                "Darshan (temple viewing) queue experience",
                "Sunrise trek up the original stone steps (Alipiri route)",
                "Visit to the Sri Venkateswara Zoological Park nearby"
              ],
              "travel": {
                "railway": "Tirupati Railway Station, 22 km",
                "airport": "Tirupati Airport, 28 km",
                "parking": "Large lots at Alipiri and Tirumala",
                "tip": "Book darshan slots online in advance — queues can run many hours without a reservation."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "arunachal-pradesh",
      "name": "Arunachal Pradesh",
      "region": "Northeast",
      "media": "monastery",
      "tagline": "Land of the Dawn-Lit Mountains",
      "unesco": false,
      "blurb": "India's easternmost state, a folded Himalayan landscape of Tibetan Buddhist monasteries, tribal villages and some of the country's least-visited high passes.",
      "stats": {
        "area": "83,743 km²",
        "districts": "25",
        "language": "Nyishi, Adi, and other tribal languages",
        "founded": "1987"
      },
      "culture": {
        "festivals": [
          {
            "name": "Losar",
            "month": "February/March"
          },
          {
            "name": "Torgya Festival, Tawang",
            "month": "January"
          }
        ],
        "dance": [
          "Cham mask dance"
        ],
        "cuisine": [
          "Thukpa",
          "Zan (millet porridge)",
          "Bamboo-shoot dishes"
        ],
        "dress": "Traditional tribal handwoven shawls"
      },
      "districts": [
        {
          "id": "tawang",
          "name": "Tawang",
          "blurb": "A high Himalayan district on the edge of Tibet, centred on India's largest Buddhist monastery.",
          "media": "monastery",
          "places": [
            {
              "id": "tawang-monastery",
              "name": "Tawang Monastery",
              "type": "Monastery",
              "media": "monastery",
              "budget": "Medium",
              "difficulty": "Moderate–Hard (altitude, remote roads)",
              "bestPhoto": "Morning light on the whitewashed walls with prayer flags",
              "blurb": "The largest monastery in India and second largest in the world after Lhasa's Potala Palace, founded in 1680 on a windswept ridge above the Tawang valley.",
              "rating": 4.8,
              "entry": "Free",
              "open": "6 AM–6 PM",
              "bestSeason": "Mar–Jun, Sep–Oct",
              "history": "Founded in 1680–81 by Merak Lama Lodre Gyatso, reputedly on a site chosen following the guidance of the 5th Dalai Lama, Tawang Monastery grew into the spiritual centre of Buddhism in the region and briefly sheltered the 14th Dalai Lama in 1959 as he crossed into exile.",
              "architecture": "A fortress-like three-storey complex enclosing a large assembly hall, housing an 8-metre gilded Buddha statue and a substantial library of Buddhist scriptures, built in traditional Tibetan monastic style suited to the high-altitude climate.",
              "timeline": [
                {
                  "y": 1680,
                  "label": "Founded by Merak Lama Lodre Gyatso."
                },
                {
                  "y": 1959,
                  "label": "Provides brief refuge to the 14th Dalai Lama during his journey into exile."
                }
              ],
              "facts": [
                "Second-largest Tibetan Buddhist monastery in the world after Lhasa's Potala Palace.",
                "Home to around 300 monks and a centuries-old scripture library.",
                "Sits at an altitude of roughly 3,000 metres, often under snow in winter."
              ],
              "hiddenGems": [
                "Pankang Teng Tso (Madhuri Lake) nearby",
                "Urgelling Monastery, birthplace of the 6th Dalai Lama",
                "Nuranang Falls en route from Tawang"
              ],
              "food": [
                "Thukpa and momos at local Tawang eateries",
                "Butter tea served in monastery guesthouses"
              ],
              "experiences": [
                "Attending a monastic morning prayer session",
                "Sela Pass crossing en route",
                "Visiting the Tawang War Memorial nearby"
              ],
              "travel": {
                "railway": "Tezpur, ~300 km (nearest broad-gauge)",
                "airport": "Guwahati is the main air hub; Tawang has a small regional airport",
                "parking": "At monastery entrance",
                "tip": "Roads can close due to snow — check the Sela Pass status before travelling Oct–Mar."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "assam",
      "name": "Assam",
      "region": "Northeast",
      "media": "temple",
      "tagline": "Gateway to the Northeast",
      "unesco": false,
      "blurb": "Bound by the Brahmaputra river, Assam blends riverine wildlife, sprawling tea gardens and some of eastern India's oldest continuously worshipped temples.",
      "stats": {
        "area": "78,438 km²",
        "districts": "35",
        "language": "Assamese",
        "founded": "1950"
      },
      "culture": {
        "festivals": [
          {
            "name": "Bihu",
            "month": "April"
          },
          {
            "name": "Ambubachi Mela",
            "month": "June"
          }
        ],
        "dance": [
          "Bihu dance"
        ],
        "cuisine": [
          "Khar",
          "Tenga",
          "Assam tea"
        ],
        "dress": "Mekhela chador"
      },
      "districts": [
        {
          "id": "kamrup-metropolitan",
          "name": "Kamrup Metropolitan",
          "blurb": "Assam's largest city, Guwahati, spread along the Brahmaputra beneath Nilachal Hill.",
          "media": "temple",
          "places": [
            {
              "id": "kamakhya-temple",
              "name": "Kamakhya Temple",
              "type": "Temple",
              "media": "temple",
              "budget": "Low",
              "difficulty": "Easy–Moderate (hill climb)",
              "bestPhoto": "Sunset over the Brahmaputra from Nilachal Hill",
              "blurb": "One of the oldest of the 51 Shakti Peethas, its beehive-shaped shikhara crowning Nilachal Hill above the Brahmaputra river.",
              "rating": 4.5,
              "entry": "Free (special darshan tickets available)",
              "open": "5:30 AM–10 PM",
              "bestSeason": "Oct–Mar",
              "history": "Legend holds this as the site where the goddess Sati's womb fell, making it one of the oldest and most important of the 51 Shakti Peethas. The present structure was rebuilt in 1565 by the Koch king Naranarayana after an earlier temple was destroyed.",
              "architecture": "A distinctive beehive-shaped shikhara typical of the Nilachal style, with intricately carved panels of deities and vegetal motifs; unusually, the inner sanctum holds no idol — worship centres on a natural rock fissure.",
              "timeline": [
                {
                  "y": 1565,
                  "label": "Temple rebuilt under Koch king Naranarayana after earlier destruction."
                },
                {
                  "y": 1665,
                  "label": "Renovation work recorded under later Ahom-era patronage."
                }
              ],
              "facts": [
                "One of the principal Shakti Peethas of Hindu tradition.",
                "Hosts the Ambubachi Mela, a major annual fertility festival drawing large crowds.",
                "The sanctum has no idol — worship centres on a natural rock fissure."
              ],
              "hiddenGems": [
                "Umananda Temple on Peacock Island in the Brahmaputra",
                "Nilachal Hill viewpoint over the river",
                "Nearby Assam State Museum in Guwahati"
              ],
              "food": [
                "Assamese thali with khar and tenga at local eateries",
                "Street food at Fancy Bazaar, Guwahati"
              ],
              "experiences": [
                "Sunset boat ride on the Brahmaputra",
                "Visiting during Ambubachi Mela (mid-June)",
                "Guided heritage walk up Nilachal Hill"
              ],
              "travel": {
                "railway": "Kamakhya Railway Station, 2 km",
                "airport": "Lokpriya Gopinath Bordoloi Intl, 20 km",
                "parking": "At the hill base with shuttle option",
                "tip": "Avoid the Ambubachi Mela dates if you prefer a quieter visit — it draws enormous crowds."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "bihar",
      "name": "Bihar",
      "region": "East",
      "media": "temple",
      "tagline": "Cradle of Buddhism",
      "unesco": true,
      "blurb": "Where the Buddha attained enlightenment and Ashoka ruled an empire — Bihar's plains hold some of the deepest religious and intellectual history on the subcontinent.",
      "stats": {
        "area": "94,163 km²",
        "districts": "38",
        "language": "Hindi, Maithili, Bhojpuri",
        "founded": "1950 (post-independence reorganisation)"
      },
      "culture": {
        "festivals": [
          {
            "name": "Chhath Puja",
            "month": "October/November"
          },
          {
            "name": "Buddha Purnima",
            "month": "May"
          }
        ],
        "dance": [
          "Jat-Jatin"
        ],
        "cuisine": [
          "Litti Chokha",
          "Sattu paratha",
          "Thekua"
        ],
        "dress": "Bhagalpuri silk sarees"
      },
      "districts": [
        {
          "id": "gaya",
          "name": "Gaya",
          "blurb": "A pilgrimage city on the Niranjana river, adjoining the far older sacred town of Bodh Gaya.",
          "media": "temple",
          "places": [
            {
              "id": "mahabodhi-temple",
              "name": "Mahabodhi Temple",
              "type": "Temple",
              "media": "temple",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "The temple spire reflected in the surrounding lotus pond at dawn",
              "blurb": "The site where Siddhartha Gautama is believed to have attained enlightenment beneath the Bodhi Tree, marked by a 55-metre brick spire that is among the oldest Buddhist structures still standing.",
              "rating": 4.8,
              "entry": "Free",
              "open": "5 AM–9 PM",
              "bestSeason": "Oct–Mar",
              "history": "The original shrine is attributed to Emperor Ashoka in the 3rd century BCE, with the current temple structure dating largely to the 5th–6th century CE, later restored in the 19th century under British archaeological supervision. It remains one of the four principal pilgrimage sites of the Buddha's life.",
              "architecture": "A 55-metre pyramidal brick spire in the classic Indian temple style, surrounded by carved stone railings, some of which are among the oldest surviving stone objects in India, with the sacred Bodhi Tree growing directly behind the shrine.",
              "timeline": [
                {
                  "y": -260,
                  "label": "Ashoka establishes the original shrine and railings at the site."
                },
                {
                  "y": 500,
                  "label": "Present temple structure largely built in its current form."
                },
                {
                  "y": 1880,
                  "label": "Major restoration carried out under British archaeological supervision."
                },
                {
                  "y": 2002,
                  "label": "Inscribed as a UNESCO World Heritage Site."
                }
              ],
              "facts": [
                "The Bodhi Tree here is said to descend from the original tree, via a cutting taken to Sri Lanka and later brought back.",
                "One of the four main pilgrimage sites associated with the Buddha's life.",
                "Some of its stone railings are considered among the oldest surviving structural stonework in India."
              ],
              "hiddenGems": [
                "Sujata Stupa across the Niranjana river",
                "Thai and Tibetan monasteries built by international Buddhist communities nearby",
                "Muchalinda Lake behind the main temple"
              ],
              "food": [
                "Litti chokha at local Bodh Gaya eateries",
                "Simple monastery-run vegetarian meals"
              ],
              "experiences": [
                "Meditation session under or near the Bodhi Tree",
                "Visiting the international monasteries built by different Buddhist countries",
                "Evening prayer circumambulation of the temple"
              ],
              "travel": {
                "railway": "Gaya Junction, 13 km",
                "airport": "Gaya Airport, 7 km",
                "parking": "At the temple complex entrance",
                "tip": "Dress modestly and remove footwear well before the inner temple precinct."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "chhattisgarh",
      "name": "Chhattisgarh",
      "region": "Central",
      "media": "temple",
      "tagline": "Rice Bowl of the Forests",
      "unesco": false,
      "blurb": "A heavily forested state of waterfalls and tribal heartlands, its temple carvings at Bhoramdeo quietly rivalling far more famous sites.",
      "stats": {
        "area": "135,192 km²",
        "districts": "33",
        "language": "Chhattisgarhi, Hindi",
        "founded": "2000"
      },
      "culture": {
        "festivals": [
          {
            "name": "Bastar Dussehra",
            "month": "September/October"
          },
          {
            "name": "Hareli",
            "month": "July/August"
          }
        ],
        "dance": [
          "Panthi dance"
        ],
        "cuisine": [
          "Bafauri",
          "Chila",
          "Faraa"
        ],
        "dress": "Kosa silk sarees"
      },
      "districts": [
        {
          "id": "kabirdham",
          "name": "Kabirdham",
          "blurb": "A district of forested hills at the edge of the Maikal range, home to Chhattisgarh's best-known temple.",
          "media": "temple",
          "places": [
            {
              "id": "bhoramdeo-temple",
              "name": "Bhoramdeo Temple",
              "type": "Temple",
              "media": "temple",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "Midday light directly on the carved shikhara facade",
              "blurb": "Often called the \"Khajuraho of Chhattisgarh\", this sandstone Nagara-style temple carries centuries of Nagvanshi and Kalachuri-era carving, far less visited than its namesake.",
              "rating": 4.3,
              "entry": "Free",
              "open": "7 AM–6 PM",
              "bestSeason": "Nov–Feb",
              "history": "Built between the 7th and 11th centuries under the Nagvanshi and later Kalachuri rulers, the temple complex grew in phases over several centuries rather than in one continuous build, culminating in a major renovation under Nagvanshi ruler Ramchandra Deva in the 14th century.",
              "architecture": "A sandstone Nagara-style shikhara with tiers of sculpted deities, dancers, and decorative bands, dedicated primarily to Shiva, its carving style closely comparable to — and sometimes mistaken for — the temples of Khajuraho.",
              "timeline": [
                {
                  "y": 1349,
                  "label": "Major renovation and expansion recorded under Nagvanshi ruler Ramchandra Deva."
                }
              ],
              "facts": [
                "Often called the \"Khajuraho of Chhattisgarh\" for its carved figures.",
                "Built over several centuries by successive dynasties rather than in one phase.",
                "Surrounded by forested hills of the Maikal range, far less visited than its Khajuraho counterpart."
              ],
              "hiddenGems": [
                "Chaiturgarh Fort ruins nearby",
                "Madwa Mahal, a smaller adjoining shrine",
                "Kabirdham's forested backroads for birdwatching"
              ],
              "food": [
                "Chhattisgarhi thali with bafauri and chila",
                "Mahua-based local sweets in season"
              ],
              "experiences": [
                "Heritage walk through the temple carvings with a local guide",
                "Forest drive through the Maikal range",
                "Village visit to nearby tribal Baiga communities"
              ],
              "travel": {
                "railway": "Bilaspur, ~110 km",
                "airport": "Raipur (Swami Vivekananda Airport), ~140 km",
                "parking": "At the temple entrance",
                "tip": "Combine with a forest detour — the temple sits at the edge of a much larger, quieter landscape worth the extra day."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "gujarat",
      "name": "Gujarat",
      "region": "West",
      "media": "stepwell",
      "tagline": "Land of Legends",
      "unesco": true,
      "blurb": "From the salt-white Rann of Kutch to the carved stepwells of the north, Gujarat's landscape holds some of India's most technically astonishing water architecture.",
      "stats": {
        "area": "196,244 km²",
        "districts": "33",
        "language": "Gujarati",
        "founded": "1960"
      },
      "culture": {
        "festivals": [
          {
            "name": "Navratri",
            "month": "September/October"
          },
          {
            "name": "Rann Utsav",
            "month": "November–February"
          }
        ],
        "dance": [
          "Garba",
          "Dandiya Raas"
        ],
        "cuisine": [
          "Dhokla",
          "Undhiyu",
          "Fafda-Jalebi"
        ],
        "dress": "Bandhani dupattas"
      },
      "districts": [
        {
          "id": "patan",
          "name": "Patan",
          "blurb": "A quiet north Gujarat town once a medieval capital, now known chiefly for its stepwell and Patola weaving.",
          "media": "stepwell",
          "places": [
            {
              "id": "rani-ki-vav",
              "name": "Rani ki Vav",
              "type": "Stepwell",
              "media": "stepwell",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "Straight down the central axis from the top step",
              "blurb": "An extraordinary inverted-temple stepwell, seven storeys deep and lined with over 500 sculpted panels, built by a queen in memory of her husband and buried in river silt for centuries before its 20th-century excavation.",
              "rating": 4.7,
              "entry": "₹40 (Indian) / ₹600 (Foreign)",
              "open": "8 AM–6 PM",
              "bestSeason": "Nov–Feb",
              "history": "Commissioned around 1063 CE by Queen Udayamati in memory of her husband, King Bhimdev I of the Solanki dynasty, the stepwell was gradually buried by silt from the nearby Saraswati river and lay forgotten for centuries until fully excavated by the Archaeological Survey of India in the 1980s.",
              "architecture": "Built as an inverted temple, seven levels deep, lined with over 500 principal sculptures and 1,000 minor ones depicting Vishnu's avatars and mythological scenes, in the elaborate Maru-Gurjara architectural style.",
              "timeline": [
                {
                  "y": 1063,
                  "label": "Construction commissioned by Queen Udayamati."
                },
                {
                  "y": 1300,
                  "label": "River flooding gradually buries the stepwell in silt."
                },
                {
                  "y": 1980,
                  "label": "Full excavation completed by the Archaeological Survey of India."
                },
                {
                  "y": 2014,
                  "label": "Inscribed as a UNESCO World Heritage Site."
                }
              ],
              "facts": [
                "Because it was buried in silt for centuries, its carvings survived in exceptional condition.",
                "Featured on the reverse of the Indian ₹100 note.",
                "Built as a functioning water-management structure, not solely a monument."
              ],
              "hiddenGems": [
                "Sahastralinga Talav, a nearby ancient stepped tank",
                "Patan's Patola sari weaving workshops",
                "Old town lanes of Patan for wooden havelis"
              ],
              "food": [
                "Gujarati thali with dhokla and undhiyu",
                "Patan's local jalebi-fafda breakfast stalls"
              ],
              "experiences": [
                "Guided descent through the seven stepwell levels",
                "Patola silk-weaving demonstration",
                "Day trip combining Patan with Modhera Sun Temple"
              ],
              "travel": {
                "railway": "Patan Railway Station, 2 km",
                "airport": "Ahmedabad (Sardar Vallabhbhai Patel Intl), ~130 km",
                "parking": "At the ASI site entrance",
                "tip": "Visit late afternoon when the stepped levels are in soft shadow, easiest for photographing the depth."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "haryana",
      "name": "Haryana",
      "region": "North",
      "media": "lake",
      "tagline": "Land of the Mahabharata",
      "unesco": false,
      "blurb": "Framing the National Capital Region, Haryana's plains hold the legendary battlefield of the Mahabharata and some of India's largest sacred tanks.",
      "stats": {
        "area": "44,212 km²",
        "districts": "22",
        "language": "Haryanvi, Hindi",
        "founded": "1966"
      },
      "culture": {
        "festivals": [
          {
            "name": "Gita Jayanti / Kurukshetra Mahotsav",
            "month": "November/December"
          },
          {
            "name": "Baisakhi",
            "month": "April"
          }
        ],
        "dance": [
          "Ghoomar (shared with Rajasthan border regions)"
        ],
        "cuisine": [
          "Bajra khichdi",
          "Kachri ki sabzi",
          "Lassi"
        ],
        "dress": "Phulkari-embroidered dupattas"
      },
      "districts": [
        {
          "id": "kurukshetra",
          "name": "Kurukshetra",
          "blurb": "A pilgrimage town traditionally identified as the battlefield of the Mahabharata war.",
          "media": "lake",
          "places": [
            {
              "id": "brahma-sarovar",
              "name": "Brahma Sarovar & Jyotisar",
              "type": "Sacred Tank",
              "media": "lake",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "Ghats reflected in Brahma Sarovar at sunset",
              "blurb": "One of the largest man-made sacred tanks in India, at the heart of the town traditionally identified as the Mahabharata's battlefield and the site of the Bhagavad Gita's telling.",
              "rating": 4.3,
              "entry": "Free",
              "open": "5 AM–8 PM",
              "bestSeason": "Oct–Mar",
              "history": "Kurukshetra is traditionally identified as the site of the Mahabharata war and the place where Krishna delivered the Bhagavad Gita to Arjuna at Jyotisar. Brahma Sarovar itself has been a pilgrimage site for centuries, its ghats rebuilt and expanded across multiple eras, notably in the early 19th century.",
              "architecture": "Brahma Sarovar is a vast rectangular stepped tank with ghats around its perimeter; Jyotisar features a sacred banyan tree traditionally associated with the Gita's recitation, alongside a modern memorial marking the spot.",
              "timeline": [
                {
                  "y": 1815,
                  "label": "Tank renovation and ghat construction expanded under regional patronage."
                },
                {
                  "y": 1987,
                  "label": "Kurukshetra Development Board formally established to preserve and develop the pilgrimage circuit."
                }
              ],
              "facts": [
                "Brahma Sarovar is one of the largest religious tanks in Asia by surface area.",
                "Kurukshetra hosts a major International Gita Mahotsav festival annually.",
                "The battlefield described in the Mahabharata is traditionally located across this wider region."
              ],
              "hiddenGems": [
                "Sannihit Sarovar, a smaller adjoining sacred tank",
                "Kurukshetra Panorama and Science Centre",
                "Sheikh Chmilli's Tomb, a lesser-visited Mughal-era monument nearby"
              ],
              "food": [
                "Simple Haryanvi thali with bajra khichdi",
                "Lassi from stalls near the tank"
              ],
              "experiences": [
                "Evening aarti at Brahma Sarovar",
                "Visiting during the annual Gita Jayanti / Mahotsav",
                "Heritage walk through the Kurukshetra pilgrimage circuit"
              ],
              "travel": {
                "railway": "Kurukshetra Junction, 5 km",
                "airport": "Chandigarh Airport, ~90 km",
                "parking": "At Brahma Sarovar and Jyotisar separately",
                "tip": "Visit around sunset for the tank's evening aarti, when it is at its most atmospheric."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "himachal-pradesh",
      "name": "Himachal Pradesh",
      "region": "North",
      "media": "temple",
      "tagline": "Land of Snow",
      "unesco": false,
      "blurb": "A Himalayan state of deodar forests and hill towns, where wooden pagoda temples sit alongside colonial hill stations at every altitude.",
      "stats": {
        "area": "55,673 km²",
        "districts": "12",
        "language": "Hindi, Pahari dialects",
        "founded": "1971"
      },
      "culture": {
        "festivals": [
          {
            "name": "Kullu Dussehra",
            "month": "October"
          },
          {
            "name": "Losar (tribal areas)",
            "month": "February"
          }
        ],
        "dance": [
          "Nati"
        ],
        "cuisine": [
          "Dham thali",
          "Siddu",
          "Chana Madra"
        ],
        "dress": "Kullu shawls and caps"
      },
      "districts": [
        {
          "id": "kullu",
          "name": "Kullu",
          "blurb": "The valley town at the gateway to Manali, framed by deodar forest and the Beas river.",
          "media": "temple",
          "places": [
            {
              "id": "hidimba-devi-temple",
              "name": "Hidimba Devi Temple",
              "type": "Temple",
              "media": "temple",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "The wooden tower framed by cedar trunks in soft forest light",
              "blurb": "A distinctive four-tiered wooden pagoda temple set deep in a protected cedar forest above Manali, built over a natural cave shrine.",
              "rating": 4.5,
              "entry": "Free",
              "open": "8 AM–7 PM",
              "bestSeason": "Mar–Jun, Sep–Nov",
              "history": "Built in 1553 by Raja Bahadur Singh, dedicated to Hidimba Devi, a figure from the Mahabharata, the temple stands amid a cedar forest and is considered one of the oldest temples in the Manali area.",
              "architecture": "A distinctive four-tiered wooden pagoda-style tower over a cave shrine, with a carved wooden entrance and deodar-log construction typical of Himalayan hill architecture rather than the stone temple styles found in the plains.",
              "timeline": [
                {
                  "y": 1553,
                  "label": "Temple built under Raja Bahadur Singh of Kullu."
                }
              ],
              "facts": [
                "Built over a natural cave rather than a conventional sanctum.",
                "Its wooden pagoda style is architecturally distinct from most Hindu temples in the plains.",
                "Surrounded by a protected deodar cedar forest, part of its setting's appeal."
              ],
              "hiddenGems": [
                "Old Manali's quieter lanes just beyond the tourist market",
                "Van Vihar deodar forest walk",
                "Manu Temple in Old Manali, dedicated to the sage Manu"
              ],
              "food": [
                "Himachali dham thali",
                "Tibetan momos and thukpa in Old Manali cafés"
              ],
              "experiences": [
                "Forest walk through the surrounding cedar grove",
                "Photography with traditional Himachali dress rental stalls nearby",
                "Day trip to Solang Valley or Old Manali"
              ],
              "travel": {
                "railway": "Joginder Nagar (narrow gauge), ~125 km; Chandigarh for broad gauge",
                "airport": "Bhuntar (Kullu-Manali) Airport, 52 km",
                "parking": "At the temple approach road",
                "tip": "Go early morning or late afternoon — midday brings heavy tourist traffic through the forest path."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "jharkhand",
      "name": "Jharkhand",
      "region": "East",
      "media": "temple",
      "tagline": "Land of Forests",
      "unesco": false,
      "blurb": "A mineral-rich plateau state of waterfalls and dense sal forests, its Deoghar temple complex among the most-visited Shiva pilgrimage sites in the country.",
      "stats": {
        "area": "79,716 km²",
        "districts": "24",
        "language": "Hindi, Santali, Ho",
        "founded": "2000"
      },
      "culture": {
        "festivals": [
          {
            "name": "Shravani Mela, Deoghar",
            "month": "July/August"
          },
          {
            "name": "Sarhul",
            "month": "March/April"
          }
        ],
        "dance": [
          "Chhau dance"
        ],
        "cuisine": [
          "Litti chokha",
          "Dhuska",
          "Rugra"
        ],
        "dress": "Tussar silk sarees"
      },
      "districts": [
        {
          "id": "deoghar",
          "name": "Deoghar",
          "blurb": "A major Shiva pilgrimage town in eastern Jharkhand, one of India's twelve Jyotirlinga sites.",
          "media": "temple",
          "places": [
            {
              "id": "baidyanath-temple",
              "name": "Baidyanath Temple",
              "type": "Temple",
              "media": "temple",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "The temple spire against the evening sky from the main square",
              "blurb": "One of the twelve Jyotirlingas, a walled cluster of 22 temples centred on the main Shiva shrine, drawing one of eastern India's largest annual pilgrimages.",
              "rating": 4.4,
              "entry": "Free",
              "open": "4 AM–3:30 PM, 6–9 PM",
              "bestSeason": "Oct–Feb",
              "history": "One of the twelve Jyotirlingas of Shiva, the temple's present structure is generally dated to the 18th century, rebuilt under regional royal patronage after earlier structures fell into disrepair, though the site's religious significance is described in far older textual traditions.",
              "architecture": "A cluster of 22 temples within one walled complex, the main shrine topped with a tall Nagara-style spire crowned by a distinctive silver-and-gold pinnacle (chakra and pataka flag).",
              "timeline": [
                {
                  "y": 1596,
                  "label": "Local tradition records a Raja of the region funding temple repairs."
                },
                {
                  "y": 1757,
                  "label": "Temple significantly rebuilt in its present form."
                }
              ],
              "facts": [
                "One of the twelve Jyotirlingas, among the most sacred Shiva sites in India.",
                "Draws one of India's largest annual pilgrimages during the Shravani Mela in the monsoon month of Shravan.",
                "The complex includes 21 subsidiary shrines around the main temple."
              ],
              "hiddenGems": [
                "Nandan Pahar hill park nearby",
                "Tapovan hills with meditation caves outside town",
                "Naulakha Mandir, a marble temple funded by a maharani in the early 20th century"
              ],
              "food": [
                "Bengali-influenced sweets like peda, a Deoghar specialty",
                "Simple thalis at pilgrim dining halls"
              ],
              "experiences": [
                "Joining the kanwar pilgrimage tradition during Shravan (intense crowds)",
                "Visiting Tapovan's meditation caves",
                "Evening aarti at the main shrine"
              ],
              "travel": {
                "railway": "Baidyanath Dham Railway Station, 2.5 km",
                "airport": "Deoghar Airport, 10 km",
                "parking": "Near the temple complex, limited during festival season",
                "tip": "Avoid the Shravani Mela month if you prefer a calmer visit — it is one of the most crowded pilgrimages in eastern India."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "madhya-pradesh",
      "name": "Madhya Pradesh",
      "region": "Central",
      "media": "temple",
      "tagline": "Heart of India",
      "unesco": true,
      "blurb": "Geographically central and historically layered, Madhya Pradesh holds some of India's finest temple sculpture, tiger reserves, and Mughal-era cities.",
      "stats": {
        "area": "308,245 km²",
        "districts": "55",
        "language": "Hindi",
        "founded": "1956"
      },
      "culture": {
        "festivals": [
          {
            "name": "Khajuraho Dance Festival",
            "month": "February"
          },
          {
            "name": "Kalidasa Samaroh, Ujjain",
            "month": "November"
          }
        ],
        "dance": [
          "Rai dance"
        ],
        "cuisine": [
          "Poha",
          "Bhutte ka Kees",
          "Bafla-Baati"
        ],
        "dress": "Chanderi and Maheshwari sarees"
      },
      "districts": [
        {
          "id": "chhatarpur",
          "name": "Chhatarpur",
          "blurb": "Home to Khajuraho, once capital of the Chandela dynasty and now a UNESCO World Heritage cluster.",
          "media": "temple",
          "places": [
            {
              "id": "khajuraho-temples",
              "name": "Khajuraho Group of Monuments",
              "type": "Temple Complex",
              "media": "temple",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "Late afternoon side-light raking across the carved façades",
              "blurb": "A cluster of Nagara-style temples renowned worldwide for their intricate sculptural work, built by the Chandela dynasty and rediscovered from the jungle in 1838.",
              "rating": 4.7,
              "entry": "₹40 (Indian) / ₹600 (Foreign)",
              "open": "6 AM–6 PM",
              "bestSeason": "Oct–Mar",
              "history": "Built between roughly 950 and 1050 CE by rulers of the Chandela dynasty, the complex once numbered around 85 temples, of which about 20 survive today. The site was largely reclaimed by jungle and forgotten until British officer T.S. Burt documented it in 1838.",
              "architecture": "Nagara-style temples renowned for extensive sculptural work, including intricate depictions of deities, celestial figures, and everyday life, carved across the exterior walls in horizontal bands.",
              "timeline": [
                {
                  "y": 950,
                  "label": "Major temple-building phase begins under the Chandela dynasty."
                },
                {
                  "y": 1050,
                  "label": "Principal construction phase concludes."
                },
                {
                  "y": 1838,
                  "label": "Site rediscovered and documented by British officer T.S. Burt."
                },
                {
                  "y": 1986,
                  "label": "Inscribed as a UNESCO World Heritage Site."
                }
              ],
              "facts": [
                "Of the original roughly 85 temples, only about 20 survive today.",
                "The temples are grouped into western, eastern and southern clusters.",
                "Only a fraction of the carvings are erotic in theme, contrary to popular assumption — most depict deities, daily life and mythology."
              ],
              "hiddenGems": [
                "Eastern group's Jain temples, quieter than the main western cluster",
                "Raneh Falls canyon nearby",
                "Khajuraho's State Museum of Tribal and Folk Art"
              ],
              "food": [
                "Madhya Pradesh-style poha for breakfast",
                "Bafla-baati at local Chhatarpur eateries"
              ],
              "experiences": [
                "Sound-and-light show at the Western Group in the evening",
                "Guided sculpture-reading walk explaining the temple iconography",
                "Day trip to Raneh Falls and Panna National Park"
              ],
              "travel": {
                "railway": "Khajuraho Railway Station, 5 km",
                "airport": "Khajuraho Airport, 5 km",
                "parking": "At the Western Group entrance",
                "tip": "Hire a licensed guide at the entrance — the carvings reward context far more than a solo walk-through."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "maharashtra",
      "name": "Maharashtra",
      "region": "West",
      "media": "cave",
      "tagline": "Land of Warriors",
      "unesco": true,
      "blurb": "From Deccan hill forts to rock-cut cave monasteries carved straight into cliff faces, Maharashtra's heritage spans two thousand years of continuous artistic achievement.",
      "stats": {
        "area": "307,713 km²",
        "districts": "36",
        "language": "Marathi",
        "founded": "1960"
      },
      "culture": {
        "festivals": [
          {
            "name": "Ganesh Chaturthi",
            "month": "August/September"
          },
          {
            "name": "Ellora Ajanta Festival",
            "month": "November"
          }
        ],
        "dance": [
          "Lavani"
        ],
        "cuisine": [
          "Puran Poli",
          "Misal Pav",
          "Vada Pav"
        ],
        "dress": "Paithani sarees"
      },
      "districts": [
        {
          "id": "aurangabad",
          "name": "Chhatrapati Sambhajinagar (Aurangabad)",
          "blurb": "A district built around one of the greatest concentrations of rock-cut art in the world.",
          "media": "cave",
          "places": [
            {
              "id": "ajanta-caves",
              "name": "Ajanta Caves",
              "type": "Cave Monastery",
              "media": "cave",
              "budget": "Medium",
              "difficulty": "Easy–Moderate (many steps)",
              "bestPhoto": "The horseshoe cliff face from Sunset Point across the gorge",
              "blurb": "A horseshoe-shaped cliff of 30 rock-cut Buddhist caves, famous above all for surviving mural paintings that are among the oldest and finest in the Buddhist world.",
              "rating": 4.7,
              "entry": "₹40 (Indian) / ₹600 (Foreign)",
              "open": "9 AM–5:30 PM (closed Mondays)",
              "bestSeason": "Nov–Mar",
              "history": "A set of 30 rock-cut Buddhist cave monuments excavated in two main phases, the earliest around the 2nd century BCE and a later, more elaborate phase around the 5th century CE under the Vakataka dynasty. The caves were abandoned and swallowed by jungle for over a thousand years until British officer John Smith rediscovered them in 1819 while tiger hunting.",
              "architecture": "Carved directly into a horseshoe-shaped cliff face above the Waghora river, the caves include chaityas (prayer halls) and viharas (monasteries), famous above all for their surviving mural paintings depicting the Jataka tales.",
              "timeline": [
                {
                  "y": -200,
                  "label": "Earliest caves excavated during the first construction phase."
                },
                {
                  "y": 460,
                  "label": "Second major phase of cave excavation and painting under Vakataka patronage."
                },
                {
                  "y": 1819,
                  "label": "Rediscovered by British officer John Smith."
                },
                {
                  "y": 1983,
                  "label": "Inscribed as a UNESCO World Heritage Site."
                }
              ],
              "facts": [
                "Contains some of the oldest and best-preserved Buddhist murals in the world.",
                "Abandoned for over a millennium before its 19th-century rediscovery.",
                "Cave 26's reclining Buddha and Cave 1's murals are among the most celebrated works."
              ],
              "hiddenGems": [
                "Sunset Point viewpoint across the gorge from the caves",
                "Ellora Caves, roughly two hours away, combining Buddhist, Hindu and Jain sites",
                "Panchakki, a 17th-century water mill in nearby Aurangabad"
              ],
              "food": [
                "Maharashtrian thali in nearby Fardapur",
                "Naan qalia, a local Aurangabad specialty"
              ],
              "experiences": [
                "Guided mural-reading tour of the painted caves",
                "Photography from the horseshoe-cliff viewpoint",
                "Combined two-day trip with the Ellora Caves"
              ],
              "travel": {
                "railway": "Jalgaon, ~60 km",
                "airport": "Aurangabad Airport, ~100 km",
                "parking": "At the visitor centre, with shuttle buses to the caves",
                "tip": "Cave interiors are dim by design — bring a small torch (flash photography is restricted) to see the murals properly."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "manipur",
      "name": "Manipur",
      "region": "Northeast",
      "media": "fort",
      "tagline": "Jewel of India",
      "unesco": false,
      "blurb": "A bowl-shaped valley ringed by hills, Manipur's Meitei culture centres on the historic seat of its kings and one of India's only all-women-run marketplaces.",
      "stats": {
        "area": "22,327 km²",
        "districts": "16",
        "language": "Meiteilon (Manipuri)",
        "founded": "1972"
      },
      "culture": {
        "festivals": [
          {
            "name": "Yaoshang",
            "month": "March"
          },
          {
            "name": "Lai Haraoba",
            "month": "April/May"
          }
        ],
        "dance": [
          "Manipuri classical dance"
        ],
        "cuisine": [
          "Eromba",
          "Singju",
          "Chak-hao (black rice) kheer"
        ],
        "dress": "Innaphi shawls"
      },
      "districts": [
        {
          "id": "imphal-west",
          "name": "Imphal West",
          "blurb": "The heart of the Manipur valley, centred on the historic royal seat of Kangla.",
          "media": "fort",
          "places": [
            {
              "id": "kangla-fort",
              "name": "Kangla Fort",
              "type": "Fort",
              "media": "fort",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "The Kangla Sha sculptures against the moat at golden hour",
              "blurb": "The moated historic seat of Manipur's Meitei kings, spiritual heart of the state, held by colonial forces for over a century before its return in 2004.",
              "rating": 4.3,
              "entry": "₹10 nominal fee",
              "open": "9 AM–4:30 PM (closed Mondays)",
              "bestSeason": "Oct–Mar",
              "history": "The historic seat of Manipur's Meitei kings, Kangla was the royal capital and religious centre for centuries until the mid-18th century relocation of the palace. It was occupied by British forces after the Anglo-Manipur War of 1891 and was only handed back to the state in 2004.",
              "architecture": "A moated complex containing palace ruins, temples, and the Kangla Sha — a pair of mythical dragon-lion sculptures considered a symbol of Manipur — alongside earthen ramparts and gateways.",
              "timeline": [
                {
                  "y": 1891,
                  "label": "British forces occupy Kangla Fort after the Anglo-Manipur War."
                },
                {
                  "y": 2004,
                  "label": "The fort is formally handed back to the Manipur state government."
                }
              ],
              "facts": [
                "Occupied by the Assam Rifles for over a century before being returned to civilian control.",
                "The Kangla Sha dragon-lion motif appears widely across Manipuri state symbolism today.",
                "Considered the spiritual heart of the Meitei people."
              ],
              "hiddenGems": [
                "Govindajee Temple adjoining the fort",
                "Ima Keithel (\"Mother's Market\"), an all-women-run market in central Imphal",
                "Loktak Lake and its floating phumdi islands, a short drive away"
              ],
              "food": [
                "Manipuri thali with eromba and singju",
                "Local rice beer traditions in nearby villages"
              ],
              "experiences": [
                "Heritage walk through the fort ramparts and moat",
                "Visiting Ima Keithel market",
                "Day trip to Loktak Lake"
              ],
              "travel": {
                "railway": "No direct rail; nearest is Dimapur, ~215 km",
                "airport": "Imphal Airport (Bir Tikendrajit Intl), 8 km",
                "parking": "At the fort entrance",
                "tip": "Combine with a visit to Ima Keithel market in the same day — both sit centrally in Imphal."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "mizoram",
      "name": "Mizoram",
      "region": "Northeast",
      "media": "village",
      "tagline": "Land of the Highlanders",
      "unesco": false,
      "blurb": "A state of steep forested ridges and Mizo hill villages, where community-run heritage sites preserve a way of life largely reshaped by 19th-century mission history.",
      "stats": {
        "area": "21,081 km²",
        "districts": "11",
        "language": "Mizo",
        "founded": "1987"
      },
      "culture": {
        "festivals": [
          {
            "name": "Chapchar Kut",
            "month": "March"
          },
          {
            "name": "Mim Kut",
            "month": "August/September"
          }
        ],
        "dance": [
          "Cheraw (bamboo dance)"
        ],
        "cuisine": [
          "Bai (vegetable stew)",
          "Bamboo shoot dishes",
          "Sawhchiar"
        ],
        "dress": "Puanchei woven shawls"
      },
      "districts": [
        {
          "id": "mamit",
          "name": "Mamit",
          "blurb": "A forested western Mizoram district bordering Tripura and Bangladesh, home to Reiek Hill.",
          "media": "village",
          "places": [
            {
              "id": "reiek-heritage-village",
              "name": "Reiek Heritage Village",
              "type": "Heritage Village",
              "media": "village",
              "budget": "Low",
              "difficulty": "Easy–Moderate",
              "bestPhoto": "Ridge-top sunset looking toward the Bangladesh border hills",
              "blurb": "A recreated traditional Mizo village at the base of Reiek Hill, rebuilding a pre-mission-era lifestyle largely displaced across the 19th and 20th centuries.",
              "rating": 4.4,
              "entry": "Nominal entry fee",
              "open": "8 AM–5 PM",
              "bestSeason": "Nov–Mar",
              "history": "Reiek Tlang (Reiek Hill) has long held cultural significance for the Mizo people. In recent decades the state tourism department developed a heritage village at its base recreating traditional Mizo houses and lifestyle from before large-scale conversion to Christianity in the 19th–20th centuries.",
              "architecture": "Traditional bamboo-and-thatch Mizo houses rebuilt to represent the pre-colonial village layout, alongside viewpoints along the ridge above offering views into neighbouring states and Bangladesh.",
              "timeline": [
                {
                  "y": 1996,
                  "label": "Reiek Heritage Village developed by the Mizoram tourism department."
                }
              ],
              "facts": [
                "Reiek Hill offers views into Bangladesh and Tripura on a clear day.",
                "The heritage village recreates a lifestyle largely displaced by 19th–20th century missionary influence.",
                "A popular short trek destination from Aizawl for weekend visitors."
              ],
              "hiddenGems": [
                "Sunset viewpoint from the ridge above the heritage village",
                "Tam Dil Lake, a natural lake nearby",
                "Local Mizo bamboo-craft demonstrations in the village"
              ],
              "food": [
                "Bai, a traditional Mizo vegetable stew",
                "Local bamboo-shoot dishes"
              ],
              "experiences": [
                "Short ridge trek above the village",
                "Traditional Mizo house tour",
                "Camping overnight near Reiek for sunrise views"
              ],
              "travel": {
                "railway": "No rail in Mizoram; nearest is Silchar, Assam, ~180 km",
                "airport": "Lengpui Airport, Aizawl, ~35 km",
                "parking": "At the village entrance",
                "tip": "Weekends draw local day-trippers from Aizawl — visit on a weekday for a quieter experience."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "nagaland",
      "name": "Nagaland",
      "region": "Northeast",
      "media": "village",
      "tagline": "Land of Festivals",
      "unesco": false,
      "blurb": "A state of terraced hillside villages and fiercely preserved tribal identity, where Khonoma pioneered community-led conservation decades before it became a global idea.",
      "stats": {
        "area": "16,579 km²",
        "districts": "16",
        "language": "English (official); Naga languages",
        "founded": "1963"
      },
      "culture": {
        "festivals": [
          {
            "name": "Hornbill Festival",
            "month": "December"
          },
          {
            "name": "Sekrenyi",
            "month": "February"
          }
        ],
        "dance": [
          "War dance (Angami)"
        ],
        "cuisine": [
          "Smoked pork with bamboo shoot",
          "Axone",
          "Anishi"
        ],
        "dress": "Naga shawls"
      },
      "districts": [
        {
          "id": "kohima",
          "name": "Kohima",
          "blurb": "Nagaland's capital district, ringed by terraced Angami Naga villages in the surrounding hills.",
          "media": "village",
          "places": [
            {
              "id": "khonoma-village",
              "name": "Khonoma Village",
              "type": "Heritage Village",
              "media": "village",
              "budget": "Low",
              "difficulty": "Moderate (hillside walking)",
              "bestPhoto": "Terraced fields catching early light from the ridge above the village",
              "blurb": "An Angami Naga village famed both for its fierce 1879 resistance to British forces and for pioneering community-led conservation a century later.",
              "rating": 4.6,
              "entry": "Village entry/conservation fee",
              "open": "Daylight hours",
              "bestSeason": "Oct–Apr",
              "history": "An Angami Naga village with a history of fierce resistance to British colonial expansion in the late 19th century, notably during the Battle of Khonoma in 1879–80. The village later became a pioneer of community-led conservation, establishing the Khonoma Nature Conservation and Tragopan Sanctuary in 1998, giving up hunting traditions to protect the endangered Blyth's tragopan pheasant.",
              "architecture": "Traditional Angami Naga stone-terraced village architecture with wood-and-thatch houses, elaborately carved wooden gate posts, and terraced jhum and wet-rice agricultural fields on the surrounding hillsides.",
              "timeline": [
                {
                  "y": 1879,
                  "label": "Battle of Khonoma, a major Angami Naga stand against British colonial forces."
                },
                {
                  "y": 1998,
                  "label": "Village establishes the Khonoma Nature Conservation and Tragopan Sanctuary, ending traditional hunting on its land."
                }
              ],
              "facts": [
                "Often cited as India's first \"green village\" for its community conservation model.",
                "Famous for the centuries-old terraced agricultural system built into the hillsides.",
                "The 1879–80 battle here is remembered as one of the fiercest resistances to British expansion in the Naga Hills."
              ],
              "hiddenGems": [
                "Dzüköu Valley trek trailhead accessible from the region",
                "Khonoma's original wooden village gates",
                "Terraced paddy field viewpoints above the village"
              ],
              "food": [
                "Naga smoked pork with bamboo shoot",
                "Axone (fermented soybean) dishes"
              ],
              "experiences": [
                "Guided walk through the conservation sanctuary",
                "Terraced field trail walk",
                "Homestay with an Angami Naga family"
              ],
              "travel": {
                "railway": "Dimapur, ~85 km",
                "airport": "Dimapur Airport, ~90 km",
                "parking": "At the village entrance",
                "tip": "Arrange a local guide through the village council — it supports the community directly and unlocks the conservation-trail access."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "odisha",
      "name": "Odisha",
      "region": "East",
      "media": "temple",
      "tagline": "Soul of India",
      "unesco": true,
      "blurb": "A long, temple-studded coastline where the Kalinga architectural tradition reached its most spectacular expression in a giant stone chariot to the sun.",
      "stats": {
        "area": "155,707 km²",
        "districts": "30",
        "language": "Odia",
        "founded": "1936"
      },
      "culture": {
        "festivals": [
          {
            "name": "Rath Yatra, Puri",
            "month": "June/July"
          },
          {
            "name": "Konark Dance Festival",
            "month": "December"
          }
        ],
        "dance": [
          "Odissi"
        ],
        "cuisine": [
          "Dalma",
          "Pakhala",
          "Chhena Poda"
        ],
        "dress": "Sambalpuri sarees"
      },
      "districts": [
        {
          "id": "puri",
          "name": "Puri",
          "blurb": "A temple-town coastline famous for its Jagannath Temple and, further along the shore, Konark.",
          "media": "temple",
          "places": [
            {
              "id": "konark-sun-temple",
              "name": "Konark Sun Temple",
              "type": "Temple",
              "media": "temple",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "The carved stone wheels in raking late-afternoon light",
              "blurb": "A colossal 13th-century stone chariot dedicated to the sun god Surya, its 24 carved wheels doubling as working sundials.",
              "rating": 4.7,
              "entry": "₹40 (Indian) / ₹600 (Foreign)",
              "open": "6 AM–8 PM",
              "bestSeason": "Oct–Feb",
              "history": "Built around 1250 CE under King Narasimhadeva I of the Eastern Ganga dynasty, the temple was conceived as a colossal stone chariot for the sun god Surya. A combination of structural issues and, by some accounts, damage during medieval invasions left the main tower collapsed by the 19th century, though the surviving structure remains one of India's most celebrated monuments.",
              "architecture": "Designed as a massive chariot with 24 elaborately carved stone wheels (each functioning as a sundial) and a team of seven sculpted horses, built from Khondalite rock in the Kalinga architectural style.",
              "timeline": [
                {
                  "y": 1250,
                  "label": "Temple constructed under King Narasimhadeva I."
                },
                {
                  "y": 1837,
                  "label": "Main tower recorded as collapsed by this point, condition documented by colonial surveyors."
                },
                {
                  "y": 1984,
                  "label": "Inscribed as a UNESCO World Heritage Site."
                }
              ],
              "facts": [
                "Its 24 carved wheels double as functioning sundials, accurate to within a few minutes.",
                "Sometimes called the \"Black Pagoda\" by early European sailors, for its dark stone silhouette.",
                "The temple's main sanctum tower collapsed centuries ago; the surviving audience hall gives a sense of its original scale."
              ],
              "hiddenGems": [
                "Chandrabhaga Beach, a short walk from the temple",
                "Konark Museum housing recovered sculptures",
                "Ramachandi Temple along the coast road"
              ],
              "food": [
                "Odia thali with dalma and pakhala",
                "Fresh seafood at Chandrabhaga Beach shacks"
              ],
              "experiences": [
                "Sunrise viewing from Chandrabhaga Beach followed by the temple",
                "Konark Dance Festival (early December) if timed right",
                "Guided tour explaining the sundial-wheel carvings"
              ],
              "travel": {
                "railway": "Puri Railway Station, ~35 km",
                "airport": "Bhubaneswar (Biju Patnaik Intl), ~65 km",
                "parking": "At the temple complex entrance",
                "tip": "Visit at sunrise or late afternoon — the carved stone takes on a warm glow and the heat is far more manageable."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "punjab",
      "name": "Punjab",
      "region": "North",
      "media": "temple",
      "tagline": "Land of Five Rivers",
      "unesco": false,
      "blurb": "Punjab's Sikh heritage centres on Amritsar's Golden Temple, whose free community kitchen and open-door philosophy make it one of the most welcoming religious sites on earth.",
      "stats": {
        "area": "50,362 km²",
        "districts": "23",
        "language": "Punjabi",
        "founded": "1966"
      },
      "culture": {
        "festivals": [
          {
            "name": "Baisakhi",
            "month": "April"
          },
          {
            "name": "Guru Nanak Gurpurab",
            "month": "November"
          }
        ],
        "dance": [
          "Bhangra",
          "Giddha"
        ],
        "cuisine": [
          "Sarson da Saag",
          "Makki di Roti",
          "Amritsari Kulcha"
        ],
        "dress": "Phulkari dupattas"
      },
      "districts": [
        {
          "id": "amritsar",
          "name": "Amritsar",
          "blurb": "Punjab's spiritual capital, built around the sacred tank and temple that give the city its name.",
          "media": "temple",
          "places": [
            {
              "id": "golden-temple",
              "name": "Golden Temple (Harmandir Sahib)",
              "type": "Temple",
              "media": "temple",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "The gilded sanctum reflected in the Amrit Sarovar at night",
              "blurb": "The holiest shrine in Sikhism, its gold-gilded sanctum rising from the centre of a sacred tank, open day and night to people of every faith.",
              "rating": 4.9,
              "entry": "Free",
              "open": "24 hours",
              "bestSeason": "Oct–Mar",
              "history": "Founded by the fourth Sikh Guru, Guru Ram Das, in the 16th century, with the temple structure itself built by the fifth Guru, Guru Arjan, who completed it in 1604 and installed the Adi Granth within it. The temple was rebuilt and gilded in the early 19th century under Maharaja Ranjit Singh.",
              "architecture": "The sanctum sits at the centre of the sacred Amrit Sarovar tank, its lower walls of white marble and upper structure gilded with gold, blending Mughal and Sikh architectural traditions, approached via a causeway from the surrounding parkarma (walkway).",
              "timeline": [
                {
                  "y": 1577,
                  "label": "Foundation and excavation of the Amrit Sarovar tank begins under Guru Ram Das."
                },
                {
                  "y": 1604,
                  "label": "Harmandir Sahib completed and the Adi Granth installed by Guru Arjan."
                },
                {
                  "y": 1830,
                  "label": "Upper structure gilded in gold under Maharaja Ranjit Singh, giving the temple its name."
                }
              ],
              "facts": [
                "Runs one of the world's largest free community kitchens (langar), serving upwards of 100,000 meals daily.",
                "The temple is open to people of all faiths and backgrounds, a founding principle of the site.",
                "Its four entrances, one on each side, symbolise openness to all four directions and communities."
              ],
              "hiddenGems": [
                "Jallianwala Bagh, a short walk away, for a very different and sobering historical layer",
                "Central Sikh Museum within the complex",
                "Attari-Wagah border ceremony, a short drive from Amritsar"
              ],
              "food": [
                "Free langar meal at the temple itself, open to all visitors",
                "Amritsari kulcha and lassi in the old city market"
              ],
              "experiences": [
                "Volunteering in the langar kitchen",
                "Night-time viewing of the illuminated temple",
                "Attending the Attari-Wagah border retreat ceremony"
              ],
              "travel": {
                "railway": "Amritsar Junction, 2 km",
                "airport": "Sri Guru Ram Dass Jee Intl, 11 km",
                "parking": "Large lots around the complex perimeter",
                "tip": "Cover your head (scarves are provided free at the entrance) and go barefoot — wading through the shallow foot-wash channel is part of the entry ritual."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "sikkim",
      "name": "Sikkim",
      "region": "North",
      "media": "monastery",
      "tagline": "Himalayan Buddhist Kingdom",
      "unesco": false,
      "blurb": "A small former Himalayan kingdom of terraced monasteries and snow peaks, Sikkim's Buddhist heritage remains its most distinctive cultural thread.",
      "stats": {
        "area": "7,096 km²",
        "districts": "6",
        "language": "Nepali, Sikkimese, Lepcha",
        "founded": "1975"
      },
      "culture": {
        "festivals": [
          {
            "name": "Losar",
            "month": "February"
          },
          {
            "name": "Saga Dawa",
            "month": "May/June"
          }
        ],
        "dance": [
          "Chaam masked dance"
        ],
        "cuisine": [
          "Thukpa",
          "Momos",
          "Gundruk"
        ],
        "dress": "Bakhu robes"
      },
      "districts": [
        {
          "id": "east-sikkim",
          "name": "East Sikkim (Gangtok)",
          "blurb": "Sikkim's capital district, ringed by monasteries on forested ridges above the town.",
          "media": "monastery",
          "places": [
            {
              "id": "rumtek-monastery",
              "name": "Rumtek Monastery",
              "type": "Monastery",
              "media": "monastery",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "The golden roof ornaments against Sikkim's hills",
              "blurb": "The main seat-in-exile of the Karma Kagyu school of Tibetan Buddhism, rebuilt in the 1960s by the 16th Karmapa after fleeing Tibet.",
              "rating": 4.6,
              "entry": "Free (donations welcome)",
              "open": "6 AM–6 PM",
              "bestSeason": "Mar–May, Oct–Nov",
              "history": "Originally built in the mid-16th century, the monastery fell into disrepair before being rebuilt in the 1960s by the 16th Karmapa after he fled Tibet, re-establishing it as the main seat-in-exile of the Karma Kagyu school of Tibetan Buddhism.",
              "architecture": "Traditional Tibetan monastic design with vividly painted murals, a golden stupa housing relics of the 16th Karmapa, and a shrine hall centred on a large Buddha statue.",
              "timeline": [
                {
                  "y": 1740,
                  "label": "Original monastery built at the site (approximate)."
                },
                {
                  "y": 1966,
                  "label": "Monastery rebuilt by the 16th Karmapa after arriving in Sikkim from Tibet."
                }
              ],
              "facts": [
                "Considered the main seat-in-exile of the Karma Kagyu lineage of Tibetan Buddhism.",
                "Home to a Golden Stupa containing relics of the 16th Karmapa.",
                "Hosts an annual Chaam masked dance festival in winter."
              ],
              "hiddenGems": [
                "Old Rumtek Monastery ruins just below the new complex",
                "Sang Choeling Monastery near Pelling, one of Sikkim's oldest",
                "Views of Gangtok town from the monastery ridge"
              ],
              "food": [
                "Sikkimese thukpa and momos",
                "Local butter tea at monastery-adjacent stalls"
              ],
              "experiences": [
                "Attending a monastic prayer session",
                "Photography of the Golden Stupa interior",
                "Combining with a Gangtok city day trip"
              ],
              "travel": {
                "railway": "New Jalpaiguri, ~124 km",
                "airport": "Pakyong Airport, ~40 km; Bagdogra as main hub",
                "parking": "At the monastery entrance",
                "tip": "Check ahead for the winter Chaam masked-dance festival dates if you want to time your visit around it."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "telangana",
      "name": "Telangana",
      "region": "South",
      "media": "monument",
      "tagline": "City of Pearls",
      "unesco": false,
      "blurb": "Carved out of Andhra Pradesh in 2014, Telangana's Deccan heritage centres on Hyderabad's Qutb Shahi-era monuments and its old bazaars.",
      "stats": {
        "area": "112,077 km²",
        "districts": "33",
        "language": "Telugu, Urdu",
        "founded": "2014"
      },
      "culture": {
        "festivals": [
          {
            "name": "Bathukamma",
            "month": "September/October"
          },
          {
            "name": "Bonalu",
            "month": "July/August"
          }
        ],
        "dance": [
          "Perini Sivatandavam"
        ],
        "cuisine": [
          "Hyderabadi Biryani",
          "Sarva Pindi",
          "Qubani ka Meetha"
        ],
        "dress": "Gadwal sarees"
      },
      "districts": [
        {
          "id": "hyderabad",
          "name": "Hyderabad",
          "blurb": "Telangana's capital, built around the old Qutb Shahi city and its landmark gateway.",
          "media": "monument",
          "places": [
            {
              "id": "charminar",
              "name": "Charminar",
              "type": "Monument",
              "media": "monument",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "The illuminated monument at night from the bazaar side",
              "blurb": "A 16th-century four-minaret gateway at the heart of Hyderabad's old city, built by the founder of the Qutb Shahi dynasty and still ringed by one of India's oldest bazaars.",
              "rating": 4.5,
              "entry": "₹25 (Indian) / ₹300 (Foreign)",
              "open": "9:30 AM–5:30 PM",
              "bestSeason": "Oct–Feb",
              "history": "Built in 1591 by Muhammad Quli Qutb Shah, the fifth ruler of the Qutb Shahi dynasty, traditionally said to mark either the founding of the city of Hyderabad or to commemorate the end of a plague epidemic.",
              "architecture": "A square structure with four grand arches facing the cardinal directions, each topped by a minaret roughly 56 metres tall, blending Persian and Qutb Shahi architectural styles, built from granite and lime mortar.",
              "timeline": [
                {
                  "y": 1591,
                  "label": "Charminar built under Muhammad Quli Qutb Shah."
                },
                {
                  "y": 1889,
                  "label": "Clocks installed on all four faces of the structure."
                }
              ],
              "facts": [
                "\"Charminar\" translates literally to \"four minarets.\"",
                "A mosque occupies the top floor of the structure, still in occasional use.",
                "The surrounding Laad Bazaar is one of India's oldest markets for bangles and pearls."
              ],
              "hiddenGems": [
                "Laad Bazaar's bangle and pearl lanes right beside the monument",
                "Mecca Masjid, one of India's largest mosques, adjoining Charminar",
                "Chowmahalla Palace, former seat of the Nizams, a short walk away"
              ],
              "food": [
                "Hyderabadi biryani at old-city restaurants near Charminar",
                "Irani chai and Osmania biscuits at nearby cafés"
              ],
              "experiences": [
                "Night-time illuminated viewing of Charminar",
                "Pearl and bangle shopping in Laad Bazaar",
                "Old city heritage walk covering Charminar, Mecca Masjid and Chowmahalla Palace"
              ],
              "travel": {
                "railway": "Hyderabad Deccan (Nampally), 5 km",
                "airport": "Rajiv Gandhi Intl, 30 km",
                "parking": "Limited around the monument; old city traffic is heavy",
                "tip": "Visit around sunset when the monument is lit and the surrounding bazaar is at its liveliest."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "tripura",
      "name": "Tripura",
      "region": "Northeast",
      "media": "palace",
      "tagline": "Land of the Lake Palace",
      "unesco": false,
      "blurb": "A small hill-and-lake state on the Bangladesh border, its royal Manikya dynasty heritage epitomised by a palace rising from the middle of a lake.",
      "stats": {
        "area": "10,486 km²",
        "districts": "8",
        "language": "Bengali, Kokborok",
        "founded": "1972"
      },
      "culture": {
        "festivals": [
          {
            "name": "Neermahal Water Festival",
            "month": "August"
          },
          {
            "name": "Kharchi Puja",
            "month": "July"
          }
        ],
        "dance": [
          "Hojagiri"
        ],
        "cuisine": [
          "Mui Borok fish dishes",
          "Bamboo-shoot curries",
          "Chakhwi"
        ],
        "dress": "Rignai-Risa handwoven textiles"
      },
      "districts": [
        {
          "id": "sepahijala",
          "name": "Sepahijala",
          "blurb": "A lake-and-forest district south of Agartala, home to Tripura's royal water palace.",
          "media": "lake",
          "places": [
            {
              "id": "neermahal",
              "name": "Neermahal (Water Palace)",
              "type": "Palace",
              "media": "palace",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "The palace domes reflected in Rudrasagar Lake from the approaching boat",
              "blurb": "A summer palace rising from the middle of Rudrasagar Lake, built in the early 20th century by Tripura's royal family and reachable only by boat.",
              "rating": 4.3,
              "entry": "Boat fare + nominal entry",
              "open": "8 AM–5 PM",
              "bestSeason": "Nov–Feb",
              "history": "Built between 1927 and 1938 by Maharaja Bir Bikram Kishore Manikya of the Tripura royal family as a summer palace, rising from the middle of Rudrasagar Lake.",
              "architecture": "A blend of Hindu and Mughal architectural styles, with domes, arches and pavilions symmetrically arranged across two connected wings — one for the royal family's residence, the other for public ceremonial functions.",
              "timeline": [
                {
                  "y": 1927,
                  "label": "Construction begins under Maharaja Bir Bikram Kishore Manikya."
                },
                {
                  "y": 1938,
                  "label": "Palace completed."
                }
              ],
              "facts": [
                "One of the only lake palaces in eastern India, reachable only by boat.",
                "Hosts the annual Neermahal Water Festival, including boat races on Rudrasagar Lake.",
                "The two wings of the palace were designed for distinctly different uses — private versus public."
              ],
              "hiddenGems": [
                "Rudrasagar Lake's birdwatching spots, especially migratory waterfowl in winter",
                "Sepahijala Wildlife Sanctuary nearby",
                "Local fishing village life along the lake shore"
              ],
              "food": [
                "Tripuri-style fish preparations using local Rudrasagar catch",
                "Bamboo-shoot based curries typical of the region"
              ],
              "experiences": [
                "Boat ride across Rudrasagar Lake to reach the palace",
                "Birdwatching at the lake in winter migratory season",
                "Combined day trip with Sepahijala Wildlife Sanctuary"
              ],
              "travel": {
                "railway": "Agartala, ~55 km",
                "airport": "Maharaja Bir Bikram Airport, Agartala, ~58 km",
                "parking": "At the boat jetty",
                "tip": "Go in the early morning for calmer water and better reflections of the palace domes."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "uttarakhand",
      "name": "Uttarakhand",
      "region": "North",
      "media": "temple",
      "tagline": "Land of the Gods",
      "unesco": false,
      "blurb": "The high Himalayan headwaters of the Ganga, Uttarakhand's Char Dham pilgrimage circuit includes some of Hinduism's most physically demanding sacred sites.",
      "stats": {
        "area": "53,483 km²",
        "districts": "13",
        "language": "Hindi, Garhwali, Kumaoni",
        "founded": "2000"
      },
      "culture": {
        "festivals": [
          {
            "name": "Kumbh Mela, Haridwar (periodic)",
            "month": "Varies"
          },
          {
            "name": "Nanda Devi Raj Jat",
            "month": "Every 12 years"
          }
        ],
        "dance": [
          "Langvir Nritya"
        ],
        "cuisine": [
          "Kafuli",
          "Bal Mithai",
          "Aloo ke Gutke"
        ],
        "dress": "Woollen Pichoras"
      },
      "districts": [
        {
          "id": "rudraprayag",
          "name": "Rudraprayag",
          "blurb": "A mountainous district at the confluence of the Alaknanda and Mandakini rivers, gateway to Kedarnath.",
          "media": "temple",
          "places": [
            {
              "id": "kedarnath-temple",
              "name": "Kedarnath Temple",
              "type": "Temple",
              "media": "temple",
              "budget": "Medium–High (helicopter option) / Low (trek)",
              "difficulty": "Hard (high-altitude trek)",
              "bestPhoto": "The temple against snow peaks in early morning light",
              "blurb": "One of the twelve Jyotirlingas, a stone temple at over 3,500 metres reachable only on foot, pony or helicopter, that famously survived the devastating 2013 floods largely intact.",
              "rating": 4.8,
              "entry": "Free",
              "open": "Late Apr/May – Oct/Nov only (seasonal)",
              "bestSeason": "May–Jun, Sep–Oct",
              "history": "One of the twelve Jyotirlingas and part of the Char Dham pilgrimage circuit, the present stone temple is traditionally attributed to the 8th-century philosopher Adi Shankaracharya, built on a much older site of worship. The temple famously survived largely intact during the devastating 2013 Uttarakhand floods, when a large boulder is credited with diverting floodwaters around the main structure.",
              "architecture": "A robust stone structure built from massive interlocked grey stone slabs, in a simple, sturdy style suited to its high-altitude Himalayan setting at over 3,500 metres, fronted by a large statue of Nandi the bull.",
              "timeline": [
                {
                  "y": 800,
                  "label": "Present stone temple built, traditionally attributed to Adi Shankaracharya."
                },
                {
                  "y": 2013,
                  "label": "Catastrophic Uttarakhand floods devastate the surrounding town; the temple structure itself survives largely intact."
                }
              ],
              "facts": [
                "One of the twelve Jyotirlingas and part of the Char Dham Yatra pilgrimage circuit.",
                "Only accessible on foot or by helicopter — no road reaches the temple directly.",
                "Closed for roughly six months each winter due to heavy snow, with the deity ceremonially moved to Ukhimath."
              ],
              "hiddenGems": [
                "Vasuki Tal, a high-altitude lake beyond Kedarnath",
                "Bhairavnath Temple, just above the main shrine",
                "Gandhi Sarovar (Chorabari Tal), a short trek from the temple"
              ],
              "food": [
                "Simple pilgrim-hall meals along the trek route",
                "Hot ginger tea at trailside stalls"
              ],
              "experiences": [
                "The roughly 16 km trek (or pony/helicopter) from Gaurikund",
                "Sunrise viewing of the surrounding snow peaks",
                "Visiting Bhairavnath Temple above the main shrine"
              ],
              "travel": {
                "railway": "Rishikesh, ~215 km (nearest major station)",
                "airport": "Dehradun (Jolly Grant), ~235 km",
                "parking": "At Gaurikund, the trek starting point",
                "tip": "Book helicopter tickets far in advance if you don't plan to trek — they sell out fast in peak season (May–Jun)."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "west-bengal",
      "name": "West Bengal",
      "region": "East",
      "media": "memorial",
      "tagline": "Cultural Capital of the East",
      "unesco": false,
      "blurb": "From colonial Kolkata's grand marble memorials to the Sundarbans' mangrove wilderness, West Bengal carries one of India's richest literary and artistic legacies.",
      "stats": {
        "area": "88,752 km²",
        "districts": "23",
        "language": "Bengali",
        "founded": "1947"
      },
      "culture": {
        "festivals": [
          {
            "name": "Durga Puja",
            "month": "September/October"
          },
          {
            "name": "Poila Boishakh",
            "month": "April"
          }
        ],
        "dance": [
          "Chhau",
          "Gaudiya Nritya"
        ],
        "cuisine": [
          "Machher Jhol",
          "Shorshe Ilish",
          "Mishti Doi"
        ],
        "dress": "Tant and Baluchari sarees"
      },
      "districts": [
        {
          "id": "kolkata",
          "name": "Kolkata",
          "blurb": "The former capital of British India, its colonial-era monuments concentrated around the Maidan.",
          "media": "memorial",
          "places": [
            {
              "id": "victoria-memorial",
              "name": "Victoria Memorial",
              "type": "Memorial",
              "media": "memorial",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "The marble façade and dome reflected in the garden pool at sunset",
              "blurb": "A grand white-marble memorial to Queen Victoria, built from the same quarries as the Taj Mahal and now housing one of India's largest colonial-era art collections.",
              "rating": 4.6,
              "entry": "₹30 (Indian) / ₹500 (Foreign) for museum; gardens separate",
              "open": "10 AM–5 PM (museum, closed Mondays); gardens until later",
              "bestSeason": "Nov–Feb",
              "history": "Built between 1906 and 1921 as a memorial to Queen Victoria, commissioned by Lord Curzon and designed by architect William Emerson, funded largely through public and princely-state donations rather than government funds.",
              "architecture": "A grand Indo-Saracenic structure combining British and Mughal architectural elements, built entirely of white Makrana marble (the same quarries used for the Taj Mahal), topped by a bronze Angel of Victory that can rotate with the wind.",
              "timeline": [
                {
                  "y": 1906,
                  "label": "Foundation stone laid by the Prince of Wales."
                },
                {
                  "y": 1921,
                  "label": "Memorial formally opened to the public."
                }
              ],
              "facts": [
                "Built from the same Makrana marble quarries as the Taj Mahal.",
                "Its bronze Angel of Victory weighs about 3 tonnes and can rotate in strong wind.",
                "Now functions as a museum housing a large collection of colonial-era paintings, sculpture and artefacts."
              ],
              "hiddenGems": [
                "The surrounding 64-acre gardens, popular for a quiet evening walk",
                "Nearby St. Paul's Cathedral",
                "Kolkata Race Course, adjoining the memorial grounds"
              ],
              "food": [
                "Kolkata-style street food (puchka, jhalmuri) around Maidan",
                "Traditional Bengali sweets at nearby confectioners"
              ],
              "experiences": [
                "Evening sound-and-light show in the gardens",
                "Museum galleries inside the memorial",
                "A slow walk through the surrounding gardens at sunset"
              ],
              "travel": {
                "railway": "Kolkata (Howrah/Sealdah), ~4-5 km",
                "airport": "Netaji Subhas Chandra Bose Intl, ~17 km",
                "parking": "At the memorial grounds",
                "tip": "The gardens and building façade are especially photogenic in the last hour before sunset, when the marble takes on a warm tone."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "andaman-nicobar",
      "name": "Andaman and Nicobar Islands",
      "region": "Island",
      "media": "memorial",
      "tagline": "Emerald Isles",
      "unesco": false,
      "blurb": "A remote archipelago of coral reefs and rainforest, carrying both a difficult colonial-era prison history and some of India's clearest waters.",
      "stats": {
        "area": "8,249 km²",
        "districts": "3",
        "language": "Hindi, Bengali, Tamil, Nicobarese",
        "founded": "1956"
      },
      "culture": {
        "festivals": [
          {
            "name": "Island Tourism Festival",
            "month": "December/January"
          }
        ],
        "dance": [
          "Nicobarese folk dance"
        ],
        "cuisine": [
          "Fresh seafood curries",
          "Coconut-based Andamanese dishes"
        ],
        "dress": "Casual coastal wear"
      },
      "districts": [
        {
          "id": "south-andaman",
          "name": "South Andaman",
          "blurb": "The administrative heart of the islands, centred on Port Blair.",
          "media": "memorial",
          "places": [
            {
              "id": "cellular-jail",
              "name": "Cellular Jail",
              "type": "Colonial Prison",
              "media": "memorial",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "The central watchtower and surviving wing at sunset",
              "blurb": "A former British colonial prison for political prisoners, its solitary-cell design so isolating that transportation here was known as \"Kala Pani\" — the black water.",
              "rating": 4.5,
              "entry": "₹30 (Indian) / ₹500 (Foreign)",
              "open": "9 AM–12:30 PM, 1:30–4:45 PM (closed Mondays)",
              "bestSeason": "Nov–Apr",
              "history": "Built by the British colonial administration between 1896 and 1906 as a high-security prison for political prisoners and freedom fighters, its solitary-cell design earning it the nickname \"Kala Pani\" for the dread it inspired. Many prominent Indian independence activists, including Veer Savarkar, were imprisoned here.",
              "architecture": "Originally built as a seven-wing structure radiating from a central watchtower (three wings survive today), designed so cells faced away from each other, enforcing total isolation between prisoners.",
              "timeline": [
                {
                  "y": 1896,
                  "label": "Construction begins under British colonial administration."
                },
                {
                  "y": 1906,
                  "label": "Prison completed with 693 solitary cells."
                },
                {
                  "y": 1942,
                  "label": "Japanese forces occupy the Andaman Islands during WWII, briefly controlling the jail."
                },
                {
                  "y": 1979,
                  "label": "Declared a national memorial."
                }
              ],
              "facts": [
                "Originally had seven radiating wings; only three survive today.",
                "Its nickname \"Kala Pani\" reflected the isolation and dread associated with transportation here.",
                "Hosts a nightly sound-and-light show recounting its history."
              ],
              "hiddenGems": [
                "Chatham Saw Mill, one of Asia's oldest and largest, nearby",
                "Corbyn's Cove Beach, a short drive from Port Blair",
                "Ross Island (Netaji Subhas Chandra Bose Dweep) ruins across the harbour"
              ],
              "food": [
                "Fresh seafood thalis around Port Blair",
                "Coconut-based Andamanese curries"
              ],
              "experiences": [
                "Evening sound-and-light show at the jail",
                "Ferry trip to Ross Island ruins",
                "Snorkelling day trip to nearby reefs"
              ],
              "travel": {
                "railway": "No rail on the islands",
                "airport": "Veer Savarkar Intl, Port Blair, 4 km",
                "parking": "At the jail complex",
                "tip": "Book the evening sound-and-light show ahead — it sells out in peak tourist season (Dec–Jan)."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "chandigarh",
      "name": "Chandigarh",
      "region": "North",
      "media": "garden",
      "tagline": "The City Beautiful",
      "unesco": false,
      "blurb": "A planned modernist city designed by Le Corbusier, whose best-loved landmark was built secretly and illegally from decades of recycled waste.",
      "stats": {
        "area": "114 km²",
        "districts": "1",
        "language": "Punjabi, Hindi, English",
        "founded": "1966 (UT status)"
      },
      "culture": {
        "festivals": [
          {
            "name": "Chandigarh Carnival",
            "month": "November"
          }
        ],
        "dance": [
          "Bhangra"
        ],
        "cuisine": [
          "Punjabi street food",
          "Chole Bhature"
        ],
        "dress": "Modern Punjabi fusion wear"
      },
      "districts": [
        {
          "id": "chandigarh-district",
          "name": "Chandigarh",
          "blurb": "India's first fully planned post-independence city, laid out in sectors by Le Corbusier.",
          "media": "garden",
          "places": [
            {
              "id": "rock-garden",
              "name": "Rock Garden (Nek Chand)",
              "type": "Sculpture Garden",
              "media": "garden",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "The recycled-mosaic courtyards in soft afternoon light",
              "blurb": "A sprawling 40-acre sculpture garden built secretly over 18 years from industrial and household waste, discovered by authorities in 1975 and preserved rather than demolished.",
              "rating": 4.5,
              "entry": "₹30 (Indian) / ₹150 (Foreign)",
              "open": "9 AM–6:30 PM",
              "bestSeason": "Oct–Mar",
              "history": "Created secretly, starting in 1957, by government roads inspector Nek Chand, who began building sculptures from industrial and household waste on forest land outside the city without official authorization. When discovered by authorities in 1975, the scale and quality of the work led the city to formally support and protect it rather than demolish it.",
              "architecture": "A sprawling sculpture garden of interlinked courtyards, waterfalls, and pathways, built almost entirely from recycled materials — broken bangles, ceramic fragments, electrical waste, and industrial scrap — reassembled into thousands of figures.",
              "timeline": [
                {
                  "y": 1957,
                  "label": "Nek Chand secretly begins building the garden on forest land."
                },
                {
                  "y": 1975,
                  "label": "The garden is discovered by city authorities and formally recognised rather than demolished."
                },
                {
                  "y": 1976,
                  "label": "Officially opened to the public as the Rock Garden."
                }
              ],
              "facts": [
                "Built entirely from recycled industrial and household waste.",
                "Constructed secretly and illegally for its first 18 years before official recognition.",
                "Now spans roughly 40 acres and draws among the highest visitor numbers of any garden in India."
              ],
              "hiddenGems": [
                "Sukhna Lake, a short distance away, for an evening walk",
                "The garden's lesser-visited waterfall courtyards toward the rear",
                "Chandigarh's Capitol Complex (Le Corbusier architecture), a UNESCO site nearby"
              ],
              "food": [
                "Punjabi street food around Sector 17",
                "Chandigarh-style chole bhature"
              ],
              "experiences": [
                "Self-guided walk through the maze-like courtyards",
                "Combined visit with Sukhna Lake in the same evening",
                "Photography of the recycled-material sculptures"
              ],
              "travel": {
                "railway": "Chandigarh Railway Station, ~8 km",
                "airport": "Chandigarh Airport, ~10 km",
                "parking": "At the garden entrance",
                "tip": "Go in the late afternoon and continue on to Sukhna Lake for sunset — the two sit within walking distance of each other."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "dnh-daman-diu",
      "name": "Dadra and Nagar Haveli and Daman and Diu",
      "region": "West",
      "media": "fort",
      "tagline": "Portuguese India",
      "unesco": false,
      "blurb": "A merged Union Territory of two former Portuguese enclaves, its four centuries of colonial rule left forts, churches and old quarters unlike anywhere else on India's west coast.",
      "stats": {
        "area": "603 km²",
        "districts": "3",
        "language": "Gujarati, Marathi, Portuguese-influenced Konkani",
        "founded": "2020 (merged UT)"
      },
      "culture": {
        "festivals": [
          {
            "name": "Diu Festival",
            "month": "December/January"
          }
        ],
        "dance": [
          "Tarpa dance (Nagar Haveli)"
        ],
        "cuisine": [
          "Goan-Portuguese-influenced seafood",
          "Fish curry rice"
        ],
        "dress": "Coastal casual wear"
      },
      "districts": [
        {
          "id": "diu",
          "name": "Diu",
          "blurb": "A small island district off Gujarat's Saurashtra coast, under Portuguese rule for over four centuries.",
          "media": "fort",
          "places": [
            {
              "id": "diu-fort",
              "name": "Diu Fort",
              "type": "Fort",
              "media": "fort",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "The lighthouse and ramparts against the Arabian Sea at sunset",
              "blurb": "A massive 16th-century Portuguese coastal fortress with double moats and cannons still in place, guarding the entrance to Diu island for over four centuries of colonial rule.",
              "rating": 4.4,
              "entry": "Free",
              "open": "8 AM–6 PM",
              "bestSeason": "Oct–Mar",
              "history": "Built by the Portuguese starting in 1535, following a treaty with the Sultan of Gujarat granting them the island, as a defensive stronghold against Ottoman and Gujarat Sultanate naval threats. Diu remained under Portuguese control until 1961, far longer than most of colonial India.",
              "architecture": "A massive coastal fort with double moats (one filled with seawater), thick ramparts, cannons still in place, and a lighthouse, built in a European military engineering style overlooking the Arabian Sea.",
              "timeline": [
                {
                  "y": 1535,
                  "label": "Fort construction begins under Portuguese rule."
                },
                {
                  "y": 1546,
                  "label": "Fort successfully withstands a major siege by Gujarat Sultanate and Ottoman forces."
                },
                {
                  "y": 1961,
                  "label": "Diu, along with Goa and Daman, is annexed by India, ending Portuguese colonial rule."
                }
              ],
              "facts": [
                "Portuguese rule over Diu lasted over four centuries, ending only in 1961.",
                "The fort withstood a significant Ottoman-Gujarat Sultanate joint siege in 1546.",
                "Diu's old town still shows strong Portuguese architectural influence in its churches and houses."
              ],
              "hiddenGems": [
                "Gangeshwar Temple, a set of Shiva shrines right on the rocky shore",
                "Naida Caves, unusual sculpted caverns near the fort",
                "Diu's Portuguese-era church, St. Paul's"
              ],
              "food": [
                "Goan-Portuguese-influenced seafood unusual for Gujarat's otherwise vegetarian-leaning coast",
                "Diu's local fish curry with rice"
              ],
              "experiences": [
                "Sunset walk along the fort ramparts",
                "Diu beach-hopping (Nagoa, Ghoghla)",
                "Old town heritage walk through the Portuguese quarter"
              ],
              "travel": {
                "railway": "Veraval, ~90 km",
                "airport": "Diu Airport, 7 km",
                "parking": "At the fort entrance",
                "tip": "Diu allows alcohol sale unlike most of Gujarat — plan accordingly if that matters to your trip, and always drive cautiously on the coastal roads."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "delhi",
      "name": "Delhi",
      "region": "North",
      "media": "fort",
      "tagline": "The Capital of Empires",
      "unesco": true,
      "blurb": "Seven historic cities layered into one modern capital, Delhi's Mughal-era monuments sit within a short walk of some of India's busiest bazaars.",
      "stats": {
        "area": "1,484 km²",
        "districts": "11",
        "language": "Hindi, Punjabi, Urdu",
        "founded": "1956 (UT); NCT since 1991"
      },
      "culture": {
        "festivals": [
          {
            "name": "Republic Day Parade",
            "month": "January"
          },
          {
            "name": "Phool Walon Ki Sair",
            "month": "September/October"
          }
        ],
        "dance": [
          "Kathak"
        ],
        "cuisine": [
          "Chaat",
          "Butter Chicken",
          "Paranthe"
        ],
        "dress": "Modern Indo-Western fusion"
      },
      "districts": [
        {
          "id": "central-delhi",
          "name": "Central Delhi",
          "blurb": "Old Delhi's historic core, built around Shah Jahan's 17th-century walled capital.",
          "media": "fort",
          "places": [
            {
              "id": "red-fort",
              "name": "Red Fort (Lal Qila)",
              "type": "Fort",
              "media": "fort",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "The Lahori Gate façade at sunset from across the moat garden",
              "blurb": "The main residence of the Mughal emperors for over two centuries, a massive red-sandstone fort from whose ramparts India's Prime Minister still addresses the nation every Independence Day.",
              "rating": 4.5,
              "entry": "₹35 (Indian) / ₹550 (Foreign)",
              "open": "9:30 AM–4:30 PM (closed Mondays)",
              "bestSeason": "Oct–Mar",
              "history": "Built as the main residence of the Mughal emperors, commissioned by Shah Jahan in 1638 when he shifted the Mughal capital from Agra to the newly founded city of Shahjahanabad (Old Delhi); it remained the ceremonial and political centre of Mughal power until 1857, after which the British repurposed much of the complex for military use.",
              "architecture": "A massive red sandstone fort following an octagonal plan, blending Persian, Timurid, and earlier Indian architectural traditions, containing palaces, halls (including the marble Diwan-i-Khas, \"Hall of Private Audience\"), and formal gardens laid out on Mughal charbagh principles.",
              "timeline": [
                {
                  "y": 1638,
                  "label": "Construction begins under Shah Jahan."
                },
                {
                  "y": 1648,
                  "label": "Fort completed, becoming the seat of Mughal power."
                },
                {
                  "y": 1857,
                  "label": "British forces take control after the Indian Rebellion of 1857; much of the interior is later demolished or repurposed."
                },
                {
                  "y": 1947,
                  "label": "India's first Prime Minister raises the national flag here on Independence Day, a tradition continued annually."
                },
                {
                  "y": 2007,
                  "label": "Inscribed as a UNESCO World Heritage Site."
                }
              ],
              "facts": [
                "The Prime Minister of India delivers the Independence Day address from its ramparts every August 15.",
                "Roughly two-thirds of the original interior structures were demolished or altered under British military occupation.",
                "The Peacock Throne, one of history's most famous jeweled thrones, was originally housed here before being carried off in a 1739 invasion."
              ],
              "hiddenGems": [
                "Chandni Chowk's old lanes just outside the fort walls",
                "Salimgarh Fort, an older fortification connected to the Red Fort complex",
                "The sound-and-light show held on the fort grounds most evenings"
              ],
              "food": [
                "Old Delhi street food at Chandni Chowk (parathas, chaat)",
                "Karim's, a historic Mughlai restaurant near Jama Masjid"
              ],
              "experiences": [
                "Evening sound-and-light show retelling Mughal history",
                "Old Delhi heritage walk from the fort to Jama Masjid and Chandni Chowk",
                "Museum galleries within the fort complex"
              ],
              "travel": {
                "railway": "Old Delhi Railway Station, 2 km",
                "airport": "Indira Gandhi Intl, ~24 km",
                "parking": "Limited nearby; Delhi Metro (Lal Qila / Chandni Chowk stations) is more reliable",
                "tip": "Combine with Chandni Chowk and Jama Masjid in the same outing — all three are within easy walking distance."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "jammu-kashmir",
      "name": "Jammu and Kashmir",
      "region": "North",
      "media": "garden",
      "tagline": "Paradise on Earth",
      "unesco": false,
      "blurb": "A Himalayan valley of lakes and Mughal terraced gardens, Kashmir's centuries-old garden architecture remains some of the most romanticised landscape design in South Asia.",
      "stats": {
        "area": "42,241 km² (UT)",
        "districts": "20",
        "language": "Kashmiri, Dogri, Urdu",
        "founded": "2019 (UT status)"
      },
      "culture": {
        "festivals": [
          {
            "name": "Tulip Festival, Srinagar",
            "month": "April"
          },
          {
            "name": "Amarnath Yatra",
            "month": "July/August"
          }
        ],
        "dance": [
          "Rouf"
        ],
        "cuisine": [
          "Wazwan multi-course feast",
          "Rogan Josh",
          "Kahwa tea"
        ],
        "dress": "Pheran robes"
      },
      "districts": [
        {
          "id": "srinagar",
          "name": "Srinagar",
          "blurb": "Kashmir's summer capital, built around Dal Lake and a string of Mughal-era terraced gardens.",
          "media": "garden",
          "places": [
            {
              "id": "shalimar-bagh",
              "name": "Shalimar Bagh",
              "type": "Mughal Garden",
              "media": "garden",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "The central water channel framed by chinar trees in autumn colour",
              "blurb": "The grandest of Srinagar's Mughal gardens, laid out in 1619 by Emperor Jahangir for Empress Nur Jahan on the banks of Dal Lake.",
              "rating": 4.7,
              "entry": "₹24 (Indian) / ₹300 (Foreign) approx.",
              "open": "9 AM–7 PM (seasonal)",
              "bestSeason": "Apr–May, Sep–Oct",
              "history": "Built in 1619 by Mughal Emperor Jahangir for his wife Empress Nur Jahan, on the banks of Dal Lake, as the largest and most celebrated of Srinagar's Mughal gardens, later expanded under Shah Jahan.",
              "architecture": "A terraced Persian-style charbagh garden rising through three ascending levels — originally reserved respectively for the public, the emperor, and the women of the royal household — linked by a central water channel with fountains, framed by chinar trees.",
              "timeline": [
                {
                  "y": 1619,
                  "label": "Garden laid out under Emperor Jahangir."
                },
                {
                  "y": 1630,
                  "label": "Further pavilions and expansion added under Shah Jahan."
                }
              ],
              "facts": [
                "Its name translates roughly to \"abode of love.\"",
                "The garden's central channel and fountains were engineered using gravity-fed water from the surrounding hills.",
                "Its towering chinar (plane) trees, some centuries old, are a defining feature of the Kashmir Valley landscape."
              ],
              "hiddenGems": [
                "Nishat Bagh, another Mughal garden nearby, often quieter than Shalimar",
                "Dal Lake shikara (boat) rides departing near the garden",
                "Hazratbal Shrine on the lake's northern shore"
              ],
              "food": [
                "Kashmiri wazwan multi-course feast at Srinagar restaurants",
                "Kahwa (spiced saffron tea) from lakeside stalls"
              ],
              "experiences": [
                "Evening sound-and-light show in the garden (seasonal)",
                "Shikara ride on Dal Lake combined with the garden visit",
                "Houseboat stay on Dal Lake"
              ],
              "travel": {
                "railway": "No direct rail to Srinagar; nearest major hub is Jammu Tawi",
                "airport": "Srinagar Airport, ~15 km",
                "parking": "At the garden entrance",
                "tip": "Visit in April–May for tulip and blossom season, or September–October for the chinar trees turning brilliant red and gold."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "lakshadweep",
      "name": "Lakshadweep",
      "region": "Island",
      "media": "island",
      "tagline": "Coral Isles of India",
      "unesco": false,
      "blurb": "India's smallest Union Territory, a scatter of coral atolls in the Arabian Sea whose lagoons are among the clearest and least developed in South Asia.",
      "stats": {
        "area": "32 km²",
        "districts": "1",
        "language": "Malayalam, Mahl",
        "founded": "1956"
      },
      "culture": {
        "festivals": [
          {
            "name": "Eid celebrations (majority Muslim population)",
            "month": "Varies"
          }
        ],
        "dance": [
          "Lava dance"
        ],
        "cuisine": [
          "Fresh tuna preparations",
          "Coconut-based curries"
        ],
        "dress": "Simple coastal wear"
      },
      "districts": [
        {
          "id": "lakshadweep-district",
          "name": "Lakshadweep",
          "blurb": "The archipelago's single administrative district, spanning all its inhabited islands.",
          "media": "island",
          "places": [
            {
              "id": "agatti-island",
              "name": "Agatti Island",
              "type": "Coral Atoll",
              "media": "island",
              "budget": "Medium–High (permits + flights)",
              "difficulty": "Easy (once permitted)",
              "bestPhoto": "The turquoise lagoon shading to deep blue, shot from the air on approach",
              "blurb": "The main air gateway to the Lakshadweep archipelago, ringed by one of the most vivid and accessible coral lagoons in the islands.",
              "rating": 4.7,
              "entry": "Permit required (fee applies)",
              "open": "Access via scheduled flights/ferries",
              "bestSeason": "Oct–May",
              "history": "Part of the Lakshadweep archipelago, a coral-atoll chain whose Malayalam- and Mahl-speaking communities have inhabited these islands for centuries as a fishing and coconut-cultivation society. Agatti became significant in recent decades as the archipelago's main gateway, home to its only commercial airport.",
              "architecture": "No monumental built heritage in the conventional sense — the island's defining feature is its coral reef lagoon system and traditional Lakshadweep coconut-thatch fishing settlements, alongside a functioning airstrip that makes it the entry point to the wider archipelago.",
              "timeline": [
                {
                  "y": 1988,
                  "label": "Agatti Airport opens, becoming the main air gateway to the Lakshadweep islands."
                }
              ],
              "facts": [
                "One of the few Lakshadweep islands with an airport, making it the practical gateway to the archipelago.",
                "Its lagoon is considered among the most vivid and accessible for snorkelling in the islands.",
                "Permits are required for all non-resident Indian and foreign visitors to Lakshadweep."
              ],
              "hiddenGems": [
                "Agatti's uninhabited neighbouring islets, visitable by local boat",
                "Kavaratti, the union territory capital, a short boat ride away",
                "Bangaram Island's lagoon, further out but exceptionally clear"
              ],
              "food": [
                "Fresh tuna preparations, a Lakshadweep staple",
                "Coconut-based curries typical of the islands"
              ],
              "experiences": [
                "Snorkelling and glass-bottom boat rides over the lagoon",
                "Traditional Lakshadweep fishing village visit",
                "Island-hopping by local boat"
              ],
              "travel": {
                "railway": "None (island archipelago)",
                "airport": "Agatti Airport, on the island itself",
                "parking": "Not applicable",
                "tip": "Arrange your Lakshadweep entry permit well in advance — it is mandatory and can take time to process."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "puducherry",
      "name": "Puducherry",
      "region": "South",
      "media": "colonial",
      "tagline": "The French Riviera of the East",
      "unesco": false,
      "blurb": "A former French colonial trading post on the Tamil Nadu coast, its grid-planned quarter of mustard-yellow villas and bougainvillea a world apart from the rest of the region.",
      "stats": {
        "area": "479 km²",
        "districts": "4",
        "language": "Tamil, French, English",
        "founded": "1963 (formal integration)"
      },
      "culture": {
        "festivals": [
          {
            "name": "Bastille Day",
            "month": "July"
          },
          {
            "name": "Puducherry Beach Festival",
            "month": "August"
          }
        ],
        "dance": [
          "Bharatanatyam (shared with Tamil Nadu)"
        ],
        "cuisine": [
          "French-Tamil fusion cuisine",
          "Filter coffee"
        ],
        "dress": "French-Tamil fusion wear"
      },
      "districts": [
        {
          "id": "puducherry-district",
          "name": "Puducherry",
          "blurb": "The Union Territory's namesake town, split by a canal into its French and Tamil quarters.",
          "media": "colonial",
          "places": [
            {
              "id": "french-quarter",
              "name": "French Quarter (White Town)",
              "type": "Colonial Heritage Zone",
              "media": "colonial",
              "budget": "Low",
              "difficulty": "Easy",
              "bestPhoto": "A mustard-yellow colonial façade draped in bougainvillea on a quiet French Quarter street",
              "blurb": "A grid-planned former French colonial quarter of mustard-yellow villas and shuttered windows, preserving nearly three centuries of French administration on India's east coast.",
              "rating": 4.5,
              "entry": "Free (Auroville/ashram may have separate norms)",
              "open": "Open streets; ashram/Auroville have specific hours",
              "bestSeason": "Nov–Feb",
              "history": "Puducherry (formerly Pondicherry) was a French colonial trading post from 1674, remaining under French administration until 1954 — nearly two decades after Indian independence — before being formally integrated into India in 1963; the French Quarter preserves the layout and architecture of that colonial era.",
              "architecture": "Grid-planned colonial streets lined with mustard-yellow and white villas, bougainvillea-draped walls, and French-style shuttered windows, distinctly different from the \"Tamil Quarter\" layout on the other side of the town's central canal.",
              "timeline": [
                {
                  "y": 1674,
                  "label": "French East India Company establishes a trading post at Pondicherry."
                },
                {
                  "y": 1954,
                  "label": "De facto transfer of French administration to India."
                },
                {
                  "y": 1963,
                  "label": "Formal legal integration of Pondicherry into the Indian Union."
                }
              ],
              "facts": [
                "French remained an official administrative language here for decades after independence, and Puducherry still has a small Franco-Indian community.",
                "The town's French Quarter and Tamil Quarter are historically divided by a central canal.",
                "Puducherry retains its own Union Territory legislature, distinct from neighbouring Tamil Nadu."
              ],
              "hiddenGems": [
                "Auroville, an experimental international township a short drive away",
                "Promenade Beach at dawn before the crowds",
                "Sri Aurobindo Ashram, in the heart of the French Quarter"
              ],
              "food": [
                "French-Tamil fusion café fare at White Town cafés",
                "Filter coffee and croissants side by side on the same menu, a distinctly Puducherry combination"
              ],
              "experiences": [
                "Bicycle tour of the French Quarter's colonial streets",
                "Sunrise walk along Promenade Beach",
                "Day trip to Auroville and its Matrimandir"
              ],
              "travel": {
                "railway": "Puducherry Railway Station, 2 km",
                "airport": "Chennai Intl, ~135 km (Puducherry Airport has limited service)",
                "parking": "Limited in the French Quarter; best explored on foot or bicycle",
                "tip": "Rent a bicycle for the French Quarter — the grid is small, flat, and far more atmospheric without a car."
              }
            }
          ]
        }
      ]
    }
  ]
};

export const REGIONS = ['All', 'North', 'South', 'East', 'West', 'Central', 'Northeast', 'Island'];

// With all 36 states/UTs catalogued, "has hidden gems" / "has cuisine" no longer discriminate
// (every entry has both) — layers instead highlight genuinely distinct subsets of the map.
const UT_IDS = new Set([
  'andaman-nicobar', 'chandigarh', 'dnh-daman-diu', 'delhi', 'jammu-kashmir', 'ladakh', 'lakshadweep', 'puducherry',
]);
export const LAYERS = [
  { id: 'unesco', label: 'UNESCO', test: (s) => s.unesco },
  { id: 'ut', label: 'Union Territories', test: (s) => UT_IDS.has(s.id) },
  { id: 'northeast', label: 'Northeast', test: (s) => s.region === 'Northeast' },
];

// The 8 originally-catalogued states get the animated "journey" trail on the map — they carry
// extra depth (2 districts / 2 places each) versus the one-place baseline for every other state/UT.
export const FLAGSHIP_IDS = [
  'rajasthan', 'uttar-pradesh', 'kerala', 'karnataka', 'meghalaya', 'ladakh', 'tamil-nadu', 'goa',
];
