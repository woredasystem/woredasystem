// Import images
import girmaImage from '../assets/ግርማ ፈለቀ.jpg'
import shawulImage from '../assets/ሻውል ታደሰ.jpg'
import gadisaImage from '../assets/ጋዲሳ እልኩ.jpg'
import chaltuImage from '../assets/ጫልቱ አያና.jpg'
import lelisaImage from '../assets/ሌሊሳ ሴሪቃ.jpg'
import beyenetchImage from '../assets/በየነች አንበሱ.jpg'

// Officials organized by categories
export const officialsByCategory = {
  office_heads: {
    title_am: 'የፅ/ቤት ሀላፊዎች',
    title_en: 'Office Heads',
    officials: [
      {
        id: 1,
        full_name_am: 'አቶ ግርማ በቀለ',
        full_name_en: 'Ato Girma Bekele',
        title_am: 'የንግድ ጽ/ቤት ሀላፊ',
        title_en: 'Head, Trade Office',
        role_key: 'trade_head',
        image_url: girmaImage
      },
      {
        id: 2,
        full_name_am: 'አቶ ሻውል ታደሰ ውባለም',
        full_name_en: 'Ato Shawul Tadesse Wubalem',
        title_am: 'የስራና ክህሎት ጽ/ቤት ሀላፊ',
        title_en: 'Head, Labor & Skills Office',
        role_key: 'labor_head',
        image_url: shawulImage
      },
      {
        id: 3,
        full_name_am: 'አቶ ጋዲሳ ኢሉኩ',
        full_name_en: 'Ato Gadisa Iluku',
        title_am: 'የሲቪል ምዝገባና የነዋሪዎች አገልግሎት ኤጀንሲ',
        title_en: 'Civil Registration and Residents Service Agency',
        role_key: 'civil_head',
        image_url: gadisaImage
      },
      {
        id: 4,
        full_name_am: 'ወ/ሮ ጫልቱ አያና',
        full_name_en: 'W/ro Chaltu Ayana',
        title_am: 'የአቃ/ቃ/ክ/ከተማ ወረዳ 9 ዋና ስ/አስፈጻሚ',
        title_en: 'Chief Executive, A/K/A/City Woreda 9',
        role_key: 'ceo',
        image_url: chaltuImage
      },
      {
        id: 5,
        full_name_am: 'አቶ ሌሊሳ ሲሪቃ ሊካሳ',
        full_name_en: 'Ato Lelisa Sirika Likasa',
        title_am: 'የአቃ/ቃ/ክ/ከተማ ወረዳ 9 ዋና ስ/አስፈጻሚ ጽ/ቤት ሀላፊ',
        title_en: 'Head, Chief Executive Office, A/K/A/City Woreda 9',
        role_key: 'ceo_office_head',
        image_url: lelisaImage
      },
      {
        id: 6,
        full_name_am: 'ወ/ሮ በየነች አንበሱ እሸቱ',
        full_name_en: 'W/ro Beyenetch Anbesu Eshetu',
        title_am: 'የአቃ/ቃ/ክ/ከተማ ወረዳ 9 ምክር ቤት',
        title_en: 'Council, A/K/A/City Woreda 9',
        role_key: 'council_speaker',
        image_url: beyenetchImage
      }
    ]
  }
}

// Separate list for complaint form - only office heads (people you can file complaints against)
export const complaintOfficials = [
  ...officialsByCategory.office_heads.officials
]

// Flattened list for backward compatibility (used by leadership page)
export const officials = Object.values(officialsByCategory)
  .flatMap(category => category.officials || [])
