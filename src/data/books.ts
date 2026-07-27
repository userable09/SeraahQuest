import { Book } from '../types';

export const BOOKS_DATA: Book[] = [
  {
    id: 'sealed-nectar',
    title: 'Ar-Raheeq Al-Makhtum (The Sealed Nectar)',
    arabicTitle: 'الرحيق المختوم',
    author: 'Sheikh Safi-ur-Rahman al-Mubarakpuri',
    description: 'Award-winning authoritative biography of Prophet Muhammad ﷺ. Honored by the Muslim World League with first prize for its authentic methodology and narrative mastery.',
    chaptersCount: 12,
    estimatedHours: 8,
    category: 'Classical',
    tags: ['Award Winner', 'Complete Biography', 'Most Popular', 'Authentic Hadith References']
  },
  {
    id: 'understanding-seerah',
    title: 'Fiqh-us-Seerah (Understanding the Seerah)',
    arabicTitle: 'فقه السيرة',
    author: 'Sheikh Muhammad al-Ghazali',
    description: 'A profound analytical journey into the spiritual, political, and moral dimensions behind every major decision and milestone in the life of the Prophet ﷺ.',
    chaptersCount: 10,
    estimatedHours: 6,
    category: 'Modern Analysis',
    tags: ['Analytical', 'Spiritual Insights', 'Leadership', 'Islamic Thought']
  },
  {
    id: 'sirat-ibn-hisham',
    title: 'Sirat Ibn Hisham (Primary Classical Source)',
    arabicTitle: 'سيرة ابن هشام',
    author: 'Ibn Hisham (d. 833 CE)',
    description: 'The premier foundational text of Islamic Seerah, recanting early records from Ibn Ishaq. Contains detailed genealogical lines, poetry, and early historical records.',
    chaptersCount: 15,
    estimatedHours: 12,
    category: 'Classical',
    tags: ['Foundational', 'Historical Primary Source', 'Poetry', 'Lineage']
  },
  {
    id: 'moon-split',
    title: 'When the Moon Split',
    arabicTitle: 'عندما انشق القمر',
    author: 'Safiur-Rahman Mubarakpuri',
    description: 'A clear, accessible, and structured account designed for students and readers seeking an engaging overview of the miraculous events and pivotal moments.',
    chaptersCount: 8,
    estimatedHours: 5,
    category: 'Biography',
    tags: ['Accessible', 'Miracles', 'Student Friendly', 'Chronological']
  }
];
