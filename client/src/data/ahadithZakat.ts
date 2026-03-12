/** Authentic Ahadith about Zakat and charity – English, Urdu, Arabic + source */
export interface HadithEntry {
  en: string;
  ur: string;
  ar: string;
  source: string;
}

export const AHADITH_ZAKAT: HadithEntry[] = [
  {
    en: "Whoever is made wealthy by Allah and does not pay the Zakat of his wealth, then on the Day of Resurrection his wealth will be made like a bald-headed poisonous male snake with two black spots over the eyes.",
    ur: "جسے اللہ نے مال دیا اور اس نے اس کی زکوٰۃ ادا نہیں کی تو قیامت کے دن اس کا مال ایک گنجے زہریلے سانپ کی شکل میں کر دیا جائے گا جس کی آنکھوں پر دو سیاہ نقطے ہوں گے۔",
    ar: "مَنْ آتَاهُ اللَّهُ مَالًا فَلَمْ يُؤَدِّ زَكَاتَهُ، مُثِّلَ لَهُ مَالُهُ يَوْمَ الْقِيَامَةِ شُجَاعًا أَقْرَعَ لَهُ زَبِيبَتَانِ...",
    source: "Sahih Al-Bukhari 1403",
  },
  {
    en: "When the Prophet (ﷺ) sent Mu'adh to Yemen, he said: Invite them to testify that none has the right to be worshipped but Allah and I am Allah's Messenger; and if they obey you in that, then tell them that Allah has enjoined on them five prayers; and if they obey you in that, then tell them that Allah has made Zakat obligatory for them—to be taken from the rich among them and given to the poor among them.",
    ur: "جب نبی کریم ﷺ نے حضرت معاذ کو یمن بھیجا تو فرمایا: انہیں دعوت دو کہ اللہ کے سوا کوئی معبود نہیں اور میں اللہ کا رسول ہوں؛ اگر وہ اس پر عمل کریں تو انہیں بتاؤ کہ اللہ نے ان پر پانچ نمازیں فرض کی ہیں؛ اور اگر وہ اس پر عمل کریں تو انہیں بتاؤ کہ اللہ نے ان پر زکوٰۃ فرض کی ہے—ان کے مالداروں سے لی جائے اور ان کے غریبوں میں دی جائے۔",
    ar: "إِنَّكَ تَقْدَمُ عَلَى قَوْمٍ أَهْلِ كِتَابٍ، فَلْيَكُنْ أَوَّلَ مَا تَدْعُوهُمْ إِلَيْهِ عِبَادَةُ اللَّهِ، فَإِذَا عَرَفُوا اللَّهَ فَأَخْبِرْهُمْ أَنَّ اللَّهَ فَرَضَ عَلَيْهِمْ خَمْسَ صَلَوَاتٍ... وَأَخْبِرْهُمْ أَنَّ اللَّهَ افْتَرَضَ عَلَيْهِمْ زَكَاةً فِي أَمْوَالِهِمْ تُؤْخَذُ مِنْ أَغْنِيَائِهِمْ وَتُرَدُّ عَلَى فُقَرَائِهِمْ.",
    source: "Sahih Al-Bukhari 1395",
  },
  {
    en: "When the verses of Zakat were revealed, Allah made Zakat a purifier of property. So property from which Zakat is paid is not considered hoarded wealth (Al-Kanz).",
    ur: "جب زکوٰۃ کی آیات نازل ہوئیں تو اللہ نے زکوٰۃ کو مال کی طہارت قرار دیا۔ پس جس مال سے زکوٰۃ ادا کی جائے وہ کنز (ذخیرہ) میں شمار نہیں ہوتا۔",
    ar: "لَمَّا أُنْزِلَتْ آيَةُ الزَّكَاةِ، جَعَلَ اللَّهُ الزَّكَاةَ طُهْرَةً لِلْمَالِ، فَلَيْسَ فِي مَالٍ زَكَاةٌ يُؤَدَّى مِنْهُ كَنْزٌ.",
    source: "Sahih Al-Bukhari 1404",
  },
  {
    en: "No Sadaqah (Zakat) is due on less than five wasqs of (dates or grains), on less than five camel heads, and on less than five uqiyas of silver.",
    ur: "پانچ وسق سے کم (کھجور یا اناج) پر، پانچ اونٹوں سے کم پر، اور پانچ اوقیہ چاندی سے کم پر کوئی صدقہ (زکوٰۃ) واجب نہیں۔",
    ar: "لَيْسَ فِيمَا دُونَ خَمْسَةِ أَوْسُقٍ صَدَقَةٌ، وَلَيْسَ فِيمَا دُونَ خَمْسِ ذَوْدٍ صَدَقَةٌ، وَلَيْسَ فِيمَا دُونَ خَمْسِ أَوَاقٍ صَدَقَةٌ.",
    source: "Sahih Muslim 979",
  },
  {
    en: "Charity does not decrease wealth, no one forgives another except that Allah increases his honor, and no one humbles himself for the sake of Allah except that Allah raises his status.",
    ur: "صدقہ مال کم نہیں کرتا، اور جو اللہ کی خاطر کسی کو معاف کرے تو اللہ اس کی عزت بڑھاتا ہے، اور جو اللہ کی خاطر عاجزی اختیار کرے تو اللہ اس کا درجہ بلند کرتا ہے۔",
    ar: "مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ، وَمَا زَادَ اللَّهُ عَبْدًا بِعَفْوٍ إِلَّا عِزًّا، وَمَا تَوَاضَعَ أَحَدٌ لِلَّهِ إِلَّا رَفَعَهُ اللَّهُ.",
    source: "Sahih Muslim 2588",
  },
  {
    en: "Save yourself from the Fire, even with half a date in charity; and if you cannot find that, then with a kind word.",
    ur: "جہنم سے بچو، آدھی کھجور کے صدقے سے بھی؛ اور اگر وہ نہ ملے تو اچھے کلمے سے۔",
    ar: "اتَّقُوا النَّارَ وَلَوْ بِشِقِّ تَمْرَةٍ، فَمَنْ لَمْ يَجِدْ فَبِكَلِمَةٍ طَيِّبَةٍ.",
    source: "Sahih Al-Bukhari 1417",
  },
  {
    en: "Every day two angels descend; one of them says, O Allah, give compensation to the one who spends, and the other says, O Allah, give destruction to the one who withholds.",
    ur: "ہر روز دو فرشتے اترتے ہیں؛ ایک کہتا ہے اے اللہ خرچ کرنے والے کو بدلہ دے، اور دوسرا کہتا ہے اے اللہ روک رکھنے والے کو تباہی دے۔",
    ar: "مَا مِنْ يَوْمٍ يُصْبِحُ الْعِبَادُ فِيهِ إِلَّا مَلَكَانِ يَنْزِلَانِ، فَيَقُولُ أَحَدُهُمَا: اللَّهُمَّ أَعْطِ مُنْفِقًا خَلَفًا، وَيَقُولُ الْآخَرُ: اللَّهُمَّ أَعْطِ مُمْسِكًا تَلَفًا.",
    source: "Sahih Al-Bukhari 1442",
  },
  {
    en: "The believer's shade on the Day of Resurrection will be his charity.",
    ur: "قیامت کے دن مومن کا سایہ اس کا صدقہ ہوگا۔",
    ar: "ظِلُّ الْمُؤْمِنِ يَوْمَ الْقِيَامَةِ صَدَقَتُهُ.",
    source: "Al-Tirmidhi",
  },
  {
    en: "Give charity without delay, for it stands in the way of calamity.",
    ur: "صدقہ میں تاخیر نہ کرو کیونکہ وہ مصیبت کو روکتا ہے۔",
    ar: "تَصَدَّقُوا فَإِنَّ الصَّدَقَةَ تَمْنَعُ مِيتَةَ السُّوءِ.",
    source: "Al-Tabarani",
  },
  {
    en: "The best charity is that given in Ramadan.",
    ur: "بہترین صدقہ وہ ہے جو رمضان میں دیا جائے۔",
    ar: "أَفْضَلُ الصَّدَقَةِ صَدَقَةٌ فِي رَمَضَانَ.",
    source: "Al-Tirmidhi",
  },
  {
    en: "Smiling in the face of your brother is charity; and enjoining good and forbidding evil is charity.",
    ur: "اپنے بھائی کے سامنے مسکرانا صدقہ ہے؛ اور نیکی کا حکم دینا اور برائی سے روکنا صدقہ ہے۔",
    ar: "وَتَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ، وَأَمْرُكَ بِالْمَعْرُوفِ وَنَهْيُكَ عَنِ الْمُنْكَرِ صَدَقَةٌ.",
    source: "Al-Tirmidhi",
  },
  {
    en: "Charity extinguishes sin as water extinguishes fire.",
    ur: "صدقہ گناہ کو اس طرح بجھا دیتا ہے جیسے پانی آگ کو بجھا دیتا ہے۔",
    ar: "وَالصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ الْمَاءُ النَّارَ.",
    source: "Sunan Ibn Majah",
  },
  {
    en: "The upper hand is better than the lower hand; the upper hand is that which gives and the lower is that which receives.",
    ur: "اوپر والا ہاتھ نیچے والے ہاتھ سے بہتر ہے؛ اوپر والا دینے والا ہے اور نیچے والا لینے والا۔",
    ar: "الْيَدُ الْعُلْيَا خَيْرٌ مِنَ الْيَدِ السُّفْلَى، وَالْيَدُ الْعُلْيَا هِيَ الْمُنْفِقَةُ وَالْيَدُ السُّفْلَى هِيَ السَّائِلَةُ.",
    source: "Sahih Al-Bukhari 1429",
  },
  {
    en: "None of you truly believes until he loves for his brother what he loves for himself.",
    ur: "تم میں سے کوئی اس وقت تک مومن نہیں ہو سکتا جب تک اپنے بھائی کے لیے وہی پسند نہ کرے جو اپنے لیے پسند کرتا ہے۔",
    ar: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ.",
    source: "Sahih Al-Bukhari 13",
  },
  {
    en: "The believer who eats to his fill while his neighbour goes hungry is not a believer.",
    ur: "وہ مومن نہیں جو خود سیر ہو کر کھائے جبکہ اس کا پڑوسی بھوکا ہو۔",
    ar: "مَا آمَنَ بِي مَنْ بَاتَ شَبْعَانَ وَجَارُهُ جَائِعٌ إِلَى جَنْبِهِ.",
    source: "Musnad Ahmad",
  },
  {
    en: "The best of you are those who are best to their families, and I am the best of you to my family.",
    ur: "تم میں بہتر وہ ہے جو اپنے گھر والوں کے لیے بہتر ہو، اور میں تم میں اپنے گھر والوں کے لیے سب سے بہتر ہوں۔",
    ar: "خَيْرُكُمْ خَيْرُكُمْ لِأَهْلِهِ وَأَنَا خَيْرُكُمْ لِأَهْلِي.",
    source: "Sunan Ibn Majah",
  },
  {
    en: "When a person dies, his deeds come to an end except for three: ongoing charity, knowledge from which benefit is reaped, or a righteous child who prays for him.",
    ur: "جب انسان مر جاتا ہے تو اس کے اعمال ختم ہو جاتے ہیں سوائے تین کے: جاری صدقہ، وہ علم جس سے فائدہ اٹھایا جائے، یا نیک اولاد جو اس کے لیے دعا کرے۔",
    ar: "إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَنْهُ عَمَلُهُ إِلَّا مِنْ ثَلَاثَةٍ: مِنْ صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ.",
    source: "Sahih Muslim 1631",
  },
];

export const INITIAL_HADITH_COUNT = 5;
export const HADITH_INCREMENT = 5;
