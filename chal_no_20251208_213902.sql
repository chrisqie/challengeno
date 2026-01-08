--
-- PostgreSQL database dump
--

\restrict wF6nc25JPNYseWijKfnZctMa2NulmDftTG30Zwoyb9fECUCDSvVTHeC2EVdPTxt

-- Dumped from database version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.11 (Ubuntu 16.11-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: AchievementCategory; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."AchievementCategory" AS ENUM (
    'PARTICIPATION',
    'CREATION',
    'SOCIAL',
    'TRUST',
    'SPECIAL',
    'MILESTONE'
);


ALTER TYPE public."AchievementCategory" OWNER TO chal_user;

--
-- Name: AchievementRarity; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."AchievementRarity" AS ENUM (
    'COMMON',
    'RARE',
    'EPIC',
    'LEGENDARY'
);


ALTER TYPE public."AchievementRarity" OWNER TO chal_user;

--
-- Name: AchievementType; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."AchievementType" AS ENUM (
    'COUNT',
    'THRESHOLD',
    'STREAK',
    'RATIO',
    'SPECIAL'
);


ALTER TYPE public."AchievementType" OWNER TO chal_user;

--
-- Name: AdminActionType; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."AdminActionType" AS ENUM (
    'USER_BAN',
    'USER_UNBAN',
    'USER_WARNING',
    'DELETE_USER',
    'GAME_DELETE',
    'GAME_SUSPEND',
    'GAME_RESUME',
    'EVIDENCE_DELETE',
    'REPORT_RESOLVE',
    'REPORT_APPROVE',
    'REPORT_REJECT',
    'POINTS_ADJUST'
);


ALTER TYPE public."AdminActionType" OWNER TO chal_user;

--
-- Name: AdminRole; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."AdminRole" AS ENUM (
    'SUPER_ADMIN',
    'ADMIN',
    'MODERATOR'
);


ALTER TYPE public."AdminRole" OWNER TO chal_user;

--
-- Name: DifficultyLevel; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."DifficultyLevel" AS ENUM (
    'BEGINNER',
    'INTERMEDIATE',
    'ADVANCED',
    'EXPERT'
);


ALTER TYPE public."DifficultyLevel" OWNER TO chal_user;

--
-- Name: DisputeDecision; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."DisputeDecision" AS ENUM (
    'APPROVE_INITIATOR',
    'APPROVE_TARGET',
    'PARTIAL_APPROVAL',
    'NO_ACTION_NEEDED',
    'INSUFFICIENT_EVIDENCE',
    'INVALID_DISPUTE'
);


ALTER TYPE public."DisputeDecision" OWNER TO chal_user;

--
-- Name: DisputeEvidenceType; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."DisputeEvidenceType" AS ENUM (
    'TEXT',
    'IMAGE',
    'VIDEO',
    'DOCUMENT',
    'SCREENSHOT',
    'CHAT_LOG',
    'SYSTEM_LOG'
);


ALTER TYPE public."DisputeEvidenceType" OWNER TO chal_user;

--
-- Name: DisputeHandlerType; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."DisputeHandlerType" AS ENUM (
    'AI_AUTO',
    'AI_ASSISTED',
    'HUMAN_MANUAL'
);


ALTER TYPE public."DisputeHandlerType" OWNER TO chal_user;

--
-- Name: DisputePriority; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."DisputePriority" AS ENUM (
    'LOW',
    'NORMAL',
    'HIGH',
    'URGENT'
);


ALTER TYPE public."DisputePriority" OWNER TO chal_user;

--
-- Name: DisputeStatus; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."DisputeStatus" AS ENUM (
    'PENDING',
    'UNDER_REVIEW',
    'INVESTIGATING',
    'WAITING_EVIDENCE',
    'RESOLVED',
    'REJECTED',
    'CANCELLED',
    'ESCALATED'
);


ALTER TYPE public."DisputeStatus" OWNER TO chal_user;

--
-- Name: DisputeType; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."DisputeType" AS ENUM (
    'EVIDENCE_DISPUTE',
    'RULE_VIOLATION',
    'UNFAIR_EVALUATION',
    'HARASSMENT',
    'TECHNICAL_ISSUE',
    'GAME_RESULT_DISPUTE',
    'OTHER'
);


ALTER TYPE public."DisputeType" OWNER TO chal_user;

--
-- Name: EmailFrequency; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."EmailFrequency" AS ENUM (
    'IMMEDIATE',
    'HOURLY',
    'DAILY',
    'WEEKLY',
    'DISABLED'
);


ALTER TYPE public."EmailFrequency" OWNER TO chal_user;

--
-- Name: EvaluationResult; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."EvaluationResult" AS ENUM (
    'RECOGNIZE',
    'NOT_RECOGNIZE'
);


ALTER TYPE public."EvaluationResult" OWNER TO chal_user;

--
-- Name: EvaluationStatus; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."EvaluationStatus" AS ENUM (
    'ACTIVE',
    'DISPUTED',
    'CONFIRMED'
);


ALTER TYPE public."EvaluationStatus" OWNER TO chal_user;

--
-- Name: EvidenceType; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."EvidenceType" AS ENUM (
    'PHOTO',
    'TEXT',
    'VIDEO',
    'DOCUMENT',
    'AUTOMATIC',
    'MANUAL'
);


ALTER TYPE public."EvidenceType" OWNER TO chal_user;

--
-- Name: ExchangeStatus; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."ExchangeStatus" AS ENUM (
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public."ExchangeStatus" OWNER TO chal_user;

--
-- Name: FeedbackStatus; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."FeedbackStatus" AS ENUM (
    'PENDING',
    'IN_PROGRESS',
    'RESOLVED',
    'CLOSED'
);


ALTER TYPE public."FeedbackStatus" OWNER TO chal_user;

--
-- Name: FeedbackType; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."FeedbackType" AS ENUM (
    'BUG',
    'SUGGESTION',
    'OTHER'
);


ALTER TYPE public."FeedbackType" OWNER TO chal_user;

--
-- Name: FriendshipStatus; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."FriendshipStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'BLOCKED'
);


ALTER TYPE public."FriendshipStatus" OWNER TO chal_user;

--
-- Name: GameCategory; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."GameCategory" AS ENUM (
    'HEALTH',
    'FITNESS',
    'LEARNING',
    'WEATHER',
    'PERSONAL',
    'CUSTOM',
    'LIFESTYLE',
    'ENTERTAINMENT',
    'SOCIAL',
    'WORK'
);


ALTER TYPE public."GameCategory" OWNER TO chal_user;

--
-- Name: GameStatus; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."GameStatus" AS ENUM (
    'OPEN',
    'IN_PROGRESS',
    'EVIDENCE_SUBMISSION',
    'PEER_REVIEW',
    'COMPLETED',
    'DISPUTED',
    'CLOSED'
);


ALTER TYPE public."GameStatus" OWNER TO chal_user;

--
-- Name: GameVisibility; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."GameVisibility" AS ENUM (
    'PUBLIC',
    'FRIENDS_ONLY'
);


ALTER TYPE public."GameVisibility" OWNER TO chal_user;

--
-- Name: InviteStatus; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."InviteStatus" AS ENUM (
    'PENDING',
    'ACCEPTED',
    'DECLINED',
    'EXPIRED'
);


ALTER TYPE public."InviteStatus" OWNER TO chal_user;

--
-- Name: JoinAction; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."JoinAction" AS ENUM (
    'JOIN',
    'LEAVE'
);


ALTER TYPE public."JoinAction" OWNER TO chal_user;

--
-- Name: LocationRestriction; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."LocationRestriction" AS ENUM (
    'NONE',
    'LOCAL',
    'CUSTOM'
);


ALTER TYPE public."LocationRestriction" OWNER TO chal_user;

--
-- Name: MessageType; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."MessageType" AS ENUM (
    'TEXT',
    'EMOJI',
    'SYSTEM'
);


ALTER TYPE public."MessageType" OWNER TO chal_user;

--
-- Name: NotificationChannel; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."NotificationChannel" AS ENUM (
    'IN_APP',
    'EMAIL',
    'PUSH'
);


ALTER TYPE public."NotificationChannel" OWNER TO chal_user;

--
-- Name: NotificationPriority; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."NotificationPriority" AS ENUM (
    'LOW',
    'NORMAL',
    'HIGH',
    'URGENT'
);


ALTER TYPE public."NotificationPriority" OWNER TO chal_user;

--
-- Name: NotificationType; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."NotificationType" AS ENUM (
    'FRIEND_REQUEST',
    'FRIEND_ACCEPTED',
    'GAME_STARTED',
    'GAME_INVITE',
    'EVIDENCE_REQUIRED',
    'EVIDENCE_SUBMITTED',
    'PEER_REVIEW_REQUEST',
    'REVIEW_COMPLETED',
    'GAME_COMPLETED',
    'GAME_CANCELLED',
    'ACHIEVEMENT_UNLOCKED',
    'VIP_EXPIRED',
    'VIP_RENEWED',
    'SYSTEM',
    'FRIEND_REJECTED',
    'PEER_EVALUATION_STARTED',
    'SECURITY_ALERT',
    'GAME_UNDER_REVIEW'
);


ALTER TYPE public."NotificationType" OWNER TO chal_user;

--
-- Name: ParticipantResult; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."ParticipantResult" AS ENUM (
    'SUCCESS',
    'FAILURE',
    'DISPUTED',
    'PENDING'
);


ALTER TYPE public."ParticipantResult" OWNER TO chal_user;

--
-- Name: PenaltyType; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."PenaltyType" AS ENUM (
    'DISPUTE_VIOLATION',
    'MALICIOUS_DISPUTE',
    'FRAUD',
    'HARASSMENT',
    'OTHER'
);


ALTER TYPE public."PenaltyType" OWNER TO chal_user;

--
-- Name: PointType; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."PointType" AS ENUM (
    'PARTICIPATION',
    'TRUST',
    'LABOR'
);


ALTER TYPE public."PointType" OWNER TO chal_user;

--
-- Name: PrivacyMode; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."PrivacyMode" AS ENUM (
    'PUBLIC',
    'FRIENDS_ONLY'
);


ALTER TYPE public."PrivacyMode" OWNER TO chal_user;

--
-- Name: ReferralRewardType; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."ReferralRewardType" AS ENUM (
    'VIP_DAYS',
    'PARTICIPATION_POINTS',
    'TRUST_POINTS',
    'LABOR_POINTS'
);


ALTER TYPE public."ReferralRewardType" OWNER TO chal_user;

--
-- Name: ReportReason; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."ReportReason" AS ENUM (
    'INAPPROPRIATE_CONTENT',
    'SPAM',
    'FRAUD',
    'HARASSMENT',
    'FAKE_EVIDENCE',
    'OTHER'
);


ALTER TYPE public."ReportReason" OWNER TO chal_user;

--
-- Name: ReportStatus; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."ReportStatus" AS ENUM (
    'PENDING',
    'INVESTIGATING',
    'RESOLVED',
    'REJECTED'
);


ALTER TYPE public."ReportStatus" OWNER TO chal_user;

--
-- Name: ReportTargetType; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."ReportTargetType" AS ENUM (
    'USER',
    'GAME',
    'EVIDENCE',
    'COMMENT'
);


ALTER TYPE public."ReportTargetType" OWNER TO chal_user;

--
-- Name: RiskLevel; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."RiskLevel" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH',
    'EXTREME'
);


ALTER TYPE public."RiskLevel" OWNER TO chal_user;

--
-- Name: StakeType; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."StakeType" AS ENUM (
    'MONEY',
    'ITEM',
    'FAVOR',
    'POINTS'
);


ALTER TYPE public."StakeType" OWNER TO chal_user;

--
-- Name: TeamGameMode; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."TeamGameMode" AS ENUM (
    'TEAM_VS_TEAM',
    'COLLABORATIVE',
    'TEAM_CHALLENGE'
);


ALTER TYPE public."TeamGameMode" OWNER TO chal_user;

--
-- Name: TeamParticipationStatus; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."TeamParticipationStatus" AS ENUM (
    'ACTIVE',
    'WITHDRAWN',
    'DISQUALIFIED'
);


ALTER TYPE public."TeamParticipationStatus" OWNER TO chal_user;

--
-- Name: TeamRole; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."TeamRole" AS ENUM (
    'LEADER',
    'MEMBER'
);


ALTER TYPE public."TeamRole" OWNER TO chal_user;

--
-- Name: TeamStatus; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."TeamStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'DISBANDED'
);


ALTER TYPE public."TeamStatus" OWNER TO chal_user;

--
-- Name: TeamType; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."TeamType" AS ENUM (
    'CASUAL',
    'COMPETITIVE',
    'PRIVATE'
);


ALTER TYPE public."TeamType" OWNER TO chal_user;

--
-- Name: VipTier; Type: TYPE; Schema: public; Owner: chal_user
--

CREATE TYPE public."VipTier" AS ENUM (
    'BASIC',
    'PREMIUM',
    'ELITE'
);


ALTER TYPE public."VipTier" OWNER TO chal_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO chal_user;

--
-- Name: achievements; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.achievements (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    icon text,
    category public."AchievementCategory" NOT NULL,
    type public."AchievementType" NOT NULL,
    condition jsonb NOT NULL,
    reward jsonb NOT NULL,
    rarity public."AchievementRarity" DEFAULT 'COMMON'::public."AchievementRarity" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.achievements OWNER TO chal_user;

--
-- Name: admin_actions; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.admin_actions (
    id text NOT NULL,
    admin_id text NOT NULL,
    action public."AdminActionType" NOT NULL,
    target_type text NOT NULL,
    target_id text NOT NULL,
    details jsonb,
    reason text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.admin_actions OWNER TO chal_user;

--
-- Name: bet_games; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.bet_games (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    creator_id text NOT NULL,
    template_id text,
    stake_type public."StakeType" NOT NULL,
    bet_amount numeric(65,30),
    currency text DEFAULT 'USD'::text NOT NULL,
    stake_description text,
    evidence_type public."EvidenceType" NOT NULL,
    evidence_instructions text NOT NULL,
    max_participants integer NOT NULL,
    current_participants integer DEFAULT 1 NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    evidence_deadline timestamp(3) without time zone NOT NULL,
    status public."GameStatus" DEFAULT 'OPEN'::public."GameStatus" NOT NULL,
    category public."GameCategory" NOT NULL,
    visibility public."GameVisibility" DEFAULT 'PUBLIC'::public."GameVisibility" NOT NULL,
    result text,
    winner_ids text[],
    dispute_count integer DEFAULT 0 NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    view_count integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    is_team_game boolean DEFAULT false NOT NULL,
    max_team_size integer,
    max_teams integer,
    min_team_size integer,
    team_mode public."TeamGameMode",
    additional_notes text,
    dynamic_config jsonb,
    template_config jsonb,
    custom_location text,
    location_restriction public."LocationRestriction" DEFAULT 'NONE'::public."LocationRestriction" NOT NULL,
    max_distance integer,
    join_deadline timestamp(3) without time zone,
    review_deadline timestamp(3) without time zone,
    arbitration_deadline timestamp(3) without time zone,
    creator_ip_city text,
    creator_ip_country text,
    creator_ip_location text,
    dispute_submission_deadline timestamp(3) without time zone,
    favorites_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.bet_games OWNER TO chal_user;

--
-- Name: bet_participants; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.bet_participants (
    id text NOT NULL,
    game_id text NOT NULL,
    user_id text NOT NULL,
    "position" text,
    joined_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    evidence_submitted boolean DEFAULT false NOT NULL,
    evidence_type public."EvidenceType",
    evidence_content text,
    evidence_submitted_at timestamp(3) without time zone,
    self_reported_success boolean,
    peer_evaluations_received integer DEFAULT 0 NOT NULL,
    peer_evaluations_given integer DEFAULT 0 NOT NULL,
    final_result public."ParticipantResult" DEFAULT 'PENDING'::public."ParticipantResult" NOT NULL,
    completion_verified boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    evidence_description text,
    penalty_points integer DEFAULT 0 NOT NULL,
    penalty_reason text,
    penalized_at timestamp(3) without time zone
);


ALTER TABLE public.bet_participants OWNER TO chal_user;

--
-- Name: community_groups; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.community_groups (
    id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    category text NOT NULL,
    is_public boolean DEFAULT true NOT NULL,
    creator_id text NOT NULL,
    avatar text,
    banner text,
    tags text[] DEFAULT ARRAY[]::text[],
    rules text[] DEFAULT ARRAY[]::text[],
    member_count integer DEFAULT 1 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.community_groups OWNER TO chal_user;

--
-- Name: dispute_evidence; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.dispute_evidence (
    id text NOT NULL,
    dispute_id text NOT NULL,
    uploader_id text NOT NULL,
    type public."DisputeEvidenceType" NOT NULL,
    title text,
    description text,
    content text NOT NULL,
    metadata jsonb,
    is_verified boolean DEFAULT false NOT NULL,
    verified_by text,
    verified_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.dispute_evidence OWNER TO chal_user;

--
-- Name: disputes; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.disputes (
    id text NOT NULL,
    game_id text NOT NULL,
    initiator_id text NOT NULL,
    target_id text,
    dispute_type public."DisputeType" NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    reason text,
    status public."DisputeStatus" DEFAULT 'PENDING'::public."DisputeStatus" NOT NULL,
    priority public."DisputePriority" DEFAULT 'NORMAL'::public."DisputePriority" NOT NULL,
    handler_id text,
    handler_type public."DisputeHandlerType",
    resolution text,
    decision public."DisputeDecision",
    compensation_amount integer,
    dispute_deadline timestamp(3) without time zone NOT NULL,
    handled_at timestamp(3) without time zone,
    resolved_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    penalized_user_ids text[] DEFAULT ARRAY[]::text[],
    points_adjustments jsonb
);


ALTER TABLE public.disputes OWNER TO chal_user;

--
-- Name: favorites; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.favorites (
    id text NOT NULL,
    user_id text NOT NULL,
    game_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.favorites OWNER TO chal_user;

--
-- Name: feedbacks; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.feedbacks (
    id text NOT NULL,
    user_id text,
    type public."FeedbackType" NOT NULL,
    content text NOT NULL,
    email text,
    status public."FeedbackStatus" DEFAULT 'PENDING'::public."FeedbackStatus" NOT NULL,
    admin_notes text,
    handler_id text,
    handled_at timestamp(3) without time zone,
    user_agent text,
    url text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.feedbacks OWNER TO chal_user;

--
-- Name: friendships; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.friendships (
    id text NOT NULL,
    requester_id text NOT NULL,
    addressee_id text NOT NULL,
    status public."FriendshipStatus" DEFAULT 'PENDING'::public."FriendshipStatus" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.friendships OWNER TO chal_user;

--
-- Name: game_join_history; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.game_join_history (
    id text NOT NULL,
    user_id text NOT NULL,
    game_id text NOT NULL,
    action public."JoinAction" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.game_join_history OWNER TO chal_user;

--
-- Name: game_templates; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.game_templates (
    id text NOT NULL,
    name text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    category public."GameCategory" NOT NULL,
    evidence_type public."EvidenceType" NOT NULL,
    is_age_restricted boolean DEFAULT true NOT NULL,
    default_duration_hours integer NOT NULL,
    max_participants integer DEFAULT 6 NOT NULL,
    instructions text NOT NULL,
    example_evidence text,
    is_active boolean DEFAULT true NOT NULL,
    is_vip_only boolean DEFAULT false NOT NULL,
    vip_tier public."VipTier",
    ui_theme jsonb,
    features jsonb,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    difficulty_level public."DifficultyLevel" DEFAULT 'BEGINNER'::public."DifficultyLevel",
    is_quick_start boolean DEFAULT false NOT NULL,
    risk_level public."RiskLevel" DEFAULT 'LOW'::public."RiskLevel",
    subcategory text DEFAULT '其他'::text NOT NULL,
    success_rate double precision,
    template_options jsonb,
    usage_count integer DEFAULT 0,
    title_translations jsonb,
    description_translations jsonb,
    instructions_translations jsonb,
    example_evidence_translations jsonb
);


ALTER TABLE public.game_templates OWNER TO chal_user;

--
-- Name: COLUMN game_templates.title_translations; Type: COMMENT; Schema: public; Owner: chal_user
--

COMMENT ON COLUMN public.game_templates.title_translations IS 'Multilingual translations for title: { en: "...", es: "...", ja: "..." }';


--
-- Name: COLUMN game_templates.description_translations; Type: COMMENT; Schema: public; Owner: chal_user
--

COMMENT ON COLUMN public.game_templates.description_translations IS 'Multilingual translations for description';


--
-- Name: COLUMN game_templates.instructions_translations; Type: COMMENT; Schema: public; Owner: chal_user
--

COMMENT ON COLUMN public.game_templates.instructions_translations IS 'Multilingual translations for instructions';


--
-- Name: COLUMN game_templates.example_evidence_translations; Type: COMMENT; Schema: public; Owner: chal_user
--

COMMENT ON COLUMN public.game_templates.example_evidence_translations IS 'Multilingual translations for example evidence';


--
-- Name: group_members; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.group_members (
    id text NOT NULL,
    group_id text NOT NULL,
    user_id text NOT NULL,
    role text DEFAULT 'MEMBER'::text NOT NULL,
    joined_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_active_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.group_members OWNER TO chal_user;

--
-- Name: group_posts; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.group_posts (
    id text NOT NULL,
    group_id text NOT NULL,
    author_id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    type text DEFAULT 'TEXT'::text NOT NULL,
    attachments jsonb,
    is_pinned boolean DEFAULT false NOT NULL,
    is_locked boolean DEFAULT false NOT NULL,
    likes_count integer DEFAULT 0 NOT NULL,
    comments_count integer DEFAULT 0 NOT NULL,
    views_count integer DEFAULT 0 NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.group_posts OWNER TO chal_user;

--
-- Name: messages; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.messages (
    id text NOT NULL,
    sender_id text NOT NULL,
    receiver_id text NOT NULL,
    content text NOT NULL,
    type public."MessageType" DEFAULT 'TEXT'::public."MessageType" NOT NULL,
    is_read boolean DEFAULT false NOT NULL,
    read_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.messages OWNER TO chal_user;

--
-- Name: notification_settings; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.notification_settings (
    id text NOT NULL,
    user_id text NOT NULL,
    in_app_enabled boolean DEFAULT true NOT NULL,
    email_enabled boolean DEFAULT true NOT NULL,
    email_frequency public."EmailFrequency" DEFAULT 'IMMEDIATE'::public."EmailFrequency" NOT NULL,
    push_enabled boolean DEFAULT true NOT NULL,
    game_invites boolean DEFAULT true NOT NULL,
    game_updates boolean DEFAULT true NOT NULL,
    friend_requests boolean DEFAULT true NOT NULL,
    achievements boolean DEFAULT true NOT NULL,
    system_updates boolean DEFAULT true NOT NULL,
    quiet_hours_enabled boolean DEFAULT false NOT NULL,
    quiet_hours_start text,
    quiet_hours_end text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.notification_settings OWNER TO chal_user;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.notifications (
    id text NOT NULL,
    user_id text NOT NULL,
    type public."NotificationType" NOT NULL,
    title text NOT NULL,
    message text NOT NULL,
    data jsonb,
    is_read boolean DEFAULT false NOT NULL,
    channels public."NotificationChannel"[] DEFAULT ARRAY['IN_APP'::public."NotificationChannel"],
    priority public."NotificationPriority" DEFAULT 'NORMAL'::public."NotificationPriority" NOT NULL,
    email_sent boolean DEFAULT false NOT NULL,
    email_sent_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    read_at timestamp(3) without time zone
);


ALTER TABLE public.notifications OWNER TO chal_user;

--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.password_reset_tokens (
    id text NOT NULL,
    user_id text NOT NULL,
    token text NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL,
    used boolean DEFAULT false NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.password_reset_tokens OWNER TO chal_user;

--
-- Name: peer_evaluations; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.peer_evaluations (
    id text NOT NULL,
    game_id text NOT NULL,
    evaluator_id text NOT NULL,
    evaluated_id text NOT NULL,
    evaluation public."EvaluationResult" NOT NULL,
    reasoning text,
    status public."EvaluationStatus" DEFAULT 'ACTIVE'::public."EvaluationStatus" NOT NULL,
    dispute_deadline timestamp(3) without time zone,
    disputed_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.peer_evaluations OWNER TO chal_user;

--
-- Name: penalty_records; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.penalty_records (
    id text NOT NULL,
    user_id text NOT NULL,
    game_id text,
    dispute_id text,
    penalty_type public."PenaltyType" NOT NULL,
    reason text NOT NULL,
    trust_points_deduction integer NOT NULL,
    game_points_deduction integer DEFAULT 0 NOT NULL,
    executed_by text,
    executed_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.penalty_records OWNER TO chal_user;

--
-- Name: points_history; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.points_history (
    id text NOT NULL,
    user_id text NOT NULL,
    point_type public."PointType" NOT NULL,
    change integer NOT NULL,
    reason text NOT NULL,
    game_id text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.points_history OWNER TO chal_user;

--
-- Name: referral_rewards; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.referral_rewards (
    id text NOT NULL,
    user_id text NOT NULL,
    referred_user_id text NOT NULL,
    reward_type public."ReferralRewardType" NOT NULL,
    reward_value integer NOT NULL,
    description text NOT NULL,
    is_granted boolean DEFAULT false NOT NULL,
    granted_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.referral_rewards OWNER TO chal_user;

--
-- Name: reports; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.reports (
    id text NOT NULL,
    reporter_id text NOT NULL,
    target_type public."ReportTargetType" NOT NULL,
    target_id text NOT NULL,
    reason public."ReportReason" NOT NULL,
    description text,
    status public."ReportStatus" DEFAULT 'PENDING'::public."ReportStatus" NOT NULL,
    handler_id text,
    handled_at timestamp(3) without time zone,
    resolution text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.reports OWNER TO chal_user;

--
-- Name: shop_exchanges; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.shop_exchanges (
    id text NOT NULL,
    "userId" text NOT NULL,
    "itemId" text NOT NULL,
    "pointType" public."PointType" NOT NULL,
    "pointCost" integer NOT NULL,
    status public."ExchangeStatus" DEFAULT 'PENDING'::public."ExchangeStatus" NOT NULL,
    "deliveryInfo" text,
    notes text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.shop_exchanges OWNER TO chal_user;

--
-- Name: shop_items; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.shop_items (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    image text,
    category text NOT NULL,
    "pointType" public."PointType" NOT NULL,
    "pointCost" integer NOT NULL,
    stock integer DEFAULT '-1'::integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.shop_items OWNER TO chal_user;

--
-- Name: social_activities; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.social_activities (
    id text NOT NULL,
    user_id text NOT NULL,
    type text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    data jsonb,
    visibility text DEFAULT 'PUBLIC'::text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.social_activities OWNER TO chal_user;

--
-- Name: social_interactions; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.social_interactions (
    id text NOT NULL,
    from_user_id text NOT NULL,
    to_user_id text,
    "targetType" text NOT NULL,
    target_id text NOT NULL,
    type text NOT NULL,
    content text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.social_interactions OWNER TO chal_user;

--
-- Name: team_game_participations; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.team_game_participations (
    id text NOT NULL,
    game_id text NOT NULL,
    team_id text NOT NULL,
    joined_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status public."TeamParticipationStatus" DEFAULT 'ACTIVE'::public."TeamParticipationStatus" NOT NULL,
    team_score integer,
    team_rank integer,
    is_winner boolean DEFAULT false NOT NULL
);


ALTER TABLE public.team_game_participations OWNER TO chal_user;

--
-- Name: team_games; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.team_games (
    id text NOT NULL,
    team_id text NOT NULL,
    game_id text NOT NULL
);


ALTER TABLE public.team_games OWNER TO chal_user;

--
-- Name: team_invites; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.team_invites (
    id text NOT NULL,
    team_id text NOT NULL,
    inviter_id text NOT NULL,
    invitee_id text,
    email text,
    status public."InviteStatus" DEFAULT 'PENDING'::public."InviteStatus" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.team_invites OWNER TO chal_user;

--
-- Name: team_members; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.team_members (
    id text NOT NULL,
    team_id text NOT NULL,
    user_id text NOT NULL,
    role public."TeamRole" DEFAULT 'MEMBER'::public."TeamRole" NOT NULL,
    joined_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.team_members OWNER TO chal_user;

--
-- Name: teams; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.teams (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    creator_id text NOT NULL,
    max_members integer DEFAULT 10 NOT NULL,
    is_private boolean DEFAULT false NOT NULL,
    invite_code text,
    team_type public."TeamType" DEFAULT 'CASUAL'::public."TeamType" NOT NULL,
    status public."TeamStatus" DEFAULT 'ACTIVE'::public."TeamStatus" NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.teams OWNER TO chal_user;

--
-- Name: user_achievements; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.user_achievements (
    id text NOT NULL,
    "userId" text NOT NULL,
    "achievementId" text NOT NULL,
    "unlockedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    progress jsonb,
    "isDisplayed" boolean DEFAULT true NOT NULL
);


ALTER TABLE public.user_achievements OWNER TO chal_user;

--
-- Name: user_follows; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.user_follows (
    id text NOT NULL,
    follower_id text NOT NULL,
    followee_id text NOT NULL,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.user_follows OWNER TO chal_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.users (
    id text NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    full_name text,
    date_of_birth timestamp(3) without time zone NOT NULL,
    password_hash text NOT NULL,
    participation_points integer DEFAULT 0 NOT NULL,
    trust_points integer DEFAULT 10 NOT NULL,
    labor_points integer DEFAULT 0 NOT NULL,
    total_games_created integer DEFAULT 0 NOT NULL,
    total_games_joined integer DEFAULT 0 NOT NULL,
    games_completed integer DEFAULT 0 NOT NULL,
    privacy_mode public."PrivacyMode" DEFAULT 'PUBLIC'::public."PrivacyMode" NOT NULL,
    daily_game_limit integer DEFAULT 10 NOT NULL,
    preferred_language text DEFAULT 'en'::text NOT NULL,
    is_vip boolean DEFAULT false NOT NULL,
    vip_expires_at timestamp(3) without time zone,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp(3) without time zone NOT NULL,
    is_admin boolean DEFAULT false NOT NULL,
    admin_role public."AdminRole",
    admin_created_at timestamp(3) without time zone,
    avatar text,
    allow_friend_requests boolean DEFAULT true NOT NULL,
    allow_game_invites boolean DEFAULT true NOT NULL,
    bio text,
    interests jsonb,
    location text,
    phone text,
    show_birth_date boolean DEFAULT false NOT NULL,
    show_email boolean DEFAULT true NOT NULL,
    show_location boolean DEFAULT true NOT NULL,
    show_phone boolean DEFAULT false NOT NULL,
    website text,
    referral_code text,
    referred_by text,
    city text,
    country text,
    country_code text,
    is_banned boolean DEFAULT false NOT NULL,
    banned_until timestamp(3) without time zone,
    ban_reason text,
    is_deleted boolean DEFAULT false NOT NULL,
    deleted_at timestamp(3) without time zone,
    delete_reason text
);


ALTER TABLE public.users OWNER TO chal_user;

--
-- Name: vip_subscriptions; Type: TABLE; Schema: public; Owner: chal_user
--

CREATE TABLE public.vip_subscriptions (
    id text NOT NULL,
    user_id text NOT NULL,
    tier public."VipTier" NOT NULL,
    start_date timestamp(3) without time zone NOT NULL,
    end_date timestamp(3) without time zone NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    payment_amount numeric(65,30),
    payment_method text,
    created_at timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.vip_subscriptions OWNER TO chal_user;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
758ef397-563a-42d9-99f7-49f8315dbdbc	f2380a7529c2afcd56053d273c12e4996bfb2bd158f3ac6f11125bb2297924d8	2025-09-12 08:28:37.609809+00	20250912082837_add_dispute_system	\N	\N	2025-09-12 08:28:37.416926+00	1
c70acc9b-c3df-4a11-a0f7-e45bb8172fde	a838c65dc579f33e232f67a195c6cc8b1941fcdb59d88b983966e2cfe772ad12	\N	20250130_add_location_restriction	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20250130_add_location_restriction\n\nDatabase error code: 42710\n\nDatabase error:\nERROR: type "LocationRestriction" already exists\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E42710), message: "type \\"LocationRestriction\\" already exists", detail: None, hint: None, position: None, where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("typecmds.c"), line: Some(1170), routine: Some("DefineEnum") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20250130_add_location_restriction"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:106\n   1: schema_core::commands::apply_migrations::Applying migration\n           with migration_name="20250130_add_location_restriction"\n             at schema-engine/core/src/commands/apply_migrations.rs:91\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:226	2025-11-01 14:02:13.890685+00	2025-11-01 14:00:56.387956+00	0
f3e8065b-c710-4955-8039-028bcdf1e24a	a838c65dc579f33e232f67a195c6cc8b1941fcdb59d88b983966e2cfe772ad12	2025-11-01 14:02:13.892982+00	20250130_add_location_restriction		\N	2025-11-01 14:02:13.892982+00	0
240c7da1-e8fe-4202-b7dd-e9f430625abf	4796476f10582b16624d9198441825c89d62ce7c744fe21b0adf0d8951a06230	2025-11-07 21:55:08.820512+00	20250107_add_penalty_system	\N	\N	2025-11-07 21:55:08.784429+00	1
\.


--
-- Data for Name: achievements; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.achievements (id, name, description, icon, category, type, condition, reward, rarity, "isActive", "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmgysofa7000610if9btp1t00	老用户	注册超过30天	🏆	MILESTONE	SPECIAL	{"type": "special"}	{"points": {"type": "PARTICIPATION", "amount": 50}}	RARE	t	0	2025-10-20 07:09:06.271	2025-10-20 07:09:06.271
cmhl7esvc000672sty9t2lsla	积分新星	总积分达到1000分	⭐	MILESTONE	SPECIAL	{"type": "special"}	{"points": {"type": "PARTICIPATION", "amount": 100}}	RARE	t	0	2025-11-04 23:32:27.432	2025-11-04 23:32:27.432
\.


--
-- Data for Name: admin_actions; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.admin_actions (id, admin_id, action, target_type, target_id, details, reason, created_at) FROM stdin;
cmg6mbm61000111oj77x4b0wp	cmfhsxf490000lmmnwp77vl6x	GAME_DELETE	TEAM	cmg5lf7on000114hlmazxykrr	{"teamName": "test_team", "gameCount": 0, "memberCount": 2}	删除团队: test_team	2025-09-30 13:53:38.041
cmhhqktjr0009w6fy89ahgjdc	cmfhsxf490000lmmnwp77vl6x	REPORT_REJECT	REPORT	cmhhqk7hs0007w6fyzvahxclu	\N	\N	2025-11-02 13:17:56.247
cmhhqm8bd000dw6fypvi1nydr	cmfhsxf490000lmmnwp77vl6x	REPORT_APPROVE	REPORT	cmhhqlk70000bw6fy9coo1fmq	\N	\N	2025-11-02 13:19:02.041
cmhhrrflq000hw6fy55ppgrvv	cmfhsxf490000lmmnwp77vl6x	REPORT_APPROVE	REPORT	cmhhr25b2000fw6fyrzz0ntwn	\N	\N	2025-11-02 13:51:04.382
cmhht7wck0006ead8e5h7iqdn	cmfhsxf490000lmmnwp77vl6x	REPORT_REJECT	REPORT	cmhht7arp0001ead8g08sq5v4	\N	\N	2025-11-02 14:31:52.196
cmhht9u8l000jead884dtsl4h	cmfhsxf490000lmmnwp77vl6x	REPORT_APPROVE	REPORT	cmhht9ejw0008ead8gucdojv4	\N	\N	2025-11-02 14:33:22.773
cmhhtey4i000qead8142rhztf	cmfhsxf490000lmmnwp77vl6x	REPORT_REJECT	REPORT	cmhhteoze000lead80086unqz	\N	\N	2025-11-02 14:37:21.09
cmhhtfzlu0013ead80sqi09y2	cmfhsxf490000lmmnwp77vl6x	REPORT_APPROVE	REPORT	cmhhtfses000sead8pynraf2h	\N	\N	2025-11-02 14:38:09.666
cmhhub39y000c5er4663rqu2a	cmfhsxf490000lmmnwp77vl6x	REPORT_APPROVE	REPORT	cmhhuagrz00015er475xn9zhp	\N	\N	2025-11-02 15:02:20.758
cmhigw60d001x141vxt7gahpq	cmfhsxf490000lmmnwp77vl6x	REPORT_APPROVE	REPORT	cmhigvg6v001m141v9fdird6e	\N	\N	2025-11-03 01:34:35.63
cmhihatpd0030141vnlj8s3hc	cmfhsxf490000lmmnwp77vl6x	REPORT_APPROVE	REPORT	cmhihacf9002p141vjbjc5unj	\N	\N	2025-11-03 01:45:59.521
cmhllonbj001r3fyj5vqdul12	cmfhsxf490000lmmnwp77vl6x	GAME_SUSPEND	GAME	cmhlljrtz001b3fyju6ayec2i	\N	\N	2025-11-05 06:12:01.424
cmhllrlfi001t3fyjobpwvi5w	cmfhsxf490000lmmnwp77vl6x	GAME_RESUME	GAME	cmhlljrtz001b3fyju6ayec2i	\N	\N	2025-11-05 06:14:18.943
cmim0lp9000954hzvrk6oncgt	cmfhsxf490000lmmnwp77vl6x	GAME_SUSPEND	GAME	cmim0jb8c008p4hzv554tp9ef	\N	\N	2025-11-30 17:49:20.532
cmim1k7jk0004t9hy1y4oj35u	cmfhsxf490000lmmnwp77vl6x	GAME_DELETE	GAME	cmim0jb8c008p4hzv554tp9ef	\N	管理员删除	2025-11-30 18:16:10.544
\.


--
-- Data for Name: bet_games; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.bet_games (id, title, description, creator_id, template_id, stake_type, bet_amount, currency, stake_description, evidence_type, evidence_instructions, max_participants, current_participants, start_date, end_date, evidence_deadline, status, category, visibility, result, winner_ids, dispute_count, is_featured, view_count, created_at, updated_at, is_team_game, max_team_size, max_teams, min_team_size, team_mode, additional_notes, dynamic_config, template_config, custom_location, location_restriction, max_distance, join_deadline, review_deadline, arbitration_deadline, creator_ip_city, creator_ip_country, creator_ip_location, dispute_submission_deadline, favorites_count) FROM stdin;
cmhdo67qz00077oozsrib186w	每日运动挑战333	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhcegfin0006hcgendh83z40	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-10-31 01:04:00	2025-11-07 01:04:00	2025-11-08 01:04:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	2	2025-10-30 16:59:30.875	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	LOCAL	50	2025-10-31 00:04:00	2025-11-10 01:04:00	2025-11-17 01:04:00	\N	\N	\N	2025-11-14 01:04:00	0
cmgm3kgee0001aryoqxl2ctov	测试游戏	测试描述	cmfgpklkn000114lt1n0ec61k	\N	FAVOR	\N	USD	\N	TEXT	写下每天的成长感悟	6	1	2025-10-11 14:20:00	2025-10-18 14:20:00	2025-10-19 14:20:00	OPEN	PERSONAL	PUBLIC	\N	\N	0	f	2	2025-10-11 09:52:56.582	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-10-11 13:20:00	2025-10-21 14:20:00	2025-10-28 14:20:00	\N	\N	\N	2025-10-25 14:20:00	0
cmfyqm0ag001g9isas5eaxm5e	冥想练习	承诺每天进行15分钟冥想练习，通过正念冥想缓解压力，提高专注力和内心平静，培养身心健康的生活方式	cmfgpklkn000114lt1n0ec61k	\N	FAVOR	\N	USD		PHOTO	每天拍摄冥想环境或冥想app记录	8	1	2025-09-26 01:31:00	2025-10-10 01:31:00	2025-10-12 01:31:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{}	0	f	3	2025-09-25 01:31:31.96	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-26 00:31:00	2025-10-14 01:31:00	2025-10-21 01:31:00	\N	\N	\N	2025-10-18 01:31:00	0
cmhl1l1e10001qg34m9nbge0i	挨个测试一堆问题	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhcegfin0006hcgendh83z40	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	2	2025-11-04 20:51:00	2025-11-04 20:53:00	2025-11-04 20:58:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{}	0	f	19	2025-11-04 20:49:20.713	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-04 20:49:20.256	2025-11-04 21:28:00	2025-11-04 21:58:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-01 21:58:00	0
cmhohdd4k0005eo2u4adsj5lp	争议测试1	争议测试1	cmfgpklkn000114lt1n0ec61k	cmhgopmcq001murpfg54umnio	POINTS	\N	USD	\N	PHOTO	每天记录断舍离进展，拍摄整理成果	8	6	2025-11-07 06:36:00	2025-11-07 06:38:00	2025-11-07 06:43:00	CLOSED	LIFESTYLE	PUBLIC	COMPLETED	{cmfiilojw000ao5ubr1d3vfk0,cmfgpklkn000114lt1n0ec61k,cmhc7jd8w0006x7g1c2qc46o4}	2	f	150	2025-11-07 06:34:35.061	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-07 06:34:34.689	2025-11-07 07:13:00	2025-11-07 07:43:00	Taipei	Taiwan	Taipei, Taiwan, Taiwan	2025-11-04 07:43:00	0
cmgh2myao000112etmu7ae4mr	感恩日记记录	每天记录三件感恩的事情，培养积极心态，提升幸福感	cmfgpklkn000114lt1n0ec61k	\N	FAVOR	\N	USD		TEXT	每天写下感恩的事情和感受	15	1	2025-10-08 21:27:00	2025-10-22 21:27:00	2025-10-24 21:27:00	CLOSED	PERSONAL	PUBLIC	COMPLETED	{}	0	f	6	2025-10-07 21:28:02.592	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-10-08 20:27:00	2025-10-26 21:27:00	2025-11-02 21:27:00	\N	\N	\N	2025-10-30 21:27:00	0
cmgyu0rnx000q10ifckfz0fv4	英语单词学习打卡	通过听力方式学习英语，主要目的是improvement、romance、business。每天坚持学习，提高语言能力。	cmfgpklkn000114lt1n0ec61k	cmglleuod0003187gb5mr151u	POINTS	\N	USD	\N	PHOTO	每天提交听力练习截图，包含学习内容和时长记录	8	1	2025-10-20 08:46:00	2025-10-27 07:46:00	2025-10-28 07:46:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	2	2025-10-20 07:46:41.806	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"type": "listening", "content": "vocabulary", "language": "english", "partners": ["textbook", "foreign", "app"], "purposes": ["improvement", "romance", "business"], "persistence": "can_persist"}	{}	\N	NONE	\N	2025-10-20 07:46:00	2025-10-30 07:46:00	2025-11-06 07:46:00	\N	\N	\N	2025-11-03 07:46:00	0
cmhigz2jf001z141v5012hxhq	每日运动挑战 举报测试	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmh36n1zs0005td07t6m368m7	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	2	2025-11-03 01:40:00	2025-11-03 01:43:00	2025-11-03 02:00:00	CLOSED	FITNESS	PUBLIC	\N	\N	0	f	31	2025-11-03 01:36:51.099	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-03 01:36:50.745	2025-11-05 02:00:00	2025-11-12 02:00:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-09 02:00:00	0
cmfyqnpxt001n9isaa0gg32w9	每日饮水	承诺每天喝足8杯水（约2000毫升），保持身体充足的水分摄入，促进新陈代谢，维护身体健康和皮肤状态	cmfgpklkn000114lt1n0ec61k	\N	FAVOR	\N	USD		PHOTO	每天记录饮水量，拍摄水杯或饮水app截图	12	2	2025-09-26 01:32:00	2025-10-03 01:32:00	2025-10-05 01:32:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{}	0	f	26	2025-09-25 01:32:51.857	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-26 00:32:00	2025-10-07 01:32:00	2025-10-14 01:32:00	\N	\N	\N	2025-10-11 01:32:00	0
cmhnb891d000fkw1j09az9ccn	创意项目完成111111	完成一个完整的创意项目：写作、绘画、音乐等	cmfhsxf490000lmmnwp77vl6x	cmhgopmcp001lurpfgb7zpa47	POINTS	\N	USD	\N	PHOTO	每天记录项目进展，最后提交完整作品	2	2	2025-11-06 10:58:00	2025-11-06 11:00:00	2025-11-06 11:05:00	CLOSED	PERSONAL	PUBLIC	COMPLETED	{cmfgpklkn000114lt1n0ec61k,cmfhsxf490000lmmnwp77vl6x}	1	f	62	2025-11-06 10:54:52.608	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-06 10:54:52.178	2025-11-06 11:35:00	2025-11-06 12:05:00	Beauharnois	Canada	Beauharnois, Quebec, Canada	2025-11-03 12:05:00	0
cmhcngomk00016na98db1vqr5	技能练习挑战111	每天练习一项技能30分钟，如编程、绘画、乐器等。	cmhcegfin0006hcgendh83z40	cmgzc01dd0002yikfg44g1q92	POINTS	\N	USD	\N	PHOTO	每天提交练习成果照片或视频，展示练习过程和进步。	6	2	2025-10-30 07:51:00	2025-11-06 07:51:00	2025-11-07 07:51:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	9	2025-10-29 23:51:53.516	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	LOCAL	35	2025-10-30 06:51:00	2025-11-09 07:51:00	2025-11-16 07:51:00	\N	\N	\N	2025-11-13 07:51:00	0
cmh9dnrom0007n9uty3268apu	英语单词学习打卡	通过阅读方式学习英语，主要目的是improvement。每天坚持学习，提高语言能力。	cmfgpklkn000114lt1n0ec61k	cmglleuod0003187gb5mr151u	POINTS	\N	USD	\N	PHOTO	每天提交阅读材料截图，包含学习内容和时长记录	20	1	2025-10-27 17:53:00	2025-11-03 16:53:00	2025-11-04 16:53:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-27 16:54:09.382	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"type": "reading", "content": "vocabulary", "language": "english", "partners": ["textbook"], "purposes": ["improvement"], "persistence": "can_persist"}	{}	\N	NONE	\N	2025-10-27 16:53:00	2025-11-06 16:53:00	2025-11-13 16:53:00	\N	\N	\N	2025-11-10 16:53:00	0
cmhjgzgq20001117aa962fuhz	文件上传测试	文件上传测试	cmfgpklkn000114lt1n0ec61k	\N	POINTS	\N	USD	\N	PHOTO	请拍摄照片作为完成证据	6	2	2025-11-03 18:26:00	2025-11-03 18:29:00	2025-11-11 18:29:00	CLOSED	PERSONAL	PUBLIC	COMPLETED	{}	0	f	62	2025-11-03 18:24:55.658	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-03 18:24:55.197	2025-11-11 18:59:00	2025-11-11 19:29:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-08 19:29:00	0
cmhjwgmd300179i0qimtlfz3o	测试文档+文字 和 纯文件	每天晚上10点前睡觉，早上6点前起床，养成健康作息习惯	cmhcegfin0006hcgendh83z40	cmhgopm8y0000urpfz6tn51pm	POINTS	\N	USD	\N	PHOTO	每天晚上拍摄睡前照片（显示时间），早上拍摄起床照片（显示时间）	10	2	2025-11-04 01:39:00	2025-11-04 01:41:00	2025-11-04 01:48:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{cmh36n1zs0005td07t6m368m7,cmhcegfin0006hcgendh83z40}	1	f	67	2025-11-04 01:38:10.359	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-04 01:38:09.98	2025-11-04 02:18:00	2025-11-04 02:48:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-01 02:48:00	0
cmhlq17og003c3fyj8h5z28xz	综合测试  单人	每天30分钟瑜伽练习，提高柔韧性和平衡	cmhcegfin0006hcgendh83z40	cmhgopma5000durpflm8xi2cj	POINTS	\N	USD	\N	PHOTO	每天拍摄瑜伽练习照片或app记录	10	1	2025-11-05 08:14:00	2025-11-05 08:16:00	2025-11-05 08:22:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	10	2025-11-05 08:13:46.144	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-05 08:13:45.791	2025-11-05 08:52:00	2025-11-05 09:22:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 09:22:00	0
cmimekf730098okexf0o0oww2	dispute	深度阅读+讨论分享，每周读完一本书并分享心得	cmh4rbv470000d3m0tokxkudd	cmhgopmcl001jurpf0xibpvcb	POINTS	\N	USD	\N	PHOTO	每周提交读书笔记和讨论记录	10	4	2025-12-01 00:22:00	2025-12-01 00:24:00	2025-12-01 00:28:00	CLOSED	LEARNING	PUBLIC	SETTLEMENT_FAILED	\N	1	f	129	2025-12-01 00:20:15.471	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-12-01 00:20:15.113	2025-12-01 00:58:00	2025-12-03 16:24:00.089	Singapore	Singapore	Singapore, Singapore	2025-11-30 16:24:00.089	0
cmhioyy9e001d1lqo18tjeok0	俯卧撑挑战 1人评价测试	每天完成50个俯卧撑，提升上肢力量	cmfgpklkn000114lt1n0ec61k	cmhgopma3000curpfe4pmxfqo	POINTS	\N	USD	\N	PHOTO	每天拍摄俯卧撑训练照片或视频	10	1	2025-11-03 05:26:00	2025-11-03 05:29:00	2025-11-11 05:25:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	6	2025-11-03 05:20:42.482	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-03 05:20:42.137	2025-11-13 05:25:00	2025-11-20 05:25:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-17 05:25:00	0
cmgm4k4pb000daryonhg4cvl2	技能练习挑战	每天练习一项技能，如乐器演奏、绘画、编程或手工制作，通过持续练习提升专业能力	cmfgpklkn000114lt1n0ec61k	cmglleuog0004187gg6xsr39r	FAVOR	\N	USD	\N	PHOTO	拍摄练习过程或作品的照片/视频	6	1	2025-10-11 20:20:00	2025-10-25 20:20:00	2025-10-26 20:20:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-11 10:20:41.039	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-10-11 19:20:00	2025-10-28 20:20:00	2025-11-04 20:20:00	\N	\N	\N	2025-11-01 20:20:00	0
cmhm9a14e000oxx9r09t1fl2e	单人评价 AAA	每天饮水2000毫升，保持身体水分平衡，促进新陈代谢。	cmfgpklkn000114lt1n0ec61k	cmgzc01e20007yikfe33vxryv	POINTS	\N	USD	\N	PHOTO	每天记录饮水量并拍摄水杯照片，展示饮水进度。	10	1	2025-11-05 17:13:00	2025-11-05 17:15:00	2025-11-05 17:17:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	6	2025-11-05 17:12:30.254	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-05 17:12:29.885	2025-11-05 17:47:00	2025-11-05 18:17:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 18:17:00	0
cmgz54f06004810ifuzvs81w4	电商零售想法阶段创业日志	电商零售领域的想法阶段创业项目，重点关注产品开发、用户获取。每日投入4小时，系统性地推进项目发展，记录创业历程中的挑战、收获和成长。	cmfgpklkn000114lt1n0ec61k	cmglleupl000k187gn5z2vrwu	POINTS	\N	USD	\N	PHOTO	每日记录项目思考和规划进展，提交想法整理、市场调研或商业计划的相关内容。分享创业思路和决策过程。	6	1	2025-10-20 13:56:00	2025-10-27 12:56:00	2025-10-28 12:56:00	OPEN	WORK	PUBLIC	\N	\N	0	f	0	2025-10-20 12:57:27.798	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"focus": ["product_development", "user_acquisition"], "goals": ["feature_development"], "stage": "idea", "metrics": ["user_count"], "industry": "ecommerce", "challenges": ["time_management"], "timeCommitment": "4_hours", "reviewFrequency": "weekly"}	{}	\N	NONE	\N	2025-10-20 12:56:00	2025-10-30 12:56:00	2025-11-06 12:56:00	\N	\N	\N	2025-11-03 12:56:00	0
cmhegwm2p000dbpix7tgjeihp	每日30分钟非虚构类阅读2222222	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmhc7jd8w0006x7g1c2qc46o4	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	1	2025-10-31 14:28:00	2025-11-07 14:28:00	2025-11-08 14:28:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-31 06:23:51.745	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	LOCAL	50	2025-10-31 13:28:00	2025-11-10 14:28:00	2025-11-17 14:28:00	\N	\N	\N	2025-11-14 14:28:00	0
cmh9wddoo000fn9uttdaok57f	每日30分钟非虚构类阅读	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmfgpklkn000114lt1n0ec61k	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	1	2025-10-28 02:37:00	2025-11-04 01:37:00	2025-11-05 01:37:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-28 01:37:57.384	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-10-28 01:37:00	2025-11-07 01:37:00	2025-11-14 01:37:00	\N	\N	\N	2025-11-11 01:37:00	0
cmhegsud40001bpixkubxsi7e	每日饮水2升挑战111111111111111	每天饮水2000毫升，保持身体水分平衡，促进新陈代谢。	cmhc7jd8w0006x7g1c2qc46o4	cmgzc01e20007yikfe33vxryv	POINTS	\N	USD	\N	PHOTO	每天记录饮水量并拍摄水杯照片，展示饮水进度。	10	1	2025-10-31 14:25:00	2025-11-07 14:25:00	2025-11-08 14:25:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	0	2025-10-31 06:20:55.864	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	LOCAL	50	2025-10-31 13:25:00	2025-11-10 14:25:00	2025-11-17 14:25:00	\N	\N	\N	2025-11-14 14:25:00	0
cmflzh4ka000124jjoxctvu86	高级健身追踪	专业级健身挑战，包含详细数据分析和个性化建议，通过科学的运动监测帮助您达到最佳健身效果	cmfgpklkn000114lt1n0ec61k	\N	FAVOR	\N	USD		PHOTO	使用专业健身app记录，提交详细的运动数据截图	12	1	2025-09-17 03:18:00	2025-10-01 03:18:00	2025-10-03 03:18:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{}	0	f	3	2025-09-16 03:18:40.474	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-17 02:18:00	2025-10-05 03:18:00	2025-10-12 03:18:00	\N	\N	\N	2025-10-09 03:18:00	0
cmhegv6ct0007bpixtw8bxwnw	技能练习挑战	每天练习一项技能30分钟，如编程、绘画、乐器等。	cmhc7jd8w0006x7g1c2qc46o4	cmgzc01dd0002yikfg44g1q92	POINTS	\N	USD	\N	PHOTO	每天提交练习成果照片或视频，展示练习过程和进步。	6	1	2025-10-31 14:27:00	2025-11-07 14:27:00	2025-11-08 14:27:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-31 06:22:44.717	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	LOCAL	50	2025-10-31 13:27:00	2025-11-10 14:27:00	2025-11-17 14:27:00	\N	\N	\N	2025-11-14 14:27:00	0
cmhds5ddj000110bh5amv3bsw	每日30分钟非虚构类阅读11111111111	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmhcegfin0006hcgendh83z40	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	1	2025-10-31 02:55:00	2025-11-07 02:55:00	2025-11-08 02:55:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-30 18:50:49.975	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	LOCAL	50	2025-10-31 01:55:00	2025-11-10 02:55:00	2025-11-17 02:55:00	\N	\N	\N	2025-11-14 02:55:00	0
cmfuzsf8w00119isa4t5mlh68	早起挑战	承诺每天早上6点前起床，培养早睡早起的健康作息习惯，提高一天的工作和学习效率，享受清晨的宁静时光	cmfgpklkn000114lt1n0ec61k	\N	FAVOR	\N	USD		PHOTO	每天早上6点前拍摄起床照片，显示时间	8	1	2025-09-23 10:37:00	2025-09-30 10:37:00	2025-10-02 10:37:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{}	0	f	9	2025-09-22 10:37:23.121	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-23 09:37:00	2025-10-04 10:37:00	2025-10-11 10:37:00	\N	\N	\N	2025-10-08 10:37:00	0
cmhdwufzn0001b33ng0vfu8nd	每日运动挑战的	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhcegfin0006hcgendh83z40	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-10-31 05:07:00	2025-11-07 05:07:00	2025-11-08 05:07:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	2	2025-10-30 21:02:18.227	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	LOCAL	50	2025-10-31 04:07:00	2025-11-10 05:07:00	2025-11-17 05:07:00	\N	\N	\N	2025-11-14 05:07:00	0
cmhl1rk30000hqg34pw4lht4v	处理一堆问题 2	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhcegfin0006hcgendh83z40	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-11-04 20:54:00	2025-11-04 20:56:00	2025-11-04 21:01:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	12	2025-11-04 20:54:24.876	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-04 20:54:24.514	2025-11-04 21:31:00	2025-11-04 22:01:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-01 22:01:00	0
cmhlccyqa0014hru4yzzp5owk	测试不评价，是不是到期自动结束游戏 啊啊啊啊啊啊啊啊啊啊啊啊	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmh36n1zs0005td07t6m368m7	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-11-05 01:52:00	2025-11-05 01:54:00	2025-11-05 01:59:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	6	2025-11-05 01:50:59.794	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-05 01:50:59.417	2025-11-05 02:29:00	2025-11-05 02:59:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 02:59:00	0
cmfjq31050007az4kfbucjcdq	冥想练习	承诺每天进行15分钟冥想练习，通过正念冥想缓解压力，提高专注力和内心平静，培养身心健康的生活方式	cmfgpklkn000114lt1n0ec61k	\N	FAVOR	\N	USD		PHOTO	每天拍摄冥想环境或冥想app记录	8	1	2025-09-15 13:19:00	2025-09-29 13:19:00	2025-10-01 13:19:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{}	0	f	3	2025-09-14 13:20:13.781	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-15 12:19:00	2025-10-03 13:19:00	2025-10-10 13:19:00	\N	\N	\N	2025-10-07 13:19:00	0
cmhcbwt110001tqgxj3frn3i8	每日饮水2升挑战	每天饮水2000毫升，保持身体水分平衡，促进新陈代谢。	cmhc7jd8w0006x7g1c2qc46o4	cmgzc01e20007yikfe33vxryv	POINTS	\N	USD	\N	PHOTO	每天记录饮水量并拍摄水杯照片，展示饮水进度。	10	2	2025-10-30 02:29:00	2025-10-31 14:27:00	2025-10-31 18:31:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{}	0	f	11	2025-10-29 18:28:30.325	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-10-30 01:29:00	2025-11-02 18:31:00	2025-11-09 18:31:00	\N	\N	\N	2025-11-06 18:31:00	0
cmhmick19000129id11sb2sv2	视频上传测试	视频上传测试	cmhcegfin0006hcgendh83z40	cmgzc01e20007yikfe33vxryv	POINTS	\N	USD	\N	PHOTO	视频上传测试	10	2	2025-11-05 21:28:00	2025-11-05 21:30:00	2025-11-05 21:38:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{cmhc7jd8w0006x7g1c2qc46o4}	0	f	23	2025-11-05 21:26:24.621	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-05 21:26:24.183	2025-11-05 22:08:00	2025-11-05 22:38:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 22:38:00	0
cmhcub06t00018iy4nns519qb	英语学习挑战11111111	每天学习英语30分钟，通过背单词和练习口语提升英语水平。	cmhcegfin0006hcgendh83z40	cmgzc01cu0000yikfckccja5x	POINTS	\N	USD	\N	PHOTO	每天提交学习截图或练习记录，包括学习时长和内容。	8	1	2025-10-30 11:08:00	2025-11-06 11:08:00	2025-11-07 11:08:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	4	2025-10-30 03:03:25.877	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	LOCAL	50	2025-10-30 10:08:00	2025-11-09 11:08:00	2025-11-16 11:08:00	\N	\N	\N	2025-11-13 11:08:00	0
cmgysqm5q000e10if1qulap66	英语单词学习打卡	通过阅读方式学习英语，主要目的是improvement。每天坚持学习，提高语言能力。	cmfgpklkn000114lt1n0ec61k	cmglleuod0003187gb5mr151u	POINTS	\N	USD	\N	PHOTO	每天提交阅读材料截图，包含学习内容和时长记录	8	1	2025-10-20 08:10:00	2025-10-27 07:10:00	2025-10-28 07:10:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-20 07:10:48.494	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"type": "reading", "content": "vocabulary", "language": "english", "partners": ["textbook"], "purposes": ["improvement"], "persistence": "can_persist"}	{}	\N	NONE	\N	2025-10-20 07:10:00	2025-10-30 07:10:00	2025-11-06 07:10:00	\N	\N	\N	2025-11-03 07:10:00	0
cmhk7abeh000rp1dn46fy94jn	互评详情链接 以及 扣分数值 专用测试	互评详情链接 以及 扣分数值 专用测试	cmhcegfin0006hcgendh83z40	cmhgopm8y0000urpfz6tn51pm	POINTS	\N	USD	\N	PHOTO	每天晚上拍摄睡前照片（显示时间），早上拍摄起床照片（显示时间）	10	2	2025-11-04 06:42:00	2025-11-04 06:44:00	2025-11-04 06:48:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{}	1	f	49	2025-11-04 06:41:11.993	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-04 06:41:11.536	2025-11-04 07:18:00	2025-11-04 07:48:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-01 07:48:00	0
cmiv0h59g0011nbfdm8kuzcgj	arbitration page screenshot	Read one book per week and participate in discussions to deepen understanding.	cmfgpklkn000114lt1n0ec61k	cmhgopmcl001jurpf0xibpvcb	POINTS	\N	USD	\N	PHOTO	Submit weekly reading progress, book reviews, and discussion participation records.	10	3	2025-12-07 01:00:00	2025-12-07 01:02:00	2025-12-07 01:05:00	DISPUTED	LEARNING	PUBLIC	UNDER_REVIEW	\N	1	f	35	2025-12-07 00:55:43.588	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-12-07 00:55:43.506	2025-12-07 01:35:00	2025-12-12 01:26:27.43	Singapore	Singapore	Singapore, Singapore	2025-12-09 01:26:27.43	1
cmgyrq5v500019bn9dezllbjh	英语单词学习打卡	通过阅读方式学习英语，主要目的是improvement。每天坚持学习，提高语言能力。	cmfgpklkn000114lt1n0ec61k	cmglleuod0003187gb5mr151u	POINTS	\N	USD	\N	PHOTO	每天提交阅读材料截图，包含学习内容和时长记录	8	1	2025-10-20 07:42:00	2025-10-27 06:42:00	2025-10-28 06:42:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-20 06:42:27.761	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"type": "reading", "content": "vocabulary", "language": "english", "partners": ["textbook"], "purposes": ["improvement"], "persistence": "can_persist"}	{}	\N	NONE	\N	2025-10-20 06:42:00	2025-10-30 06:42:00	2025-11-06 06:42:00	\N	\N	\N	2025-11-03 06:42:00	0
cmhllzihs002g3fyj6m6t6crl	都不选择，测试专用 AAAAAAA	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmh36n1zs0005td07t6m368m7	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	2	2025-11-05 06:22:00	2025-11-05 06:24:00	2025-11-05 06:29:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	25	2025-11-05 06:20:28.384	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-11-05 06:20:28.035	2025-11-05 06:59:00	2025-11-05 07:29:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 07:29:00	0
cmhgov9uk0001rhx7d91va8vs	每日万步挑战BBB	每天走路10000步，保持活力	cmfgpklkn000114lt1n0ec61k	cmhgopm9w0009urpfy6z694bg	POINTS	\N	USD	\N	PHOTO	每天拍摄步数app截图	15	1	2025-11-01 20:41:00	2025-11-08 20:41:00	2025-11-09 20:41:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	2	2025-11-01 19:42:18.524	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	LOCAL	50	2025-11-01 19:42:18.074	2025-11-11 20:41:00	2025-11-18 20:41:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-15 20:41:00	0
cmhfa95ls000dacec1d11yjtl	时间测试 前端日志	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmhc7jd8w0006x7g1c2qc46o4	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	1	2025-11-01 04:10:00	2025-11-08 04:10:00	2025-11-09 04:10:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-31 20:05:25.792	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	LOCAL	50	2025-11-01 03:10:00	2025-11-11 04:10:00	2025-11-18 04:10:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-15 04:10:00	0
cmhf9l4qy0011140lgxgfurcb	AAAAAAAA	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhc7jd8w0006x7g1c2qc46o4	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-11-01 03:51:00	2025-11-08 03:51:00	2025-11-09 03:51:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	0	2025-10-31 19:46:44.938	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-01 02:51:00	2025-11-11 03:51:00	2025-11-18 03:51:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-15 03:51:00	0
cmhawi4tt0001xe90c0e883k6	每日运动挑战	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmh36n1zs0005td07t6m368m7	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	2	2025-10-29 02:29:00	2025-11-05 02:29:00	2025-11-06 02:29:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{}	0	f	20	2025-10-28 18:29:25.361	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-10-29 01:29:00	2025-11-08 02:29:00	2025-11-15 02:29:00	\N	\N	\N	2025-11-12 02:29:00	0
cmhf8k1sn000j140le95g1eps	每日运动挑战SSSSSSSSSSSSSS	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhc7jd8w0006x7g1c2qc46o4	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-11-02 08:00:00	2025-11-09 08:00:00	2025-11-10 08:00:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	0	2025-10-31 19:17:54.84	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	LOCAL	50	2025-11-02 07:00:00	2025-11-12 08:00:00	2025-11-19 08:00:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-16 08:00:00	0
cmhgt4mta000jrhx7801hzo66	每日8小时深度sdf	每天保证8小时优质睡眠，通过睡眠APP监测睡眠数据，重点改善深度睡眠、REM睡眠。科学睡眠，提升生活质量。	cmhcc8p1o000atqgxpzkeao00	cmhgopm960001urpfmuheqg6k	POINTS	\N	USD	\N	PHOTO	每天提交睡眠监测设备的睡眠报告截图，包含睡眠时长、深度睡眠比例等数据。	8	1	2025-11-01 21:46:00	2025-11-15 21:46:00	2025-11-16 21:46:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	2	2025-11-01 21:41:33.694	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"sleepGoals": ["deep_sleep", "rem_sleep"], "targetDuration": "8h", "trackingMethod": "sleep_app"}	{}	\N	NONE	\N	2025-11-01 21:41:33.334	2025-11-18 21:46:00	2025-11-25 21:46:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-22 21:46:00	0
cmh86b571000be17r2t331nab	卧室zone_system整理挑战	通过分区系统对卧室进行整理，实现断舍离的目标。系统性地改善居住环境，提升生活品质和居住舒适度。	cmh4rbv470000d3m0tokxkudd	cmglleup3000c187g54yvah1w	POINTS	\N	USD	\N	PHOTO	每次整理提交整理过程和成果照片，记录使用的方法和工具。分享整理技巧和维护心得。	10	1	2025-10-26 21:40:00	2025-11-02 20:40:00	2025-11-03 20:40:00	OPEN	LIFESTYLE	PUBLIC	\N	\N	0	f	0	2025-10-26 20:40:36.877	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"areas": ["bedroom"], "goals": ["declutter"], "tools": ["storage_boxes"], "methods": ["zone_system"], "maintenance": "weekly_review", "timeCommitment": "30_min_daily", "organizationStyle": "functional"}	{}	\N	NONE	\N	2025-10-26 20:40:00	2025-11-05 20:40:00	2025-11-12 20:40:00	\N	\N	\N	2025-11-09 20:40:00	0
cmiu71qmn0005nbfdtekrha9q	wwwwwwwwwwww	Complete a creative project over 30 days with daily progress and iterations.	cmgxfcw0d0000o777zhox72xw	cmhgopmcp001lurpfgb7zpa47	POINTS	\N	USD	\N	PHOTO	Submit daily project progress photos, sketches, or work-in-progress updates.	6	2	2025-12-06 11:15:00	2025-12-06 11:17:00	2025-12-06 11:22:00	COMPLETED	PERSONAL	PUBLIC	COMPLETED	{}	0	f	15	2025-12-06 11:11:55.919	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-12-06 11:11:55.802	2025-12-06 11:52:00	2025-12-11 11:52:00.054	Singapore	Singapore	Singapore, Singapore	2025-12-08 11:52:00.054	0
cmgzaye2b004w10ifgfhevaf9	每日2.5L改善肌肤挑战	从目前的1.5-2L提升到每日2.5L饮水量，通过手机APP的方式，实现改善肌肤的健康目标。科学饮水，养成良好的饮水习惯。	cmfgpklkn000114lt1n0ec61k	cmglleuow000a187g6buthcwx	POINTS	\N	USD	\N	PHOTO	每日记录饮水量和时间，可以使用饮水应用或拍照记录。提交每日饮水总量截图和身体感受记录。	12	1	2025-10-20 16:40:00	2025-10-27 15:40:00	2025-10-28 15:40:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	0	2025-10-20 15:40:44.339	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"schedule": ["morning_wake", "before_meals"], "reminders": ["phone_app"], "motivation": ["skin_health"], "targetAmount": "2.5L", "currentIntake": "1.5-2L"}	{}	\N	NONE	\N	2025-10-20 15:40:00	2025-10-30 15:40:00	2025-11-06 15:40:00	\N	\N	\N	2025-11-03 15:40:00	0
cmfzrhoe400072tw3d8te4hwn	语言学习打卡	承诺每天学习外语30分钟，通过持续的语言学习提高外语水平，拓展国际视野，为未来的学习和工作打下坚实基础	cmfgpklkn000114lt1n0ec61k	\N	FAVOR	\N	USD		PHOTO	每天拍摄学习进度截图或学习笔记	15	1	2025-09-26 18:43:00	2025-10-10 18:43:00	2025-10-12 18:43:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	1	2025-09-25 18:43:55.708	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-26 17:43:00	2025-10-14 18:43:00	2025-10-21 18:43:00	\N	\N	\N	2025-10-18 18:43:00	0
cmgm4jk8j0007aryom8bfkppi	技能练习挑战	每天练习一项技能，如乐器演奏、绘画、编程或手工制作，通过持续练习提升专业能力	cmfgpklkn000114lt1n0ec61k	cmglleuog0004187gg6xsr39r	FAVOR	\N	USD	\N	PHOTO	拍摄练习过程或作品的照片/视频	6	1	2025-10-11 20:20:00	2025-10-25 20:20:00	2025-10-26 20:20:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-11 10:20:14.516	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-10-11 19:20:00	2025-10-28 20:20:00	2025-11-04 20:20:00	\N	\N	\N	2025-11-01 20:20:00	0
cmgz2t7ng003210ifn0txseqw	每周3次力量训练挑战	通过力量训练锻炼全身肌群，每次训练1小时，主要目标是健身目标。坚持规律训练，打造理想身材。	cmfgpklkn000114lt1n0ec61k	cmglleuon0006187g11n0c4wi	POINTS	\N	USD	\N	PHOTO	每次训练后提交详细训练数据和动作视频，包含训练内容、使用重量和训练感受	8	2	2025-10-20 12:52:00	2025-10-27 11:52:00	2025-10-28 11:52:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{}	0	f	35	2025-10-20 11:52:45.82	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"duration": "60min", "frequency": "3_times_week", "experience": "advanced", "targetMuscle": [], "trainingType": "strength"}	{}	\N	NONE	\N	2025-10-20 11:52:00	2025-10-30 11:52:00	2025-11-06 11:52:00	\N	\N	\N	2025-11-03 11:52:00	0
cmitkkq910001h9w62bojgsih	Leadership Skills Development	Develop leadership skills through daily practice: team management, decision making, communication.	cmgxfcw0d0000o777zhox72xw	cmhgopmcw001purpfnksb41fg	POINTS	\N	USD	\N	PHOTO	Submit daily leadership practice records and reflection journals.	8	1	2025-12-06 00:47:00	2026-01-03 00:47:00	2026-01-04 00:47:00	OPEN	WORK	PUBLIC	\N	\N	0	f	0	2025-12-06 00:42:50.726	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-12-06 00:42:50.564	2026-01-04 01:17:00	2026-01-04 01:47:00	Singapore	Singapore	Singapore, Singapore	\N	0
cmgyshssx000p9bn9p2oknkde	英语单词学习打卡	通过阅读方式学习英语，主要目的是improvement。每天坚持学习，提高语言能力。	cmfgpklkn000114lt1n0ec61k	cmglleuod0003187gb5mr151u	POINTS	\N	USD	\N	PHOTO	每天提交阅读材料截图，包含学习内容和时长记录	8	1	2025-10-20 08:03:00	2025-10-27 07:03:00	2025-10-28 07:03:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	2	2025-10-20 07:03:57.201	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"type": "reading", "content": "vocabulary", "language": "english", "partners": ["textbook"], "purposes": ["improvement"], "persistence": "can_persist"}	{}	\N	NONE	\N	2025-10-20 07:03:00	2025-10-30 07:03:00	2025-11-06 07:03:00	\N	\N	\N	2025-11-03 07:03:00	0
cmhilwns7000n1lqo98yhab6d	每日运动挑战 测试单人评价	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmfgpklkn000114lt1n0ec61k	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-11-03 03:59:00	2025-11-03 04:05:00	2025-11-11 03:59:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	6	2025-11-03 03:54:56.743	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-03 03:54:56.388	2025-11-13 03:59:00	2025-11-20 03:59:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-17 03:59:00	0
cmhf7pzm60001140lt8s1sbs1	每日运动挑战AAAAA	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhcc8p1o000atqgxpzkeao00	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-11-01 02:59:00	2025-11-08 02:59:00	2025-11-09 02:59:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	2	2025-10-31 18:54:32.334	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	LOCAL	50	2025-11-01 01:59:00	2025-11-11 02:59:00	2025-11-18 02:59:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-15 02:59:00	0
cmhll9iu1000n3fyjb4itb587	CCCCCCC	每天早上完成固定的晨间仪式：起床、喝水、拉伸、冥想	cmh36n1zs0005td07t6m368m7	cmhgopmbs0014urpf3suk1tiq	POINTS	\N	USD	\N	PHOTO	每天拍摄晨间仪式完成照片	15	2	2025-11-05 06:01:00	2025-11-05 06:03:00	2025-11-05 06:05:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{}	0	f	17	2025-11-05 06:00:15.769	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-05 06:00:15.416	2025-11-05 06:35:00	2025-11-05 07:05:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 07:05:00	0
cmhdcgmph0001wj8x3x7ttlxk	每日饮水2升挑战1111111	每天饮水2000毫升，保持身体水分平衡，促进新陈代谢。	cmhc7jd8w0006x7g1c2qc46o4	cmgzc01e20007yikfe33vxryv	POINTS	\N	USD	\N	PHOTO	每天记录饮水量并拍摄水杯照片，展示饮水进度。	10	1	2025-10-30 19:36:00	2025-11-06 19:36:00	2025-11-07 19:36:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	6	2025-10-30 11:31:41.429	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	LOCAL	50	2025-10-30 18:36:00	2025-11-09 19:36:00	2025-11-16 19:36:00	\N	\N	\N	2025-11-13 19:36:00	0
cmhohtc750026eo2uynzst7dh	无人评价是否结束	无人评价是否结束	cmh36n1zs0005td07t6m368m7	cmhgopmbz0018urpfs5u2q6fn	POINTS	\N	USD	\N	PHOTO	每天拍摄单词app学习记录	2	2	2025-11-07 06:48:00	2025-11-07 06:50:00	2025-11-07 06:55:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	1	f	20	2025-11-07 06:47:00.353	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-07 06:46:59.988	2025-11-07 07:25:00	2025-11-07 07:55:00	Taipei	Taiwan	Taipei, Taiwan, Taiwan	2025-11-04 07:55:00	0
cmhguu62v0001lrbs74qsptsm	16:8间歇性断食挑战	采用16:8方法（16小时断食，8小时进食）进行间歇性断食，实现1个健康目标。	cmh36n1zs0005td07t6m368m7	cmhgopmcb001eurpfx3eu7prl	POINTS	\N	USD	\N	PHOTO	每天记录断食时间、进食窗口、体重变化等数据。提交饮食记录和身体感受。	6	1	2025-11-01 22:34:00	2025-11-15 22:34:00	2025-11-16 22:34:00	CLOSED	HEALTH	PUBLIC	\N	\N	0	f	8	2025-11-01 22:29:24.679	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["weight_loss"], "fastingMethod": "16_8"}	{}	\N	NONE	\N	2025-11-01 22:29:24.24	2025-11-18 22:34:00	2025-11-25 22:34:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-22 22:34:00	0
cmgm4pivy000paryofaix1z5y	早起挑战	承诺每天早上6点前起床，培养早睡早起的健康作息习惯，提高一天的工作和学习效率，享受清晨的宁静时光	cmfgpklkn000114lt1n0ec61k	cmglleuo70001187gxr1fbs82	FAVOR	\N	USD	\N	PHOTO	每天早上6点前拍摄起床照片，显示时间	8	1	2025-10-11 20:24:00	2025-10-18 20:24:00	2025-10-19 20:24:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	0	2025-10-11 10:24:52.702	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-10-11 19:24:00	2025-10-21 20:24:00	2025-10-28 20:24:00	\N	\N	\N	2025-10-25 20:24:00	0
cmha0taik000rn9utist2byqj	1111111感恩日记	通过文字日记的方式，重点关注生活各方面的感恩体验，实现积极心态的目标。每日坚持感恩练习，培养积极心态，提升生活幸福感。	cmfgpklkn000114lt1n0ec61k	cmglleup9000f187g7x7zw65p	POINTS	\N	USD	\N	TEXT	每日提交详细的感恩记录，描述感恩事项的具体情况和内心感受。分享感恩练习的体验和收获。	15	1	2025-10-28 12:41:00	2025-10-28 13:44:00	2025-10-28 15:45:00	OPEN	PERSONAL	PUBLIC	\N	\N	0	f	19	2025-10-28 03:42:18.236	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"depth": "detailed", "goals": ["positive_mindset"], "format": ["written_journal"], "itemCount": "3_items", "timeOfDay": "evening", "focusAreas": ["relationships"]}	{}	\N	NONE	\N	2025-10-28 11:41:00	2025-10-30 15:45:00	2025-11-06 15:45:00	\N	\N	\N	2025-11-03 15:45:00	0
cmgz99ppu004k10ifwslc7mda	每日2L改善肌肤挑战	从目前的1.5-2L提升到每日2L饮水量，通过手机APP的方式，实现改善肌肤的健康目标。科学饮水，养成良好的饮水习惯。	cmfgpklkn000114lt1n0ec61k	cmglleuow000a187g6buthcwx	POINTS	\N	USD	\N	PHOTO	每日记录饮水量和时间，可以使用饮水应用或拍照记录。提交每日饮水总量截图和身体感受记录。	12	1	2025-10-20 15:53:00	2025-10-27 14:53:00	2025-10-28 14:53:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	2	2025-10-20 14:53:33.426	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"schedule": ["morning_wake", "before_meals"], "reminders": ["phone_app"], "motivation": ["skin_health"], "targetAmount": "2L", "currentIntake": "1.5-2L"}	{}	\N	NONE	\N	2025-10-20 14:53:00	2025-10-30 14:53:00	2025-11-06 14:53:00	\N	\N	\N	2025-11-03 14:53:00	0
cmhll5bdg000h3fyj3z9xvcfw	个人游戏测试	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmh36n1zs0005td07t6m368m7	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	1	2025-11-05 05:57:00	2025-11-05 06:01:00	2025-11-05 06:03:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-11-05 05:56:59.476	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-11-05 05:56:59.117	2025-11-05 06:33:00	2025-11-05 07:03:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 07:03:00	0
cmgyrcaxc0001kgtc6kym2lft	英语单词学习打卡	通过阅读方式学习英语，主要目的是improvement。每天坚持学习，提高语言能力。	cmfgpklkn000114lt1n0ec61k	cmglleuod0003187gb5mr151u	POINTS	\N	USD	\N	PHOTO	每天提交阅读材料截图，包含学习内容和时长记录	8	1	2025-10-20 07:31:00	2025-10-27 06:31:00	2025-10-28 06:31:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	8	2025-10-20 06:31:41.136	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"type": "reading", "content": "vocabulary", "language": "english", "partners": ["textbook"], "purposes": ["improvement"], "persistence": "can_persist"}	{}	\N	NONE	\N	2025-10-20 06:31:00	2025-10-30 06:31:00	2025-11-06 06:31:00	\N	\N	\N	2025-11-03 06:31:00	0
cmhf9rrl40001acecs3u08zlu	两个地理位置	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhc7jd8w0006x7g1c2qc46o4	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-11-01 03:56:00	2025-11-08 03:56:00	2025-11-09 03:56:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	0	2025-10-31 19:51:54.472	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	两个地理位置	CUSTOM	\N	2025-11-01 02:56:00	2025-11-11 03:56:00	2025-11-18 03:56:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-15 03:56:00	0
cmhf8g1uj0007140l9bjhf2ip	每日运动挑战SSS	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhc7jd8w0006x7g1c2qc46o4	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-11-01 04:14:00	2025-11-08 04:14:00	2025-11-09 04:14:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	8	2025-10-31 19:14:48.283	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	LOCAL	50	2025-11-01 03:14:00	2025-11-11 04:14:00	2025-11-18 04:14:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-15 04:14:00	0
cmhm7rhjg0001xx9r4hvuxlhx	接着测试	每天饮水2000毫升，保持身体水分平衡，促进新陈代谢。	cmhcegfin0006hcgendh83z40	cmgzc01e20007yikfe33vxryv	POINTS	\N	USD	\N	PHOTO	每天记录饮水量并拍摄水杯照片，展示饮水进度。	10	2	2025-11-05 16:31:00	2025-11-05 16:33:00	2025-11-05 16:39:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{}	0	f	11	2025-11-05 16:30:05.452	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-05 16:30:05.019	2025-11-05 17:09:00	2025-11-05 17:39:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 17:39:00	0
cmhgoxiur0007rhx7cis5629u	均衡饮食挑战	每天摄入蔬菜、水果、蛋白质、碳水化合物，营养均衡	cmfgpklkn000114lt1n0ec61k	cmhgopm9a0003urpfaautoev5	POINTS	\N	USD	\N	PHOTO	每天拍摄三餐照片，展示营养搭配	8	1	2025-11-01 19:48:00	2025-11-08 19:48:00	2025-11-09 19:48:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	0	2025-11-01 19:44:03.507	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-01 19:44:03.148	2025-11-11 19:48:00	2025-11-18 19:48:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-15 19:48:00	0
cmgz8hb3e004e10ifta3qet69	每日2.5L改善肌肤挑战	从目前的1.5-2L提升到每日2.5L饮水量，通过手机APP的方式，实现改善肌肤的健康目标。科学饮水，养成良好的饮水习惯。	cmfgpklkn000114lt1n0ec61k	cmglleuow000a187g6buthcwx	POINTS	\N	USD	\N	PHOTO	每日记录饮水量和时间，可以使用饮水应用或拍照记录。提交每日饮水总量截图和身体感受记录。	12	1	2025-10-20 15:31:00	2025-10-27 14:31:00	2025-10-28 14:31:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	0	2025-10-20 14:31:28.106	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"schedule": ["morning_wake", "before_meals"], "reminders": ["phone_app"], "motivation": ["skin_health"], "targetAmount": "2.5L", "currentIntake": "1.5-2L"}	{}	\N	NONE	\N	2025-10-20 14:31:00	2025-10-30 14:31:00	2025-11-06 14:31:00	\N	\N	\N	2025-11-03 14:31:00	0
cmholuz8l004oeo2ux4k76e13	测试多个仲裁修改内容	测试多个仲裁修改内容	cmfgpklkn000114lt1n0ec61k	cmgzc01e20007yikfe33vxryv	POINTS	\N	USD	\N	PHOTO	测试多个仲裁修改内容	10	5	2025-11-07 08:42:00	2025-11-07 08:44:00	2025-11-07 08:52:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{}	2	f	36	2025-11-07 08:40:15.334	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-07 08:40:14.952	2025-11-07 09:22:00	2025-11-07 09:52:00	Taipei	Taiwan	Taipei, Taiwan, Taiwan	2025-11-04 09:52:00	0
cmfuyff36000g9isakmxjcmr5	语言学习打卡	承诺每天学习外语30分钟，通过持续的语言学习提高外语水平，拓展国际视野，为未来的学习和工作打下坚实基础	cmfgpmfbo000314ltz0jj7n1y	\N	FAVOR	\N	USD		PHOTO	每天拍摄学习进度截图或学习笔记	15	1	2025-09-23 09:59:00	2025-10-07 09:59:00	2025-10-09 09:59:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	10	2025-09-22 09:59:16.771	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-23 08:59:00	2025-10-11 09:59:00	2025-10-18 09:59:00	\N	\N	\N	2025-10-15 09:59:00	0
cmhjvs7p8000f9i0qetbysww4	单人游戏结束测试	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmhcegfin0006hcgendh83z40	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	1	2025-11-04 01:22:00	2025-11-04 01:25:00	2025-11-04 01:29:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	8	2025-11-04 01:19:11.612	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-11-04 01:19:11.233	2025-11-04 01:59:00	2025-11-04 02:29:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-01 02:29:00	0
cmfhqcmch000p8y89n79410wa	某某挑战某某挑战某某挑战1	某某挑战某某挑战某某挑战某某挑战某某挑战	cmfgpjvmb000014ltuwk3uwht	\N	FAVOR	\N	USD	某某挑战某某挑战某某挑战某某挑战某某挑战	PHOTO	某某挑战某某挑战某某挑战某某挑战某某挑战某某挑战某某挑战某某挑战	6	6	2025-09-13 04:23:00	2025-09-13 05:23:00	2025-09-13 05:51:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	77	2025-09-13 03:52:08.993	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-13 03:23:00	2025-09-15 05:51:00	2025-09-22 05:51:00	\N	\N	\N	2025-09-19 05:51:00	0
cmhf7a0vx0001wnlzsjipiz38	每日运动挑战AAAAAAA	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhcc8p1o000atqgxpzkeao00	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-11-01 02:46:00	2025-11-08 02:46:00	2025-11-09 02:46:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	0	2025-10-31 18:42:07.485	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	LOCAL	50	2025-11-01 01:46:00	2025-11-11 02:46:00	2025-11-18 02:46:00	\N	\N	\N	2025-11-15 02:46:00	0
cmhcsdwlz000d6na9zmwptwvz	每日运动挑战2413132	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhcegfin0006hcgendh83z40	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-10-30 10:08:00	2025-11-06 10:08:00	2025-11-07 10:08:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	2	2025-10-30 02:09:41.975	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-10-30 09:08:00	2025-11-09 10:08:00	2025-11-16 10:08:00	\N	\N	\N	2025-11-13 10:08:00	0
cmhl1uacq000nqg34wu04xwvn	处理一堆问题 3	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmh36n1zs0005td07t6m368m7	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	3	2025-11-04 20:58:00	2025-11-04 21:00:00	2025-11-04 21:05:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{}	0	f	82	2025-11-04 20:56:32.234	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-04 20:56:31.885	2025-11-04 21:35:00	2025-11-04 22:05:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-01 22:05:00	0
cmfzrgl3f00012tw32obb730j	冥想练习	承诺每天进行15分钟冥想练习，通过正念冥想缓解压力，提高专注力和内心平静，培养身心健康的生活方式	cmfgpklkn000114lt1n0ec61k	\N	FAVOR	\N	USD		PHOTO	每天拍摄冥想环境或冥想app记录	8	1	2025-09-26 18:43:00	2025-10-10 18:43:00	2025-10-12 18:43:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{}	0	f	42	2025-09-25 18:43:04.779	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-26 17:43:00	2025-10-14 18:43:00	2025-10-21 18:43:00	\N	\N	\N	2025-10-18 18:43:00	0
cmhgt84k9000prhx7kx9ic6i2	睡前3件事感恩日记	每天睡前记录3件事感恩的事，关注4个生活领域。培养积极心态，提升幸福感。	cmhcc8p1o000atqgxpzkeao00	cmhgopm9h0006urpf9je6j9sm	POINTS	\N	USD	\N	PHOTO	每天记录3件事感恩的事，可以是文字、照片或语音。真诚表达感激之情。	8	1	2025-11-01 21:48:00	2025-11-08 21:48:00	2025-11-09 21:48:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	2	2025-11-01 21:44:16.665	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"itemCount": "3_items", "focusAreas": ["relationships", "simple_joys", "health", "achievements"], "writingTime": "evening"}	{}	\N	LOCAL	50	2025-11-01 21:44:16.305	2025-11-11 21:48:00	2025-11-18 21:48:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-15 21:48:00	0
cmgzc31hq00075zrtz4yyml52	每日30分钟非虚构类阅读	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmfgpklkn000114lt1n0ec61k	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	1	2025-10-20 17:12:00	2025-10-27 16:12:00	2025-10-28 16:12:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-20 16:12:20.943	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-10-20 16:12:00	2025-10-30 16:12:00	2025-11-06 16:12:00	\N	\N	\N	2025-11-03 16:12:00	0
cmgz2pc6s002k10if05p5690s	每周3次多样化烹饪挑战	通过学习多样化菜系，重点提升基础技能，主要制作各类餐食。系统性地提升烹饪技能，享受下厨的乐趣，为自己和家人制作美味健康的食物。	cmfgpklkn000114lt1n0ec61k	cmglleuoy000b187g151p3d9r	POINTS	\N	USD	\N	PHOTO	每次烹饪提交成品照片和制作要点，记录新尝试的菜品和技巧。分享烹饪创新和美食体验。	8	1	2025-10-20 12:48:00	2025-10-27 11:48:00	2025-10-28 11:48:00	OPEN	LIFESTYLE	PUBLIC	\N	\N	0	f	2	2025-10-20 11:49:45.076	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["basic_skills"], "budget": "medium", "frequency": "3_times_week", "mealTypes": ["dinner"], "experience": "basic", "cuisineTypes": ["chinese"], "learningResources": ["cooking_videos"]}	{}	\N	NONE	\N	2025-10-20 11:48:00	2025-10-30 11:48:00	2025-11-06 11:48:00	\N	\N	\N	2025-11-03 11:48:00	0
cmhlabhi0003p72stcmydpbw1	自我评价测试文字字数---	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmfgpklkn000114lt1n0ec61k	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	2	2025-11-05 00:55:00	2025-11-05 00:57:00	2025-11-05 01:04:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	19	2025-11-05 00:53:51.576	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-11-05 00:53:51.196	2025-11-05 01:34:00	2025-11-05 02:04:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 02:04:00	0
cmhlkweq000013fyjouplwznl	DDDDDDD	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmh36n1zs0005td07t6m368m7	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	2	2025-11-05 05:51:00	2025-11-05 05:53:00	2025-11-05 06:04:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	50	2025-11-05 05:50:03.912	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-11-05 05:50:03.471	2025-11-05 06:34:00	2025-11-05 07:04:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 07:04:00	0
cmhmbelwy0001xskel3wdmqba	测试全部不选是否可以提交	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmhcegfin0006hcgendh83z40	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	2	2025-11-05 18:13:00	2025-11-05 18:15:00	2025-11-05 18:19:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	25	2025-11-05 18:12:03.058	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-11-05 18:12:02.627	2025-11-05 18:49:00	2025-11-05 19:19:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 19:19:00	0
cmhlg9nxr0001tnfeswd6oimc	测试互评通知 111111	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmh36n1zs0005td07t6m368m7	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	2	2025-11-05 03:42:00	2025-11-05 03:44:00	2025-11-05 03:50:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	47	2025-11-05 03:40:24.303	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-11-05 03:40:23.82	2025-11-05 04:20:00	2025-11-05 04:50:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 04:50:00	0
cmhdxib9i0007u32lodrkafr8	每日30分钟非虚构类阅读wtf	通过阅读非虚构类、商业管理，使用纸质书籍、电子书的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmhc7jd8w0006x7g1c2qc46o4	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	1	2025-10-31 05:25:00	2025-11-07 05:25:00	2025-11-08 05:25:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-30 21:20:51.846	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical", "ebook"], "genres": ["non_fiction", "business"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	LOCAL	50	2025-10-31 04:25:00	2025-11-10 05:25:00	2025-11-17 05:25:00	\N	\N	\N	2025-11-14 05:25:00	0
cmhn6r2ft0001p0dyvc3096qy	互评ID展示测试	互评ID展示测试	cmhcegfin0006hcgendh83z40	cmglleuo70001187gxr1fbs82	POINTS	\N	USD	\N	PHOTO	每天提交起床时间截图（手机时间或闹钟），记录早起后的活动。建议从周末开始尝试，逐步适应新的作息时间。可以设置多个闹钟，寻找朋友监督。	8	7	2025-11-06 08:51:00	2025-11-06 08:56:00	2025-11-06 09:14:00	CLOSED	HEALTH	PUBLIC	SETTLEMENT_FAILED	\N	0	f	339	2025-11-06 08:49:32.441	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"rewards": ["breakfast_treat", "progress_tracking"], "support": "early_sleep", "challenges": ["wake_difficulty"], "motivation": ["exercise"], "targetTime": "6:00", "currentTime": "7:00"}	{}	\N	NONE	\N	2025-11-06 08:49:32.006	2025-11-06 09:44:00	2025-12-03 16:24:00.202	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-30 16:24:00.202	0
cmgyufj2d001k10ifovdc1yac	每日30分钟编程技术练习	针对初学者设计的编程技术练习计划，主要目标是掌握基础。通过系统性的练习和学习，逐步提升技能水平，实现个人成长和发展目标。	cmfgpklkn000114lt1n0ec61k	cmglleuog0004187gg6xsr39r	POINTS	\N	USD	\N	PHOTO	每日进行编程练习，可以是算法题、项目开发或新技术学习。提交代码截图、项目进度或学习笔记，记录技术成长过程。	6	1	2025-10-20 08:54:00	2025-10-27 07:54:00	2025-10-28 07:54:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	5	2025-10-20 07:58:10.502	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["basic_mastery"], "duration": "30_min", "frequency": "daily", "resources": ["online_courses"], "skillType": "programming", "experience": "beginner"}	{}	\N	NONE	\N	2025-10-20 07:54:00	2025-10-30 07:54:00	2025-11-06 07:54:00	\N	\N	\N	2025-11-03 07:54:00	0
cmgz52wt9004210if9wf0oagd	每日1.5L改善肌肤挑战	从目前的2-2.5L提升到每日1.5L饮水量，通过手机APP的方式，实现改善肌肤、辅助减重、排毒养颜的健康目标。科学饮水，养成良好的饮水习惯。	cmfgpklkn000114lt1n0ec61k	cmglleuow000a187g6buthcwx	POINTS	\N	USD	\N	PHOTO	每日记录饮水量和时间，可以使用饮水应用或拍照记录。提交每日饮水总量截图和身体感受记录。	12	1	2025-10-20 13:55:00	2025-10-27 12:55:00	2025-10-28 12:55:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	0	2025-10-20 12:56:17.565	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"schedule": ["morning_wake", "before_meals"], "reminders": ["phone_app"], "motivation": ["skin_health", "weight_loss", "detox"], "targetAmount": "1.5L", "currentIntake": "2-2.5L"}	{}	\N	NONE	\N	2025-10-20 12:55:00	2025-10-30 12:55:00	2025-11-06 12:55:00	\N	\N	\N	2025-11-03 12:55:00	0
cmh66fda1000ld3m0ehv07ao3	每日30分钟非虚构类阅读	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmh4rbv470000d3m0tokxkudd	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	1	2025-10-25 12:08:00	2025-11-01 11:08:00	2025-11-02 11:08:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	2	2025-10-25 11:08:21.625	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-10-25 11:08:00	2025-11-04 11:08:00	2025-11-11 11:08:00	\N	\N	\N	2025-11-08 11:08:00	0
cmgzbxdny005210ifvm38tk4a	每日30分钟非虚构类阅读	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmfgpklkn000114lt1n0ec61k	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	2	2025-10-20 17:07:00	2025-10-27 16:07:00	2025-10-28 16:07:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	5	2025-10-20 16:07:56.783	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-10-20 16:07:00	2025-10-30 16:07:00	2025-11-06 16:07:00	\N	\N	\N	2025-11-03 16:07:00	0
cmhci7ot2000kdc0nil8v6lky	每日30分钟非虚构类阅读	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmhcegfin0006hcgendh83z40	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	1	2025-10-30 05:24:00	2025-11-06 05:24:00	2025-11-07 05:24:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-29 21:24:55.766	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-10-30 04:24:00	2025-11-09 05:24:00	2025-11-16 05:24:00	\N	\N	\N	2025-11-13 05:24:00	0
cmhh59z3y0001uuz5fhws6qwt	阿斯蒂芬暗示发挑战34	sa的发生发阿迪斯1342	cmfgpklkn000114lt1n0ec61k	cmgzc01fc000fyikfu8pyvmsv	POINTS	\N	USD	\N	PHOTO	请按照您设定的挑战要求提交相应的证据和记录，确保真实有效地完成挑战任务。	8	1	2025-11-02 03:26:00	2025-11-09 03:26:00	2025-11-10 03:26:00	OPEN	PERSONAL	PUBLIC	\N	\N	0	f	0	2025-11-02 03:21:38.302	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"daily_goal": "阿斯蒂芬暗示发", "motivation": "sa的发生发阿迪斯"}	{}	\N	LOCAL	100	2025-11-02 03:21:37.863	2025-11-12 03:26:00	2025-11-19 03:26:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-16 03:26:00	0
cmgyuhn7y001q10ifv32fixph	测试是否被覆盖	除了黄色小说，每天很难坚持。	cmfgpklkn000114lt1n0ec61k	cmglleuod0003187gb5mr151u	POINTS	\N	USD	\N	PHOTO	每天提交阅读材料截图，包含学习内容和时长记录	8	1	2025-10-20 08:59:00	2025-10-27 07:59:00	2025-10-28 07:59:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	2	2025-10-20 07:59:49.198	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"type": "reading", "content": "vocabulary", "language": "english", "partners": ["textbook"], "purposes": ["improvement"], "persistence": "can_persist"}	{}	\N	NONE	\N	2025-10-20 07:59:00	2025-10-30 07:59:00	2025-11-06 07:59:00	\N	\N	\N	2025-11-03 07:59:00	0
cmhlr6bcx0007wmw3merpt6qo	文字证据提交500错误问题测试	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmhcegfin0006hcgendh83z40	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	2	2025-11-05 08:49:00	2025-11-05 08:51:00	2025-11-05 09:12:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	13	2025-11-05 08:45:43.809	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-11-05 08:45:43.449	2025-11-05 09:42:00	2025-11-05 10:12:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 10:12:00	0
cmgysof8t000110ife0i3rry7	英语单词学习打卡	通过阅读方式学习英语，主要目的是improvement。每天坚持学习，提高语言能力。	cmfgpklkn000114lt1n0ec61k	cmglleuod0003187gb5mr151u	POINTS	\N	USD	\N	PHOTO	每天提交阅读材料截图，包含学习内容和时长记录	8	1	2025-10-20 08:08:00	2025-10-27 07:08:00	2025-10-28 07:08:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-20 07:09:06.221	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"type": "reading", "content": "vocabulary", "language": "english", "partners": ["textbook"], "purposes": ["improvement"], "persistence": "can_persist"}	{}	\N	NONE	\N	2025-10-20 07:08:00	2025-10-30 07:08:00	2025-11-06 07:08:00	\N	\N	\N	2025-11-03 07:08:00	0
cmgz36tws003k10if7443um5k	科技互联网undefined创业日志	科技互联网领域的undefined创业项目，重点关注全面发展。每日投入2小时，系统性地推进项目发展，记录创业历程中的挑战、收获和成长。	cmfgpklkn000114lt1n0ec61k	cmglleupl000k187gn5z2vrwu	POINTS	\N	USD	\N	PHOTO	每日记录业务发展和团队进展，提交关键指标数据、重要决策或里程碑成果。分享创业经验和管理心得。	7	1	2025-10-20 13:01:00	2025-10-27 12:01:00	2025-10-28 12:01:00	OPEN	WORK	PUBLIC	\N	\N	0	f	2	2025-10-20 12:03:21.196	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"metrics": ["user_count"], "challenges": ["time_management"], "dailyGoals": ["feature_development"], "focusAreas": ["product_development"], "industryType": "tech", "projectStage": "planning", "timeCommitment": "2_hours", "reviewFrequency": "weekly"}	{}	\N	NONE	\N	2025-10-20 12:01:00	2025-10-30 12:01:00	2025-11-06 12:01:00	\N	\N	\N	2025-11-03 12:01:00	0
cmha0rtnl000ln9uthxseclb3	每日30分钟非虚构类阅读	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmfgpklkn000114lt1n0ec61k	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	2	2025-10-28 12:39:00	2025-10-28 13:41:00	2025-10-28 15:43:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	15	2025-10-28 03:41:09.729	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-10-28 11:39:00	2025-10-30 15:43:00	2025-11-06 15:43:00	\N	\N	\N	2025-11-03 15:43:00	0
cmhdxh37l0001u32lgwen3s2b	每日运动挑战wtf	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhc7jd8w0006x7g1c2qc46o4	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-10-31 05:24:00	2025-11-07 05:24:00	2025-11-08 05:24:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	0	2025-10-30 21:19:54.753	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	LOCAL	50	2025-10-31 04:24:00	2025-11-10 05:24:00	2025-11-17 05:24:00	\N	\N	\N	2025-11-14 05:24:00	0
cmhmhl67p0001h5w42mdl7qi1	OSS图片视频证据上传测试	OSS图片视频证据上传测试	cmfgpklkn000114lt1n0ec61k	cmgzc01du0005yikfc1dpio7d	POINTS	\N	USD	\N	PHOTO	OSS图片视频证据上传测试	10	4	2025-11-05 21:11:00	2025-11-05 21:13:00	2025-11-05 21:30:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{cmfgpklkn000114lt1n0ec61k,cmhc7jd8w0006x7g1c2qc46o4,cmhcegfin0006hcgendh83z40}	0	f	86	2025-11-05 21:05:06.997	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-05 21:05:06.61	2025-11-05 22:00:00	2025-11-05 22:30:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 22:30:00	0
cmhjyd13y0001ch4vxd2urp0e	看看一个人能不能提交自己的评价	通过文字日记的方式，重点关注生活各方面的感恩体验，实现积极心态的目标。每日坚持感恩练习，培养积极心态，提升生活幸福感。	cmhcegfin0006hcgendh83z40	cmglleup9000f187g7x7zw65p	POINTS	\N	USD	\N	TEXT	每日提交详细的感恩记录，描述感恩事项的具体情况和内心感受。分享感恩练习的体验和收获。	15	1	2025-11-04 02:32:00	2025-11-04 02:34:00	2025-11-04 02:36:00	OPEN	PERSONAL	PUBLIC	\N	\N	0	f	2	2025-11-04 02:31:22.077	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"depth": "detailed", "goals": ["positive_mindset"], "format": ["written_journal"], "itemCount": "3_items", "timeOfDay": "evening", "focusAreas": ["relationships"]}	{}	\N	NONE	\N	2025-11-04 02:31:21.606	2025-11-04 03:06:00	2025-11-04 03:36:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-01 03:36:00	0
cmgz2mxp9002e10ifqx7onf2w	英语单词学习打卡	通过阅读方式学习英语，主要目的是improvement。每天坚持学习，提高语言能力。	cmfgpklkn000114lt1n0ec61k	cmglleuod0003187gb5mr151u	POINTS	\N	USD	\N	PHOTO	每天提交阅读材料截图，包含学习内容和时长记录	8	1	2025-10-20 12:47:00	2025-10-27 11:47:00	2025-10-28 11:47:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	2	2025-10-20 11:47:52.989	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"type": "reading", "content": "vocabulary", "language": "english", "partners": ["textbook"], "purposes": ["improvement"], "persistence": "can_persist"}	{}	\N	NONE	\N	2025-10-20 11:47:00	2025-10-30 11:47:00	2025-11-06 11:47:00	\N	\N	\N	2025-11-03 11:47:00	0
cmio8g4v70001yuosc61nzwfg	测试业务逻辑	深度阅读+讨论分享，每周读完一本书并分享心得	cmfhsxf490000lmmnwp77vl6x	cmhgopmcl001jurpf0xibpvcb	POINTS	\N	USD	\N	PHOTO	每周提交读书笔记和讨论记录	10	2	2025-12-02 07:06:00	2025-12-02 07:08:00	2025-12-02 07:16:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	4	f	58	2025-12-02 07:04:30.115	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-12-02 07:04:29.67	2025-12-02 07:46:00	2025-12-07 07:46:00.059	Singapore	Singapore	Singapore, Singapore	2025-12-04 07:46:00.059	0
cmfhq8bgr000j8y89g2lakoac	某某挑战某某挑战某某挑战某某挑战	某某挑战某某挑战某某挑战某某挑战	cmfgpjvmb000014ltuwk3uwht	\N	FAVOR	\N	USD	某某挑战某某挑战	PHOTO	某某挑战某某挑战	6	4	2025-09-13 04:51:00	2025-09-13 07:18:00	2025-09-13 09:25:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{}	0	f	23	2025-09-13 03:48:48.268	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-13 03:51:00	2025-09-15 09:25:00	2025-09-22 09:25:00	\N	\N	\N	2025-09-19 09:25:00	0
cmhjiptsm0001c3444oz0v7qf	麻烦的很1	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmfgpklkn000114lt1n0ec61k	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	2	2025-11-03 19:20:00	2025-11-03 19:24:00	2025-11-03 19:40:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{}	1	f	63	2025-11-03 19:13:25.27	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-03 19:13:24.822	2025-11-03 20:10:00	2025-11-03 20:40:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-10-31 20:40:00	0
cmhds7oeg000d10bhrsje0d4b	英语学习挑战local test	每天学习英语30分钟，通过背单词和练习口语提升英语水平。	cmhcegfin0006hcgendh83z40	cmgzc01cu0000yikfckccja5x	POINTS	\N	USD	\N	PHOTO	每天提交学习截图或练习记录，包括学习时长和内容。	8	1	2025-10-31 02:57:00	2025-11-07 02:57:00	2025-11-08 02:57:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-30 18:52:37.577	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	LOCAL	50	2025-10-31 01:57:00	2025-11-10 02:57:00	2025-11-17 02:57:00	\N	\N	\N	2025-11-14 02:57:00	0
cmhjhcqjv000n117a9w8ktzly	每日运动挑战	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhcegfin0006hcgendh83z40	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-11-03 18:35:00	2025-11-10 18:37:00	2025-11-11 18:39:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	10	2025-11-03 18:35:14.923	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-03 18:35:14.554	2025-11-11 19:09:00	2025-11-11 19:39:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-08 19:39:00	0
cmgz2l63p002210ifbpsmgzw7	每日10分钟冥想练习	通过多样化冥想练习，在安静房间中实现缓解压力的目标。每日坚持冥想，培养内在平静，提升生活质量和精神状态。	cmfgpklkn000114lt1n0ec61k	cmglleupb000g187gtdaev37v	POINTS	\N	USD	\N	PHOTO	每日提交冥想时间记录和简单的感受分享。建议使用冥想应用辅助练习，记录冥想过程中的体验和变化。	8	1	2025-10-20 12:45:00	2025-10-27 11:45:00	2025-10-28 11:45:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	2	2025-10-20 11:46:30.565	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["stress_relief"], "duration": "10_min", "timeOfDay": ["morning"], "experience": "beginner", "environment": "quiet_room", "meditationType": ["mindfulness"]}	{}	\N	NONE	\N	2025-10-20 11:45:00	2025-10-30 11:45:00	2025-11-06 11:45:00	\N	\N	\N	2025-11-03 11:45:00	0
cmg2bbjr80001hbraujzmuv8o	每天8杯水	简单的饮水挑战，养成健康饮水习惯	cmfgpklkn000114lt1n0ec61k	\N	FAVOR	\N	USD	\N	PHOTO	每天记录饮水量，拍摄水杯或饮水记录	20	1	2025-09-27 23:34:00	2025-09-30 23:34:00	2025-10-01 23:34:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{}	0	f	0	2025-09-27 13:34:34.436	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-27 22:34:00	2025-10-03 23:34:00	2025-10-10 23:34:00	\N	\N	\N	2025-10-07 23:34:00	0
cmgzbxzf3005810iflzgnthyp	每日1.5L改善肌肤挑战	从目前的1.5-2L提升到每日1.5L饮水量，通过手机APP的方式，实现改善肌肤、辅助减重的健康目标。科学饮水，养成良好的饮水习惯。	cmfgpklkn000114lt1n0ec61k	cmglleuow000a187g6buthcwx	POINTS	\N	USD	\N	PHOTO	每日记录饮水量和时间，可以使用饮水应用或拍照记录。提交每日饮水总量截图和身体感受记录。	12	1	2025-10-20 17:07:00	2025-10-27 16:07:00	2025-10-28 16:07:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	0	2025-10-20 16:08:24.975	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"schedule": ["morning_wake", "before_meals"], "reminders": ["phone_app"], "motivation": ["skin_health", "weight_loss"], "targetAmount": "1.5L", "currentIntake": "1.5-2L"}	{}	\N	NONE	\N	2025-10-20 16:07:00	2025-10-30 16:07:00	2025-11-06 16:07:00	\N	\N	\N	2025-11-03 16:07:00	0
cmhcnts3100076na9xzhtvjoq	英语学习挑战	每天学习英语30分钟，通过背单词和练习口语提升英语水平。	cmhcegfin0006hcgendh83z40	cmgzc01cu0000yikfckccja5x	POINTS	\N	USD	\N	PHOTO	每天提交学习截图或练习记录，包括学习时长和内容。	8	1	2025-10-30 08:01:00	2025-11-06 08:01:00	2025-11-07 08:01:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-30 00:02:04.525	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-10-30 07:01:00	2025-11-09 08:01:00	2025-11-16 08:01:00	\N	\N	\N	2025-11-13 08:01:00	0
cmhfa7rdp0007acecu7qw2dav	时间测试第一步	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhc7jd8w0006x7g1c2qc46o4	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-11-01 04:09:00	2025-11-08 04:09:00	2025-11-09 04:09:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	0	2025-10-31 20:04:20.701	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	LOCAL	50	2025-11-01 03:09:00	2025-11-11 04:09:00	2025-11-18 04:09:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-15 04:09:00	0
cmhipj6ev002d1lqogsziidg6	每日30分钟非虚构类阅读	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmfgpklkn000114lt1n0ec61k	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	2	2025-11-03 05:38:00	2025-11-03 05:40:00	2025-11-03 05:43:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	32	2025-11-03 05:36:26.167	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-11-03 05:36:25.808	2025-11-05 05:43:00	2025-11-12 05:43:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-09 05:43:00	0
cmh7d62rh0013d3m0dz4vmtub	每日运动挑战	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmh4rbv470000d3m0tokxkudd	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	2	2025-10-26 08:03:00	2025-10-26 15:08:00	2025-10-26 15:19:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{}	0	f	18	2025-10-26 07:04:51.581	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-10-26 07:03:00	2025-10-28 15:19:00	2025-11-04 15:19:00	\N	\N	\N	2025-11-01 15:19:00	0
cmfuyetx500099isac841d0t3	冥想练习	承诺每天进行15分钟冥想练习，通过正念冥想缓解压力，提高专注力和内心平静，培养身心健康的生活方式	cmfgpmfbo000314ltz0jj7n1y	\N	FAVOR	\N	USD		PHOTO	每天拍摄冥想环境或冥想app记录	8	1	2025-09-23 09:58:00	2025-10-07 09:58:00	2025-10-09 09:58:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{}	0	f	1	2025-09-22 09:58:49.337	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-23 08:58:00	2025-10-11 09:58:00	2025-10-18 09:58:00	\N	\N	\N	2025-10-15 09:58:00	0
cmio6xbu900012nuky5o963vy	再有问题骂AI	深度阅读+讨论分享，每周读完一本书并分享心得	cmfhsxf490000lmmnwp77vl6x	cmhgopmcl001jurpf0xibpvcb	POINTS	\N	USD	\N	PHOTO	每周提交读书笔记和讨论记录	10	2	2025-12-02 06:23:00	2025-12-02 06:25:00	2025-12-02 06:30:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	2	f	74	2025-12-02 06:21:53.073	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-12-02 06:21:52.635	2025-12-02 07:00:00	2025-12-04 06:30:31.202	Singapore	Singapore	Singapore, Singapore	2025-12-01 06:30:31.202	0
cmgyrs7po00099bn9mpilta9w	英语单词学习打卡	通过阅读方式学习英语，主要目的是improvement。每天坚持学习，提高语言能力。	cmfgpklkn000114lt1n0ec61k	cmglleuod0003187gb5mr151u	POINTS	\N	USD	\N	PHOTO	每天提交阅读材料截图，包含学习内容和时长记录	8	1	2025-10-20 07:43:00	2025-10-27 06:43:00	2025-10-28 06:43:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	2	2025-10-20 06:44:03.468	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"type": "reading", "content": "vocabulary", "language": "english", "partners": ["textbook"], "purposes": ["improvement"], "persistence": "can_persist"}	{}	\N	NONE	\N	2025-10-20 06:43:00	2025-10-30 06:43:00	2025-11-06 06:43:00	\N	\N	\N	2025-11-03 06:43:00	0
cmgm4ksmu000jaryole73k1gt	每日阅读挑战	承诺每天阅读至少30分钟，培养良好的阅读习惯，提升知识储备和思维能力	cmfgpklkn000114lt1n0ec61k	cmglleuoa0002187g66sus0ru	FAVOR	\N	USD	\N	PHOTO	每天拍摄正在阅读的照片，包括书籍封面和阅读环境	10	1	2025-10-11 20:20:00	2025-10-18 20:20:00	2025-10-19 20:20:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-11 10:21:12.055	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-10-11 19:20:00	2025-10-21 20:20:00	2025-10-28 20:20:00	\N	\N	\N	2025-10-25 20:20:00	0
cmhma8m6q0001lrhroynygux4	单人评价测试 BBB	每天饮水2000毫升，保持身体水分平衡，促进新陈代谢。	cmfgpklkn000114lt1n0ec61k	cmgzc01e20007yikfe33vxryv	POINTS	\N	USD	\N	PHOTO	每天记录饮水量并拍摄水杯照片，展示饮水进度。	10	1	2025-11-05 17:40:00	2025-11-05 17:42:00	2025-11-05 17:53:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	6	2025-11-05 17:39:23.858	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-05 17:39:23.424	2025-11-05 18:23:00	2025-11-05 18:53:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 18:53:00	0
cmhl7estf000172ste4gw6ufs	每日运动挑战	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmfgpklkn000114lt1n0ec61k	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	6	2025-11-04 23:36:00	2025-11-04 23:38:00	2025-11-04 23:48:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{}	1	f	73	2025-11-04 23:32:27.363	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-04 23:32:26.911	2025-11-05 00:18:00	2025-11-05 00:48:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 00:48:00	0
cmhdb0swc0001r5ae3y4j3ryy	每日30分钟非虚构类阅读	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmhcegfin0006hcgendh83z40	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	3	2025-10-30 18:56:00	2025-11-06 18:56:00	2025-11-07 18:56:00	PEER_REVIEW	LEARNING	PUBLIC	\N	\N	0	f	30	2025-10-30 10:51:23.34	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	LOCAL	55	\N	\N	\N	\N	\N	\N	\N	0
cmhci1v74000edc0nlz6tyy47	每日30分钟非虚构类阅读	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmhcegfin0006hcgendh83z40	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	1	2025-10-30 05:20:00	2025-11-06 05:20:00	2025-11-07 05:20:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-29 21:20:24.112	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-10-30 04:20:00	2025-11-09 05:20:00	2025-11-16 05:20:00	\N	\N	\N	2025-11-13 05:20:00	0
cmhhuez21000e5er4yaqx03wn	每日万步挑战	每天走路10000步，保持活力	cmfgpklkn000114lt1n0ec61k	cmhgopm9w0009urpfy6z694bg	POINTS	\N	USD	\N	PHOTO	每天拍摄步数app截图	15	1	2025-11-02 15:10:00	2025-11-09 15:10:00	2025-11-10 15:10:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	0	2025-11-02 15:05:21.913	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-02 15:05:21.458	2025-11-12 15:10:00	2025-11-19 15:10:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-16 15:10:00	0
cmhlr4wvo0001wmw3757svafo	单人再测试提示语问题	每天30分钟瑜伽练习，提高柔韧性和平衡	cmhcegfin0006hcgendh83z40	cmhgopma5000durpflm8xi2cj	POINTS	\N	USD	\N	PHOTO	每天拍摄瑜伽练习照片或app记录	10	1	2025-11-05 08:46:00	2025-11-05 08:48:00	2025-11-05 08:54:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	8	2025-11-05 08:44:38.387	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-05 08:44:37.943	2025-11-05 09:24:00	2025-11-05 09:54:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 09:54:00	0
cmgz327zv003810if0m30e0wf	效率番茄工作法提升挑战	通过番茄工作法等科学方法，重点提升个人效率，实现减少拖延的目标。系统化地改善工作和生活效率，建立可持续的高效习惯。	cmfgpklkn000114lt1n0ec61k	cmglleuor0008187gg66hl3eo	POINTS	\N	USD	\N	PHOTO	每日记录效率实践和成果，提交相关截图或记录。分享效率提升的方法和心得体会。	8	1	2025-10-20 12:53:00	2025-10-27 11:53:00	2025-10-28 11:53:00	OPEN	PERSONAL	PUBLIC	\N	\N	0	f	4	2025-10-20 11:59:46.171	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["reduce_procrastination"], "tools": ["digital_calendar"], "methods": ["pomodoro"], "focusAreas": ["time_management"], "measurement": "task_completion", "reviewFrequency": "bi_weekly"}	{}	\N	NONE	\N	2025-10-20 11:53:00	2025-10-30 11:53:00	2025-11-06 11:53:00	\N	\N	\N	2025-11-03 11:53:00	0
cmgz2rnsu002w10ifclsmuos8	每周3次3-5km跑步训练	针对中级跑者设计的训练计划，主要目标是健康维护、提高速度。训练场地包括公路跑、跑步机，通过科学的训练安排，逐步提升跑步能力和身体素质。	cmfgpklkn000114lt1n0ec61k	cmglleuok0005187gn7ut4kid	POINTS	\N	USD	\N	PHOTO	根据个人能力调整跑步强度，保持规律训练。提交跑步记录截图，包含基本的距离和时间信息，记录身体感受和进步情况。	12	1	2025-10-20 12:50:00	2025-10-27 11:50:00	2025-10-28 11:50:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	4	2025-10-20 11:51:33.438	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["health", "speed"], "terrain": ["road", "treadmill"], "distance": "3-5km", "frequency": "3_times_week", "timeOfDay": ["morning", "afternoon"], "experience": "intermediate"}	{}	\N	NONE	\N	2025-10-20 11:50:00	2025-10-30 11:50:00	2025-11-06 11:50:00	\N	\N	\N	2025-11-03 11:50:00	0
cmhegz31t000vbpixtae9lu0t	每日跑步5公里LLLLLLL	每天跑步5公里，提升心肺功能和身体素质。	cmfgpjvmb000014ltuwk3uwht	cmgzc01dp0004yikfkzxtfzk5	POINTS	\N	USD	\N	PHOTO	每天提交跑步路线截图和完成时间记录。	8	1	2025-10-31 14:30:00	2025-11-07 14:30:00	2025-11-08 14:30:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	0	2025-10-31 06:25:47.057	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	LOCAL	5	2025-10-31 13:30:00	2025-11-10 14:30:00	2025-11-17 14:30:00	\N	\N	\N	2025-11-14 14:30:00	0
cmhmizjud00016cwiogot6jzu	测试视频上传	测试视频上传	cmhcegfin0006hcgendh83z40	cmgzc01dp0004yikfkzxtfzk5	POINTS	\N	USD	\N	PHOTO	测试视频上传	8	2	2025-11-05 21:45:00	2025-11-05 21:47:00	2025-11-05 22:08:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{}	0	f	19	2025-11-05 21:44:17.461	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-05 21:44:16.989	2025-11-05 22:38:00	2025-11-05 23:08:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 23:08:00	0
cmfhq60vo00018y89c4tyvorz	语言学习打卡	承诺每天学习外语30分钟，通过持续的语言学习提高外语水平，拓展国际视野，为未来的学习和工作打下坚实基础	cmfgpmfbo000314ltz0jj7n1y	\N	FAVOR	\N	USD		PHOTO	每天拍摄学习进度截图或学习笔记	15	1	2025-09-14 03:46:00	2025-09-28 03:46:00	2025-09-30 03:46:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	4	2025-09-13 03:47:01.236	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-14 02:46:00	2025-10-02 03:46:00	2025-10-09 03:46:00	\N	\N	\N	2025-10-06 03:46:00	0
cmhdo4gc900017ooz7mmxu546	每日饮水2升挑战22222	每天饮水2000毫升，保持身体水分平衡，促进新陈代谢。	cmhc7jd8w0006x7g1c2qc46o4	cmgzc01e20007yikfe33vxryv	POINTS	\N	USD	\N	PHOTO	每天记录饮水量并拍摄水杯照片，展示饮水进度。	10	1	2025-10-31 01:02:00	2025-11-07 01:02:00	2025-11-08 01:02:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	0	2025-10-30 16:58:08.697	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-10-31 00:02:00	2025-11-10 01:02:00	2025-11-17 01:02:00	\N	\N	\N	2025-11-14 01:02:00	0
cmhfd0cbr0001f1ptfa6gah8o	测试游戏	测试描述	cmhc7jd8w0006x7g1c2qc46o4	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	测试证据	6	1	2025-11-01 22:00:00	2025-11-08 22:00:00	2025-11-09 22:00:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	0	2025-10-31 21:22:33.447	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-01 21:00:00	2025-11-11 22:00:00	2025-11-18 22:00:00	\N	\N	\N	2025-11-15 22:00:00	0
cmgyu3mkr000w10if0j7gos9e	每周3次3-5km跑步训练	针对高级跑者设计的训练计划，主要目标是减重塑形、提升耐力。训练场地包括越野跑、跑步机，通过科学的训练安排，逐步提升跑步能力和身体素质。	cmfgpklkn000114lt1n0ec61k	cmglleuok0005187gn7ut4kid	POINTS	\N	USD	\N	PHOTO	按照训练计划执行，注意心率控制和配速管理。提交详细的跑步数据，包括距离、时间、配速、心率等指标，以及训练感受。	12	1	2025-10-20 08:48:00	2025-10-27 07:48:00	2025-10-28 07:48:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	4	2025-10-20 07:48:55.18	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["weight_loss", "endurance"], "terrain": ["trail", "treadmill"], "distance": "3-5km", "frequency": "3_times_week", "timeOfDay": ["morning"], "experience": "advanced"}	{}	\N	NONE	\N	2025-10-20 07:48:00	2025-10-30 07:48:00	2025-11-06 07:48:00	\N	\N	\N	2025-11-03 07:48:00	0
cmhiljamh00011lqo3ytmay2u	每日30分钟非虚构类阅读	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmhc7jd8w0006x7g1c2qc46o4	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	1	2025-11-03 03:46:00	2025-11-10 03:49:00	2025-11-11 03:49:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	5	2025-11-03 03:44:33.161	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-11-03 03:44:32.687	2025-11-13 03:49:00	2025-11-20 03:49:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-17 03:49:00	0
cmio2a85k0001qotccs6so6mf	test dispute with OSS	完成一个完整的创意项目：写作、绘画、音乐等	cmfhsxf490000lmmnwp77vl6x	cmhgopmcp001lurpfgb7zpa47	POINTS	\N	USD	\N	PHOTO	每天记录项目进展，最后提交完整作品	6	2	2025-12-02 04:14:00	2025-12-02 04:16:00	2025-12-02 04:20:00	CLOSED	PERSONAL	PUBLIC	COMPLETED	{}	1	f	47	2025-12-02 04:11:56.744	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-12-02 04:11:56.283	2025-12-02 04:50:00	2025-12-04 04:20:50.727	Singapore	Singapore	Singapore, Singapore	2025-12-01 04:20:50.727	0
cmhhqix9e0001w6fykpt2b6f6	sa打发士大夫	撒地方 撒地方法撒旦	cmhcc8p1o000atqgxpzkeao00	\N	POINTS	\N	USD	\N	PHOTO	请拍摄照片作为完成证据	6	1	2025-11-02 13:21:00	2025-11-09 13:21:00	2025-11-10 13:21:00	CLOSED	FITNESS	PUBLIC	\N	\N	0	f	12	2025-11-02 13:16:27.746	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-02 13:16:27.312	2025-11-12 13:21:00	2025-11-19 13:21:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-16 13:21:00	0
cmhf8grsc000d140lf31hftbn	每日运动挑战SS	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhc7jd8w0006x7g1c2qc46o4	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-11-01 20:00:00	2025-11-08 20:00:00	2025-11-09 20:00:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	6	2025-10-31 19:15:21.9	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	LOCAL	125	2025-11-01 19:00:00	2025-11-11 20:00:00	2025-11-18 20:00:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-15 20:00:00	0
cmgzc436b000d5zrtl3usz8tv	每日3.5L改善肌肤挑战	从目前的1.5-2L提升到每日3.5L饮水量，通过手机APP、便签提醒的方式，实现改善肌肤的健康目标。科学饮水，养成良好的饮水习惯。	cmfgpklkn000114lt1n0ec61k	cmglleuow000a187g6buthcwx	POINTS	\N	USD	\N	PHOTO	每日记录饮水量和时间，可以使用饮水应用或拍照记录。提交每日饮水总量截图和身体感受记录。	4	1	2025-10-20 17:12:00	2025-10-27 16:12:00	2025-10-28 16:12:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	12	2025-10-20 16:13:09.78	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"schedule": ["morning_wake", "before_meals"], "reminders": ["phone_app", "sticky_notes"], "motivation": ["skin_health"], "targetAmount": "3.5L", "currentIntake": "1.5-2L"}	{}	\N	NONE	\N	2025-10-20 16:12:00	2025-10-30 16:12:00	2025-11-06 16:12:00	\N	\N	\N	2025-11-03 16:12:00	0
cmhf8lj7e000p140lj8vn75re	每日运动挑战ZZZZZ	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhc7jd8w0006x7g1c2qc46o4	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-11-08 10:00:00	2025-11-15 10:00:00	2025-11-16 10:00:00	OPEN	FITNESS	PUBLIC	\N	\N	0	t	86	2025-10-31 19:19:04.058	2025-12-08 20:00:00.048	f	\N	\N	\N	\N	\N	{}	{}	随便一个地方	CUSTOM	\N	2025-11-08 09:00:00	2025-11-18 10:00:00	2025-11-25 10:00:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-22 10:00:00	0
cmisr71gg0001p50buhttpqtp	Book Club Reading Challenge	Read one book per week and participate in discussions to deepen understanding.	cmfhsxf490000lmmnwp77vl6x	cmhgopmcl001jurpf0xibpvcb	POINTS	\N	USD	\N	PHOTO	Submit weekly reading progress, book reviews, and discussion participation records.	10	1	2025-12-05 11:03:00	2026-01-02 11:05:00	2026-01-03 11:10:00	OPEN	LEARNING	PUBLIC	\N	\N	0	t	4	2025-12-05 11:00:23.2	2025-12-08 20:00:00.048	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-12-05 11:00:23.005	2026-01-03 11:40:00	2026-01-03 12:10:00	Beijing	China	Beijing, China	\N	0
cmhlc4142000nhru4cnixqecy	测试不评价，是不是到期自动结束游戏，崩溃了	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmh36n1zs0005td07t6m368m7	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	2	2025-11-05 01:45:00	2025-11-05 01:47:00	2025-11-05 01:50:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{}	0	f	21	2025-11-05 01:44:02.978	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-05 01:44:02.534	2025-11-05 02:20:00	2025-11-05 02:50:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 02:50:00	0
cmhgoz5vf000drhx7zaev4o3v	bbb（极具挑战）挑战	这是一个完全自定义的挑战，根据您的个人需求和目标设计。	cmfgpklkn000114lt1n0ec61k	cmgzc01fc000fyikfu8pyvmsv	POINTS	\N	USD	\N	PHOTO	请按照您设定的挑战要求提交相应的证据和记录，确保真实有效地完成挑战任务。	8	1	2025-11-01 19:49:00	2025-11-08 19:49:00	2025-11-09 19:49:00	OPEN	PERSONAL	PUBLIC	\N	\N	0	f	2	2025-11-01 19:45:19.995	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"daily_goal": "bbb", "difficulty_level": "极具挑战"}	{}	\N	NONE	\N	2025-11-01 19:45:19.653	2025-11-11 19:49:00	2025-11-18 19:49:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-15 19:49:00	0
cmimic9op000biaffodufnc10	test 3	全方位语言学习：听说读写全面提升	cmfgpklkn000114lt1n0ec61k	cmhgopmcj001iurpf7xecav93	POINTS	\N	USD	\N	PHOTO	每天完成听力、口语、阅读、写作练习	8	3	2025-12-01 02:10:00	2025-12-01 02:13:00	2025-12-01 02:18:00	CLOSED	LEARNING	PUBLIC	UNDER_REVIEW	\N	0	f	78	2025-12-01 02:05:53.545	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-12-01 02:05:53.084	2025-12-01 02:48:00	2025-12-03 16:23:17.14	Singapore	Singapore	Singapore, Singapore	2025-11-30 16:23:17.14	0
cmhmkkmx60001i4haupa9ek4r	视频上传终极测试	视频上传终极测试	cmh24ml660003td0740yexg8h	cmgzc01du0005yikfc1dpio7d	POINTS	\N	USD	\N	PHOTO	视频上传终极测试	10	2	2025-11-05 22:29:00	2025-11-05 22:34:00	2025-11-05 22:41:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{}	0	f	47	2025-11-05 22:28:40.842	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-05 22:28:40.472	2025-11-05 23:11:00	2025-11-05 23:41:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 23:41:00	0
cmhjvpkrz00019i0qdft4463a	互评测试 111	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmhcegfin0006hcgendh83z40	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	2	2025-11-04 01:18:00	2025-11-04 01:20:00	2025-11-04 01:24:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	75	2025-11-04 01:17:08.591	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-11-04 01:17:08.069	2025-11-04 01:54:00	2025-11-04 02:24:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-01 02:24:00	0
cmhckkj2d0001pjiage8t8bw9	每日运动挑战111	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhcegfin0006hcgendh83z40	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-10-30 06:30:00	2025-11-06 06:30:00	2025-11-07 06:30:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	2	2025-10-29 22:30:54.085	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-10-30 05:30:00	2025-11-09 06:30:00	2025-11-16 06:30:00	\N	\N	\N	2025-11-13 06:30:00	0
cmivlb9gm0001289qctx6ylwl	Book Club Reading Challenge	Read one book per week and participate in discussions to deepen understanding.	cmfgpklkn000114lt1n0ec61k	cmhgopmcl001jurpf0xibpvcb	POINTS	\N	USD	\N	PHOTO	Submit weekly reading progress, book reviews, and discussion participation records.	10	1	2025-12-07 10:43:00	2026-01-04 10:43:00	2026-01-05 10:43:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-12-07 10:39:01.03	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-12-07 10:39:00.902	2026-01-05 11:13:00	2026-01-05 11:43:00	Chiyoda City	Japan	Chiyoda City, Tokyo, Japan	\N	0
cmhioy1cc00171lqofc2l8wzh	每日运动挑战 2人评价测试	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmfgpklkn000114lt1n0ec61k	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	2	2025-11-03 05:22:00	2025-11-03 05:24:00	2025-11-11 05:24:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{cmfgpklkn000114lt1n0ec61k}	2	f	68	2025-11-03 05:19:59.82	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-03 05:19:59.457	2025-11-13 05:24:00	2025-11-20 05:24:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-17 05:24:00	0
cmh5rdwj10009d3m0h66bgxk3	每日30分钟非虚构类阅读	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmh4rbv470000d3m0tokxkudd	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	1	2025-10-25 05:07:00	2025-11-01 04:07:00	2025-11-02 04:07:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-25 04:07:19.021	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-10-25 04:07:00	2025-11-04 04:07:00	2025-11-11 04:07:00	\N	\N	\N	2025-11-08 04:07:00	0
cmha8evok0001117uv95wftcx	l5件事感恩日记	通过written_journal,voice_memo,photo_diary的方式，重点关注生活各方面的感恩体验，实现积极心态的目标。每日坚持感恩练习，培养积极心态，提升生活幸福感。	cmfgpklkn000114lt1n0ec61k	cmglleup9000f187g7x7zw65p	POINTS	\N	USD	\N	TEXT	每日提交详细的感恩记录，描述感恩事项的具体情况和内心感受。分享感恩练习的体验和收获。	15	2	2025-10-28 15:12:00	2025-11-04 15:12:00	2025-11-05 15:12:00	CLOSED	PERSONAL	PUBLIC	COMPLETED	{}	0	f	11	2025-10-28 07:15:02.756	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"depth": "detailed", "goals": ["positive_mindset", "relationship_improvement", "stress_reduction", "self_awareness"], "format": ["written_journal", "voice_memo", "photo_diary"], "itemCount": "5_items", "timeOfDay": "lunch", "focusAreas": ["achievements", "daily_moments", "health", "opportunities"]}	{}	\N	NONE	\N	2025-10-28 14:12:00	2025-11-07 15:12:00	2025-11-14 15:12:00	\N	\N	\N	2025-11-11 15:12:00	0
cmgyu9zo7001e10ifj7gokup4	每日30分钟非虚构类阅读	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmfgpklkn000114lt1n0ec61k	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	1	2025-10-20 08:53:00	2025-10-27 07:53:00	2025-10-28 07:53:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	2	2025-10-20 07:53:52.087	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-10-20 07:53:00	2025-10-30 07:53:00	2025-11-06 07:53:00	\N	\N	\N	2025-11-03 07:53:00	0
cmhdygygo0001ugqx6wmxh80d	每日30分钟非虚构类阅读WWW	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmhc7jd8w0006x7g1c2qc46o4	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	1	2025-10-31 05:52:00	2025-11-07 05:52:00	2025-11-08 05:52:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	2	2025-10-30 21:47:48.216	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	LOCAL	50	2025-10-31 04:52:00	2025-11-10 05:52:00	2025-11-17 05:52:00	\N	\N	\N	2025-11-14 05:52:00	0
cmgz9b2ub004q10ifldpderts	6:00早起晨练运动挑战	从7:00起床调整到6:00起床，通过提前睡觉等方式保证充足睡眠。通过早起实现晨练运动的目标，养成健康的作息习惯，提升生活质量和工作效率。	cmfgpklkn000114lt1n0ec61k	cmglleuo70001187gxr1fbs82	POINTS	\N	USD	\N	PHOTO	每天提交起床时间截图（手机时间或闹钟），记录早起后的活动。建议从周末开始尝试，逐步适应新的作息时间。可以设置多个闹钟，寻找朋友监督。	8	1	2025-10-20 15:53:00	2025-10-27 14:53:00	2025-10-28 14:53:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	2	2025-10-20 14:54:37.091	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"rewards": ["breakfast_treat", "progress_tracking"], "support": "early_sleep", "challenges": ["wake_difficulty"], "motivation": ["exercise"], "targetTime": "6:00", "currentTime": "7:00"}	{}	\N	NONE	\N	2025-10-20 14:53:00	2025-10-30 14:53:00	2025-11-06 14:53:00	\N	\N	\N	2025-11-03 14:53:00	0
cmhilmabz00071lqopqqkiukc	6:00早起晨练运动挑战	从7:00起床调整到6:00起床，通过提前睡觉等方式保证充足睡眠。通过早起实现晨练运动、学习充电的目标，养成健康的作息习惯，提升生活质量和工作效率。	cmhcc8p1o000atqgxpzkeao00	cmglleuo70001187gxr1fbs82	POINTS	\N	USD	\N	PHOTO	每天提交起床时间截图（手机时间或闹钟），记录早起后的活动。建议从周末开始尝试，逐步适应新的作息时间。可以设置多个闹钟，寻找朋友监督。	8	2	2025-11-03 03:48:00	2025-11-03 03:50:00	2025-11-11 03:51:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{}	0	f	5	2025-11-03 03:46:52.75	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"rewards": ["breakfast_treat", "progress_tracking"], "support": "early_sleep", "challenges": ["wake_difficulty"], "motivation": ["exercise", "study"], "targetTime": "6:00", "currentTime": "7:00"}	{}	\N	NONE	\N	2025-11-03 03:46:52.398	2025-11-13 03:51:00	2025-11-20 03:51:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-17 03:51:00	0
cmgyrzuo4000h9bn906tapny5	英语单词学习打卡	通过阅读方式学习英语，主要目的是improvement。每天坚持学习，提高语言能力。	cmfgpklkn000114lt1n0ec61k	cmglleuod0003187gb5mr151u	POINTS	\N	USD	\N	PHOTO	每天提交阅读材料截图，包含学习内容和时长记录	8	2	2025-10-20 07:49:00	2025-10-27 06:49:00	2025-10-28 06:49:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	18	2025-10-20 06:49:59.812	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"type": "reading", "content": "vocabulary", "language": "english", "partners": ["textbook"], "purposes": ["improvement"], "persistence": "can_persist"}	{}	\N	NONE	\N	2025-10-20 06:49:00	2025-10-30 06:49:00	2025-11-06 06:49:00	\N	\N	\N	2025-11-03 06:49:00	0
cmhh5bhyy0007uuz5w9bd7s15	s啊打发撒旦挑战3421	阿萨的发送发送啊234	cmgxzbcqh0000hak2a2jt0wwa	cmgzc01fc000fyikfu8pyvmsv	POINTS	\N	USD	\N	PHOTO	请按照您设定的挑战要求提交相应的证据和记录，确保真实有效地完成挑战任务。	8	1	2025-11-02 03:27:00	2025-11-09 03:27:00	2025-11-10 03:27:00	OPEN	PERSONAL	PUBLIC	\N	\N	0	f	6	2025-11-02 03:22:49.403	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"daily_goal": "s啊打发撒旦", "target_description": "阿萨的发送发送啊"}	{}	\N	LOCAL	85	2025-11-02 03:22:49.052	2025-11-12 03:27:00	2025-11-19 03:27:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-16 03:27:00	0
cmfignse8000f8ulax88ui5ce	精英生产力挑战	高效时间管理和目标达成系统，适合追求卓越的用户，通过科学方法提升工作和生活效率	cmfhqg9mg001k8y89kdji8pwn	\N	FAVOR	\N	USD		PHOTO	使用时间管理工具，每日完成设定目标并记录成果	6	1	2025-09-14 16:08:00	2025-10-14 16:08:00	2025-10-16 16:08:00	CLOSED	PERSONAL	PUBLIC	COMPLETED	{}	0	f	19	2025-09-13 16:08:40.064	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-14 15:08:00	2025-10-18 16:08:00	2025-10-25 16:08:00	\N	\N	\N	2025-10-22 16:08:00	0
cmhm9g12c000uxx9ry2rqybn8	纯文字发布测试 AAA	每天饮水2000毫升，保持身体水分平衡，促进新陈代谢。	cmfgpklkn000114lt1n0ec61k	cmgzc01e20007yikfe33vxryv	POINTS	\N	USD	\N	PHOTO	每天记录饮水量并拍摄水杯照片，展示饮水进度。	10	2	2025-11-05 17:18:00	2025-11-05 17:20:00	2025-11-05 17:27:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{}	0	f	13	2025-11-05 17:17:10.116	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-05 17:17:09.754	2025-11-05 17:57:00	2025-11-05 18:27:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 18:27:00	0
cmhm81sot000hxx9rte0dloku	单人自我评价测试	每天进行30分钟瑜伽练习，放松身心，提升柔韧性。	cmfgpklkn000114lt1n0ec61k	cmgzc01du0005yikfc1dpio7d	POINTS	\N	USD	\N	PHOTO	每天拍摄瑜伽练习照片或视频，展示动作和练习时长。	10	1	2025-11-05 16:39:00	2025-11-05 16:41:00	2025-11-05 16:59:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	4	2025-11-05 16:38:06.461	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-05 16:38:06.104	2025-11-05 17:29:00	2025-11-05 17:59:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 17:59:00	0
cmhlpyzw3002y3fyjy4vg3c83	综合测试	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmhcegfin0006hcgendh83z40	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	2	2025-11-05 08:13:00	2025-11-05 08:15:00	2025-11-05 08:25:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	9	2025-11-05 08:12:02.736	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-11-05 08:12:02.376	2025-11-05 08:55:00	2025-11-05 09:25:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 09:25:00	0
cmhig5a250003141vy1jnjkhu	每日8小时深度睡眠提升	每天保证8小时优质睡眠，通过运动手环监测睡眠数据，重点改善深度睡眠、REM睡眠。科学睡眠，提升生活质量。	cmhc7jd8w0006x7g1c2qc46o4	cmhgopm960001urpfmuheqg6k	POINTS	\N	USD	\N	PHOTO	每天提交睡眠监测设备的睡眠报告截图，包含睡眠时长、深度睡眠比例等数据。	8	3	2025-11-03 01:17:00	2025-11-03 01:20:00	2025-11-03 01:25:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{cmhc7jd8w0006x7g1c2qc46o4}	0	f	84	2025-11-03 01:13:41.165	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"sleepGoals": ["deep_sleep", "rem_sleep"], "targetDuration": "8h", "trackingMethod": "fitness_band"}	{}	\N	LOCAL	25	2025-11-03 01:13:40.698	2025-11-05 01:25:00	2025-11-12 01:25:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-09 01:25:00	0
cmisrk0z1000pp50bcg4no9zl	Muscle Building Program	Follow comprehensive muscle building program with progressive overload training.	cmgxfcw0d0000o777zhox72xw	cmhgopmch001hurpf51r1s0te	POINTS	\N	USD	\N	PHOTO	Submit daily workout logs with exercises, sets, reps, and weights.	6	2	2025-12-05 11:18:00	2025-12-05 11:20:00	2025-12-05 11:25:00	DISPUTED	FITNESS	PUBLIC	COMPLETED	{cmfhsxf490000lmmnwp77vl6x,cmgxfcw0d0000o777zhox72xw}	1	f	37	2025-12-05 11:10:29.101	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-12-05 11:10:29.011	2025-12-05 11:55:00	2025-12-10 11:23:13.51	Beijing	China	Beijing, China	2025-12-07 11:23:13.51	0
cmhcefdvh0001hcgeng4yry82	每日运动挑战	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhcc8p1o000atqgxpzkeao00	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	3	2025-10-30 03:38:00	2025-11-06 03:38:00	2025-11-07 03:38:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{}	0	f	43	2025-10-29 19:38:56.381	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-10-30 02:38:00	2025-11-09 03:38:00	2025-11-16 03:38:00	\N	\N	\N	2025-11-13 03:38:00	0
cmfzrsy4l000d2tw3wt5whs5i	天气预测挑战	预测未来一周的天气情况，锻炼观察能力和逻辑推理能力，通过关注天气变化提高对自然环境的敏感度和预测准确性	cmfgpklkn000114lt1n0ec61k	\N	FAVOR	\N	USD		TEXT	每天提交对次日天气的预测，包括温度和天气状况	20	1	2025-09-26 18:52:00	2025-10-03 18:52:00	2025-10-05 18:52:00	CLOSED	WEATHER	PUBLIC	COMPLETED	{}	0	f	2	2025-09-25 18:52:41.541	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-26 17:52:00	2025-10-07 18:52:00	2025-10-14 18:52:00	\N	\N	\N	2025-10-11 18:52:00	0
cmgz2lyjf002810ifzlybx56h	压力管理挑战	学习和实践压力管理技巧，保持心理平衡和情绪稳定	cmfgpklkn000114lt1n0ec61k	cmglleuqf000x187gggmoc5ex	POINTS	\N	USD	\N	TEXT	记录压力管理方法和效果	12	1	2025-10-20 12:46:00	2025-10-27 11:46:00	2025-10-28 11:46:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	2	2025-10-20 11:47:07.419	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-10-20 11:46:00	2025-10-30 11:46:00	2025-11-06 11:46:00	\N	\N	\N	2025-11-03 11:46:00	0
cmfplita1000824jj8rtck0ti	每日阅读	承诺每天阅读至少30分钟，培养良好的阅读习惯，通过持续学习提升个人知识储备和思维能力，享受阅读带来的精神财富	cmfgpklkn000114lt1n0ec61k	\N	FAVOR	\N	USD		PHOTO	每天拍摄阅读照片，包括书籍和阅读时长记录	10	1	2025-09-19 15:59:00	2025-10-03 15:59:00	2025-10-05 15:59:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	2	2025-09-18 15:59:09.242	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-19 14:59:00	2025-10-07 15:59:00	2025-10-14 15:59:00	\N	\N	\N	2025-10-11 15:59:00	0
cmh82pxe60001e17r153xo76x	每日运动挑战	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmh4rbv470000d3m0tokxkudd	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	2	2025-10-26 19:59:00	2025-11-02 18:59:00	2025-11-03 18:59:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{}	0	f	12	2025-10-26 19:00:08.142	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-10-26 18:59:00	2025-11-05 18:59:00	2025-11-12 18:59:00	\N	\N	\N	2025-11-09 18:59:00	0
cmgz421sp003q10ifsz2qmse0	每日2000ml健康饮水挑战	从目前的1.5-2L提升到每日undefined饮水量，通过phone_app的方式，实现身体健康的健康目标。科学饮水，养成良好的饮水习惯。	cmfgpklkn000114lt1n0ec61k	cmglleuow000a187g6buthcwx	POINTS	\N	USD	\N	PHOTO	每日记录饮水量和时间，可以使用饮水应用或拍照记录。提交每日饮水总量截图和身体感受记录。	12	1	2025-10-20 13:25:00	2025-10-27 12:25:00	2025-10-28 12:25:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	0	2025-10-20 12:27:37.753	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["skin_health"], "schedule": ["morning_wake", "before_meals"], "reminders": ["phone_app"], "waterType": ["plain_water"], "targetIntake": "2L", "currentIntake": "1.5-2L"}	{}	\N	NONE	\N	2025-10-20 12:25:00	2025-10-30 12:25:00	2025-11-06 12:25:00	\N	\N	\N	2025-11-03 12:25:00	0
cmfign35x00098ulaq227751c	正念冥想之旅	21天正念冥想挑战，包含引导音频和进度追踪，帮助您建立内心平静和专注力	cmfhqhbdo001p8y89uh5fot7e	\N	FAVOR	\N	USD		PHOTO	每天完成15分钟正念冥想，记录心得体会	8	1	2025-09-14 16:08:00	2025-10-05 16:08:00	2025-10-07 16:08:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{}	0	f	2	2025-09-13 16:08:07.365	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-14 15:08:00	2025-10-09 16:08:00	2025-10-16 16:08:00	\N	\N	\N	2025-10-13 16:08:00	0
cmhlbnrhr004672stj3oz6a8s	实在是太麻烦了！	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhcegfin0006hcgendh83z40	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	2	2025-11-05 01:32:00	2025-11-05 01:34:00	2025-11-05 01:38:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{}	0	f	56	2025-11-05 01:31:24.015	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-05 01:31:23.655	2025-11-05 02:08:00	2025-11-05 02:38:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 02:38:00	0
cmfuyvpzc000n9isava0zsvl4	每日阅读	承诺每天阅读至少30分钟，培养良好的阅读习惯，通过持续学习提升个人知识储备和思维能力，享受阅读带来的精神财富	cmfhsxf490000lmmnwp77vl6x	\N	FAVOR	\N	USD		PHOTO	每天拍摄阅读照片，包括书籍和阅读时长记录http://142.171.117.89/create	10	1	2025-09-23 10:11:00	2025-10-07 10:11:00	2025-10-09 10:11:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	13	2025-09-22 10:11:57.384	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-23 09:11:00	2025-10-11 10:11:00	2025-10-18 10:11:00	\N	\N	\N	2025-10-15 10:11:00	0
cmhds6lll000710bhvhz72ti2	每日饮水2升挑战	每天饮水2000毫升，保持身体水分平衡，促进新陈代谢。	cmhcegfin0006hcgendh83z40	cmgzc01e20007yikfe33vxryv	POINTS	\N	USD	\N	PHOTO	每天记录饮水量并拍摄水杯照片，展示饮水进度。	10	1	2025-10-31 02:56:00	2025-11-07 02:56:00	2025-11-08 02:56:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	0	2025-10-30 18:51:47.289	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	LOCAL	50	2025-10-31 01:56:00	2025-11-10 02:56:00	2025-11-17 02:56:00	\N	\N	\N	2025-11-14 02:56:00	0
cmhgjibcq000v66n3freb84lj	自定义挑战	sadf	cmfiilojw000ao5ubr1d3vfk0	cmgzc01fc000fyikfu8pyvmsv	POINTS	\N	USD	\N	PHOTO	请按照您设定的挑战要求提交相应的证据和记录，确保真实有效地完成挑战任务。	8	1	2025-11-01 17:17:00	2025-11-08 17:17:00	2025-11-09 17:17:00	OPEN	PERSONAL	PUBLIC	\N	\N	0	f	2	2025-11-01 17:12:15.866	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"motivation": "sadf"}	{}	\N	NONE	\N	2025-11-01 17:12:15.412	2025-11-11 17:17:00	2025-11-18 17:17:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-15 17:17:00	0
cmgzc2ia700015zrt2ox3ww04	士大夫但是挑战	这是一个完全自定义的挑战，根据您的个人需求和目标设计。	cmfgpklkn000114lt1n0ec61k	cmgzc01fc000fyikfu8pyvmsv	POINTS	\N	USD	\N	PHOTO	成功标准：撒旦飞洒	8	1	2025-10-20 17:11:00	2025-10-27 16:11:00	2025-10-28 16:11:00	OPEN	PERSONAL	PUBLIC	\N	\N	0	f	2	2025-10-20 16:11:56.047	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"categories": ["创意", "社交"], "daily_goal": "士大夫但是", "success_criteria": "撒旦飞洒"}	{}	\N	NONE	\N	2025-10-20 16:11:00	2025-10-30 16:11:00	2025-11-06 16:11:00	\N	\N	\N	2025-11-03 16:11:00	0
cmfjq2cam0001az4knhimbwj3	高级健身追踪	专业级健身挑战，包含详细数据分析和个性化建议，通过科学的运动监测帮助您达到最佳健身效果	cmfgpklkn000114lt1n0ec61k	\N	FAVOR	\N	USD		PHOTO	使用专业健身app记录，提交详细的运动数据截图	12	1	2025-09-15 13:19:00	2025-09-29 13:19:00	2025-10-01 13:19:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{}	0	f	1	2025-09-14 13:19:41.758	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-15 12:19:00	2025-10-03 13:19:00	2025-10-10 13:19:00	\N	\N	\N	2025-10-07 13:19:00	0
cmhf38hzh0001129pbj4rlnj9	每日运动挑战111	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmfgpjvmb000014ltuwk3uwht	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-11-01 00:53:00	2025-11-08 00:53:00	2025-11-09 00:53:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	0	2025-10-31 16:48:57.87	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	LOCAL	35	2025-10-31 23:53:00	2025-11-11 00:53:00	2025-11-18 00:53:00	\N	\N	\N	2025-11-15 00:53:00	0
cmgz2gtq1001w10if2wo7moub	每日undefined健康饮水挑战	从目前的1.5-2L提升到每日undefined饮水量，通过phone_app的方式，实现身体健康的健康目标。科学饮水，养成良好的饮水习惯。	cmfgpklkn000114lt1n0ec61k	cmglleuow000a187g6buthcwx	POINTS	\N	USD	\N	PHOTO	每日记录饮水量和时间，可以使用饮水应用或拍照记录。提交每日饮水总量截图和身体感受记录。	12	1	2025-10-20 12:41:00	2025-10-27 11:41:00	2025-10-28 11:41:00	OPEN	HEALTH	PUBLIC	\N	\N	0	f	2	2025-10-20 11:43:07.897	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["skin_health", "energy"], "schedule": ["morning_wake", "before_meals"], "reminders": ["phone_app"], "waterType": ["plain_water"], "targetIntake": "2L", "currentIntake": "1.5-2L"}	{}	\N	NONE	\N	2025-10-20 11:41:00	2025-10-30 11:41:00	2025-11-06 11:41:00	\N	\N	\N	2025-11-03 11:41:00	0
cmhmaizbw000dlrhroj4npjg7	问题500错误测试 BBB	每天饮水2000毫升，保持身体水分平衡，促进新陈代谢。	cmhcegfin0006hcgendh83z40	cmgzc01e20007yikfe33vxryv	POINTS	\N	USD	\N	PHOTO	每天记录饮水量并拍摄水杯照片，展示饮水进度。	10	2	2025-11-05 17:49:00	2025-11-05 17:51:00	2025-11-05 17:56:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{}	0	f	25	2025-11-05 17:47:27.452	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-05 17:47:27.098	2025-11-05 18:26:00	2025-11-05 18:56:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 18:56:00	0
cmfjq47jk000daz4kzzebykah	天气预测挑战	预测未来一周的天气情况，锻炼观察能力和逻辑推理能力，通过关注天气变化提高对自然环境的敏感度和预测准确性	cmfgpklkn000114lt1n0ec61k	\N	FAVOR	\N	USD	ddddddddddddddddddddddd	TEXT	每天提交对次日天气的预测，包括温度和天气状况	20	1	2025-09-15 13:20:00	2025-09-22 13:20:00	2025-09-24 13:20:00	CLOSED	WEATHER	PUBLIC	COMPLETED	{}	0	f	2	2025-09-14 13:21:08.913	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-15 12:20:00	2025-09-26 13:20:00	2025-10-03 13:20:00	\N	\N	\N	2025-09-30 13:20:00	0
cmgyu6zns001210ifiq68mezu	每周3次增肌训练挑战	通过增肌训练锻炼shoulders，每次训练1小时，主要目标是improve_endurance、health_maintenance。坚持规律训练，打造理想身材。	cmfgpklkn000114lt1n0ec61k	cmglleuon0006187g11n0c4wi	POINTS	\N	USD	\N	PHOTO	每次训练后提交详细训练数据和动作视频，包含训练内容、使用重量和训练感受	8	1	2025-10-20 08:50:00	2025-10-27 07:50:00	2025-10-28 07:50:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	2	2025-10-20 07:51:32.105	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["improve_endurance", "health_maintenance"], "duration": "60min", "frequency": "3_times_week", "experience": "advanced", "targetMuscle": ["shoulders"], "trainingType": "muscle_building"}	{}	\N	NONE	\N	2025-10-20 07:50:00	2025-10-30 07:50:00	2025-11-06 07:50:00	\N	\N	\N	2025-11-03 07:50:00	0
cmfuzf4db000u9isa9si4797a	冥想练习	承诺每天进行15分钟冥想练习，通过正念冥想缓解压力，提高专注力和内心平静，培养身心健康的生活方式	cmfgpklkn000114lt1n0ec61k	\N	FAVOR	\N	USD		PHOTO	每天拍摄冥想环境或冥想app记录	8	1	2025-09-23 10:27:00	2025-10-07 10:27:00	2025-10-09 10:27:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{}	0	f	1	2025-09-22 10:27:02.495	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-23 09:27:00	2025-10-11 10:27:00	2025-10-18 10:27:00	\N	\N	\N	2025-10-15 10:27:00	0
cmfuydo8w00029isa7gi8qtp8	修复测试游戏	验证404问题是否已修复	cmfgpmfbo000314ltz0jj7n1y	\N	FAVOR	\N	USD	\N	PHOTO	请上传相关照片	5	1	2025-09-22 10:57:55	2025-09-29 09:57:55	2025-09-30 09:57:55	CLOSED	HEALTH	PUBLIC	COMPLETED	{}	0	f	3	2025-09-22 09:57:55.328	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-22 09:57:55	2025-10-02 09:57:55	2025-10-09 09:57:55	\N	\N	\N	2025-10-06 09:57:55	0
cmhmaeqrm0007lrhrg653ddrs	问题提交500测试 BBB	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmfgpklkn000114lt1n0ec61k	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	1	2025-11-05 17:45:00	2025-11-05 17:47:00	2025-11-05 17:58:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	4	2025-11-05 17:44:09.729	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-11-05 17:44:09.358	2025-11-05 18:28:00	2025-11-05 18:58:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 18:58:00	0
cmisuxiid0001rob2ivn70d27	Daily Startup Progress	Make daily progress on your startup project, including product development, marketing, or customer acquisition.	cmfhsxf490000lmmnwp77vl6x	cmgzc01f4000eyikfz9bevt2h	POINTS	\N	USD	\N	PHOTO	Submit daily work progress screenshots or achievement records.	4	1	2025-12-05 12:49:00	2025-12-12 12:49:00	2025-12-13 12:49:00	OPEN	WORK	PUBLIC	\N	\N	0	f	0	2025-12-05 12:44:57.205	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-12-05 12:44:57.041	2025-12-13 13:19:00	2025-12-13 13:49:00	Chiyoda City	Japan	Chiyoda City, Tokyo, Japan	\N	0
cmfhq6fnn00078y89ear6ausw	每日阅读	承诺每天阅读至少30分钟，培养良好的阅读习惯，通过持续学习提升个人知识储备和思维能力，享受阅读带来的精神财富	cmfgpklkn000114lt1n0ec61k	\N	FAVOR	\N	USD		PHOTO	每天拍摄阅读照片，包括书籍和阅读时长记录	10	1	2025-09-14 03:47:00	2025-09-28 03:47:00	2025-09-30 03:47:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	6	2025-09-13 03:47:20.387	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-14 02:47:00	2025-10-02 03:47:00	2025-10-09 03:47:00	\N	\N	\N	2025-10-06 03:47:00	0
cmhlljrtz001b3fyju6ayec2i	AAAAAAAAAAA	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmh36n1zs0005td07t6m368m7	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	2	2025-11-05 06:09:00	2025-11-05 06:11:00	2025-11-05 06:18:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	14	2025-11-05 06:08:13.991	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-11-05 06:08:13.629	2025-11-05 06:48:00	2025-11-05 07:18:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 07:18:00	0
cmgz45k8u003w10if5308muwm	每周3次力量训练挑战	新手水平的力量训练，重点锻炼胸肌、背肌、肩膀，每次训练1小时，主要目标是增肌塑形、提升力量。坚持规律训练，打造理想身材。	cmfgpklkn000114lt1n0ec61k	cmglleuon0006187g11n0c4wi	POINTS	\N	USD	\N	PHOTO	每次训练后提交训练动作照片和器械使用记录，包含训练内容、使用重量和训练感受	8	1	2025-10-20 13:28:00	2025-10-27 12:28:00	2025-10-28 12:28:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	2	2025-10-20 12:30:21.63	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["build_muscle", "increase_strength"], "duration": "60min", "frequency": "3_times_week", "experience": "beginner", "targetMuscle": ["chest", "back", "shoulders"], "trainingType": "strength"}	{}	\N	NONE	\N	2025-10-20 12:28:00	2025-10-30 12:28:00	2025-11-06 12:28:00	\N	\N	\N	2025-11-03 12:28:00	0
cmhga25nx000113ttuzu9uc2y	每日运动挑战VVVVVV	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmfgpklkn000114lt1n0ec61k	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	2	2025-11-01 12:52:00	2025-11-08 12:52:00	2025-11-09 12:52:00	CLOSED	FITNESS	PUBLIC	\N	\N	0	f	29	2025-11-01 12:47:45.453	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-01 12:47:45.005	2025-11-11 12:52:00	2025-11-18 12:52:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-15 12:52:00	0
cmgyt910l000k10ifchf3x13m	英语单词学习打卡	通过阅读方式学习英语，主要目的是improvement。每天坚持学习，提高语言能力。	cmfgpklkn000114lt1n0ec61k	cmglleuod0003187gb5mr151u	POINTS	\N	USD	\N	PHOTO	每天提交阅读材料截图，包含学习内容和时长记录	8	1	2025-10-20 08:24:00	2025-10-27 07:24:00	2025-10-28 07:24:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-20 07:25:07.557	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"type": "reading", "content": "vocabulary", "language": "english", "partners": ["textbook"], "purposes": ["improvement"], "persistence": "can_persist"}	{}	\N	NONE	\N	2025-10-20 07:24:00	2025-10-30 07:24:00	2025-11-06 07:24:00	\N	\N	\N	2025-11-03 07:24:00	0
cmhooodux000ldvi6x4x66lmg	仲裁	30天极简生活：断舍离、减少物欲、专注重要事物	cmhcegfin0006hcgendh83z40	cmhgopmcq001murpfg54umnio	POINTS	\N	USD	\N	PHOTO	每天记录断舍离进展，拍摄整理成果	8	4	2025-11-07 11:00:00	2025-11-07 11:02:00	2025-11-07 11:10:00	CLOSED	LIFESTYLE	PUBLIC	COMPLETED	{}	5	f	65	2025-11-07 09:59:06.537	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-07 10:00:00	2025-11-07 11:40:00	2025-11-07 12:10:00	Taipei	Taiwan	Taipei, Taiwan, Taiwan	2025-11-04 12:10:00	0
cmfhq6xoa000d8y89mv90gi3f	每日运动挑战	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmfgpjvmb000014ltuwk3uwht	\N	FAVOR	\N	USD		PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-09-14 03:47:00	2025-09-21 03:47:00	2025-09-23 03:47:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{}	0	f	2	2025-09-13 03:47:43.739	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-14 02:47:00	2025-09-25 03:47:00	2025-10-02 03:47:00	\N	\N	\N	2025-09-29 03:47:00	0
cmg2bc7310007hbraewf0rmyh	每日阅读30分钟	培养阅读习惯，每天阅读30分钟	cmfgpklkn000114lt1n0ec61k	\N	FAVOR	\N	USD	\N	PHOTO	每天阅读30分钟，拍摄阅读照片	15	1	2025-09-27 23:34:00	2025-09-30 23:34:00	2025-10-01 23:34:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	0	2025-09-27 13:35:04.669	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-27 22:34:00	2025-10-03 23:34:00	2025-10-10 23:34:00	\N	\N	\N	2025-10-07 23:34:00	0
cmhllybk0001y3fyj4uqheq07	 都不选择，测试专用	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmfhsxf490000lmmnwp77vl6x	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	1	2025-11-05 06:21:00	2025-11-05 06:23:00	2025-11-05 06:27:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	20	2025-11-05 06:19:32.736	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-11-05 06:19:32.378	2025-11-05 06:57:00	2025-11-05 07:27:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 07:27:00	0
cmha76h9v000xn9utzxu5dikm	edetailed感恩日记	通过文字日记的方式，重点关注生活各方面的感恩体验，实现积极心态的目标。每日坚持感恩练习，培养积极心态，提升生活幸福感。	cmfgpklkn000114lt1n0ec61k	cmglleup9000f187g7x7zw65p	POINTS	\N	USD	\N	TEXT	每日提交详细的感恩记录，描述感恩事项的具体情况和内心感受。分享感恩练习的体验和收获。	15	1	2025-10-28 14:40:00	2025-11-04 14:40:00	2025-11-05 14:40:00	OPEN	PERSONAL	PUBLIC	\N	\N	0	f	4	2025-10-28 06:40:31.219	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"depth": "detailed", "goals": ["positive_mindset"], "format": ["written_journal"], "itemCount": "3_items", "timeOfDay": "evening", "focusAreas": ["relationships"]}	{}	\N	NONE	\N	2025-10-28 13:40:00	2025-11-07 14:40:00	2025-11-14 14:40:00	\N	\N	\N	2025-11-11 14:40:00	0
cmhl2btuq001mqg348jq0sk3v	测试大文件和视频上传	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhcegfin0006hcgendh83z40	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	3	2025-11-04 21:11:00	2025-11-04 21:13:00	2025-11-04 21:20:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{}	0	f	36	2025-11-04 21:10:10.658	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-04 21:10:10.269	2025-11-04 21:50:00	2025-11-04 22:20:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-01 22:20:00	0
cmhllhvuo00153fyj7ja4ix5h	BBBBBBBBBB	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmh36n1zs0005td07t6m368m7	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	1	2025-11-05 06:11:00	2025-11-12 06:11:00	2025-11-13 06:11:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	2	2025-11-05 06:06:45.888	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-11-05 06:06:45.52	2025-11-13 06:41:00	2025-11-13 07:11:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-10 07:11:00	0
cmgz33pui003e10ifdaxnhcwx	每日daily创意创作	通过多元化创作的方式，从日常生活中汲取灵感，实现自我表达的目标。每日坚持创作，培养创意思维，提升艺术表达能力。	cmfgpklkn000114lt1n0ec61k	cmglleuou0009187gvokewit5	POINTS	\N	USD	\N	PHOTO	每日提交创作作品或过程记录，分享创作心得和灵感来源。记录创作技能的提升和创意思维的发展。	10	1	2025-10-20 13:00:00	2025-10-27 12:00:00	2025-10-28 12:00:00	OPEN	PERSONAL	PUBLIC	\N	\N	0	f	2	2025-10-20 12:00:55.962	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["self_expression"], "sharing": "friends", "duration": "30_min", "frequency": "daily", "experience": "hobbyist", "inspiration": ["daily_life"], "creativeFields": ["writing"]}	{}	\N	NONE	\N	2025-10-20 12:00:00	2025-10-30 12:00:00	2025-11-06 12:00:00	\N	\N	\N	2025-11-03 12:00:00	0
cmhf9df3o000v140l9gorkotg	每日运动挑战SSSSSSSSSSSSSSSSSS	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhc7jd8w0006x7g1c2qc46o4	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-11-01 03:45:00	2025-11-08 03:45:00	2025-11-09 03:45:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	8	2025-10-31 19:40:45.108	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	无所谓一个地方	CUSTOM	\N	2025-11-01 02:45:00	2025-11-11 03:45:00	2025-11-18 03:45:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-15 03:45:00	0
cminf7h9d0004ie6l6wjx24r9	测试dispute	全方位语言学习：听说读写全面提升	cmfgpklkn000114lt1n0ec61k	cmhgopmcj001iurpf7xecav93	POINTS	\N	USD	\N	PHOTO	每天完成听力、口语、阅读、写作练习	8	2	2025-12-01 17:28:00	2025-12-01 17:30:00	2025-12-01 17:34:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	1	f	31	2025-12-01 17:25:57.41	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-12-01 17:25:56.945	2025-12-01 18:04:00	2025-12-03 17:38:03.43	Singapore	Singapore	Singapore, Singapore	2025-11-30 17:38:03.43	0
cmfuteq6c000g24jj0ol98br2	冥想练习	承诺每天进行15分钟冥想练习，通过正念冥想缓解压力，提高专注力和内心平静，培养身心健康的生活方式	cmfgpklkn000114lt1n0ec61k	\N	FAVOR	\N	USD		PHOTO	每天拍摄冥想环境或冥想app记录	8	1	2025-09-23 07:38:00	2025-10-07 07:38:00	2025-10-09 07:38:00	CLOSED	HEALTH	PUBLIC	COMPLETED	{}	0	f	2	2025-09-22 07:38:46.404	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-23 06:38:00	2025-10-11 07:38:00	2025-10-18 07:38:00	\N	\N	\N	2025-10-15 07:38:00	0
cmhfd2p6o0007f1ptydstmfcl	测试游戏	测试描述	cmhc7jd8w0006x7g1c2qc46o4	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	测试证据	6	1	2025-11-01 22:00:00	2025-11-08 22:00:00	2025-11-09 22:00:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	0	2025-10-31 21:24:23.425	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-01 21:00:00	2025-11-11 22:00:00	2025-11-18 22:00:00	\N	\N	\N	2025-11-15 22:00:00	0
cmhgta0p2000vrhx7rd7ua5rs	10公里丘陵骑行训练	每天骑行10公里，路况为丘陵。通过系统训练，实现1个健身目标。	cmhcc8p1o000atqgxpzkeao00	cmhgopm9y000aurpffeknkxrr	POINTS	\N	USD	\N	PHOTO	每次骑行后提交骑行APP截图，包含距离、时间、路线等数据。拍摄骑行照片作为证据。	8	1	2025-11-01 21:50:00	2025-11-08 21:50:00	2025-11-09 21:50:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	0	2025-11-01 21:45:44.966	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["endurance"], "terrain": "hills", "frequency": "daily", "targetDistance": "10km"}	{}	\N	NONE	\N	2025-11-01 21:45:44.616	2025-11-11 21:50:00	2025-11-18 21:50:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-15 21:50:00	0
cmgyu8qlz001810ifsjvti4yl	每日30分钟阴瑜伽练习	通过阴瑜伽练习，在户外练习中实现提升柔韧性、缓解压力、改善平衡、改善睡眠、提升专注力、改善体态的目标。每日坚持练习，逐步提升身体柔韧性、力量和内在平静，达到身心和谐的状态。	cmfgpklkn000114lt1n0ec61k	cmglleuop0007187gana8cfuc	POINTS	\N	USD	\N	PHOTO	根据个人能力选择合适的练习强度，保持正念和专注。提交练习记录，包括练习的体式、时长和内在体验，分享练习心得。	10	1	2025-10-20 08:52:00	2025-10-27 07:52:00	2025-10-28 07:52:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	2	2025-10-20 07:52:53.688	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["flexibility", "stress_relief", "balance", "sleep", "mindfulness", "posture"], "style": ["yin"], "duration": "30_min", "timeOfDay": ["morning", "evening"], "experience": "advanced", "environment": "outdoor"}	{}	\N	NONE	\N	2025-10-20 07:52:00	2025-10-30 07:52:00	2025-11-06 07:52:00	\N	\N	\N	2025-11-03 07:52:00	0
cmhmlf1yw0001ngziqwf0kifk	zzzzzzzzzzz	每天练习一项技能30分钟，如编程、绘画、乐器等。	cmhcegfin0006hcgendh83z40	cmgzc01dd0002yikfg44g1q92	POINTS	\N	USD	\N	PHOTO	每天提交练习成果照片或视频，展示练习过程和进步。	6	4	2025-11-05 22:53:00	2025-11-05 22:55:00	2025-11-05 23:00:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{cmfhsxf490000lmmnwp77vl6x}	0	f	62	2025-11-05 22:52:20.024	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-05 22:52:19.594	2025-11-05 23:30:00	2025-11-06 00:00:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-03 00:00:00	0
cmgm4q1mg000varyo5ppyz8vm	考试备考计划	制定并执行考试复习计划，系统性地准备重要考试	cmfgpklkn000114lt1n0ec61k	cmglleuqd000w187gcxn2qmrq	FAVOR	\N	USD	\N	PHOTO	拍摄学习资料、笔记或复习进度照片	15	1	2025-10-11 20:25:00	2025-11-08 20:25:00	2025-11-09 20:25:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-11 10:25:16.985	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-10-11 19:25:00	2025-11-11 20:25:00	2025-11-18 20:25:00	\N	\N	\N	2025-11-15 20:25:00	0
cmhdb2fs50007r5aefv8tho9a	每日30分钟非虚构类阅读	通过阅读非虚构类、商业管理、自我提升，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmhcegfin0006hcgendh83z40	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	1	2025-10-30 18:57:00	2025-11-06 18:57:00	2025-11-07 18:57:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-30 10:52:39.653	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction", "business", "self_help"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	\N	\N	\N	\N	\N	\N	\N	0
cmhlfwbp9001chru4iqqmzmtt	评价通知	通过阅读非虚构类，使用纸质书籍的方式，实现增长知识的目标。每日坚持阅读，培养良好的阅读习惯，拓展知识视野，提升个人素养。	cmh36n1zs0005td07t6m368m7	cmglleuoa0002187g66sus0ru	POINTS	\N	USD	\N	PHOTO	在安静的环境中专心阅读，做好读书笔记。提交阅读照片、进度记录或读书心得，分享阅读体验和思考。	10	2	2025-11-05 03:31:00	2025-11-05 03:33:00	2025-11-05 03:37:00	CLOSED	LEARNING	PUBLIC	COMPLETED	{}	0	f	38	2025-11-05 03:30:01.917	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-11-05 03:30:01.501	2025-11-05 04:07:00	2025-11-05 04:37:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 04:37:00	0
cmhegy79n000jbpixn9ramn8p	每日30分钟编程技术练习LLLLLLLL	针对初学者设计的编程技术练习计划，主要目标是掌握基础。通过系统性的练习和学习，逐步提升技能水平，实现个人成长和发展目标。	cmfgpjvmb000014ltuwk3uwht	cmglleuog0004187gg6xsr39r	POINTS	\N	USD	\N	PHOTO	每日进行编程练习，可以是算法题、项目开发或新技术学习。提交代码截图、项目进度或学习笔记，记录技术成长过程。	6	1	2025-10-31 14:29:00	2025-11-14 14:29:00	2025-11-15 14:29:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	0	2025-10-31 06:25:05.867	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["basic_mastery"], "duration": "30_min", "frequency": "daily", "resources": ["online_courses"], "skillType": "programming", "experience": "beginner"}	{}	\N	LOCAL	50	2025-10-31 13:29:00	2025-11-17 14:29:00	2025-11-24 14:29:00	\N	\N	\N	2025-11-21 14:29:00	0
cmhl9juw3001x72st1a9aci7j	测试上传各种文件  1111111	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhcegfin0006hcgendh83z40	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	3	2025-11-05 00:33:00	2025-11-05 00:35:00	2025-11-05 00:42:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{}	0	f	76	2025-11-05 00:32:22.563	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-05 00:32:22.198	2025-11-05 01:12:00	2025-11-05 01:42:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-02 01:42:00	0
cmhffqc9m000df1ptu5pjnr1m	Nginx代理测试	测试描述	cmhc7jd8w0006x7g1c2qc46o4	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	测试证据	6	1	2025-11-01 22:30:00	2025-11-08 22:30:00	2025-11-09 22:30:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	0	2025-10-31 22:38:45.658	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-01 21:30:00	2025-11-11 22:30:00	2025-11-18 22:30:00	Los Angeles	United States	Los Angeles, California, United States	2025-11-15 22:30:00	0
cmhilxfdx000t1lqotcq44kxe	每日跑步5公里 测试双人评价	每天跑步5公里，提升心肺功能和耐力	cmfgpklkn000114lt1n0ec61k	cmhgopm9t0008urpf8izloqil	POINTS	\N	USD	\N	PHOTO	每天拍摄跑步app记录截图，显示距离和时间	10	2	2025-11-03 03:57:00	2025-11-10 04:00:00	2025-11-11 04:00:00	CLOSED	FITNESS	PUBLIC	COMPLETED	{}	0	f	19	2025-11-03 03:55:32.517	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-03 03:55:32.163	2025-11-13 04:00:00	2025-11-20 04:00:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-17 04:00:00	0
cmgngvxje0002w62u1am5xzpk	商业计划完善	每天完善商业计划的一个部分，系统性地构建创业项目的商业模式	cmfgpklkn000114lt1n0ec61k	cmglleupn000l187go0h227ub	FAVOR	\N	USD	\N	TEXT	记录每天完善的商业计划内容和思考	8	1	2025-10-12 18:53:00	2025-11-02 18:53:00	2025-11-03 18:53:00	OPEN	WORK	PUBLIC	\N	\N	0	f	0	2025-10-12 08:53:33.194	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-10-12 17:53:00	2025-11-05 18:53:00	2025-11-12 18:53:00	\N	\N	\N	2025-11-09 18:53:00	0
cmhjh2b8f000f117a9xkmo4nx	每日背单词50个	每天背诵50个新单词，快速扩充词汇量	cmhcegfin0006hcgendh83z40	cmhgopmbz0018urpfs5u2q6fn	POINTS	\N	USD	\N	PHOTO	每天拍摄单词app学习记录	20	1	2025-11-03 18:34:00	2025-11-03 18:40:00	2025-11-11 18:31:00	OPEN	LEARNING	PUBLIC	\N	\N	0	f	6	2025-11-03 18:27:08.511	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"goals": ["knowledge"], "format": ["physical"], "genres": ["non_fiction"], "duration": "30_min", "timeOfDay": ["evening"], "environment": "home"}	{}	\N	NONE	\N	2025-11-03 18:27:08.145	2025-11-11 19:01:00	2025-11-11 19:31:00	Limburg an der Lahn	Germany	Limburg an der Lahn, Hesse, Germany	2025-11-08 19:31:00	0
cmgz2q4bu002q10ifkiylx1g8	卧室zone_system整理挑战	通过分区系统对卧室进行整理，实现断舍离的目标。系统性地改善居住环境，提升生活品质和居住舒适度。	cmfgpklkn000114lt1n0ec61k	cmglleup3000c187g54yvah1w	POINTS	\N	USD	\N	PHOTO	每次整理提交整理过程和成果照片，记录使用的方法和工具。分享整理技巧和维护心得。	10	1	2025-10-20 12:50:00	2025-10-27 11:50:00	2025-10-28 11:50:00	OPEN	LIFESTYLE	PUBLIC	\N	\N	0	f	2	2025-10-20 11:50:21.546	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{"areas": ["bedroom"], "goals": ["declutter"], "tools": ["storage_boxes"], "methods": ["zone_system"], "maintenance": "weekly_review", "timeCommitment": "30_min_daily", "organizationStyle": "functional"}	{}	\N	NONE	\N	2025-10-20 11:50:00	2025-10-30 11:50:00	2025-11-06 11:50:00	\N	\N	\N	2025-11-03 11:50:00	0
cmim1o88a000lt9hy0q4yq785	创意项目完成	完成一个完整的创意项目：写作、绘画、音乐等	cmh7d0ay1000zd3m01yxn28f4	cmhgopmcp001lurpfgb7zpa47	POINTS	\N	USD	\N	PHOTO	每天记录项目进展，最后提交完整作品	6	1	2025-11-30 18:24:00	2025-12-28 18:24:00	2025-12-29 18:24:00	OPEN	PERSONAL	PUBLIC	\N	\N	0	t	39	2025-11-30 18:19:18.058	2025-12-08 20:00:00.048	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-11-30 18:19:17.599	2025-12-29 18:54:00	2025-12-29 19:24:00	Singapore	Singapore	Singapore, Singapore	2025-12-26 19:24:00	3
cmisrhddp000dp50be48i4yi8	Daily Healthy Cooking	Cook one healthy meal daily to improve cooking skills and eating habits.	cmgxfcw0d0000o777zhox72xw	cmhgopmb3000turpfzvzmq5c4	POINTS	\N	USD	\N	PHOTO	Submit daily cooking process photos and finished dish photos.	12	1	2025-12-05 11:10:00	2025-12-05 11:12:00	2025-12-05 11:18:00	OPEN	LIFESTYLE	PUBLIC	\N	\N	0	t	6	2025-12-05 11:08:25.213	2025-12-08 20:00:00.048	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-12-05 11:08:25.123	2025-12-05 11:48:00	2025-12-05 12:18:00	Beijing	China	Beijing, China	\N	1
cmg228mp0000l7sa2x10rfit8	人际关系拓展	每天主动联系一位同事或行业朋友	cmfgpklkn000114lt1n0ec61k	\N	FAVOR	\N	USD	\N	TEXT	记录每天的交流内容和收获	6	1	2025-09-27 19:27:00	2025-10-04 10:19:00	2025-10-05 10:19:00	CLOSED	WORK	PUBLIC	COMPLETED	{}	0	f	24	2025-09-27 09:20:21.733	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	\N	\N	\N	NONE	\N	2025-09-27 18:27:00	2025-10-07 10:19:00	2025-10-14 10:19:00	\N	\N	\N	2025-10-11 10:19:00	0
cmhf7gu490007wnlzy17hvjyw	每日运动挑战	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	cmhcc8p1o000atqgxpzkeao00	cmglleuny0000187ge0fynepu	POINTS	\N	USD	\N	PHOTO	每天拍摄运动照片或视频作为证据，包括运动类型和时长	6	1	2025-11-01 02:52:00	2025-11-08 02:52:00	2025-11-09 02:52:00	OPEN	FITNESS	PUBLIC	\N	\N	0	f	0	2025-10-31 18:47:25.305	2025-12-08 20:00:00.06	f	\N	\N	\N	\N	\N	{}	{}	\N	LOCAL	50	2025-11-01 01:52:00	2025-11-11 02:52:00	2025-11-18 02:52:00	\N	\N	\N	2025-11-15 02:52:00	0
cmisrekjn0007p50bbvfb8mif	Book Club Reading Challenge 1111	Read one book per week and participate in discussions to deepen understanding.	cmfhsxf490000lmmnwp77vl6x	cmhgopmcl001jurpf0xibpvcb	POINTS	\N	USD	\N	PHOTO	Submit weekly reading progress, book reviews, and discussion participation records.	10	1	2025-12-05 11:07:00	2026-01-02 11:09:00	2026-01-03 11:15:00	OPEN	LEARNING	PUBLIC	\N	\N	0	t	10	2025-12-05 11:06:14.531	2025-12-08 20:00:00.048	f	\N	\N	\N	\N	\N	{}	{}	\N	NONE	\N	2025-12-05 11:06:14.451	2026-01-03 11:45:00	2026-01-03 12:15:00	Beijing	China	Beijing, China	\N	0
\.


--
-- Data for Name: bet_participants; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.bet_participants (id, game_id, user_id, "position", joined_at, evidence_submitted, evidence_type, evidence_content, evidence_submitted_at, self_reported_success, peer_evaluations_received, peer_evaluations_given, final_result, completion_verified, created_at, evidence_description, penalty_points, penalty_reason, penalized_at) FROM stdin;
cmgm4k4pj000faryouajbyas2	cmgm4k4pb000daryonhg4cvl2	cmfgpklkn000114lt1n0ec61k	\N	2025-10-11 10:20:41.047	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-11 10:20:41.047	\N	0	\N	\N
cmgm4ksn1000laryoxmvyj11k	cmgm4ksmu000jaryole73k1gt	cmfgpklkn000114lt1n0ec61k	\N	2025-10-11 10:21:12.061	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-11 10:21:12.061	\N	0	\N	\N
cmgm4piw5000raryo922uzgnq	cmgm4pivy000paryofaix1z5y	cmfgpklkn000114lt1n0ec61k	\N	2025-10-11 10:24:52.709	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-11 10:24:52.709	\N	0	\N	\N
cmgm3kgel0003aryop5mf32lp	cmgm3kgee0001aryoqxl2ctov	cmfgpklkn000114lt1n0ec61k	\N	2025-10-11 09:52:56.59	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-11 09:52:56.59	\N	0	\N	\N
cmgm4jk8t0009aryo2hx641dx	cmgm4jk8j0007aryom8bfkppi	cmfgpklkn000114lt1n0ec61k	\N	2025-10-11 10:20:14.525	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-11 10:20:14.525	\N	0	\N	\N
cmgm4q1mp000xaryo4gczs63r	cmgm4q1mg000varyo5ppyz8vm	cmfgpklkn000114lt1n0ec61k	\N	2025-10-11 10:25:16.993	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-11 10:25:16.993	\N	0	\N	\N
cmgngvxjm0004w62ur1q0v0tc	cmgngvxje0002w62u1am5xzpk	cmfgpklkn000114lt1n0ec61k	\N	2025-10-12 08:53:33.202	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-12 08:53:33.202	\N	0	\N	\N
cmgyrcaxo0003kgtcex3o4zx7	cmgyrcaxc0001kgtc6kym2lft	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 06:31:41.148	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 06:31:41.148	\N	0	\N	\N
cmgyrq5ve00039bn9l3z8w30d	cmgyrq5v500019bn9dezllbjh	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 06:42:27.77	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 06:42:27.77	\N	0	\N	\N
cmgyrs7py000b9bn9k9saeoj4	cmgyrs7po00099bn9mpilta9w	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 06:44:03.478	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 06:44:03.478	\N	0	\N	\N
cmgyshst8000r9bn9rmm6fr0j	cmgyshssx000p9bn9p2oknkde	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 07:03:57.212	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 07:03:57.212	\N	0	\N	\N
cmgysof93000310if19114ccg	cmgysof8t000110ife0i3rry7	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 07:09:06.231	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 07:09:06.231	\N	0	\N	\N
cmfuydo9200049isavff3xift	cmfuydo8w00029isa7gi8qtp8	cmfgpmfbo000314ltz0jj7n1y	\N	2025-09-22 09:57:55.334	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-22 09:57:55.334	\N	0	\N	\N
cmfuyvpzi000p9isar1vg72tg	cmfuyvpzc000n9isava0zsvl4	cmfhsxf490000lmmnwp77vl6x	\N	2025-09-22 10:11:57.39	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-22 10:11:57.39	\N	0	\N	\N
cmfuyff3c000i9isas7wfyzhm	cmfuyff36000g9isakmxjcmr5	cmfgpmfbo000314ltz0jj7n1y	\N	2025-09-22 09:59:16.776	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-22 09:59:16.776	\N	0	\N	\N
cmfhqcmcn000r8y89fekksxnd	cmfhqcmch000p8y89n79410wa	cmfgpjvmb000014ltuwk3uwht	\N	2025-09-13 03:52:09	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-13 03:52:09	\N	0	\N	\N
cmfhqdgq000118y89ruqof5qd	cmfhqcmch000p8y89n79410wa	cmfgpklkn000114lt1n0ec61k	\N	2025-09-13 03:52:48.361	f	\N	\N	\N	\N	1	0	FAILURE	t	2025-09-13 03:52:48.361	\N	0	\N	\N
cmfhqed2r001d8y89ux2jimuw	cmfhqcmch000p8y89n79410wa	cmfgplidl000214ltrltpgf6s	\N	2025-09-13 03:53:30.291	f	\N	\N	\N	\N	1	0	FAILURE	t	2025-09-13 03:53:30.291	\N	0	\N	\N
cmfhqdzil00198y89jeq8956n	cmfhqcmch000p8y89n79410wa	cmfgpmfbo000314ltz0jj7n1y	\N	2025-09-13 03:53:12.717	f	\N	\N	\N	\N	1	0	FAILURE	t	2025-09-13 03:53:12.717	\N	0	\N	\N
cmfhqgeh5001m8y895bdz61m3	cmfhqcmch000p8y89n79410wa	cmfhqg9mg001k8y89kdji8pwn	\N	2025-09-13 03:55:05.417	f	\N	\N	\N	\N	0	4	FAILURE	t	2025-09-13 03:55:05.417	\N	0	\N	\N
cmfhqhfdb001r8y894e1e31j9	cmfhqcmch000p8y89n79410wa	cmfhqhbdo001p8y89uh5fot7e	\N	2025-09-13 03:55:53.232	f	\N	\N	\N	\N	1	0	FAILURE	t	2025-09-13 03:55:53.232	\N	0	\N	\N
cmg2bbjrh0003hbraw09pihz9	cmg2bbjr80001hbraujzmuv8o	cmfgpklkn000114lt1n0ec61k	\N	2025-09-27 13:34:34.445	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-27 13:34:34.445	\N	0	\N	\N
cmfuzsf9300139isaeot5cs2n	cmfuzsf8w00119isa4t5mlh68	cmfgpklkn000114lt1n0ec61k	\N	2025-09-22 10:37:23.127	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-22 10:37:23.127	\N	0	\N	\N
cmfuteq6k000i24jj5sere2xh	cmfuteq6c000g24jj0ol98br2	cmfgpklkn000114lt1n0ec61k	\N	2025-09-22 07:38:46.413	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-22 07:38:46.413	\N	0	\N	\N
cmfhq60vx00038y89p9nfnh2l	cmfhq60vo00018y89c4tyvorz	cmfgpmfbo000314ltz0jj7n1y	\N	2025-09-13 03:47:01.245	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-13 03:47:01.245	\N	0	\N	\N
cmfplitaa000a24jj2zcsf56i	cmfplita1000824jj8rtck0ti	cmfgpklkn000114lt1n0ec61k	\N	2025-09-18 15:59:09.25	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-18 15:59:09.25	\N	0	\N	\N
cmfjq310a0009az4koajd59aa	cmfjq31050007az4kfbucjcdq	cmfgpklkn000114lt1n0ec61k	\N	2025-09-14 13:20:13.787	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-14 13:20:13.787	\N	0	\N	\N
cmfign365000b8ulapvyr2723	cmfign35x00098ulaq227751c	cmfhqhbdo001p8y89uh5fot7e	\N	2025-09-13 16:08:07.374	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-13 16:08:07.374	\N	0	\N	\N
cmgyrzuoe000j9bn92vxft79y	cmgyrzuo4000h9bn906tapny5	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 06:49:59.822	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-20 06:49:59.822	\N	0	\N	\N
cmfuyetxd000b9isabiizg5yh	cmfuyetx500099isac841d0t3	cmfgpmfbo000314ltz0jj7n1y	\N	2025-09-22 09:58:49.346	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-22 09:58:49.346	\N	0	\N	\N
cmfignsei000h8ulae75o0ijw	cmfignse8000f8ulax88ui5ce	cmfhqg9mg001k8y89kdji8pwn	\N	2025-09-13 16:08:40.074	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-13 16:08:40.074	\N	0	\N	\N
cmfjq47js000faz4ki8dkxr0b	cmfjq47jk000daz4kzzebykah	cmfgpklkn000114lt1n0ec61k	\N	2025-09-14 13:21:08.92	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-14 13:21:08.92	\N	0	\N	\N
cmfyqm0ao001i9isaj4ypa4c3	cmfyqm0ag001g9isas5eaxm5e	cmfgpklkn000114lt1n0ec61k	\N	2025-09-25 01:31:31.968	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-25 01:31:31.968	\N	0	\N	\N
cmfhq8bgx000l8y89w2378qg8	cmfhq8bgr000j8y89g2lakoac	cmfgpjvmb000014ltuwk3uwht	\N	2025-09-13 03:48:48.273	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-13 03:48:48.273	\N	0	\N	\N
cmfhqehye001h8y89c0go8r89	cmfhq8bgr000j8y89g2lakoac	cmfgplidl000214ltrltpgf6s	\N	2025-09-13 03:53:36.614	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-13 03:53:36.614	\N	0	\N	\N
cmfhqdu7p00158y89nnk00prr	cmfhq8bgr000j8y89g2lakoac	cmfgpmfbo000314ltz0jj7n1y	\N	2025-09-13 03:53:05.845	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-13 03:53:05.845	\N	0	\N	\N
cmfhqhw0a001v8y89gd3sa2ac	cmfhq8bgr000j8y89g2lakoac	cmfhqhbdo001p8y89uh5fot7e	\N	2025-09-13 03:56:14.794	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-13 03:56:14.794	\N	0	\N	\N
cmflzh4kj000324jjwl5eawd5	cmflzh4ka000124jjoxctvu86	cmfgpklkn000114lt1n0ec61k	\N	2025-09-16 03:18:40.484	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-16 03:18:40.484	\N	0	\N	\N
cmfzrsy4v000f2tw3will21au	cmfzrsy4l000d2tw3wt5whs5i	cmfgpklkn000114lt1n0ec61k	\N	2025-09-25 18:52:41.551	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-25 18:52:41.551	\N	0	\N	\N
cmfhq6xom000f8y89jolh4y1g	cmfhq6xoa000d8y89mv90gi3f	cmfgpjvmb000014ltuwk3uwht	\N	2025-09-13 03:47:43.75	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-13 03:47:43.75	\N	0	\N	\N
cmfjq2caw0003az4koxcv6pjz	cmfjq2cam0001az4knhimbwj3	cmfgpklkn000114lt1n0ec61k	\N	2025-09-14 13:19:41.768	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-14 13:19:41.768	\N	0	\N	\N
cmfhq6fnt00098y89xbj01yaa	cmfhq6fnn00078y89ear6ausw	cmfgpklkn000114lt1n0ec61k	\N	2025-09-13 03:47:20.393	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-13 03:47:20.393	\N	0	\N	\N
cmfyqnpy1001p9isaqslb31ie	cmfyqnpxt001n9isaa0gg32w9	cmfgpklkn000114lt1n0ec61k	\N	2025-09-25 01:32:51.865	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-25 01:32:51.865	\N	0	\N	\N
cmfzruq8n000j2tw3zfxq047q	cmfyqnpxt001n9isaa0gg32w9	cmfiilojw000ao5ubr1d3vfk0	\N	2025-09-25 18:54:04.631	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-25 18:54:04.631	\N	0	\N	\N
cmfuzf4dh000w9isaj9icu1ig	cmfuzf4db000u9isa9si4797a	cmfgpklkn000114lt1n0ec61k	\N	2025-09-22 10:27:02.502	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-22 10:27:02.502	\N	0	\N	\N
cmgh2myay000312etn1fpsm27	cmgh2myao000112etmu7ae4mr	cmfgpklkn000114lt1n0ec61k	\N	2025-10-07 21:28:02.602	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-07 21:28:02.602	\N	0	\N	\N
cmfzrhoec00092tw3reua925a	cmfzrhoe400072tw3d8te4hwn	cmfgpklkn000114lt1n0ec61k	\N	2025-09-25 18:43:55.717	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-25 18:43:55.717	\N	0	\N	\N
cmgysqm5y000g10ifnw1uo7m5	cmgysqm5q000e10if1qulap66	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 07:10:48.502	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 07:10:48.502	\N	0	\N	\N
cmgyt910v000m10ift02lqg68	cmgyt910l000k10ifchf3x13m	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 07:25:07.567	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 07:25:07.567	\N	0	\N	\N
cmgyu0ro7000s10iffbbdprnj	cmgyu0rnx000q10ifckfz0fv4	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 07:46:41.816	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 07:46:41.816	\N	0	\N	\N
cmgyu3ml0000y10ifcnzfccm1	cmgyu3mkr000w10if0j7gos9e	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 07:48:55.188	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 07:48:55.188	\N	0	\N	\N
cmgyu6zo0001410if4bwrunys	cmgyu6zns001210ifiq68mezu	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 07:51:32.113	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 07:51:32.113	\N	0	\N	\N
cmgyu8qm7001a10ifbrboruu3	cmgyu8qlz001810ifsjvti4yl	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 07:52:53.695	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 07:52:53.695	\N	0	\N	\N
cmgyu9zod001g10iff3zwqfnv	cmgyu9zo7001e10ifj7gokup4	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 07:53:52.093	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 07:53:52.093	\N	0	\N	\N
cmgyufj2u001m10ifn31aossx	cmgyufj2d001k10ifovdc1yac	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 07:58:10.518	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 07:58:10.518	\N	0	\N	\N
cmgyuhn85001s10ifywpw52zp	cmgyuhn7y001q10ifv32fixph	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 07:59:49.206	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 07:59:49.206	\N	0	\N	\N
cmgz2gtqc001y10if4385am7q	cmgz2gtq1001w10if2wo7moub	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 11:43:07.908	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 11:43:07.908	\N	0	\N	\N
cmgz2l63w002410ifyceqhwqg	cmgz2l63p002210ifbpsmgzw7	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 11:46:30.573	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 11:46:30.573	\N	0	\N	\N
cmgz2lyjn002a10ifpwkoo8v5	cmgz2lyjf002810ifzlybx56h	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 11:47:07.428	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 11:47:07.428	\N	0	\N	\N
cmgz2mxpk002g10if9dzlcl2b	cmgz2mxp9002e10ifqx7onf2w	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 11:47:53	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 11:47:53	\N	0	\N	\N
cmgz2pc72002m10if9n3gd719	cmgz2pc6s002k10if05p5690s	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 11:49:45.087	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 11:49:45.087	\N	0	\N	\N
cmgz2q4c5002s10iflqrsc8zk	cmgz2q4bu002q10ifkiylx1g8	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 11:50:21.557	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 11:50:21.557	\N	0	\N	\N
cmgz2rnsz002y10ifqfdwhy8g	cmgz2rnsu002w10ifclsmuos8	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 11:51:33.443	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 11:51:33.443	\N	0	\N	\N
cmgz32806003a10ifipsfffjc	cmgz327zv003810if0m30e0wf	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 11:59:46.182	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 11:59:46.182	\N	0	\N	\N
cmgz33puq003g10ifzt2tfddo	cmgz33pui003e10ifdaxnhcwx	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 12:00:55.97	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 12:00:55.97	\N	0	\N	\N
cmgz36twz003m10if9qo76dm1	cmgz36tws003k10if7443um5k	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 12:03:21.203	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 12:03:21.203	\N	0	\N	\N
cmgz421sy003s10if61moxb78	cmgz421sp003q10ifsz2qmse0	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 12:27:37.762	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 12:27:37.762	\N	0	\N	\N
cmgz45k94003y10ifvhystfj7	cmgz45k8u003w10if5308muwm	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 12:30:21.64	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 12:30:21.64	\N	0	\N	\N
cmgz52wti004410ifrm0ort5n	cmgz52wt9004210if9wf0oagd	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 12:56:17.574	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 12:56:17.574	\N	0	\N	\N
cmgz54f0c004a10iflq5uwfu4	cmgz54f06004810ifuzvs81w4	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 12:57:27.804	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 12:57:27.804	\N	0	\N	\N
cmgz8hb3n004g10if1d0cnqkt	cmgz8hb3e004e10ifta3qet69	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 14:31:28.115	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 14:31:28.115	\N	0	\N	\N
cmgz99pq8004m10if71x503z6	cmgz99ppu004k10ifwslc7mda	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 14:53:33.44	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 14:53:33.44	\N	0	\N	\N
cmgz9b2uk004s10if85dayv6p	cmgz9b2ub004q10ifldpderts	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 14:54:37.1	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 14:54:37.1	\N	0	\N	\N
cmgzaye2m004y10if494tansw	cmgzaye2b004w10ifgfhevaf9	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 15:40:44.35	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 15:40:44.35	\N	0	\N	\N
cmgzbxzf9005a10ifwn912zw6	cmgzbxzf3005810iflzgnthyp	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 16:08:24.982	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 16:08:24.982	\N	0	\N	\N
cmgzc2iah00035zrtwak740u0	cmgzc2ia700015zrt2ox3ww04	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 16:11:56.057	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 16:11:56.057	\N	0	\N	\N
cmgzc31i200095zrtdp0sitl3	cmgzc31hq00075zrtz4yyml52	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 16:12:20.955	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 16:12:20.955	\N	0	\N	\N
cmgzc436h000f5zrtgz48b9j3	cmgzc436b000d5zrtl3usz8tv	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 16:13:09.786	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-20 16:13:09.786	\N	0	\N	\N
cmh5rdwj8000bd3m0ao1m0gog	cmh5rdwj10009d3m0h66bgxk3	cmh4rbv470000d3m0tokxkudd	\N	2025-10-25 04:07:19.029	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-25 04:07:19.029	\N	0	\N	\N
cmh66fdaa000nd3m04lp8h5f5	cmh66fda1000ld3m0ehv07ao3	cmh4rbv470000d3m0tokxkudd	\N	2025-10-25 11:08:21.634	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-25 11:08:21.634	\N	0	\N	\N
cmh86b579000de17rzo6ba122	cmh86b571000be17r2t331nab	cmh4rbv470000d3m0tokxkudd	\N	2025-10-26 20:40:36.885	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-26 20:40:36.885	\N	0	\N	\N
cmh9dnrow0009n9utshlwaw4p	cmh9dnrom0007n9uty3268apu	cmfgpklkn000114lt1n0ec61k	\N	2025-10-27 16:54:09.392	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-27 16:54:09.392	\N	0	\N	\N
cmh9wddow000hn9ut2p85cjme	cmh9wddoo000fn9uttdaok57f	cmfgpklkn000114lt1n0ec61k	\N	2025-10-28 01:37:57.392	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-28 01:37:57.392	\N	0	\N	\N
cmha0tais000tn9utyeadp40h	cmha0taik000rn9utist2byqj	cmfgpklkn000114lt1n0ec61k	\N	2025-10-28 03:42:18.244	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-28 03:42:18.244	\N	0	\N	\N
cmha76haa000zn9utz49ffabt	cmha76h9v000xn9utzxu5dikm	cmfgpklkn000114lt1n0ec61k	\N	2025-10-28 06:40:31.234	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-28 06:40:31.234	\N	0	\N	\N
cmh66gffb000rd3m0dl8gs1de	cmgz2t7ng003210ifn0txseqw	cmh4rbv470000d3m0tokxkudd	\N	2025-10-25 11:09:11.063	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-25 11:09:11.063	\N	0	\N	\N
cmh82pxeg0003e17r6f6nhyat	cmh82pxe60001e17r153xo76x	cmh4rbv470000d3m0tokxkudd	\N	2025-10-26 19:00:08.152	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-26 19:00:08.152	\N	0	\N	\N
cmha8gaik0007117u21hdywfb	cmh7d62rh0013d3m0dz4vmtub	cmfgpklkn000114lt1n0ec61k	\N	2025-10-28 07:16:08.636	f	\N	\N	\N	\N	0	1	FAILURE	t	2025-10-28 07:16:08.636	\N	0	\N	\N
cmh7d62rq0015d3m0mtxvhv4v	cmh7d62rh0013d3m0dz4vmtub	cmh4rbv470000d3m0tokxkudd	\N	2025-10-26 07:04:51.59	f	\N	\N	\N	\N	1	0	FAILURE	t	2025-10-26 07:04:51.59	\N	0	\N	\N
cmha8evow0003117uibw4rgwo	cmha8evok0001117uv95wftcx	cmfgpklkn000114lt1n0ec61k	\N	2025-10-28 07:15:02.768	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-28 07:15:02.768	\N	0	\N	\N
cmha8n0pc000i117ujdl631ng	cmha8evok0001117uv95wftcx	cmh36n1zs0005td07t6m368m7	\N	2025-10-28 07:21:22.513	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-28 07:21:22.513	\N	0	\N	\N
cmh5rd8cl0003d3m0esn8f3n1	cmgyrzuo4000h9bn906tapny5	cmh4rbv470000d3m0tokxkudd	\N	2025-10-25 04:06:47.685	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-25 04:06:47.685	\N	0	\N	\N
cmgzbxdo9005410ifw12y6y77	cmgzbxdny005210ifvm38tk4a	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 16:07:56.793	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-20 16:07:56.793	\N	0	\N	\N
cmh60l9aa000fd3m0gwzj4iah	cmgzbxdny005210ifvm38tk4a	cmh4rbv470000d3m0tokxkudd	\N	2025-10-25 08:24:58.69	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-25 08:24:58.69	\N	0	\N	\N
cmha0rtnw000nn9utlkagiewi	cmha0rtnl000ln9uthxseclb3	cmfgpklkn000114lt1n0ec61k	\N	2025-10-28 03:41:09.74	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-28 03:41:09.74	\N	0	\N	\N
cmhci1v7g000gdc0nbcfl276l	cmhci1v74000edc0nlz6tyy47	cmhcegfin0006hcgendh83z40	\N	2025-10-29 21:20:24.124	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-29 21:20:24.124	\N	0	\N	\N
cmhci7ota000mdc0nmctbsihz	cmhci7ot2000kdc0nil8v6lky	cmhcegfin0006hcgendh83z40	\N	2025-10-29 21:24:55.774	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-29 21:24:55.774	\N	0	\N	\N
cmhckkj2p0003pjiaf7zmo942	cmhckkj2d0001pjiage8t8bw9	cmhcegfin0006hcgendh83z40	\N	2025-10-29 22:30:54.097	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-29 22:30:54.097	\N	0	\N	\N
cmhcnts3d00096na90fj8hndv	cmhcnts3100076na9xzhtvjoq	cmhcegfin0006hcgendh83z40	\N	2025-10-30 00:02:04.538	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-30 00:02:04.538	\N	0	\N	\N
cmhcsdwm9000f6na9d7t8ic87	cmhcsdwlz000d6na9zmwptwvz	cmhcegfin0006hcgendh83z40	\N	2025-10-30 02:09:41.985	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-30 02:09:41.985	\N	0	\N	\N
cmhcub07300038iy4to00xm21	cmhcub06t00018iy4nns519qb	cmhcegfin0006hcgendh83z40	\N	2025-10-30 03:03:25.887	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-30 03:03:25.887	\N	0	\N	\N
cmhdb0swl0003r5aepya8zane	cmhdb0swc0001r5ae3y4j3ryy	cmhcegfin0006hcgendh83z40	\N	2025-10-30 10:51:23.349	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-30 10:51:23.349	\N	0	\N	\N
cmhdb2fsg0009r5aei4mgtf4e	cmhdb2fs50007r5aefv8tho9a	cmhcegfin0006hcgendh83z40	\N	2025-10-30 10:52:39.664	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-30 10:52:39.664	\N	0	\N	\N
cmhdbjtv7000dr5aewmd5u674	cmhdb0swc0001r5ae3y4j3ryy	cmh36n1zs0005td07t6m368m7	\N	2025-10-30 11:06:11.059	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-30 11:06:11.059	\N	0	\N	\N
cmhdcgmpr0003wj8xjuk6haq8	cmhdcgmph0001wj8x3x7ttlxk	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-30 11:31:41.439	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-30 11:31:41.439	\N	0	\N	\N
cmhdckd8b0007wj8xdxss3svx	cmhdb0swc0001r5ae3y4j3ryy	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-30 11:34:35.771	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-30 11:34:35.771	\N	0	\N	\N
cmhdo4gco00037oozmfvcpsq3	cmhdo4gc900017ooz7mmxu546	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-30 16:58:08.712	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-30 16:58:08.712	\N	0	\N	\N
cmhdo67r600097oozd9r7lr4o	cmhdo67qz00077oozsrib186w	cmhcegfin0006hcgendh83z40	\N	2025-10-30 16:59:30.883	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-30 16:59:30.883	\N	0	\N	\N
cmhds5ddt000310bhw5xxx6gh	cmhds5ddj000110bh5amv3bsw	cmhcegfin0006hcgendh83z40	\N	2025-10-30 18:50:49.985	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-30 18:50:49.985	\N	0	\N	\N
cmhds6llv000910bhqer7g8e1	cmhds6lll000710bhvhz72ti2	cmhcegfin0006hcgendh83z40	\N	2025-10-30 18:51:47.299	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-30 18:51:47.299	\N	0	\N	\N
cmhds7oer000f10bhftfr6jsu	cmhds7oeg000d10bhrsje0d4b	cmhcegfin0006hcgendh83z40	\N	2025-10-30 18:52:37.588	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-30 18:52:37.588	\N	0	\N	\N
cmhdwufzw0003b33naegij8g8	cmhdwufzn0001b33ng0vfu8nd	cmhcegfin0006hcgendh83z40	\N	2025-10-30 21:02:18.236	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-30 21:02:18.236	\N	0	\N	\N
cmhdxh37u0003u32ltb2ea8mq	cmhdxh37l0001u32lgwen3s2b	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-30 21:19:54.763	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-30 21:19:54.763	\N	0	\N	\N
cmhdxib9p0009u32lvm507d58	cmhdxib9i0007u32lodrkafr8	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-30 21:20:51.854	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-30 21:20:51.854	\N	0	\N	\N
cmhdygygz0003ugqx1gcqslul	cmhdygygo0001ugqx6wmxh80d	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-30 21:47:48.227	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-30 21:47:48.227	\N	0	\N	\N
cmhegsudg0003bpixr655eb7e	cmhegsud40001bpixkubxsi7e	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-31 06:20:55.876	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 06:20:55.876	\N	0	\N	\N
cmhegv6d10009bpixlpow2on8	cmhegv6ct0007bpixtw8bxwnw	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-31 06:22:44.726	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 06:22:44.726	\N	0	\N	\N
cmhegwm2y000fbpixonwiyyzp	cmhegwm2p000dbpix7tgjeihp	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-31 06:23:51.754	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 06:23:51.754	\N	0	\N	\N
cmhegy79x000lbpixpftgjiux	cmhegy79n000jbpixn9ramn8p	cmfgpjvmb000014ltuwk3uwht	\N	2025-10-31 06:25:05.877	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 06:25:05.877	\N	0	\N	\N
cmhegz31z000xbpixg2qm8qhc	cmhegz31t000vbpixtae9lu0t	cmfgpjvmb000014ltuwk3uwht	\N	2025-10-31 06:25:47.064	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 06:25:47.064	\N	0	\N	\N
cmhf38hzt0003129pgt6pydt5	cmhf38hzh0001129pbj4rlnj9	cmfgpjvmb000014ltuwk3uwht	\N	2025-10-31 16:48:57.881	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 16:48:57.881	\N	0	\N	\N
cmhf7a0w80003wnlzyl1zyxzd	cmhf7a0vx0001wnlzsjipiz38	cmhcc8p1o000atqgxpzkeao00	\N	2025-10-31 18:42:07.496	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 18:42:07.496	\N	0	\N	\N
cmhf7gu4j0009wnlzokku2b17	cmhf7gu490007wnlzy17hvjyw	cmhcc8p1o000atqgxpzkeao00	\N	2025-10-31 18:47:25.315	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 18:47:25.315	\N	0	\N	\N
cmhf7pzmg0003140lp3x5r9sq	cmhf7pzm60001140lt8s1sbs1	cmhcc8p1o000atqgxpzkeao00	\N	2025-10-31 18:54:32.344	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 18:54:32.344	\N	0	\N	\N
cmhf8g1ut0009140lemvwivhu	cmhf8g1uj0007140l9bjhf2ip	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-31 19:14:48.293	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 19:14:48.293	\N	0	\N	\N
cmhf8grsm000f140lxwq3gtpi	cmhf8grsc000d140lf31hftbn	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-31 19:15:21.91	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 19:15:21.91	\N	0	\N	\N
cmhf8k1sy000l140lc7h2sb98	cmhf8k1sn000j140le95g1eps	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-31 19:17:54.85	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 19:17:54.85	\N	0	\N	\N
cmhf8lj7p000r140l46wbu3vf	cmhf8lj7e000p140lj8vn75re	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-31 19:19:04.069	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 19:19:04.069	\N	0	\N	\N
cmhf9df3x000x140lsmdxo453	cmhf9df3o000v140l9gorkotg	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-31 19:40:45.117	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 19:40:45.117	\N	0	\N	\N
cmhf9l4r90013140lguvvwvzh	cmhf9l4qy0011140lgxgfurcb	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-31 19:46:44.949	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 19:46:44.949	\N	0	\N	\N
cmhf9rrlg0003acecj4e7mm7j	cmhf9rrl40001acecs3u08zlu	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-31 19:51:54.485	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 19:51:54.485	\N	0	\N	\N
cmhfa7re10009acecgmgrov1t	cmhfa7rdp0007acecu7qw2dav	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-31 20:04:20.714	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 20:04:20.714	\N	0	\N	\N
cmhfa95m3000facecwvhtwkb3	cmhfa95ls000dacec1d11yjtl	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-31 20:05:25.803	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 20:05:25.803	\N	0	\N	\N
cmhcfq24f0008dc0naq9x300v	cmhcefdvh0001hcgeng4yry82	cmfgpklkn000114lt1n0ec61k	\N	2025-10-29 20:15:13.983	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-29 20:15:13.983	\N	0	\N	\N
cmhcefdvp0003hcgemdpl4hx8	cmhcefdvh0001hcgeng4yry82	cmhcc8p1o000atqgxpzkeao00	\N	2025-10-29 19:38:56.389	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-29 19:38:56.389	\N	0	\N	\N
cmhcfl6wo0003dc0n4ophp10x	cmhcefdvh0001hcgeng4yry82	cmhcegfin0006hcgendh83z40	\N	2025-10-29 20:11:26.904	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-29 20:11:26.904	\N	0	\N	\N
cmhcuehls00078iy4421jvg6p	cmhcngomk00016na98db1vqr5	cmh4rbv470000d3m0tokxkudd	\N	2025-10-30 03:06:08.416	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-30 03:06:08.416	\N	0	\N	\N
cmhcngomt00036na9c0ot5vee	cmhcngomk00016na98db1vqr5	cmhcegfin0006hcgendh83z40	\N	2025-10-29 23:51:53.525	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-29 23:51:53.525	\N	0	\N	\N
cmha8nr6o000s117uysqahpln	cmha0rtnl000ln9uthxseclb3	cmh36n1zs0005td07t6m368m7	\N	2025-10-28 07:21:56.833	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-28 07:21:56.833	\N	0	\N	\N
cmhcc03ev0007tqgxqaepeb8w	cmhcbwt110001tqgxj3frn3i8	cmh4rbv470000d3m0tokxkudd	\N	2025-10-29 18:31:03.751	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-29 18:31:03.751	\N	0	\N	\N
cmhcbwt1a0003tqgxhcdr6yku	cmhcbwt110001tqgxj3frn3i8	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-29 18:28:30.335	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-29 18:28:30.335	\N	0	\N	\N
cmhawk2900007xe90yh6feea3	cmhawi4tt0001xe90c0e883k6	cmfgpklkn000114lt1n0ec61k	\N	2025-10-28 18:30:55.332	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-28 18:30:55.332	\N	0	\N	\N
cmhawi4u20003xe90sevarcix	cmhawi4tt0001xe90c0e883k6	cmh36n1zs0005td07t6m368m7	\N	2025-10-28 18:29:25.37	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-28 18:29:25.37	\N	0	\N	\N
cmhfd0cc30003f1ptphtmgeb7	cmhfd0cbr0001f1ptfa6gah8o	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-31 21:22:33.459	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 21:22:33.459	\N	0	\N	\N
cmhfd2p6w0009f1pt93k1hej5	cmhfd2p6o0007f1ptydstmfcl	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-31 21:24:23.432	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 21:24:23.432	\N	0	\N	\N
cmhffqc9w000ff1pt3swalyfz	cmhffqc9m000df1ptu5pjnr1m	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-10-31 22:38:45.668	f	\N	\N	\N	\N	0	0	PENDING	f	2025-10-31 22:38:45.668	\N	0	\N	\N
cmhga25o8000313ttt7mugee7	cmhga25nx000113ttuzu9uc2y	cmfgpklkn000114lt1n0ec61k	\N	2025-11-01 12:47:45.464	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-01 12:47:45.464	\N	0	\N	\N
cmhga3fqw000713ttc99rkvuh	cmhga25nx000113ttuzu9uc2y	cmhcegfin0006hcgendh83z40	\N	2025-11-01 12:48:45.176	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-01 12:48:45.176	\N	0	\N	\N
cmhgjibd0000x66n3m405d25g	cmhgjibcq000v66n3freb84lj	cmfiilojw000ao5ubr1d3vfk0	\N	2025-11-01 17:12:15.876	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-01 17:12:15.876	\N	0	\N	\N
cmhgov9uv0003rhx7mdi2dlzg	cmhgov9uk0001rhx7d91va8vs	cmfgpklkn000114lt1n0ec61k	\N	2025-11-01 19:42:18.535	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-01 19:42:18.535	\N	0	\N	\N
cmhgoxiv10009rhx73nzf79q5	cmhgoxiur0007rhx7cis5629u	cmfgpklkn000114lt1n0ec61k	\N	2025-11-01 19:44:03.517	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-01 19:44:03.517	\N	0	\N	\N
cmhgoz5vn000frhx74v1h6rfa	cmhgoz5vf000drhx7zaev4o3v	cmfgpklkn000114lt1n0ec61k	\N	2025-11-01 19:45:20.003	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-01 19:45:20.003	\N	0	\N	\N
cmhgt4mtk000lrhx7s8s699n4	cmhgt4mta000jrhx7801hzo66	cmhcc8p1o000atqgxpzkeao00	\N	2025-11-01 21:41:33.704	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-01 21:41:33.704	\N	0	\N	\N
cmhgt84kj000rrhx7s5afi4pr	cmhgt84k9000prhx7kx9ic6i2	cmhcc8p1o000atqgxpzkeao00	\N	2025-11-01 21:44:16.676	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-01 21:44:16.676	\N	0	\N	\N
cmhgta0pk000xrhx719oa4mta	cmhgta0p2000vrhx7rd7ua5rs	cmhcc8p1o000atqgxpzkeao00	\N	2025-11-01 21:45:44.984	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-01 21:45:44.984	\N	0	\N	\N
cmhguu6350003lrbswjxp2ca5	cmhguu62v0001lrbs74qsptsm	cmh36n1zs0005td07t6m368m7	\N	2025-11-01 22:29:24.69	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-01 22:29:24.69	\N	0	\N	\N
cmhh59z490003uuz5usz9sk4t	cmhh59z3y0001uuz5fhws6qwt	cmfgpklkn000114lt1n0ec61k	\N	2025-11-02 03:21:38.313	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-02 03:21:38.313	\N	0	\N	\N
cmhh5bhza0009uuz5lz6lat9q	cmhh5bhyy0007uuz5w9bd7s15	cmgxzbcqh0000hak2a2jt0wwa	\N	2025-11-02 03:22:49.414	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-02 03:22:49.414	\N	0	\N	\N
cmhhqix9n0003w6fyzhldfd0q	cmhhqix9e0001w6fykpt2b6f6	cmhcc8p1o000atqgxpzkeao00	\N	2025-11-02 13:16:27.755	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-02 13:16:27.755	\N	0	\N	\N
cmhhuez2a000g5er4m94y42qo	cmhhuez21000e5er4yaqx03wn	cmfgpklkn000114lt1n0ec61k	\N	2025-11-02 15:05:21.922	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-02 15:05:21.922	\N	0	\N	\N
cmhjvs7pg000h9i0q9fniwg4b	cmhjvs7p8000f9i0qetbysww4	cmhcegfin0006hcgendh83z40	\N	2025-11-04 01:19:11.62	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-04 01:19:11.62	\N	0	\N	\N
cmhjh2b8u000h117ajz9e4dg9	cmhjh2b8f000f117a9xkmo4nx	cmhcegfin0006hcgendh83z40	\N	2025-11-03 18:27:08.526	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-03 18:27:08.526	\N	0	\N	\N
cmhig5nmd0009141v7crxdnf3	cmhig5a250003141vy1jnjkhu	cmfgpklkn000114lt1n0ec61k	\N	2025-11-03 01:13:58.741	f	\N	\N	\N	\N	2	2	FAILURE	t	2025-11-03 01:13:58.741	\N	0	\N	\N
cmhigz2jp0021141vxqhmkyy0	cmhigz2jf001z141v5012hxhq	cmh36n1zs0005td07t6m368m7	\N	2025-11-03 01:36:51.109	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-03 01:36:51.109	\N	0	\N	\N
cmhiljamt00031lqootbqtkqw	cmhiljamh00011lqo3ytmay2u	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-11-03 03:44:33.174	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-03 03:44:33.174	\N	0	\N	\N
cmhilwnsh000p1lqoc2ihqryb	cmhilwns7000n1lqo98yhab6d	cmfgpklkn000114lt1n0ec61k	\N	2025-11-03 03:54:56.753	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-03 03:54:56.753	\N	0	\N	\N
cmhioyy9l001f1lqoptwznsnw	cmhioyy9e001d1lqo18tjeok0	cmfgpklkn000114lt1n0ec61k	\N	2025-11-03 05:20:42.489	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-03 05:20:42.489	\N	0	\N	\N
cmhjyd14b0003ch4vi83wgkey	cmhjyd13y0001ch4vxd2urp0e	cmhcegfin0006hcgendh83z40	\N	2025-11-04 02:31:22.091	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-04 02:31:22.091	\N	0	\N	\N
cmhjhcqk6000p117arpa8ncu7	cmhjhcqjv000n117a9w8ktzly	cmhcegfin0006hcgendh83z40	\N	2025-11-03 18:35:14.935	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-03 18:35:14.935	\N	0	\N	\N
cmhl1rk3d000jqg342t239y0b	cmhl1rk30000hqg34pw4lht4v	cmhcegfin0006hcgendh83z40	\N	2025-11-04 20:54:24.889	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-04 20:54:24.889	\N	0	\N	\N
cmhmaeqrv0009lrhr2h5e6gyf	cmhmaeqrm0007lrhrg653ddrs	cmfgpklkn000114lt1n0ec61k	\N	2025-11-05 17:44:09.739	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-05 17:44:09.739	\N	0	\N	\N
cmhl7f7mw000e72sthzj0aeoo	cmhl7estf000172ste4gw6ufs	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-11-04 23:32:46.569	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-04 23:32:46.569	\N	0	\N	\N
cmhl7fh1z000k72stv96u8en0	cmhl7estf000172ste4gw6ufs	cmh36n1zs0005td07t6m368m7	\N	2025-11-04 23:32:58.776	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-04 23:32:58.776	\N	0	\N	\N
cmhl7fqk2000q72stnv1hcf6g	cmhl7estf000172ste4gw6ufs	cmgxzbcqh0000hak2a2jt0wwa	\N	2025-11-04 23:33:11.091	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-04 23:33:11.091	\N	0	\N	\N
cmhlq17op003e3fyjubg8gzvd	cmhlq17og003c3fyj8h5z28xz	cmhcegfin0006hcgendh83z40	\N	2025-11-05 08:13:46.153	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-05 08:13:46.153	\N	0	\N	\N
cmhl7fz85000w72st3k9rmg37	cmhl7estf000172ste4gw6ufs	cmfiilojw000ao5ubr1d3vfk0	\N	2025-11-04 23:33:22.325	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-04 23:33:22.325	\N	0	\N	\N
cmhl7hcru001c72stw0f9a4uc	cmhl7estf000172ste4gw6ufs	cmhcegfin0006hcgendh83z40	\N	2025-11-04 23:34:26.539	f	\N	\N	\N	\N	0	1	FAILURE	t	2025-11-04 23:34:26.539	\N	0	\N	\N
cmhl7estp000372strv7n1ful	cmhl7estf000172ste4gw6ufs	cmfgpklkn000114lt1n0ec61k	\N	2025-11-04 23:32:27.374	f	\N	\N	\N	\N	1	0	FAILURE	t	2025-11-04 23:32:27.374	\N	0	\N	\N
cmhlccyqj0016hru4zpgcs9g7	cmhlccyqa0014hru4yzzp5owk	cmh36n1zs0005td07t6m368m7	\N	2025-11-05 01:50:59.804	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-05 01:50:59.804	\N	0	\N	\N
cmhll5bdq000j3fyj69hw6dg9	cmhll5bdg000h3fyj3z9xvcfw	cmh36n1zs0005td07t6m368m7	\N	2025-11-05 05:56:59.486	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-05 05:56:59.486	\N	0	\N	\N
cmhlkwxdu00073fyjuxwgmn94	cmhlkweq000013fyjouplwznl	cmhcc8p1o000atqgxpzkeao00	\N	2025-11-05 05:50:28.099	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 05:50:28.099	\N	0	\N	\N
cmhl1leaj0007qg341m52gwhh	cmhl1l1e10001qg34m9nbge0i	cmfgpklkn000114lt1n0ec61k	\N	2025-11-04 20:49:37.435	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-04 20:49:37.435	\N	0	\N	\N
cmhl1l1ed0003qg346fur9819	cmhl1l1e10001qg34m9nbge0i	cmhcegfin0006hcgendh83z40	\N	2025-11-04 20:49:20.725	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-04 20:49:20.725	\N	0	\N	\N
cmhl2cns4001yqg34jtxvfref	cmhl2btuq001mqg348jq0sk3v	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-11-04 21:10:49.445	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-04 21:10:49.445	\N	0	\N	\N
cmhilxfe3000v1lqo2qbudctn	cmhilxfdx000t1lqotcq44kxe	cmfgpklkn000114lt1n0ec61k	\N	2025-11-03 03:55:32.524	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-03 03:55:32.524	\N	0	\N	\N
cmhily11g000z1lqos56p25dc	cmhilxfdx000t1lqotcq44kxe	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-11-03 03:56:00.58	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-03 03:56:00.58	\N	0	\N	\N
cmhlpzjr900343fyj9gbnl18o	cmhlpyzw3002y3fyjy4vg3c83	cmh36n1zs0005td07t6m368m7	\N	2025-11-05 08:12:28.485	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 08:12:28.485	\N	0	\N	\N
cmhlc414b000phru4zcqrrdap	cmhlc4142000nhru4cnixqecy	cmh36n1zs0005td07t6m368m7	\N	2025-11-05 01:44:02.987	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 01:44:02.987	\N	0	\N	\N
cmhlc4dn9000thru411ibyq6j	cmhlc4142000nhru4cnixqecy	cmhcegfin0006hcgendh83z40	\N	2025-11-05 01:44:19.221	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 01:44:19.221	\N	0	\N	\N
cmhilmac700091lqoblgw35p1	cmhilmabz00071lqopqqkiukc	cmhcc8p1o000atqgxpzkeao00	\N	2025-11-03 03:46:52.759	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-03 03:46:52.759	\N	0	\N	\N
cmhilmxbb000d1lqo2kjrld5e	cmhilmabz00071lqopqqkiukc	cmhcegfin0006hcgendh83z40	\N	2025-11-03 03:47:22.535	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-03 03:47:22.535	\N	0	\N	\N
cmhllhvux00173fyj2pqhxnnq	cmhllhvuo00153fyj7ja4ix5h	cmh36n1zs0005td07t6m368m7	\N	2025-11-05 06:06:45.897	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-05 06:06:45.897	\N	0	\N	\N
cmhlr4wvy0003wmw3vgbzyo0a	cmhlr4wvo0001wmw3757svafo	cmhcegfin0006hcgendh83z40	\N	2025-11-05 08:44:38.398	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-05 08:44:38.398	\N	0	\N	\N
cmhllybka00203fyjr6sq061b	cmhllybk0001y3fyj4uqheq07	cmfhsxf490000lmmnwp77vl6x	\N	2025-11-05 06:19:32.746	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-05 06:19:32.746	\N	0	\N	\N
cmhm81sp2000jxx9rq9jprisb	cmhm81sot000hxx9rte0dloku	cmfgpklkn000114lt1n0ec61k	\N	2025-11-05 16:38:06.47	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-05 16:38:06.47	\N	0	\N	\N
cmhm9a14n000qxx9rfvl6eu7z	cmhm9a14e000oxx9r09t1fl2e	cmfgpklkn000114lt1n0ec61k	\N	2025-11-05 17:12:30.263	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-05 17:12:30.263	\N	0	\N	\N
cmhma8m700003lrhr2awipq58	cmhma8m6q0001lrhroynygux4	cmfgpklkn000114lt1n0ec61k	\N	2025-11-05 17:39:23.868	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-05 17:39:23.868	\N	0	\N	\N
cmhiozkic001j1lqou0qej1fe	cmhioy1cc00171lqofc2l8wzh	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-11-03 05:21:11.316	f	\N	\N	\N	\N	0	0	PENDING	t	2025-11-03 05:21:11.316	\N	0	\N	\N
cmhioy1cn00191lqoiarhtflw	cmhioy1cc00171lqofc2l8wzh	cmfgpklkn000114lt1n0ec61k	\N	2025-11-03 05:19:59.831	f	\N	\N	\N	\N	0	0	PENDING	t	2025-11-03 05:19:59.831	\N	0	\N	\N
cmhig5a2g0005141v8tpv4fwu	cmhig5a250003141vy1jnjkhu	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-11-03 01:13:41.176	f	\N	\N	\N	\N	0	0	PENDING	t	2025-11-03 01:13:41.176	\N	0	\N	\N
cmhig62sn000f141v5bjjm0ea	cmhig5a250003141vy1jnjkhu	cmh36n1zs0005td07t6m368m7	\N	2025-11-03 01:14:18.408	f	\N	\N	\N	\N	0	0	PENDING	t	2025-11-03 01:14:18.408	\N	0	\N	\N
cmhigzpn40025141v5u1w1cfj	cmhigz2jf001z141v5012hxhq	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-11-03 01:37:21.04	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-03 01:37:21.04	\N	0	\N	\N
cmhjwh21c001d9i0qdzcftssh	cmhjwgmd300179i0qimtlfz3o	cmh36n1zs0005td07t6m368m7	\N	2025-11-04 01:38:30.672	f	\N	\N	\N	\N	0	0	PENDING	t	2025-11-04 01:38:30.672	\N	0	\N	\N
cmhjwgmdg00199i0qtfvogmf4	cmhjwgmd300179i0qimtlfz3o	cmhcegfin0006hcgendh83z40	\N	2025-11-04 01:38:10.372	f	\N	\N	\N	\N	0	0	PENDING	t	2025-11-04 01:38:10.372	\N	0	\N	\N
cmhk7akyt000xp1dnu5luv22o	cmhk7abeh000rp1dn46fy94jn	cmfgpklkn000114lt1n0ec61k	\N	2025-11-04 06:41:24.389	f	\N	\N	\N	\N	0	0	PENDING	t	2025-11-04 06:41:24.389	\N	0	\N	\N
cmhjiw7kx0007c344pixpnb8g	cmhjiptsm0001c3444oz0v7qf	cmhcegfin0006hcgendh83z40	\N	2025-11-03 19:18:23.073	f	\N	\N	\N	\N	0	0	PENDING	t	2025-11-03 19:18:23.073	\N	0	\N	\N
cmhjiptsx0003c344xjogbgej	cmhjiptsm0001c3444oz0v7qf	cmfgpklkn000114lt1n0ec61k	\N	2025-11-03 19:13:25.281	f	\N	\N	\N	\N	0	0	PENDING	t	2025-11-03 19:13:25.281	\N	0	\N	\N
cmhk7abes000tp1dn01l1op2g	cmhk7abeh000rp1dn46fy94jn	cmhcegfin0006hcgendh83z40	\N	2025-11-04 06:41:12.004	f	\N	\N	\N	\N	0	0	PENDING	t	2025-11-04 06:41:12.004	\N	0	\N	\N
cmhm7rhjq0003xx9rq4joicds	cmhm7rhjg0001xx9r4hvuxlhx	cmhcegfin0006hcgendh83z40	\N	2025-11-05 16:30:05.462	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 16:30:05.462	\N	0	\N	\N
cmhm7rvws0007xx9ra10ytd1s	cmhm7rhjg0001xx9r4hvuxlhx	cmfgpklkn000114lt1n0ec61k	\N	2025-11-05 16:30:24.077	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 16:30:24.077	\N	0	\N	\N
cmhjgzgqb0003117ag6s42dgr	cmhjgzgq20001117aa962fuhz	cmfgpklkn000114lt1n0ec61k	\N	2025-11-03 18:24:55.667	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-03 18:24:55.667	\N	0	\N	\N
cmhl9kbic002972stgoq1o30k	cmhl9juw3001x72st1a9aci7j	cmfiilojw000ao5ubr1d3vfk0	\N	2025-11-05 00:32:44.1	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 00:32:44.1	\N	0	\N	\N
cmhl9k2k7002372st7khucdk6	cmhl9juw3001x72st1a9aci7j	cmgxdqce80000108q18y4npo0	\N	2025-11-05 00:32:32.504	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 00:32:32.504	\N	0	\N	\N
cmhl9juwd001z72stx1gvpfuy	cmhl9juw3001x72st1a9aci7j	cmhcegfin0006hcgendh83z40	\N	2025-11-05 00:32:22.573	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 00:32:22.573	\N	0	\N	\N
cmhlkweqa00033fyj6cqqb7ia	cmhlkweq000013fyjouplwznl	cmh36n1zs0005td07t6m368m7	\N	2025-11-05 05:50:03.923	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 05:50:03.923	\N	0	\N	\N
cmhll9iud000p3fyjra7qtmy9	cmhll9iu1000n3fyjb4itb587	cmh36n1zs0005td07t6m368m7	\N	2025-11-05 06:00:15.781	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 06:00:15.781	\N	0	\N	\N
cmhll9wmx000t3fyjdqrhzhu1	cmhll9iu1000n3fyjb4itb587	cmhcegfin0006hcgendh83z40	\N	2025-11-05 06:00:33.657	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 06:00:33.657	\N	0	\N	\N
cmhlr97vw000dwmw3cxncrgof	cmhlr6bcx0007wmw3merpt6qo	cmh36n1zs0005td07t6m368m7	\N	2025-11-05 08:47:59.276	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 08:47:59.276	\N	0	\N	\N
cmhlr6bda0009wmw3jmx4dcot	cmhlr6bcx0007wmw3merpt6qo	cmhcegfin0006hcgendh83z40	\N	2025-11-05 08:45:43.822	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 08:45:43.822	\N	0	\N	\N
cmhipj6f3002f1lqoiikw2fyd	cmhipj6ev002d1lqogsziidg6	cmfgpklkn000114lt1n0ec61k	\N	2025-11-03 05:36:26.176	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-03 05:36:26.176	\N	0	\N	\N
cmhipjqgu002j1lqomcve69c2	cmhipj6ev002d1lqogsziidg6	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-11-03 05:36:52.158	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-03 05:36:52.158	\N	0	\N	\N
cmhjvpyjg00079i0qarmh5m03	cmhjvpkrz00019i0qdft4463a	cmgxdqce80000108q18y4npo0	\N	2025-11-04 01:17:26.428	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-04 01:17:26.428	\N	0	\N	\N
cmhjvpksj00039i0qic6vp4tw	cmhjvpkrz00019i0qdft4463a	cmhcegfin0006hcgendh83z40	\N	2025-11-04 01:17:08.612	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-04 01:17:08.612	\N	0	\N	\N
cmhl2c9y9001sqg34ti26at59	cmhl2btuq001mqg348jq0sk3v	cmfgpklkn000114lt1n0ec61k	\N	2025-11-04 21:10:31.521	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-04 21:10:31.521	\N	0	\N	\N
cmhl2btv4001oqg34fe4altey	cmhl2btuq001mqg348jq0sk3v	cmhcegfin0006hcgendh83z40	\N	2025-11-04 21:10:10.672	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-04 21:10:10.672	\N	0	\N	\N
cmhlabhib003r72stpailjw2s	cmhlabhi0003p72stcmydpbw1	cmfgpklkn000114lt1n0ec61k	\N	2025-11-05 00:53:51.587	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 00:53:51.587	\N	0	\N	\N
cmhlabrnj003v72st3v2om1ai	cmhlabhi0003p72stcmydpbw1	cmhcegfin0006hcgendh83z40	\N	2025-11-05 00:54:04.735	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 00:54:04.735	\N	0	\N	\N
cmhlbo14i004c72stasj8lmiy	cmhlbnrhr004672stj3oz6a8s	cmh36n1zs0005td07t6m368m7	\N	2025-11-05 01:31:36.499	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 01:31:36.499	\N	0	\N	\N
cmhlbnri1004872stv5muvoqy	cmhlbnrhr004672stj3oz6a8s	cmhcegfin0006hcgendh83z40	\N	2025-11-05 01:31:24.025	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 01:31:24.025	\N	0	\N	\N
cmhlljru9001d3fyjth0at7xf	cmhlljrtz001b3fyju6ayec2i	cmh36n1zs0005td07t6m368m7	\N	2025-11-05 06:08:14.001	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 06:08:14.001	\N	0	\N	\N
cmhllk5k7001h3fyjeo5oddb7	cmhlljrtz001b3fyju6ayec2i	cmhcegfin0006hcgendh83z40	\N	2025-11-05 06:08:31.783	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 06:08:31.783	\N	0	\N	\N
cmhm9g12o000wxx9r1v23l2fz	cmhm9g12c000uxx9ry2rqybn8	cmfgpklkn000114lt1n0ec61k	\N	2025-11-05 17:17:10.128	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 17:17:10.128	\N	0	\N	\N
cmhm9gamn0010xx9rqy76ckis	cmhm9g12c000uxx9ry2rqybn8	cmh36n1zs0005td07t6m368m7	\N	2025-11-05 17:17:22.512	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 17:17:22.512	\N	0	\N	\N
cmhl1ujit000tqg34g2mu7vod	cmhl1uacq000nqg34wu04xwvn	cmfgpklkn000114lt1n0ec61k	\N	2025-11-04 20:56:44.117	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-04 20:56:44.117	\N	0	\N	\N
cmhl1uad0000pqg34ih4ujpxt	cmhl1uacq000nqg34wu04xwvn	cmh36n1zs0005td07t6m368m7	\N	2025-11-04 20:56:32.244	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-04 20:56:32.244	\N	0	\N	\N
cmhl1uuhj000zqg3493aocyik	cmhl1uacq000nqg34wu04xwvn	cmhcegfin0006hcgendh83z40	\N	2025-11-04 20:56:58.327	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-04 20:56:58.327	\N	0	\N	\N
cmhlpyzwf00303fyjjl2a9tw5	cmhlpyzw3002y3fyjy4vg3c83	cmhcegfin0006hcgendh83z40	\N	2025-11-05 08:12:02.751	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 08:12:02.751	\N	0	\N	\N
cmhlfwnye001ihru4pqu5efkl	cmhlfwbp9001chru4iqqmzmtt	cmgxdqce80000108q18y4npo0	\N	2025-11-05 03:30:17.798	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 03:30:17.798	\N	0	\N	\N
cmhlfwbpw001ehru48pqzbzlq	cmhlfwbp9001chru4iqqmzmtt	cmh36n1zs0005td07t6m368m7	\N	2025-11-05 03:30:01.941	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 03:30:01.941	\N	0	\N	\N
cmhmizjun00036cwiflj71nmb	cmhmizjud00016cwiogot6jzu	cmhcegfin0006hcgendh83z40	\N	2025-11-05 21:44:17.472	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 21:44:17.472	\N	0	\N	\N
cmhmj02dm00076cwidlbtal3r	cmhmizjud00016cwiogot6jzu	cmh36n1zs0005td07t6m368m7	\N	2025-11-05 21:44:41.482	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 21:44:41.482	\N	0	\N	\N
cmhlga01j0007tnfeelge0hew	cmhlg9nxr0001tnfeswd6oimc	cmgxdqce80000108q18y4npo0	\N	2025-11-05 03:40:39.992	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 03:40:39.992	\N	0	\N	\N
cmhlg9ny20003tnferipgd30p	cmhlg9nxr0001tnfeswd6oimc	cmh36n1zs0005td07t6m368m7	\N	2025-11-05 03:40:24.314	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 03:40:24.314	\N	0	\N	\N
cmhn6r2g30003p0dy7m36qzar	cmhn6r2ft0001p0dyvc3096qy	cmhcegfin0006hcgendh83z40	\N	2025-11-06 08:49:32.451	t	VIDEO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhn6r2ft0001p0dyvc3096qy/cmhcegfin0006hcgendh83z40_1762419738495_8641cbbe34e37b69.mp4	2025-11-06 09:02:24.447	t	6	6	PENDING	f	2025-11-06 08:49:32.451	\N	0	\N	\N
cmhn6sfn5000vp0dyl2pepylo	cmhn6r2ft0001p0dyvc3096qy	cmfgpklkn000114lt1n0ec61k	\N	2025-11-06 08:50:36.21	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhn6r2ft0001p0dyvc3096qy/cmfgpklkn000114lt1n0ec61k_1762419796122_209bcdf3c57d7114.png	2025-11-06 09:03:17.511	t	6	6	PENDING	f	2025-11-06 08:50:36.21	\N	0	\N	\N
cmhn6ssm10011p0dy7en5c26r	cmhn6r2ft0001p0dyvc3096qy	cmh8axnya000me17r1py1t2xm	\N	2025-11-06 08:50:53.017	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhn6r2ft0001p0dyvc3096qy/cmh8axnya000me17r1py1t2xm_1762419856243_4d4a458fb9ccf26a.jpg	2025-11-06 09:04:17.802	f	6	6	PENDING	f	2025-11-06 08:50:53.017	阿斯蒂芬撒旦啊手动阀撒打发阿萨的飞洒	0	\N	\N
cmhn6rce90007p0dyr07wcozc	cmhn6r2ft0001p0dyvc3096qy	cmfhsxf490000lmmnwp77vl6x	\N	2025-11-06 08:49:45.345	t	VIDEO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhn6r2ft0001p0dyvc3096qy/cmfhsxf490000lmmnwp77vl6x_1762419474281_42293d96cfeb848a.mp4	2025-11-06 08:58:36.151	t	6	6	PENDING	f	2025-11-06 08:49:45.345	啊的撒发生发射点发射点发士大夫十大	0	\N	\N
cmhn6rogt000dp0dy8nn3w3p4	cmhn6r2ft0001p0dyvc3096qy	cmh36n1zs0005td07t6m368m7	\N	2025-11-06 08:50:00.989	t	PHOTO	a撒旦飞洒发a撒旦飞洒发a撒旦飞洒发a撒旦飞洒发a撒旦飞洒发a撒旦飞洒发	2025-11-06 08:59:45.381	f	6	6	PENDING	f	2025-11-06 08:50:00.989	a撒旦飞洒发a撒旦飞洒发a撒旦飞洒发a撒旦飞洒发a撒旦飞洒发a撒旦飞洒发	0	\N	\N
cmhnb8im3000lkw1jozlzk93e	cmhnb891d000fkw1j09az9ccn	cmfgpklkn000114lt1n0ec61k	\N	2025-11-06 10:55:05.019	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhnb891d000fkw1j09az9ccn/cmfgpklkn000114lt1n0ec61k_1762426952253_e50ac5f880437c04.jpg	2025-11-06 11:02:33.561	t	1	1	SUCCESS	t	2025-11-06 10:55:05.019	\N	0	\N	\N
cmhn6rxhp000jp0dy43esl0is	cmhn6r2ft0001p0dyvc3096qy	cmgxdqce80000108q18y4npo0	\N	2025-11-06 08:50:12.685	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhn6r2ft0001p0dyvc3096qy/cmgxdqce80000108q18y4npo0_1762419667994_e81c9b2054adb610.jpg	2025-11-06 09:01:11.142	f	6	6	PENDING	f	2025-11-06 08:50:12.685	\N	0	\N	\N
cmhnb891o000hkw1j7krcka5j	cmhnb891d000fkw1j09az9ccn	cmfhsxf490000lmmnwp77vl6x	\N	2025-11-06 10:54:52.62	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhnb891d000fkw1j09az9ccn/cmfhsxf490000lmmnwp77vl6x_1762426928873_fd3c3728016dac6d.jpg	2025-11-06 11:02:10.975	t	1	1	SUCCESS	t	2025-11-06 10:54:52.62	\N	0	\N	\N
cmhmick1l000329id7ar1izx5	cmhmick19000129id11sb2sv2	cmhcegfin0006hcgendh83z40	\N	2025-11-05 21:26:24.633	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 21:26:24.633	\N	0	\N	\N
cmhmaja55000jlrhr2fxobbl1	cmhmaizbw000dlrhroj4npjg7	cmfgpklkn000114lt1n0ec61k	\N	2025-11-05 17:47:41.465	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 17:47:41.465	\N	0	\N	\N
cmhmaizc4000flrhrze5jcpkg	cmhmaizbw000dlrhroj4npjg7	cmhcegfin0006hcgendh83z40	\N	2025-11-05 17:47:27.461	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 17:47:27.461	\N	0	\N	\N
cmhmkkmxg0003i4ha88ikd8o7	cmhmkkmx60001i4haupa9ek4r	cmh24ml660003td0740yexg8h	\N	2025-11-05 22:28:40.853	t	VIDEO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhmkkmx60001i4haupa9ek4r/cmh24ml660003td0740yexg8h_1762382321381_ac0beeb6b8c7d87b.mp4	2025-11-05 22:39:01.33	f	0	0	FAILURE	t	2025-11-05 22:28:40.853	\N	0	\N	\N
cmhmkkxrv0007i4hagmo04rpz	cmhmkkmx60001i4haupa9ek4r	cmhcegfin0006hcgendh83z40	\N	2025-11-05 22:28:54.908	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhmkkmx60001i4haupa9ek4r/cmhcegfin0006hcgendh83z40_1762382236563_35ddd7b0584e2db8.jpg	2025-11-05 22:37:19.107	t	0	0	FAILURE	t	2025-11-05 22:28:54.908	\N	0	\N	\N
cmhmbewz30007xskec4afmk2g	cmhmbelwy0001xskel3wdmqba	cmfgpklkn000114lt1n0ec61k	\N	2025-11-05 18:12:17.392	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 18:12:17.392	\N	0	\N	\N
cmhmbelx90003xske4kzuh61g	cmhmbelwy0001xskel3wdmqba	cmhcegfin0006hcgendh83z40	\N	2025-11-05 18:12:03.07	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 18:12:03.07	\N	0	\N	\N
cmhllzii6002i3fyjbtpbj80o	cmhllzihs002g3fyj6m6t6crl	cmh36n1zs0005td07t6m368m7	\N	2025-11-05 06:20:28.398	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 06:20:28.398	\N	0	\N	\N
cmhllzvbt002m3fyjwn4txrxw	cmhllzihs002g3fyj6m6t6crl	cmhcegfin0006hcgendh83z40	\N	2025-11-05 06:20:45.017	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-05 06:20:45.017	\N	0	\N	\N
cmhmhl6890003h5w4m6lrnqut	cmhmhl67p0001h5w42mdl7qi1	cmfgpklkn000114lt1n0ec61k	\N	2025-11-05 21:05:07.017	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhmhl67p0001h5w42mdl7qi1/cmfgpklkn000114lt1n0ec61k_1762377256348	2025-11-05 21:14:17.006	t	0	3	SUCCESS	t	2025-11-05 21:05:07.017	\N	0	\N	\N
cmhmhlqlm000dh5w41rp9attx	cmhmhl67p0001h5w42mdl7qi1	cmh36n1zs0005td07t6m368m7	\N	2025-11-05 21:05:33.419	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhmhl67p0001h5w42mdl7qi1/cmh36n1zs0005td07t6m368m7_1762377411567	2025-11-05 21:16:51.939	t	1	0	FAILURE	t	2025-11-05 21:05:33.419	\N	0	\N	\N
cmhmhlzkp000jh5w4qqnkc5s8	cmhmhl67p0001h5w42mdl7qi1	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-11-05 21:05:45.049	t	VIDEO	撒旦飞洒发顺带撒旦飞洒阿萨富士达顺带撒打发	2025-11-05 21:16:19.979	t	1	0	SUCCESS	t	2025-11-05 21:05:45.049	\N	0	\N	\N
cmhmhliwj0007h5w4nb9vo4dq	cmhmhl67p0001h5w42mdl7qi1	cmhcegfin0006hcgendh83z40	\N	2025-11-05 21:05:23.444	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhmhl67p0001h5w42mdl7qi1/cmhcegfin0006hcgendh83z40_1762377310915	2025-11-05 21:15:11.302	f	1	0	SUCCESS	t	2025-11-05 21:05:23.444	\N	0	\N	\N
cmhmlfk4v000dngzibct1cd4o	cmhmlf1yw0001ngziqwf0kifk	cmgxzbcqh0000hak2a2jt0wwa	\N	2025-11-05 22:52:43.568	t	PHOTO	啊手动阀撒旦发范德萨法撒旦富士达法撒旦撒富士达	2025-11-05 22:56:10.148	t	0	0	FAILURE	t	2025-11-05 22:52:43.568	啊手动阀撒旦发范德萨法撒旦富士达法撒旦撒富士达	0	\N	\N
cmhmlfsyj000jngzigi7k8g57	cmhmlf1yw0001ngziqwf0kifk	cmh36n1zs0005td07t6m368m7	\N	2025-11-05 22:52:55.003	t	VIDEO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhmlf1yw0001ngziqwf0kifk/cmh36n1zs0005td07t6m368m7_1762383325269_3815b3ade3d1c06e.mp4	2025-11-05 22:55:38.187	t	0	0	FAILURE	t	2025-11-05 22:52:55.003	撒打发	0	\N	\N
cmhmlf1za0003ngzij6smeikb	cmhmlf1yw0001ngziqwf0kifk	cmhcegfin0006hcgendh83z40	\N	2025-11-05 22:52:20.038	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhmlf1yw0001ngziqwf0kifk/cmhcegfin0006hcgendh83z40_1762383447652_085b183f22fa12ad.jpg	2025-11-05 22:57:28.972	f	0	0	FAILURE	t	2025-11-05 22:52:20.038	\N	0	\N	\N
cmhn6s662000pp0dyh3wupt96	cmhn6r2ft0001p0dyvc3096qy	cmgxzbcqh0000hak2a2jt0wwa	\N	2025-11-06 08:50:23.93	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhn6r2ft0001p0dyvc3096qy/cmgxzbcqh0000hak2a2jt0wwa_1762419423550_4e8ba123fe8f2aad.gif	2025-11-06 08:57:07.597	t	6	6	PENDING	f	2025-11-06 08:50:23.93	撒打发	0	\N	\N
cmhohe3uh000heo2ums0sqvqd	cmhohdd4k0005eo2u4adsj5lp	cmh36n1zs0005td07t6m368m7	\N	2025-11-07 06:35:09.689	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhohdd4k0005eo2u4adsj5lp/cmh36n1zs0005td07t6m368m7_1762497706502_803585a847129f5c.jpg	2025-11-07 06:41:48.181	f	2	4	FAILURE	t	2025-11-07 06:35:09.689	\N	0	\N	\N
cmhohech0000neo2u0dd3vpbx	cmhohdd4k0005eo2u4adsj5lp	cmgxdqce80000108q18y4npo0	\N	2025-11-07 06:35:20.868	t	PHOTO	撒撒旦发啊撒撒旦发啊撒撒旦发啊撒撒旦发啊撒撒旦发啊撒撒旦发啊	2025-11-07 06:39:51.761	t	1	0	FAILURE	t	2025-11-07 06:35:20.868	撒撒旦发啊撒撒旦发啊撒撒旦发啊撒撒旦发啊撒撒旦发啊撒撒旦发啊	0	\N	\N
cmhohdrfs000beo2uqmmfwiaf	cmhohdd4k0005eo2u4adsj5lp	cmhcegfin0006hcgendh83z40	\N	2025-11-07 06:34:53.608	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhohdd4k0005eo2u4adsj5lp/cmhcegfin0006hcgendh83z40_1762497731771_5aa4a5d0e3341be1.png	2025-11-07 06:42:14.118	f	1	2	FAILURE	t	2025-11-07 06:34:53.608	\N	0	\N	\N
cmhohdd4u0007eo2u2wvj6buz	cmhohdd4k0005eo2u4adsj5lp	cmfgpklkn000114lt1n0ec61k	\N	2025-11-07 06:34:35.07	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhohdd4k0005eo2u4adsj5lp/cmfgpklkn000114lt1n0ec61k_1762497566747_74445223fa07a1e6.jpg	2025-11-07 06:39:27.946	f	2	0	SUCCESS	t	2025-11-07 06:34:35.07	\N	0	\N	\N
cmhohf1wc000zeo2uox4d5r8e	cmhohdd4k0005eo2u4adsj5lp	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-11-07 06:35:53.82	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhohdd4k0005eo2u4adsj5lp/cmhc7jd8w0006x7g1c2qc46o4_1762497536529_6e08215191565f31.jpg	2025-11-07 06:39:03.811	t	2	0	SUCCESS	t	2025-11-07 06:35:53.82	\N	0	\N	\N
cmhohtc7f0028eo2unpyptpcp	cmhohtc750026eo2uynzst7dh	cmh36n1zs0005td07t6m368m7	\N	2025-11-07 06:47:00.363	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-07 06:47:00.363	\N	0	\N	\N
cmhohen48000teo2uoo4oi1yx	cmhohdd4k0005eo2u4adsj5lp	cmfiilojw000ao5ubr1d3vfk0	\N	2025-11-07 06:35:34.665	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhohdd4k0005eo2u4adsj5lp/cmfiilojw000ao5ubr1d3vfk0_1762497667854_d134ea3924f118dd.jpg	2025-11-07 06:41:16.332	t	2	4	SUCCESS	t	2025-11-07 06:35:34.665	s大法师	0	\N	\N
cmhohtrdg002ceo2uxdfrk069	cmhohtc750026eo2uynzst7dh	cmhcegfin0006hcgendh83z40	\N	2025-11-07 06:47:20.02	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-07 06:47:20.02	\N	0	\N	\N
cmholvl4x0050eo2ummjy9d5q	cmholuz8l004oeo2ux4k76e13	cmfgpmfbo000314ltz0jj7n1y	\N	2025-11-07 08:40:43.713	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-07 08:40:43.713	\N	0	\N	\N
cmholvt7f0056eo2ulqt7rj8z	cmholuz8l004oeo2ux4k76e13	cmh36n1zs0005td07t6m368m7	\N	2025-11-07 08:40:54.172	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-07 08:40:54.172	\N	0	\N	\N
cmholvbm3004ueo2ufpnt5x8w	cmholuz8l004oeo2ux4k76e13	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-11-07 08:40:31.371	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-07 08:40:31.371	\N	0	\N	\N
cmholuz8z004qeo2ufmfg5tdw	cmholuz8l004oeo2ux4k76e13	cmfgpklkn000114lt1n0ec61k	\N	2025-11-07 08:40:15.347	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-07 08:40:15.347	\N	0	\N	\N
cmholw8x5005ceo2u7fphs98w	cmholuz8l004oeo2ux4k76e13	cmhcegfin0006hcgendh83z40	\N	2025-11-07 08:41:14.538	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-07 08:41:14.538	\N	0	\N	\N
cmhoooxyd000xdvi6gxaj9zyq	cmhooodux000ldvi6x4x66lmg	cmgxdqce80000108q18y4npo0	\N	2025-11-07 09:59:32.581	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-07 09:59:32.581	\N	0	\N	\N
cmhooq7ji0013dvi6lyz7s52b	cmhooodux000ldvi6x4x66lmg	cmgxzbcqh0000hak2a2jt0wwa	\N	2025-11-07 10:00:31.662	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-07 10:00:31.662	\N	0	\N	\N
cmhooopgt000rdvi64589jnp8	cmhooodux000ldvi6x4x66lmg	cmh36n1zs0005td07t6m368m7	\N	2025-11-07 09:59:21.582	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-07 09:59:21.582	\N	0	\N	\N
cmhooodv7000ndvi68kll9thh	cmhooodux000ldvi6x4x66lmg	cmhcegfin0006hcgendh83z40	\N	2025-11-07 09:59:06.547	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-07 09:59:06.547	\N	0	\N	\N
cmfzrgl3q00032tw3s91cye6d	cmfzrgl3f00012tw32obb730j	cmfgpklkn000114lt1n0ec61k	\N	2025-09-25 18:43:04.79	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-25 18:43:04.79	\N	0	\N	\N
cmg228mpa000n7sa2y054jmnx	cmg228mp0000l7sa2x10rfit8	cmfgpklkn000114lt1n0ec61k	\N	2025-09-27 09:20:21.742	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-27 09:20:21.742	\N	0	\N	\N
cmhjgzu160007117a77jp8t0f	cmhjgzgq20001117aa962fuhz	cmhcegfin0006hcgendh83z40	\N	2025-11-03 18:25:12.907	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-11-03 18:25:12.907	\N	0	\N	\N
cmhmicuh6000729id9alu3q5g	cmhmick19000129id11sb2sv2	cmhc7jd8w0006x7g1c2qc46o4	\N	2025-11-05 21:26:38.155	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhmick19000129id11sb2sv2/cmhc7jd8w0006x7g1c2qc46o4_1762378265831	2025-11-05 21:31:06.435	t	0	0	SUCCESS	t	2025-11-05 21:26:38.155	\N	0	\N	\N
cmgz2t7nm003410if1334204h	cmgz2t7ng003210ifn0txseqw	cmfgpklkn000114lt1n0ec61k	\N	2025-10-20 11:52:45.826	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-20 11:52:45.826	\N	0	\N	\N
cmhbq4xrg0001x7g1yevhj6zu	cmh82pxe60001e17r153xo76x	cmfgpklkn000114lt1n0ec61k	\N	2025-10-29 08:18:58.156	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-10-29 08:18:58.156	\N	0	\N	\N
cmhmlfbgx0007ngzit6ecymo6	cmhmlf1yw0001ngziqwf0kifk	cmfhsxf490000lmmnwp77vl6x	\N	2025-11-05 22:52:32.337	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmhmlf1yw0001ngziqwf0kifk/cmfhsxf490000lmmnwp77vl6x_1762383417559_284a9f8bcad4b5a2.jpg	2025-11-05 22:56:59.756	t	0	0	SUCCESS	t	2025-11-05 22:52:32.337	\N	0	\N	\N
cmg2bc7380009hbra38etsryf	cmg2bc7310007hbraewf0rmyh	cmfgpklkn000114lt1n0ec61k	\N	2025-09-27 13:35:04.676	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-09-27 13:35:04.676	\N	0	\N	\N
cmim1o88l000nt9hyidfqtb7k	cmim1o88a000lt9hy0q4yq785	cmh7d0ay1000zd3m01yxn28f4	\N	2025-11-30 18:19:18.069	f	\N	\N	\N	\N	0	0	PENDING	f	2025-11-30 18:19:18.069	\N	0	\N	\N
cmimekf7f009aokex3f8k10el	cmimekf730098okexf0o0oww2	cmh4rbv470000d3m0tokxkudd	\N	2025-12-01 00:20:15.483	f	\N	\N	\N	\N	3	3	PENDING	f	2025-12-01 00:20:15.483	\N	0	\N	\N
cmimekrnz009kokex0hxnfsr4	cmimekf730098okexf0o0oww2	cmgxdqce80000108q18y4npo0	\N	2025-12-01 00:20:31.631	f	\N	\N	\N	\N	3	3	PENDING	f	2025-12-01 00:20:31.631	\N	0	\N	\N
cmimel04n009qokex7c94t0dp	cmimekf730098okexf0o0oww2	cmfgpklkn000114lt1n0ec61k	\N	2025-12-01 00:20:42.599	f	\N	\N	\N	\N	3	3	PENDING	f	2025-12-01 00:20:42.599	\N	0	\N	\N
cmimelh2h009xokex3aswla9x	cmimekf730098okexf0o0oww2	cmgxzbcqh0000hak2a2jt0wwa	\N	2025-12-01 00:21:04.553	f	\N	\N	\N	\N	3	3	PENDING	f	2025-12-01 00:21:04.553	\N	0	\N	\N
cmimic9oz000diaff7hcdimhi	cmimic9op000biaffodufnc10	cmfgpklkn000114lt1n0ec61k	\N	2025-12-01 02:05:53.556	f	\N	\N	\N	\N	2	2	PENDING	f	2025-12-01 02:05:53.556	\N	0	\N	\N
cmimicnx5000jiaffabcpupjw	cmimic9op000biaffodufnc10	cmhcegfin0006hcgendh83z40	\N	2025-12-01 02:06:11.994	f	\N	\N	\N	\N	2	2	PENDING	f	2025-12-01 02:06:11.994	\N	0	\N	\N
cmimicvjm000piaffcsvrgxh8	cmimic9op000biaffodufnc10	cmh36n1zs0005td07t6m368m7	\N	2025-12-01 02:06:21.874	f	\N	\N	\N	\N	2	2	PENDING	f	2025-12-01 02:06:21.874	\N	0	\N	\N
cminf7h9v0006ie6l1btl1b9e	cminf7h9d0004ie6l6wjx24r9	cmfgpklkn000114lt1n0ec61k	\N	2025-12-01 17:25:57.427	f	\N	\N	\N	\N	1	1	FAILURE	t	2025-12-01 17:25:57.427	\N	0	\N	\N
cminf7sun000aie6lp4q7qu9k	cminf7h9d0004ie6l6wjx24r9	cmhcegfin0006hcgendh83z40	\N	2025-12-01 17:26:12.431	f	\N	\N	\N	\N	1	1	FAILURE	t	2025-12-01 17:26:12.431	\N	0	\N	\N
cmio2a85y0003qotctcjb3i1d	cmio2a85k0001qotccs6so6mf	cmfhsxf490000lmmnwp77vl6x	\N	2025-12-02 04:11:56.758	f	\N	\N	\N	\N	1	1	FAILURE	t	2025-12-02 04:11:56.758	\N	0	\N	\N
cmio2as1e0007qotcdv4b967g	cmio2a85k0001qotccs6so6mf	cmhcegfin0006hcgendh83z40	\N	2025-12-02 04:12:22.514	f	\N	\N	\N	\N	1	1	FAILURE	t	2025-12-02 04:12:22.514	\N	0	\N	\N
cmio6xbul00032nuk94dmoqju	cmio6xbu900012nuky5o963vy	cmfhsxf490000lmmnwp77vl6x	\N	2025-12-02 06:21:53.085	f	\N	\N	\N	\N	1	1	FAILURE	t	2025-12-02 06:21:53.085	\N	0	\N	\N
cmio6xoh900072nuk71pwcmin	cmio6xbu900012nuky5o963vy	cmhcegfin0006hcgendh83z40	\N	2025-12-02 06:22:09.453	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmio6xbu900012nuky5o963vy/cmhcegfin0006hcgendh83z40_1764656958697_eac54301b03ccfba.jpg	2025-12-02 06:29:21.29	t	1	1	FAILURE	t	2025-12-02 06:22:09.453	\N	0	\N	\N
cmio8gfwr0007yuosg6blw6z5	cmio8g4v70001yuosc61nzwfg	cmhcegfin0006hcgendh83z40	\N	2025-12-02 07:04:44.427	f	\N	\N	\N	\N	1	0	FAILURE	t	2025-12-02 07:04:44.427	\N	0	\N	\N
cmio8g4vj0003yuos94hg48r5	cmio8g4v70001yuosc61nzwfg	cmfhsxf490000lmmnwp77vl6x	\N	2025-12-02 07:04:30.127	f	\N	\N	\N	\N	0	1	FAILURE	t	2025-12-02 07:04:30.127	\N	-2	恶意仲裁	2025-12-02 15:35:10.585
cmisr71gr0003p50bqit0ukfp	cmisr71gg0001p50buhttpqtp	cmfhsxf490000lmmnwp77vl6x	\N	2025-12-05 11:00:23.211	f	\N	\N	\N	\N	0	0	PENDING	f	2025-12-05 11:00:23.211	\N	0	\N	\N
cmisrekjz0009p50b6lteo4xk	cmisrekjn0007p50bbvfb8mif	cmfhsxf490000lmmnwp77vl6x	\N	2025-12-05 11:06:14.543	f	\N	\N	\N	\N	0	0	PENDING	f	2025-12-05 11:06:14.543	\N	0	\N	\N
cmisrhde1000fp50b0mv3brpj	cmisrhddp000dp50be48i4yi8	cmgxfcw0d0000o777zhox72xw	\N	2025-12-05 11:08:25.226	f	\N	\N	\N	\N	0	0	PENDING	f	2025-12-05 11:08:25.226	\N	0	\N	\N
cmisrkx3i000vp50b3ysq3wx8	cmisrk0z1000pp50bcg4no9zl	cmfhsxf490000lmmnwp77vl6x	\N	2025-12-05 11:11:10.734	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmisrk0z1000pp50bcg4no9zl/cmfhsxf490000lmmnwp77vl6x_1764933645676_4739e56862fe934c.jpg	2025-12-05 11:20:47.78	t	1	1	SUCCESS	t	2025-12-05 11:11:10.734	\N	0	\N	\N
cmisrk0zf000rp50bwdpi4fb8	cmisrk0z1000pp50bcg4no9zl	cmgxfcw0d0000o777zhox72xw	\N	2025-12-05 11:10:29.115	t	PHOTO	https://app-together.nyc3.cdn.digitaloceanspaces.com/evidence/cmisrk0z1000pp50bcg4no9zl/cmgxfcw0d0000o777zhox72xw_1764933694823_c017f80a8ed1a5f8.jpg	2025-12-05 11:21:36.033	f	1	1	SUCCESS	t	2025-12-05 11:10:29.115	\N	0	\N	\N
cmisuxiiq0003rob2icqny7j7	cmisuxiid0001rob2ivn70d27	cmfhsxf490000lmmnwp77vl6x	\N	2025-12-05 12:44:57.218	f	\N	\N	\N	\N	0	0	PENDING	f	2025-12-05 12:44:57.218	\N	0	\N	\N
cmitkkq9c0003h9w6omiw32c9	cmitkkq910001h9w62bojgsih	cmgxfcw0d0000o777zhox72xw	\N	2025-12-06 00:42:50.736	f	\N	\N	\N	\N	0	0	PENDING	f	2025-12-06 00:42:50.736	\N	0	\N	\N
cmiu72dah000bnbfd2csx1k8z	cmiu71qmn0005nbfdtekrha9q	cmfhsxf490000lmmnwp77vl6x	\N	2025-12-06 11:12:25.29	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-12-06 11:12:25.29	\N	0	\N	\N
cmiu71qmw0007nbfdheguewr2	cmiu71qmn0005nbfdtekrha9q	cmgxfcw0d0000o777zhox72xw	\N	2025-12-06 11:11:55.928	f	\N	\N	\N	\N	0	0	FAILURE	t	2025-12-06 11:11:55.928	\N	0	\N	\N
cmiv0h59u0013nbfd4e60dm4h	cmiv0h59g0011nbfdm8kuzcgj	cmfgpklkn000114lt1n0ec61k	\N	2025-12-07 00:55:43.603	f	\N	\N	\N	\N	2	2	PENDING	f	2025-12-07 00:55:43.603	\N	0	\N	\N
cmiv0i4rx001dnbfdf8bfm8ky	cmiv0h59g0011nbfdm8kuzcgj	cmgxzbcqh0000hak2a2jt0wwa	\N	2025-12-07 00:56:29.613	f	\N	\N	\N	\N	2	2	PENDING	f	2025-12-07 00:56:29.613	\N	0	\N	\N
cmiv0hi8u0017nbfd4nebl8ec	cmiv0h59g0011nbfdm8kuzcgj	cmgxfcw0d0000o777zhox72xw	\N	2025-12-07 00:56:00.414	f	\N	\N	\N	\N	2	2	PENDING	f	2025-12-07 00:56:00.414	\N	0	\N	\N
cmivlb9h00003289q4zs2ca4u	cmivlb9gm0001289qctx6ylwl	cmfgpklkn000114lt1n0ec61k	\N	2025-12-07 10:39:01.044	f	\N	\N	\N	\N	0	0	PENDING	f	2025-12-07 10:39:01.044	\N	0	\N	\N
\.


--
-- Data for Name: community_groups; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.community_groups (id, name, description, category, is_public, creator_id, avatar, banner, tags, rules, member_count, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: dispute_evidence; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.dispute_evidence (id, dispute_id, uploader_id, type, title, description, content, metadata, is_verified, verified_by, verified_at, created_at) FROM stdin;
cmhokgwan004eeo2uh18ukhxc	cmhokggma004ceo2ua9la5utj	cmhcegfin0006hcgendh83z40	TEXT	斯特		撒旦飞洒飞洒飞洒	\N	f	\N	\N	2025-11-07 08:01:18.719
cmhpbroiq004advi6cb9cogl5	cmhpbrc870042dvi6xczlv3t3	cmgxdqce80000108q18y4npo0	DOCUMENT		撒	撒旦飞洒	\N	f	\N	\N	2025-11-07 20:45:31.49
cmio79gll000y2nuku50xtdk2	cmio79g95000x2nuk9kytmjiz	cmhcegfin0006hcgendh83z40	IMAGE	图片证据 1	\N	https://app-together.nyc3.cdn.digitaloceanspaces.com/dispute-evidence/cmio79g95000x2nuk9kytmjiz_cmhcegfin0006hcgendh83z40_0_1764657078685.jpg	\N	f	\N	\N	2025-12-02 06:31:19.113
cmio7b28h00152nukylbgnyrw	cmio7b1u200142nukn0c2czls	cmhcegfin0006hcgendh83z40	IMAGE	图片证据 1	\N	https://app-together.nyc3.cdn.digitaloceanspaces.com/dispute-evidence/cmio7b1u200142nukn0c2czls_cmhcegfin0006hcgendh83z40_0_1764657153307.jpg	\N	f	\N	\N	2025-12-02 06:32:33.809
cmioqmfyt0017yuos8w0nqyk8	cmioqmfy10015yuos84rsgoiz	cmhcegfin0006hcgendh83z40	TEXT	争议说明	\N	第一个用户发起的第一个用户发起的第一个用户发起的	\N	f	\N	\N	2025-12-02 15:33:17.525
cmioqo6nj001iyuosibjvhky0	cmioqo697001hyuosr3e4y7yc	cmfhsxf490000lmmnwp77vl6x	IMAGE	图片证据 1	\N	https://app-together.nyc3.cdn.digitaloceanspaces.com/dispute-evidence/cmioqo697001hyuosr3e4y7yc_cmfhsxf490000lmmnwp77vl6x_0_1764689678274.jpg	\N	f	\N	\N	2025-12-02 15:34:38.768
cmiorcdud000312yrfe6ze3ac	cmiorcdtm000112yrcrzjtye2	cmhcegfin0006hcgendh83z40	TEXT	争议说明	\N	第二次争议第二次争议	\N	f	\N	\N	2025-12-02 15:53:27.829
cmiordj3k000f12yr1qcuubuf	cmiordj33000d12yrytej89ha	cmhcegfin0006hcgendh83z40	TEXT	争议说明	\N	第三次争议第三次争议	\N	f	\N	\N	2025-12-02 15:54:21.296
cmiss2bgs001xp50b0xh2pc2e	cmiss2bg9001vp50b9ax06rft	cmfhsxf490000lmmnwp77vl6x	TEXT	争议说明	\N	sadfdsafs	\N	f	\N	\N	2025-12-05 11:24:42.508
cmiss2bp9001yp50b6v6edvyn	cmiss2bg9001vp50b9ax06rft	cmfhsxf490000lmmnwp77vl6x	IMAGE	图片证据 1	\N	https://app-together.nyc3.cdn.digitaloceanspaces.com/dispute-evidence/cmiss2bg9001vp50b9ax06rft_cmfhsxf490000lmmnwp77vl6x_0_1764933882513.jpg	\N	f	\N	\N	2025-12-05 11:24:42.813
cmiv1lp4h0029nbfd4x9v04ly	cmiv1lp430027nbfdheaska2y	cmgxzbcqh0000hak2a2jt0wwa	TEXT	争议说明	\N	arbitration page test	\N	f	\N	\N	2025-12-07 01:27:15.57
cmiv1lpgc002anbfd1vbjtna2	cmiv1lp430027nbfdheaska2y	cmgxzbcqh0000hak2a2jt0wwa	IMAGE	图片证据 1	\N	https://app-together.nyc3.cdn.digitaloceanspaces.com/dispute-evidence/cmiv1lp430027nbfdheaska2y_cmgxzbcqh0000hak2a2jt0wwa_0_1765070835573.jpg	\N	f	\N	\N	2025-12-07 01:27:15.996
\.


--
-- Data for Name: disputes; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.disputes (id, game_id, initiator_id, target_id, dispute_type, title, description, reason, status, priority, handler_id, handler_type, resolution, decision, compensation_amount, dispute_deadline, handled_at, resolved_at, created_at, updated_at, penalized_user_ids, points_adjustments) FROM stdin;
cmhjkj2f5000xc344tl8fwa8t	cmhjiptsm0001c3444oz0v7qf	cmhcegfin0006hcgendh83z40	\N	RULE_VIOLATION	撒打发	撒打发撒		CANCELLED	NORMAL	\N	\N	\N	\N	\N	2025-11-10 20:04:09.087	\N	2025-11-03 20:04:18.189	2025-11-03 20:04:09.089	2025-11-03 20:04:18.19	{}	\N
cmhjwrih9002b9i0qj9iu2r0f	cmhjwgmd300179i0qimtlfz3o	cmh36n1zs0005td07t6m368m7	cmhcegfin0006hcgendh83z40	EVIDENCE_DISPUTE	没有完成打包，根本没打包	没有完成打包，根本没打包	没有完成打包，根本没打包	PENDING	NORMAL	\N	\N	\N	\N	\N	2025-11-11 01:46:38.539	\N	\N	2025-11-04 01:46:38.541	2025-11-04 01:46:38.541	{}	\N
cmhk7uhlz001np1dn29l78uq6	cmhk7abeh000rp1dn46fy94jn	cmfgpklkn000114lt1n0ec61k	\N	EVIDENCE_DISPUTE	阿斯蒂芬萨芬	撒打发撒旦		PENDING	NORMAL	\N	\N	\N	\N	\N	2025-11-11 06:56:53.158	\N	\N	2025-11-04 06:56:53.16	2025-11-04 06:56:53.16	{}	\N
cmhoggl020001eo2uwip5n185	cmhioy1cc00171lqofc2l8wzh	cmfgpklkn000114lt1n0ec61k	\N	RULE_VIOLATION	仲裁测试 - 针对整个游戏	仲裁测试 - 针对整个游戏		CANCELLED	NORMAL	\N	\N	\N	\N	\N	2025-11-14 06:09:05.616	\N	2025-11-07 06:11:05.234	2025-11-07 06:09:05.618	2025-11-07 06:11:05.235	{}	\N
cmhji9alx000w117af8ciq9w6	cmhioy1cc00171lqofc2l8wzh	cmfgpklkn000114lt1n0ec61k	cmhc7jd8w0006x7g1c2qc46o4	EVIDENCE_DISPUTE	撒旦发射点发111	撒打发啊手动阀阿萨的法撒旦富士达	测试	UNDER_REVIEW	NORMAL	cmfhsxf490000lmmnwp77vl6x	\N	\N	\N	\N	2025-11-10 19:00:33.907	\N	\N	2025-11-03 19:00:33.909	2025-11-07 06:11:45.554	{}	\N
cmhokdggz0042eo2u7embzv4b	cmhohdd4k0005eo2u4adsj5lp	cmhcegfin0006hcgendh83z40	\N	EVIDENCE_DISPUTE	瞎胡闹	瞎胡闹		RESOLVED	NORMAL	cmfhsxf490000lmmnwp77vl6x	HUMAN_MANUAL	同意处理	APPROVE_INITIATOR	\N	2025-11-14 07:58:38.241	2025-11-07 08:00:07.089	2025-11-07 08:00:07.089	2025-11-07 07:58:38.243	2025-11-07 08:00:07.091	{}	\N
cmhohasc20003eo2um7eerpo5	cmhnb891d000fkw1j09az9ccn	cmfgpklkn000114lt1n0ec61k	\N	EVIDENCE_DISPUTE	test  旧	test  旧		RESOLVED	NORMAL	cmfhsxf490000lmmnwp77vl6x	HUMAN_MANUAL	撒打发	NO_ACTION_NEEDED	\N	2025-11-14 06:32:34.8	2025-11-07 08:07:04.624	2025-11-07 08:07:04.624	2025-11-07 06:32:34.802	2025-11-07 08:07:04.626	{}	\N
cmhokggma004ceo2ua9la5utj	cmhohtc750026eo2uynzst7dh	cmhcegfin0006hcgendh83z40	\N	HARASSMENT	test	test		RESOLVED	HIGH	cmfhsxf490000lmmnwp77vl6x	HUMAN_MANUAL	撒旦发顺丰s大法撒	INSUFFICIENT_EVIDENCE	\N	2025-11-14 08:00:58.4	2025-11-07 08:07:48.424	2025-11-07 08:07:48.424	2025-11-07 08:00:58.402	2025-11-07 08:07:48.425	{}	\N
cmhokq98v004meo2u6uc0jcfm	cmhohdd4k0005eo2u4adsj5lp	cmfgpklkn000114lt1n0ec61k	\N	EVIDENCE_DISPUTE	sa的发生	撒大法是		PENDING	NORMAL	\N	\N	\N	\N	\N	2025-11-14 08:08:35.405	\N	\N	2025-11-07 08:08:35.407	2025-11-07 08:08:35.407	{}	\N
cmhoofd6r000bdvi663u5bjwo	cmholuz8l004oeo2ux4k76e13	cmhcegfin0006hcgendh83z40	\N	EVIDENCE_DISPUTE	撒打发	撒旦撒旦发送撒打发		PENDING	NORMAL	\N	\N	\N	\N	\N	2025-11-14 09:52:05.761	\N	\N	2025-11-07 09:52:05.763	2025-11-07 09:52:05.763	{}	\N
cmhpbf8zl001wdvi6kiqpvj0h	cmhooodux000ldvi6x4x66lmg	cmgxzbcqh0000hak2a2jt0wwa	cmgxdqce80000108q18y4npo0	RULE_VIOLATION	撒打发付费	撒反对撒旦撒旦		RESOLVED	NORMAL	cmfhsxf490000lmmnwp77vl6x	HUMAN_MANUAL	是否是发士大夫暗示发大水	APPROVE_INITIATOR	\N	2025-11-14 20:35:51.488	2025-11-07 20:36:28.338	2025-11-07 20:36:28.338	2025-11-07 20:35:51.489	2025-11-07 20:36:28.34	{}	\N
cmhpbhook002idvi64pebl6ot	cmhooodux000ldvi6x4x66lmg	cmhcegfin0006hcgendh83z40	\N	RULE_VIOLATION	阿斯蒂芬萨芬暗室逢灯	啊手动阀暗示法撒旦是		RESOLVED	NORMAL	cmfhsxf490000lmmnwp77vl6x	HUMAN_MANUAL	是打发打发	INSUFFICIENT_EVIDENCE	\N	2025-11-14 20:37:45.139	2025-11-07 20:38:16.289	2025-11-07 20:38:16.289	2025-11-07 20:37:45.14	2025-11-07 20:38:16.291	{}	\N
cmhpbiwod0030dvi6wxttx3ir	cmhooodux000ldvi6x4x66lmg	cmhcegfin0006hcgendh83z40	\N	UNFAIR_EVALUATION	s打发十分大师傅撒旦	撒旦飞洒飞洒		RESOLVED	NORMAL	cmfhsxf490000lmmnwp77vl6x	HUMAN_MANUAL	啊手动阀暗示	INVALID_DISPUTE	\N	2025-11-14 20:38:42.156	2025-11-07 20:39:06.65	2025-11-07 20:39:06.65	2025-11-07 20:38:42.158	2025-11-07 20:39:06.651	{}	\N
cmhpbjupk003kdvi6i6ju985r	cmhooodux000ldvi6x4x66lmg	cmhcegfin0006hcgendh83z40	\N	RULE_VIOLATION	啊手动阀阿萨的暗示	a撒打发暗示发大水		RESOLVED	NORMAL	cmfhsxf490000lmmnwp77vl6x	HUMAN_MANUAL	撒打发撒飞洒	NO_ACTION_NEEDED	\N	2025-11-14 20:39:26.263	2025-11-07 20:39:53.807	2025-11-07 20:39:53.807	2025-11-07 20:39:26.264	2025-11-07 20:39:53.809	{}	\N
cmhpbrc870042dvi6xczlv3t3	cmhooodux000ldvi6x4x66lmg	cmgxdqce80000108q18y4npo0	\N	EVIDENCE_DISPUTE	阿斯顿发射点	a撒打发阿萨的法撒旦		PENDING	NORMAL	\N	\N	\N	\N	\N	2025-11-14 20:45:15.557	\N	\N	2025-11-07 20:45:15.559	2025-11-07 20:45:15.559	{}	\N
cmhpd7e47004pdvi6seta4jjp	cmholuz8l004oeo2ux4k76e13	cmfgpklkn000114lt1n0ec61k	\N	EVIDENCE_DISPUTE	阿萨的飞洒	s答复撒撒		PENDING	NORMAL	\N	\N	\N	\N	\N	2025-11-14 21:25:44.117	\N	\N	2025-11-07 21:25:44.119	2025-11-07 21:25:44.119	{}	\N
cming5j5w000yie6lxoagk2hl	cminf7h9d0004ie6l6wjx24r9	cmfgpklkn000114lt1n0ec61k	cmhcegfin0006hcgendh83z40	RULE_VIOLATION	做的很艺术	做的很艺术		UNDER_REVIEW	NORMAL	cmfhsxf490000lmmnwp77vl6x	\N	\N	\N	\N	2025-12-08 17:52:26.178	\N	\N	2025-12-01 17:52:26.18	2025-12-01 17:52:53.502	{}	\N
cmio2n1fh000vqotcxg3vejay	cmio2a85k0001qotccs6so6mf	cmfhsxf490000lmmnwp77vl6x	\N	TECHNICAL_ISSUE	测试上传文件	式打法是地方撒旦方法是		UNDER_REVIEW	URGENT	cmfhsxf490000lmmnwp77vl6x	\N	\N	\N	\N	2025-12-09 04:21:54.555	\N	\N	2025-12-02 04:21:54.557	2025-12-02 07:29:45.727	{}	\N
cminn1f1k0001118zz6te0blh	cmimekf730098okexf0o0oww2	cmfgpklkn000114lt1n0ec61k	cmgxdqce80000108q18y4npo0	RULE_VIOLATION	测试上传图片	胜多负少删掉发送速度富士达		RESOLVED	NORMAL	cmfhsxf490000lmmnwp77vl6x	HUMAN_MANUAL	部分不支持	PARTIAL_APPROVAL	\N	2025-12-08 21:05:11.526	2025-12-01 21:06:57.006	2025-12-01 21:06:57.006	2025-12-01 21:05:11.528	2025-12-01 21:06:57.008	{}	\N
cmio79g95000x2nuk9kytmjiz	cmio6xbu900012nuky5o963vy	cmhcegfin0006hcgendh83z40	cmfhsxf490000lmmnwp77vl6x	HARASSMENT	再有问题骂AI	再有问题骂AI		CANCELLED	HIGH	\N	\N	\N	\N	\N	2025-12-09 06:31:18.664	\N	2025-12-02 06:31:47.779	2025-12-02 06:31:18.665	2025-12-02 06:31:47.78	{}	\N
cmhped730005ddvi6twf7pygz	cmhl7estf000172ste4gw6ufs	cmhcegfin0006hcgendh83z40	\N	EVIDENCE_DISPUTE	sadfasdfas	asdfasdfasdfdsaf	sdafsdf	RESOLVED	NORMAL	cmfhsxf490000lmmnwp77vl6x	HUMAN_MANUAL	sf	NO_ACTION_NEEDED	\N	2025-11-14 21:58:14.554	2025-12-02 07:30:07.697	2025-12-02 07:30:07.697	2025-11-07 21:58:14.556	2025-12-02 07:30:07.699	{}	\N
cmio7b1u200142nukn0c2czls	cmio6xbu900012nuky5o963vy	cmhcegfin0006hcgendh83z40	\N	OTHER	再有问题骂AI	再有问题骂AI		RESOLVED	NORMAL	cmfhsxf490000lmmnwp77vl6x	HUMAN_MANUAL	撒地方	APPROVE_INITIATOR	\N	2025-12-09 06:32:33.288	2025-12-02 06:35:34.892	2025-12-02 06:35:34.892	2025-12-02 06:32:33.29	2025-12-02 06:35:34.93	{}	{"cmhcegfin0006hcgendh83z40": {"reason": "仲裁胜诉奖励", "laborPoints": 10, "trustPoints": 10}}
cmioqmfy10015yuos84rsgoiz	cmio8g4v70001yuosc61nzwfg	cmhcegfin0006hcgendh83z40	\N	EVIDENCE_DISPUTE	第一个用户发起的	第一个用户发起的第一个用户发起的第一个用户发起的第一个用户发起的		RESOLVED	NORMAL	cmfhsxf490000lmmnwp77vl6x	HUMAN_MANUAL	第一个用户发起的	INSUFFICIENT_EVIDENCE	\N	2025-12-09 15:33:17.495	2025-12-02 15:33:45.58	2025-12-02 15:33:45.58	2025-12-02 15:33:17.497	2025-12-02 15:33:45.582	{}	\N
cmiorcdtm000112yrcrzjtye2	cmio8g4v70001yuosc61nzwfg	cmhcegfin0006hcgendh83z40	\N	EVIDENCE_DISPUTE	第二次争议	第二次争议		RESOLVED	NORMAL	cmfhsxf490000lmmnwp77vl6x	HUMAN_MANUAL	烦了烦了	PARTIAL_APPROVAL	\N	2025-12-09 15:53:27.799	2025-12-02 15:53:51.608	2025-12-02 15:53:51.608	2025-12-02 15:53:27.802	2025-12-02 15:53:51.61	{}	\N
cmioqo697001hyuosr3e4y7yc	cmio8g4v70001yuosc61nzwfg	cmfhsxf490000lmmnwp77vl6x	\N	EVIDENCE_DISPUTE	第二个用户发起的	第二个用户发起的		RESOLVED	NORMAL	cmfhsxf490000lmmnwp77vl6x	HUMAN_MANUAL	第二个用户发起的	INVALID_DISPUTE	\N	2025-12-09 15:34:38.249	2025-12-02 15:35:10.551	2025-12-02 15:35:10.551	2025-12-02 15:34:38.251	2025-12-02 15:35:10.605	{cmfhsxf490000lmmnwp77vl6x}	{}
cmiordj33000d12yrytej89ha	cmio8g4v70001yuosc61nzwfg	cmhcegfin0006hcgendh83z40	\N	EVIDENCE_DISPUTE	第三次争议	第三次争议		RESOLVED	NORMAL	cmfhsxf490000lmmnwp77vl6x	HUMAN_MANUAL	第三次争议第三次争议	APPROVE_TARGET	\N	2025-12-09 15:54:21.278	2025-12-02 15:54:43.212	2025-12-02 15:54:43.212	2025-12-02 15:54:21.279	2025-12-02 15:54:43.214	{}	\N
cmiss2bg9001vp50b9ax06rft	cmisrk0z1000pp50bcg4no9zl	cmfhsxf490000lmmnwp77vl6x	cmgxfcw0d0000o777zhox72xw	OTHER	sdfdsafsd	sadfsdaf		PENDING	NORMAL	\N	\N	\N	\N	\N	2025-12-12 11:24:42.487	\N	\N	2025-12-05 11:24:42.489	2025-12-05 11:24:42.489	{}	\N
cmiv1lp430027nbfdheaska2y	cmiv0h59g0011nbfdm8kuzcgj	cmgxzbcqh0000hak2a2jt0wwa	\N	EVIDENCE_DISPUTE	arbitration page test	arbitration page test		PENDING	NORMAL	\N	\N	\N	\N	\N	2025-12-14 01:27:15.554	\N	\N	2025-12-07 01:27:15.555	2025-12-07 01:27:15.555	{}	\N
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.favorites (id, user_id, game_id, created_at) FROM stdin;
cmipxfx600003u8e82pafmxbq	cmgxfcw0d0000o777zhox72xw	cmim1o88a000lt9hy0q4yq785	2025-12-03 11:31:56.713
cmipy2256000au8e88jwb31cq	cmipxhglo0004u8e85jqegscu	cmim1o88a000lt9hy0q4yq785	2025-12-03 11:49:09.594
cmipy3hf7000du8e8hpaskmth	cmipy33my000bu8e8bxo390uf	cmim1o88a000lt9hy0q4yq785	2025-12-03 11:50:16.051
cmiu6s1bi0003nbfd5szp4ls2	cmgxfcw0d0000o777zhox72xw	cmisrhddp000dp50be48i4yi8	2025-12-06 11:04:23.215
cmiv2gvy7002knbfdz32hhsoh	cmgxzbcqh0000hak2a2jt0wwa	cmiv0h59g0011nbfdm8kuzcgj	2025-12-07 01:51:30.752
\.


--
-- Data for Name: feedbacks; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.feedbacks (id, user_id, type, content, email, status, admin_notes, handler_id, handled_at, user_agent, url, created_at, updated_at) FROM stdin;
cmhi45n2f0001jc7gfyz8du8h	cmh36n1zs0005td07t6m368m7	SUGGESTION	增加某某个功能	\N	RESOLVED	\N	cmfhsxf490000lmmnwp77vl6x	2025-11-02 19:38:41.304	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	http://142.171.117.89/	2025-11-02 19:38:02.631	2025-11-02 19:38:41.305
cmhi48no40003jc7gk947kf6o	cmh36n1zs0005td07t6m368m7	BUG	dasf	\N	PENDING	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	http://142.171.117.89/	2025-11-02 19:40:23.38	2025-11-02 19:40:23.38
cmhi4al0s0005jc7gn1mxelfc	cmh36n1zs0005td07t6m368m7	SUGGESTION	sadfasf	asdf@fdsaf.com	PENDING	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	http://142.171.117.89/	2025-11-02 19:41:53.26	2025-11-02 19:41:53.26
cmhi6tvyy0001141vy9plbc5j	cmh36n1zs0005td07t6m368m7	BUG	带email看看	sdfafs@fdsafds.com	PENDING	\N	\N	\N	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36	http://142.171.117.89/game/cmhf8lj7e000p140lj8vn75re	2025-11-02 20:52:53.145	2025-11-02 20:52:53.145
\.


--
-- Data for Name: friendships; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.friendships (id, requester_id, addressee_id, status, created_at, updated_at) FROM stdin;
cmg15soy80001wp8jo7g6dxyz	cmfgpklkn000114lt1n0ec61k	cmfgpmfbo000314ltz0jj7n1y	ACCEPTED	2025-09-26 18:12:10.448	2025-09-26 18:12:21.463
cmg72bo76000742kmacov783y	cmfgpmfbo000314ltz0jj7n1y	cmfhqhbdo001p8y89uh5fot7e	ACCEPTED	2025-09-30 21:21:34.531	2025-09-30 21:23:37.672
cmg70p8yr0007rndhglx92r2f	cmfgpklkn000114lt1n0ec61k	cmfhqhbdo001p8y89uh5fot7e	BLOCKED	2025-09-30 20:36:08.739	2025-09-30 21:23:47.468
cmg72bbpd000142kmet9e5jfa	cmfgpmfbo000314ltz0jj7n1y	cmfhqg9mg001k8y89kdji8pwn	BLOCKED	2025-09-30 21:21:18.338	2025-09-30 21:43:22.23
cmg70p4gp0001rndhw8v4o7be	cmfgpklkn000114lt1n0ec61k	cmfgpjvmb000014ltuwk3uwht	ACCEPTED	2025-09-30 20:36:02.905	2025-09-30 21:43:44.264
cmgxzfnbv0002hak2t66e1cpt	cmfgpklkn000114lt1n0ec61k	cmgxzbcqh0000hak2a2jt0wwa	ACCEPTED	2025-10-19 17:30:27.932	2025-10-19 17:30:54.739
cmhhuhb2p00105er4f7aae8mz	cmhcc8p1o000atqgxpzkeao00	cmhc7jd8w0006x7g1c2qc46o4	ACCEPTED	2025-11-02 15:07:10.801	2025-11-03 01:37:57.712
cmhhug7hl000o5er4c9j7llo0	cmhcegfin0006hcgendh83z40	cmhc7jd8w0006x7g1c2qc46o4	ACCEPTED	2025-11-02 15:06:19.497	2025-11-03 01:37:59.918
cmhhuh850000u5er4xkxket1w	cmhcc8p1o000atqgxpzkeao00	cmfiilojw000ao5ubr1d3vfk0	ACCEPTED	2025-11-02 15:07:06.997	2025-11-07 06:40:47.454
cmhhug33c000k5er4oj5z4qmg	cmhcegfin0006hcgendh83z40	cmfgpjvmb000014ltuwk3uwht	ACCEPTED	2025-11-02 15:06:13.8	2025-11-30 18:23:21.24
cmh869x3a0007e17ryd0eskme	cmh4rbv470000d3m0tokxkudd	cmfgpjvmb000014ltuwk3uwht	ACCEPTED	2025-10-26 20:39:39.718	2025-11-30 18:23:23.034
cmitmlduy0005h5o19qxv4xaa	cmfhsxf490000lmmnwp77vl6x	cmfiilojw000ao5ubr1d3vfk0	PENDING	2025-12-06 01:39:20.554	2025-12-06 01:39:20.554
cmitmlesd0009h5o1h7ojteem	cmfhsxf490000lmmnwp77vl6x	cmfgplidl000214ltrltpgf6s	PENDING	2025-12-06 01:39:21.757	2025-12-06 01:39:21.757
cmitmlfka000fh5o1e7qmyzfd	cmfhsxf490000lmmnwp77vl6x	cmfgpjvmb000014ltuwk3uwht	PENDING	2025-12-06 01:39:22.762	2025-12-06 01:39:22.762
cmitmlg61000jh5o1tq12c080	cmfhsxf490000lmmnwp77vl6x	cmh4rbv470000d3m0tokxkudd	PENDING	2025-12-06 01:39:23.545	2025-12-06 01:39:23.545
cmitmlhdn000nh5o11dldkfhj	cmfhsxf490000lmmnwp77vl6x	cmfhqhbdo001p8y89uh5fot7e	PENDING	2025-12-06 01:39:25.115	2025-12-06 01:39:25.115
cmitmlhyu000rh5o1wj5drbfh	cmfhsxf490000lmmnwp77vl6x	cmfhqg9mg001k8y89kdji8pwn	PENDING	2025-12-06 01:39:25.879	2025-12-06 01:39:25.879
cmiux1f56000rnbfd7r6r6jxl	cmgxzbcqh0000hak2a2jt0wwa	cmfhsxf490000lmmnwp77vl6x	ACCEPTED	2025-12-06 23:19:31.05	2025-12-06 23:21:19.894
\.


--
-- Data for Name: game_join_history; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.game_join_history (id, user_id, game_id, action, created_at) FROM stdin;
cmhgegtje000366n33doe6uod	cmhcc8p1o000atqgxpzkeao00	cmhf8lj7e000p140lj8vn75re	JOIN	2025-11-01 14:51:08.042
cmhgeh40g000766n3mtnk6wmj	cmhcc8p1o000atqgxpzkeao00	cmhf8lj7e000p140lj8vn75re	LEAVE	2025-11-01 14:51:21.617
cmhgeh61g000d66n37hbt28u0	cmhcc8p1o000atqgxpzkeao00	cmhf8lj7e000p140lj8vn75re	JOIN	2025-11-01 14:51:24.244
cmhgeh7zj000h66n3b259yltl	cmhcc8p1o000atqgxpzkeao00	cmhf8lj7e000p140lj8vn75re	LEAVE	2025-11-01 14:51:26.767
cmhgeh9u3000n66n3ckavu5m4	cmhcc8p1o000atqgxpzkeao00	cmhf8lj7e000p140lj8vn75re	JOIN	2025-11-01 14:51:29.163
cmhgehbn8000r66n310f5mhh1	cmhcc8p1o000atqgxpzkeao00	cmhf8lj7e000p140lj8vn75re	LEAVE	2025-11-01 14:51:31.508
cmhig5nmm000b141vt9zyatol	cmfgpklkn000114lt1n0ec61k	cmhig5a250003141vy1jnjkhu	JOIN	2025-11-03 01:13:58.75
cmhig62sr000h141v1wgy3bom	cmh36n1zs0005td07t6m368m7	cmhig5a250003141vy1jnjkhu	JOIN	2025-11-03 01:14:18.411
cmhigzpn70027141vpmarbxrs	cmhc7jd8w0006x7g1c2qc46o4	cmhigz2jf001z141v5012hxhq	JOIN	2025-11-03 01:37:21.043
cmhilmxbe000f1lqo0to43ryg	cmhcegfin0006hcgendh83z40	cmhilmabz00071lqopqqkiukc	JOIN	2025-11-03 03:47:22.538
cmhily11k00111lqoff994er2	cmhc7jd8w0006x7g1c2qc46o4	cmhilxfdx000t1lqotcq44kxe	JOIN	2025-11-03 03:56:00.584
cmhiozkih001l1lqoql3vvk35	cmhc7jd8w0006x7g1c2qc46o4	cmhioy1cc00171lqofc2l8wzh	JOIN	2025-11-03 05:21:11.321
cmhipjqgx002l1lqombbbi2oi	cmhc7jd8w0006x7g1c2qc46o4	cmhipj6ev002d1lqogsziidg6	JOIN	2025-11-03 05:36:52.161
cmhjgzu190009117a11ry1phg	cmhcegfin0006hcgendh83z40	cmhjgzgq20001117aa962fuhz	JOIN	2025-11-03 18:25:12.91
cmhjiw7l00009c344e9fv9tng	cmhcegfin0006hcgendh83z40	cmhjiptsm0001c3444oz0v7qf	JOIN	2025-11-03 19:18:23.076
cmhjvpyjl00099i0qx1d14aii	cmgxdqce80000108q18y4npo0	cmhjvpkrz00019i0qdft4463a	JOIN	2025-11-04 01:17:26.434
cmhjwh21j001f9i0qs0wp3fvn	cmh36n1zs0005td07t6m368m7	cmhjwgmd300179i0qimtlfz3o	JOIN	2025-11-04 01:38:30.679
cmhk7akyx000zp1dnin6wrqzf	cmfgpklkn000114lt1n0ec61k	cmhk7abeh000rp1dn46fy94jn	JOIN	2025-11-04 06:41:24.393
cmhl1leam0009qg341bm4y7sk	cmfgpklkn000114lt1n0ec61k	cmhl1l1e10001qg34m9nbge0i	JOIN	2025-11-04 20:49:37.439
cmhl1ujix000vqg3400zrlbmt	cmfgpklkn000114lt1n0ec61k	cmhl1uacq000nqg34wu04xwvn	JOIN	2025-11-04 20:56:44.121
cmhl1uuhl0011qg34atw89hd5	cmhcegfin0006hcgendh83z40	cmhl1uacq000nqg34wu04xwvn	JOIN	2025-11-04 20:56:58.329
cmhl2c9yc001uqg34rqroql0e	cmfgpklkn000114lt1n0ec61k	cmhl2btuq001mqg348jq0sk3v	JOIN	2025-11-04 21:10:31.525
cmhl2cns70020qg349cdjn11m	cmhc7jd8w0006x7g1c2qc46o4	cmhl2btuq001mqg348jq0sk3v	JOIN	2025-11-04 21:10:49.448
cmhl7f7n1000g72stbzzubwvx	cmhc7jd8w0006x7g1c2qc46o4	cmhl7estf000172ste4gw6ufs	JOIN	2025-11-04 23:32:46.573
cmhl7fh22000m72stveblr6rl	cmh36n1zs0005td07t6m368m7	cmhl7estf000172ste4gw6ufs	JOIN	2025-11-04 23:32:58.778
cmhl7fqk6000s72st3od9s0lm	cmgxzbcqh0000hak2a2jt0wwa	cmhl7estf000172ste4gw6ufs	JOIN	2025-11-04 23:33:11.094
cmhl7fz88000y72std9cvdukj	cmfiilojw000ao5ubr1d3vfk0	cmhl7estf000172ste4gw6ufs	JOIN	2025-11-04 23:33:22.329
cmhl7g934001472st9kxrbw00	cmhcegfin0006hcgendh83z40	cmhl7estf000172ste4gw6ufs	JOIN	2025-11-04 23:33:35.105
cmhl7hacs001872sty6z776jw	cmhcegfin0006hcgendh83z40	cmhl7estf000172ste4gw6ufs	LEAVE	2025-11-04 23:34:23.405
cmhl7hcrx001e72stjbg09qqj	cmhcegfin0006hcgendh83z40	cmhl7estf000172ste4gw6ufs	JOIN	2025-11-04 23:34:26.541
cmhl9k2kb002572stscrydpyf	cmgxdqce80000108q18y4npo0	cmhl9juw3001x72st1a9aci7j	JOIN	2025-11-05 00:32:32.508
cmhl9kbie002b72st9omp5ty1	cmfiilojw000ao5ubr1d3vfk0	cmhl9juw3001x72st1a9aci7j	JOIN	2025-11-05 00:32:44.102
cmhlabrnq003x72stbv7dpy8s	cmhcegfin0006hcgendh83z40	cmhlabhi0003p72stcmydpbw1	JOIN	2025-11-05 00:54:04.743
cmhlbo14m004e72st2x8axdzu	cmh36n1zs0005td07t6m368m7	cmhlbnrhr004672stj3oz6a8s	JOIN	2025-11-05 01:31:36.502
cmhlc4dnc000vhru488c40yb8	cmhcegfin0006hcgendh83z40	cmhlc4142000nhru4cnixqecy	JOIN	2025-11-05 01:44:19.224
cmhlfwnyi001khru40e7bvh3r	cmgxdqce80000108q18y4npo0	cmhlfwbp9001chru4iqqmzmtt	JOIN	2025-11-05 03:30:17.803
cmhlga01m0009tnfegvs19to6	cmgxdqce80000108q18y4npo0	cmhlg9nxr0001tnfeswd6oimc	JOIN	2025-11-05 03:40:39.994
cmhlkwxdx00093fyjh6mgtyod	cmhcc8p1o000atqgxpzkeao00	cmhlkweq000013fyjouplwznl	JOIN	2025-11-05 05:50:28.101
cmhll9wn6000v3fyj8qjba7sk	cmhcegfin0006hcgendh83z40	cmhll9iu1000n3fyjb4itb587	JOIN	2025-11-05 06:00:33.666
cmhllk5ka001j3fyjjuuw6752	cmhcegfin0006hcgendh83z40	cmhlljrtz001b3fyju6ayec2i	JOIN	2025-11-05 06:08:31.786
cmhllzvbv002o3fyjxvujbnkc	cmhcegfin0006hcgendh83z40	cmhllzihs002g3fyj6m6t6crl	JOIN	2025-11-05 06:20:45.02
cmhlpzjrc00363fyjzjiqsokz	cmh36n1zs0005td07t6m368m7	cmhlpyzw3002y3fyjy4vg3c83	JOIN	2025-11-05 08:12:28.488
cmhlr97w0000fwmw3qp3z0ae0	cmh36n1zs0005td07t6m368m7	cmhlr6bcx0007wmw3merpt6qo	JOIN	2025-11-05 08:47:59.28
cmhm7rvx10009xx9rcoxl9m0r	cmfgpklkn000114lt1n0ec61k	cmhm7rhjg0001xx9r4hvuxlhx	JOIN	2025-11-05 16:30:24.085
cmhm9gamq0012xx9rwr6lcxez	cmh36n1zs0005td07t6m368m7	cmhm9g12c000uxx9ry2rqybn8	JOIN	2025-11-05 17:17:22.515
cmhmaja59000llrhrx78okpjw	cmfgpklkn000114lt1n0ec61k	cmhmaizbw000dlrhroj4npjg7	JOIN	2025-11-05 17:47:41.469
cmhmbewz60009xskempq80dv1	cmfgpklkn000114lt1n0ec61k	cmhmbelwy0001xskel3wdmqba	JOIN	2025-11-05 18:12:17.395
cmhmhliwm0009h5w4coh64ss4	cmhcegfin0006hcgendh83z40	cmhmhl67p0001h5w42mdl7qi1	JOIN	2025-11-05 21:05:23.447
cmhmhlqlr000fh5w4boq06wrm	cmh36n1zs0005td07t6m368m7	cmhmhl67p0001h5w42mdl7qi1	JOIN	2025-11-05 21:05:33.423
cmhmhlzks000lh5w4r5inaukx	cmhc7jd8w0006x7g1c2qc46o4	cmhmhl67p0001h5w42mdl7qi1	JOIN	2025-11-05 21:05:45.052
cmhmicuh9000929idq5rkiq0b	cmhc7jd8w0006x7g1c2qc46o4	cmhmick19000129id11sb2sv2	JOIN	2025-11-05 21:26:38.158
cmhmj02dp00096cwi3uaty9wm	cmh36n1zs0005td07t6m368m7	cmhmizjud00016cwiogot6jzu	JOIN	2025-11-05 21:44:41.485
cmhmkkxrz0009i4ha8zgvf0bt	cmhcegfin0006hcgendh83z40	cmhmkkmx60001i4haupa9ek4r	JOIN	2025-11-05 22:28:54.912
cmhmlfbh10009ngzix9f8vwiy	cmfhsxf490000lmmnwp77vl6x	cmhmlf1yw0001ngziqwf0kifk	JOIN	2025-11-05 22:52:32.341
cmhmlfk4z000fngzin72sv2z4	cmgxzbcqh0000hak2a2jt0wwa	cmhmlf1yw0001ngziqwf0kifk	JOIN	2025-11-05 22:52:43.571
cmhmlfsym000lngzi4p582x4v	cmh36n1zs0005td07t6m368m7	cmhmlf1yw0001ngziqwf0kifk	JOIN	2025-11-05 22:52:55.006
cmhn6rcee0009p0dy4vr8r96o	cmfhsxf490000lmmnwp77vl6x	cmhn6r2ft0001p0dyvc3096qy	JOIN	2025-11-06 08:49:45.35
cmhn6rogw000fp0dy7xg9sg80	cmh36n1zs0005td07t6m368m7	cmhn6r2ft0001p0dyvc3096qy	JOIN	2025-11-06 08:50:00.993
cmhn6rxhs000lp0dyv9i6vtis	cmgxdqce80000108q18y4npo0	cmhn6r2ft0001p0dyvc3096qy	JOIN	2025-11-06 08:50:12.688
cmhn6s665000rp0dy4dj9l28p	cmgxzbcqh0000hak2a2jt0wwa	cmhn6r2ft0001p0dyvc3096qy	JOIN	2025-11-06 08:50:23.933
cmhn6sfn9000xp0dyef5z9o7s	cmfgpklkn000114lt1n0ec61k	cmhn6r2ft0001p0dyvc3096qy	JOIN	2025-11-06 08:50:36.213
cmhn6ssm40013p0dy8634ao97	cmh8axnya000me17r1py1t2xm	cmhn6r2ft0001p0dyvc3096qy	JOIN	2025-11-06 08:50:53.02
cmhnb8im7000nkw1j7zqinr6k	cmfgpklkn000114lt1n0ec61k	cmhnb891d000fkw1j09az9ccn	JOIN	2025-11-06 10:55:05.023
cmhohdrfv000deo2u6le21xux	cmhcegfin0006hcgendh83z40	cmhohdd4k0005eo2u4adsj5lp	JOIN	2025-11-07 06:34:53.612
cmhohe3uo000jeo2uxq5vyhdo	cmh36n1zs0005td07t6m368m7	cmhohdd4k0005eo2u4adsj5lp	JOIN	2025-11-07 06:35:09.696
cmhohech3000peo2uco3m7j5e	cmgxdqce80000108q18y4npo0	cmhohdd4k0005eo2u4adsj5lp	JOIN	2025-11-07 06:35:20.872
cmhohen4c000veo2u7z91pn1b	cmfiilojw000ao5ubr1d3vfk0	cmhohdd4k0005eo2u4adsj5lp	JOIN	2025-11-07 06:35:34.668
cmhohf1we0011eo2uz3bylamj	cmhc7jd8w0006x7g1c2qc46o4	cmhohdd4k0005eo2u4adsj5lp	JOIN	2025-11-07 06:35:53.822
cmhohtrdm002eeo2unnlk9b0b	cmhcegfin0006hcgendh83z40	cmhohtc750026eo2uynzst7dh	JOIN	2025-11-07 06:47:20.026
cmholvbmd004weo2uu7578o5t	cmhc7jd8w0006x7g1c2qc46o4	cmholuz8l004oeo2ux4k76e13	JOIN	2025-11-07 08:40:31.381
cmholvl500052eo2uq5rx7j4j	cmfgpmfbo000314ltz0jj7n1y	cmholuz8l004oeo2ux4k76e13	JOIN	2025-11-07 08:40:43.717
cmholvt7j0058eo2u931z26q7	cmh36n1zs0005td07t6m368m7	cmholuz8l004oeo2ux4k76e13	JOIN	2025-11-07 08:40:54.175
cmholw8x8005eeo2urfvp90rt	cmhcegfin0006hcgendh83z40	cmholuz8l004oeo2ux4k76e13	JOIN	2025-11-07 08:41:14.541
cmhooopgy000tdvi6uhfx4u4m	cmh36n1zs0005td07t6m368m7	cmhooodux000ldvi6x4x66lmg	JOIN	2025-11-07 09:59:21.586
cmhoooxyf000zdvi6uah21me8	cmgxdqce80000108q18y4npo0	cmhooodux000ldvi6x4x66lmg	JOIN	2025-11-07 09:59:32.584
cmhooq7ju0015dvi63ixuqvb6	cmgxzbcqh0000hak2a2jt0wwa	cmhooodux000ldvi6x4x66lmg	JOIN	2025-11-07 10:00:31.674
cmimekro5009mokexavwgeyk6	cmgxdqce80000108q18y4npo0	cmimekf730098okexf0o0oww2	JOIN	2025-12-01 00:20:31.637
cmimel04r009sokexleuifr5a	cmfgpklkn000114lt1n0ec61k	cmimekf730098okexf0o0oww2	JOIN	2025-12-01 00:20:42.604
cmimelh2l009zokexfvise42k	cmgxzbcqh0000hak2a2jt0wwa	cmimekf730098okexf0o0oww2	JOIN	2025-12-01 00:21:04.557
cmimicnxb000liaffoqicn2jo	cmhcegfin0006hcgendh83z40	cmimic9op000biaffodufnc10	JOIN	2025-12-01 02:06:11.999
cmimicvjs000riaff4qxy7vgn	cmh36n1zs0005td07t6m368m7	cmimic9op000biaffodufnc10	JOIN	2025-12-01 02:06:21.88
cminf7sus000cie6lhmqqryhv	cmhcegfin0006hcgendh83z40	cminf7h9d0004ie6l6wjx24r9	JOIN	2025-12-01 17:26:12.436
cmio2as1i0009qotc14ab1xp6	cmhcegfin0006hcgendh83z40	cmio2a85k0001qotccs6so6mf	JOIN	2025-12-02 04:12:22.518
cmio6xohc00092nuk3vt09ig7	cmhcegfin0006hcgendh83z40	cmio6xbu900012nuky5o963vy	JOIN	2025-12-02 06:22:09.457
cmio8gfwv0009yuosdsjohjzx	cmhcegfin0006hcgendh83z40	cmio8g4v70001yuosc61nzwfg	JOIN	2025-12-02 07:04:44.431
cmisrkx3l000xp50bh1j2vx22	cmfhsxf490000lmmnwp77vl6x	cmisrk0z1000pp50bcg4no9zl	JOIN	2025-12-05 11:11:10.737
cmiu72dam000dnbfdtr9x9nr5	cmfhsxf490000lmmnwp77vl6x	cmiu71qmn0005nbfdtekrha9q	JOIN	2025-12-06 11:12:25.295
cmiv0hi8x0019nbfdzi20dpc9	cmgxfcw0d0000o777zhox72xw	cmiv0h59g0011nbfdm8kuzcgj	JOIN	2025-12-07 00:56:00.418
cmiv0i4s0001fnbfd01dwnf43	cmgxzbcqh0000hak2a2jt0wwa	cmiv0h59g0011nbfdm8kuzcgj	JOIN	2025-12-07 00:56:29.617
\.


--
-- Data for Name: game_templates; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.game_templates (id, name, title, description, category, evidence_type, is_age_restricted, default_duration_hours, max_participants, instructions, example_evidence, is_active, is_vip_only, vip_tier, ui_theme, features, created_at, updated_at, difficulty_level, is_quick_start, risk_level, subcategory, success_rate, template_options, usage_count, title_translations, description_translations, instructions_translations, example_evidence_translations) FROM stdin;
cmgzc01dy0006yikfoeifhzat	quick_early_wake_up	6点早起健康挑战	从7:00起床调整到6:00起床，通过提前睡觉等方式保证充足睡眠。	HEALTH	PHOTO	f	168	8	每天提交起床时间证明和晨间活动照片，展示早起后的积极状态。	显示时间的起床自拍照和晨间活动照片	t	f	\N	\N	\N	2025-10-20 16:10:00.839	2025-12-05 22:51:31.583	INTERMEDIATE	t	LOW	HEALTH_SLEEP	\N	\N	0	{"en": "6 AM Early Wake-up Health Challenge", "es": "Desafío de Salud de Despertar Temprano a las 6 AM", "ja": "午前6時早起き健康チャレンジ"}	{"en": "Adjust wake-up time from 7:00 to 6:00 AM by going to bed earlier to ensure sufficient sleep. Achieve morning exercise goals through early rising and develop healthy sleep habits.", "es": "Ajuste la hora de despertar de 7:00 a 6:00 AM acostándose más temprano para asegurar un sueño suficiente. Logre objetivos de ejercicio matutino a través del despertar temprano y desarrolle hábitos de sueño saludables.", "ja": "早く寝ることで起床時間を7:00から6:00に調整し、十分な睡眠を確保します。早起きを通じて朝の運動目標を達成し、健康的な睡眠習慣を養います。"}	{"en": "Submit daily wake-up time proof and morning activity photos, record early rising gains and feelings. Keep recording sleep quality and mental state changes, share positive impacts of early rising life.", "es": "Envíe prueba diaria de hora de despertar y fotos de actividades matutinas, registre ganancias y sensaciones del despertar temprano. Mantenga el registro de cambios en la calidad del sueño y el estado mental, comparta impactos positivos de la vida de despertar temprano.", "ja": "毎日の起床時間の証明と朝の活動写真を提出し、早起きの収穫と感想を記録してください。睡眠の質と精神状態の変化を記録し続け、早起き生活の積極的な影響を共有してください。"}	{"en": "Morning photo at 6:00 AM showing clock or phone time", "es": "Foto matutina a las 6:00 AM", "ja": "午前6時の朝の写真"}
cmgzc01ef0009yikfwfkwech6	quick_productivity_boost	效率提升挑战	每天使用番茄工作法完成3个专注时段，提升工作效率。	PERSONAL	PHOTO	f	168	6	每天提交番茄工作法app记录截图和完成任务清单。	番茄工作法app记录和任务完成截图	t	f	\N	\N	\N	2025-10-20 16:10:00.856	2025-12-05 22:51:31.605	BEGINNER	t	LOW	PERSONAL_PRODUCTIVITY	\N	\N	0	{"en": "Pomodoro Technique Productivity Boost", "es": "Impulso de Productividad con Técnica Pomodoro", "ja": "ポモドーロテクニックによる生産性向上"}	{"en": "Use Pomodoro Technique for time management, arrange 4 time blocks daily, aiming to improve focus and work efficiency through systematic time management.", "es": "Use la Técnica Pomodoro para la gestión del tiempo, organice 4 bloques de tiempo diariamente, con el objetivo de mejorar el enfoque y la eficiencia laboral a través de la gestión sistemática del tiempo.", "ja": "ポモドーロテクニックを使用して時間管理を行い、毎日4つの時間ブロックを配置し、体系的な時間管理を通じて集中力と作業効率の向上を目指します。"}	{"en": "Work using Pomodoro Technique, 25 minutes per pomodoro with 5-minute breaks. Submit work duration records and completed task screenshots, record focus and efficiency improvements.", "es": "Trabaje usando la Técnica Pomodoro, 25 minutos por pomodoro con descansos de 5 minutos. Envíe registros de duración del trabajo y capturas de pantalla de tareas completadas, registre mejoras en el enfoque y la eficiencia.", "ja": "ポモドーロテクニックを使用して作業し、1ポモドーロ25分、5分の休憩を取ります。作業時間の記録と完了したタスクのスクリーンショットを提出し、集中力と効率の向上を記録してください。"}	{"en": "To-do list showing 3 completed important tasks", "es": "Lista de tareas mostrando 3 tareas completadas", "ja": "3つの完了したタスクを示すToDoリスト"}
cmglleuod0003187gb5mr151u	language_learning	语言学习打卡 (VIP专享)	承诺每天学习外语30分钟，VIP用户享受学习进度分析和个性化建议	LEARNING	PHOTO	f	336	20	拍摄学习app界面、笔记或练习材料的照片	单词本、学习app进度截图或口语练习视频	t	t	BASIC	\N	\N	2025-10-11 01:24:42.06	2025-10-27 16:53:02.266	BEGINNER	f	LOW	LEARNING_LANGUAGE	\N	\N	0	\N	\N	\N	\N
cmhgopmaj000kurpfdjohffxk	learning_reading_daily	每日阅读30分钟	每天阅读30分钟，培养阅读习惯	LEARNING	PHOTO	f	168	15	每天拍摄阅读照片，包括书籍和阅读进度	正在阅读的书籍照片，配上阅读笔记	t	f	\N	\N	\N	2025-11-01 19:37:54.716	2025-12-05 10:51:00.892	BEGINNER	t	LOW	LEARNING_READING	\N	\N	0	{"en": "Daily Reading 30 Minutes", "es": "Lectura Diaria 30 Minutos", "ja": "毎日30分読書"}	{"en": "Read for 30 minutes daily to develop good reading habits.", "es": "Lee durante 30 minutos al día para desarrollar buenos hábitos de lectura.", "ja": "毎日30分読書し、良い読書習慣を養います。"}	{"en": "Take daily photos of your reading, including book cover and progress.", "es": "Toma fotos diarias de tu lectura, incluyendo la portada del libro.", "ja": "毎日読書の写真を撮影してください。"}	{"en": "Photo of the book being read with reading notes", "es": "Foto del libro con notas de lectura", "ja": "読んでいる本の写真と読書ノート"}
cmhgopmam000lurpfw78g0ik3	learning_reading_book	一周读完一本书	一周内读完一本书，提升知识储备	LEARNING	PHOTO	f	168	10	每天拍摄阅读进度，最后提交读书笔记	书籍封面+阅读进度+读书笔记照片	t	f	\N	\N	\N	2025-11-01 19:37:54.719	2025-12-05 10:51:00.898	INTERMEDIATE	f	LOW	LEARNING_READING	\N	\N	0	{"en": "Finish One Book in a Week", "es": "Terminar Un Libro en Una Semana", "ja": "1週間で1冊読破"}	{"en": "Read and finish one book within a week to improve reading speed and comprehension.", "es": "Lee y termina un libro en una semana para mejorar la velocidad de lectura.", "ja": "1週間で1冊の本を読み終え、読書速度を向上させます。"}	{"en": "Submit daily reading progress photos and final book review.", "es": "Envía fotos diarias del progreso de lectura y reseña final del libro.", "ja": "毎日読書進捗の写真と最終的な書評を提出してください。"}	{"en": "Daily reading progress photos + final book review", "es": "Fotos diarias del progreso de lectura + reseña final del libro", "ja": "毎日の読書進捗写真+最終書評"}
cmh9dmbwo0000yd6207rjp4os	vip_premium_fitness	高级健身追踪 (VIP专享)	专业级健身挑战，包含详细数据分析和个性化建议，VIP用户专享高级功能	FITNESS	PHOTO	f	336	20	使用专业健身app记录，提交详细的运动数据截图。VIP用户可享受数据分析和进度追踪功能。	健身app显示心率、卡路里、运动轨迹的综合截图	t	t	BASIC	\N	\N	2025-10-27 16:53:02.277	2025-10-27 16:53:02.277	BEGINNER	f	LOW	其他	\N	\N	0	\N	\N	\N	\N
cmglleuq2000r187gxo4qtiy8	gaming_achievement	游戏成就挑战	在喜欢的游戏中完成特定成就或挑战，享受游戏乐趣	ENTERTAINMENT	PHOTO	f	336	12	拍摄游戏成就或进度截图	游戏成就截图或游戏进度照片	t	f	\N	\N	\N	2025-10-11 01:24:42.122	2025-10-11 01:24:42.122	BEGINNER	f	LOW	ENTERTAINMENT_GAMING	\N	\N	0	\N	\N	\N	\N
cmglleuq5000s187gtx3lzu6z	music_discovery	音乐探索之旅	每天发现和欣赏新的音乐作品，扩展音乐品味	ENTERTAINMENT	PHOTO	f	336	20	拍摄音乐播放界面或音乐相关照片	音乐app播放截图或音乐会照片	t	f	\N	\N	\N	2025-10-11 01:24:42.124	2025-10-11 01:24:42.124	BEGINNER	f	LOW	ENTERTAINMENT_MUSIC	\N	\N	0	\N	\N	\N	\N
cmglleuq7000t187g1tma96ro	minimalist_lifestyle	极简生活实践	践行极简主义生活方式，减少物质负担，专注重要事物	LIFESTYLE	PHOTO	f	336	10	拍摄整理后的简洁空间照片	整理后的房间或物品收纳照片	t	f	\N	\N	\N	2025-10-11 01:24:42.126	2025-10-11 01:24:42.126	BEGINNER	f	LOW	LIFESTYLE_HOME	\N	\N	0	\N	\N	\N	\N
cmglleuq9000u187gpj7jq5nw	local_exploration	本地探索发现	探索居住城市的新地方，发现身边的美好	LIFESTYLE	PHOTO	f	168	15	拍摄探索的新地点照片	新发现的咖啡厅、公园或景点照片	t	f	\N	\N	\N	2025-10-11 01:24:42.128	2025-10-11 01:24:42.128	BEGINNER	f	LOW	LIFESTYLE_TRAVEL	\N	\N	0	\N	\N	\N	\N
cmglleuqb000v187gd2k12prq	programming_practice	编程技能提升	每天练习编程，完成算法题或项目开发，提升技术能力	LEARNING	PHOTO	f	336	8	拍摄代码截图或项目进展照片	代码编辑器截图或项目运行结果	t	f	\N	\N	\N	2025-10-11 01:24:42.13	2025-10-11 01:24:42.13	BEGINNER	f	LOW	LEARNING_SKILL	\N	\N	0	\N	\N	\N	\N
cmglleuqd000w187gcxn2qmrq	exam_preparation	考试备考计划	制定并执行考试复习计划，系统性地准备重要考试	LEARNING	PHOTO	f	672	15	拍摄学习资料、笔记或复习进度照片	复习笔记、教材或模拟考试成绩	t	f	\N	\N	\N	2025-10-11 01:24:42.132	2025-10-11 01:24:42.132	BEGINNER	f	LOW	LEARNING_EXAM	\N	\N	0	\N	\N	\N	\N
cmglleuqf000x187gggmoc5ex	stress_management	压力管理挑战	学习和实践压力管理技巧，保持心理平衡和情绪稳定	HEALTH	TEXT	f	336	12	记录压力管理方法和效果	情绪日记或压力管理技巧记录	t	f	\N	\N	\N	2025-10-11 01:24:42.134	2025-10-11 01:24:42.134	BEGINNER	f	LOW	HEALTH_MENTAL	\N	\N	0	\N	\N	\N	\N
cmglleuqh000y187gh5bzd023	basic_fitness	基础健身挑战	每天进行基础健身运动，包括俯卧撑、仰卧起坐等	FITNESS	PHOTO	f	168	8	拍摄健身运动照片	做俯卧撑或其他健身动作的照片	t	f	\N	\N	\N	2025-10-11 01:24:42.136	2025-10-11 01:24:42.136	BEGINNER	f	LOW	FITNESS_STRENGTH	\N	\N	0	\N	\N	\N	\N
cmglleuqj000z187g480pzrit	basic_personal	个人成长挑战	每天进行自我反思和个人成长活动	PERSONAL	TEXT	f	168	6	写下每天的成长感悟	今天学到了什么新知识或技能	t	f	\N	\N	\N	2025-10-11 01:24:42.138	2025-10-11 01:24:42.138	BEGINNER	f	LOW	PERSONAL_GROWTH	\N	\N	0	\N	\N	\N	\N
cmglleuql0010187gmhepo7vv	basic_lifestyle	生活方式改善	改善日常生活习惯，提升生活质量	LIFESTYLE	PHOTO	f	168	8	拍摄生活改善的照片	整理房间、健康饮食等照片	t	f	\N	\N	\N	2025-10-11 01:24:42.14	2025-10-11 01:24:42.14	BEGINNER	f	LOW	LIFESTYLE_HOME	\N	\N	0	\N	\N	\N	\N
cmglleuny0000187ge0fynepu	daily_exercise	每日运动挑战	承诺每天进行至少30分钟的运动锻炼，包括跑步、健身、瑜伽等各种形式的体育活动，通过坚持运动养成健康的生活习惯	FITNESS	PHOTO	f	168	6	每天拍摄运动照片或视频作为证据，包括运动类型和时长	跑步30分钟的照片，显示运动app记录	t	f	\N	\N	\N	2025-10-11 01:24:42.044	2025-10-11 01:24:42.044	BEGINNER	t	LOW	FITNESS_CARDIO	\N	\N	0	\N	\N	\N	\N
cmglleuo70001187gxr1fbs82	early_wake_up	早起挑战	承诺每天早上6点前起床，培养早睡早起的健康作息习惯，提高一天的工作和学习效率，享受清晨的宁静时光	HEALTH	PHOTO	f	168	8	每天早上6点前拍摄起床照片，显示时间	显示时间的起床自拍照	t	f	\N	\N	\N	2025-10-11 01:24:42.054	2025-10-11 01:24:42.054	BEGINNER	t	LOW	HEALTH_SLEEP	\N	\N	0	\N	\N	\N	\N
cmhgopmb9000wurpfuerj6vlm	lifestyle_hobby_photography	每日摄影练习	每天拍摄一张有意义的照片，提升摄影技能	LIFESTYLE	PHOTO	f	168	12	每天提交一张摄影作品	今日拍摄的风景/人物/静物照片	t	f	\N	\N	\N	2025-11-01 19:37:54.742	2025-12-05 10:51:00.976	BEGINNER	t	LOW	LIFESTYLE_HOBBY	\N	\N	0	{"en": "Daily Photography Practice", "es": "Práctica Diaria de Fotografía", "ja": "毎日写真撮影練習"}	{"en": "Take and edit one photo daily to improve photography skills.", "es": "Toma y edita una foto al día para mejorar las habilidades fotográficas.", "ja": "毎日1枚の写真を撮影し編集し、写真スキルを向上させます。"}	{"en": "Submit daily photography works with brief descriptions.", "es": "Envía trabajos fotográficos diarios con breves descripciones.", "ja": "毎日写真作品と簡単な説明を提出してください。"}	{"en": "Daily photography works with shooting parameters", "es": "Trabajos fotográficos diarios con parámetros de disparo", "ja": "撮影パラメータ付きの毎日の写真作品"}
cmhgopmb1000surpfpb8kcklm	lifestyle_home_cleaning	每日整理收纳	每天整理家中一个区域，保持整洁有序	LIFESTYLE	PHOTO	f	168	10	每天拍摄整理前后对比照片	书桌整理前后对比照片	t	f	\N	\N	\N	2025-11-01 19:37:54.733	2025-12-05 10:51:00.947	BEGINNER	t	LOW	LIFESTYLE_HOME	\N	\N	0	{"en": "Daily Organization & Decluttering", "es": "Organización y Orden Diario", "ja": "毎日整理整頓"}	{"en": "Organize and clean one area daily to maintain a tidy living environment.", "es": "Organiza y limpia un área al día para mantener un ambiente ordenado.", "ja": "毎日1つのエリアを整理整頓し、きれいな生活環境を維持します。"}	{"en": "Submit daily before and after photos of the organized area.", "es": "Envía fotos diarias de antes y después del área organizada.", "ja": "毎日整理したエリアのビフォーアフター写真を提出してください。"}	{"en": "Before and after photos of organized space", "es": "Fotos de antes y después del espacio organizado", "ja": "整理されたスペースのビフォーアフター写真"}
cmglleuoa0002187g66sus0ru	daily_reading	每日阅读挑战	承诺每天阅读至少30分钟，培养良好的阅读习惯，提升知识储备和思维能力	LEARNING	PHOTO	f	168	10	每天拍摄正在阅读的照片，包括书籍封面和阅读环境	手持书籍阅读的照片，显示书名和页数	t	f	\N	\N	\N	2025-10-11 01:24:42.058	2025-10-11 01:24:42.058	BEGINNER	t	LOW	LEARNING_READING	\N	\N	0	\N	\N	\N	\N
cmglleuog0004187gg6xsr39r	skill_practice	技能练习挑战	每天练习一项技能，如乐器演奏、绘画、编程或手工制作，通过持续练习提升专业能力	LEARNING	PHOTO	f	336	6	拍摄练习过程或作品的照片/视频	弹奏乐器的视频、绘画作品或代码截图	t	f	\N	\N	\N	2025-10-11 01:24:42.063	2025-10-11 01:24:42.063	BEGINNER	f	LOW	LEARNING_SKILL	\N	\N	0	\N	\N	\N	\N
cmglleuok0005187gn7ut4kid	running_challenge	跑步训练计划	制定跑步训练计划，逐步提升跑步距离和速度，增强心肺功能和体能	FITNESS	PHOTO	f	504	12	每次跑步后拍摄运动app记录或跑步路线截图	跑步app显示距离、时间和路线的截图	t	f	\N	\N	\N	2025-10-11 01:24:42.066	2025-10-11 01:24:42.066	BEGINNER	f	LOW	FITNESS_CARDIO	\N	\N	0	\N	\N	\N	\N
cmglleuon0006187g11n0c4wi	gym_workout	健身房训练	定期进行力量训练和器械锻炼，塑造身材，增强肌肉力量和耐力	FITNESS	PHOTO	f	336	8	拍摄健身房训练照片，包括使用的器械和训练动作	在健身房进行器械训练的照片	t	f	\N	\N	\N	2025-10-11 01:24:42.07	2025-10-11 01:24:42.07	BEGINNER	f	LOW	FITNESS_STRENGTH	\N	\N	0	\N	\N	\N	\N
cmglleuop0007187gana8cfuc	yoga_practice	瑜伽冥想练习	每天进行瑜伽练习，提高身体柔韧性，缓解压力，达到身心平衡	FITNESS	PHOTO	f	336	10	拍摄瑜伽练习照片或视频，展示瑜伽动作	瑜伽垫上练习瑜伽动作的照片	t	f	\N	\N	\N	2025-10-11 01:24:42.072	2025-10-11 01:24:42.072	BEGINNER	f	LOW	FITNESS_YOGA	\N	\N	0	\N	\N	\N	\N
cmglleuor0008187gg66hl3eo	productivity_boost	效率提升挑战	通过时间管理技巧和工作方法优化，提高工作和学习效率	PERSONAL	PHOTO	f	336	8	拍摄时间管理工具、待办清单或工作成果的照片	完成的任务清单或时间管理app截图	t	f	\N	\N	\N	2025-10-11 01:24:42.075	2025-10-11 01:24:42.075	BEGINNER	f	LOW	PERSONAL_PRODUCTIVITY	\N	\N	0	\N	\N	\N	\N
cmglleuou0009187gvokewit5	creative_expression	创意表达挑战	每天进行创意活动，如绘画、写作、摄影或手工制作，激发创造力	PERSONAL	PHOTO	f	336	10	拍摄创作过程或作品的照片	绘画作品、手工制品或摄影作品	t	f	\N	\N	\N	2025-10-11 01:24:42.077	2025-10-11 01:24:42.077	BEGINNER	f	LOW	PERSONAL_CREATIVITY	\N	\N	0	\N	\N	\N	\N
cmglleuow000a187g6buthcwx	water_intake	每日饮水	承诺每天喝足8杯水（约2000毫升），保持身体充足的水分摄入，促进新陈代谢，维护身体健康和皮肤状态	HEALTH	PHOTO	f	168	12	每天记录饮水量，拍摄水杯或饮水app截图	显示当日饮水量的app截图	t	f	\N	\N	\N	2025-10-11 01:24:42.079	2025-10-11 01:24:42.079	BEGINNER	f	LOW	HEALTH_DIET	\N	\N	0	\N	\N	\N	\N
cmglleuoy000b187g151p3d9r	cooking_challenge	烹饪技能提升	每天尝试制作不同的菜品，提升烹饪技能，享受美食制作的乐趣	LIFESTYLE	PHOTO	f	336	8	拍摄烹饪过程和完成的菜品照片	制作完成的菜品照片，展示色香味	t	f	\N	\N	\N	2025-10-11 01:24:42.082	2025-10-11 01:24:42.082	BEGINNER	f	LOW	LIFESTYLE_COOKING	\N	\N	0	\N	\N	\N	\N
cmglleup3000c187g54yvah1w	home_organization	居家整理挑战	每天整理家中的一个区域，创造整洁有序的生活环境	LIFESTYLE	PHOTO	f	168	10	拍摄整理前后的对比照片	整理后的房间或储物空间照片	t	f	\N	\N	\N	2025-10-11 01:24:42.086	2025-10-11 01:24:42.086	BEGINNER	f	LOW	LIFESTYLE_HOME	\N	\N	0	\N	\N	\N	\N
cmglleup5000d187gu9251idn	gardening_hobby	园艺种植体验	种植花草或蔬菜，体验园艺的乐趣，观察植物的生长过程	LIFESTYLE	PHOTO	f	672	6	拍摄植物生长过程的照片	种子发芽、植物生长的阶段性照片	t	f	\N	\N	\N	2025-10-11 01:24:42.088	2025-10-11 01:24:42.088	BEGINNER	f	LOW	LIFESTYLE_HOME	\N	\N	0	\N	\N	\N	\N
cmglleup7000e187g4zdqf7xk	social_connection	社交联系挑战	每天主动联系一位朋友或家人，增进人际关系，扩展社交圈	SOCIAL	TEXT	f	168	12	记录每天的社交活动和感受	与朋友聊天的截图或聚会照片（保护隐私）	t	f	\N	\N	\N	2025-10-11 01:24:42.09	2025-10-11 01:24:42.09	BEGINNER	f	LOW	SOCIAL_FRIENDSHIP	\N	\N	0	\N	\N	\N	\N
cmglleup9000f187g7x7zw65p	gratitude_journal	感恩日记记录	每天记录三件感恩的事情，培养积极心态，提升幸福感	PERSONAL	TEXT	f	336	15	每天写下感恩的事情和感受	感恩日记的文字记录	t	f	\N	\N	\N	2025-10-11 01:24:42.092	2025-10-11 01:24:42.092	BEGINNER	t	LOW	PERSONAL_PRODUCTIVITY	\N	\N	0	\N	\N	\N	\N
cmglleupb000g187gtdaev37v	meditation	冥想练习	承诺每天进行15分钟冥想练习，通过正念冥想缓解压力，提高专注力和内心平静，培养身心健康的生活方式	HEALTH	PHOTO	f	336	8	每天拍摄冥想环境或冥想app记录	冥想app显示完成15分钟冥想的截图	t	f	\N	\N	\N	2025-10-11 01:24:42.094	2025-10-11 01:24:42.094	BEGINNER	f	LOW	HEALTH_MENTAL	\N	\N	0	\N	\N	\N	\N
cmglleupd000h187g0bqnfva6	no_social_media	戒断社交媒体	承诺一周内不使用社交媒体平台，减少数字设备依赖，专注于现实生活中的人际交往和个人成长，提高生活质量	PERSONAL	PHOTO	t	168	6	每天截图手机使用时间，证明未使用社交媒体	手机屏幕使用时间截图，显示社交媒体使用时间为0	t	f	\N	\N	\N	2025-10-11 01:24:42.096	2025-10-11 01:24:42.096	BEGINNER	f	LOW	PERSONAL_PRODUCTIVITY	\N	\N	0	\N	\N	\N	\N
cmglleupi000j187g5tkl9wy0	language_learning_advanced	语言学习打卡	承诺每天学习外语30分钟，通过持续的语言学习提高外语水平，拓展国际视野，为未来的学习和工作打下坚实基础	LEARNING	PHOTO	f	336	15	每天拍摄学习进度截图或学习笔记	语言学习app显示今日完成30分钟学习的截图	t	f	\N	\N	\N	2025-10-11 01:24:42.101	2025-10-11 01:24:42.101	BEGINNER	f	LOW	LEARNING_LANGUAGE	\N	\N	0	\N	\N	\N	\N
cmglleupl000k187gn5z2vrwu	startup_daily_progress	创业项目日进展	每天推进创业项目，记录进展和成果，保持创业动力和执行力	WORK	PHOTO	f	336	6	拍摄工作进展、产品开发或商务会议的照片	代码提交记录、产品原型或会议讨论照片	t	f	\N	\N	\N	2025-10-11 01:24:42.104	2025-10-11 01:24:42.104	BEGINNER	f	LOW	WORK_STARTUP	\N	\N	0	\N	\N	\N	\N
cmglleupf000i187gnmhfkdp7	weather_prediction	天气预测挑战 (VIP专享)	预测未来一周的天气情况，VIP用户可参与更大规模的预测竞赛	WEATHER	TEXT	f	168	25	每天提交对次日天气的预测，包括温度和天气状况	明天最高温度25°C，多云转晴	t	t	BASIC	\N	\N	2025-10-11 01:24:42.099	2025-10-27 16:53:02.275	BEGINNER	f	LOW	其他	\N	\N	0	\N	\N	\N	\N
cmglleupn000l187go0h227ub	business_plan_development	商业计划完善	每天完善商业计划的一个部分，系统性地构建创业项目的商业模式	WORK	TEXT	f	504	8	记录每天完善的商业计划内容和思考	商业计划文档截图或思维导图	t	f	\N	\N	\N	2025-10-11 01:24:42.106	2025-10-11 01:24:42.106	BEGINNER	f	LOW	WORK_STARTUP	\N	\N	0	\N	\N	\N	\N
cmglleupp000m187g1c7j6gs1	networking_challenge	商务社交拓展	每天主动联系一位行业人士或潜在合作伙伴，扩展商务网络	WORK	TEXT	f	168	10	记录联系的人员和交流内容（保护隐私）	商务交流记录或会议安排截图	t	f	\N	\N	\N	2025-10-11 01:24:42.109	2025-10-11 01:24:42.109	BEGINNER	f	LOW	WORK_STARTUP	\N	\N	0	\N	\N	\N	\N
cmglleupr000n187grlg10d2r	friend_meetup_challenge	朋友聚会计划	定期组织朋友聚会，增进友谊，创造美好回忆	SOCIAL	PHOTO	f	336	12	拍摄聚会照片，记录美好时光	朋友聚会的合影或活动照片	t	f	\N	\N	\N	2025-10-11 01:24:42.111	2025-10-11 01:24:42.111	BEGINNER	f	LOW	SOCIAL_FRIENDSHIP	\N	\N	0	\N	\N	\N	\N
cmglleupu000o187ggs81iu5j	community_volunteer	社区志愿服务	参与社区志愿活动，帮助他人，回馈社会	SOCIAL	PHOTO	f	168	15	拍摄志愿服务活动照片	参与志愿活动的照片或服务证明	t	f	\N	\N	\N	2025-10-11 01:24:42.113	2025-10-11 01:24:42.113	BEGINNER	f	LOW	SOCIAL_COMMUNITY	\N	\N	0	\N	\N	\N	\N
cmglleupy000p187gxq6u1n6s	family_bonding	家庭亲情时光	每天安排时间与家人相处，增进家庭关系，创造温馨时光	SOCIAL	PHOTO	f	336	20	拍摄与家人相处的温馨照片	家庭聚餐、游戏或聊天的照片	t	f	\N	\N	\N	2025-10-11 01:24:42.118	2025-10-11 01:24:42.118	BEGINNER	f	LOW	SOCIAL_FAMILY	\N	\N	0	\N	\N	\N	\N
cmglleuq0000q187gzl6nps3e	movie_marathon	电影观赏计划	按计划观看经典电影或热门影片，丰富文化生活，拓展视野	ENTERTAINMENT	PHOTO	f	336	15	拍摄观影环境或电影海报照片	电影票根、观影环境或影评笔记	t	f	\N	\N	\N	2025-10-11 01:24:42.12	2025-10-11 01:24:42.12	BEGINNER	f	LOW	ENTERTAINMENT_MEDIA	\N	\N	0	\N	\N	\N	\N
cmhgopm9t0008urpf8izloqil	fitness_cardio_running	每日跑步5公里	每天跑步5公里，提升心肺功能和耐力	FITNESS	PHOTO	f	168	10	每天拍摄跑步app记录截图，显示距离和时间	跑步app显示5.2公里，用时30分钟的截图	t	f	\N	\N	\N	2025-11-01 19:37:54.689	2025-12-05 10:51:00.815	INTERMEDIATE	t	LOW	FITNESS_CARDIO	\N	\N	0	{"en": "Daily 5K Run", "es": "Carrera Diaria de 5K", "ja": "毎日5キロランニング"}	{"en": "Run 5 kilometers daily to improve cardiovascular fitness and physical condition.", "es": "Corre 5 kilómetros al día para mejorar la condición cardiovascular.", "ja": "毎日5キロ走り、心肺機能を向上させます。"}	{"en": "Submit daily running route screenshots and completion time records.", "es": "Envía capturas de pantalla diarias de la ruta de carrera.", "ja": "毎日ランニングルートのスクリーンショットを提出してください。"}	{"en": "Running app route and time record screenshots", "es": "Capturas de pantalla de la ruta y el tiempo", "ja": "ランニングアプリのルートと時間のスクリーンショット"}
cmhgopma3000curpfe4pmxfqo	fitness_strength_pushups	俯卧撑挑战	每天完成50个俯卧撑，提升上肢力量	FITNESS	PHOTO	f	168	10	每天拍摄俯卧撑训练照片或视频	俯卧撑训练照片，配上完成数量记录	t	f	\N	\N	\N	2025-11-01 19:37:54.699	2025-12-05 10:51:00.837	BEGINNER	t	LOW	FITNESS_STRENGTH	\N	\N	0	{"en": "Push-Up Challenge", "es": "Desafío de Flexiones", "ja": "腕立て伏せチャレンジ"}	{"en": "Complete 100 push-ups daily to build upper body strength.", "es": "Completa 100 flexiones al día para desarrollar fuerza en la parte superior del cuerpo.", "ja": "毎日100回腕立て伏せを完了し、上半身の筋力を鍛えます。"}	{"en": "Submit daily push-up completion photos or videos.", "es": "Envía fotos o videos diarios de flexiones completadas.", "ja": "毎日腕立て伏せ完了の写真またはビデオを提出してください。"}	{"en": "Push-up completion video or photo with counter", "es": "Video o foto de flexiones completadas con contador", "ja": "カウンター付きの腕立て伏せ完了ビデオまたは写真"}
cmhgopma9000furpfietp22xb	learning_language_english	英语学习打卡	每天学习英语30分钟，背单词、练听力、学语法	LEARNING	PHOTO	f	168	15	每天拍摄学习app截图或学习笔记照片	英语学习app显示今日学习30分钟的截图	t	f	\N	\N	\N	2025-11-01 19:37:54.706	2025-12-05 10:51:00.859	BEGINNER	t	LOW	LEARNING_LANGUAGE	\N	\N	0	{"en": "English Learning Check-in", "es": "Registro de Aprendizaje de Inglés", "ja": "英語学習チェックイン"}	{"en": "Study English for 30 minutes daily through vocabulary, grammar, and speaking practice.", "es": "Estudia inglés 30 minutos al día mediante vocabulario, gramática y práctica oral.", "ja": "毎日30分間英語を学習します。"}	{"en": "Submit daily learning screenshots or practice records.", "es": "Envía capturas de pantalla diarias de aprendizaje.", "ja": "毎日学習のスクリーンショットを提出してください。"}	{"en": "English learning app screenshots", "es": "Capturas de pantalla de la aplicación de aprendizaje de inglés", "ja": "英語学習アプリのスクリーンショット"}
cmhgopmbw0016urpfhfkreqqy	quick_plank_challenge	平板支撑挑战	每天平板支撑累计3分钟，增强核心力量	FITNESS	PHOTO	f	168	12	每天拍摄平板支撑照片或计时器	平板支撑姿势照片+计时器显示3分钟	t	f	\N	\N	\N	2025-11-01 19:37:54.764	2025-12-05 10:51:01.045	BEGINNER	t	LOW	FITNESS_STRENGTH	\N	\N	0	{"en": "Plank Challenge", "es": "Desafío de Plancha", "ja": "プランクチャレンジ"}	{"en": "Hold plank position for increasing duration daily to build core strength.", "es": "Mantén la posición de plancha durante una duración creciente diariamente.", "ja": "毎日プランクの姿勢を保持し、体幹の強さを鍛えます。"}	{"en": "Submit daily plank completion photos or videos with timer.", "es": "Envía fotos o videos diarios de finalización de plancha con temporizador.", "ja": "毎日タイマー付きのプランク完了の写真またはビデオを提出してください。"}	{"en": "Plank position photo or video with timer showing duration", "es": "Foto o video de posición de plancha con temporizador mostrando duración", "ja": "持続時間を示すタイマー付きのプランク姿勢の写真またはビデオ"}
cmhgopmcv001ourpfomhqixsl	advanced_side_hustle	副业启动计划	启动并运营一个副业项目，增加收入来源	WORK	PHOTO	f	672	6	每天记录副业进展和收入	项目进展截图+收入记录	t	f	\N	\N	\N	2025-11-01 19:37:54.799	2025-12-05 10:51:01.172	ADVANCED	t	MEDIUM	CAREER_STARTUP	\N	\N	0	{"en": "Side Hustle Development", "es": "Desarrollo de Negocio Secundario", "ja": "副業開発"}	{"en": "Build a side business with daily progress on product development, marketing, and sales.", "es": "Construye un negocio secundario con progreso diario en desarrollo de productos, marketing y ventas.", "ja": "製品開発、マーケティング、販売で毎日進捗を重ねて副業を構築します。"}	{"en": "Submit daily business development records including tasks completed and revenue generated.", "es": "Envía registros diarios de desarrollo empresarial incluyendo tareas completadas e ingresos generados.", "ja": "毎日完了したタスクと生成された収益を含むビジネス開発記録を提出してください。"}	{"en": "Business development logs + revenue screenshots + customer feedback", "es": "Registros de desarrollo empresarial + capturas de pantalla de ingresos + comentarios de clientes", "ja": "ビジネス開発ログ+収益のスクリーンショット+顧客フィードバック"}
cmhgopmbo0012urpftr1wrtro	career_skills_certification	职业认证学习	每天学习职业认证课程1小时	WORK	PHOTO	f	168	10	每天拍摄学习平台进度截图	在线课程学习进度截图	t	f	\N	\N	\N	2025-11-01 19:37:54.756	2025-12-05 10:51:01.013	INTERMEDIATE	f	LOW	CAREER_SKILLS	\N	\N	0	{"en": "Professional Certification Study", "es": "Estudio de Certificación Profesional", "ja": "職業認定学習"}	{"en": "Study for professional certification daily to advance career development.", "es": "Estudia para la certificación profesional diariamente.", "ja": "毎日職業認定のために学習します。"}	{"en": "Submit daily study progress screenshots or practice test results.", "es": "Envía capturas de pantalla diarias del progreso de estudio.", "ja": "毎日学習進捗のスクリーンショットを提出してください。"}	{"en": "Study progress screenshots or practice test results", "es": "Capturas de pantalla del progreso de estudio o resultados de pruebas de práctica", "ja": "学習進捗のスクリーンショットまたは模擬試験結果"}
cmhgopmbz0018urpfs5u2q6fn	quick_vocabulary	每日背单词50个	每天背诵50个新单词，快速扩充词汇量	LEARNING	PHOTO	f	168	20	每天拍摄单词app学习记录	单词app显示今日学习50个单词	t	f	\N	\N	\N	2025-11-01 19:37:54.768	2025-12-05 10:51:01.06	BEGINNER	t	LOW	LEARNING_LANGUAGE	\N	\N	0	{"en": "Daily 50 Vocabulary Words", "es": "50 Palabras de Vocabulario Diarias", "ja": "毎日50単語暗記"}	{"en": "Memorize 50 new vocabulary words daily to expand language skills.", "es": "Memoriza 50 nuevas palabras de vocabulario al día para ampliar las habilidades lingüísticas.", "ja": "毎日50個の新しい単語を暗記し、語学力を広げます。"}	{"en": "Submit daily vocabulary learning screenshots or flashcard records.", "es": "Envía capturas de pantalla diarias de aprendizaje de vocabulario o registros de tarjetas de memoria.", "ja": "毎日単語学習のスクリーンショットまたはフラッシュカード記録を提出してください。"}	{"en": "Vocabulary app screenshot showing 50 words learned", "es": "Captura de pantalla de la aplicación de vocabulario mostrando 50 palabras aprendidas", "ja": "50単語学習したことを示す単語アプリのスクリーンショット"}
cmhgopmca001durpfumkefjrv	quick_family_time	每日家庭时光	每天至少30分钟高质量陪伴家人	LIFESTYLE	PHOTO	f	168	12	每天拍摄家庭活动照片	与家人一起用餐/聊天/游戏的照片	t	f	\N	\N	\N	2025-11-01 19:37:54.778	2025-12-05 10:51:01.098	BEGINNER	t	LOW	LIFESTYLE_SOCIAL	\N	\N	0	{"en": "Daily Family Time", "es": "Tiempo Familiar Diario", "ja": "毎日家族時間"}	{"en": "Spend quality time with family daily to strengthen family bonds.", "es": "Pasa tiempo de calidad con la familia diariamente para fortalecer los lazos familiares.", "ja": "毎日家族と質の高い時間を過ごし、家族の絆を強めます。"}	{"en": "Submit daily family activity photos or interaction records.", "es": "Envía fotos diarias de actividades familiares o registros de interacción.", "ja": "毎日家族活動の写真または交流記録を提出してください。"}	{"en": "Family activity photos or interaction records", "es": "Fotos de actividades familiares o registros de interacción", "ja": "家族活動の写真または交流記録"}
cmhgopmcj001iurpf7xecav93	advanced_language_fluency	语言流利度提升	全方位语言学习：听说读写全面提升	LEARNING	PHOTO	f	672	8	每天完成听力、口语、阅读、写作练习	各项练习完成记录截图	t	f	\N	\N	\N	2025-11-01 19:37:54.787	2025-12-05 10:51:01.129	ADVANCED	t	LOW	LEARNING_LANGUAGE	\N	\N	0	{"en": "Language Fluency Intensive", "es": "Intensivo de Fluidez en Idiomas", "ja": "言語流暢性集中トレーニング"}	{"en": "Intensive language learning program: 2 hours daily practice including speaking, listening, reading, writing.", "es": "Programa intensivo de aprendizaje de idiomas: 2 horas de práctica diaria incluyendo hablar, escuchar, leer, escribir.", "ja": "集中的な言語学習プログラム:毎日2時間の練習(スピーキング、リスニング、リーディング、ライティング)。"}	{"en": "Submit daily comprehensive language practice records covering all four skills.", "es": "Envía registros diarios de práctica de idiomas integral cubriendo las cuatro habilidades.", "ja": "毎日4つのスキルすべてをカバーする包括的な言語練習記録を提出してください。"}	{"en": "Language learning app screenshots + speaking practice recordings + writing samples", "es": "Capturas de pantalla de la aplicación de aprendizaje de idiomas + grabaciones de práctica oral + muestras de escritura", "ja": "言語学習アプリのスクリーンショット+スピーキング練習録音+ライティングサンプル"}
cmhgopm8y0000urpfz6tn51pm	health_sleep_early	早睡早起挑战	每天晚上10点前睡觉，早上6点前起床，养成健康作息习惯	HEALTH	PHOTO	f	168	10	每天晚上拍摄睡前照片（显示时间），早上拍摄起床照片（显示时间）	晚上9:50的睡前照片，早上5:55的起床照片	t	f	\N	\N	\N	2025-11-01 19:37:54.658	2025-12-05 10:51:00.76	BEGINNER	t	LOW	HEALTH_SLEEP	\N	\N	0	{"en": "Early Sleep Early Rise Challenge", "es": "Desafío de Dormir y Despertar Temprano", "ja": "早寝早起きチャレンジ"}	{"en": "Sleep before 10 PM and wake up before 6 AM daily to develop healthy sleep habits.", "es": "Duerme antes de las 10 PM y despierta antes de las 6 AM diariamente.", "ja": "毎日午後10時前に就寝し、午前6時前に起床します。"}	{"en": "Take bedtime photos at night (showing time) and wake-up photos in the morning (showing time).", "es": "Toma fotos de la hora de acostarte por la noche y fotos al despertar por la mañana.", "ja": "夜に就寝時刻の写真と朝に起床時刻の写真を撮影してください。"}	{"en": "Bedtime photo at 9:50 PM, wake-up photo at 5:55 AM", "es": "Foto de acostarse a las 9:50 PM, foto de despertar a las 5:55 AM", "ja": "午後9時50分の就寝写真、午前5時55分の起床写真"}
cmgzc01dd0002yikfg44g1q92	quick_skill_practice	技能练习挑战	每天练习一项技能30分钟，如编程、绘画、乐器等。	LEARNING	PHOTO	f	168	6	每天提交练习成果照片或视频，展示练习过程和进步。	练习作品照片或练习过程视频	t	f	\N	\N	\N	2025-10-20 16:10:00.817	2025-12-05 22:51:31.55	BEGINNER	t	LOW	LEARNING_SKILL	\N	\N	0	{"en": "Daily Programming Practice", "es": "Práctica Diaria de Programación", "ja": "毎日のプログラミング練習"}	{"en": "Programming practice plan designed for beginners, focusing on skill improvement through systematic practice and learning.", "es": "Plan de práctica de programación diseñado para principiantes, enfocándose en la mejora de habilidades a través de práctica y aprendizaje sistemáticos.", "ja": "初心者向けに設計されたプログラミング練習計画で、体系的な練習と学習を通じてスキル向上に焦点を当てています。"}	{"en": "Practice programming daily through algorithm problems, project development, or new technology learning. Submit code screenshots, project progress, or learning notes to record technical growth.", "es": "Practique programación diariamente a través de problemas de algoritmos, desarrollo de proyectos o aprendizaje de nuevas tecnologías. Envíe capturas de pantalla de código, progreso del proyecto o notas de aprendizaje para registrar el crecimiento técnico.", "ja": "アルゴリズム問題、プロジェクト開発、または新技術学習を通じて毎日プログラミングを練習してください。コードのスクリーンショット、プロジェクトの進捗、または学習ノートを提出して、技術的成長を記録してください。"}	{"en": "Photos of practice work or practice process videos", "es": "Fotos del trabajo de práctica", "ja": "練習作品の写真"}
cmgzc01du0005yikfc1dpio7d	quick_yoga_practice	瑜伽冥想练习	每天进行30分钟瑜伽练习，放松身心，提升柔韧性。	FITNESS	PHOTO	f	168	10	每天拍摄瑜伽练习照片或视频，展示动作和练习时长。	瑜伽练习照片和练习app记录	t	f	\N	\N	\N	2025-10-20 16:10:00.834	2025-12-05 22:51:31.575	BEGINNER	t	LOW	FITNESS_YOGA	\N	\N	0	{"en": "Morning Yoga Practice", "es": "Práctica de Yoga Matutino", "ja": "朝のヨガ練習"}	{"en": "Beginner-level Hatha yoga, 30 minutes per session in the morning, aiming for body flexibility and inner peace.", "es": "Yoga Hatha de nivel principiante, 30 minutos por sesión por la mañana, con el objetivo de flexibilidad corporal y paz interior.", "ja": "初心者レベルのハタヨガ、朝に1回30分、体の柔軟性と内なる平和を目指します。"}	{"en": "Warm up before practice, coordinate breathing with movements, and avoid forcing difficult poses. Submit practice photos or videos showing yoga poses, record practice feelings and body changes.", "es": "Caliente antes de la práctica, coordine la respiración con los movimientos y evite forzar posturas difíciles. Envíe fotos o videos de práctica mostrando posturas de yoga, registre sensaciones de práctica y cambios corporales.", "ja": "練習前にウォームアップし、呼吸と動きを調和させ、難しいポーズを無理にしないでください。ヨガのポーズを示す練習写真またはビデオを提出し、練習の感覚と体の変化を記録してください。"}	{"en": "Yoga practice photos or meditation app screenshots", "es": "Fotos de práctica de yoga", "ja": "ヨガ練習の写真"}
cmgzc01cu0000yikfckccja5x	quick_language_learning	英语学习挑战	每天学习英语30分钟，通过背单词和练习口语提升英语水平。	LEARNING	PHOTO	f	168	8	每天提交学习截图或练习记录，包括学习时长和内容。	英语学习app的学习记录截图	t	f	\N	\N	\N	2025-10-20 16:10:00.799	2025-12-05 22:51:31.531	BEGINNER	t	LOW	LEARNING_LANGUAGE	\N	\N	0	{"en": "Daily English Vocabulary Learning", "es": "Aprendizaje Diario de Vocabulario en Inglés", "ja": "毎日の英単語学習"}	{"en": "Learn 20 English words daily through flashcards to improve vocabulary. Suitable for beginners to build English foundation progressively.", "es": "Aprende 20 palabras en inglés diariamente a través de tarjetas de vocabulario para mejorar el vocabulario. Adecuado para principiantes para construir una base de inglés progresivamente.", "ja": "フラッシュカードを通じて毎日20の英単語を学び、語彙力を向上させます。初心者が段階的に英語の基礎を築くのに適しています。"}	{"en": "Submit daily learning screenshots including study content and duration records", "es": "Envíe capturas de pantalla de aprendizaje diarias que incluyan contenido de estudio y registros de duración", "ja": "学習内容と時間記録を含む毎日の学習スクリーンショットを提出してください"}	{"en": "Screenshot of English learning app study records", "es": "Captura de pantalla de los registros de estudio", "ja": "英語学習アプリの学習記録のスクリーンショット"}
cmgzc01d60001yikf3z964h1m	quick_daily_reading	每日阅读30分钟	每天阅读30分钟，培养良好的阅读习惯，提升知识储备。	LEARNING	PHOTO	f	168	10	每天拍摄阅读照片，包括书籍封面和阅读进度。	正在阅读的书籍照片配上阅读笔记	t	f	\N	\N	\N	2025-10-20 16:10:00.811	2025-12-05 22:51:31.542	BEGINNER	t	LOW	LEARNING_READING	\N	\N	0	{"en": "30-Minute Daily Reading Habit", "es": "Hábito de Lectura Diaria de 30 Minutos", "ja": "毎日30分の読書習慣"}	{"en": "Read for 30 minutes daily through novels and essays in a quiet environment to cultivate good reading habits and expand knowledge.", "es": "Lea durante 30 minutos diarios a través de novelas y ensayos en un ambiente tranquilo para cultivar buenos hábitos de lectura y expandir el conocimiento.", "ja": "静かな環境で小説やエッセイを通じて毎日30分読書し、良い読書習慣を養い、知識を広げます。"}	{"en": "Read attentively in a quiet environment and take reading notes. Submit reading photos, progress records, or reading reflections to share reading experiences and thoughts.", "es": "Lea atentamente en un ambiente tranquilo y tome notas de lectura. Envíe fotos de lectura, registros de progreso o reflexiones de lectura para compartir experiencias y pensamientos de lectura.", "ja": "静かな環境で集中して読書し、読書ノートを取ってください。読書の写真、進捗記録、または読書感想を提出して、読書体験と思考を共有してください。"}	{"en": "Photo of the book being read with reading notes", "es": "Foto del libro con notas de lectura", "ja": "読んでいる本の写真と読書ノート"}
cmgzc01dj0003yikft4c8iy0c	quick_gym_workout	健身房训练	每天进行45分钟健身房训练，包括力量训练和有氧运动。	FITNESS	PHOTO	f	168	6	每天拍摄健身房训练照片，包括器械使用和运动记录。	健身房训练照片和运动app记录截图	t	f	\N	\N	\N	2025-10-20 16:10:00.824	2025-12-05 22:51:31.558	INTERMEDIATE	t	MEDIUM	FITNESS_STRENGTH	\N	\N	0	{"en": "Gym Muscle Building Training", "es": "Entrenamiento de Construcción Muscular en Gimnasio", "ja": "ジムでの筋肉増強トレーニング"}	{"en": "Beginner-level strength training focusing on chest and back muscles, 60 minutes per session, aiming for muscle building and strength improvement.", "es": "Entrenamiento de fuerza de nivel principiante enfocado en músculos del pecho y espalda, 60 minutos por sesión, con el objetivo de construcción muscular y mejora de fuerza.", "ja": "初心者レベルの筋力トレーニングで、胸筋と背筋に焦点を当て、1回60分、筋肉増強と筋力向上を目指します。"}	{"en": "Submit training photos and equipment usage records after each session, including training content, weights used, and training feelings", "es": "Envíe fotos de entrenamiento y registros de uso de equipos después de cada sesión, incluyendo contenido de entrenamiento, pesos utilizados y sensaciones de entrenamiento", "ja": "各セッション後にトレーニング写真と器具使用記録を提出してください。トレーニング内容、使用重量、トレーニング感想を含めてください"}	{"en": "Gym workout photos and fitness app record screenshots", "es": "Fotos de entrenamiento en gimnasio", "ja": "ジムトレーニングの写真"}
cmgzc01dp0004yikfkzxtfzk5	quick_running_challenge	每日跑步5公里	每天跑步5公里，提升心肺功能和身体素质。	FITNESS	PHOTO	f	168	8	每天提交跑步路线截图和完成时间记录。	跑步app的路线和时间记录截图	t	f	\N	\N	\N	2025-10-20 16:10:00.83	2025-12-05 22:51:31.567	INTERMEDIATE	t	MEDIUM	FITNESS_CARDIO	\N	\N	0	{"en": "Daily 3km Running", "es": "Carrera Diaria de 3km", "ja": "毎日3kmランニング"}	{"en": "Intermediate-level aerobic running, 3km per session at 6 minutes per km pace, aiming for weight loss and endurance improvement.", "es": "Carrera aeróbica de nivel intermedio, 3km por sesión a un ritmo de 6 minutos por km, con el objetivo de pérdida de peso y mejora de resistencia.", "ja": "中級レベルの有酸素ランニング、1回3km、1kmあたり6分のペースで、減量と持久力向上を目指します。"}	{"en": "Adjust running intensity based on personal ability and maintain regular training. Submit running record screenshots including basic distance and time information, record body feelings and progress.", "es": "Ajuste la intensidad de carrera según la capacidad personal y mantenga un entrenamiento regular. Envíe capturas de pantalla de registros de carrera que incluyan información básica de distancia y tiempo, registre sensaciones corporales y progreso.", "ja": "個人の能力に基づいてランニング強度を調整し、定期的なトレーニングを維持してください。基本的な距離と時間情報を含むランニング記録のスクリーンショットを提出し、体の感覚と進歩を記録してください。"}	{"en": "Running app route and time record screenshots", "es": "Capturas de pantalla de la ruta", "ja": "ランニングアプリのルートのスクリーンショット"}
cmgzc01e80008yikfjymmi2v3	quick_meditation	每日冥想15分钟	每天进行15分钟冥想练习，缓解压力，提升专注力。	HEALTH	PHOTO	f	168	8	每天拍摄冥想环境照片和冥想app记录截图。	冥想app的练习记录截图	t	f	\N	\N	\N	2025-10-20 16:10:00.848	2025-12-05 22:51:31.598	BEGINNER	t	LOW	HEALTH_MENTAL	\N	\N	0	{"en": "Daily 10-Minute Mindfulness Meditation", "es": "Meditación Consciente Diaria de 10 Minutos", "ja": "毎日10分のマインドフルネス瞑想"}	{"en": "Practice 10 minutes of mindfulness meditation daily in a quiet environment through guided audio to achieve stress relief and focus improvement.", "es": "Practique 10 minutos de meditación consciente diariamente en un ambiente tranquilo a través de audio guiado para lograr alivio del estrés y mejora del enfoque.", "ja": "静かな環境でガイド付きオーディオを通じて毎日10分のマインドフルネス瞑想を練習し、ストレス軽減と集中力向上を達成します。"}	{"en": "Practice meditation in a quiet environment, can use meditation apps or audio guidance. Submit meditation duration records and practice feelings, share inner peace experiences.", "es": "Practique meditación en un ambiente tranquilo, puede usar aplicaciones de meditación o guía de audio. Envíe registros de duración de meditación y sensaciones de práctica, comparta experiencias de paz interior.", "ja": "静かな環境で瞑想を練習し、瞑想アプリまたはオーディオガイダンスを使用できます。瞑想時間の記録と練習の感想を提出し、内なる平和の体験を共有してください。"}	{"en": "Meditation app screenshot showing 15-minute session completion", "es": "Captura de pantalla mostrando sesión de 15 minutos", "ja": "15分間のセッション完了のスクリーンショット"}
cmhgopm980002urpf43dfpdu6	health_diet_water	每日饮水2升	每天喝足2000毫升水，保持身体充足水分	HEALTH	PHOTO	f	168	12	每天拍摄饮水记录或饮水app截图	饮水app显示今日已饮水2000ml的截图	t	f	\N	\N	\N	2025-11-01 19:37:54.668	2025-12-05 10:51:00.776	BEGINNER	t	LOW	HEALTH_DIET	\N	\N	0	{"en": "Daily Water Intake 2L", "es": "Ingesta Diaria de Agua 2L", "ja": "毎日2リットル水分摂取"}	{"en": "Drink 2000ml of water daily to maintain adequate body hydration.", "es": "Bebe 2000ml de agua al día para mantener una hidratación adecuada.", "ja": "毎日2000mlの水を飲み、体の水分を維持します。"}	{"en": "Take daily photos of water intake records or water tracking app screenshots.", "es": "Toma fotos diarias de los registros de ingesta de agua.", "ja": "毎日水分摂取記録の写真を撮影してください。"}	{"en": "Water tracking app screenshot showing 2000ml intake today", "es": "Captura de pantalla mostrando 2000ml de ingesta hoy", "ja": "今日2000mlの摂取を示すスクリーンショット"}
cmhgopm9a0003urpfaautoev5	health_diet_balanced	均衡饮食挑战	每天摄入蔬菜、水果、蛋白质、碳水化合物，营养均衡	HEALTH	PHOTO	f	168	8	每天拍摄三餐照片，展示营养搭配	早餐：全麦面包+鸡蛋+牛奶+水果的照片	t	f	\N	\N	\N	2025-11-01 19:37:54.671	2025-12-05 10:51:00.783	INTERMEDIATE	f	LOW	HEALTH_DIET	\N	\N	0	{"en": "Balanced Diet Challenge", "es": "Desafío de Dieta Equilibrada", "ja": "バランスの取れた食事チャレンジ"}	{"en": "Daily intake of vegetables, fruits, protein, and carbohydrates for balanced nutrition.", "es": "Ingesta diaria de verduras, frutas, proteínas y carbohidratos.", "ja": "毎日野菜、果物、タンパク質、炭水化物を摂取します。"}	{"en": "Take daily photos of three meals showing nutritional balance.", "es": "Toma fotos diarias de las tres comidas mostrando el equilibrio nutricional.", "ja": "毎日3食の写真を撮影し、栄養バランスを示してください。"}	{"en": "Breakfast photo: whole wheat bread + eggs + milk + fruit", "es": "Foto del desayuno: pan integral + huevos + leche + fruta", "ja": "朝食の写真:全粒粉パン+卵+牛乳+果物"}
cmhgopm9h0006urpf9je6j9sm	health_mental_gratitude	感恩日记挑战	每天记录3件感恩的事情，培养积极心态	HEALTH	PHOTO	f	168	8	每天拍摄感恩日记照片	日记本上写着"今天感恩：1.健康的身体 2.家人的陪伴 3.工作的机会"	t	f	\N	\N	\N	2025-11-01 19:37:54.678	2025-12-05 10:51:00.802	BEGINNER	f	LOW	HEALTH_MENTAL	\N	\N	0	{"en": "Gratitude Journal Challenge", "es": "Desafío de Diario de Gratitud", "ja": "感謝日記チャレンジ"}	{"en": "Write down 3 things you're grateful for daily to cultivate a positive mindset.", "es": "Escribe 3 cosas por las que estés agradecido al día.", "ja": "毎日感謝していることを3つ書き留めます。"}	{"en": "Submit daily gratitude journal photos or text entries.", "es": "Envía fotos diarias del diario de gratitud.", "ja": "毎日感謝日記の写真を提出してください。"}	{"en": "Gratitude journal photo showing 3 gratitude items", "es": "Foto del diario mostrando 3 elementos de gratitud", "ja": "3つの感謝項目を示す日記の写真"}
cmhgopm9p0007urpfd1yiinp8	health_mental_digital_detox	数字排毒挑战	每天减少2小时屏幕时间，远离社交媒体	HEALTH	PHOTO	f	168	6	每天截图手机屏幕使用时间，证明减少使用	手机屏幕使用时间对比截图，显示减少2小时	t	f	\N	\N	\N	2025-11-01 19:37:54.685	2025-12-05 10:51:00.808	INTERMEDIATE	t	LOW	HEALTH_MENTAL	\N	\N	0	{"en": "Digital Detox Challenge", "es": "Desafío de Desintoxicación Digital", "ja": "デジタルデトックスチャレンジ"}	{"en": "Limit screen time to 2 hours daily, reduce phone and computer usage.", "es": "Limita el tiempo de pantalla a 2 horas diarias.", "ja": "毎日スクリーン時間を2時間に制限します。"}	{"en": "Submit daily screen time statistics screenshots showing usage under 2 hours.", "es": "Envía capturas de pantalla diarias de estadísticas de tiempo de pantalla.", "ja": "毎日スクリーン時間統計のスクリーンショットを提出してください。"}	{"en": "Phone screen time statistics showing 1 hour 45 minutes usage", "es": "Estadísticas de tiempo de pantalla mostrando 1 hora 45 minutos", "ja": "1時間45分の使用を示すスクリーン時間統計"}
cmhgopm9w0009urpfy6z694bg	fitness_cardio_steps	每日万步挑战	每天走路10000步，保持活力	FITNESS	PHOTO	f	168	15	每天拍摄步数app截图	手机健康app显示今日步数10523步	t	f	\N	\N	\N	2025-11-01 19:37:54.692	2025-12-05 10:51:00.82	BEGINNER	t	LOW	FITNESS_CARDIO	\N	\N	0	{"en": "Daily 10,000 Steps Challenge", "es": "Desafío de 10,000 Pasos Diarios", "ja": "毎日1万歩チャレンジ"}	{"en": "Walk 10,000 steps daily to maintain physical activity and health.", "es": "Camina 10,000 pasos al día para mantener la actividad física.", "ja": "毎日1万歩歩き、身体活動を維持します。"}	{"en": "Submit daily step count screenshots from fitness tracker or phone.", "es": "Envía capturas de pantalla diarias del conteo de pasos.", "ja": "毎日歩数計のスクリーンショットを提出してください。"}	{"en": "Step counter screenshot showing 10,000+ steps", "es": "Captura de pantalla mostrando 10,000+ pasos", "ja": "10,000歩以上を示すスクリーンショット"}
cmhgopm9y000aurpffeknkxrr	fitness_cardio_cycling	骑行挑战	每天骑行10公里，享受户外运动	FITNESS	PHOTO	f	168	8	每天拍摄骑行app记录或骑行照片	骑行app显示10.5公里，用时35分钟	t	f	\N	\N	\N	2025-11-01 19:37:54.695	2025-12-05 10:51:00.826	INTERMEDIATE	f	LOW	FITNESS_CARDIO	\N	\N	0	{"en": "Cycling Challenge", "es": "Desafío de Ciclismo", "ja": "サイクリングチャレンジ"}	{"en": "Cycle 10 kilometers daily to improve cardiovascular endurance.", "es": "Pedalea 10 kilómetros al día para mejorar la resistencia cardiovascular.", "ja": "毎日10キロサイクリングし、心肺持久力を向上させます。"}	{"en": "Submit daily cycling route screenshots and distance records.", "es": "Envía capturas de pantalla diarias de la ruta de ciclismo.", "ja": "毎日サイクリングルートのスクリーンショットを提出してください。"}	{"en": "Cycling app route screenshot showing 10km+ distance", "es": "Captura de pantalla mostrando 10km+ de distancia", "ja": "10km以上の距離を示すスクリーンショット"}
cmhgopma1000burpf75ry2iky	fitness_strength_gym	健身房力量训练	系统的健身房力量训练：器械训练、自由重量、复合动作，全面提升肌肉力量和体能	FITNESS	PHOTO	f	168	8	每次训练拍摄健身房照片或训练记录，记录训练动作、组数、重量	健身房器械训练照片+训练日志+体能数据	t	f	\N	\N	\N	2025-11-01 19:37:54.697	2025-12-05 10:51:00.832	INTERMEDIATE	f	MEDIUM	FITNESS_STRENGTH	\N	\N	0	{"en": "Gym Strength Training", "es": "Entrenamiento de Fuerza en Gimnasio", "ja": "ジム筋力トレーニング"}	{"en": "45-minute gym strength training daily, including weight training and resistance exercises.", "es": "Entrenamiento de fuerza en gimnasio de 45 minutos al día.", "ja": "毎日45分間のジム筋力トレーニング。"}	{"en": "Take daily gym workout photos showing equipment and exercises.", "es": "Toma fotos diarias del entrenamiento en el gimnasio.", "ja": "毎日ジムトレーニングの写真を撮影してください。"}	{"en": "Gym workout photos + training log", "es": "Fotos de entrenamiento en gimnasio + registro de entrenamiento", "ja": "ジムトレーニングの写真+トレーニングログ"}
cmhgopma5000durpflm8xi2cj	fitness_flexibility_yoga	瑜伽练习挑战	每天30分钟瑜伽练习，提高柔韧性和平衡	FITNESS	PHOTO	f	168	10	每天拍摄瑜伽练习照片或app记录	瑜伽垫上练习照片，或瑜伽app完成记录	t	f	\N	\N	\N	2025-11-01 19:37:54.702	2025-12-05 10:51:00.844	BEGINNER	t	LOW	FITNESS_FLEXIBILITY	\N	\N	0	{"en": "Yoga Practice Challenge", "es": "Desafío de Práctica de Yoga", "ja": "ヨガ練習チャレンジ"}	{"en": "30-minute daily yoga practice to improve flexibility and balance.", "es": "Práctica diaria de yoga de 30 minutos para mejorar la flexibilidad.", "ja": "毎日30分間のヨガ練習で柔軟性を向上させます。"}	{"en": "Submit daily yoga practice photos or session completion screenshots.", "es": "Envía fotos diarias de práctica de yoga.", "ja": "毎日ヨガ練習の写真を提出してください。"}	{"en": "Yoga practice photos or yoga app session screenshots", "es": "Fotos de práctica de yoga o capturas de pantalla de la aplicación", "ja": "ヨガ練習の写真またはヨガアプリのスクリーンショット"}
cmgzc01er000byikfwe4m1e8n	quick_gratitude	感恩日记挑战	每天写下3件感恩的事情，培养积极心态和感恩意识。	PERSONAL	PHOTO	f	168	10	每天拍摄感恩日记照片，分享感恩的事情和感受。	手写感恩日记照片	t	f	\N	\N	\N	2025-10-20 16:10:00.867	2025-12-05 22:51:31.619	BEGINNER	t	LOW	PERSONAL_GROWTH	\N	\N	0	{"en": "Gratitude Journal Recording", "es": "Registro de Diario de Gratitud", "ja": "感謝日記の記録"}	{"en": "Record 3 things to be grateful for every evening, covering relationships, personal growth, life experiences, etc., through written records to cultivate positive mindset and gratitude awareness.", "es": "Registre 3 cosas por las que estar agradecido cada noche, cubriendo relaciones, crecimiento personal, experiencias de vida, etc., a través de registros escritos para cultivar una mentalidad positiva y conciencia de gratitud.", "ja": "毎晩3つの感謝すべきことを記録し、人間関係、個人的成長、生活体験などをカバーし、書面記録を通じて積極的な心構えと感謝の意識を養います。"}	{"en": "Spend 5-10 minutes every evening recording gratitude journal, write down things worth being grateful for that day. Submit journal photos or text records, share gratitude insights and positive experiences.", "es": "Dedique 5-10 minutos cada noche a registrar el diario de gratitud, escriba cosas por las que vale la pena estar agradecido ese día. Envíe fotos del diario o registros de texto, comparta conocimientos de gratitud y experiencias positivas.", "ja": "毎晩5-10分を費やして感謝日記を記録し、その日感謝する価値のあることを書き留めてください。日記の写真またはテキスト記録を提出し、感謝の洞察と積極的な体験を共有してください。"}	{"en": "Gratitude journal photo showing 3 gratitude items", "es": "Foto del diario de gratitud mostrando 3 elementos", "ja": "3つの感謝項目を示す感謝日記の写真"}
cmhgopmab000gurpf64gde02d	learning_language_speaking	口语练习挑战	每天练习口语15分钟，提升表达能力	LEARNING	PHOTO	f	168	10	每天拍摄口语练习app记录或练习视频截图	口语练习app显示完成15分钟练习	t	f	\N	\N	\N	2025-11-01 19:37:54.708	2025-12-05 10:51:00.865	INTERMEDIATE	f	LOW	LEARNING_LANGUAGE	\N	\N	0	{"en": "Speaking Practice Challenge", "es": "Desafío de Práctica Oral", "ja": "スピーキング練習チャレンジ"}	{"en": "Practice speaking for 20 minutes daily to improve oral expression skills.", "es": "Practica hablar durante 20 minutos al día para mejorar las habilidades de expresión oral.", "ja": "毎日20分間スピーキング練習をします。"}	{"en": "Submit daily speaking practice audio or video recordings.", "es": "Envía grabaciones de audio o video diarias de práctica oral.", "ja": "毎日スピーキング練習の音声またはビデオ録音を提出してください。"}	{"en": "Speaking practice audio or video recordings", "es": "Grabaciones de audio o video de práctica oral", "ja": "スピーキング練習の音声またはビデオ録音"}
cmhgopmaf000iurpfy9q1z73l	learning_skill_design	设计技能提升	每天练习设计30分钟，学习PS、AI等工具	LEARNING	PHOTO	f	168	10	每天拍摄设计作品或学习进度	Photoshop界面截图，展示今日设计作品	t	f	\N	\N	\N	2025-11-01 19:37:54.712	2025-12-05 10:51:00.879	INTERMEDIATE	f	LOW	LEARNING_SKILL	\N	\N	0	{"en": "Design Skills Improvement", "es": "Mejora de Habilidades de Diseño", "ja": "デザインスキル向上"}	{"en": "Practice design for 1 hour daily, including graphic design, UI/UX, or illustration.", "es": "Practica diseño durante 1 hora al día, incluyendo diseño gráfico, UI/UX o ilustración.", "ja": "毎日1時間デザイン練習をします。"}	{"en": "Submit daily design work screenshots or creation process records.", "es": "Envía capturas de pantalla diarias del trabajo de diseño.", "ja": "毎日デザイン作品のスクリーンショットを提出してください。"}	{"en": "Design work screenshots or creation process photos", "es": "Capturas de pantalla del trabajo de diseño", "ja": "デザイン作品のスクリーンショット"}
cmhgopmah000jurpfpctpx4m7	learning_skill_music	乐器练习挑战	每天练习乐器30分钟，提升音乐技能	LEARNING	PHOTO	f	168	8	每天拍摄练习照片或视频截图	弹钢琴的照片，配上练习时长记录	t	f	\N	\N	\N	2025-11-01 19:37:54.714	2025-12-05 10:51:00.885	BEGINNER	f	LOW	LEARNING_SKILL	\N	\N	0	{"en": "Musical Instrument Practice Challenge", "es": "Desafío de Práctica de Instrumento Musical", "ja": "楽器練習チャレンジ"}	{"en": "Practice musical instrument for 30 minutes daily to improve musical skills.", "es": "Practica instrumento musical durante 30 minutos al día.", "ja": "毎日30分間楽器練習をします。"}	{"en": "Submit daily practice photos or performance videos.", "es": "Envía fotos diarias de práctica o videos de interpretación.", "ja": "毎日練習の写真または演奏ビデオを提出してください。"}	{"en": "Musical instrument practice photos or performance videos", "es": "Fotos de práctica de instrumento musical o videos de interpretación", "ja": "楽器練習の写真または演奏ビデオ"}
cmhgopmao000murpff91w6eow	personal_productivity_pomodoro	番茄工作法挑战	每天使用番茄工作法完成4个番茄钟（2小时专注工作）	PERSONAL	PHOTO	f	168	10	每天拍摄番茄钟app记录截图	番茄钟app显示今日完成4个番茄钟	t	f	\N	\N	\N	2025-11-01 19:37:54.72	2025-12-05 10:51:00.905	BEGINNER	t	LOW	PERSONAL_PRODUCTIVITY	\N	\N	0	{"en": "Pomodoro Technique Challenge", "es": "Desafío de Técnica Pomodoro", "ja": "ポモドーロテクニックチャレンジ"}	{"en": "Complete 8 Pomodoro sessions daily (25 minutes each) to boost productivity.", "es": "Completa 8 sesiones Pomodoro al día (25 minutos cada una).", "ja": "毎日8回のポモドーロセッション(各25分)を完了します。"}	{"en": "Submit daily Pomodoro timer screenshots or session completion records.", "es": "Envía capturas de pantalla diarias del temporizador Pomodoro.", "ja": "毎日ポモドーロタイマーのスクリーンショットを提出してください。"}	{"en": "Pomodoro app screenshots showing 8 completed sessions", "es": "Capturas de pantalla mostrando 8 sesiones completadas", "ja": "8回完了したセッションを示すスクリーンショット"}
cmhgopmas000ourpf0qhie30z	personal_creativity_writing	每日写作挑战	每天写作500字，记录生活或创作故事	PERSONAL	PHOTO	f	168	10	每天拍摄写作内容照片或字数统计	写作app显示今日写作523字	t	f	\N	\N	\N	2025-11-01 19:37:54.724	2025-12-05 10:51:00.919	INTERMEDIATE	f	LOW	PERSONAL_CREATIVITY	\N	\N	0	{"en": "Daily Writing Challenge", "es": "Desafío de Escritura Diaria", "ja": "毎日執筆チャレンジ"}	{"en": "Write 500 words daily to improve writing skills and creative expression.", "es": "Escribe 500 palabras al día para mejorar las habilidades de escritura.", "ja": "毎日500語執筆し、ライティングスキルを向上させます。"}	{"en": "Submit daily writing screenshots or word count records.", "es": "Envía capturas de pantalla diarias de escritura o registros de conteo de palabras.", "ja": "毎日執筆のスクリーンショットまたは単語数記録を提出してください。"}	{"en": "Writing screenshots showing 500+ words", "es": "Capturas de pantalla de escritura mostrando 500+ palabras", "ja": "500語以上を示す執筆スクリーンショット"}
cmhgopmaw000qurpfux287wto	personal_growth_reflection	每日反思日记	每天写反思日记，总结经验教训	PERSONAL	PHOTO	f	168	10	每天拍摄反思日记照片	日记本上的反思内容照片	t	f	\N	\N	\N	2025-11-01 19:37:54.728	2025-12-05 10:51:00.932	BEGINNER	f	LOW	PERSONAL_GROWTH	\N	\N	0	{"en": "Daily Reflection Journal", "es": "Diario de Reflexión Diaria", "ja": "毎日振り返り日記"}	{"en": "Write daily reflection journal to review the day and plan for improvement.", "es": "Escribe un diario de reflexión diario para revisar el día.", "ja": "毎日振り返り日記を書き、1日を振り返ります。"}	{"en": "Submit daily reflection journal photos or text entries.", "es": "Envía fotos diarias del diario de reflexión o entradas de texto.", "ja": "毎日振り返り日記の写真またはテキストエントリーを提出してください。"}	{"en": "Reflection journal photo with daily insights", "es": "Foto del diario de reflexión con ideas diarias", "ja": "毎日の洞察を含む振り返り日記の写真"}
cmhgopmaz000rurpfae2z873i	personal_growth_learning	每日学习新知识	每天学习一个新知识点，持续成长	PERSONAL	PHOTO	f	168	12	每天拍摄学习笔记或知识卡片	今日学习的新知识笔记照片	t	f	\N	\N	\N	2025-11-01 19:37:54.731	2025-12-05 10:51:00.941	BEGINNER	t	LOW	PERSONAL_GROWTH	\N	\N	0	{"en": "Daily Learn Something New", "es": "Aprender Algo Nuevo Diariamente", "ja": "毎日新しいことを学ぶ"}	{"en": "Learn one new thing daily to expand knowledge and skills.", "es": "Aprende una cosa nueva al día para ampliar conocimientos y habilidades.", "ja": "毎日新しいことを1つ学び、知識とスキルを広げます。"}	{"en": "Submit daily learning notes or screenshots of new knowledge acquired.", "es": "Envía notas diarias de aprendizaje o capturas de pantalla de nuevos conocimientos.", "ja": "毎日学習ノートまたは新しい知識のスクリーンショットを提出してください。"}	{"en": "Learning notes or screenshots showing new knowledge", "es": "Notas de aprendizaje o capturas de pantalla mostrando nuevos conocimientos", "ja": "新しい知識を示す学習ノートまたはスクリーンショット"}
cmhgopmb3000turpfzvzmq5c4	lifestyle_home_cooking	每日健康烹饪	每天自己做饭，享受烹饪乐趣	LIFESTYLE	PHOTO	f	168	12	每天拍摄烹饪过程或成品照片	今日烹饪的菜品照片	t	f	\N	\N	\N	2025-11-01 19:37:54.736	2025-12-05 10:51:00.953	BEGINNER	t	LOW	LIFESTYLE_HOME	\N	\N	0	{"en": "Daily Healthy Cooking", "es": "Cocina Saludable Diaria", "ja": "毎日健康料理"}	{"en": "Cook one healthy meal daily to improve cooking skills and eating habits.", "es": "Cocina una comida saludable al día para mejorar las habilidades culinarias.", "ja": "毎日1食健康的な料理を作ります。"}	{"en": "Submit daily cooking process photos and finished dish photos.", "es": "Envía fotos diarias del proceso de cocina y fotos del plato terminado.", "ja": "毎日料理過程の写真と完成した料理の写真を提出してください。"}	{"en": "Photos of cooking process and finished healthy meal", "es": "Fotos del proceso de cocina y comida saludable terminada", "ja": "料理過程と完成した健康的な食事の写真"}
cmhgopmb5000uurpfwrq1bf18	lifestyle_social_connection	每日社交联系	每天主动联系一位朋友或家人，增进感情	LIFESTYLE	PHOTO	f	168	10	每天拍摄聊天记录截图（隐藏隐私信息）	与朋友的聊天记录截图	t	f	\N	\N	\N	2025-11-01 19:37:54.738	2025-12-05 10:51:00.963	BEGINNER	t	LOW	LIFESTYLE_SOCIAL	\N	\N	0	{"en": "Daily Social Connection", "es": "Conexión Social Diaria", "ja": "毎日社交連絡"}	{"en": "Connect with friends or family daily to maintain social relationships.", "es": "Conéctate con amigos o familiares diariamente para mantener relaciones sociales.", "ja": "毎日友人や家族と連絡を取り、社会的関係を維持します。"}	{"en": "Submit daily social interaction records or conversation screenshots.", "es": "Envía registros diarios de interacción social o capturas de pantalla de conversaciones.", "ja": "毎日社交記録または会話のスクリーンショットを提出してください。"}	{"en": "Social interaction records or conversation screenshots", "es": "Registros de interacción social o capturas de pantalla de conversaciones", "ja": "社交記録または会話のスクリーンショット"}
cmhgopmb7000vurpfiht2e4pg	lifestyle_social_volunteer	志愿服务挑战	参与社区志愿活动，帮助他人	LIFESTYLE	PHOTO	f	336	8	拍摄志愿服务活动照片	参与社区清洁活动的照片	t	f	\N	\N	\N	2025-11-01 19:37:54.74	2025-12-05 10:51:00.97	INTERMEDIATE	t	LOW	LIFESTYLE_SOCIAL	\N	\N	0	{"en": "Volunteer Service Challenge", "es": "Desafío de Servicio Voluntario", "ja": "ボランティアサービスチャレンジ"}	{"en": "Participate in volunteer activities weekly to give back to the community.", "es": "Participa en actividades de voluntariado semanalmente para retribuir a la comunidad.", "ja": "毎週ボランティア活動に参加し、コミュニティに貢献します。"}	{"en": "Submit volunteer activity photos and service records.", "es": "Envía fotos de actividades de voluntariado y registros de servicio.", "ja": "ボランティア活動の写真とサービス記録を提出してください。"}	{"en": "Volunteer activity photos + service certificate", "es": "Fotos de actividades de voluntariado + certificado de servicio", "ja": "ボランティア活動の写真+サービス証明書"}
cmhgopmbe000yurpfaygsj9vs	lifestyle_hobby_movie	电影观赏计划	每周观看2部经典电影，丰富文化生活	LIFESTYLE	PHOTO	f	168	15	拍摄观影照片或影评笔记	电影海报+观影感想照片	t	f	\N	\N	\N	2025-11-01 19:37:54.746	2025-12-05 10:51:00.982	BEGINNER	t	LOW	LIFESTYLE_HOBBY	\N	\N	0	{"en": "Movie Watching Plan", "es": "Plan de Ver Películas", "ja": "映画鑑賞計画"}	{"en": "Watch one quality movie weekly and write a review to improve film appreciation.", "es": "Ve una película de calidad semanalmente y escribe una reseña.", "ja": "毎週1本の良質な映画を観て、レビューを書きます。"}	{"en": "Submit weekly movie reviews with ratings and insights.", "es": "Envía reseñas semanales de películas con calificaciones e ideas.", "ja": "毎週映画レビューと評価、洞察を提出してください。"}	{"en": "Movie review with rating and personal insights", "es": "Reseña de película con calificación e ideas personales", "ja": "評価と個人的な洞察を含む映画レビュー"}
cmgzc01ev000cyikf6r9wtvk7	quick_cooking	每日健康烹饪	每天自己烹饪一餐健康食物，提升烹饪技能和饮食质量。	LIFESTYLE	PHOTO	f	168	8	每天拍摄烹饪过程和成品照片，分享食谱和制作心得。	烹饪过程和成品照片	t	f	\N	\N	\N	2025-10-20 16:10:00.871	2025-12-05 22:51:31.626	BEGINNER	t	LOW	LIFESTYLE_COOKING	\N	\N	0	{"en": "Home Cooking Challenge", "es": "Desafío de Cocina Casera", "ja": "家庭料理チャレンジ"}	{"en": "Cook one home-style dish daily, aiming to improve cooking skills and enjoy cooking pleasure through practicing different recipes to master basic cooking techniques and cultivate healthy eating habits.", "es": "Cocine un plato casero diariamente, con el objetivo de mejorar las habilidades culinarias y disfrutar del placer de cocinar a través de la práctica de diferentes recetas para dominar técnicas básicas de cocina y cultivar hábitos alimenticios saludables.", "ja": "毎日1つの家庭料理を作り、さまざまなレシピを実践して基本的な調理技術を習得し、健康的な食習慣を養うことで、調理スキルの向上と調理の楽しみを目指します。"}	{"en": "Cook one dish daily, can be home-style dishes, soups, or snacks. Submit cooking process photos and finished product pictures, record cooking insights and taste evaluations.", "es": "Cocine un plato diariamente, puede ser platos caseros, sopas o bocadillos. Envíe fotos del proceso de cocina y fotos del producto terminado, registre conocimientos de cocina y evaluaciones de sabor.", "ja": "毎日1つの料理を作り、家庭料理、スープ、またはスナックができます。調理プロセスの写真と完成品の写真を提出し、調理の洞察と味の評価を記録してください。"}	{"en": "Photos of cooking process and finished healthy meal", "es": "Fotos del proceso de cocina", "ja": "料理過程の写真"}
cmgzc01ez000dyikffavoc4x1	quick_organization	整理收纳挑战	每天整理一个区域，保持生活空间整洁有序。	LIFESTYLE	PHOTO	f	168	6	每天拍摄整理前后对比照片，展示整理成果。	整理前后对比照片	t	f	\N	\N	\N	2025-10-20 16:10:00.876	2025-12-05 22:51:31.633	BEGINNER	t	LOW	LIFESTYLE_HOME	\N	\N	0	{"en": "Home Organization and Storage", "es": "Organización y Almacenamiento del Hogar", "ja": "家の整理整頓と収納"}	{"en": "Organize one area daily using decluttering method, aiming to create tidy space and improve quality of life through systematic organization to create comfortable living environment.", "es": "Organice un área diariamente usando el método de desorden, con el objetivo de crear un espacio ordenado y mejorar la calidad de vida a través de la organización sistemática para crear un ambiente de vida cómodo.", "ja": "断捨離方法を使用して毎日1つのエリアを整理し、体系的な整理を通じて整頓されたスペースを作り、生活の質を向上させ、快適な生活環境を作ることを目指します。"}	{"en": "Choose one area to organize daily, can be closet, desk, kitchen, etc. Submit before-and-after comparison photos, record organization methods and space improvement effects.", "es": "Elija un área para organizar diariamente, puede ser armario, escritorio, cocina, etc. Envíe fotos de comparación antes y después, registre métodos de organización y efectos de mejora del espacio.", "ja": "毎日整理するエリアを選択し、クローゼット、デスク、キッチンなどができます。整理前後の比較写真を提出し、整理方法とスペース改善効果を記録してください。"}	{"en": "Before and after photos of organized desk or closet", "es": "Fotos de antes y después del escritorio organizado", "ja": "整理された机のビフォーアフター写真"}
cmhgopmbj0010urpf68onm9j6	career_startup_plan	商业计划完善	每天完善商业计划的一个部分	WORK	PHOTO	f	168	6	每天拍摄商业计划文档截图	商业计划书某章节截图	t	f	\N	\N	\N	2025-11-01 19:37:54.752	2025-12-05 10:51:00.998	ADVANCED	f	MEDIUM	CAREER_STARTUP	\N	\N	0	{"en": "Business Plan Refinement", "es": "Refinamiento del Plan de Negocios", "ja": "ビジネスプラン改善"}	{"en": "Refine business plan daily to improve startup strategy and execution.", "es": "Refina el plan de negocios diariamente para mejorar la estrategia de startup.", "ja": "毎日ビジネスプランを改善し、スタートアップ戦略を向上させます。"}	{"en": "Submit daily business plan updates or strategy refinements.", "es": "Envía actualizaciones diarias del plan de negocios o refinamientos de estrategia.", "ja": "毎日ビジネスプランの更新または戦略の改善を提出してください。"}	{"en": "Business plan updates or strategy documents", "es": "Actualizaciones del plan de negocios o documentos de estrategia", "ja": "ビジネスプランの更新または戦略文書"}
cmhgopmbq0013urpfgejhspgl	career_skills_presentation	演讲技能提升	每天练习演讲15分钟，提升表达能力	WORK	PHOTO	f	168	8	拍摄演讲练习视频截图或笔记	演讲稿或练习视频截图	t	f	\N	\N	\N	2025-11-01 19:37:54.758	2025-12-05 10:51:01.019	INTERMEDIATE	f	LOW	CAREER_SKILLS	\N	\N	0	{"en": "Presentation Skills Improvement", "es": "Mejora de Habilidades de Presentación", "ja": "プレゼンテーションスキル向上"}	{"en": "Practice presentation skills weekly to improve public speaking and communication.", "es": "Practica habilidades de presentación semanalmente.", "ja": "毎週プレゼンテーションスキルを練習します。"}	{"en": "Submit weekly presentation practice videos or slides.", "es": "Envía videos semanales de práctica de presentación o diapositivas.", "ja": "毎週プレゼンテーション練習ビデオまたはスライドを提出してください。"}	{"en": "Presentation practice videos or slide decks", "es": "Videos de práctica de presentación o presentaciones de diapositivas", "ja": "プレゼンテーション練習ビデオまたはスライドデッキ"}
cmhgopmbs0014urpf3suk1tiq	quick_morning_routine	晨间仪式养成	每天早上完成固定的晨间仪式：起床、喝水、拉伸、冥想	HEALTH	PHOTO	f	168	15	每天拍摄晨间仪式完成照片	晨间拉伸照片+冥想照片	t	f	\N	\N	\N	2025-11-01 19:37:54.76	2025-12-05 10:51:01.027	BEGINNER	t	LOW	HEALTH_MENTAL	\N	\N	0	{"en": "Morning Routine Development", "es": "Desarrollo de Rutina Matutina", "ja": "朝のルーティン養成"}	{"en": "Establish a consistent morning routine to start the day productively.", "es": "Establece una rutina matutina consistente para comenzar el día productivamente.", "ja": "一貫した朝のルーティンを確立し、生産的に1日を始めます。"}	{"en": "Submit daily morning routine completion photos or checklists.", "es": "Envía fotos diarias de finalización de la rutina matutina o listas de verificación.", "ja": "毎日朝のルーティン完了の写真またはチェックリストを提出してください。"}	{"en": "Morning routine checklist showing completed activities", "es": "Lista de verificación de rutina matutina mostrando actividades completadas", "ja": "完了した活動を示す朝のルーティンチェックリスト"}
cmgzc01f4000eyikfz9bevt2h	quick_startup	创业项目每日进展	每天推进创业项目，完成设定的里程碑任务。	WORK	PHOTO	f	168	4	每天提交项目进展截图和完成任务记录。	项目管理工具截图和任务完成记录	t	f	\N	\N	\N	2025-10-20 16:10:00.88	2025-12-05 22:51:31.639	ADVANCED	t	MEDIUM	WORK_STARTUP	\N	\N	0	{"en": "Tech Startup Idea Stage Journal", "es": "Diario de Etapa de Idea de Startup Tecnológico", "ja": "テクノロジースタートアップアイデア段階ジャーナル"}	{"en": "Tech startup project in idea stage, focusing on market research and product planning. Invest 2-3 hours daily to systematically advance project development, record challenges, gains, and growth in entrepreneurial journey.", "es": "Proyecto de startup tecnológico en etapa de idea, enfocándose en investigación de mercado y planificación de productos. Invierta 2-3 horas diarias para avanzar sistemáticamente en el desarrollo del proyecto, registre desafíos, ganancias y crecimiento en el viaje empresarial.", "ja": "アイデア段階のテクノロジースタートアッププロジェクトで、市場調査と製品計画に焦点を当てています。毎日2-3時間を投資してプロジェクト開発を体系的に進め、起業の旅における課題、収穫、成長を記録します。"}	{"en": "Record daily startup progress including market research, product development, team building, etc. Submit work records, learning notes, or project screenshots, share entrepreneurial insights and milestone achievements.", "es": "Registre el progreso diario de la startup incluyendo investigación de mercado, desarrollo de productos, construcción de equipos, etc. Envíe registros de trabajo, notas de aprendizaje o capturas de pantalla del proyecto, comparta conocimientos empresariales y logros de hitos.", "ja": "市場調査、製品開発、チーム構築などを含む毎日のスタートアップの進捗を記録してください。作業記録、学習ノート、またはプロジェクトのスクリーンショットを提出し、起業の洞察とマイルストーンの成果を共有してください。"}	{"en": "Screenshots of code commits, marketing data, or customer feedback", "es": "Capturas de pantalla de commits de código", "ja": "コードコミットのスクリーンショット"}
cmhgopmc20019urpfkc82zw7w	quick_podcast_learning	每日播客学习	每天听一期教育类播客，利用碎片时间学习	LEARNING	PHOTO	f	168	12	每天拍摄播客app播放记录	播客app显示今日收听完成	t	f	\N	\N	\N	2025-11-01 19:37:54.77	2025-12-05 10:51:01.067	BEGINNER	t	LOW	LEARNING_SKILL	\N	\N	0	{"en": "Daily Podcast Learning", "es": "Aprendizaje Diario de Podcast", "ja": "毎日ポッドキャスト学習"}	{"en": "Listen to one educational podcast episode daily to expand knowledge.", "es": "Escucha un episodio de podcast educativo al día para ampliar conocimientos.", "ja": "毎日1つの教育ポッドキャストエピソードを聴き、知識を広げます。"}	{"en": "Submit daily podcast listening screenshots or learning notes.", "es": "Envía capturas de pantalla diarias de escucha de podcast o notas de aprendizaje.", "ja": "毎日ポッドキャスト視聴のスクリーンショットまたは学習ノートを提出してください。"}	{"en": "Podcast app screenshot + key takeaways notes", "es": "Captura de pantalla de la aplicación de podcast + notas de conclusiones clave", "ja": "ポッドキャストアプリのスクリーンショット+重要なポイントのノート"}
cmhgopmc6001burpfih803302	quick_compliment	每日赞美他人	每天真诚赞美至少一个人，传播正能量	PERSONAL	TEXT	f	168	15	每天记录赞美的内容和对方反应	今日赞美：称赞同事的工作成果，对方很开心	t	f	\N	\N	\N	2025-11-01 19:37:54.774	2025-12-05 10:51:01.083	BEGINNER	t	LOW	PERSONAL_GROWTH	\N	\N	0	{"en": "Daily Compliment Others", "es": "Elogiar a Otros Diariamente", "ja": "毎日他人を褒める"}	{"en": "Give genuine compliments to others daily to spread positivity.", "es": "Da cumplidos genuinos a otros diariamente para difundir positividad.", "ja": "毎日他人に心からの褒め言葉を贈り、ポジティブさを広げます。"}	{"en": "Submit daily records of compliments given to others.", "es": "Envía registros diarios de cumplidos dados a otros.", "ja": "毎日他人に贈った褒め言葉の記録を提出してください。"}	{"en": "Journal entry or message screenshots showing compliments given", "es": "Entrada de diario o capturas de pantalla de mensajes mostrando cumplidos dados", "ja": "贈った褒め言葉を示す日記エントリーまたはメッセージのスクリーンショット"}
cmhgopmc8001curpffjemkahi	quick_bed_making	每日整理床铺	每天早上整理床铺，从小事开始养成好习惯	LIFESTYLE	PHOTO	f	168	20	每天拍摄整理好的床铺照片	整洁的床铺照片	t	f	\N	\N	\N	2025-11-01 19:37:54.776	2025-12-05 10:51:01.091	BEGINNER	t	LOW	LIFESTYLE_HOME	\N	\N	0	{"en": "Daily Bed Making", "es": "Hacer la Cama Diariamente", "ja": "毎日ベッドメイキング"}	{"en": "Make your bed every morning to start the day with a small accomplishment.", "es": "Haz tu cama cada mañana para comenzar el día con un pequeño logro.", "ja": "毎朝ベッドを整え、小さな達成感で1日を始めます。"}	{"en": "Submit daily photos of made bed.", "es": "Envía fotos diarias de la cama hecha.", "ja": "毎日整えたベッドの写真を提出してください。"}	{"en": "Photo of neatly made bed", "es": "Foto de la cama bien hecha", "ja": "きれいに整えられたベッドの写真"}
cmhgopmcl001jurpf0xibpvcb	advanced_book_club	读书会挑战	深度阅读+讨论分享，每周读完一本书并分享心得	LEARNING	PHOTO	f	672	10	每周提交读书笔记和讨论记录	读书笔记+讨论截图	t	f	\N	\N	\N	2025-11-01 19:37:54.789	2025-12-05 10:51:01.136	INTERMEDIATE	t	LOW	LEARNING_READING	\N	\N	0	{"en": "Book Club Reading Challenge", "es": "Desafío de Lectura del Club de Libros", "ja": "ブッククラブ読書チャレンジ"}	{"en": "Read one book per week and participate in discussions to deepen understanding.", "es": "Lee un libro por semana y participa en discusiones para profundizar la comprensión.", "ja": "毎週1冊の本を読み、ディスカッションに参加して理解を深めます。"}	{"en": "Submit weekly reading progress, book reviews, and discussion participation records.", "es": "Envía progreso de lectura semanal, reseñas de libros y registros de participación en discusiones.", "ja": "毎週読書進捗、書評、ディスカッション参加記録を提出してください。"}	{"en": "Reading progress photos + book review + discussion screenshots", "es": "Fotos de progreso de lectura + reseña de libro + capturas de pantalla de discusión", "ja": "読書進捗の写真+書評+ディスカッションのスクリーンショット"}
cmhgopmcp001lurpfgb7zpa47	advanced_creative_project	创意项目完成	完成一个完整的创意项目：写作、绘画、音乐等	PERSONAL	PHOTO	f	672	6	每天记录项目进展，最后提交完整作品	项目进度照片+最终作品	t	f	\N	\N	\N	2025-11-01 19:37:54.793	2025-12-05 10:51:01.15	ADVANCED	t	LOW	PERSONAL_CREATIVITY	\N	\N	0	{"en": "30-Day Creative Project", "es": "Proyecto Creativo de 30 Días", "ja": "30日間クリエイティブプロジェクト"}	{"en": "Complete a creative project over 30 days with daily progress and iterations.", "es": "Completa un proyecto creativo durante 30 días con progreso diario e iteraciones.", "ja": "30日間で毎日進捗と反復を重ねてクリエイティブプロジェクトを完成させます。"}	{"en": "Submit daily project progress photos, sketches, or work-in-progress updates.", "es": "Envía fotos diarias del progreso del proyecto, bocetos o actualizaciones del trabajo en progreso.", "ja": "毎日プロジェクト進捗の写真、スケッチ、または作業中の更新を提出してください。"}	{"en": "Daily project progress photos showing incremental development", "es": "Fotos diarias del progreso del proyecto mostrando desarrollo incremental", "ja": "段階的な開発を示す毎日のプロジェクト進捗写真"}
cmhgopmcs001nurpfdr3rqw3e	advanced_sustainable_living	可持续生活方式	践行环保生活：减少塑料、垃圾分类、节能减排	LIFESTYLE	PHOTO	f	336	10	每天记录环保行动	环保行动照片：自带购物袋、垃圾分类等	t	f	\N	\N	\N	2025-11-01 19:37:54.797	2025-12-05 10:51:01.165	INTERMEDIATE	t	LOW	LIFESTYLE_HOME	\N	\N	0	{"en": "Sustainable Living Challenge", "es": "Desafío de Vida Sostenible", "ja": "持続可能な生活チャレンジ"}	{"en": "Adopt sustainable practices daily: reduce waste, conserve energy, choose eco-friendly options.", "es": "Adopta prácticas sostenibles diariamente: reduce residuos, conserva energía, elige opciones ecológicas.", "ja": "毎日持続可能な実践を採用:廃棄物削減、エネルギー節約、環境に優しい選択。"}	{"en": "Submit daily records of sustainable actions taken and their impact.", "es": "Envía registros diarios de acciones sostenibles tomadas y su impacto.", "ja": "毎日実施した持続可能な行動とその影響の記録を提出してください。"}	{"en": "Photos of sustainable actions + impact tracking records", "es": "Fotos de acciones sostenibles + registros de seguimiento de impacto", "ja": "持続可能な行動の写真+影響追跡記録"}
cmgzc01e20007yikfe33vxryv	quick_water_intake	每日饮水2升挑战	每天饮水2000毫升，保持身体水分平衡，促进新陈代谢。	HEALTH	PHOTO	f	168	10	每天记录饮水量并拍摄水杯照片，展示饮水进度。	饮水记录app截图和水杯照片	t	f	\N	\N	\N	2025-10-20 16:10:00.843	2025-12-05 22:51:31.591	BEGINNER	t	LOW	HEALTH_DIET	\N	\N	0	{"en": "Daily 2L Healthy Water Intake Challenge", "es": "Desafío de Ingesta Saludable de Agua Diaria de 2L", "ja": "毎日2L健康的な水分摂取チャレンジ"}	{"en": "Increase daily water intake from current 1.5-2L to 2L through mobile app reminders to achieve health goals. Scientific water intake, develop good drinking habits.", "es": "Aumente la ingesta diaria de agua de 1.5-2L actual a 2L a través de recordatorios de aplicaciones móviles para lograr objetivos de salud. Ingesta científica de agua, desarrolle buenos hábitos de bebida.", "ja": "モバイルアプリのリマインダーを通じて、現在の1.5-2Lから毎日2Lの水分摂取量に増やし、健康目標を達成します。科学的な水分摂取、良い飲水習慣を養います。"}	{"en": "Record daily water intake and time, can use water tracking app or photo records. Submit daily total water intake screenshots and body feeling records.", "es": "Registre la ingesta diaria de agua y el tiempo, puede usar una aplicación de seguimiento de agua o registros fotográficos. Envíe capturas de pantalla de la ingesta total diaria de agua y registros de sensaciones corporales.", "ja": "毎日の水分摂取量と時間を記録し、水分追跡アプリまたは写真記録を使用できます。毎日の総水分摂取量のスクリーンショットと体の感覚記録を提出してください。"}	{"en": "Water tracking app screenshot showing 2000ml intake today", "es": "Captura de pantalla mostrando 2000ml", "ja": "2000mlの摂取を示すスクリーンショット"}
cmgzc01fc000fyikfu8pyvmsv	general_custom	通用自定义挑战	完全自定义的挑战模板，适合特殊需求和创意挑战。VIP专享功能，提供最大的灵活性。	PERSONAL	PHOTO	f	168	8	根据自定义配置提交相应的证据材料。	根据挑战内容提交相关照片或视频	t	t	BASIC	\N	\N	2025-10-20 16:10:00.888	2025-12-05 10:51:00.754	BEGINNER	f	LOW	PERSONAL_GROWTH	\N	\N	0	{"en": "General Custom Challenge", "es": "Desafío Personalizado General", "ja": "一般カスタムチャレンジ"}	{"en": "Create your own custom challenge with flexible rules and goals.", "es": "Crea tu propio desafío personalizado.", "ja": "独自のカスタムチャレンジを作成します。"}	{"en": "Define your own challenge rules and submit evidence according to your requirements.", "es": "Define tus propias reglas de desafío.", "ja": "独自のチャレンジルールを定義してください。"}	{"en": "Evidence based on your custom challenge requirements", "es": "Evidencia basada en tus requisitos", "ja": "カスタムチャレンジ要件に基づく証拠"}
cmhgopmcw001purpfnksb41fg	advanced_leadership_development	领导力提升计划	系统提升领导力：沟通、决策、团队管理	WORK	PHOTO	f	672	8	每天完成领导力练习，记录实践成果	领导力实践记录+团队反馈	t	f	\N	\N	\N	2025-11-01 19:37:54.801	2025-12-05 10:51:01.181	ADVANCED	t	LOW	CAREER_SKILLS	\N	\N	0	{"en": "Leadership Skills Development", "es": "Desarrollo de Habilidades de Liderazgo", "ja": "リーダーシップスキル開発"}	{"en": "Develop leadership skills through daily practice: team management, decision making, communication.", "es": "Desarrolla habilidades de liderazgo a través de la práctica diaria: gestión de equipos, toma de decisiones, comunicación.", "ja": "毎日の実践を通じてリーダーシップスキルを開発:チーム管理、意思決定、コミュニケーション。"}	{"en": "Submit daily leadership practice records and reflection journals.", "es": "Envía registros diarios de práctica de liderazgo y diarios de reflexión.", "ja": "毎日リーダーシップ実践記録と振り返り日記を提出してください。"}	{"en": "Leadership practice logs + team feedback + reflection journal entries", "es": "Registros de práctica de liderazgo + comentarios del equipo + entradas de diario de reflexión", "ja": "リーダーシップ実践ログ+チームフィードバック+振り返り日記エントリー"}
cmgzc01en000ayikfsnredzxa	quick_creativity	创意表达挑战	每天进行30分钟创意活动，如写作、绘画、音乐创作等。	PERSONAL	PHOTO	f	168	8	每天分享创意作品照片或视频，展示创作过程和成果。	创意作品照片和创作过程记录	t	f	\N	\N	\N	2025-10-20 16:10:00.863	2025-12-05 22:51:31.613	BEGINNER	t	LOW	PERSONAL_CREATIVITY	\N	\N	0	{"en": "Daily Drawing Creative Practice", "es": "Práctica Creativa de Dibujo Diario", "ja": "毎日の絵画創作練習"}	{"en": "Practice drawing daily for 30 minutes, aiming for creative expression and skill improvement through continuous creative practice to cultivate artistic perception and creativity.", "es": "Practique dibujo diariamente durante 30 minutos, con el objetivo de expresión creativa y mejora de habilidades a través de práctica creativa continua para cultivar la percepción artística y la creatividad.", "ja": "毎日30分間絵画創作を練習し、継続的な創作練習を通じて創造的表現とスキル向上を目指し、芸術的知覚と創造性を養います。"}	{"en": "Practice drawing daily, can be sketching, watercolor, or digital painting. Submit creative work photos and creation process records, share creative inspiration and technique insights.", "es": "Practique dibujo diariamente, puede ser bocetos, acuarela o pintura digital. Envíe fotos de trabajos creativos y registros del proceso de creación, comparta inspiración creativa y conocimientos de técnicas.", "ja": "毎日絵画創作を練習し、スケッチ、水彩、またはデジタルペインティングができます。創作作品の写真と創作プロセスの記録を提出し、創作のインスピレーションと技法の洞察を共有してください。"}	{"en": "Photos of creative works or creation process videos", "es": "Fotos de obras creativas", "ja": "創造的な作品の写真"}
cmhgopm960001urpfmuheqg6k	health_sleep_quality	睡眠质量优化	优化睡眠环境和习惯：固定作息、睡前仪式、环境调整，全面提升睡眠质量	HEALTH	PHOTO	f	336	8	记录睡眠时间、睡眠质量、睡前活动，使用睡眠监测app追踪数据	睡眠日记+睡眠监测数据+睡眠环境照片	t	f	\N	\N	\N	2025-11-01 19:37:54.666	2025-12-05 10:51:00.768	INTERMEDIATE	f	LOW	HEALTH_SLEEP	\N	\N	0	{"en": "Sleep Quality Optimization", "es": "Optimización de la Calidad del Sueño", "ja": "睡眠質の最適化"}	{"en": "Optimize sleep environment and habits: fixed schedule, bedtime rituals, environment adjustments to improve sleep quality.", "es": "Optimiza el entorno y los hábitos de sueño para mejorar la calidad del sueño.", "ja": "睡眠環境と習慣を最適化し、睡眠の質を向上させます。"}	{"en": "Record sleep time, sleep quality, bedtime activities, use sleep tracking app to monitor data.", "es": "Registra el tiempo de sueño, la calidad del sueño y las actividades antes de dormir.", "ja": "睡眠時間、睡眠の質、就寝前の活動を記録してください。"}	{"en": "Sleep diary + sleep tracking data + sleep environment photos", "es": "Diario de sueño + datos de seguimiento del sueño + fotos del entorno", "ja": "睡眠日記+睡眠追跡データ+睡眠環境の写真"}
cmhgopm9d0004urpf1qe4smpc	health_diet_no_sugar	戒糖挑战	一周内不摄入添加糖，包括甜品、饮料、零食	HEALTH	PHOTO	f	168	6	每天拍摄饮食照片，证明无糖摄入	三餐照片，无甜品、无含糖饮料	t	f	\N	\N	\N	2025-11-01 19:37:54.673	2025-12-05 10:51:00.789	ADVANCED	f	MEDIUM	HEALTH_DIET	\N	\N	0	{"en": "Sugar-Free Challenge", "es": "Desafío Sin Azúcar", "ja": "砂糖断ちチャレンジ"}	{"en": "No added sugar intake for one week, including desserts, beverages, and snacks.", "es": "Sin ingesta de azúcar añadida durante una semana.", "ja": "1週間砂糖を摂取しません。"}	{"en": "Record daily meals and snacks, proving no added sugar consumption.", "es": "Registra las comidas y bocadillos diarios sin azúcar añadida.", "ja": "毎日の食事とスナックを記録し、砂糖を摂取していないことを証明してください。"}	{"en": "Daily meal photos + ingredient list showing no added sugar", "es": "Fotos de comidas diarias + lista de ingredientes sin azúcar", "ja": "毎日の食事の写真+砂糖不使用の成分リスト"}
cmhgopm9f0005urpfw878oqac	health_mental_meditation	每日冥想15分钟	每天进行15分钟正念冥想，缓解压力，提高专注力	HEALTH	PHOTO	f	168	10	每天拍摄冥想环境或冥想app记录	冥想app显示完成15分钟冥想的截图	t	f	\N	\N	\N	2025-11-01 19:37:54.676	2025-12-05 10:51:00.796	BEGINNER	t	LOW	HEALTH_MENTAL	\N	\N	0	{"en": "Daily 15-Minute Meditation", "es": "Meditación Diaria de 15 Minutos", "ja": "毎日15分瞑想"}	{"en": "Meditate for 15 minutes daily to reduce stress and improve focus.", "es": "Medita durante 15 minutos al día para reducir el estrés.", "ja": "毎日15分間瞑想し、ストレスを軽減します。"}	{"en": "Submit daily meditation app screenshots or meditation journal entries.", "es": "Envía capturas de pantalla diarias de la aplicación de meditación.", "ja": "毎日瞑想アプリのスクリーンショットを提出してください。"}	{"en": "Meditation app screenshot showing 15-minute session completion", "es": "Captura de pantalla mostrando sesión de 15 minutos", "ja": "15分間のセッション完了のスクリーンショット"}
cmhgopma7000eurpf62nemt77	fitness_flexibility_stretching	拉伸训练	每天15分钟全身拉伸，缓解肌肉紧张	FITNESS	PHOTO	f	168	12	每天拍摄拉伸训练照片	拉伸动作照片，显示时间	t	f	\N	\N	\N	2025-11-01 19:37:54.704	2025-12-05 10:51:00.851	BEGINNER	f	LOW	FITNESS_FLEXIBILITY	\N	\N	0	{"en": "Stretching Training", "es": "Entrenamiento de Estiramiento", "ja": "ストレッチトレーニング"}	{"en": "15-minute daily stretching routine to improve flexibility and prevent injuries.", "es": "Rutina diaria de estiramiento de 15 minutos para mejorar la flexibilidad.", "ja": "毎日15分間のストレッチルーティンで柔軟性を向上させます。"}	{"en": "Submit daily stretching routine photos or videos.", "es": "Envía fotos o videos diarios de la rutina de estiramiento.", "ja": "毎日ストレッチルーティンの写真またはビデオを提出してください。"}	{"en": "Stretching routine photos showing different stretches", "es": "Fotos de rutina de estiramiento mostrando diferentes estiramientos", "ja": "さまざまなストレッチを示すルーティン写真"}
cmhgopmad000hurpfw49zf4cp	learning_skill_programming	编程学习挑战	每天编程练习1小时，提升技术能力	LEARNING	PHOTO	f	168	12	每天拍摄代码编辑器截图或学习平台进度	VS Code编辑器截图，显示今日编写的代码	t	f	\N	\N	\N	2025-11-01 19:37:54.71	2025-12-05 10:51:00.872	INTERMEDIATE	t	LOW	LEARNING_SKILL	\N	\N	0	{"en": "Programming Learning Challenge", "es": "Desafío de Aprendizaje de Programación", "ja": "プログラミング学習チャレンジ"}	{"en": "Code for 1 hour daily to improve programming skills.", "es": "Programa durante 1 hora al día para mejorar las habilidades de programación.", "ja": "毎日1時間コーディングし、プログラミングスキルを向上させます。"}	{"en": "Submit daily code screenshots or GitHub commit records.", "es": "Envía capturas de pantalla diarias de código o registros de commits de GitHub.", "ja": "毎日コードのスクリーンショットまたはGitHubコミット記録を提出してください。"}	{"en": "Code screenshots or GitHub commit history", "es": "Capturas de pantalla de código o historial de commits de GitHub", "ja": "コードのスクリーンショットまたはGitHubコミット履歴"}
cmhgopmaq000nurpfx93gr8nl	personal_productivity_todo	每日任务清单	每天制定并完成至少5项任务	PERSONAL	PHOTO	f	168	12	每天拍摄任务清单和完成情况	待办事项app显示5项任务已完成	t	f	\N	\N	\N	2025-11-01 19:37:54.722	2025-12-05 10:51:00.913	BEGINNER	t	LOW	PERSONAL_PRODUCTIVITY	\N	\N	0	{"en": "Daily Task List", "es": "Lista de Tareas Diarias", "ja": "毎日タスクリスト"}	{"en": "Create and complete daily task list to improve time management and efficiency.", "es": "Crea y completa la lista de tareas diarias para mejorar la gestión del tiempo.", "ja": "毎日タスクリストを作成し完了させ、時間管理を改善します。"}	{"en": "Submit daily task list photos showing completed tasks.", "es": "Envía fotos diarias de la lista de tareas mostrando tareas completadas.", "ja": "毎日完了したタスクを示すタスクリストの写真を提出してください。"}	{"en": "Task list photo showing all tasks completed", "es": "Foto de la lista de tareas mostrando todas las tareas completadas", "ja": "すべてのタスクが完了したタスクリストの写真"}
cmhgopmau000purpf0nicgmk9	personal_creativity_drawing	每日绘画练习	每天绘画30分钟，提升艺术创作能力	PERSONAL	PHOTO	f	168	8	每天拍摄绘画作品照片	今日绘画作品照片	t	f	\N	\N	\N	2025-11-01 19:37:54.726	2025-12-05 10:51:00.926	BEGINNER	f	LOW	PERSONAL_CREATIVITY	\N	\N	0	{"en": "Daily Drawing Practice", "es": "Práctica Diaria de Dibujo", "ja": "毎日絵画練習"}	{"en": "Draw for 30 minutes daily to improve artistic skills and creativity.", "es": "Dibuja durante 30 minutos al día para mejorar las habilidades artísticas.", "ja": "毎日30分間絵を描き、芸術スキルを向上させます。"}	{"en": "Submit daily drawing photos or digital art screenshots.", "es": "Envía fotos diarias de dibujos o capturas de pantalla de arte digital.", "ja": "毎日絵の写真またはデジタルアートのスクリーンショットを提出してください。"}	{"en": "Daily drawing photos or digital art screenshots", "es": "Fotos diarias de dibujos o capturas de pantalla de arte digital", "ja": "毎日の絵の写真またはデジタルアートのスクリーンショット"}
cmhgopmbh000zurpfwr6w8s7n	career_startup_progress	创业项目日进展	每天推进创业项目，记录进展和成果	WORK	PHOTO	f	168	6	每天拍摄工作进展截图或成果照片	项目进度表截图或产品原型照片	t	f	\N	\N	\N	2025-11-01 19:37:54.75	2025-12-05 10:51:00.989	ADVANCED	f	MEDIUM	CAREER_STARTUP	\N	\N	0	{"en": "Daily Startup Progress", "es": "Progreso Diario de Startup", "ja": "毎日スタートアップ進捗"}	{"en": "Make daily progress on your startup project, including product development, marketing, or customer acquisition.", "es": "Haz progreso diario en tu proyecto de startup.", "ja": "毎日スタートアッププロジェクトを進めます。"}	{"en": "Submit daily work progress screenshots or achievement records.", "es": "Envía capturas de pantalla diarias del progreso del trabajo.", "ja": "毎日作業進捗のスクリーンショットを提出してください。"}	{"en": "Screenshots of code commits, marketing data, or customer feedback", "es": "Capturas de pantalla de commits de código, datos de marketing", "ja": "コードコミット、マーケティングデータのスクリーンショット"}
cmhgopmbl0011urpfmp7keobg	career_networking_linkedin	职场社交拓展	每天主动联系一位行业人士，扩展人脉	WORK	PHOTO	f	168	8	拍摄社交平台互动截图（隐藏隐私）	LinkedIn消息截图	t	f	\N	\N	\N	2025-11-01 19:37:54.754	2025-12-05 10:51:01.005	INTERMEDIATE	f	LOW	CAREER_NETWORKING	\N	\N	0	{"en": "Professional Networking Expansion", "es": "Expansión de Redes Profesionales", "ja": "職場ネットワーク拡大"}	{"en": "Connect with 5 new professionals weekly on LinkedIn to expand professional network.", "es": "Conéctate con 5 nuevos profesionales semanalmente en LinkedIn.", "ja": "毎週LinkedInで5人の新しい専門家とつながります。"}	{"en": "Submit weekly LinkedIn connection screenshots and networking records.", "es": "Envía capturas de pantalla semanales de conexiones de LinkedIn.", "ja": "毎週LinkedInの接続スクリーンショットを提出してください。"}	{"en": "LinkedIn connection screenshots showing new connections", "es": "Capturas de pantalla de LinkedIn mostrando nuevas conexiones", "ja": "新しい接続を示すLinkedInスクリーンショット"}
cmhgopmbu0015urpfkmbyg7cp	quick_no_junk_food	戒零食挑战	一周内不吃任何零食和垃圾食品	HEALTH	PHOTO	f	168	10	每天拍摄三餐照片，证明无零食	健康三餐照片	t	f	\N	\N	\N	2025-11-01 19:37:54.762	2025-12-05 10:51:01.037	INTERMEDIATE	t	LOW	HEALTH_DIET	\N	\N	0	{"en": "No Junk Food Challenge", "es": "Desafío Sin Comida Chatarra", "ja": "ジャンクフード断ちチャレンジ"}	{"en": "Avoid junk food for one week to develop healthier eating habits.", "es": "Evita la comida chatarra durante una semana para desarrollar hábitos alimenticios más saludables.", "ja": "1週間ジャンクフードを避け、より健康的な食習慣を身につけます。"}	{"en": "Submit daily meal photos proving no junk food consumption.", "es": "Envía fotos diarias de comidas demostrando que no consumes comida chatarra.", "ja": "毎日の食事の写真を提出し、ジャンクフードを食べていないことを証明してください。"}	{"en": "Daily healthy meal photos without junk food", "es": "Fotos diarias de comidas saludables sin comida chatarra", "ja": "ジャンクフードなしの毎日の健康的な食事の写真"}
cmhgopmbx0017urpf26ak28gs	quick_stairs_climbing	爬楼梯挑战	每天爬楼梯10层，简单有效的有氧运动	FITNESS	PHOTO	f	168	15	每天拍摄楼梯照片或运动app记录	楼梯间照片+运动app显示爬楼10层	t	f	\N	\N	\N	2025-11-01 19:37:54.766	2025-12-05 10:51:01.053	BEGINNER	t	LOW	FITNESS_CARDIO	\N	\N	0	{"en": "Stairs Climbing Challenge", "es": "Desafío de Subir Escaleras", "ja": "階段登りチャレンジ"}	{"en": "Climb 10 flights of stairs daily to improve cardiovascular fitness.", "es": "Sube 10 pisos de escaleras al día para mejorar la condición cardiovascular.", "ja": "毎日10階分の階段を登り、心肺機能を向上させます。"}	{"en": "Submit daily stair climbing records or fitness tracker screenshots.", "es": "Envía registros diarios de subida de escaleras o capturas de pantalla del rastreador de fitness.", "ja": "毎日階段登り記録またはフィットネストラッカーのスクリーンショットを提出してください。"}	{"en": "Fitness tracker screenshot showing 10+ flights climbed", "es": "Captura de pantalla del rastreador de fitness mostrando 10+ pisos subidos", "ja": "10階以上登ったことを示すフィットネストラッカーのスクリーンショット"}
cmhgopmc4001aurpfbpj0gk6b	quick_no_phone_morning	早晨不看手机	每天早上起床后1小时内不看手机	PERSONAL	PHOTO	f	168	10	每天拍摄手机屏幕使用时间截图	屏幕使用时间显示早上7-8点无使用记录	t	f	\N	\N	\N	2025-11-01 19:37:54.772	2025-12-05 10:51:01.075	INTERMEDIATE	t	LOW	PERSONAL_PRODUCTIVITY	\N	\N	0	{"en": "No Phone in the Morning", "es": "Sin Teléfono por la Mañana", "ja": "朝スマホを見ない"}	{"en": "Avoid checking phone for the first hour after waking up to start the day mindfully.", "es": "Evita revisar el teléfono durante la primera hora después de despertar.", "ja": "起床後最初の1時間はスマホを見ないようにします。"}	{"en": "Submit daily morning routine photos proving no phone usage.", "es": "Envía fotos diarias de la rutina matutina demostrando que no usas el teléfono.", "ja": "毎日朝のルーティンの写真を提出し、スマホを使用していないことを証明してください。"}	{"en": "Morning activity photos without phone usage", "es": "Fotos de actividades matutinas sin uso del teléfono", "ja": "スマホを使用していない朝の活動の写真"}
cmhgopmcb001eurpfx3eu7prl	advanced_intermittent_fasting	间歇性断食计划	16:8间歇性断食，每天16小时断食，8小时进食窗口	HEALTH	PHOTO	t	336	6	每天记录进食时间窗口，拍摄饮食照片	进食时间记录：12:00-20:00，三餐照片	t	t	BASIC	\N	\N	2025-11-01 19:37:54.78	2025-12-05 10:51:01.106	ADVANCED	f	MEDIUM	HEALTH_DIET	\N	\N	0	{"en": "Intermittent Fasting 16:8", "es": "Ayuno Intermitente 16:8", "ja": "間欠的断食16:8"}	{"en": "Practice 16:8 intermittent fasting daily: fast for 16 hours, eat within 8-hour window.", "es": "Practica ayuno intermitente 16:8 diariamente: ayuna durante 16 horas, come en ventana de 8 horas.", "ja": "毎日16:8間欠的断食を実践:16時間断食、8時間以内に食事。"}	{"en": "Submit daily fasting schedule records and meal timing photos.", "es": "Envía registros diarios del horario de ayuno y fotos del momento de las comidas.", "ja": "毎日断食スケジュール記録と食事タイミングの写真を提出してください。"}	{"en": "Fasting app screenshot showing 16-hour fast completion", "es": "Captura de pantalla de la aplicación de ayuno mostrando 16 horas de ayuno completadas", "ja": "16時間断食完了を示す断食アプリのスクリーンショット"}
cmhgopmcf001gurpfm1492xd0	advanced_marathon_training	马拉松训练计划	12周马拉松训练计划，逐步提升跑步能力	FITNESS	PHOTO	f	2016	6	每次训练记录距离、配速、心率	跑步app详细数据截图	t	t	BASIC	\N	\N	2025-11-01 19:37:54.783	2025-12-05 10:51:01.114	EXPERT	f	MEDIUM	FITNESS_CARDIO	\N	\N	0	{"en": "Marathon Training Program", "es": "Programa de Entrenamiento de Maratón", "ja": "マラソントレーニングプログラム"}	{"en": "Follow structured marathon training plan to prepare for a full marathon.", "es": "Sigue un plan de entrenamiento de maratón estructurado para prepararte para un maratón completo.", "ja": "フルマラソンに向けた構造化されたトレーニング計画に従います。"}	{"en": "Submit daily training run records with distance and pace data.", "es": "Envía registros diarios de carreras de entrenamiento con datos de distancia y ritmo.", "ja": "毎日トレーニングランの記録と距離、ペースデータを提出してください。"}	{"en": "Running app screenshots showing training runs and progress", "es": "Capturas de pantalla de la aplicación de carrera mostrando carreras de entrenamiento y progreso", "ja": "トレーニングランと進捗を示すランニングアプリのスクリーンショット"}
cmhgopmch001hurpf51r1s0te	advanced_muscle_building	增肌训练计划	系统的增肌训练：力量训练+营养补充+充足休息	FITNESS	PHOTO	f	672	6	记录训练计划、饮食摄入、体重变化	训练记录+饮食照片+体重数据	t	f	\N	\N	\N	2025-11-01 19:37:54.785	2025-12-05 10:51:01.122	ADVANCED	t	MEDIUM	FITNESS_STRENGTH	\N	\N	0	{"en": "Muscle Building Program", "es": "Programa de Construcción Muscular", "ja": "筋肉増強プログラム"}	{"en": "Follow comprehensive muscle building program with progressive overload training.", "es": "Sigue un programa integral de construcción muscular con entrenamiento de sobrecarga progresiva.", "ja": "漸進的過負荷トレーニングを含む包括的な筋肉増強プログラムに従います。"}	{"en": "Submit daily workout logs with exercises, sets, reps, and weights.", "es": "Envía registros diarios de entrenamiento con ejercicios, series, repeticiones y pesos.", "ja": "毎日エクササイズ、セット、レップ、重量を含むワークアウトログを提出してください。"}	{"en": "Workout log showing exercises, sets, reps, and progressive weight increases", "es": "Registro de entrenamiento mostrando ejercicios, series, repeticiones y aumentos progresivos de peso", "ja": "エクササイズ、セット、レップ、漸進的な重量増加を示すワークアウトログ"}
cmhgopmcn001kurpfmk8lj9l9	advanced_habit_stacking	习惯叠加计划	同时养成多个好习惯，通过习惯叠加提升效率	PERSONAL	PHOTO	f	336	8	每天完成习惯清单，记录完成情况	习惯追踪表照片	t	t	BASIC	\N	\N	2025-11-01 19:37:54.791	2025-12-05 10:51:01.143	ADVANCED	f	LOW	PERSONAL_PRODUCTIVITY	\N	\N	0	{"en": "Habit Stacking Challenge", "es": "Desafío de Apilamiento de Hábitos", "ja": "習慣スタッキングチャレンジ"}	{"en": "Build multiple positive habits by stacking them together in a daily routine.", "es": "Construye múltiples hábitos positivos apilándolos juntos en una rutina diaria.", "ja": "複数のポジティブな習慣を毎日のルーティンに積み重ねて構築します。"}	{"en": "Submit daily habit stack completion checklists showing all habits completed.", "es": "Envía listas de verificación diarias de finalización de apilamiento de hábitos mostrando todos los hábitos completados.", "ja": "毎日すべての習慣が完了したことを示す習慣スタック完了チェックリストを提出してください。"}	{"en": "Habit tracking app screenshot showing all stacked habits completed", "es": "Captura de pantalla de la aplicación de seguimiento de hábitos mostrando todos los hábitos apilados completados", "ja": "すべてのスタックされた習慣が完了したことを示す習慣追跡アプリのスクリーンショット"}
cmhgopmcq001murpfg54umnio	advanced_minimalism	极简生活挑战	30天极简生活：断舍离、减少物欲、专注重要事物	LIFESTYLE	PHOTO	f	720	8	每天记录断舍离进展，拍摄整理成果	整理前后对比照片	t	f	\N	\N	\N	2025-11-01 19:37:54.795	2025-12-05 10:51:01.158	INTERMEDIATE	t	LOW	LIFESTYLE_HOME	\N	\N	0	{"en": "Minimalist Lifestyle Challenge", "es": "Desafío de Estilo de Vida Minimalista", "ja": "ミニマリストライフスタイルチャレンジ"}	{"en": "Declutter and simplify life by removing one unnecessary item daily for 30 days.", "es": "Desordena y simplifica la vida eliminando un artículo innecesario al día durante 30 días.", "ja": "30日間毎日不要なアイテムを1つ取り除き、生活を整理し簡素化します。"}	{"en": "Submit daily photos of items removed and decluttered spaces.", "es": "Envía fotos diarias de artículos eliminados y espacios ordenados.", "ja": "毎日取り除いたアイテムと整理されたスペースの写真を提出してください。"}	{"en": "Photos of items removed + before/after photos of decluttered spaces", "es": "Fotos de artículos eliminados + fotos de antes/después de espacios ordenados", "ja": "取り除いたアイテムの写真+整理されたスペースのビフォーアフター写真"}
\.


--
-- Data for Name: group_members; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.group_members (id, group_id, user_id, role, joined_at, last_active_at) FROM stdin;
\.


--
-- Data for Name: group_posts; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.group_posts (id, group_id, author_id, title, content, type, attachments, is_pinned, is_locked, likes_count, comments_count, views_count, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.messages (id, sender_id, receiver_id, content, type, is_read, read_at, created_at, updated_at) FROM stdin;
cmg6z4zon0001abrn6qij8a61	cmfgpklkn000114lt1n0ec61k	cmfgpmfbo000314ltz0jj7n1y	sdf	TEXT	t	2025-09-30 19:52:55.285	2025-09-30 19:52:23.975	2025-09-30 19:52:55.286
cmg6z55n60003abrn4vfkqfpv	cmfgpklkn000114lt1n0ec61k	cmfgpmfbo000314ltz0jj7n1y	😗sadff	TEXT	t	2025-09-30 19:52:55.285	2025-09-30 19:52:31.698	2025-09-30 19:52:55.286
cmg6zfk9g0005abrnrdo8prfn	cmfgpmfbo000314ltz0jj7n1y	cmfgpklkn000114lt1n0ec61k	sadf😁	TEXT	t	2025-09-30 20:00:53.457	2025-09-30 20:00:37.204	2025-09-30 20:00:53.458
cmg70ruv9000drndh8wsqw25r	cmfgpklkn000114lt1n0ec61k	cmfgpmfbo000314ltz0jj7n1y	sadfsf🙂	TEXT	t	2025-09-30 20:38:19.769	2025-09-30 20:38:10.437	2025-09-30 20:38:19.77
cmghqhhvk000712etxbmxhzz5	cmfgpklkn000114lt1n0ec61k	cmfgpmfbo000314ltz0jj7n1y	🐹	EMOJI	f	\N	2025-10-08 08:35:38.816	2025-10-08 08:35:38.816
cmh9vzjmk000dn9ut7wsfunsd	cmfgpklkn000114lt1n0ec61k	cmfgpmfbo000314ltz0jj7n1y	😍 大师傅但是	TEXT	f	\N	2025-10-28 01:27:11.9	2025-10-28 01:27:11.9
cmg7cjaha0005ugthpjrimt7c	cmfgpjvmb000014ltuwk3uwht	cmfgpklkn000114lt1n0ec61k	sdfsd	TEXT	t	2025-11-03 01:38:32.958	2025-10-01 02:07:26.158	2025-11-03 01:38:32.959
cmg7cjfmc0007ugthpujtklfg	cmfgpjvmb000014ltuwk3uwht	cmfgpklkn000114lt1n0ec61k	😗sdfsf	TEXT	t	2025-11-03 01:38:32.958	2025-10-01 02:07:32.821	2025-11-03 01:38:32.959
cmgaq9etz0003uwbt1n5b3nrf	cmfgpjvmb000014ltuwk3uwht	cmfgpklkn000114lt1n0ec61k	🙂	EMOJI	t	2025-11-03 01:38:32.958	2025-10-03 10:54:58.391	2025-11-03 01:38:32.959
cmhih1evl002j141v6gi44v3m	cmfgpklkn000114lt1n0ec61k	cmfgpjvmb000014ltuwk3uwht	👍 ok	TEXT	f	\N	2025-11-03 01:38:40.402	2025-11-03 01:38:40.402
\.


--
-- Data for Name: notification_settings; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.notification_settings (id, user_id, in_app_enabled, email_enabled, email_frequency, push_enabled, game_invites, game_updates, friend_requests, achievements, system_updates, quiet_hours_enabled, quiet_hours_start, quiet_hours_end, created_at, updated_at) FROM stdin;
cmg15soyn0003wp8jm8677b3l	cmfgpmfbo000314ltz0jj7n1y	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-09-26 18:12:10.463	2025-09-26 18:12:10.463
cmg15sxgh0007wp8j0ypgfmmd	cmfgpklkn000114lt1n0ec61k	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-09-26 18:12:21.473	2025-09-26 18:12:21.473
cmg70p4h30003rndhfc0yrp52	cmfgpjvmb000014ltuwk3uwht	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-09-30 20:36:02.919	2025-09-30 20:36:02.919
cmg70p8z00009rndhn5bp5979	cmfhqhbdo001p8y89uh5fot7e	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-09-30 20:36:08.748	2025-09-30 20:36:08.748
cmg72bbpr000342kmaakae4gf	cmfhqg9mg001k8y89kdji8pwn	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-09-30 21:21:18.351	2025-09-30 21:21:18.351
cmgxzfncb0004hak2lybuqfr9	cmgxzbcqh0000hak2a2jt0wwa	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-10-19 17:30:27.947	2025-10-19 17:30:27.947
cmhhug7hw000q5er4ib8cmufl	cmhc7jd8w0006x7g1c2qc46o4	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-11-02 15:06:19.507	2025-11-02 15:06:19.507
cmhhuh85a000w5er4jaz5bzpj	cmfiilojw000ao5ubr1d3vfk0	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-11-02 15:07:07.006	2025-11-02 15:07:07.006
cmhih0hy3002b141v1tftvrk5	cmhcc8p1o000atqgxpzkeao00	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-11-03 01:37:57.723	2025-11-03 01:37:57.723
cmhih0jnb002f141vnnty6858	cmhcegfin0006hcgendh83z40	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-11-03 01:37:59.927	2025-11-03 01:37:59.927
cmhlgi0d4000jtnfewsq9a13i	cmgxdqce80000108q18y4npo0	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-11-05 03:46:53.656	2025-11-05 03:46:53.656
cmhlgide8000ptnfeey049o6x	cmh36n1zs0005td07t6m368m7	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-11-05 03:47:10.544	2025-11-05 03:47:10.544
cmil1yq3u000lbbju8uknzwtl	cmhcfohf30006dc0nyhcbivhr	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-11-30 01:39:41.61	2025-11-30 01:39:41.61
cmim0ij26008k4hzvpqxk79n1	cmh7b4pkq000wd3m04ocsbh45	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-11-30 17:46:52.542	2025-11-30 17:46:52.542
cmim0sehm009c4hzv2jn7cwsg	cmh7d0ay1000zd3m01yxn28f4	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-11-30 17:54:33.178	2025-11-30 17:54:33.178
cmim1pxam000ut9hyrifbiva1	cmh24ml660003td0740yexg8h	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-11-30 18:20:37.198	2025-11-30 18:20:37.198
cmim1th9i0015t9hyj3t0kv6m	cmh4rbv470000d3m0tokxkudd	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-11-30 18:23:23.046	2025-11-30 18:23:23.046
cmio79glv00102nukwkgrzgst	cmfhsxf490000lmmnwp77vl6x	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-12-02 06:31:19.123	2025-12-02 06:31:19.123
cmiss2bpi0020p50bw77mvtmn	cmgxfcw0d0000o777zhox72xw	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-12-05 11:24:42.822	2025-12-05 11:24:42.822
cmitmlesk000bh5o1r54b0if8	cmfgplidl000214ltrltpgf6s	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-12-06 01:39:21.765	2025-12-06 01:39:21.765
cmiv32sa5002nnbfdp9p9gc1b	cmiv2q81u002lnbfd2rx5l615	t	t	IMMEDIATE	t	t	t	t	t	t	f	\N	\N	2025-12-07 02:08:32.429	2025-12-07 02:08:32.429
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.notifications (id, user_id, type, title, message, data, is_read, channels, priority, email_sent, email_sent_at, created_at, read_at) FROM stdin;
cmfhrgalq00208y89af2tlb1k	cmfgpmfbo000314ltz0jj7n1y	GAME_STARTED	挑战开始了！	"某某挑战某某挑战某某挑战1" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战1\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-13 04:23:00.014	\N
cmfhrgalq00228y89l8pf04rj	cmfhqg9mg001k8y89kdji8pwn	GAME_STARTED	挑战开始了！	"某某挑战某某挑战某某挑战1" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战1\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-13 04:23:00.014	\N
cmfhrgalq00238y895qq68j86	cmfhqhbdo001p8y89uh5fot7e	GAME_STARTED	挑战开始了！	"某某挑战某某挑战某某挑战1" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战1\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-13 04:23:00.014	\N
cmfhsgawe00258y896v2ke77o	cmfgpmfbo000314ltz0jj7n1y	GAME_STARTED	挑战开始了！	"某某挑战某某挑战某某挑战某某挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfhq8bgr000j8y89g2lakoac\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战某某挑战\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-13 04:51:00.014	\N
cmfhsgawe00278y89xssr1n3y	cmfhqhbdo001p8y89uh5fot7e	GAME_STARTED	挑战开始了！	"某某挑战某某挑战某某挑战某某挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfhq8bgr000j8y89g2lakoac\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战某某挑战\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-13 04:51:00.014	\N
cmfht0sad0001t2iuo4dczvih	cmfgpklkn000114lt1n0ec61k	GAME_COMPLETED	VIP购买成功	恭喜您成功购买精英会员！享受VIP专属特权，有效期至10/13/2025。	\N	t	{IN_APP}	NORMAL	f	\N	2025-09-13 05:06:55.669	2025-09-13 05:22:00.597
cmfhrgalq001z8y897sxevrjb	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"某某挑战某某挑战某某挑战1" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战1\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-13 04:23:00.014	2025-09-13 05:22:03.504
cmfhtlgdt0002vzowflowit1f	cmfgpmfbo000314ltz0jj7n1y	EVIDENCE_REQUIRED	请提交证据	"某某挑战某某挑战某某挑战1" 挑战已结束，请在 9/13/2025 前提交证据	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战1\\",\\"deadline\\":\\"2025-09-13T05:51:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-13 05:23:00.017	\N
cmfhtlgdu0005vzowlud3fc2o	cmfhqhbdo001p8y89uh5fot7e	EVIDENCE_REQUIRED	请提交证据	"某某挑战某某挑战某某挑战1" 挑战已结束，请在 9/13/2025 前提交证据	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战1\\",\\"deadline\\":\\"2025-09-13T05:51:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-13 05:23:00.017	\N
cmfhrgalq00218y89y5txg7x3	cmfgplidl000214ltrltpgf6s	GAME_STARTED	挑战开始了！	"某某挑战某某挑战某某挑战1" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战1\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-13 04:23:00.014	2025-09-13 05:23:13.463
cmfhsgawe00268y89to3ar8rg	cmfgplidl000214ltrltpgf6s	GAME_STARTED	挑战开始了！	"某某挑战某某挑战某某挑战某某挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfhq8bgr000j8y89g2lakoac\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战某某挑战\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-13 04:51:00.014	2025-09-13 05:23:13.463
cmfhtlgdt0003vzowkjg21ktr	cmfgplidl000214ltrltpgf6s	EVIDENCE_REQUIRED	请提交证据	"某某挑战某某挑战某某挑战1" 挑战已结束，请在 9/13/2025 前提交证据	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战1\\",\\"deadline\\":\\"2025-09-13T05:51:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-13 05:23:00.017	2025-09-13 05:23:13.463
cmhmhsqlt000qh5w4d9kej668	cmhc7jd8w0006x7g1c2qc46o4	GAME_STARTED	挑战开始了！	"OSS图片视频证据上传测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhmhl67p0001h5w42mdl7qi1\\",\\"gameTitle\\":\\"OSS图片视频证据上传测试\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 21:11:00.017	\N
cmfhxpcgq000111yb9had2ckd	cmfgpmfbo000314ltz0jj7n1y	EVIDENCE_REQUIRED	请提交证据	"某某挑战某某挑战某某挑战某某挑战" 挑战已结束，请在 9/13/2025 前提交证据	"{\\"gameId\\":\\"cmfhq8bgr000j8y89g2lakoac\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战某某挑战\\",\\"deadline\\":\\"2025-09-13T09:25:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-13 07:18:00.027	\N
cmfhxpcgq000211ybd87fmakb	cmfgplidl000214ltrltpgf6s	EVIDENCE_REQUIRED	请提交证据	"某某挑战某某挑战某某挑战某某挑战" 挑战已结束，请在 9/13/2025 前提交证据	"{\\"gameId\\":\\"cmfhq8bgr000j8y89g2lakoac\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战某某挑战\\",\\"deadline\\":\\"2025-09-13T09:25:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-13 07:18:00.027	\N
cmfhxpcgr000311ybdmu87vtk	cmfhqhbdo001p8y89uh5fot7e	EVIDENCE_REQUIRED	请提交证据	"某某挑战某某挑战某某挑战某某挑战" 挑战已结束，请在 9/13/2025 前提交证据	"{\\"gameId\\":\\"cmfhq8bgr000j8y89g2lakoac\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战某某挑战\\",\\"deadline\\":\\"2025-09-13T09:25:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-13 07:18:00.027	\N
cmfhzuhra0001foqqzlc1tij8	cmfgpmfbo000314ltz0jj7n1y	GAME_COMPLETED	VIP购买成功	恭喜您成功购买精英会员！享受VIP专属特权，有效期至10/13/2025。	\N	f	{IN_APP}	NORMAL	f	\N	2025-09-13 08:17:59.398	\N
cmfhrgalq001y8y89jqd6otvq	cmfgpjvmb000014ltuwk3uwht	GAME_STARTED	挑战开始了！	"某某挑战某某挑战某某挑战1" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战1\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-13 04:23:00.014	2025-09-13 17:57:09.407
cmfhsgawe00248y89jzfk0ukz	cmfgpjvmb000014ltuwk3uwht	GAME_STARTED	挑战开始了！	"某某挑战某某挑战某某挑战某某挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfhq8bgr000j8y89g2lakoac\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战某某挑战\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-13 04:51:00.014	2025-09-13 17:57:09.407
cmfhtlgdt0001vzow0oqcuzqm	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"某某挑战某某挑战某某挑战1" 挑战已结束，请在 9/13/2025 前提交证据	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战1\\",\\"deadline\\":\\"2025-09-13T05:51:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-13 05:23:00.017	2025-09-14 12:32:13.937
cmhmhsqlt000rh5w47edqe84s	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"OSS图片视频证据上传测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhmhl67p0001h5w42mdl7qi1\\",\\"gameTitle\\":\\"OSS图片视频证据上传测试\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 21:11:00.017	2025-11-06 08:53:23.958
cmhmhsqlt000ph5w4pz8717hd	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"OSS图片视频证据上传测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhmhl67p0001h5w42mdl7qi1\\",\\"gameTitle\\":\\"OSS图片视频证据上传测试\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 21:11:00.017	2025-11-06 11:00:33.065
cmfigmbmw00078ulai4tv6r9s	cmfhqhbdo001p8y89uh5fot7e	GAME_COMPLETED	VIP购买成功	恭喜您成功购买基础会员！享受VIP专属特权，有效期至10/13/2025。	\N	f	{IN_APP}	NORMAL	f	\N	2025-09-13 16:07:31.688	\N
cmfii02yc000l8ulayg407qcx	cmfgplidl000214ltrltpgf6s	GAME_COMPLETED	VIP购买成功	恭喜您成功购买基础会员！享受VIP专属特权，有效期至10/13/2025。	\N	f	{IN_APP}	NORMAL	f	\N	2025-09-13 16:46:13.236	\N
cmfii160j000n8ula9rx26mp5	cmfhqg9mg001k8y89kdji8pwn	GAME_COMPLETED	VIP购买成功	恭喜您成功购买高级会员！享受VIP专属特权，有效期至10/13/2025。	\N	f	{IN_APP}	NORMAL	f	\N	2025-09-13 16:47:03.86	\N
cmfijyxbu0009st75f4zt212i	cmfhqg9mg001k8y89kdji8pwn	GAME_COMPLETED	VIP购买成功	恭喜您成功购买高级会员！享受VIP专属特权，有效期至10/13/2025。	\N	t	{IN_APP}	NORMAL	f	\N	2025-09-13 17:41:18.522	2025-09-13 17:41:27.428
cmfhtlgdu0004vzowa4at36uv	cmfhqg9mg001k8y89kdji8pwn	EVIDENCE_REQUIRED	请提交证据	"某某挑战某某挑战某某挑战1" 挑战已结束，请在 9/13/2025 前提交证据	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战1\\",\\"deadline\\":\\"2025-09-13T05:51:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-13 05:23:00.017	2025-09-13 17:46:59.763
cmfhxpcgq000011ybvdghdy5q	cmfgpjvmb000014ltuwk3uwht	EVIDENCE_REQUIRED	请提交证据	"某某挑战某某挑战某某挑战某某挑战" 挑战已结束，请在 9/13/2025 前提交证据	"{\\"gameId\\":\\"cmfhq8bgr000j8y89g2lakoac\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战某某挑战\\",\\"deadline\\":\\"2025-09-13T09:25:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-13 07:18:00.027	2025-09-13 17:47:48.818
cmfhtlgdt0000vzow8le94mo4	cmfgpjvmb000014ltuwk3uwht	EVIDENCE_REQUIRED	请提交证据	"某某挑战某某挑战某某挑战1" 挑战已结束，请在 9/13/2025 前提交证据	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战1\\",\\"deadline\\":\\"2025-09-13T05:51:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-13 05:23:00.017	2025-09-13 17:57:09.407
cmfi1bj9a0002tc5ml3aj4bdg	cmfgpjvmb000014ltuwk3uwht	GAME_COMPLETED	VIP购买成功	恭喜您成功购买基础会员！享受VIP专属特权，有效期至10/13/2025。	\N	t	{IN_APP}	NORMAL	f	\N	2025-09-13 08:59:14.11	2025-09-13 17:57:09.407
cmfiig2vk0001o5ubw6qqsj9k	cmfgpjvmb000014ltuwk3uwht	GAME_COMPLETED	VIP购买成功	恭喜您成功购买基础会员！享受VIP专属特权，有效期至10/13/2025。	\N	t	{IN_APP}	NORMAL	f	\N	2025-09-13 16:58:39.632	2025-09-13 17:57:09.407
cmfijy92c0007st75oxg2fsn7	cmfgpjvmb000014ltuwk3uwht	GAME_COMPLETED	VIP购买成功	恭喜您成功购买精英会员！享受VIP专属特权，有效期至10/13/2025。	\N	t	{IN_APP}	NORMAL	f	\N	2025-09-13 17:40:47.076	2025-09-13 17:57:09.407
cmfj5kkb3000ist75t1zww89k	cmfgpmfbo000314ltz0jj7n1y	GAME_STARTED	挑战开始了！	"语言学习打卡" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfhq60vo00018y89c4tyvorz\\",\\"gameTitle\\":\\"语言学习打卡\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-14 03:46:00.015	\N
cmfj5lulo000jst75fjxumzm2	cmfgpjvmb000014ltuwk3uwht	GAME_STARTED	挑战开始了！	"每日运动挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfhq6xoa000d8y89mv90gi3f\\",\\"gameTitle\\":\\"每日运动挑战\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-14 03:47:00.012	\N
cmfj5lult000kst75gbwnzfxz	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"每日阅读" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfhq6fnn00078y89ear6ausw\\",\\"gameTitle\\":\\"每日阅读\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-14 03:47:00.018	2025-09-14 12:53:22.915
cmfjw2s5x000iaz4kgqqx2ukk	cmfhqhbdo001p8y89uh5fot7e	GAME_STARTED	挑战开始了！	"正念冥想之旅" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfign35x00098ulaq227751c\\",\\"gameTitle\\":\\"正念冥想之旅\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-14 16:08:00.021	\N
cmfjw2s67000jaz4kik9sfboy	cmfhqg9mg001k8y89kdji8pwn	GAME_STARTED	挑战开始了！	"精英生产力挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfignse8000f8ulax88ui5ce\\",\\"gameTitle\\":\\"精英生产力挑战\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-14 16:08:00.032	\N
cmhmhsqlt000oh5w4586gyc30	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"OSS图片视频证据上传测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhmhl67p0001h5w42mdl7qi1\\",\\"gameTitle\\":\\"OSS图片视频证据上传测试\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 21:11:00.017	2025-11-05 21:11:59.953
cmhmh312a004dxskeh2nhblaz	cmhcegfin0006hcgendh83z40	PEER_REVIEW_REQUEST	互评阶段开始	"自我评价测试文字字数---" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhlabhi0003p72stcmydpbw1\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.514	2025-11-06 08:53:23.958
cmhmh3133004lxskemtjha6o8	cmhcegfin0006hcgendh83z40	PEER_REVIEW_REQUEST	互评阶段开始	"测试大文件和视频上传" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhl2btuq001mqg348jq0sk3v\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.543	2025-11-06 08:53:23.958
cmfnew41k000624jjlgk64hkh	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"高级健身追踪" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmflzh4ka000124jjoxctvu86\\",\\"gameTitle\\":\\"高级健身追踪\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-17 03:18:00.056	2025-09-18 21:42:24.105
cmhmh313a004oxskebem2xx18	cmhcegfin0006hcgendh83z40	PEER_REVIEW_REQUEST	互评阶段开始	"AAAAAAAAAAA" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhlljrtz001b3fyju6ayec2i\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.55	2025-11-06 08:53:23.958
cmft5ot9u000e24jj2zcq0b8u	cmfgpjvmb000014ltuwk3uwht	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 9/23/2025 前提交证据	"{\\"gameId\\":\\"cmfhq6xoa000d8y89mv90gi3f\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-09-23T03:47:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-21 03:47:00.018	\N
cmfv0ixn400169isawmme661b	cmfgpmfbo000314ltz0jj7n1y	GAME_STARTED	挑战开始了！	"修复测试游戏" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfuydo8w00029isa7gi8qtp8\\",\\"gameTitle\\":\\"修复测试游戏\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-22 10:58:00.016	\N
cmhmh3148004yxskeyq4v6sz2	cmhcegfin0006hcgendh83z40	PEER_REVIEW_REQUEST	互评阶段开始	"测试全部不选是否可以提交" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhmbelwy0001xskel3wdmqba\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.585	2025-11-06 08:53:23.958
cmhmh314m0050xske0r6ytxsz	cmhcegfin0006hcgendh83z40	PEER_REVIEW_REQUEST	互评阶段开始	"都不选择，测试专用 AAAAAAA" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhllzihs002g3fyj6m6t6crl\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.598	2025-11-06 08:53:23.958
cmfwdtmj200199isakqpxztxy	cmfgpmfbo000314ltz0jj7n1y	GAME_STARTED	挑战开始了！	"冥想练习" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfuyetx500099isac841d0t3\\",\\"gameTitle\\":\\"冥想练习\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-23 09:58:00.015	\N
cmfwduwts001a9isachul10kk	cmfgpmfbo000314ltz0jj7n1y	GAME_STARTED	挑战开始了！	"语言学习打卡" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfuyff36000g9isakmxjcmr5\\",\\"gameTitle\\":\\"语言学习打卡\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-23 09:59:00.017	\N
cmfweacdu001b9isa71r13eke	cmfhsxf490000lmmnwp77vl6x	GAME_STARTED	挑战开始了！	"每日阅读" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfuyvpzc000n9isava0zsvl4\\",\\"gameTitle\\":\\"每日阅读\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-23 10:11:00.018	\N
cmfwf7s33001d9isavrs44a2m	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"早起挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfuzsf8w00119isa4t5mlh68\\",\\"gameTitle\\":\\"早起挑战\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-23 10:37:00.015	2025-09-25 01:32:43.422
cmg062gll000o2tw3dlmcwwuf	cmfiilojw000ao5ubr1d3vfk0	GAME_STARTED	挑战开始了！	"每日饮水" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfyqnpxt001n9isaa0gg32w9\\",\\"gameTitle\\":\\"每日饮水\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-26 01:32:00.009	\N
cmg062gll000n2tw308b8jlap	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"每日饮水" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfyqnpxt001n9isaa0gg32w9\\",\\"gameTitle\\":\\"每日饮水\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-26 01:32:00.009	2025-09-26 18:04:38.871
cmhmhvb76000sh5w45qbxq9d7	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"OSS图片视频证据上传测试" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmhl67p0001h5w42mdl7qi1\\",\\"gameTitle\\":\\"OSS图片视频证据上传测试\\",\\"deadline\\":\\"2025-11-05T21:30:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 21:13:00.018	\N
cmg15soyq0005wp8j90y8hjyf	cmfgpmfbo000314ltz0jj7n1y	FRIEND_REQUEST	新的好友请求	@test789 想要添加您为好友	"{\\"requesterUsername\\":\\"test789\\"}"	t	{IN_APP}	NORMAL	t	2025-09-26 18:12:10.474	2025-09-26 18:12:10.467	2025-09-26 18:12:19.514
cmg15sxgk0009wp8j297wtp9v	cmfgpklkn000114lt1n0ec61k	FRIEND_ACCEPTED	好友请求已接受	@testuser123 接受了您的好友请求	"{\\"addresseeUsername\\":\\"testuser123\\"}"	t	{IN_APP}	NORMAL	t	2025-09-26 18:12:21.482	2025-09-26 18:12:21.477	2025-09-26 18:12:38.138
cmhmhvb76000uh5w4cub81e80	cmhc7jd8w0006x7g1c2qc46o4	EVIDENCE_REQUIRED	请提交证据	"OSS图片视频证据上传测试" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmhl67p0001h5w42mdl7qi1\\",\\"gameTitle\\":\\"OSS图片视频证据上传测试\\",\\"deadline\\":\\"2025-11-05T21:30:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 21:13:00.018	\N
cmfl5har5000kaz4keqptfmns	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"高级健身追踪" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfjq2cam0001az4knhimbwj3\\",\\"gameTitle\\":\\"高级健身追踪\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-15 13:19:00.018	2025-09-27 23:17:00.259
cmfl5hard000laz4kj8jzxuks	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"冥想练习" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfjq31050007az4kfbucjcdq\\",\\"gameTitle\\":\\"冥想练习\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-15 13:19:00.026	2025-09-27 23:17:00.259
cmfl5il1p000maz4kvzfi5ae8	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"天气预测挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfjq47jk000daz4kzzebykah\\",\\"gameTitle\\":\\"天气预测挑战\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-15 13:20:00.014	2025-09-27 23:17:00.259
cmfr0ygtq000d24jjugv9dn3u	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"每日阅读" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfplita1000824jj8rtck0ti\\",\\"gameTitle\\":\\"每日阅读\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-19 15:59:00.014	2025-09-27 23:17:00.259
cmfv5ljpz00179isagrls6fqv	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"天气预测挑战" 挑战已结束，请在 9/24/2025 前提交证据	"{\\"gameId\\":\\"cmfjq47jk000daz4kzzebykah\\",\\"gameTitle\\":\\"天气预测挑战\\",\\"deadline\\":\\"2025-09-24T13:20:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-22 13:20:00.024	2025-09-27 23:17:00.259
cmfw8tl1q00189isahihd3bdt	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"冥想练习" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfuteq6c000g24jj0ol98br2\\",\\"gameTitle\\":\\"冥想练习\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-23 07:38:00.014	2025-09-27 23:17:00.259
cmfweux4g001c9isayvo8qu26	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"冥想练习" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfuzf4db000u9isa9si4797a\\",\\"gameTitle\\":\\"冥想练习\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-23 10:27:00.016	2025-09-27 23:17:00.259
cmg0616b3000m2tw3hwli697s	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"冥想练习" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfyqm0ag001g9isas5eaxm5e\\",\\"gameTitle\\":\\"冥想练习\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-26 01:31:00.016	2025-09-27 23:17:00.259
cmg16wc35000awp8jc3qfwtn3	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"冥想练习" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfzrgl3f00012tw32obb730j\\",\\"gameTitle\\":\\"冥想练习\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-26 18:43:00.017	2025-09-27 23:17:00.259
cmg16wc3h000bwp8jh502iwa3	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"语言学习打卡" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfzrhoe400072tw3d8te4hwn\\",\\"gameTitle\\":\\"语言学习打卡\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-26 18:43:00.029	2025-09-27 23:17:00.259
cmg177wr1000cwp8jf3n9k5b1	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"天气预测挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmfzrsy4l000d2tw3wt5whs5i\\",\\"gameTitle\\":\\"天气预测挑战\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-26 18:52:00.014	2025-09-27 23:17:00.259
cmhmhvb76000vh5w4pwfrpllp	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"OSS图片视频证据上传测试" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmhl67p0001h5w42mdl7qi1\\",\\"gameTitle\\":\\"OSS图片视频证据上传测试\\",\\"deadline\\":\\"2025-11-05T21:30:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 21:13:00.018	2025-11-06 08:53:23.958
cmhmh314s0052xske4flmb2b5	cmhcegfin0006hcgendh83z40	PEER_REVIEW_REQUEST	互评阶段开始	"接着测试" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhm7rhjg0001xx9r4hvuxlhx\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.604	2025-11-06 08:53:23.958
cmhmh3163005bxskez7gqdbvr	cmhcegfin0006hcgendh83z40	PEER_REVIEW_REQUEST	互评阶段开始	"CCCCCCC" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhll9iu1000n3fyjb4itb587\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.651	2025-11-06 08:53:23.958
cmhmh317g005lxskepzt384zx	cmhcegfin0006hcgendh83z40	PEER_REVIEW_REQUEST	互评阶段开始	"处理一堆问题 3" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhl1uacq000nqg34wu04xwvn\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.7	2025-11-06 08:53:23.958
cmhmh317s005sxskeenn8kc4l	cmhcegfin0006hcgendh83z40	PEER_REVIEW_REQUEST	互评阶段开始	"测试不评价，是不是到期自动结束游戏，崩溃了" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhlc4142000nhru4cnixqecy\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.712	2025-11-06 08:53:23.958
cmhmh3182005zxskekeug38mu	cmhcegfin0006hcgendh83z40	PEER_REVIEW_REQUEST	互评阶段开始	"每日运动挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.722	2025-11-06 08:53:23.958
cmg2nwrsm000010zgegfbxmvv	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"人际关系拓展" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmg228mp0000l7sa2x10rfit8\\",\\"gameTitle\\":\\"人际关系拓展\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-27 19:27:00.022	2025-09-27 23:17:00.259
cmhoma2ze005seo2ufgr90oco	cmfgpmfbo000314ltz0jj7n1y	PEER_EVALUATION_STARTED	互评阶段开始	"测试多个仲裁修改内容" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 08:52:00.026	\N
cmg35qhng000310zghvrgfxh3	cmfgpmfbo000314ltz0jj7n1y	EVIDENCE_REQUIRED	请提交证据	"语言学习打卡" 挑战已结束，请在 9/30/2025 前提交证据	"{\\"gameId\\":\\"cmfhq60vo00018y89c4tyvorz\\",\\"gameTitle\\":\\"语言学习打卡\\",\\"deadline\\":\\"2025-09-30T03:46:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-28 03:46:00.028	\N
cmg4ygqj7000phwn6log4y159	cmfgpmfbo000314ltz0jj7n1y	EVIDENCE_REQUIRED	请提交证据	"修复测试游戏" 挑战已结束，请在 9/30/2025 前提交证据	"{\\"gameId\\":\\"cmfuydo8w00029isa7gi8qtp8\\",\\"gameTitle\\":\\"修复测试游戏\\",\\"deadline\\":\\"2025-09-30T09:57:55.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-09-29 09:58:00.019	\N
cmhoma2ze005teo2ubor2qjqs	cmh36n1zs0005td07t6m368m7	PEER_EVALUATION_STARTED	互评阶段开始	"测试多个仲裁修改内容" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 08:52:00.026	\N
cmhmi61cw000zh5w4wc850p5h	cmhcegfin0006hcgendh83z40	PEER_REVIEW_REQUEST	收到新的互评	test789 认可您完成了挑战	"{\\"gameId\\":\\"cmhmhl67p0001h5w42mdl7qi1\\",\\"evaluatorId\\":\\"cmfgpklkn000114lt1n0ec61k\\",\\"evaluation\\":\\"RECOGNIZE\\"}"	t	{IN_APP}	NORMAL	t	2025-11-05 21:21:20.489	2025-11-05 21:21:20.481	2025-11-06 08:53:23.958
cmhmh31870062xskemn3fowrn	cmhcegfin0006hcgendh83z40	PEER_REVIEW_REQUEST	互评阶段开始	"互评测试 111" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhjvpkrz00019i0qdft4463a\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.727	2025-11-06 08:53:23.958
cmhmh318c0064xskeokqtmh84	cmhcegfin0006hcgendh83z40	PEER_REVIEW_REQUEST	互评阶段开始	"实在是太麻烦了！" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhlbnrhr004672stj3oz6a8s\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.732	2025-11-06 08:53:23.958
cmg70p8z2000brndh1b82z5mg	cmfhqhbdo001p8y89uh5fot7e	FRIEND_REQUEST	新的好友请求	@test789 想要添加您为好友	"{\\"requesterUsername\\":\\"test789\\"}"	f	{IN_APP}	NORMAL	t	2025-09-30 20:36:08.758	2025-09-30 20:36:08.751	\N
cmg72bbpu000542kmxba60jzo	cmfhqg9mg001k8y89kdji8pwn	FRIEND_REQUEST	新的好友请求	@testuser123 想要添加您为好友	"{\\"requesterUsername\\":\\"testuser123\\"}"	f	{IN_APP}	NORMAL	t	2025-09-30 21:21:18.362	2025-09-30 21:21:18.355	\N
cmg72bo7j000942km4mcjs5kz	cmfhqhbdo001p8y89uh5fot7e	FRIEND_REQUEST	新的好友请求	@testuser123 想要添加您为好友	"{\\"requesterUsername\\":\\"testuser123\\"}"	f	{IN_APP}	NORMAL	t	2025-09-30 21:21:34.552	2025-09-30 21:21:34.544	\N
cmhmi65an0013h5w4s8yu36bg	cmh36n1zs0005td07t6m368m7	PEER_REVIEW_REQUEST	收到新的互评	test789 认为您未完成挑战	"{\\"gameId\\":\\"cmhmhl67p0001h5w42mdl7qi1\\",\\"evaluatorId\\":\\"cmfgpklkn000114lt1n0ec61k\\",\\"evaluation\\":\\"NOT_RECOGNIZE\\"}"	t	{IN_APP}	NORMAL	t	2025-11-05 21:21:25.588	2025-11-05 21:21:25.583	2025-11-06 11:00:28.343
cmg72dlkc000b42kmw8r77iss	cmfgpmfbo000314ltz0jj7n1y	FRIEND_ACCEPTED	好友请求已接受	@testuser3 接受了您的好友请求	"{\\"addresseeUsername\\":\\"testuser3\\"}"	f	{IN_APP}	NORMAL	t	2025-09-30 21:23:37.691	2025-09-30 21:23:04.428	\N
cmg72eb83000d42km8rds6ke3	cmfgpmfbo000314ltz0jj7n1y	FRIEND_ACCEPTED	好友请求已接受	@testuser4 接受了您的好友请求	"{\\"addresseeUsername\\":\\"testuser4\\"}"	f	{IN_APP}	NORMAL	t	2025-09-30 21:23:37.691	2025-09-30 21:23:37.683	\N
cmhohf6oh0019eo2ufgh233rb	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"争议测试1" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhohdd4k0005eo2u4adsj5lp\\",\\"gameTitle\\":\\"争议测试1\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 06:36:00.017	\N
cmhok3mwo002neo2uzzz8bhje	cmhcegfin0006hcgendh83z40	PEER_EVALUATION_STARTED	互评阶段开始	"技能练习挑战111" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhcngomk00016na98db1vqr5\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 07:51:00.025	\N
cmhok3mwo002oeo2uwcb6dfev	cmh4rbv470000d3m0tokxkudd	PEER_EVALUATION_STARTED	互评阶段开始	"技能练习挑战111" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhcngomk00016na98db1vqr5\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 07:51:00.025	\N
cmholzsls005oeo2u1mfku1b8	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"测试多个仲裁修改内容" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\",\\"gameTitle\\":\\"测试多个仲裁修改内容\\",\\"deadline\\":\\"2025-11-07T08:52:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 08:44:00.017	\N
cmg70p4h70005rndhuaasze4t	cmfgpjvmb000014ltuwk3uwht	FRIEND_REQUEST	新的好友请求	@test789 想要添加您为好友	"{\\"requesterUsername\\":\\"test789\\"}"	t	{IN_APP}	NORMAL	t	2025-09-30 20:36:02.931	2025-09-30 20:36:02.923	2025-10-01 02:07:17.291
cmga65f9t0001uwbt1llq3r1w	cmfiilojw000ao5ubr1d3vfk0	EVIDENCE_REQUIRED	请提交证据	"每日饮水" 挑战已结束，请在 10/5/2025 前提交证据	"{\\"gameId\\":\\"cmfyqnpxt001n9isaa0gg32w9\\",\\"gameTitle\\":\\"每日饮水\\",\\"deadline\\":\\"2025-10-05T01:32:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-10-03 01:32:00.017	\N
cmholzsls005peo2uwgvqpig5	cmhc7jd8w0006x7g1c2qc46o4	EVIDENCE_REQUIRED	请提交证据	"测试多个仲裁修改内容" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\",\\"gameTitle\\":\\"测试多个仲裁修改内容\\",\\"deadline\\":\\"2025-11-07T08:52:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 08:44:00.017	\N
cmholzsls005qeo2uok1m4bjn	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"测试多个仲裁修改内容" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\",\\"gameTitle\\":\\"测试多个仲裁修改内容\\",\\"deadline\\":\\"2025-11-07T08:52:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 08:44:00.017	\N
cmhoma2ze005ueo2uqcciodbt	cmhc7jd8w0006x7g1c2qc46o4	PEER_EVALUATION_STARTED	互评阶段开始	"测试多个仲裁修改内容" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 08:52:00.026	\N
cmgdwbo620007uwbtkc6w7922	cmfhqhbdo001p8y89uh5fot7e	EVIDENCE_REQUIRED	请提交证据	"正念冥想之旅" 挑战已结束，请在 10/7/2025 前提交证据	"{\\"gameId\\":\\"cmfign35x00098ulaq227751c\\",\\"gameTitle\\":\\"正念冥想之旅\\",\\"deadline\\":\\"2025-10-07T16:08:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-10-05 16:08:00.026	\N
cmhoma2ze005veo2uedfhwbau	cmhcegfin0006hcgendh83z40	PEER_EVALUATION_STARTED	互评阶段开始	"测试多个仲裁修改内容" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 08:52:00.026	\N
cmggdzjv40001dp54rtbvdux2	cmfgpmfbo000314ltz0jj7n1y	EVIDENCE_REQUIRED	请提交证据	"冥想练习" 挑战已结束，请在 10/9/2025 前提交证据	"{\\"gameId\\":\\"cmfuyetx500099isac841d0t3\\",\\"gameTitle\\":\\"冥想练习\\",\\"deadline\\":\\"2025-10-09T09:58:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-10-07 09:58:00.016	\N
cmgge0u5n0002dp54w6sut9k5	cmfgpmfbo000314ltz0jj7n1y	EVIDENCE_REQUIRED	请提交证据	"语言学习打卡" 挑战已结束，请在 10/9/2025 前提交证据	"{\\"gameId\\":\\"cmfuyff36000g9isakmxjcmr5\\",\\"gameTitle\\":\\"语言学习打卡\\",\\"deadline\\":\\"2025-10-09T09:59:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-10-07 09:59:00.011	\N
cmggeg9qu0003dp541vxasqnz	cmfhsxf490000lmmnwp77vl6x	EVIDENCE_REQUIRED	请提交证据	"每日阅读" 挑战已结束，请在 10/9/2025 前提交证据	"{\\"gameId\\":\\"cmfuyvpzc000n9isava0zsvl4\\",\\"gameTitle\\":\\"每日阅读\\",\\"deadline\\":\\"2025-10-09T10:11:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-07 10:11:00.054	2025-10-11 21:24:35.876
cmgl729fh0002wn8bxecc21ya	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"冥想练习" 挑战已结束，请在 10/12/2025 前提交证据	"{\\"gameId\\":\\"cmfzrgl3f00012tw32obb730j\\",\\"gameTitle\\":\\"冥想练习\\",\\"deadline\\":\\"2025-10-12T18:43:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-10 18:43:00.029	2025-10-11 21:25:17.586
cmgqrac5w0001wwr5boe6zyid	cmfhqg9mg001k8y89kdji8pwn	EVIDENCE_REQUIRED	请提交证据	"精英生产力挑战" 挑战已结束，请在 10/16/2025 前提交证据	"{\\"gameId\\":\\"cmfignse8000f8ulax88ui5ce\\",\\"gameTitle\\":\\"精英生产力挑战\\",\\"deadline\\":\\"2025-10-16T16:08:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-10-14 16:08:00.021	\N
cmgxzfncg0006hak2vqypu9n6	cmgxzbcqh0000hak2a2jt0wwa	FRIEND_REQUEST	新的好友请求	@test789 想要添加您为好友	"{\\"requesterUsername\\":\\"test789\\"}"	f	{IN_APP}	NORMAL	t	2025-10-19 17:30:27.963	2025-10-19 17:30:27.952	\N
cmggf0ugl0004dp54e9y5hbcg	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"冥想练习" 挑战已结束，请在 10/9/2025 前提交证据	"{\\"gameId\\":\\"cmfuzf4db000u9isa9si4797a\\",\\"gameTitle\\":\\"冥想练习\\",\\"deadline\\":\\"2025-10-09T10:27:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-07 10:27:00.022	2025-10-19 17:38:56.853
cmgxzg80r0008hak2r9fx57y9	cmfgpklkn000114lt1n0ec61k	FRIEND_ACCEPTED	好友请求已接受	@domaintest001 接受了您的好友请求	"{\\"addresseeUsername\\":\\"domaintest001\\"}"	t	{IN_APP}	NORMAL	t	2025-10-19 17:30:54.752	2025-10-19 17:30:54.747	2025-10-19 17:38:27.485
cmg2wqez9000110zgmrp8v5l5	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"每日阅读30分钟" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmg2bc7310007hbraewf0rmyh\\",\\"gameTitle\\":\\"每日阅读30分钟\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-27 23:34:00.022	2025-10-19 17:38:56.853
cmg2wqezo000210zgisikhdjg	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"每天8杯水" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmg2bbjr80001hbraujzmuv8o\\",\\"gameTitle\\":\\"每天8杯水\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-27 23:34:00.036	2025-10-19 17:38:56.853
cmg35rrxm000410zgw8mx0vuh	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日阅读" 挑战已结束，请在 9/30/2025 前提交证据	"{\\"gameId\\":\\"cmfhq6fnn00078y89ear6ausw\\",\\"gameTitle\\":\\"每日阅读\\",\\"deadline\\":\\"2025-09-30T03:47:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-28 03:47:00.01	2025-10-19 17:38:56.853
cmg55n8390000s9dkmd9ax53l	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"冥想练习" 挑战已结束，请在 10/1/2025 前提交证据	"{\\"gameId\\":\\"cmfjq31050007az4kfbucjcdq\\",\\"gameTitle\\":\\"冥想练习\\",\\"deadline\\":\\"2025-10-01T13:19:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-29 13:19:00.022	2025-10-19 17:38:56.853
cmg55n84c0001s9dkgwwe44lf	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"高级健身追踪" 挑战已结束，请在 10/1/2025 前提交证据	"{\\"gameId\\":\\"cmfjq2cam0001az4knhimbwj3\\",\\"gameTitle\\":\\"高级健身追踪\\",\\"deadline\\":\\"2025-10-01T13:19:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-29 13:19:00.036	2025-10-19 17:38:56.853
cmg6faqrc0011ibx3mh61sz7n	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"早起挑战" 挑战已结束，请在 10/2/2025 前提交证据	"{\\"gameId\\":\\"cmfuzsf8w00119isa4t5mlh68\\",\\"gameTitle\\":\\"早起挑战\\",\\"deadline\\":\\"2025-10-02T10:37:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-30 10:37:00.024	2025-10-19 17:38:56.853
cmg7f21cj0008ugth3qq37zk5	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"高级健身追踪" 挑战已结束，请在 10/3/2025 前提交证据	"{\\"gameId\\":\\"cmflzh4ka000124jjoxctvu86\\",\\"gameTitle\\":\\"高级健身追踪\\",\\"deadline\\":\\"2025-10-03T03:18:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-01 03:18:00.02	2025-10-19 17:38:56.853
cmga65f9s0000uwbt0xbo7dbm	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日饮水" 挑战已结束，请在 10/5/2025 前提交证据	"{\\"gameId\\":\\"cmfyqnpxt001n9isaa0gg32w9\\",\\"gameTitle\\":\\"每日饮水\\",\\"deadline\\":\\"2025-10-05T01:32:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-03 01:32:00.017	2025-10-19 17:38:56.853
cmg73468k0001ugthj1i5eqqy	cmfgpklkn000114lt1n0ec61k	FRIEND_ACCEPTED	好友请求已接受	@testuser2 接受了您的好友请求	"{\\"addresseeUsername\\":\\"testuser2\\"}"	t	{IN_APP}	NORMAL	t	2025-09-30 21:43:44.287	2025-09-30 21:43:44.276	2025-10-19 17:38:56.853
cmgii1gp800007rxbh5tv025f	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"感恩日记记录" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmgh2myao000112etmu7ae4mr\\",\\"gameTitle\\":\\"感恩日记记录\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-08 21:27:00.045	2025-10-19 17:38:56.853
cmgk673n90000wn8bpmovx01p	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"冥想练习" 挑战已结束，请在 10/12/2025 前提交证据	"{\\"gameId\\":\\"cmfyqm0ag001g9isas5eaxm5e\\",\\"gameTitle\\":\\"冥想练习\\",\\"deadline\\":\\"2025-10-12T01:31:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-10 01:31:00.021	2025-10-19 17:38:56.853
cmgl729f80001wn8bseooh3eo	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"语言学习打卡" 挑战已结束，请在 10/12/2025 前提交证据	"{\\"gameId\\":\\"cmfzrhoe400072tw3d8te4hwn\\",\\"gameTitle\\":\\"语言学习打卡\\",\\"deadline\\":\\"2025-10-12T18:43:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-10 18:43:00.021	2025-10-19 17:38:56.853
cmha8he5u000a117uvqczjyd5	cmh4rbv470000d3m0tokxkudd	GAME_STARTED	挑战开始了！	"每日运动挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmh7d62rh0013d3m0dz4vmtub\\",\\"gameTitle\\":\\"每日运动挑战\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-10-28 07:17:00.018	\N
cmha8he66000c117umaish7qs	cmh4rbv470000d3m0tokxkudd	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 10/26/2025 前提交证据	"{\\"gameId\\":\\"cmh7d62rh0013d3m0dz4vmtub\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-10-26T15:19:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-10-28 07:17:00.03	\N
cmhmi68550017h5w4aw6rh128	cmhc7jd8w0006x7g1c2qc46o4	PEER_REVIEW_REQUEST	收到新的互评	test789 认可您完成了挑战	"{\\"gameId\\":\\"cmhmhl67p0001h5w42mdl7qi1\\",\\"evaluatorId\\":\\"cmfgpklkn000114lt1n0ec61k\\",\\"evaluation\\":\\"RECOGNIZE\\"}"	f	{IN_APP}	NORMAL	t	2025-11-05 21:21:29.289	2025-11-05 21:21:29.274	\N
cmhn6zdhx0000js8qycmoqw2a	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"互评ID展示测试" 挑战已结束，请在 11/6/2025 前提交证据	"{\\"gameId\\":\\"cmhn6r2ft0001p0dyvc3096qy\\",\\"gameTitle\\":\\"互评ID展示测试\\",\\"deadline\\":\\"2025-11-06T09:14:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-06 08:56:00.022	\N
cmhn6zdhx0001js8q6f6kzi2e	cmfhsxf490000lmmnwp77vl6x	EVIDENCE_REQUIRED	请提交证据	"互评ID展示测试" 挑战已结束，请在 11/6/2025 前提交证据	"{\\"gameId\\":\\"cmhn6r2ft0001p0dyvc3096qy\\",\\"gameTitle\\":\\"互评ID展示测试\\",\\"deadline\\":\\"2025-11-06T09:14:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-06 08:56:00.022	\N
cmg771yzb0002ugth2xcbge2g	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日阅读30分钟" 挑战已结束，请在 10/1/2025 前提交证据	"{\\"gameId\\":\\"cmg2bc7310007hbraewf0rmyh\\",\\"gameTitle\\":\\"每日阅读30分钟\\",\\"deadline\\":\\"2025-10-01T23:34:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-30 23:34:00.023	2025-10-19 17:38:56.853
cmg771yzl0003ugthsy4alotk	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每天8杯水" 挑战已结束，请在 10/1/2025 前提交证据	"{\\"gameId\\":\\"cmg2bbjr80001hbraujzmuv8o\\",\\"gameTitle\\":\\"每天8杯水\\",\\"deadline\\":\\"2025-10-01T23:34:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-09-30 23:34:00.034	2025-10-19 17:38:56.853
cmgb14e5y0004uwbtr4lbyiak	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日阅读" 挑战已结束，请在 10/5/2025 前提交证据	"{\\"gameId\\":\\"cmfplita1000824jj8rtck0ti\\",\\"gameTitle\\":\\"每日阅读\\",\\"deadline\\":\\"2025-10-05T15:59:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-03 15:59:00.023	2025-10-19 17:38:56.853
cmgb7avf50005uwbtum2iq49p	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"天气预测挑战" 挑战已结束，请在 10/5/2025 前提交证据	"{\\"gameId\\":\\"cmfzrsy4l000d2tw3wt5whs5i\\",\\"gameTitle\\":\\"天气预测挑战\\",\\"deadline\\":\\"2025-10-05T18:52:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-03 18:52:00.017	2025-10-19 17:38:56.853
cmgc4f0330006uwbtfd2zpafe	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"人际关系拓展" 挑战已结束，请在 10/5/2025 前提交证据	"{\\"gameId\\":\\"cmg228mp0000l7sa2x10rfit8\\",\\"gameTitle\\":\\"人际关系拓展\\",\\"deadline\\":\\"2025-10-05T10:19:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-04 10:19:00.016	2025-10-19 17:38:56.853
cmgg8zif00000dp540hdtxcyp	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"冥想练习" 挑战已结束，请在 10/9/2025 前提交证据	"{\\"gameId\\":\\"cmfuteq6c000g24jj0ol98br2\\",\\"gameTitle\\":\\"冥想练习\\",\\"deadline\\":\\"2025-10-09T07:38:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-07 07:38:00.06	2025-10-19 17:38:56.853
cmgysofan000c10ift8geoe1u	cmfgpklkn000114lt1n0ec61k	ACHIEVEMENT_UNLOCKED	🏆 成就解锁！	恭喜您解锁了成就：老用户	{"reward": {"points": {"type": "PARTICIPATION", "amount": 50}}, "achievementId": "cmgysofa7000610if9btp1t00", "achievementName": "老用户"}	t	{IN_APP}	NORMAL	f	\N	2025-10-20 07:09:06.288	2025-10-20 07:11:38.57
cmhmieln4000c29idcupvnm32	cmhc7jd8w0006x7g1c2qc46o4	GAME_STARTED	挑战开始了！	"视频上传测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhmick19000129id11sb2sv2\\",\\"gameTitle\\":\\"视频上传测试\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 21:28:00.016	\N
cmh5rdhuz0007d3m0lakrj2kk	cmh4rbv470000d3m0tokxkudd	GAME_STARTED	挑战开始了！	"英语单词学习打卡" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmgyrzuo4000h9bn906tapny5\\",\\"gameTitle\\":\\"英语单词学习打卡\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-10-25 04:07:00.011	\N
cmhmieln4000d29id695ygmq5	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"视频上传测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhmick19000129id11sb2sv2\\",\\"gameTitle\\":\\"视频上传测试\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 21:28:00.016	2025-11-06 08:53:23.958
cmh60laaz000jd3m03roczdts	cmh4rbv470000d3m0tokxkudd	GAME_STARTED	挑战开始了！	"每日30分钟非虚构类阅读" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmgzbxdny005210ifvm38tk4a\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-10-25 08:25:00.011	\N
cmhn6zdhx0002js8qp92srcz8	cmgxdqce80000108q18y4npo0	EVIDENCE_REQUIRED	请提交证据	"互评ID展示测试" 挑战已结束，请在 11/6/2025 前提交证据	"{\\"gameId\\":\\"cmhn6r2ft0001p0dyvc3096qy\\",\\"gameTitle\\":\\"互评ID展示测试\\",\\"deadline\\":\\"2025-11-06T09:14:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-06 08:56:00.022	\N
cmh66hh71000vd3m0hg9djzvn	cmh4rbv470000d3m0tokxkudd	GAME_STARTED	挑战开始了！	"每周3次力量训练挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmgz2t7ng003210ifn0txseqw\\",\\"gameTitle\\":\\"每周3次力量训练挑战\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-10-25 11:10:00.013	\N
cmh869x3o0009e17rdio8bbd2	cmfgpjvmb000014ltuwk3uwht	FRIEND_REQUEST	新的好友请求	@asd432 想要添加您为好友	"{\\"requesterUsername\\":\\"asd432\\"}"	f	{IN_APP}	NORMAL	t	2025-10-26 20:39:39.745	2025-10-26 20:39:39.732	\N
cmh8aiwpk000le17rqk49y7zx	cmh7b4pkq000wd3m04ocsbh45	GAME_COMPLETED	VIP购买成功	恭喜您成功购买高级会员！享受VIP专属特权，有效期至11/25/2025。	\N	f	{IN_APP}	NORMAL	f	\N	2025-10-26 22:38:37.592	\N
cmhn6zdhx0003js8q9695x4d1	cmgxzbcqh0000hak2a2jt0wwa	EVIDENCE_REQUIRED	请提交证据	"互评ID展示测试" 挑战已结束，请在 11/6/2025 前提交证据	"{\\"gameId\\":\\"cmhn6r2ft0001p0dyvc3096qy\\",\\"gameTitle\\":\\"互评ID展示测试\\",\\"deadline\\":\\"2025-11-06T09:14:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-06 08:56:00.022	\N
cmhn6zdhy0005js8qrsaflrok	cmh8axnya000me17r1py1t2xm	EVIDENCE_REQUIRED	请提交证据	"互评ID展示测试" 挑战已结束，请在 11/6/2025 前提交证据	"{\\"gameId\\":\\"cmhn6r2ft0001p0dyvc3096qy\\",\\"gameTitle\\":\\"互评ID展示测试\\",\\"deadline\\":\\"2025-11-06T09:14:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-06 08:56:00.022	\N
cmhn6zdhy0006js8qiry5jk54	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"互评ID展示测试" 挑战已结束，请在 11/6/2025 前提交证据	"{\\"gameId\\":\\"cmhn6r2ft0001p0dyvc3096qy\\",\\"gameTitle\\":\\"互评ID展示测试\\",\\"deadline\\":\\"2025-11-06T09:14:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-06 08:56:00.022	\N
cmhn6zdhx0004js8qhrdjoilr	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"互评ID展示测试" 挑战已结束，请在 11/6/2025 前提交证据	"{\\"gameId\\":\\"cmhn6r2ft0001p0dyvc3096qy\\",\\"gameTitle\\":\\"互评ID展示测试\\",\\"deadline\\":\\"2025-11-06T09:14:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-06 08:56:00.022	2025-11-06 11:00:19.354
cmh8s1j7b0001n9utucn0b0ph	cmh4rbv470000d3m0tokxkudd	EVIDENCE_REQUIRED	请提交证据	"英语单词学习打卡" 挑战已结束，请在 10/28/2025 前提交证据	"{\\"gameId\\":\\"cmgyrzuo4000h9bn906tapny5\\",\\"gameTitle\\":\\"英语单词学习打卡\\",\\"deadline\\":\\"2025-10-28T06:49:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-10-27 06:49:00.022	\N
cmhohhra4001aeo2udebrxzp5	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"争议测试1" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmhohdd4k0005eo2u4adsj5lp\\",\\"gameTitle\\":\\"争议测试1\\",\\"deadline\\":\\"2025-11-07T06:43:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 06:38:00.028	\N
cmh92v6z50003n9ut8pnm0ajn	cmh4rbv470000d3m0tokxkudd	EVIDENCE_REQUIRED	请提交证据	"每周3次力量训练挑战" 挑战已结束，请在 10/28/2025 前提交证据	"{\\"gameId\\":\\"cmgz2t7ng003210ifn0txseqw\\",\\"gameTitle\\":\\"每周3次力量训练挑战\\",\\"deadline\\":\\"2025-10-28T11:52:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-10-27 11:52:00.017	\N
cmhohhra4001beo2u5sfltgdm	cmfiilojw000ao5ubr1d3vfk0	EVIDENCE_REQUIRED	请提交证据	"争议测试1" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmhohdd4k0005eo2u4adsj5lp\\",\\"gameTitle\\":\\"争议测试1\\",\\"deadline\\":\\"2025-11-07T06:43:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 06:38:00.028	\N
cmh9bz4j60005n9ut8ta8ieuo	cmh4rbv470000d3m0tokxkudd	EVIDENCE_REQUIRED	请提交证据	"每日30分钟非虚构类阅读" 挑战已结束，请在 10/28/2025 前提交证据	"{\\"gameId\\":\\"cmgzbxdny005210ifvm38tk4a\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\",\\"deadline\\":\\"2025-10-28T16:07:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-10-27 16:07:00.019	\N
cmhmih68l000e29idp0gehon1	cmhc7jd8w0006x7g1c2qc46o4	EVIDENCE_REQUIRED	请提交证据	"视频上传测试" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmick19000129id11sb2sv2\\",\\"gameTitle\\":\\"视频上传测试\\",\\"deadline\\":\\"2025-11-05T21:38:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 21:30:00.022	\N
cmhbq4z710004x7g1e6cf13s7	cmh4rbv470000d3m0tokxkudd	GAME_STARTED	挑战开始了！	"每日运动挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmh82pxe60001e17r153xo76x\\",\\"gameTitle\\":\\"每日运动挑战\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-10-29 08:19:00.013	\N
cmhmih68l000f29id5qqx07r5	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"视频上传测试" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmick19000129id11sb2sv2\\",\\"gameTitle\\":\\"视频上传测试\\",\\"deadline\\":\\"2025-11-05T21:38:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 21:30:00.022	2025-11-06 08:53:23.958
cmhdsc0ls000i10bh6ilv8qnu	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"每日30分钟非虚构类阅读" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhdb0swc0001r5ae3y4j3ryy\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-30 18:56:00.017	2025-11-06 08:53:23.958
cmhctg623000l6na978o4fuj4	cmhcegfin0006hcgendh83z40	GAME_COMPLETED	VIP购买成功	恭喜您成功购买精英会员！享受VIP专属特权，有效期至11/29/2025。	\N	t	{IN_APP}	NORMAL	f	\N	2025-10-30 02:39:27.147	2025-11-06 08:53:23.958
cmhcvjgly000b8iy4i6523bbs	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"每日运动挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhcefdvh0001hcgeng4yry82\\",\\"gameTitle\\":\\"每日运动挑战\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-30 03:38:00.022	2025-11-06 08:53:23.958
cmhd4ktkk000d8iy4f2d3pqxl	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"技能练习挑战111" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhcngomk00016na98db1vqr5\\",\\"gameTitle\\":\\"技能练习挑战111\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-30 07:51:00.021	2025-11-06 08:53:23.958
cmhcfx6rw000cdc0n0yp04sip	cmhc7jd8w0006x7g1c2qc46o4	GAME_COMPLETED	VIP购买成功	恭喜您成功购买精英会员！享受VIP专属特权，有效期至11/28/2025。	\N	t	{IN_APP}	NORMAL	f	\N	2025-10-29 20:20:46.604	2025-10-29 20:20:59.452
cmhct2q5w000i6na9mablkovd	cmhc7jd8w0006x7g1c2qc46o4	GAME_STARTED	挑战开始了！	"每日饮水2升挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhcbwt110001tqgxj3frn3i8\\",\\"gameTitle\\":\\"每日饮水2升挑战\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-10-30 02:29:00.02	\N
cmhct2q5w000j6na9gqyfzvuu	cmh4rbv470000d3m0tokxkudd	GAME_STARTED	挑战开始了！	"每日饮水2升挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhcbwt110001tqgxj3frn3i8\\",\\"gameTitle\\":\\"每日饮水2升挑战\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-10-30 02:29:00.02	\N
cmhnbc9na000qkw1jofpbq8ee	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"创意项目完成111111" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhnb891d000fkw1j09az9ccn\\",\\"gameTitle\\":\\"创意项目完成111111\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-06 10:58:00.023	\N
cmhnbc9na000rkw1jyu1nnpef	cmfhsxf490000lmmnwp77vl6x	GAME_STARTED	挑战开始了！	"创意项目完成111111" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhnb891d000fkw1j09az9ccn\\",\\"gameTitle\\":\\"创意项目完成111111\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-06 10:58:00.023	\N
cmhd4ktkk000e8iy4cpnnl9tg	cmh4rbv470000d3m0tokxkudd	GAME_STARTED	挑战开始了！	"技能练习挑战111" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhcngomk00016na98db1vqr5\\",\\"gameTitle\\":\\"技能练习挑战111\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-10-30 07:51:00.021	\N
cmhdsc0lt000k10bhok100hny	cmhc7jd8w0006x7g1c2qc46o4	GAME_STARTED	挑战开始了！	"每日30分钟非虚构类阅读" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhdb0swc0001r5ae3y4j3ryy\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-10-30 18:56:00.017	\N
cmhegy7bb000tbpixvj6x7kyh	cmfgpjvmb000014ltuwk3uwht	ACHIEVEMENT_UNLOCKED	🏆 成就解锁！	恭喜您解锁了成就：老用户	{"reward": {"points": {"type": "PARTICIPATION", "amount": 50}}, "achievementId": "cmgysofa7000610if9btp1t00", "achievementName": "老用户"}	t	{IN_APP}	NORMAL	f	\N	2025-10-31 06:25:05.928	2025-10-31 06:45:50.48
cmhey5xkj0010bpix6s6vxmqe	cmhc7jd8w0006x7g1c2qc46o4	EVIDENCE_REQUIRED	请提交证据	"每日饮水2升挑战" 挑战已结束，请在 10/31/2025 前提交证据	"{\\"gameId\\":\\"cmhcbwt110001tqgxj3frn3i8\\",\\"gameTitle\\":\\"每日饮水2升挑战\\",\\"deadline\\":\\"2025-10-31T18:31:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-10-31 14:27:00.019	\N
cmham77xv0002cyq88p7au76f	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日30分钟非虚构类阅读" 挑战已结束，请在 10/28/2025 前提交证据	"{\\"gameId\\":\\"cmha0rtnl000ln9uthxseclb3\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\",\\"deadline\\":\\"2025-10-28T15:43:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-28 13:41:00.019	2025-11-05 20:54:19.082
cmhnbeu9c000skw1jrdwj2eg6	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"创意项目完成111111" 挑战已结束，请在 11/6/2025 前提交证据	"{\\"gameId\\":\\"cmhnb891d000fkw1j09az9ccn\\",\\"gameTitle\\":\\"创意项目完成111111\\",\\"deadline\\":\\"2025-11-06T11:05:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-06 11:00:00.049	\N
cmhajzhkg0001cyq8ofyj1lmj	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"每日30分钟非虚构类阅读" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmha0rtnl000ln9uthxseclb3\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-28 12:39:00.016	2025-11-06 11:00:33.065
cmhohhra4001ceo2ufejszprz	cmgxdqce80000108q18y4npo0	EVIDENCE_REQUIRED	请提交证据	"争议测试1" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmhohdd4k0005eo2u4adsj5lp\\",\\"gameTitle\\":\\"争议测试1\\",\\"deadline\\":\\"2025-11-07T06:43:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 06:38:00.028	\N
cmhohhra4001deo2uef0kxwe8	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"争议测试1" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmhohdd4k0005eo2u4adsj5lp\\",\\"gameTitle\\":\\"争议测试1\\",\\"deadline\\":\\"2025-11-07T06:43:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 06:38:00.028	\N
cmhohhra4001eeo2u2hlwmvxb	cmhc7jd8w0006x7g1c2qc46o4	EVIDENCE_REQUIRED	请提交证据	"争议测试1" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmhohdd4k0005eo2u4adsj5lp\\",\\"gameTitle\\":\\"争议测试1\\",\\"deadline\\":\\"2025-11-07T06:43:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 06:38:00.028	\N
cmhohhra4001feo2uzt8m87is	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"争议测试1" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmhohdd4k0005eo2u4adsj5lp\\",\\"gameTitle\\":\\"争议测试1\\",\\"deadline\\":\\"2025-11-07T06:43:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 06:38:00.028	\N
cmholx80h005heo2u3qrxun9q	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"测试多个仲裁修改内容" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\",\\"gameTitle\\":\\"测试多个仲裁修改内容\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 08:42:00.018	\N
cmhey5xkj0011bpixburz3042	cmh4rbv470000d3m0tokxkudd	EVIDENCE_REQUIRED	请提交证据	"每日饮水2升挑战" 挑战已结束，请在 10/31/2025 前提交证据	"{\\"gameId\\":\\"cmhcbwt110001tqgxj3frn3i8\\",\\"gameTitle\\":\\"每日饮水2升挑战\\",\\"deadline\\":\\"2025-10-31T18:31:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-10-31 14:27:00.019	\N
cmhcvjgly000a8iy48oih46p7	cmhcc8p1o000atqgxpzkeao00	GAME_STARTED	挑战开始了！	"每日运动挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhcefdvh0001hcgeng4yry82\\",\\"gameTitle\\":\\"每日运动挑战\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-30 03:38:00.022	2025-11-01 14:17:59.832
cmhgjibeb001566n39esd07l5	cmfiilojw000ao5ubr1d3vfk0	ACHIEVEMENT_UNLOCKED	🏆 成就解锁！	恭喜您解锁了成就：老用户	{"reward": {"points": {"type": "PARTICIPATION", "amount": 50}}, "achievementId": "cmgysofa7000610if9btp1t00", "achievementName": "老用户"}	f	{IN_APP}	NORMAL	f	\N	2025-11-01 17:12:15.923	\N
cmhht7wcf0004ead8pq1w6rut	cmhcc8p1o000atqgxpzkeao00	SYSTEM	举报已驳回	您举报的游戏"每日运动挑战VVVVVV"经管理员审核后，认为不违反社区规则，举报已驳回。	\N	t	{IN_APP}	NORMAL	f	\N	2025-11-02 14:31:52.191	2025-11-02 14:31:59.862
cmhht9u8a000fead8fj5lnx27	cmhcc8p1o000atqgxpzkeao00	SYSTEM	您的游戏因违规被处理	您创建的游戏"sa打发士大夫"因违反社区规则被举报并处理。信任积分 -10	{"gameId": "cmhhqix9e0001w6fykpt2b6f6", "reportId": "cmhht9ejw0008ead8gucdojv4"}	f	{IN_APP}	NORMAL	f	\N	2025-11-02 14:33:22.763	\N
cmhht9u8i000head8seihzvud	cmh4rbv470000d3m0tokxkudd	SYSTEM	举报已处理	您举报的游戏"sa打发士大夫"已被管理员处理。感谢您维护社区秩序，劳动积分 +5	{"gameId": "cmhhqix9e0001w6fykpt2b6f6", "reportId": "cmhht9ejw0008ead8gucdojv4"}	t	{IN_APP}	NORMAL	f	\N	2025-11-02 14:33:22.77	2025-11-02 14:34:49.768
cmhhtfzlr0011ead87y5enmeo	cmhcegfin0006hcgendh83z40	SYSTEM	举报已处理	您举报的游戏"16:8间歇性断食挑战"已被管理员处理。感谢您维护社区秩序，劳动积分 +5	{"gameId": "cmhguu62v0001lrbs74qsptsm", "reportId": "cmhhtfses000sead8pynraf2h"}	t	{IN_APP}	NORMAL	f	\N	2025-11-02 14:38:09.663	2025-11-02 14:38:17.25
cmhhub39t000a5er4r3h9pt4y	cmh36n1zs0005td07t6m368m7	SYSTEM	举报已处理	您举报的游戏"每日运动挑战VVVVVV"已被管理员处理。感谢您维护社区秩序，劳动积分 +5	{"gameId": "cmhga25nx000113ttuzu9uc2y", "reportId": "cmhhuagrz00015er475xn9zhp"}	t	{IN_APP}	NORMAL	f	\N	2025-11-02 15:02:20.754	2025-11-02 15:02:52.24
cmhhub39q00085er4ce0b44kz	cmfgpklkn000114lt1n0ec61k	SYSTEM	您的游戏因违规被处理	您创建的游戏"每日运动挑战VVVVVV"因违反社区规则被举报并处理。信任积分 -10	{"gameId": "cmhga25nx000113ttuzu9uc2y", "reportId": "cmhhuagrz00015er475xn9zhp"}	t	{IN_APP}	NORMAL	f	\N	2025-11-02 15:02:20.75	2025-11-02 15:04:49.322
cmhhug33p000m5er4omd0kc5u	cmfgpjvmb000014ltuwk3uwht	FRIEND_REQUEST	新的好友请求	@newbie 想要添加您为好友	"{\\"requesterUsername\\":\\"newbie\\"}"	f	{IN_APP}	NORMAL	t	2025-11-02 15:06:13.822	2025-11-02 15:06:13.813	\N
cmhmirglz000g29idis2bu6jk	cmhc7jd8w0006x7g1c2qc46o4	PEER_REVIEW_REQUEST	互评阶段开始	"视频上传测试" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhmick19000129id11sb2sv2\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 21:38:00.023	\N
cmhhuh85g000y5er4sw4v6l3h	cmfiilojw000ao5ubr1d3vfk0	FRIEND_REQUEST	新的好友请求	@asdfsafd 想要添加您为好友	"{\\"requesterUsername\\":\\"asdfsafd\\"}"	f	{IN_APP}	NORMAL	t	2025-11-02 15:07:07.021	2025-11-02 15:07:07.012	\N
cmhhug7i0000s5er4iarlyhax	cmhc7jd8w0006x7g1c2qc46o4	FRIEND_REQUEST	新的好友请求	@newbie 想要添加您为好友	"{\\"requesterUsername\\":\\"newbie\\"}"	f	{IN_APP}	NORMAL	t	2025-11-02 15:07:10.814	2025-11-02 15:06:19.512	\N
cmhhuhb2w00125er4qq0607t9	cmhc7jd8w0006x7g1c2qc46o4	FRIEND_REQUEST	新的好友请求	@asdfsafd 想要添加您为好友	"{\\"requesterUsername\\":\\"asdfsafd\\"}"	f	{IN_APP}	NORMAL	t	2025-11-02 15:07:10.814	2025-11-02 15:07:10.809	\N
cmhi2rfir00135er4vodnw51t	cmh4rbv470000d3m0tokxkudd	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/3/2025 前提交证据	"{\\"gameId\\":\\"cmh82pxe60001e17r153xo76x\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-03T18:59:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-02 18:59:00.026	\N
cmhig9jhy000k141vw6r3253o	cmhc7jd8w0006x7g1c2qc46o4	GAME_STARTED	挑战开始了！	"每日8小时深度睡眠提升" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhig5a250003141vy1jnjkhu\\",\\"gameTitle\\":\\"每日8小时深度睡眠提升\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-03 01:17:00.022	\N
cmhga7m35000b13tt197m0l8y	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"每日运动挑战VVVVVV" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhga25nx000113ttuzu9uc2y\\",\\"gameTitle\\":\\"每日运动挑战VVVVVV\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-01 12:52:00.017	2025-11-06 08:53:23.958
cmhhtey4d000oead8mbps130n	cmhcegfin0006hcgendh83z40	SYSTEM	举报已驳回	您举报的游戏"每日运动挑战"经管理员审核后，认为不违反社区规则，举报已驳回。	\N	t	{IN_APP}	NORMAL	f	\N	2025-11-02 14:37:21.086	2025-11-06 08:53:23.958
cmhga7m35000a13ttglxqnvvy	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"每日运动挑战VVVVVV" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhga25nx000113ttuzu9uc2y\\",\\"gameTitle\\":\\"每日运动挑战VVVVVV\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-01 12:52:00.017	2025-11-05 20:54:19.082
cmhmirglz000h29idp8a5zu3r	cmhcegfin0006hcgendh83z40	PEER_REVIEW_REQUEST	互评阶段开始	"视频上传测试" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhmick19000129id11sb2sv2\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 21:38:00.023	2025-11-06 08:53:23.958
cmhmhvb76000th5w4j7sext2h	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"OSS图片视频证据上传测试" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmhl67p0001h5w42mdl7qi1\\",\\"gameTitle\\":\\"OSS图片视频证据上传测试\\",\\"deadline\\":\\"2025-11-05T21:30:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 21:13:00.018	2025-11-06 11:00:33.065
cmham77xv0003cyq8mthj3ms5	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"每日30分钟非虚构类阅读" 挑战已结束，请在 10/28/2025 前提交证据	"{\\"gameId\\":\\"cmha0rtnl000ln9uthxseclb3\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\",\\"deadline\\":\\"2025-10-28T15:43:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-28 13:41:00.019	2025-11-06 11:00:33.065
cmhigdeds000n141vvptisorm	cmhc7jd8w0006x7g1c2qc46o4	EVIDENCE_REQUIRED	请提交证据	"每日8小时深度睡眠提升" 挑战已结束，请在 11/3/2025 前提交证据	"{\\"gameId\\":\\"cmhig5a250003141vy1jnjkhu\\",\\"gameTitle\\":\\"每日8小时深度睡眠提升\\",\\"deadline\\":\\"2025-11-03T01:25:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 01:20:00.016	2025-11-03 01:30:00.662
cmhigw606001t141v02xne4l6	cmhc7jd8w0006x7g1c2qc46o4	SYSTEM	您的游戏因违规被处理	您创建的游戏"每日8小时深度睡眠提升"因违反社区规则被举报并处理。信任积分 -10	{"gameId": "cmhig5a250003141vy1jnjkhu", "reportId": "cmhigvg6v001m141v9fdird6e"}	f	{IN_APP}	NORMAL	f	\N	2025-11-03 01:34:35.622	\N
cmhih0hy6002d141v26hwd7iu	cmhcc8p1o000atqgxpzkeao00	FRIEND_ACCEPTED	好友请求已接受	@test456 接受了您的好友请求	"{\\"addresseeUsername\\":\\"test456\\"}"	f	{IN_APP}	NORMAL	t	2025-11-03 01:37:57.733	2025-11-03 01:37:57.726	\N
cmhmj0goj000c6cwimzm4imdy	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"测试视频上传" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhmizjud00016cwiogot6jzu\\",\\"gameTitle\\":\\"测试视频上传\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 21:45:00.019	2025-11-06 11:00:29.235
cmhih34b5002l141vhlx8zs6g	cmhc7jd8w0006x7g1c2qc46o4	GAME_STARTED	挑战开始了！	"每日运动挑战 举报测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhigz2jf001z141v5012hxhq\\",\\"gameTitle\\":\\"每日运动挑战 举报测试\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-03 01:40:00.017	\N
cmhih6z71002n141vmjjtuv76	cmhc7jd8w0006x7g1c2qc46o4	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战 举报测试" 挑战已结束，请在 11/3/2025 前提交证据	"{\\"gameId\\":\\"cmhigz2jf001z141v5012hxhq\\",\\"gameTitle\\":\\"每日运动挑战 举报测试\\",\\"deadline\\":\\"2025-11-03T02:00:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-03 01:43:00.014	\N
cmhihatp9002y141vkx59rbux	cmh4rbv470000d3m0tokxkudd	SYSTEM	举报已处理	您举报的游戏"每日运动挑战 举报测试"已被管理员处理。感谢您维护社区秩序，劳动积分 +5	{"gameId": "cmhigz2jf001z141v5012hxhq", "reportId": "cmhihacf9002p141vjbjc5unj"}	f	{IN_APP}	NORMAL	f	\N	2025-11-03 01:45:59.518	\N
cmhilnq8f000i1lqozo50yvw1	cmhcc8p1o000atqgxpzkeao00	GAME_STARTED	挑战开始了！	"6:00早起晨练运动挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhilmabz00071lqopqqkiukc\\",\\"gameTitle\\":\\"6:00早起晨练运动挑战\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-03 03:48:00.015	\N
cmhilqau2000k1lqo0005e7qq	cmhcc8p1o000atqgxpzkeao00	EVIDENCE_REQUIRED	请提交证据	"6:00早起晨练运动挑战" 挑战已结束，请在 11/11/2025 前提交证据	"{\\"gameId\\":\\"cmhilmabz00071lqopqqkiukc\\",\\"gameTitle\\":\\"6:00早起晨练运动挑战\\",\\"deadline\\":\\"2025-11-11T03:51:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-03 03:50:00.026	\N
cmhilzawj00151lqoaqioak4q	cmhc7jd8w0006x7g1c2qc46o4	GAME_STARTED	挑战开始了！	"每日跑步5公里 测试双人评价" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhilxfdx000t1lqotcq44kxe\\",\\"gameTitle\\":\\"每日跑步5公里 测试双人评价\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-03 03:57:00.019	\N
cmhip0m30001p1lqo6lj7b4gl	cmhc7jd8w0006x7g1c2qc46o4	GAME_STARTED	挑战开始了！	"每日运动挑战 2人评价测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhioy1cc00171lqofc2l8wzh\\",\\"gameTitle\\":\\"每日运动挑战 2人评价测试\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-03 05:22:00.012	\N
cmhip36oe001r1lqo8nm1ncr5	cmhc7jd8w0006x7g1c2qc46o4	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战 2人评价测试" 挑战已结束，请在 11/11/2025 前提交证据	"{\\"gameId\\":\\"cmhioy1cc00171lqofc2l8wzh\\",\\"gameTitle\\":\\"每日运动挑战 2人评价测试\\",\\"deadline\\":\\"2025-11-11T05:24:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 05:24:00.015	2025-11-03 05:30:38.698
cmhih0jnd002h141vts5796lg	cmhcegfin0006hcgendh83z40	FRIEND_ACCEPTED	好友请求已接受	@test456 接受了您的好友请求	"{\\"addresseeUsername\\":\\"test456\\"}"	t	{IN_APP}	NORMAL	t	2025-11-03 01:37:59.934	2025-11-03 01:37:59.93	2025-11-06 08:53:23.958
cmhapg8wk0005cyq8u7uib7ry	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"l5件事感恩日记" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmha8evok0001117uv95wftcx\\",\\"gameTitle\\":\\"l5件事感恩日记\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-28 15:12:00.02	2025-11-06 11:00:33.065
cmhbdmvhv000axe90ya3fv7dr	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"每日运动挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhawi4tt0001xe90c0e883k6\\",\\"gameTitle\\":\\"每日运动挑战\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-29 02:29:00.02	2025-11-06 11:00:33.065
cmhdsc0lt000j10bhlnc0x2t9	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"每日30分钟非虚构类阅读" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhdb0swc0001r5ae3y4j3ryy\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-30 18:56:00.017	2025-11-06 11:00:33.065
cmhgvjbc00001spx7kyqgem2x	cmh36n1zs0005td07t6m368m7	GAME_COMPLETED	VIP购买成功	恭喜您成功购买基础会员！享受VIP专属特权，有效期至12/1/2025。	\N	t	{IN_APP}	NORMAL	f	\N	2025-11-01 22:48:57.888	2025-11-06 11:00:33.065
cmhigdeds000p141vpnr1h8de	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"每日8小时深度睡眠提升" 挑战已结束，请在 11/3/2025 前提交证据	"{\\"gameId\\":\\"cmhig5a250003141vy1jnjkhu\\",\\"gameTitle\\":\\"每日8小时深度睡眠提升\\",\\"deadline\\":\\"2025-11-03T01:25:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 01:20:00.016	2025-11-06 11:00:33.065
cmhipl6tr002p1lqoosvseroj	cmhc7jd8w0006x7g1c2qc46o4	GAME_STARTED	挑战开始了！	"每日30分钟非虚构类阅读" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhipj6ev002d1lqogsziidg6\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-03 05:38:00.015	\N
cmhmkl1py000ci4haw81t0bty	cmh24ml660003td0740yexg8h	GAME_STARTED	挑战开始了！	"视频上传终极测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhmkkmx60001i4haupa9ek4r\\",\\"gameTitle\\":\\"视频上传终极测试\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 22:29:00.023	\N
cmhipnrf7002r1lqo0zt740m0	cmhc7jd8w0006x7g1c2qc46o4	EVIDENCE_REQUIRED	请提交证据	"每日30分钟非虚构类阅读" 挑战已结束，请在 11/3/2025 前提交证据	"{\\"gameId\\":\\"cmhipj6ev002d1lqogsziidg6\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\",\\"deadline\\":\\"2025-11-03T05:43:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-03 05:40:00.02	\N
cmhmkl1py000di4haqmhj6cz8	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"视频上传终极测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhmkkmx60001i4haupa9ek4r\\",\\"gameTitle\\":\\"视频上传终极测试\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 22:29:00.023	2025-11-06 08:53:23.958
cmhjh0udp000d117asgui894k	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"文件上传测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhjgzgq20001117aa962fuhz\\",\\"gameTitle\\":\\"文件上传测试\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 18:26:00.014	2025-11-06 08:53:23.958
cmhjh4pa1000l117aazoqkj10	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"文件上传测试" 挑战已结束，请在 11/11/2025 前提交证据	"{\\"gameId\\":\\"cmhjgzgq20001117aa962fuhz\\",\\"gameTitle\\":\\"文件上传测试\\",\\"deadline\\":\\"2025-11-11T18:29:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 18:29:00.026	2025-11-06 08:53:23.958
cmhjj3fkg000fc344oq0r91ab	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"麻烦的很1" 挑战已结束，请在 11/3/2025 前提交证据	"{\\"gameId\\":\\"cmhjiptsm0001c3444oz0v7qf\\",\\"gameTitle\\":\\"麻烦的很1\\",\\"deadline\\":\\"2025-11-03T19:40:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 19:24:00.017	2025-11-03 19:40:33.149
cmhjvqogh000d9i0qntz74nn4	cmgxdqce80000108q18y4npo0	GAME_STARTED	挑战开始了！	"互评测试 111" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhjvpkrz00019i0qdft4463a\\",\\"gameTitle\\":\\"互评测试 111\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-04 01:18:00.017	\N
cmhjvt91z000l9i0q48bk1kg2	cmgxdqce80000108q18y4npo0	EVIDENCE_REQUIRED	请提交证据	"互评测试 111" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhjvpkrz00019i0qdft4463a\\",\\"gameTitle\\":\\"互评测试 111\\",\\"deadline\\":\\"2025-11-04T01:24:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-04 01:20:00.023	\N
cmhjwk9ab001l9i0q1cyle8cc	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"测试文档+文字 和 纯文件" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhjwgmd300179i0qimtlfz3o\\",\\"gameTitle\\":\\"测试文档+文字 和 纯文件\\",\\"deadline\\":\\"2025-11-04T01:48:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 01:41:00.036	2025-11-04 01:45:52.512
cmhjiyado000dc344heoetcmt	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"麻烦的很1" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhjiptsm0001c3444oz0v7qf\\",\\"gameTitle\\":\\"麻烦的很1\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 19:20:00.012	2025-11-06 08:53:23.958
cmhjvqogh000c9i0q5ej3j1uu	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"互评测试 111" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhjvpkrz00019i0qdft4463a\\",\\"gameTitle\\":\\"互评测试 111\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 01:18:00.017	2025-11-06 08:53:23.958
cmhmh31140040xske8r48w4pr	cmh4rbv470000d3m0tokxkudd	PEER_REVIEW_REQUEST	互评阶段开始	"每日饮水2升挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhcbwt110001tqgxj3frn3i8\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.472	\N
cmhhtfzlo000zead8w17f6nnt	cmh36n1zs0005td07t6m368m7	SYSTEM	您的游戏因违规被处理	您创建的游戏"16:8间歇性断食挑战"因违反社区规则被举报并处理。信任积分 -10	{"gameId": "cmhguu62v0001lrbs74qsptsm", "reportId": "cmhhtfses000sead8pynraf2h"}	t	{IN_APP}	NORMAL	f	\N	2025-11-02 14:38:09.661	2025-11-06 11:00:33.065
cmhohf6oh0014eo2uutiyt6w8	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"争议测试1" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhohdd4k0005eo2u4adsj5lp\\",\\"gameTitle\\":\\"争议测试1\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 06:36:00.017	\N
cmhig9jhy000m141vmbos9xo3	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"每日8小时深度睡眠提升" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhig5a250003141vy1jnjkhu\\",\\"gameTitle\\":\\"每日8小时深度睡眠提升\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 01:17:00.022	2025-11-06 11:00:33.065
cmhigw609001v141vjeivo0po	cmh36n1zs0005td07t6m368m7	SYSTEM	举报已处理	您举报的游戏"每日8小时深度睡眠提升"已被管理员处理。感谢您维护社区秩序，劳动积分 +5	{"gameId": "cmhig5a250003141vy1jnjkhu", "reportId": "cmhigvg6v001m141v9fdird6e"}	t	{IN_APP}	NORMAL	f	\N	2025-11-03 01:34:35.626	2025-11-06 11:00:33.065
cmhih34b5002k141vc9hxzteg	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"每日运动挑战 举报测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhigz2jf001z141v5012hxhq\\",\\"gameTitle\\":\\"每日运动挑战 举报测试\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 01:40:00.017	2025-11-06 11:00:33.065
cmhih6z71002m141v2o68a2th	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战 举报测试" 挑战已结束，请在 11/3/2025 前提交证据	"{\\"gameId\\":\\"cmhigz2jf001z141v5012hxhq\\",\\"gameTitle\\":\\"每日运动挑战 举报测试\\",\\"deadline\\":\\"2025-11-03T02:00:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 01:43:00.014	2025-11-06 11:00:33.065
cmhihatp7002w141v23o0c4g3	cmh36n1zs0005td07t6m368m7	SYSTEM	您的游戏因违规被处理	您创建的游戏"每日运动挑战 举报测试"因违反社区规则被举报并处理。信任积分 -10	{"gameId": "cmhigz2jf001z141v5012hxhq", "reportId": "cmhihacf9002p141vjbjc5unj"}	t	{IN_APP}	NORMAL	f	\N	2025-11-03 01:45:59.515	2025-11-06 11:00:33.065
cmhmj319u000e6cwiugv6u944	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"测试视频上传" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmizjud00016cwiogot6jzu\\",\\"gameTitle\\":\\"测试视频上传\\",\\"deadline\\":\\"2025-11-05T22:08:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 21:47:00.018	2025-11-06 11:00:33.065
cmhjwhoon001j9i0qv8wdtdq9	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"测试文档+文字 和 纯文件" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhjwgmd300179i0qimtlfz3o\\",\\"gameTitle\\":\\"测试文档+文字 和 纯文件\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 01:39:00.023	2025-11-06 11:00:33.065
cmhlg054f001qhru4j8d2o1vd	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"评价通知" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlfwbp9001chru4iqqmzmtt\\",\\"gameTitle\\":\\"评价通知\\",\\"deadline\\":\\"2025-11-05T03:37:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 03:33:00.015	2025-11-06 11:00:33.065
cmhlgeads000ftnfemnveskq3	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"测试互评通知 111111" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlg9nxr0001tnfeswd6oimc\\",\\"gameTitle\\":\\"测试互评通知 111111\\",\\"deadline\\":\\"2025-11-05T03:50:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 03:44:00.016	2025-11-06 11:00:33.065
cmhmkrh79000ei4ha8l2se3c4	cmh24ml660003td0740yexg8h	EVIDENCE_REQUIRED	请提交证据	"视频上传终极测试" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmkkmx60001i4haupa9ek4r\\",\\"gameTitle\\":\\"视频上传终极测试\\",\\"deadline\\":\\"2025-11-05T22:41:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 22:34:00.022	\N
cmhl1n60o000cqg340pjydias	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"挨个测试一堆问题" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhl1l1e10001qg34m9nbge0i\\",\\"gameTitle\\":\\"挨个测试一堆问题\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 20:51:00.024	2025-11-06 08:53:23.958
cmhmkrh79000fi4habvsblksx	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"视频上传终极测试" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmkkmx60001i4haupa9ek4r\\",\\"gameTitle\\":\\"视频上传终极测试\\",\\"deadline\\":\\"2025-11-05T22:41:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 22:34:00.022	2025-11-06 08:53:23.958
cmhl1pqlz000eqg34z74x66xe	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"挨个测试一堆问题" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl1l1e10001qg34m9nbge0i\\",\\"gameTitle\\":\\"挨个测试一堆问题\\",\\"deadline\\":\\"2025-11-04T20:58:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 20:53:00.023	2025-11-06 08:53:23.958
cmhl1w6380016qg348ubla8ox	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"处理一堆问题 3" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhl1uacq000nqg34wu04xwvn\\",\\"gameTitle\\":\\"处理一堆问题 3\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 20:58:00.02	2025-11-06 08:53:23.958
cmhl2cvxt0024qg34o3yd79h0	cmhc7jd8w0006x7g1c2qc46o4	GAME_STARTED	挑战开始了！	"测试大文件和视频上传" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhl2btuq001mqg348jq0sk3v\\",\\"gameTitle\\":\\"测试大文件和视频上传\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-04 21:11:00.018	\N
cmhl1yqp1001aqg34v1miytxt	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"处理一堆问题 3" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl1uacq000nqg34wu04xwvn\\",\\"gameTitle\\":\\"处理一堆问题 3\\",\\"deadline\\":\\"2025-11-04T21:05:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 21:00:00.038	2025-11-06 08:53:23.958
cmhl2fgj80027qg34p4froxu3	cmhc7jd8w0006x7g1c2qc46o4	EVIDENCE_REQUIRED	请提交证据	"测试大文件和视频上传" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl2btuq001mqg348jq0sk3v\\",\\"gameTitle\\":\\"测试大文件和视频上传\\",\\"deadline\\":\\"2025-11-04T21:20:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-04 21:13:00.02	\N
cmhl2cvxt0025qg34ime9016u	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"测试大文件和视频上传" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhl2btuq001mqg348jq0sk3v\\",\\"gameTitle\\":\\"测试大文件和视频上传\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 21:11:00.018	2025-11-06 08:53:23.958
cmhl2fgj80028qg34e31ajga6	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"测试大文件和视频上传" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl2btuq001mqg348jq0sk3v\\",\\"gameTitle\\":\\"测试大文件和视频上传\\",\\"deadline\\":\\"2025-11-04T21:20:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 21:13:00.02	2025-11-06 08:53:23.958
cmhl7jcwd001i72stfjin9dau	cmfiilojw000ao5ubr1d3vfk0	GAME_STARTED	挑战开始了！	"每日运动挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-04 23:36:00.013	\N
cmhl7jcwd001j72stzj2xniyn	cmgxzbcqh0000hak2a2jt0wwa	GAME_STARTED	挑战开始了！	"每日运动挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-04 23:36:00.013	\N
cmhl7jcwd001l72stdkwi64f3	cmhc7jd8w0006x7g1c2qc46o4	GAME_STARTED	挑战开始了！	"每日运动挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-04 23:36:00.013	\N
cmhkpj7lp001pp1dnf3nd9niv	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"l5件事感恩日记" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmha8evok0001117uv95wftcx\\",\\"gameTitle\\":\\"l5件事感恩日记\\",\\"deadline\\":\\"2025-11-05T15:12:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 15:12:00.061	2025-11-06 11:00:33.065
cmitavm710001nibj3ck86bwv	cmgxfcw0d0000o777zhox72xw	GAME_COMPLETED	VIP购买成功	恭喜您成功购买undefined！享受VIP专属特权，有效期至1/4/2026。	\N	f	{IN_APP}	NORMAL	f	\N	2025-12-05 20:11:22.525	\N
cmhl1w6370014qg34mgpi2lqi	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"处理一堆问题 3" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhl1uacq000nqg34wu04xwvn\\",\\"gameTitle\\":\\"处理一堆问题 3\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 20:58:00.02	2025-11-06 11:00:33.065
cmhl1yqp10018qg34vg4qlbcr	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"处理一堆问题 3" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl1uacq000nqg34wu04xwvn\\",\\"gameTitle\\":\\"处理一堆问题 3\\",\\"deadline\\":\\"2025-11-04T21:05:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 21:00:00.038	2025-11-06 11:00:33.065
cmhl7jcwd001k72stqar8ntjg	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"每日运动挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 23:36:00.013	2025-11-06 11:00:33.065
cmhlgideb000rtnfetudy7of8	cmh36n1zs0005td07t6m368m7	PEER_REVIEW_REQUEST	收到新的互评	qloutlook 认为您未完成挑战	"{\\"gameId\\":\\"cmhlg9nxr0001tnfeswd6oimc\\",\\"evaluatorId\\":\\"cmgxdqce80000108q18y4npo0\\",\\"evaluation\\":\\"NOT_RECOGNIZE\\"}"	t	{IN_APP}	NORMAL	t	2025-11-05 03:47:10.553	2025-11-05 03:47:10.547	2025-11-06 11:00:33.065
cmhlkxm0e000c3fyjltgpjjz4	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"DDDDDDD" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhlkweq000013fyjouplwznl\\",\\"gameTitle\\":\\"DDDDDDD\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 05:51:00.014	2025-11-06 11:00:33.065
cmhll06lw000e3fyjcrxigbve	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"DDDDDDD" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlkweq000013fyjouplwznl\\",\\"gameTitle\\":\\"DDDDDDD\\",\\"deadline\\":\\"2025-11-05T06:04:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 05:53:00.02	2025-11-06 11:00:33.065
cmhmlfwtu000ongziqdjyows3	cmfhsxf490000lmmnwp77vl6x	GAME_STARTED	挑战开始了！	"zzzzzzzzzzz" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhmlf1yw0001ngziqwf0kifk\\",\\"gameTitle\\":\\"zzzzzzzzzzz\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 22:53:00.018	\N
cmhl7lxi4001o72st4v6yyn39	cmfiilojw000ao5ubr1d3vfk0	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-04T23:48:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-04 23:38:00.029	\N
cmhl7lxi5001p72stc8b23ms0	cmgxzbcqh0000hak2a2jt0wwa	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-04T23:48:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-04 23:38:00.029	\N
cmhl7lxi5001r72stpl4yg5h1	cmhc7jd8w0006x7g1c2qc46o4	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-04T23:48:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-04 23:38:00.029	\N
cmhl9knsc002e72stvzpb6kau	cmfiilojw000ao5ubr1d3vfk0	GAME_STARTED	挑战开始了！	"测试上传各种文件  1111111" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhl9juw3001x72st1a9aci7j\\",\\"gameTitle\\":\\"测试上传各种文件  1111111\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 00:33:00.012	\N
cmhl9knsc002f72stmwl6indt	cmgxdqce80000108q18y4npo0	GAME_STARTED	挑战开始了！	"测试上传各种文件  1111111" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhl9juw3001x72st1a9aci7j\\",\\"gameTitle\\":\\"测试上传各种文件  1111111\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 00:33:00.012	\N
cmhl9n8do002h72stax33a70g	cmfiilojw000ao5ubr1d3vfk0	EVIDENCE_REQUIRED	请提交证据	"测试上传各种文件  1111111" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhl9juw3001x72st1a9aci7j\\",\\"gameTitle\\":\\"测试上传各种文件  1111111\\",\\"deadline\\":\\"2025-11-05T00:42:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 00:35:00.012	\N
cmhl9n8do002i72stltfvqbss	cmgxdqce80000108q18y4npo0	EVIDENCE_REQUIRED	请提交证据	"测试上传各种文件  1111111" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhl9juw3001x72st1a9aci7j\\",\\"gameTitle\\":\\"测试上传各种文件  1111111\\",\\"deadline\\":\\"2025-11-05T00:42:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 00:35:00.012	\N
cmhmlfwtu000pngzi5sdm2wgq	cmgxzbcqh0000hak2a2jt0wwa	GAME_STARTED	挑战开始了！	"zzzzzzzzzzz" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhmlf1yw0001ngziqwf0kifk\\",\\"gameTitle\\":\\"zzzzzzzzzzz\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 22:53:00.018	\N
cmhl7lxi5001q72stf0iyabld	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-04T23:48:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 23:38:00.029	2025-11-06 11:00:33.065
cmhmlfwtu000qngzihf2mr007	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"zzzzzzzzzzz" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhmlf1yw0001ngziqwf0kifk\\",\\"gameTitle\\":\\"zzzzzzzzzzz\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 22:53:00.018	2025-11-06 11:00:33.065
cmhlboj9s004h72stvfinqa94	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"实在是太麻烦了！" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhlbnrhr004672stj3oz6a8s\\",\\"gameTitle\\":\\"实在是太麻烦了！\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 01:32:00.016	2025-11-06 11:00:33.065
cmhlbr3vc0000hru4bgm22mv5	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"实在是太麻烦了！" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlbnrhr004672stj3oz6a8s\\",\\"gameTitle\\":\\"实在是太麻烦了！\\",\\"deadline\\":\\"2025-11-05T01:38:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 01:34:00.025	2025-11-06 11:00:33.065
cmhlc594h000yhru4y40bz70k	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"测试不评价，是不是到期自动结束游戏，崩溃了" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhlc4142000nhru4cnixqecy\\",\\"gameTitle\\":\\"测试不评价，是不是到期自动结束游戏，崩溃了\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 01:45:00.018	2025-11-06 11:00:33.065
cmhllagz4000y3fyjnu0zksoj	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"CCCCCCC" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhll9iu1000n3fyjb4itb587\\",\\"gameTitle\\":\\"CCCCCCC\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 06:01:00.017	2025-11-06 11:00:33.065
cmhlld1kk00103fyjzfxx9moa	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"CCCCCCC" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhll9iu1000n3fyjb4itb587\\",\\"gameTitle\\":\\"CCCCCCC\\",\\"deadline\\":\\"2025-11-05T06:05:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 06:03:00.021	2025-11-06 11:00:33.065
cmhllkrce001m3fyjckxr7ags	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"AAAAAAAAAAA" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhlljrtz001b3fyju6ayec2i\\",\\"gameTitle\\":\\"AAAAAAAAAAA\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 06:09:00.014	2025-11-06 11:00:33.065
cmhllnbxx001o3fyj0bauwb53	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"AAAAAAAAAAA" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlljrtz001b3fyju6ayec2i\\",\\"gameTitle\\":\\"AAAAAAAAAAA\\",\\"deadline\\":\\"2025-11-05T06:18:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 06:11:00.021	2025-11-06 11:00:33.065
cmhmh311u0047xske1yapv1s3	cmh36n1zs0005td07t6m368m7	PEER_REVIEW_REQUEST	互评阶段开始	"综合测试" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhlpyzw3002y3fyjy4vg3c83\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.499	2025-11-06 11:00:33.065
cmhmh30pc000lxske0t9e6l2t	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"每日30分钟非虚构类阅读" 挑战已结束，请在 10/28/2025 前提交证据	"{\\"gameId\\":\\"cmha0rtnl000ln9uthxseclb3\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\",\\"deadline\\":\\"2025-10-28T15:43:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.049	2025-11-06 11:00:33.065
cmhmlihf9000sngzi1usttkhf	cmfhsxf490000lmmnwp77vl6x	EVIDENCE_REQUIRED	请提交证据	"zzzzzzzzzzz" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmlf1yw0001ngziqwf0kifk\\",\\"gameTitle\\":\\"zzzzzzzzzzz\\",\\"deadline\\":\\"2025-11-05T23:00:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 22:55:00.021	\N
cmhlfxkj3001nhru421t9yjkd	cmgxdqce80000108q18y4npo0	GAME_STARTED	挑战开始了！	"评价通知" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhlfwbp9001chru4iqqmzmtt\\",\\"gameTitle\\":\\"评价通知\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 03:31:00.015	\N
cmhlg054f001phru4oyrcyf9m	cmgxdqce80000108q18y4npo0	EVIDENCE_REQUIRED	请提交证据	"评价通知" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlfwbp9001chru4iqqmzmtt\\",\\"gameTitle\\":\\"评价通知\\",\\"deadline\\":\\"2025-11-05T03:37:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 03:33:00.015	2025-11-05 03:36:45.126
cmhlgbpsj000ctnfelnev2fof	cmgxdqce80000108q18y4npo0	GAME_STARTED	挑战开始了！	"测试互评通知 111111" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhlg9nxr0001tnfeswd6oimc\\",\\"gameTitle\\":\\"测试互评通知 111111\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 03:42:00.019	\N
cmhlgeads000etnfedi5mnaa6	cmgxdqce80000108q18y4npo0	EVIDENCE_REQUIRED	请提交证据	"测试互评通知 111111" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlg9nxr0001tnfeswd6oimc\\",\\"gameTitle\\":\\"测试互评通知 111111\\",\\"deadline\\":\\"2025-11-05T03:50:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 03:44:00.016	\N
cmhlgi0d7000ltnfewmnvwrtj	cmgxdqce80000108q18y4npo0	PEER_REVIEW_REQUEST	收到新的互评	emailtest 认可您完成了挑战	"{\\"gameId\\":\\"cmhlg9nxr0001tnfeswd6oimc\\",\\"evaluatorId\\":\\"cmh36n1zs0005td07t6m368m7\\",\\"evaluation\\":\\"RECOGNIZE\\"}"	f	{IN_APP}	NORMAL	t	2025-11-05 03:46:53.665	2025-11-05 03:46:53.659	\N
cmhlkxm0e000d3fyjkzcr8q4x	cmhcc8p1o000atqgxpzkeao00	GAME_STARTED	挑战开始了！	"DDDDDDD" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhlkweq000013fyjouplwznl\\",\\"gameTitle\\":\\"DDDDDDD\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 05:51:00.014	\N
cmhll06lw000f3fyj3n4f11jq	cmhcc8p1o000atqgxpzkeao00	EVIDENCE_REQUIRED	请提交证据	"DDDDDDD" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlkweq000013fyjouplwznl\\",\\"gameTitle\\":\\"DDDDDDD\\",\\"deadline\\":\\"2025-11-05T06:04:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 05:53:00.02	\N
cmhlc7tpw0010hru4gdy8hy5x	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"测试不评价，是不是到期自动结束游戏，崩溃了" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlc4142000nhru4cnixqecy\\",\\"gameTitle\\":\\"测试不评价，是不是到期自动结束游戏，崩溃了\\",\\"deadline\\":\\"2025-11-05T01:50:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 01:47:00.02	2025-11-06 11:00:33.065
cmhldpu5x0019hru4aauje340	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/6/2025 前提交证据	"{\\"gameId\\":\\"cmhawi4tt0001xe90c0e883k6\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-06T02:29:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 02:29:00.022	2025-11-06 11:00:33.065
cmhlfxkj3001ohru43wtk6y45	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"评价通知" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhlfwbp9001chru4iqqmzmtt\\",\\"gameTitle\\":\\"评价通知\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 03:31:00.015	2025-11-06 11:00:33.065
cmhlgbpsj000dtnfebiza2lxd	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"测试互评通知 111111" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhlg9nxr0001tnfeswd6oimc\\",\\"gameTitle\\":\\"测试互评通知 111111\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 03:42:00.019	2025-11-06 11:00:33.065
cmhllyblu00283fyjsr7gdibm	cmfhsxf490000lmmnwp77vl6x	ACHIEVEMENT_UNLOCKED	🏆 成就解锁！	恭喜您解锁了成就：老用户	{"reward": {"points": {"type": "PARTICIPATION", "amount": 50}}, "achievementId": "cmgysofa7000610if9btp1t00", "achievementName": "老用户"}	f	{IN_APP}	NORMAL	f	\N	2025-11-05 06:19:32.802	\N
cmhllybm8002e3fyj1sdnuned	cmfhsxf490000lmmnwp77vl6x	ACHIEVEMENT_UNLOCKED	🏆 成就解锁！	恭喜您解锁了成就：积分新星	{"reward": {"points": {"type": "PARTICIPATION", "amount": 100}}, "achievementId": "cmhl7esvc000672sty9t2lsla", "achievementName": "积分新星"}	f	{IN_APP}	NORMAL	f	\N	2025-11-05 06:19:32.816	\N
cmhmlihf9000tngziz693lyrp	cmgxzbcqh0000hak2a2jt0wwa	EVIDENCE_REQUIRED	请提交证据	"zzzzzzzzzzz" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmlf1yw0001ngziqwf0kifk\\",\\"gameTitle\\":\\"zzzzzzzzzzz\\",\\"deadline\\":\\"2025-11-05T23:00:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 22:55:00.021	\N
cmhllsh4h001u3fyjazb0w2e2	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"AAAAAAAAAAA" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlljrtz001b3fyju6ayec2i\\",\\"gameTitle\\":\\"AAAAAAAAAAA\\",\\"deadline\\":\\"2025-11-05T06:18:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 06:15:00.017	2025-11-06 11:00:33.065
cmhlm1h71002r3fyjjsc6l6t3	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"都不选择，测试专用 AAAAAAA" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhllzihs002g3fyj6m6t6crl\\",\\"gameTitle\\":\\"都不选择，测试专用 AAAAAAA\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 06:22:00.013	2025-11-06 11:00:33.065
cmhlm41sg002t3fyjzbbvry7k	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"都不选择，测试专用 AAAAAAA" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhllzihs002g3fyj6m6t6crl\\",\\"gameTitle\\":\\"都不选择，测试专用 AAAAAAA\\",\\"deadline\\":\\"2025-11-05T06:29:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 06:24:00.017	2025-11-06 11:00:33.065
cmhlq083400393fyjq018k9uv	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"综合测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhlpyzw3002y3fyjy4vg3c83\\",\\"gameTitle\\":\\"综合测试\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 08:13:00.016	2025-11-06 11:00:33.065
cmhlq2soj003h3fyjpvrgn3zk	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"综合测试" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlpyzw3002y3fyjy4vg3c83\\",\\"gameTitle\\":\\"综合测试\\",\\"deadline\\":\\"2025-11-05T08:25:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 08:15:00.019	2025-11-06 11:00:33.065
cmhlrair8000iwmw3exw1w80y	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"文字证据提交500错误问题测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhlr6bcx0007wmw3merpt6qo\\",\\"gameTitle\\":\\"文字证据提交500错误问题测试\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 08:49:00.02	2025-11-06 11:00:33.065
cmhlrd3cj000kwmw3ttsar8wf	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"文字证据提交500错误问题测试" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlr6bcx0007wmw3merpt6qo\\",\\"gameTitle\\":\\"文字证据提交500错误问题测试\\",\\"deadline\\":\\"2025-11-05T09:12:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 08:51:00.019	2025-11-06 11:00:33.065
cmhmh313a004nxskejeiuhg26	cmh36n1zs0005td07t6m368m7	PEER_REVIEW_REQUEST	互评阶段开始	"AAAAAAAAAAA" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhlljrtz001b3fyju6ayec2i\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.55	2025-11-06 11:00:33.065
cmhmlihf9000ungzi2h4hh90c	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"zzzzzzzzzzz" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmlf1yw0001ngziqwf0kifk\\",\\"gameTitle\\":\\"zzzzzzzzzzz\\",\\"deadline\\":\\"2025-11-05T23:00:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 22:55:00.021	2025-11-06 11:00:33.065
cmhm9h3kk0016xx9rpvzhaof4	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"纯文字发布测试 AAA" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhm9g12c000uxx9ry2rqybn8\\",\\"gameTitle\\":\\"纯文字发布测试 AAA\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 17:18:00.02	2025-11-06 11:00:33.065
cmhmh30pi000nxske8prpd3il	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"纯文字发布测试 AAA" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhm9g12c000uxx9ry2rqybn8\\",\\"gameTitle\\":\\"纯文字发布测试 AAA\\",\\"deadline\\":\\"2025-11-05T17:27:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.054	2025-11-06 11:00:33.065
cmhmh30rq0019xske9m8gfj6q	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/6/2025 前提交证据	"{\\"gameId\\":\\"cmhawi4tt0001xe90c0e883k6\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-06T02:29:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.134	2025-11-06 11:00:33.065
cmhmt5ou8000xngzi665iax7y	cmfgpklkn000114lt1n0ec61k	PEER_EVALUATION_STARTED	互评阶段开始	"每日运动挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhawi4tt0001xe90c0e883k6\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-06 02:29:00.033	\N
cmhmanjck000rlrhrq2qapf0i	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"问题500错误测试 BBB" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmaizbw000dlrhroj4npjg7\\",\\"gameTitle\\":\\"问题500错误测试 BBB\\",\\"deadline\\":\\"2025-11-05T17:56:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 17:51:00.02	2025-11-05 17:54:07.457
cmhmakyrc000plrhrrnn7tiz2	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"问题500错误测试 BBB" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhmaizbw000dlrhroj4npjg7\\",\\"gameTitle\\":\\"问题500错误测试 BBB\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 17:49:00.024	2025-11-06 08:53:23.958
cmhmbftv7000dxskennp8j23g	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"测试全部不选是否可以提交" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhmbelwy0001xskel3wdmqba\\",\\"gameTitle\\":\\"测试全部不选是否可以提交\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 18:13:00.019	2025-11-06 08:53:23.958
cmhmbiegj000fxskeczd9vc9j	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"测试全部不选是否可以提交" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmbelwy0001xskel3wdmqba\\",\\"gameTitle\\":\\"测试全部不选是否可以提交\\",\\"deadline\\":\\"2025-11-05T18:19:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 18:15:00.019	2025-11-06 08:53:23.958
cmhmh30oz000hxsked9h4fu1c	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"问题500错误测试 BBB" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmaizbw000dlrhroj4npjg7\\",\\"gameTitle\\":\\"问题500错误测试 BBB\\",\\"deadline\\":\\"2025-11-05T17:56:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.035	2025-11-06 08:53:23.958
cmhmh30pr000oxskeusjm3las	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"挨个测试一堆问题" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl1l1e10001qg34m9nbge0i\\",\\"gameTitle\\":\\"挨个测试一堆问题\\",\\"deadline\\":\\"2025-11-04T20:58:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.063	2025-11-06 08:53:23.958
cmhmh30x6002nxskeuf7jkn9k	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"处理一堆问题 3" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl1uacq000nqg34wu04xwvn\\",\\"gameTitle\\":\\"处理一堆问题 3\\",\\"deadline\\":\\"2025-11-04T21:05:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.331	2025-11-06 08:53:23.958
cmhm9jo5u0018xx9rs9tfw7jt	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"纯文字发布测试 AAA" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhm9g12c000uxx9ry2rqybn8\\",\\"gameTitle\\":\\"纯文字发布测试 AAA\\",\\"deadline\\":\\"2025-11-05T17:27:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 17:20:00.018	2025-11-06 11:00:33.065
cmhmt5ou8000wngzi6wb2iqtv	cmh36n1zs0005td07t6m368m7	PEER_EVALUATION_STARTED	互评阶段开始	"每日运动挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhawi4tt0001xe90c0e883k6\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-06 02:29:00.033	2025-11-06 11:00:33.065
cmhm9jo5t0017xx9rmeyvpfhh	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"纯文字发布测试 AAA" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhm9g12c000uxx9ry2rqybn8\\",\\"gameTitle\\":\\"纯文字发布测试 AAA\\",\\"deadline\\":\\"2025-11-05T17:27:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 17:20:00.018	2025-11-05 20:54:19.082
cmhmh30p6000jxske486bruyh	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"l5件事感恩日记" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmha8evok0001117uv95wftcx\\",\\"gameTitle\\":\\"l5件事感恩日记\\",\\"deadline\\":\\"2025-11-05T15:12:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.043	2025-11-06 11:00:33.065
cmhmh30pw000rxskevriln3vp	cmh4rbv470000d3m0tokxkudd	EVIDENCE_REQUIRED	请提交证据	"每周3次力量训练挑战" 挑战已结束，请在 10/28/2025 前提交证据	"{\\"gameId\\":\\"cmgz2t7ng003210ifn0txseqw\\",\\"gameTitle\\":\\"每周3次力量训练挑战\\",\\"deadline\\":\\"2025-10-28T11:52:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.069	\N
cmhmvmf9z000yngzivqztxid3	cmhcc8p1o000atqgxpzkeao00	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmhcefdvh0001hcgeng4yry82\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-07T03:38:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-06 03:38:00.024	\N
cmhmh30q1000txske7hj8amik	cmh4rbv470000d3m0tokxkudd	EVIDENCE_REQUIRED	请提交证据	"每日30分钟非虚构类阅读" 挑战已结束，请在 10/28/2025 前提交证据	"{\\"gameId\\":\\"cmgzbxdny005210ifvm38tk4a\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\",\\"deadline\\":\\"2025-10-28T16:07:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.074	\N
cmhmh30qg000xxskejzuv4rit	cmhc7jd8w0006x7g1c2qc46o4	EVIDENCE_REQUIRED	请提交证据	"每日饮水2升挑战" 挑战已结束，请在 10/31/2025 前提交证据	"{\\"gameId\\":\\"cmhcbwt110001tqgxj3frn3i8\\",\\"gameTitle\\":\\"每日饮水2升挑战\\",\\"deadline\\":\\"2025-10-31T18:31:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.088	\N
cmhmh30qg000yxskeq7gr4199	cmh4rbv470000d3m0tokxkudd	EVIDENCE_REQUIRED	请提交证据	"每日饮水2升挑战" 挑战已结束，请在 10/31/2025 前提交证据	"{\\"gameId\\":\\"cmhcbwt110001tqgxj3frn3i8\\",\\"gameTitle\\":\\"每日饮水2升挑战\\",\\"deadline\\":\\"2025-10-31T18:31:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.088	\N
cmhmh30ql000zxskeaa0z1s6q	cmfhqhbdo001p8y89uh5fot7e	EVIDENCE_REQUIRED	请提交证据	"正念冥想之旅" 挑战已结束，请在 10/7/2025 前提交证据	"{\\"gameId\\":\\"cmfign35x00098ulaq227751c\\",\\"gameTitle\\":\\"正念冥想之旅\\",\\"deadline\\":\\"2025-10-07T16:08:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.093	\N
cmhmh30qx0012xske8hxsjdq1	cmgxdqce80000108q18y4npo0	EVIDENCE_REQUIRED	请提交证据	"测试互评通知 111111" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlg9nxr0001tnfeswd6oimc\\",\\"gameTitle\\":\\"测试互评通知 111111\\",\\"deadline\\":\\"2025-11-05T03:50:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.105	\N
cmhmvmf9z0010ngzi7b5k2zxo	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmhcefdvh0001hcgeng4yry82\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-07T03:38:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-06 03:38:00.024	\N
cmhmh30r30015xske33sowzek	cmfiilojw000ao5ubr1d3vfk0	EVIDENCE_REQUIRED	请提交证据	"每日饮水" 挑战已结束，请在 10/5/2025 前提交证据	"{\\"gameId\\":\\"cmfyqnpxt001n9isaa0gg32w9\\",\\"gameTitle\\":\\"每日饮水\\",\\"deadline\\":\\"2025-10-05T01:32:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.112	\N
cmhmh30r90016xskeyibad9p7	cmfgpmfbo000314ltz0jj7n1y	EVIDENCE_REQUIRED	请提交证据	"语言学习打卡" 挑战已结束，请在 9/30/2025 前提交证据	"{\\"gameId\\":\\"cmfhq60vo00018y89c4tyvorz\\",\\"gameTitle\\":\\"语言学习打卡\\",\\"deadline\\":\\"2025-09-30T03:46:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.117	\N
cmhmvmf9z000zngzix9a1yps2	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmhcefdvh0001hcgeng4yry82\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-07T03:38:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-06 03:38:00.024	2025-11-06 08:53:23.958
cmhmh30rx001bxskebzr9qhq4	cmfiilojw000ao5ubr1d3vfk0	EVIDENCE_REQUIRED	请提交证据	"测试上传各种文件  1111111" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhl9juw3001x72st1a9aci7j\\",\\"gameTitle\\":\\"测试上传各种文件  1111111\\",\\"deadline\\":\\"2025-11-05T00:42:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.141	\N
cmhmh30rx001cxskew64yycna	cmgxdqce80000108q18y4npo0	EVIDENCE_REQUIRED	请提交证据	"测试上传各种文件  1111111" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhl9juw3001x72st1a9aci7j\\",\\"gameTitle\\":\\"测试上传各种文件  1111111\\",\\"deadline\\":\\"2025-11-05T00:42:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.141	\N
cmhmh30q6000vxske0ioat6di	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"文字证据提交500错误问题测试" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlr6bcx0007wmw3merpt6qo\\",\\"gameTitle\\":\\"文字证据提交500错误问题测试\\",\\"deadline\\":\\"2025-11-05T09:12:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.079	2025-11-06 11:00:33.065
cmhmh30qq0010xskebvt25e6z	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"AAAAAAAAAAA" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlljrtz001b3fyju6ayec2i\\",\\"gameTitle\\":\\"AAAAAAAAAAA\\",\\"deadline\\":\\"2025-11-05T06:18:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.099	2025-11-06 11:00:33.065
cmhmh30qx0013xskev88d69ai	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"测试互评通知 111111" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlg9nxr0001tnfeswd6oimc\\",\\"gameTitle\\":\\"测试互评通知 111111\\",\\"deadline\\":\\"2025-11-05T03:50:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.105	2025-11-06 11:00:33.065
cmhmh30rg0017xske50mve1db	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"综合测试" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlpyzw3002y3fyjy4vg3c83\\",\\"gameTitle\\":\\"综合测试\\",\\"deadline\\":\\"2025-11-05T08:25:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.125	2025-11-06 11:00:33.065
cmhmh310u003xxske93r9m1hs	cmh36n1zs0005td07t6m368m7	PEER_REVIEW_REQUEST	互评阶段开始	"文字证据提交500错误问题测试" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhlr6bcx0007wmw3merpt6qo\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.462	2025-11-06 11:00:33.065
cmhohlchb001heo2uw9l71qlw	cmhcc8p1o000atqgxpzkeao00	FRIEND_ACCEPTED	好友请求已接受	@regular123 接受了您的好友请求	"{\\"addresseeUsername\\":\\"regular123\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 06:40:47.483	2025-11-07 06:40:47.471	\N
cmholx80i005ieo2uk0qvo8ra	cmfgpmfbo000314ltz0jj7n1y	GAME_STARTED	挑战开始了！	"测试多个仲裁修改内容" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\",\\"gameTitle\\":\\"测试多个仲裁修改内容\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 08:42:00.018	\N
cmholx80i005jeo2unkur7iih	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"测试多个仲裁修改内容" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\",\\"gameTitle\\":\\"测试多个仲裁修改内容\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 08:42:00.018	\N
cmholx80i005keo2uy4q181wt	cmhc7jd8w0006x7g1c2qc46o4	GAME_STARTED	挑战开始了！	"测试多个仲裁修改内容" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\",\\"gameTitle\\":\\"测试多个仲裁修改内容\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 08:42:00.018	\N
cmhn4ns900001b5ojq3qydmoh	cmh4rbv470000d3m0tokxkudd	EVIDENCE_REQUIRED	请提交证据	"技能练习挑战111" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmhcngomk00016na98db1vqr5\\",\\"gameTitle\\":\\"技能练习挑战111\\",\\"deadline\\":\\"2025-11-07T07:51:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-06 07:51:00.036	\N
cmhmh30s9001hxske8xvtrp8h	cmh4rbv470000d3m0tokxkudd	EVIDENCE_REQUIRED	请提交证据	"英语单词学习打卡" 挑战已结束，请在 10/28/2025 前提交证据	"{\\"gameId\\":\\"cmgyrzuo4000h9bn906tapny5\\",\\"gameTitle\\":\\"英语单词学习打卡\\",\\"deadline\\":\\"2025-10-28T06:49:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.154	\N
cmhn4ns900000b5ojwh88drrd	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"技能练习挑战111" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmhcngomk00016na98db1vqr5\\",\\"gameTitle\\":\\"技能练习挑战111\\",\\"deadline\\":\\"2025-11-07T07:51:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-06 07:51:00.036	2025-11-06 08:53:23.958
cmhmh30s3001fxske0vt0p38k	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"自我评价测试文字字数---" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlabhi0003p72stcmydpbw1\\",\\"gameTitle\\":\\"自我评价测试文字字数---\\",\\"deadline\\":\\"2025-11-05T01:04:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.148	2025-11-06 08:53:23.958
cmhmh30sj001kxskeh1svvi1q	cmhc7jd8w0006x7g1c2qc46o4	EVIDENCE_REQUIRED	请提交证据	"每日30分钟非虚构类阅读" 挑战已结束，请在 11/3/2025 前提交证据	"{\\"gameId\\":\\"cmhipj6ev002d1lqogsziidg6\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\",\\"deadline\\":\\"2025-11-03T05:43:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.164	\N
cmhmh30t4001oxskem263uxk2	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"6:00早起晨练运动挑战" 挑战已结束，请在 11/11/2025 前提交证据	"{\\"gameId\\":\\"cmhilmabz00071lqopqqkiukc\\",\\"gameTitle\\":\\"6:00早起晨练运动挑战\\",\\"deadline\\":\\"2025-11-11T03:51:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.184	2025-11-06 08:53:23.958
cmhmh30tg001rxskedmadcanf	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"测试大文件和视频上传" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl2btuq001mqg348jq0sk3v\\",\\"gameTitle\\":\\"测试大文件和视频上传\\",\\"deadline\\":\\"2025-11-04T21:20:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.196	2025-11-06 08:53:23.958
cmhmh30t4001nxskeyr568iee	cmhcc8p1o000atqgxpzkeao00	EVIDENCE_REQUIRED	请提交证据	"6:00早起晨练运动挑战" 挑战已结束，请在 11/11/2025 前提交证据	"{\\"gameId\\":\\"cmhilmabz00071lqopqqkiukc\\",\\"gameTitle\\":\\"6:00早起晨练运动挑战\\",\\"deadline\\":\\"2025-11-11T03:51:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.184	\N
cmhmh30ta001pxske9vattzpc	cmfgpjvmb000014ltuwk3uwht	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 9/23/2025 前提交证据	"{\\"gameId\\":\\"cmfhq6xoa000d8y89mv90gi3f\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-09-23T03:47:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.19	\N
cmhmh30tg001qxskeaqzjewzt	cmhc7jd8w0006x7g1c2qc46o4	EVIDENCE_REQUIRED	请提交证据	"测试大文件和视频上传" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl2btuq001mqg348jq0sk3v\\",\\"gameTitle\\":\\"测试大文件和视频上传\\",\\"deadline\\":\\"2025-11-04T21:20:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.196	\N
cmhnseza50023kw1jx6q5wem5	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"每日30分钟非虚构类阅读" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmhdb0swc0001r5ae3y4j3ryy\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\",\\"deadline\\":\\"2025-11-07T18:56:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-06 18:56:00.029	\N
cmhnseza50024kw1jv41bpi4o	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"每日30分钟非虚构类阅读" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmhdb0swc0001r5ae3y4j3ryy\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\",\\"deadline\\":\\"2025-11-07T18:56:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-06 18:56:00.029	\N
cmhmh30tr001uxskeimqu3ycf	cmfgpmfbo000314ltz0jj7n1y	EVIDENCE_REQUIRED	请提交证据	"冥想练习" 挑战已结束，请在 10/9/2025 前提交证据	"{\\"gameId\\":\\"cmfuyetx500099isac841d0t3\\",\\"gameTitle\\":\\"冥想练习\\",\\"deadline\\":\\"2025-10-09T09:58:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.207	\N
cmhnseza50025kw1jzzeo2l0x	cmhc7jd8w0006x7g1c2qc46o4	EVIDENCE_REQUIRED	请提交证据	"每日30分钟非虚构类阅读" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmhdb0swc0001r5ae3y4j3ryy\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\",\\"deadline\\":\\"2025-11-07T18:56:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-06 18:56:00.029	\N
cmhmh30u4001wxskec9audyii	cmh4rbv470000d3m0tokxkudd	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/3/2025 前提交证据	"{\\"gameId\\":\\"cmh82pxe60001e17r153xo76x\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-03T18:59:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.221	\N
cmhohum8k002heo2uy0v9x68o	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"无人评价是否结束" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhohtc750026eo2uynzst7dh\\",\\"gameTitle\\":\\"无人评价是否结束\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 06:48:00.02	\N
cmhohum8k002ieo2uiddr9vl7	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"无人评价是否结束" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhohtc750026eo2uynzst7dh\\",\\"gameTitle\\":\\"无人评价是否结束\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 06:48:00.02	\N
cmhohx6ts002jeo2upw4azhdy	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"无人评价是否结束" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmhohtc750026eo2uynzst7dh\\",\\"gameTitle\\":\\"无人评价是否结束\\",\\"deadline\\":\\"2025-11-07T06:55:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 06:50:00.016	\N
cmhmh3114003zxskeba76j6a6	cmhc7jd8w0006x7g1c2qc46o4	PEER_REVIEW_REQUEST	互评阶段开始	"每日饮水2升挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhcbwt110001tqgxj3frn3i8\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.472	\N
cmhohx6ts002keo2u5kf769ex	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"无人评价是否结束" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmhohtc750026eo2uynzst7dh\\",\\"gameTitle\\":\\"无人评价是否结束\\",\\"deadline\\":\\"2025-11-07T06:55:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 06:50:00.016	\N
cmholx80i005leo2uk36chl8r	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"测试多个仲裁修改内容" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\",\\"gameTitle\\":\\"测试多个仲裁修改内容\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 08:42:00.018	\N
cmholzsls005meo2uhalcwjht	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"测试多个仲裁修改内容" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\",\\"gameTitle\\":\\"测试多个仲裁修改内容\\",\\"deadline\\":\\"2025-11-07T08:52:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 08:44:00.017	\N
cmhoma2ze005reo2uuhjipxer	cmfgpklkn000114lt1n0ec61k	PEER_EVALUATION_STARTED	互评阶段开始	"测试多个仲裁修改内容" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 08:52:00.026	\N
cmhmh30um0021xskes6oxkp8f	cmfgpmfbo000314ltz0jj7n1y	EVIDENCE_REQUIRED	请提交证据	"修复测试游戏" 挑战已结束，请在 9/30/2025 前提交证据	"{\\"gameId\\":\\"cmfuydo8w00029isa7gi8qtp8\\",\\"gameTitle\\":\\"修复测试游戏\\",\\"deadline\\":\\"2025-09-30T09:57:55.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.238	\N
cmhn6sy0r0016p0dyvb3vht5r	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"互评ID展示测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhn6r2ft0001p0dyvc3096qy\\",\\"gameTitle\\":\\"互评ID展示测试\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-06 08:51:00.027	\N
cmhn6sy0r0017p0dyp981r5hz	cmfhsxf490000lmmnwp77vl6x	GAME_STARTED	挑战开始了！	"互评ID展示测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhn6r2ft0001p0dyvc3096qy\\",\\"gameTitle\\":\\"互评ID展示测试\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-06 08:51:00.027	\N
cmhn6sy0r0018p0dy1x50p99s	cmgxdqce80000108q18y4npo0	GAME_STARTED	挑战开始了！	"互评ID展示测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhn6r2ft0001p0dyvc3096qy\\",\\"gameTitle\\":\\"互评ID展示测试\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-06 08:51:00.027	\N
cmhmh30vb0028xskeyf6fnzuu	cmh4rbv470000d3m0tokxkudd	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 10/26/2025 前提交证据	"{\\"gameId\\":\\"cmh7d62rh0013d3m0dz4vmtub\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-10-26T15:19:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.263	\N
cmhn6sy0r0019p0dy9dnp4xj8	cmgxzbcqh0000hak2a2jt0wwa	GAME_STARTED	挑战开始了！	"互评ID展示测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhn6r2ft0001p0dyvc3096qy\\",\\"gameTitle\\":\\"互评ID展示测试\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-06 08:51:00.027	\N
cmhmh30wa002fxskepjcfnevy	cmgxdqce80000108q18y4npo0	EVIDENCE_REQUIRED	请提交证据	"评价通知" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlfwbp9001chru4iqqmzmtt\\",\\"gameTitle\\":\\"评价通知\\",\\"deadline\\":\\"2025-11-05T03:37:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.298	\N
cmhn6sy0r001bp0dyyftno7ia	cmh8axnya000me17r1py1t2xm	GAME_STARTED	挑战开始了！	"互评ID展示测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhn6r2ft0001p0dyvc3096qy\\",\\"gameTitle\\":\\"互评ID展示测试\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-06 08:51:00.027	2025-11-06 08:52:35.91
cmhmh30wm002ixskejdpmx2wq	cmfhsxf490000lmmnwp77vl6x	EVIDENCE_REQUIRED	请提交证据	"每日阅读" 挑战已结束，请在 10/9/2025 前提交证据	"{\\"gameId\\":\\"cmfuyvpzc000n9isava0zsvl4\\",\\"gameTitle\\":\\"每日阅读\\",\\"deadline\\":\\"2025-10-09T10:11:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.31	\N
cmhmh30uf0020xske29k3jkhs	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"测试全部不选是否可以提交" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmbelwy0001xskel3wdmqba\\",\\"gameTitle\\":\\"测试全部不选是否可以提交\\",\\"deadline\\":\\"2025-11-05T18:19:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.232	2025-11-06 08:53:23.958
cmhmh30ww002kxskes6kmx06f	cmfhqg9mg001k8y89kdji8pwn	EVIDENCE_REQUIRED	请提交证据	"精英生产力挑战" 挑战已结束，请在 10/16/2025 前提交证据	"{\\"gameId\\":\\"cmfignse8000f8ulax88ui5ce\\",\\"gameTitle\\":\\"精英生产力挑战\\",\\"deadline\\":\\"2025-10-16T16:08:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.321	\N
cmhmh30x1002lxskeqkzju5jj	cmfgpmfbo000314ltz0jj7n1y	EVIDENCE_REQUIRED	请提交证据	"语言学习打卡" 挑战已结束，请在 10/9/2025 前提交证据	"{\\"gameId\\":\\"cmfuyff36000g9isakmxjcmr5\\",\\"gameTitle\\":\\"语言学习打卡\\",\\"deadline\\":\\"2025-10-09T09:59:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.326	\N
cmhmh30us0022xskeyrvcfgpe	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"都不选择，测试专用 AAAAAAA" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhllzihs002g3fyj6m6t6crl\\",\\"gameTitle\\":\\"都不选择，测试专用 AAAAAAA\\",\\"deadline\\":\\"2025-11-05T06:29:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.244	2025-11-06 08:53:23.958
cmhmh30uz0024xskeu6315ejr	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"接着测试" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhm7rhjg0001xx9r4hvuxlhx\\",\\"gameTitle\\":\\"接着测试\\",\\"deadline\\":\\"2025-11-05T16:39:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.251	2025-11-06 08:53:23.958
cmhn6sy0r001ap0dybn62wla2	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"互评ID展示测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhn6r2ft0001p0dyvc3096qy\\",\\"gameTitle\\":\\"互评ID展示测试\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-06 08:51:00.027	2025-11-06 11:00:24.308
cmhmh30us0023xskehg2s2evo	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"都不选择，测试专用 AAAAAAA" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhllzihs002g3fyj6m6t6crl\\",\\"gameTitle\\":\\"都不选择，测试专用 AAAAAAA\\",\\"deadline\\":\\"2025-11-05T06:29:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.244	2025-11-06 11:00:33.065
cmhmh30vy002cxskek1vzwhdj	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"CCCCCCC" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhll9iu1000n3fyjb4itb587\\",\\"gameTitle\\":\\"CCCCCCC\\",\\"deadline\\":\\"2025-11-05T06:05:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.286	2025-11-06 11:00:33.065
cmhmh30wa002gxskeggkqufky	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"评价通知" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlfwbp9001chru4iqqmzmtt\\",\\"gameTitle\\":\\"评价通知\\",\\"deadline\\":\\"2025-11-05T03:37:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.298	2025-11-06 11:00:33.065
cmhob29y40026kw1jfdwr641z	cmhcc8p1o000atqgxpzkeao00	PEER_EVALUATION_STARTED	互评阶段开始	"每日运动挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhcefdvh0001hcgeng4yry82\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 03:38:00.028	\N
cmhob29y40027kw1j72si7pin	cmhcegfin0006hcgendh83z40	PEER_EVALUATION_STARTED	互评阶段开始	"每日运动挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhcefdvh0001hcgeng4yry82\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 03:38:00.028	\N
cmhob29y40028kw1jz1bc7vd5	cmfgpklkn000114lt1n0ec61k	PEER_EVALUATION_STARTED	互评阶段开始	"每日运动挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhcefdvh0001hcgeng4yry82\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 03:38:00.028	\N
cmhoi3mb9002leo2udeiibl94	cmh36n1zs0005td07t6m368m7	PEER_EVALUATION_STARTED	互评阶段开始	"无人评价是否结束" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhohtc750026eo2uynzst7dh\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 06:55:00.022	\N
cmhoi3mb9002meo2ut26g3c5p	cmhcegfin0006hcgendh83z40	PEER_EVALUATION_STARTED	互评阶段开始	"无人评价是否结束" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhohtc750026eo2uynzst7dh\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 06:55:00.022	\N
cmholzsls005neo2uuxxnxvbr	cmfgpmfbo000314ltz0jj7n1y	EVIDENCE_REQUIRED	请提交证据	"测试多个仲裁修改内容" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\",\\"gameTitle\\":\\"测试多个仲裁修改内容\\",\\"deadline\\":\\"2025-11-07T08:52:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 08:44:00.017	\N
cmhmh30xc002pxskevp6sn8kr	cmfgpjvmb000014ltuwk3uwht	EVIDENCE_REQUIRED	请提交证据	"某某挑战某某挑战某某挑战某某挑战" 挑战已结束，请在 9/13/2025 前提交证据	"{\\"gameId\\":\\"cmfhq8bgr000j8y89g2lakoac\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战某某挑战\\",\\"deadline\\":\\"2025-09-13T09:25:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.336	\N
cmhmh30xc002qxskeck3yjqzc	cmfgpmfbo000314ltz0jj7n1y	EVIDENCE_REQUIRED	请提交证据	"某某挑战某某挑战某某挑战某某挑战" 挑战已结束，请在 9/13/2025 前提交证据	"{\\"gameId\\":\\"cmfhq8bgr000j8y89g2lakoac\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战某某挑战\\",\\"deadline\\":\\"2025-09-13T09:25:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.336	\N
cmhmh30xc002rxskemyd7kwpq	cmfgplidl000214ltrltpgf6s	EVIDENCE_REQUIRED	请提交证据	"某某挑战某某挑战某某挑战某某挑战" 挑战已结束，请在 9/13/2025 前提交证据	"{\\"gameId\\":\\"cmfhq8bgr000j8y89g2lakoac\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战某某挑战\\",\\"deadline\\":\\"2025-09-13T09:25:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.336	\N
cmhmh30xc002sxskex21vyz4u	cmfhqhbdo001p8y89uh5fot7e	EVIDENCE_REQUIRED	请提交证据	"某某挑战某某挑战某某挑战某某挑战" 挑战已结束，请在 9/13/2025 前提交证据	"{\\"gameId\\":\\"cmfhq8bgr000j8y89g2lakoac\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战某某挑战\\",\\"deadline\\":\\"2025-09-13T09:25:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.336	\N
cmhmh30xn002vxske9iodcy01	cmhcc8p1o000atqgxpzkeao00	EVIDENCE_REQUIRED	请提交证据	"DDDDDDD" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlkweq000013fyjouplwznl\\",\\"gameTitle\\":\\"DDDDDDD\\",\\"deadline\\":\\"2025-11-05T06:04:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.347	\N
cmhilnq8f000j1lqo763iymuk	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"6:00早起晨练运动挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhilmabz00071lqopqqkiukc\\",\\"gameTitle\\":\\"6:00早起晨练运动挑战\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 03:48:00.015	2025-11-06 08:53:23.958
cmhmh30xy002zxskegft9grum	cmhc7jd8w0006x7g1c2qc46o4	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-04T23:48:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.358	\N
cmhmh30xy0031xskeuusr5ysa	cmgxzbcqh0000hak2a2jt0wwa	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-04T23:48:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.358	\N
cmhmh30xy0032xskem9uj8gzf	cmfiilojw000ao5ubr1d3vfk0	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-04T23:48:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.358	\N
cmhilqau2000l1lqonfy29gxn	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"6:00早起晨练运动挑战" 挑战已结束，请在 11/11/2025 前提交证据	"{\\"gameId\\":\\"cmhilmabz00071lqopqqkiukc\\",\\"gameTitle\\":\\"6:00早起晨练运动挑战\\",\\"deadline\\":\\"2025-11-11T03:51:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 03:50:00.026	2025-11-06 08:53:23.958
cmhmh30y50035xskecm498qhq	cmgxdqce80000108q18y4npo0	EVIDENCE_REQUIRED	请提交证据	"互评测试 111" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhjvpkrz00019i0qdft4463a\\",\\"gameTitle\\":\\"互评测试 111\\",\\"deadline\\":\\"2025-11-04T01:24:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.365	\N
cmhmj0goj000d6cwimfl8k3j1	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"测试视频上传" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhmizjud00016cwiogot6jzu\\",\\"gameTitle\\":\\"测试视频上传\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 21:45:00.019	2025-11-06 08:53:23.958
cmhmh30x6002oxskepqwrz4nz	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"处理一堆问题 3" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl1uacq000nqg34wu04xwvn\\",\\"gameTitle\\":\\"处理一堆问题 3\\",\\"deadline\\":\\"2025-11-04T21:05:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.331	2025-11-06 11:00:33.065
cmhmh30xi002txske1a5glymi	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"测试不评价，是不是到期自动结束游戏，崩溃了" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlc4142000nhru4cnixqecy\\",\\"gameTitle\\":\\"测试不评价，是不是到期自动结束游戏，崩溃了\\",\\"deadline\\":\\"2025-11-05T01:50:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.342	2025-11-06 11:00:33.065
cmhmh30xn002wxsker80q871g	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"DDDDDDD" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlkweq000013fyjouplwznl\\",\\"gameTitle\\":\\"DDDDDDD\\",\\"deadline\\":\\"2025-11-05T06:04:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.347	2025-11-06 11:00:33.065
cmhmh30xy0030xskep5rnl1p8	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-04T23:48:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.358	2025-11-06 11:00:33.065
cmhmh30ya0037xskeok5w92p8	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"实在是太麻烦了！" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlbnrhr004672stj3oz6a8s\\",\\"gameTitle\\":\\"实在是太麻烦了！\\",\\"deadline\\":\\"2025-11-05T01:38:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.371	2025-11-06 11:00:33.065
cmhmj319u000f6cwizvlubsvi	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"测试视频上传" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmizjud00016cwiogot6jzu\\",\\"gameTitle\\":\\"测试视频上传\\",\\"deadline\\":\\"2025-11-05T22:08:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 21:47:00.018	2025-11-06 08:53:23.958
cmhmh30yx003bxske9d11ldmw	cmfgpjvmb000014ltuwk3uwht	EVIDENCE_REQUIRED	请提交证据	"某某挑战某某挑战某某挑战1" 挑战已结束，请在 9/13/2025 前提交证据	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战1\\",\\"deadline\\":\\"2025-09-13T05:51:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.393	\N
cmhmh30yx003cxskeg4eplodf	cmfhqhbdo001p8y89uh5fot7e	EVIDENCE_REQUIRED	请提交证据	"某某挑战某某挑战某某挑战1" 挑战已结束，请在 9/13/2025 前提交证据	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战1\\",\\"deadline\\":\\"2025-09-13T05:51:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.393	\N
cmhmh30yx003dxskeru2nemhb	cmfgplidl000214ltrltpgf6s	EVIDENCE_REQUIRED	请提交证据	"某某挑战某某挑战某某挑战1" 挑战已结束，请在 9/13/2025 前提交证据	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战1\\",\\"deadline\\":\\"2025-09-13T05:51:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.393	\N
cmhmh30yx003exske5c8zvx6w	cmfgpmfbo000314ltz0jj7n1y	EVIDENCE_REQUIRED	请提交证据	"某某挑战某某挑战某某挑战1" 挑战已结束，请在 9/13/2025 前提交证据	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战1\\",\\"deadline\\":\\"2025-09-13T05:51:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.393	\N
cmhmh30yx003fxskel3fwcwyp	cmfhqg9mg001k8y89kdji8pwn	EVIDENCE_REQUIRED	请提交证据	"某某挑战某某挑战某某挑战1" 挑战已结束，请在 9/13/2025 前提交证据	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战1\\",\\"deadline\\":\\"2025-09-13T05:51:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.393	\N
cmhjvt91z000k9i0qsyzh00gs	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"互评测试 111" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhjvpkrz00019i0qdft4463a\\",\\"gameTitle\\":\\"互评测试 111\\",\\"deadline\\":\\"2025-11-04T01:24:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 01:20:00.023	2025-11-06 08:53:23.958
cmhjwhoon001i9i0q4yxhnikx	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"测试文档+文字 和 纯文件" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhjwgmd300179i0qimtlfz3o\\",\\"gameTitle\\":\\"测试文档+文字 和 纯文件\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 01:39:00.023	2025-11-06 08:53:23.958
cmhjwk9ab001k9i0qoo1o6i28	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"测试文档+文字 和 纯文件" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhjwgmd300179i0qimtlfz3o\\",\\"gameTitle\\":\\"测试文档+文字 和 纯文件\\",\\"deadline\\":\\"2025-11-04T01:48:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 01:41:00.036	2025-11-06 08:53:23.958
cmhk7bcgj0012p1dn4a875yo8	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"互评详情链接 以及 扣分数值 专用测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhk7abeh000rp1dn46fy94jn\\",\\"gameTitle\\":\\"互评详情链接 以及 扣分数值 专用测试\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 06:42:00.019	2025-11-06 08:53:23.958
cmhk7dx1y0014p1dn2szkpc55	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"互评详情链接 以及 扣分数值 专用测试" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhk7abeh000rp1dn46fy94jn\\",\\"gameTitle\\":\\"互评详情链接 以及 扣分数值 专用测试\\",\\"deadline\\":\\"2025-11-04T06:48:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 06:44:00.022	2025-11-06 08:53:23.958
cmhl7jcwd001m72stgtavtmcg	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"每日运动挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 23:36:00.013	2025-11-06 08:53:23.958
cmhl7lxi5001s72stkkxiqghz	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-04T23:48:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 23:38:00.029	2025-11-06 08:53:23.958
cmhl9knsc002g72stumnenw41	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"测试上传各种文件  1111111" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhl9juw3001x72st1a9aci7j\\",\\"gameTitle\\":\\"测试上传各种文件  1111111\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 00:33:00.012	2025-11-06 08:53:23.958
cmhmh310j003txskegjto5lpf	cmh4rbv470000d3m0tokxkudd	PEER_REVIEW_REQUEST	互评阶段开始	"每周3次力量训练挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmgz2t7ng003210ifn0txseqw\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.452	\N
cmhmh30zq003jxske54aoayyt	cmh36n1zs0005td07t6m368m7	PEER_REVIEW_REQUEST	互评阶段开始	"每日30分钟非虚构类阅读" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmha0rtnl000ln9uthxseclb3\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.423	2025-11-06 11:00:33.065
cmhmh310p003vxske3dzcabil	cmh4rbv470000d3m0tokxkudd	PEER_REVIEW_REQUEST	互评阶段开始	"每日30分钟非虚构类阅读" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmgzbxdny005210ifvm38tk4a\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.457	\N
cmhmh30zw003lxske5hphxj05	cmh36n1zs0005td07t6m368m7	PEER_REVIEW_REQUEST	互评阶段开始	"纯文字发布测试 AAA" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhm9g12c000uxx9ry2rqybn8\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.429	2025-11-06 11:00:33.065
cmhmh3107003pxskewadryt7w	cmh36n1zs0005td07t6m368m7	PEER_REVIEW_REQUEST	互评阶段开始	"l5件事感恩日记" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmha8evok0001117uv95wftcx\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.44	2025-11-06 11:00:33.065
cmhmh31190041xske292uhy6w	cmgxdqce80000108q18y4npo0	PEER_REVIEW_REQUEST	互评阶段开始	"测试互评通知 111111" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhlg9nxr0001tnfeswd6oimc\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.477	\N
cmhmh311e0043xskelh3oqwej	cmfhqhbdo001p8y89uh5fot7e	PEER_REVIEW_REQUEST	自我评价阶段开始	"正念冥想之旅" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmfign35x00098ulaq227751c\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.482	\N
cmhl9n8do002j72stpn47cwf8	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"测试上传各种文件  1111111" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhl9juw3001x72st1a9aci7j\\",\\"gameTitle\\":\\"测试上传各种文件  1111111\\",\\"deadline\\":\\"2025-11-05T00:42:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 00:35:00.012	2025-11-06 08:53:23.958
cmhmh311k0045xske178w5j13	cmfiilojw000ao5ubr1d3vfk0	PEER_REVIEW_REQUEST	互评阶段开始	"每日饮水" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmfyqnpxt001n9isaa0gg32w9\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.488	\N
cmhmh311p0046xske5nh0eq4g	cmfgpmfbo000314ltz0jj7n1y	PEER_REVIEW_REQUEST	自我评价阶段开始	"语言学习打卡" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmfhq60vo00018y89c4tyvorz\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.493	\N
cmhmh31240049xskewsuwfcoy	cmfiilojw000ao5ubr1d3vfk0	PEER_REVIEW_REQUEST	互评阶段开始	"测试上传各种文件  1111111" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhl9juw3001x72st1a9aci7j\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.508	\N
cmhmh3124004axskelbqwomop	cmgxdqce80000108q18y4npo0	PEER_REVIEW_REQUEST	互评阶段开始	"测试上传各种文件  1111111" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhl9juw3001x72st1a9aci7j\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.508	\N
cmhlacyb1004172stzipkqrl9	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"自我评价测试文字字数---" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhlabhi0003p72stcmydpbw1\\",\\"gameTitle\\":\\"自我评价测试文字字数---\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 00:55:00.013	2025-11-06 08:53:23.958
cmhlafiwi004372stqoorl7vw	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"自我评价测试文字字数---" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlabhi0003p72stcmydpbw1\\",\\"gameTitle\\":\\"自我评价测试文字字数---\\",\\"deadline\\":\\"2025-11-05T01:04:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 00:57:00.018	2025-11-06 08:53:23.958
cmhmh312g004fxskejhkfjda0	cmh4rbv470000d3m0tokxkudd	PEER_REVIEW_REQUEST	互评阶段开始	"英语单词学习打卡" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmgyrzuo4000h9bn906tapny5\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.52	\N
cmhlboj9s004i72stxsn4t1ut	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"实在是太麻烦了！" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhlbnrhr004672stj3oz6a8s\\",\\"gameTitle\\":\\"实在是太麻烦了！\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 01:32:00.016	2025-11-06 08:53:23.958
cmhlbr3vd0001hru48uavxyre	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"实在是太麻烦了！" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlbnrhr004672stj3oz6a8s\\",\\"gameTitle\\":\\"实在是太麻烦了！\\",\\"deadline\\":\\"2025-11-05T01:38:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 01:34:00.025	2025-11-06 08:53:23.958
cmhlc594h000zhru4u5b3vz1k	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"测试不评价，是不是到期自动结束游戏，崩溃了" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhlc4142000nhru4cnixqecy\\",\\"gameTitle\\":\\"测试不评价，是不是到期自动结束游戏，崩溃了\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 01:45:00.018	2025-11-06 08:53:23.958
cmhmh312y004jxskea3vq2r2y	cmfgpjvmb000014ltuwk3uwht	PEER_REVIEW_REQUEST	自我评价阶段开始	"每日运动挑战" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmfhq6xoa000d8y89mv90gi3f\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.539	\N
cmhmh3133004kxskerzwx2bof	cmhc7jd8w0006x7g1c2qc46o4	PEER_REVIEW_REQUEST	互评阶段开始	"测试大文件和视频上传" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhl2btuq001mqg348jq0sk3v\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.543	\N
cmhmlfwtu000rngziyi498fpr	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"zzzzzzzzzzz" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhmlf1yw0001ngziqwf0kifk\\",\\"gameTitle\\":\\"zzzzzzzzzzz\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 22:53:00.018	2025-11-06 08:53:23.958
cmhmh311u0048xskeou9nkf4y	cmhcegfin0006hcgendh83z40	PEER_REVIEW_REQUEST	互评阶段开始	"综合测试" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhlpyzw3002y3fyjy4vg3c83\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.499	2025-11-06 08:53:23.958
cmhmh313f004qxske087a4jyz	cmhc7jd8w0006x7g1c2qc46o4	PEER_REVIEW_REQUEST	互评阶段开始	"每日30分钟非虚构类阅读" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhipj6ev002d1lqogsziidg6\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.555	\N
cmhmh31190042xskea6f2gica	cmh36n1zs0005td07t6m368m7	PEER_REVIEW_REQUEST	互评阶段开始	"测试互评通知 111111" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhlg9nxr0001tnfeswd6oimc\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.477	2025-11-06 11:00:33.065
cmhohf6oh0015eo2u6410jm2r	cmfiilojw000ao5ubr1d3vfk0	GAME_STARTED	挑战开始了！	"争议测试1" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhohdd4k0005eo2u4adsj5lp\\",\\"gameTitle\\":\\"争议测试1\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 06:36:00.017	\N
cmhohf6oh0016eo2und8pwo85	cmgxdqce80000108q18y4npo0	GAME_STARTED	挑战开始了！	"争议测试1" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhohdd4k0005eo2u4adsj5lp\\",\\"gameTitle\\":\\"争议测试1\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 06:36:00.017	\N
cmhohf6oh0017eo2udvlmalkg	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"争议测试1" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhohdd4k0005eo2u4adsj5lp\\",\\"gameTitle\\":\\"争议测试1\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 06:36:00.017	\N
cmhohf6oh0018eo2uelmx6s3j	cmhc7jd8w0006x7g1c2qc46o4	GAME_STARTED	挑战开始了！	"争议测试1" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhohdd4k0005eo2u4adsj5lp\\",\\"gameTitle\\":\\"争议测试1\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 06:36:00.017	\N
cmhmh313o004sxskehq4xvlzt	cmfgpmfbo000314ltz0jj7n1y	PEER_REVIEW_REQUEST	自我评价阶段开始	"冥想练习" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmfuyetx500099isac841d0t3\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.564	\N
cmhlc7tpw0011hru4jjl98v20	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"测试不评价，是不是到期自动结束游戏，崩溃了" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlc4142000nhru4cnixqecy\\",\\"gameTitle\\":\\"测试不评价，是不是到期自动结束游戏，崩溃了\\",\\"deadline\\":\\"2025-11-05T01:50:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 01:47:00.02	2025-11-06 08:53:23.958
cmhmh313y004uxskeskmmvhej	cmh4rbv470000d3m0tokxkudd	PEER_REVIEW_REQUEST	互评阶段开始	"每日运动挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmh82pxe60001e17r153xo76x\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.574	\N
cmhllagz4000z3fyjg8tnb6nj	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"CCCCCCC" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhll9iu1000n3fyjb4itb587\\",\\"gameTitle\\":\\"CCCCCCC\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 06:01:00.017	2025-11-06 08:53:23.958
cmhlld1kk00113fyj1na0d0si	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"CCCCCCC" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhll9iu1000n3fyjb4itb587\\",\\"gameTitle\\":\\"CCCCCCC\\",\\"deadline\\":\\"2025-11-05T06:05:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 06:03:00.021	2025-11-06 08:53:23.958
cmhllkrce001n3fyj3e1x6a73	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"AAAAAAAAAAA" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhlljrtz001b3fyju6ayec2i\\",\\"gameTitle\\":\\"AAAAAAAAAAA\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 06:09:00.014	2025-11-06 08:53:23.958
cmhmh314e004zxskebx0ok5cu	cmfgpmfbo000314ltz0jj7n1y	PEER_REVIEW_REQUEST	自我评价阶段开始	"修复测试游戏" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmfuydo8w00029isa7gi8qtp8\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.59	\N
cmhllnbxx001p3fyjzrponq8b	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"AAAAAAAAAAA" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlljrtz001b3fyju6ayec2i\\",\\"gameTitle\\":\\"AAAAAAAAAAA\\",\\"deadline\\":\\"2025-11-05T06:18:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 06:11:00.021	2025-11-06 08:53:23.958
cmhllsh4h001v3fyjrj7y9hap	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"AAAAAAAAAAA" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlljrtz001b3fyju6ayec2i\\",\\"gameTitle\\":\\"AAAAAAAAAAA\\",\\"deadline\\":\\"2025-11-05T06:18:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 06:15:00.017	2025-11-06 08:53:23.958
cmhlm1h71002s3fyj9asurwd7	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"都不选择，测试专用 AAAAAAA" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhllzihs002g3fyj6m6t6crl\\",\\"gameTitle\\":\\"都不选择，测试专用 AAAAAAA\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 06:22:00.013	2025-11-06 08:53:23.958
cmhlm41sg002u3fyjx5rn4ssi	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"都不选择，测试专用 AAAAAAA" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhllzihs002g3fyj6m6t6crl\\",\\"gameTitle\\":\\"都不选择，测试专用 AAAAAAA\\",\\"deadline\\":\\"2025-11-05T06:29:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 06:24:00.017	2025-11-06 08:53:23.958
cmhmh315h0057xsken6374myb	cmh4rbv470000d3m0tokxkudd	PEER_REVIEW_REQUEST	互评阶段开始	"每日运动挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmh7d62rh0013d3m0dz4vmtub\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.629	\N
cmhlpy1rh002w3fyju8zru40n	cmhcegfin0006hcgendh83z40	GAME_COMPLETED	VIP购买成功	恭喜您成功购买精英会员！享受VIP专属特权，有效期至12/5/2025。	\N	t	{IN_APP}	NORMAL	f	\N	2025-11-05 08:11:18.51	2025-11-06 08:53:23.958
cmhlq0834003a3fyjaplqwe5u	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"综合测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhlpyzw3002y3fyjy4vg3c83\\",\\"gameTitle\\":\\"综合测试\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 08:13:00.016	2025-11-06 08:53:23.958
cmhlq2soj003i3fyjepr4geyg	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"综合测试" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlpyzw3002y3fyjy4vg3c83\\",\\"gameTitle\\":\\"综合测试\\",\\"deadline\\":\\"2025-11-05T08:25:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 08:15:00.019	2025-11-06 08:53:23.958
cmhlrair8000jwmw32z0xpwat	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"文字证据提交500错误问题测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhlr6bcx0007wmw3merpt6qo\\",\\"gameTitle\\":\\"文字证据提交500错误问题测试\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 08:49:00.02	2025-11-06 08:53:23.958
cmhmh316n005exskeyv4elhdw	cmfhsxf490000lmmnwp77vl6x	PEER_REVIEW_REQUEST	自我评价阶段开始	"每日阅读" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmfuyvpzc000n9isava0zsvl4\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.671	\N
cmhmh316t005fxske2odzv9mr	cmgxdqce80000108q18y4npo0	PEER_REVIEW_REQUEST	互评阶段开始	"评价通知" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhlfwbp9001chru4iqqmzmtt\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.677	\N
cmhmh314m0051xskegqa0esiu	cmh36n1zs0005td07t6m368m7	PEER_REVIEW_REQUEST	互评阶段开始	"都不选择，测试专用 AAAAAAA" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhllzihs002g3fyj6m6t6crl\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.598	2025-11-06 11:00:33.065
cmhmh3175005ixske1bsg9cyt	cmfhqg9mg001k8y89kdji8pwn	PEER_REVIEW_REQUEST	自我评价阶段开始	"精英生产力挑战" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmfignse8000f8ulax88ui5ce\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.69	\N
cmhmh3163005axsket9bt8s70	cmh36n1zs0005td07t6m368m7	PEER_REVIEW_REQUEST	互评阶段开始	"CCCCCCC" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhll9iu1000n3fyjb4itb587\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.651	2025-11-06 11:00:33.065
cmhmh316t005gxsketi1v5wzp	cmh36n1zs0005td07t6m368m7	PEER_REVIEW_REQUEST	互评阶段开始	"评价通知" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhlfwbp9001chru4iqqmzmtt\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.677	2025-11-06 11:00:33.065
cmhmh317a005jxske320dsdfm	cmfgpmfbo000314ltz0jj7n1y	PEER_REVIEW_REQUEST	自我评价阶段开始	"语言学习打卡" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmfuyff36000g9isakmxjcmr5\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.695	\N
cmhlrd3cj000lwmw3asv99i12	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"文字证据提交500错误问题测试" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlr6bcx0007wmw3merpt6qo\\",\\"gameTitle\\":\\"文字证据提交500错误问题测试\\",\\"deadline\\":\\"2025-11-05T09:12:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 08:51:00.019	2025-11-06 08:53:23.958
cmhmh317m005nxskep7q7j618	cmfgpjvmb000014ltuwk3uwht	PEER_REVIEW_REQUEST	互评阶段开始	"某某挑战某某挑战某某挑战某某挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmfhq8bgr000j8y89g2lakoac\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.707	\N
cmhmh317m005oxske1ismsypo	cmfgpmfbo000314ltz0jj7n1y	PEER_REVIEW_REQUEST	互评阶段开始	"某某挑战某某挑战某某挑战某某挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmfhq8bgr000j8y89g2lakoac\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.707	\N
cmhmh317m005pxskewm6rvytf	cmfgplidl000214ltrltpgf6s	PEER_REVIEW_REQUEST	互评阶段开始	"某某挑战某某挑战某某挑战某某挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmfhq8bgr000j8y89g2lakoac\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.707	\N
cmhmh317m005qxskejag8jl8h	cmfhqhbdo001p8y89uh5fot7e	PEER_REVIEW_REQUEST	互评阶段开始	"某某挑战某某挑战某某挑战某某挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmfhq8bgr000j8y89g2lakoac\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.707	\N
cmhmh317x005txskey3a1mvwl	cmhcc8p1o000atqgxpzkeao00	PEER_REVIEW_REQUEST	互评阶段开始	"DDDDDDD" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhlkweq000013fyjouplwznl\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.717	\N
cmhmh3182005vxskelnnh7jo0	cmhc7jd8w0006x7g1c2qc46o4	PEER_REVIEW_REQUEST	互评阶段开始	"每日运动挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.722	\N
cmhmh3182005xxske5wn27d3t	cmgxzbcqh0000hak2a2jt0wwa	PEER_REVIEW_REQUEST	互评阶段开始	"每日运动挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.722	\N
cmhmh3182005yxskew636h70j	cmfiilojw000ao5ubr1d3vfk0	PEER_REVIEW_REQUEST	互评阶段开始	"每日运动挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.722	\N
cmhm7snn3000dxx9rlv4nv13p	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"接着测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhm7rhjg0001xx9r4hvuxlhx\\",\\"gameTitle\\":\\"接着测试\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 16:31:00.016	2025-11-06 08:53:23.958
cmhmh31870061xskeep8qlg5o	cmgxdqce80000108q18y4npo0	PEER_REVIEW_REQUEST	互评阶段开始	"互评测试 111" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhjvpkrz00019i0qdft4463a\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.727	\N
cmhm7v88j000fxx9rkaynkhb1	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"接着测试" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhm7rhjg0001xx9r4hvuxlhx\\",\\"gameTitle\\":\\"接着测试\\",\\"deadline\\":\\"2025-11-05T16:39:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 16:33:00.019	2025-11-06 08:53:23.958
cmhmh317g005mxske1sgnr92w	cmh36n1zs0005td07t6m368m7	PEER_REVIEW_REQUEST	互评阶段开始	"处理一堆问题 3" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhl1uacq000nqg34wu04xwvn\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.7	2025-11-06 11:00:33.065
cmhmh318r0067xskeozcvh595	cmfgpjvmb000014ltuwk3uwht	PEER_REVIEW_REQUEST	互评阶段开始	"某某挑战某某挑战某某挑战1" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.747	\N
cmhmh318r0068xskevs3c9pm1	cmfhqhbdo001p8y89uh5fot7e	PEER_REVIEW_REQUEST	互评阶段开始	"某某挑战某某挑战某某挑战1" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.747	\N
cmhmh318r0069xskeola6bd3r	cmfgplidl000214ltrltpgf6s	PEER_REVIEW_REQUEST	互评阶段开始	"某某挑战某某挑战某某挑战1" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.747	\N
cmhmh317s005rxskej7infcpa	cmh36n1zs0005td07t6m368m7	PEER_REVIEW_REQUEST	互评阶段开始	"测试不评价，是不是到期自动结束游戏，崩溃了" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhlc4142000nhru4cnixqecy\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.712	2025-11-06 11:00:33.065
cmhmh317x005uxskemad5vejm	cmh36n1zs0005td07t6m368m7	PEER_REVIEW_REQUEST	互评阶段开始	"DDDDDDD" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhlkweq000013fyjouplwznl\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.717	2025-11-06 11:00:33.065
cmhmh3182005wxskew7362lpd	cmh36n1zs0005td07t6m368m7	PEER_REVIEW_REQUEST	互评阶段开始	"每日运动挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.722	2025-11-06 11:00:33.065
cmhmh318c0063xskepq092jlm	cmh36n1zs0005td07t6m368m7	PEER_REVIEW_REQUEST	互评阶段开始	"实在是太麻烦了！" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhlbnrhr004672stj3oz6a8s\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.732	2025-11-06 11:00:33.065
cmhmh318r006axskepwpnomxw	cmfgpmfbo000314ltz0jj7n1y	PEER_REVIEW_REQUEST	互评阶段开始	"某某挑战某某挑战某某挑战1" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.747	\N
cmhmh318r006bxskerg0qkdlx	cmfhqg9mg001k8y89kdji8pwn	PEER_REVIEW_REQUEST	互评阶段开始	"某某挑战某某挑战某某挑战1" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.747	\N
cmhmlihf9000vngzitjq3mk8w	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"zzzzzzzzzzz" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmlf1yw0001ngziqwf0kifk\\",\\"gameTitle\\":\\"zzzzzzzzzzz\\",\\"deadline\\":\\"2025-11-05T23:00:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 22:55:00.021	2025-11-06 08:53:23.958
cmhmh30q6000uxskeip5wb2tx	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"文字证据提交500错误问题测试" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlr6bcx0007wmw3merpt6qo\\",\\"gameTitle\\":\\"文字证据提交500错误问题测试\\",\\"deadline\\":\\"2025-11-05T09:12:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.079	2025-11-06 08:53:23.958
cmha8he5u000b117uky3p8ism	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"每日运动挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmh7d62rh0013d3m0dz4vmtub\\",\\"gameTitle\\":\\"每日运动挑战\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-28 07:17:00.018	2025-11-05 20:54:19.082
cmha8he66000d117usa0cyj0y	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 10/26/2025 前提交证据	"{\\"gameId\\":\\"cmh7d62rh0013d3m0dz4vmtub\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-10-26T15:19:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-28 07:17:00.03	2025-11-05 20:54:19.082
cmhajzhkg0000cyq8i0ndo9zd	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"每日30分钟非虚构类阅读" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmha0rtnl000ln9uthxseclb3\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-28 12:39:00.016	2025-11-05 20:54:19.082
cmh2i7e0r0004td07pwd3ptxj	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"感恩日记记录" 挑战已结束，请在 10/24/2025 前提交证据	"{\\"gameId\\":\\"cmgh2myao000112etmu7ae4mr\\",\\"gameTitle\\":\\"感恩日记记录\\",\\"deadline\\":\\"2025-10-24T21:27:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-22 21:27:00.027	2025-11-05 20:54:19.082
cmh5rdhuz0006d3m0wyr75sil	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"英语单词学习打卡" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmgyrzuo4000h9bn906tapny5\\",\\"gameTitle\\":\\"英语单词学习打卡\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-25 04:07:00.011	2025-11-05 20:54:19.082
cmh60laaz000id3m0ppzn74tq	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"每日30分钟非虚构类阅读" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmgzbxdny005210ifvm38tk4a\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-25 08:25:00.011	2025-11-05 20:54:19.082
cmh66hh70000ud3m0zy16gj3i	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"每周3次力量训练挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmgz2t7ng003210ifn0txseqw\\",\\"gameTitle\\":\\"每周3次力量训练挑战\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-25 11:10:00.013	2025-11-05 20:54:19.082
cmh8s1j7a0000n9utvt3aobxc	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"英语单词学习打卡" 挑战已结束，请在 10/28/2025 前提交证据	"{\\"gameId\\":\\"cmgyrzuo4000h9bn906tapny5\\",\\"gameTitle\\":\\"英语单词学习打卡\\",\\"deadline\\":\\"2025-10-28T06:49:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-27 06:49:00.022	2025-11-05 20:54:19.082
cmh8axnzn000se17r7ejkuew1	cmfgpklkn000114lt1n0ec61k	SYSTEM	🎉 推荐奖励已到账！	恭喜您获得3天VIP会员奖励！感谢您推荐好友加入BetTogether。	"{\\"rewardType\\":\\"VIP_DAYS\\",\\"rewardValue\\":3,\\"referredUserId\\":\\"cmh8axnya000me17r1py1t2xm\\"}"	t	{IN_APP}	NORMAL	t	2025-10-26 22:50:06.16	2025-10-26 22:50:06.131	2025-11-05 20:54:19.082
cmh8axo09000ue17r2am4d2ej	cmfgpklkn000114lt1n0ec61k	SYSTEM	🏆 推荐积分奖励！	恭喜您获得20参与积分奖励！感谢您推荐好友加入BetTogether。	"{\\"rewardType\\":\\"PARTICIPATION_POINTS\\",\\"rewardValue\\":20,\\"referredUserId\\":\\"cmh8axnya000me17r1py1t2xm\\"}"	t	{IN_APP}	NORMAL	t	2025-10-26 22:50:06.16	2025-10-26 22:50:06.153	2025-11-05 20:54:19.082
cmh92v6z50002n9ut6caqttd1	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每周3次力量训练挑战" 挑战已结束，请在 10/28/2025 前提交证据	"{\\"gameId\\":\\"cmgz2t7ng003210ifn0txseqw\\",\\"gameTitle\\":\\"每周3次力量训练挑战\\",\\"deadline\\":\\"2025-10-28T11:52:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-27 11:52:00.017	2025-11-05 20:54:19.082
cmh9bz4j60004n9utgrctpx7i	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日30分钟非虚构类阅读" 挑战已结束，请在 10/28/2025 前提交证据	"{\\"gameId\\":\\"cmgzbxdny005210ifvm38tk4a\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\",\\"deadline\\":\\"2025-10-28T16:07:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-27 16:07:00.019	2025-11-05 20:54:19.082
cmhapg8wk0004cyq8dh42y02e	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"l5件事感恩日记" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmha8evok0001117uv95wftcx\\",\\"gameTitle\\":\\"l5件事感恩日记\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-28 15:12:00.02	2025-11-05 20:54:19.082
cmhbdmvhw000bxe90433royx9	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"每日运动挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhawi4tt0001xe90c0e883k6\\",\\"gameTitle\\":\\"每日运动挑战\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-29 02:29:00.02	2025-11-05 20:54:19.082
cmhbq4z710005x7g1eaij0ug7	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"每日运动挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmh82pxe60001e17r153xo76x\\",\\"gameTitle\\":\\"每日运动挑战\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-29 08:19:00.013	2025-11-05 20:54:19.082
cmhc7jd9x000cx7g1yolev4z7	cmfgpklkn000114lt1n0ec61k	SYSTEM	🎉 推荐奖励已到账！	恭喜您获得3天VIP会员奖励！感谢您推荐好友加入BetTogether。	"{\\"rewardType\\":\\"VIP_DAYS\\",\\"rewardValue\\":3,\\"referredUserId\\":\\"cmhc7jd8w0006x7g1c2qc46o4\\"}"	t	{IN_APP}	NORMAL	t	2025-10-29 16:26:04.949	2025-10-29 16:26:04.917	2025-11-05 20:54:19.082
cmhc7jdan000gx7g1bxzwr2nr	cmfgpklkn000114lt1n0ec61k	SYSTEM	🏆 推荐积分奖励！	恭喜您获得20参与积分奖励！感谢您推荐好友加入BetTogether。	"{\\"rewardType\\":\\"PARTICIPATION_POINTS\\",\\"rewardValue\\":20,\\"referredUserId\\":\\"cmhc7jd8w0006x7g1c2qc46o4\\"}"	t	{IN_APP}	NORMAL	t	2025-10-29 16:26:04.949	2025-10-29 16:26:04.943	2025-11-05 20:54:19.082
cmhcvjgly000c8iy4mmerksu4	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"每日运动挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhcefdvh0001hcgeng4yry82\\",\\"gameTitle\\":\\"每日运动挑战\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-10-30 03:38:00.022	2025-11-05 20:54:19.082
cmhi2rfir00145er42vt66ckv	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/3/2025 前提交证据	"{\\"gameId\\":\\"cmh82pxe60001e17r153xo76x\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-03T18:59:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-02 18:59:00.026	2025-11-05 20:54:19.082
cmhig9jhy000l141vypi1r51z	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"每日8小时深度睡眠提升" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhig5a250003141vy1jnjkhu\\",\\"gameTitle\\":\\"每日8小时深度睡眠提升\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 01:17:00.022	2025-11-05 20:54:19.082
cmhigdeds000o141vtkqejfku	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日8小时深度睡眠提升" 挑战已结束，请在 11/3/2025 前提交证据	"{\\"gameId\\":\\"cmhig5a250003141vy1jnjkhu\\",\\"gameTitle\\":\\"每日8小时深度睡眠提升\\",\\"deadline\\":\\"2025-11-03T01:25:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 01:20:00.016	2025-11-05 20:54:19.082
cmhilzawj00141lqo9y6khzjc	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"每日跑步5公里 测试双人评价" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhilxfdx000t1lqotcq44kxe\\",\\"gameTitle\\":\\"每日跑步5公里 测试双人评价\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 03:57:00.019	2025-11-05 20:54:19.082
cmhip0m30001o1lqo2bk2uome	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"每日运动挑战 2人评价测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhioy1cc00171lqofc2l8wzh\\",\\"gameTitle\\":\\"每日运动挑战 2人评价测试\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 05:22:00.012	2025-11-05 20:54:19.082
cmitmldva0007h5o1wc89fg1q	cmfiilojw000ao5ubr1d3vfk0	FRIEND_REQUEST	notifications.messages.friendRequest.title	notifications.messages.friendRequest.message	"{\\"requesterUsername\\":\\"admin\\"}"	f	{IN_APP}	NORMAL	t	2025-12-06 01:39:20.576	2025-12-06 01:39:20.567	\N
cmhip36oe001q1lqow52f67x7	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战 2人评价测试" 挑战已结束，请在 11/11/2025 前提交证据	"{\\"gameId\\":\\"cmhioy1cc00171lqofc2l8wzh\\",\\"gameTitle\\":\\"每日运动挑战 2人评价测试\\",\\"deadline\\":\\"2025-11-11T05:24:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 05:24:00.015	2025-11-05 20:54:19.082
cmhipl6tr002o1lqo8bky5ycy	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"每日30分钟非虚构类阅读" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhipj6ev002d1lqogsziidg6\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 05:38:00.015	2025-11-05 20:54:19.082
cmhipnrf7002q1lqox16fazbf	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日30分钟非虚构类阅读" 挑战已结束，请在 11/3/2025 前提交证据	"{\\"gameId\\":\\"cmhipj6ev002d1lqogsziidg6\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\",\\"deadline\\":\\"2025-11-03T05:43:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 05:40:00.02	2025-11-05 20:54:19.082
cmhjh0udp000c117auno2sz7g	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"文件上传测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhjgzgq20001117aa962fuhz\\",\\"gameTitle\\":\\"文件上传测试\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 18:26:00.014	2025-11-05 20:54:19.082
cmhjh4pa1000k117aokoi1zsr	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"文件上传测试" 挑战已结束，请在 11/11/2025 前提交证据	"{\\"gameId\\":\\"cmhjgzgq20001117aa962fuhz\\",\\"gameTitle\\":\\"文件上传测试\\",\\"deadline\\":\\"2025-11-11T18:29:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 18:29:00.026	2025-11-05 20:54:19.082
cmhjiyado000cc344dfmhcxfw	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"麻烦的很1" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhjiptsm0001c3444oz0v7qf\\",\\"gameTitle\\":\\"麻烦的很1\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 19:20:00.012	2025-11-05 20:54:19.082
cmhjj3fkg000ec344vwu7wjov	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"麻烦的很1" 挑战已结束，请在 11/3/2025 前提交证据	"{\\"gameId\\":\\"cmhjiptsm0001c3444oz0v7qf\\",\\"gameTitle\\":\\"麻烦的很1\\",\\"deadline\\":\\"2025-11-03T19:40:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-03 19:24:00.017	2025-11-05 20:54:19.082
cmhk7bcgj0013p1dnrlmji47z	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"互评详情链接 以及 扣分数值 专用测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhk7abeh000rp1dn46fy94jn\\",\\"gameTitle\\":\\"互评详情链接 以及 扣分数值 专用测试\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 06:42:00.019	2025-11-05 20:54:19.082
cmhk7dx1y0015p1dn84iewrjo	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"互评详情链接 以及 扣分数值 专用测试" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhk7abeh000rp1dn46fy94jn\\",\\"gameTitle\\":\\"互评详情链接 以及 扣分数值 专用测试\\",\\"deadline\\":\\"2025-11-04T06:48:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 06:44:00.022	2025-11-05 20:54:19.082
cmhkpj7lo001op1dnvx2e72cf	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"l5件事感恩日记" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmha8evok0001117uv95wftcx\\",\\"gameTitle\\":\\"l5件事感恩日记\\",\\"deadline\\":\\"2025-11-05T15:12:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 15:12:00.061	2025-11-05 20:54:19.082
cmhl1n60o000dqg34dhm2sgjm	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"挨个测试一堆问题" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhl1l1e10001qg34m9nbge0i\\",\\"gameTitle\\":\\"挨个测试一堆问题\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 20:51:00.024	2025-11-05 20:54:19.082
cmhl1pqlz000fqg340b971gv8	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"挨个测试一堆问题" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl1l1e10001qg34m9nbge0i\\",\\"gameTitle\\":\\"挨个测试一堆问题\\",\\"deadline\\":\\"2025-11-04T20:58:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 20:53:00.023	2025-11-05 20:54:19.082
cmhl1w6370015qg341xf2mbsk	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"处理一堆问题 3" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhl1uacq000nqg34wu04xwvn\\",\\"gameTitle\\":\\"处理一堆问题 3\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 20:58:00.02	2025-11-05 20:54:19.082
cmhl1yqp10019qg345n11e7km	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"处理一堆问题 3" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl1uacq000nqg34wu04xwvn\\",\\"gameTitle\\":\\"处理一堆问题 3\\",\\"deadline\\":\\"2025-11-04T21:05:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 21:00:00.038	2025-11-05 20:54:19.082
cmhl2cvxt0023qg34pltyxgli	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"测试大文件和视频上传" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhl2btuq001mqg348jq0sk3v\\",\\"gameTitle\\":\\"测试大文件和视频上传\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 21:11:00.018	2025-11-05 20:54:19.082
cmhl2fgj70026qg34hl3fwywc	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"测试大文件和视频上传" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl2btuq001mqg348jq0sk3v\\",\\"gameTitle\\":\\"测试大文件和视频上传\\",\\"deadline\\":\\"2025-11-04T21:20:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 21:13:00.02	2025-11-05 20:54:19.082
cmhl7esvv000c72stn4dkbzp1	cmfgpklkn000114lt1n0ec61k	ACHIEVEMENT_UNLOCKED	🏆 成就解锁！	恭喜您解锁了成就：积分新星	{"reward": {"points": {"type": "PARTICIPATION", "amount": 100}}, "achievementId": "cmhl7esvc000672sty9t2lsla", "achievementName": "积分新星"}	t	{IN_APP}	NORMAL	f	\N	2025-11-04 23:32:27.451	2025-11-05 20:54:19.082
cmhl7jcwd001h72stq2lhnrv0	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"每日运动挑战" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 23:36:00.013	2025-11-05 20:54:19.082
cmhl7lxi4001n72st1ja2gr9x	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-04T23:48:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-04 23:38:00.029	2025-11-05 20:54:19.082
cmhlacyb1004072stlc50hq2s	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"自我评价测试文字字数---" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhlabhi0003p72stcmydpbw1\\",\\"gameTitle\\":\\"自我评价测试文字字数---\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 00:55:00.013	2025-11-05 20:54:19.082
cmhlafiwi004272steyye8gyi	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"自我评价测试文字字数---" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlabhi0003p72stcmydpbw1\\",\\"gameTitle\\":\\"自我评价测试文字字数---\\",\\"deadline\\":\\"2025-11-05T01:04:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 00:57:00.018	2025-11-05 20:54:19.082
cmhldpu5x001ahru4rpziepfl	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/6/2025 前提交证据	"{\\"gameId\\":\\"cmhawi4tt0001xe90c0e883k6\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-06T02:29:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 02:29:00.022	2025-11-05 20:54:19.082
cmhm7snn3000cxx9rsxf4jidc	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"接着测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhm7rhjg0001xx9r4hvuxlhx\\",\\"gameTitle\\":\\"接着测试\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 16:31:00.016	2025-11-05 20:54:19.082
cmhm7v88j000exx9rldlrjkpi	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"接着测试" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhm7rhjg0001xx9r4hvuxlhx\\",\\"gameTitle\\":\\"接着测试\\",\\"deadline\\":\\"2025-11-05T16:39:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 16:33:00.019	2025-11-05 20:54:19.082
cmhm9h3kk0015xx9r97l3h9jp	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"纯文字发布测试 AAA" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhm9g12c000uxx9ry2rqybn8\\",\\"gameTitle\\":\\"纯文字发布测试 AAA\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 17:18:00.02	2025-11-05 20:54:19.082
cmhmakyrc000olrhr2crzvtte	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"问题500错误测试 BBB" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhmaizbw000dlrhroj4npjg7\\",\\"gameTitle\\":\\"问题500错误测试 BBB\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 17:49:00.024	2025-11-05 20:54:19.082
cmhmanjck000qlrhrs0sr4sgp	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"问题500错误测试 BBB" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmaizbw000dlrhroj4npjg7\\",\\"gameTitle\\":\\"问题500错误测试 BBB\\",\\"deadline\\":\\"2025-11-05T17:56:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 17:51:00.02	2025-11-05 20:54:19.082
cmhmbftv7000cxskekgcq2959	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"测试全部不选是否可以提交" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhmbelwy0001xskel3wdmqba\\",\\"gameTitle\\":\\"测试全部不选是否可以提交\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 18:13:00.019	2025-11-05 20:54:19.082
cmhmbiegj000exskewa8uyz44	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"测试全部不选是否可以提交" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmbelwy0001xskel3wdmqba\\",\\"gameTitle\\":\\"测试全部不选是否可以提交\\",\\"deadline\\":\\"2025-11-05T18:19:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 18:15:00.019	2025-11-05 20:54:19.082
cmhmh30oz000gxskewowt18ju	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"问题500错误测试 BBB" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmaizbw000dlrhroj4npjg7\\",\\"gameTitle\\":\\"问题500错误测试 BBB\\",\\"deadline\\":\\"2025-11-05T17:56:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.035	2025-11-05 20:54:19.082
cmhmh30p6000ixske7qzg7rtt	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"l5件事感恩日记" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmha8evok0001117uv95wftcx\\",\\"gameTitle\\":\\"l5件事感恩日记\\",\\"deadline\\":\\"2025-11-05T15:12:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.043	2025-11-05 20:54:19.082
cmhmh30pc000kxske4352jjkq	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日30分钟非虚构类阅读" 挑战已结束，请在 10/28/2025 前提交证据	"{\\"gameId\\":\\"cmha0rtnl000ln9uthxseclb3\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\",\\"deadline\\":\\"2025-10-28T15:43:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.049	2025-11-05 20:54:19.082
cmhmh30pi000mxske7klj36wj	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"纯文字发布测试 AAA" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhm9g12c000uxx9ry2rqybn8\\",\\"gameTitle\\":\\"纯文字发布测试 AAA\\",\\"deadline\\":\\"2025-11-05T17:27:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.054	2025-11-05 20:54:19.082
cmhmh30pr000pxskew8c4ehcr	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"挨个测试一堆问题" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl1l1e10001qg34m9nbge0i\\",\\"gameTitle\\":\\"挨个测试一堆问题\\",\\"deadline\\":\\"2025-11-04T20:58:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.063	2025-11-05 20:54:19.082
cmhmh30pw000qxske9ex3qimb	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每周3次力量训练挑战" 挑战已结束，请在 10/28/2025 前提交证据	"{\\"gameId\\":\\"cmgz2t7ng003210ifn0txseqw\\",\\"gameTitle\\":\\"每周3次力量训练挑战\\",\\"deadline\\":\\"2025-10-28T11:52:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.069	2025-11-05 20:54:19.082
cmhmh30q1000sxsket6p987j0	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日30分钟非虚构类阅读" 挑战已结束，请在 10/28/2025 前提交证据	"{\\"gameId\\":\\"cmgzbxdny005210ifvm38tk4a\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\",\\"deadline\\":\\"2025-10-28T16:07:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.074	2025-11-05 20:54:19.082
cmhmh30qb000wxske722z5ai9	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"天气预测挑战" 挑战已结束，请在 10/5/2025 前提交证据	"{\\"gameId\\":\\"cmfzrsy4l000d2tw3wt5whs5i\\",\\"gameTitle\\":\\"天气预测挑战\\",\\"deadline\\":\\"2025-10-05T18:52:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.083	2025-11-05 20:54:19.082
cmhmh30r30014xskehu560e7a	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日饮水" 挑战已结束，请在 10/5/2025 前提交证据	"{\\"gameId\\":\\"cmfyqnpxt001n9isaa0gg32w9\\",\\"gameTitle\\":\\"每日饮水\\",\\"deadline\\":\\"2025-10-05T01:32:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.112	2025-11-05 20:54:19.082
cmhmh30rq001axskemn5kledj	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/6/2025 前提交证据	"{\\"gameId\\":\\"cmhawi4tt0001xe90c0e883k6\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-06T02:29:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.134	2025-11-05 20:54:19.082
cmhmh30s3001exske53sy1i8f	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"自我评价测试文字字数---" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlabhi0003p72stcmydpbw1\\",\\"gameTitle\\":\\"自我评价测试文字字数---\\",\\"deadline\\":\\"2025-11-05T01:04:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.148	2025-11-05 20:54:19.082
cmhmh30s9001gxskexkaz9rhs	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"英语单词学习打卡" 挑战已结束，请在 10/28/2025 前提交证据	"{\\"gameId\\":\\"cmgyrzuo4000h9bn906tapny5\\",\\"gameTitle\\":\\"英语单词学习打卡\\",\\"deadline\\":\\"2025-10-28T06:49:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.154	2025-11-05 20:54:19.082
cmhmh30se001ixskej8wojo8m	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"冥想练习" 挑战已结束，请在 10/12/2025 前提交证据	"{\\"gameId\\":\\"cmfyqm0ag001g9isas5eaxm5e\\",\\"gameTitle\\":\\"冥想练习\\",\\"deadline\\":\\"2025-10-12T01:31:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.159	2025-11-05 20:54:19.082
cmhmh315g0056xskepkaenif3	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	互评阶段开始	"每日运动挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmh7d62rh0013d3m0dz4vmtub\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.629	2025-11-05 20:54:19.082
cmhmh30sj001jxskexc89kjfv	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日30分钟非虚构类阅读" 挑战已结束，请在 11/3/2025 前提交证据	"{\\"gameId\\":\\"cmhipj6ev002d1lqogsziidg6\\",\\"gameTitle\\":\\"每日30分钟非虚构类阅读\\",\\"deadline\\":\\"2025-11-03T05:43:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.164	2025-11-05 20:54:19.082
cmhmh30so001lxskervcwg7ou	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"冥想练习" 挑战已结束，请在 10/1/2025 前提交证据	"{\\"gameId\\":\\"cmfjq31050007az4kfbucjcdq\\",\\"gameTitle\\":\\"冥想练习\\",\\"deadline\\":\\"2025-10-01T13:19:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.169	2025-11-05 20:54:19.082
cmhmh30sy001mxskekv5l6zrb	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"天气预测挑战" 挑战已结束，请在 9/24/2025 前提交证据	"{\\"gameId\\":\\"cmfjq47jk000daz4kzzebykah\\",\\"gameTitle\\":\\"天气预测挑战\\",\\"deadline\\":\\"2025-09-24T13:20:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.178	2025-11-05 20:54:19.082
cmhmh30tg001sxske1xsgxunm	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"测试大文件和视频上传" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl2btuq001mqg348jq0sk3v\\",\\"gameTitle\\":\\"测试大文件和视频上传\\",\\"deadline\\":\\"2025-11-04T21:20:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.196	2025-11-05 20:54:19.082
cmhmh30tl001txske3uf7aber	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日阅读30分钟" 挑战已结束，请在 10/1/2025 前提交证据	"{\\"gameId\\":\\"cmg2bc7310007hbraewf0rmyh\\",\\"gameTitle\\":\\"每日阅读30分钟\\",\\"deadline\\":\\"2025-10-01T23:34:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.202	2025-11-05 20:54:19.082
cmhmh30tz001vxskezx5axpfq	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日阅读" 挑战已结束，请在 10/5/2025 前提交证据	"{\\"gameId\\":\\"cmfplita1000824jj8rtck0ti\\",\\"gameTitle\\":\\"每日阅读\\",\\"deadline\\":\\"2025-10-05T15:59:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.215	2025-11-05 20:54:19.082
cmhmh30u4001xxskeelpyfl94	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/3/2025 前提交证据	"{\\"gameId\\":\\"cmh82pxe60001e17r153xo76x\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-03T18:59:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.221	2025-11-05 20:54:19.082
cmhmh30ua001yxskeg6m54lum	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日阅读" 挑战已结束，请在 9/30/2025 前提交证据	"{\\"gameId\\":\\"cmfhq6fnn00078y89ear6ausw\\",\\"gameTitle\\":\\"每日阅读\\",\\"deadline\\":\\"2025-09-30T03:47:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.226	2025-11-05 20:54:19.082
cmhmh30uf001zxske7xawfcdl	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"测试全部不选是否可以提交" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhmbelwy0001xskel3wdmqba\\",\\"gameTitle\\":\\"测试全部不选是否可以提交\\",\\"deadline\\":\\"2025-11-05T18:19:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.232	2025-11-05 20:54:19.082
cmhmh30uz0025xskex4536ip8	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"接着测试" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhm7rhjg0001xx9r4hvuxlhx\\",\\"gameTitle\\":\\"接着测试\\",\\"deadline\\":\\"2025-11-05T16:39:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.251	2025-11-05 20:54:19.082
cmhmh30v50026xskecgpyyjz7	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"高级健身追踪" 挑战已结束，请在 10/1/2025 前提交证据	"{\\"gameId\\":\\"cmfjq2cam0001az4knhimbwj3\\",\\"gameTitle\\":\\"高级健身追踪\\",\\"deadline\\":\\"2025-10-01T13:19:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.258	2025-11-05 20:54:19.082
cmhmh30vb0027xskeyxucjw0b	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 10/26/2025 前提交证据	"{\\"gameId\\":\\"cmh7d62rh0013d3m0dz4vmtub\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-10-26T15:19:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.263	2025-11-05 20:54:19.082
cmhmh30vh0029xskey9evqq8o	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每天8杯水" 挑战已结束，请在 10/1/2025 前提交证据	"{\\"gameId\\":\\"cmg2bbjr80001hbraujzmuv8o\\",\\"gameTitle\\":\\"每天8杯水\\",\\"deadline\\":\\"2025-10-01T23:34:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.269	2025-11-05 20:54:19.082
cmhmh30vm002axske6p22xa8y	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"感恩日记记录" 挑战已结束，请在 10/24/2025 前提交证据	"{\\"gameId\\":\\"cmgh2myao000112etmu7ae4mr\\",\\"gameTitle\\":\\"感恩日记记录\\",\\"deadline\\":\\"2025-10-24T21:27:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.274	2025-11-05 20:54:19.082
cmhmh30vs002bxskebmdjm9xp	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"人际关系拓展" 挑战已结束，请在 10/5/2025 前提交证据	"{\\"gameId\\":\\"cmg228mp0000l7sa2x10rfit8\\",\\"gameTitle\\":\\"人际关系拓展\\",\\"deadline\\":\\"2025-10-05T10:19:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.28	2025-11-05 20:54:19.082
cmhmh30w4002exske7ql6vilf	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"冥想练习" 挑战已结束，请在 10/12/2025 前提交证据	"{\\"gameId\\":\\"cmfzrgl3f00012tw32obb730j\\",\\"gameTitle\\":\\"冥想练习\\",\\"deadline\\":\\"2025-10-12T18:43:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.293	2025-11-05 20:54:19.082
cmhmh30wg002hxskekcbsh873	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"早起挑战" 挑战已结束，请在 10/2/2025 前提交证据	"{\\"gameId\\":\\"cmfuzsf8w00119isa4t5mlh68\\",\\"gameTitle\\":\\"早起挑战\\",\\"deadline\\":\\"2025-10-02T10:37:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.305	2025-11-05 20:54:19.082
cmhmh30wr002jxske861bygel	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"高级健身追踪" 挑战已结束，请在 10/3/2025 前提交证据	"{\\"gameId\\":\\"cmflzh4ka000124jjoxctvu86\\",\\"gameTitle\\":\\"高级健身追踪\\",\\"deadline\\":\\"2025-10-03T03:18:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.316	2025-11-05 20:54:19.082
cmhmh30x6002mxskeypihfcpw	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"处理一堆问题 3" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl1uacq000nqg34wu04xwvn\\",\\"gameTitle\\":\\"处理一堆问题 3\\",\\"deadline\\":\\"2025-11-04T21:05:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.331	2025-11-05 20:54:19.082
cmhmh30xt002yxske2vtq4bup	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"文件上传测试" 挑战已结束，请在 11/11/2025 前提交证据	"{\\"gameId\\":\\"cmhjgzgq20001117aa962fuhz\\",\\"gameTitle\\":\\"文件上传测试\\",\\"deadline\\":\\"2025-11-11T18:29:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.353	2025-11-05 20:54:19.082
cmhmh30xy0034xske4zqi2bxm	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-04T23:48:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.358	2025-11-05 20:54:19.082
cmhmh30yg0039xske0dwty4q6	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"语言学习打卡" 挑战已结束，请在 10/12/2025 前提交证据	"{\\"gameId\\":\\"cmfzrhoe400072tw3d8te4hwn\\",\\"gameTitle\\":\\"语言学习打卡\\",\\"deadline\\":\\"2025-10-12T18:43:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.376	2025-11-05 20:54:19.082
cmhmh30yq003axskehj5yj9x1	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"冥想练习" 挑战已结束，请在 10/9/2025 前提交证据	"{\\"gameId\\":\\"cmfuzf4db000u9isa9si4797a\\",\\"gameTitle\\":\\"冥想练习\\",\\"deadline\\":\\"2025-10-09T10:27:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.387	2025-11-05 20:54:19.082
cmhmh30yx003gxske2urmp7gd	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"某某挑战某某挑战某某挑战1" 挑战已结束，请在 9/13/2025 前提交证据	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\",\\"gameTitle\\":\\"某某挑战某某挑战某某挑战1\\",\\"deadline\\":\\"2025-09-13T05:51:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.393	2025-11-05 20:54:19.082
cmhmh30z5003hxskesshsc1ll	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"冥想练习" 挑战已结束，请在 10/9/2025 前提交证据	"{\\"gameId\\":\\"cmfuteq6c000g24jj0ol98br2\\",\\"gameTitle\\":\\"冥想练习\\",\\"deadline\\":\\"2025-10-09T07:38:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.401	2025-11-05 20:54:19.082
cmhmh30zq003ixske31tr8owy	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	互评阶段开始	"每日30分钟非虚构类阅读" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmha0rtnl000ln9uthxseclb3\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.423	2025-11-05 20:54:19.082
cmhmh30zw003kxskelp9q1k1y	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	互评阶段开始	"纯文字发布测试 AAA" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhm9g12c000uxx9ry2rqybn8\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.429	2025-11-05 20:54:19.082
cmhmh3102003mxske52dr9ppu	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	互评阶段开始	"问题500错误测试 BBB" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhmaizbw000dlrhroj4npjg7\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.434	2025-11-05 20:54:19.082
cmhmh3107003oxskes4krqjsm	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	互评阶段开始	"l5件事感恩日记" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmha8evok0001117uv95wftcx\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.44	2025-11-05 20:54:19.082
cmhmh310d003rxskes80xm04a	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	互评阶段开始	"挨个测试一堆问题" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhl1l1e10001qg34m9nbge0i\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.446	2025-11-05 20:54:19.082
cmhmh310j003sxske7q3xq36k	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	互评阶段开始	"每周3次力量训练挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmgz2t7ng003210ifn0txseqw\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.452	2025-11-05 20:54:19.082
cmhmh310p003uxskespyhvgty	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	互评阶段开始	"每日30分钟非虚构类阅读" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmgzbxdny005210ifvm38tk4a\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.457	2025-11-05 20:54:19.082
cmhmh310z003yxskeb7heiala	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	自我评价阶段开始	"天气预测挑战" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmfzrsy4l000d2tw3wt5whs5i\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.467	2025-11-05 20:54:19.082
cmhmh311k0044xskehcrucn2v	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	互评阶段开始	"每日饮水" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmfyqnpxt001n9isaa0gg32w9\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.488	2025-11-05 20:54:19.082
cmhmh312a004cxskejmpdnthl	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	互评阶段开始	"自我评价测试文字字数---" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhlabhi0003p72stcmydpbw1\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.514	2025-11-05 20:54:19.082
cmhmh312g004exskeq2v9u88w	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	互评阶段开始	"英语单词学习打卡" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmgyrzuo4000h9bn906tapny5\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.52	2025-11-05 20:54:19.082
cmhmh312l004gxskeooogke12	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	自我评价阶段开始	"冥想练习" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmfyqm0ag001g9isas5eaxm5e\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.525	2025-11-05 20:54:19.082
cmhmh312p004hxskezsc7wef6	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	自我评价阶段开始	"冥想练习" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmfjq31050007az4kfbucjcdq\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.53	2025-11-05 20:54:19.082
cmhmh312u004ixskelnwcdupz	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	自我评价阶段开始	"天气预测挑战" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmfjq47jk000daz4kzzebykah\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.534	2025-11-05 20:54:19.082
cmhmh3133004mxskeb3sgklfm	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	互评阶段开始	"测试大文件和视频上传" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhl2btuq001mqg348jq0sk3v\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.543	2025-11-05 20:54:19.082
cmhmh313f004pxske5vzthxy1	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	互评阶段开始	"每日30分钟非虚构类阅读" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhipj6ev002d1lqogsziidg6\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.555	2025-11-05 20:54:19.082
cmhmh313j004rxskecbeduolk	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	自我评价阶段开始	"每日阅读30分钟" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmg2bc7310007hbraewf0rmyh\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.56	2025-11-05 20:54:19.082
cmhmh313t004txske8apk4hbv	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	自我评价阶段开始	"每日阅读" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmfplita1000824jj8rtck0ti\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.569	2025-11-05 20:54:19.082
cmhmh313y004vxskenxblofp9	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	互评阶段开始	"每日运动挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmh82pxe60001e17r153xo76x\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.574	2025-11-05 20:54:19.082
cmhmh3143004wxskersrsmgd3	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	自我评价阶段开始	"每日阅读" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmfhq6fnn00078y89ear6ausw\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.58	2025-11-05 20:54:19.082
cmhmh3148004xxske3hk54vng	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	互评阶段开始	"测试全部不选是否可以提交" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhmbelwy0001xskel3wdmqba\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.585	2025-11-05 20:54:19.082
cmhmh314s0053xskei6krdaq4	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	互评阶段开始	"接着测试" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhm7rhjg0001xx9r4hvuxlhx\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.604	2025-11-05 20:54:19.082
cmhmh314z0054xske52i1d8ak	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	自我评价阶段开始	"感恩日记记录" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmgh2myao000112etmu7ae4mr\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.611	2025-11-05 20:54:19.082
cmhmh31570055xske53yfzp73	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	自我评价阶段开始	"高级健身追踪" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmfjq2cam0001az4knhimbwj3\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.62	2025-11-05 20:54:19.082
cmhmh315p0058xskegn7swogn	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	自我评价阶段开始	"每天8杯水" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmg2bbjr80001hbraujzmuv8o\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.637	2025-11-05 20:54:19.082
cmhmh315w0059xske49diqitc	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	自我评价阶段开始	"人际关系拓展" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmg228mp0000l7sa2x10rfit8\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.644	2025-11-05 20:54:19.082
cmhmh3169005cxskefw3q5nm8	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	自我评价阶段开始	"冥想练习" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmfzrgl3f00012tw32obb730j\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.657	2025-11-05 20:54:19.082
cmhmh316e005dxskex33uz1fb	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	自我评价阶段开始	"早起挑战" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmfuzsf8w00119isa4t5mlh68\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.663	2025-11-05 20:54:19.082
cmhmh3171005hxske7xlja4n8	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	自我评价阶段开始	"高级健身追踪" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmflzh4ka000124jjoxctvu86\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.685	2025-11-05 20:54:19.082
cmhmh317g005kxske5n2n3cn0	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	互评阶段开始	"处理一堆问题 3" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhl1uacq000nqg34wu04xwvn\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.7	2025-11-05 20:54:19.082
cmhmh31820060xskeqrswqb73	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	互评阶段开始	"每日运动挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.722	2025-11-05 20:54:19.082
cmhmh318g0065xske0evw9iql	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	自我评价阶段开始	"语言学习打卡" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmfzrhoe400072tw3d8te4hwn\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.737	2025-11-05 20:54:19.082
cmhmh318l0066xskevto9s3bn	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	自我评价阶段开始	"冥想练习" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmfuzf4db000u9isa9si4797a\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.742	2025-11-05 20:54:19.082
cmhmh318r006cxskehppj0ovm	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	互评阶段开始	"某某挑战某某挑战某某挑战1" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmfhqcmch000p8y89n79410wa\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.747	2025-11-05 20:54:19.082
cmhmh318w006dxskeb60uek6f	cmfgpklkn000114lt1n0ec61k	PEER_REVIEW_REQUEST	自我评价阶段开始	"冥想练习" 进入自我评价阶段，请对自己的证据进行评价。	"{\\"gameId\\":\\"cmfuteq6c000g24jj0ol98br2\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.753	2025-11-05 20:54:19.082
cmhmh30qq0011xskev5p9ykj7	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"AAAAAAAAAAA" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlljrtz001b3fyju6ayec2i\\",\\"gameTitle\\":\\"AAAAAAAAAAA\\",\\"deadline\\":\\"2025-11-05T06:18:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.099	2025-11-06 08:53:23.958
cmhmh30rg0018xskehuy2beq0	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"综合测试" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlpyzw3002y3fyjy4vg3c83\\",\\"gameTitle\\":\\"综合测试\\",\\"deadline\\":\\"2025-11-05T08:25:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.125	2025-11-06 08:53:23.958
cmhmh30rx001dxskedeytoz28	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"测试上传各种文件  1111111" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhl9juw3001x72st1a9aci7j\\",\\"gameTitle\\":\\"测试上传各种文件  1111111\\",\\"deadline\\":\\"2025-11-05T00:42:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.141	2025-11-06 08:53:23.958
cmhmh30vy002dxske8y6ycuk8	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"CCCCCCC" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhll9iu1000n3fyjb4itb587\\",\\"gameTitle\\":\\"CCCCCCC\\",\\"deadline\\":\\"2025-11-05T06:05:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.286	2025-11-06 08:53:23.958
cmhn6sy0r001cp0dy4lpl5zbf	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"互评ID展示测试" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhn6r2ft0001p0dyvc3096qy\\",\\"gameTitle\\":\\"互评ID展示测试\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-06 08:51:00.027	2025-11-06 08:53:23.958
cmhmh30xi002uxske9iiuwl69	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"测试不评价，是不是到期自动结束游戏，崩溃了" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlc4142000nhru4cnixqecy\\",\\"gameTitle\\":\\"测试不评价，是不是到期自动结束游戏，崩溃了\\",\\"deadline\\":\\"2025-11-05T01:50:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.342	2025-11-06 08:53:23.958
cmhmh30xt002xxskeh5l6nbl1	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"文件上传测试" 挑战已结束，请在 11/11/2025 前提交证据	"{\\"gameId\\":\\"cmhjgzgq20001117aa962fuhz\\",\\"gameTitle\\":\\"文件上传测试\\",\\"deadline\\":\\"2025-11-11T18:29:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.353	2025-11-06 08:53:23.958
cmhmh30xy0033xskefdnlq4es	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"每日运动挑战" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"deadline\\":\\"2025-11-04T23:48:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.358	2025-11-06 08:53:23.958
cmhmh30y50036xskew4k67khh	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"互评测试 111" 挑战已结束，请在 11/4/2025 前提交证据	"{\\"gameId\\":\\"cmhjvpkrz00019i0qdft4463a\\",\\"gameTitle\\":\\"互评测试 111\\",\\"deadline\\":\\"2025-11-04T01:24:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.365	2025-11-06 08:53:23.958
cmhmh30ya0038xskea8iwye3f	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"实在是太麻烦了！" 挑战已结束，请在 11/5/2025 前提交证据	"{\\"gameId\\":\\"cmhlbnrhr004672stj3oz6a8s\\",\\"gameTitle\\":\\"实在是太麻烦了！\\",\\"deadline\\":\\"2025-11-05T01:38:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.371	2025-11-06 08:53:23.958
cmhmh3102003nxskeio3xi37b	cmhcegfin0006hcgendh83z40	PEER_REVIEW_REQUEST	互评阶段开始	"问题500错误测试 BBB" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhmaizbw000dlrhroj4npjg7\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.434	2025-11-06 08:53:23.958
cmhmh310d003qxskec3ma574f	cmhcegfin0006hcgendh83z40	PEER_REVIEW_REQUEST	互评阶段开始	"挨个测试一堆问题" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhl1l1e10001qg34m9nbge0i\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.446	2025-11-06 08:53:23.958
cmhmh310u003wxskecy8toagu	cmhcegfin0006hcgendh83z40	PEER_REVIEW_REQUEST	互评阶段开始	"文字证据提交500错误问题测试" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhlr6bcx0007wmw3merpt6qo\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.462	2025-11-06 08:53:23.958
cmhmh3124004bxskem99h6wfk	cmhcegfin0006hcgendh83z40	PEER_REVIEW_REQUEST	互评阶段开始	"测试上传各种文件  1111111" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhl9juw3001x72st1a9aci7j\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-05 20:51:00.508	2025-11-06 08:53:23.958
cmhoofd7c000ddvi6oj2yt2gv	cmfgpklkn000114lt1n0ec61k	SYSTEM	游戏争议通知	游戏"测试多个仲裁修改内容"有新的争议："撒打发"	"{\\"disputeId\\":\\"cmhoofd6r000bdvi663u5bjwo\\",\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\",\\"gameTitle\\":\\"测试多个仲裁修改内容\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 09:52:05.794	2025-11-07 09:52:05.785	\N
cmhoofd7t000fdvi6e9d26obu	cmfgpmfbo000314ltz0jj7n1y	SYSTEM	游戏争议通知	游戏"测试多个仲裁修改内容"有新的争议："撒打发"	"{\\"disputeId\\":\\"cmhoofd6r000bdvi663u5bjwo\\",\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\",\\"gameTitle\\":\\"测试多个仲裁修改内容\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 09:52:05.808	2025-11-07 09:52:05.802	\N
cmhoofd86000hdvi6dtkyqr7s	cmh36n1zs0005td07t6m368m7	SYSTEM	游戏争议通知	游戏"测试多个仲裁修改内容"有新的争议："撒打发"	"{\\"disputeId\\":\\"cmhoofd6r000bdvi663u5bjwo\\",\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\",\\"gameTitle\\":\\"测试多个仲裁修改内容\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 09:52:05.819	2025-11-07 09:52:05.814	\N
cmhoofd8m000jdvi65rf27kub	cmhc7jd8w0006x7g1c2qc46o4	SYSTEM	游戏争议通知	游戏"测试多个仲裁修改内容"有新的争议："撒打发"	"{\\"disputeId\\":\\"cmhoofd6r000bdvi663u5bjwo\\",\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\",\\"gameTitle\\":\\"测试多个仲裁修改内容\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 09:52:05.837	2025-11-07 09:52:05.83	\N
cmhoquoyi0018dvi6nv1r0d1y	cmgxdqce80000108q18y4npo0	GAME_STARTED	挑战开始了！	"仲裁" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 11:00:00.091	\N
cmhoquoyj0019dvi6zp0cby4h	cmgxzbcqh0000hak2a2jt0wwa	GAME_STARTED	挑战开始了！	"仲裁" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 11:00:00.091	\N
cmhoquoyj001advi61ruvkzsf	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"仲裁" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 11:00:00.091	\N
cmhoquoyj001bdvi61dbfc3ff	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"仲裁" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 11:00:00.091	\N
cmhoqx9hv001cdvi6mnf8trhg	cmgxdqce80000108q18y4npo0	EVIDENCE_REQUIRED	请提交证据	"仲裁" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"deadline\\":\\"2025-11-07T11:10:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 11:02:00.019	\N
cmhoqx9hv001ddvi6p0aup8ie	cmgxzbcqh0000hak2a2jt0wwa	EVIDENCE_REQUIRED	请提交证据	"仲裁" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"deadline\\":\\"2025-11-07T11:10:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 11:02:00.019	\N
cmhoqx9hv001edvi6tj1pqvl7	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"仲裁" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"deadline\\":\\"2025-11-07T11:10:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 11:02:00.019	\N
cmhoqx9hv001fdvi6k6p05yap	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"仲裁" 挑战已结束，请在 11/7/2025 前提交证据	"{\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"deadline\\":\\"2025-11-07T11:10:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 11:02:00.019	\N
cmhor7jvf001gdvi6xvenzfsp	cmgxdqce80000108q18y4npo0	PEER_EVALUATION_STARTED	互评阶段开始	"仲裁" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 11:10:00.028	\N
cmhor7jvf001hdvi6nhjn9n53	cmgxzbcqh0000hak2a2jt0wwa	PEER_EVALUATION_STARTED	互评阶段开始	"仲裁" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 11:10:00.028	\N
cmhor7jvg001idvi65iebtzl8	cmh36n1zs0005td07t6m368m7	PEER_EVALUATION_STARTED	互评阶段开始	"仲裁" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 11:10:00.028	\N
cmhor7jvg001jdvi68xb6r63l	cmhcegfin0006hcgendh83z40	PEER_EVALUATION_STARTED	互评阶段开始	"仲裁" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 11:10:00.028	\N
cmhp7utyd001kdvi6h4caku3e	cmhcegfin0006hcgendh83z40	PEER_EVALUATION_STARTED	互评阶段开始	"每日30分钟非虚构类阅读" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhdb0swc0001r5ae3y4j3ryy\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 18:56:00.037	\N
cmhp7utyd001ldvi6fe4l97iw	cmh36n1zs0005td07t6m368m7	PEER_EVALUATION_STARTED	互评阶段开始	"每日30分钟非虚构类阅读" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhdb0swc0001r5ae3y4j3ryy\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 18:56:00.037	\N
cmhp7utyd001mdvi6652fr1lw	cmhc7jd8w0006x7g1c2qc46o4	PEER_EVALUATION_STARTED	互评阶段开始	"每日30分钟非虚构类阅读" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhdb0swc0001r5ae3y4j3ryy\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-07 18:56:00.037	\N
cmhpbicqj002sdvi6sy3b9ge9	cmgxdqce80000108q18y4npo0	SYSTEM	仲裁结果通知	游戏"仲裁"的争议"阿斯蒂芬萨芬暗室逢灯"已处理完成。处理结果：证据不足。	"{\\"disputeId\\":\\"cmhpbhook002idvi64pebl6ot\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"decision\\":\\"INSUFFICIENT_EVIDENCE\\",\\"resolution\\":\\"是打发打发\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.847	2025-11-07 20:38:16.316	\N
cmhpbf90z0022dvi6dq843r0o	cmhcegfin0006hcgendh83z40	SYSTEM	游戏争议通知	游戏"仲裁"有新的争议："撒打发付费"	"{\\"disputeId\\":\\"cmhpbf8zl001wdvi6kiqpvj0h\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"disputeType\\":\\"RULE_VIOLATION\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.886	2025-11-07 20:35:51.539	\N
cmhpbf90o0020dvi6zur5jh7t	cmh36n1zs0005td07t6m368m7	SYSTEM	游戏争议通知	游戏"仲裁"有新的争议："撒打发付费"	"{\\"disputeId\\":\\"cmhpbf8zl001wdvi6kiqpvj0h\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"disputeType\\":\\"RULE_VIOLATION\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.874	2025-11-07 20:35:51.528	\N
cmhpbg1gq002advi6h3vsm48y	cmgxdqce80000108q18y4npo0	SYSTEM	仲裁结果通知	游戏"仲裁"的争议"撒打发付费"已处理完成。处理结果：支持发起人。	"{\\"disputeId\\":\\"cmhpbf8zl001wdvi6kiqpvj0h\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"decision\\":\\"APPROVE_INITIATOR\\",\\"resolution\\":\\"是否是发士大夫暗示发大水\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.847	2025-11-07 20:36:28.395	\N
cmhpbhooz002kdvi6vvt8aj22	cmgxdqce80000108q18y4npo0	SYSTEM	游戏争议通知	游戏"仲裁"有新的争议："阿斯蒂芬萨芬暗室逢灯"	"{\\"disputeId\\":\\"cmhpbhook002idvi64pebl6ot\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"disputeType\\":\\"RULE_VIOLATION\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.847	2025-11-07 20:37:45.155	\N
cmhpbg1h3002cdvi6kk31sbwj	cmgxzbcqh0000hak2a2jt0wwa	SYSTEM	仲裁结果通知	您发起的争议"撒打发付费"已处理完成。处理结果：支持发起人。是否是发士大夫暗示发大水	"{\\"disputeId\\":\\"cmhpbf8zl001wdvi6kiqpvj0h\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"decision\\":\\"APPROVE_INITIATOR\\",\\"resolution\\":\\"是否是发士大夫暗示发大水\\",\\"canRetry\\":false}"	t	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.861	2025-11-07 20:36:28.407	2025-11-07 20:36:43.375
cmhpbhopa002mdvi6qm5hynof	cmgxzbcqh0000hak2a2jt0wwa	SYSTEM	游戏争议通知	游戏"仲裁"有新的争议："阿斯蒂芬萨芬暗室逢灯"	"{\\"disputeId\\":\\"cmhpbhook002idvi64pebl6ot\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"disputeType\\":\\"RULE_VIOLATION\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.861	2025-11-07 20:37:45.167	\N
cmhpbg1he002edvi6kn1dgn6d	cmh36n1zs0005td07t6m368m7	SYSTEM	仲裁结果通知	游戏"仲裁"的争议"撒打发付费"已处理完成。处理结果：支持发起人。	"{\\"disputeId\\":\\"cmhpbf8zl001wdvi6kiqpvj0h\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"decision\\":\\"APPROVE_INITIATOR\\",\\"resolution\\":\\"是否是发士大夫暗示发大水\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.874	2025-11-07 20:36:28.418	\N
cmhpbhopj002odvi6bembiw1r	cmh36n1zs0005td07t6m368m7	SYSTEM	游戏争议通知	游戏"仲裁"有新的争议："阿斯蒂芬萨芬暗室逢灯"	"{\\"disputeId\\":\\"cmhpbhook002idvi64pebl6ot\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"disputeType\\":\\"RULE_VIOLATION\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.874	2025-11-07 20:37:45.175	\N
cmhpbg1hp002gdvi62w102p3a	cmhcegfin0006hcgendh83z40	SYSTEM	仲裁结果通知	游戏"仲裁"的争议"撒打发付费"已处理完成。处理结果：支持发起人。	"{\\"disputeId\\":\\"cmhpbf8zl001wdvi6kiqpvj0h\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"decision\\":\\"APPROVE_INITIATOR\\",\\"resolution\\":\\"是否是发士大夫暗示发大水\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.886	2025-11-07 20:36:28.429	\N
cmhpbf906001ydvi6jhf693eo	cmgxdqce80000108q18y4npo0	SYSTEM	游戏争议通知	游戏"仲裁"有新的争议："撒打发付费"	"{\\"disputeId\\":\\"cmhpbf8zl001wdvi6kiqpvj0h\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"disputeType\\":\\"RULE_VIOLATION\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.847	2025-11-07 20:35:51.51	\N
cmhpbjfln003cdvi6gr7kb522	cmgxdqce80000108q18y4npo0	SYSTEM	仲裁结果通知	游戏"仲裁"的争议"s打发十分大师傅撒旦"已处理完成。处理结果：无效争议。	"{\\"disputeId\\":\\"cmhpbiwod0030dvi6wxttx3ir\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"decision\\":\\"INVALID_DISPUTE\\",\\"resolution\\":\\"啊手动阀暗示\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.847	2025-11-07 20:39:06.683	\N
cmhpbicqv002udvi6dcmhgex8	cmgxzbcqh0000hak2a2jt0wwa	SYSTEM	仲裁结果通知	游戏"仲裁"的争议"阿斯蒂芬萨芬暗室逢灯"已处理完成。处理结果：证据不足。	"{\\"disputeId\\":\\"cmhpbhook002idvi64pebl6ot\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"decision\\":\\"INSUFFICIENT_EVIDENCE\\",\\"resolution\\":\\"是打发打发\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.861	2025-11-07 20:38:16.327	\N
cmhpbiwor0032dvi68i3cyyz8	cmgxdqce80000108q18y4npo0	SYSTEM	游戏争议通知	游戏"仲裁"有新的争议："s打发十分大师傅撒旦"	"{\\"disputeId\\":\\"cmhpbiwod0030dvi6wxttx3ir\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"disputeType\\":\\"UNFAIR_EVALUATION\\"}"	t	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.847	2025-11-07 20:38:42.172	2025-11-07 20:41:34.998
cmhpbiwpa0036dvi6vunaxx3g	cmh36n1zs0005td07t6m368m7	SYSTEM	游戏争议通知	游戏"仲裁"有新的争议："s打发十分大师傅撒旦"	"{\\"disputeId\\":\\"cmhpbiwod0030dvi6wxttx3ir\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"disputeType\\":\\"UNFAIR_EVALUATION\\"}"	t	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.874	2025-11-07 20:38:42.191	2025-11-07 20:42:13.678
cmhpbiwp20034dvi6jd74mlie	cmgxzbcqh0000hak2a2jt0wwa	SYSTEM	游戏争议通知	游戏"仲裁"有新的争议："s打发十分大师傅撒旦"	"{\\"disputeId\\":\\"cmhpbiwod0030dvi6wxttx3ir\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"disputeType\\":\\"UNFAIR_EVALUATION\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.861	2025-11-07 20:38:42.182	\N
cmhpbjflz003edvi6m603hjpy	cmgxzbcqh0000hak2a2jt0wwa	SYSTEM	仲裁结果通知	游戏"仲裁"的争议"s打发十分大师傅撒旦"已处理完成。处理结果：无效争议。	"{\\"disputeId\\":\\"cmhpbiwod0030dvi6wxttx3ir\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"decision\\":\\"INVALID_DISPUTE\\",\\"resolution\\":\\"啊手动阀暗示\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.861	2025-11-07 20:39:06.695	\N
cmhpbicr4002wdvi6kyzv93ff	cmh36n1zs0005td07t6m368m7	SYSTEM	仲裁结果通知	游戏"仲裁"的争议"阿斯蒂芬萨芬暗室逢灯"已处理完成。处理结果：证据不足。	"{\\"disputeId\\":\\"cmhpbhook002idvi64pebl6ot\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"decision\\":\\"INSUFFICIENT_EVIDENCE\\",\\"resolution\\":\\"是打发打发\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.874	2025-11-07 20:38:16.336	\N
cmhpbicre002ydvi6iiz877od	cmhcegfin0006hcgendh83z40	SYSTEM	仲裁结果通知	您发起的争议"阿斯蒂芬萨芬暗室逢灯"已处理完成。处理结果：证据不足。是打发打发	"{\\"disputeId\\":\\"cmhpbhook002idvi64pebl6ot\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"decision\\":\\"INSUFFICIENT_EVIDENCE\\",\\"resolution\\":\\"是打发打发\\",\\"canRetry\\":false}"	t	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.886	2025-11-07 20:38:16.347	2025-11-07 20:38:26.197
cmhpbjfmm003idvi6ucokty1r	cmhcegfin0006hcgendh83z40	SYSTEM	仲裁结果通知	您发起的争议"s打发十分大师傅撒旦"已被驳回。处理结果：无效争议。啊手动阀暗示 您还可以再发起 1 次仲裁。	"{\\"disputeId\\":\\"cmhpbiwod0030dvi6wxttx3ir\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"decision\\":\\"INVALID_DISPUTE\\",\\"resolution\\":\\"啊手动阀暗示\\",\\"canRetry\\":true}"	t	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.886	2025-11-07 20:39:06.718	2025-11-07 20:40:05.07
cmhpbkg0o0040dvi6k2w2j1p9	cmhcegfin0006hcgendh83z40	SYSTEM	仲裁结果通知	您发起的争议"啊手动阀阿萨的暗示"已处理完成。处理结果：无需处理。撒打发撒飞洒	"{\\"disputeId\\":\\"cmhpbjupk003kdvi6i6ju985r\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"decision\\":\\"NO_ACTION_NEEDED\\",\\"resolution\\":\\"撒打发撒飞洒\\",\\"canRetry\\":false}"	t	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.886	2025-11-07 20:39:53.881	2025-11-07 20:40:05.945
cmhpbkfzi003udvi6q11gjjlh	cmgxdqce80000108q18y4npo0	SYSTEM	仲裁结果通知	游戏"仲裁"的争议"啊手动阀阿萨的暗示"已处理完成。处理结果：无需处理。	"{\\"disputeId\\":\\"cmhpbjupk003kdvi6i6ju985r\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"decision\\":\\"NO_ACTION_NEEDED\\",\\"resolution\\":\\"撒打发撒飞洒\\",\\"canRetry\\":false}"	t	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.847	2025-11-07 20:39:53.839	2025-11-07 20:41:31.011
cmhpbjuq9003odvi6g9p30esa	cmgxzbcqh0000hak2a2jt0wwa	SYSTEM	游戏争议通知	游戏"仲裁"有新的争议："啊手动阀阿萨的暗示"	"{\\"disputeId\\":\\"cmhpbjupk003kdvi6i6ju985r\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"disputeType\\":\\"RULE_VIOLATION\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.861	2025-11-07 20:39:26.289	\N
cmhpbkfzy003wdvi6w7dec6p1	cmgxzbcqh0000hak2a2jt0wwa	SYSTEM	仲裁结果通知	游戏"仲裁"的争议"啊手动阀阿萨的暗示"已处理完成。处理结果：无需处理。	"{\\"disputeId\\":\\"cmhpbjupk003kdvi6i6ju985r\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"decision\\":\\"NO_ACTION_NEEDED\\",\\"resolution\\":\\"撒打发撒飞洒\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.861	2025-11-07 20:39:53.854	\N
cmhpd7e4p004rdvi6l2qfuv79	cmfgpmfbo000314ltz0jj7n1y	SYSTEM	游戏争议通知	游戏"测试多个仲裁修改内容"有新的争议："阿萨的飞洒"	"{\\"disputeId\\":\\"cmhpd7e47004pdvi6seta4jjp\\",\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\",\\"gameTitle\\":\\"测试多个仲裁修改内容\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 21:25:44.146	2025-11-07 21:25:44.137	\N
cmhpd7e55004tdvi6xet5xae2	cmh36n1zs0005td07t6m368m7	SYSTEM	游戏争议通知	游戏"测试多个仲裁修改内容"有新的争议："阿萨的飞洒"	"{\\"disputeId\\":\\"cmhpd7e47004pdvi6seta4jjp\\",\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\",\\"gameTitle\\":\\"测试多个仲裁修改内容\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 21:25:44.158	2025-11-07 21:25:44.153	\N
cmhpbjupx003mdvi6pp9uxh24	cmgxdqce80000108q18y4npo0	SYSTEM	游戏争议通知	游戏"仲裁"有新的争议："啊手动阀阿萨的暗示"	"{\\"disputeId\\":\\"cmhpbjupk003kdvi6i6ju985r\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"disputeType\\":\\"RULE_VIOLATION\\"}"	t	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.847	2025-11-07 20:39:26.277	2025-11-07 20:41:33.241
cmhpbkg0b003ydvi6ll2cet6o	cmh36n1zs0005td07t6m368m7	SYSTEM	仲裁结果通知	游戏"仲裁"的争议"啊手动阀阿萨的暗示"已处理完成。处理结果：无需处理。	"{\\"disputeId\\":\\"cmhpbjupk003kdvi6i6ju985r\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"decision\\":\\"NO_ACTION_NEEDED\\",\\"resolution\\":\\"撒打发撒飞洒\\",\\"canRetry\\":false}"	t	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.874	2025-11-07 20:39:53.867	2025-11-07 20:41:49.099
cmhpbjuql003qdvi68dp3q9j9	cmh36n1zs0005td07t6m368m7	SYSTEM	游戏争议通知	游戏"仲裁"有新的争议："啊手动阀阿萨的暗示"	"{\\"disputeId\\":\\"cmhpbjupk003kdvi6i6ju985r\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"disputeType\\":\\"RULE_VIOLATION\\"}"	t	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.874	2025-11-07 20:39:26.301	2025-11-07 20:41:50.138
cmhpbjfm8003gdvi6vj1dgohh	cmh36n1zs0005td07t6m368m7	SYSTEM	仲裁结果通知	游戏"仲裁"的争议"s打发十分大师傅撒旦"已处理完成。处理结果：无效争议。	"{\\"disputeId\\":\\"cmhpbiwod0030dvi6wxttx3ir\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"decision\\":\\"INVALID_DISPUTE\\",\\"resolution\\":\\"啊手动阀暗示\\",\\"canRetry\\":false}"	t	{IN_APP}	NORMAL	t	2025-11-07 20:39:53.874	2025-11-07 20:39:06.705	2025-11-07 20:41:51.115
cmhpbrc8o0044dvi6ft7svl0u	cmgxzbcqh0000hak2a2jt0wwa	SYSTEM	游戏争议通知	游戏"仲裁"有新的争议："阿斯顿发射点"	"{\\"disputeId\\":\\"cmhpbrc870042dvi6xczlv3t3\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 20:45:15.583	2025-11-07 20:45:15.576	\N
cmhpbrc970046dvi6v0lf7n6a	cmh36n1zs0005td07t6m368m7	SYSTEM	游戏争议通知	游戏"仲裁"有新的争议："阿斯顿发射点"	"{\\"disputeId\\":\\"cmhpbrc870042dvi6xczlv3t3\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 20:45:15.6	2025-11-07 20:45:15.595	\N
cmhpd7e5g004vdvi6ww39s0qf	cmhc7jd8w0006x7g1c2qc46o4	SYSTEM	游戏争议通知	游戏"测试多个仲裁修改内容"有新的争议："阿萨的飞洒"	"{\\"disputeId\\":\\"cmhpd7e47004pdvi6seta4jjp\\",\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\",\\"gameTitle\\":\\"测试多个仲裁修改内容\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 21:25:44.173	2025-11-07 21:25:44.165	\N
cmhped73l005fdvi6uvngsj19	cmhc7jd8w0006x7g1c2qc46o4	SYSTEM	游戏争议通知	游戏"每日运动挑战"有新的争议："sadfasdfas"	"{\\"disputeId\\":\\"cmhped730005ddvi6twf7pygz\\",\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 21:58:14.587	2025-11-07 21:58:14.578	\N
cmhpbrc9h0048dvi62otdd38j	cmhcegfin0006hcgendh83z40	SYSTEM	游戏争议通知	游戏"仲裁"有新的争议："阿斯顿发射点"	"{\\"disputeId\\":\\"cmhpbrc870042dvi6xczlv3t3\\",\\"gameId\\":\\"cmhooodux000ldvi6x4x66lmg\\",\\"gameTitle\\":\\"仲裁\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	t	{IN_APP}	NORMAL	t	2025-11-07 20:45:15.612	2025-11-07 20:45:15.605	2025-11-07 21:26:30.196
cmhpd7e5u004xdvi6y7ab1v66	cmhcegfin0006hcgendh83z40	SYSTEM	游戏争议通知	游戏"测试多个仲裁修改内容"有新的争议："阿萨的飞洒"	"{\\"disputeId\\":\\"cmhpd7e47004pdvi6seta4jjp\\",\\"gameId\\":\\"cmholuz8l004oeo2ux4k76e13\\",\\"gameTitle\\":\\"测试多个仲裁修改内容\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	t	{IN_APP}	NORMAL	t	2025-11-07 21:25:44.184	2025-11-07 21:25:44.178	2025-11-07 21:26:30.822
cmhped742005hdvi62xzxyli5	cmh36n1zs0005td07t6m368m7	SYSTEM	游戏争议通知	游戏"每日运动挑战"有新的争议："sadfasdfas"	"{\\"disputeId\\":\\"cmhped730005ddvi6twf7pygz\\",\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 21:58:14.601	2025-11-07 21:58:14.594	\N
cmhped74f005jdvi67noz2quh	cmgxzbcqh0000hak2a2jt0wwa	SYSTEM	游戏争议通知	游戏"每日运动挑战"有新的争议："sadfasdfas"	"{\\"disputeId\\":\\"cmhped730005ddvi6twf7pygz\\",\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 21:58:14.614	2025-11-07 21:58:14.608	\N
cmhped74u005ldvi6dip9itpg	cmfiilojw000ao5ubr1d3vfk0	SYSTEM	游戏争议通知	游戏"每日运动挑战"有新的争议："sadfasdfas"	"{\\"disputeId\\":\\"cmhped730005ddvi6twf7pygz\\",\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 21:58:14.629	2025-11-07 21:58:14.622	\N
cmhped756005ndvi6kb36wo3u	cmfgpklkn000114lt1n0ec61k	SYSTEM	游戏争议通知	游戏"每日运动挑战"有新的争议："sadfasdfas"	"{\\"disputeId\\":\\"cmhped730005ddvi6twf7pygz\\",\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	f	{IN_APP}	NORMAL	t	2025-11-07 21:58:14.646	2025-11-07 21:58:14.635	\N
cmikw82mr0000123kfv332g7c	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"每日跑步5公里 测试双人评价" 挑战已结束，请在 11/11/2025 前提交证据	"{\\"gameId\\":\\"cmhilxfdx000t1lqotcq44kxe\\",\\"gameTitle\\":\\"每日跑步5公里 测试双人评价\\",\\"deadline\\":\\"2025-11-11T04:00:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-29 22:59:00.051	\N
cmikw82mr0001123ksjh7013o	cmhc7jd8w0006x7g1c2qc46o4	EVIDENCE_REQUIRED	请提交证据	"每日跑步5公里 测试双人评价" 挑战已结束，请在 11/11/2025 前提交证据	"{\\"gameId\\":\\"cmhilxfdx000t1lqotcq44kxe\\",\\"gameTitle\\":\\"每日跑步5公里 测试双人评价\\",\\"deadline\\":\\"2025-11-11T04:00:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-29 22:59:00.051	\N
cmikw82nd0002123ki6affm6z	cmhcegfin0006hcgendh83z40	PEER_EVALUATION_STARTED	互评阶段开始	"文件上传测试" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhjgzgq20001117aa962fuhz\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-29 22:59:00.074	\N
cmikw82nd0003123kwi6vccqw	cmfgpklkn000114lt1n0ec61k	PEER_EVALUATION_STARTED	互评阶段开始	"文件上传测试" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhjgzgq20001117aa962fuhz\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-29 22:59:00.074	\N
cmikw82nn0004123kbcgskgzq	cmfgpklkn000114lt1n0ec61k	PEER_EVALUATION_STARTED	互评阶段开始	"每日跑步5公里 测试双人评价" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhilxfdx000t1lqotcq44kxe\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-29 22:59:00.083	\N
cmikw82nn0005123kil3ryyul	cmhc7jd8w0006x7g1c2qc46o4	PEER_EVALUATION_STARTED	互评阶段开始	"每日跑步5公里 测试双人评价" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhilxfdx000t1lqotcq44kxe\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-29 22:59:00.083	\N
cmikw82ny0006123kgtx3v2gd	cmhcc8p1o000atqgxpzkeao00	PEER_EVALUATION_STARTED	互评阶段开始	"6:00早起晨练运动挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhilmabz00071lqopqqkiukc\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-29 22:59:00.094	\N
cmikw82ny0007123ksv4r10c8	cmhcegfin0006hcgendh83z40	PEER_EVALUATION_STARTED	互评阶段开始	"6:00早起晨练运动挑战" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmhilmabz00071lqopqqkiukc\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-11-29 22:59:00.094	\N
cmilnnq8y00ykbbjusacus0zk	cmfhsxf490000lmmnwp77vl6x	SECURITY_ALERT	检测到可疑互评行为	游戏 cmhn6r2ft0001p0dyvc3096qy 存在 CRITICAL 风险的作弊行为，需要人工审核。	"{\\"gameId\\":\\"cmhn6r2ft0001p0dyvc3096qy\\",\\"riskLevel\\":\\"CRITICAL\\",\\"reasons\\":[\\"7 个用户存在快速连续评价行为\\",\\"低信任度用户好评比例异常: 63%\\",\\"评价者之间存在异常关联，疑似串通\\"]}"	t	{IN_APP}	NORMAL	f	\N	2025-11-30 11:47:00.13	2025-11-30 11:47:51.661
cminn3ogk000c118znt7lnf98	cmfgpklkn000114lt1n0ec61k	SYSTEM	仲裁结果通知	您发起的争议"测试上传图片"已处理完成。处理结果：部分支持。部分不支持	"{\\"disputeId\\":\\"cminn1f1k0001118zz6te0blh\\",\\"gameId\\":\\"cmimekf730098okexf0o0oww2\\",\\"gameTitle\\":\\"dispute\\",\\"decision\\":\\"PARTIAL_APPROVAL\\",\\"resolution\\":\\"部分不支持\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-12-01 21:06:57.051	2025-12-01 21:06:57.044	\N
cmim1lmc20007t9hylnwa2tv4	cmhcegfin0006hcgendh83z40	SYSTEM	账户已被封禁	您的账户因"违规行为"被封禁永久	"{\\"reason\\":\\"违规行为\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-11-30 18:18:24.891	2025-11-30 18:17:16.371	\N
cminn3ogw000e118zd9ek6cp1	cmgxdqce80000108q18y4npo0	SYSTEM	仲裁结果通知	@test789 发起的游戏"dispute"的争议"测试上传图片"已处理完成。处理结果：部分支持。	"{\\"disputeId\\":\\"cminn1f1k0001118zz6te0blh\\",\\"gameId\\":\\"cmimekf730098okexf0o0oww2\\",\\"gameTitle\\":\\"dispute\\",\\"decision\\":\\"PARTIAL_APPROVAL\\",\\"resolution\\":\\"部分不支持\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-12-01 21:06:57.062	2025-12-01 21:06:57.057	\N
cminn1f4b0004118zmfgh9p0w	cmgxdqce80000108q18y4npo0	SYSTEM	游戏争议通知	游戏"dispute"有新的争议："测试上传图片"	"{\\"disputeId\\":\\"cminn1f1k0001118zz6te0blh\\",\\"gameId\\":\\"cmimekf730098okexf0o0oww2\\",\\"gameTitle\\":\\"dispute\\",\\"disputeType\\":\\"RULE_VIOLATION\\"}"	f	{IN_APP}	NORMAL	t	2025-12-01 21:06:57.062	2025-12-01 21:05:11.627	\N
cmim1n9fn000gt9hysjgv6a8v	cmh7d0ay1000zd3m01yxn28f4	SYSTEM	账户已被封禁	您的账户因"违规行为"被封禁永久	"{\\"reason\\":\\"违规行为\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-11-30 18:19:29.052	2025-11-30 18:18:32.964	\N
cmim1q4ea000yt9hym4nh5l9m	cmh24ml660003td0740yexg8h	SYSTEM	账户已被删除	您的账户已被管理员删除。原因：管理员删除	"{\\"reason\\":\\"管理员删除\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-11-30 18:20:46.412	2025-11-30 18:20:46.402	\N
cmimilere0019iaffd2cbryjb	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"test 3" 挑战已结束，请在 12/1/2025 前提交证据	"{\\"gameId\\":\\"cmimic9op000biaffodufnc10\\",\\"gameTitle\\":\\"test 3\\",\\"deadline\\":\\"2025-12-01T02:18:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 02:13:00.027	\N
cmimilere001aiaff5bbzlem1	cmh36n1zs0005td07t6m368m7	EVIDENCE_REQUIRED	请提交证据	"test 3" 挑战已结束，请在 12/1/2025 前提交证据	"{\\"gameId\\":\\"cmimic9op000biaffodufnc10\\",\\"gameTitle\\":\\"test 3\\",\\"deadline\\":\\"2025-12-01T02:18:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 02:13:00.027	\N
cmimilere001biafff05xmks6	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"test 3" 挑战已结束，请在 12/1/2025 前提交证据	"{\\"gameId\\":\\"cmimic9op000biaffodufnc10\\",\\"gameTitle\\":\\"test 3\\",\\"deadline\\":\\"2025-12-01T02:18:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 02:13:00.027	\N
cminn1f560008118zurrnbfy7	cmh4rbv470000d3m0tokxkudd	SYSTEM	游戏争议通知	游戏"dispute"有新的争议："测试上传图片"	"{\\"disputeId\\":\\"cminn1f1k0001118zz6te0blh\\",\\"gameId\\":\\"cmimekf730098okexf0o0oww2\\",\\"gameTitle\\":\\"dispute\\",\\"disputeType\\":\\"RULE_VIOLATION\\"}"	f	{IN_APP}	NORMAL	t	2025-12-01 21:06:57.086	2025-12-01 21:05:11.658	\N
cminn3ohj000i118zzszn2lgs	cmh4rbv470000d3m0tokxkudd	SYSTEM	仲裁结果通知	@test789 发起的游戏"dispute"的争议"测试上传图片"已处理完成。处理结果：部分支持。	"{\\"disputeId\\":\\"cminn1f1k0001118zz6te0blh\\",\\"gameId\\":\\"cmimekf730098okexf0o0oww2\\",\\"gameTitle\\":\\"dispute\\",\\"decision\\":\\"PARTIAL_APPROVAL\\",\\"resolution\\":\\"部分不支持\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-12-01 21:06:57.086	2025-12-01 21:06:57.08	\N
cminn1f4u0006118z3gbwpg64	cmgxzbcqh0000hak2a2jt0wwa	SYSTEM	游戏争议通知	游戏"dispute"有新的争议："测试上传图片"	"{\\"disputeId\\":\\"cminn1f1k0001118zz6te0blh\\",\\"gameId\\":\\"cmimekf730098okexf0o0oww2\\",\\"gameTitle\\":\\"dispute\\",\\"disputeType\\":\\"RULE_VIOLATION\\"}"	f	{IN_APP}	NORMAL	t	2025-12-01 21:06:57.074	2025-12-01 21:05:11.646	\N
cminn3oh7000g118ztcb6qe6g	cmgxzbcqh0000hak2a2jt0wwa	SYSTEM	仲裁结果通知	@test789 发起的游戏"dispute"的争议"测试上传图片"已处理完成。处理结果：部分支持。	"{\\"disputeId\\":\\"cminn1f1k0001118zz6te0blh\\",\\"gameId\\":\\"cmimekf730098okexf0o0oww2\\",\\"gameTitle\\":\\"dispute\\",\\"decision\\":\\"PARTIAL_APPROVAL\\",\\"resolution\\":\\"部分不支持\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-12-01 21:06:57.074	2025-12-01 21:06:57.068	\N
cmio71c3f000e2nuk48lcus80	cmfhsxf490000lmmnwp77vl6x	EVIDENCE_REQUIRED	请提交证据	"再有问题骂AI" 挑战已结束，请在 12/2/2025 前提交证据	"{\\"gameId\\":\\"cmio6xbu900012nuky5o963vy\\",\\"gameTitle\\":\\"再有问题骂AI\\",\\"deadline\\":\\"2025-12-02T06:30:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-02 06:25:00.027	\N
cmio71c3f000f2nukh2hyg0mk	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"再有问题骂AI" 挑战已结束，请在 12/2/2025 前提交证据	"{\\"gameId\\":\\"cmio6xbu900012nuky5o963vy\\",\\"gameTitle\\":\\"再有问题骂AI\\",\\"deadline\\":\\"2025-12-02T06:30:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-02 06:25:00.027	\N
cmio8ux7n000gyuosfured8qb	cmfhsxf490000lmmnwp77vl6x	PEER_EVALUATION_STARTED	互评阶段开始	"测试业务逻辑" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmio8g4v70001yuosc61nzwfg\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-02 07:16:00.035	\N
cmio8ux7n000hyuosipf9lxex	cmhcegfin0006hcgendh83z40	PEER_EVALUATION_STARTED	互评阶段开始	"测试业务逻辑" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmio8g4v70001yuosc61nzwfg\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-02 07:16:00.035	\N
cmiorcdum000512yr0v8gz82u	cmfhsxf490000lmmnwp77vl6x	SYSTEM	游戏争议通知	游戏"测试业务逻辑"有新的争议："第二次争议"	"{\\"disputeId\\":\\"cmiorcdtm000112yrcrzjtye2\\",\\"gameId\\":\\"cmio8g4v70001yuosc61nzwfg\\",\\"gameTitle\\":\\"测试业务逻辑\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	f	{IN_APP}	NORMAL	t	2025-12-02 15:54:43.266	2025-12-02 15:53:27.838	\N
cmioryhta000t12yr0l7y6hp3	cmhcc8p1o000atqgxpzkeao00	SYSTEM	账户已被删除	您的账户已被管理员删除。原因：管理员删除	"{\\"reason\\":\\"管理员删除\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-12-02 16:10:39.415	2025-12-02 16:10:39.406	\N
cmhnbeu9d000tkw1jhd5tnefy	cmfhsxf490000lmmnwp77vl6x	EVIDENCE_REQUIRED	请提交证据	"创意项目完成111111" 挑战已结束，请在 11/6/2025 前提交证据	"{\\"gameId\\":\\"cmhnb891d000fkw1j09az9ccn\\",\\"gameTitle\\":\\"创意项目完成111111\\",\\"deadline\\":\\"2025-11-06T11:05:00.000Z\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-11-06 11:00:00.049	2025-11-30 11:47:52.873
cmiux23su000xnbfdllt6gqt0	cmgxfcw0d0000o777zhox72xw	GAME_COMPLETED	VIP购买成功	恭喜您成功购买undefined！享受VIP专属特权，有效期至1/5/2026。	\N	f	{IN_APP}	NORMAL	f	\N	2025-12-06 23:20:03.006	\N
cmio9d3cl000pyuos3rifd5i8	cmgxzbcqh0000hak2a2jt0wwa	SYSTEM	仲裁结果通知	@newbie 发起的游戏"每日运动挑战"的争议"sadfasdfas"已处理完成。处理结果：无需处理。	"{\\"disputeId\\":\\"cmhped730005ddvi6twf7pygz\\",\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"decision\\":\\"NO_ACTION_NEEDED\\",\\"resolution\\":\\"sf\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-12-02 07:30:07.808	2025-12-02 07:30:07.797	\N
cmim1m2jt0009t9hylr4of4vy	cmhcegfin0006hcgendh83z40	SYSTEM	账户已解封	您的账户已被解封，原因：管理员解封	"{\\"reason\\":\\"管理员解封\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-11-30 18:18:24.891	2025-11-30 18:17:37.386	\N
cmim1n376000et9hyia0vmgzx	cmhcegfin0006hcgendh83z40	SYSTEM	账户已解封	您的账户已被解封，原因：管理员解封	"{\\"reason\\":\\"管理员解封\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-11-30 18:18:24.891	2025-11-30 18:18:24.883	\N
cmim1tfvq0013t9hye57r4x5r	cmhcegfin0006hcgendh83z40	FRIEND_ACCEPTED	好友请求已接受	@testuser2 接受了您的好友请求	"{\\"addresseeUsername\\":\\"testuser2\\"}"	f	{IN_APP}	NORMAL	t	2025-11-30 18:23:21.264	2025-11-30 18:23:21.255	\N
cmim1th9m0017t9hyo0qzdnfx	cmh4rbv470000d3m0tokxkudd	FRIEND_ACCEPTED	好友请求已接受	@testuser2 接受了您的好友请求	"{\\"addresseeUsername\\":\\"testuser2\\"}"	f	{IN_APP}	NORMAL	t	2025-11-30 18:23:23.058	2025-11-30 18:23:23.05	\N
cmimiru8s001miaffb52y2glw	cmfgpklkn000114lt1n0ec61k	PEER_EVALUATION_STARTED	互评阶段开始	"test 3" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmimic9op000biaffodufnc10\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 02:18:00.028	\N
cmimiru8s001niaffjkkmhzf3	cmh36n1zs0005td07t6m368m7	PEER_EVALUATION_STARTED	互评阶段开始	"test 3" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmimic9op000biaffodufnc10\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 02:18:00.028	\N
cmimiru8s001oiaffoxao1v4q	cmhcegfin0006hcgendh83z40	PEER_EVALUATION_STARTED	互评阶段开始	"test 3" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmimic9op000biaffodufnc10\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 02:18:00.028	\N
cmio2cv9u000cqotccl013szb	cmfhsxf490000lmmnwp77vl6x	GAME_STARTED	挑战开始了！	"test dispute with OSS" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmio2a85k0001qotccs6so6mf\\",\\"gameTitle\\":\\"test dispute with OSS\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-02 04:14:00.018	\N
cmio2cv9u000dqotcsadfsl8y	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"test dispute with OSS" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmio2a85k0001qotccs6so6mf\\",\\"gameTitle\\":\\"test dispute with OSS\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-02 04:14:00.018	\N
cmio77rks000g2nukbr0w4b7l	cmfhsxf490000lmmnwp77vl6x	PEER_EVALUATION_STARTED	互评阶段开始	"再有问题骂AI" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmio6xbu900012nuky5o963vy\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-02 06:30:00.028	\N
cmio77rks000h2nuk209pftf0	cmhcegfin0006hcgendh83z40	PEER_EVALUATION_STARTED	互评阶段开始	"再有问题骂AI" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmio6xbu900012nuky5o963vy\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-02 06:30:00.028	\N
cmio9d3b8000lyuosypncg4j8	cmhc7jd8w0006x7g1c2qc46o4	SYSTEM	仲裁结果通知	@newbie 发起的游戏"每日运动挑战"的争议"sadfasdfas"已处理完成。处理结果：无需处理。	"{\\"disputeId\\":\\"cmhped730005ddvi6twf7pygz\\",\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"decision\\":\\"NO_ACTION_NEEDED\\",\\"resolution\\":\\"sf\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-12-02 07:30:07.769	2025-12-02 07:30:07.748	\N
cmio9d3c3000nyuos7u347ig0	cmh36n1zs0005td07t6m368m7	SYSTEM	仲裁结果通知	@newbie 发起的游戏"每日运动挑战"的争议"sadfasdfas"已处理完成。处理结果：无需处理。	"{\\"disputeId\\":\\"cmhped730005ddvi6twf7pygz\\",\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"decision\\":\\"NO_ACTION_NEEDED\\",\\"resolution\\":\\"sf\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-12-02 07:30:07.789	2025-12-02 07:30:07.779	\N
cmio9d3d2000ryuoszfdr89uj	cmfiilojw000ao5ubr1d3vfk0	SYSTEM	仲裁结果通知	@newbie 发起的游戏"每日运动挑战"的争议"sadfasdfas"已处理完成。处理结果：无需处理。	"{\\"disputeId\\":\\"cmhped730005ddvi6twf7pygz\\",\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"decision\\":\\"NO_ACTION_NEEDED\\",\\"resolution\\":\\"sf\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-12-02 07:30:07.822	2025-12-02 07:30:07.815	\N
cmio9d3dh000tyuos1jyx6omm	cmhcegfin0006hcgendh83z40	SYSTEM	仲裁结果通知	您发起的争议"sadfasdfas"已处理完成。处理结果：无需处理。sf	"{\\"disputeId\\":\\"cmhped730005ddvi6twf7pygz\\",\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"decision\\":\\"NO_ACTION_NEEDED\\",\\"resolution\\":\\"sf\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-12-02 07:30:07.839	2025-12-02 07:30:07.829	\N
cmio9d3dz000vyuosei0nihu7	cmfgpklkn000114lt1n0ec61k	SYSTEM	仲裁结果通知	@newbie 发起的游戏"每日运动挑战"的争议"sadfasdfas"已处理完成。处理结果：无需处理。	"{\\"disputeId\\":\\"cmhped730005ddvi6twf7pygz\\",\\"gameId\\":\\"cmhl7estf000172ste4gw6ufs\\",\\"gameTitle\\":\\"每日运动挑战\\",\\"decision\\":\\"NO_ACTION_NEEDED\\",\\"resolution\\":\\"sf\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-12-02 07:30:07.858	2025-12-02 07:30:07.847	\N
cmiorcw86000912yr8uqo06ga	cmfhsxf490000lmmnwp77vl6x	SYSTEM	仲裁结果通知	@newbie 发起的游戏"测试业务逻辑"的争议"第二次争议"已处理完成。处理结果：部分支持。	"{\\"disputeId\\":\\"cmiorcdtm000112yrcrzjtye2\\",\\"gameId\\":\\"cmio8g4v70001yuosc61nzwfg\\",\\"gameTitle\\":\\"测试业务逻辑\\",\\"decision\\":\\"PARTIAL_APPROVAL\\",\\"resolution\\":\\"烦了烦了\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-12-02 15:54:43.266	2025-12-02 15:53:51.655	\N
cmiorcw8q000b12yrw8fvaw57	cmhcegfin0006hcgendh83z40	SYSTEM	仲裁结果通知	您发起的争议"第二次争议"已处理完成。处理结果：部分支持。烦了烦了	"{\\"disputeId\\":\\"cmiorcdtm000112yrcrzjtye2\\",\\"gameId\\":\\"cmio8g4v70001yuosc61nzwfg\\",\\"gameTitle\\":\\"测试业务逻辑\\",\\"decision\\":\\"PARTIAL_APPROVAL\\",\\"resolution\\":\\"烦了烦了\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-12-02 15:54:43.279	2025-12-02 15:53:51.674	\N
cmiorywk6000v12yrpe4ed2mh	cmhc7jd8w0006x7g1c2qc46o4	SYSTEM	账户已恢复	您的账户已被管理员恢复。原因：管理员恢复	"{\\"reason\\":\\"管理员恢复\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-12-02 16:11:38.066	2025-12-02 16:10:58.518	\N
cmim0ij2c008m4hzvcdi0yvh6	cmh7b4pkq000wd3m04ocsbh45	SYSTEM	账户已被封禁	您的账户因"违规行为"被封禁永久	"{\\"reason\\":\\"违规行为\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-11-30 17:47:44.767	2025-11-30 17:46:52.549	\N
cmim1mboq000bt9hyyosphot1	cmhcegfin0006hcgendh83z40	SYSTEM	账户已被封禁	您的账户因"违规行为"被封禁永久	"{\\"reason\\":\\"违规行为\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-11-30 18:18:24.891	2025-11-30 18:17:49.227	\N
cmim1vvqy001bt9hyfk52r2l1	cmhc7jd8w0006x7g1c2qc46o4	SYSTEM	账户已被删除	您的账户已被管理员删除。原因：管理员删除	"{\\"reason\\":\\"管理员删除\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-11-30 18:25:15.144	2025-11-30 18:25:15.13	\N
cminfa3v6000fie6lt7i5nqmm	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"测试dispute" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cminf7h9d0004ie6l6wjx24r9\\",\\"gameTitle\\":\\"测试dispute\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 17:28:00.018	\N
cminfa3v6000gie6l7smhvs1w	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"测试dispute" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cminf7h9d0004ie6l6wjx24r9\\",\\"gameTitle\\":\\"测试dispute\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 17:28:00.018	\N
cmio2ffvj000eqotc0smpr60q	cmfhsxf490000lmmnwp77vl6x	EVIDENCE_REQUIRED	请提交证据	"test dispute with OSS" 挑战已结束，请在 12/2/2025 前提交证据	"{\\"gameId\\":\\"cmio2a85k0001qotccs6so6mf\\",\\"gameTitle\\":\\"test dispute with OSS\\",\\"deadline\\":\\"2025-12-02T04:20:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-02 04:16:00.032	\N
cmio2ffvj000fqotcewtcwfrt	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"test dispute with OSS" 挑战已结束，请在 12/2/2025 前提交证据	"{\\"gameId\\":\\"cmio2a85k0001qotccs6so6mf\\",\\"gameTitle\\":\\"test dispute with OSS\\",\\"deadline\\":\\"2025-12-02T04:20:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-02 04:16:00.032	\N
cmiordj3s000h12yrx9tp43wt	cmfhsxf490000lmmnwp77vl6x	SYSTEM	游戏争议通知	游戏"测试业务逻辑"有新的争议："第三次争议"	"{\\"disputeId\\":\\"cmiordj33000d12yrytej89ha\\",\\"gameId\\":\\"cmio8g4v70001yuosc61nzwfg\\",\\"gameTitle\\":\\"测试业务逻辑\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	f	{IN_APP}	NORMAL	t	2025-12-02 15:54:43.266	2025-12-02 15:54:21.304	\N
cmiorzr2i000x12yrd9zlz7eg	cmhc7jd8w0006x7g1c2qc46o4	SYSTEM	账户已被删除	您的账户已被管理员删除。原因：管理员删除	"{\\"reason\\":\\"管理员删除\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-12-02 16:11:38.066	2025-12-02 16:11:38.058	\N
cmio79glz00122nukccj7vgl3	cmfhsxf490000lmmnwp77vl6x	SYSTEM	游戏争议通知	游戏"再有问题骂AI"有新的争议："再有问题骂AI"	"{\\"disputeId\\":\\"cmio79g95000x2nuk9kytmjiz\\",\\"gameId\\":\\"cmio6xbu900012nuky5o963vy\\",\\"gameTitle\\":\\"再有问题骂AI\\",\\"disputeType\\":\\"HARASSMENT\\"}"	f	{IN_APP}	NORMAL	t	2025-12-02 06:35:34.982	2025-12-02 06:31:19.127	\N
cmio7b28p00172nukshrwvnbs	cmfhsxf490000lmmnwp77vl6x	SYSTEM	游戏争议通知	游戏"再有问题骂AI"有新的争议："再有问题骂AI"	"{\\"disputeId\\":\\"cmio7b1u200142nukn0c2czls\\",\\"gameId\\":\\"cmio6xbu900012nuky5o963vy\\",\\"gameTitle\\":\\"再有问题骂AI\\",\\"disputeType\\":\\"OTHER\\"}"	f	{IN_APP}	NORMAL	t	2025-12-02 06:35:34.982	2025-12-02 06:32:33.817	\N
cmioqmfz40019yuosv6jxi6na	cmfhsxf490000lmmnwp77vl6x	SYSTEM	游戏争议通知	游戏"测试业务逻辑"有新的争议："第一个用户发起的"	"{\\"disputeId\\":\\"cmioqmfy10015yuos84rsgoiz\\",\\"gameId\\":\\"cmio8g4v70001yuosc61nzwfg\\",\\"gameTitle\\":\\"测试业务逻辑\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	f	{IN_APP}	NORMAL	t	2025-12-02 15:35:10.662	2025-12-02 15:33:17.536	\N
cmim0jban008z4hzv9bu5458r	cmh7d0ay1000zd3m01yxn28f4	ACHIEVEMENT_UNLOCKED	🏆 成就解锁！	恭喜您解锁了成就：老用户	{"reward": {"points": {"type": "PARTICIPATION", "amount": 50}}, "achievementId": "cmgysofa7000610if9btp1t00", "achievementName": "老用户"}	f	{IN_APP}	NORMAL	f	\N	2025-11-30 17:47:29.136	\N
cmim0jncn00914hzvo5jxgs08	cmh7b4pkq000wd3m04ocsbh45	SYSTEM	账户已被删除	您的账户已被管理员删除。原因：管理员删除	"{\\"reason\\":\\"管理员删除\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-11-30 17:47:44.767	2025-11-30 17:47:44.759	\N
cmioqn1o3001fyuos57s2dpfo	cmhcegfin0006hcgendh83z40	SYSTEM	仲裁结果通知	您发起的争议"第一个用户发起的"已处理完成。处理结果：证据不足。第一个用户发起的	"{\\"disputeId\\":\\"cmioqmfy10015yuos84rsgoiz\\",\\"gameId\\":\\"cmio8g4v70001yuosc61nzwfg\\",\\"gameTitle\\":\\"测试业务逻辑\\",\\"decision\\":\\"INSUFFICIENT_EVIDENCE\\",\\"resolution\\":\\"第一个用户发起的\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-12-02 15:35:10.679	2025-12-02 15:33:45.652	\N
cmim1nahd000it9hyhznjw33q	cmh7d0ay1000zd3m01yxn28f4	SYSTEM	账户已解封	您的账户已被解封，原因：管理员解封	"{\\"reason\\":\\"管理员解封\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-11-30 18:19:29.052	2025-11-30 18:18:34.321	\N
cmimekf9j009iokexejkvxfdz	cmh4rbv470000d3m0tokxkudd	ACHIEVEMENT_UNLOCKED	🏆 成就解锁！	恭喜您解锁了成就：老用户	{"reward": {"points": {"type": "PARTICIPATION", "amount": 50}}, "achievementId": "cmgysofa7000610if9btp1t00", "achievementName": "老用户"}	f	{IN_APP}	NORMAL	f	\N	2025-12-01 00:20:15.559	\N
cmimemnv300a2okex8kte5vuf	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"dispute" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmimekf730098okexf0o0oww2\\",\\"gameTitle\\":\\"dispute\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 00:22:00.015	\N
cmimemnv300a3okex3gznm0zx	cmgxdqce80000108q18y4npo0	GAME_STARTED	挑战开始了！	"dispute" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmimekf730098okexf0o0oww2\\",\\"gameTitle\\":\\"dispute\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 00:22:00.015	\N
cmimemnv300a4okexah9di628	cmgxzbcqh0000hak2a2jt0wwa	GAME_STARTED	挑战开始了！	"dispute" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmimekf730098okexf0o0oww2\\",\\"gameTitle\\":\\"dispute\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 00:22:00.015	\N
cmimemnv300a5okexbmcu44xb	cmh4rbv470000d3m0tokxkudd	GAME_STARTED	挑战开始了！	"dispute" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmimekf730098okexf0o0oww2\\",\\"gameTitle\\":\\"dispute\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 00:22:00.015	\N
cminfcogs000hie6l3a3roj47	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"测试dispute" 挑战已结束，请在 12/1/2025 前提交证据	"{\\"gameId\\":\\"cminf7h9d0004ie6l6wjx24r9\\",\\"gameTitle\\":\\"测试dispute\\",\\"deadline\\":\\"2025-12-01T17:34:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 17:30:00.028	\N
cminfcogs000iie6lafzzu4i3	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"测试dispute" 挑战已结束，请在 12/1/2025 前提交证据	"{\\"gameId\\":\\"cminf7h9d0004ie6l6wjx24r9\\",\\"gameTitle\\":\\"测试dispute\\",\\"deadline\\":\\"2025-12-01T17:34:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 17:30:00.028	\N
cmio2kl20000gqotcq0zt1qrv	cmfhsxf490000lmmnwp77vl6x	PEER_EVALUATION_STARTED	互评阶段开始	"test dispute with OSS" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmio2a85k0001qotccs6so6mf\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-02 04:20:00.024	\N
cmio2kl20000hqotc3umr8ucm	cmhcegfin0006hcgendh83z40	PEER_EVALUATION_STARTED	互评阶段开始	"test dispute with OSS" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmio2a85k0001qotccs6so6mf\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-02 04:20:00.024	\N
cmio7ey0p001f2nukoa6eoq55	cmfhsxf490000lmmnwp77vl6x	SYSTEM	仲裁结果通知	@newbie 发起的游戏"再有问题骂AI"的争议"再有问题骂AI"已处理完成。处理结果：支持发起人。	"{\\"disputeId\\":\\"cmio7b1u200142nukn0c2czls\\",\\"gameId\\":\\"cmio6xbu900012nuky5o963vy\\",\\"gameTitle\\":\\"再有问题骂AI\\",\\"decision\\":\\"APPROVE_INITIATOR\\",\\"resolution\\":\\"撒地方\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-12-02 06:35:34.982	2025-12-02 06:35:34.969	\N
cmisrhdft000np50brc5bh7oe	cmgxfcw0d0000o777zhox72xw	ACHIEVEMENT_UNLOCKED	🏆 成就解锁！	恭喜您解锁了成就：老用户	{"reward": {"points": {"type": "PARTICIPATION", "amount": 50}}, "achievementId": "cmgysofa7000610if9btp1t00", "achievementName": "老用户"}	f	{IN_APP}	NORMAL	f	\N	2025-12-05 11:08:25.289	\N
cmio7ey1a001h2nukhtl82u9g	cmhcegfin0006hcgendh83z40	SYSTEM	仲裁结果通知	您发起的争议"再有问题骂AI"已处理完成。处理结果：支持发起人。撒地方	"{\\"disputeId\\":\\"cmio7b1u200142nukn0c2czls\\",\\"gameId\\":\\"cmio6xbu900012nuky5o963vy\\",\\"gameTitle\\":\\"再有问题骂AI\\",\\"decision\\":\\"APPROVE_INITIATOR\\",\\"resolution\\":\\"撒地方\\",\\"canRetry\\":false}"	t	{IN_APP}	NORMAL	t	2025-12-02 06:35:35	2025-12-02 06:35:34.991	2025-12-02 06:37:48.238
cmiore021000n12yrqyhndb2n	cmhcegfin0006hcgendh83z40	SYSTEM	仲裁结果通知	您发起的争议"第三次争议"已处理完成。处理结果：支持被申请人。第三次争议第三次争议	"{\\"disputeId\\":\\"cmiordj33000d12yrytej89ha\\",\\"gameId\\":\\"cmio8g4v70001yuosc61nzwfg\\",\\"gameTitle\\":\\"测试业务逻辑\\",\\"decision\\":\\"APPROVE_TARGET\\",\\"resolution\\":\\"第三次争议第三次争议\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-12-02 15:54:43.279	2025-12-02 15:54:43.273	\N
cmioqn1ne001dyuosda58s7t1	cmfhsxf490000lmmnwp77vl6x	SYSTEM	仲裁结果通知	@newbie 发起的游戏"测试业务逻辑"的争议"第一个用户发起的"已处理完成。处理结果：证据不足。	"{\\"disputeId\\":\\"cmioqmfy10015yuos84rsgoiz\\",\\"gameId\\":\\"cmio8g4v70001yuosc61nzwfg\\",\\"gameTitle\\":\\"测试业务逻辑\\",\\"decision\\":\\"INSUFFICIENT_EVIDENCE\\",\\"resolution\\":\\"第一个用户发起的\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-12-02 15:35:10.662	2025-12-02 15:33:45.627	\N
cmiore01m000l12yrl48s5jn4	cmfhsxf490000lmmnwp77vl6x	SYSTEM	仲裁结果通知	@newbie 发起的游戏"测试业务逻辑"的争议"第三次争议"已处理完成。处理结果：支持被申请人。	"{\\"disputeId\\":\\"cmiordj33000d12yrytej89ha\\",\\"gameId\\":\\"cmio8g4v70001yuosc61nzwfg\\",\\"gameTitle\\":\\"测试业务逻辑\\",\\"decision\\":\\"APPROVE_TARGET\\",\\"resolution\\":\\"第三次争议第三次争议\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-12-02 15:54:43.266	2025-12-02 15:54:43.258	\N
cmim0sehs009e4hzvo7b4e013	cmh7d0ay1000zd3m01yxn28f4	SYSTEM	账户已被封禁	您的账户因"违规行为"被封禁永久	"{\\"reason\\":\\"违规行为\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-11-30 17:54:36.693	2025-11-30 17:54:33.184	\N
cmim1ogpf000rt9hycrd9mgcm	cmh7d0ay1000zd3m01yxn28f4	SYSTEM	账户已被删除	您的账户已被管理员删除。原因：管理员删除	"{\\"reason\\":\\"管理员删除\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-11-30 18:19:29.052	2025-11-30 18:19:29.043	\N
cmimep8gm00a8okexpmhyg46t	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	请提交证据	"dispute" 挑战已结束，请在 12/1/2025 前提交证据	"{\\"gameId\\":\\"cmimekf730098okexf0o0oww2\\",\\"gameTitle\\":\\"dispute\\",\\"deadline\\":\\"2025-12-01T00:28:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 00:24:00.022	\N
cmimep8gm00a9okex54p08eb1	cmgxdqce80000108q18y4npo0	EVIDENCE_REQUIRED	请提交证据	"dispute" 挑战已结束，请在 12/1/2025 前提交证据	"{\\"gameId\\":\\"cmimekf730098okexf0o0oww2\\",\\"gameTitle\\":\\"dispute\\",\\"deadline\\":\\"2025-12-01T00:28:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 00:24:00.022	\N
cmimep8gm00aaokex5xthqmes	cmgxzbcqh0000hak2a2jt0wwa	EVIDENCE_REQUIRED	请提交证据	"dispute" 挑战已结束，请在 12/1/2025 前提交证据	"{\\"gameId\\":\\"cmimekf730098okexf0o0oww2\\",\\"gameTitle\\":\\"dispute\\",\\"deadline\\":\\"2025-12-01T00:28:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 00:24:00.022	\N
cmimep8gm00abokexljuyu7uo	cmh4rbv470000d3m0tokxkudd	EVIDENCE_REQUIRED	请提交证据	"dispute" 挑战已结束，请在 12/1/2025 前提交证据	"{\\"gameId\\":\\"cmimekf730098okexf0o0oww2\\",\\"gameTitle\\":\\"dispute\\",\\"deadline\\":\\"2025-12-01T00:28:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 00:24:00.022	\N
cmimeudn800agokexajm6rrnu	cmfgpklkn000114lt1n0ec61k	PEER_EVALUATION_STARTED	互评阶段开始	"dispute" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmimekf730098okexf0o0oww2\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 00:28:00.02	\N
cmimeudn800ahokex5d42nv40	cmgxdqce80000108q18y4npo0	PEER_EVALUATION_STARTED	互评阶段开始	"dispute" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmimekf730098okexf0o0oww2\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 00:28:00.02	\N
cmimeudn800aiokex4fcgdxq8	cmgxzbcqh0000hak2a2jt0wwa	PEER_EVALUATION_STARTED	互评阶段开始	"dispute" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmimekf730098okexf0o0oww2\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 00:28:00.02	\N
cmimeudn800ajokexg2t33pvi	cmh4rbv470000d3m0tokxkudd	PEER_EVALUATION_STARTED	互评阶段开始	"dispute" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmimekf730098okexf0o0oww2\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 00:28:00.02	\N
cminfhtnk000jie6l7rtc7ow6	cmfgpklkn000114lt1n0ec61k	PEER_EVALUATION_STARTED	互评阶段开始	"测试dispute" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cminf7h9d0004ie6l6wjx24r9\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 17:34:00.032	\N
cminfhtnk000kie6lhw022r7v	cmhcegfin0006hcgendh83z40	PEER_EVALUATION_STARTED	互评阶段开始	"测试dispute" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cminf7h9d0004ie6l6wjx24r9\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 17:34:00.032	\N
cmio2n1gk000zqotcsk7dwymf	cmhcegfin0006hcgendh83z40	SYSTEM	游戏争议通知	游戏"test dispute with OSS"有新的争议："测试上传文件"	"{\\"disputeId\\":\\"cmio2n1fh000vqotcxg3vejay\\",\\"gameId\\":\\"cmio2a85k0001qotccs6so6mf\\",\\"gameTitle\\":\\"test dispute with OSS\\",\\"disputeType\\":\\"TECHNICAL_ISSUE\\"}"	f	{IN_APP}	NORMAL	t	2025-12-02 04:21:54.605	2025-12-02 04:21:54.597	\N
cmio8i28m000cyuos5bsymiev	cmfhsxf490000lmmnwp77vl6x	GAME_STARTED	挑战开始了！	"测试业务逻辑" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmio8g4v70001yuosc61nzwfg\\",\\"gameTitle\\":\\"测试业务逻辑\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-02 07:06:00.023	\N
cmio8i28m000dyuosy0nrkdb9	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"测试业务逻辑" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmio8g4v70001yuosc61nzwfg\\",\\"gameTitle\\":\\"测试业务逻辑\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-02 07:06:00.023	\N
cmiory7j2000p12yryhxxdmn1	cmhcc8p1o000atqgxpzkeao00	SYSTEM	账户已被封禁	您的账户因"违规行为"被封禁永久	"{\\"reason\\":\\"违规行为\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-12-02 16:10:39.415	2025-12-02 16:10:26.078	\N
cmioqo6nt001kyuos0n2j1cn5	cmhcegfin0006hcgendh83z40	SYSTEM	游戏争议通知	游戏"测试业务逻辑"有新的争议："第二个用户发起的"	"{\\"disputeId\\":\\"cmioqo697001hyuosr3e4y7yc\\",\\"gameId\\":\\"cmio8g4v70001yuosc61nzwfg\\",\\"gameTitle\\":\\"测试业务逻辑\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	f	{IN_APP}	NORMAL	t	2025-12-02 15:35:10.679	2025-12-02 15:34:38.778	\N
cmim0sh6w009g4hzv8xwo67qh	cmh7d0ay1000zd3m01yxn28f4	SYSTEM	账户已解封	您的账户已被解封，原因：管理员解封	"{\\"reason\\":\\"管理员解封\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-11-30 17:54:36.693	2025-11-30 17:54:36.68	\N
cmim1pxar000wt9hynyfu7pqp	cmh24ml660003td0740yexg8h	SYSTEM	账户已被封禁	您的账户因"违规行为"被封禁永久	"{\\"reason\\":\\"违规行为\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-11-30 18:20:46.412	2025-11-30 18:20:37.203	\N
cmimihjv80010iaff9v4cb4fk	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	挑战开始了！	"test 3" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmimic9op000biaffodufnc10\\",\\"gameTitle\\":\\"test 3\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 02:10:00.02	\N
cmimihjv80011iaffg8oqjqtn	cmh36n1zs0005td07t6m368m7	GAME_STARTED	挑战开始了！	"test 3" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmimic9op000biaffodufnc10\\",\\"gameTitle\\":\\"test 3\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 02:10:00.02	\N
cmimihjv80012iaffy7j8lmm7	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"test 3" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmimic9op000biaffodufnc10\\",\\"gameTitle\\":\\"test 3\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-01 02:10:00.02	\N
cming5j6y0011ie6li5lu8hj5	cmhcegfin0006hcgendh83z40	SYSTEM	游戏争议通知	游戏"测试dispute"有新的争议："做的很艺术"	"{\\"disputeId\\":\\"cming5j5w000yie6lxoagk2hl\\",\\"gameId\\":\\"cminf7h9d0004ie6l6wjx24r9\\",\\"gameTitle\\":\\"测试dispute\\",\\"disputeType\\":\\"RULE_VIOLATION\\"}"	f	{IN_APP}	NORMAL	t	2025-12-01 17:52:26.227	2025-12-01 17:52:26.218	\N
cmio6yri0000c2nukc1irnmhi	cmfhsxf490000lmmnwp77vl6x	GAME_STARTED	挑战开始了！	"再有问题骂AI" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmio6xbu900012nuky5o963vy\\",\\"gameTitle\\":\\"再有问题骂AI\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-02 06:23:00.024	\N
cmio6yri0000d2nukst5wbm8i	cmhcegfin0006hcgendh83z40	GAME_STARTED	挑战开始了！	"再有问题骂AI" 挑战已经开始，快去参与吧！	"{\\"gameId\\":\\"cmio6xbu900012nuky5o963vy\\",\\"gameTitle\\":\\"再有问题骂AI\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-02 06:23:00.024	\N
cmio8kmuc000eyuos3wcu5a6s	cmfhsxf490000lmmnwp77vl6x	EVIDENCE_REQUIRED	请提交证据	"测试业务逻辑" 挑战已结束，请在 12/2/2025 前提交证据	"{\\"gameId\\":\\"cmio8g4v70001yuosc61nzwfg\\",\\"gameTitle\\":\\"测试业务逻辑\\",\\"deadline\\":\\"2025-12-02T07:16:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-02 07:08:00.036	\N
cmio8kmuc000fyuosfybj502v	cmhcegfin0006hcgendh83z40	EVIDENCE_REQUIRED	请提交证据	"测试业务逻辑" 挑战已结束，请在 12/2/2025 前提交证据	"{\\"gameId\\":\\"cmio8g4v70001yuosc61nzwfg\\",\\"gameTitle\\":\\"测试业务逻辑\\",\\"deadline\\":\\"2025-12-02T07:16:00.000Z\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-02 07:08:00.036	\N
cmioqov96001syuoser0en8p4	cmfhsxf490000lmmnwp77vl6x	SYSTEM	仲裁结果通知	您发起的争议"第二个用户发起的"已被驳回。处理结果：无效争议。第二个用户发起的 您还可以再发起 2 次仲裁。	"{\\"disputeId\\":\\"cmioqo697001hyuosr3e4y7yc\\",\\"gameId\\":\\"cmio8g4v70001yuosc61nzwfg\\",\\"gameTitle\\":\\"测试业务逻辑\\",\\"decision\\":\\"INVALID_DISPUTE\\",\\"resolution\\":\\"第二个用户发起的\\",\\"canRetry\\":true}"	f	{IN_APP}	NORMAL	t	2025-12-02 15:35:10.662	2025-12-02 15:35:10.65	\N
cmil1yq3y000nbbjuy3vbqwki	cmhcfohf30006dc0nyhcbivhr	SYSTEM	账户已被删除	您的账户已被管理员删除。原因：管理员删除	"{\\"reason\\":\\"管理员删除\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-11-30 01:39:41.626	2025-11-30 01:39:41.615	\N
cmioqov9q001uyuosjgu8obh1	cmhcegfin0006hcgendh83z40	SYSTEM	仲裁结果通知	@admin 发起的游戏"测试业务逻辑"的争议"第二个用户发起的"已处理完成。处理结果：无效争议。	"{\\"disputeId\\":\\"cmioqo697001hyuosr3e4y7yc\\",\\"gameId\\":\\"cmio8g4v70001yuosc61nzwfg\\",\\"gameTitle\\":\\"测试业务逻辑\\",\\"decision\\":\\"INVALID_DISPUTE\\",\\"resolution\\":\\"第二个用户发起的\\",\\"canRetry\\":false}"	f	{IN_APP}	NORMAL	t	2025-12-02 15:35:10.679	2025-12-02 15:35:10.671	\N
cmiory93w000r12yrhh4ks5s9	cmhcc8p1o000atqgxpzkeao00	SYSTEM	账户已解封	您的账户已被解封，原因：管理员解封	"{\\"reason\\":\\"管理员解封\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-12-02 16:10:39.415	2025-12-02 16:10:28.124	\N
cmisrtowg0011p50bmnptwgtl	cmgxfcw0d0000o777zhox72xw	GAME_STARTED	notifications.messages.gameStarted.title	notifications.messages.gameStarted.message	"{\\"gameId\\":\\"cmisrk0z1000pp50bcg4no9zl\\",\\"gameTitle\\":\\"Muscle Building Program\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-05 11:18:00.017	\N
cmisrtowg0010p50b2vpq6t3s	cmfhsxf490000lmmnwp77vl6x	GAME_STARTED	notifications.messages.gameStarted.title	notifications.messages.gameStarted.message	"{\\"gameId\\":\\"cmisrk0z1000pp50bcg4no9zl\\",\\"gameTitle\\":\\"Muscle Building Program\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-12-05 11:18:00.017	2025-12-05 11:30:26.36
cmitmleso000dh5o182pihma9	cmfgplidl000214ltrltpgf6s	FRIEND_REQUEST	notifications.messages.friendRequest.title	notifications.messages.friendRequest.message	"{\\"requesterUsername\\":\\"admin\\"}"	f	{IN_APP}	NORMAL	t	2025-12-06 01:39:21.775	2025-12-06 01:39:21.769	\N
cmitmlfkh000hh5o1rpd5ym6w	cmfgpjvmb000014ltuwk3uwht	FRIEND_REQUEST	notifications.messages.friendRequest.title	notifications.messages.friendRequest.message	"{\\"requesterUsername\\":\\"admin\\"}"	f	{IN_APP}	NORMAL	t	2025-12-06 01:39:22.775	2025-12-06 01:39:22.77	\N
cmitmlg69000lh5o1btr7qj64	cmh4rbv470000d3m0tokxkudd	FRIEND_REQUEST	notifications.messages.friendRequest.title	notifications.messages.friendRequest.message	"{\\"requesterUsername\\":\\"admin\\"}"	f	{IN_APP}	NORMAL	t	2025-12-06 01:39:23.559	2025-12-06 01:39:23.554	\N
cmiu789b2000inbfdeal2qwgx	cmfhsxf490000lmmnwp77vl6x	EVIDENCE_REQUIRED	notifications.messages.evidenceRequired.title	notifications.messages.evidenceRequired.message	"{\\"gameId\\":\\"cmiu71qmn0005nbfdtekrha9q\\",\\"gameTitle\\":\\"wwwwwwwwwwww\\",\\"deadline\\":\\"12/6/2025\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-06 11:17:00.062	\N
cmiu789b2000jnbfdsgbqmsug	cmgxfcw0d0000o777zhox72xw	EVIDENCE_REQUIRED	notifications.messages.evidenceRequired.title	notifications.messages.evidenceRequired.message	"{\\"gameId\\":\\"cmiu71qmn0005nbfdtekrha9q\\",\\"gameTitle\\":\\"wwwwwwwwwwww\\",\\"deadline\\":\\"12/6/2025\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-06 11:17:00.062	\N
cmiux3r51000znbfds1ayvflh	cmgxzbcqh0000hak2a2jt0wwa	FRIEND_ACCEPTED	notifications.messages.friendAccepted.title	notifications.messages.friendAccepted.message	"{\\"addresseeUsername\\":\\"admin\\"}"	f	{IN_APP}	NORMAL	t	2025-12-06 23:21:19.918	2025-12-06 23:21:19.909	\N
cmiv1knze0023nbfd7766c415	cmfgpklkn000114lt1n0ec61k	GAME_UNDER_REVIEW	游戏结果审核中	"arbitration page screenshot" 检测到异常，已进入仲裁窗口期。如有异议请发起争议。	"{\\"gameId\\":\\"cmiv0h59g0011nbfdm8kuzcgj\\",\\"reason\\":\\"fraud_detection\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-07 01:26:27.434	\N
cmiv1knze0024nbfdptvp20he	cmgxfcw0d0000o777zhox72xw	GAME_UNDER_REVIEW	游戏结果审核中	"arbitration page screenshot" 检测到异常，已进入仲裁窗口期。如有异议请发起争议。	"{\\"gameId\\":\\"cmiv0h59g0011nbfdm8kuzcgj\\",\\"reason\\":\\"fraud_detection\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-07 01:26:27.434	\N
cmisrw9iv0012p50bpbi28a93	cmfhsxf490000lmmnwp77vl6x	EVIDENCE_REQUIRED	notifications.messages.evidenceRequired.title	notifications.messages.evidenceRequired.message	"{\\"gameId\\":\\"cmisrk0z1000pp50bcg4no9zl\\",\\"gameTitle\\":\\"Muscle Building Program\\",\\"deadline\\":\\"12/5/2025\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-05 11:20:00.056	\N
cmiss2bpm0022p50ba4deb0gs	cmgxfcw0d0000o777zhox72xw	SYSTEM	游戏争议通知	游戏"Muscle Building Program"有新的争议："sdfdsafsd"	"{\\"disputeId\\":\\"cmiss2bg9001vp50b9ax06rft\\",\\"gameId\\":\\"cmisrk0z1000pp50bcg4no9zl\\",\\"gameTitle\\":\\"Muscle Building Program\\",\\"disputeType\\":\\"OTHER\\"}"	f	{IN_APP}	NORMAL	t	2025-12-05 11:24:42.835	2025-12-05 11:24:42.826	\N
cmisrw9iv0013p50bxxvvyz7n	cmgxfcw0d0000o777zhox72xw	EVIDENCE_REQUIRED	notifications.messages.evidenceRequired.title	notifications.messages.evidenceRequired.message	"{\\"gameId\\":\\"cmisrk0z1000pp50bcg4no9zl\\",\\"gameTitle\\":\\"Muscle Building Program\\",\\"deadline\\":\\"12/5/2025\\"}"	t	{IN_APP}	NORMAL	f	\N	2025-12-05 11:20:00.056	2025-12-06 00:26:17.667
cmitmlhdy000ph5o10y9zim7j	cmfhqhbdo001p8y89uh5fot7e	FRIEND_REQUEST	notifications.messages.friendRequest.title	notifications.messages.friendRequest.message	"{\\"requesterUsername\\":\\"admin\\"}"	f	{IN_APP}	NORMAL	t	2025-12-06 01:39:25.136	2025-12-06 01:39:25.126	\N
cmitmlhz3000th5o1m42rjqxj	cmfhqg9mg001k8y89kdji8pwn	FRIEND_REQUEST	notifications.messages.friendRequest.title	notifications.messages.friendRequest.message	"{\\"requesterUsername\\":\\"admin\\"}"	f	{IN_APP}	NORMAL	t	2025-12-06 01:39:25.894	2025-12-06 01:39:25.888	\N
cmiu7eord000knbfdyr8g6kk3	cmfhsxf490000lmmnwp77vl6x	PEER_EVALUATION_STARTED	互评阶段开始	"wwwwwwwwwwww" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmiu71qmn0005nbfdtekrha9q\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-06 11:22:00.025	\N
cmiu7eord000lnbfdi5v7zbz0	cmgxfcw0d0000o777zhox72xw	PEER_EVALUATION_STARTED	互评阶段开始	"wwwwwwwwwwww" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmiu71qmn0005nbfdtekrha9q\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-06 11:22:00.025	\N
cmiv0mn5c001inbfdab04m9rh	cmfgpklkn000114lt1n0ec61k	GAME_STARTED	notifications.messages.gameStarted.title	notifications.messages.gameStarted.message	"{\\"gameId\\":\\"cmiv0h59g0011nbfdm8kuzcgj\\",\\"gameTitle\\":\\"arbitration page screenshot\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-07 01:00:00.048	\N
cmiv0mn5c001jnbfdqys6n368	cmgxfcw0d0000o777zhox72xw	GAME_STARTED	notifications.messages.gameStarted.title	notifications.messages.gameStarted.message	"{\\"gameId\\":\\"cmiv0h59g0011nbfdm8kuzcgj\\",\\"gameTitle\\":\\"arbitration page screenshot\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-07 01:00:00.048	\N
cmiv0mn5c001knbfdvg00tz3r	cmgxzbcqh0000hak2a2jt0wwa	GAME_STARTED	notifications.messages.gameStarted.title	notifications.messages.gameStarted.message	"{\\"gameId\\":\\"cmiv0h59g0011nbfdm8kuzcgj\\",\\"gameTitle\\":\\"arbitration page screenshot\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-07 01:00:00.048	\N
cmiv0p7q0001lnbfdm57owvr6	cmfgpklkn000114lt1n0ec61k	EVIDENCE_REQUIRED	notifications.messages.evidenceRequired.title	notifications.messages.evidenceRequired.message	"{\\"gameId\\":\\"cmiv0h59g0011nbfdm8kuzcgj\\",\\"gameTitle\\":\\"arbitration page screenshot\\",\\"deadline\\":\\"12/7/2025\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-07 01:02:00.025	\N
cmiv0p7q1001mnbfdeog2csxw	cmgxfcw0d0000o777zhox72xw	EVIDENCE_REQUIRED	notifications.messages.evidenceRequired.title	notifications.messages.evidenceRequired.message	"{\\"gameId\\":\\"cmiv0h59g0011nbfdm8kuzcgj\\",\\"gameTitle\\":\\"arbitration page screenshot\\",\\"deadline\\":\\"12/7/2025\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-07 01:02:00.025	\N
cmiv0p7q1001nnbfdblch16q3	cmgxzbcqh0000hak2a2jt0wwa	EVIDENCE_REQUIRED	notifications.messages.evidenceRequired.title	notifications.messages.evidenceRequired.message	"{\\"gameId\\":\\"cmiv0h59g0011nbfdm8kuzcgj\\",\\"gameTitle\\":\\"arbitration page screenshot\\",\\"deadline\\":\\"12/7/2025\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-07 01:02:00.025	\N
cmiv1knze0025nbfdfczvgpkz	cmgxzbcqh0000hak2a2jt0wwa	GAME_UNDER_REVIEW	游戏结果审核中	"arbitration page screenshot" 检测到异常，已进入仲裁窗口期。如有异议请发起争议。	"{\\"gameId\\":\\"cmiv0h59g0011nbfdm8kuzcgj\\",\\"reason\\":\\"fraud_detection\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-07 01:26:27.434	\N
cmiv1lpgj002cnbfdzlwxoec4	cmfgpklkn000114lt1n0ec61k	SYSTEM	notifications.messages.disputeCreated.title	notifications.messages.disputeCreated.message	"{\\"disputeId\\":\\"cmiv1lp430027nbfdheaska2y\\",\\"gameId\\":\\"cmiv0h59g0011nbfdm8kuzcgj\\",\\"gameTitle\\":\\"arbitration page screenshot\\",\\"disputeTitle\\":\\"arbitration page test\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	f	{IN_APP}	NORMAL	t	2025-12-07 01:27:16.011	2025-12-07 01:27:16.003	\N
cmiv1lpgy002enbfddl7q6159	cmgxfcw0d0000o777zhox72xw	SYSTEM	notifications.messages.disputeCreated.title	notifications.messages.disputeCreated.message	"{\\"disputeId\\":\\"cmiv1lp430027nbfdheaska2y\\",\\"gameId\\":\\"cmiv0h59g0011nbfdm8kuzcgj\\",\\"gameTitle\\":\\"arbitration page screenshot\\",\\"disputeTitle\\":\\"arbitration page test\\",\\"disputeType\\":\\"EVIDENCE_DISPUTE\\"}"	f	{IN_APP}	NORMAL	t	2025-12-07 01:27:16.025	2025-12-07 01:27:16.018	\N
cmiv32saa002pnbfdo3z64i7l	cmiv2q81u002lnbfd2rx5l615	SYSTEM	账户已被封禁	您的账户因"违规行为"被封禁永久	"{\\"reason\\":\\"违规行为\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-12-07 02:08:42.174	2025-12-07 02:08:32.434	\N
cmiv32zso002tnbfdl1twqxtb	cmiv2q81u002lnbfd2rx5l615	SYSTEM	账户已被删除	您的账户已被管理员删除。原因：管理员删除	"{\\"reason\\":\\"管理员删除\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-12-07 02:08:42.174	2025-12-07 02:08:42.169	\N
cmiv5syq60001plufo0fsfmlk	cmgxzbcqh0000hak2a2jt0wwa	GAME_COMPLETED	notifications.messages.vipPurchased.title	notifications.messages.vipPurchased.message	{"expiresAt": "1/6/2026"}	f	{IN_APP}	NORMAL	f	\N	2025-12-07 03:24:53.07	\N
cmiu75oou000gnbfd0ubq06gn	cmfhsxf490000lmmnwp77vl6x	GAME_STARTED	notifications.messages.gameStarted.title	notifications.messages.gameStarted.message	"{\\"gameId\\":\\"cmiu71qmn0005nbfdtekrha9q\\",\\"gameTitle\\":\\"wwwwwwwwwwww\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-06 11:15:00.03	\N
cmiu75oou000hnbfd21uxjfj0	cmgxfcw0d0000o777zhox72xw	GAME_STARTED	notifications.messages.gameStarted.title	notifications.messages.gameStarted.message	"{\\"gameId\\":\\"cmiu71qmn0005nbfdtekrha9q\\",\\"gameTitle\\":\\"wwwwwwwwwwww\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-06 11:15:00.03	\N
cmiux1f5o000tnbfd7vl2a1fn	cmfhsxf490000lmmnwp77vl6x	FRIEND_REQUEST	notifications.messages.friendRequest.title	notifications.messages.friendRequest.message	"{\\"requesterUsername\\":\\"domaintest001\\"}"	f	{IN_APP}	NORMAL	t	2025-12-06 23:19:31.081	2025-12-06 23:19:31.068	\N
cmiux1ph0000vnbfda0bj1htm	cmgxzbcqh0000hak2a2jt0wwa	GAME_COMPLETED	VIP购买成功	恭喜您成功购买undefined！享受VIP专属特权，有效期至1/5/2026。	\N	f	{IN_APP}	NORMAL	f	\N	2025-12-06 23:19:44.436	\N
cmiv0t2m2001onbfdu3r6a6sj	cmfgpklkn000114lt1n0ec61k	PEER_EVALUATION_STARTED	互评阶段开始	"arbitration page screenshot" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmiv0h59g0011nbfdm8kuzcgj\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-07 01:05:00.026	\N
cmiv0t2m2001pnbfd2jd6g6wk	cmgxfcw0d0000o777zhox72xw	PEER_EVALUATION_STARTED	互评阶段开始	"arbitration page screenshot" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmiv0h59g0011nbfdm8kuzcgj\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-07 01:05:00.026	\N
cmiv0t2m2001qnbfdwdhla2ad	cmgxzbcqh0000hak2a2jt0wwa	PEER_EVALUATION_STARTED	互评阶段开始	"arbitration page screenshot" 进入互评阶段，请对其他参与者的证据进行评价。	"{\\"gameId\\":\\"cmiv0h59g0011nbfdm8kuzcgj\\"}"	f	{IN_APP}	NORMAL	f	\N	2025-12-07 01:05:00.026	\N
cmiv230fh002gnbfdtmb8p7b0	cmgxzbcqh0000hak2a2jt0wwa	GAME_COMPLETED	VIP购买成功	恭喜您成功购买undefined！享受VIP专属特权，有效期至1/6/2026。	\N	f	{IN_APP}	NORMAL	f	\N	2025-12-07 01:40:43.373	\N
cmiv32tpm002rnbfdxdvdj741	cmiv2q81u002lnbfd2rx5l615	SYSTEM	账户已解封	您的账户已被解封，原因：管理员解封	"{\\"reason\\":\\"管理员解封\\",\\"adminId\\":\\"cmfhsxf490000lmmnwp77vl6x\\"}"	f	{IN_APP}	NORMAL	t	2025-12-07 02:08:42.174	2025-12-07 02:08:34.282	\N
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.password_reset_tokens (id, user_id, token, expires_at, used, created_at) FROM stdin;
cmip5jwrt0003pyvku9aupv3m	cmh36n1zs0005td07t6m368m7	b8bb7674edf98ca33bba657c5d643a202d95f6f67508bf4bcf515742294dd590	2025-12-03 22:31:13.575	f	2025-12-02 22:31:13.578
cmip5j3pq0001pyvkeuz94zyz	cmgxfcw0d0000o777zhox72xw	64cc5cb2cbea391ade3d14eb6ac835802b1947fc452986c9707e9c559b987fab	2025-12-03 22:30:35.914	t	2025-12-02 22:30:35.919
cmip68t9g0001qqmw31o66gyo	cmgxfcw0d0000o777zhox72xw	6d4b55294b0b1d524e850bb6a8cc23e8f7e1f0bd1451e3c7fa3931b4162c7ffe	2025-12-03 22:50:35.422	f	2025-12-02 22:50:35.428
cmiu4mmgq0001nbfdz88sn4d1	cmgxzbcqh0000hak2a2jt0wwa	65fdaa0d4cc92802f3c94c172cdc6ea1fc1b477a5a803bcdcfb12226dfe2e403	2025-12-07 10:04:11.444	t	2025-12-06 10:04:11.45
\.


--
-- Data for Name: peer_evaluations; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.peer_evaluations (id, game_id, evaluator_id, evaluated_id, evaluation, reasoning, status, dispute_deadline, disputed_at, created_at) FROM stdin;
cmfik6i94000bst75kp845o4f	cmfhqcmch000p8y89n79410wa	cmfhqg9mg001k8y89kdji8pwn	cmfhqhbdo001p8y89uh5fot7e	RECOGNIZE	\N	ACTIVE	\N	\N	2025-09-13 17:47:12.232
cmfik6l4h000dst7523tymtcs	cmfhqcmch000p8y89n79410wa	cmfhqg9mg001k8y89kdji8pwn	cmfgplidl000214ltrltpgf6s	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-09-13 17:47:15.953
cmfik6p72000fst75pplj7454	cmfhqcmch000p8y89n79410wa	cmfhqg9mg001k8y89kdji8pwn	cmfgpmfbo000314ltz0jj7n1y	RECOGNIZE	\N	ACTIVE	\N	\N	2025-09-13 17:47:21.23
cmfik6sjk000hst75ild3901d	cmfhqcmch000p8y89n79410wa	cmfhqg9mg001k8y89kdji8pwn	cmfgpklkn000114lt1n0ec61k	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-09-13 17:47:25.568
cmha8l36z000g117ukonzyzrp	cmh7d62rh0013d3m0dz4vmtub	cmfgpklkn000114lt1n0ec61k	cmh4rbv470000d3m0tokxkudd	RECOGNIZE	\N	ACTIVE	\N	\N	2025-10-28 07:19:52.427
cmhigpsv7000s141v3knxkohg	cmhig5a250003141vy1jnjkhu	cmfgpklkn000114lt1n0ec61k	cmh36n1zs0005td07t6m368m7	RECOGNIZE	撒旦飞洒	ACTIVE	\N	\N	2025-11-03 01:29:38.659
cmhigpwq4000u141vj3d1dwse	cmhig5a250003141vy1jnjkhu	cmfgpklkn000114lt1n0ec61k	cmhc7jd8w0006x7g1c2qc46o4	RECOGNIZE	第三得分点	ACTIVE	\N	\N	2025-11-03 01:29:43.66
cmhigqncq000w141vx1sdi2o2	cmhig5a250003141vy1jnjkhu	cmhc7jd8w0006x7g1c2qc46o4	cmfgpklkn000114lt1n0ec61k	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-03 01:30:18.171
cmhigsaug000y141vojglryh2	cmhig5a250003141vy1jnjkhu	cmhc7jd8w0006x7g1c2qc46o4	cmh36n1zs0005td07t6m368m7	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-03 01:31:35.272
cmhigtkav0010141vdszin1i5	cmhig5a250003141vy1jnjkhu	cmh36n1zs0005td07t6m368m7	cmhc7jd8w0006x7g1c2qc46o4	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-03 01:32:34.183
cmhigtlsf0012141vm6ex3m12	cmhig5a250003141vy1jnjkhu	cmh36n1zs0005td07t6m368m7	cmfgpklkn000114lt1n0ec61k	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-03 01:32:36.111
cmhipbala001t1lqozzo9ngko	cmhioy1cc00171lqofc2l8wzh	cmfgpklkn000114lt1n0ec61k	cmhc7jd8w0006x7g1c2qc46o4	NOT_RECOGNIZE	很可爱	ACTIVE	\N	\N	2025-11-03 05:30:18.334
cmhipc8r2001v1lqo5g5qgwjv	cmhioy1cc00171lqofc2l8wzh	cmhc7jd8w0006x7g1c2qc46o4	cmfgpklkn000114lt1n0ec61k	RECOGNIZE	很专业	ACTIVE	\N	\N	2025-11-03 05:31:02.607
cmhirkk1g002t1lqovt5c7wu9	cmhipj6ev002d1lqogsziidg6	cmfgpklkn000114lt1n0ec61k	cmhc7jd8w0006x7g1c2qc46o4	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-03 06:33:29.716
cmhji76ew000t117awidkpkgt	cmhjgzgq20001117aa962fuhz	cmfgpklkn000114lt1n0ec61k	cmhcegfin0006hcgendh83z40	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-03 18:58:55.16
cmhjjogrf000hc344fzt6poy9	cmhjiptsm0001c3444oz0v7qf	cmfgpklkn000114lt1n0ec61k	cmhcegfin0006hcgendh83z40	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-03 19:40:21.339
cmhjjotb9000jc3442xt2wn4c	cmhjiptsm0001c3444oz0v7qf	cmhcegfin0006hcgendh83z40	cmfgpklkn000114lt1n0ec61k	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-03 19:40:37.606
cmhjvy59e000n9i0quozihnkn	cmhjvpkrz00019i0qdft4463a	cmhcegfin0006hcgendh83z40	cmgxdqce80000108q18y4npo0	NOT_RECOGNIZE	s大法	ACTIVE	\N	\N	2025-11-04 01:23:48.386
cmhjvyi8m000p9i0qayp2s8fh	cmhjvpkrz00019i0qdft4463a	cmgxdqce80000108q18y4npo0	cmhcegfin0006hcgendh83z40	RECOGNIZE	撒打发暗示	ACTIVE	\N	\N	2025-11-04 01:24:05.207
cmhjwq5hd001n9i0qqavqc4cx	cmhjwgmd300179i0qimtlfz3o	cmhcegfin0006hcgendh83z40	cmh36n1zs0005td07t6m368m7	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-04 01:45:35.041
cmhjwqn8s001p9i0qwhttd6bz	cmhjwgmd300179i0qimtlfz3o	cmh36n1zs0005td07t6m368m7	cmhcegfin0006hcgendh83z40	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-04 01:45:58.06
cmhk76pv10001p1dn2sqrjajs	cmhjgzgq20001117aa962fuhz	cmhcegfin0006hcgendh83z40	cmfgpklkn000114lt1n0ec61k	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-04 06:38:24.109
cmhk7ietw0017p1dnt750sjb6	cmhk7abeh000rp1dn46fy94jn	cmhcegfin0006hcgendh83z40	cmfgpklkn000114lt1n0ec61k	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-04 06:47:29.685
cmhk7irg70019p1dnwhympbqq	cmhk7abeh000rp1dn46fy94jn	cmfgpklkn000114lt1n0ec61k	cmhcegfin0006hcgendh83z40	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-04 06:47:46.04
cmhl25p0o001cqg34dscnxcy0	cmhl1uacq000nqg34wu04xwvn	cmhcegfin0006hcgendh83z40	cmh36n1zs0005td07t6m368m7	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-04 21:05:24.456
cmhl25qnp001eqg34givc47yb	cmhl1uacq000nqg34wu04xwvn	cmhcegfin0006hcgendh83z40	cmfgpklkn000114lt1n0ec61k	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-04 21:05:26.581
cmhl267vr001gqg34ne273rw1	cmhl1uacq000nqg34wu04xwvn	cmh36n1zs0005td07t6m368m7	cmhcegfin0006hcgendh83z40	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-04 21:05:48.904
cmhl26tb9001iqg34u6w79iup	cmhl1uacq000nqg34wu04xwvn	cmfgpklkn000114lt1n0ec61k	cmhcegfin0006hcgendh83z40	RECOGNIZE	啊手动阀啊手动阀暗示的	ACTIVE	\N	\N	2025-11-04 21:06:16.677
cmhl26usy001kqg347ht7bacx	cmhl1uacq000nqg34wu04xwvn	cmfgpklkn000114lt1n0ec61k	cmh36n1zs0005td07t6m368m7	NOT_RECOGNIZE	啊手动阀啊手动阀暗示的	ACTIVE	\N	\N	2025-11-04 21:06:18.61
cmhl94cwr001v72sthufa0c6h	cmhl7estf000172ste4gw6ufs	cmhcegfin0006hcgendh83z40	cmfgpklkn000114lt1n0ec61k	RECOGNIZE	撒旦飞洒地方撒旦飞洒范德萨范德萨分撒旦飞洒大	ACTIVE	\N	\N	2025-11-05 00:20:19.419
cmhl9w1eg002l72stkurb01n0	cmhl9juw3001x72st1a9aci7j	cmfiilojw000ao5ubr1d3vfk0	cmhcegfin0006hcgendh83z40	RECOGNIZE	顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶	ACTIVE	\N	\N	2025-11-05 00:41:50.873
cmhl9w44t002n72stabts5rhh	cmhl9juw3001x72st1a9aci7j	cmfiilojw000ao5ubr1d3vfk0	cmgxdqce80000108q18y4npo0	RECOGNIZE	顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶	ACTIVE	\N	\N	2025-11-05 00:41:54.413
cmhl9wy70002p72stjm7h7fq8	cmhl9juw3001x72st1a9aci7j	cmhcegfin0006hcgendh83z40	cmgxdqce80000108q18y4npo0	RECOGNIZE	顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶	ACTIVE	\N	\N	2025-11-05 00:42:33.372
cmhl9x00q002r72st10a8f2sm	cmhl9juw3001x72st1a9aci7j	cmhcegfin0006hcgendh83z40	cmfiilojw000ao5ubr1d3vfk0	NOT_RECOGNIZE	顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶	ACTIVE	\N	\N	2025-11-05 00:42:35.738
cmhl9zn75002t72st31cdzfae	cmhl9juw3001x72st1a9aci7j	cmgxdqce80000108q18y4npo0	cmhcegfin0006hcgendh83z40	RECOGNIZE	顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶	ACTIVE	\N	\N	2025-11-05 00:44:39.089
cmhl9zqn9002v72stedt8g02w	cmhl9juw3001x72st1a9aci7j	cmgxdqce80000108q18y4npo0	cmfiilojw000ao5ubr1d3vfk0	NOT_RECOGNIZE	顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶	ACTIVE	\N	\N	2025-11-05 00:44:43.557
cmhlbu95z0003hru4l82el30z	cmhlbnrhr004672stj3oz6a8s	cmhcegfin0006hcgendh83z40	cmh36n1zs0005td07t6m368m7	RECOGNIZE	nice girl	ACTIVE	\N	\N	2025-11-05 01:36:26.855
cmhlbuo4t0005hru4y9r7now7	cmhlbnrhr004672stj3oz6a8s	cmh36n1zs0005td07t6m368m7	cmhcegfin0006hcgendh83z40	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-05 01:36:46.254
cmhlg4i7c001shru4dxwc5tlk	cmhlfwbp9001chru4iqqmzmtt	cmh36n1zs0005td07t6m368m7	cmgxdqce80000108q18y4npo0	RECOGNIZE	通知通知	ACTIVE	\N	\N	2025-11-05 03:36:23.593
cmhlg581i001uhru4okgi3u6f	cmhlfwbp9001chru4iqqmzmtt	cmgxdqce80000108q18y4npo0	cmh36n1zs0005td07t6m368m7	RECOGNIZE	还是没通知啊	ACTIVE	\N	\N	2025-11-05 03:36:57.079
cmhlgi0ci000htnfempprqefx	cmhlg9nxr0001tnfeswd6oimc	cmh36n1zs0005td07t6m368m7	cmgxdqce80000108q18y4npo0	RECOGNIZE	通知	ACTIVE	\N	\N	2025-11-05 03:46:53.635
cmhlgiddo000ntnfe85mwzu21	cmhlg9nxr0001tnfeswd6oimc	cmgxdqce80000108q18y4npo0	cmh36n1zs0005td07t6m368m7	NOT_RECOGNIZE	通知通知	ACTIVE	\N	\N	2025-11-05 03:47:10.524
cmhmi61ci000xh5w4e60fnhek	cmhmhl67p0001h5w42mdl7qi1	cmfgpklkn000114lt1n0ec61k	cmhcegfin0006hcgendh83z40	RECOGNIZE	的说法	ACTIVE	\N	\N	2025-11-05 21:21:20.466
cmhmi65ad0011h5w41olf5e2b	cmhmhl67p0001h5w42mdl7qi1	cmfgpklkn000114lt1n0ec61k	cmh36n1zs0005td07t6m368m7	NOT_RECOGNIZE	撒打发	ACTIVE	\N	\N	2025-11-05 21:21:25.573
cmhmi684t0015h5w4baios3e3	cmhmhl67p0001h5w42mdl7qi1	cmfgpklkn000114lt1n0ec61k	cmhc7jd8w0006x7g1c2qc46o4	RECOGNIZE	撒旦	ACTIVE	\N	\N	2025-11-05 21:21:29.262
cmhn7b55e0008js8q0klh7pmf	cmhn6r2ft0001p0dyvc3096qy	cmh8axnya000me17r1py1t2xm	cmhcegfin0006hcgendh83z40	RECOGNIZE	士大夫撒撒反对	ACTIVE	\N	\N	2025-11-06 09:05:09.074
cmhn7ba35000ajs8q8zh8ilfd	cmhn6r2ft0001p0dyvc3096qy	cmh8axnya000me17r1py1t2xm	cmfhsxf490000lmmnwp77vl6x	RECOGNIZE	admin	ACTIVE	\N	\N	2025-11-06 09:05:15.473
cmhn7bej1000cjs8qnnjhg34c	cmhn6r2ft0001p0dyvc3096qy	cmh8axnya000me17r1py1t2xm	cmh36n1zs0005td07t6m368m7	NOT_RECOGNIZE	士大夫撒撒反对	ACTIVE	\N	\N	2025-11-06 09:05:21.229
cmhn7bo48000ejs8qcbdbf94j	cmhn6r2ft0001p0dyvc3096qy	cmh8axnya000me17r1py1t2xm	cmgxdqce80000108q18y4npo0	RECOGNIZE	士大夫撒撒反对士大夫撒撒反对士大夫撒撒反对士大夫撒撒反对	ACTIVE	\N	\N	2025-11-06 09:05:33.657
cmhn7btp8000gjs8q0r2ifqp6	cmhn6r2ft0001p0dyvc3096qy	cmh8axnya000me17r1py1t2xm	cmgxzbcqh0000hak2a2jt0wwa	NOT_RECOGNIZE		ACTIVE	\N	\N	2025-11-06 09:05:40.892
cmhn7bx5s000ijs8q3ptenacb	cmhn6r2ft0001p0dyvc3096qy	cmh8axnya000me17r1py1t2xm	cmfgpklkn000114lt1n0ec61k	RECOGNIZE	 	ACTIVE	\N	\N	2025-11-06 09:05:45.376
cmhn7dg2g000kjs8qqmrj48hl	cmhn6r2ft0001p0dyvc3096qy	cmfhsxf490000lmmnwp77vl6x	cmhcegfin0006hcgendh83z40	NOT_RECOGNIZE	算法的发生放大撒旦发	ACTIVE	\N	\N	2025-11-06 09:06:56.536
cmhn7diyi000mjs8qrfx5gd18	cmhn6r2ft0001p0dyvc3096qy	cmfhsxf490000lmmnwp77vl6x	cmh36n1zs0005td07t6m368m7	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:07:00.283
cmhn7drof000qjs8qk8qwavqy	cmhn6r2ft0001p0dyvc3096qy	cmfhsxf490000lmmnwp77vl6x	cmgxzbcqh0000hak2a2jt0wwa	RECOGNIZE	阿萨的飞洒	ACTIVE	\N	\N	2025-11-06 09:07:11.583
cmhn7do4e000ojs8qbs45ypxu	cmhn6r2ft0001p0dyvc3096qy	cmfhsxf490000lmmnwp77vl6x	cmgxdqce80000108q18y4npo0	RECOGNIZE	s阿道夫阿迪斯飞洒	ACTIVE	\N	\N	2025-11-06 09:07:06.975
cmhn7dvke000sjs8qk97aakkj	cmhn6r2ft0001p0dyvc3096qy	cmfhsxf490000lmmnwp77vl6x	cmfgpklkn000114lt1n0ec61k	RECOGNIZE	撒旦飞洒暗示	ACTIVE	\N	\N	2025-11-06 09:07:16.622
cmhn7e61k000ujs8qxhsz56k5	cmhn6r2ft0001p0dyvc3096qy	cmfhsxf490000lmmnwp77vl6x	cmh8axnya000me17r1py1t2xm	NOT_RECOGNIZE	怕马屁	ACTIVE	\N	\N	2025-11-06 09:07:30.2
cmhn7em00000wjs8qun5wrhei	cmhn6r2ft0001p0dyvc3096qy	cmh36n1zs0005td07t6m368m7	cmhcegfin0006hcgendh83z40	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:07:50.88
cmhn7esci000yjs8qu1z5aviq	cmhn6r2ft0001p0dyvc3096qy	cmh36n1zs0005td07t6m368m7	cmfhsxf490000lmmnwp77vl6x	RECOGNIZE	拍马屁	ACTIVE	\N	\N	2025-11-06 09:07:59.107
cmhn7eudc0010js8q0oi1aaef	cmhn6r2ft0001p0dyvc3096qy	cmh36n1zs0005td07t6m368m7	cmgxdqce80000108q18y4npo0	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:08:01.728
cmhn7ewic0012js8qmh45k5nb	cmhn6r2ft0001p0dyvc3096qy	cmh36n1zs0005td07t6m368m7	cmgxzbcqh0000hak2a2jt0wwa	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:08:04.5
cmhn7ey010014js8qhyixegj1	cmhn6r2ft0001p0dyvc3096qy	cmh36n1zs0005td07t6m368m7	cmfgpklkn000114lt1n0ec61k	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:08:06.433
cmhn7ezu20016js8qq68hu75c	cmhn6r2ft0001p0dyvc3096qy	cmh36n1zs0005td07t6m368m7	cmh8axnya000me17r1py1t2xm	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:08:08.811
cmhn7far70018js8qzhnsqy99	cmhn6r2ft0001p0dyvc3096qy	cmgxzbcqh0000hak2a2jt0wwa	cmhcegfin0006hcgendh83z40	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:08:22.964
cmhn7fck4001ajs8qo2hec5r9	cmhn6r2ft0001p0dyvc3096qy	cmgxzbcqh0000hak2a2jt0wwa	cmfhsxf490000lmmnwp77vl6x	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:08:25.3
cmhn7fevw001cjs8qubrj4psw	cmhn6r2ft0001p0dyvc3096qy	cmgxzbcqh0000hak2a2jt0wwa	cmh36n1zs0005td07t6m368m7	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:08:28.316
cmhn7fgse001ejs8qyk9a86ym	cmhn6r2ft0001p0dyvc3096qy	cmgxzbcqh0000hak2a2jt0wwa	cmgxdqce80000108q18y4npo0	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:08:30.782
cmhn7fjd3001gjs8qb9yplu96	cmhn6r2ft0001p0dyvc3096qy	cmgxzbcqh0000hak2a2jt0wwa	cmfgpklkn000114lt1n0ec61k	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:08:34.119
cmhn7fmto001ijs8qe81ibwqj	cmhn6r2ft0001p0dyvc3096qy	cmgxzbcqh0000hak2a2jt0wwa	cmh8axnya000me17r1py1t2xm	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:08:38.604
cmhn7fyvk001kjs8q4z3gjtd4	cmhn6r2ft0001p0dyvc3096qy	cmhcegfin0006hcgendh83z40	cmfhsxf490000lmmnwp77vl6x	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:08:54.225
cmhn7g15e001mjs8ql7oj516r	cmhn6r2ft0001p0dyvc3096qy	cmhcegfin0006hcgendh83z40	cmh36n1zs0005td07t6m368m7	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:08:57.171
cmhn7g4lj001ojs8q7hz3r7sk	cmhn6r2ft0001p0dyvc3096qy	cmhcegfin0006hcgendh83z40	cmgxdqce80000108q18y4npo0	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:09:01.64
cmhn7g78t001qjs8q0d0x0cat	cmhn6r2ft0001p0dyvc3096qy	cmhcegfin0006hcgendh83z40	cmgxzbcqh0000hak2a2jt0wwa	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:09:05.07
cmhn7g9o6001sjs8qvu3ictaw	cmhn6r2ft0001p0dyvc3096qy	cmhcegfin0006hcgendh83z40	cmfgpklkn000114lt1n0ec61k	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:09:08.215
cmhn7gj0i001ujs8qaf135yt7	cmhn6r2ft0001p0dyvc3096qy	cmhcegfin0006hcgendh83z40	cmh8axnya000me17r1py1t2xm	RECOGNIZE	撒打发撒旦发范德萨	ACTIVE	\N	\N	2025-11-06 09:09:20.322
cmhn7hc3q001wjs8qp246dxog	cmhn6r2ft0001p0dyvc3096qy	cmgxdqce80000108q18y4npo0	cmhcegfin0006hcgendh83z40	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:09:58.022
cmhn7he4t001yjs8qxlh38xcz	cmhn6r2ft0001p0dyvc3096qy	cmgxdqce80000108q18y4npo0	cmfhsxf490000lmmnwp77vl6x	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:10:00.653
cmhn7hg940020js8qdkwry0w0	cmhn6r2ft0001p0dyvc3096qy	cmgxdqce80000108q18y4npo0	cmh36n1zs0005td07t6m368m7	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:10:03.4
cmhn7hif30022js8ql85j36f0	cmhn6r2ft0001p0dyvc3096qy	cmgxdqce80000108q18y4npo0	cmgxzbcqh0000hak2a2jt0wwa	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:10:06.207
cmhn7hlgs0024js8qffve0rwo	cmhn6r2ft0001p0dyvc3096qy	cmgxdqce80000108q18y4npo0	cmfgpklkn000114lt1n0ec61k	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:10:10.156
cmhn7hnft0026js8qqbr00x77	cmhn6r2ft0001p0dyvc3096qy	cmgxdqce80000108q18y4npo0	cmh8axnya000me17r1py1t2xm	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:10:12.713
cmhn7i15k0028js8qjsu2fyun	cmhn6r2ft0001p0dyvc3096qy	cmfgpklkn000114lt1n0ec61k	cmhcegfin0006hcgendh83z40	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:10:30.488
cmhn7i32l002ajs8qfagnzcxb	cmhn6r2ft0001p0dyvc3096qy	cmfgpklkn000114lt1n0ec61k	cmfhsxf490000lmmnwp77vl6x	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:10:32.973
cmhn7i4rn002cjs8qj25z9cv3	cmhn6r2ft0001p0dyvc3096qy	cmfgpklkn000114lt1n0ec61k	cmh36n1zs0005td07t6m368m7	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:10:35.171
cmhn7i6ps002ejs8qhktqs2pl	cmhn6r2ft0001p0dyvc3096qy	cmfgpklkn000114lt1n0ec61k	cmgxdqce80000108q18y4npo0	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:10:37.696
cmhn7i8m2002gjs8qwczqgv32	cmhn6r2ft0001p0dyvc3096qy	cmfgpklkn000114lt1n0ec61k	cmgxzbcqh0000hak2a2jt0wwa	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:10:40.154
cmhn7iaks002ijs8qd7jmidfn	cmhn6r2ft0001p0dyvc3096qy	cmfgpklkn000114lt1n0ec61k	cmh8axnya000me17r1py1t2xm	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 09:10:42.701
cmhnbibbp001bkw1j97gxl3o9	cmhnb891d000fkw1j09az9ccn	cmfgpklkn000114lt1n0ec61k	cmfhsxf490000lmmnwp77vl6x	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-06 11:02:42.134
cmhnbj4ng001dkw1jshs2ulbh	cmhnb891d000fkw1j09az9ccn	cmfhsxf490000lmmnwp77vl6x	cmfgpklkn000114lt1n0ec61k	RECOGNIZE	sdf	ACTIVE	\N	\N	2025-11-06 11:03:20.14
cmhoho5xk001jeo2uz8ubluzi	cmhohdd4k0005eo2u4adsj5lp	cmfiilojw000ao5ubr1d3vfk0	cmfgpklkn000114lt1n0ec61k	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-07 06:42:58.952
cmhohof7i001leo2unxhv9m5m	cmhohdd4k0005eo2u4adsj5lp	cmfiilojw000ao5ubr1d3vfk0	cmh36n1zs0005td07t6m368m7	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-07 06:43:10.974
cmhohoidy001neo2ul02to8pe	cmhohdd4k0005eo2u4adsj5lp	cmfiilojw000ao5ubr1d3vfk0	cmgxdqce80000108q18y4npo0	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-07 06:43:15.094
cmhohokz0001peo2ur2amatra	cmhohdd4k0005eo2u4adsj5lp	cmfiilojw000ao5ubr1d3vfk0	cmhc7jd8w0006x7g1c2qc46o4	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-07 06:43:18.445
cmhohp691001reo2uun7kmb9j	cmhohdd4k0005eo2u4adsj5lp	cmhcegfin0006hcgendh83z40	cmh36n1zs0005td07t6m368m7	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-07 06:43:46.021
cmhohpap1001teo2u69v8gfsz	cmhohdd4k0005eo2u4adsj5lp	cmhcegfin0006hcgendh83z40	cmfiilojw000ao5ubr1d3vfk0	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-07 06:43:51.782
cmhohppbf001veo2uica1xkbg	cmhohdd4k0005eo2u4adsj5lp	cmh36n1zs0005td07t6m368m7	cmfgpklkn000114lt1n0ec61k	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-07 06:44:10.731
cmhohps3j001xeo2uewzg5cr8	cmhohdd4k0005eo2u4adsj5lp	cmh36n1zs0005td07t6m368m7	cmhcegfin0006hcgendh83z40	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-07 06:44:14.335
cmhohpw7i001zeo2unjhd0i7e	cmhohdd4k0005eo2u4adsj5lp	cmh36n1zs0005td07t6m368m7	cmfiilojw000ao5ubr1d3vfk0	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-07 06:44:19.662
cmhohpyj10021eo2uo124v60v	cmhohdd4k0005eo2u4adsj5lp	cmh36n1zs0005td07t6m368m7	cmhc7jd8w0006x7g1c2qc46o4	RECOGNIZE	\N	ACTIVE	\N	\N	2025-11-07 06:44:22.669
cmimevisx00amokex1q42q35o	cmimekf730098okexf0o0oww2	cmgxzbcqh0000hak2a2jt0wwa	cmh4rbv470000d3m0tokxkudd	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-01 00:28:53.362
cmimevmo500aookexazwfbl1e	cmimekf730098okexf0o0oww2	cmgxzbcqh0000hak2a2jt0wwa	cmgxdqce80000108q18y4npo0	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-01 00:28:58.373
cmimevp5800arokex7vmlcckm	cmimekf730098okexf0o0oww2	cmgxzbcqh0000hak2a2jt0wwa	cmfgpklkn000114lt1n0ec61k	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-01 00:29:01.58
cmimewgn500atokex0teov2yu	cmimekf730098okexf0o0oww2	cmgxdqce80000108q18y4npo0	cmh4rbv470000d3m0tokxkudd	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-01 00:29:37.217
cmimewirb00avokex4xthsp54	cmimekf730098okexf0o0oww2	cmgxdqce80000108q18y4npo0	cmfgpklkn000114lt1n0ec61k	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-01 00:29:39.96
cmimewkoc00axokexr352e87c	cmimekf730098okexf0o0oww2	cmgxdqce80000108q18y4npo0	cmgxzbcqh0000hak2a2jt0wwa	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-01 00:29:42.444
cmimexmzn00b0okex42x07bmf	cmimekf730098okexf0o0oww2	cmh4rbv470000d3m0tokxkudd	cmgxdqce80000108q18y4npo0	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-01 00:30:32.099
cmimexpms00b2okex22p9rif9	cmimekf730098okexf0o0oww2	cmh4rbv470000d3m0tokxkudd	cmfgpklkn000114lt1n0ec61k	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-01 00:30:35.525
cmimexrlx00b4okex1vhrtqa3	cmimekf730098okexf0o0oww2	cmh4rbv470000d3m0tokxkudd	cmgxzbcqh0000hak2a2jt0wwa	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-01 00:30:38.086
cmimey91w00b7okexpa8143na	cmimekf730098okexf0o0oww2	cmfgpklkn000114lt1n0ec61k	cmh4rbv470000d3m0tokxkudd	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-01 00:31:00.692
cmimeyb9e00b9okexgl6it4na	cmimekf730098okexf0o0oww2	cmfgpklkn000114lt1n0ec61k	cmgxdqce80000108q18y4npo0	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-01 00:31:03.555
cmimeydbv00bbokexxp7qgk0s	cmimekf730098okexf0o0oww2	cmfgpklkn000114lt1n0ec61k	cmgxzbcqh0000hak2a2jt0wwa	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-01 00:31:06.235
cmimiviqj001wiafftc3lopbp	cmimic9op000biaffodufnc10	cmh36n1zs0005td07t6m368m7	cmfgpklkn000114lt1n0ec61k	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-01 02:20:51.74
cmimivk7k001yiaffsp5oiu8q	cmimic9op000biaffodufnc10	cmh36n1zs0005td07t6m368m7	cmhcegfin0006hcgendh83z40	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-01 02:20:53.648
cmimiw5gb0022iaff5uzk6xj2	cmimic9op000biaffodufnc10	cmhcegfin0006hcgendh83z40	cmfgpklkn000114lt1n0ec61k	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-01 02:21:21.18
cmimiw7ce0024iaff0w3c1c39	cmimic9op000biaffodufnc10	cmhcegfin0006hcgendh83z40	cmh36n1zs0005td07t6m368m7	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-01 02:21:23.631
cmimix4hf0028iaffu96z25ry	cmimic9op000biaffodufnc10	cmfgpklkn000114lt1n0ec61k	cmhcegfin0006hcgendh83z40	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-01 02:22:06.579
cmimix6kf002aiaff36y4iqxb	cmimic9op000biaffodufnc10	cmfgpklkn000114lt1n0ec61k	cmh36n1zs0005td07t6m368m7	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-01 02:22:09.279
cminfm35v000mie6lvgrzj129	cminf7h9d0004ie6l6wjx24r9	cmhcegfin0006hcgendh83z40	cmfgpklkn000114lt1n0ec61k	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-01 17:37:18.98
cminfn1fg000oie6lpgqm4if8	cminf7h9d0004ie6l6wjx24r9	cmfgpklkn000114lt1n0ec61k	cmhcegfin0006hcgendh83z40	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-01 17:38:03.388
cmio2kvtd000jqotcnrk3b37g	cmio2a85k0001qotccs6so6mf	cmhcegfin0006hcgendh83z40	cmfhsxf490000lmmnwp77vl6x	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-02 04:20:13.969
cmio2lo56000lqotcqitetpob	cmio2a85k0001qotccs6so6mf	cmfhsxf490000lmmnwp77vl6x	cmhcegfin0006hcgendh83z40	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-02 04:20:50.682
cmio780ov000j2nukbq4j2cuu	cmio6xbu900012nuky5o963vy	cmfhsxf490000lmmnwp77vl6x	cmhcegfin0006hcgendh83z40	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-02 06:30:11.839
cmio78fl0000l2nuk726gfdv1	cmio6xbu900012nuky5o963vy	cmhcegfin0006hcgendh83z40	cmfhsxf490000lmmnwp77vl6x	NOT_RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-02 06:30:31.141
cmio9f5fy000xyuosyacrqg02	cmio8g4v70001yuosc61nzwfg	cmfhsxf490000lmmnwp77vl6x	cmhcegfin0006hcgendh83z40	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-02 07:31:43.822
cmisrzlgo0015p50bsv2zpvur	cmisrk0z1000pp50bcg4no9zl	cmgxfcw0d0000o777zhox72xw	cmfhsxf490000lmmnwp77vl6x	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-05 11:22:35.497
cmiss0eqw0017p50bnxyfkjh3	cmisrk0z1000pp50bcg4no9zl	cmfhsxf490000lmmnwp77vl6x	cmgxfcw0d0000o777zhox72xw	RECOGNIZE	xcvssfds	ACTIVE	\N	\N	2025-12-05 11:23:13.448
cmiv1jkho001snbfdmr6bdxa6	cmiv0h59g0011nbfdm8kuzcgj	cmfgpklkn000114lt1n0ec61k	cmgxzbcqh0000hak2a2jt0wwa	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-07 01:25:36.253
cmiv1jlz9001unbfd2qn6vi1f	cmiv0h59g0011nbfdm8kuzcgj	cmfgpklkn000114lt1n0ec61k	cmgxfcw0d0000o777zhox72xw	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-07 01:25:38.182
cmiv1k6ub001wnbfd9ii2dgvf	cmiv0h59g0011nbfdm8kuzcgj	cmgxfcw0d0000o777zhox72xw	cmfgpklkn000114lt1n0ec61k	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-07 01:26:05.219
cmiv1k9ab001ynbfdv01ix084	cmiv0h59g0011nbfdm8kuzcgj	cmgxfcw0d0000o777zhox72xw	cmgxzbcqh0000hak2a2jt0wwa	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-07 01:26:08.387
cmiv1klz10020nbfdfh82cjsg	cmiv0h59g0011nbfdm8kuzcgj	cmgxzbcqh0000hak2a2jt0wwa	cmfgpklkn000114lt1n0ec61k	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-07 01:26:24.829
cmiv1knye0022nbfdcqyur634	cmiv0h59g0011nbfdm8kuzcgj	cmgxzbcqh0000hak2a2jt0wwa	cmgxfcw0d0000o777zhox72xw	RECOGNIZE	\N	ACTIVE	\N	\N	2025-12-07 01:26:27.398
\.


--
-- Data for Name: penalty_records; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.penalty_records (id, user_id, game_id, dispute_id, penalty_type, reason, trust_points_deduction, game_points_deduction, executed_by, executed_at, created_at) FROM stdin;
cmioqov7l001oyuos4socwi56	cmfhsxf490000lmmnwp77vl6x	cmio8g4v70001yuosc61nzwfg	cmioqo697001hyuosr3e4y7yc	MALICIOUS_DISPUTE	恶意仲裁	2	0	cmfhsxf490000lmmnwp77vl6x	2025-12-02 15:35:10.594	2025-12-02 15:35:10.594
\.


--
-- Data for Name: points_history; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.points_history (id, user_id, point_type, change, reason, game_id, created_at) FROM stdin;
cmfhq60w600058y89labufvah	cmfgpmfbo000314ltz0jj7n1y	PARTICIPATION	10	创建游戏	cmfhq60vo00018y89c4tyvorz	2025-09-13 03:47:01.254
cmfhq6fnz000b8y89o6oerwvc	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmfhq6fnn00078y89ear6ausw	2025-09-13 03:47:20.399
cmfhq6xot000h8y89lyrsln1i	cmfgpjvmb000014ltuwk3uwht	PARTICIPATION	10	创建游戏	cmfhq6xoa000d8y89mv90gi3f	2025-09-13 03:47:43.758
cmfhq8bh3000n8y89uiaqmrep	cmfgpjvmb000014ltuwk3uwht	PARTICIPATION	10	创建游戏	cmfhq8bgr000j8y89g2lakoac	2025-09-13 03:48:48.279
cmfhqcmcw000t8y89h44o27xc	cmfgpjvmb000014ltuwk3uwht	PARTICIPATION	10	创建游戏	cmfhqcmch000p8y89n79410wa	2025-09-13 03:52:09.009
cmfhqd9dl000x8y89k4mqaoq7	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	参与游戏	cmfhqcmch000p8y89n79410wa	2025-09-13 03:52:38.842
cmfhqddb3000z8y89qebva6ig	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	-5	退出游戏	cmfhqcmch000p8y89n79410wa	2025-09-13 03:52:43.936
cmfhqdgq800138y890qozi5qb	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	参与游戏	cmfhqcmch000p8y89n79410wa	2025-09-13 03:52:48.369
cmfhqdu7x00178y89hwbg98p1	cmfgpmfbo000314ltz0jj7n1y	PARTICIPATION	5	参与游戏	cmfhq8bgr000j8y89g2lakoac	2025-09-13 03:53:05.854
cmfhqdzit001b8y89j0emiib1	cmfgpmfbo000314ltz0jj7n1y	PARTICIPATION	5	参与游戏	cmfhqcmch000p8y89n79410wa	2025-09-13 03:53:12.725
cmfhqed2y001f8y89irtjndm0	cmfgplidl000214ltrltpgf6s	PARTICIPATION	5	参与游戏	cmfhqcmch000p8y89n79410wa	2025-09-13 03:53:30.298
cmfhqehym001j8y89d7jqliet	cmfgplidl000214ltrltpgf6s	PARTICIPATION	5	参与游戏	cmfhq8bgr000j8y89g2lakoac	2025-09-13 03:53:36.622
cmfhqgehc001o8y89qcxz1ypt	cmfhqg9mg001k8y89kdji8pwn	PARTICIPATION	5	参与游戏	cmfhqcmch000p8y89n79410wa	2025-09-13 03:55:05.424
cmfhqhfdr001t8y897kw2clct	cmfhqhbdo001p8y89uh5fot7e	PARTICIPATION	5	参与游戏	cmfhqcmch000p8y89n79410wa	2025-09-13 03:55:53.247
cmfhqhw0l001x8y89q6obn1m7	cmfhqhbdo001p8y89uh5fot7e	PARTICIPATION	5	参与游戏	cmfhq8bgr000j8y89g2lakoac	2025-09-13 03:56:14.805
cmfign36q000d8ulaaylbw5x5	cmfhqhbdo001p8y89uh5fot7e	PARTICIPATION	10	创建游戏	cmfign35x00098ulaq227751c	2025-09-13 16:08:07.394
cmfignseq000j8ulaeywpdn1z	cmfhqg9mg001k8y89kdji8pwn	PARTICIPATION	10	创建游戏	cmfignse8000f8ulax88ui5ce	2025-09-13 16:08:40.082
cmfjq2cb50005az4kwde9lkg5	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmfjq2cam0001az4knhimbwj3	2025-09-14 13:19:41.778
cmfjq310e000baz4kk7r6fqn8	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmfjq31050007az4kfbucjcdq	2025-09-14 13:20:13.791
cmfjq47jy000haz4kv2p5wip4	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmfjq47jk000daz4kzzebykah	2025-09-14 13:21:08.926
cmflzh4ks000524jj4q6qkbwc	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmflzh4ka000124jjoxctvu86	2025-09-16 03:18:40.492
cmfplitah000c24jjvs1s85ap	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmfplita1000824jj8rtck0ti	2025-09-18 15:59:09.258
cmfuteq6s000k24jjftq8atfk	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmfuteq6c000g24jj0ol98br2	2025-09-22 07:38:46.421
cmfuydo9a00069isaimj80eb5	cmfgpmfbo000314ltz0jj7n1y	PARTICIPATION	10	创建游戏	cmfuydo8w00029isa7gi8qtp8	2025-09-22 09:57:55.343
cmfuyetxs000d9isabwudaqan	cmfgpmfbo000314ltz0jj7n1y	PARTICIPATION	10	创建游戏	cmfuyetx500099isac841d0t3	2025-09-22 09:58:49.36
cmfuyff3i000k9isar0r1mb6d	cmfgpmfbo000314ltz0jj7n1y	PARTICIPATION	10	创建游戏	cmfuyff36000g9isakmxjcmr5	2025-09-22 09:59:16.783
cmfuyvpzs000r9isabpf28npy	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	10	创建游戏	cmfuyvpzc000n9isava0zsvl4	2025-09-22 10:11:57.401
cmfuzf4dy000y9isavs8nhvc3	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmfuzf4db000u9isa9si4797a	2025-09-22 10:27:02.518
cmfuzsf9a00159isa8zibhyyw	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmfuzsf8w00119isa4t5mlh68	2025-09-22 10:37:23.134
cmfyqm0ax001k9isatsx96c5w	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmfyqm0ag001g9isas5eaxm5e	2025-09-25 01:31:31.977
cmfyqnpya001r9isaweqbs0b7	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmfyqnpxt001n9isaa0gg32w9	2025-09-25 01:32:51.874
cmfzrgl3z00052tw3ymp31s8c	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmfzrgl3f00012tw32obb730j	2025-09-25 18:43:04.799
cmfzrhoej000b2tw3y25xt4lk	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmfzrhoe400072tw3d8te4hwn	2025-09-25 18:43:55.724
cmfzrsy58000h2tw3ax0lgyq6	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmfzrsy4l000d2tw3wt5whs5i	2025-09-25 18:52:41.564
cmfzruq95000l2tw3cfiutime	cmfiilojw000ao5ubr1d3vfk0	PARTICIPATION	5	参与游戏	cmfyqnpxt001n9isaa0gg32w9	2025-09-25 18:54:04.649
cmg228mpj000p7sa2bpzgu5v8	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmg228mp0000l7sa2x10rfit8	2025-09-27 09:20:21.752
cmg2bbjrr0005hbraymlccjxh	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmg2bbjr80001hbraujzmuv8o	2025-09-27 13:34:34.456
cmg2bc73e000bhbrap3jvkfib	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmg2bc7310007hbraewf0rmyh	2025-09-27 13:35:04.682
cmgh2myb7000512etfnjbw0mm	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgh2myao000112etmu7ae4mr	2025-10-07 21:28:02.611
cmgm3kgeu0005aryocciettvc	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgm3kgee0001aryoqxl2ctov	2025-10-11 09:52:56.598
cmgm4jk91000baryobv4dvw7r	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgm4jk8j0007aryom8bfkppi	2025-10-11 10:20:14.533
cmgm4k4po000haryofwc1sc91	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgm4k4pb000daryonhg4cvl2	2025-10-11 10:20:41.053
cmgm4ksn5000naryojnv74b9f	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgm4ksmu000jaryole73k1gt	2025-10-11 10:21:12.065
cmgm4piwd000taryo8ugpw8eb	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgm4pivy000paryofaix1z5y	2025-10-11 10:24:52.717
cmgm4q1n0000zaryo29axjikk	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgm4q1mg000varyo5ppyz8vm	2025-10-11 10:25:17.005
cmgngvxjt0006w62un0ojdjg7	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgngvxje0002w62u1am5xzpk	2025-10-12 08:53:33.21
cmgvpm9wt000agr8ei1brq0b8	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	-100	兑换商品: asdfdsaf	\N	2025-10-18 03:20:08.621
cmgyrcaxy0005kgtc7dsg899d	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgyrcaxc0001kgtc6kym2lft	2025-10-20 06:31:41.158
cmgyrq5vl00059bn9m5uoa8pl	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgyrq5v500019bn9dezllbjh	2025-10-20 06:42:27.778
cmgyrs7q5000d9bn9735510qb	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgyrs7po00099bn9mpilta9w	2025-10-20 06:44:03.485
cmgyrzuom000l9bn9syfrh4b6	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgyrzuo4000h9bn906tapny5	2025-10-20 06:49:59.831
cmgyshsth000t9bn97dh3qhw2	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgyshssx000p9bn9p2oknkde	2025-10-20 07:03:57.222
cmgysof9d000510if2soh9qfj	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgysof8t000110ife0i3rry7	2025-10-20 07:09:06.242
cmgysofai000a10ifm75tf7ed	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	50	成就奖励: 老用户	\N	2025-10-20 07:09:06.283
cmgysqm68000i10ifv1njxsns	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgysqm5q000e10if1qulap66	2025-10-20 07:10:48.512
cmgyt9117000o10if1x3w6amt	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgyt910l000k10ifchf3x13m	2025-10-20 07:25:07.579
cmgyu0rog000u10ifacqibbi7	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgyu0rnx000q10ifckfz0fv4	2025-10-20 07:46:41.824
cmgyu3ml8001010if9ni5tvzz	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgyu3mkr000w10if0j7gos9e	2025-10-20 07:48:55.196
cmgyu6zo9001610ifzmexgicd	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgyu6zns001210ifiq68mezu	2025-10-20 07:51:32.121
cmgyu8qmd001c10ifvxac732t	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgyu8qlz001810ifsjvti4yl	2025-10-20 07:52:53.702
cmgyu9zoi001i10ifr7j7oqfk	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgyu9zo7001e10ifj7gokup4	2025-10-20 07:53:52.098
cmgyufj31001o10if12fxbxsm	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgyufj2d001k10ifovdc1yac	2025-10-20 07:58:10.525
cmgyuhn8c001u10if64v1cu8u	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgyuhn7y001q10ifv32fixph	2025-10-20 07:59:49.212
cmgz2gtql002010if4mx2dhy2	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgz2gtq1001w10if2wo7moub	2025-10-20 11:43:07.918
cmgz2l643002610ifry1wf4lw	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgz2l63p002210ifbpsmgzw7	2025-10-20 11:46:30.58
cmgz2lyjv002c10if4o44lgio	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgz2lyjf002810ifzlybx56h	2025-10-20 11:47:07.435
cmgz2mxps002i10if4z9362lc	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgz2mxp9002e10ifqx7onf2w	2025-10-20 11:47:53.008
cmgz2pc7c002o10ifkunqzslv	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgz2pc6s002k10if05p5690s	2025-10-20 11:49:45.096
cmgz2q4cd002u10if8fqpeowk	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgz2q4bu002q10ifkiylx1g8	2025-10-20 11:50:21.565
cmgz2rnt4003010if86c6vgpm	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgz2rnsu002w10ifclsmuos8	2025-10-20 11:51:33.449
cmgz2t7nt003610ifnt4tafq0	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgz2t7ng003210ifn0txseqw	2025-10-20 11:52:45.833
cmgz3280f003c10ifny65l8t9	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgz327zv003810if0m30e0wf	2025-10-20 11:59:46.191
cmgz33puw003i10ifemvajc60	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgz33pui003e10ifdaxnhcwx	2025-10-20 12:00:55.977
cmgz36tx4003o10if2hz3hq06	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgz36tws003k10if7443um5k	2025-10-20 12:03:21.208
cmgz421t5003u10ifqgoudzub	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgz421sp003q10ifsz2qmse0	2025-10-20 12:27:37.769
cmgz45k9c004010ifaxrep3xr	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgz45k8u003w10if5308muwm	2025-10-20 12:30:21.648
cmgz52wtr004610ifc0gaexdj	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgz52wt9004210if9wf0oagd	2025-10-20 12:56:17.584
cmgz54f0h004c10ifbswug4ji	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgz54f06004810ifuzvs81w4	2025-10-20 12:57:27.809
cmgz8hb44004i10ifwdfn21ep	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgz8hb3e004e10ifta3qet69	2025-10-20 14:31:28.132
cmgz99pqg004o10ifydbllxul	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgz99ppu004k10ifwslc7mda	2025-10-20 14:53:33.448
cmgz9b2us004u10if0ymtmjcq	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgz9b2ub004q10ifldpderts	2025-10-20 14:54:37.108
cmgzaye2t005010ifz3lfv2ev	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgzaye2b004w10ifgfhevaf9	2025-10-20 15:40:44.358
cmgzbxdoh005610if9xlbuo54	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgzbxdny005210ifvm38tk4a	2025-10-20 16:07:56.801
cmgzbxzfg005c10if9fq0mmti	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgzbxzf3005810iflzgnthyp	2025-10-20 16:08:24.988
cmgzc2ias00055zrtrfm7bx0h	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgzc2ia700015zrt2ox3ww04	2025-10-20 16:11:56.069
cmgzc31ic000b5zrt5gak9xb4	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgzc31hq00075zrtz4yyml52	2025-10-20 16:12:20.965
cmgzc436n000h5zrtqo1z93q1	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmgzc436b000d5zrtl3usz8tv	2025-10-20 16:13:09.791
cmh5rd8cw0005d3m0amdfkmu3	cmh4rbv470000d3m0tokxkudd	PARTICIPATION	5	参与游戏	cmgyrzuo4000h9bn906tapny5	2025-10-25 04:06:47.696
cmh5rdwje000dd3m0383bzfq3	cmh4rbv470000d3m0tokxkudd	PARTICIPATION	10	创建游戏	cmh5rdwj10009d3m0h66bgxk3	2025-10-25 04:07:19.034
cmh60l9am000hd3m0w8r5let0	cmh4rbv470000d3m0tokxkudd	PARTICIPATION	5	参与游戏	cmgzbxdny005210ifvm38tk4a	2025-10-25 08:24:58.703
cmh66fdak000pd3m0ybb3bwye	cmh4rbv470000d3m0tokxkudd	PARTICIPATION	10	创建游戏	cmh66fda1000ld3m0ehv07ao3	2025-10-25 11:08:21.644
cmh66gffp000td3m0126ymk0j	cmh4rbv470000d3m0tokxkudd	PARTICIPATION	5	参与游戏	cmgz2t7ng003210ifn0txseqw	2025-10-25 11:09:11.077
cmh7d62ry0017d3m07fywybd3	cmh4rbv470000d3m0tokxkudd	PARTICIPATION	10	创建游戏	cmh7d62rh0013d3m0dz4vmtub	2025-10-26 07:04:51.598
cmh82pxer0005e17r89oielw3	cmh4rbv470000d3m0tokxkudd	PARTICIPATION	10	创建游戏	cmh82pxe60001e17r153xo76x	2025-10-26 19:00:08.164
cmh86b57h000fe17rvy14pdxa	cmh4rbv470000d3m0tokxkudd	PARTICIPATION	10	创建游戏	cmh86b571000be17r2t331nab	2025-10-26 20:40:36.894
cmh9dnrp4000bn9uteddbsgvy	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmh9dnrom0007n9uty3268apu	2025-10-27 16:54:09.4
cmh9wddp4000jn9utttx89dbd	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmh9wddoo000fn9uttdaok57f	2025-10-28 01:37:57.4
cmha0rto7000pn9ut0i9olw0e	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmha0rtnl000ln9uthxseclb3	2025-10-28 03:41:09.751
cmha0taiy000vn9ut3l6p8ah4	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmha0taik000rn9utist2byqj	2025-10-28 03:42:18.251
cmha76ham0011n9ut05l03c8p	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmha76h9v000xn9utzxu5dikm	2025-10-28 06:40:31.246
cmha8evp80005117uhuk3upmr	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmha8evok0001117uv95wftcx	2025-10-28 07:15:02.781
cmha8gaj50009117uoecgzwjb	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	参与游戏	cmh7d62rh0013d3m0dz4vmtub	2025-10-28 07:16:08.657
cmha8n0pn000k117uh5gg56dd	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	参与游戏	cmha8evok0001117uv95wftcx	2025-10-28 07:21:22.523
cmha8n9gz000o117u1ywucjk0	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	参与游戏	cmha0rtnl000ln9uthxseclb3	2025-10-28 07:21:33.876
cmha8nnz6000q117u475f6t18	cmh36n1zs0005td07t6m368m7	PARTICIPATION	-5	退出游戏	cmha0rtnl000ln9uthxseclb3	2025-10-28 07:21:52.674
cmha8nr6v000u117u5jbbustt	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	参与游戏	cmha0rtnl000ln9uthxseclb3	2025-10-28 07:21:56.839
cmhawi4ud0005xe90u5tifew2	cmh36n1zs0005td07t6m368m7	PARTICIPATION	10	创建游戏	cmhawi4tt0001xe90c0e883k6	2025-10-28 18:29:25.381
cmhawk29b0009xe90nyllaabo	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	参与游戏	cmhawi4tt0001xe90c0e883k6	2025-10-28 18:30:55.343
cmhbq4xrw0003x7g1uzzdflqu	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	参与游戏	cmh82pxe60001e17r153xo76x	2025-10-29 08:18:58.172
cmhc7jdaa000ex7g1oxox8xds	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	20	推荐新用户获得20参与积分奖励	\N	2025-10-29 16:26:04.931
cmhcbwt1l0005tqgxgyvis1zv	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhcbwt110001tqgxj3frn3i8	2025-10-29 18:28:30.345
cmhcc03f40009tqgx14e3yzcd	cmh4rbv470000d3m0tokxkudd	PARTICIPATION	5	参与游戏	cmhcbwt110001tqgxj3frn3i8	2025-10-29 18:31:03.76
cmhcefdvv0005hcge5oayzkmz	cmhcc8p1o000atqgxpzkeao00	PARTICIPATION	10	创建游戏	cmhcefdvh0001hcgeng4yry82	2025-10-29 19:38:56.396
cmhcek4c8000ahcgepokcokp1	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmhcefdvh0001hcgeng4yry82	2025-10-29 19:42:37.304
cmhcekkvk000chcgecpmx86ic	cmhcegfin0006hcgendh83z40	PARTICIPATION	-5	退出游戏	cmhcefdvh0001hcgeng4yry82	2025-10-29 19:42:58.736
cmhcelu4d000ghcgelbqilrwc	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmhcefdvh0001hcgeng4yry82	2025-10-29 19:43:57.373
cmhcfl4c90001dc0nv3j6hdfw	cmhcegfin0006hcgendh83z40	PARTICIPATION	-5	退出游戏	cmhcefdvh0001hcgeng4yry82	2025-10-29 20:11:23.577
cmhcfl6wz0005dc0nkxkj5l52	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmhcefdvh0001hcgeng4yry82	2025-10-29 20:11:26.915
cmhcfq24t000adc0nx22oilbl	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	参与游戏	cmhcefdvh0001hcgeng4yry82	2025-10-29 20:15:13.997
cmhci1v7p000idc0nggkjrkud	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhci1v74000edc0nlz6tyy47	2025-10-29 21:20:24.134
cmhci7otj000odc0n2apxmi6d	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhci7ot2000kdc0nil8v6lky	2025-10-29 21:24:55.784
cmhckkj2z0005pjiargbnfsr1	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhckkj2d0001pjiage8t8bw9	2025-10-29 22:30:54.107
cmhcngon200056na9br0h9hrb	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhcngomk00016na98db1vqr5	2025-10-29 23:51:53.535
cmhcnts3n000b6na94nxme4l9	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhcnts3100076na9xzhtvjoq	2025-10-30 00:02:04.548
cmhcsdwmi000h6na9qe2fhgsv	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhcsdwlz000d6na9zmwptwvz	2025-10-30 02:09:41.994
cmhcub07d00058iy4m9gnm09x	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhcub06t00018iy4nns519qb	2025-10-30 03:03:25.897
cmhcuehm700098iy4rrgp9de3	cmh4rbv470000d3m0tokxkudd	PARTICIPATION	5	参与游戏	cmhcngomk00016na98db1vqr5	2025-10-30 03:06:08.431
cmhdb0swu0005r5aeyfzg81s5	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhdb0swc0001r5ae3y4j3ryy	2025-10-30 10:51:23.359
cmhdb2fsq000br5ae6tasmuu8	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhdb2fs50007r5aefv8tho9a	2025-10-30 10:52:39.674
cmhdbjtvj000fr5ae6w2b7ncl	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	参与游戏	cmhdb0swc0001r5ae3y4j3ryy	2025-10-30 11:06:11.071
cmhdcgmq30005wj8x3nucero8	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhdcgmph0001wj8x3x7ttlxk	2025-10-30 11:31:41.451
cmhdckd8s0009wj8xla2ni150	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	5	参与游戏	cmhdb0swc0001r5ae3y4j3ryy	2025-10-30 11:34:35.789
cmhdo4gcw00057oozporx16is	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhdo4gc900017ooz7mmxu546	2025-10-30 16:58:08.721
cmhdo67rh000b7oozys00qnzs	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhdo67qz00077oozsrib186w	2025-10-30 16:59:30.893
cmhds5de1000510bhb9nk3cz9	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhds5ddj000110bh5amv3bsw	2025-10-30 18:50:49.993
cmhds6lm4000b10bhfu5od02m	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhds6lll000710bhvhz72ti2	2025-10-30 18:51:47.308
cmhds7oez000h10bhy02xkk6m	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhds7oeg000d10bhrsje0d4b	2025-10-30 18:52:37.595
cmhdwug050005b33nb6c4telt	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhdwufzn0001b33ng0vfu8nd	2025-10-30 21:02:18.245
cmhdxh3840005u32lviwpygc4	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhdxh37l0001u32lgwen3s2b	2025-10-30 21:19:54.772
cmhdxib9w000bu32ldlniwh5u	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhdxib9i0007u32lodrkafr8	2025-10-30 21:20:51.86
cmhdygyh70005ugqx52den3d6	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhdygygo0001ugqx6wmxh80d	2025-10-30 21:47:48.236
cmhegsuds0005bpixqln8jzf9	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhegsud40001bpixkubxsi7e	2025-10-31 06:20:55.888
cmhegv6d8000bbpixwt1jatq9	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhegv6ct0007bpixtw8bxwnw	2025-10-31 06:22:44.732
cmhegwm35000hbpixfq42zmn3	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhegwm2p000dbpix7tgjeihp	2025-10-31 06:23:51.761
cmhegy7a7000nbpix2tstq5i3	cmfgpjvmb000014ltuwk3uwht	PARTICIPATION	10	创建游戏	cmhegy79n000jbpixn9ramn8p	2025-10-31 06:25:05.887
cmhegy7b5000rbpixm6p36t7m	cmfgpjvmb000014ltuwk3uwht	PARTICIPATION	50	成就奖励: 老用户	\N	2025-10-31 06:25:05.921
cmhegz326000zbpixw8xurcui	cmfgpjvmb000014ltuwk3uwht	PARTICIPATION	10	创建游戏	cmhegz31t000vbpixtae9lu0t	2025-10-31 06:25:47.071
cmhf38i030005129pdjlpgabn	cmfgpjvmb000014ltuwk3uwht	PARTICIPATION	10	创建游戏	cmhf38hzh0001129pbj4rlnj9	2025-10-31 16:48:57.891
cmhf7a0wh0005wnlzkfpnd5ua	cmhcc8p1o000atqgxpzkeao00	PARTICIPATION	10	创建游戏	cmhf7a0vx0001wnlzsjipiz38	2025-10-31 18:42:07.506
cmhf7gu4r000bwnlzr4h9j062	cmhcc8p1o000atqgxpzkeao00	PARTICIPATION	10	创建游戏	cmhf7gu490007wnlzy17hvjyw	2025-10-31 18:47:25.323
cmhf7pzms0005140ltob1xig6	cmhcc8p1o000atqgxpzkeao00	PARTICIPATION	10	创建游戏	cmhf7pzm60001140lt8s1sbs1	2025-10-31 18:54:32.356
cmhf8g1v3000b140lhstdrm5v	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhf8g1uj0007140l9bjhf2ip	2025-10-31 19:14:48.303
cmhf8grsu000h140l0xiy0uqy	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhf8grsc000d140lf31hftbn	2025-10-31 19:15:21.919
cmhf8k1t7000n140lqyngmiq8	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhf8k1sn000j140le95g1eps	2025-10-31 19:17:54.859
cmhf8lj7y000t140lbvbklm85	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhf8lj7e000p140lj8vn75re	2025-10-31 19:19:04.079
cmhf9df47000z140lxk8ufag0	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhf9df3o000v140l9gorkotg	2025-10-31 19:40:45.127
cmhf9l4rh0015140lznfy0r9a	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhf9l4qy0011140lgxgfurcb	2025-10-31 19:46:44.957
cmhf9rrlp0005acecdhp987xr	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhf9rrl40001acecs3u08zlu	2025-10-31 19:51:54.494
cmhfa7rei000bacec2xbc6aus	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhfa7rdp0007acecu7qw2dav	2025-10-31 20:04:20.73
cmhfa95mc000hacecgykrkf9i	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhfa95ls000dacec1d11yjtl	2025-10-31 20:05:25.812
cmhfd0ccc0005f1ptwathlbpn	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhfd0cbr0001f1ptfa6gah8o	2025-10-31 21:22:33.469
cmhfd2p72000bf1ptfzaasfw4	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhfd2p6o0007f1ptydstmfcl	2025-10-31 21:24:23.439
cmhffqca4000hf1pta8mc8fpu	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhffqc9m000df1ptu5pjnr1m	2025-10-31 22:38:45.677
cmhga25oh000513ttyhnocxo2	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhga25nx000113ttuzu9uc2y	2025-11-01 12:47:45.474
cmhga3fr6000913ttym1sb6il	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmhga25nx000113ttuzu9uc2y	2025-11-01 12:48:45.187
cmhgegtjp000566n3ug1g2vp0	cmhcc8p1o000atqgxpzkeao00	PARTICIPATION	5	参与游戏	cmhf8lj7e000p140lj8vn75re	2025-11-01 14:51:08.053
cmhgeh40x000966n33x3bnuyf	cmhcc8p1o000atqgxpzkeao00	PARTICIPATION	-5	退出游戏	cmhf8lj7e000p140lj8vn75re	2025-11-01 14:51:21.633
cmhgeh61o000f66n38kpy1vrh	cmhcc8p1o000atqgxpzkeao00	PARTICIPATION	5	参与游戏	cmhf8lj7e000p140lj8vn75re	2025-11-01 14:51:24.252
cmhgeh7zr000j66n33yi7ltd0	cmhcc8p1o000atqgxpzkeao00	PARTICIPATION	-5	退出游戏	cmhf8lj7e000p140lj8vn75re	2025-11-01 14:51:26.775
cmhgeh9ud000p66n3lk393dm1	cmhcc8p1o000atqgxpzkeao00	PARTICIPATION	5	参与游戏	cmhf8lj7e000p140lj8vn75re	2025-11-01 14:51:29.173
cmhgehbnl000t66n3v5jm6v99	cmhcc8p1o000atqgxpzkeao00	PARTICIPATION	-5	退出游戏	cmhf8lj7e000p140lj8vn75re	2025-11-01 14:51:31.522
cmhgjibda000z66n3k4ikv4s8	cmfiilojw000ao5ubr1d3vfk0	PARTICIPATION	10	创建游戏	cmhgjibcq000v66n3freb84lj	2025-11-01 17:12:15.886
cmhgjibe5001366n3kujfas78	cmfiilojw000ao5ubr1d3vfk0	PARTICIPATION	50	成就奖励: 老用户	\N	2025-11-01 17:12:15.918
cmhgov9vb0005rhx7q8spl9rq	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhgov9uk0001rhx7d91va8vs	2025-11-01 19:42:18.552
cmhgoxiva000brhx7muzoy9xp	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhgoxiur0007rhx7cis5629u	2025-11-01 19:44:03.526
cmhgoz5vu000hrhx7ecg1u3m1	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhgoz5vf000drhx7zaev4o3v	2025-11-01 19:45:20.01
cmhgt4mts000nrhx7curqx3sx	cmhcc8p1o000atqgxpzkeao00	PARTICIPATION	10	创建游戏	cmhgt4mta000jrhx7801hzo66	2025-11-01 21:41:33.712
cmhgt84ks000trhx7ceg74cn4	cmhcc8p1o000atqgxpzkeao00	PARTICIPATION	10	创建游戏	cmhgt84k9000prhx7kx9ic6i2	2025-11-01 21:44:16.684
cmhgta0pw000zrhx7hfzb73ea	cmhcc8p1o000atqgxpzkeao00	PARTICIPATION	10	创建游戏	cmhgta0p2000vrhx7rd7ua5rs	2025-11-01 21:45:44.996
cmhguu63f0005lrbscsrqssd3	cmh36n1zs0005td07t6m368m7	PARTICIPATION	10	创建游戏	cmhguu62v0001lrbs74qsptsm	2025-11-01 22:29:24.699
cmhh59z4k0005uuz5i5pll8gh	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhh59z3y0001uuz5fhws6qwt	2025-11-02 03:21:38.325
cmhh5bhzi000buuz57mu0h0yc	cmgxzbcqh0000hak2a2jt0wwa	PARTICIPATION	10	创建游戏	cmhh5bhyy0007uuz5w9bd7s15	2025-11-02 03:22:49.422
cmhhqix9z0005w6fybsq7nno4	cmhcc8p1o000atqgxpzkeao00	PARTICIPATION	10	创建游戏	cmhhqix9e0001w6fykpt2b6f6	2025-11-02 13:16:27.768
cmhht9u82000bead8vionp0py	cmhcc8p1o000atqgxpzkeao00	TRUST	-10	游戏被举报处理：sa打发士大夫	cmhhqix9e0001w6fykpt2b6f6	2025-11-02 14:33:22.755
cmhht9u89000dead8xynr6hj4	cmh4rbv470000d3m0tokxkudd	LABOR	5	成功举报违规游戏：sa打发士大夫	cmhhqix9e0001w6fykpt2b6f6	2025-11-02 14:33:22.761
cmhhtfzlh000vead8meedb446	cmh36n1zs0005td07t6m368m7	TRUST	-10	游戏被举报处理：16:8间歇性断食挑战	cmhguu62v0001lrbs74qsptsm	2025-11-02 14:38:09.653
cmhhtfzln000xead8z8m79xro	cmhcegfin0006hcgendh83z40	LABOR	5	成功举报违规游戏：16:8间歇性断食挑战	cmhguu62v0001lrbs74qsptsm	2025-11-02 14:38:09.659
cmhhub39f00045er4lvsrvd01	cmfgpklkn000114lt1n0ec61k	TRUST	-10	游戏被举报处理：每日运动挑战VVVVVV	cmhga25nx000113ttuzu9uc2y	2025-11-02 15:02:20.739
cmhhub39n00065er49th8b518	cmh36n1zs0005td07t6m368m7	LABOR	5	成功举报违规游戏：每日运动挑战VVVVVV	cmhga25nx000113ttuzu9uc2y	2025-11-02 15:02:20.747
cmhhuez2n000i5er4fbav2sp2	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhhuez21000e5er4yaqx03wn	2025-11-02 15:05:21.936
cmhig5a2q0007141vk3sxz1qo	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhig5a250003141vy1jnjkhu	2025-11-03 01:13:41.187
cmhig5nn1000d141v5oq7wxhh	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	参与游戏	cmhig5a250003141vy1jnjkhu	2025-11-03 01:13:58.765
cmhig62t0000j141vwfbzbu2d	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	参与游戏	cmhig5a250003141vy1jnjkhu	2025-11-03 01:14:18.421
cmhigtluy0014141v3752cw0p	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	17	完成游戏	cmhig5a250003141vy1jnjkhu	2025-11-03 01:32:36.202
cmhigtlve0016141vgg10fcva	cmhc7jd8w0006x7g1c2qc46o4	TRUST	1	被他人认可履约	cmhig5a250003141vy1jnjkhu	2025-11-03 01:32:36.218
cmhigtlvl0018141vrur25kdx	cmhc7jd8w0006x7g1c2qc46o4	LABOR	2	参与互评	cmhig5a250003141vy1jnjkhu	2025-11-03 01:32:36.225
cmhigtlvt001a141vbndaolgf	cmhc7jd8w0006x7g1c2qc46o4	LABOR	5	提交高质量证据	cmhig5a250003141vy1jnjkhu	2025-11-03 01:32:36.233
cmhigtlwp001c141vptpnryps	cmh36n1zs0005td07t6m368m7	TRUST	-5	被他人认定违约	cmhig5a250003141vy1jnjkhu	2025-11-03 01:32:36.266
cmhigtlwv001e141veqzat5nz	cmh36n1zs0005td07t6m368m7	LABOR	2	参与互评	cmhig5a250003141vy1jnjkhu	2025-11-03 01:32:36.271
cmhigtlx1001g141vgks6hhc3	cmh36n1zs0005td07t6m368m7	LABOR	5	提交高质量证据	cmhig5a250003141vy1jnjkhu	2025-11-03 01:32:36.277
cmhigtlxp001i141v9i77sfhx	cmfgpklkn000114lt1n0ec61k	TRUST	-7	被他人认定违约	cmhig5a250003141vy1jnjkhu	2025-11-03 01:32:36.302
cmhigtlxu001k141vuvchz2i4	cmfgpklkn000114lt1n0ec61k	LABOR	2	参与互评	cmhig5a250003141vy1jnjkhu	2025-11-03 01:32:36.307
cmhigw5zy001p141vwbqodw7p	cmhc7jd8w0006x7g1c2qc46o4	TRUST	-10	游戏被举报处理：每日8小时深度睡眠提升	cmhig5a250003141vy1jnjkhu	2025-11-03 01:34:35.615
cmhigw604001r141vtuhgkj64	cmh36n1zs0005td07t6m368m7	LABOR	5	成功举报违规游戏：每日8小时深度睡眠提升	cmhig5a250003141vy1jnjkhu	2025-11-03 01:34:35.621
cmhigz2jy0023141vxuxdmb6z	cmh36n1zs0005td07t6m368m7	PARTICIPATION	10	创建游戏	cmhigz2jf001z141v5012hxhq	2025-11-03 01:36:51.119
cmhigzpnh0029141vrrt2l9f4	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	5	参与游戏	cmhigz2jf001z141v5012hxhq	2025-11-03 01:37:21.053
cmhihatoy002s141vdydw3oy0	cmh36n1zs0005td07t6m368m7	TRUST	-10	游戏被举报处理：每日运动挑战 举报测试	cmhigz2jf001z141v5012hxhq	2025-11-03 01:45:59.506
cmhihatp5002u141vr6w35pgh	cmh4rbv470000d3m0tokxkudd	LABOR	5	成功举报违规游戏：每日运动挑战 举报测试	cmhigz2jf001z141v5012hxhq	2025-11-03 01:45:59.513
cmhiljan700051lqov2x802ba	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	10	创建游戏	cmhiljamh00011lqo3ytmay2u	2025-11-03 03:44:33.187
cmhilmace000b1lqokgq420n8	cmhcc8p1o000atqgxpzkeao00	PARTICIPATION	10	创建游戏	cmhilmabz00071lqopqqkiukc	2025-11-03 03:46:52.767
cmhilmxbp000h1lqoxhyragkq	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmhilmabz00071lqopqqkiukc	2025-11-03 03:47:22.549
cmhilwnsr000r1lqowec5odqr	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhilwns7000n1lqo98yhab6d	2025-11-03 03:54:56.763
cmhilxfe9000x1lqokvonroab	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhilxfdx000t1lqotcq44kxe	2025-11-03 03:55:32.53
cmhily11x00131lqon7ypht7i	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	5	参与游戏	cmhilxfdx000t1lqotcq44kxe	2025-11-03 03:56:00.597
cmhioy1cx001b1lqot5gikd69	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhioy1cc00171lqofc2l8wzh	2025-11-03 05:19:59.841
cmhioyy9p001h1lqoxv902rxc	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhioyy9e001d1lqo18tjeok0	2025-11-03 05:20:42.494
cmhiozkis001n1lqojbrzb29e	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	5	参与游戏	cmhioy1cc00171lqofc2l8wzh	2025-11-03 05:21:11.333
cmhipc8tj001x1lqojfxjm8oc	cmhc7jd8w0006x7g1c2qc46o4	TRUST	-7	被他人认定违约	cmhioy1cc00171lqofc2l8wzh	2025-11-03 05:31:02.696
cmhipc8tr001z1lqo8otu5uvq	cmhc7jd8w0006x7g1c2qc46o4	LABOR	2	参与互评	cmhioy1cc00171lqofc2l8wzh	2025-11-03 05:31:02.704
cmhipc8ty00211lqo47zjsj5v	cmhc7jd8w0006x7g1c2qc46o4	LABOR	5	提交高质量证据	cmhioy1cc00171lqofc2l8wzh	2025-11-03 05:31:02.71
cmhipc8uw00231lqoin3rkiey	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	14	完成游戏	cmhioy1cc00171lqofc2l8wzh	2025-11-03 05:31:02.745
cmhipc8v900251lqoe2tzx4zr	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	完美履约奖励	cmhioy1cc00171lqofc2l8wzh	2025-11-03 05:31:02.757
cmhipc8vm00271lqohexu49ga	cmfgpklkn000114lt1n0ec61k	TRUST	2	被他人认可履约	cmhioy1cc00171lqofc2l8wzh	2025-11-03 05:31:02.77
cmhipc8vr00291lqo6pqouqql	cmfgpklkn000114lt1n0ec61k	LABOR	2	参与互评	cmhioy1cc00171lqofc2l8wzh	2025-11-03 05:31:02.776
cmhipc8vw002b1lqoxco4c3mt	cmfgpklkn000114lt1n0ec61k	LABOR	5	提交高质量证据	cmhioy1cc00171lqofc2l8wzh	2025-11-03 05:31:02.78
cmhipj6fe002h1lqody5bt1l4	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhipj6ev002d1lqogsziidg6	2025-11-03 05:36:26.186
cmhipjqh6002n1lqob8g8ja2f	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	5	参与游戏	cmhipj6ev002d1lqogsziidg6	2025-11-03 05:36:52.171
cmhjgzgqn0005117afexnh9dn	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhjgzgq20001117aa962fuhz	2025-11-03 18:24:55.679
cmhjgzu1l000b117a71lxvu71	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmhjgzgq20001117aa962fuhz	2025-11-03 18:25:12.922
cmhjh2b94000j117aj9psrjk1	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhjh2b8f000f117a9xkmo4nx	2025-11-03 18:27:08.536
cmhjhcqkj000r117aswkhgwmd	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhjhcqjv000n117a9w8ktzly	2025-11-03 18:35:14.948
cmhjiptt50005c344j6mdsnzx	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhjiptsm0001c3444oz0v7qf	2025-11-03 19:13:25.29
cmhjiw7lk000bc3447qkw89t8	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmhjiptsm0001c3444oz0v7qf	2025-11-03 19:18:23.097
cmhjjotd8000lc344aoggm98s	cmhcegfin0006hcgendh83z40	TRUST	-7	被他人认定违约	cmhjiptsm0001c3444oz0v7qf	2025-11-03 19:40:37.676
cmhjjotdg000nc344dbtkz83h	cmhcegfin0006hcgendh83z40	LABOR	2	参与互评	cmhjiptsm0001c3444oz0v7qf	2025-11-03 19:40:37.684
cmhjjotdm000pc344eei9u79w	cmhcegfin0006hcgendh83z40	LABOR	5	提交高质量证据	cmhjiptsm0001c3444oz0v7qf	2025-11-03 19:40:37.69
cmhjjotej000rc344oti1ezws	cmfgpklkn000114lt1n0ec61k	TRUST	-7	被他人认定违约	cmhjiptsm0001c3444oz0v7qf	2025-11-03 19:40:37.723
cmhjjotep000tc3444a42i334	cmfgpklkn000114lt1n0ec61k	LABOR	2	参与互评	cmhjiptsm0001c3444oz0v7qf	2025-11-03 19:40:37.729
cmhjjoteu000vc344dj5kwacg	cmfgpklkn000114lt1n0ec61k	LABOR	5	提交高质量证据	cmhjiptsm0001c3444oz0v7qf	2025-11-03 19:40:37.734
cmhjvpkt200059i0quzu58cuc	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhjvpkrz00019i0qdft4463a	2025-11-04 01:17:08.63
cmhjvpyk0000b9i0qrj8h5qf7	cmgxdqce80000108q18y4npo0	PARTICIPATION	5	参与游戏	cmhjvpkrz00019i0qdft4463a	2025-11-04 01:17:26.448
cmhjvs7pn000j9i0qnrxwgzvh	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhjvs7p8000f9i0qetbysww4	2025-11-04 01:19:11.627
cmhjvyicn000r9i0qvr8nrhl4	cmgxdqce80000108q18y4npo0	TRUST	-7	被他人认定违约	cmhjvpkrz00019i0qdft4463a	2025-11-04 01:24:05.352
cmhjvyid2000t9i0qbo52hyn4	cmgxdqce80000108q18y4npo0	LABOR	2	参与互评	cmhjvpkrz00019i0qdft4463a	2025-11-04 01:24:05.367
cmhjvyidf000v9i0qdda59g9a	cmgxdqce80000108q18y4npo0	LABOR	5	提交高质量证据	cmhjvpkrz00019i0qdft4463a	2025-11-04 01:24:05.379
cmhjvyife000x9i0qdmrsp1lw	cmhcegfin0006hcgendh83z40	PARTICIPATION	16	完成游戏	cmhjvpkrz00019i0qdft4463a	2025-11-04 01:24:05.451
cmhjvyig5000z9i0q0n7nq4gu	cmhcegfin0006hcgendh83z40	PARTICIPATION	6	完美履约奖励	cmhjvpkrz00019i0qdft4463a	2025-11-04 01:24:05.478
cmhjvyih000119i0q3kxblc62	cmhcegfin0006hcgendh83z40	TRUST	2	被他人认可履约	cmhjvpkrz00019i0qdft4463a	2025-11-04 01:24:05.509
cmhjvyihc00139i0qet9ul0sd	cmhcegfin0006hcgendh83z40	LABOR	2	参与互评	cmhjvpkrz00019i0qdft4463a	2025-11-04 01:24:05.521
cmhjvyihm00159i0qyllx70ts	cmhcegfin0006hcgendh83z40	LABOR	5	提交高质量证据	cmhjvpkrz00019i0qdft4463a	2025-11-04 01:24:05.531
cmhjwgmdv001b9i0qhwjop7hp	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhjwgmd300179i0qimtlfz3o	2025-11-04 01:38:10.387
cmhjwh222001h9i0qnjryxtfz	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	参与游戏	cmhjwgmd300179i0qimtlfz3o	2025-11-04 01:38:30.698
cmhjwqneo001r9i0qc19zooyk	cmh36n1zs0005td07t6m368m7	PARTICIPATION	12	完成游戏	cmhjwgmd300179i0qimtlfz3o	2025-11-04 01:45:58.273
cmhjwqnfm001t9i0qpj5z7ns4	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	完美履约奖励	cmhjwgmd300179i0qimtlfz3o	2025-11-04 01:45:58.306
cmhjwqngi001v9i0q2ecgvj6i	cmh36n1zs0005td07t6m368m7	TRUST	2	被他人认可履约	cmhjwgmd300179i0qimtlfz3o	2025-11-04 01:45:58.338
cmhjwqngu001x9i0q4wwlgoll	cmh36n1zs0005td07t6m368m7	LABOR	2	参与互评	cmhjwgmd300179i0qimtlfz3o	2025-11-04 01:45:58.35
cmhjwqnh5001z9i0qyoycjn83	cmh36n1zs0005td07t6m368m7	LABOR	5	提交高质量证据	cmhjwgmd300179i0qimtlfz3o	2025-11-04 01:45:58.362
cmhjwqnki00219i0qzfqk5eu6	cmhcegfin0006hcgendh83z40	PARTICIPATION	15	完成游戏	cmhjwgmd300179i0qimtlfz3o	2025-11-04 01:45:58.482
cmhjwqnl800239i0qnchcxmot	cmhcegfin0006hcgendh83z40	PARTICIPATION	6	完美履约奖励	cmhjwgmd300179i0qimtlfz3o	2025-11-04 01:45:58.508
cmhjwqnm100259i0qdsmposug	cmhcegfin0006hcgendh83z40	TRUST	2	被他人认可履约	cmhjwgmd300179i0qimtlfz3o	2025-11-04 01:45:58.537
cmhjwqnmj00279i0qu3rj4o8w	cmhcegfin0006hcgendh83z40	LABOR	2	参与互评	cmhjwgmd300179i0qimtlfz3o	2025-11-04 01:45:58.555
cmhjwqnmx00299i0q4kbsk25g	cmhcegfin0006hcgendh83z40	LABOR	5	提交高质量证据	cmhjwgmd300179i0qimtlfz3o	2025-11-04 01:45:58.569
cmhjyd14n0005ch4v2shlexdq	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhjyd13y0001ch4vxd2urp0e	2025-11-04 02:31:22.103
cmhk76pxr0003p1dnl9feszt3	cmhcegfin0006hcgendh83z40	PARTICIPATION	16	完成游戏	cmhjgzgq20001117aa962fuhz	2025-11-04 06:38:24.207
cmhk76py80005p1dn9w1tisg5	cmhcegfin0006hcgendh83z40	PARTICIPATION	6	完美履约奖励	cmhjgzgq20001117aa962fuhz	2025-11-04 06:38:24.224
cmhk76pym0007p1dn2y51mtpc	cmhcegfin0006hcgendh83z40	TRUST	2	被他人认可履约	cmhjgzgq20001117aa962fuhz	2025-11-04 06:38:24.238
cmhk76pz40009p1dno4w0i7wm	cmhcegfin0006hcgendh83z40	LABOR	2	参与互评	cmhjgzgq20001117aa962fuhz	2025-11-04 06:38:24.257
cmhk76pzd000bp1dn98oe36vt	cmhcegfin0006hcgendh83z40	LABOR	5	提交高质量证据	cmhjgzgq20001117aa962fuhz	2025-11-04 06:38:24.265
cmhk76pzx000dp1dnfv2zwxsr	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	早起完成奖励	cmhjgzgq20001117aa962fuhz	2025-11-04 06:38:24.285
cmhk76q0m000fp1dn604q65l1	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	13	完成游戏	cmhjgzgq20001117aa962fuhz	2025-11-04 06:38:24.31
cmhk76q12000hp1dn6fpsvgdg	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	完美履约奖励	cmhjgzgq20001117aa962fuhz	2025-11-04 06:38:24.326
cmhk76q1j000jp1dn45h0ryv8	cmfgpklkn000114lt1n0ec61k	TRUST	2	被他人认可履约	cmhjgzgq20001117aa962fuhz	2025-11-04 06:38:24.343
cmhk76q1z000lp1dnd2lssl13	cmfgpklkn000114lt1n0ec61k	LABOR	2	参与互评	cmhjgzgq20001117aa962fuhz	2025-11-04 06:38:24.36
cmhk76q29000np1dnvtqv9orf	cmfgpklkn000114lt1n0ec61k	LABOR	5	提交高质量证据	cmhjgzgq20001117aa962fuhz	2025-11-04 06:38:24.369
cmhk76q2y000pp1dnx45mr8y1	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	早起完成奖励	cmhjgzgq20001117aa962fuhz	2025-11-04 06:38:24.395
cmhk7abf6000vp1dni2cgkufy	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhk7abeh000rp1dn46fy94jn	2025-11-04 06:41:12.018
cmhk7akza0011p1dnw2uhvacz	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	参与游戏	cmhk7abeh000rp1dn46fy94jn	2025-11-04 06:41:24.406
cmhk7iri5001bp1dnw8bq5wu8	cmhcegfin0006hcgendh83z40	TRUST	-7	被他人认定违约	cmhk7abeh000rp1dn46fy94jn	2025-11-04 06:47:46.109
cmhk7irik001dp1dnb702hlyw	cmhcegfin0006hcgendh83z40	LABOR	2	参与互评	cmhk7abeh000rp1dn46fy94jn	2025-11-04 06:47:46.124
cmhk7iriq001fp1dnf16ghwly	cmhcegfin0006hcgendh83z40	LABOR	5	提交高质量证据	cmhk7abeh000rp1dn46fy94jn	2025-11-04 06:47:46.13
cmhk7irjm001hp1dnu9c4wpkh	cmfgpklkn000114lt1n0ec61k	TRUST	-9	被他人认定违约	cmhk7abeh000rp1dn46fy94jn	2025-11-04 06:47:46.162
cmhk7irjt001jp1dnt8s3jzuj	cmfgpklkn000114lt1n0ec61k	LABOR	2	参与互评	cmhk7abeh000rp1dn46fy94jn	2025-11-04 06:47:46.169
cmhk7irjz001lp1dno2td8nf6	cmfgpklkn000114lt1n0ec61k	LABOR	5	提交高质量证据	cmhk7abeh000rp1dn46fy94jn	2025-11-04 06:47:46.175
cmhl1l1em0005qg349pir0h8i	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhl1l1e10001qg34m9nbge0i	2025-11-04 20:49:20.734
cmhl1leay000bqg34kxpjhi4q	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	参与游戏	cmhl1l1e10001qg34m9nbge0i	2025-11-04 20:49:37.45
cmhl1rk3o000lqg34au166h5f	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhl1rk30000hqg34pw4lht4v	2025-11-04 20:54:24.9
cmhl1uad7000rqg34ihhxs6tf	cmh36n1zs0005td07t6m368m7	PARTICIPATION	10	创建游戏	cmhl1uacq000nqg34wu04xwvn	2025-11-04 20:56:32.251
cmhl1ujjc000xqg34qe4m2f1e	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	参与游戏	cmhl1uacq000nqg34wu04xwvn	2025-11-04 20:56:44.137
cmhl1uuhv0013qg34kqowwg63	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmhl1uacq000nqg34wu04xwvn	2025-11-04 20:56:58.339
cmhl2btvh001qqg34ixvnsdx1	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhl2btuq001mqg348jq0sk3v	2025-11-04 21:10:10.686
cmhl2c9yn001wqg34u4ra22o4	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	参与游戏	cmhl2btuq001mqg348jq0sk3v	2025-11-04 21:10:31.535
cmhl2cnsg0022qg34j2myj5vr	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	5	参与游戏	cmhl2btuq001mqg348jq0sk3v	2025-11-04 21:10:49.456
cmhl7esty000572stu1yn638e	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhl7estf000172ste4gw6ufs	2025-11-04 23:32:27.382
cmhl7esvk000a72stvhmrd5wb	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	100	成就奖励: 积分新星	\N	2025-11-04 23:32:27.441
cmhl7f7na000i72stmnf6i2m3	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	5	参与游戏	cmhl7estf000172ste4gw6ufs	2025-11-04 23:32:46.583
cmhl7fh2b000o72stzhbctpvt	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	参与游戏	cmhl7estf000172ste4gw6ufs	2025-11-04 23:32:58.787
cmhl7fqkk000u72stjgjxntq2	cmgxzbcqh0000hak2a2jt0wwa	PARTICIPATION	5	参与游戏	cmhl7estf000172ste4gw6ufs	2025-11-04 23:33:11.109
cmhl7fz8k001072stsltwrw1n	cmfiilojw000ao5ubr1d3vfk0	PARTICIPATION	5	参与游戏	cmhl7estf000172ste4gw6ufs	2025-11-04 23:33:22.34
cmhl7g93j001672st6cew8asy	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmhl7estf000172ste4gw6ufs	2025-11-04 23:33:35.119
cmhl7had2001a72stvbww6yrb	cmhcegfin0006hcgendh83z40	PARTICIPATION	-5	退出游戏	cmhl7estf000172ste4gw6ufs	2025-11-04 23:34:23.414
cmhl7hcs5001g72stjr7t0vqe	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmhl7estf000172ste4gw6ufs	2025-11-04 23:34:26.549
cmhl9juwu002172strfluxn3p	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhl9juw3001x72st1a9aci7j	2025-11-05 00:32:22.591
cmhl9k2ks002772stirntvruj	cmgxdqce80000108q18y4npo0	PARTICIPATION	5	参与游戏	cmhl9juw3001x72st1a9aci7j	2025-11-05 00:32:32.524
cmhl9kbio002d72st9n7h2jid	cmfiilojw000ao5ubr1d3vfk0	PARTICIPATION	5	参与游戏	cmhl9juw3001x72st1a9aci7j	2025-11-05 00:32:44.112
cmhl9zr6i002x72st0fkixk83	cmfiilojw000ao5ubr1d3vfk0	TRUST	-1	被他人认定违约	cmhl9juw3001x72st1a9aci7j	2025-11-05 00:44:44.25
cmhl9zr6r002z72stgwz6hn6a	cmfiilojw000ao5ubr1d3vfk0	LABOR	2	参与互评	cmhl9juw3001x72st1a9aci7j	2025-11-05 00:44:44.259
cmhl9zr6y003172stz7z9pku2	cmfiilojw000ao5ubr1d3vfk0	LABOR	5	提交高质量证据	cmhl9juw3001x72st1a9aci7j	2025-11-05 00:44:44.267
cmhl9zr7v003372st9qokkga2	cmgxdqce80000108q18y4npo0	PARTICIPATION	13	完成游戏	cmhl9juw3001x72st1a9aci7j	2025-11-05 00:44:44.3
cmhl9zr8b003572stvephhktp	cmgxdqce80000108q18y4npo0	PARTICIPATION	5	完美履约奖励	cmhl9juw3001x72st1a9aci7j	2025-11-05 00:44:44.315
cmhl9zr8o003772st4p1fbuse	cmgxdqce80000108q18y4npo0	TRUST	3	被他人认可履约	cmhl9juw3001x72st1a9aci7j	2025-11-05 00:44:44.328
cmhl9zr8u003972stwvn1y03d	cmgxdqce80000108q18y4npo0	LABOR	2	参与互评	cmhl9juw3001x72st1a9aci7j	2025-11-05 00:44:44.334
cmhl9zr8z003b72stka7lkvx2	cmgxdqce80000108q18y4npo0	LABOR	5	提交高质量证据	cmhl9juw3001x72st1a9aci7j	2025-11-05 00:44:44.339
cmhl9zr9g003d72st7ta3ssdy	cmgxdqce80000108q18y4npo0	PARTICIPATION	10	新手鼓励奖励	cmhl9juw3001x72st1a9aci7j	2025-11-05 00:44:44.356
cmhl9zrca003f72stlmiz077y	cmhcegfin0006hcgendh83z40	PARTICIPATION	17	完成游戏	cmhl9juw3001x72st1a9aci7j	2025-11-05 00:44:44.458
cmhl9zrcy003h72stunykpm82	cmhcegfin0006hcgendh83z40	PARTICIPATION	7	完美履约奖励	cmhl9juw3001x72st1a9aci7j	2025-11-05 00:44:44.482
cmhl9zrda003j72strchte6jq	cmhcegfin0006hcgendh83z40	TRUST	3	被他人认可履约	cmhl9juw3001x72st1a9aci7j	2025-11-05 00:44:44.495
cmhl9zrdf003l72stu2vpjsmw	cmhcegfin0006hcgendh83z40	LABOR	2	参与互评	cmhl9juw3001x72st1a9aci7j	2025-11-05 00:44:44.5
cmhl9zrdl003n72st2xso70ps	cmhcegfin0006hcgendh83z40	LABOR	5	提交高质量证据	cmhl9juw3001x72st1a9aci7j	2025-11-05 00:44:44.505
cmhlabhik003t72st446c9ozg	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhlabhi0003p72stcmydpbw1	2025-11-05 00:53:51.596
cmhlabro2003z72stmrcc5aq9	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmhlabhi0003p72stcmydpbw1	2025-11-05 00:54:04.755
cmhlbnrib004a72stplfu0ke7	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhlbnrhr004672stj3oz6a8s	2025-11-05 01:31:24.035
cmhlbo14y004g72stn752pfvh	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	参与游戏	cmhlbnrhr004672stj3oz6a8s	2025-11-05 01:31:36.515
cmhlbuo9g0007hru42p58svrn	cmh36n1zs0005td07t6m368m7	PARTICIPATION	13	完成游戏	cmhlbnrhr004672stj3oz6a8s	2025-11-05 01:36:46.421
cmhlbuo9w0009hru4pujwkkd0	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	完美履约奖励	cmhlbnrhr004672stj3oz6a8s	2025-11-05 01:36:46.437
cmhlbuoa9000bhru4xhn88ylp	cmh36n1zs0005td07t6m368m7	TRUST	3	被他人认可履约	cmhlbnrhr004672stj3oz6a8s	2025-11-05 01:36:46.45
cmhlbuoag000dhru4l05yo5yh	cmh36n1zs0005td07t6m368m7	LABOR	2	参与互评	cmhlbnrhr004672stj3oz6a8s	2025-11-05 01:36:46.456
cmhlbuoal000fhru4a9pega0b	cmh36n1zs0005td07t6m368m7	LABOR	5	提交高质量证据	cmhlbnrhr004672stj3oz6a8s	2025-11-05 01:36:46.461
cmhlbuoc1000hhru40siof054	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhlbnrhr004672stj3oz6a8s	2025-11-05 01:36:46.514
cmhlbuoc7000jhru4ka3q81j4	cmhcegfin0006hcgendh83z40	LABOR	2	参与互评	cmhlbnrhr004672stj3oz6a8s	2025-11-05 01:36:46.52
cmhlbuoce000lhru4heafne49	cmhcegfin0006hcgendh83z40	LABOR	5	提交高质量证据	cmhlbnrhr004672stj3oz6a8s	2025-11-05 01:36:46.526
cmhlc414j000rhru4kz43u0lb	cmh36n1zs0005td07t6m368m7	PARTICIPATION	10	创建游戏	cmhlc4142000nhru4cnixqecy	2025-11-05 01:44:02.995
cmhlc4dnn000xhru4sltr4aoq	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmhlc4142000nhru4cnixqecy	2025-11-05 01:44:19.236
cmhlccyqq0018hru4wnuuy6bp	cmh36n1zs0005td07t6m368m7	PARTICIPATION	10	创建游戏	cmhlccyqa0014hru4yzzp5owk	2025-11-05 01:50:59.811
cmhlfwbql001ghru4odeleejf	cmh36n1zs0005td07t6m368m7	PARTICIPATION	10	创建游戏	cmhlfwbp9001chru4iqqmzmtt	2025-11-05 03:30:01.966
cmhlfwnyy001mhru4gtgnqstp	cmgxdqce80000108q18y4npo0	PARTICIPATION	5	参与游戏	cmhlfwbp9001chru4iqqmzmtt	2025-11-05 03:30:17.818
cmhlg9nyf0005tnfe9hqtmz15	cmh36n1zs0005td07t6m368m7	PARTICIPATION	10	创建游戏	cmhlg9nxr0001tnfeswd6oimc	2025-11-05 03:40:24.328
cmhlga01x000btnfery6qd57p	cmgxdqce80000108q18y4npo0	PARTICIPATION	5	参与游戏	cmhlg9nxr0001tnfeswd6oimc	2025-11-05 03:40:40.006
cmhlgidi4000ttnfe1f0hoxlm	cmgxdqce80000108q18y4npo0	PARTICIPATION	12	完成游戏	cmhlg9nxr0001tnfeswd6oimc	2025-11-05 03:47:10.684
cmhlgidii000vtnfe5ix95u6d	cmgxdqce80000108q18y4npo0	PARTICIPATION	5	完美履约奖励	cmhlg9nxr0001tnfeswd6oimc	2025-11-05 03:47:10.699
cmhlgidiv000xtnfewk2ocqib	cmgxdqce80000108q18y4npo0	TRUST	3	被他人认可履约	cmhlg9nxr0001tnfeswd6oimc	2025-11-05 03:47:10.711
cmhlgidj1000ztnfevod1k2jp	cmgxdqce80000108q18y4npo0	LABOR	2	参与互评	cmhlg9nxr0001tnfeswd6oimc	2025-11-05 03:47:10.717
cmhlgidj70011tnfeai61vong	cmgxdqce80000108q18y4npo0	LABOR	5	提交高质量证据	cmhlg9nxr0001tnfeswd6oimc	2025-11-05 03:47:10.723
cmhlgidle0013tnfe2k1yfltj	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhlg9nxr0001tnfeswd6oimc	2025-11-05 03:47:10.803
cmhlgidlq0015tnfe2b86504t	cmh36n1zs0005td07t6m368m7	LABOR	2	参与互评	cmhlg9nxr0001tnfeswd6oimc	2025-11-05 03:47:10.815
cmhlgidm10017tnfeym6lz4jx	cmh36n1zs0005td07t6m368m7	LABOR	5	提交高质量证据	cmhlg9nxr0001tnfeswd6oimc	2025-11-05 03:47:10.825
cmhlkweqj00053fyjubsn2stf	cmh36n1zs0005td07t6m368m7	PARTICIPATION	10	创建游戏	cmhlkweq000013fyjouplwznl	2025-11-05 05:50:03.931
cmhlkwxe9000b3fyjxmnondu9	cmhcc8p1o000atqgxpzkeao00	PARTICIPATION	5	参与游戏	cmhlkweq000013fyjouplwznl	2025-11-05 05:50:28.114
cmhll5bdy000l3fyjw7z9dbaa	cmh36n1zs0005td07t6m368m7	PARTICIPATION	10	创建游戏	cmhll5bdg000h3fyj3z9xvcfw	2025-11-05 05:56:59.494
cmhll9iuq000r3fyj395yv9s7	cmh36n1zs0005td07t6m368m7	PARTICIPATION	10	创建游戏	cmhll9iu1000n3fyjb4itb587	2025-11-05 06:00:15.794
cmhll9wng000x3fyj4ljcbh0l	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmhll9iu1000n3fyjb4itb587	2025-11-05 06:00:33.677
cmhllhvv300193fyjgvav1tcg	cmh36n1zs0005td07t6m368m7	PARTICIPATION	10	创建游戏	cmhllhvuo00153fyj7ja4ix5h	2025-11-05 06:06:45.904
cmhlljruh001f3fyjz1cyq1ze	cmh36n1zs0005td07t6m368m7	PARTICIPATION	10	创建游戏	cmhlljrtz001b3fyju6ayec2i	2025-11-05 06:08:14.009
cmhllk5kv001l3fyjfdwcbuc8	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmhlljrtz001b3fyju6ayec2i	2025-11-05 06:08:31.807
cmhllybki00223fyj8xn00ptd	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	10	创建游戏	cmhllybk0001y3fyj4uqheq07	2025-11-05 06:19:32.755
cmhllybln00263fyjumgu4cj9	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	50	成就奖励: 老用户	\N	2025-11-05 06:19:32.796
cmhllybm3002c3fyjdd3hybif	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	100	成就奖励: 积分新星	\N	2025-11-05 06:19:32.811
cmhllziij002k3fyjlibjuueg	cmh36n1zs0005td07t6m368m7	PARTICIPATION	10	创建游戏	cmhllzihs002g3fyj6m6t6crl	2025-11-05 06:20:28.411
cmhllzvc6002q3fyjypanusnb	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmhllzihs002g3fyj6m6t6crl	2025-11-05 06:20:45.03
cmhlpyzwn00323fyj64xdph90	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhlpyzw3002y3fyjy4vg3c83	2025-11-05 08:12:02.759
cmhlpzjrq00383fyj31weg3bw	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	参与游戏	cmhlpyzw3002y3fyjy4vg3c83	2025-11-05 08:12:28.502
cmhlq17p2003g3fyjizvttump	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhlq17og003c3fyj8h5z28xz	2025-11-05 08:13:46.166
cmhlr4ww60005wmw3js8vs91q	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhlr4wvo0001wmw3757svafo	2025-11-05 08:44:38.407
cmhlr6bdk000bwmw39nh3kq81	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhlr6bcx0007wmw3merpt6qo	2025-11-05 08:45:43.832
cmhlr97wd000hwmw3gys8wd6n	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	参与游戏	cmhlr6bcx0007wmw3merpt6qo	2025-11-05 08:47:59.293
cmhm7rhk20005xx9r8z8lybya	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhm7rhjg0001xx9r4hvuxlhx	2025-11-05 16:30:05.474
cmhm7rvxc000bxx9r64ptww0a	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	参与游戏	cmhm7rhjg0001xx9r4hvuxlhx	2025-11-05 16:30:24.096
cmhm81spb000lxx9r23doiz0c	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhm81sot000hxx9rte0dloku	2025-11-05 16:38:06.479
cmhm9a14u000sxx9ros8lffqx	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhm9a14e000oxx9r09t1fl2e	2025-11-05 17:12:30.271
cmhm9g12y000yxx9r5c73kcmn	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhm9g12c000uxx9ry2rqybn8	2025-11-05 17:17:10.138
cmhm9gan10014xx9rrncmyiiz	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	参与游戏	cmhm9g12c000uxx9ry2rqybn8	2025-11-05 17:17:22.525
cmhma8m7d0005lrhrec2ujvs7	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhma8m6q0001lrhroynygux4	2025-11-05 17:39:23.881
cmhmaeqs3000blrhr6whd2jun	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhmaeqrm0007lrhrg653ddrs	2025-11-05 17:44:09.747
cmhmaizcc000hlrhr6digxjbt	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhmaizbw000dlrhroj4npjg7	2025-11-05 17:47:27.469
cmhmaja5j000nlrhr8m8fzn09	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	参与游戏	cmhmaizbw000dlrhroj4npjg7	2025-11-05 17:47:41.479
cmhmbelxn0005xsketj5no9ay	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhmbelwy0001xskel3wdmqba	2025-11-05 18:12:03.083
cmhmbewzg000bxskeiocnu72g	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	参与游戏	cmhmbelwy0001xskel3wdmqba	2025-11-05 18:12:17.404
cmhmhl68n0005h5w494g0zw5f	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhmhl67p0001h5w42mdl7qi1	2025-11-05 21:05:07.031
cmhmhliwy000bh5w4yngq1e6c	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmhmhl67p0001h5w42mdl7qi1	2025-11-05 21:05:23.458
cmhmhlqm3000hh5w4k3dipo7p	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	参与游戏	cmhmhl67p0001h5w42mdl7qi1	2025-11-05 21:05:33.436
cmhmhlzl2000nh5w4tgq52d4k	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	5	参与游戏	cmhmhl67p0001h5w42mdl7qi1	2025-11-05 21:05:45.063
cmhmick1v000529id16r5a8ca	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhmick19000129id11sb2sv2	2025-11-05 21:26:24.644
cmhmicuhl000b29idu1dmveo8	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	5	参与游戏	cmhmick19000129id11sb2sv2	2025-11-05 21:26:38.169
cmhmizjuz00056cwikimuself	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhmizjud00016cwiogot6jzu	2025-11-05 21:44:17.483
cmhmj02dz000b6cwicmqzyyxr	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	参与游戏	cmhmizjud00016cwiogot6jzu	2025-11-05 21:44:41.496
cmhmkkmxq0005i4ham87m53g9	cmh24ml660003td0740yexg8h	PARTICIPATION	10	创建游戏	cmhmkkmx60001i4haupa9ek4r	2025-11-05 22:28:40.863
cmhmkkxs9000bi4ha6oh002ou	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmhmkkmx60001i4haupa9ek4r	2025-11-05 22:28:54.922
cmhmlf1zl0005ngzi3lmr5d13	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhmlf1yw0001ngziqwf0kifk	2025-11-05 22:52:20.049
cmhmlfbha000bngzifjbbpmz7	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	5	参与游戏	cmhmlf1yw0001ngziqwf0kifk	2025-11-05 22:52:32.35
cmhmlfk5d000hngzi5xwjm9dc	cmgxzbcqh0000hak2a2jt0wwa	PARTICIPATION	5	参与游戏	cmhmlf1yw0001ngziqwf0kifk	2025-11-05 22:52:43.586
cmhmlfsyv000nngziv1amazlw	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	参与游戏	cmhmlf1yw0001ngziqwf0kifk	2025-11-05 22:52:55.015
cmhn6r2gc0005p0dyohx2vzuj	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhn6r2ft0001p0dyvc3096qy	2025-11-06 08:49:32.461
cmhn6rcer000bp0dywtbdtd29	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	5	参与游戏	cmhn6r2ft0001p0dyvc3096qy	2025-11-06 08:49:45.364
cmhn6rohk000hp0dywd165sir	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	参与游戏	cmhn6r2ft0001p0dyvc3096qy	2025-11-06 08:50:01.016
cmhn6rxi5000np0dyc48a70sx	cmgxdqce80000108q18y4npo0	PARTICIPATION	5	参与游戏	cmhn6r2ft0001p0dyvc3096qy	2025-11-06 08:50:12.701
cmhn6s66d000tp0dyydo0agj7	cmgxzbcqh0000hak2a2jt0wwa	PARTICIPATION	5	参与游戏	cmhn6r2ft0001p0dyvc3096qy	2025-11-06 08:50:23.941
cmhn6sfnl000zp0dy304p1p8c	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	参与游戏	cmhn6r2ft0001p0dyvc3096qy	2025-11-06 08:50:36.225
cmhn6ssmf0015p0dy13x0mgoa	cmh8axnya000me17r1py1t2xm	PARTICIPATION	5	参与游戏	cmhn6r2ft0001p0dyvc3096qy	2025-11-06 08:50:53.031
cmhnb8920000jkw1jyrrjvn23	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	10	创建游戏	cmhnb891d000fkw1j09az9ccn	2025-11-06 10:54:52.632
cmhnb8imq000pkw1j61op1w6v	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	参与游戏	cmhnb891d000fkw1j09az9ccn	2025-11-06 10:55:05.042
cmhnbfgtu0011kw1jwx1091bb	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhmizjud00016cwiogot6jzu	2025-11-06 11:00:29.298
cmhnbfguu0013kw1j7bdwawho	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhmizjud00016cwiogot6jzu	2025-11-06 11:00:29.335
cmhnbj4pq001fkw1jeyyrdhbb	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	16	完成游戏	cmhnb891d000fkw1j09az9ccn	2025-11-06 11:03:20.222
cmhnbj4qa001hkw1ja21h57rt	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	7	完美履约奖励	cmhnb891d000fkw1j09az9ccn	2025-11-06 11:03:20.243
cmhnbj4qs001jkw1jxdstqrnn	cmfgpklkn000114lt1n0ec61k	TRUST	3	被他人认可履约	cmhnb891d000fkw1j09az9ccn	2025-11-06 11:03:20.26
cmhnbj4qz001lkw1jrupule2g	cmfgpklkn000114lt1n0ec61k	LABOR	2	参与互评	cmhnb891d000fkw1j09az9ccn	2025-11-06 11:03:20.268
cmhnbj4r7001nkw1jb7i0eu9v	cmfgpklkn000114lt1n0ec61k	LABOR	5	提交高质量证据	cmhnb891d000fkw1j09az9ccn	2025-11-06 11:03:20.275
cmhnbj4s2001pkw1j9gico20b	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	28	完成游戏	cmhnb891d000fkw1j09az9ccn	2025-11-06 11:03:20.307
cmhnbj4sg001rkw1j2z781o38	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	11	完美履约奖励	cmhnb891d000fkw1j09az9ccn	2025-11-06 11:03:20.32
cmhnbj4su001tkw1jokfzzib2	cmfhsxf490000lmmnwp77vl6x	TRUST	3	被他人认可履约	cmhnb891d000fkw1j09az9ccn	2025-11-06 11:03:20.335
cmhnbj4t1001vkw1jkehx2pn4	cmfhsxf490000lmmnwp77vl6x	LABOR	2	参与互评	cmhnb891d000fkw1j09az9ccn	2025-11-06 11:03:20.341
cmhnbj4td001xkw1jc9uv5cgm	cmfhsxf490000lmmnwp77vl6x	LABOR	5	提交高质量证据	cmhnb891d000fkw1j09az9ccn	2025-11-06 11:03:20.353
cmhohdd540009eo2umn41mk3v	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 06:34:35.08
cmhohdrg8000feo2ug5fquf5n	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 06:34:53.625
cmhohe3v0000leo2uw2tqkxvt	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	参与游戏	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 06:35:09.709
cmhohechi000reo2utyecesxn	cmgxdqce80000108q18y4npo0	PARTICIPATION	5	参与游戏	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 06:35:20.886
cmhohen4q000xeo2uglldfmgo	cmfiilojw000ao5ubr1d3vfk0	PARTICIPATION	5	参与游戏	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 06:35:34.682
cmhohf1wo0013eo2un6f64t4d	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	5	参与游戏	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 06:35:53.832
cmhohtc7q002aeo2u21p0oa7d	cmh36n1zs0005td07t6m368m7	PARTICIPATION	10	创建游戏	cmhohtc750026eo2uynzst7dh	2025-11-07 06:47:00.374
cmhohtre3002geo2ua7tkgeb8	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmhohtc750026eo2uynzst7dh	2025-11-07 06:47:20.043
cmhokd2ix002qeo2ubd5ziiku	cmfiilojw000ao5ubr1d3vfk0	PARTICIPATION	21	完成游戏	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.169
cmhokd2jg002seo2uoa9x09b0	cmfiilojw000ao5ubr1d3vfk0	PARTICIPATION	8	完美履约奖励	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.188
cmhokd2ju002ueo2uqvab9dnz	cmfiilojw000ao5ubr1d3vfk0	TRUST	3	被他人认可履约	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.202
cmhokd2k1002weo2u5en6zjxh	cmfiilojw000ao5ubr1d3vfk0	LABOR	2	参与互评	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.209
cmhokd2k8002yeo2umhsphzei	cmfiilojw000ao5ubr1d3vfk0	LABOR	5	提交高质量证据	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.216
cmhokd2kv0030eo2uiq9sv30o	cmfiilojw000ao5ubr1d3vfk0	PARTICIPATION	5	早起完成奖励	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.239
cmhokd2lg0032eo2um33y87y6	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.26
cmhokd2lm0034eo2u2rlwbvuf	cmh36n1zs0005td07t6m368m7	LABOR	2	参与互评	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.266
cmhokd2ls0036eo2ucgxtewle	cmh36n1zs0005td07t6m368m7	LABOR	5	提交高质量证据	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.272
cmhokd2mk0038eo2u3a9x8e9p	cmgxdqce80000108q18y4npo0	TRUST	-1	被他人认定违约	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.3
cmhokd2mp003aeo2ujtr1e1el	cmgxdqce80000108q18y4npo0	LABOR	5	提交高质量证据	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.306
cmhokd2ni003ceo2u1qnmqdq0	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.335
cmhokd2no003eeo2uxyzhvwrs	cmhcegfin0006hcgendh83z40	LABOR	2	参与互评	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.341
cmhokd2nv003geo2u2dvk9rzz	cmhcegfin0006hcgendh83z40	LABOR	5	提交高质量证据	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.347
cmhokd2or003ieo2u5go1mjnx	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	16	完成游戏	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.379
cmhokd2p6003keo2utcimhdel	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	6	完美履约奖励	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.394
cmhokd2pk003meo2ur8i03udr	cmfgpklkn000114lt1n0ec61k	TRUST	3	被他人认可履约	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.408
cmhokd2pw003oeo2uz3jxif0k	cmfgpklkn000114lt1n0ec61k	LABOR	5	提交高质量证据	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.42
cmhokd2qc003qeo2uktkabtgy	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	早起完成奖励	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.436
cmhokd2qx003seo2ucih63279	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	17	完成游戏	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.457
cmhokd2rb003ueo2u14l1d0ib	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	7	完美履约奖励	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.471
cmhokd2ro003weo2ueoc45rma	cmhc7jd8w0006x7g1c2qc46o4	TRUST	3	被他人认可履约	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.484
cmhokd2ru003yeo2uh7f9j48j	cmhc7jd8w0006x7g1c2qc46o4	LABOR	5	提交高质量证据	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.49
cmhokd2sc0040eo2uebgjt9hh	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	5	早起完成奖励	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 07:58:20.508
cmhokfd1b0044eo2uhlczg12d	cmhcegfin0006hcgendh83z40	TRUST	3	成功申诉	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 08:00:07.103
cmhokfd1o0046eo2uqc0umu8d	cmfhsxf490000lmmnwp77vl6x	LABOR	15	协助仲裁案件	cmhohdd4k0005eo2u4adsj5lp	2025-11-07 08:00:07.117
cmhokfu6l0048eo2ufyqi22mr	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhohtc750026eo2uynzst7dh	2025-11-07 08:00:29.325
cmhokfu7e004aeo2uo17gagus	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhohtc750026eo2uynzst7dh	2025-11-07 08:00:29.355
cmhokgwau004geo2uirzmtfnp	cmhcegfin0006hcgendh83z40	LABOR	10	提供有效争议证据	cmhohtc750026eo2uynzst7dh	2025-11-07 08:01:18.726
cmhokob7x004ieo2uhom8l5rt	cmfhsxf490000lmmnwp77vl6x	LABOR	15	协助仲裁案件	cmhnb891d000fkw1j09az9ccn	2025-11-07 08:07:04.653
cmhokp908004keo2u0o9t5tvk	cmfhsxf490000lmmnwp77vl6x	LABOR	15	协助仲裁案件	cmhohtc750026eo2uynzst7dh	2025-11-07 08:07:48.44
cmholuz9c004seo2ufxoigecs	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmholuz8l004oeo2ux4k76e13	2025-11-07 08:40:15.361
cmholvbmw004yeo2uhjwukem8	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	5	参与游戏	cmholuz8l004oeo2ux4k76e13	2025-11-07 08:40:31.4
cmholvl5f0054eo2uji6z8u9v	cmfgpmfbo000314ltz0jj7n1y	PARTICIPATION	5	参与游戏	cmholuz8l004oeo2ux4k76e13	2025-11-07 08:40:43.732
cmholvt7y005aeo2ulahprw40	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	参与游戏	cmholuz8l004oeo2ux4k76e13	2025-11-07 08:40:54.19
cmholw8xl005geo2u31af4ax4	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmholuz8l004oeo2ux4k76e13	2025-11-07 08:41:14.553
cmhooezjq0001dvi6uaemzzhr	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmholuz8l004oeo2ux4k76e13	2025-11-07 09:51:48.086
cmhooezku0003dvi6ip42kv85	cmfgpmfbo000314ltz0jj7n1y	TRUST	-1	被他人认定违约	cmholuz8l004oeo2ux4k76e13	2025-11-07 09:51:48.126
cmhooezll0005dvi6zntg5zuq	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmholuz8l004oeo2ux4k76e13	2025-11-07 09:51:48.154
cmhooeznq0007dvi6kenhc3cp	cmhc7jd8w0006x7g1c2qc46o4	TRUST	-1	被他人认定违约	cmholuz8l004oeo2ux4k76e13	2025-11-07 09:51:48.23
cmhooezoq0009dvi6eelgesbl	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmholuz8l004oeo2ux4k76e13	2025-11-07 09:51:48.267
cmhooodvi000pdvi6y6y7pvqm	cmhcegfin0006hcgendh83z40	PARTICIPATION	10	创建游戏	cmhooodux000ldvi6x4x66lmg	2025-11-07 09:59:06.558
cmhooophc000vdvi68cv3un0x	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	参与游戏	cmhooodux000ldvi6x4x66lmg	2025-11-07 09:59:21.6
cmhoooxyq0011dvi6pqv74ty2	cmgxdqce80000108q18y4npo0	PARTICIPATION	5	参与游戏	cmhooodux000ldvi6x4x66lmg	2025-11-07 09:59:32.595
cmhooq7k90017dvi6c9lwke0g	cmgxzbcqh0000hak2a2jt0wwa	PARTICIPATION	5	参与游戏	cmhooodux000ldvi6x4x66lmg	2025-11-07 10:00:31.69
cmhpbeuu6001odvi6vxnpq3ku	cmgxdqce80000108q18y4npo0	TRUST	-1	被他人认定违约	cmhooodux000ldvi6x4x66lmg	2025-11-07 20:35:33.15
cmhpbeuv7001qdvi68ner6180	cmgxzbcqh0000hak2a2jt0wwa	TRUST	-1	被他人认定违约	cmhooodux000ldvi6x4x66lmg	2025-11-07 20:35:33.188
cmhpbeuw2001sdvi6phgsne8z	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhooodux000ldvi6x4x66lmg	2025-11-07 20:35:33.218
cmhpbeuwv001udvi644t1bs1k	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhooodux000ldvi6x4x66lmg	2025-11-07 20:35:33.248
cmhpbg1fj0024dvi638qh2aqg	cmgxzbcqh0000hak2a2jt0wwa	TRUST	3	成功申诉	cmhooodux000ldvi6x4x66lmg	2025-11-07 20:36:28.351
cmhpbg1fr0026dvi6v3cxuqe5	cmgxdqce80000108q18y4npo0	TRUST	-5	恶意争议败诉	cmhooodux000ldvi6x4x66lmg	2025-11-07 20:36:28.359
cmhpbg1g70028dvi6z9gap2y4	cmfhsxf490000lmmnwp77vl6x	LABOR	15	协助仲裁案件	cmhooodux000ldvi6x4x66lmg	2025-11-07 20:36:28.375
cmhpbicq8002qdvi6a58rcu2x	cmfhsxf490000lmmnwp77vl6x	LABOR	15	协助仲裁案件	cmhooodux000ldvi6x4x66lmg	2025-11-07 20:38:16.304
cmhpbjfkz0038dvi6dnyuzl7m	cmhcegfin0006hcgendh83z40	TRUST	-5	恶意争议败诉	cmhooodux000ldvi6x4x66lmg	2025-11-07 20:39:06.659
cmhpbjflc003advi6o44oprkx	cmfhsxf490000lmmnwp77vl6x	LABOR	15	协助仲裁案件	cmhooodux000ldvi6x4x66lmg	2025-11-07 20:39:06.672
cmhpbkfz3003sdvi6x3lfwcwu	cmfhsxf490000lmmnwp77vl6x	LABOR	15	协助仲裁案件	cmhooodux000ldvi6x4x66lmg	2025-11-07 20:39:53.824
cmhpbroiw004cdvi6ggvyq9se	cmgxdqce80000108q18y4npo0	LABOR	10	提供有效争议证据	cmhooodux000ldvi6x4x66lmg	2025-11-07 20:45:31.496
cmhpcblec004hdvi6nzzn2zqj	cmgxdqce80000108q18y4npo0	TRUST	-1	被他人认定违约	cmhlg9nxr0001tnfeswd6oimc	2025-11-07 21:01:00.565
cmhpcbleo004jdvi6pnmm9uao	cmgxdqce80000108q18y4npo0	LABOR	2	参与互评	cmhlg9nxr0001tnfeswd6oimc	2025-11-07 21:01:00.576
cmhpcblfm004ldvi6eikjijwi	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhlg9nxr0001tnfeswd6oimc	2025-11-07 21:01:00.61
cmhpcblfs004ndvi6arvx4va8	cmh36n1zs0005td07t6m368m7	LABOR	2	参与互评	cmhlg9nxr0001tnfeswd6oimc	2025-11-07 21:01:00.616
cmhpdh7qf004zdvi637yvqv1o	cmhc7jd8w0006x7g1c2qc46o4	TRUST	-1	被他人认定违约	cmhl7estf000172ste4gw6ufs	2025-11-07 21:33:22.407
cmhpdh7rh0051dvi6ruthvdkg	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhl7estf000172ste4gw6ufs	2025-11-07 21:33:22.446
cmhpdh7sf0053dvi63ox5qil4	cmgxzbcqh0000hak2a2jt0wwa	TRUST	-1	被他人认定违约	cmhl7estf000172ste4gw6ufs	2025-11-07 21:33:22.48
cmhpdh7tc0055dvi63jlrmn0b	cmfiilojw000ao5ubr1d3vfk0	TRUST	-1	被他人认定违约	cmhl7estf000172ste4gw6ufs	2025-11-07 21:33:22.512
cmhpdh7u80057dvi6gtnwkbqk	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhl7estf000172ste4gw6ufs	2025-11-07 21:33:22.544
cmhpdh7ug0059dvi671qainq0	cmhcegfin0006hcgendh83z40	LABOR	2	参与互评	cmhl7estf000172ste4gw6ufs	2025-11-07 21:33:22.552
cmhpdh7vj005bdvi66pkyja29	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmhl7estf000172ste4gw6ufs	2025-11-07 21:33:22.591
cmikw82qr0009123kk913zq3j	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmfzrgl3f00012tw32obb730j	2025-11-29 22:59:00.196
cmikw82sn000b123ky0l90j6w	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmg228mp0000l7sa2x10rfit8	2025-11-29 22:59:00.263
cmikw82uo000d123kjkzhzlg7	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhm7rhjg0001xx9r4hvuxlhx	2025-11-29 22:59:00.336
cmikw82vk000f123kq6uv7nln	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmhm7rhjg0001xx9r4hvuxlhx	2025-11-29 22:59:00.368
cmikw82x5000h123k9bv18y7d	cmfgpmfbo000314ltz0jj7n1y	TRUST	-1	被他人认定违约	cmfuydo8w00029isa7gi8qtp8	2025-11-29 22:59:00.426
cmikw82yr000j123kxvjfmg11	cmfhsxf490000lmmnwp77vl6x	TRUST	-1	被他人认定违约	cmfuyvpzc000n9isava0zsvl4	2025-11-29 22:59:00.484
cmikw830j000l123k3qixafzw	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmhjgzgq20001117aa962fuhz	2025-11-29 22:59:00.548
cmikw830q000n123kln4cmfew	cmfgpklkn000114lt1n0ec61k	LABOR	2	参与互评	cmhjgzgq20001117aa962fuhz	2025-11-29 22:59:00.554
cmikw831n000p123kga22ckjt	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhjgzgq20001117aa962fuhz	2025-11-29 22:59:00.588
cmikw831u000r123kdy7mby1w	cmhcegfin0006hcgendh83z40	LABOR	2	参与互评	cmhjgzgq20001117aa962fuhz	2025-11-29 22:59:00.594
cmikw834c000t123kmt2zqlj0	cmfiilojw000ao5ubr1d3vfk0	TRUST	-1	被他人认定违约	cmhl9juw3001x72st1a9aci7j	2025-11-29 22:59:00.684
cmikw834k000v123krj6isnc5	cmfiilojw000ao5ubr1d3vfk0	LABOR	2	参与互评	cmhl9juw3001x72st1a9aci7j	2025-11-29 22:59:00.692
cmikw835i000x123kmr2ch57q	cmgxdqce80000108q18y4npo0	TRUST	-1	被他人认定违约	cmhl9juw3001x72st1a9aci7j	2025-11-29 22:59:00.726
cmikw835q000z123koik2hw77	cmgxdqce80000108q18y4npo0	LABOR	2	参与互评	cmhl9juw3001x72st1a9aci7j	2025-11-29 22:59:00.734
cmikw836l0011123k5ovww1lw	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhl9juw3001x72st1a9aci7j	2025-11-29 22:59:00.765
cmikw836s0013123kzjig27id	cmhcegfin0006hcgendh83z40	LABOR	2	参与互评	cmhl9juw3001x72st1a9aci7j	2025-11-29 22:59:00.772
cmikw838i0015123k10wjb8ud	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	13	完成游戏	cmhmick19000129id11sb2sv2	2025-11-29 22:59:00.834
cmikw838y0017123kqspivzdf	cmhc7jd8w0006x7g1c2qc46o4	TRUST	2	被他人认可履约	cmhmick19000129id11sb2sv2	2025-11-29 22:59:00.85
cmikw83950019123krpedoxwg	cmhc7jd8w0006x7g1c2qc46o4	LABOR	5	提交高质量证据	cmhmick19000129id11sb2sv2	2025-11-29 22:59:00.857
cmikw839o001b123kxlicszwn	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	3	周末坚持奖励	cmhmick19000129id11sb2sv2	2025-11-29 22:59:00.876
cmikw839w001d123keb07evq3	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	8	月末冲刺奖励	cmhmick19000129id11sb2sv2	2025-11-29 22:59:00.884
cmikw83am001f123kv06zyvij	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhmick19000129id11sb2sv2	2025-11-29 22:59:00.911
cmikw83cd001h123kj5z7v1fi	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmhmaizbw000dlrhroj4npjg7	2025-11-29 22:59:00.973
cmikw83dp001j123ke58dfa3d	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhmaizbw000dlrhroj4npjg7	2025-11-29 22:59:01.021
cmikw83fr001l123kgurasx2d	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhlkweq000013fyjouplwznl	2025-11-29 22:59:01.096
cmikw83gx001n123kwunxxe9e	cmhcc8p1o000atqgxpzkeao00	TRUST	-1	被他人认定违约	cmhlkweq000013fyjouplwznl	2025-11-29 22:59:01.138
cmikw83in001p123krypwi5ta	cmfgpmfbo000314ltz0jj7n1y	TRUST	-1	被他人认定违约	cmfuyff36000g9isakmxjcmr5	2025-11-29 22:59:01.2
cmikw83ld001r123klbslmzu5	cmfgpjvmb000014ltuwk3uwht	TRUST	-1	被他人认定违约	cmfhqcmch000p8y89n79410wa	2025-11-29 22:59:01.297
cmikw83m8001t123kxtc8nwgu	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmfhqcmch000p8y89n79410wa	2025-11-29 22:59:01.328
cmikw83n7001v123kv22d1v0s	cmfgplidl000214ltrltpgf6s	TRUST	-1	被他人认定违约	cmfhqcmch000p8y89n79410wa	2025-11-29 22:59:01.363
cmikw83o8001x123kf74aj0ms	cmfgpmfbo000314ltz0jj7n1y	TRUST	-1	被他人认定违约	cmfhqcmch000p8y89n79410wa	2025-11-29 22:59:01.4
cmikw83pe001z123kfm5552mo	cmfhqg9mg001k8y89kdji8pwn	TRUST	-1	被他人认定违约	cmfhqcmch000p8y89n79410wa	2025-11-29 22:59:01.442
cmikw83pm0021123kvtehbtlh	cmfhqg9mg001k8y89kdji8pwn	LABOR	2	参与互评	cmfhqcmch000p8y89n79410wa	2025-11-29 22:59:01.45
cmikw83qf0023123khy25yosf	cmfhqhbdo001p8y89uh5fot7e	TRUST	-1	被他人认定违约	cmfhqcmch000p8y89n79410wa	2025-11-29 22:59:01.48
cmikw83s00025123k4nvbkyj8	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmg2bbjr80001hbraujzmuv8o	2025-11-29 22:59:01.536
cmikw83u10027123k57s53fd5	cmh24ml660003td0740yexg8h	TRUST	-1	被他人认定违约	cmhmkkmx60001i4haupa9ek4r	2025-11-29 22:59:01.61
cmikw83ue0029123kl6r6pn6x	cmh24ml660003td0740yexg8h	LABOR	5	提交高质量证据	cmhmkkmx60001i4haupa9ek4r	2025-11-29 22:59:01.622
cmikw83vh002b123kdhay8dlz	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhmkkmx60001i4haupa9ek4r	2025-11-29 22:59:01.662
cmikw83vq002d123k90lnykix	cmhcegfin0006hcgendh83z40	LABOR	5	提交高质量证据	cmhmkkmx60001i4haupa9ek4r	2025-11-29 22:59:01.67
cmikw83xd002f123k1vos70b8	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmfuzsf8w00119isa4t5mlh68	2025-11-29 22:59:01.729
cmikw83yq002h123kig7k9hbk	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmfuteq6c000g24jj0ol98br2	2025-11-29 22:59:01.778
cmikw840c002j123kdd40lblg	cmfgpmfbo000314ltz0jj7n1y	TRUST	-1	被他人认定违约	cmfhq60vo00018y89c4tyvorz	2025-11-29 22:59:01.837
cmikw8422002l123kf7k085tq	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmfplita1000824jj8rtck0ti	2025-11-29 22:59:01.899
cmikw843r002n123khx9spr8o	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmfjq31050007az4kfbucjcdq	2025-11-29 22:59:01.959
cmikw845n002p123kj1868uyl	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmgz2t7ng003210ifn0txseqw	2025-11-29 22:59:02.027
cmikw846l002r123k8lh94uxy	cmh4rbv470000d3m0tokxkudd	TRUST	-1	被他人认定违约	cmgz2t7ng003210ifn0txseqw	2025-11-29 22:59:02.062
cmikw8485002t123koe9dt45b	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmhl1l1e10001qg34m9nbge0i	2025-11-29 22:59:02.117
cmikw8497002v123k2k1ou1pc	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhl1l1e10001qg34m9nbge0i	2025-11-29 22:59:02.155
cmikw84ap002x123kwgybebx6	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhll9iu1000n3fyjb4itb587	2025-11-29 22:59:02.209
cmikw84bm002z123klmo9905b	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhll9iu1000n3fyjb4itb587	2025-11-29 22:59:02.243
cmikw84d40031123kcpn87kwl	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmh82pxe60001e17r153xo76x	2025-11-29 22:59:02.296
cmikw84e10033123kntijw68l	cmh4rbv470000d3m0tokxkudd	TRUST	-1	被他人认定违约	cmh82pxe60001e17r153xo76x	2025-11-29 22:59:02.33
cmikw84ft0035123ktobf8cyu	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhlr6bcx0007wmw3merpt6qo	2025-11-29 22:59:02.394
cmikw84gu0037123kfpjktk1b	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhlr6bcx0007wmw3merpt6qo	2025-11-29 22:59:02.43
cmikw84ij0039123kro8iqo8p	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmh7d62rh0013d3m0dz4vmtub	2025-11-29 22:59:02.491
cmikw84iq003b123kv6spqf82	cmfgpklkn000114lt1n0ec61k	LABOR	2	参与互评	cmh7d62rh0013d3m0dz4vmtub	2025-11-29 22:59:02.499
cmikw84jo003d123k38mn2fp2	cmh4rbv470000d3m0tokxkudd	TRUST	-1	被他人认定违约	cmh7d62rh0013d3m0dz4vmtub	2025-11-29 22:59:02.532
cmikw84la003f123kr3az4f94	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmha8evok0001117uv95wftcx	2025-11-29 22:59:02.591
cmikw84m8003h123k6lsku41w	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmha8evok0001117uv95wftcx	2025-11-29 22:59:02.625
cmikw84nk003j123k7astmkvu	cmfhqhbdo001p8y89uh5fot7e	TRUST	-1	被他人认定违约	cmfign35x00098ulaq227751c	2025-11-29 22:59:02.672
cmikw84p3003l123kz110ok8k	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmhcefdvh0001hcgeng4yry82	2025-11-29 22:59:02.727
cmikw84px003n123k61hrgfv5	cmhcc8p1o000atqgxpzkeao00	TRUST	-1	被他人认定违约	cmhcefdvh0001hcgeng4yry82	2025-11-29 22:59:02.757
cmikw84qq003p123k4ifjkrtf	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhcefdvh0001hcgeng4yry82	2025-11-29 22:59:02.786
cmikw84s8003r123kbaqkilzk	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmhipj6ev002d1lqogsziidg6	2025-11-29 22:59:02.841
cmikw84sg003t123kc9y2rpt9	cmfgpklkn000114lt1n0ec61k	LABOR	2	参与互评	cmhipj6ev002d1lqogsziidg6	2025-11-29 22:59:02.848
cmikw84tg003v123kjbfdstiz	cmhc7jd8w0006x7g1c2qc46o4	TRUST	-1	被他人认定违约	cmhipj6ev002d1lqogsziidg6	2025-11-29 22:59:02.885
cmikw84ux003x123k5xajp0lj	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmgyrzuo4000h9bn906tapny5	2025-11-29 22:59:02.937
cmikw84vr003z123kcn3axlxo	cmh4rbv470000d3m0tokxkudd	TRUST	-1	被他人认定违约	cmgyrzuo4000h9bn906tapny5	2025-11-29 22:59:02.968
cmikw84xi0041123kontkg3hh	cmgxdqce80000108q18y4npo0	TRUST	-1	被他人认定违约	cmhjvpkrz00019i0qdft4463a	2025-11-29 22:59:03.03
cmikw84xq0043123kzwykexjl	cmgxdqce80000108q18y4npo0	LABOR	2	参与互评	cmhjvpkrz00019i0qdft4463a	2025-11-29 22:59:03.038
cmikw84ym0045123kvfbvf1rf	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhjvpkrz00019i0qdft4463a	2025-11-29 22:59:03.071
cmikw84yu0047123kv3t5eh7s	cmhcegfin0006hcgendh83z40	LABOR	2	参与互评	cmhjvpkrz00019i0qdft4463a	2025-11-29 22:59:03.078
cmikw850f0049123k1efomz97	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmhl2btuq001mqg348jq0sk3v	2025-11-29 22:59:03.136
cmikw851d004b123knhnl3xyw	cmhc7jd8w0006x7g1c2qc46o4	TRUST	-1	被他人认定违约	cmhl2btuq001mqg348jq0sk3v	2025-11-29 22:59:03.169
cmikw852a004d123kw9dr58hc	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhl2btuq001mqg348jq0sk3v	2025-11-29 22:59:03.203
cmikw8542004f123kspyi3abr	cmfgpmfbo000314ltz0jj7n1y	TRUST	-1	被他人认定违约	cmfuyetx500099isac841d0t3	2025-11-29 22:59:03.266
cmikw855n004h123kyscijf32	cmh4rbv470000d3m0tokxkudd	TRUST	-1	被他人认定违约	cmhcngomk00016na98db1vqr5	2025-11-29 22:59:03.323
cmikw856i004j123kfnkogtq2	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhcngomk00016na98db1vqr5	2025-11-29 22:59:03.354
cmikw8580004l123k2x5reko1	cmfhqg9mg001k8y89kdji8pwn	TRUST	-1	被他人认定违约	cmfignse8000f8ulax88ui5ce	2025-11-29 22:59:03.409
cmikw859f004n123kct8ufgy9	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmfjq47jk000daz4kzzebykah	2025-11-29 22:59:03.459
cmikw85b6004p123kxteqiyvt	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmhlabhi0003p72stcmydpbw1	2025-11-29 22:59:03.523
cmikw85c1004r123kt4z1qe12	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhlabhi0003p72stcmydpbw1	2025-11-29 22:59:03.554
cmikw85dd004t123kq4mg9uys	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmfyqm0ag001g9isas5eaxm5e	2025-11-29 22:59:03.601
cmikw85et004v123k37du6my6	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmhilxfdx000t1lqotcq44kxe	2025-11-29 22:59:03.653
cmikw85fo004x123k2vk3s51e	cmhc7jd8w0006x7g1c2qc46o4	TRUST	-1	被他人认定违约	cmhilxfdx000t1lqotcq44kxe	2025-11-29 22:59:03.685
cmikw85hb004z123kjk1p228m	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmgzbxdny005210ifvm38tk4a	2025-11-29 22:59:03.743
cmikw85i80051123kz8sinf7d	cmh4rbv470000d3m0tokxkudd	TRUST	-1	被他人认定违约	cmgzbxdny005210ifvm38tk4a	2025-11-29 22:59:03.777
cmikw85k00053123k7oeyzbhc	cmfgpjvmb000014ltuwk3uwht	TRUST	-1	被他人认定违约	cmfhq8bgr000j8y89g2lakoac	2025-11-29 22:59:03.84
cmikw85kx0055123kv6nahqdh	cmfgplidl000214ltrltpgf6s	TRUST	-1	被他人认定违约	cmfhq8bgr000j8y89g2lakoac	2025-11-29 22:59:03.874
cmikw85lp0057123k73r5g9hx	cmfgpmfbo000314ltz0jj7n1y	TRUST	-1	被他人认定违约	cmfhq8bgr000j8y89g2lakoac	2025-11-29 22:59:03.902
cmikw85mg0059123k2lh6s762	cmfhqhbdo001p8y89uh5fot7e	TRUST	-1	被他人认定违约	cmfhq8bgr000j8y89g2lakoac	2025-11-29 22:59:03.929
cmikw85nt005b123kramc6a2u	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmflzh4ka000124jjoxctvu86	2025-11-29 22:59:03.977
cmikw85pf005d123k9kinkupd	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhlbnrhr004672stj3oz6a8s	2025-11-29 22:59:04.035
cmikw85pm005f123kwhsi4wom	cmh36n1zs0005td07t6m368m7	LABOR	2	参与互评	cmhlbnrhr004672stj3oz6a8s	2025-11-29 22:59:04.042
cmikw85qf005h123k12l652tn	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhlbnrhr004672stj3oz6a8s	2025-11-29 22:59:04.072
cmikw85qm005j123kue7nbblk	cmhcegfin0006hcgendh83z40	LABOR	2	参与互评	cmhlbnrhr004672stj3oz6a8s	2025-11-29 22:59:04.078
cmikw85rx005l123kcjwspiee	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmfzrsy4l000d2tw3wt5whs5i	2025-11-29 22:59:04.126
cmikw85ta005n123ky8spzswz	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmhmbelwy0001xskel3wdmqba	2025-11-29 22:59:04.174
cmikw85u5005p123k00p28t6c	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhmbelwy0001xskel3wdmqba	2025-11-29 22:59:04.205
cmikw85vq005r123kvriivk9n	cmfgpjvmb000014ltuwk3uwht	TRUST	-1	被他人认定违约	cmfhq6xoa000d8y89mv90gi3f	2025-11-29 22:59:04.262
cmikw85xf005t123kgh5sj2vz	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmha0rtnl000ln9uthxseclb3	2025-11-29 22:59:04.324
cmikw85ye005v123ke2101d7b	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmha0rtnl000ln9uthxseclb3	2025-11-29 22:59:04.358
cmikw85zx005x123kzoykmmo1	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhllzihs002g3fyj6m6t6crl	2025-11-29 22:59:04.414
cmikw8611005z123kr1rz0bp7	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhllzihs002g3fyj6m6t6crl	2025-11-29 22:59:04.454
cmikw862r0061123kklhszqra	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhlljrtz001b3fyju6ayec2i	2025-11-29 22:59:04.515
cmikw863l0063123kqk9k0c8g	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhlljrtz001b3fyju6ayec2i	2025-11-29 22:59:04.546
cmikw864u0065123k5tse79pn	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmfjq2cam0001az4knhimbwj3	2025-11-29 22:59:04.591
cmikw86690067123ki858pa8v	cmh4rbv470000d3m0tokxkudd	TRUST	-1	被他人认定违约	cmhcbwt110001tqgxj3frn3i8	2025-11-29 22:59:04.642
cmikw86750069123kkqv96qog	cmhc7jd8w0006x7g1c2qc46o4	TRUST	-1	被他人认定违约	cmhcbwt110001tqgxj3frn3i8	2025-11-29 22:59:04.674
cmikw868n006b123kvl592ecc	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmfhq6fnn00078y89ear6ausw	2025-11-29 22:59:04.727
cmikw86a9006d123kocm9x5qw	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmfyqnpxt001n9isaa0gg32w9	2025-11-29 22:59:04.785
cmikw86b6006f123kq38fmdq2	cmfiilojw000ao5ubr1d3vfk0	TRUST	-1	被他人认定违约	cmfyqnpxt001n9isaa0gg32w9	2025-11-29 22:59:04.818
cmikw86ck006h123k7hofmwey	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmhm9g12c000uxx9ry2rqybn8	2025-11-29 22:59:04.868
cmikw86dd006j123kszmidwyc	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhm9g12c000uxx9ry2rqybn8	2025-11-29 22:59:04.897
cmikw86f5006l123koh7jitbx	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	12	完成游戏	cmhmhl67p0001h5w42mdl7qi1	2025-11-29 22:59:04.961
cmikw86fj006n123kms6nfzl0	cmfgpklkn000114lt1n0ec61k	TRUST	2	被他人认可履约	cmhmhl67p0001h5w42mdl7qi1	2025-11-29 22:59:04.976
cmikw86fq006p123k1s3hl7ln	cmfgpklkn000114lt1n0ec61k	LABOR	2	参与互评	cmhmhl67p0001h5w42mdl7qi1	2025-11-29 22:59:04.983
cmikw86fy006r123k67n75g88	cmfgpklkn000114lt1n0ec61k	LABOR	5	提交高质量证据	cmhmhl67p0001h5w42mdl7qi1	2025-11-29 22:59:04.99
cmikw86gq006t123kzb8d4leh	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	3	周末坚持奖励	cmhmhl67p0001h5w42mdl7qi1	2025-11-29 22:59:05.018
cmikw86gy006v123kiy21tce8	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	8	月末冲刺奖励	cmhmhl67p0001h5w42mdl7qi1	2025-11-29 22:59:05.026
cmikw86hk006x123khl55tkh1	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhmhl67p0001h5w42mdl7qi1	2025-11-29 22:59:05.049
cmikw86hr006z123kwff2xadt	cmh36n1zs0005td07t6m368m7	LABOR	5	提交高质量证据	cmhmhl67p0001h5w42mdl7qi1	2025-11-29 22:59:05.056
cmikw86il0071123k27uk9ql9	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	14	完成游戏	cmhmhl67p0001h5w42mdl7qi1	2025-11-29 22:59:05.085
cmikw86iz0073123kph7w89aq	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	6	完美履约奖励	cmhmhl67p0001h5w42mdl7qi1	2025-11-29 22:59:05.099
cmikw86jd0075123k3pl5ocj9	cmhc7jd8w0006x7g1c2qc46o4	TRUST	3	被他人认可履约	cmhmhl67p0001h5w42mdl7qi1	2025-11-29 22:59:05.113
cmikw86jk0077123kmy5y3zj8	cmhc7jd8w0006x7g1c2qc46o4	LABOR	5	提交高质量证据	cmhmhl67p0001h5w42mdl7qi1	2025-11-29 22:59:05.12
cmikw86k00079123ktw941b47	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	3	周末坚持奖励	cmhmhl67p0001h5w42mdl7qi1	2025-11-29 22:59:05.136
cmikw86k6007b123kwke2gn72	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION	8	月末冲刺奖励	cmhmhl67p0001h5w42mdl7qi1	2025-11-29 22:59:05.142
cmikw86kp007d123kvn8d776u	cmhcegfin0006hcgendh83z40	PARTICIPATION	12	完成游戏	cmhmhl67p0001h5w42mdl7qi1	2025-11-29 22:59:05.161
cmikw86l2007f123kbypxcrne	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	完美履约奖励	cmhmhl67p0001h5w42mdl7qi1	2025-11-29 22:59:05.174
cmikw86lg007h123knl69xn62	cmhcegfin0006hcgendh83z40	TRUST	3	被他人认可履约	cmhmhl67p0001h5w42mdl7qi1	2025-11-29 22:59:05.188
cmikw86ln007j123kr5oxmapb	cmhcegfin0006hcgendh83z40	LABOR	5	提交高质量证据	cmhmhl67p0001h5w42mdl7qi1	2025-11-29 22:59:05.195
cmikw86m6007l123klhibrwub	cmhcegfin0006hcgendh83z40	PARTICIPATION	3	周末坚持奖励	cmhmhl67p0001h5w42mdl7qi1	2025-11-29 22:59:05.214
cmikw86mc007n123kct24hrzp	cmhcegfin0006hcgendh83z40	PARTICIPATION	8	月末冲刺奖励	cmhmhl67p0001h5w42mdl7qi1	2025-11-29 22:59:05.221
cmikw86nl007p123khxvoeo8q	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmfuzf4db000u9isa9si4797a	2025-11-29 22:59:05.265
cmikw86q5007s123k0nr8ide6	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmhl1uacq000nqg34wu04xwvn	2025-11-29 22:59:05.358
cmikw86qg007u123kj75hvqzo	cmfgpklkn000114lt1n0ec61k	LABOR	2	参与互评	cmhl1uacq000nqg34wu04xwvn	2025-11-29 22:59:05.368
cmikw86ra007w123k5exawhzc	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhl1uacq000nqg34wu04xwvn	2025-11-29 22:59:05.398
cmikw86ri007y123kecssga2e	cmh36n1zs0005td07t6m368m7	LABOR	2	参与互评	cmhl1uacq000nqg34wu04xwvn	2025-11-29 22:59:05.407
cmikw86sh0080123kgrh5lof9	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhl1uacq000nqg34wu04xwvn	2025-11-29 22:59:05.442
cmikw86so0082123k1u76x0wc	cmhcegfin0006hcgendh83z40	LABOR	2	参与互评	cmhl1uacq000nqg34wu04xwvn	2025-11-29 22:59:05.448
cmikw86uo0084123k9no49scm	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	27	完成游戏	cmhmlf1yw0001ngziqwf0kifk	2025-11-29 22:59:05.52
cmikw86v30086123ktd2hjoxb	cmfhsxf490000lmmnwp77vl6x	TRUST	2	被他人认可履约	cmhmlf1yw0001ngziqwf0kifk	2025-11-29 22:59:05.535
cmikw86v90088123k5pkfq4lm	cmfhsxf490000lmmnwp77vl6x	LABOR	5	提交高质量证据	cmhmlf1yw0001ngziqwf0kifk	2025-11-29 22:59:05.542
cmikw86vq008a123kv0qh423a	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	3	周末坚持奖励	cmhmlf1yw0001ngziqwf0kifk	2025-11-29 22:59:05.559
cmikw86vx008c123klhgjx0fq	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	8	月末冲刺奖励	cmhmlf1yw0001ngziqwf0kifk	2025-11-29 22:59:05.566
cmikw86wi008e123kv34ry8lm	cmgxzbcqh0000hak2a2jt0wwa	TRUST	-1	被他人认定违约	cmhmlf1yw0001ngziqwf0kifk	2025-11-29 22:59:05.587
cmikw86wr008g123k4ogf7oon	cmgxzbcqh0000hak2a2jt0wwa	LABOR	5	提交高质量证据	cmhmlf1yw0001ngziqwf0kifk	2025-11-29 22:59:05.595
cmikw86xn008i123k5w7mj03c	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhmlf1yw0001ngziqwf0kifk	2025-11-29 22:59:05.628
cmikw86xu008k123k7g7d1ckd	cmh36n1zs0005td07t6m368m7	LABOR	5	提交高质量证据	cmhmlf1yw0001ngziqwf0kifk	2025-11-29 22:59:05.634
cmikw86yt008m123k2e3vof0q	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhmlf1yw0001ngziqwf0kifk	2025-11-29 22:59:05.669
cmikw86z0008o123kvi249tn3	cmhcegfin0006hcgendh83z40	LABOR	5	提交高质量证据	cmhmlf1yw0001ngziqwf0kifk	2025-11-29 22:59:05.677
cmikw870l008q123kimf0qfhk	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhlpyzw3002y3fyjy4vg3c83	2025-11-29 22:59:05.733
cmikw871h008s123khwob9quu	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhlpyzw3002y3fyjy4vg3c83	2025-11-29 22:59:05.765
cmikw8734008u123k099cxttx	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmg2bc7310007hbraewf0rmyh	2025-11-29 22:59:05.824
cmikw874o008w123kaam8jac9	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmhawi4tt0001xe90c0e883k6	2025-11-29 22:59:05.88
cmikw875h008y123k6j07ho8s	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhawi4tt0001xe90c0e883k6	2025-11-29 22:59:05.909
cmikw876v0090123kejmt7uxc	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmgh2myao000112etmu7ae4mr	2025-11-29 22:59:05.959
cmikw87b10093123krn0nfwet	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhlc4142000nhru4cnixqecy	2025-11-29 22:59:06.11
cmikw87bu0095123ki0hg4c92	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhlc4142000nhru4cnixqecy	2025-11-29 22:59:06.138
cmikw87d60097123krli5w31y	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cmfzrhoe400072tw3d8te4hwn	2025-11-29 22:59:06.186
cmikw87ek0099123keemahlcv	cmhcc8p1o000atqgxpzkeao00	TRUST	-1	被他人认定违约	cmhilmabz00071lqopqqkiukc	2025-11-29 22:59:06.236
cmikw87f9009b123kk0csdggx	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmhilmabz00071lqopqqkiukc	2025-11-29 22:59:06.262
cmikwjnd6000254kicxx00sn4	cmgxdqce80000108q18y4npo0	TRUST	-1	被他人认定违约	cmhlfwbp9001chru4iqqmzmtt	2025-11-29 23:08:00.138
cmikwjndj000454kinbh0mhui	cmgxdqce80000108q18y4npo0	LABOR	2	参与互评	cmhlfwbp9001chru4iqqmzmtt	2025-11-29 23:08:00.151
cmikwjner000654kii05rlgnf	cmh36n1zs0005td07t6m368m7	TRUST	-1	被他人认定违约	cmhlfwbp9001chru4iqqmzmtt	2025-11-29 23:08:00.195
cmikwjnf0000854kiv8ugr05x	cmh36n1zs0005td07t6m368m7	LABOR	2	参与互评	cmhlfwbp9001chru4iqqmzmtt	2025-11-29 23:08:00.204
cmim0jbaf008x4hzvd246g4kl	cmh7d0ay1000zd3m01yxn28f4	PARTICIPATION	50	成就奖励: 老用户	\N	2025-11-30 17:47:29.127
cmim1o88x000pt9hyrp0m2qzl	cmh7d0ay1000zd3m01yxn28f4	PARTICIPATION	10	创建游戏	cmim1o88a000lt9hy0q4yq785	2025-11-30 18:19:18.081
cmimekf7u009cokexcgtro632	cmh4rbv470000d3m0tokxkudd	PARTICIPATION	10	创建游戏	cmimekf730098okexf0o0oww2	2025-12-01 00:20:15.498
cmimekf99009gokex2xfgeo45	cmh4rbv470000d3m0tokxkudd	PARTICIPATION	50	成就奖励: 老用户	\N	2025-12-01 00:20:15.55
cmimekron009ookexemrf5agh	cmgxdqce80000108q18y4npo0	PARTICIPATION	5	参与游戏	cmimekf730098okexf0o0oww2	2025-12-01 00:20:31.655
cmimel055009uokexs81jze9s	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	5	参与游戏	cmimekf730098okexf0o0oww2	2025-12-01 00:20:42.618
cmimelh2x00a1okexa9mquj38	cmgxzbcqh0000hak2a2jt0wwa	PARTICIPATION	5	参与游戏	cmimekf730098okexf0o0oww2	2025-12-01 00:21:04.57
cmimic9pd000fiaff6l9ox659	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmimic9op000biaffodufnc10	2025-12-01 02:05:53.569
cmimicnxx000niaffotwhubsz	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmimic9op000biaffodufnc10	2025-12-01 02:06:12.021
cmimicvk9000tiaff9rvqapdw	cmh36n1zs0005td07t6m368m7	PARTICIPATION	5	参与游戏	cmimic9op000biaffodufnc10	2025-12-01 02:06:21.897
cminf7hac0008ie6l5ea2rbht	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cminf7h9d0004ie6l6wjx24r9	2025-12-01 17:25:57.444
cminf7sva000eie6ln4jopk4m	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cminf7h9d0004ie6l6wjx24r9	2025-12-01 17:26:12.454
cminfn1h8000qie6la06hrzr7	cmfgpklkn000114lt1n0ec61k	TRUST	-1	被他人认定违约	cminf7h9d0004ie6l6wjx24r9	2025-12-01 17:38:03.453
cminfn1hh000sie6ldvhowgob	cmfgpklkn000114lt1n0ec61k	LABOR	2	参与互评	cminf7h9d0004ie6l6wjx24r9	2025-12-01 17:38:03.461
cminfn1if000uie6luuawmai8	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cminf7h9d0004ie6l6wjx24r9	2025-12-01 17:38:03.495
cminfn1il000wie6lf5dxz55o	cmhcegfin0006hcgendh83z40	LABOR	2	参与互评	cminf7h9d0004ie6l6wjx24r9	2025-12-01 17:38:03.502
cminn3og2000a118zovicw3am	cmfhsxf490000lmmnwp77vl6x	LABOR	15	协助仲裁案件	cmimekf730098okexf0o0oww2	2025-12-01 21:06:57.026
cmio2a86h0005qotc89kpbt4u	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	10	创建游戏	cmio2a85k0001qotccs6so6mf	2025-12-02 04:11:56.777
cmio2as21000bqotch3b47kb5	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmio2a85k0001qotccs6so6mf	2025-12-02 04:12:22.537
cmio2lo79000nqotce4j142hs	cmfhsxf490000lmmnwp77vl6x	TRUST	-1	被他人认定违约	cmio2a85k0001qotccs6so6mf	2025-12-02 04:20:50.758
cmio2lo7k000pqotcpjgb4car	cmfhsxf490000lmmnwp77vl6x	LABOR	2	参与互评	cmio2a85k0001qotccs6so6mf	2025-12-02 04:20:50.768
cmio2lo8n000rqotc4zhxkpuv	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmio2a85k0001qotccs6so6mf	2025-12-02 04:20:50.807
cmio2lo8z000tqotculmufm8b	cmhcegfin0006hcgendh83z40	LABOR	2	参与互评	cmio2a85k0001qotccs6so6mf	2025-12-02 04:20:50.819
cmio6xbuz00052nukn8mnj075	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	10	创建游戏	cmio6xbu900012nuky5o963vy	2025-12-02 06:21:53.1
cmio6xohr000b2nukc35bbua5	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmio6xbu900012nuky5o963vy	2025-12-02 06:22:09.472
cmio78fnq000n2nukfpdau82g	cmfhsxf490000lmmnwp77vl6x	TRUST	-1	被他人认定违约	cmio6xbu900012nuky5o963vy	2025-12-02 06:30:31.238
cmio78fo3000p2nukh6mze1wb	cmfhsxf490000lmmnwp77vl6x	LABOR	2	参与互评	cmio6xbu900012nuky5o963vy	2025-12-02 06:30:31.251
cmio78fpe000r2nukc1t7peat	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmio6xbu900012nuky5o963vy	2025-12-02 06:30:31.298
cmio78fpm000t2nuk59ese2es	cmhcegfin0006hcgendh83z40	LABOR	2	参与互评	cmio6xbu900012nuky5o963vy	2025-12-02 06:30:31.306
cmio78fpv000v2nuksghksreg	cmhcegfin0006hcgendh83z40	LABOR	5	提交高质量证据	cmio6xbu900012nuky5o963vy	2025-12-02 06:30:31.316
cmio7exyx00192nukeznz49x2	cmhcegfin0006hcgendh83z40	LABOR	10	仲裁胜诉奖励	cmio6xbu900012nuky5o963vy	2025-12-02 06:35:34.906
cmio7exz9001b2nukkxrl62sp	cmhcegfin0006hcgendh83z40	TRUST	10	仲裁胜诉奖励	cmio6xbu900012nuky5o963vy	2025-12-02 06:35:34.917
cmio7exzy001d2nukr82vpq0g	cmfhsxf490000lmmnwp77vl6x	LABOR	15	协助仲裁案件	cmio6xbu900012nuky5o963vy	2025-12-02 06:35:34.943
cmio8g4vw0005yuosawxe524o	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	10	创建游戏	cmio8g4v70001yuosc61nzwfg	2025-12-02 07:04:30.141
cmio8gfx8000byuoss0066s0d	cmhcegfin0006hcgendh83z40	PARTICIPATION	5	参与游戏	cmio8g4v70001yuosc61nzwfg	2025-12-02 07:04:44.444
cmio9d3ad000jyuosuy2x5pcw	cmfhsxf490000lmmnwp77vl6x	LABOR	15	协助仲裁案件	cmhl7estf000172ste4gw6ufs	2025-12-02 07:30:07.717
cmio9xi51000zyuosrdpfhjtb	cmfhsxf490000lmmnwp77vl6x	TRUST	-1	被他人认定违约	cmio8g4v70001yuosc61nzwfg	2025-12-02 07:46:00.085
cmio9xi5f0011yuossu301g03	cmfhsxf490000lmmnwp77vl6x	LABOR	2	参与互评	cmio8g4v70001yuosc61nzwfg	2025-12-02 07:46:00.1
cmio9xi6i0013yuosywidoiui	cmhcegfin0006hcgendh83z40	TRUST	-1	被他人认定违约	cmio8g4v70001yuosc61nzwfg	2025-12-02 07:46:00.138
cmioqn1mr001byuosfj2zmbpx	cmfhsxf490000lmmnwp77vl6x	LABOR	15	协助仲裁案件	cmio8g4v70001yuosc61nzwfg	2025-12-02 15:33:45.603
cmioqov70001myuosy0sepo1e	cmfhsxf490000lmmnwp77vl6x	TRUST	-2	恶意仲裁	cmio8g4v70001yuosc61nzwfg	2025-12-02 15:35:10.572
cmioqov8d001qyuoshf7gpjxy	cmfhsxf490000lmmnwp77vl6x	LABOR	15	协助仲裁案件	cmio8g4v70001yuosc61nzwfg	2025-12-02 15:35:10.622
cmiorcw7h000712yrmf1r1tef	cmfhsxf490000lmmnwp77vl6x	LABOR	15	协助仲裁案件	cmio8g4v70001yuosc61nzwfg	2025-12-02 15:53:51.629
cmiore00z000j12yrtmfbwtj7	cmfhsxf490000lmmnwp77vl6x	LABOR	15	协助仲裁案件	cmio8g4v70001yuosc61nzwfg	2025-12-02 15:54:43.235
cmisr71h70005p50bgdfvb61o	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	10	创建游戏	cmisr71gg0001p50buhttpqtp	2025-12-05 11:00:23.227
cmisuxij20005rob2d1zzau5a	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	10	创建游戏	cmisuxiid0001rob2ivn70d27	2025-12-05 12:44:57.23
cmitkkq9n0005h9w6imkf251u	cmgxfcw0d0000o777zhox72xw	PARTICIPATION	10	创建游戏	cmitkkq910001h9w62bojgsih	2025-12-06 00:42:50.748
cmiu71qnd0009nbfdoiqyvrxy	cmgxfcw0d0000o777zhox72xw	PARTICIPATION	10	创建游戏	cmiu71qmn0005nbfdtekrha9q	2025-12-06 11:11:55.945
cmivlb9hg0005289qiza24wfn	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmivlb9gm0001289qctx6ylwl	2025-12-07 10:39:01.061
cmisrekkc000bp50bouyidwwh	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	10	创建游戏	cmisrekjn0007p50bbvfb8mif	2025-12-05 11:06:14.557
cmiu72dbe000fnbfd2fjdk101	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	5	参与游戏	cmiu71qmn0005nbfdtekrha9q	2025-12-06 11:12:25.323
cmisrhdee000hp50b5pqwxktw	cmgxfcw0d0000o777zhox72xw	PARTICIPATION	10	创建游戏	cmisrhddp000dp50be48i4yi8	2025-12-05 11:08:25.239
cmisrhdfh000lp50bzojkibwm	cmgxfcw0d0000o777zhox72xw	PARTICIPATION	50	成就奖励: 老用户	\N	2025-12-05 11:08:25.278
cmisrkx45000zp50b4nxhig5n	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	5	参与游戏	cmisrk0z1000pp50bcg4no9zl	2025-12-05 11:11:10.758
cmiu8h9ox000nnbfdtqj4s4cz	cmfhsxf490000lmmnwp77vl6x	TRUST	-1	被他人认定违约	cmiu71qmn0005nbfdtekrha9q	2025-12-06 11:52:00.081
cmiu8h9q6000pnbfdooidf5lg	cmgxfcw0d0000o777zhox72xw	TRUST	-1	被他人认定违约	cmiu71qmn0005nbfdtekrha9q	2025-12-06 11:52:00.126
cmisrk0zs000tp50b1gl2p4mc	cmgxfcw0d0000o777zhox72xw	PARTICIPATION	10	创建游戏	cmisrk0z1000pp50bcg4no9zl	2025-12-05 11:10:29.129
cmiv0h5a60015nbfd0ocor8lv	cmfgpklkn000114lt1n0ec61k	PARTICIPATION	10	创建游戏	cmiv0h59g0011nbfdm8kuzcgj	2025-12-07 00:55:43.614
cmiv0hi9e001bnbfdrvk8bbp8	cmgxfcw0d0000o777zhox72xw	PARTICIPATION	5	参与游戏	cmiv0h59g0011nbfdm8kuzcgj	2025-12-07 00:56:00.434
cmiss0eth0019p50bffllthha	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	21	完成游戏	cmisrk0z1000pp50bcg4no9zl	2025-12-05 11:23:13.541
cmiss0eu4001bp50b4rod2tne	cmfhsxf490000lmmnwp77vl6x	PARTICIPATION	8	完美履约奖励	cmisrk0z1000pp50bcg4no9zl	2025-12-05 11:23:13.564
cmiss0eur001dp50bnwyccxqb	cmfhsxf490000lmmnwp77vl6x	TRUST	3	被他人认可履约	cmisrk0z1000pp50bcg4no9zl	2025-12-05 11:23:13.587
cmiss0ev2001fp50b79cddt7j	cmfhsxf490000lmmnwp77vl6x	LABOR	2	参与互评	cmisrk0z1000pp50bcg4no9zl	2025-12-05 11:23:13.599
cmiss0eve001hp50b010jg5e9	cmfhsxf490000lmmnwp77vl6x	LABOR	5	提交高质量证据	cmisrk0z1000pp50bcg4no9zl	2025-12-05 11:23:13.611
cmiss0ewj001jp50bpbvtdl3p	cmgxfcw0d0000o777zhox72xw	PARTICIPATION	12	完成游戏	cmisrk0z1000pp50bcg4no9zl	2025-12-05 11:23:13.652
cmiss0ex3001lp50bl9gmxt8h	cmgxfcw0d0000o777zhox72xw	PARTICIPATION	5	完美履约奖励	cmisrk0z1000pp50bcg4no9zl	2025-12-05 11:23:13.672
cmiss0exk001np50b5nbk0orn	cmgxfcw0d0000o777zhox72xw	TRUST	3	被他人认可履约	cmisrk0z1000pp50bcg4no9zl	2025-12-05 11:23:13.688
cmiss0ext001pp50b7bjl1zqj	cmgxfcw0d0000o777zhox72xw	LABOR	2	参与互评	cmisrk0z1000pp50bcg4no9zl	2025-12-05 11:23:13.697
cmiss0ey3001rp50ba1y0mld0	cmgxfcw0d0000o777zhox72xw	LABOR	5	提交高质量证据	cmisrk0z1000pp50bcg4no9zl	2025-12-05 11:23:13.707
cmiss0eyq001tp50bqbnzhtcp	cmgxfcw0d0000o777zhox72xw	PARTICIPATION	10	新手鼓励奖励	cmisrk0z1000pp50bcg4no9zl	2025-12-05 11:23:13.731
cmiv0i4sf001hnbfd64odk7yo	cmgxzbcqh0000hak2a2jt0wwa	PARTICIPATION	5	参与游戏	cmiv0h59g0011nbfdm8kuzcgj	2025-12-07 00:56:29.631
\.


--
-- Data for Name: referral_rewards; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.referral_rewards (id, user_id, referred_user_id, reward_type, reward_value, description, is_granted, granted_at, created_at) FROM stdin;
cmh7b4pl3000yd3m0f6qpt1zw	cmh4rbv470000d3m0tokxkudd	cmh7b4pkq000wd3m04ocsbh45	VIP_DAYS	3	推荐新用户 (已注册) 获得3天VIP奖励	t	2025-10-26 06:07:48.627	2025-10-26 06:07:48.616
cmh7d0ayj0011d3m060pkgbxq	cmh4rbv470000d3m0tokxkudd	cmh7d0ay1000zd3m01yxn28f4	VIP_DAYS	3	推荐新用户 (已注册) 获得3天VIP奖励	t	2025-10-26 07:00:22.279	2025-10-26 07:00:22.267
cmh8axnyu000oe17rxt2i37m7	cmfgpklkn000114lt1n0ec61k	cmh8axnya000me17r1py1t2xm	VIP_DAYS	3	推荐新用户获得3天VIP奖励	t	2025-10-26 22:50:06.121	2025-10-26 22:50:06.102
cmh8axnyx000qe17r2v9r71bj	cmfgpklkn000114lt1n0ec61k	cmh8axnya000me17r1py1t2xm	PARTICIPATION_POINTS	20	推荐新用户获得20参与积分奖励	t	2025-10-26 22:50:06.148	2025-10-26 22:50:06.105
cmhc7jd9d0008x7g1mgyhrx6n	cmfgpklkn000114lt1n0ec61k	cmhc7jd8w0006x7g1c2qc46o4	VIP_DAYS	3	推荐新用户获得3天VIP奖励	t	2025-10-29 16:26:04.91	2025-10-29 16:26:04.897
cmhc7jd9h000ax7g1qnsa0ejg	cmfgpklkn000114lt1n0ec61k	cmhc7jd8w0006x7g1c2qc46o4	PARTICIPATION_POINTS	20	推荐新用户获得20参与积分奖励	t	2025-10-29 16:26:04.938	2025-10-29 16:26:04.901
\.


--
-- Data for Name: reports; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.reports (id, reporter_id, target_type, target_id, reason, description, status, handler_id, handled_at, resolution, created_at) FROM stdin;
cmhhqk7hs0007w6fyzvahxclu	cmhcc8p1o000atqgxpzkeao00	GAME	cmhdb0swc0001r5ae3y4j3ryy	INAPPROPRIATE_CONTENT	看看行不行	REJECTED	cmfhsxf490000lmmnwp77vl6x	2025-11-02 13:17:56.242	\N	2025-11-02 13:17:27.664
cmhhqlk70000bw6fy9coo1fmq	cmhcc8p1o000atqgxpzkeao00	GAME	cmhga25nx000113ttuzu9uc2y	INAPPROPRIATE_CONTENT	撒旦飞洒发	RESOLVED	cmfhsxf490000lmmnwp77vl6x	2025-11-02 13:19:02.037	\N	2025-11-02 13:18:30.78
cmhhr25b2000fw6fyrzz0ntwn	cmhcc8p1o000atqgxpzkeao00	GAME	cmhf8lj7e000p140lj8vn75re	OTHER	测试举报次数	RESOLVED	cmfhsxf490000lmmnwp77vl6x	2025-11-02 13:51:04.375	\N	2025-11-02 13:31:24.639
cmhht7arp0001ead8g08sq5v4	cmhcc8p1o000atqgxpzkeao00	GAME	cmhga25nx000113ttuzu9uc2y	OTHER	测试	REJECTED	cmfhsxf490000lmmnwp77vl6x	2025-11-02 14:31:52.184	经审核，该举报不成立	2025-11-02 14:31:24.229
cmhht9ejw0008ead8gucdojv4	cmh4rbv470000d3m0tokxkudd	GAME	cmhhqix9e0001w6fykpt2b6f6	INAPPROPRIATE_CONTENT	乱写	RESOLVED	cmfhsxf490000lmmnwp77vl6x	2025-11-02 14:33:22.739	举报已批准，已对违规内容进行处理	2025-11-02 14:33:02.444
cmhhteoze000lead80086unqz	cmhcegfin0006hcgendh83z40	GAME	cmhawi4tt0001xe90c0e883k6	OTHER	测试	REJECTED	cmfhsxf490000lmmnwp77vl6x	2025-11-02 14:37:21.079	经审核，该举报不成立	2025-11-02 14:37:09.242
cmhhtfses000sead8pynraf2h	cmhcegfin0006hcgendh83z40	GAME	cmhguu62v0001lrbs74qsptsm	OTHER	批准	RESOLVED	cmfhsxf490000lmmnwp77vl6x	2025-11-02 14:38:09.636	举报已批准，已对违规内容进行处理	2025-11-02 14:38:00.341
cmhhuagrz00015er475xn9zhp	cmh36n1zs0005td07t6m368m7	GAME	cmhga25nx000113ttuzu9uc2y	OTHER	测试关闭后是否仍可以游戏	RESOLVED	cmfhsxf490000lmmnwp77vl6x	2025-11-02 15:02:20.721	举报已批准，已对违规内容进行处理	2025-11-02 15:01:51.599
cmhigvg6v001m141v9fdird6e	cmh36n1zs0005td07t6m368m7	GAME	cmhig5a250003141vy1jnjkhu	SPAM	垃圾游戏	RESOLVED	cmfhsxf490000lmmnwp77vl6x	2025-11-03 01:34:35.601	举报已批准，已对违规内容进行处理	2025-11-03 01:34:02.167
cmhihacf9002p141vjbjc5unj	cmh4rbv470000d3m0tokxkudd	GAME	cmhigz2jf001z141v5012hxhq	HARASSMENT	杀死游戏进程举报测试	RESOLVED	cmfhsxf490000lmmnwp77vl6x	2025-11-03 01:45:59.484	举报已批准，已对违规内容进行处理	2025-11-03 01:45:37.125
\.


--
-- Data for Name: shop_exchanges; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.shop_exchanges (id, "userId", "itemId", "pointType", "pointCost", status, "deliveryInfo", notes, "createdAt", "updatedAt") FROM stdin;
cmgvpm9wl0008gr8emebs22r8	cmfgpklkn000114lt1n0ec61k	cmgvpl61h0005gr8ebqn5j8po	PARTICIPATION	100	PENDING	\N	\N	2025-10-18 03:20:08.613	2025-10-18 03:20:08.613
\.


--
-- Data for Name: shop_items; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.shop_items (id, name, description, image, category, "pointType", "pointCost", stock, "isActive", "sortOrder", "createdAt", "updatedAt") FROM stdin;
cmgulwpvj0006rk3gg8vtwx32	自定义徽章	设计专属个人徽章，展示你的独特个性	\N	VIRTUAL	TRUST	1000	-1	t	80	2025-10-17 08:48:31.231	2025-10-17 08:48:31.231
cmgulwpvk0007rk3gba017ytt	彩色用户名	让你的用户名显示为特殊颜色，更加醒目	\N	VIRTUAL	PARTICIPATION	600	-1	t	79	2025-10-17 08:48:31.233	2025-10-17 08:48:31.233
cmgulwpvc0003rk3gciwxiuyz	BetTogether 经典马克杯	高品质陶瓷马克杯，印有BetTogether经典Logo	\N	PHYSICAL	PARTICIPATION	800	100	t	90	2025-10-17 08:48:31.224	2025-10-17 08:48:31.224
cmgulwpve0004rk3gqt9kii4k	BetTogether Logo T恤	100%纯棉T恤，舒适透气，多种尺码可选	\N	PHYSICAL	PARTICIPATION	1500	50	t	89	2025-10-17 08:48:31.226	2025-10-17 08:48:31.226
cmgulwpvf0005rk3gi0czqv26	BetTogether 贴纸套装	精美贴纸套装，包含10张不同设计的防水贴纸	\N	PHYSICAL	PARTICIPATION	300	200	t	88	2025-10-17 08:48:31.228	2025-10-17 08:48:31.228
cmgulwpv50001rk3gyj7yp5ka	VIP会员 3个月	享受3个月VIP特权，性价比更高的选择	\N	VIP	LABOR	1200	-1	t	99	2025-10-17 08:48:31.217	2025-10-17 08:48:31.217
cmgulwpva0002rk3gk9cljm73	VIP会员 1年	年度VIP会员，最超值的选择	\N	VIP	LABOR	4000	-1	t	98	2025-10-17 08:48:31.222	2025-10-17 08:48:31.222
cmgulwpv00000rk3gib776tc8	VIP会员 1个月	享受1个月VIP特权，包括无限制创建游戏、专属徽章、优先客服等	\N	VIP	LABOR	500	-1	t	100	2025-10-17 08:48:31.213	2025-10-18 02:02:49.721
cmgvok31c0004gr8evyblk7lj	sdaf	asdf	/uploads/shop/shop-item-1760755827841-43767410.jpg	VIP	PARTICIPATION	100	-1	t	0	2025-10-18 02:50:26.784	2025-10-18 02:50:28.039
cmgvpl61h0005gr8ebqn5j8po	asdfdsaf	sadfsdf	/uploads/shop/shop-item-1760757560428-343042860.jpg	VIP	PARTICIPATION	100	-1	t	0	2025-10-18 03:19:16.949	2025-10-18 03:19:20.882
cmgulwpvm0008rk3gzhjp8rw2	游戏置顶 1次	将你的游戏置顶显示24小时，获得更多关注	\N	PRIVILEGE	TRUST	200	-1	t	70	2025-10-17 08:48:31.234	2025-10-17 08:48:31.234
cmgulwpvo0009rk3gk71qg9vz	游戏置顶 5次套餐	5次游戏置顶机会，更优惠的价格	\N	PRIVILEGE	TRUST	800	-1	t	69	2025-10-17 08:48:31.236	2025-10-17 08:48:31.236
cmgulwpvp000ark3g2diaz95c	额外每日游戏次数 +5	增加5次每日游戏创建次数，持续7天	\N	PRIVILEGE	PARTICIPATION	400	-1	t	68	2025-10-17 08:48:31.238	2025-10-17 08:48:31.238
cmgulwpvr000brk3g4bsdmgy7	优先客服支持	享受优先客服支持，问题更快解决	\N	PRIVILEGE	TRUST	300	-1	t	67	2025-10-17 08:48:31.24	2025-10-17 08:48:31.24
\.


--
-- Data for Name: social_activities; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.social_activities (id, user_id, type, title, description, data, visibility, created_at) FROM stdin;
\.


--
-- Data for Name: social_interactions; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.social_interactions (id, from_user_id, to_user_id, "targetType", target_id, type, content, created_at) FROM stdin;
\.


--
-- Data for Name: team_game_participations; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.team_game_participations (id, game_id, team_id, joined_at, status, team_score, team_rank, is_winner) FROM stdin;
\.


--
-- Data for Name: team_games; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.team_games (id, team_id, game_id) FROM stdin;
\.


--
-- Data for Name: team_invites; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.team_invites (id, team_id, inviter_id, invitee_id, email, status, created_at, expires_at) FROM stdin;
\.


--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.team_members (id, team_id, user_id, role, joined_at) FROM stdin;
cmh86bn6u000je17rdn2si95g	cmh86bn6m000he17r52m8f1o4	cmh4rbv470000d3m0tokxkudd	LEADER	2025-10-26 20:41:00.198
cmitmk27j0003h5o1hxczjptm	cmitmk2720001h5o1p5w3xixp	cmgxfcw0d0000o777zhox72xw	LEADER	2025-12-06 01:38:18.799
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.teams (id, name, description, creator_id, max_members, is_private, invite_code, team_type, status, created_at, updated_at) FROM stdin;
cmh86bn6m000he17r52m8f1o4	testt		cmh4rbv470000d3m0tokxkudd	8	f	TEAM-8QBX-KQ8Q	COMPETITIVE	ACTIVE	2025-10-26 20:41:00.19	2025-10-26 20:41:00.19
cmitmk2720001h5o1p5w3xixp	first		cmgxfcw0d0000o777zhox72xw	10	f	\N	CASUAL	ACTIVE	2025-12-06 01:38:18.782	2025-12-06 01:38:18.782
\.


--
-- Data for Name: user_achievements; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.user_achievements (id, "userId", "achievementId", "unlockedAt", progress, "isDisplayed") FROM stdin;
cmgysofaf000810if53ekejy9	cmfgpklkn000114lt1n0ec61k	cmgysofa7000610if9btp1t00	2025-10-20 07:09:06.28	\N	t
cmhegy7b2000pbpixrddx0pc3	cmfgpjvmb000014ltuwk3uwht	cmgysofa7000610if9btp1t00	2025-10-31 06:25:05.918	\N	t
cmhgjibe2001166n3goxendxf	cmfiilojw000ao5ubr1d3vfk0	cmgysofa7000610if9btp1t00	2025-11-01 17:12:15.915	\N	t
cmhl7esvi000872stqweirenb	cmfgpklkn000114lt1n0ec61k	cmhl7esvc000672sty9t2lsla	2025-11-04 23:32:27.438	\N	t
cmhllyblk00243fyj2ohhq68c	cmfhsxf490000lmmnwp77vl6x	cmgysofa7000610if9btp1t00	2025-11-05 06:19:32.793	\N	t
cmhllybm1002a3fyj62z50opt	cmfhsxf490000lmmnwp77vl6x	cmhl7esvc000672sty9t2lsla	2025-11-05 06:19:32.809	\N	t
cmim0jbaa008v4hzvc8vs8zrz	cmh7d0ay1000zd3m01yxn28f4	cmgysofa7000610if9btp1t00	2025-11-30 17:47:29.122	\N	t
cmimekf95009eokexce58ufdr	cmh4rbv470000d3m0tokxkudd	cmgysofa7000610if9btp1t00	2025-12-01 00:20:15.545	\N	t
cmisrhdfc000jp50bf19dmpl3	cmgxfcw0d0000o777zhox72xw	cmgysofa7000610if9btp1t00	2025-12-05 11:08:25.272	\N	t
\.


--
-- Data for Name: user_follows; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.user_follows (id, follower_id, followee_id, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.users (id, username, email, full_name, date_of_birth, password_hash, participation_points, trust_points, labor_points, total_games_created, total_games_joined, games_completed, privacy_mode, daily_game_limit, preferred_language, is_vip, vip_expires_at, created_at, updated_at, is_admin, admin_role, admin_created_at, avatar, allow_friend_requests, allow_game_invites, bio, interests, location, phone, show_birth_date, show_email, show_location, show_phone, website, referral_code, referred_by, city, country, country_code, is_banned, banned_until, ban_reason, is_deleted, deleted_at, delete_reason) FROM stdin;
cmfi1832j0000tc5mxbevtyxa	vipbasic	vipbasic@test.com	VIP Basic User	1990-01-01 00:00:00	$2b$12$fb9hjb8yxZ9rUQjvqO14YuzJavF2eyLiyDj7iQH/j5O7S0gGRW1FO	0	10	0	0	0	0	PUBLIC	10	en	t	2025-10-13 17:38:29.692	2025-09-13 08:56:33.163	2025-09-13 17:38:29.694	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	\N	首尔	韩国	KR	f	\N	\N	f	\N	\N
cmfiii4if0004o5ubjdnlhieo	vippremium	vippremium@test.com	VIP PREMIUM User	1990-01-01 00:00:00	$2b$12$g5IJZgzvrbXGTyyE0La3N.qKdm318MGHhVFGuh94pLZ1Cj2FIbzRC	0	10	0	0	0	0	PUBLIC	10	en	t	2025-10-13 17:38:30.385	2025-09-13 17:00:15.062	2025-09-13 17:38:30.386	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	\N	东京	日本	JP	f	\N	\N	f	\N	\N
cmfiii59v0007o5ubac1c4q6p	vipelite	vipelite@test.com	VIP ELITE User	1990-01-01 00:00:00	$2b$12$dguD2cS5pNF278DOr9ePIuHFnSHHx6oWwuOpQU6/XPaJHtasboRfe	0	10	0	0	0	0	PUBLIC	10	en	t	2025-10-13 17:38:31.051	2025-09-13 17:00:16.052	2025-09-13 17:38:31.052	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	\N	东京	日本	JP	f	\N	\N	f	\N	\N
cmh24ch060000td07ebp668gw	16324	adfs@fsdaf.com	sdfsdf第三方	2007-10-22 00:00:00	$2b$12$KtJbxkGVgGAZm5qlUZiq4u4Grg36J9MOwoPHpR4H9.PBQQDhXuoey	0	10	0	0	0	0	PUBLIC	3	en	f	\N	2025-10-22 14:59:02.55	2025-10-22 14:59:02.55	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	\N	深圳	中国	CN	f	\N	\N	f	\N	\N
cmh24e99f0001td07tc6u4ooh	sdfsdaf1	sadfsf1@f23fds.com	asdfdsf1	2003-01-15 00:00:00	$2b$12$cgOvgXlFcaFqoqDt9.Yfbem1rdfj.RgZpyM9AQfe6Oon8jQx9efoa	0	10	0	0	0	0	PUBLIC	10	en	f	\N	2025-10-22 15:00:25.828	2025-10-22 15:00:25.828	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	\N	深圳	中国	CN	f	\N	\N	f	\N	\N
cmh24hkga0002td07a2rw7njn	sdafdsf	676%sdf@2.com	sadfO撒地方	2002-01-02 00:00:00	$2b$12$NH2Xos1Czha3fzx8bSXihu3JFyN8IZdxGFTwTBKhXQqU6GSx5h2yy	0	10	0	0	0	0	PUBLIC	10	en	f	\N	2025-10-22 15:03:00.298	2025-10-22 15:03:00.298	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	\N	深圳	中国	CN	f	\N	\N	f	\N	\N
cmfplca7u0000wim17icjbmtq	testuser	test@example.com	测试用户	1990-01-01 00:00:00	$2b$12$MC7MUU5M8/MtrWVOTjQ/3uCogGDPoBJmdO.NRNkLfrHYALuRF7R5a	0	10	0	0	0	0	PUBLIC	10	en	f	\N	2025-09-18 15:54:04.602	2025-09-18 15:54:04.602	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	\N	深圳	中国	CN	f	\N	\N	f	\N	\N
cmh3ckszl0006td07me8d7kwi	asdfdasf	sdfs%afsaf@fsdaf.com	某某	2006-01-28 00:00:00	$2b$12$4DQHNa9WXZNAwriZohashOoE9hBzcGcy42J77vvucIK1AiPIF9adS	0	10	0	0	0	0	PUBLIC	3	en	f	\N	2025-10-23 11:37:14.433	2025-10-23 11:37:14.433	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	\N	深圳	中国	CN	f	\N	\N	f	\N	\N
cmh3cpcm30007td07hceoiqhz	adf234	sdf%sadf@fdsaf.com	sdfasdf	2006-01-28 00:00:00	$2b$12$3pjEKhrnYxNeIonwCHTlUuECmHxxb5FZx6xj41bXF/YCdt8URHCGq	0	10	0	0	0	0	PUBLIC	3	en	f	\N	2025-10-23 11:40:46.491	2025-10-23 11:40:46.491	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	\N	深圳	中国	CN	f	\N	\N	f	\N	\N
cmfgplidl000214ltrltpgf6s	testuser1	testuser1@testuser1.com	testuser1	2004-03-17 00:00:00	$2b$12$4RbajFoo1tfqWz/TpR0Tg.TpxoYSkMpYztV/8F8KBlP0uLTPWrJha	10	98	0	0	2	0	PUBLIC	10	en	t	2025-10-13 16:46:13.229	2025-09-12 10:43:17.962	2025-11-29 22:59:03.877	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	\N	北京	中国	CN	f	\N	\N	f	\N	\N
cmh36n1zs0005td07t6m368m7	emailtest	contact@onfuture.me	只是测试邮件	2003-01-01 00:00:00	$2b$12$BFMKFIImDE1oS76ISaoX4Oh/a2YH0fwY20hVNOn..WJsjlg1cnnnC	275	56	63	15	18	0	PUBLIC	10	en	t	2025-12-01 22:48:57.879	2025-10-23 08:51:01.72	2025-12-01 02:06:21.902	f	\N	\N	https://app-together.nyc3.cdn.digitaloceanspaces.com/avatars/cmh36n1zs0005td07t6m368m7_1762377470872	t	t		[]			f	t	t	f		EMAI37VAIK	\N	深圳	中国	CN	f	\N	\N	f	\N	\N
cmfhqg9mg001k8y89kdji8pwn	testuser3	testuser3@testuser3.com	somebody	2004-02-18 00:00:00	$2b$12$5nO6d4pwI432SgYfJ7NLFeYMETjP8tPS7yqXOXH7an9lvtIKMtX3.	15	98	2	1	1	0	PUBLIC	15	en	t	2025-10-13 17:41:18.517	2025-09-13 03:54:59.128	2025-11-29 22:59:03.412	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	\N	上海	中国	CN	f	\N	\N	f	\N	\N
cmhcfohf30006dc0nyhcbivhr	asdfdsaf234	asdffasadf@fdsafd.com	fdsafsadf	1997-06-16 00:00:00	$2b$12$zu2Ekx88I9BGhl1L7sNVN.RgYYXDQ8CFJg/U11oFc1SAnx6A87Aly	0	10	0	0	0	0	PUBLIC	10	en	f	\N	2025-10-29 20:14:00.495	2025-11-30 01:39:41.598	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	\N	深圳	中国	CN	t	\N	账户已删除	t	2025-11-30 01:39:41.596	管理员删除
cmgxdqce80000108q18y4npo0	qloutlook	qielei99@outlook.com	测试邮件	1994-01-03 00:00:00	$2b$12$4kAnH/8nAUSXGab86T2Y2e.1hoca19qGLvAaXZCMi7lWjVTNVGfj.	85	-2	44	0	8	0	PUBLIC	10	en	f	\N	2025-10-19 07:22:55.424	2025-12-01 00:20:31.661	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	\N	深圳	中国	CN	f	\N	\N	f	\N	\N
cmfhqhbdo001p8y89uh5fot7e	testuser4	testuser4@testuser4.com	测试	2005-01-18 00:00:00	$2b$12$B1eKAbj/RjCwVxFPCssHD.Rku92/hsO7jg4Jp87ibgDvqnRdZuGaG	20	97	0	1	2	0	PUBLIC	10	en	t	2025-10-13 16:07:31.681	2025-09-13 03:55:48.06	2025-11-29 22:59:03.931	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	\N	上海	中国	CN	f	\N	\N	f	\N	\N
cmfgpmfbo000314ltz0jj7n1y	testuser123	testusr123@testusr123.com	someone	2007-09-01 00:00:00	$2b$12$1G17FLRswYVSp80OsopdPOtW64HaxW031PpDw1JhzbphilEsEUhjy	55	93	0	4	3	0	PUBLIC	999	en	t	2025-10-13 08:17:59.389	2025-09-12 10:44:00.66	2025-11-29 22:59:03.904	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	\N	上海	中国	CN	f	\N	\N	f	\N	\N
cmfgpjvmb000014ltuwk3uwht	testuser2	testuser2@example.com	某某	2007-09-12 00:00:00	$2b$12$ZKq7JwlfGujeJnTdTZ9ZSeE5n4/QXJmrn3s3OaaO2JKvkoBNDGxOq	110	97	0	6	0	0	PUBLIC	999	en	t	2025-10-13 17:40:47.067	2025-09-12 10:42:01.812	2025-11-29 22:59:04.265	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	\N	北京	中国	CN	f	\N	\N	f	\N	\N
cmfiilojw000ao5ubr1d3vfk0	regular123	regular123@regular123.com	普通	2002-02-18 00:00:00	$2b$12$RNXygd5L0KAqSlAQ7sUtZOvFAqSE/t1wBsWRJaUzofKzLfG/rW.0i	114	99	16	1	4	0	PUBLIC	10	en	f	\N	2025-09-13 17:03:01.005	2025-11-29 22:59:04.821	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	\N	深圳	中国	CN	f	\N	\N	f	\N	\N
cmh7d0ay1000zd3m01yxn28f4	refer	sdafsdaf@fsadfdf.com	不语	2000-05-12 00:00:00	$2b$12$WLCfMcJ6h4U6yj/UI1Pbdup.C8gRKYQkNoVr/qCC4WfGYBKJ.rTku	70	10	0	2	0	0	PUBLIC	10	en	f	\N	2025-10-26 07:00:22.249	2025-11-30 18:19:29.031	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	cmh4rbv470000d3m0tokxkudd	深圳	中国	CN	t	\N	账户已删除	t	2025-11-30 18:19:29.029	管理员删除
cmh24ml660003td0740yexg8h	test7891	sdfasffdsf2f@fsdaf.com	的说法	2001-01-27 00:00:00	$2b$12$pVdaRa.OAh1vQ7Vjabic3OUPQBRizV2iEjpfmeO1EaFRkXifRhLue	10	9	5	1	0	0	PUBLIC	10	en	f	\N	2025-10-22 15:06:54.511	2025-11-30 18:20:46.39	f	\N	\N	https://app-together.nyc3.cdn.digitaloceanspaces.com/avatars/cmh24ml660003td0740yexg8h_1762381596103_002f055a5ea789ee.png	t	t		[]			f	t	t	f		\N	\N	深圳	中国	CN	t	\N	账户已删除	t	2025-11-30 18:20:46.388	管理员删除
cmh4rbv470000d3m0tokxkudd	asd432	asdsdaf@fsdaf.com	someone1	1991-01-10 00:00:00	$2b$12$C54nhq3.GKEc3V1UW0EkoOkCuMUqBX61aYIOYM7Xv4/ZZBLAzt.4K	135	93	10	6	5	0	PUBLIC	10	en	t	2025-11-01 06:07:48.623	2025-10-24 11:17:57.703	2025-12-01 00:20:15.554	f	\N	\N	https://app-together.nyc3.cdn.digitaloceanspaces.com/avatars/cmh4rbv470000d3m0tokxkudd_1762381555820_a2892d08afacd2c4.gif	t	t		[]			f	t	t	f		ASD4T3RAW0	\N	深圳	中国	CN	f	\N	\N	f	\N	\N
cmhc7jd8w0006x7g1c2qc46o4	test456	asdfsdaf@fsdaf.com	fdsafsdf	1998-01-01 00:00:00	$2b$12$jg7emBmOMh6KVduSYD6APO1HhsuzCjdxrqwwd3npZYqj6ZlczU7fG	386	86	29	23	11	0	PUBLIC	999	en	t	2025-11-28 20:20:46.595	2025-10-29 16:26:04.88	2025-12-02 16:11:38.05	f	\N	\N	\N	t	t	撒地方	["阅读学习", "手工制作"]	日本 名古屋	1511111111111111	f	t	t	f	http://www.aaa.com	\N	cmfgpklkn000114lt1n0ec61k	名古屋	日本	JP	t	\N	账户已删除	t	2025-12-02 16:11:38.048	管理员删除
cmh7b4pkq000wd3m04ocsbh45	reff	sdafsdaf@fsdaf.com	推荐奖励	2000-01-03 00:00:00	$2b$12$fpDAT/4XQnpHPOGUOcdcQOvbxubnz7EKJfEhpFoE/POmBVBDR6TSO	0	10	0	0	0	0	PUBLIC	15	en	t	2025-11-25 22:38:37.582	2025-10-26 06:07:48.602	2025-11-30 17:47:44.749	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	cmh4rbv470000d3m0tokxkudd	深圳	中国	CN	t	\N	账户已删除	t	2025-11-30 17:47:44.748	管理员删除
cmh8axnya000me17r1py1t2xm	asdfdsaf	dsafdsaf@fsdaf.com	马甲	2002-01-31 00:00:00	$2b$12$N7wPutPoY3UMIEog1zZMzeBSzbQfB2m98sq.alrLZSNjJyjscOXlG	5	10	0	0	1	0	PUBLIC	10	en	f	\N	2025-10-26 22:50:06.082	2025-11-06 08:52:12.24	f	\N	\N	\N	t	t		[]			f	t	t	f		\N	cmfgpklkn000114lt1n0ec61k	深圳	中国	CN	f	\N	\N	f	\N	\N
cmgxzbcqh0000hak2a2jt0wwa	domaintest001	laofutouteng@163.com	域名测试用户	1990-01-01 00:00:00	$2b$12$T9VZ9XLR8NLE0QAnZkhb3uhCZEIzHUMXIqHX3Y0JON0daBdGEMj4u	40	10	5	1	6	0	PUBLIC	999	en	t	2026-01-06 03:24:53.062	2025-10-19 17:27:07.578	2025-12-07 12:13:17.29	f	\N	\N	https://app-together.nyc3.cdn.digitaloceanspaces.com/avatars/cmgxzbcqh0000hak2a2jt0wwa_1762381578768_729ac795fa9a5eb2.jpg	t	t		[]			f	t	t	f		DOMAF0QUVU	\N	深圳	中国	CN	f	\N	\N	f	\N	\N
cmhcc8p1o000atqgxpzkeao00	asdfsafd	fsdafsadf@fsadf.com	dsfsaf	2005-01-10 00:00:00	$2b$12$cYsACOA7OqRLc4RgVVFUY.n8VNC9jVf1m2GZbnEVx3JNRI.UUQkIe	95	-3	0	9	1	0	PUBLIC	3	en	f	\N	2025-10-29 18:37:45.036	2025-12-02 16:10:39.397	f	\N	\N	\N	t	t		["音乐艺术", "园艺种植"]	城市		t	t	t	t		ASDFSYPGZG	\N	城市	\N	\N	t	\N	账户已删除	t	2025-12-02 16:10:39.395	管理员删除
cmhcegfin0006hcgendh83z40	newbie	dsfafdsfa@fsdf.com	newbie	2000-01-05 00:00:00	$2b$12$IAOgRNL8SdbDH4tTPQPD3uGEnGPzvhIAHcG3k7tGroO20BgRJB/rq	612	72	119	38	22	0	PUBLIC	999	en	t	2025-12-05 08:11:18.501	2025-10-29 19:39:45.167	2025-12-02 16:49:53.241	f	\N	\N	\N	t	t		[]			f	t	t	f		NEWBVJCU7J	\N	深圳	中国	CN	f	\N	\N	f	\N	\N
cmipxhglo0004u8e85jqegscu	nicegame	qielei@gmail.com	我的邮箱	1996-01-01 00:00:00	$2b$12$o44TGKxlKP5kHUHtjVv03.Ff3bSYcx4Xmkrk5KYhru2sEzZlAaS8i	0	10	0	0	0	0	PUBLIC	10	en	f	\N	2025-12-03 11:33:08.556	2025-12-03 11:33:08.556	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	\N	\N	\N	\N	f	\N	\N	f	\N	\N
cmipy33my000bu8e8bxo390uf	huancun	meiyouxiangle@163.com	试试缓存	1999-02-10 00:00:00	$2b$12$3sUe8N8fh8km43psGnvDaOL/8IRRBNNNUZmgGUxJVSFfzuJMl8Fm.	0	10	0	0	0	0	PUBLIC	10	en	f	\N	2025-12-03 11:49:58.186	2025-12-03 12:18:42.499	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	HUANPSXHOT	\N	\N	\N	\N	f	\N	\N	f	\N	\N
cmfhsxf490000lmmnwp77vl6x	admin	admin@bet-together.com	System Administrator	1990-01-01 00:00:00	$2b$12$wyfkYy0wH7cOYrrpyM3oAeSGvmBK5H53qPawszT2mbRVK6PXSpLrG	1366	1001	1235	9	4	0	PUBLIC	10	en	t	2025-10-13 10:04:51.671	2025-09-13 05:04:18.633	2025-12-07 12:39:49.837	t	SUPER_ADMIN	\N	https://app-together.nyc3.cdn.digitaloceanspaces.com/avatars/cmfhsxf490000lmmnwp77vl6x_1764506392485_103aaef21f316df7.jpg	t	t		[]			f	t	t	f		ADMI2E8BX6	\N	首尔	韩国	KR	f	\N	\N	f	\N	\N
cmgxfcw0d0000o777zhox72xw	xunpeihu	xunpeihu@163.com	某某	2002-12-30 00:00:00	$2b$12$iw4f96H/oKdZJEgc6p/Ft.ZfmQ4VRONRGLyOvVQ3J2Dd/1HgQOiC2	122	12	7	4	1	0	PUBLIC	999	en	t	2026-01-05 23:20:02.996	2025-10-19 08:08:26.893	2025-12-07 00:56:00.442	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	\N	深圳	中国	CN	f	\N	\N	f	\N	\N
cmiv2q81u002lnbfd2rx5l615	domaintest002	sdfasdaf@fadsfdsf.com	fdsafs	2003-01-01 00:00:00	$2b$12$W19/PIeNSSuB.aliqJcnGuFZld1BTT8NBxvCiV6tmrevApUqGwKhi	0	10	0	0	0	0	PUBLIC	10	en	f	\N	2025-12-07 01:58:46.339	2025-12-07 02:08:42.163	f	\N	\N	\N	t	t	\N	\N	\N	\N	f	t	t	f	\N	\N	\N	\N	\N	\N	t	\N	账户已删除	t	2025-12-07 02:08:42.162	管理员删除
cmfgpklkn000114lt1n0ec61k	test789	test789@example.com	test789	2003-06-13 00:00:00	$2b$12$FDtQp3FOvVgCDv3ShFU7s.r40HYSsqzErr0E0NG4x1dltGd/t9PWy	1255	37	59	97	16	0	PUBLIC	999	en	t	2025-11-01 22:50:06.113	2025-09-12 10:42:35.447	2025-12-07 10:39:01.071	f	\N	\N	https://app-together.nyc3.cdn.digitaloceanspaces.com/avatars/cmfgpklkn000114lt1n0ec61k_1762376454403	t	t		[]			f	t	t	f		TESTINWUDU	\N	北京	中国	CN	f	\N	\N	f	\N	\N
\.


--
-- Data for Name: vip_subscriptions; Type: TABLE DATA; Schema: public; Owner: chal_user
--

COPY public.vip_subscriptions (id, user_id, tier, start_date, end_date, is_active, payment_amount, payment_method, created_at) FROM stdin;
cmfigj9vm00058ulasntx2rxs	cmfi1832j0000tc5mxbevtyxa	BASIC	2025-09-13 16:05:09.441	2025-10-13 16:05:09.436	t	0.000000000000000000000000000000	ADMIN_UPGRADE	2025-09-13 16:05:09.442
cmfiii3r20003o5ubpyteiqvi	cmfi1832j0000tc5mxbevtyxa	BASIC	2025-09-13 17:00:14.077	2025-10-13 17:00:14.07	t	0.000000000000000000000000000000	ADMIN_UPGRADE	2025-09-13 17:00:14.078
cmfiii4ix0006o5ubayphhpgk	cmfiii4if0004o5ubjdnlhieo	PREMIUM	2025-09-13 17:00:15.08	2025-10-13 17:00:15.078	t	0.000000000000000000000000000000	ADMIN_UPGRADE	2025-09-13 17:00:15.081
cmfiii5ae0009o5ubqbedwu70	cmfiii59v0007o5ubac1c4q6p	ELITE	2025-09-13 17:00:16.069	2025-10-13 17:00:16.066	t	0.000000000000000000000000000000	ADMIN_UPGRADE	2025-09-13 17:00:16.07
cmfijvb2a0001st753i03kgbe	cmfi1832j0000tc5mxbevtyxa	BASIC	2025-09-13 17:38:29.697	2025-10-13 17:38:29.692	t	0.000000000000000000000000000000	ADMIN_UPGRADE	2025-09-13 17:38:29.698
cmfijvblg0003st75jfcbkdgq	cmfiii4if0004o5ubjdnlhieo	PREMIUM	2025-09-13 17:38:30.388	2025-10-13 17:38:30.385	t	0.000000000000000000000000000000	ADMIN_UPGRADE	2025-09-13 17:38:30.389
cmfijvc3y0005st75eq1i98n3	cmfiii59v0007o5ubac1c4q6p	ELITE	2025-09-13 17:38:31.054	2025-10-13 17:38:31.051	t	0.000000000000000000000000000000	ADMIN_UPGRADE	2025-09-13 17:38:31.055
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: achievements achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.achievements
    ADD CONSTRAINT achievements_pkey PRIMARY KEY (id);


--
-- Name: admin_actions admin_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.admin_actions
    ADD CONSTRAINT admin_actions_pkey PRIMARY KEY (id);


--
-- Name: bet_games bet_games_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.bet_games
    ADD CONSTRAINT bet_games_pkey PRIMARY KEY (id);


--
-- Name: bet_participants bet_participants_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.bet_participants
    ADD CONSTRAINT bet_participants_pkey PRIMARY KEY (id);


--
-- Name: community_groups community_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.community_groups
    ADD CONSTRAINT community_groups_pkey PRIMARY KEY (id);


--
-- Name: dispute_evidence dispute_evidence_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.dispute_evidence
    ADD CONSTRAINT dispute_evidence_pkey PRIMARY KEY (id);


--
-- Name: disputes disputes_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT disputes_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: feedbacks feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_pkey PRIMARY KEY (id);


--
-- Name: friendships friendships_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_pkey PRIMARY KEY (id);


--
-- Name: game_join_history game_join_history_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.game_join_history
    ADD CONSTRAINT game_join_history_pkey PRIMARY KEY (id);


--
-- Name: game_templates game_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.game_templates
    ADD CONSTRAINT game_templates_pkey PRIMARY KEY (id);


--
-- Name: group_members group_members_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_pkey PRIMARY KEY (id);


--
-- Name: group_posts group_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.group_posts
    ADD CONSTRAINT group_posts_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: notification_settings notification_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: peer_evaluations peer_evaluations_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.peer_evaluations
    ADD CONSTRAINT peer_evaluations_pkey PRIMARY KEY (id);


--
-- Name: penalty_records penalty_records_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.penalty_records
    ADD CONSTRAINT penalty_records_pkey PRIMARY KEY (id);


--
-- Name: points_history points_history_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.points_history
    ADD CONSTRAINT points_history_pkey PRIMARY KEY (id);


--
-- Name: referral_rewards referral_rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.referral_rewards
    ADD CONSTRAINT referral_rewards_pkey PRIMARY KEY (id);


--
-- Name: reports reports_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_pkey PRIMARY KEY (id);


--
-- Name: shop_exchanges shop_exchanges_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.shop_exchanges
    ADD CONSTRAINT shop_exchanges_pkey PRIMARY KEY (id);


--
-- Name: shop_items shop_items_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.shop_items
    ADD CONSTRAINT shop_items_pkey PRIMARY KEY (id);


--
-- Name: social_activities social_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.social_activities
    ADD CONSTRAINT social_activities_pkey PRIMARY KEY (id);


--
-- Name: social_interactions social_interactions_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.social_interactions
    ADD CONSTRAINT social_interactions_pkey PRIMARY KEY (id);


--
-- Name: team_game_participations team_game_participations_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.team_game_participations
    ADD CONSTRAINT team_game_participations_pkey PRIMARY KEY (id);


--
-- Name: team_games team_games_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.team_games
    ADD CONSTRAINT team_games_pkey PRIMARY KEY (id);


--
-- Name: team_invites team_invites_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.team_invites
    ADD CONSTRAINT team_invites_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: user_achievements user_achievements_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT user_achievements_pkey PRIMARY KEY (id);


--
-- Name: user_follows user_follows_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: vip_subscriptions vip_subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.vip_subscriptions
    ADD CONSTRAINT vip_subscriptions_pkey PRIMARY KEY (id);


--
-- Name: bet_participants_game_id_user_id_key; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE UNIQUE INDEX bet_participants_game_id_user_id_key ON public.bet_participants USING btree (game_id, user_id);


--
-- Name: community_groups_name_key; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE UNIQUE INDEX community_groups_name_key ON public.community_groups USING btree (name);


--
-- Name: favorites_game_id_idx; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE INDEX favorites_game_id_idx ON public.favorites USING btree (game_id);


--
-- Name: favorites_user_id_game_id_key; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE UNIQUE INDEX favorites_user_id_game_id_key ON public.favorites USING btree (user_id, game_id);


--
-- Name: favorites_user_id_idx; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE INDEX favorites_user_id_idx ON public.favorites USING btree (user_id);


--
-- Name: friendships_requester_id_addressee_id_key; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE UNIQUE INDEX friendships_requester_id_addressee_id_key ON public.friendships USING btree (requester_id, addressee_id);


--
-- Name: game_join_history_user_id_game_id_idx; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE INDEX game_join_history_user_id_game_id_idx ON public.game_join_history USING btree (user_id, game_id);


--
-- Name: game_templates_name_key; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE UNIQUE INDEX game_templates_name_key ON public.game_templates USING btree (name);


--
-- Name: group_members_group_id_user_id_key; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE UNIQUE INDEX group_members_group_id_user_id_key ON public.group_members USING btree (group_id, user_id);


--
-- Name: messages_receiver_id_is_read_idx; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE INDEX messages_receiver_id_is_read_idx ON public.messages USING btree (receiver_id, is_read);


--
-- Name: messages_sender_id_receiver_id_idx; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE INDEX messages_sender_id_receiver_id_idx ON public.messages USING btree (sender_id, receiver_id);


--
-- Name: notification_settings_user_id_key; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE UNIQUE INDEX notification_settings_user_id_key ON public.notification_settings USING btree (user_id);


--
-- Name: password_reset_tokens_token_idx; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE INDEX password_reset_tokens_token_idx ON public.password_reset_tokens USING btree (token);


--
-- Name: password_reset_tokens_token_key; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE UNIQUE INDEX password_reset_tokens_token_key ON public.password_reset_tokens USING btree (token);


--
-- Name: password_reset_tokens_user_id_idx; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE INDEX password_reset_tokens_user_id_idx ON public.password_reset_tokens USING btree (user_id);


--
-- Name: peer_evaluations_game_id_evaluator_id_evaluated_id_key; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE UNIQUE INDEX peer_evaluations_game_id_evaluator_id_evaluated_id_key ON public.peer_evaluations USING btree (game_id, evaluator_id, evaluated_id);


--
-- Name: team_game_participations_game_id_team_id_key; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE UNIQUE INDEX team_game_participations_game_id_team_id_key ON public.team_game_participations USING btree (game_id, team_id);


--
-- Name: team_games_team_id_game_id_key; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE UNIQUE INDEX team_games_team_id_game_id_key ON public.team_games USING btree (team_id, game_id);


--
-- Name: team_members_team_id_user_id_key; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE UNIQUE INDEX team_members_team_id_user_id_key ON public.team_members USING btree (team_id, user_id);


--
-- Name: teams_invite_code_key; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE UNIQUE INDEX teams_invite_code_key ON public.teams USING btree (invite_code);


--
-- Name: user_achievements_userId_achievementId_key; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE UNIQUE INDEX "user_achievements_userId_achievementId_key" ON public.user_achievements USING btree ("userId", "achievementId");


--
-- Name: user_follows_follower_id_followee_id_key; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE UNIQUE INDEX user_follows_follower_id_followee_id_key ON public.user_follows USING btree (follower_id, followee_id);


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: users_referral_code_key; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE UNIQUE INDEX users_referral_code_key ON public.users USING btree (referral_code);


--
-- Name: users_username_key; Type: INDEX; Schema: public; Owner: chal_user
--

CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


--
-- Name: admin_actions admin_actions_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.admin_actions
    ADD CONSTRAINT admin_actions_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: bet_games bet_games_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.bet_games
    ADD CONSTRAINT bet_games_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: bet_games bet_games_template_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.bet_games
    ADD CONSTRAINT bet_games_template_id_fkey FOREIGN KEY (template_id) REFERENCES public.game_templates(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: bet_participants bet_participants_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.bet_participants
    ADD CONSTRAINT bet_participants_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.bet_games(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: bet_participants bet_participants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.bet_participants
    ADD CONSTRAINT bet_participants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: community_groups community_groups_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.community_groups
    ADD CONSTRAINT community_groups_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: dispute_evidence dispute_evidence_dispute_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.dispute_evidence
    ADD CONSTRAINT dispute_evidence_dispute_id_fkey FOREIGN KEY (dispute_id) REFERENCES public.disputes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: dispute_evidence dispute_evidence_uploader_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.dispute_evidence
    ADD CONSTRAINT dispute_evidence_uploader_id_fkey FOREIGN KEY (uploader_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: disputes disputes_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT disputes_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.bet_games(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: disputes disputes_handler_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT disputes_handler_id_fkey FOREIGN KEY (handler_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: disputes disputes_initiator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT disputes_initiator_id_fkey FOREIGN KEY (initiator_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: disputes disputes_target_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.disputes
    ADD CONSTRAINT disputes_target_id_fkey FOREIGN KEY (target_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: favorites favorites_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.bet_games(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: favorites favorites_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: feedbacks feedbacks_handler_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_handler_id_fkey FOREIGN KEY (handler_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: feedbacks feedbacks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.feedbacks
    ADD CONSTRAINT feedbacks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: friendships friendships_addressee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_addressee_id_fkey FOREIGN KEY (addressee_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: friendships friendships_requester_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.friendships
    ADD CONSTRAINT friendships_requester_id_fkey FOREIGN KEY (requester_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: game_join_history game_join_history_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.game_join_history
    ADD CONSTRAINT game_join_history_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.bet_games(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: game_join_history game_join_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.game_join_history
    ADD CONSTRAINT game_join_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_members group_members_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.community_groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_members group_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.group_members
    ADD CONSTRAINT group_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_posts group_posts_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.group_posts
    ADD CONSTRAINT group_posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: group_posts group_posts_group_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.group_posts
    ADD CONSTRAINT group_posts_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.community_groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: notification_settings notification_settings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.notification_settings
    ADD CONSTRAINT notification_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: password_reset_tokens password_reset_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: peer_evaluations peer_evaluations_evaluated_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.peer_evaluations
    ADD CONSTRAINT peer_evaluations_evaluated_id_fkey FOREIGN KEY (evaluated_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: peer_evaluations peer_evaluations_evaluator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.peer_evaluations
    ADD CONSTRAINT peer_evaluations_evaluator_id_fkey FOREIGN KEY (evaluator_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: peer_evaluations peer_evaluations_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.peer_evaluations
    ADD CONSTRAINT peer_evaluations_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.bet_games(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: penalty_records penalty_records_executed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.penalty_records
    ADD CONSTRAINT penalty_records_executed_by_fkey FOREIGN KEY (executed_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: penalty_records penalty_records_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.penalty_records
    ADD CONSTRAINT penalty_records_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.bet_games(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: penalty_records penalty_records_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.penalty_records
    ADD CONSTRAINT penalty_records_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: points_history points_history_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.points_history
    ADD CONSTRAINT points_history_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.bet_games(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: points_history points_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.points_history
    ADD CONSTRAINT points_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: referral_rewards referral_rewards_referred_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.referral_rewards
    ADD CONSTRAINT referral_rewards_referred_user_id_fkey FOREIGN KEY (referred_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: referral_rewards referral_rewards_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.referral_rewards
    ADD CONSTRAINT referral_rewards_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reports reports_handler_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_handler_id_fkey FOREIGN KEY (handler_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: reports reports_reporter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.reports
    ADD CONSTRAINT reports_reporter_id_fkey FOREIGN KEY (reporter_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: shop_exchanges shop_exchanges_itemId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.shop_exchanges
    ADD CONSTRAINT "shop_exchanges_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES public.shop_items(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: shop_exchanges shop_exchanges_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.shop_exchanges
    ADD CONSTRAINT "shop_exchanges_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: social_activities social_activities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.social_activities
    ADD CONSTRAINT social_activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: social_interactions social_interactions_from_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.social_interactions
    ADD CONSTRAINT social_interactions_from_user_id_fkey FOREIGN KEY (from_user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: social_interactions social_interactions_target_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.social_interactions
    ADD CONSTRAINT social_interactions_target_id_fkey FOREIGN KEY (target_id) REFERENCES public.social_activities(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: team_game_participations team_game_participations_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.team_game_participations
    ADD CONSTRAINT team_game_participations_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.bet_games(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: team_game_participations team_game_participations_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.team_game_participations
    ADD CONSTRAINT team_game_participations_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: team_games team_games_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.team_games
    ADD CONSTRAINT team_games_game_id_fkey FOREIGN KEY (game_id) REFERENCES public.bet_games(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: team_games team_games_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.team_games
    ADD CONSTRAINT team_games_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: team_invites team_invites_invitee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.team_invites
    ADD CONSTRAINT team_invites_invitee_id_fkey FOREIGN KEY (invitee_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: team_invites team_invites_inviter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.team_invites
    ADD CONSTRAINT team_invites_inviter_id_fkey FOREIGN KEY (inviter_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: team_invites team_invites_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.team_invites
    ADD CONSTRAINT team_invites_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: team_members team_members_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.teams(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: team_members team_members_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: teams teams_creator_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_achievements user_achievements_achievementId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT "user_achievements_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES public.achievements(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_achievements user_achievements_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.user_achievements
    ADD CONSTRAINT "user_achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_follows user_follows_followee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_followee_id_fkey FOREIGN KEY (followee_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_follows user_follows_follower_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.user_follows
    ADD CONSTRAINT user_follows_follower_id_fkey FOREIGN KEY (follower_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_referred_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_referred_by_fkey FOREIGN KEY (referred_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: vip_subscriptions vip_subscriptions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: chal_user
--

ALTER TABLE ONLY public.vip_subscriptions
    ADD CONSTRAINT vip_subscriptions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO chal_user;


--
-- PostgreSQL database dump complete
--

\unrestrict wF6nc25JPNYseWijKfnZctMa2NulmDftTG30Zwoyb9fECUCDSvVTHeC2EVdPTxt

