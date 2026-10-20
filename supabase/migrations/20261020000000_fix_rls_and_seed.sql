-- ========================================================
-- ELITE STARS | إصلاح صلاحيات التخزين في قاعدة بيانات سوبابيز
-- قم بنسخ وتشغيل هذا الاستعلام في Supabase SQL Editor
-- ========================================================

-- 1. تعطيل حماية RLS للسماح للتطبيق بالقراءة والكتابة المباشرة
ALTER TABLE IF EXISTS public.schools DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.weekly_editions DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.student_recognitions DISABLE ROW LEVEL SECURITY;

-- 2. في حال الرغبة في إبقاء RLS مفعلة، نمنح صلاحيات كاملة لمفتاح anon:
ALTER TABLE IF EXISTS public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.weekly_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.student_recognitions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow anon all on schools" ON public.schools;
CREATE POLICY "Allow anon all on schools" ON public.schools FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on weekly_editions" ON public.weekly_editions;
CREATE POLICY "Allow anon all on weekly_editions" ON public.weekly_editions FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow anon all on student_recognitions" ON public.student_recognitions;
CREATE POLICY "Allow anon all on student_recognitions" ON public.student_recognitions FOR ALL USING (true) WITH CHECK (true);

-- 3. جعل edition_id يقبل NULL لتجنب أخطاء المفتاح الأجنبي عند حفظ الطلاب مباشرة
ALTER TABLE IF EXISTS public.student_recognitions ALTER COLUMN edition_id DROP NOT NULL;

-- 4. إعداد حاوية تخزين الصور في سوبابيز (Storage Bucket)
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-portraits', 'student-portraits', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can upload portraits" ON storage.objects;
CREATE POLICY "Public can upload portraits"
  ON storage.objects FOR ALL
  USING (bucket_id = 'student-portraits')
  WITH CHECK (bucket_id = 'student-portraits');
