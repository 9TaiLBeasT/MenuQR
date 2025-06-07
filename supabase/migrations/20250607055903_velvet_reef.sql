/*
  # Fix user_settings RLS policies

  1. Security
    - Add missing INSERT policy for user_settings table
    - Allow users to create their own settings when they don't exist
    - Ensure users can only insert settings for their own user_id

  2. Changes
    - Add "Users can insert their own settings" policy for INSERT operations
    - This allows the getUserSettings function to create default settings when none exist
*/

-- Add the missing INSERT policy for user_settings
CREATE POLICY "Users can insert their own settings"
  ON user_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);