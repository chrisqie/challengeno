import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌍 Starting template translations update...\n');

  // Load translations from JSON file
  const translationsPath = path.join(__dirname, '../prisma/template-translations.json');
  const translations = JSON.parse(fs.readFileSync(translationsPath, 'utf-8'));

  let successCount = 0;
  let failCount = 0;
  let notFoundCount = 0;

  for (const [templateName, trans] of Object.entries(translations)) {
    try {
      // Check if template exists
      const template = await prisma.gameTemplate.findUnique({
        where: { name: templateName }
      });

      if (!template) {
        console.log(`⚠️  Template not found: ${templateName}`);
        notFoundCount++;
        continue;
      }

      // Update template with translations
      await prisma.gameTemplate.update({
        where: { name: templateName },
        data: {
          titleTranslations: (trans as any).title,
          descriptionTranslations: (trans as any).description,
          instructionsTranslations: (trans as any).instructions,
          exampleEvidenceTranslations: (trans as any).exampleEvidence
        }
      });

      console.log(`✅ Updated: ${templateName}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to update ${templateName}:`, error);
      failCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Successfully updated: ${successCount}`);
  console.log(`   ❌ Failed: ${failCount}`);
  console.log(`   ⚠️  Not found: ${notFoundCount}`);
  console.log(`   📝 Total processed: ${Object.keys(translations).length}`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

