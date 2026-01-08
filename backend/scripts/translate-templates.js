const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 快捷模板翻译数据
const quickTemplateTranslations = {
  'quick_language_learning': {
    en: {
      title: 'Daily English Vocabulary Learning',
      description: 'Learn 20 English words daily through flashcards to improve vocabulary. Suitable for beginners to build English foundation progressively.',
      instructions: 'Submit daily learning screenshots including study content and duration records'
    },
    es: {
      title: 'Aprendizaje Diario de Vocabulario en Inglés',
      description: 'Aprende 20 palabras en inglés diariamente a través de tarjetas de vocabulario para mejorar el vocabulario. Adecuado para principiantes para construir una base de inglés progresivamente.',
      instructions: 'Envíe capturas de pantalla de aprendizaje diarias que incluyan contenido de estudio y registros de duración'
    },
    ja: {
      title: '毎日の英単語学習',
      description: 'フラッシュカードを通じて毎日20の英単語を学び、語彙力を向上させます。初心者が段階的に英語の基礎を築くのに適しています。',
      instructions: '学習内容と時間記録を含む毎日の学習スクリーンショットを提出してください'
    }
  },
  'quick_daily_reading': {
    en: {
      title: '30-Minute Daily Reading Habit',
      description: 'Read for 30 minutes daily through novels and essays in a quiet environment to cultivate good reading habits and expand knowledge.',
      instructions: 'Read attentively in a quiet environment and take reading notes. Submit reading photos, progress records, or reading reflections to share reading experiences and thoughts.'
    },
    es: {
      title: 'Hábito de Lectura Diaria de 30 Minutos',
      description: 'Lea durante 30 minutos diarios a través de novelas y ensayos en un ambiente tranquilo para cultivar buenos hábitos de lectura y expandir el conocimiento.',
      instructions: 'Lea atentamente en un ambiente tranquilo y tome notas de lectura. Envíe fotos de lectura, registros de progreso o reflexiones de lectura para compartir experiencias y pensamientos de lectura.'
    },
    ja: {
      title: '毎日30分の読書習慣',
      description: '静かな環境で小説やエッセイを通じて毎日30分読書し、良い読書習慣を養い、知識を広げます。',
      instructions: '静かな環境で集中して読書し、読書ノートを取ってください。読書の写真、進捗記録、または読書感想を提出して、読書体験と思考を共有してください。'
    }
  },
  'quick_skill_practice': {
    en: {
      title: 'Daily Programming Practice',
      description: 'Programming practice plan designed for beginners, focusing on skill improvement through systematic practice and learning.',
      instructions: 'Practice programming daily through algorithm problems, project development, or new technology learning. Submit code screenshots, project progress, or learning notes to record technical growth.'
    },
    es: {
      title: 'Práctica Diaria de Programación',
      description: 'Plan de práctica de programación diseñado para principiantes, enfocándose en la mejora de habilidades a través de práctica y aprendizaje sistemáticos.',
      instructions: 'Practique programación diariamente a través de problemas de algoritmos, desarrollo de proyectos o aprendizaje de nuevas tecnologías. Envíe capturas de pantalla de código, progreso del proyecto o notas de aprendizaje para registrar el crecimiento técnico.'
    },
    ja: {
      title: '毎日のプログラミング練習',
      description: '初心者向けに設計されたプログラミング練習計画で、体系的な練習と学習を通じてスキル向上に焦点を当てています。',
      instructions: 'アルゴリズム問題、プロジェクト開発、または新技術学習を通じて毎日プログラミングを練習してください。コードのスクリーンショット、プロジェクトの進捗、または学習ノートを提出して、技術的成長を記録してください。'
    }
  },
  'quick_gym_workout': {
    en: {
      title: 'Gym Muscle Building Training',
      description: 'Beginner-level strength training focusing on chest and back muscles, 60 minutes per session, aiming for muscle building and strength improvement.',
      instructions: 'Submit training photos and equipment usage records after each session, including training content, weights used, and training feelings'
    },
    es: {
      title: 'Entrenamiento de Construcción Muscular en Gimnasio',
      description: 'Entrenamiento de fuerza de nivel principiante enfocado en músculos del pecho y espalda, 60 minutos por sesión, con el objetivo de construcción muscular y mejora de fuerza.',
      instructions: 'Envíe fotos de entrenamiento y registros de uso de equipos después de cada sesión, incluyendo contenido de entrenamiento, pesos utilizados y sensaciones de entrenamiento'
    },
    ja: {
      title: 'ジムでの筋肉増強トレーニング',
      description: '初心者レベルの筋力トレーニングで、胸筋と背筋に焦点を当て、1回60分、筋肉増強と筋力向上を目指します。',
      instructions: '各セッション後にトレーニング写真と器具使用記録を提出してください。トレーニング内容、使用重量、トレーニング感想を含めてください'
    }
  },
  'quick_running_challenge': {
    en: {
      title: 'Daily 3km Running',
      description: 'Intermediate-level aerobic running, 3km per session at 6 minutes per km pace, aiming for weight loss and endurance improvement.',
      instructions: 'Adjust running intensity based on personal ability and maintain regular training. Submit running record screenshots including basic distance and time information, record body feelings and progress.'
    },
    es: {
      title: 'Carrera Diaria de 3km',
      description: 'Carrera aeróbica de nivel intermedio, 3km por sesión a un ritmo de 6 minutos por km, con el objetivo de pérdida de peso y mejora de resistencia.',
      instructions: 'Ajuste la intensidad de carrera según la capacidad personal y mantenga un entrenamiento regular. Envíe capturas de pantalla de registros de carrera que incluyan información básica de distancia y tiempo, registre sensaciones corporales y progreso.'
    },
    ja: {
      title: '毎日3kmランニング',
      description: '中級レベルの有酸素ランニング、1回3km、1kmあたり6分のペースで、減量と持久力向上を目指します。',
      instructions: '個人の能力に基づいてランニング強度を調整し、定期的なトレーニングを維持してください。基本的な距離と時間情報を含むランニング記録のスクリーンショットを提出し、体の感覚と進歩を記録してください。'
    }
  },
  'quick_yoga_practice': {
    en: {
      title: 'Morning Yoga Practice',
      description: 'Beginner-level Hatha yoga, 30 minutes per session in the morning, aiming for body flexibility and inner peace.',
      instructions: 'Warm up before practice, coordinate breathing with movements, and avoid forcing difficult poses. Submit practice photos or videos showing yoga poses, record practice feelings and body changes.'
    },
    es: {
      title: 'Práctica de Yoga Matutino',
      description: 'Yoga Hatha de nivel principiante, 30 minutos por sesión por la mañana, con el objetivo de flexibilidad corporal y paz interior.',
      instructions: 'Caliente antes de la práctica, coordine la respiración con los movimientos y evite forzar posturas difíciles. Envíe fotos o videos de práctica mostrando posturas de yoga, registre sensaciones de práctica y cambios corporales.'
    },
    ja: {
      title: '朝のヨガ練習',
      description: '初心者レベルのハタヨガ、朝に1回30分、体の柔軟性と内なる平和を目指します。',
      instructions: '練習前にウォームアップし、呼吸と動きを調和させ、難しいポーズを無理にしないでください。ヨガのポーズを示す練習写真またはビデオを提出し、練習の感覚と体の変化を記録してください。'
    }
  },
  'quick_early_wake_up': {
    en: {
      title: '6 AM Early Wake-up Health Challenge',
      description: 'Adjust wake-up time from 7:00 to 6:00 AM by going to bed earlier to ensure sufficient sleep. Achieve morning exercise goals through early rising and develop healthy sleep habits.',
      instructions: 'Submit daily wake-up time proof and morning activity photos, record early rising gains and feelings. Keep recording sleep quality and mental state changes, share positive impacts of early rising life.'
    },
    es: {
      title: 'Desafío de Salud de Despertar Temprano a las 6 AM',
      description: 'Ajuste la hora de despertar de 7:00 a 6:00 AM acostándose más temprano para asegurar un sueño suficiente. Logre objetivos de ejercicio matutino a través del despertar temprano y desarrolle hábitos de sueño saludables.',
      instructions: 'Envíe prueba diaria de hora de despertar y fotos de actividades matutinas, registre ganancias y sensaciones del despertar temprano. Mantenga el registro de cambios en la calidad del sueño y el estado mental, comparta impactos positivos de la vida de despertar temprano.'
    },
    ja: {
      title: '午前6時早起き健康チャレンジ',
      description: '早く寝ることで起床時間を7:00から6:00に調整し、十分な睡眠を確保します。早起きを通じて朝の運動目標を達成し、健康的な睡眠習慣を養います。',
      instructions: '毎日の起床時間の証明と朝の活動写真を提出し、早起きの収穫と感想を記録してください。睡眠の質と精神状態の変化を記録し続け、早起き生活の積極的な影響を共有してください。'
    }
  },
  'quick_water_intake': {
    en: {
      title: 'Daily 2L Healthy Water Intake Challenge',
      description: 'Increase daily water intake from current 1.5-2L to 2L through mobile app reminders to achieve health goals. Scientific water intake, develop good drinking habits.',
      instructions: 'Record daily water intake and time, can use water tracking app or photo records. Submit daily total water intake screenshots and body feeling records.'
    },
    es: {
      title: 'Desafío de Ingesta Saludable de Agua Diaria de 2L',
      description: 'Aumente la ingesta diaria de agua de 1.5-2L actual a 2L a través de recordatorios de aplicaciones móviles para lograr objetivos de salud. Ingesta científica de agua, desarrolle buenos hábitos de bebida.',
      instructions: 'Registre la ingesta diaria de agua y el tiempo, puede usar una aplicación de seguimiento de agua o registros fotográficos. Envíe capturas de pantalla de la ingesta total diaria de agua y registros de sensaciones corporales.'
    },
    ja: {
      title: '毎日2L健康的な水分摂取チャレンジ',
      description: 'モバイルアプリのリマインダーを通じて、現在の1.5-2Lから毎日2Lの水分摂取量に増やし、健康目標を達成します。科学的な水分摂取、良い飲水習慣を養います。',
      instructions: '毎日の水分摂取量と時間を記録し、水分追跡アプリまたは写真記録を使用できます。毎日の総水分摂取量のスクリーンショットと体の感覚記録を提出してください。'
    }
  },
  'quick_meditation': {
    en: {
      title: 'Daily 10-Minute Mindfulness Meditation',
      description: 'Practice 10 minutes of mindfulness meditation daily in a quiet environment through guided audio to achieve stress relief and focus improvement.',
      instructions: 'Practice meditation in a quiet environment, can use meditation apps or audio guidance. Submit meditation duration records and practice feelings, share inner peace experiences.'
    },
    es: {
      title: 'Meditación Consciente Diaria de 10 Minutos',
      description: 'Practique 10 minutos de meditación consciente diariamente en un ambiente tranquilo a través de audio guiado para lograr alivio del estrés y mejora del enfoque.',
      instructions: 'Practique meditación en un ambiente tranquilo, puede usar aplicaciones de meditación o guía de audio. Envíe registros de duración de meditación y sensaciones de práctica, comparta experiencias de paz interior.'
    },
    ja: {
      title: '毎日10分のマインドフルネス瞑想',
      description: '静かな環境でガイド付きオーディオを通じて毎日10分のマインドフルネス瞑想を練習し、ストレス軽減と集中力向上を達成します。',
      instructions: '静かな環境で瞑想を練習し、瞑想アプリまたはオーディオガイダンスを使用できます。瞑想時間の記録と練習の感想を提出し、内なる平和の体験を共有してください。'
    }
  },
  'quick_productivity_boost': {
    en: {
      title: 'Pomodoro Technique Productivity Boost',
      description: 'Use Pomodoro Technique for time management, arrange 4 time blocks daily, aiming to improve focus and work efficiency through systematic time management.',
      instructions: 'Work using Pomodoro Technique, 25 minutes per pomodoro with 5-minute breaks. Submit work duration records and completed task screenshots, record focus and efficiency improvements.'
    },
    es: {
      title: 'Impulso de Productividad con Técnica Pomodoro',
      description: 'Use la Técnica Pomodoro para la gestión del tiempo, organice 4 bloques de tiempo diariamente, con el objetivo de mejorar el enfoque y la eficiencia laboral a través de la gestión sistemática del tiempo.',
      instructions: 'Trabaje usando la Técnica Pomodoro, 25 minutos por pomodoro con descansos de 5 minutos. Envíe registros de duración del trabajo y capturas de pantalla de tareas completadas, registre mejoras en el enfoque y la eficiencia.'
    },
    ja: {
      title: 'ポモドーロテクニックによる生産性向上',
      description: 'ポモドーロテクニックを使用して時間管理を行い、毎日4つの時間ブロックを配置し、体系的な時間管理を通じて集中力と作業効率の向上を目指します。',
      instructions: 'ポモドーロテクニックを使用して作業し、1ポモドーロ25分、5分の休憩を取ります。作業時間の記録と完了したタスクのスクリーンショットを提出し、集中力と効率の向上を記録してください。'
    }
  },
  'quick_creativity': {
    en: {
      title: 'Daily Drawing Creative Practice',
      description: 'Practice drawing daily for 30 minutes, aiming for creative expression and skill improvement through continuous creative practice to cultivate artistic perception and creativity.',
      instructions: 'Practice drawing daily, can be sketching, watercolor, or digital painting. Submit creative work photos and creation process records, share creative inspiration and technique insights.'
    },
    es: {
      title: 'Práctica Creativa de Dibujo Diario',
      description: 'Practique dibujo diariamente durante 30 minutos, con el objetivo de expresión creativa y mejora de habilidades a través de práctica creativa continua para cultivar la percepción artística y la creatividad.',
      instructions: 'Practique dibujo diariamente, puede ser bocetos, acuarela o pintura digital. Envíe fotos de trabajos creativos y registros del proceso de creación, comparta inspiración creativa y conocimientos de técnicas.'
    },
    ja: {
      title: '毎日の絵画創作練習',
      description: '毎日30分間絵画創作を練習し、継続的な創作練習を通じて創造的表現とスキル向上を目指し、芸術的知覚と創造性を養います。',
      instructions: '毎日絵画創作を練習し、スケッチ、水彩、またはデジタルペインティングができます。創作作品の写真と創作プロセスの記録を提出し、創作のインスピレーションと技法の洞察を共有してください。'
    }
  },
  'quick_gratitude': {
    en: {
      title: 'Gratitude Journal Recording',
      description: 'Record 3 things to be grateful for every evening, covering relationships, personal growth, life experiences, etc., through written records to cultivate positive mindset and gratitude awareness.',
      instructions: 'Spend 5-10 minutes every evening recording gratitude journal, write down things worth being grateful for that day. Submit journal photos or text records, share gratitude insights and positive experiences.'
    },
    es: {
      title: 'Registro de Diario de Gratitud',
      description: 'Registre 3 cosas por las que estar agradecido cada noche, cubriendo relaciones, crecimiento personal, experiencias de vida, etc., a través de registros escritos para cultivar una mentalidad positiva y conciencia de gratitud.',
      instructions: 'Dedique 5-10 minutos cada noche a registrar el diario de gratitud, escriba cosas por las que vale la pena estar agradecido ese día. Envíe fotos del diario o registros de texto, comparta conocimientos de gratitud y experiencias positivas.'
    },
    ja: {
      title: '感謝日記の記録',
      description: '毎晩3つの感謝すべきことを記録し、人間関係、個人的成長、生活体験などをカバーし、書面記録を通じて積極的な心構えと感謝の意識を養います。',
      instructions: '毎晩5-10分を費やして感謝日記を記録し、その日感謝する価値のあることを書き留めてください。日記の写真またはテキスト記録を提出し、感謝の洞察と積極的な体験を共有してください。'
    }
  },
  'quick_cooking': {
    en: {
      title: 'Home Cooking Challenge',
      description: 'Cook one home-style dish daily, aiming to improve cooking skills and enjoy cooking pleasure through practicing different recipes to master basic cooking techniques and cultivate healthy eating habits.',
      instructions: 'Cook one dish daily, can be home-style dishes, soups, or snacks. Submit cooking process photos and finished product pictures, record cooking insights and taste evaluations.'
    },
    es: {
      title: 'Desafío de Cocina Casera',
      description: 'Cocine un plato casero diariamente, con el objetivo de mejorar las habilidades culinarias y disfrutar del placer de cocinar a través de la práctica de diferentes recetas para dominar técnicas básicas de cocina y cultivar hábitos alimenticios saludables.',
      instructions: 'Cocine un plato diariamente, puede ser platos caseros, sopas o bocadillos. Envíe fotos del proceso de cocina y fotos del producto terminado, registre conocimientos de cocina y evaluaciones de sabor.'
    },
    ja: {
      title: '家庭料理チャレンジ',
      description: '毎日1つの家庭料理を作り、さまざまなレシピを実践して基本的な調理技術を習得し、健康的な食習慣を養うことで、調理スキルの向上と調理の楽しみを目指します。',
      instructions: '毎日1つの料理を作り、家庭料理、スープ、またはスナックができます。調理プロセスの写真と完成品の写真を提出し、調理の洞察と味の評価を記録してください。'
    }
  },
  'quick_organization': {
    en: {
      title: 'Home Organization and Storage',
      description: 'Organize one area daily using decluttering method, aiming to create tidy space and improve quality of life through systematic organization to create comfortable living environment.',
      instructions: 'Choose one area to organize daily, can be closet, desk, kitchen, etc. Submit before-and-after comparison photos, record organization methods and space improvement effects.'
    },
    es: {
      title: 'Organización y Almacenamiento del Hogar',
      description: 'Organice un área diariamente usando el método de desorden, con el objetivo de crear un espacio ordenado y mejorar la calidad de vida a través de la organización sistemática para crear un ambiente de vida cómodo.',
      instructions: 'Elija un área para organizar diariamente, puede ser armario, escritorio, cocina, etc. Envíe fotos de comparación antes y después, registre métodos de organización y efectos de mejora del espacio.'
    },
    ja: {
      title: '家の整理整頓と収納',
      description: '断捨離方法を使用して毎日1つのエリアを整理し、体系的な整理を通じて整頓されたスペースを作り、生活の質を向上させ、快適な生活環境を作ることを目指します。',
      instructions: '毎日整理するエリアを選択し、クローゼット、デスク、キッチンなどができます。整理前後の比較写真を提出し、整理方法とスペース改善効果を記録してください。'
    }
  },
  'quick_startup': {
    en: {
      title: 'Tech Startup Idea Stage Journal',
      description: 'Tech startup project in idea stage, focusing on market research and product planning. Invest 2-3 hours daily to systematically advance project development, record challenges, gains, and growth in entrepreneurial journey.',
      instructions: 'Record daily startup progress including market research, product development, team building, etc. Submit work records, learning notes, or project screenshots, share entrepreneurial insights and milestone achievements.'
    },
    es: {
      title: 'Diario de Etapa de Idea de Startup Tecnológico',
      description: 'Proyecto de startup tecnológico en etapa de idea, enfocándose en investigación de mercado y planificación de productos. Invierta 2-3 horas diarias para avanzar sistemáticamente en el desarrollo del proyecto, registre desafíos, ganancias y crecimiento en el viaje empresarial.',
      instructions: 'Registre el progreso diario de la startup incluyendo investigación de mercado, desarrollo de productos, construcción de equipos, etc. Envíe registros de trabajo, notas de aprendizaje o capturas de pantalla del proyecto, comparta conocimientos empresariales y logros de hitos.'
    },
    ja: {
      title: 'テクノロジースタートアップアイデア段階ジャーナル',
      description: 'アイデア段階のテクノロジースタートアッププロジェクトで、市場調査と製品計画に焦点を当てています。毎日2-3時間を投資してプロジェクト開発を体系的に進め、起業の旅における課題、収穫、成長を記録します。',
      instructions: '市場調査、製品開発、チーム構築などを含む毎日のスタートアップの進捗を記録してください。作業記録、学習ノート、またはプロジェクトのスクリーンショットを提出し、起業の洞察とマイルストーンの成果を共有してください。'
    }
  }
};

async function updateTemplateTranslations() {
  console.log('🌍 開始更新模板翻译...');

  try {
    for (const [templateName, translations] of Object.entries(quickTemplateTranslations)) {
      console.log(`\n📝 更新模板: ${templateName}`);

      const template = await prisma.gameTemplate.findUnique({
        where: { name: templateName }
      });

      if (!template) {
        console.log(`⚠️  模板 ${templateName} 不存在，跳过`);
        continue;
      }

      await prisma.gameTemplate.update({
        where: { name: templateName },
        data: {
          titleTranslations: {
            en: translations.en.title,
            es: translations.es.title,
            ja: translations.ja.title
          },
          descriptionTranslations: {
            en: translations.en.description,
            es: translations.es.description,
            ja: translations.ja.description
          },
          instructionsTranslations: {
            en: translations.en.instructions,
            es: translations.es.instructions,
            ja: translations.ja.instructions
          }
        }
      });

      console.log(`✅ 模板 ${templateName} 翻译已更新`);
    }

    console.log('\n🎉 所有模板翻译更新完成!');
  } catch (error) {
    console.error('❌ 更新失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateTemplateTranslations();

