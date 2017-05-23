var tableData = [
    ['   '],
    ['header','AUS','CAN','FRA','GER','NETH','NZ','NOR','SWE','SWIZ','UK','US'],
    ['   '],
    ['OVERALL RANKING',2,9,10,8,3,4,4,6,6,1,11],
    ['   '],
    ['Quality',2,6,9,8,4,3,10,11,7,1,5],
    ['   '],
    ['Access',4,10,9,2,1,7,5,6,8,3,11],
    ['   '],
    ['Administrative Efficiency',1,6,11,6,9,2,4,5,8,3,10],
    ['   '],
    ['Equity',7,9,10,6,2,8,5,3,4,1,11],
    ['   '],
    ['Health Care Outcomes',1,9,5,8,6,7,3,2,4,10,11],
    ['   '],
]

var subsectionData = {
  emptyChart: [
    {country: "AUS", value: 0},
    {country: "CAN", value: 0},
    {country: "FRA", value: 0},
    {country: "GER", value: 0},
    {country: "NETH", value: 0},
    {country: "NZ", value: 0},
    {country: "NOR", value: 0},
    {country: "SWE", value: 0},
    {country: "SWIZ", value: 0},
    {country: "UK", value: 0},
    {country: "US", value: 0},
  ],
  QualityQuestions: [
    {
      questionSet: "Preventative Care Measures",
      sectionData: [
        {
          'q': "Talked with provider about things in life that cause worry or stress in the past two years, among those with a history of mental illness",
          data:[
            {country: "AUS", value: 74},
            {country: "CAN", value: 63},
            {country: "FRA", value: 0},
            {country: "GER", value: 46},
            {country: "NETH", value: 62},
            {country: "NZ", value: 67},
            {country: "NOR", value: 62},
            {country: "SWE", value: 58},
            {country: "SWIZ", value: 72},
            {country: "UK", value: 58},
            {country: "US", value: 64},
          ],
        },
        {
          'q': "Talked with provider about healthy diet, exercise and physical activity in the past two years",
          data:[
            {country: "AUS", value: 38},
            {country: "CAN", value: 41},
            {country: "FRA", value: 16},
            {country: "GER", value: 17},
            {country: "NETH", value: 24},
            {country: "NZ", value: 37},
            {country: "NOR", value: 20},
            {country: "SWE", value: 21},
            {country: "SWIZ", value: 28},
            {country: "UK", value: 33},
            {country: "US", value: 59},
          ],
        },
        {
          'q': "Talked with provider about health risks of smoking and ways to quit in the past two years, among smokers",
          data:[
            {country: "AUS", value: 56},
            {country: "CAN", value: 71},
            {country: "FRA", value: 49},
            {country: "GER", value: 17},
            {country: "NETH", value: 53},
            {country: "NZ", value: 59},
            {country: "NOR", value: 25},
            {country: "SWE", value: 49},
            {country: "SWIZ", value: 36},
            {country: "UK", value: 57},
            {country: "US", value: 74},
          ],
        },
        {
          'q': "Talked with provider about alcohol use in the past two years",
          data:[
            {country: "AUS", value: 25},
            {country: "CAN", value: 23},
            {country: "FRA", value: 9},
            {country: "GER", value: 8},
            {country: "NETH", value: 25},
            {country: "NZ", value: 23},
            {country: "NOR", value: 9},
            {country: "SWE", value: 20},
            {country: "SWIZ", value: 11},
            {country: "UK", value: 25},
            {country: "US", value: 33},
          ],
        },
        {
          'q': "Women age 50-69 with mammography screening in the past year",
          data:[
            {country: "AUS", value: 54},
            {country: "CAN", value: 72},
            {country: "FRA", value: 75},
            {country: "GER", value: 71},
            {country: "NETH", value: 80},
            {country: "NZ", value: 72},
            {country: "NOR", value: 75},
            {country: "SWE", value: 0},
            {country: "SWIZ", value: 47},
            {country: "UK", value: 75},
            {country: "US", value: 81},
          ],
        },
        {
          'q': "Older adults (age 65 plus) with influenza vaccination in the past year",
          data:[
            {country: "AUS", value: 0},
            {country: "CAN", value: 63},
            {country: "FRA", value: 49},
            {country: "GER", value: 59},
            {country: "NETH", value: 72},
            {country: "NZ", value: 69},
            {country: "NOR", value: 27},
            {country: "SWE", value: 50},
            {country: "SWIZ", value: 46},
            {country: "UK", value: 75},
            {country: "US", value: 68},
          ],
        },
        {
          'q': "Avoidable hospital admissions for diabetes, age-sex standardized rates per 100,000",
          yAxisLabel: 'Age-sex standardized rates per 100,000',
          range: [0,290],
          data:[
            {country: "AUS", value: 141},
            {country: "CAN", value: 95},
            {country: "FRA", value: 181},
            {country: "GER", value: 216},
            {country: "NETH", value: 68},
            {country: "NZ", value: 187},
            {country: "NOR", value: 76},
            {country: "SWE", value: 111},
            {country: "SWIZ", value: 44},
            {country: "UK", value: 64},
            {country: "US", value: 198},
          ],
        },
        {
          'q': "Avoidable hospital admissions for asthma, age-sex standardized rates per 100,000",
          yAxisLabel: 'Age-sex standardized rates per 100,000',
          range:[0,140],
          data:[
            {country: "AUS", value: 65},
            {country: "CAN", value: 15},
            {country: "FRA", value: 30},
            {country: "GER", value: 23},
            {country: "NETH", value: 31},
            {country: "NZ", value: 72},
            {country: "NOR", value: 26},
            {country: "SWE", value: 23},
            {country: "SWIZ", value: 13},
            {country: "UK", value: 61},
            {country: "US", value: 103},
          ],
        },
        {
          'q': "Avoidable hospital admissions for congestive heart failure, age-sex standardized rates per 100,000",
          yAxisLabel: 'Age-sex standardized rates per 100,000',
          range: [0, 500],
          data:[
           {country:  "AUS", value: 240},
           {country:  "CAN", value: 179},
           {country:  "FRA", value: 238},
           {country:  "GER", value: 382},
           {country:  "NETH", value: 199},
           {country:  "NZ", value: 229},
           {country:  "NOR", value: 175},
           {country:  "SWE", value: 300},
           {country:  "SWIZ", value: 174},
           {country:  "UK", value: 99},
           {country:  "US", value: 367},
         ]
        }
      ]
    },
    {
      questionSet: "Safe Care",
      sectionData: [
        {
         'q': "Experienced a medical, medication, or lab mistake in the past two years ",
         data: [
           {country: "AUS", value: 11},
           {country: "CAN", value: 15},
           {country: "FRA", value: 8},
           {country: "GER", value: 7},
           {country: "NETH", value: 10},
           {country: "NZ", value: 16},
           {country: "NOR", value: 21},
           {country: "SWE", value: 17},
           {country: "SWIZ", value: 14},
           {country: "UK", value: 11},
           {country: "US", value: 19},
         ]
       },
       {
         'q': "Primary care physician reports electronic clinical decision support in practice",
         data: [
           {country: "AUS", value: 72},
           {country: "CAN", value: 28},
           {country: "FRA", value: 28},
           {country: "GER", value: 13},
           {country: "NETH", value: 22},
           {country: "NZ", value: 70},
           {country: "NOR", value: 28},
           {country: "SWE", value: 16},
           {country: "SWIZ", value: 13},
           {country: "UK", value: 81},
           {country: "US", value: 60},
         ]
       },
       {
         'q': "Health care professional did not review medications in past year, among those taking two or more prescription medications ",
         data: [
           {country: "AUS", value: 22},
           {country: "CAN", value: 22},
           {country: "FRA", value: 54},
           {country: "GER", value: 34},
           {country: "NETH", value: 27},
           {country: "NZ", value: 29},
           {country: "NOR", value: 45},
           {country: "SWE", value: 41},
           {country: "SWIZ", value: 36},
           {country: "UK", value: 21},
           {country: "US", value: 17},
         ]
       },
      ]
    },
    {
      questionSet: 'Coordinated Care',
      sectionData:[
        {
         'q': "Primary care doctor always or often receives timely and relevant information when needed after patient sees specialist",
         data: [
           {country: "AUS", value: 58},
           {country: "CAN", value: 61},
           {country: "FRA", value: 80},
           {country: "GER", value: 61},
           {country: "NETH", value: 63},
           {country: "NZ", value: 69},
           {country: "NOR", value: 66},
           {country: "SWE", value: 37},
           {country: "SWIZ", value: 78},
           {country: "UK", value: 47},
           {country: "US", value: 62},
         ]
       },
       {
         'q': "Primary care doctor is always or often informed of changes to a patient's medication or care plan after patient sees specialist ",
         data: [
           {country: "AUS", value: 83},
           {country: "CAN", value: 78},
           {country: "FRA", value: 94},
           {country: "GER", value: 73},
           {country: "NETH", value: 66},
           {country: "NZ", value: 94},
           {country: "NOR", value: 88},
           {country: "SWE", value: 53},
           {country: "SWIZ", value: 88},
           {country: "UK", value: 86},
           {country: "US", value: 72},
         ]
       },
       {
         'q': "Specialist lacked medical history or regular doctor not informed about specialist care in the past two years",
         data: [
           {country: "AUS", value: 20},
           {country: "CAN", value: 27},
           {country: "FRA", value: 25},
           {country: "GER", value: 19},
           {country: "NETH", value: 28},
           {country: "NZ", value: 17},
           {country: "NOR", value: 36},
           {country: "SWE", value: 31},
           {country: "SWIZ", value: 27},
           {country: "UK", value: 21},
           {country: "US", value: 31},
         ]
       },
       {
         'q': "Experienced gaps in hospital discharge planning in the past two years",
         data: [
           {country: "AUS", value: 29},
           {country: "CAN", value: 40},
           {country: "FRA", value: 60},
           {country: "GER", value: 28},
           {country: "NETH", value: 47},
           {country: "NZ", value: 31},
           {country: "NOR", value: 61},
           {country: "SWE", value: 52},
           {country: "SWIZ", value: 45},
           {country: "UK", value: 28},
           {country: "US", value: 22},
         ]
       },
       {
         'q': "Doctor is always notified when patient is seen in ED and when patient is discharged from the hospital ",
         data: [
           {country: "AUS", value: 14},
           {country: "CAN", value: 23},
           {country: "FRA", value: 16},
           {country: "GER", value: 16},
           {country: "NETH", value: 59},
           {country: "NZ", value: 43},
           {country: "NOR", value: 25},
           {country: "SWE", value: 4},
           {country: "SWIZ", value: 21},
           {country: "UK", value: 32},
           {country: "US", value: 26},
         ]
       },
       {
         'q': "Practice routinely communicates with home care provider about patient's needs and services ",
         data: [
           {country: "AUS", value: 29},
           {country: "CAN", value: 32},
           {country: "FRA", value: 36},
           {country: "GER", value: 51},
           {country: "NETH", value: 56},
           {country: "NZ", value: 28},
           {country: "NOR", value: 63},
           {country: "SWE", value: 53},
           {country: "SWIZ", value: 55},
           {country: "UK", value: 34},
           {country: "US", value: 52},
         ]
       },
       {
         'q': "Practice frequently coordinates care with social services or community providers ",
         data: [
           {country: "AUS", value: 45},
           {country: "CAN", value: 50},
           {country: "FRA", value: 35},
           {country: "GER", value: 63},
           {country: "NETH", value: 42},
           {country: "NZ", value: 58},
           {country: "NOR", value: 51},
           {country: "SWE", value: 42},
           {country: "SWIZ", value: 60},
           {country: "UK", value: 65},
           {country: "US", value: 43},
         ]
       }
      ]
    },
    {
      questionSet: 'Engagement and Patient Preferences',
      sectionData:[
        {
         'q': "Regular doctor always or often knew important information about their medical history ",
         data: [
           {country: "AUS", value: 79},
           {country: "CAN", value: 83},
           {country: "FRA", value: 75},
           {country: "GER", value: 89},
           {country: "NETH", value: 91},
           {country: "NZ", value: 86},
           {country: "NOR", value: 74},
           {country: "SWE", value: 57},
           {country: "SWIZ", value: 77},
           {country: "UK", value: 84},
           {country: "US", value: 81},
         ]
       },
       {
         'q': "Regular doctor always or often spent enough time with them and explained things in a way they could understand",
         data: [
           {country: "AUS", value: 88},
           {country: "CAN", value: 74},
           {country: "FRA", value: 64},
           {country: "GER", value: 78},
           {country: "NETH", value: 88},
           {country: "NZ", value: 83},
           {country: "NOR", value: 70},
           {country: "SWE", value: 62},
           {country: "SWIZ", value: 79},
           {country: "UK", value: 79},
           {country: "US", value: 77},
         ]
       },
       {
         'q': "With same doctor for five years or more",
         data: [
           {country: "AUS", value: 61},
           {country: "CAN", value: 63},
           {country: "FRA", value: 42},
           {country: "GER", value: 65},
           {country: "NETH", value: 76},
           {country: "NZ", value: 67},
           {country: "NOR", value: 60},
           {country: "SWE", value: 54},
           {country: "SWIZ", value: 63},
           {country: "UK", value: 69},
           {country: "US", value: 49},
         ]
       },
       {
         'q': "Specialist always or often told patient about treatment choices and involved patient in decisions about care and treatment, among adults age 65 and older",
         data: [
           {country: "AUS", value: 74},
           {country: "CAN", value: 66},
           {country: "FRA", value: 62},
           {country: "GER", value: 58},
           {country: "NETH", value: 67},
           {country: "NZ", value: 63},
           {country: "NOR", value: 40},
           {country: "SWE", value: 50},
           {country: "SWIZ", value: 64},
           {country: "UK", value: 79},
           {country: "US", value: 81},
         ]
       },
       {
         'q': "Doctors always treated the patient with courtesy and respect during their hospital stay",
         data: [
           {country: "AUS", value: 80},
           {country: "CAN", value: 73},
           {country: "FRA", value: 69},
           {country: "GER", value: 48},
           {country: "NETH", value: 79},
           {country: "NZ", value: 80},
           {country: "NOR", value: 73},
           {country: "SWE", value: 75},
           {country: "SWIZ", value: 72},
           {country: "UK", value: 76},
           {country: "US", value: 74},
         ]
       },
       {
         'q': "Nurses always treated the patient with courtesy and respect during their hospital stay",
         data: [
           {country: "AUS", value: 81},
           {country: "CAN", value: 65},
           {country: "FRA", value: 51},
           {country: "GER", value: 52},
           {country: "NETH", value: 81},
           {country: "NZ", value: 74},
           {country: "NOR", value: 76},
           {country: "SWE", value: 80},
           {country: "SWIZ", value: 69},
           {country: "UK", value: 81},
           {country: "US", value: 71},
         ]
       },
       {
         'q': "Chronically ill patients discussed with health professional their main goals and priorities in caring for their condition in the past two years",
         data: [
           {country: "AUS", value: 71},
           {country: "CAN", value: 56},
           {country: "FRA", value: 66},
           {country: "GER", value: 67},
           {country: "NETH", value: 59},
           {country: "NZ", value: 62},
           {country: "NOR", value: 41},
           {country: "SWE", value: 26},
           {country: "SWIZ", value: 64},
           {country: "UK", value: 61},
           {country: "US", value: 63},
         ]
       },
       {
         'q': "Chronically ill patients discussed with health professional their treatment options, including side effects in the past two years",
         data: [
           {country: "AUS", value: 67},
           {country: "CAN", value: 57},
           {country: "FRA", value: 61},
           {country: "GER", value: 60},
           {country: "NETH", value: 57},
           {country: "NZ", value: 62},
           {country: "NOR", value: 32},
           {country: "SWE", value: 30},
           {country: "SWIZ", value: 59},
           {country: "UK", value: 54},
           {country: "US", value: 60},
         ]
       },
       {
         'q': "Had a written plan describing treatment they want at the end of life, among adults age 65 and older ",
         data: [
           {country: "AUS", value: 31},
           {country: "CAN", value: 46},
           {country: "FRA", value: 5},
           {country: "GER", value: 58},
           {country: "NETH", value: 16},
           {country: "NZ", value: 23},
           {country: "NOR", value: 4},
           {country: "SWE", value: 5},
           {country: "SWIZ", value: 25},
           {country: "UK", value: 20},
           {country: "US", value: 55},
         ]
       },
       {
         'q': "Had a written plan naming someone to make treatment decisions for them if they cannot do so, among adults age 65 and older ",
         data: [
           {country: "AUS", value: 53},
           {country: "CAN", value: 62},
           {country: "FRA", value: 16},
           {country: "GER", value: 58},
           {country: "NETH", value: 16},
           {country: "NZ", value: 38},
           {country: "NOR", value: 6},
           {country: "SWE", value: 8},
           {country: "SWIZ", value: 28},
           {country: "UK", value: 47},
           {country: "US", value: 67},
         ]
       }
      ]
    }
  ], 
  AccessQuestions: [
    {
      questionSet: 'Affordability',
      sectionData: [
        {
          q: "Had any cost-related access problem to medical care in the past year",
          data:[
            {country: 'AUS', value: 14},
            {country: 'CAN', value: 16},
            {country: 'FRA', value: 17},
            {country: 'GER', value: 7},
            {country: 'NETH', value: 8},
            {country: 'NZ', value: 18},
            {country: 'NOR', value: 10},
            {country: 'SWE', value: 8},
            {country: 'SWIZ', value: 22},
            {country: 'UK', value: 7},
            {country: 'US', value: 33}
          ]
        },
        {
          q: "Skipped dental care or check up because of cost in the past year",
          data:[
            {country: 'AUS', value: 21},
            {country: 'CAN', value: 28},
            {country: 'FRA', value: 23},
            {country: 'GER', value: 14},
            {country: 'NETH', value: 11},
            {country: 'NZ', value: 22},
            {country: 'NOR', value: 20},
            {country: 'SWE', value: 19},
            {country: 'SWIZ', value: 21},
            {country: 'UK', value: 11},
            {country: 'US', value: 32}
          ]
        },
        {
          q: "Insurance denied payment for medical care or did not pay as much as expected",
          data:[
            {country: 'AUS', value: 9},
            {country: 'CAN', value: 14},
            {country: 'FRA', value: 24},
            {country: 'GER', value: 8},
            {country: 'NETH', value: 8},
            {country: 'NZ', value: 2},
            {country: 'NOR', value: 2},
            {country: 'SWE', value: 2},
            {country: 'SWIZ', value: 12},
            {country: 'UK', value: 1},
            {country: 'US', value: 27}
          ]
        },
        {
          q: "Had serious problems paying or was unable to pay medical bills",
          data:[
            {country: 'AUS', value: 5},
            {country: 'CAN', value: 6},
            {country: 'FRA', value: 23},
            {country: 'GER', value: 4},
            {country: 'NETH', value: 7},
            {country: 'NZ', value: 5},
            {country: 'NOR', value: 8},
            {country: 'SWE', value: 5},
            {country: 'SWIZ', value: 11},
            {country: 'UK', value: 1},
            {country: 'US', value: 20}
          ]
        },
        {
          q: "Doctors report patients often have difficulty paying for medications or out-of-pocket costs",
          data:[
            {country: 'AUS', value: 25},
            {country: 'CAN', value: 30},
            {country: 'FRA', value: 17},
            {country: 'GER', value: 13},
            {country: 'NETH', value: 52},
            {country: 'NZ', value: 30},
            {country: 'NOR', value: 3},
            {country: 'SWE', value: 6},
            {country: 'SWIZ', value: 9},
            {country: 'UK', value: 12},
            {country: 'US', value: 60}
          ]
        },
        {
          q: "Out-of-pocket expenses for medical bills more than $1,000 in the past year, US$ equivalent",
          data:[
            {country: 'AUS', value: 16},
            {country: 'CAN', value: 15},
            {country: 'FRA', value: 7},
            {country: 'GER', value: 5},
            {country: 'NETH', value: 7},
            {country: 'NZ', value: 7},
            {country: 'NOR', value: 13},
            {country: 'SWE', value: 4},
            {country: 'SWIZ', value: 46},
            {country: 'UK', value: 4},
            {country: 'US', value: 36}
          ]
        },
      ]
    },
    {
      questionSet: 'Timeliness',
      sectionData: [
        {
          q: "Have a regular doctor or place",
          data:[
            {country: 'AUS', value: 94},
            {country: 'CAN', value: 93},
            {country: 'FRA', value: 99},
            {country: 'GER', value: 99},
            {country: 'NETH', value: 100},
            {country: 'NZ', value: 96},
            {country: 'NOR', value: 98},
            {country: 'SWE', value: 92},
            {country: 'SWIZ', value: 90},
            {country: 'UK', value: 94},
            {country: 'US', value: 88}
          ]
        },
        {
          q: "Regular doctor always or often answers the same day when contacted with question",
          data:[
            {country: 'AUS', value: 86},
            {country: 'CAN', value: 66},
            {country: 'FRA', value: 86},
            {country: 'GER', value: 87},
            {country: 'NETH', value: 87},
            {country: 'NZ', value: 83},
            {country: 'NOR', value: 76},
            {country: 'SWE', value: 75},
            {country: 'SWIZ', value: 88},
            {country: 'UK', value: 78},
            {country: 'US', value: 72}
          ]
        },
        {
          q: "Saw a doctor or nurse on the same or next day, last time they needed medical care",
          data:[
            {country: 'AUS', value: 67},
            {country: 'CAN', value: 43},
            {country: 'FRA', value: 56},
            {country: 'GER', value: 53},
            {country: 'NETH', value: 77},
            {country: 'NZ', value: 76},
            {country: 'NOR', value: 43},
            {country: 'SWE', value: 49},
            {country: 'SWIZ', value: 57},
            {country: 'UK', value: 57},
            {country: 'US', value: 51}
          ]
        },
        {
          q: "Somewhat or very difficult to obtain after-hours care",
          data:[
            {country: 'AUS', value: 44},
            {country: 'CAN', value: 63},
            {country: 'FRA', value: 64},
            {country: 'GER', value: 64},
            {country: 'NETH', value: 25},
            {country: 'NZ', value: 44},
            {country: 'NOR', value: 40},
            {country: 'SWE', value: 64},
            {country: 'SWIZ', value: 58},
            {country: 'UK', value: 49},
            {country: 'US', value: 51}
          ]
        },
        {
          q: "Waited two hours or more for care in emergency room",
          data:[
            {country: 'AUS', value: 23},
            {country: 'CAN', value: 50},
            {country: 'FRA', value: 9},
            {country: 'GER', value: 18},
            {country: 'NETH', value: 20},
            {country: 'NZ', value: 30},
            {country: 'NOR', value: 34},
            {country: 'SWE', value: 39},
            {country: 'SWIZ', value: 26},
            {country: 'UK', value: 32},
            {country: 'US', value: 25}
          ]
        },
        {
          q: "Doctors report patients often experience difficulty getting specialized tests (e.g., CT, MRI)",
          data:[
            {country: 'AUS', value: 11},
            {country: 'CAN', value: 40},
            {country: 'FRA', value: 54},
            {country: 'GER', value: 27},
            {country: 'NETH', value: 6},
            {country: 'NZ', value: 54},
            {country: 'NOR', value: 7},
            {country: 'SWE', value: 15},
            {country: 'SWIZ', value: 1},
            {country: 'UK', value: 19},
            {country: 'US', value: 29}
          ]
        },
        {
          q: "Doctors report patients often experience long wait times to receive treatment after diagnosis",
          data:[
            {country: 'AUS', value: 23},
            {country: 'CAN', value: 21},
            {country: 'FRA', value: 17},
            {country: 'GER', value: 17},
            {country: 'NETH', value: 10},
            {country: 'NZ', value: 33},
            {country: 'NOR', value: 18},
            {country: 'SWE', value: 28},
            {country: 'SWIZ', value: 1},
            {country: 'UK', value: 31},
            {country: 'US', value: 9}
          ]
        },
        {
          q: "Waited two months or longer for specialist appointment",
          data:[
            {country: 'AUS', value: 13},
            {country: 'CAN', value: 30},
            {country: 'FRA', value: 4},
            {country: 'GER', value: 3},
            {country: 'NETH', value: 7},
            {country: 'NZ', value: 20},
            {country: 'NOR', value: 28},
            {country: 'SWE', value: 19},
            {country: 'SWIZ', value: 9},
            {country: 'UK', value: 19},
            {country: 'US', value: 6}
          ]
        },
        {
          q: "Waited four month or longer for elective/non-emergency surgery",
          data:[
            {country: 'AUS', value: 8},
            {country: 'CAN', value: 18},
            {country: 'FRA', value: 2},
            {country: 'GER', value: 0},
            {country: 'NETH', value: 4},
            {country: 'NZ', value: 15},
            {country: 'NOR', value: 15},
            {country: 'SWE', value: 12},
            {country: 'SWIZ', value: 7},
            {country: 'UK', value: 12},
            {country: 'US', value: 4}
          ]
        },
        {
          q: "Practice has arrangement for patients to see doctor or nurse after hours without going to ED",
          data:[
            {country: 'AUS', value: 78},
            {country: 'CAN', value: 48},
            {country: 'FRA', value: 71},
            {country: 'GER', value: 85},
            {country: 'NETH', value: 94},
            {country: 'NZ', value: 92},
            {country: 'NOR', value: 80},
            {country: 'SWE', value: 75},
            {country: 'SWIZ', value: 69},
            {country: 'UK', value: 89},
            {country: 'US', value: 39}
          ]
        }
      ]
    }
  ],
  AdministrativeEfficiencyQuestions: [
    {
      questionSet: 'Administrative Efficiency',
      sectionData: [
        {
          'q': "Doctors report time spent on administrative issues related to insurance or claims is a major problem",
          data: [
            {country: "AUS", value: 21},
            {country: "CAN", value: 20},
            {country: "FRA", value: 63},
            {country: "GER", value: 52},
            {country: "NETH", value: 60},
            {country: "NZ", value: 20},
            {country: "NOR", value: 9},
            {country: "SWE", value: 27},
            {country: "SWIZ", value: 50},
            {country: "UK", value: 21},
            {country: "US", value: 54}
          ]
        },
        {
          'q': "Doctors report time spent getting patients needed medications or treatment because of coverage restrictions is a major problem",
          data: [
            {country: "AUS", value: 11},
            {country: "CAN", value: 21},
            {country: "FRA", value: 27},
            {country: "GER", value: 38},
            {country: "NETH", value: 32},
            {country: "NZ", value: 12},
            {country: "NOR", value: 6},
            {country: "SWE", value: 6},
            {country: "SWIZ", value: 14},
            {country: "UK", value: 15},
            {country: "US", value: 54}
          ]
        },
        {
          'q': "Doctors report time spent on issues related to reporting clinical or quality data to government or other agencies is a major problem",
          data: [
            {country: "AUS", value: 8},
            {country: "CAN", value: 10},
            {country: "FRA", value: 43},
            {country: "GER", value: 23},
            {country: "NETH", value: 51},
            {country: "NZ", value: 16},
            {country: "NOR", value: 13},
            {country: "SWE", value: 25},
            {country: "SWIZ", value: 33},
            {country: "UK", value: 22},
            {country: "US", value: 33}
          ]
        },
        {
          'q': "Visited ED for a condition that could have been treated by a regular doctor, had he/she been available",
          data: [
            {country: "AUS", value: 6},
            {country: "CAN", value: 17},
            {country: "FRA", value: 7},
            {country: "GER", value: 5},
            {country: "NETH", value: 6},
            {country: "NZ", value: 7},
            {country: "NOR", value: 11},
            {country: "SWE", value: 12},
            {country: "SWIZ", value: 9},
            {country: "UK", value: 7},
            {country: "US", value: 16}
          ]
        },
        {
          'q': "Tests results or medical records were not available at the time of patient's scheduled medical care appointment in the past two years",
          data: [
            {country: "AUS", value: 5},
            {country: "CAN", value: 8},
            {country: "FRA", value: 13},
            {country: "GER", value: 6},
            {country: "NETH", value: 5},
            {country: "NZ", value: 7},
            {country: "NOR", value: 7},
            {country: "SWE", value: 8},
            {country: "SWIZ", value: 6},
            {country: "UK", value: 6},
            {country: "US", value: 11}
          ]
        },
        {
          'q': "Doctors ordered a medical test that patient felt was unnecessary because the test had already been done in the past two years",
          data: [
            {country: "AUS", value: 6},
            {country: "CAN", value: 6},
            {country: "FRA", value: 20},
            {country: "GER", value: 6},
            {country: "NETH", value: 3},
            {country: "NZ", value: 4},
            {country: "NOR", value: 6},
            {country: "SWE", value: 5},
            {country: "SWIZ", value: 9},
            {country: "UK", value: 5},
            {country: "US", value: 11}
          ]
        },
        {
          'q': "Spent a lot of time on paperwork or disputes related to medical bills",
          data: [
            {country: "AUS", value: 5},
            {country: "CAN", value: 5},
            {country: "FRA", value: 28},
            {country: "GER", value: 5},
            {country: "NETH", value: 8},
            {country: "NZ", value: 3},
            {country: "NOR", value: 5},
            {country: "SWE", value: 3},
            {country: "SWIZ", value: 11},
            {country: "UK", value: 0},
            {country: "US", value: 16}
          ]
        }
      ]
    }
  ],
  HealthCareOutcomesQuestions:[
    {
      questionSet: 'Population Health',
      sectionData: [
        {
          'q': "Infant mortality, deaths per 1,000 live births",
          yAxisLabel: 'Deaths per 1,000 live births',
          range: [0,10],
            data: [
              {country: "AUS", value: 3.4},
              {country: "CAN", value: 4.8},
              {country: "FRA", value: 3.5},
              {country: "GER", value: 3.2},
              {country: "NETH", value: 3.6},
              {country: "NZ", value: 4.7},
              {country: "NOR", value: 2.4},
              {country: "SWE", value: 2.2},
              {country: "SWIZ", value: 3.9},
              {country: "UK", value: 3.9},
              {country: "US", value: 6}
            ]
        },
        {
          'q': "Adults age 18 to 64 with at least two of five common chronic conditions",
            data: [
              {country: "AUS", value: 10},
              {country: "CAN", value: 16},
              {country: "FRA", value: 12},
              {country: "GER", value: 8},
              {country: "NETH", value: 9},
              {country: "NZ", value: 9},
              {country: "NOR", value: 12},
              {country: "SWE", value: 10},
              {country: "SWIZ", value: 10},
              {country: "UK", value: 10},
              {country: "US", value: 21}
            ]
        },
        {
          'q': "Life expectancy at age 60 in years",
          yAxisLabel: 'Years',
          range: [0,40],
            data: [
              {country: "AUS", value: 25.5},
              {country: "CAN", value: 25},
              {country: "FRA", value: 25.7},
              {country: "GER", value: 23.7},
              {country: "NETH", value: 24.2},
              {country: "NZ", value: 24.7},
              {country: "NOR", value: 24.2},
              {country: "SWE", value: 24.6},
              {country: "SWIZ", value: 25.5},
              {country: "UK", value: 24.1},
              {country: "US", value: 23.6}
            ]
        },
      ]
    },
    {
      questionSet: 'Mortality amenable to health care',
      sectionData: [
        {
          'q': "Mortality amenable to healthcare, deaths per 100,00",
          yAxisLabel:'Deaths per 100,000',
          data: [
            {country: "AUS", value: 62},
            {country: "CAN", value: 78},
            {country: "FRA", value: 61},
            {country: "GER", value: 83},
            {country: "NETH", value: 72},
            {country: "NZ", value: 87},
            {country: "NOR", value: 64},
            {country: "SWE", value: 69},
            {country: "SWIZ", value: 55},
            {country: "UK", value: 85},
            {country: "US", value: 112}
          ]
        },
        {
          'q': "10-year decline in mortality amenable to health care",
          data: [
            {country: "AUS", value:29},
            {country: "CAN", value:26},
            {country: "FRA", value:28},
            {country: "GER", value:28},
            {country: "NETH", value:34},
            {country: "NZ", value:32},
            {country: "NOR", value:32},
            {country: "SWE", value:26},
            {country: "SWIZ", value:29},
            {country: "UK", value:37},
            {country: "US", value:16}
          ]
        },               
      ]
    },
    {
      questionSet: 'Disease-specific health outcomes',
      sectionData: [
        {
          'q': "30 day in-hospital mortality rate following acute myocardial infarction, deaths per 100 patients",
          yAxisLabel:'Deaths per 100',
          data: [
            {country: "AUS", value: 4.1},
            {country: "CAN", value: 6.7},
            {country: "FRA", value: 7.2},
            {country: "GER", value: 8.7},
            {country: "NETH", value: 7.6},
            {country: "NZ", value: 6.6},
            {country: "NOR", value: 6.7},
            {country: "SWE", value: 4.5},
            {country: "SWIZ", value: 7.7},
            {country: "UK", value: 7.6},
            {country: "US", value: 5.5}
          ]
        },
        {
          'q': "30 day in-hospital mortality rate following ischemic stroke, deaths per 100 patients",
          yAxisLabel:'Deaths per 100',
          data: [
            {country: "AUS", value: 9.3},
            {country: "CAN", value: 10},
            {country: "FRA", value: 7.9},
            {country: "GER", value: 6.4},
            {country: "NETH", value: 7.1},
            {country: "NZ", value: 8},
            {country: "NOR", value: 5.4},
            {country: "SWE", value: 6.4},
            {country: "SWIZ", value: 6.9},
            {country: "UK", value: 9.2},
            {country: "US", value: 3.6}
          ]
        },
        {
          'q': "Breast cancer five-year relative survival rate",
          data: [
            {country: "AUS", value:88},
            {country: "CAN", value:88},
            {country: "FRA", value:0},
            {country: "GER", value:86},
            {country: "NETH", value:85},
            {country: "NZ", value:86},
            {country: "NOR", value:89},
            {country: "SWE", value:89},
            {country: "SWIZ", value:0},
            {country: "UK", value:81},
            {country: "US", value:89}
          ]
        },
        {
          'q': "Colon cancer five-year relative survival rate",
          data: [
            {country: "AUS", value: 69},
            {country: "CAN", value: 64},
            {country: "FRA", value: 0},
            {country: "GER", value: 64},
            {country: "NETH", value: 64},
            {country: "NZ", value: 63},
            {country: "NOR", value: 64},
            {country: "SWE", value: 65},
            {country: "SWIZ", value: 0},
            {country: "UK", value: 56},
            {country: "US", value: 64}
          ]
        },
      ]
    },
  ],  
  EquityQuestions: [
    {
      questionSet: 'Equity Measures',
      sectionData:[
        {
          'q': "Rated medical care from regular provider was fair or poor",
          range:[-10, 20],
          yAxisLabel: 'Percent difference between high and low income individuals',
          data: [
            {country: "AUS", value: 03},
            {country: "CAN", value: 03},
            {country: "FRA", value: 14},
            {country: "GER", value: 06},
            {country: "NETH", value: 04},
            {country: "NZ", value: -02},
            {country: "NOR", value: 04},
            {country: "SWE", value: 05},
            {country: "SWIZ", value: 02},
            {country: "UK", value: -03},
            {country: "US", value: 07}
          ]
        },
        {
          'q': "Had any cost-related access problem to medical care in the past year",
          range:[0, 30],
          yAxisLabel: 'Percent difference between high and low income individuals',
          data: [
            {country: "AUS", value: 11},
            {country: "CAN", value: 19},
            {country: "FRA", value: 11},
            {country: "GER", value: 04},
            {country: "NETH", value: 07},
            {country: "NZ", value: 16},
            {country: "NOR", value: 09},
            {country: "SWE", value: 08},
            {country: "SWIZ", value: 15},
            {country: "UK", value: 03},
            {country: "US", value: 18}
          ]
        },
        {
          'q': "Skipped dental care or check up because of cost in the past year",
          range:[-10, 40],
          yAxisLabel: 'Percent difference between high and low income individuals',
          data: [
            {country: "AUS", value: 10},
            {country: "CAN", value: 24},
            {country: "FRA", value: 17},
            {country: "GER", value: -01},
            {country: "NETH", value: 10},
            {country: "NZ", value: 11},
            {country: "NOR", value: 19},
            {country: "SWE", value: 14},
            {country: "SWIZ", value: 16},
            {country: "UK", value: 05},
            {country: "US", value: 24}
          ]
        },
        {
          'q': "Had serious problems paying or was unable to pay medical bills",
          range:[0, 50],
          yAxisLabel: 'Percent difference between high and low income individuals',
          data: [
            {country: "AUS", value: 06},
            {country: "CAN", value: 10},
            {country: "FRA", value: 34},
            {country: "GER", value: 10},
            {country: "NETH", value: 11},
            {country: "NZ", value: 11},
            {country: "NOR", value: 08},
            {country: "SWE", value: 10},
            {country: "SWIZ", value: 14},
            {country: "UK", value: 03},
            {country: "US", value: 18}
          ]
        },
        {
          'q': "Somewhat or very difficult to obtain after-hours care",
          range:[-10, 30],
          yAxisLabel: 'Percent difference between high and low income individuals',
          data: [
            {country: "AUS", value: 14},
            {country: "CAN", value: 08},
            {country: "FRA", value: 06},
            {country: "GER", value: 04},
            {country: "NETH", value: 04},
            {country: "NZ", value: 17},
            {country: "NOR", value: 09},
            {country: "SWE", value: 04},
            {country: "SWIZ", value: 02},
            {country: "UK", value: -01},
            {country: "US", value: 10}
          ]
        },
        {
          'q': "Waited two months or longer for specialist appointment",
          range:[-20, 20],
          yAxisLabel: 'Percent difference between high and low income individuals',
          data: [
            {country: "AUS", value: 10},
            {country: "CAN", value: 02},
            {country: "FRA", value: -08},
            {country: "GER", value: 0},
            {country: "NETH", value: 01},
            {country: "NZ", value: 14},
            {country: "NOR", value: 02},
            {country: "SWE", value: 04},
            {country: "SWIZ", value: 01},
            {country: "UK", value: -14},
            {country: "US", value: 04}
          ]
        },
        {
          'q': "Specialist lacked medical history or regular doctor not informed about specialist care in the past two years",
          range:[-10, 20],
          yAxisLabel: 'Percent difference between high and low income individuals',
          data: [
            {country: "AUS", value: 12},
            {country: "CAN", value: 12},
            {country: "FRA", value: -04},
            {country: "GER", value: 0},
            {country: "NETH", value: 01},
            {country: "NZ", value: 09},
            {country: "NOR", value: -05},
            {country: "SWE", value: 02},
            {country: "SWIZ", value: 03},
            {country: "UK", value: 11},
            {country: "US", value: 15}
          ]
        },
        {
          'q': "Have a regular doctor or place",
          range:[-10, 20],
          yAxisLabel: 'Percent difference between high and low income individuals',
          data: [
            {country: "AUS", value: 05},
            {country: "CAN", value: 02},
            {country: "FRA", value: 0},
            {country: "GER", value: 01},
            {country: "NETH", value: 0},
            {country: "NZ", value: 01},
            {country: "NOR", value: 0},
            {country: "SWE", value: -02},
            {country: "SWIZ", value: -02},
            {country: "UK", value: 03},
            {country: "US", value: 09}
          ]
        },
        {
          'q': "Regular doctor always or often spent enough time with them and explained things in a way they could understand",
          range:[-10, 30],
          yAxisLabel: 'Percent difference between high and low income individuals',
          data: [
            {country: "AUS", value: 05},
            {country: "CAN", value: 09},
            {country: "FRA", value: 05},
            {country: "GER", value: 21},
            {country: "NETH", value: 01},
            {country: "NZ", value: 15},
            {country: "NOR", value: 06},
            {country: "SWE", value: 05},
            {country: "SWIZ", value: 06},
            {country: "UK", value: -01},
            {country: "US", value: 09}
          ]
        },
        {
          'q': "Regular doctor always or often knew important information about their medical history",
          range:[-10, 40],
          yAxisLabel: 'Percent difference between high and low income individuals',
          data: [
            {country: "AUS", value: 05},
            {country: "CAN", value: 07},
            {country: "FRA", value: 27},
            {country: "GER", value: 14},
            {country: "NETH", value: 0},
            {country: "NZ", value: 08},
            {country: "NOR", value: 1},
            {country: "SWE", value: -03},
            {country: "SWIZ", value: -05},
            {country: "UK", value: 05},
            {country: "US", value: 09}
          ]
        },
        {
          'q': "Talked with provider about healthy diet, exercise and physical activity in the past two years",
          range:[-20, 20],
          yAxisLabel: 'Percent difference between high and low income individuals',
          data: [
            {country: "AUS", value: -05},
            {country: "CAN", value: 04},
            {country: "FRA", value: 15},
            {country: "GER", value: 06},
            {country: "NETH", value: 0},
            {country: "NZ", value: -12},
            {country: "NOR", value: 01},
            {country: "SWE", value: 0},
            {country: "SWIZ", value: -03},
            {country: "UK", value: -08},
            {country: "US", value: 11}
          ]
        }
      ]
    }
  ]
}


