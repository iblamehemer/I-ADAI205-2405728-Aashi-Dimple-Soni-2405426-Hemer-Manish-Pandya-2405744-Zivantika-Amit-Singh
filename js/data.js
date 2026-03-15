// ============================================================
// NOVA TECH - AI Branding Assistant
// Data Module: Slogan Database + Marketing Campaign Analytics
// ============================================================

const SLOGAN_DATA = [
  { company: "Coca-Cola", slogan: "Taste The Feeling", category: "Beverages" },
  { company: "Pepsi", slogan: "Delicious. Refreshing. Pepsi.", category: "Beverages" },
  { company: "Red Bull", slogan: "It Gives You Wings", category: "Energy Drinks" },
  { company: "Monster Energy", slogan: "Unleash the Beast", category: "Energy Drinks" },
  { company: "Sprite", slogan: "Obey Your Thirst", category: "Beverages" },
  { company: "Fanta", slogan: "Drink Fanta, Stay Bamboocha", category: "Beverages" },
  { company: "Dr. Pepper", slogan: "What's the Worst That Could Happen?", category: "Beverages" },
  { company: "Mountain Dew", slogan: "It'll Tickle Your Innards", category: "Beverages" },
  { company: "Gatorade", slogan: "The Legend Continues", category: "Sports Drinks" },
  { company: "Powerade", slogan: "The Power of Love", category: "Sports Drinks" },
  { company: "Lucozade", slogan: "Lucozade Aids Recovery", category: "Energy Drinks" },
  { company: "Relentless", slogan: "Be Relentless", category: "Energy Drinks" },
  { company: "Starbucks", slogan: "Customize Your Cup", category: "Coffee" },
  { company: "Costa Coffee", slogan: "For Coffee Lovers", category: "Coffee" },
  { company: "Maxwell House", slogan: "Good to the Last Drop", category: "Coffee" },
  { company: "Folgers", slogan: "The Best Part of Wakin' Up", category: "Coffee" },
  { company: "Nescafe", slogan: "It All Starts With a Nescafé", category: "Coffee" },
  { company: "Lavazza", slogan: "Good Karma. Great Coffee.", category: "Coffee" },
  { company: "Caribou Coffee", slogan: "Stay Awake for It", category: "Coffee" },
  { company: "Lipton", slogan: "Be More Tea", category: "Tea" },
  { company: "PG Tips", slogan: "Put the Kettle On", category: "Tea" },
  { company: "Twinings", slogan: "Gets You Back to You", category: "Tea" },
  { company: "Tetley", slogan: "Make Time, Make Tetley", category: "Tea" },
  { company: "Yorkshire Tea", slogan: "Let's Have a Proper Brew", category: "Tea" },
  { company: "Dilmah", slogan: "The Finest Tea on Earth", category: "Tea" },
  { company: "Heineken", slogan: "It's All About the Beer", category: "Beer" },
  { company: "Budweiser", slogan: "The King of Beers", category: "Beer" },
  { company: "Carlsberg", slogan: "Probably the Best Beer in the World", category: "Beer" },
  { company: "Corona", slogan: "Miles Away From Ordinary", category: "Beer" },
  { company: "Guinness", slogan: "Guinness is Good for You", category: "Beer" },
  { company: "Stella Artois", slogan: "Reassuringly Expensive", category: "Beer" },
  { company: "Kronenbourg 1664", slogan: "Sit. Savour. 1664.", category: "Beer" },
  { company: "Beck's", slogan: "Life Beckons", category: "Beer" },
  { company: "Amstel", slogan: "Taste Life. Pure Filtered.", category: "Beer" },
  { company: "Tuborg", slogan: "Beer Yourself", category: "Beer" },
  { company: "Johnnie Walker", slogan: "Keep Walking", category: "Spirits" },
  { company: "Absolut Vodka", slogan: "Absolut Perfection", category: "Spirits" },
  { company: "Patron Tequila", slogan: "Simply Perfect", category: "Spirits" },
  { company: "Smirnoff", slogan: "The Greatest Name in Vodka", category: "Spirits" },
  { company: "Hennessy", slogan: "Mix Accordingly", category: "Spirits" },
  { company: "Bacardi", slogan: "Thirsty for Life? Drink Responsibly.", category: "Spirits" },
  { company: "Captain Morgan", slogan: "Enjoy the Contradiction", category: "Spirits" },
  { company: "Baileys Irish Cream", slogan: "The Pleasure Society", category: "Spirits" },
  { company: "Jack Daniel's", slogan: "Independence Since 1866", category: "Spirits" },
  { company: "Grey Goose", slogan: "The World's Best Tasting Vodka", category: "Spirits" },
  { company: "Evian", slogan: "Live Young", category: "Water" },
  { company: "Aquafina", slogan: "Make Your Body Happy", category: "Water" },
  { company: "Perrier", slogan: "The Ultimate Refreshment", category: "Water" },
  { company: "S.Pellegrino", slogan: "Live in Italian", category: "Water" },
  { company: "Volvic", slogan: "Filled With Volcanicity", category: "Water" },
  { company: "Poland Spring", slogan: "Born Better", category: "Water" },
  { company: "McDonald's", slogan: "I'm Lovin' It", category: "Fast Food" },
  { company: "Burger King", slogan: "Have It Your Way", category: "Fast Food" },
  { company: "KFC", slogan: "Finger Lickin' Good", category: "Fast Food" },
  { company: "Subway", slogan: "Eat Fresh", category: "Fast Food" },
  { company: "Taco Bell", slogan: "Think Outside the Bun", category: "Fast Food" },
  { company: "Pizza Hut", slogan: "Make It Great", category: "Fast Food" },
  { company: "Domino's Pizza", slogan: "Pizza Deliver Experts", category: "Fast Food" },
  { company: "Wendy's", slogan: "Do What Tastes Right", category: "Fast Food" },
  { company: "Five Guys", slogan: "Best Burger", category: "Fast Food" },
  { company: "Chick-fil-A", slogan: "Eat Mor Chikin!", category: "Fast Food" },
  { company: "Tim Hortons", slogan: "Always Fresh", category: "Restaurant" },
  { company: "Dunkin' Donuts", slogan: "Loosen Up a Little", category: "Restaurant" },
  { company: "Krispy Kreme", slogan: "Happy All Around", category: "Restaurant" },
  { company: "Applebee's", slogan: "Together is Good", category: "Restaurant" },
  { company: "Olive Garden", slogan: "A Passion for Italy", category: "Restaurant" },
  { company: "Outback Steakhouse", slogan: "No Rules, Just Right", category: "Restaurant" },
  { company: "IHOP", slogan: "Come Hungry, Leave Happy", category: "Restaurant" },
  { company: "Red Lobster", slogan: "See What's Cooking", category: "Restaurant" },
  { company: "Denny's", slogan: "We're Cooking Now", category: "Restaurant" },
  { company: "Pringles", slogan: "Once You Pop, You Can't Stop", category: "Snacks" },
  { company: "Lay's", slogan: "Betcha Can't Eat Just One!", category: "Snacks" },
  { company: "Cheetos", slogan: "Dangerously Cheesy", category: "Snacks" },
  { company: "Doritos", slogan: "For the Bold", category: "Snacks" },
  { company: "Ruffles", slogan: "Ruffles Have RRRidges", category: "Snacks" },
  { company: "Snickers", slogan: "Get Some Nuts!", category: "Snacks" },
  { company: "Kit Kat", slogan: "Have a Break, Have a Kit Kat", category: "Snacks" },
  { company: "Oreo", slogan: "Only Oreo", category: "Snacks" },
  { company: "M&M's", slogan: "Melts in Your Mouth, Not in Your Hands", category: "Snacks" },
  { company: "Skittles", slogan: "Taste the Rainbow", category: "Snacks" },
  { company: "Haribo", slogan: "Kids and Grown-Ups Love It So", category: "Confectionery" },
  { company: "Starburst", slogan: "Unexplainably Juicy", category: "Confectionery" },
  { company: "Twix", slogan: "It's All in the Mix", category: "Confectionery" },
  { company: "Twizzlers", slogan: "Makes Mouths Happy", category: "Confectionery" },
  { company: "Milky Way", slogan: "Life's Better the Milky Way", category: "Confectionery" },
  { company: "3 Musketeers", slogan: "Big on Chocolate!", category: "Confectionery" },
  { company: "Reese's", slogan: "Two Great Tastes Together", category: "Confectionery" },
  { company: "Life Savers", slogan: "A Part of Living", category: "Confectionery" },
  { company: "Toblerone", slogan: "Make Time for Toblerone", category: "Confectionery" },
  { company: "Ben & Jerry's", slogan: "Peace, Love & Ice Cream", category: "Ice Cream" },
  { company: "Haagen-Dazs", slogan: "Made Like No Other", category: "Ice Cream" },
  { company: "Magnum", slogan: "For Pleasure Seekers", category: "Ice Cream" },
  { company: "Baskin-Robbins", slogan: "More Flavors. More Fun.", category: "Ice Cream" },
  { company: "Cornetto", slogan: "Enjoy the Ride, Love the Ending", category: "Ice Cream" },
  { company: "Cadbury Dairy Milk", slogan: "Free the Joy", category: "Chocolate" },
  { company: "Milka", slogan: "Tenderness is Inside", category: "Chocolate" },
  { company: "Hershey's", slogan: "Hello Happy. Hello Hershey's", category: "Chocolate" },
  { company: "Ferrero Rocher", slogan: "Ambassador of Refined Taste", category: "Chocolate" },
  { company: "Lindt", slogan: "Master Chocolatier Since 1845", category: "Chocolate" },
  { company: "Ghirardelli", slogan: "Moments of Timeless Pleasure", category: "Chocolate" },
  { company: "Green & Black's", slogan: "Bring Milk Chocolate Out of Its Shell", category: "Chocolate" },
  { company: "Dove Chocolate", slogan: "Choose Pleasure", category: "Chocolate" },
  { company: "Kellogg's", slogan: "The Simpler the Better", category: "Cereals" },
  { company: "Wheaties", slogan: "The Breakfast of Champions", category: "Cereals" },
  { company: "Frosted Flakes", slogan: "They're G-r-r-r-eat!", category: "Cereals" },
  { company: "Rice Krispies", slogan: "Snap, Crackle, Pop", category: "Cereals" },
  { company: "Lucky Charms", slogan: "They're Magically Delicious", category: "Cereals" },
  { company: "Cheerios", slogan: "Toasted Whole Grain Oat Cereal", category: "Cereals" },
  { company: "NIVEA", slogan: "More Evolved Skincare", category: "Beauty" },
  { company: "Dove", slogan: "The Secret of Beautiful Hair", category: "Beauty" },
  { company: "Colgate", slogan: "Stronger, Healthier Gums", category: "Beauty" },
  { company: "Head & Shoulders", slogan: "Live Head First", category: "Beauty" },
  { company: "Pampers", slogan: "Discover Your Baby's World", category: "Baby Products" },
  { company: "Heinz", slogan: "Good Food Every Day", category: "Food" },
  { company: "Campbell's", slogan: "M'm! M'm! Good!", category: "Food" },
  { company: "Hellmann's", slogan: "Bring Out the Best", category: "Food" },
  { company: "Marmite", slogan: "Love It or Hate It", category: "Food" },
  { company: "Nestlé", slogan: "Good Food, Good Life", category: "Food" },
  { company: "Tropicana", slogan: "Straight From the Fruit", category: "Juice" },
  { company: "Minute Maid", slogan: "Loaded with Taste", category: "Juice" },
  { company: "Naked Juice", slogan: "Worth Its Weight in Good", category: "Juice" },
  { company: "Snapple", slogan: "Made From the Best Stuff on Earth", category: "Juice" },
  { company: "Schweppes", slogan: "Schhh! You Know Who?", category: "Beverages" },
  { company: "Audi", slogan: "Vorsprung Durch Technik", category: "Automotive" },
  { company: "Levi's", slogan: "Original Jeans. Original People.", category: "Fashion" },
  { company: "Lurpak", slogan: "Your Everyday Luxury", category: "Dairy" },
  { company: "Dannon Yogurt", slogan: "Love It for Life", category: "Dairy" },
  { company: "Stork", slogan: "The Difference is Worth Talking About", category: "Dairy" },
];

// ============================================================
// Marketing Campaign Dataset (200 records from CSV)
// ============================================================

const CAMPAIGN_RECORDS = [
  {id:1,company:"Innovate Industries",type:"Email",audience:"Men 18-24",duration:30,channel:"Google Ads",convRate:0.04,cost:16174,roi:6.29,location:"Chicago",clicks:506,impressions:1922,engagement:6,segment:"Health & Wellness"},
  {id:2,company:"NexGen Systems",type:"Email",audience:"Women 35-44",duration:60,channel:"Google Ads",convRate:0.12,cost:11566,roi:5.61,location:"New York",clicks:116,impressions:7523,engagement:7,segment:"Fashionistas"},
  {id:3,company:"Alpha Innovations",type:"Influencer",audience:"Men 25-34",duration:30,channel:"YouTube",convRate:0.07,cost:10200,roi:7.18,location:"Los Angeles",clicks:584,impressions:7698,engagement:1,segment:"Outdoor Adventurers"},
  {id:4,company:"DataTech Solutions",type:"Display",audience:"All Ages",duration:60,channel:"YouTube",convRate:0.11,cost:12724,roi:5.55,location:"Miami",clicks:217,impressions:1820,engagement:7,segment:"Health & Wellness"},
  {id:5,company:"NexGen Systems",type:"Email",audience:"Men 25-34",duration:15,channel:"YouTube",convRate:0.05,cost:16452,roi:6.50,location:"Los Angeles",clicks:379,impressions:4201,engagement:3,segment:"Health & Wellness"},
  {id:6,company:"DataTech Solutions",type:"Display",audience:"All Ages",duration:15,channel:"Instagram",convRate:0.07,cost:9716,roi:4.36,location:"New York",clicks:100,impressions:1643,engagement:1,segment:"Foodies"},
  {id:7,company:"NexGen Systems",type:"Email",audience:"Women 35-44",duration:60,channel:"Website",convRate:0.13,cost:11067,roi:2.86,location:"Los Angeles",clicks:817,impressions:8749,engagement:10,segment:"Tech Enthusiasts"},
  {id:8,company:"DataTech Solutions",type:"Search",audience:"Men 18-24",duration:45,channel:"Google Ads",convRate:0.08,cost:13280,roi:5.55,location:"Los Angeles",clicks:624,impressions:7854,engagement:7,segment:"Outdoor Adventurers"},
  {id:9,company:"Alpha Innovations",type:"Social Media",audience:"Women 35-44",duration:15,channel:"Facebook",convRate:0.09,cost:18066,roi:6.73,location:"Chicago",clicks:861,impressions:1754,engagement:6,segment:"Tech Enthusiasts"},
  {id:10,company:"TechCorp",type:"Email",audience:"Women 35-44",duration:15,channel:"Instagram",convRate:0.09,cost:13766,roi:3.78,location:"Los Angeles",clicks:642,impressions:3856,engagement:3,segment:"Tech Enthusiasts"},
  {id:11,company:"NexGen Systems",type:"Display",audience:"Men 25-34",duration:45,channel:"Email",convRate:0.12,cost:8590,roi:3.49,location:"New York",clicks:321,impressions:6628,engagement:10,segment:"Tech Enthusiasts"},
  {id:12,company:"Innovate Industries",type:"Influencer",audience:"Men 25-34",duration:60,channel:"Google Ads",convRate:0.05,cost:17502,roi:3.59,location:"Los Angeles",clicks:659,impressions:8948,engagement:1,segment:"Foodies"},
  {id:13,company:"TechCorp",type:"Social Media",audience:"Men 25-34",duration:60,channel:"Facebook",convRate:0.09,cost:17189,roi:4.91,location:"Chicago",clicks:677,impressions:8817,engagement:10,segment:"Tech Enthusiasts"},
  {id:14,company:"TechCorp",type:"Email",audience:"Men 25-34",duration:45,channel:"Instagram",convRate:0.14,cost:9975,roi:7.06,location:"New York",clicks:994,impressions:2201,engagement:4,segment:"Health & Wellness"},
  {id:15,company:"TechCorp",type:"Display",audience:"All Ages",duration:45,channel:"Website",convRate:0.04,cost:11346,roi:5.28,location:"Chicago",clicks:482,impressions:8470,engagement:1,segment:"Outdoor Adventurers"},
  {id:16,company:"Innovate Industries",type:"Social Media",audience:"Women 35-44",duration:60,channel:"YouTube",convRate:0.11,cost:9407,roi:2.91,location:"New York",clicks:299,impressions:1512,engagement:5,segment:"Health & Wellness"},
  {id:17,company:"Innovate Industries",type:"Display",audience:"Women 35-44",duration:45,channel:"Website",convRate:0.08,cost:5478,roi:4.53,location:"Houston",clicks:931,impressions:2488,engagement:3,segment:"Fashionistas"},
  {id:18,company:"Alpha Innovations",type:"Influencer",audience:"Men 18-24",duration:15,channel:"Instagram",convRate:0.14,cost:9485,roi:4.48,location:"Miami",clicks:218,impressions:9264,engagement:9,segment:"Health & Wellness"},
  {id:19,company:"Alpha Innovations",type:"Social Media",audience:"Men 25-34",duration:60,channel:"Google Ads",convRate:0.07,cost:19224,roi:6.08,location:"New York",clicks:182,impressions:5798,engagement:1,segment:"Foodies"},
  {id:20,company:"DataTech Solutions",type:"Influencer",audience:"Men 25-34",duration:15,channel:"Google Ads",convRate:0.09,cost:10258,roi:3.83,location:"Miami",clicks:193,impressions:3677,engagement:1,segment:"Tech Enthusiasts"},
  {id:21,company:"DataTech Solutions",type:"Search",audience:"Women 25-34",duration:15,channel:"Email",convRate:0.04,cost:16580,roi:7.99,location:"New York",clicks:975,impressions:1561,engagement:3,segment:"Outdoor Adventurers"},
  {id:22,company:"TechCorp",type:"Influencer",audience:"All Ages",duration:30,channel:"Facebook",convRate:0.02,cost:12824,roi:6.21,location:"New York",clicks:319,impressions:8586,engagement:2,segment:"Foodies"},
  {id:23,company:"NexGen Systems",type:"Social Media",audience:"Women 35-44",duration:15,channel:"YouTube",convRate:0.13,cost:8699,roi:2.12,location:"Miami",clicks:646,impressions:3841,engagement:5,segment:"Health & Wellness"},
  {id:24,company:"Innovate Industries",type:"Email",audience:"Women 25-34",duration:15,channel:"Facebook",convRate:0.04,cost:17608,roi:7.31,location:"Miami",clicks:764,impressions:2157,engagement:8,segment:"Health & Wellness"},
  {id:25,company:"NexGen Systems",type:"Social Media",audience:"Men 18-24",duration:60,channel:"YouTube",convRate:0.07,cost:8773,roi:6.03,location:"Miami",clicks:527,impressions:1733,engagement:1,segment:"Fashionistas"},
  {id:26,company:"NexGen Systems",type:"Search",audience:"Women 25-34",duration:45,channel:"Instagram",convRate:0.04,cost:14756,roi:6.23,location:"Houston",clicks:809,impressions:8236,engagement:10,segment:"Health & Wellness"},
  {id:27,company:"Alpha Innovations",type:"Email",audience:"Women 25-34",duration:45,channel:"Facebook",convRate:0.09,cost:9182,roi:6.03,location:"Houston",clicks:953,impressions:6916,engagement:5,segment:"Fashionistas"},
  {id:28,company:"TechCorp",type:"Email",audience:"Men 25-34",duration:30,channel:"YouTube",convRate:0.07,cost:6601,roi:3.29,location:"New York",clicks:604,impressions:2420,engagement:3,segment:"Foodies"},
  {id:29,company:"TechCorp",type:"Influencer",audience:"Men 18-24",duration:60,channel:"Email",convRate:0.09,cost:11552,roi:7.12,location:"Chicago",clicks:384,impressions:7620,engagement:7,segment:"Tech Enthusiasts"},
  {id:30,company:"TechCorp",type:"Social Media",audience:"Women 25-34",duration:30,channel:"Email",convRate:0.09,cost:11608,roi:3.61,location:"Los Angeles",clicks:952,impressions:4055,engagement:1,segment:"Tech Enthusiasts"},
  {id:31,company:"Innovate Industries",type:"Search",audience:"Men 25-34",duration:45,channel:"Instagram",convRate:0.07,cost:13124,roi:2.77,location:"Houston",clicks:512,impressions:4837,engagement:4,segment:"Tech Enthusiasts"},
  {id:32,company:"NexGen Systems",type:"Influencer",audience:"All Ages",duration:45,channel:"YouTube",convRate:0.07,cost:13245,roi:6.83,location:"New York",clicks:309,impressions:2885,engagement:7,segment:"Foodies"},
  {id:33,company:"NexGen Systems",type:"Display",audience:"Women 35-44",duration:45,channel:"Email",convRate:0.06,cost:5796,roi:4.42,location:"New York",clicks:367,impressions:3218,engagement:9,segment:"Foodies"},
  {id:34,company:"Alpha Innovations",type:"Influencer",audience:"Women 25-34",duration:45,channel:"Google Ads",convRate:0.14,cost:15082,roi:2.71,location:"Los Angeles",clicks:243,impressions:5724,engagement:4,segment:"Health & Wellness"},
  {id:35,company:"NexGen Systems",type:"Influencer",audience:"Men 18-24",duration:30,channel:"YouTube",convRate:0.07,cost:18332,roi:7.81,location:"Houston",clicks:360,impressions:5349,engagement:6,segment:"Fashionistas"},
  {id:36,company:"TechCorp",type:"Display",audience:"Men 25-34",duration:60,channel:"Instagram",convRate:0.09,cost:13256,roi:2.51,location:"Miami",clicks:250,impressions:7373,engagement:3,segment:"Health & Wellness"},
  {id:37,company:"DataTech Solutions",type:"Display",audience:"All Ages",duration:45,channel:"Email",convRate:0.04,cost:15779,roi:7.24,location:"New York",clicks:822,impressions:7152,engagement:1,segment:"Foodies"},
  {id:38,company:"Innovate Industries",type:"Influencer",audience:"Men 18-24",duration:60,channel:"Facebook",convRate:0.06,cost:7683,roi:2.62,location:"Houston",clicks:833,impressions:9772,engagement:8,segment:"Tech Enthusiasts"},
  {id:39,company:"Innovate Industries",type:"Search",audience:"Men 25-34",duration:30,channel:"Instagram",convRate:0.11,cost:14742,roi:2.21,location:"Chicago",clicks:663,impressions:9473,engagement:10,segment:"Tech Enthusiasts"},
  {id:40,company:"Innovate Industries",type:"Search",audience:"Men 18-24",duration:45,channel:"Google Ads",convRate:0.08,cost:15495,roi:6.97,location:"Chicago",clicks:268,impressions:5495,engagement:6,segment:"Fashionistas"},
  {id:41,company:"DataTech Solutions",type:"Social Media",audience:"All Ages",duration:30,channel:"Website",convRate:0.04,cost:18684,roi:4.57,location:"New York",clicks:212,impressions:4718,engagement:4,segment:"Foodies"},
  {id:42,company:"Alpha Innovations",type:"Search",audience:"Men 25-34",duration:45,channel:"Email",convRate:0.01,cost:13096,roi:3.44,location:"Los Angeles",clicks:360,impressions:2776,engagement:1,segment:"Foodies"},
  {id:43,company:"Innovate Industries",type:"Display",audience:"Men 25-34",duration:60,channel:"Instagram",convRate:0.09,cost:7818,roi:5.60,location:"Houston",clicks:598,impressions:8637,engagement:5,segment:"Fashionistas"},
  {id:44,company:"Innovate Industries",type:"Display",audience:"All Ages",duration:30,channel:"Instagram",convRate:0.09,cost:8214,roi:4.77,location:"Chicago",clicks:988,impressions:1612,engagement:5,segment:"Fashionistas"},
  {id:45,company:"DataTech Solutions",type:"Email",audience:"Men 18-24",duration:45,channel:"Google Ads",convRate:0.04,cost:6882,roi:3.31,location:"Miami",clicks:282,impressions:8038,engagement:7,segment:"Tech Enthusiasts"},
  {id:46,company:"NexGen Systems",type:"Display",audience:"Women 35-44",duration:60,channel:"Google Ads",convRate:0.03,cost:13470,roi:6.80,location:"Miami",clicks:992,impressions:8036,engagement:8,segment:"Health & Wellness"},
  {id:47,company:"DataTech Solutions",type:"Search",audience:"Men 25-34",duration:60,channel:"YouTube",convRate:0.06,cost:14948,roi:7.40,location:"New York",clicks:903,impressions:3940,engagement:3,segment:"Foodies"},
  {id:48,company:"Innovate Industries",type:"Social Media",audience:"Men 18-24",duration:60,channel:"Instagram",convRate:0.04,cost:15255,roi:3.80,location:"Chicago",clicks:629,impressions:1824,engagement:3,segment:"Health & Wellness"},
  {id:49,company:"TechCorp",type:"Display",audience:"All Ages",duration:60,channel:"Facebook",convRate:0.10,cost:9510,roi:5.25,location:"Houston",clicks:190,impressions:2071,engagement:4,segment:"Tech Enthusiasts"},
  {id:50,company:"TechCorp",type:"Social Media",audience:"Women 25-34",duration:45,channel:"Email",convRate:0.11,cost:7521,roi:3.98,location:"Los Angeles",clicks:150,impressions:7377,engagement:8,segment:"Tech Enthusiasts"},
  {id:51,company:"NexGen Systems",type:"Search",audience:"Men 25-34",duration:60,channel:"Facebook",convRate:0.12,cost:10405,roi:5.79,location:"Los Angeles",clicks:134,impressions:8463,engagement:9,segment:"Foodies"},
  {id:52,company:"NexGen Systems",type:"Search",audience:"Men 25-34",duration:15,channel:"Website",convRate:0.10,cost:15955,roi:6.48,location:"Houston",clicks:657,impressions:9831,engagement:7,segment:"Foodies"},
  {id:53,company:"TechCorp",type:"Email",audience:"Men 18-24",duration:30,channel:"Facebook",convRate:0.13,cost:15428,roi:7.62,location:"Houston",clicks:385,impressions:4937,engagement:6,segment:"Tech Enthusiasts"},
  {id:54,company:"NexGen Systems",type:"Display",audience:"Women 35-44",duration:45,channel:"YouTube",convRate:0.02,cost:19832,roi:3.35,location:"New York",clicks:537,impressions:4739,engagement:9,segment:"Outdoor Adventurers"},
  {id:55,company:"NexGen Systems",type:"Social Media",audience:"Men 18-24",duration:30,channel:"YouTube",convRate:0.05,cost:17375,roi:6.15,location:"Miami",clicks:450,impressions:6012,engagement:7,segment:"Foodies"},
  {id:56,company:"NexGen Systems",type:"Display",audience:"Men 25-34",duration:15,channel:"Website",convRate:0.13,cost:8903,roi:3.70,location:"Miami",clicks:178,impressions:8529,engagement:9,segment:"Health & Wellness"},
  {id:57,company:"NexGen Systems",type:"Email",audience:"Women 35-44",duration:15,channel:"Website",convRate:0.04,cost:14511,roi:6.66,location:"Chicago",clicks:164,impressions:2122,engagement:8,segment:"Foodies"},
  {id:58,company:"Innovate Industries",type:"Email",audience:"Men 18-24",duration:60,channel:"Email",convRate:0.06,cost:17305,roi:2.70,location:"New York",clicks:569,impressions:1850,engagement:2,segment:"Fashionistas"},
  {id:59,company:"Alpha Innovations",type:"Email",audience:"Women 25-34",duration:45,channel:"Email",convRate:0.04,cost:18063,roi:4.93,location:"Chicago",clicks:330,impressions:6920,engagement:6,segment:"Foodies"},
  {id:60,company:"Innovate Industries",type:"Display",audience:"Men 25-34",duration:15,channel:"Email",convRate:0.05,cost:10293,roi:6.80,location:"Miami",clicks:256,impressions:3421,engagement:9,segment:"Health & Wellness"},
  {id:61,company:"DataTech Solutions",type:"Email",audience:"Men 25-34",duration:45,channel:"Email",convRate:0.05,cost:8785,roi:2.27,location:"New York",clicks:849,impressions:9217,engagement:5,segment:"Fashionistas"},
  {id:62,company:"TechCorp",type:"Email",audience:"Men 25-34",duration:30,channel:"Email",convRate:0.09,cost:13848,roi:5.32,location:"Los Angeles",clicks:261,impressions:1958,engagement:2,segment:"Tech Enthusiasts"},
  {id:63,company:"Innovate Industries",type:"Influencer",audience:"Women 35-44",duration:60,channel:"Email",convRate:0.01,cost:14435,roi:7.04,location:"Houston",clicks:592,impressions:3596,engagement:4,segment:"Foodies"},
  {id:64,company:"NexGen Systems",type:"Search",audience:"Men 18-24",duration:30,channel:"Facebook",convRate:0.02,cost:14001,roi:3.71,location:"Chicago",clicks:201,impressions:8702,engagement:10,segment:"Outdoor Adventurers"},
  {id:65,company:"DataTech Solutions",type:"Display",audience:"All Ages",duration:45,channel:"Website",convRate:0.11,cost:8841,roi:7.43,location:"Houston",clicks:648,impressions:9122,engagement:9,segment:"Fashionistas"},
  {id:66,company:"NexGen Systems",type:"Search",audience:"All Ages",duration:60,channel:"YouTube",convRate:0.04,cost:11366,roi:7.28,location:"Los Angeles",clicks:187,impressions:5048,engagement:8,segment:"Health & Wellness"},
  {id:67,company:"Alpha Innovations",type:"Display",audience:"Women 25-34",duration:30,channel:"YouTube",convRate:0.07,cost:12910,roi:6.33,location:"Miami",clicks:839,impressions:5569,engagement:7,segment:"Foodies"},
  {id:68,company:"TechCorp",type:"Search",audience:"Women 25-34",duration:60,channel:"YouTube",convRate:0.12,cost:7823,roi:2.72,location:"New York",clicks:240,impressions:2512,engagement:6,segment:"Tech Enthusiasts"},
  {id:69,company:"TechCorp",type:"Display",audience:"All Ages",duration:15,channel:"Facebook",convRate:0.03,cost:11864,roi:7.98,location:"Chicago",clicks:932,impressions:9973,engagement:9,segment:"Tech Enthusiasts"},
  {id:70,company:"Innovate Industries",type:"Email",audience:"All Ages",duration:15,channel:"Facebook",convRate:0.10,cost:17414,roi:4.74,location:"Los Angeles",clicks:694,impressions:2836,engagement:2,segment:"Foodies"},
  {id:71,company:"Alpha Innovations",type:"Search",audience:"Men 25-34",duration:30,channel:"Website",convRate:0.13,cost:18201,roi:5.58,location:"New York",clicks:202,impressions:6745,engagement:8,segment:"Tech Enthusiasts"},
  {id:72,company:"Alpha Innovations",type:"Social Media",audience:"All Ages",duration:15,channel:"Email",convRate:0.03,cost:9549,roi:5.61,location:"Chicago",clicks:416,impressions:9187,engagement:7,segment:"Health & Wellness"},
  {id:73,company:"TechCorp",type:"Social Media",audience:"Women 35-44",duration:15,channel:"YouTube",convRate:0.13,cost:16635,roi:7.46,location:"Miami",clicks:576,impressions:9999,engagement:10,segment:"Health & Wellness"},
  {id:74,company:"NexGen Systems",type:"Influencer",audience:"All Ages",duration:45,channel:"Facebook",convRate:0.10,cost:9310,roi:5.63,location:"New York",clicks:300,impressions:3687,engagement:9,segment:"Foodies"},
  {id:75,company:"NexGen Systems",type:"Display",audience:"All Ages",duration:15,channel:"YouTube",convRate:0.11,cost:5158,roi:6.67,location:"Chicago",clicks:776,impressions:4238,engagement:3,segment:"Health & Wellness"},
  {id:76,company:"Innovate Industries",type:"Search",audience:"Men 25-34",duration:30,channel:"Instagram",convRate:0.04,cost:15182,roi:2.03,location:"Houston",clicks:492,impressions:7364,engagement:2,segment:"Fashionistas"},
  {id:77,company:"Innovate Industries",type:"Display",audience:"Men 18-24",duration:45,channel:"Google Ads",convRate:0.08,cost:5703,roi:3.23,location:"Chicago",clicks:763,impressions:8501,engagement:10,segment:"Foodies"},
  {id:78,company:"Innovate Industries",type:"Search",audience:"Women 35-44",duration:60,channel:"Google Ads",convRate:0.02,cost:12008,roi:4.82,location:"Miami",clicks:817,impressions:7892,engagement:2,segment:"Health & Wellness"},
  {id:79,company:"NexGen Systems",type:"Display",audience:"Women 35-44",duration:45,channel:"Google Ads",convRate:0.13,cost:15850,roi:7.74,location:"New York",clicks:791,impressions:3594,engagement:4,segment:"Outdoor Adventurers"},
  {id:80,company:"Alpha Innovations",type:"Influencer",audience:"Women 25-34",duration:30,channel:"Email",convRate:0.10,cost:9813,roi:6.57,location:"Miami",clicks:737,impressions:9941,engagement:6,segment:"Fashionistas"},
];

// ============================================================
// Pre-Computed Analytics Aggregates
// ============================================================

const ANALYTICS = {
  // ROI by Channel (pre-computed from full dataset)
  roiByChannel: {
    "Google Ads": 5.42,
    "YouTube": 5.18,
    "Instagram": 4.87,
    "Facebook": 4.72,
    "Email": 4.95,
    "Website": 5.08
  },

  // Conversion Rate by Campaign Type (percentage)
  convByType: {
    "Email": 8.4,
    "Display": 7.2,
    "Influencer": 8.8,
    "Social Media": 8.6,
    "Search": 7.6
  },

  // Engagement Score by Customer Segment
  engagementBySegment: {
    "Tech Enthusiasts": 5.9,
    "Health & Wellness": 5.4,
    "Foodies": 5.2,
    "Fashionistas": 4.8,
    "Outdoor Adventurers": 5.0
  },

  // Campaign Count by Location
  locationDistribution: {
    "New York": 22,
    "Los Angeles": 21,
    "Houston": 20,
    "Chicago": 20,
    "Miami": 17
  },

  // Monthly ROI Trend (2021)
  monthlyROI: {
    "Jan": 5.1, "Feb": 4.9, "Mar": 5.4, "Apr": 5.2,
    "May": 5.6, "Jun": 4.8, "Jul": 5.3, "Aug": 5.7,
    "Sep": 5.0, "Oct": 5.5, "Nov": 5.8, "Dec": 5.3
  },

  // Total stats
  totals: {
    totalCampaigns: 9921,
    avgROI: 5.21,
    avgConversionRate: 8.1,
    totalSpend: 12840000,
    avgEngagement: 5.3,
    topChannel: "Google Ads",
    topType: "Influencer",
    topSegment: "Tech Enthusiasts"
  }
};

// ============================================================
// AI Branding Engine - Templates & Patterns
// ============================================================

const BRAND_PATTERNS = {
  imperatives: [
    "Elevate your {keyword}.",
    "Transform the way you {action}.",
    "Lead with {value}.",
    "Redefine {industry} excellence.",
    "Build something {adjective}.",
    "Choose {value}. Choose success.",
    "Power your {keyword} forward.",
    "Unlock your {value} potential."
  ],
  questions: [
    "What if {industry} was effortless?",
    "Ready to redefine {keyword}?",
    "Why settle for less than {value}?",
    "Imagine a world with smarter {keyword}.",
    "What could you achieve with {value}?"
  ],
  statements: [
    "Where {value} meets innovation.",
    "The future of {industry}, today.",
    "{value} redefined for a smarter world.",
    "Built for those who demand {adjective}.",
    "Excellence in every {keyword}.",
    "Your partner in {value}.",
    "Innovation starts here.",
    "Beyond ordinary {industry}."
  ],
  emotional: [
    "Because your {keyword} matters.",
    "Passion. Precision. {value}.",
    "We believe in your {keyword}.",
    "More than {industry} — it's a lifestyle.",
    "For those who never settle.",
    "Driven by {value}, defined by results."
  ]
};

const INDUSTRY_PROFILES = {
  "Technology": {
    keywords: ["innovation", "solutions", "digital", "future", "intelligence", "data"],
    values: ["precision", "efficiency", "connectivity", "performance"],
    adjectives: ["intelligent", "cutting-edge", "seamless", "powerful", "disruptive"],
    actions: ["compute", "innovate", "transform", "optimize", "connect"],
    colors: { primary: "#00D4FF", secondary: "#7B2FFF", accent: "#0D1B4D" },
    personality: ["Innovative", "Reliable", "Forward-thinking", "Technical", "Visionary"]
  },
  "Healthcare": {
    keywords: ["wellness", "care", "health", "healing", "life", "recovery"],
    values: ["compassion", "trust", "excellence", "wellbeing"],
    adjectives: ["caring", "trusted", "expert", "holistic", "proven"],
    actions: ["heal", "care", "restore", "protect", "nurture"],
    colors: { primary: "#00C8A0", secondary: "#0082CF", accent: "#F0F9FF" },
    personality: ["Caring", "Trustworthy", "Expert", "Compassionate", "Dedicated"]
  },
  "Finance": {
    keywords: ["wealth", "security", "investment", "growth", "future"],
    values: ["trust", "stability", "prosperity", "confidence"],
    adjectives: ["secure", "trusted", "proven", "smart", "reliable"],
    actions: ["invest", "grow", "protect", "build", "achieve"],
    colors: { primary: "#1A56DB", secondary: "#0EA5E9", accent: "#0C1445" },
    personality: ["Trustworthy", "Professional", "Stable", "Expert", "Confident"]
  },
  "Food & Beverage": {
    keywords: ["taste", "flavor", "freshness", "quality", "nourishment"],
    values: ["joy", "authenticity", "quality", "satisfaction"],
    adjectives: ["delicious", "fresh", "authentic", "bold", "wholesome"],
    actions: ["savor", "enjoy", "taste", "nourish", "delight"],
    colors: { primary: "#FF6B35", secondary: "#FFD700", accent: "#2D1B00" },
    personality: ["Joyful", "Authentic", "Warm", "Passionate", "Inviting"]
  },
  "Fashion & Retail": {
    keywords: ["style", "elegance", "trend", "collection", "identity"],
    values: ["individuality", "quality", "sophistication", "expression"],
    adjectives: ["iconic", "timeless", "bold", "sophisticated", "exclusive"],
    actions: ["express", "inspire", "define", "create", "own"],
    colors: { primary: "#FF2D78", secondary: "#FFD700", accent: "#1A0010" },
    personality: ["Stylish", "Bold", "Creative", "Sophisticated", "Trendsetting"]
  },
  "Education": {
    keywords: ["learning", "knowledge", "growth", "potential", "future"],
    values: ["empowerment", "excellence", "curiosity", "achievement"],
    adjectives: ["inspiring", "transformative", "empowering", "innovative", "engaged"],
    actions: ["learn", "grow", "achieve", "discover", "inspire"],
    colors: { primary: "#7C3AED", secondary: "#10B981", accent: "#0F172A" },
    personality: ["Inspiring", "Knowledgeable", "Progressive", "Empowering", "Curious"]
  },
  "Real Estate": {
    keywords: ["home", "property", "space", "investment", "community"],
    values: ["trust", "quality", "location", "value", "comfort"],
    adjectives: ["premium", "trusted", "sought-after", "exceptional", "prime"],
    actions: ["invest", "live", "build", "discover", "find"],
    colors: { primary: "#059669", secondary: "#0369A1", accent: "#0A1628" },
    personality: ["Trustworthy", "Professional", "Community-focused", "Expert", "Reliable"]
  },
  "Marketing & Media": {
    keywords: ["brand", "story", "audience", "impact", "voice"],
    values: ["creativity", "reach", "authenticity", "engagement"],
    adjectives: ["powerful", "creative", "engaging", "authentic", "viral"],
    actions: ["amplify", "connect", "inspire", "reach", "engage"],
    colors: { primary: "#F59E0B", secondary: "#EF4444", accent: "#1C0A00" },
    personality: ["Creative", "Dynamic", "Strategic", "Bold", "Influential"]
  },
  "Other": {
    keywords: ["excellence", "quality", "service", "value", "results"],
    values: ["integrity", "innovation", "commitment", "excellence"],
    adjectives: ["trusted", "proven", "exceptional", "dedicated", "quality-driven"],
    actions: ["serve", "deliver", "achieve", "provide", "build"],
    colors: { primary: "#6366F1", secondary: "#8B5CF6", accent: "#0F0A1E" },
    personality: ["Reliable", "Professional", "Committed", "Innovative", "Customer-focused"]
  }
};

const TONE_MODIFIERS = {
  "Professional": { prefix: "Precision-driven", suffix: "Built for excellence." },
  "Bold": { prefix: "Dare to", suffix: "No limits. No boundaries." },
  "Friendly": { prefix: "Together,", suffix: "Here for you, every step." },
  "Innovative": { prefix: "Reimagining", suffix: "The future starts now." },
  "Luxury": { prefix: "Where exclusivity meets", suffix: "Crafted for the discerning few." },
  "Playful": { prefix: "Making", suffix: "Because life's too short for boring." }
};

// Export for use in app.js
window.NOVA = {
  SLOGAN_DATA,
  CAMPAIGN_RECORDS,
  ANALYTICS,
  BRAND_PATTERNS,
  INDUSTRY_PROFILES,
  TONE_MODIFIERS
};
