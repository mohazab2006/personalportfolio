/**
 * Migration script to upload existing project images to Supabase Storage
 * Run with: npx tsx scripts/migrate-images.ts
 */

import { createClient } from '@supabase/supabase-js'
import { PROJECTS } from '../lib/data'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

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
const BUCKET_NAME = 'project-images'

async function uploadImage(
  projectSlug: string,
  imageName: string,
  imagePath: string
): Promise<boolean> {
  try {
    // Read the file
    const fileBuffer = fs.readFileSync(imagePath)
    
    // Determine content type
    const ext = path.extname(imageName).toLowerCase()
    const contentType = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg' : 'image/png'
    
    // Upload to Supabase
    const storagePath = `${projectSlug}/${imageName}`
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, fileBuffer, {
        contentType,
        upsert: true, // Overwrite if exists
      })

    if (error) {
      console.error(`   ❌ Error uploading ${imageName}:`, error.message)
      return false
    }

    console.log(`   ✅ Uploaded ${imageName}`)
    return true
  } catch (error) {
    console.error(`   ❌ Error reading/uploading ${imageName}:`, error)
    return false
  }
}

async function migrateImages() {
  console.log('🚀 Starting migration of images to Supabase Storage...\n')

  console.log(`📦 Using bucket: "${BUCKET_NAME}"`)
  console.log(`⚠️  Make sure the bucket exists and is PUBLIC in Supabase dashboard!\n`)

  let totalImages = 0
  let successCount = 0

  // Upload images for each project
  for (const project of PROJECTS) {
    console.log(`📁 Processing project: ${project.title}`)
    
    for (const screenshot of project.screenshots) {
      totalImages++
      const imagePath = path.join(process.cwd(), 'public', 'projects', project.slug, screenshot)
      
      // Check if file exists
      if (!fs.existsSync(imagePath)) {
        console.log(`   ⚠️  Image not found: ${screenshot} (skipping)`)
        continue
      }

      const success = await uploadImage(project.slug, screenshot, imagePath)
      if (success) {
        successCount++
      }
    }
    console.log('') // Empty line for readability
  }

  console.log('✨ Migration complete!')
  console.log(`📊 Uploaded ${successCount}/${totalImages} images successfully`)
  
  if (successCount < totalImages) {
    console.log(`⚠️  ${totalImages - successCount} images failed or were skipped`)
  }
}

migrateImages()

