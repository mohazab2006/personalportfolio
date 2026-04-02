/**
 * Migration script to upload existing projects to Supabase
 * Run with: npx tsx scripts/migrate-to-supabase.ts
 */

import { createClient } from '@supabase/supabase-js'
import { PROJECTS } from '../lib/data'
import { splitProjectDescription, projectValueLine } from '../lib/projects'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!')
  console.error('Please create a .env.local file with:')
  console.error('  NEXT_PUBLIC_SUPABASE_URL=your_url')
  console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function migrateProjects() {
  console.log('🚀 Starting migration of projects to Supabase...\n')

  try {
    // First, delete all existing projects (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing projects...')
    const { error: deleteError } = await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    
    if (deleteError) {
      console.warn('⚠️  Warning: Could not clear existing projects:', deleteError.message)
    }

    // Insert projects one by one
    for (let i = 0; i < PROJECTS.length; i++) {
      const project = PROJECTS[i]
      console.log(`📦 Migrating project ${i + 1}/${PROJECTS.length}: ${project.title}`)

      const { hook, body } = splitProjectDescription(project.description)
      const summary =
        project.summary?.trim() || hook || projectValueLine(project.description, 220)
      const description = hook && body ? body : project.description

      const { data, error } = await supabase
        .from('projects')
        .insert({
          slug: project.slug,
          title: project.title,
          github: project.github || '',
          demo: project.demo || null,
          summary,
          description,
          stack: project.stack,
          screenshots: project.screenshots,
          order_index: i,
        })
        .select()

      if (error) {
        console.error(`   ❌ Error migrating ${project.title}:`, error.message)
      } else {
        console.log(`   ✅ Successfully migrated ${project.title}`)
      }
    }

    console.log('\n✨ Migration complete!')
    console.log(`📊 Migrated ${PROJECTS.length} projects`)
    
    // Verify the migration
    const { data: verifyData, error: verifyError } = await supabase
      .from('projects')
      .select('*')
      .order('order_index')

    if (verifyError) {
      console.error('❌ Error verifying migration:', verifyError.message)
    } else {
      console.log(`\n✅ Verification: Found ${verifyData?.length} projects in database`)
    }
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

migrateProjects()

