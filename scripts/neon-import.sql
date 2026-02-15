--
-- PostgreSQL database dump
--


-- Dumped from database version 17.4
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
-- SET transaction_timeout = 0; -- PG17+ only, commented for compatibility
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP POLICY IF EXISTS "Public can read recipes" ON public.recipes;
DROP POLICY IF EXISTS "Public can read recipe sauces" ON public.recipe_sauces;
DROP POLICY IF EXISTS "Public can read recipe sauce ingredients" ON public.recipe_sauce_ingredients;
DROP POLICY IF EXISTS "Public can read recipe instructions" ON public.recipe_instructions;
DROP POLICY IF EXISTS "Public can read recipe ingredients" ON public.recipe_ingredients;
DROP POLICY IF EXISTS "Public can read recipe garnishes" ON public.recipe_garnish_instructions;
DROP POLICY IF EXISTS "Public can read recipe garnish ingredients" ON public.recipe_garnish_ingredients;
DROP POLICY IF EXISTS "Public can read categories" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated users to update categories" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated users to insert categories" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated users to delete categories" ON public.categories;
DROP POLICY IF EXISTS "Allow authenticated users full access to recipes" ON public.recipes;
DROP POLICY IF EXISTS "Allow authenticated users full access to recipe sauces" ON public.recipe_sauces;
DROP POLICY IF EXISTS "Allow authenticated users full access to recipe sauce ingredien" ON public.recipe_sauce_ingredients;
DROP POLICY IF EXISTS "Allow authenticated users full access to recipe instructions" ON public.recipe_instructions;
DROP POLICY IF EXISTS "Allow authenticated users full access to recipe ingredients" ON public.recipe_ingredients;
DROP POLICY IF EXISTS "Allow authenticated users full access to recipe garnishes" ON public.recipe_garnish_instructions;
DROP POLICY IF EXISTS "Allow authenticated users full access to recipe garnish ingredi" ON public.recipe_garnish_ingredients;
ALTER TABLE IF EXISTS ONLY public.recipes DROP CONSTRAINT IF EXISTS recipes_category_id_fkey;
ALTER TABLE IF EXISTS ONLY public.recipe_sauces DROP CONSTRAINT IF EXISTS recipe_sauces_recipe_id_fkey;
ALTER TABLE IF EXISTS ONLY public.recipe_sauce_ingredients DROP CONSTRAINT IF EXISTS recipe_sauce_ingredients_recipe_id_fkey;
ALTER TABLE IF EXISTS ONLY public.recipe_instructions DROP CONSTRAINT IF EXISTS recipe_instructions_recipe_id_fkey;
ALTER TABLE IF EXISTS ONLY public.recipe_ingredients DROP CONSTRAINT IF EXISTS recipe_ingredients_recipe_id_fkey;
ALTER TABLE IF EXISTS ONLY public.recipe_garnish_instructions DROP CONSTRAINT IF EXISTS recipe_garnishes_recipe_id_fkey;
ALTER TABLE IF EXISTS ONLY public.recipe_garnish_ingredients DROP CONSTRAINT IF EXISTS recipe_garnish_ingredients_recipe_id_fkey;
DROP INDEX IF EXISTS public.idx_recipes_category_id;
DROP INDEX IF EXISTS public.idx_recipe_sauces_recipe_id;
DROP INDEX IF EXISTS public.idx_recipe_sauce_ingredients_recipe_id;
DROP INDEX IF EXISTS public.idx_recipe_instructions_recipe_id;
DROP INDEX IF EXISTS public.idx_recipe_ingredients_recipe_id;
DROP INDEX IF EXISTS public.idx_recipe_garnishes_recipe_id;
DROP INDEX IF EXISTS public.idx_recipe_garnish_ingredients_recipe_id;
DROP INDEX IF EXISTS public.idx_categories_slug;
ALTER TABLE IF EXISTS ONLY public.recipes DROP CONSTRAINT IF EXISTS recipes_pkey;
ALTER TABLE IF EXISTS ONLY public.recipe_sauces DROP CONSTRAINT IF EXISTS recipe_sauces_pkey;
ALTER TABLE IF EXISTS ONLY public.recipe_sauce_ingredients DROP CONSTRAINT IF EXISTS recipe_sauce_ingredients_pkey;
ALTER TABLE IF EXISTS ONLY public.recipe_instructions DROP CONSTRAINT IF EXISTS recipe_instructions_pkey;
ALTER TABLE IF EXISTS ONLY public.recipe_ingredients DROP CONSTRAINT IF EXISTS recipe_ingredients_pkey;
ALTER TABLE IF EXISTS ONLY public.recipe_garnish_instructions DROP CONSTRAINT IF EXISTS recipe_garnishes_pkey;
ALTER TABLE IF EXISTS ONLY public.recipe_garnish_ingredients DROP CONSTRAINT IF EXISTS recipe_garnish_ingredients_pkey;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_slug_key;
ALTER TABLE IF EXISTS ONLY public.categories DROP CONSTRAINT IF EXISTS categories_pkey;
DROP TABLE IF EXISTS public.recipes;
DROP TABLE IF EXISTS public.recipe_sauces;
DROP TABLE IF EXISTS public.recipe_sauce_ingredients;
DROP TABLE IF EXISTS public.recipe_instructions;
DROP TABLE IF EXISTS public.recipe_ingredients;
DROP TABLE IF EXISTS public.recipe_garnish_instructions;
DROP TABLE IF EXISTS public.recipe_garnish_ingredients;
DROP TABLE IF EXISTS public.categories;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    color text,
    icon text,
    description text
);


--
-- Name: recipe_garnish_ingredients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipe_garnish_ingredients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    recipe_id uuid NOT NULL,
    description text NOT NULL,
    sort_order integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: recipe_garnish_instructions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipe_garnish_instructions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    recipe_id uuid NOT NULL,
    step_number integer NOT NULL,
    description text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: recipe_ingredients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipe_ingredients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    recipe_id uuid NOT NULL,
    description text NOT NULL,
    sort_order integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: recipe_instructions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipe_instructions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    recipe_id uuid NOT NULL,
    step_number integer NOT NULL,
    description text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: recipe_sauce_ingredients; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipe_sauce_ingredients (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    recipe_id uuid NOT NULL,
    description text NOT NULL,
    sort_order integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: recipe_sauces; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipe_sauces (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    recipe_id uuid NOT NULL,
    step_number integer NOT NULL,
    description text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: recipes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.recipes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    description text,
    image_url text,
    category_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    recommended boolean DEFAULT false NOT NULL
);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.categories (id, slug, name, created_at, updated_at, color, icon, description) FROM stdin;
bd87c226-d7d4-42cf-be83-d20f8694ba78	desserts	קינוחים	2025-06-14 11:17:24.923504+00	2025-06-14 11:17:24.923504+00	bg-rose-200	Cake	עוגות, עוגיות, פודינגים וטעמים מתוקים לילדים ולמבוגרים
a9695e1a-2263-46ab-bc6e-af15528e03b7	savory-pastries	מאפים מלוחים	2025-06-14 11:17:24.923504+00	2025-06-14 11:17:24.923504+00	bg-pink-200	Utensils	בצקים, לחמים, פשטידות ומגוון מאפים שאוהבים
a10a0c75-44cf-481c-b2ce-c0f9cd52fa44	stews	תבשילים	2025-06-14 11:17:24.923504+00	2025-06-14 11:17:24.923504+00	bg-red-200	BookOpen	מנות ביתיות, תבשילי משפחה ומאכלים מנחמים
\.


--
-- Data for Name: recipe_garnish_ingredients; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipe_garnish_ingredients (id, recipe_id, description, sort_order, created_at) FROM stdin;
80b48717-8c92-4938-af4e-549bb644fb29	2ccd155c-c6de-4268-993b-cb88e511329e	8 חלמונים L	1	2025-06-16 07:18:07.477258+00
671d4815-1893-47bd-9d32-3644234747e7	2ccd155c-c6de-4268-993b-cb88e511329e	1/4 3 כוסות חלב 3%	2	2025-06-16 07:18:07.477258+00
88573e09-00d9-4334-a4cf-f1865d9e4644	2ccd155c-c6de-4268-993b-cb88e511329e	3/4 כוס סוכר לבן	3	2025-06-16 07:18:07.477258+00
227ad74f-ec6a-4d6a-9f6b-81915fe110ad	2ccd155c-c6de-4268-993b-cb88e511329e	2 כפיות תמצית וניל	4	2025-06-16 07:18:07.477258+00
1e710d2c-a8b5-4e62-9440-56490801af14	2ccd155c-c6de-4268-993b-cb88e511329e	7 כפות קורנפלור 	5	2025-06-16 07:18:07.477258+00
ef75de2c-f321-414e-b570-b8c982175924	2ccd155c-c6de-4268-993b-cb88e511329e	150 גרם חמאה	6	2025-06-16 07:18:07.477258+00
b91b2998-e1de-44c1-9bdd-d0e3b329b7de	0289752c-26a1-40e9-8ed6-9d839effd98a	500 גרם יוגורט 6.5%	1	2025-06-16 07:32:44.980689+00
5400d1b5-6cb6-4b07-a31a-2dca7442f5dd	0289752c-26a1-40e9-8ed6-9d839effd98a	2-3 עלי וגבעולי שומר, קצוץ	2	2025-06-16 07:32:44.980689+00
162cfac3-5b79-4d26-8a53-ea03ab4e6e9b	0289752c-26a1-40e9-8ed6-9d839effd98a	2 מלפפונים קלופים, מגורדים	3	2025-06-16 07:32:44.980689+00
044fda13-b3ab-4f8b-b51a-4e725c7ae943	0289752c-26a1-40e9-8ed6-9d839effd98a	1 כפית לימון	4	2025-06-16 07:32:44.980689+00
532e42d9-123e-415c-941b-195722a8a515	0289752c-26a1-40e9-8ed6-9d839effd98a	1 שן שום כתושה	5	2025-06-16 07:32:44.980689+00
ba79840f-0f87-4468-afe8-29fa6ccb38e0	0289752c-26a1-40e9-8ed6-9d839effd98a	בד סינון + מסננת + קערה	6	2025-06-16 07:32:44.980689+00
4a2ecc74-eaeb-49e3-939f-8807759c75d1	0289752c-26a1-40e9-8ed6-9d839effd98a	1 כפית מלח גס	7	2025-06-16 07:32:44.980689+00
22aa1cab-6f6b-475c-8519-39f2e9121c38	c8db1945-f069-4728-9ce2-9bcf620d8654	1 חופן שומשום	1	2025-06-21 17:05:55.426842+00
1ac66a99-d12c-4be8-a4a8-3b2317992627	40881640-a230-45d9-ac85-f2383b492d55	מילוי:	1	2025-06-24 08:44:06.301254+00
b510838c-5247-427b-885d-89b066b5509d	40881640-a230-45d9-ac85-f2383b492d55	6-7 תפוחי גראנד סמית, קלופים ללא ליבה 	2	2025-06-24 08:44:06.301254+00
d6a1e02d-4c74-4e7b-a5e9-2e1942e0d72f	40881640-a230-45d9-ac85-f2383b492d55	1/2 1 כפיות קינמון 	3	2025-06-24 08:44:06.301254+00
3029f20b-4525-4a7f-a6b6-d738dd8e0341	40881640-a230-45d9-ac85-f2383b492d55	113 גרם או 8 כפות חמאה	4	2025-06-24 08:44:06.301254+00
c7f311c5-83c7-4d37-a6da-57d95c5ee935	40881640-a230-45d9-ac85-f2383b492d55	3 כפות קמח לבן	5	2025-06-24 08:44:06.301254+00
062641c8-e747-4334-a41b-0ac6e5dd7793	40881640-a230-45d9-ac85-f2383b492d55	60 מ''ל מים	6	2025-06-24 08:44:06.301254+00
29a8e82b-1b24-4648-91e6-80d3df96460e	40881640-a230-45d9-ac85-f2383b492d55	200 גרם או 1 כוס סוכר	7	2025-06-24 08:44:06.301254+00
80b9b29d-6374-4d91-abe7-57154a59b5c8	40881640-a230-45d9-ac85-f2383b492d55	1 ביצה	8	2025-06-24 08:44:06.301254+00
382d2cd4-1014-44b7-856f-40b7abccfaa9	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	מומלץ להוסיף חצי שעה לפני סוף הבישול בצקניות או ניוקי לתוך התבשיל	1	2025-08-08 12:28:01.153109+00
\.


--
-- Data for Name: recipe_garnish_instructions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipe_garnish_instructions (id, recipe_id, step_number, description, created_at) FROM stdin;
715fa470-65a7-4fe6-93f5-29bc468651de	2ccd155c-c6de-4268-993b-cb88e511329e	1	מכניסים לסיר את החלב ותמצית הווניל ומביאים לרתיחה.	2025-06-16 07:18:07.92743+00
6c66e970-13ff-4c30-9a48-02953a881b2c	2ccd155c-c6de-4268-993b-cb88e511329e	2	במקביל, מערבבים היטב בקערה בינונית את החלמונים, הסוכר והקורנפלור.	2025-06-16 07:18:07.92743+00
5a5998e5-4713-48c4-b2c4-10d9c2754434	2ccd155c-c6de-4268-993b-cb88e511329e	3	יוצקים את החלב הרותח על תערובת הביצים ומערבבים היטב.	2025-06-16 07:18:07.92743+00
9e3eb53a-75e6-4ceb-8114-0044b6a95700	2ccd155c-c6de-4268-993b-cb88e511329e	4	מחזירים את התערובת לסיר דרך מסננת ומבשלים על אש נמוכה, תוך כדי בחישה מתמדת בעזרת מטרפה, עד להיווצרות קרם סמיך, במשך כ-4 דקות.	2025-06-16 07:18:07.92743+00
4aecaba6-d20d-4b9d-bbb5-4d81666f353e	2ccd155c-c6de-4268-993b-cb88e511329e	5	מורידים מהאש, מוסיפים חמאה וטורפים היטב עד לקבלת קרם אחיד.	2025-06-16 07:18:07.92743+00
8219e309-05e0-4eae-ad0b-fdecd99c750a	2ccd155c-c6de-4268-993b-cb88e511329e	6	מעבירים את הקרם לקופסה, מצמידים לפני הקרם ניילון נצמד (על מנת שלא ייווצר קרום) ומצננים במקרר במשך שעתיים.	2025-06-16 07:18:07.92743+00
35317f66-0198-4332-9942-2ebc535e872a	0289752c-26a1-40e9-8ed6-9d839effd98a	1	מניחים את המסננת על הקערה, מכניסים את היוגורט לתוך בד הסינון, קושרים ומניחים על המסננת.	2025-06-16 07:32:45.357088+00
f2fd0404-9ace-4d78-8209-81c143e5d848	0289752c-26a1-40e9-8ed6-9d839effd98a	2	מכניסים למקרר עד שנשאר 80% מהמשקל של היוגורט לפני התהליך (400 גרם), מעבירים לקערה ושומרים במקרר עם נילון נצמד.	2025-06-16 07:32:45.357088+00
fa9a4cac-7ed7-46c5-8f97-07561b254d91	0289752c-26a1-40e9-8ed6-9d839effd98a	3	בינתיים מגרדים את המלפפונים, מפזרים מעליהם את המלח ומשרים כחמש דקות בערך.	2025-06-16 07:32:45.357088+00
f560267b-3b07-45f0-9f33-18c0410c32a2	0289752c-26a1-40e9-8ed6-9d839effd98a	4	סוחטים את המלפפונים מכל המיץ, מוסיפים לקערה עם היוגורט את המלפפונים, השום, השומר והלימון.	2025-06-16 07:32:45.357088+00
0dcca322-6066-44bb-b94d-7cea3c2cb86a	0289752c-26a1-40e9-8ed6-9d839effd98a	5	לשמור את היוגורט במקרר, בתיאבון	2025-06-16 07:32:45.357088+00
f00c8ce6-3125-4222-b7b1-4dc7fed10e30	c8db1945-f069-4728-9ce2-9bcf620d8654	1	מפזרים מעל שומשום ומגישים מיד.	2025-06-21 17:05:55.674194+00
2ba7b978-b453-4dc2-b33b-53e11eefd475	40881640-a230-45d9-ac85-f2383b492d55	1	חממו תנור ל-220 מעלות צלזיוס	2025-06-24 08:44:06.690073+00
b923d9f7-380d-4f7d-8aba-42b894643c6a	40881640-a230-45d9-ac85-f2383b492d55	2	\nממיסים חמאה בסיר בינוני על אש בינונית. מוסיפים 3 כפות קמח ומבשלים על אש קטנה במשך דקה אחת תוך כדי ערבוב מתמיד. מוסיפים 1/4 כוס מים וכוס סוכר ומביאים לרתיחה. מנמיכים את האש וממשיכים לבשל על אש קטנה במשך 3 דקות תוך כדי ערבוב תכוף, ולאחר מכן מסירים מהאש.	2025-06-24 08:44:06.690073+00
e63f2aa1-e50a-4402-9e42-0644efc3971f	40881640-a230-45d9-ac85-f2383b492d55	3	קולפים, מסירים את הליבה, פורסים דק 7 כוסות תפוחים ומניחים בקערה גדולה. מפזרים מעל 1 וחצי כפיות קינמון ומערבבים היטב. יוצקים את הרוטב על התפוחים ומערבבים כדי לצפות את פרוסות התפוח.\n	2025-06-24 08:44:06.690073+00
ce6b36a6-562a-4f27-bfb8-b9b63019f9ec	40881640-a230-45d9-ac85-f2383b492d55	4	פזרו קמח על משטח העבודה שלכם ורדדו את קלתית הפאי התחתונה לעיגול בקוטר 30 ס"מ. גלגלו אותה סביב המערוך כדי להעביר אותה לתבנית הפאי בקוטר 23 ס"מ . הוסיפו את תערובת התפוחים, תוך התהפכות קלה במרכז, והיזהרו שהמלית לא תגיע לקצוות, דבר שיקשה על האיטום.\n	2025-06-24 08:44:06.690073+00
690d2e4e-7019-4be0-aa8a-e9b61547e9b9	40881640-a230-45d9-ac85-f2383b492d55	5	גלגלו את הבצק השני לעיגול בקוטר 28 ס"מ וחתכו ל-10 רצועות בעובי אחיד בעזרת חותכן פיצה . סדרו את הרצועות בצורת רשת ארוגה מעל. טרפו יחד ביצה אחת וכף אחת של מים ומרחו את החלק העליון בתערובת הביצים.	2025-06-24 08:44:06.690073+00
5f322f37-588c-4831-91ff-d2e1ce991bb3	40881640-a230-45d9-ac85-f2383b492d55	6	אופים ב-220 מעלות צלזיוס במרכז התנור במשך 15 דקות. מנמיכים את החום ל-175 מעלות צלזיוס וממשיכים לאפות עוד 45 דקות או עד שהתפוחים רכים והמלית מבעבעת מפתחי האוורור. ממתינים בטמפרטורת החדר שעה לפני ההגשה.\n	2025-06-24 08:44:06.690073+00
\.


--
-- Data for Name: recipe_ingredients; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipe_ingredients (id, recipe_id, description, sort_order, created_at) FROM stdin;
ce589d04-3bfc-43fc-88db-8478715cf86e	582c2583-b27a-4990-a9c2-3ad8ba94f5e7	1 קילו קמח	1	2025-06-14 18:28:37.758169+00
1f7b139a-8565-4ab1-b976-a47af092e132	582c2583-b27a-4990-a9c2-3ad8ba94f5e7	2 כפות שמרים יבשים	2	2025-06-14 18:28:37.758169+00
ce9588d5-1c6a-474f-aacc-d473371f874b	582c2583-b27a-4990-a9c2-3ad8ba94f5e7	5 כפות סוכר	3	2025-06-14 18:28:37.758169+00
2a3e48c7-abf9-4ef7-b5fb-adfc9f559339	582c2583-b27a-4990-a9c2-3ad8ba94f5e7	1/2 2 כוסות מים	4	2025-06-14 18:28:37.758169+00
ec604b12-3b8e-4584-b7e4-11ca70c1552b	582c2583-b27a-4990-a9c2-3ad8ba94f5e7	1/2 כוס שמן	5	2025-06-14 18:28:37.758169+00
269d29a8-62e0-45dd-a0a8-e199c1a597a0	582c2583-b27a-4990-a9c2-3ad8ba94f5e7	1 כף מלח	6	2025-06-14 18:28:37.758169+00
512595d1-3350-496c-ad25-da8274d7e379	ba84871b-4323-4738-a0bd-2f3c0cdd0278	550 גרם קמח לבן	1	2025-06-15 18:13:07.703609+00
c384485a-ab08-42e1-b59c-21f5e1808843	ba84871b-4323-4738-a0bd-2f3c0cdd0278	10 גרם או כף שמרים יבשים	2	2025-06-15 18:13:07.703609+00
04862dff-d924-4f45-b4ca-d3e7e6b70849	ba84871b-4323-4738-a0bd-2f3c0cdd0278	80 גרם סוכר לבן	3	2025-06-15 18:13:07.703609+00
30de9f7a-5dff-4236-b953-a15036976e16	ba84871b-4323-4738-a0bd-2f3c0cdd0278	150 גרם חמאה רכה	4	2025-06-15 18:13:07.703609+00
94872347-c2d3-4a6a-a208-1cd26cae814a	ba84871b-4323-4738-a0bd-2f3c0cdd0278	100 מ''ל חלב 3%	5	2025-06-15 18:13:07.703609+00
910b8f01-e420-41ca-b6d3-16b655b2bb91	ba84871b-4323-4738-a0bd-2f3c0cdd0278	4 ביצים L	6	2025-06-15 18:13:07.703609+00
6d88da25-63a6-4eb4-9316-54f2476ab350	ba84871b-4323-4738-a0bd-2f3c0cdd0278	5 גרם מלח דק	7	2025-06-15 18:13:07.703609+00
b1c501d6-7af6-47c3-8c0b-343ffdf6e129	ba84871b-4323-4738-a0bd-2f3c0cdd0278	הברשה:	8	2025-06-15 18:13:07.703609+00
5b314e0f-4a45-499c-9041-ed1c77944e9c	ba84871b-4323-4738-a0bd-2f3c0cdd0278	1 חלמון	9	2025-06-15 18:13:07.703609+00
8efc77e5-b9e5-4f47-9ce1-3913978cf200	ba84871b-4323-4738-a0bd-2f3c0cdd0278	1 כף חלב	10	2025-06-15 18:13:07.703609+00
fac38371-9001-4dcd-a2d9-de85a4402d16	ba84871b-4323-4738-a0bd-2f3c0cdd0278	סוכר גבישי (אופציונלי)	11	2025-06-15 18:13:07.703609+00
eb340de2-cc61-43be-b33e-7ded6a341bf5	03d862ec-8604-4adc-be6d-c4558a106ad7	700-500 גרם פרגית, חתוכה לקוביות בגודל 2 ס''מ	1	2025-06-15 08:26:04.839698+00
24a90f65-d4c3-457c-88c8-760ef9da40eb	03d862ec-8604-4adc-be6d-c4558a106ad7	1 כף רסק עגבניות (מרוכז)	2	2025-06-15 08:26:04.839698+00
15d7d8ea-a922-4a49-a56a-39b24cb4d808	03d862ec-8604-4adc-be6d-c4558a106ad7	3 כפות שמן זית	3	2025-06-15 08:26:04.839698+00
bab4bdf4-f9ae-4b4c-a7aa-7daf70bc8362	03d862ec-8604-4adc-be6d-c4558a106ad7	4 שיני שום, כתושות	4	2025-06-15 08:26:04.839698+00
9aa0dfe4-c275-4d6e-baa1-5c0888627932	03d862ec-8604-4adc-be6d-c4558a106ad7	1 כפית כורכום 	5	2025-06-15 08:26:04.839698+00
cb3e9f2e-ad26-4cc3-8217-50cd1bd5a908	03d862ec-8604-4adc-be6d-c4558a106ad7	1 כפית כמון	6	2025-06-15 08:26:04.839698+00
759e4c6a-c27b-4dbb-8c89-150af384ebc1	03d862ec-8604-4adc-be6d-c4558a106ad7	1 כפית פפריקה מתוקה 	7	2025-06-15 08:26:04.839698+00
9aa843dc-7b18-4b6f-85f9-60193552bcb3	03d862ec-8604-4adc-be6d-c4558a106ad7	1/2 כפית מלח	8	2025-06-15 08:26:04.839698+00
ced1cd71-f83f-4a4d-ab63-eff290ae295e	03d862ec-8604-4adc-be6d-c4558a106ad7	מיץ מ-1/2 לימון 	9	2025-06-15 08:26:04.839698+00
e6309cd1-b002-4df2-a795-063aaa1e6142	03d862ec-8604-4adc-be6d-c4558a106ad7	לסיר:	10	2025-06-15 08:26:04.839698+00
9f0eddcf-2d1f-4ac7-8cad-b31fb4c0b06d	03d862ec-8604-4adc-be6d-c4558a106ad7	1/4 כוס שמן זית	11	2025-06-15 08:26:04.839698+00
9d5e0926-9bf8-484a-ad66-ee3131eedd34	03d862ec-8604-4adc-be6d-c4558a106ad7	\t2 בצלים לבנים, חתוכים לקוביות	12	2025-06-15 08:26:04.839698+00
bf4dca6f-e925-4987-8fb7-2541202666f5	03d862ec-8604-4adc-be6d-c4558a106ad7	\t1 כפית פלפל שחור, טחון	13	2025-06-15 08:26:04.839698+00
ac8b194b-a52b-4b77-9d14-fcc116c44456	03d862ec-8604-4adc-be6d-c4558a106ad7	1 כפית סוכר חום	14	2025-06-15 08:26:04.839698+00
de9a45bd-ce5b-41d3-8346-723ba6bee5ae	03d862ec-8604-4adc-be6d-c4558a106ad7	2 כפיות מלח	15	2025-06-15 08:26:04.839698+00
7faa27fa-bc9c-43ce-a7cc-073f680f8c6e	03d862ec-8604-4adc-be6d-c4558a106ad7	3 גזרים, קלופים ומגוררים בפומפייה	16	2025-06-15 08:26:04.839698+00
4171d4cd-9f31-46af-85be-4205af939e4b	03d862ec-8604-4adc-be6d-c4558a106ad7	2 כוסות אורז בסמטי, שטוף היטב ומושרה לפחות שעה	17	2025-06-15 08:26:04.839698+00
30ae3959-7468-4a91-9685-63bc541e9c64	03d862ec-8604-4adc-be6d-c4558a106ad7	1 כוס גרגירי חומוס, מבושלים (אופציונלי)	18	2025-06-15 08:26:04.839698+00
8ea426d3-47b7-480b-bb85-d3f8d3a9084e	c2f31ffd-8a17-45cf-96a2-4871acfd39ea	1/2 1 כוסות קמח לבן	1	2025-06-15 18:45:28.664864+00
c195ce72-18c4-4b18-a142-ceb6463c88c0	c2f31ffd-8a17-45cf-96a2-4871acfd39ea	3/4 1 כפיות אבקת אפיה	2	2025-06-15 18:45:28.664864+00
ebe90a36-5c06-46a6-bcbe-b4683dae09bc	c2f31ffd-8a17-45cf-96a2-4871acfd39ea	3 כפות סוכר לבן	3	2025-06-15 18:45:28.664864+00
8bf2bf34-6276-4f68-bed0-9f84a7a9add8	c2f31ffd-8a17-45cf-96a2-4871acfd39ea	1/2 כפית מלח	4	2025-06-15 18:45:28.664864+00
acfc3dec-6d44-45dc-8867-a8784064403f	c2f31ffd-8a17-45cf-96a2-4871acfd39ea	1 ביצה, טרופה	5	2025-06-15 18:45:28.664864+00
eed49375-d6d8-47cf-a4e4-d1a7ba55b768	c2f31ffd-8a17-45cf-96a2-4871acfd39ea	3 כפות או 45 גרם חמאה מומסת 	6	2025-06-15 18:45:28.664864+00
cc1c52c7-0805-4769-a4b6-6600981cfa0c	c2f31ffd-8a17-45cf-96a2-4871acfd39ea	1 - 1/4 1 כוסות חלב	7	2025-06-15 18:45:28.664864+00
226e3654-b104-49ae-8b46-0279f32cdb7f	4ed615e0-1ae7-4ea6-996a-f639513e2b52	150 גרם חמאה	1	2025-06-15 18:46:03.575108+00
63b52a0c-7e71-444a-b7a5-667ed76c8397	4ed615e0-1ae7-4ea6-996a-f639513e2b52	250 גרם קמח לבן 	2	2025-06-15 18:46:03.575108+00
79aee0a4-dca1-4a3f-882a-16a97433e372	4ed615e0-1ae7-4ea6-996a-f639513e2b52	1 כוס או 200 גרם סוכר לבן	3	2025-06-15 18:46:03.575108+00
e6115255-47eb-46e6-ba2e-1b9e3a4cad86	4ed615e0-1ae7-4ea6-996a-f639513e2b52	1 ביצה L	4	2025-06-15 18:46:03.575108+00
427a1841-f2ae-4484-809a-95c12777019b	4ed615e0-1ae7-4ea6-996a-f639513e2b52	1 כפית תמצית וניל (אופציונלי)	5	2025-06-15 18:46:03.575108+00
471e3df7-6ee3-4798-bd82-afda2652720b	6d50033b-3dfd-4647-92e4-ed6dabbd2045	200 גרם שוקולד מריר	1	2025-06-15 19:05:30.247717+00
cc096bb8-93b5-4943-b584-b77ab9e96db0	6d50033b-3dfd-4647-92e4-ed6dabbd2045	1 כוס סוכר לבן	2	2025-06-15 19:05:30.247717+00
d30989de-e8a7-476f-8ab6-4123a8ab2e98	6d50033b-3dfd-4647-92e4-ed6dabbd2045	4 ביצים 	3	2025-06-15 19:05:30.247717+00
6bb1a7fc-15af-4b47-be2e-3898231dc983	6d50033b-3dfd-4647-92e4-ed6dabbd2045	1 כוס קמח לבן	4	2025-06-15 19:05:30.247717+00
0402646d-4af0-425e-8641-150df7c053c0	6d50033b-3dfd-4647-92e4-ed6dabbd2045	100 גרם חמאה	5	2025-06-15 19:05:30.247717+00
9fc98094-722d-45d9-a5e5-c891083e1230	6d50033b-3dfd-4647-92e4-ed6dabbd2045	חופן אגוזים קצוצים (אופציונלי)	6	2025-06-15 19:05:30.247717+00
e4872ed2-f629-439a-93fb-25b74d878b33	0f9bd181-fe54-4d53-abda-91d8dfd512a6	1 קילו קמח	1	2025-06-15 19:16:47.577376+00
63f4fdac-2d1d-4e95-b9d5-3802661ffc75	0f9bd181-fe54-4d53-abda-91d8dfd512a6	2 כפות או 20 גרם שמרים יבשים	2	2025-06-15 19:16:47.577376+00
299731a0-2aad-4d21-9a90-3f2123ee5fbd	0f9bd181-fe54-4d53-abda-91d8dfd512a6	½ כוס + 3 כפות או 130 גרם סוכר	3	2025-06-15 19:16:47.577376+00
411b14a9-0213-4a4d-8206-eac37b75a851	0f9bd181-fe54-4d53-abda-91d8dfd512a6	1/2 2- 3 כוסות או 600 מ''ל מים	4	2025-06-15 19:16:47.577376+00
52d07191-de49-4989-8c20-be215d8e8244	d1865ca8-21f6-4a46-af56-45dacb0c4198	1/2 בצל	1	2025-06-15 09:22:31.372505+00
91220d61-ea76-4db1-abd4-5efcc43b9e4c	d1865ca8-21f6-4a46-af56-45dacb0c4198	1 תפוח אדמה	2	2025-06-15 09:22:31.372505+00
4da70312-7ffb-4341-9ee0-29effb4280a3	d1865ca8-21f6-4a46-af56-45dacb0c4198	חופן פטרוזיליה 	3	2025-06-15 09:22:31.372505+00
39729930-5b5c-43c7-bcb7-1741032d0450	d1865ca8-21f6-4a46-af56-45dacb0c4198	2 שיני שום כתושות 	4	2025-06-15 09:22:31.372505+00
5242596e-f2fc-4ff7-b18b-b31a00ab8fd8	d1865ca8-21f6-4a46-af56-45dacb0c4198	2 כפות פירורי לחם	5	2025-06-15 09:22:31.372505+00
fe20259c-7b28-49f0-a025-81b8ad4b2e21	d1865ca8-21f6-4a46-af56-45dacb0c4198	1 ביצה	6	2025-06-15 09:22:31.372505+00
808df68c-13d0-48cc-b240-9940f0c13317	d1865ca8-21f6-4a46-af56-45dacb0c4198	1 כף ראס אל חנות	7	2025-06-15 09:22:31.372505+00
780d6cf2-203e-4d9d-971c-7d429762837a	d1865ca8-21f6-4a46-af56-45dacb0c4198	500 גרם בשר טחון	8	2025-06-15 09:22:31.372505+00
5d476528-035d-48c8-8e61-2bdfeebb6ddd	0f9bd181-fe54-4d53-abda-91d8dfd512a6	1 ביצה (אופציונלי)	5	2025-06-15 19:16:47.577376+00
e14ab1b6-4cd0-4a94-8d92-6ad648fc3f4f	0f9bd181-fe54-4d53-abda-91d8dfd512a6	2 כפות או 30 מ''ל שמן זית	6	2025-06-15 19:16:47.577376+00
2ad7d328-9a64-4895-a787-dcf324bedf39	df9c9dc2-d19e-4a4a-99e4-51e839a498dd	1/3 כוס או 65 גרם סוכר	1	2025-06-15 18:38:37.394084+00
c434d512-b5bf-4b07-ae51-cf1b4653f61f	df9c9dc2-d19e-4a4a-99e4-51e839a498dd	2 חלמונים	2	2025-06-15 18:38:37.394084+00
4ae79f0e-67a2-4ce7-a76a-8aed94bdce08	df9c9dc2-d19e-4a4a-99e4-51e839a498dd	1/2 כפית תמצית וניל	3	2025-06-15 18:38:37.394084+00
db6d5a86-28d4-4f0b-96e7-88edac128fa6	df9c9dc2-d19e-4a4a-99e4-51e839a498dd	2 כפות או 20 מ''ל חלב	4	2025-06-15 18:38:37.394084+00
0fef7e93-bf7a-4e56-801a-a725c9ffa714	df9c9dc2-d19e-4a4a-99e4-51e839a498dd	כוס או 140 גרם קמח תופח	5	2025-06-15 18:38:37.394084+00
b902b9f3-c494-4923-bd95-8176752ecb8f	df9c9dc2-d19e-4a4a-99e4-51e839a498dd	3/4 כוס או 105 גרם קורנפלור 	6	2025-06-15 18:38:37.394084+00
3cda415b-c56a-4feb-906a-9ba6337e5528	df9c9dc2-d19e-4a4a-99e4-51e839a498dd	ממרח ריבת חלב	7	2025-06-15 18:38:37.394084+00
0a398258-c1cf-4b28-8aea-b057488aa37c	df9c9dc2-d19e-4a4a-99e4-51e839a498dd	1/3 כוס או 30 גרם קוקוס לציפוי	8	2025-06-15 18:38:37.394084+00
069adf6e-ec77-4bce-8db5-a50ab59e233b	7518653f-823b-4d29-8055-0a8d7c807003	4 ביצים L	1	2025-06-15 19:01:16.02651+00
943c3f3d-9a60-480b-b1a5-2d154465a042	7518653f-823b-4d29-8055-0a8d7c807003	1/2 1 כוסות או 300 גרם סוכר לבן	2	2025-06-15 19:01:16.02651+00
0668ffe4-54f5-49c7-88a9-47a57bba61b8	e3acd082-27cf-4b87-9605-214a52a4d2de	150 גרם חמאה	1	2025-06-21 09:37:03.292923+00
2c2206ca-bd20-4649-afba-9406098a56c8	e3acd082-27cf-4b87-9605-214a52a4d2de	1/4 כוס או 70 גרם סוכר לבן 	2	2025-06-21 09:37:03.292923+00
17c9e352-fe83-4049-9383-018d02942a50	e3acd082-27cf-4b87-9605-214a52a4d2de	3/4 כוס או 115 גרם סוכר חום	3	2025-06-21 09:37:03.292923+00
32e2ec43-6814-4e35-95bd-1267be9718cc	e3acd082-27cf-4b87-9605-214a52a4d2de	55 גרם או 1 ביצה 	4	2025-06-21 09:37:03.292923+00
c4387cae-bfe9-423d-b483-b1747fce6617	e3acd082-27cf-4b87-9605-214a52a4d2de	1/4 1 כוס או 160 גרם קמח לבן	5	2025-06-21 09:37:03.292923+00
bb14210b-6ac8-40c6-a8c5-baf39f9f5df3	e3acd082-27cf-4b87-9605-214a52a4d2de	1/3 כוס או 40 גרם קקאו	6	2025-06-21 09:37:03.292923+00
f3261757-7dea-4100-843a-ce6ee956fd6b	e3acd082-27cf-4b87-9605-214a52a4d2de	1/2 כפית או 2 גרם אבקת אפיה	7	2025-06-21 09:37:03.292923+00
073be7a6-5715-462b-85fa-5d58895b3829	e3acd082-27cf-4b87-9605-214a52a4d2de	1/4 כפית או 1 גרם סודה לשתייה	8	2025-06-21 09:37:03.292923+00
3f0b6e91-793e-4901-94e3-cf39bae251ab	e3acd082-27cf-4b87-9605-214a52a4d2de	1/2 כפית או 2 גרם מלח	9	2025-06-21 09:37:03.292923+00
4009c485-a33a-4c00-b524-229ecd23a14f	e3acd082-27cf-4b87-9605-214a52a4d2de	100 גרם או 1 חבילה שוקולד חלב קצוץ	10	2025-06-21 09:37:03.292923+00
66f5c85e-5db2-402f-b85c-1cedfb9beb48	7518653f-823b-4d29-8055-0a8d7c807003	1 כוס או 240 מ"ל שמן קנולה	3	2025-06-15 19:01:16.02651+00
36378e63-ee02-449c-95f8-eac2538278af	7518653f-823b-4d29-8055-0a8d7c807003	1 כף גרידת תפוז	4	2025-06-15 19:01:16.02651+00
42089e6f-a428-43f0-9e51-39e0350598e7	7518653f-823b-4d29-8055-0a8d7c807003	1 כוס או 240 מ"ל מיץ תפוזים	5	2025-06-15 19:01:16.02651+00
075e8c57-dbb7-4474-9e9b-2721b620996f	7518653f-823b-4d29-8055-0a8d7c807003	1/2 2 כוסות או 350 גרם קמח לבן	6	2025-06-15 19:01:16.02651+00
4fc3d01e-c992-4fd0-b920-e7f4a66a4ae2	7518653f-823b-4d29-8055-0a8d7c807003	1 שקית אבקת אפיה 	7	2025-06-15 19:01:16.02651+00
b12d5fd0-f27b-4ad0-b652-5ec7b886b927	7518653f-823b-4d29-8055-0a8d7c807003	אבקת סוכר לקישוט 	8	2025-06-15 19:01:16.02651+00
713b0353-6694-4f23-b679-3d419069559b	c88a275f-c6ad-44bb-9a38-cb514a627ac7	1 כוס שמן	1	2025-06-15 08:30:27.651412+00
58fe7dec-b43b-4fe8-93c2-e62cde3fb8cf	c88a275f-c6ad-44bb-9a38-cb514a627ac7	1 כוס סוכר לבן	2	2025-06-15 08:30:27.651412+00
d2ad9311-a040-456e-9855-79876c157cb9	c88a275f-c6ad-44bb-9a38-cb514a627ac7	4 ביצים 	3	2025-06-15 08:30:27.651412+00
81e8a697-0cae-42fc-a62b-3ed26bb26542	c88a275f-c6ad-44bb-9a38-cb514a627ac7	1 שמנת חמוצה	4	2025-06-15 08:30:27.651412+00
525e9112-b49f-475a-ac33-be7dc808924c	c88a275f-c6ad-44bb-9a38-cb514a627ac7	1 כוס שוקולית	5	2025-06-15 08:30:27.651412+00
bcae1ec3-6cab-4b62-94c9-6aa788b9f58e	c88a275f-c6ad-44bb-9a38-cb514a627ac7	1 כוס קמח	6	2025-06-15 08:30:27.651412+00
d1d1b75d-55f2-4845-800d-a7338a39d26e	c88a275f-c6ad-44bb-9a38-cb514a627ac7	1 שקית אבקת אפיה	7	2025-06-15 08:30:27.651412+00
aa351134-8515-42ce-ab2a-e4ae6b12ae6e	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	לבצק:	1	2025-06-15 08:56:43.618545+00
6d648e5e-9628-4222-b79c-7649f77058cc	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	3 כוסות קמח או 400 גרם	2	2025-06-15 08:56:43.618545+00
365ca754-5c89-49d9-9597-1f20abdb680c	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	1/3 כוס או 50 גרם שמן 	3	2025-06-15 08:56:43.618545+00
5b385ca8-4148-4b5f-82dc-868071b2dd51	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	160 מ''ל מים	4	2025-06-15 08:56:43.618545+00
0640750a-857a-40f6-9ad4-98ea77b357e8	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	1 כפית או 7 גרם מלח	5	2025-06-15 08:56:43.618545+00
6abdda37-cfd5-4e84-8887-5be95dae7d27	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	1 כף או 15 גרם סוכר	6	2025-06-15 08:56:43.618545+00
d9019a07-14ce-482b-8eb2-8b72fdb74de6	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	למילוי בשר:	7	2025-06-15 08:56:43.618545+00
4a4d3c31-f000-497b-a990-7cf053541f9e	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	400 גרם בשר טחון 	8	2025-06-15 08:56:43.618545+00
7d37ff28-de07-4f3d-838f-61fc76e3f2cb	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	2 בצלים לבנים בינוניים קצוצים דק	9	2025-06-15 08:56:43.618545+00
7a00e9e1-a670-4d87-9a20-c1669fa50110	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	2 גבעולי בצל ירוק קצוץ	10	2025-06-15 08:56:43.618545+00
dbbd9b77-86f8-44e0-9f9c-92bff152f901	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	כפית פלפל שחור טחון	11	2025-06-15 08:56:43.618545+00
e7b40d2c-54f7-44ff-a433-d45e1f9b8783	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	כפית וחצי אורגנו יבש	12	2025-06-15 08:56:43.618545+00
c08e3c1c-701b-421f-92ae-3924f1718e6a	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	כף פפריקה מתוקה	13	2025-06-15 08:56:43.618545+00
a6c98e39-106e-4638-9906-7ef37e59b9fc	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	כפית וחצי מלח	14	2025-06-15 08:56:43.618545+00
25b519ef-2665-4808-b7ac-2ab0b3648ab0	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	2 ביצים קשות קצוצות (אופציונלי)	15	2025-06-15 08:56:43.618545+00
f4317e8e-b05e-4904-a0f4-80083f0bd236	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	12 זיתים ירוקים מגולענים (אופציונלי)	16	2025-06-15 08:56:43.618545+00
664c0824-b758-4d82-af75-7e0c4a3b8a4b	a1e04ed7-eb6b-491c-9231-aff7e31ab114	3 ביצים	1	2025-06-15 09:23:27.816303+00
5807f4ec-336f-4a95-9de9-bcc454e390c0	a1e04ed7-eb6b-491c-9231-aff7e31ab114	1 חבילה קטנה של קמח תופח 	2	2025-06-15 09:23:27.816303+00
ad1a2b50-40ae-42c7-b86d-23f82f63426e	a1e04ed7-eb6b-491c-9231-aff7e31ab114	1 גביע קוטג'	3	2025-06-15 09:23:27.816303+00
258d8e1f-56c4-498f-81e2-abd87b1c279b	a1e04ed7-eb6b-491c-9231-aff7e31ab114	750 גרם גבינה לבנה	4	2025-06-15 09:23:27.816303+00
d5d24a2a-0855-43cf-8fa3-d2baa77c90db	a1e04ed7-eb6b-491c-9231-aff7e31ab114	100 גרם חמאה	5	2025-06-15 09:23:27.816303+00
e4677d8e-8cf6-4407-9b10-eba391243202	a1e04ed7-eb6b-491c-9231-aff7e31ab114	גבינה צהובה מגורדת	6	2025-06-15 09:23:27.816303+00
e777a367-642e-4562-a8b1-94236b46ccd8	a1e04ed7-eb6b-491c-9231-aff7e31ab114	1/2 גבינה מלוחה	7	2025-06-15 09:23:27.816303+00
5b21558e-2507-49b4-8a7f-06c77d1887ea	a1e04ed7-eb6b-491c-9231-aff7e31ab114	זיתים/ תירס/ פטריות (מה שרוצים)	8	2025-06-15 09:23:27.816303+00
c9d7b382-5da0-4fa2-bebb-690ae9b19bba	0f9bd181-fe54-4d53-abda-91d8dfd512a6	1 כף שטוחה מלח דק	7	2025-06-15 19:16:47.577376+00
d6af602b-f93c-4bb6-a0b0-dfa98d0e8574	0f9bd181-fe54-4d53-abda-91d8dfd512a6	לציפוי: 	8	2025-06-15 19:16:47.577376+00
0bd9ade7-ee2b-4ef2-af76-e892f427c421	0f9bd181-fe54-4d53-abda-91d8dfd512a6	מים	9	2025-06-15 19:16:47.577376+00
ca0537c6-39cf-4077-acd1-7703017a2748	0f9bd181-fe54-4d53-abda-91d8dfd512a6	שומשום	10	2025-06-15 19:16:47.577376+00
23e73d2a-15d0-4a7a-bfb4-6196b2a7acf9	0f9bd181-fe54-4d53-abda-91d8dfd512a6	להברשה:	11	2025-06-15 19:16:47.577376+00
f6a5891b-7127-4dd0-b1a7-8482be0b27ca	0f9bd181-fe54-4d53-abda-91d8dfd512a6	6-4 כפות שמן זית	12	2025-06-15 19:16:47.577376+00
340bf358-2bc6-4cf4-a077-e46e838f63a5	0f9bd181-fe54-4d53-abda-91d8dfd512a6	½ כפית מלח גס	13	2025-06-15 19:16:47.577376+00
237705c1-5b06-4fa8-8033-cf515c1b07de	e3acd082-27cf-4b87-9605-214a52a4d2de	15 פרליני שוקולד לבן או קוביות שוקולד לבן	11	2025-06-21 09:37:03.292923+00
2a2ae2a9-fbf0-4599-a360-93f50738432c	c8db1945-f069-4728-9ce2-9bcf620d8654	500 גרם שייטל בקר	1	2025-06-21 17:05:54.633263+00
3691bb9d-79dd-4d0e-86bb-a44fe818a0d1	c8db1945-f069-4728-9ce2-9bcf620d8654	1 כפית מלח דק	2	2025-06-21 17:05:54.633263+00
40dbb17b-ebb6-4f94-a0b5-59524dccf2d3	2ccd155c-c6de-4268-993b-cb88e511329e	100 גרם חמאה	1	2025-06-16 07:18:06.075209+00
b426fab4-187d-4edd-b615-13fc9d5145bd	2ccd155c-c6de-4268-993b-cb88e511329e	125 גרם קמח	2	2025-06-16 07:18:06.075209+00
f59352af-8d27-4ea1-95aa-049a82a81ce9	2ccd155c-c6de-4268-993b-cb88e511329e	125 גרם סוכר לבן	3	2025-06-16 07:18:06.075209+00
9ffd25f1-8edc-4ecb-92a0-795007310ea1	2ccd155c-c6de-4268-993b-cb88e511329e	160 גרם קמח	4	2025-06-16 07:18:06.075209+00
47f10e57-e8e9-41d1-9bb1-045b9578621c	2ccd155c-c6de-4268-993b-cb88e511329e	125 מ''ל מים 	5	2025-06-16 07:18:06.075209+00
aa587e17-44ad-4a19-948d-eee3f8ba2695	2ccd155c-c6de-4268-993b-cb88e511329e	125 מ''ל חלב	6	2025-06-16 07:18:06.075209+00
04932c71-a411-4ff4-b95e-78372e106084	2ccd155c-c6de-4268-993b-cb88e511329e	100 גרם חמאה	7	2025-06-16 07:18:06.075209+00
9cba1b09-48f1-4da5-b742-4cab6ddacbc7	2ccd155c-c6de-4268-993b-cb88e511329e	1 קורט מלח	8	2025-06-16 07:18:06.075209+00
a2fe89e4-cccb-4447-b15e-8a660f5af7db	2ccd155c-c6de-4268-993b-cb88e511329e	5M או 250 גרם ביצים 	9	2025-06-16 07:18:06.075209+00
2b3d8b70-abd3-494d-929c-5d7bbdc5d0d7	f222aaf0-950c-4c15-917b-66929355c59a	4 חלבונים L, בטמפרטורת החדר	1	2025-06-16 07:19:11.262169+00
344aa689-594f-4c0c-9ea5-a91519f0ad1a	f222aaf0-950c-4c15-917b-66929355c59a	 1/2 1 כוס סוכר לבן	2	2025-06-16 07:19:11.262169+00
e3fc310b-f3a6-4f6a-a1b4-ad0543c806b1	f222aaf0-950c-4c15-917b-66929355c59a	1 כף קורנפלור 	3	2025-06-16 07:19:11.262169+00
78571a82-971e-4474-9d9a-66880309b238	f222aaf0-950c-4c15-917b-66929355c59a	2 כפיות חומץ 5%	4	2025-06-16 07:19:11.262169+00
3bf9b381-c584-4554-9ede-7706e7983dfd	0289752c-26a1-40e9-8ed6-9d839effd98a	(50 עלי גפן טריים או 1 צנצנת עלי גפן משומרים) או ( 1 כרוב גדול) או (1 חבילה של עלי מנגולד)	1	2025-06-16 07:32:43.450214+00
667dbd49-29a4-4e0e-b033-9e4a20a52d19	0289752c-26a1-40e9-8ed6-9d839effd98a	1/2 1 כוס אורז עגול	2	2025-06-16 07:32:43.450214+00
67c82f3d-a2b9-4fe7-81ee-ed5247fb57e5	0289752c-26a1-40e9-8ed6-9d839effd98a	1 בצל קצוץ	3	2025-06-16 07:32:43.450214+00
f5be24f9-8c2f-4cea-86d5-19dac3337818	0289752c-26a1-40e9-8ed6-9d839effd98a	1/2 חבילה פטרוזיליה קצוצה	4	2025-06-16 07:32:43.450214+00
4d932362-ce8d-4bfc-b0d9-14059fc2b465	0289752c-26a1-40e9-8ed6-9d839effd98a	1/2 חבילה עלי נענע קצוצים	5	2025-06-16 07:32:43.450214+00
5255b253-2ac6-4169-9e36-2fbbb3092467	0289752c-26a1-40e9-8ed6-9d839effd98a	2 גבעולים ועלים של סלרי קצוצים (גבעולים בינוניים)	6	2025-06-16 07:32:43.450214+00
b9be5292-1cbc-4b95-a53b-2b5c26b3f858	0289752c-26a1-40e9-8ed6-9d839effd98a	1 עגבניה מגורדת	7	2025-06-16 07:32:43.450214+00
ff33962a-11d9-40df-a86f-a1ffa2b84c56	0289752c-26a1-40e9-8ed6-9d839effd98a	1 לימון קטן סחוט	8	2025-06-16 07:32:43.450214+00
ac0bb009-48d8-418e-9d53-0b99d8133ea9	0289752c-26a1-40e9-8ed6-9d839effd98a	1 כפית רסק עגבניות (מרוכז)	9	2025-06-16 07:32:43.450214+00
06f481de-d4d0-4f9f-ba1f-7b4e655cbfca	0289752c-26a1-40e9-8ed6-9d839effd98a	1 שן שום כתושה	10	2025-06-16 07:32:43.450214+00
206f4d33-c5a6-4dca-b2c1-6e899f7b921d	0289752c-26a1-40e9-8ed6-9d839effd98a	1 כפית פפריקה מתוקה 	11	2025-06-16 07:32:43.450214+00
db0d295e-4d29-4f61-a094-d6bb90b3e2fb	0289752c-26a1-40e9-8ed6-9d839effd98a	2 כפיות מלח	12	2025-06-16 07:32:43.450214+00
68c63ab4-dae9-4684-9143-e22b84925d84	0289752c-26a1-40e9-8ed6-9d839effd98a	1/4 כפית פלפל שחור	13	2025-06-16 07:32:43.450214+00
66324241-0a52-41a9-a35d-e055634bfd41	0289752c-26a1-40e9-8ed6-9d839effd98a	עגבניה פרוסה / 4 עגבניות שרי חצויות	14	2025-06-16 07:32:43.450214+00
0a2bc05f-709b-4098-9291-053c1785ca21	0289752c-26a1-40e9-8ed6-9d839effd98a	4 שיני שום קלופות ופרוסות	15	2025-06-16 07:32:43.450214+00
ecf36624-04c0-4466-a56c-5ac00cd70398	c8db1945-f069-4728-9ce2-9bcf620d8654	1/2 כפית פלפל שחור גרוס	3	2025-06-21 17:05:54.633263+00
fc7dcdf6-8b6d-48ee-8b74-216ae747ba09	c8db1945-f069-4728-9ce2-9bcf620d8654	3 כפות קורנפלור	4	2025-06-21 17:05:54.633263+00
b0e8afac-405d-4a3a-ad0a-0aefa1fc419b	c8db1945-f069-4728-9ce2-9bcf620d8654	400 גרם שעועית ירוקה קפואה	5	2025-06-21 17:05:54.633263+00
29d7c99b-6895-4a85-990b-9cd71cc87ba9	c8db1945-f069-4728-9ce2-9bcf620d8654	3 כפות שמן קנולה	6	2025-06-21 17:05:54.633263+00
73a633d3-8dc9-412f-8e44-7c3dd643636c	c8db1945-f069-4728-9ce2-9bcf620d8654	1 כפית שמן שומשום	7	2025-06-21 17:05:54.633263+00
90d95846-a7c2-44e2-b9e1-ab11b77e5083	c8db1945-f069-4728-9ce2-9bcf620d8654	3 שיני שום	8	2025-06-21 17:05:54.633263+00
3e9becd9-1ee2-44e9-b16c-8fd0e40bddce	c8db1945-f069-4728-9ce2-9bcf620d8654	2 ס"מ שורש ג’ינג’ר	9	2025-06-21 17:05:54.633263+00
945b0dbc-1063-446b-b4c6-36a7dec72b01	c8db1945-f069-4728-9ce2-9bcf620d8654	60 מ"ל רוטב סויה	10	2025-06-21 17:05:54.633263+00
f8ba013a-ef1a-41a3-8b26-fda704151b82	c8db1945-f069-4728-9ce2-9bcf620d8654	1 כף חומץ אורז	11	2025-06-21 17:05:54.633263+00
103cf7ff-20d0-43c4-9e1c-3eeaeb9862f4	c8db1945-f069-4728-9ce2-9bcf620d8654	3 כפות סוכר לבן	12	2025-06-21 17:05:54.633263+00
dd9a3049-6d4d-4526-bdc4-c4c975f67a45	40881640-a230-45d9-ac85-f2383b492d55	בצק:	1	2025-06-24 08:44:04.901925+00
f25eaa76-4051-4e59-b148-40fc8f5831bc	40881640-a230-45d9-ac85-f2383b492d55	312 גרם קמח	2	2025-06-24 08:44:04.901925+00
5b3f3397-c090-4bea-a150-4838b1f5ac24	40881640-a230-45d9-ac85-f2383b492d55	1/2 כף סוכר	3	2025-06-24 08:44:04.901925+00
559dc355-6887-4bc8-8646-76d163611346	40881640-a230-45d9-ac85-f2383b492d55	1/2 כפית מלח	4	2025-06-24 08:44:04.901925+00
ee7f136b-509c-464a-8114-be82f5477499	40881640-a230-45d9-ac85-f2383b492d55	226 גרם חמאה, חתוכה לקוביות 	5	2025-06-24 08:44:04.901925+00
af9e2b3a-b0b1-485f-ba03-0493b9b70e02	40881640-a230-45d9-ac85-f2383b492d55	7-8 כפות מים קרים	6	2025-06-24 08:44:04.901925+00
90f04104-b697-4b51-86d2-45d7e0468759	8d3d3108-9ad5-4403-86e3-ec6740048864	227 גרם חמאה רכה	1	2025-07-18 20:27:26.094376+00
fd7d8a50-2960-4699-9f7a-d05ce38e63e1	8d3d3108-9ad5-4403-86e3-ec6740048864	213 גרם סוכר חום	2	2025-07-18 20:27:26.094376+00
b7905bdb-0600-4dfe-8621-960cc9bf63ac	8d3d3108-9ad5-4403-86e3-ec6740048864	232 גרם סוכר לבן	3	2025-07-18 20:27:26.094376+00
900db154-c48a-4d9b-be77-1588a6f97199	8d3d3108-9ad5-4403-86e3-ec6740048864	2 כפיות תמצית וניל	4	2025-07-18 20:27:26.094376+00
d04a306a-4fd5-4686-bc13-c91b00e6a953	8d3d3108-9ad5-4403-86e3-ec6740048864	2 ביצים גדולות	5	2025-07-18 20:27:26.094376+00
dc4820d2-3273-45b2-814f-0b1430bab5df	8d3d3108-9ad5-4403-86e3-ec6740048864	410 גרם קמח	6	2025-07-18 20:27:26.094376+00
b4cf3876-c9d4-48b1-bdae-19d83c4449de	8d3d3108-9ad5-4403-86e3-ec6740048864	1 כפית סודה לשתייה 	7	2025-07-18 20:27:26.094376+00
a4e6fa19-c312-4ed1-8820-40e37bb53954	8d3d3108-9ad5-4403-86e3-ec6740048864	1/2 כפית אבקת אפייה 	8	2025-07-18 20:27:26.094376+00
12687441-8b9d-4fc4-bd2a-f71e3f041bf9	8d3d3108-9ad5-4403-86e3-ec6740048864	1 כפית מלח	9	2025-07-18 20:27:26.094376+00
de1263ee-c709-4bd1-b59d-dc679fba0f69	8d3d3108-9ad5-4403-86e3-ec6740048864	300 גרם שוקולד צ'יפס	10	2025-07-18 20:27:26.094376+00
3e02713e-b6b3-460f-a3ee-ba8cec49e2a8	ab118767-6c19-496b-9678-26b71f1083f9	200 גרם חמאה רכה	1	2025-07-24 09:24:33.194197+00
c867eff4-4618-45d9-8dbd-404ff757565b	ab118767-6c19-496b-9678-26b71f1083f9	3/4 כוס סוכר לבן	2	2025-07-24 09:24:33.194197+00
078374cf-7448-4125-a40e-3dd32f460493	ab118767-6c19-496b-9678-26b71f1083f9	1 כפית תמצית שקדים 	3	2025-07-24 09:24:33.194197+00
0559d136-a6fc-40e8-947e-42b5c17bbd8d	ab118767-6c19-496b-9678-26b71f1083f9	3/4 2 כוסות קמח	4	2025-07-24 09:24:33.194197+00
e7a88359-81ff-46b3-9a53-6ca6de4b2f98	ab118767-6c19-496b-9678-26b71f1083f9	1 כפית אבקת אפיה	5	2025-07-24 09:24:33.194197+00
c9ca51d9-c86e-4ddc-b6d7-c784d0f49ce8	ab118767-6c19-496b-9678-26b71f1083f9	1 ביצה	6	2025-07-24 09:24:33.194197+00
48d90b6e-bfcb-4cc4-a53c-2eb937d92695	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	2 וחצי ק"ג כתף בקר שלם (נתח מספר 5)	1	2025-08-08 12:28:00.30573+00
d6abb0b7-94de-4b4c-b847-c2b566f62c4c	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	1 כפית מלח גס ופלפל שחור	2	2025-08-08 12:28:00.30573+00
b54987c2-3e95-48ee-a002-a7d7f3da49ac	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	2 כפות שמן זית	3	2025-08-08 12:28:00.30573+00
08473c3e-32af-4258-9f1a-f33720a23de8	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	2 בצלים בינונים קצוצים	4	2025-08-08 12:28:00.30573+00
ecf58d90-d6d7-433a-ae4d-d4f78024e5e2	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	3 גזרים בינונים חתוכים לקוביות	5	2025-08-08 12:28:00.30573+00
9b28c4fe-b1b6-4982-97a7-33359d155ec7	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	1 ענף סלרי אמריקאי	6	2025-08-08 12:28:00.30573+00
3a0d9759-31c9-48e5-8782-dcfe0375f9b4	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	1 סלסלת פטריות שמפניון או פורטבלו	7	2025-08-08 12:28:00.30573+00
146ecaa7-233c-4e5f-bc55-91e0cabaf36b	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	10 שיני שום	8	2025-08-08 12:28:00.30573+00
ebf31a8a-d7d5-4cf1-904b-fd99a173759f	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	1 רוטב עגבניות שימורים של mutti	9	2025-08-08 12:28:00.30573+00
6b5801fc-86f1-4605-9203-35176f738c89	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	חצי כפית מכל אחד מהתבלינים: רוזמרין, תימין ומרווה טריים וקצוצים (לא חובה)	10	2025-08-08 12:28:00.30573+00
2dee615b-ba3b-427e-bb9b-025fe971f9d3	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	1 כף פפריקה מתוקה	11	2025-08-08 12:28:00.30573+00
535d38a0-b12b-4ee3-b0ac-6cf346bf30fd	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	חצי כפית כורכום	12	2025-08-08 12:28:00.30573+00
29a66f6a-fba4-4cf1-91d0-0644581e6ed0	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	2 כפות סילאן/סוכר/דבש	13	2025-08-08 12:28:00.30573+00
635fe63c-589c-44bf-a385-d0724b8f9737	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	1 וחצי - 2 וחצי (360-600 מ"ל) כוסות נוזלים - ייו אדום / מים	14	2025-08-08 12:28:00.30573+00
42accf16-5fb0-4269-8e34-8f6c674f4577	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	1 כפית מלח	15	2025-08-08 12:28:00.30573+00
\.


--
-- Data for Name: recipe_instructions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipe_instructions (id, recipe_id, step_number, description, created_at) FROM stdin;
1e6ee96d-021a-45f6-a96e-cee72532ae4d	f222aaf0-950c-4c15-917b-66929355c59a	1	מקציפים חלבונים ומוסיפים סוכר בהדרגה עד לקצף יציב ומבריק.	2025-06-16 07:19:11.723425+00
d21ece23-d9bf-429e-b0ab-a0c0a1aed731	f222aaf0-950c-4c15-917b-66929355c59a	2	מוסיפים למיקסר קורנפלור וחומץ ומקציפים במהירות מינימלית עד שהתערובת אחידה (או מקפלים ידנית בעזרת מרית).	2025-06-16 07:19:11.723425+00
26c5a522-5de8-4b77-81d1-a5548025bfca	f222aaf0-950c-4c15-917b-66929355c59a	3	מזלפים פבלובות או מניחים ערימות מרנג בעזרת כף ויוצרים שקע באמצע כל ערימה.	2025-06-16 07:19:11.723425+00
ae62a608-037d-4725-9c0a-fef01e2c0099	f222aaf0-950c-4c15-917b-66929355c59a	4	אופים בחום נמוך מאוד 140 מעלות למשך שעה וחצי, עד שהמרנג נפרד בקלות מנייר האפייה.	2025-06-16 07:19:11.723425+00
906cb205-008d-4401-baea-4ca749d1fbd7	582c2583-b27a-4990-a9c2-3ad8ba94f5e7	1	בקערה שמים קמח, שמרים,סוכר, מים ושמן, לשים עד שתקבל בצק אחיד (מומלץ במקסר עם וו גיטרה 	2025-06-14 18:28:38.797319+00
4b231e96-62a8-4c09-9775-25bbe6f17bef	582c2583-b27a-4990-a9c2-3ad8ba94f5e7	2	מוסיפים מלח ולשים עוד 7 דקות 	2025-06-14 18:28:38.797319+00
61adb47a-64a7-4569-aa66-1c8bd91dfcbb	582c2583-b27a-4990-a9c2-3ad8ba94f5e7	3	מחלקים ל-16 כדורים ומתפיחים חצי שעה	2025-06-14 18:28:38.797319+00
fec21425-3fe9-47a2-8adf-bc94da434456	582c2583-b27a-4990-a9c2-3ad8ba94f5e7	4	עושים את הצורה הרצויה	2025-06-14 18:28:38.797319+00
b205c47d-fa02-4d1a-9c3d-5ab04c83804a	ab118767-6c19-496b-9678-26b71f1083f9	1	בקערה ערבבו את כל המצרכים עד לקבלת בצק אחיד.	2025-07-24 09:24:35.18432+00
6b76a188-5d96-46f8-afd8-52941af46a25	ab118767-6c19-496b-9678-26b71f1083f9	2	שימו את הבצק חצי שעה במקרר.	2025-07-24 09:24:35.18432+00
3e6611d6-99a3-4049-b772-816903ccf05a	ab118767-6c19-496b-9678-26b71f1083f9	3	מעצבים, אופים ב180 מעלות 15-20 דקות, שיהיה בהיר יחסית.	2025-07-24 09:24:35.18432+00
d7a5c2b4-83fb-42bc-9ed5-6bd629a5eda5	7518653f-823b-4d29-8055-0a8d7c807003	1	מחממים תנור לחום של 160 מעלות.\n	2025-06-15 19:01:16.241518+00
93266135-512e-4c54-9be2-d5453c85f320	7518653f-823b-4d29-8055-0a8d7c807003	2	בקערה טורפים ביצים, סוכר, שמן, קליפה מגוררת ומיץ תפוזים לתערובת אחידה. מוסיפים קמח ואבקת אפייה וטורפים לאיחוד.	2025-06-15 19:01:16.241518+00
43e81acb-93e8-43b2-a9be-c8c469fafac3	7518653f-823b-4d29-8055-0a8d7c807003	3	משמנים את התבנית ומפזרים מעט סוכר, למניעת הידבקות. משטחים את התערובת בתבנית ואופים כ-40 דקות, עד שהעוגה זהובה וקיסם הננעץ במרכז יוצא כמעט יבש.	2025-06-15 19:01:16.241518+00
afedb3c5-cb07-47ac-8e2c-e244cde707a3	7518653f-823b-4d29-8055-0a8d7c807003	4	מצננים ומקשטים באבקת סוכר.	2025-06-15 19:01:16.241518+00
0d68cb4c-d09f-41f2-b26c-02a8e0826456	03d862ec-8604-4adc-be6d-c4558a106ad7	1	נערבב היטב את הפרגיות עם הרסק, שמן הזית, השום, התבלינים, והלימון וניתן לטעמים להיספג ובינתיים נמשיך בהכנות.	2025-06-15 08:26:04.98265+00
0adc2bae-ecd2-41b4-a6fd-e57cab8a9483	03d862ec-8604-4adc-be6d-c4558a106ad7	2	בסיר שטוח נלהיט את השמן עם הבצל, נוסיף את הסוכר החום, הפלפל השחור וכפית מלח, ונטגן כ-10 דקות, תוך ערבוב מדי פעם, עד שהבצל יזהיב יפה.	2025-06-15 08:26:04.98265+00
23561b67-1151-4294-8ede-ad2f959ae56f	03d862ec-8604-4adc-be6d-c4558a106ad7	3	נוסיף למחול הבצלים את הגזרים המגוררים, נכסה ונבשל 10 דקות על להבה קטנה; מדי פעם נערבב עד שהבצלים והגזרים יצטמצמו ויהפכו לשחומים.	2025-06-15 08:26:04.98265+00
c8a5962b-fc80-498a-9ff5-1185e517fad9	03d862ec-8604-4adc-be6d-c4558a106ad7	4	נוסיף לסיר הלוהט את תערובת הפרגיות, נערבב היטב, ונשחים מכל הצדדים כ-10 דקות.	2025-06-15 08:26:04.98265+00
4de446ad-a9aa-44d8-acbc-943edafc544a	03d862ec-8604-4adc-be6d-c4558a106ad7	5	נסנן את האורז הבסמטי, נוסיף לסיר ונערבב. נוסיף את החומוס ועוד כפית מלח ונערבב.	2025-06-15 08:26:04.98265+00
82b9ad00-1147-4e55-a1d2-3724c136eb9c	03d862ec-8604-4adc-be6d-c4558a106ad7	6	נוסיף לסיר מים, כך שיכסו את תערובת האורז והפרגיות בסנטימטר ונביא לרתיחה. נכסה, ונבשל על להבה נמוכה כ-30 דקות. נכבה. נשאיר על כיריים חמימות עוד 20 דקות ונגיש.	2025-06-15 08:26:04.98265+00
63f24816-3da4-48bc-be61-08c54368b847	0289752c-26a1-40e9-8ed6-9d839effd98a	1	לחמם את השמן במחבת על אש בינונית, להוסיף את הבצל הקצוץ ולטגן עד הזהבה.	2025-06-16 07:32:43.799789+00
5887aa86-788a-42ad-bd84-3cd57a43a7b9	0289752c-26a1-40e9-8ed6-9d839effd98a	2	להניח את הבצל המטוגן בקערה, להוסיף את כל חומרי המילוי ולערבב היטב.	2025-06-16 07:32:43.799789+00
22423069-6d05-4c37-a9e0-d1ecd44ffee4	0289752c-26a1-40e9-8ed6-9d839effd98a	3	אם משתמשים בעלים משומרים להשרות במים, אם הטריים לחלוט במים רותחים.\n(להסתכל באינטרנט איך לחלוט כל סוג אם לא יודעים).	2025-06-16 07:32:43.799789+00
937d9f31-6b8a-4c28-9b76-58d730e7eb41	0289752c-26a1-40e9-8ed6-9d839effd98a	4	לגלגל את העלים.\n(ניתן למצוא שיטות אצל חן במטבח)	2025-06-16 07:32:43.799789+00
f2620410-2558-429a-ad90-2688495c45a1	d1865ca8-21f6-4a46-af56-45dacb0c4198	1	בקערה לגרד את הבצל ותפוח האדמה, לסחוט את כל המיץ ולהוסיף את הבשר.	2025-06-15 09:22:31.68087+00
3b9c9f3f-cd87-48ae-b051-ed754d2be46d	d1865ca8-21f6-4a46-af56-45dacb0c4198	2	להוסיף פטרוזיליה, שום, פירורי לחם, ראס אל חנות וביצה, לשים 2 דקות עד לאיחוד\n(אם דביק להוסיף פירורי לחם)\n	2025-06-15 09:22:31.68087+00
e86d5d49-9138-429a-a8b1-8c328760a3e2	d1865ca8-21f6-4a46-af56-45dacb0c4198	3	עושים כדורים לפי הגודל הרצוי.	2025-06-15 09:22:31.68087+00
b1cee7bd-c331-4bee-8a66-1c67c3fb3ab0	a1e04ed7-eb6b-491c-9231-aff7e31ab114	1	מחממים תנור ל-180 מעלות צלזיוס 	2025-06-15 09:23:28.281732+00
a008685e-b7eb-4159-ace1-e3c7d251c8e8	a1e04ed7-eb6b-491c-9231-aff7e31ab114	2	בקערה מערבבים את כל המצרכים 	2025-06-15 09:23:28.281732+00
cd723722-56cc-448b-8862-d0cf71a57e98	a1e04ed7-eb6b-491c-9231-aff7e31ab114	3	שופכים למנג'טים את הבלילה	2025-06-15 09:23:28.281732+00
5ddc5d7f-00f3-4489-9d9f-ad0b2a00c533	a1e04ed7-eb6b-491c-9231-aff7e31ab114	4	אופים עד להשחמה (קיסם צריך לצאת נקי)	2025-06-15 09:23:28.281732+00
1ed92d88-3414-4c79-8e38-215566867c52	0289752c-26a1-40e9-8ed6-9d839effd98a	5	לסדר בסיר עם העגבניות והשום	2025-06-16 07:32:43.799789+00
9aa9d303-44db-485c-b295-02efbb52c5aa	df9c9dc2-d19e-4a4a-99e4-51e839a498dd	1	מקציפים במיקסר את החמאה עם הסוכר במשך כחצי דקה, מוסיפים את החלמונים ומערבבים. 	2025-06-15 18:38:37.938758+00
6b83be2b-f682-4cd0-9ad0-fac459f32eb7	df9c9dc2-d19e-4a4a-99e4-51e839a498dd	2	מוסיפים תמצית וניל וחלב ומערבבים, מוסיפים את הקמח והקורנפלור ומערבבים במיקסר.	2025-06-15 18:38:37.938758+00
01d53569-eb16-40cb-bea7-976b7b3e00d0	df9c9dc2-d19e-4a4a-99e4-51e839a498dd	3	לאחר מכן לשים מעט עם הידיים עד לקבלת בצק אחיד, רך ונוח לעבודה (אם הבצק יוצא דביק – יש להוסיף מעט קמח תופח. אם הבצק יבש – יש להוסיף כמה כפות חלב בהדרגה ולפי הצורך).	2025-06-15 18:38:37.938758+00
862877d0-5e6b-4267-9b34-a25570359938	df9c9dc2-d19e-4a4a-99e4-51e839a498dd	4	מחממים תנור מראש ל175 מעלות.	2025-06-15 18:38:37.938758+00
1d1b9baf-949e-4071-a8e8-a4c930c890e9	df9c9dc2-d19e-4a4a-99e4-51e839a498dd	5	פורשים נייר אפיה על משטח עבודה ומרדדים את הבצק לעובי של כחצי ס”מ. קורצים עיגולים בקוטר של כ-4 ס”מ (בעזרת קורצן עוגיות או כוס קטנה הפוכה). מרפדים את תבנית התנור בנייר אפיה ומניחים את העוגיות במרווחים קלים.	2025-06-15 18:38:37.938758+00
a9f20dd4-f184-48cd-a22d-5130019f0662	c2f31ffd-8a17-45cf-96a2-4871acfd39ea	1	מערבבים את החומרים היבשים בקערה - הקמח, אבקת האפייה, הסוכר והמלח.\n	2025-06-15 18:45:29.099191+00
54d1b78f-4067-4ec2-8bd9-44f248a87a8c	c88a275f-c6ad-44bb-9a38-cb514a627ac7	1	מחממים תנור ל-180 מעלות צלזיוס ומשמנים היטב תבנית עגולה בקוטר 24 ס"מ.	2025-06-15 08:30:28.098761+00
3223e033-256b-4433-baef-8100e4b6fa88	c88a275f-c6ad-44bb-9a38-cb514a627ac7	2	בקערה מערבבים את כל המרכיבים לפי הסדר.	2025-06-15 08:30:28.098761+00
c5df51f0-d3fd-4aa3-932c-56b88cb4b889	c88a275f-c6ad-44bb-9a38-cb514a627ac7	3	יוצקים את הבלילה לתבנית המשומנת ואופים במשך 30-35 דקות. העוגה מוכנה כאשר קיסם הננעץ במרכזה יוצא עם פירורים לחים.	2025-06-15 08:30:28.098761+00
da4aaa60-127c-474e-813d-17c08493e9fc	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	1	לבצק:\n	2025-06-15 08:56:43.973599+00
62dbf9c4-ed7f-440e-95b2-35b7e6122a1d	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	2	לשים את כל החומרים לבצק אחיד חלק ומבריק.	2025-06-15 08:56:43.973599+00
eb799399-44b9-4a00-b3ac-bf626ce55e1a	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	3	מחלקים ל-12 כדורים (כ-50 גרם ליחידה).	2025-06-15 08:56:43.973599+00
e2c6089c-98f5-40a6-aa9c-b19d3a323bde	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	4	מרדדים כל כדור על משטח מקומח לעובי של סנטימטר אחד. ניתן להכין עיגולי בצק ולהקפיא אותם אך יש לדאוג להפריד בשכבות של ניילון נצמד.	2025-06-15 08:56:43.973599+00
fa20b0af-da66-41d8-b2cd-fd34bb3985d7	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	5	למלוי הבשר:	2025-06-15 08:56:43.973599+00
8823a974-102b-4e6e-ba36-537895f53280	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	6	מטגנים את הבצל עד להשחמה.	2025-06-15 08:56:43.973599+00
17a64bd8-a974-4761-8186-66ccd53ecb03	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	7	מתבלים במלח, פלפל, אורגנו ופפריקה מתוקה.	2025-06-15 08:56:43.973599+00
243ada10-2d56-43ff-84e6-28b351a05ae2	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	8	מוסיפים את הבצל הירוק והבשר. מפוררים את הבשר היטב בעזרת כף עץ.	2025-06-15 08:56:43.973599+00
367b7703-70d4-4be3-a1d5-f17da70de039	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	9	מבשלים על אש נמוכה 40 דקות ומתקנים תיבול במידת הצורך (אם הצטברו נוזלים יש לסנן את המסה).	2025-06-15 08:56:43.973599+00
45d24102-90b4-4632-ae68-cd989918e94c	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	10	מקררים את התערובת ורק אחר כך מוסיפים את הזיתים והביצים הקשות הקצוצות. (אם משתמשים)	2025-06-15 08:56:43.973599+00
b3fbbc55-4d48-437e-b34b-533d16fa0dc9	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	11	ממלאים במלית הרצויה כל עיגול בצק, מקפלים ומהדקים את הקצוות.	2025-06-15 08:56:43.973599+00
ec392880-ee88-4b2a-8234-f7f6eacfca98	223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	12	מטגנים בשמן בחום בינוני כ- 160 מעלות עד שיצוף ויזהיב או אופים בתנור שחומם מראש ל-180 עד לקבלת צבע זהוב.	2025-06-15 08:56:43.973599+00
6ab3e0ef-ad5f-4b9b-95f1-4ab215f42912	ba84871b-4323-4738-a0bd-2f3c0cdd0278	1	מכינים ראש עיסה (סטארטר): בקערית מערבבים שמרים כף קמח כף סוכר ו-50 מל חלב חם (מתוך הכמות הכללית של החלב) מערבבים סוגרים בניילון נצמד עד שתוסס ומכפיל נפח (עשרים דקות לערך).	2025-06-15 18:13:07.926588+00
3823800a-b6a3-4202-9671-d96ce1f286fa	ba84871b-4323-4738-a0bd-2f3c0cdd0278	2	במיקסר מערבבים יחד את הראש עיסה עם כל החומרים מלבד החמאה. מתחילים את הלישה עם וו לישה כחמש דקות, מחליפים לוו גיטרה ומוסיפים את החמאה הרכה חתוכה לקוביות.	2025-06-15 18:13:07.926588+00
1d7f8081-11bc-4f82-844e-880a3d53e8f9	ba84871b-4323-4738-a0bd-2f3c0cdd0278	3	לשים עשר עד חמש עשרה דק, עד כאשר הבצק רך מאוד וגמיש (בסוף הלישה הבצק לא חייב להתגבש לכדור).	2025-06-15 18:13:07.926588+00
9c297502-9b75-4d65-9d94-a6c410473e59	ba84871b-4323-4738-a0bd-2f3c0cdd0278	4	מתפיחים שעה בטמפרטורת החדר וחצי שעה נוספת במקרר.	2025-06-15 18:13:07.926588+00
5e3ba273-73e4-4b60-873b-5e1aa722f593	ba84871b-4323-4738-a0bd-2f3c0cdd0278	5	מחממים תנור לחום של 180 מעלות.	2025-06-15 18:13:07.926588+00
9e26b43d-57e9-4472-9cbb-84327dd1b163	ba84871b-4323-4738-a0bd-2f3c0cdd0278	6	מחלקים את הבצק לכדורים, מסדרים בתבנית ומתפיחים חצי שעה נוספת.	2025-06-15 18:13:07.926588+00
d799ce39-db1d-478b-8b1c-da0c1df00044	ba84871b-4323-4738-a0bd-2f3c0cdd0278	7	טורפים חלמון אחד וכף חלב, מברישים את הכדורים התפוחים ומעבירים לתנור 30 דקות אפייה עד להשחמה.\n(מפזרים את הסוכר הגבישים לאחר ההברשה)	2025-06-15 18:13:07.926588+00
91354324-9b05-4935-8456-e339095d8ef5	df9c9dc2-d19e-4a4a-99e4-51e839a498dd	6	אופים בתנור במשך 9-10 דקות, עד שהעוגיות מתייצבות אך עדיין רכות (העוגיות נותרות בהירות). מוציאים מהתנור ומניחים לעוגיות להתקרר לגמרי.	2025-06-15 18:38:37.938758+00
64cb08eb-414e-4992-b7fb-0e2a42fe7d5a	c2f31ffd-8a17-45cf-96a2-4871acfd39ea	2	בקערה נפרדת מערבבים היטב את הביצה עם החמאה המומסת (והמצוננת מעט) וכוס חלב.	2025-06-15 18:45:29.099191+00
e62c0392-d208-4959-8ce6-219400523124	c2f31ffd-8a17-45cf-96a2-4871acfd39ea	3	יוצקים את החומרים הרטובים אל תערובת הקמח ומערבבים עם כף עץ, רק עד שהחומרים מתאחדים. לא מתרגשים מגושים. אם אתם רוצים בלילה נוזלית יותר, מוסיפים חלק או את כל רבע כוס החלב הנותרת.	2025-06-15 18:45:29.099191+00
388ab7de-8647-43ae-95ea-8444ffcf74b5	c2f31ffd-8a17-45cf-96a2-4871acfd39ea	4	מחממים מחבת גדולה. משמנים אותה עם מעט חמאה או ספריי שמן בטעם חמאה ומנמיכים את האש לבינונית.	2025-06-15 18:45:29.099191+00
31f2ddea-231f-4a03-b652-f871bd116bab	c2f31ffd-8a17-45cf-96a2-4871acfd39ea	5	יוצקים בלילה למחבת (בכמות ובגודל הרצויים לכם) ומטגנים כ-2 דקות עד שנוצרות בועיות אוויר על הצד העליון של הפנקייקס והצד התחתון שלהם משחים. הופכים, מטגנים עוד כדקה ומוצאים לצלחת. ממשיכים כך, עד שהבלילה מסתיימת.	2025-06-15 18:45:29.099191+00
de1b5020-8df6-44a6-a481-1990291eeef8	4ed615e0-1ae7-4ea6-996a-f639513e2b52	1	מחממים את התנור לחום של 180 מעלות ומרפדים את התבנית בנייר אפייה.	2025-06-15 18:46:04.255853+00
44d60954-0a0e-4816-be99-5f19ca78618d	4ed615e0-1ae7-4ea6-996a-f639513e2b52	2	שמים במעבד מזון את כל מרכיבי הבצק ומעבדים עד שמתקבל בצק רך ואחיד. ניתן לקרר את הבצק במקרר במשך חצי שעה לצורך עבודה נוחה יותר.	2025-06-15 18:46:04.255853+00
f85673c5-0d26-4b55-a1a0-3960a3c3b469	4ed615e0-1ae7-4ea6-996a-f639513e2b52	3	מחלקים את הבצק ל-2 חלקים ומעבירים את החלק הראשון על משטח עבודה מרופד בנייר אפייה. משטחים קצת בעזרת הידיים ומכסים בנייר האפייה. מרדדים את הבצק בעזרת מערוך לעובי 3-4 מ”מ.	2025-06-15 18:46:04.255853+00
95828c68-0eef-4c2e-9ba3-7c0ba5e4e7eb	4ed615e0-1ae7-4ea6-996a-f639513e2b52	4	קורצים עוגיות בצורות שונות ומסדרים על גבי תבנית האפייה.	2025-06-15 18:46:04.255853+00
95d57641-7f75-46a5-8465-e0770b4a3d49	4ed615e0-1ae7-4ea6-996a-f639513e2b52	5	אופים כ-10-12 דקות, או עד להזהבה קלה.	2025-06-15 18:46:04.255853+00
5e154152-919e-4b0d-9af0-c1c29f02a3f9	6d50033b-3dfd-4647-92e4-ed6dabbd2045	1	מחממים את התנור לחום 180 מעלות.	2025-06-15 19:05:30.463635+00
ac914306-dc17-4704-8864-923d60ae4086	6d50033b-3dfd-4647-92e4-ed6dabbd2045	2	ממיסים את השוקולד והחמאה בסיר תוך ערבוב לקבלת תערובת חלקה.	2025-06-15 19:05:30.463635+00
cc6e9d21-c42b-4ef6-ad1e-a7ad4ef67ad6	6d50033b-3dfd-4647-92e4-ed6dabbd2045	3	מוסיפים את הסוכר ומערבבים עד שהוא נמס.	2025-06-15 19:05:30.463635+00
acd345cc-1654-484a-8cd5-98be00c09c29	df9c9dc2-d19e-4a4a-99e4-51e839a498dd	7	לאחר שהעוגיות התקררו הופכים את מחציתן ומניחים על כל עוגיה כחצי כפית ממרח ריבת חלב. סוגרים עם עוגיה נוספת (בדומה לסנדוויץ’) ולוחצים קלות מה שגורם לממרח לצאת לשוליים (זה מה שבעצם מסייע להדבקת הקוקוס). מגלגלים כל עוגיה בקוקוס.	2025-06-15 18:38:37.938758+00
1b6da9fd-3bc7-4be2-aa03-92664689adce	df9c9dc2-d19e-4a4a-99e4-51e839a498dd	8	טיפים:\n-לא ניתן להמיר את החמאה בשמן. זה לא ייצא אותו הדבר.\n\n-רצוי להשתמש בממרח ריבת חלב שהוא מוצק ולא נוזלי אחרת כל המילוי עלול לנזול ולגלוש מהעוגיה. אם הממרח נוזלי מומלץ לאחסן אותו לילה לפני במקרר.\n\n-אם אין זמן ניתן לחלק את העבודה. להכין את העוגיות, לצנן לגמרי ולשמור בקופסה אטומה מחוץ למקרר. למחרת למלא בריבת חלב ולצפות בקוקוס.\n\n-העוגיות נשמרות בטמפ’ החדר בקופסה אטומה כ-5 ימים.	2025-06-15 18:38:37.938758+00
59141c8f-0696-4319-af25-ed9f0cd2473b	c8db1945-f069-4728-9ce2-9bcf620d8654	1	מייבשים את רצועות הבשר עם מגבת נייר, מעבירים לקערה ומתבלים במלח ופלפל. מפזרים מעל את הקורנפלור ומערבבים עד שכל הבשר מצופה.	2025-06-21 17:05:54.889954+00
86b44803-3c30-467a-8b5f-6d9f977a7126	c8db1945-f069-4728-9ce2-9bcf620d8654	2	מחממים את שני סוגי השמן במחבת ומקפיצים את השעועית במשך 2 דקות, או עד שהיא מתרככת. מכבים את הלהבה, מסננים את הנוזלים העודפים ושומרים בצד.	2025-06-21 17:05:54.889954+00
382310d3-cc83-4af4-a4c3-b1724fe0da6c	c8db1945-f069-4728-9ce2-9bcf620d8654	3	מחממים עוד קצת שמן במחבת ומקפיצים את רצועות הבשר עד שהן מתחילות להחליף את הצבע ולהזהיב.	2025-06-21 17:05:54.889954+00
fe387dfa-c19a-4d3b-8b92-5460ae794cc6	c8db1945-f069-4728-9ce2-9bcf620d8654	4	מוסיפים את השום, הג’ינג’ר, הסויה, החומץ והסוכר ומערבבים היטב. מקפיצים עד שכל הבשר מצופה ברוטב.	2025-06-21 17:05:54.889954+00
63dc590a-5727-4e00-93fa-a051d165a11d	c8db1945-f069-4728-9ce2-9bcf620d8654	5	מחזירים למחבת את השעועית ומערבבים.	2025-06-21 17:05:54.889954+00
e07d8088-bf78-454f-a5f0-0b8eb130508c	c8db1945-f069-4728-9ce2-9bcf620d8654	6	מפזרים מעל שומשום ומגישים מיד.	2025-06-21 17:05:54.889954+00
1068161d-5ff0-4666-b759-307a13ad8be9	6d50033b-3dfd-4647-92e4-ed6dabbd2045	4	מורידים את הסיר מהאש ומוסיפים את הביצים, אחת אחת, תוך טריפה נמרצת למניעת קרישת הביצים. מוסיפים את הקמח ואת האגוזים תוך ערבוב עדין. 	2025-06-15 19:05:30.463635+00
ea524cf0-cd98-4e3e-9c1c-1cb2e1ffddd2	6d50033b-3dfd-4647-92e4-ed6dabbd2045	5	משטחים את הבלילה בתבנית משומנת ומכניסים לתנור למשך 15 דקות.	2025-06-15 19:05:30.463635+00
d89ac98e-a406-472f-b739-862d0aaa76db	6d50033b-3dfd-4647-92e4-ed6dabbd2045	6	לאחר 15 דקות מכניסים קיסם ובודקים אם הוא יוצא לח ללא בלילה נוזלית. אם כן, מוציאים מהתנור. אם לא, משאירים את התבנית בנור לעוד דקה-שתיים עד להתייצבות.\n\n	2025-06-15 19:05:30.463635+00
145d7764-713b-43fb-83cf-96e45ec0e00f	0f9bd181-fe54-4d53-abda-91d8dfd512a6	1	במיקסר עם וו לישה מערבלים את הקמח, השמרים היבשים והסוכר. מוסיפים את המים, הביצה ושמן הזית לאט–לאט, תוך כדי ערבול. לשים במשך 9-15 דקות במהירות איטית, מוסיפים את המלח ולשים עוד דקה.	2025-06-15 19:16:47.882362+00
2758e747-1911-4fce-93f6-a4fe99c48e05	0f9bd181-fe54-4d53-abda-91d8dfd512a6	2	מעבירים את הבצק לקערה משומנת במעט שמן, מכסים בניילון נצמד ובמגבת ומתפיחים שעה וחצי-שעתיים עד שהבצק מכפיל את נפחו.	2025-06-15 19:16:47.882362+00
f7a03c09-e7ca-4e7f-b9b1-c34a415543aa	0f9bd181-fe54-4d53-abda-91d8dfd512a6	3	מהדקים ארבע רצועות זו לזו בחלק העליון. ממספרים את הרצועות מימין לשמאל, מ-1 ועד 4. כשרצועה תשנה את מיקומה היא תמוספר מחדש על פי מיקומה.	2025-06-15 19:16:47.882362+00
2af8476c-9023-4697-9956-54ce127e572e	0f9bd181-fe54-4d53-abda-91d8dfd512a6	4	מעבירים את רצועה 2 מעל רצועה 4. מעבירים את רצועה 1 מעל רצועה 2. מעבירים את רצועה 3 מעל 1. מעבירים את רצועה 4 מעל רצועה 3. חוזרים על הפעולות שוב מימין ומשמאל עד לקליעת החלה. מהדקים את הקצוות שנותרו.	2025-06-15 19:16:47.882362+00
8cdb42de-65af-49ce-b700-134e84ca0471	0f9bd181-fe54-4d53-abda-91d8dfd512a6	5	מכסים במגבת ומתפיחים 1/2 שעה - שעתיים.	2025-06-15 19:16:47.882362+00
e8ad6280-fda4-4432-8310-3084c49823f0	0f9bd181-fe54-4d53-abda-91d8dfd512a6	6	מחממים תנור ל-220 מעלות.	2025-06-15 19:16:47.882362+00
1a4e1c9f-5323-4325-ad06-65d8c569cf17	0f9bd181-fe54-4d53-abda-91d8dfd512a6	7	אופים 25-20 דקות עד שהחלות משחימות היטב.	2025-06-15 19:16:47.882362+00
a72ca277-194f-4baf-9950-eb6520231f59	0f9bd181-fe54-4d53-abda-91d8dfd512a6	8	בקערה קטנה מערבבים את שמן הזית והמלח הגס. כשהחלות יוצאות מהתנור, מברישים אותן מייד.	2025-06-15 19:16:47.882362+00
bf5f1cde-9e51-42a7-95fe-88284865f3ad	40881640-a230-45d9-ac85-f2383b492d55	1	מניחים קמח, סוכר ומלח בקערת מעבד מזון ומפעילים בפולסים מספר פעמים עד לאיחוד. 	2025-06-24 08:44:05.340655+00
118975af-cd74-4e64-bf7d-3527310d98d6	40881640-a230-45d9-ac85-f2383b492d55	2	מוסיפים את החמאה ומפעילים את התערובת בפולסים עד לקבלת פירורים גסים עם כמה חתיכות בגודל אפונה, ולאחר מכן מפסיקים לערבב. התערובת צריכה להישאר יבשה ואבקתית. 	2025-06-24 08:44:05.340655+00
3e9a4045-5e82-4813-826e-2b117115b868	40881640-a230-45d9-ac85-f2383b492d55	3	הוסיפו 7 כפות מי קרח וטחנו בפולסים רק עד שנוצרים גושים לחים או כדורים קטנים. לחצו חתיכת בצק בין קצות האצבעות ואם הבצק נדבק זה לזה, הוספתם מספיק מים. אם לא, הוסיפו עוד מים, כפית מלאה בכל פעם. היזהרו לא להוסיף יותר מדי מים או לערבב יתר על המידה, שכן הדבר עלול להפוך את הבצק לדביק וקשה לרידוד.	2025-06-24 08:44:05.340655+00
33023827-949f-4911-b801-1b201f467b32	40881640-a230-45d9-ac85-f2383b492d55	4	מעבירים את הבצק למשטח עבודה נקי, ואוספים את הבצק לכדור (הבצק לא אמור להיות חלק ואין ללוש את הבצק). מחלקים את הבצק לשניים ומשטחים ליצירת 2 דיסקיות. מכסים בניילון נצמד ומכניסים למקרר לשעה.	2025-06-24 08:44:05.340655+00
6998e285-8511-4231-b535-cbbb6b6cc622	8d3d3108-9ad5-4403-86e3-ec6740048864	1	מחממים תנור ל-190 מעלות צלזיוס. מרפדים שלוש תבניות אפייה בנייר אפייה ומניחים בצד.\n	2025-07-18 20:27:26.581727+00
09b05c3e-7ce5-410b-81b2-ffdb90847b75	8d3d3108-9ad5-4403-86e3-ec6740048864	2	בקערה בינונית ערבבו קמח, סודה לשתייה, אבקת אפייה ומלח. הניחו בצד	2025-07-18 20:27:26.581727+00
17b41c4e-02e2-4668-9604-060c97d7952b	8d3d3108-9ad5-4403-86e3-ec6740048864	3	בקערה נפרדת הקציפו יחד חמאה וסוכרים עד לאיחוד.	2025-07-18 20:27:26.581727+00
bf608748-edcb-4a3f-ad6d-2f94977ae627	8d3d3108-9ad5-4403-86e3-ec6740048864	4	טורפים פנימה את הביצים והווניל עד לקבלת תערובת בהירה (בערך דקה).	2025-07-18 20:27:26.581727+00
139f7c5f-86e0-4975-8acd-77575b62e49e	8d3d3108-9ad5-4403-86e3-ec6740048864	5	מערבבים פנימה את החומרים היבשים עד לאיחוד.	2025-07-18 20:27:26.581727+00
3fffdbe1-ce09-48b6-9a0d-ca45df17dbdf	8d3d3108-9ad5-4403-86e3-ec6740048864	6	מוסיפים את השוקולד צ'יפס ומערבבים היטב.	2025-07-18 20:27:26.581727+00
d432e71a-a859-4ddb-b2d8-0c101d3ed3fd	8d3d3108-9ad5-4403-86e3-ec6740048864	7	צרו כדורים מהבצק והניחו אותם על התבנית במרווחים. (ניתן להעזר בכף גלידה)	2025-07-18 20:27:26.581727+00
c857f0fb-e958-4dfa-b569-57f3d1903eb2	e3acd082-27cf-4b87-9605-214a52a4d2de	1	בקערת המיקסר עם וו גיטרה נניח חמאה\nבטמפרטורת החדר, סוכר לבן וסוכר חום ונפעיל לאיחוד עד קבלת קרם (ניתן גם לעשות ידנית).	2025-06-21 09:37:03.620652+00
88ca5a23-f264-40a4-a1d2-2b37dc8c1eba	e3acd082-27cf-4b87-9605-214a52a4d2de	2	נוסיף בהדרגה את הביצה עד שנטמעת בתערובת.	2025-06-21 09:37:03.620652+00
69e86787-036e-464f-abd8-040058891646	e3acd082-27cf-4b87-9605-214a52a4d2de	3	ננפה אל הקערה קמח, קקאו, אבקת אפייה, סודה לשתייה, ומלח ונפעיל עד קבלת בצק אחיד ולא יותר.	2025-06-21 09:37:03.620652+00
ecc8afb7-bc57-4557-a960-5f9091bfd3af	e3acd082-27cf-4b87-9605-214a52a4d2de	4	נוסיף את השוקולד הקצוץ ונערבב מעט, נכניס את בצק העוגיות כ20 דקות למקרר.	2025-06-21 09:37:03.620652+00
9b4fd120-98ff-45b6-bc46-1494b3fe8ecc	2ccd155c-c6de-4268-993b-cb88e511329e	1	מכינים את הקרמבל: בקערת מיקסר עם וו גיטרה מערבבים את חומרי הקרמבל עד התגבשות הבצק. ניתן לצבוע בשלב זה את הקרמבל לכל צבע שרוצים באמצעות צבע מאכל ג’ל.	2025-06-16 07:18:06.442252+00
c31b34aa-54c0-4403-9efa-7a7f3437fdf5	2ccd155c-c6de-4268-993b-cb88e511329e	2	מעבירים את בצק הקרמבל בין שני ניירות אפייה, מרדדים לעובי 2 מילימטר ומעבירים למקפיא עד לשימוש.	2025-06-16 07:18:06.442252+00
3e432f7b-c892-479a-a818-9d01e67df0e4	2ccd155c-c6de-4268-993b-cb88e511329e	3	מכינים את הבצק הרבוך: בסיר בינוני מביאים לרתיחה חלב, מים, חמאה ומלח.	2025-06-16 07:18:06.442252+00
bc86e889-b5b5-4aa4-8fef-0c9885be66e8	2ccd155c-c6de-4268-993b-cb88e511329e	4	מוסיפים את הקמח בפעם אחת, מסירים מהאש ובעזרת כף עץ מערבבים היטב כשלוש דקות. הקמח נספג בנוזלים והופך לרביכה, הוא נפרד מדפנות הסיר ומתגבש לבצק.	2025-06-16 07:18:06.442252+00
6cbcd62a-3eeb-403f-910e-fbc273dbe240	2ccd155c-c6de-4268-993b-cb88e511329e	5	מעבירים הבצק למיקסר ובעזרת וו גיטרה מערבבים כשלוש דקות (לצורך צינון הבצק והחדרת הביצים).	2025-06-16 07:18:06.442252+00
44e8d70e-375d-43e6-9cd2-17e486d418b5	2ccd155c-c6de-4268-993b-cb88e511329e	6	מעבירים את המיקסר למהירות בינונית מוסיפים ביצה אחת בכל פעם עד להטמעת הביצים בבצק.	2025-06-16 07:18:06.442252+00
8744327d-74aa-435e-b9c7-4d0709a6b3c0	2ccd155c-c6de-4268-993b-cb88e511329e	7	מעבירים את הבצק לשק זילוף עם צנתר 14 מ”מ, מזלפים גבעות בקוטר 2 ס”מ ובמרחק של לפחות 5 ס”מ אחת מהשניה.	2025-06-16 07:18:06.442252+00
bacb79b8-75ca-4232-9e16-6363eb8a420a	2ccd155c-c6de-4268-993b-cb88e511329e	8	מחממים תנור לחום של 180 מעלות.	2025-06-16 07:18:06.442252+00
b55a6624-086c-40b1-926c-b5f5a30a8713	e3acd082-27cf-4b87-9605-214a52a4d2de	5	בעזרת כף של גלידה נקרוץ כדורים בגודל שווה (40 גרם), נפתח כל כדור במרכז ונחביא בפנים פרלין שוקולד לבן, נסגור ונגלגל לכדור אחיד.	2025-06-21 09:37:03.620652+00
063be579-8539-43c7-98f1-f34fbb286b12	e3acd082-27cf-4b87-9605-214a52a4d2de	6	נסדר תבנית מרופדת בנייר אפייה ונניח במרווחים שווים, נכניס לתנור שחומם מראש 175 מעלות כ9-10 דקות נוציא ונצנן כמה דקות בחוץ שהעוגיות יתייצבו.	2025-06-21 09:37:03.620652+00
ac23f041-cafd-46cd-b8e9-7820874cf1e2	e3acd082-27cf-4b87-9605-214a52a4d2de	7	דקות נוציא ונצנן כמה דקות בחוץ שהעוגיות יתייצבו.\n\n(הן אמורות להיות רכות כשיוצאות מהתנור ולאחר מספר דקות מתייצבות).	2025-06-21 09:37:03.620652+00
51217922-3a50-4ad0-bf75-5ffe688c568d	8d3d3108-9ad5-4403-86e3-ec6740048864	8	אופים בתנור שחומם מראש כ-8-10 דקות. מוציאים אותן כשהן בקושי מתחילות להשחים.	2025-07-18 20:27:26.581727+00
aa83df51-db5e-4f01-8b81-62d1da3aa417	8d3d3108-9ad5-4403-86e3-ec6740048864	9	הניחו להם לנוח על תבנית האפייה במשך 5 דקות לפני שמוציאים לרשת קירור.	2025-07-18 20:27:26.581727+00
da962605-d7c7-457e-93a4-02175a425b8c	2ccd155c-c6de-4268-993b-cb88e511329e	9	מוציאים את בצק הקרמבל מהמקפיא, קורצים עיגולים בקוטר 4 ס”מ, מניחים כל דיסקית בצק פריך מעל פחזנייה ולוחצים בעדינות.	2025-06-16 07:18:06.442252+00
37425703-caca-41a4-94d1-1560d5ed7e5a	2ccd155c-c6de-4268-993b-cb88e511329e	10	ומעבירים לתנור ל-20 דקות אפייה, ולאחר מכן מנמיכים את הטמפרטורה ל-160 ואופים 15 דקות נוספות.	2025-06-16 07:18:06.442252+00
f3fdddd9-8129-40e8-999b-62375d635972	2ccd155c-c6de-4268-993b-cb88e511329e	11	מצננים את הפחזניות וממלאים כל פחזנייה בכל קרם שאוהבים.	2025-06-16 07:18:06.442252+00
61e2d851-4f9b-45df-8d6a-d9cedd1d6b4d	2ccd155c-c6de-4268-993b-cb88e511329e	12	אפשר לקטום את השליש העליון של הפחזנייה, לזלף קרם או גנאש מוקצף ולהצמיד את הכיפה הקטומה חזרה מעל הזילוף.	2025-06-16 07:18:06.442252+00
d9547acb-253f-4b01-a047-c0daca2e1744	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	1	מחממים את התנור ל-170 מעלות.\n\n	2025-08-08 12:28:00.581004+00
34c40c48-a05d-485f-b324-f27e20c8c8a0	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	2	ממליחים קלות (לא יותר מכפית מלח גס לכל הנתח) ומפלפלים את נתח הבשר.	2025-08-08 12:28:00.581004+00
bdd22c12-eb7a-4d41-b381-6a79d86a64c0	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	3	מוזגים 2 כפות שמן זית לסיר רחב ומטגנים את הבצלים. מוסיפים גזר וסלרי ומטגנים היטב. מוסיפים פטריות חתוכות ובסוף את שיני השום הקצוצות. שימו לב לא לטגן יותר מדי, כדי שהשום לא יישרף.	2025-08-08 12:28:00.581004+00
e925ee81-00db-4394-b8c7-57fb59921bc0	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	4	מוסיפים את העגבניות ואת הרוזמרין, התימין, המרווה ועלי הסלרי (כדאי לטעום קודם ואם הם מרים - לוותר). מוסיפים גם פפריקה, כורכום וסילאן ומטגנים היטב.	2025-08-08 12:28:00.581004+00
30b6eb84-9bf1-497b-b178-0e87b54b925b	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	5	מוסיפים מים ומלח (חצי כפית מלח לכל כוס מים) ומביאים לרתיחה. טועמים את הרוטב ומתקנים את התיבול לפי הטעם האישי. אפשר להוסיף עוד פלפל שחור או פפריקה חריפה או עוד סילאן/דבש למתיקות.	2025-08-08 12:28:00.581004+00
d197a97e-ce60-45d1-a551-f44c5d9278cb	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	6	שופכים מחצית מהרוטב לתבנית בה נכין את הבשר, שמים את הבשר ואחריו עוד מחצית מהרוטב. מכסים במכסה (או נייר כסף) ומעבירים לתנור למשך 4 שעות. כעבור שעתיים, הופכים את הנתח.	2025-08-08 12:28:00.581004+00
b616757d-7da0-4d5c-9d9a-6614d308f7df	ebe8505b-fde2-44fa-ae5a-f775dbfa08af	7	אחרי 4 שעות, מסירים את המכסה ומעלים את טמפרטורת התנור ל-230 מעלות כדי שהנתח יושחם. במהלך ההשחמה רצוי להרטיב את הנתח עם הרוטב. מוציאים מהתנור, פורסים לפרוסות ומגישים עם הרוטב.   	2025-08-08 12:28:00.581004+00
\.


--
-- Data for Name: recipe_sauce_ingredients; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipe_sauce_ingredients (id, recipe_id, description, sort_order, created_at) FROM stdin;
f115cac0-7c51-4b61-8fc0-b457ec5ff860	582c2583-b27a-4990-a9c2-3ad8ba94f5e7	2 ליטר מים	1	2025-06-14 18:28:39.300564+00
abfdd088-731c-4620-8766-1494dcc1f238	582c2583-b27a-4990-a9c2-3ad8ba94f5e7	2 כפות סודה לשתיה	2	2025-06-14 18:28:39.300564+00
23d6aac4-23c4-41b4-956f-196c749f88fc	582c2583-b27a-4990-a9c2-3ad8ba94f5e7	1/4 כוס סילאן	3	2025-06-14 18:28:39.300564+00
725f437d-bce8-49f2-9031-a246653f413c	c88a275f-c6ad-44bb-9a38-cb514a627ac7	שוקולד מריר 200 גרם	1	2025-06-15 08:30:28.649288+00
cbe4a93a-c967-4a8a-be29-01b436a559c4	c88a275f-c6ad-44bb-9a38-cb514a627ac7	1 חבילה שמנת מתוקה 	2	2025-06-15 08:30:28.649288+00
a20331da-6174-48a8-8276-3c07a34c756e	d1865ca8-21f6-4a46-af56-45dacb0c4198	1/2 בצל קצוץ	1	2025-06-15 09:22:32.018442+00
8e8a4cca-368e-41ec-963c-73076b28940f	d1865ca8-21f6-4a46-af56-45dacb0c4198	2 כפות שמן	2	2025-06-15 09:22:32.018442+00
0bb2b72c-67c2-4ae3-8625-b182bc5b38c8	d1865ca8-21f6-4a46-af56-45dacb0c4198	2 שיני שום קצוצות	3	2025-06-15 09:22:32.018442+00
0e7980db-029e-41ac-861a-6ee68d98241c	d1865ca8-21f6-4a46-af56-45dacb0c4198	2 כפות רסק עגבניות (מרוכז)	4	2025-06-15 09:22:32.018442+00
1e850cd3-f86b-4b16-bda9-46102e4f3963	d1865ca8-21f6-4a46-af56-45dacb0c4198	1 כפית בהרט	5	2025-06-15 09:22:32.018442+00
e3a99672-c126-4de2-ad8c-30dfa90b85dd	d1865ca8-21f6-4a46-af56-45dacb0c4198	1 כפית מלח	6	2025-06-15 09:22:32.018442+00
49157430-c763-4228-925f-96eb6589377d	d1865ca8-21f6-4a46-af56-45dacb0c4198	1 כפית סוכר	7	2025-06-15 09:22:32.018442+00
5b5eab6a-d8be-4cb5-b261-a1f8c6574de8	d1865ca8-21f6-4a46-af56-45dacb0c4198	1 קופסא רסק עגבניות מוטי	8	2025-06-15 09:22:32.018442+00
02ea9e83-c07e-4995-8fde-7452fb6e0199	d1865ca8-21f6-4a46-af56-45dacb0c4198	1/2 1 מים+ 1 כפית גדושה אבקת מרק	9	2025-06-15 09:22:32.018442+00
a4279211-4b1a-401b-b492-08c3d25735c1	d1865ca8-21f6-4a46-af56-45dacb0c4198	אורגנו טרי (אופציונלי)	10	2025-06-15 09:22:32.018442+00
ce355f25-373c-47a5-a75a-a6804a8d0db6	f222aaf0-950c-4c15-917b-66929355c59a	250 מ''ל שמנת מתוקה 	1	2025-06-16 07:19:12.348077+00
621bc819-ebd3-4a3d-a132-42a203f06e6d	f222aaf0-950c-4c15-917b-66929355c59a	1 כף סוכר לבן	2	2025-06-16 07:19:12.348077+00
ff4e78a0-bf1d-4eff-b039-be42673f1255	f222aaf0-950c-4c15-917b-66929355c59a	רוטב פירות יער	3	2025-06-16 07:19:12.348077+00
e959b0a0-8878-4eb9-a2d0-4e4f461789fb	0289752c-26a1-40e9-8ed6-9d839effd98a	1/4 כוס מיץ לימון	1	2025-06-16 07:32:44.13138+00
14592c1d-9526-45fa-9f53-a98a013f677e	0289752c-26a1-40e9-8ed6-9d839effd98a	1/4 כוס שמן	2	2025-06-16 07:32:44.13138+00
1f167ae6-30e8-4169-9e61-9c265d2f467a	0289752c-26a1-40e9-8ed6-9d839effd98a	1 כף סילאן 	3	2025-06-16 07:32:44.13138+00
ce1f2d07-5f05-49ec-85dd-0ec7392bfd98	0289752c-26a1-40e9-8ed6-9d839effd98a	1 כפית מלח	4	2025-06-16 07:32:44.13138+00
a5df7fb0-399a-4295-b26f-6915c8f5fa11	0289752c-26a1-40e9-8ed6-9d839effd98a	1/4 כפית פלפל שחור	5	2025-06-16 07:32:44.13138+00
9fa5d92e-6219-4cea-ab0b-485ff3efdfbb	0289752c-26a1-40e9-8ed6-9d839effd98a	כוס מים רותחים 	6	2025-06-16 07:32:44.13138+00
\.


--
-- Data for Name: recipe_sauces; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipe_sauces (id, recipe_id, step_number, description, created_at) FROM stdin;
c0f9959d-1d06-4489-bde6-400b2d60c476	582c2583-b27a-4990-a9c2-3ad8ba94f5e7	1	שמים את כל המצרכים בסיר ומביאים לרתיחה 	2025-06-14 18:28:39.803257+00
005cecd7-ef48-49e4-b46a-4b0e487fe33f	582c2583-b27a-4990-a9c2-3ad8ba94f5e7	2	מורידים הלהבה לאש נמוכה שמכניסים אתל הבייגלה למים למשך 40 שניות	2025-06-14 18:28:39.803257+00
9611f01f-5c98-4009-be35-1e151e8d2afd	582c2583-b27a-4990-a9c2-3ad8ba94f5e7	3	טובלים את הבייגלה ברוטב ואופים  בתנור שחומם ל- 210 מעלות עד הזהבה.	2025-06-14 18:28:39.803257+00
66604fb4-2919-449a-b408-308147fef5a7	c88a275f-c6ad-44bb-9a38-cb514a627ac7	1	המס את השוקולד והשמנת בבן מארי עד לקבלת תערובת אחידה	2025-06-15 08:30:29.16428+00
a0447404-65d7-4c6a-a6b9-e58a692d6cdd	c88a275f-c6ad-44bb-9a38-cb514a627ac7	2	שפוך על העוגה, בתיאבון	2025-06-15 08:30:29.16428+00
09d9283e-b039-4003-9689-0782c23bd116	d1865ca8-21f6-4a46-af56-45dacb0c4198	1	בסיר מטגנים בצל, מוסיפים את התבלינים ומערבבים לאיחוד.	2025-06-15 09:22:32.364555+00
986a8ac2-a543-41f8-85a7-170585259177	d1865ca8-21f6-4a46-af56-45dacb0c4198	2	מוסיפים את רסק העגבניות והמים, מביאים לרתיחה.	2025-06-15 09:22:32.364555+00
637caa0a-bb56-4bc0-9936-4a3c8614bfbf	d1865ca8-21f6-4a46-af56-45dacb0c4198	3	מסדרים את הקציצות, מנמיכים את האש לאש נמוכה, סוגרים את המכסה ומבשלים 45-60 דקות	2025-06-15 09:22:32.364555+00
311e9131-f507-4221-aa8e-4285c4d141f8	f222aaf0-950c-4c15-917b-66929355c59a	1	להקציף בקערה את כל המצרכים עד לקבלת קצף יציב	2025-06-16 07:19:12.850345+00
5249b028-87b7-44fa-a42c-1eee2e2e4ef3	f222aaf0-950c-4c15-917b-66929355c59a	2	מניחים מעל כל פבלובה קצפת ורוטב פירות יער	2025-06-16 07:19:12.850345+00
4bbc2b05-3f0f-4b14-b692-440530522b18	0289752c-26a1-40e9-8ed6-9d839effd98a	1	לערבב ביחד את כל מרכיבי הרוטב\nולשפוך מעל הממולאים. אם הרוטב לא מכסה את העלים להוסיף מים רותחים	2025-06-16 07:32:44.533991+00
b91ea4d3-ae53-4580-9534-fd39ef1ecd4b	0289752c-26a1-40e9-8ed6-9d839effd98a	2	לשים את הסיר על אש גבוהה ולהביא לרתיחה. כשרותח, לכסות את הסיר ולהעביר לאש הכי נמוכה. לבשל כשעה, עד שלא נשארים נוזלים בסיר.	2025-06-16 07:32:44.533991+00
23ff4528-e54e-4cc9-9ed7-2378252b6b40	0289752c-26a1-40e9-8ed6-9d839effd98a	3	מומלץ לחכות שהממולאים התקררו מעט והכי מומלץ לאכול אותם ביום למחרת.\n 	2025-06-16 07:32:44.533991+00
\.


--
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.recipes (id, name, description, image_url, category_id, created_at, updated_at, recommended) FROM stdin;
8d3d3108-9ad5-4403-86e3-ec6740048864	עוגיות שוקולד צ'יפס	עוגיות נימוחות עם המון שוקולד צ'יפס טעים	/lovable-uploads/4987dbcd-1e75-4507-80c7-b7fc9ca1f7ee.png	bd87c226-d7d4-42cf-be83-d20f8694ba78	2025-06-14 11:22:52.056291+00	2025-06-14 11:22:52.056291+00	t
223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9	אמפנדס בשר (12 יחידות)	\N	https://ztjtvmxlrlwxilknbdtr.supabase.co/storage/v1/object/public/recipe-images/f263d2e9-1ada-4d6b-9294-290dddce08f7/223b65cd-ce9e-41b8-9f0f-a44b8f60d0a9-1749977802361.webp	a10a0c75-44cf-481c-b2ce-c0f9cd52fa44	2025-06-15 08:54:26.417665+00	2025-06-15 08:54:26.417665+00	f
582c2583-b27a-4990-a9c2-3ad8ba94f5e7	בייגלה	\N	https://ztjtvmxlrlwxilknbdtr.supabase.co/storage/v1/object/public/recipe-images/f263d2e9-1ada-4d6b-9294-290dddce08f7/582c2583-b27a-4990-a9c2-3ad8ba94f5e7.jpeg	a9695e1a-2263-46ab-bc6e-af15528e03b7	2025-06-14 18:05:43.615486+00	2025-06-14 18:05:43.615486+00	f
d1865ca8-21f6-4a46-af56-45dacb0c4198	קציצות ברוטב עגבניות	\N	https://ztjtvmxlrlwxilknbdtr.supabase.co/storage/v1/object/public/recipe-images/f263d2e9-1ada-4d6b-9294-290dddce08f7/d1865ca8-21f6-4a46-af56-45dacb0c4198-1749979350414.jpg	a10a0c75-44cf-481c-b2ce-c0f9cd52fa44	2025-06-15 09:11:24.934261+00	2025-06-15 09:11:24.934261+00	f
a1e04ed7-eb6b-491c-9231-aff7e31ab114	מאפה גבינות 	\N	https://ztjtvmxlrlwxilknbdtr.supabase.co/storage/v1/object/public/recipe-images/f263d2e9-1ada-4d6b-9294-290dddce08f7/a1e04ed7-eb6b-491c-9231-aff7e31ab114-1749974526287.jpg	a9695e1a-2263-46ab-bc6e-af15528e03b7	2025-06-15 07:58:33.771866+00	2025-06-15 07:58:33.771866+00	f
e3acd082-27cf-4b87-9605-214a52a4d2de	עוגיות אמסטרדם 	העוגיות החלומיות מאמסטרדם	https://ztjtvmxlrlwxilknbdtr.supabase.co/storage/v1/object/public/recipe-images/f263d2e9-1ada-4d6b-9294-290dddce08f7/e3acd082-27cf-4b87-9605-214a52a4d2de-1750062610282.jpg	bd87c226-d7d4-42cf-be83-d20f8694ba78	2025-06-16 08:28:13.714494+00	2025-06-16 08:28:13.714494+00	f
ba84871b-4323-4738-a0bd-2f3c0cdd0278	בריוש	\N	https://ztjtvmxlrlwxilknbdtr.supabase.co/storage/v1/object/public/recipe-images/f263d2e9-1ada-4d6b-9294-290dddce08f7/ba84871b-4323-4738-a0bd-2f3c0cdd0278.jpg	bd87c226-d7d4-42cf-be83-d20f8694ba78	2025-06-15 18:13:06.030831+00	2025-06-15 18:13:06.030831+00	f
df9c9dc2-d19e-4a4a-99e4-51e839a498dd	אלפחורס ( חלמונים מיותרים)	\N	https://ztjtvmxlrlwxilknbdtr.supabase.co/storage/v1/object/public/recipe-images/f263d2e9-1ada-4d6b-9294-290dddce08f7/df9c9dc2-d19e-4a4a-99e4-51e839a498dd.jpg	bd87c226-d7d4-42cf-be83-d20f8694ba78	2025-06-15 18:37:41.948457+00	2025-06-15 18:37:41.948457+00	f
2ccd155c-c6de-4268-993b-cb88e511329e	פחזניות קראמבל עם קרם פטיסייר (חלמונים מיותרים)	\N	https://ztjtvmxlrlwxilknbdtr.supabase.co/storage/v1/object/public/recipe-images/f263d2e9-1ada-4d6b-9294-290dddce08f7/2ccd155c-c6de-4268-993b-cb88e511329e-1749975212534.jpg	bd87c226-d7d4-42cf-be83-d20f8694ba78	2025-06-14 16:13:41.220449+00	2025-06-14 16:13:41.220449+00	f
03d862ec-8604-4adc-be6d-c4558a106ad7	תבשיל אורז ופרגיות 	\N	https://ztjtvmxlrlwxilknbdtr.supabase.co/storage/v1/object/public/recipe-images/f263d2e9-1ada-4d6b-9294-290dddce08f7/03d862ec-8604-4adc-be6d-c4558a106ad7.jpg	a10a0c75-44cf-481c-b2ce-c0f9cd52fa44	2025-06-15 08:26:03.111122+00	2025-06-15 08:26:03.111122+00	f
c88a275f-c6ad-44bb-9a38-cb514a627ac7	עוגת שוקולד עשירה	עוגת שוקולד קלאסית, עשירה ונימוחה שכולם אוהבים. מושלמת לכל אירוע או סתם כשמתחשק משהו מתוק ומפנק.	https://ztjtvmxlrlwxilknbdtr.supabase.co/storage/v1/object/public/recipe-images/c88a275f-c6ad-44bb-9a38-cb514a627ac7-1749907132488.jpg	bd87c226-d7d4-42cf-be83-d20f8694ba78	2025-06-14 12:21:01.136918+00	2025-06-14 12:21:01.136918+00	f
c2f31ffd-8a17-45cf-96a2-4871acfd39ea	פנקייקים (14 בקוטר של כ-8-9 ס"מ)	\N	https://ztjtvmxlrlwxilknbdtr.supabase.co/storage/v1/object/public/recipe-images/f263d2e9-1ada-4d6b-9294-290dddce08f7/c2f31ffd-8a17-45cf-96a2-4871acfd39ea.jpg	bd87c226-d7d4-42cf-be83-d20f8694ba78	2025-06-15 18:45:26.193323+00	2025-06-15 18:45:26.193323+00	f
4ed615e0-1ae7-4ea6-996a-f639513e2b52	עוגיות חמאה	\N	https://ztjtvmxlrlwxilknbdtr.supabase.co/storage/v1/object/public/recipe-images/f263d2e9-1ada-4d6b-9294-290dddce08f7/4ed615e0-1ae7-4ea6-996a-f639513e2b52-1750013161660.jpg	bd87c226-d7d4-42cf-be83-d20f8694ba78	2025-06-15 18:22:54.257233+00	2025-06-15 18:22:54.257233+00	f
7518653f-823b-4d29-8055-0a8d7c807003	עוגת תפוזים	\N	https://ztjtvmxlrlwxilknbdtr.supabase.co/storage/v1/object/public/recipe-images/f263d2e9-1ada-4d6b-9294-290dddce08f7/7518653f-823b-4d29-8055-0a8d7c807003.jpeg	bd87c226-d7d4-42cf-be83-d20f8694ba78	2025-06-15 19:01:14.303675+00	2025-06-15 19:01:14.303675+00	f
6d50033b-3dfd-4647-92e4-ed6dabbd2045	בראוניז	\N	https://ztjtvmxlrlwxilknbdtr.supabase.co/storage/v1/object/public/recipe-images/f263d2e9-1ada-4d6b-9294-290dddce08f7/6d50033b-3dfd-4647-92e4-ed6dabbd2045.jpg	bd87c226-d7d4-42cf-be83-d20f8694ba78	2025-06-15 19:05:28.448437+00	2025-06-15 19:05:28.448437+00	f
0f9bd181-fe54-4d53-abda-91d8dfd512a6	חלת בייגלה	\N	https://ztjtvmxlrlwxilknbdtr.supabase.co/storage/v1/object/public/recipe-images/f263d2e9-1ada-4d6b-9294-290dddce08f7/0f9bd181-fe54-4d53-abda-91d8dfd512a6.jpg	a9695e1a-2263-46ab-bc6e-af15528e03b7	2025-06-15 19:16:44.290227+00	2025-06-15 19:16:44.290227+00	f
f222aaf0-950c-4c15-917b-66929355c59a	פבלובה (חלבונים מיותרים)	פבלובה קלאסית, קריספית מבחוץ ורכה כמו מרשמלו מבפנים, עם קצפת וניל ופירות יער טריים.	https://ztjtvmxlrlwxilknbdtr.supabase.co/storage/v1/object/public/recipe-images/42d54d93-7e50-4169-988c-abe914d4dcc7/f222aaf0-950c-4c15-917b-66929355c59a-1749926068759.jpg	bd87c226-d7d4-42cf-be83-d20f8694ba78	2025-06-14 17:27:29.250042+00	2025-06-14 17:27:29.250042+00	f
c8db1945-f069-4728-9ce2-9bcf620d8654	בקר מוקפץ ושעועית ירוקה	מנה מאוזנת וטעימה לארוחת צהריים או ערב, בזמן הכנה קצר במיוחד! רצועות בקר ושעועית ירוקה מוקפצות במחבת עם שום, ג'ינג'ר, סויה ושמן שומשום\n	https://ztjtvmxlrlwxilknbdtr.supabase.co/storage/v1/object/public/recipe-images/42d54d93-7e50-4169-988c-abe914d4dcc7/c8db1945-f069-4728-9ce2-9bcf620d8654-1750525552601.JPG	a10a0c75-44cf-481c-b2ce-c0f9cd52fa44	2025-06-21 09:21:28.34452+00	2025-06-21 09:21:28.34452+00	f
0289752c-26a1-40e9-8ed6-9d839effd98a	עלים ממולאים (מנגולד/כרוב/גפן)	\N	/lovable-uploads/1ccfb5d5-09ee-4b54-8cdc-7af66df9703b.png	a10a0c75-44cf-481c-b2ce-c0f9cd52fa44	2025-06-14 11:22:52.056291+00	2025-06-14 11:22:52.056291+00	t
40881640-a230-45d9-ac85-f2383b492d55	פאי תפוחים	\N	https://ztjtvmxlrlwxilknbdtr.supabase.co/storage/v1/object/public/recipe-images/f263d2e9-1ada-4d6b-9294-290dddce08f7/40881640-a230-45d9-ac85-f2383b492d55-1750754641931.jpg	bd87c226-d7d4-42cf-be83-d20f8694ba78	2025-06-16 07:12:19.663714+00	2025-06-16 07:12:19.663714+00	t
ab118767-6c19-496b-9678-26b71f1083f9	עוגיות מכשיר	\N	\N	bd87c226-d7d4-42cf-be83-d20f8694ba78	2025-07-24 09:17:51.324453+00	2025-07-24 09:17:51.324453+00	f
ebe8505b-fde2-44fa-ae5a-f775dbfa08af	צלי כתף בתנור	צלי כתף רך ומתפרק, ברוטב עשיר עם המון ירקות, שמתבשל בתנור שעות ועוד לא הגענו לחלק הכי טוב: נכון יש את כל הקטע של לצרוב את הנתח במחבת קודם? לא צריך אותו. במתכון הזה משחימים את הבשר בסוף, וזה יוצא אש	https://ztjtvmxlrlwxilknbdtr.supabase.co/storage/v1/object/public/recipe-images/42d54d93-7e50-4169-988c-abe914d4dcc7/ebe8505b-fde2-44fa-ae5a-f775dbfa08af-1750498328890.jpg	a10a0c75-44cf-481c-b2ce-c0f9cd52fa44	2025-06-21 09:27:12.531337+00	2025-06-21 09:27:12.531337+00	f
\.


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- Name: recipe_garnish_ingredients recipe_garnish_ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_garnish_ingredients
    ADD CONSTRAINT recipe_garnish_ingredients_pkey PRIMARY KEY (id);


--
-- Name: recipe_garnish_instructions recipe_garnishes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_garnish_instructions
    ADD CONSTRAINT recipe_garnishes_pkey PRIMARY KEY (id);


--
-- Name: recipe_ingredients recipe_ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_ingredients
    ADD CONSTRAINT recipe_ingredients_pkey PRIMARY KEY (id);


--
-- Name: recipe_instructions recipe_instructions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_instructions
    ADD CONSTRAINT recipe_instructions_pkey PRIMARY KEY (id);


--
-- Name: recipe_sauce_ingredients recipe_sauce_ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_sauce_ingredients
    ADD CONSTRAINT recipe_sauce_ingredients_pkey PRIMARY KEY (id);


--
-- Name: recipe_sauces recipe_sauces_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_sauces
    ADD CONSTRAINT recipe_sauces_pkey PRIMARY KEY (id);


--
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id);


--
-- Name: idx_categories_slug; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_categories_slug ON public.categories USING btree (slug);


--
-- Name: idx_recipe_garnish_ingredients_recipe_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recipe_garnish_ingredients_recipe_id ON public.recipe_garnish_ingredients USING btree (recipe_id);


--
-- Name: idx_recipe_garnishes_recipe_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recipe_garnishes_recipe_id ON public.recipe_garnish_instructions USING btree (recipe_id);


--
-- Name: idx_recipe_ingredients_recipe_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recipe_ingredients_recipe_id ON public.recipe_ingredients USING btree (recipe_id);


--
-- Name: idx_recipe_instructions_recipe_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recipe_instructions_recipe_id ON public.recipe_instructions USING btree (recipe_id);


--
-- Name: idx_recipe_sauce_ingredients_recipe_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recipe_sauce_ingredients_recipe_id ON public.recipe_sauce_ingredients USING btree (recipe_id);


--
-- Name: idx_recipe_sauces_recipe_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recipe_sauces_recipe_id ON public.recipe_sauces USING btree (recipe_id);


--
-- Name: idx_recipes_category_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_recipes_category_id ON public.recipes USING btree (category_id);


--
-- Name: recipe_garnish_ingredients recipe_garnish_ingredients_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_garnish_ingredients
    ADD CONSTRAINT recipe_garnish_ingredients_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;


--
-- Name: recipe_garnish_instructions recipe_garnishes_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_garnish_instructions
    ADD CONSTRAINT recipe_garnishes_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;


--
-- Name: recipe_ingredients recipe_ingredients_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_ingredients
    ADD CONSTRAINT recipe_ingredients_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;


--
-- Name: recipe_instructions recipe_instructions_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_instructions
    ADD CONSTRAINT recipe_instructions_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;


--
-- Name: recipe_sauce_ingredients recipe_sauce_ingredients_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_sauce_ingredients
    ADD CONSTRAINT recipe_sauce_ingredients_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;


--
-- Name: recipe_sauces recipe_sauces_recipe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipe_sauces
    ADD CONSTRAINT recipe_sauces_recipe_id_fkey FOREIGN KEY (recipe_id) REFERENCES public.recipes(id) ON DELETE CASCADE;


--
-- Name: recipes recipes_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE SET NULL;

--
-- PostgreSQL database dump complete
--
