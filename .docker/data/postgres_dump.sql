--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--




--
-- Drop roles
--



--
-- Roles
--

--- CREATE ROLE "user";
--- ALTER ROLE "user" WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'md5c41badb1d5bb89c8db4fa5f66a4611ea';






--
-- PostgreSQL database dump
--

-- Dumped from database version 11.8 (Debian 11.8-1.pgdg90+1)
-- Dumped by pg_dump version 11.8 (Debian 11.8-1.pgdg90+1)

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

UPDATE pg_catalog.pg_database SET datistemplate = false WHERE datname = 'template1';
DROP DATABASE template1;
--
-- Name: template1; Type: DATABASE; Schema: -; Owner: user
--

CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';


ALTER DATABASE template1 OWNER TO "user";

\connect template1

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
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: user
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: user
--

ALTER DATABASE template1 IS_TEMPLATE = true;


\connect template1

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
-- Name: DATABASE template1; Type: ACL; Schema: -; Owner: user
--

REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 11.8 (Debian 11.8-1.pgdg90+1)
-- Dumped by pg_dump version 11.8 (Debian 11.8-1.pgdg90+1)

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

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: user
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO "user";

\connect postgres

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
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: user
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 11.8 (Debian 11.8-1.pgdg90+1)
-- Dumped by pg_dump version 11.8 (Debian 11.8-1.pgdg90+1)

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
-- Name: realworld; Type: DATABASE; Schema: -; Owner: user
--

CREATE DATABASE realworld WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';


ALTER DATABASE realworld OWNER TO "user";

\connect realworld

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

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: article_comments; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.article_comments (
	id integer NOT NULL,
	article_id integer NOT NULL,
	author_image character varying(255) NOT NULL,
	author_id integer NOT NULL,
	author_username character varying(255) NOT NULL,
	body text NOT NULL,
	created_at timestamp without time zone NOT NULL,
	updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.article_comments OWNER TO "user";

--
-- Name: article_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.article_comments_id_seq
	AS integer
	START WITH 1
	INCREMENT BY 1
	NO MINVALUE
	NO MAXVALUE
	CACHE 1;


ALTER TABLE public.article_comments_id_seq OWNER TO "user";

--
-- Name: article_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.article_comments_id_seq OWNED BY public.article_comments.id;


--
-- Name: articles; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.articles (
	id serial,
	author_id integer NOT NULL,
	title character varying(255) NOT NULL,
	description character varying(255) NOT NULL,
	body text NOT NULL,
	slug character varying(255) NOT NULL,
	created_at timestamp without time zone NOT NULL,
	updated_at timestamp without time zone NOT NULL,
	tags character varying(255)
);


ALTER TABLE public.articles OWNER TO "user";


COPY public.articles (id, author_id, title, description, body, slug, created_at, updated_at, tags) FROM stdin;
1	1	Lorem ipsum dolor sit amet	consectetur adipiscing elit	Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Velit scelerisque in dictum non consectetur a erat. Sit amet justo donec enim diam vulputate. Id aliquet lectus proin nibh nisl condimentum id venenatis a. Eget gravida cum sociis natoque penatibus et magnis dis. Habitant morbi tristique senectus et netus et. Interdum consectetur libero id faucibus nisl tincidunt eget nullam. Aliquam purus sit amet luctus. Fringilla ut morbi tincidunt augue interdum velit. Neque sodales ut etiam sit. Quam viverra orci sagittis eu volutpat odio facilisis mauris. Ornare suspendisse sed nisi lacus sed. Iaculis at erat pellentesque adipiscing commodo elit at imperdiet dui. Quam nulla porttitor massa id neque aliquam vestibulum morbi. Dignissim diam quis enim lobortis scelerisque fermentum dui faucibus. Turpis egestas integer eget aliquet.	lorem-ipsum-dolor-sit-amet	2021-06-10 06:54:54.758	2021-06-10 06:54:54.758	lorem,ipsum,dolor
2	2	In nisl nisi scelerisque eu	 ultrices vitae auctor eu.	In nisl nisi scelerisque eu ultrices vitae auctor eu. Dolor sit amet consectetur adipiscing elit duis. Tortor dignissim convallis aenean et tortor at. Iaculis at erat pellentesque adipiscing commodo. Viverra suspendisse potenti nullam ac tortor. Elementum nibh tellus molestie nunc non blandit massa enim. Ultricies integer quis auctor elit sed. Varius vel pharetra vel turpis nunc eget lorem dolor. Sit amet massa vitae tortor condimentum. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Nascetur ridiculus mus mauris vitae ultricies leo integer.	In-nisl-nisi-scelerisque-eu	2021-06-10 06:54:54.758	2021-06-10 06:54:54.758	lorem,nisil
3	1	Urna nunc id cursus metus.	Id leo in vitae turpis massa.	Urna nunc id cursus metus. Id leo in vitae turpis massa. Blandit turpis cursus in hac habitasse platea. Feugiat sed lectus vestibulum mattis ullamcorper. Diam sit amet nisl suscipit adipiscing bibendum est. Enim nunc faucibus a pellentesque sit amet porttitor eget dolor. Enim eu turpis egestas pretium aenean pharetra. Amet mattis vulputate enim nulla aliquet. Tristique et egestas quis ipsum suspendisse ultrices gravida dictum fusce. Risus commodo viverra maecenas accumsan lacus vel. Eu mi bibendum neque egestas congue quisque egestas diam in. Fermentum odio eu feugiat pretium nibh ipsum consequat.	Urna-nunc-id-cursus-metus	2021-06-10 06:54:54.758	2021-06-10 06:54:54.758	urna,nunc
4	1	Egestas egestas	fringilla phasellus faucibus scelerisque	Egestas egestas fringilla phasellus faucibus scelerisque. Sit amet dictum sit amet justo donec. Cum sociis natoque penatibus et magnis dis parturient montes. Habitasse platea dictumst quisque sagittis purus sit amet volutpat. Magna etiam tempor orci eu lobortis elementum nibh tellus molestie. Gravida arcu ac tortor dignissim convallis. Consequat nisl vel pretium lectus quam id leo in. Amet venenatis urna cursus eget. In est ante in nibh. Mauris commodo quis imperdiet massa. Pellentesque diam volutpat commodo sed egestas egestas fringilla phasellus.	lorem-ipsum-dolor-sit-amet	2021-06-10 06:54:54.758	2021-06-10 06:54:54.758	lorem,ipsum,dolor
5	3	Laoreet suspendisse interdum	consectetur libero id faucibus nisl tincidunt	Laoreet suspendisse interdum consectetur libero id faucibus nisl tincidunt. Enim sit amet venenatis urna cursus eget. Tristique senectus et netus et. Ipsum suspendisse ultrices gravida dictum fusce ut. Velit ut tortor pretium viverra suspendisse potenti nullam ac tortor. Sapien eget mi proin sed libero enim sed faucibus turpis. Ullamcorper malesuada proin libero nunc consequat interdum varius. Suscipit adipiscing bibendum est ultricies integer quis. Libero volutpat sed cras ornare arcu. In ante metus dictum at. Sed augue lacus viverra vitae congue eu consequat. Mi eget mauris pharetra et ultrices neque ornare aenean. Pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at. Blandit cursus risus at ultrices mi tempus. Ultrices gravida dictum fusce ut placerat. Sit amet justo donec enim. Malesuada fames ac turpis egestas integer eget.	Laoreet-suspendisse-interdum	2021-06-10 06:54:54.758	2021-06-10 06:54:54.758	laoreet, dorum,ipsum
6	1	Nibh praesent tristique magna	sit amet purus gravida quis	Nibh praesent tristique magna sit amet purus gravida quis. Commodo viverra maecenas accumsan lacus vel facilisis volutpat est. Sed viverra tellus in hac habitasse. Eu augue ut lectus arcu bibendum at varius vel pharetra. Leo vel fringilla est ullamcorper eget nulla facilisi etiam dignissim. Gravida dictum fusce ut placerat orci nulla pellentesque dignissim. Varius sit amet mattis vulputate enim nulla aliquet porttitor. Egestas diam in arcu cursus euismod quis viverra nibh. Facilisi cras fermentum odio eu feugiat pretium nibh ipsum consequat. Enim nulla aliquet porttitor lacus luctus. At varius vel pharetra vel turpis.	Nibh-praesent-tristique-magna	2021-06-10 06:54:54.758	2021-06-10 06:54:54.758	loret,dolor
7	2	Eget mi proin sed libero	enim sed faucibus turpis in	Eget mi proin sed libero enim sed faucibus turpis in. Sed odio morbi quis commodo odio aenean sed. Nibh mauris cursus mattis molestie a iaculis at. Tellus pellentesque eu tincidunt tortor. Massa vitae tortor condimentum lacinia quis. Scelerisque eu ultrices vitae auctor eu augue ut. Purus gravida quis blandit turpis cursus in hac habitasse platea. Ullamcorper sit amet risus nullam eget felis. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna neque. Pellentesque habitant morbi tristique senectus et netus. Vehicula ipsum a arcu cursus vitae. Amet luctus venenatis lectus magna fringilla urna porttitor rhoncus. Tristique senectus et netus et malesuada. Placerat duis ultricies lacus sed turpis tincidunt id aliquet. Dolor purus non enim praesent elementum facilisis leo. Blandit libero volutpat sed cras ornare arcu. Neque vitae tempus quam pellentesque. Elit eget gravida cum sociis.	Eget-mi-proin-sed-libero	2021-06-10 06:54:54.758	2021-06-10 06:54:54.758	loret,dolor,nibih
8	1	Nunc lobortis mattis aliquam	faucibus purus in massa tempor	Nunc lobortis mattis aliquam faucibus purus in massa tempor. Amet consectetur adipiscing elit pellentesque. Fermentum posuere urna nec tincidunt praesent semper feugiat nibh sed. Sed tempus urna et pharetra pharetra massa massa ultricies mi. Turpis egestas integer eget aliquet nibh praesent tristique magna sit. Pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus. In est ante in nibh mauris. Vel facilisis volutpat est velit egestas. Elementum integer enim neque volutpat ac tincidunt vitae. Id velit ut tortor pretium viverra. Commodo viverra maecenas accumsan lacus. Mi bibendum neque egestas congue.	Nunc-lobortis-mattis-aliquam	2021-06-10 06:54:54.758	2021-06-10 06:54:54.758	mitast
9	4	Cras sed felis eget velit	velit aliquet sagittis	Cras sed felis eget velit aliquet sagittis. Et sollicitudin ac orci phasellus egestas tellus rutrum tellus pellentesque. Elementum pulvinar etiam non quam lacus suspendisse faucibus interdum. Morbi tincidunt augue interdum velit euismod in. Vitae justo eget magna fermentum iaculis eu non. Pellentesque diam volutpat commodo sed. Cras ornare arcu dui vivamus arcu. Sed arcu non odio euismod lacinia at quis risus sed. Volutpat blandit aliquam etiam erat. Id neque aliquam vestibulum morbi blandit. Non sodales neque sodales ut etiam sit amet. Elit eget gravida cum sociis natoque penatibus et magnis. Eu feugiat pretium nibh ipsum consequat nisl vel pretium lectus. Suspendisse interdum consectetur libero id faucibus nisl tincidunt eget. Amet risus nullam eget felis eget nunc lobortis mattis. Volutpat consequat mauris nunc congue nisi vitae suscipit tellus.	Cras-sed-felis-eget-velit	2021-06-10 06:54:54.758	2021-06-10 06:54:54.758	dolor
10	4	Elementum facilisis leo vel fringilla	est ullamcorper eget nulla	Elementum facilisis leo vel fringilla est ullamcorper eget nulla. Sit amet nulla facilisi morbi tempus iaculis urna id. Bibendum ut tristique et egestas quis. Eu feugiat pretium nibh ipsum consequat nisl vel pretium lectus. Volutpat commodo sed egestas egestas fringilla phasellus faucibus. Mauris a diam maecenas sed enim ut sem. Lacus vestibulum sed arcu non odio. In fermentum et sollicitudin ac orci phasellus egestas. Blandit aliquam etiam erat velit scelerisque. Sit amet nisl suscipit adipiscing. Feugiat sed lectus vestibulum mattis ullamcorper. Nisl suscipit adipiscing bibendum est ultricies integer. Nam libero justo laoreet sit amet cursus sit amet.	Elementum-facilisis-leo-velfringilla	2021-06-10 06:54:54.758	2021-06-10 06:54:54.758	leo
11	4	Mi eget mauris pharetra et	A erat nam at lectus urna duis convallis	Mi eget mauris pharetra et. A erat nam at lectus urna duis convallis. Sit amet porttitor eget dolor morbi non. Adipiscing at in tellus integer feugiat scelerisque. A erat nam at lectus urna duis. Sit amet porttitor eget dolor morbi. Massa tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada. Tellus orci ac auctor augue mauris augue neque. Suspendisse potenti nullam ac tortor vitae purus. Ut consequat semper viverra nam libero justo laoreet. Iaculis nunc sed augue lacus viverra vitae congue eu consequat.	Mi-eget-mauris-pharetra-et	2021-06-10 06:54:54.758	2021-06-10 06:54:54.758	dolor
\.

--
-- Name: articles_favorites; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.articles_favorites (
	id integer NOT NULL,
	article_id integer NOT NULL,
	user_id integer NOT NULL,
	value boolean NOT NULL
);


ALTER TABLE public.articles_favorites OWNER TO "user";

--
-- Name: articles_favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.articles_favorites_id_seq
	AS integer
	START WITH 1
	INCREMENT BY 1
	NO MINVALUE
	NO MAXVALUE
	CACHE 1;


ALTER TABLE public.articles_favorites_id_seq OWNER TO "user";

--
-- Name: articles_favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.articles_favorites_id_seq OWNED BY public.articles_favorites.id;


--
-- Name: articles_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--




ALTER TABLE public.articles_id_seq OWNER TO "user";

--
-- Name: articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.articles_id_seq OWNED BY public.articles.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.sessions (
	id integer NOT NULL,
	user_id integer NOT NULL,
	session_one character varying(255) NOT NULL,
	session_two character varying(255) NOT NULL
);


ALTER TABLE public.sessions OWNER TO "user";

--
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.sessions_id_seq
	AS integer
	START WITH 1
	INCREMENT BY 1
	NO MINVALUE
	NO MAXVALUE
	CACHE 1;


ALTER TABLE public.sessions_id_seq OWNER TO "user";

--
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.sessions_id_seq OWNED BY public.sessions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.users (
	id integer NOT NULL,
	username character varying(50) NOT NULL,
	password character varying(100) NOT NULL,
	email character varying(355) NOT NULL,
	created_on timestamp without time zone,
	last_login timestamp without time zone,
	image character varying DEFAULT 'https://static.productionready.io/images/smiley-cyrus.jpg'::character varying NOT NULL,
	bio character varying(280)
);


ALTER TABLE public.users OWNER TO "user";

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--

CREATE SEQUENCE public.users_id_seq
	AS integer
	START WITH 1
	INCREMENT BY 1
	NO MINVALUE
	NO MAXVALUE
	CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO "user";

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: article_comments id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.article_comments ALTER COLUMN id SET DEFAULT nextval('public.article_comments_id_seq'::regclass);


--
-- Name: articles id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.articles ALTER COLUMN id SET DEFAULT nextval('public.articles_id_seq'::regclass);


--
-- Name: articles_favorites id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.articles_favorites ALTER COLUMN id SET DEFAULT nextval('public.articles_favorites_id_seq'::regclass);


--
-- Name: sessions id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sessions ALTER COLUMN id SET DEFAULT nextval('public.sessions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: article_comments; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.article_comments (id, article_id, author_image, author_id, author_username, body, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.articles (id, author_id, title, description, body, slug, created_at, updated_at, tags) FROM stdin;
\.


--
-- Data for Name: articles_favorites; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.articles_favorites (id, article_id, user_id, value) FROM stdin;
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.sessions (id, user_id, session_one, session_two) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: user
--

COPY public.users (id, username, password, email, created_on, last_login, image, bio) FROM stdin;
1	testuser1	$2a$10$Qo392XEiES.BKHo52.mYduWU.UY3XLpba8b5NyBdkd3Ph.kUM4xOm	testuser1@example.com	2020-05-14 20:03:56.025651	\N	https://static.productionready.io/images/smiley-cyrus.jpg	\N
2	testuser2	$2a$10$Qo392XEiES.BKHo52.mYduWU.UY3XLpba8b5NyBdkd3Ph.kUM4xOm	testuser2@example.com	2020-05-14 20:03:56.025651	\N	https://static.productionready.io/images/smiley-cyrus.jpg	\N
3	testuser3	$2a$10$Qo392XEiES.BKHo52.mYduWU.UY3XLpba8b5NyBdkd3Ph.kUM4xOm	testuser3@example.com	2020-05-14 20:03:56.025651	\N	https://static.productionready.io/images/smiley-cyrus.jpg	\N
4	testuser4	$2a$10$Qo392XEiES.BKHo52.mYduWU.UY3XLpba8b5NyBdkd3Ph.kUM4xOm	testuser4@example.com	2020-05-14 20:03:56.025651	\N	https://static.productionready.io/images/smiley-cyrus.jpg	\N
\.


--
-- Name: user_favorites; Type: TABLE; Schema: public; Owner: user
--

CREATE TABLE public.user_favorites (
	id serial,
	favorited_user_id integer NOT NULL,
	user_id integer NOT NULL,
	value boolean NOT NULL
);


ALTER TABLE public.user_favorites OWNER TO "user";

--
-- Name: user_favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: user
--




ALTER TABLE public.user_favorites_id_seq OWNER TO "user";

SELECT pg_catalog.setval('public.user_favorites_id_seq', 1, true);

--
-- Name: user_favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: user
--

ALTER SEQUENCE public.user_favorites_id_seq OWNED BY public.user_favorites.id;


--
-- Name: article_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.article_comments_id_seq', 1, false);


--
-- Name: articles_favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.articles_favorites_id_seq', 1, false);


--
-- Name: articles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.articles_id_seq', 1, true);


--
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.sessions_id_seq', 1, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: user
--

SELECT pg_catalog.setval('public.users_id_seq', 100, true);


--
-- Name: article_comments article_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.article_comments
	ADD CONSTRAINT article_comments_pkey PRIMARY KEY (id);


--
-- Name: articles_favorites articles_favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.articles_favorites
	ADD CONSTRAINT articles_favorites_pkey PRIMARY KEY (id);


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.articles
	ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sessions
	ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.user_favorites
	ADD CONSTRAINT user_favorites_pkey PRIMARY KEY (id);

--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.users
	ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: user
--

ALTER TABLE ONLY public.sessions
	ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


ALTER SEQUENCE public.articles_id_seq RESTART WITH 100;

--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 11.8 (Debian 11.8-1.pgdg90+1)
-- Dumped by pg_dump version 11.8 (Debian 11.8-1.pgdg90+1)

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
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--
