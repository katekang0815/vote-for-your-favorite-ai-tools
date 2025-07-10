-- Create function to decrement vote count
CREATE OR REPLACE FUNCTION public.decrement_tool_vote(tool_id_param TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  UPDATE public.tool_votes 
  SET 
    vote_count = GREATEST(vote_count - 1, 0),  -- Prevent negative votes
    last_updated = now()
  WHERE tool_id = tool_id_param
  RETURNING vote_count INTO new_count;
  
  -- If no row was updated (tool doesn't exist), return 0
  IF new_count IS NULL THEN
    new_count := 0;
  END IF;
  
  RETURN new_count;
END;
$$;