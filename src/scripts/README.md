# Database Seeders

This directory contains seeders for populating the database with sample data.

## Usage

Run the seeder with:

```bash
pnpm run seed
```

This will:

1. Clear existing data from all collections (except Users and Media)
2. Seed Categories (10)
3. Seed Tags (25)
4. Seed Authors (8)
5. Seed Articles (10)
6. Seed Pages (5)

## File Structure

- `seed.ts` - Main orchestrator script
- `seeders/categories.ts` - Category seed data
- `seeders/tags.ts` - Tag seed data
- `seeders/authors.ts` - Author seed data (without avatars)
- `seeders/articles.ts` - Article seed data with rich text content
- `seeders/pages.ts` - Static pages (About, Contact, Privacy, Terms, Advertise)

## Notes

### Media/Images

Media files (avatars, featured images) are **not** seeded automatically because:

- Payload requires actual file uploads for media collections
- The upload process creates necessary image variants (thumbnail, card, etc.)

After running the seeder, you can manually upload images through the admin panel:

1. Go to `/admin/collections/media`
2. Upload images
3. Assign avatars to authors in `/admin/collections/authors`
4. Assign featured images to articles in `/admin/collections/articles`

### Modifying Seed Data

Edit the respective seeder files to customize the sample data. Each file exports a seed function that can be run independently if needed.

### Keeping Existing Data

If you want to add seed data without clearing existing records, comment out the `clearCollections(payload)` call in `seed.ts`.
