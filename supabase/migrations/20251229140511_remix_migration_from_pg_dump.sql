CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";
CREATE EXTENSION IF NOT EXISTS "plpgsql" WITH SCHEMA "pg_catalog";
CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";
BEGIN;

--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  RETURN new;
END;
$$;


SET default_table_access_method = heap;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_logs (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid,
    action_type text NOT NULL,
    action_details jsonb,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: attack_scenarios; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attack_scenarios (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    scenario_id text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    difficulty text NOT NULL,
    content jsonb NOT NULL,
    correct_action text NOT NULL,
    explanation text NOT NULL,
    related_module_id text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: learning_modules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.learning_modules (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    module_id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    attack_type text NOT NULL,
    content text NOT NULL,
    why_it_matters text NOT NULL,
    visual_example text,
    difficulty text DEFAULT 'beginner'::text,
    order_index integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profiles (
    id uuid NOT NULL,
    email text,
    display_name text,
    total_score integer DEFAULT 0,
    training_completed integer DEFAULT 0,
    scenarios_attempted integer DEFAULT 0,
    scenarios_correct integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT now(),
    last_login timestamp with time zone DEFAULT now()
);


--
-- Name: user_attempts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_attempts (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid,
    scenario_id text NOT NULL,
    selected_action text NOT NULL,
    is_correct boolean NOT NULL,
    score_change integer NOT NULL,
    time_taken_seconds integer,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: user_module_progress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_module_progress (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid,
    module_id text NOT NULL,
    completed boolean DEFAULT false,
    completed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: attack_scenarios attack_scenarios_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attack_scenarios
    ADD CONSTRAINT attack_scenarios_pkey PRIMARY KEY (id);


--
-- Name: attack_scenarios attack_scenarios_scenario_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attack_scenarios
    ADD CONSTRAINT attack_scenarios_scenario_id_key UNIQUE (scenario_id);


--
-- Name: learning_modules learning_modules_module_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_modules
    ADD CONSTRAINT learning_modules_module_id_key UNIQUE (module_id);


--
-- Name: learning_modules learning_modules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.learning_modules
    ADD CONSTRAINT learning_modules_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: user_attempts user_attempts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_attempts
    ADD CONSTRAINT user_attempts_pkey PRIMARY KEY (id);


--
-- Name: user_module_progress user_module_progress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_module_progress
    ADD CONSTRAINT user_module_progress_pkey PRIMARY KEY (id);


--
-- Name: user_module_progress user_module_progress_user_id_module_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_module_progress
    ADD CONSTRAINT user_module_progress_user_id_module_id_key UNIQUE (user_id, module_id);


--
-- Name: activity_logs activity_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_attempts user_attempts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_attempts
    ADD CONSTRAINT user_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: user_module_progress user_module_progress_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_module_progress
    ADD CONSTRAINT user_module_progress_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: attack_scenarios Authenticated users can view attack scenarios; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view attack scenarios" ON public.attack_scenarios FOR SELECT TO authenticated USING (true);


--
-- Name: learning_modules Authenticated users can view learning modules; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Authenticated users can view learning modules" ON public.learning_modules FOR SELECT TO authenticated USING (true);


--
-- Name: user_attempts Users can insert own attempts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own attempts" ON public.user_attempts FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: activity_logs Users can insert own logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own logs" ON public.activity_logs FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: user_module_progress Users can insert own module progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own module progress" ON public.user_module_progress FOR INSERT WITH CHECK ((auth.uid() = user_id));


--
-- Name: profiles Users can insert own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK ((auth.uid() = id));


--
-- Name: user_module_progress Users can update own module progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own module progress" ON public.user_module_progress FOR UPDATE USING ((auth.uid() = user_id));


--
-- Name: profiles Users can update own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING ((auth.uid() = id));


--
-- Name: user_attempts Users can view own attempts; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own attempts" ON public.user_attempts FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: activity_logs Users can view own logs; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own logs" ON public.activity_logs FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: user_module_progress Users can view own module progress; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own module progress" ON public.user_module_progress FOR SELECT USING ((auth.uid() = user_id));


--
-- Name: profiles Users can view own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING ((auth.uid() = id));


--
-- Name: activity_logs; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: attack_scenarios; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.attack_scenarios ENABLE ROW LEVEL SECURITY;

--
-- Name: learning_modules; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.learning_modules ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

--
-- Name: user_attempts; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_attempts ENABLE ROW LEVEL SECURITY;

--
-- Name: user_module_progress; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--




COMMIT;