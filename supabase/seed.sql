insert into site_intro (
  id,
  eyebrow,
  headline_line_1,
  headline_line_2,
  intro_label,
  intro_heading,
  intro_body,
  cta_label,
  cta_href,
  work_link_label,
  work_link_href
)
values (
  'site-intro',
  'Nimantha Hewawasam logo',
  'Nimantha',
  'Hewawasam.',
  'Introducing',
  'Software Developer, building digital products for modern businesses.',
  'I design and develop professional web applications, mobile apps, dashboards, automation systems, and AI-powered solutions that help businesses grow with confidence.',
  'View Projects',
  '#projects',
  'My work',
  '#projects'
)
on conflict (id) do update
set
  eyebrow = excluded.eyebrow,
  headline_line_1 = excluded.headline_line_1,
  headline_line_2 = excluded.headline_line_2,
  intro_label = excluded.intro_label,
  intro_heading = excluded.intro_heading,
  intro_body = excluded.intro_body,
  cta_label = excluded.cta_label,
  cta_href = excluded.cta_href,
  work_link_label = excluded.work_link_label,
  work_link_href = excluded.work_link_href;

insert into about_section (id, eyebrow, title, intro, body)
values (
  'about-section',
  'About Me',
  'I build practical, modern, and scalable digital solutions.',
  'I work across interface, backend, database structure, and deployment so clients get systems that are clean to use and ready to operate.',
  'I''m a software developer from Sri Lanka, focused on building web applications, mobile apps, admin dashboards, automation systems, and AI-powered tools for real business needs. My work combines clean UI design, strong backend logic, database structure, and deployment-ready development.'
)
on conflict (id) do update
set
  eyebrow = excluded.eyebrow,
  title = excluded.title,
  intro = excluded.intro,
  body = excluded.body;

insert into contact_section (id, eyebrow, title, body, email, location, availability)
values (
  'contact-section',
  'Let''s Build Something',
  'Have a project idea? Let''s turn it into a professional digital product.',
  'I''m available for web applications, mobile apps, dashboards, CMS platforms, automation systems, and AI-powered solutions.',
  'vidunethnim@gmail.com',
  'Sri Lanka',
  'Open for international freelance projects'
)
on conflict (id) do update
set
  eyebrow = excluded.eyebrow,
  title = excluded.title,
  body = excluded.body,
  email = excluded.email,
  location = excluded.location,
  availability = excluded.availability;

delete from tech_group_items;
delete from tech_groups;
delete from testimonials;
delete from trusted_brands;
delete from why_work_items;
delete from process_steps;
delete from blog_post_categories;
delete from blog_posts;
delete from blog_categories;
delete from blog_settings;
delete from projects;
delete from services;
delete from about_stats;
delete from social_links;

insert into social_links (id, sort_order, label, href, icon_key, is_active)
values
  ('11111111-1111-4111-8111-111111111111', 1, 'GitHub', '#', 'code2', true),
  ('11111111-1111-4111-8111-111111111112', 2, 'LinkedIn', '#', 'briefcaseBusiness', true),
  ('11111111-1111-4111-8111-111111111113', 3, 'Instagram', '#', 'camera', true),
  ('11111111-1111-4111-8111-111111111114', 4, 'Email', 'mailto:vidunethnim@gmail.com', 'mail', true);

insert into about_stats (id, sort_order, label, is_active)
values
  ('22222222-2222-4222-8222-222222222221', 1, '20+ Projects Completed', true),
  ('22222222-2222-4222-8222-222222222222', 2, 'Web, Mobile & AI Solutions', true),
  ('22222222-2222-4222-8222-222222222223', 3, 'Full-Stack Development', true),
  ('22222222-2222-4222-8222-222222222224', 4, 'International Client Ready', true);

insert into services (id, sort_order, title, description, fit, icon_key, is_active)
values
  ('33333333-3333-4333-8333-333333333331', 1, 'Custom Web Applications', 'Modern business websites, portals, dashboards, and full-stack systems.', 'For founders and teams who need a polished product surface.', 'globe2', true),
  ('33333333-3333-4333-8333-333333333332', 2, 'Mobile App Development', 'Cross-platform mobile applications with clean UI and practical features.', 'For ideas that need a reliable mobile experience.', 'smartphone', true),
  ('33333333-3333-4333-8333-333333333333', 3, 'Admin Dashboards', 'Powerful dashboards to manage users, products, bookings, reports, and business operations.', 'For businesses that need control panels and daily workflows.', 'monitorSmartphone', true),
  ('33333333-3333-4333-8333-333333333334', 4, 'AI & Automation Solutions', 'Smart tools, AI workflows, automation systems, and data-driven features.', 'For teams looking to reduce manual work and speed up decisions.', 'bot', true),
  ('33333333-3333-4333-8333-333333333335', 5, 'E-Commerce Development', 'Online stores, product management, payment flows, and order systems.', 'For selling products with clean management and checkout flows.', 'briefcaseBusiness', true),
  ('33333333-3333-4333-8333-333333333336', 6, 'Deployment & Maintenance', 'Hosting setup, CI/CD pipelines, bug fixing, optimization, and long-term support.', 'For projects that need to stay fast, stable, and supported.', 'settings2', true);

insert into projects (id, sort_order, category, title, description, role, problem, tags, is_featured, is_active)
values
  ('44444444-4444-4444-8444-444444444441', 1, 'Web Application', 'StudentStay - Hostel & Boarding Management System', 'A complete hostel and boarding management platform with student, parent, manager, and admin roles.', 'Full-stack product build', 'Multi-role housing operations and communication', array['React', 'Node.js', 'MongoDB', 'Maps', 'JWT'], true, true),
  ('44444444-4444-4444-8444-444444444442', 2, 'Website + CMS', 'Serenity Wedding Films CMS', 'A premium wedding portfolio website with admin content management for videos, testimonials, SEO, and services.', 'Frontend and CMS workflow', 'Editable portfolio content for a visual brand', array['React', 'Supabase', 'CMS', 'Hosting'], false, true),
  ('44444444-4444-4444-8444-444444444443', 3, 'Full-Stack Platform', 'Mental Health Support Platform', 'A web platform with chat, session management, user roles, and in-page voice calling integration.', 'Platform architecture', 'Private support flows with real-time communication', array['Node.js', 'MongoDB', 'LiveKit', 'React'], false, true),
  ('44444444-4444-4444-8444-444444444444', 4, 'AI Project', 'Wedding Speech Analyzer', 'An AI-powered system designed to identify emotional moments in wedding speeches for video editors.', 'AI workflow prototype', 'Finding story moments faster in long speeches', array['Python', 'AI', 'NLP', 'Whisper', 'BERT'], false, true),
  ('44444444-4444-4444-8444-444444444445', 5, 'Business System', 'E-Commerce & Inventory Systems', 'Custom online stores and inventory workflows for real business operations.', 'Business system development', 'Orders, products, stock, and dashboard workflows', array['React', 'Firebase', 'Express', 'Dashboard'], false, true);

insert into tech_groups (id, sort_order, title, icon_key, is_active)
values
  ('55555555-5555-4555-8555-555555555551', 1, 'Frontend', 'code2', true),
  ('55555555-5555-4555-8555-555555555552', 2, 'Backend', 'server', true),
  ('55555555-5555-4555-8555-555555555553', 3, 'Databases', 'database', true),
  ('55555555-5555-4555-8555-555555555554', 4, 'Mobile', 'smartphone', true),
  ('55555555-5555-4555-8555-555555555555', 5, 'AI & Automation', 'bot', true),
  ('55555555-5555-4555-8555-555555555556', 6, 'Deployment', 'rocket', true);

insert into tech_group_items (id, tech_group_id, sort_order, label)
values
  ('66666666-6666-4666-8666-666666666661', '55555555-5555-4555-8555-555555555551', 1, 'React'),
  ('66666666-6666-4666-8666-666666666662', '55555555-5555-4555-8555-555555555551', 2, 'Next.js'),
  ('66666666-6666-4666-8666-666666666663', '55555555-5555-4555-8555-555555555551', 3, 'TypeScript'),
  ('66666666-6666-4666-8666-666666666664', '55555555-5555-4555-8555-555555555551', 4, 'Tailwind CSS'),
  ('66666666-6666-4666-8666-666666666665', '55555555-5555-4555-8555-555555555551', 5, 'Material UI'),
  ('66666666-6666-4666-8666-666666666666', '55555555-5555-4555-8555-555555555552', 1, 'Node.js'),
  ('66666666-6666-4666-8666-666666666667', '55555555-5555-4555-8555-555555555552', 2, 'Express.js'),
  ('66666666-6666-4666-8666-666666666668', '55555555-5555-4555-8555-555555555552', 3, 'REST APIs'),
  ('66666666-6666-4666-8666-666666666669', '55555555-5555-4555-8555-555555555552', 4, 'JWT Authentication'),
  ('66666666-6666-4666-8666-666666666670', '55555555-5555-4555-8555-555555555553', 1, 'MongoDB'),
  ('66666666-6666-4666-8666-666666666671', '55555555-5555-4555-8555-555555555553', 2, 'Supabase'),
  ('66666666-6666-4666-8666-666666666672', '55555555-5555-4555-8555-555555555553', 3, 'Firebase'),
  ('66666666-6666-4666-8666-666666666673', '55555555-5555-4555-8555-555555555553', 4, 'PostgreSQL'),
  ('66666666-6666-4666-8666-666666666674', '55555555-5555-4555-8555-555555555554', 1, 'Flutter'),
  ('66666666-6666-4666-8666-666666666675', '55555555-5555-4555-8555-555555555554', 2, 'Android'),
  ('66666666-6666-4666-8666-666666666676', '55555555-5555-4555-8555-555555555555', 1, 'Python'),
  ('66666666-6666-4666-8666-666666666677', '55555555-5555-4555-8555-555555555555', 2, 'Machine Learning'),
  ('66666666-6666-4666-8666-666666666678', '55555555-5555-4555-8555-555555555555', 3, 'NLP'),
  ('66666666-6666-4666-8666-666666666679', '55555555-5555-4555-8555-555555555555', 4, 'AI Workflows'),
  ('66666666-6666-4666-8666-666666666680', '55555555-5555-4555-8555-555555555555', 5, 'n8n'),
  ('66666666-6666-4666-8666-666666666681', '55555555-5555-4555-8555-555555555556', 1, 'GitHub Actions'),
  ('66666666-6666-4666-8666-666666666682', '55555555-5555-4555-8555-555555555556', 2, 'Railway'),
  ('66666666-6666-4666-8666-666666666683', '55555555-5555-4555-8555-555555555556', 3, 'cPanel'),
  ('66666666-6666-4666-8666-666666666684', '55555555-5555-4555-8555-555555555556', 4, 'Namecheap'),
  ('66666666-6666-4666-8666-666666666685', '55555555-5555-4555-8555-555555555556', 5, 'CI/CD');

insert into process_steps (id, sort_order, title, description, is_active)
values
  ('77777777-7777-4777-8777-777777777771', 1, 'Discover', 'Understand your business, goals, users, and required features.', true),
  ('77777777-7777-4777-8777-777777777772', 2, 'Plan', 'Create the system structure, pages, database flow, and development roadmap.', true),
  ('77777777-7777-4777-8777-777777777773', 3, 'Design', 'Build clean UI layouts with user-friendly experiences.', true),
  ('77777777-7777-4777-8777-777777777774', 4, 'Develop', 'Implement frontend, backend, database, authentication, and core features.', true),
  ('77777777-7777-4777-8777-777777777775', 5, 'Launch & Support', 'Deploy the project, test it properly, and provide ongoing improvements.', true);

insert into why_work_items (id, sort_order, title, description, icon_key, is_active)
values
  ('88888888-8888-4888-8888-888888888881', 1, 'Business-Focused Development', 'I focus on real business needs, not just technical features.', 'briefcaseBusiness', true),
  ('88888888-8888-4888-8888-888888888882', 2, 'Clean & Modern User Experience', 'Every interface is designed to feel simple, professional, and easy to use.', 'sparkles', true),
  ('88888888-8888-4888-8888-888888888883', 3, 'Scalable System Structure', 'Projects are built with organized code, database structure, and future growth in mind.', 'workflow', true),
  ('88888888-8888-4888-8888-888888888884', 4, 'Reliable Communication', 'Clear updates, honest timelines, and professional delivery from start to finish.', 'shieldCheck', true);

insert into testimonials (id, sort_order, quote, name, role, is_active)
values
  ('99999999-9999-4999-8999-999999999991', 1, 'Nimantha understood the project clearly and delivered a clean, working system with the features we needed.', 'Client Name', 'Business Owner', true),
  ('99999999-9999-4999-8999-999999999992', 2, 'The communication was smooth, and the final result looked professional and easy to manage.', 'Client Name', 'Startup Founder', true),
  ('99999999-9999-4999-8999-999999999993', 3, 'He was able to turn the idea into a real digital product with proper structure and practical features.', 'Project Supervisor', 'Academic Platform', true);

insert into trusted_brands (id, sort_order, name, url, logo_src, industry, is_active)
values
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc1', 1, 'Playstation.lk', '#', null, 'Gaming & Retail', true),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc2', 2, 'Serenity Wedding Films (Pvt) Ltd', '#', null, 'Wedding Films', true),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc3', 3, 'Priyadarshana Dristributors (Pvt) Ltd', '#', null, 'Distribution', true),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc4', 4, 'Athukorala Group (Pvt) Ltd', '#', null, 'Business Group', true),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc5', 5, 'Nextgen code (Pvt) Ltd', '#', null, 'Technology', true),
  ('cccccccc-cccc-4ccc-8ccc-ccccccccccc6', 6, 'DN Tours Ahungalla', '#', null, 'Travel', true);

insert into blog_settings (id, eyebrow, title, intro, featured_title, featured_intro)
values (
  'blog-settings',
  'Writing & Notes',
  'Thoughtful writing on product building, software craft, and digital strategy.',
  'A curated journal of lessons from building real systems, refining interfaces, structuring CMS platforms, and turning business ideas into practical software.',
  'Featured Article',
  'A deeper look at the thinking, systems, and design decisions that shape reliable digital products.'
)
on conflict (id) do update
set
  eyebrow = excluded.eyebrow,
  title = excluded.title,
  intro = excluded.intro,
  featured_title = excluded.featured_title,
  featured_intro = excluded.featured_intro;

insert into blog_categories (id, sort_order, name, slug, is_active)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 1, 'Development', 'development', true),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 2, 'UI & UX', 'ui-ux', true),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 3, 'CMS & Systems', 'cms-systems', true),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4', 4, 'Freelance', 'freelance', true);

insert into blog_posts (
  id,
  sort_order,
  title,
  slug,
  excerpt,
  cover_image,
  content_markdown,
  author_name,
  reading_time,
  published_at,
  seo_title,
  seo_description,
  is_featured,
  is_published
)
values
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    1,
    'What Makes a Client Dashboard Actually Useful',
    'what-makes-a-client-dashboard-useful',
    'A practical look at the difference between a dashboard that looks impressive and one that truly supports day-to-day operations.',
    '/images/nimantha-hero.png',
    E'## The real job of a dashboard\n\nA dashboard is not there to show how many charts we can fit on one screen. Its job is to help people make decisions quickly and with confidence.\n\n### What good dashboards usually have\n\n- clear hierarchy\n- important metrics first\n- simple navigation\n- actions placed close to the data they affect\n\n### What usually goes wrong\n\nToo many dashboards are built like presentations. They look polished, but they slow down the people who actually use them every day.\n\nThe best dashboard work starts with workflow questions:\n\n- What does the team check first every morning?\n- Which actions happen most often?\n- What is urgent versus useful?\n\nWhen those questions guide the build, the final product feels calm, focused, and professional.',
    'Nimantha Hewawasam',
    '5 min read',
    '2026-06-10T09:00:00.000Z',
    'What Makes a Client Dashboard Actually Useful',
    'A practical guide to building dashboards that support real business workflows instead of just looking impressive.',
    true,
    true
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2',
    2,
    'Designing Portfolio Sites That Feel Personal Without Feeling Messy',
    'designing-portfolio-sites-that-feel-personal',
    'How to make a personal site feel authored and memorable while still keeping the structure sharp and professional.',
    null,
    E'## Personal does not mean unstructured\n\nA strong portfolio site should show personality, but it should still guide people clearly.\n\n### The balance I look for\n\n- a recognizable visual identity\n- strong spacing and type hierarchy\n- fewer, better choices\n- content that sounds like a real person\n\nCreativity works best when the layout is disciplined. That is usually the difference between a site that feels premium and one that feels noisy.',
    'Nimantha Hewawasam',
    '4 min read',
    '2026-06-06T08:30:00.000Z',
    'Designing Portfolio Sites That Feel Personal Without Feeling Messy',
    'A short breakdown of how to make a portfolio site feel personal, original, and professionally structured.',
    false,
    true
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3',
    3,
    'Why CMS Projects Need Better Content Structures From Day One',
    'why-cms-projects-need-better-content-structures',
    'A better content model makes editing easier, reduces future bugs, and gives businesses more control over their own platforms.',
    null,
    E'## CMS work is product design\n\nWhen content structure is treated as an afterthought, the admin experience becomes fragile very quickly.\n\n### Strong content models help with\n\n- maintainability\n- editorial clarity\n- better API responses\n- easier future features\n\nI like CMS systems where the editing experience is obvious, the data is typed, and the public site stays fast.',
    'Nimantha Hewawasam',
    '6 min read',
    '2026-05-29T10:00:00.000Z',
    'Why CMS Projects Need Better Content Structures From Day One',
    'Why a solid content model matters for maintainability, editorial control, and long-term product quality.',
    false,
    true
  ),
  (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4',
    4,
    'From Freelance Request to Clear Build Plan',
    'from-freelance-request-to-clear-build-plan',
    'A simple framework for turning a vague client request into a scoped, buildable, and professional implementation plan.',
    null,
    E'## Clarity builds trust\n\nSome of the most important freelance work happens before the first line of code.\n\n### A better planning rhythm\n\n1. understand the business goal\n2. identify the real workflow\n3. define the content and data shape\n4. reduce vague requests into explicit decisions\n\nWhen the plan is clear, the build gets faster and the client feels more confident from the start.',
    'Nimantha Hewawasam',
    '4 min read',
    '2026-05-22T07:45:00.000Z',
    'From Freelance Request to Clear Build Plan',
    'A practical planning approach for turning freelance project requests into clean implementation plans.',
    false,
    true
  );

insert into blog_post_categories (post_id, category_id)
values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4'),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1');
