-- Create table for email scenario tokens (for real-device email delivery)
CREATE TABLE public.scenario_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token TEXT NOT NULL UNIQUE,
  user_id UUID,
  scenario_data JSONB NOT NULL,
  email_sent_to TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
  used_at TIMESTAMP WITH TIME ZONE,
  result_action TEXT,
  is_correct BOOLEAN
);

-- Enable RLS
ALTER TABLE public.scenario_tokens ENABLE ROW LEVEL SECURITY;

-- Policies for scenario tokens
CREATE POLICY "Anyone can view scenario by token" 
ON public.scenario_tokens 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own scenario tokens" 
ON public.scenario_tokens 
FOR UPDATE 
USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Service can insert scenario tokens" 
ON public.scenario_tokens 
FOR INSERT 
WITH CHECK (true);

-- Create table for quiz questions in training modules
CREATE TABLE public.module_quiz_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of answer options
  correct_option_index INTEGER NOT NULL,
  explanation TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.module_quiz_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view quiz questions" 
ON public.module_quiz_questions 
FOR SELECT 
USING (true);

-- Create table for user quiz attempts
CREATE TABLE public.user_quiz_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  module_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  passed BOOLEAN NOT NULL,
  answers JSONB NOT NULL, -- User's answers
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own quiz attempts" 
ON public.user_quiz_attempts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts" 
ON public.user_quiz_attempts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create table for user language preferences
CREATE TABLE public.user_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  language TEXT NOT NULL DEFAULT 'en',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preferences" 
ON public.user_preferences 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" 
ON public.user_preferences 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" 
ON public.user_preferences 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add index for token lookup
CREATE INDEX idx_scenario_tokens_token ON public.scenario_tokens(token);
CREATE INDEX idx_scenario_tokens_expires ON public.scenario_tokens(expires_at);

-- Add index for quiz questions
CREATE INDEX idx_quiz_questions_module ON public.module_quiz_questions(module_id);