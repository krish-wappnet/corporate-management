-- First, create a new type with the updated values
CREATE TYPE feedback_requests_status_enum_new AS ENUM ('pending', 'approved', 'declined', 'expired');

-- Then update the column to use the new type with a temporary cast
ALTER TABLE feedback_requests 
  ALTER COLUMN status TYPE feedback_requests_status_enum_new 
  USING (
    CASE status::text
      WHEN 'completed' THEN 'approved'::feedback_requests_status_enum_new
      ELSE status::text::feedback_requests_status_enum_new
    END
  );

-- Drop the old type
DROP TYPE feedback_requests_status_enum;

-- Rename the new type to the original name
ALTER TYPE feedback_requests_status_enum_new RENAME TO feedback_requests_status_enum;
