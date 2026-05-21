import { lazy } from 'react';

// Lazy load — har bir shablon faqat kerak bo'lganda yuklanadi
const WeddingClassic = lazy(() => import('./WeddingClassic'));
const WeddingModern = lazy(() => import('./WeddingModern'));
const WeddingDark = lazy(() => import('./WeddingDark'));
const WeddingGulzor = lazy(() => import('./WeddingGulzor'));
const BirthdayParty = lazy(() => import('./BirthdayParty'));
const BirthdayKids = lazy(() => import('./BirthdayKids'));
const LoveRomantic = lazy(() => import('./LoveRomantic'));
const EventPro = lazy(() => import('./EventPro'));

// Template ID → Component mapping
// decoration field yoki template_id dan foydalaniladi
const registry = {
  // To'y
  'w1': WeddingClassic,   // Oq-oltin klassik
  'w2': WeddingModern,    // Binafsha zamonaviy
  'w3': WeddingDark,      // Oq qush ko'li
  'w4': WeddingGulzor,    // Sehrli qasr
  // Tug'ilgan kun
  'b1': BirthdayParty,    // Bayram confetti
  'b2': BirthdayKids,     // Bolalar cute
  // Dil izhori
  'l1': LoveRomantic,     // Romantik cinematic
  'l2': LoveRomantic,     // Xuddi shu component, boshqa ranglar DB'dan
  // Tadbir
  'e1': EventPro,         // Professional
  'e2': EventPro,         // Xuddi shu, boshqa ranglar
};

// Category fallback — agar template_id topilmasa
const categoryFallback = {
  wedding: WeddingClassic,
  birthday: BirthdayParty,
  love: LoveRomantic,
  event: EventPro,
};

/**
 * Shablon komponentini topish
 * @param {string} templateId — DB'dagi template.id (w1, w2, b1...)
 * @param {string} category — wedding, birthday, love, event
 * @returns {React.LazyComponent}
 */
export function getTemplateComponent(templateId, category) {
  return registry[templateId] || categoryFallback[category] || null;
}

export default registry;
