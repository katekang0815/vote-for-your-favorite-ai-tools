-- Create table for email submissions (anonymous)
CREATE TABLE public.email_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Create index for faster lookups
CREATE INDEX idx_email_submissions_email ON public.email_submissions(email);
CREATE INDEX idx_email_submissions_submitted_at ON public.email_submissions(submitted_at);

-- Create table for tool votes (anonymous)
CREATE TABLE public.tool_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_id TEXT NOT NULL,
  vote_count INTEGER NOT NULL DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint on tool_id
ALTER TABLE public.tool_votes ADD CONSTRAINT unique_tool_id UNIQUE (tool_id);

-- Create function to increment vote count
CREATE OR REPLACE FUNCTION public.increment_tool_vote(tool_id_param TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  new_count INTEGER;
BEGIN
  INSERT INTO public.tool_votes (tool_id, vote_count, last_updated)
  VALUES (tool_id_param, 1, now())
  ON CONFLICT (tool_id) 
  DO UPDATE SET 
    vote_count = tool_votes.vote_count + 1,
    last_updated = now()
  RETURNING vote_count INTO new_count;
  
  RETURN new_count;
END;
$$;

-- Enable RLS (but make it permissive for anonymous access)
ALTER TABLE public.email_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_votes ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for anonymous access
CREATE POLICY "Allow anonymous email submissions" 
ON public.email_submissions 
FOR INSERT 
TO anon 
WITH CHECK (true);

CREATE POLICY "Allow anonymous email reads" 
ON public.email_submissions 
FOR SELECT 
TO anon 
USING (true);

CREATE POLICY "Allow anonymous vote increments" 
ON public.tool_votes 
FOR ALL 
TO anon 
USING (true)
WITH CHECK (true);