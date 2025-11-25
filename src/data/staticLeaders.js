// Static Leaders Data - Display Only
// This file contains static leader information for display purposes
// Does not affect the main officials.js file

// Import available images
import shawulImage from '../assets/ሻውል ታደሰ.jpg'
import chaltuImage from '../assets/ጫልቱ አያና.jpg'
import mastewalImage from '../assets/ማስተዋል.jpg'
import felekeImage from '../assets/ፈለቀ ደውዬ.jpg'
import amarImage from '../assets/አማረ ጉታ.jpg'
import samrawitImage from '../assets/ሳምራዊት ኅ ስላሴ.jpg'
import muluImage from '../assets/ሙሉ ደበሌ.jpg'
import meseretImage from '../assets/መሰረት ካፒቴን.jpg'
import wendesenImage from '../assets/ወንደሰን ግዛው.jpg'
import andualemImage from '../assets/አንዱአለም ደበበ.jpg'
import tesagerImage from '../assets/ተሻገር ደፋሩ.jpg'
import yehalashetImage from '../assets/የኋላሸት ከበደ.jpg'
import demsewImage from '../assets/ደምሰው ዲባባ.jpg'
import asmaImage from '../assets/አስማ ጠሀ.jpg'

// Static leaders organized by categories
export const staticLeadersByCategory = {
  coordinating_committee: {
    title_am: 'አስተባባሪ ኮሚቴ',
    title_en: 'Coordinating Committee',
    leaders: [
      {
        id: 'static-cc-1',
        full_name_am: 'አቶ ሻውል ታደሰ',
        full_name_en: 'Ato Shawul Tadese',
        title_am: 'የስራና ክህሎት ጽ/ቤት ኃላፊ',
        title_en: 'Head, Labor & Skills Office',
        image_url: shawulImage
      },
      {
        id: 'static-cc-2',
        full_name_am: 'ጫልቱ አያና',
        full_name_en: 'Chaltu Ayana',
        title_am: 'ዋና ሥራ አስፈፃሚ',
        title_en: 'Chief Executive',
        image_url: chaltuImage
      },
      {
        id: 'static-cc-3',
        full_name_am: 'ወ/ሮ ማስተዋል',
        full_name_en: 'W/ro Mastewal',
        title_am: 'አደረጃጀት ዘርፍ ሀላፊ',
        title_en: 'Head, Organization Sector',
        image_url: mastewalImage
      },
      {
        id: 'static-cc-4',
        full_name_am: 'አቶ ፈለቀ ደውዬ',
        full_name_en: 'Ato Feleke Dewuye',
        title_am: 'ወረዳ 9 ብልፅግና ፖርቲ ቅ/ፅ/ቤት ሀላፊ',
        title_en: 'Head, Woreda 9 Prosperity Party Office',
        image_url: felekeImage
      }
    ]
  },
  party_committee: {
    title_am: 'ፖርቲ ኮሚቴ',
    title_en: 'Party Committee',
    leaders: [
      {
        id: 'static-pc-1',
        full_name_am: 'አቶ ፈለቀ ደውዬ',
        full_name_en: 'Ato Feleke Dewuye',
        title_am: 'ወረዳ 9 ብልፅግና ፖርቲ ቅ/ፅ/ቤት ሀላፊ',
        title_en: 'Head, Woreda 9 Prosperity Party Office',
        image_url: felekeImage
      },
      {
        id: 'static-pc-2',
        full_name_am: 'ወ/ሮ ማስተዋል',
        full_name_en: 'W/ro Mastewal',
        title_am: 'አደረጃጀት ዘርፍ ሀላፊ',
        title_en: 'Head, Organization Sector',
        image_url: mastewalImage
      }
    ]
  },
  commission_head: {
    title_am: 'ኮሚሽን ሀላፊ',
    title_en: 'Commission Head',
    leaders: [
      {
        id: 'static-ch-1',
        full_name_am: 'አማረ ጉታ',
        full_name_en: 'Amar Guta',
        title_am: 'የብልፅግና የኢንስፔክሽንና የስነ ምግባር ኮሚሽን ቅ/ፅ/ቤት ሀላፊ',
        title_en: 'Head, Prosperity, Inspection and Ethics Commission Office',
        image_url: amarImage
      }
    ]
  },
  office_heads: {
    title_am: 'የፅ/ቤት ሀላፊዎች',
    title_en: 'Office Heads',
    leaders: [
      {
        id: 'static-oh-1',
        full_name_am: 'ሳምራዊት ኅ ስላሴ',
        full_name_en: 'Samrawit H Selassie',
        title_am: 'የኅ/ስራ ጽ/ቤት ኃላፊ',
        title_en: 'Head, Work Office',
        image_url: samrawitImage
      },
      {
        id: 'static-oh-2',
        full_name_am: 'ወ/ሮ ሙሉ ደበሌ',
        full_name_en: 'W/ro Mulu Debele',
        title_am: 'የወረዳ 9 ደንብ ማስከበር ጽ/ቤት ኃላፊ',
        title_en: 'Head, Woreda 9 Rule Enforcement Office',
        image_url: muluImage
      },
      {
        id: 'static-oh-3',
        full_name_am: 'ወ/ሮ መሠረት ካፒቴን',
        full_name_en: 'W/ro Meseret Captain',
        title_am: 'ጽ/ቤት ኃላፊ',
        title_en: 'Office Head',
        image_url: meseretImage
      },
      {
        id: 'static-oh-4',
        full_name_am: 'ወንደሠን ግዛው ደበሌ',
        full_name_en: 'Wendesen Gizaw Debele',
        title_am: 'የአርሶአደር እና ከተማ ግብርና ጽ/ቤት ኃላፊ',
        title_en: 'Head, Agriculture and Urban Agriculture Office',
        image_url: wendesenImage
      },
      {
        id: 'static-oh-5',
        full_name_am: 'አንዱአለም ደበበ አንለይ',
        full_name_en: 'Andualem Debele Anley',
        title_am: 'የፕ/ሰ/ሰ/ኃ/ል/ጽ ት ኃላፊ',
        title_en: 'Head, Planning, Social, Economic Development Office',
        image_url: andualemImage
      },
      {
        id: 'static-oh-6',
        full_name_am: 'አቶ ተሻገር ደፋሩ',
        full_name_en: 'Ato Tesager Defaru',
        title_am: 'የሰላምና ጸጥታ አስተዳደር ጽ/ቤት ኃላፊ',
        title_en: 'Head, Peace and Security Administration Office',
        image_url: tesagerImage
      },
      {
        id: 'static-oh-7',
        full_name_am: 'አቶ የኃላሸት ከበደ',
        full_name_en: 'Ato Yehalashet Kebede',
        title_am: 'አ/ቃ/ክ/ከተማ ወረዳ 09 ሀ/ተ/እና/በጎ/ፍ/ማ ጽ/ቤት ኃላፊ',
        title_en: 'Head, A/K/A/City Woreda 09 Health and Social Development Office',
        image_url: yehalashetImage
      },
      {
        id: 'static-oh-8',
        full_name_am: 'አቶ ደምሰው ዲባባ',
        full_name_en: 'Ato Demsew Dibaba',
        title_am: 'የፅዳትና ውበት አስተዳደር ጽ/ቤት ኃላፊ',
        title_en: 'Head, Sanitation and Beauty Administration Office',
        image_url: demsewImage
      },
      {
        id: 'static-oh-9',
        full_name_am: 'አስማ ጠሀ',
        full_name_en: 'Asma Teha',
        title_am: 'ፋይናንስ',
        title_en: 'Finance',
        image_url: asmaImage
      },
      {
        id: 'static-oh-10',
        full_name_am: 'አቶ ደምሰው ዲባባ',
        full_name_en: 'Ato Demsew Dibaba',
        title_am: 'ጽዳትና ውበት',
        title_en: 'Sanitation and Beauty',
        image_url: demsewImage // Reusing the same image
      }
    ]
  }
}

