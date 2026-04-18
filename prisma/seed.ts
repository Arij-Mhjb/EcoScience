// Script de seed — Données initiales pour EcoScience
// Crée les utilisateurs test, concours, zones et questions
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🐢 Début du seeding EcoScience...');

  // === Nettoyer les données existantes ===
  await prisma.question.deleteMany();
  await prisma.zone.deleteMany();
  await prisma.contest.deleteMany();
  await prisma.user.deleteMany();
  console.log('🧹 Données existantes supprimées');

  // === Créer les utilisateurs test ===
  const hashedPassword = await bcrypt.hash('test1234', 12);

  const student1 = await prisma.user.create({
    data: {
      name: 'أحمد',
      email: 'student@ecoscience.ma',
      password: hashedPassword,
      xp: 0,
      level: 1,
      completedZones: [],
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: 'فاطمة',
      email: 'fatima@ecoscience.ma',
      password: hashedPassword,
      xp: 50,
      level: 1,
      completedZones: [],
    },
  });

  console.log('👤 Utilisateurs créés:', student1.email, student2.email);

  // === Concours 1 — Recyclage des matériaux ===
  const contest1 = await prisma.contest.create({
    data: {
      title: '♻️ إعادة تدوير المواد',
      description: 'تعلّم كيفية فرز النفايات وإعادة تدوير المواد لحماية البيئة. اكتشف دورة حياة المواد وكيف يمكننا إعادة استخدامها!',
      image: '/images/contest-recycling.svg',
      order: 1,
    },
  });

  // Zone 1.1 — Tri des déchets
  const zone1_1 = await prisma.zone.create({
    data: {
      title: '🏝️ تصنيف النفايات',
      description: 'تعلّم كيفية فرز النفايات وتصنيفها بشكل صحيح حسب نوعها',
      order: 1,
      contestId: contest1.id,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        text: 'أي من هذه المواد يمكن إعادة تدويرها؟',
        options: ['قشور الفاكهة', 'الزجاجات البلاستيكية', 'الطعام المتبقي', 'أوراق الشجر'],
        answer: 1,
        tip: 'الزجاجات البلاستيكية يمكن إعادة تدويرها وتحويلها إلى منتجات جديدة مثل الملابس!',
        zoneId: zone1_1.id,
      },
      {
        text: 'ما هو لون حاوية النفايات البلاستيكية عادة؟',
        options: ['أخضر', 'أحمر', 'أصفر', 'أزرق'],
        answer: 2,
        tip: 'في كثير من الدول، الحاوية الصفراء مخصصة للبلاستيك والمعادن!',
        zoneId: zone1_1.id,
      },
      {
        text: 'أين يجب أن نرمي بقايا الطعام؟',
        options: ['الحاوية الصفراء', 'الحاوية الزرقاء', 'الحاوية البنية/الخضراء', 'في الشارع'],
        answer: 2,
        tip: 'بقايا الطعام توضع في حاوية النفايات العضوية (البنية أو الخضراء) لتحويلها إلى سماد!',
        zoneId: zone1_1.id,
      },
      {
        text: 'أي نوع من النفايات يشكل أكبر خطر على الحيوانات البحرية؟',
        options: ['الورق', 'البلاستيك', 'الزجاج', 'المعدن'],
        answer: 1,
        tip: 'البلاستيك يشكل خطرا كبيرا على السلاحف البحرية والأسماك التي قد تبتلعه!',
        zoneId: zone1_1.id,
      },
    ],
  });

  // Zone 1.2 — Les matériaux
  const zone1_2 = await prisma.zone.create({
    data: {
      title: '🧪 المواد',
      description: 'اكتشف أنواع المواد المختلفة وخصائصها وكيفية إعادة تدويرها',
      order: 2,
      contestId: contest1.id,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        text: 'كم سنة تحتاج الزجاجة البلاستيكية لتتحلل في الطبيعة؟',
        options: ['10 سنوات', '50 سنة', '100 سنة', '450 سنة'],
        answer: 3,
        tip: 'الزجاجة البلاستيكية تحتاج حوالي 450 سنة لتتحلل! لذلك إعادة التدوير مهمة جدا.',
        zoneId: zone1_2.id,
      },
      {
        text: 'ما هي المادة التي يمكن إعادة تدويرها بلا نهاية دون أن تفقد جودتها؟',
        options: ['البلاستيك', 'الورق', 'الزجاج', 'الخشب'],
        answer: 2,
        tip: 'الزجاج يمكن إعادة تدويره مرات لا نهائية دون أن يفقد نقاءه أو جودته!',
        zoneId: zone1_2.id,
      },
      {
        text: 'من أين يأتي الورق؟',
        options: ['من البلاستيك', 'من الأشجار', 'من الماء', 'من الحجر'],
        answer: 1,
        tip: 'الورق يصنع من لب الخشب. إعادة تدوير الورق تساعد في حماية الغابات!',
        zoneId: zone1_2.id,
      },
      {
        text: 'أي من هذه المواد مصنوع من البترول؟',
        options: ['الزجاج', 'البلاستيك', 'الألومنيوم', 'الورق'],
        answer: 1,
        tip: 'البلاستيك يصنع من البترول، وهو مورد طبيعي محدود. لذلك يجب تقليل استخدامه!',
        zoneId: zone1_2.id,
      },
    ],
  });

  // Zone 1.3 — Sauver la planète
  const zone1_3 = await prisma.zone.create({
    data: {
      title: '🌍 إنقاذ الكوكب',
      description: 'اكتشف كيف يمكنك المساهمة في حماية كوكبنا من التلوث',
      order: 3,
      contestId: contest1.id,
    },
  });

  await prisma.question.createMany({
    data: [
      {
        text: 'ما هو أفضل شيء يمكنك فعله لتقليل النفايات؟',
        options: ['شراء المزيد', 'إعادة الاستخدام والتدوير', 'رمي كل شيء', 'عدم الاهتمام'],
        answer: 1,
        tip: 'القاعدة الذهبية هي: قلّل، أعد الاستخدام، أعد التدوير! (Reduce, Reuse, Recycle)',
        zoneId: zone1_3.id,
      },
      {
        text: 'كم كيلوغرام من النفايات ينتجها الشخص العادي في اليوم تقريبا؟',
        options: ['0.1 كغ', '0.5 كغ', '1 كغ', '2 كغ'],
        answer: 2,
        tip: 'ينتج الشخص العادي حوالي 1 كيلوغرام من النفايات يوميا! تخيّل كم ينتج العالم كله!',
        zoneId: zone1_3.id,
      },
      {
        text: 'ماذا يحدث للبلاستيك عندما يصل إلى المحيط؟',
        options: ['يذوب فورا', 'يتحلل سريعا', 'يتحول إلى جزيئات صغيرة خطيرة', 'يختفي'],
        answer: 2,
        tip: 'البلاستيك في المحيط يتفتت إلى ميكروبلاستيك خطير تأكله الأسماك والسلاحف البحرية!',
        zoneId: zone1_3.id,
      },
      {
        text: 'كيف يمكنك مساعدة البيئة في المدرسة؟',
        options: ['استخدام زجاجة ماء قابلة للتعبئة', 'شراء زجاجة بلاستيكية كل يوم', 'عدم فرز النفايات', 'ترك الأضواء مشتعلة'],
        answer: 0,
        tip: 'استخدام زجاجة قابلة للتعبئة يمكن أن يوفر أكثر من 150 زجاجة بلاستيكية في السنة!',
        zoneId: zone1_3.id,
      },
    ],
  });

  console.log('✅ Concours 1 créé avec 3 zones et 12 questions');

  // === Concours 2 — Compostage (structure seulement) ===
  const contest2 = await prisma.contest.create({
    data: {
      title: '🌱 التسميد وتدبير النفايات العضوية',
      description: 'اكتشف كيف تتحول النفايات العضوية إلى سماد طبيعي مفيد للنباتات والأرض',
      image: '/images/contest-compost.svg',
      order: 2,
    },
  });

  // === Concours 3 — À définir ===
  const contest3 = await prisma.contest.create({
    data: {
      title: '🌍 إنقاذ الكوكب',
      description: 'مغامرة شاملة لحماية كوكبنا من التلوث والنفايات — قريبا!',
      image: '/images/contest-planet.svg',
      order: 3,
    },
  });

  console.log('📦 Concours 2 et 3 créés (structure seulement)');
  console.log('');
  console.log('🎉 Seeding terminé avec succès!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📧 Compte test: student@ecoscience.ma');
  console.log('🔑 Mot de passe: test1234');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Erreur de seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
