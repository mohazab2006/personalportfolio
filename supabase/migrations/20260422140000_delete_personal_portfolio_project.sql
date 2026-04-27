-- Remove self-referential "Personal Portfolio" project card from the projects list.
DELETE FROM projects WHERE slug = 'personal-portfolio';
