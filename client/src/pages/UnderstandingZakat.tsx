import { Layout } from "@/components/Layout";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEO } from "@/components/SEO";

export default function UnderstandingZakat() {
  return (
    <Layout>
      <SEO
        title="Understanding Zakat – Rules, Nisab & Guide"
        description="A comprehensive guide to Zakat: rules, thresholds (Nisab), rates, and spiritual significance. Learn how to calculate and pay Zakat correctly."
        path="/understanding-zakat"
      />
      <div className="bg-secondary text-white py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <BookOpen className="w-12 h-12 text-primary mx-auto mb-6" />
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">Understanding Zakat</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
            A comprehensive guide to the rules, thresholds, and spiritual significance of the third pillar of Islam.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg prose-headings:font-display prose-headings:text-secondary max-w-none">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-8 md:p-10 shadow-gold border border-border mb-10"
          >
            <h2 className="flex items-center gap-3 text-3xl font-bold border-b border-border pb-4">
              <Info className="text-primary w-8 h-8" /> What is Zakat?
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Zakat is an obligatory charitable contribution and the third pillar of Islam. It is considered a right that the poor have over the wealth of the rich. The word itself means "to purify," "to grow," and "to bless." By paying Zakat, a Muslim purifies their remaining wealth and soul.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              It is mandatory for any adult Muslim of sound mind who possesses wealth above a specific threshold (Nisab) for a full Islamic lunar year (Hawl).
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-amber-50 rounded-2xl p-8 border border-amber-200"
            >
              <h3 className="text-xl font-bold text-amber-900 mb-4 flex items-center gap-2">
                <CheckCircle2 className="text-amber-600" /> The Nisab Threshold
              </h3>
              <p className="text-sm text-amber-800 mb-4 leading-relaxed">
                Nisab is the minimum amount of wealth a Muslim must own before they are liable to pay Zakat. The historical Nisab thresholds are:
              </p>
              <ul className="space-y-2 text-sm text-amber-900 font-semibold">
                <li className="flex justify-between border-b border-amber-200 pb-2">
                  <span>Gold Nisab:</span>
                  <span>87.48 grams (7.5 Tolas)</span>
                </li>
                <li className="flex justify-between pb-2">
                  <span>Silver Nisab:</span>
                  <span>612.36 grams (52.5 Tolas)</span>
                </li>
              </ul>
              <div className="mt-4 p-3 bg-white/60 rounded-lg text-xs text-amber-900">
                Most modern scholars advise using the Silver Nisab for calculating cash and other assets to maximize benefit to the poor.
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-50 rounded-2xl p-8 border border-slate-200"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <AlertCircle className="text-slate-500" /> Zakatable Assets
              </h3>
              <p className="text-sm text-slate-600 mb-4">Zakat is payable on assets that have the potential to grow. These include:</p>
              <ul className="list-disc pl-5 space-y-2 text-sm text-slate-700">
                <li>Gold, silver, and precious metals</li>
                <li>Cash in hand and bank accounts</li>
                <li>Business merchandise / stock</li>
                <li>Shares, stocks, and bonds</li>
                <li>Agricultural produce and livestock</li>
              </ul>
              <p className="text-xs text-slate-500 mt-4 italic">
                * Personal items like your primary home, car, and clothing are exempt from Zakat.
              </p>
            </motion.div>
          </div>

        </div>

        {/* Hadith Section */}
        <div className="mt-24 bg-secondary text-white rounded-2xl p-8 md:p-12 relative overflow-hidden">
          <div className="absolute inset-0 islamic-pattern opacity-10 mix-blend-overlay" />
          <div className="relative z-10">
            <h2 className="font-display text-3xl font-bold mb-10 text-primary text-center">Words of the Prophet ﷺ</h2>
            
            <Tabs defaultValue="english" className="w-full">
              <TabsList className="bg-white/10 border border-white/20 p-1 mb-8 inline-flex w-full justify-center">
                <TabsTrigger value="english" className="text-white/90 data-[state=active]:bg-primary data-[state=active]:text-white">English</TabsTrigger>
                <TabsTrigger value="urdu" className="text-white/90 data-[state=active]:bg-primary data-[state=active]:text-white font-arabic">اردو</TabsTrigger>
                <TabsTrigger value="arabic" className="text-white/90 data-[state=active]:bg-primary data-[state=active]:text-white font-arabic">العربية</TabsTrigger>
              </TabsList>
              
              <div className="space-y-10">
                <TabsContent value="english" className="m-0 space-y-10">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl relative">
                    <div className="absolute top-4 left-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <div className="absolute bottom-4 right-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <p className="text-lg md:text-xl font-display italic leading-relaxed font-light pr-8">
                      "Whoever is made wealthy by Allah and does not pay the Zakat of his wealth, then on the Day of Resurrection his wealth will be made like a bald-headed poisonous male snake with two black spots over the eyes."
                    </p>
                    <p className="mt-4 text-sm text-primary font-semibold tracking-widest uppercase">Sahih Al-Bukhari 1403</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl relative">
                    <div className="absolute top-4 left-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <div className="absolute bottom-4 right-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <p className="text-lg md:text-xl font-display italic leading-relaxed font-light pr-8">
                      When the Prophet (ﷺ) sent Mu'adh to Yemen, he said: "Invite them to testify that none has the right to be worshipped but Allah and I am Allah's Messenger; and if they obey you in that, then tell them that Allah has enjoined on them five prayers; and if they obey you in that, then tell them that Allah has made Zakat obligatory for them—to be taken from the rich among them and given to the poor among them."
                    </p>
                    <p className="mt-4 text-sm text-primary font-semibold tracking-widest uppercase">Sahih Al-Bukhari 1395</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl relative">
                    <div className="absolute top-4 left-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <div className="absolute bottom-4 right-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <p className="text-lg md:text-xl font-display italic leading-relaxed font-light pr-8">
                      When the verses of Zakat were revealed, Allah made Zakat a purifier of property. So property from which Zakat is paid is not considered hoarded wealth (Al-Kanz).
                    </p>
                    <p className="mt-4 text-sm text-primary font-semibold tracking-widest uppercase">Sahih Al-Bukhari 1404</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl relative">
                    <div className="absolute top-4 left-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <div className="absolute bottom-4 right-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <p className="text-lg md:text-xl font-display italic leading-relaxed font-light pr-8">
                      No Sadaqah (Zakat) is due on less than five wasqs of (dates or grains), on less than five camel heads, and on less than five uqiyas of silver.
                    </p>
                    <p className="mt-4 text-sm text-primary font-semibold tracking-widest uppercase">Sahih Muslim 979</p>
                  </div>
                </TabsContent>
                <TabsContent value="urdu" className="m-0 space-y-10">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl relative">
                    <div className="absolute top-4 left-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <div className="absolute bottom-4 right-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <p className="text-xl md:text-2xl font-arabic leading-relaxed pr-8">"جسے اللہ نے مال دیا اور اس نے اس کی زکوٰۃ ادا نہیں کی تو قیامت کے دن اس کا مال ایک گنجے زہریلے سانپ کی شکل میں کر دیا جائے گا جس کی آنکھوں پر دو سیاہ نقطے ہوں گے۔"</p>
                    <p className="mt-4 text-sm text-primary font-semibold tracking-widest uppercase">صحیح البخاری 1403</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl relative">
                    <div className="absolute top-4 left-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <div className="absolute bottom-4 right-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <p className="text-xl md:text-2xl font-arabic leading-relaxed pr-8">جب نبی کریم ﷺ نے حضرت معاذ کو یمن بھیجا تو فرمایا: انہیں دعوت دو کہ اللہ کے سوا کوئی معبود نہیں اور میں اللہ کا رسول ہوں؛ اگر وہ اس پر عمل کریں تو انہیں بتاؤ کہ اللہ نے ان پر پانچ نمازیں فرض کی ہیں؛ اور اگر وہ اس پر عمل کریں تو انہیں بتاؤ کہ اللہ نے ان پر زکوٰۃ فرض کی ہے—ان کے مالداروں سے لی جائے اور ان کے غریبوں میں دی جائے۔</p>
                    <p className="mt-4 text-sm text-primary font-semibold tracking-widest uppercase">صحیح البخاری 1395</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl relative">
                    <div className="absolute top-4 left-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <div className="absolute bottom-4 right-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <p className="text-xl md:text-2xl font-arabic leading-relaxed pr-8">جب زکوٰۃ کی آیات نازل ہوئیں تو اللہ نے زکوٰۃ کو مال کی طہارت قرار دیا۔ پس جس مال سے زکوٰۃ ادا کی جائے وہ کنز (ذخیرہ) میں شمار نہیں ہوتا۔</p>
                    <p className="mt-4 text-sm text-primary font-semibold tracking-widest uppercase">صحیح البخاری 1404</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl relative">
                    <div className="absolute top-4 left-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <div className="absolute bottom-4 right-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <p className="text-xl md:text-2xl font-arabic leading-relaxed pr-8">پانچ وسق سے کم (کھجور یا اناج) پر، پانچ اونٹوں سے کم پر، اور پانچ اوقیہ چاندی سے کم پر کوئی صدقہ (زکوٰۃ) واجب نہیں۔</p>
                    <p className="mt-4 text-sm text-primary font-semibold tracking-widest uppercase">صحیح مسلم 979</p>
                  </div>
                </TabsContent>
                <TabsContent value="arabic" className="m-0 space-y-10">
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl relative">
                    <div className="absolute top-4 left-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <div className="absolute bottom-4 right-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <p className="text-2xl md:text-3xl font-arabic leading-relaxed tracking-wide pr-8">"مَنْ آتَاهُ اللَّهُ مَالًا فَلَمْ يُؤَدِّ زَكَاتَهُ، مُثِّلَ لَهُ مَالُهُ يَوْمَ الْقِيَامَةِ شُجَاعًا أَقْرَعَ لَهُ زَبِيبَتَانِ..."</p>
                    <p className="mt-4 text-sm text-primary font-semibold tracking-widest uppercase">صحيح البخاري 1403</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl relative">
                    <div className="absolute top-4 left-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <div className="absolute bottom-4 right-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <p className="text-2xl md:text-3xl font-arabic leading-relaxed tracking-wide pr-8">"إِنَّكَ تَقْدَمُ عَلَى قَوْمٍ أَهْلِ كِتَابٍ، فَلْيَكُنْ أَوَّلَ مَا تَدْعُوهُمْ إِلَيْهِ عِبَادَةُ اللَّهِ، فَإِذَا عَرَفُوا اللَّهَ فَأَخْبِرْهُمْ أَنَّ اللَّهَ فَرَضَ عَلَيْهِمْ خَمْسَ صَلَوَاتٍ... وَأَخْبِرْهُمْ أَنَّ اللَّهَ افْتَرَضَ عَلَيْهِمْ زَكَاةً فِي أَمْوَالِهِمْ تُؤْخَذُ مِنْ أَغْنِيَائِهِمْ وَتُرَدُّ عَلَى فُقَرَائِهِمْ."</p>
                    <p className="mt-4 text-sm text-primary font-semibold tracking-widest uppercase">صحيح البخاري 1395</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl relative">
                    <div className="absolute top-4 left-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <div className="absolute bottom-4 right-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <p className="text-2xl md:text-3xl font-arabic leading-relaxed tracking-wide pr-8">"لَمَّا أُنْزِلَتْ آيَةُ الزَّكَاةِ، جَعَلَ اللَّهُ الزَّكَاةَ طُهْرَةً لِلْمَالِ، فَلَيْسَ فِي مَالٍ زَكَاةٌ يُؤَدَّى مِنْهُ كَنْزٌ."</p>
                    <p className="mt-4 text-sm text-primary font-semibold tracking-widest uppercase">صحيح البخاري 1404</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-2xl relative">
                    <div className="absolute top-4 left-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <div className="absolute bottom-4 right-4 text-primary opacity-30 text-5xl font-display leading-none">"</div>
                    <p className="text-2xl md:text-3xl font-arabic leading-relaxed tracking-wide pr-8">"لَيْسَ فِيمَا دُونَ خَمْسَةِ أَوْسُقٍ صَدَقَةٌ، وَلَيْسَ فِيمَا دُونَ خَمْسِ ذَوْدٍ صَدَقَةٌ، وَلَيْسَ فِيمَا دُونَ خَمْسِ أَوَاقٍ صَدَقَةٌ."</p>
                    <p className="mt-4 text-sm text-primary font-semibold tracking-widest uppercase">صحيح مسلم 979</p>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}
