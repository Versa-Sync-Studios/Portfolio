create type public.tech_stack_category as enum (
  'frontend',
  'backend',
  'mobile',
  'database',
  'no_code',
  'tools'
);

alter table public.tech_stack_items
drop constraint if exists tech_stack_items_category_check;

alter table public.tech_stack_items
alter column category type public.tech_stack_category
using category::public.tech_stack_category;
