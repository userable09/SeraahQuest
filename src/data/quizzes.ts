import { Quiz } from '../types';

export const QUIZZES_DATA: Quiz[] = [
  {
    id: 'quiz-pre-islamic',
    title: 'Pre-Islamic Arabia & Early Lineage',
    era: 'General Knowledge',
    difficulty: 'Easy',
    timeLimitSeconds: 120,
    xpReward: 150,
    badgeToUnlock: 'badge-lineage-seeker',
    description: 'Test your understanding of the geography, culture, and noble family ancestry of Prophet Muhammad ﷺ in Makkah.',
    questions: [
      {
        id: 'q1',
        question: 'Which ancient prophet originally constructed the Ka\'bah in Makkah with his son?',
        options: [
          'Prophet Musa (AS) and Harun (AS)',
          'Prophet Ibrahim (AS) and Ismail (AS)',
          'Prophet Isa (AS) and Yahya (AS)',
          'Prophet Nuh (AS) and Sam'
        ],
        correctAnswerIndex: 1,
        explanation: 'Prophet Ibrahim (AS) and his son Ismail (AS) constructed the foundation of the Ka\'bah on Tawhid (Monotheism).',
        hadithReference: 'Surah Bakarah 2:127'
      },
      {
        id: 'q2',
        question: 'Who was the grandfather of Prophet Muhammad ﷺ who rediscovered the Well of Zamzam?',
        options: [
          'Abu Talib',
          '\'Abdul-Muttalib',
          'Hashim ibn \'Abd Manaf',
          'Al-\'Abbas'
        ],
        correctAnswerIndex: 1,
        explanation: '\'Abdul-Muttalib rediscovered Zamzam and led Banu Hashim with wisdom during the Year of the Elephant.',
        hadithReference: 'Ar-Raheeq Al-Makhtum'
      },
      {
        id: 'q3',
        question: 'What title was given to Prophet Muhammad ﷺ by the people of Makkah before his Prophethood?',
        options: [
          'Al-Farooq',
          'Al-Siddiq',
          'Al-Sadiq Al-Amin (The Truthful, The Trustworthy)',
          'Saifullah'
        ],
        correctAnswerIndex: 2,
        explanation: 'Due to his flawless honesty, integrity, and ethical dealings, Makkans nicknamed him Al-Sadiq Al-Amin.',
        hadithReference: 'Sahih al-Bukhari'
      }
    ]
  },
  {
    id: 'quiz-meccan-period',
    title: 'The Dawn of Prophethood in Makkah',
    era: 'Meccan Period',
    difficulty: 'Medium',
    timeLimitSeconds: 180,
    xpReward: 250,
    badgeToUnlock: 'badge-first-light',
    description: 'Master key events from Cave Hira, the first revelation of Surah Al-\'Alaq, Mount As-Safa, and early Sahabah.',
    questions: [
      {
        id: 'q1',
        question: 'Where was Prophet Muhammad ﷺ when the Archangel Jibril (AS) brought the first revelation?',
        options: [
          'Inside the Ka\'bah',
          'Cave Hira atop Jabal al-Nur',
          'Cave Thawr',
          'Masjid Quba'
        ],
        correctAnswerIndex: 1,
        explanation: 'At age 40, the Prophet ﷺ retreated to Cave Hira on Jabal al-Nur for prayer when Jibril (AS) descended.',
        hadithReference: 'Sahih al-Bukhari 3'
      },
      {
        id: 'q2',
        question: 'Who was the first person to accept Islam and comfort the Prophet ﷺ after the first revelation?',
        options: [
          'Abu Bakr As-Siddiq (RA)',
          '\'Ali ibn Abi Talib (RA)',
          'Khadijah bint Khuwaylid (RA)',
          'Zayd ibn Harithah (RA)'
        ],
        correctAnswerIndex: 2,
        explanation: 'Khadijah (RA), the noble wife of the Prophet ﷺ, was the very first person to embrace Islam.',
        hadithReference: 'Sahih Muslim'
      },
      {
        id: 'q3',
        question: 'Who was the first martyr (Shaheed) in Islam during the persecution in Makkah?',
        options: [
          'Bilal ibn Rabah (RA)',
          'Sumayyah bint Khayyat (RA)',
          'Hamzah ibn \'Abdul-Muttalib (RA)',
          'Mus\'ab ibn \'Umayr (RA)'
        ],
        correctAnswerIndex: 1,
        explanation: 'Sumayyah (RA), mother of \'Ammar ibn Yasir, was martyred by Abu Jahl for standing firm on Tawhid.',
        hadithReference: 'Al-Hakim'
      },
      {
        id: 'q4',
        question: 'What was the sanctuary where early Muslims gathered secretly in Makkah for study and worship?',
        options: [
          'Dar al-Nadwah',
          'Dar al-Arqam',
          'House of Abu Sufyan',
          'Bay\'at al-\'Aqabah'
        ],
        correctAnswerIndex: 1,
        explanation: 'Dar al-Arqam (the house of Al-Arqam ibn Abi al-Arqam) served as the confidential educational headquarters.',
        hadithReference: 'Sirat Ibn Hisham'
      }
    ]
  },
  {
    id: 'quiz-hijrah-medina',
    title: 'The Great Hijrah & Building Medina',
    era: 'Medinan Period',
    difficulty: 'Medium',
    timeLimitSeconds: 180,
    xpReward: 300,
    badgeToUnlock: 'badge-migrant-pioneer',
    description: 'Explore the miraculous escape to Cave Thawr, arrival at Quba, establishing Muwakhat, and the Constitution of Medina.',
    questions: [
      {
        id: 'q1',
        question: 'Which companion stayed behind in the Prophet\'s bed on the night of Hijrah to return Makkan trusts?',
        options: [
          '\'Umar ibn al-Khattab (RA)',
          '\'Ali ibn Abi Talib (RA)',
          'Uthman ibn \'Affan (RA)',
          'Abu Bakr As-Siddiq (RA)'
        ],
        correctAnswerIndex: 1,
        explanation: '\'Ali (RA) bravely slept in the Prophet\'s bed covered with his cloak to foil assassins and return all entrusted property.',
        hadithReference: 'Sahih al-Bukhari'
      },
      {
        id: 'q2',
        question: 'What cave did the Prophet ﷺ and Abu Bakr (RA) hide in for 3 days while being pursued by Quraysh?',
        options: [
          'Cave Hira',
          'Cave Thawr',
          'Cave of Uhud',
          'Cave Kahf'
        ],
        correctAnswerIndex: 1,
        explanation: 'They hid in Cave Thawr south of Makkah, where Allah protected them with his tranquility (Sakinah).',
        hadithReference: 'Surah At-Tawbah 9:40'
      },
      {
        id: 'q3',
        question: 'What was the first mosque constructed in Islam upon arrival on the outskirts of Medina?',
        options: [
          'Masjid Al-Haram',
          'Masjid An-Nabawi',
          'Masjid Quba',
          'Masjid Al-Qiblatayn'
        ],
        correctAnswerIndex: 2,
        explanation: 'Masjid Quba was founded on piety (*Taqwa*) as the first mosque in Islamic history.',
        hadithReference: 'Surah At-Tawbah 9:108'
      }
    ]
  },
  {
    id: 'quiz-battles-diplomacy',
    title: 'Major Battles & Conquest of Makkah',
    era: 'Battles & Diplomacy',
    difficulty: 'Hard',
    timeLimitSeconds: 240,
    xpReward: 400,
    badgeToUnlock: 'badge-victorious-conqueror',
    description: 'Test your knowledge on Badr, Uhud, Trench, Treaty of Hudaybiyyah, and the peaceful Conquest of Makkah.',
    questions: [
      {
        id: 'q1',
        question: 'How many believers fought alongside Prophet Muhammad ﷺ in the Battle of Badr?',
        options: [
          '1,000',
          '700',
          '313',
          '10,000'
        ],
        correctAnswerIndex: 2,
        explanation: 'In Ramadan 2 AH, 313 Muslims defeated 1,000 Makkan warriors through divine aid and faith.',
        hadithReference: 'Sahih al-Bukhari'
      },
      {
        id: 'q2',
        question: 'Who proposed digging a trench (*Khandaq*) around Medina to defend against the Allied forces (Al-Ahzab)?',
        options: [
          'Salman al-Farsi (RA)',
          'Sa\'d ibn Mu\'adh (RA)',
          'Khalid ibn al-Walid (RA)',
          'Abu Ubaydah (RA)'
        ],
        correctAnswerIndex: 0,
        explanation: 'Salman al-Farsi (RA) suggested the Persian strategy of digging a protective trench around Medina\'s exposed boundary.',
        hadithReference: 'Ar-Raheeq Al-Makhtum'
      },
      {
        id: 'q3',
        question: 'What did Prophet Muhammad ﷺ declare to the conquered Makkans at the Ka\'bah on the day of Conquest?',
        options: [
          'They must be banished from Arabia',
          'They must pay heavy ransom',
          '\'Go, for you are all free (At-Tulaqa)\' - Universal Amnesty',
          'They must forfeit all properties'
        ],
        correctAnswerIndex: 2,
        explanation: 'He issued an unprecedented universal pardon, demonstrating prophetic mercy and forgiveness.',
        hadithReference: 'Sirat Ibn Hisham'
      }
    ]
  }
];
