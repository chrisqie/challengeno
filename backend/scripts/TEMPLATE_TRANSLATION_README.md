# Game Template Multilingual Translation System

## Overview
This system provides multilingual support for game templates in English, Spanish, and Japanese.

## Database Schema Changes

### New Fields Added to `game_templates` Table:
- `title_translations` (JSONB) - Stores title translations: `{ en: "...", es: "...", ja: "..." }`
- `description_translations` (JSONB) - Stores description translations
- `instructions_translations` (JSONB) - Stores instructions translations
- `example_evidence_translations` (JSONB) - Stores example evidence translations

## Files

### 1. Migration Script
**File**: `backend/prisma/migrations/add_template_translations.sql`
- Adds the 4 new JSONB columns to the `game_templates` table

### 2. Translation Data
**File**: `backend/prisma/template-translations.json`
- Contains all template translations in JSON format
- Currently includes 15 quick-start templates
- Format:
```json
{
  "template_name": {
    "title": { "en": "...", "es": "...", "ja": "..." },
    "description": { "en": "...", "es": "...", "ja": "..." },
    "instructions": { "en": "...", "es": "...", "ja": "..." },
    "exampleEvidence": { "en": "...", "es": "...", "ja": "..." }
  }
}
```

### 3. Update Script
**File**: `backend/scripts/update-template-translations.ts`
- TypeScript script to batch update all templates with translations
- Reads from `template-translations.json`
- Updates database with translation data

## Deployment Steps

### Step 1: Run Database Migration
```bash
cd /opt/challenge-no/backend
psql -h localhost -U chal_user -d chal_no -f prisma/migrations/add_template_translations.sql
```

### Step 2: Update Prisma Schema
The schema has been updated with the new fields. Generate Prisma client:
```bash
npx prisma generate
```

### Step 3: Run Translation Update Script
```bash
npx ts-node scripts/update-template-translations.ts
```

This will:
- Read all translations from `template-translations.json`
- Update each template in the database with the translations
- Show progress and summary

### Step 4: Rebuild and Restart
```bash
# Rebuild backend
npm run build

# Restart service
pm2 restart challenge-no
```

## API Usage

### Frontend Request
When fetching templates, include the `language` query parameter:

```typescript
// English
GET /api/templates?language=en

// Spanish
GET /api/templates?language=es

// Japanese
GET /api/templates?language=ja
```

### Backend Response
The API will automatically return translated fields based on the language parameter:
- If translations exist for the requested language, they will be used
- If translations don't exist, the original Chinese text will be returned
- Default language is English (`en`) if no language parameter is provided

## Adding New Template Translations

### 1. Add to JSON File
Edit `backend/prisma/template-translations.json` and add your new template:

```json
{
  "your_template_name": {
    "title": {
      "en": "English Title",
      "es": "Título en Español",
      "ja": "日本語タイトル"
    },
    "description": {
      "en": "English description",
      "es": "Descripción en español",
      "ja": "日本語の説明"
    },
    "instructions": {
      "en": "English instructions",
      "es": "Instrucciones en español",
      "ja": "日本語の指示"
    },
    "exampleEvidence": {
      "en": "English example",
      "es": "Ejemplo en español",
      "ja": "日本語の例"
    }
  }
}
```

### 2. Run Update Script
```bash
npx ts-node scripts/update-template-translations.ts
```

## Current Status

✅ **Completed**:
- Database schema updated
- 15 quick-start templates translated (English, Spanish, Japanese)
- Backend service updated to support multilingual responses
- API endpoint updated to accept language parameter

📝 **Template Translation Status**:

**Quick Start Templates (15):**
- ✅ quick_language_learning - English Learning Challenge
- ✅ quick_daily_reading - Daily 30-Minute Reading
- ✅ quick_skill_practice - Skill Practice Challenge
- ✅ quick_gym_workout - Gym Workout Training
- ✅ quick_running_challenge - Daily 5K Run
- ✅ quick_yoga_practice - Yoga & Meditation Practice
- ✅ quick_early_wake_up - 6 AM Early Wake Up Challenge
- ✅ quick_water_intake - Daily Water Intake 2L
- ✅ quick_meditation - Daily 15-Minute Meditation
- ✅ quick_productivity_boost - Productivity Boost Challenge
- ✅ quick_creativity - Creative Expression Challenge
- ✅ quick_gratitude - Gratitude Journal Challenge
- ✅ quick_cooking - Daily Healthy Cooking
- ✅ quick_organization - Organization & Decluttering Challenge
- ✅ quick_startup - Daily Startup Progress

**General Templates (1):**
- ✅ general_custom - General Custom Challenge

**Total: 16 templates fully translated to 3 languages (English, Spanish, Japanese)**

## Notes

- The original Chinese fields (`title`, `description`, `instructions`, `exampleEvidence`) are kept for backward compatibility
- Translations are stored in separate JSONB fields
- The backend service automatically selects the appropriate translation based on the `language` parameter
- If a translation doesn't exist for a specific language, the system falls back to the original field value

