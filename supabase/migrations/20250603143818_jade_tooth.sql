/*
  # Add contact info to profiles table

  1. Changes
    - Add `contact_info` column to `profiles` table
    - Update RLS policies to allow access to the new column

  2. Security
    - Maintain existing RLS policies
    - Ensure authenticated users can access their own contact info
*/

-- Add contact_info column to profiles table if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'contact_info'
  ) THEN
    ALTER TABLE profiles ADD COLUMN contact_info text;
  END IF;
END $$;