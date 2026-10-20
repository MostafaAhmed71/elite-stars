-- ========================================================
-- ELITE STARS | نجوم الأسبوع
-- Supabase PostgreSQL Schema & Row Level Security (RLS)
-- ========================================================

-- 1. Create Schools Table
create table if not exists public.schools (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'مدرستنا',
  slogan text not null default 'بيئة ملهمة .. لجيل متميز',
  hero_title text not null default 'نجوم الأسبوع',
  hero_subtitle text not null default 'كوكبة التميز لهذا الأسبوع',
  logo_url text,
  theme_primary text default '#FFD884',
  theme_navy text default '#061325',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Weekly Editions Table
create table if not exists public.weekly_editions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id) on delete cascade,
  title text not null, -- e.g. 'الأسبوع الثامن - الفصل الدراسي الأول 1446هـ'
  week_number integer not null,
  academic_year text not null default '1446هـ',
  is_published boolean default false not null,
  published_at date default current_date,
  total_students integer default 24 not null,
  celestial_quote text default 'كل طالب يضيء بطريقته.. ومعاً نصنع كوكبة من التميز',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- 3. Create Student Recognitions Table
create table if not exists public.student_recognitions (
  id uuid primary key default gen_random_uuid(),
  edition_id uuid references public.weekly_editions(id) on delete cascade not null,
  full_name text not null,
  grade_level text not null, -- e.g. 'الصف الثاني الابتدائي'
  class_name text not null,  -- e.g. '2/ب'
  avatar_url text not null,
  category text not null,    -- e.g. 'التفوق الأكاديمي', 'القيادة والمبادرة'
  cluster_group integer not null default 1 check (cluster_group between 1 and 4),
  recognition_reason text not null,
  badges text[] default array['القدوة الحسنة', 'مساعدة الآخرين', 'التفوق الأكاديمي'] not null,
  quote text,
  is_featured boolean default false not null,
  pos_x float not null default 50.0,
  pos_y float not null default 50.0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
alter table public.schools enable row level security;
alter table public.weekly_editions enable row level security;
alter table public.student_recognitions enable row level security;

-- 5. Public Access Policies (Parents & Students)
-- Anyone can view school public info
create policy "Public can view school identity"
  on public.schools for select
  using (true);

-- Anyone can view published weekly editions
create policy "Public can view published weekly editions"
  on public.weekly_editions for select
  using (is_published = true);

-- Anyone can view students belonging to published editions
create policy "Public can view published student recognitions"
  on public.student_recognitions for select
  using (
    exists (
      select 1 from public.weekly_editions
      where public.weekly_editions.id = public.student_recognitions.edition_id
      and public.weekly_editions.is_published = true
    )
  );

-- 6. Authenticated School Staff Policies (Admins)
-- Admins can insert, update, delete schools
create policy "Admins have full access to schools"
  on public.schools for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Admins can manage all weekly editions (drafts & published)
create policy "Admins have full access to weekly editions"
  on public.weekly_editions for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Admins can manage student recognitions
create policy "Admins have full access to student recognitions"
  on public.student_recognitions for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- 7. Supabase Storage Setup (Student Portraits Bucket)
insert into storage.buckets (id, name, public)
values ('student-portraits', 'student-portraits', true)
on conflict (id) do nothing;

create policy "Public can read student portraits"
  on storage.objects for select
  using (bucket_id = 'student-portraits');

create policy "Admins can upload student portraits"
  on storage.objects for insert
  with check (
    bucket_id = 'student-portraits'
    and auth.role() = 'authenticated'
  );
