// Run with: DATABASE_URL=<your-url> node scripts/seed-shakshuka.mjs
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

const CATEGORY_ID = 'a10a0c75-44cf-481c-b2ce-c0f9cd52fa44'; // תבשילים

const recipe = {
  name: 'השקשוקה הכי טעימה שתאכלו',
  description: 'המתכון הכי שווה לשקשוקה כולל אופציה לשדרוג עם חצילים מטוגנים וגבינת פטה. לא תאמינו כמה זה טעים וכמה קל להכין.',
  image_url: null, // add via the app UI later
  category_id: CATEGORY_ID,
  recommended: false,
};

const ingredients = [
  '2 כפות שמן זית',
  '½ כפית פריקה מתוקה',
  '¼ כפית בהרט (או כמון) – לא לוותר',
  '2 כפות רסק עגבניות',
  '6-8 שיני שום, קלופות',
  '3 עגבניות אדומות ובשלות',
  '½ פלפל צ\'ילי טרי או ¼ כפית פריקה חריפה',
  'מלח ופלפל שחור',
  '4 ביצים',
];

const instructions = [
  'קוצצים את השום לקוביות או לפרוסות וחותכים את העגבניות לקוביות.',
  'במחבת רחבה שמים שמן זית ומיד מוסיפים פריקה ובהרט. מטגנים על אש נמוכה, תוך כדי ערבוב, במשך 2 דקות.',
  'מוסיפים את רסק העגבניות ומטגנים ביחד במשך 3-5 דקות נוספות.',
  'מוסיפים עגבניות חתוכות, שום קצוץ, מלח, פלפל ופלפל צ\'ילי (אין צורך לקצוץ) וסוגרים את האדים בפנים. לאחר 5 דקות פותחים, מערבבים וסוגרים לעוד 2 דקות.',
  'כשהעגבניות הטריות רכות לגמרי יוצרים בתוך הרוטב מעין שקע או בור ושופכים פנימה את הביצה. חשוב לפתוח אותה קודם לתוך כוס או קערה לוודא שהיא טובה.',
  'מבשלים את השקשוקה ללא מכסה על אש בינונית עד למידת העשייה האהובה עליכם. שימו לב שהביצים ממשיכות להתבשל גם לאחר שסוגרים את האש – מומלץ להוציא אותן קצת לפני מידת העשייה הרצויה.',
];

const garnish_ingredients = [
  '1 חציל, קלוף',
  '100 גרם גבינה בולגרית או פטה',
  'מעט עלי פטרוזיליה',
];

const garnish_instructions = [
  'חותכים את החציל הקלוף לקוביות בגודל 2 ס"מ ומניחים לחציל להגיר נוזלים במשך 10 דקות (ואפשר גם יותר).',
  'מייבשים את קוביות החציל עם נייר סופג ומטגנים במחבת עם 1 ס"מ שמן עד הזהבה יפה מכל הצדדים.',
  'דקה לפני שהשקשוקה מוכנה מפזרים מעל קוביות חציל מטוגנות, מפוררים גבינה בולגרית ומעטרים בפטרוזיליה.',
];

await sql`BEGIN`;
try {
  const [row] = await sql`
    INSERT INTO recipes (name, description, image_url, category_id, recommended)
    VALUES (${recipe.name}, ${recipe.description}, ${recipe.image_url}, ${recipe.category_id}, ${recipe.recommended})
    RETURNING id
  `;
  const recipeId = row.id;
  console.log('Created recipe:', recipeId);

  for (let i = 0; i < ingredients.length; i++) {
    await sql`INSERT INTO recipe_ingredients (recipe_id, description, sort_order) VALUES (${recipeId}, ${ingredients[i]}, ${i})`;
  }

  for (let i = 0; i < instructions.length; i++) {
    await sql`INSERT INTO recipe_instructions (recipe_id, description, step_number) VALUES (${recipeId}, ${instructions[i]}, ${i + 1})`;
  }

  for (let i = 0; i < garnish_ingredients.length; i++) {
    await sql`INSERT INTO recipe_garnish_ingredients (recipe_id, description, sort_order) VALUES (${recipeId}, ${garnish_ingredients[i]}, ${i})`;
  }

  for (let i = 0; i < garnish_instructions.length; i++) {
    await sql`INSERT INTO recipe_garnish_instructions (recipe_id, description, step_number) VALUES (${recipeId}, ${garnish_instructions[i]}, ${i + 1})`;
  }

  await sql`COMMIT`;
  console.log('Done! Recipe inserted successfully.');
} catch (err) {
  await sql`ROLLBACK`;
  console.error('Error, rolled back:', err);
  process.exit(1);
}
