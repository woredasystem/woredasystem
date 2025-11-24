-- Fix: Add missing complaint_submission_institution column
-- Run this in your Supabase SQL Editor if you already ran the main migration

ALTER TABLE complaints
ADD COLUMN IF NOT EXISTS complaint_submission_institution TEXT;

