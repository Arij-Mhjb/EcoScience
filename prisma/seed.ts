// Script de seed — Données initiales pour EcoScience (v2)
// Admin + Users + Contests + Participations + Zones + Questions + Capsules

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🐢 Début du seeding EcoScience v2...');

  // === Nettoyer les données existantes ===
  await prisma.visualChallenge.deleteMany();
  await prisma.question.deleteMany();
  await prisma.capsule.deleteMany();
  await prisma.participation.deleteMany();
  await prisma.zone.deleteMany();
  await prisma.contest.deleteMany();
  await prisma.user.deleteMany();
  await prisma.admin.deleteMany();
  console.log('🧹 Données existantes supprimées');

  // === Créer l'Admin par défaut ===
  const hashedAdminPwd = await bcrypt.hash('admin1234', 12);
  await prisma.admin.create({
    data: {
      email: 'admin@ecoscience.ma',
      password: hashedAdminPwd,
      name: 'Admin EcoScience',
    },
  });
  console.log('🔐 Admin créé: admin@ecoscience.ma / admin1234');

  // === Créer les utilisateurs test ===
  const hashedPassword = await bcrypt.hash('test1234', 12);

  const student1 = await prisma.user.create({
    data: {
      firstName: 'أحمد',
      lastName: 'بنعلي',
      email: 'student@ecoscience.ma',
      password: hashedPassword,
      plainPassword: 'test1234',
      xp: 0,
      level: 1,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      firstName: 'فاطمة',
      lastName: 'الزهراء',
      email: 'fatima@ecoscience.ma',
      password: hashedPassword,
      plainPassword: 'test1234',
      xp: 50,
      level: 1,
    },
  });

  const student3 = await prisma.user.create({
    data: {
      firstName: 'كريم',
      lastName: 'العلوي',
      email: 'karim@ecoscience.ma',
      password: hashedPassword,
      plainPassword: 'test1234',
      xp: 120,
      level: 2,
    },
  });

  console.log('👤 Élèves créés:', student1.email, student2.email, student3.email);

  // === Concours 1 — Recyclage (ACTIF) ===
  const contest1 = await prisma.contest.create({
    data: {
      title: 'إعادة تدوير المواد',
      description: 'تعلّم كيفية فرز النفايات وإعادة تدوير المواد لحماية البيئة. اكتشف دورة حياة المواد وكيف يمكننا إعادة استخدامها!',
      image: '/images/contest-recycling.svg',
      icon: '♻️',
      order: 1,
      isActive: true,
      isHidden: false,
      durationMin: 120,
    },
  });

  // Capsule d'ouverture — Concours 1
  await prisma.capsule.create({
    data: {
      title: 'مرحباً بك في عالم إعادة التدوير',
      description: 'تعرّف على أهمية إعادة التدوير وكيف تساهم في حماية كوكبنا',
      videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration: 180,
      turtleMsg: 'مرحباً يا صديقي! أنا سلحفاة بيئية وسأرشدك في هذه الرحلة المثيرة!',
      order: 1,
      contestId: contest1.id,
    },
  });

  // Zone 1.1 — Tri des déchets
  const zone1_1 = await prisma.zone.create({
    data: {
      title: 'تصنيف النفايات',
      description: 'تعلّم كيفية فرز النفايات وتصنيفها بشكل صحيح حسب نوعها',
      order: 1,
      icon: '🗑️',
      contestId: contest1.id,
    },
  });

  await prisma.question.createMany({
    data: [
      { text: 'أي من هذه المواد يمكن إعادة تدويرها؟', options: ['قشور الفاكهة', 'الزجاجات البلاستيكية', 'الطعام المتبقي', 'أوراق الشجر'], answer: 1, tip: 'الزجاجات البلاستيكية يمكن إعادة تدويرها وتحويلها إلى منتجات جديدة مثل الملابس!', zoneId: zone1_1.id, order: 1, points: 3 },
      { text: 'ما هو لون حاوية النفايات البلاستيكية عادة؟', options: ['أخضر', 'أحمر', 'أصفر', 'أزرق'], answer: 2, tip: 'في كثير من الدول، الحاوية الصفراء مخصصة للبلاستيك والمعادن!', zoneId: zone1_1.id, order: 2, points: 3 },
      { text: 'أين يجب أن نرمي بقايا الطعام؟', options: ['الحاوية الصفراء', 'الحاوية الزرقاء', 'الحاوية البنية/الخضراء', 'في الشارع'], answer: 2, tip: 'بقايا الطعام توضع في حاوية النفايات العضوية لتحويلها إلى سماد!', zoneId: zone1_1.id, order: 3, points: 3 },
      { text: 'أي نوع من النفايات يشكل أكبر خطر على الحيوانات البحرية؟', options: ['الورق', 'البلاستيك', 'الزجاج', 'المعدن'], answer: 1, tip: 'البلاستيك يشكل خطرا كبيرا على السلاحف البحرية والأسماك!', zoneId: zone1_1.id, order: 4, points: 4 },
    ],
  });

  // Zone 1.2 — Les matériaux
  const zone1_2 = await prisma.zone.create({
    data: {
      title: 'المواد',
      description: 'اكتشف أنواع المواد المختلفة وخصائصها وكيفية إعادة تدويرها',
      order: 2,
      icon: '🧪',
      contestId: contest1.id,
    },
  });

  await prisma.question.createMany({
    data: [
      { text: 'كم سنة تحتاج الزجاجة البلاستيكية لتتحلل في الطبيعة؟', options: ['10 سنوات', '50 سنة', '100 سنة', '450 سنة'], answer: 3, tip: 'الزجاجة البلاستيكية تحتاج حوالي 450 سنة لتتحلل!', zoneId: zone1_2.id, order: 1, points: 4 },
      { text: 'ما هي المادة التي يمكن إعادة تدويرها بلا نهاية دون أن تفقد جودتها؟', options: ['البلاستيك', 'الورق', 'الزجاج', 'الخشب'], answer: 2, tip: 'الزجاج يمكن إعادة تدويره مرات لا نهائية دون أن يفقد نقاءه!', zoneId: zone1_2.id, order: 2, points: 3 },
      { text: 'من أين يأتي الورق؟', options: ['من البلاستيك', 'من الأشجار', 'من الماء', 'من الحجر'], answer: 1, tip: 'الورق يصنع من لب الخشب. إعادة تدوير الورق تساعد في حماية الغابات!', zoneId: zone1_2.id, order: 3, points: 3 },
      { text: 'أي من هذه المواد مصنوع من البترول؟', options: ['الزجاج', 'البلاستيك', 'الألومنيوم', 'الورق'], answer: 1, tip: 'البلاستيك يصنع من البترول، وهو مورد طبيعي محدود!', zoneId: zone1_2.id, order: 4, points: 3 },
    ],
  });

  // Zone 1.3 — Sauver la planète
  const zone1_3 = await prisma.zone.create({
    data: {
      title: 'إنقاذ الكوكب',
      description: 'اكتشف كيف يمكنك المساهمة في حماية كوكبنا من التلوث',
      order: 3,
      icon: '🌍',
      contestId: contest1.id,
    },
  });

  await prisma.question.createMany({
    data: [
      { text: 'ما هو أفضل شيء يمكنك فعله لتقليل النفايات؟', options: ['شراء المزيد', 'إعادة الاستخدام والتدوير', 'رمي كل شيء', 'عدم الاهتمام'], answer: 1, tip: 'القاعدة الذهبية: قلّل، أعد الاستخدام، أعد التدوير!', zoneId: zone1_3.id, order: 1, points: 3 },
      { text: 'كم كيلوغرام من النفايات ينتجها الشخص العادي في اليوم؟', options: ['0.1 كغ', '0.5 كغ', '1 كغ', '2 كغ'], answer: 2, tip: 'ينتج الشخص العادي حوالي 1 كيلوغرام من النفايات يوميا!', zoneId: zone1_3.id, order: 2, points: 3 },
      { text: 'ماذا يحدث للبلاستيك عندما يصل إلى المحيط؟', options: ['يذوب فورا', 'يتحلل سريعا', 'يتحول إلى جزيئات صغيرة خطيرة', 'يختفي'], answer: 2, tip: 'البلاستيك في المحيط يتفتت إلى ميكروبلاستيك خطير تأكله الأسماك!', zoneId: zone1_3.id, order: 3, points: 4 },
      { text: 'كيف يمكنك مساعدة البيئة في المدرسة؟', options: ['استخدام زجاجة ماء قابلة للتعبئة', 'شراء زجاجة بلاستيكية كل يوم', 'عدم فرز النفايات', 'ترك الأضواء مشتعلة'], answer: 0, tip: 'استخدام زجاجة قابلة للتعبئة يمكن أن يوفر أكثر من 150 زجاجة في السنة!', zoneId: zone1_3.id, order: 4, points: 3 },
    ],
  });

  // Défi visuel — Concours 1
  await prisma.visualChallenge.create({
    data: {
      title: 'فرز النفايات الصحيح',
      type: 'drag_drop',
      items: {
        objects: [
          { id: 'bottle', name: 'زجاجة بلاستيكية', emoji: '🍶', correctBin: 'plastic' },
          { id: 'apple', name: 'قشرة تفاحة', emoji: '🍎', correctBin: 'organic' },
          { id: 'paper', name: 'ورقة', emoji: '📄', correctBin: 'paper' },
          { id: 'glass', name: 'زجاجة زجاج', emoji: '🫙', correctBin: 'glass' },
        ],
        bins: [
          { id: 'plastic', name: 'البلاستيك', color: '#f59e0b', emoji: '♻️' },
          { id: 'organic', name: 'العضوي', color: '#10b981', emoji: '🌱' },
          { id: 'paper', name: 'الورق', color: '#3b82f6', emoji: '📦' },
          { id: 'glass', name: 'الزجاج', color: '#8b5cf6', emoji: '🫙' },
        ],
      },
      points: 10,
      order: 1,
      zoneId: zone1_1.id,
    },
  });

  // === Participations test ===
  await prisma.participation.create({
    data: {
      userId: student1.id,
      contestId: contest1.id,
      score: 85,
      timeSpent: 3240,
      errors: 2,
      completedZones: [zone1_1.id, zone1_2.id],
      status: 'in_progress',
      startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.participation.create({
    data: {
      userId: student2.id,
      contestId: contest1.id,
      score: 100,
      timeSpent: 2800,
      errors: 0,
      completedZones: [zone1_1.id, zone1_2.id, zone1_3.id],
      status: 'completed',
      startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
  });

  await prisma.participation.create({
    data: {
      userId: student3.id,
      contestId: contest1.id,
      score: 72,
      timeSpent: 4500,
      errors: 4,
      completedZones: [zone1_1.id],
      status: 'in_progress',
      startedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  });

  console.log('✅ Concours 1 créé (actif) avec 3 zones, 12 questions, 1 défi, 3 participations');

  // === Concours 2 — Compostage (VERROUILLÉ) ===
  await prisma.contest.create({
    data: {
      title: 'التسميد وتدبير النفايات العضوية',
      description: 'اكتشف كيف تتحول النفايات العضوية إلى سماد طبيعي مفيد للنباتات والأرض',
      image: '/images/contest-compost.svg',
      icon: '🌱',
      order: 2,
      isActive: false,
      isHidden: false,
      durationMin: 90,
    },
  });

  // === Concours 3 — Planète (VERROUILLÉ) ===
  await prisma.contest.create({
    data: {
      title: 'إنقاذ الكوكب',
      description: 'مغامرة شاملة لحماية كوكبنا من التلوث والنفايات — قريبا!',
      image: '/images/contest-planet.svg',
      icon: '🌍',
      order: 3,
      isActive: false,
      isHidden: false,
      durationMin: 150,
    },
  });

  console.log('📦 Concours 2 et 3 créés (verrouillés)');
  console.log('');
  console.log('🎉 Seeding v2 terminé avec succès!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 Admin:   admin@ecoscience.ma / admin1234');
  console.log('👤 Élève 1: student@ecoscience.ma / test1234');
  console.log('👤 Élève 2: fatima@ecoscience.ma / test1234');
  console.log('👤 Élève 3: karim@ecoscience.ma / test1234');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
}

main()
  .catch((e) => {
    console.error('❌ Erreur de seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
