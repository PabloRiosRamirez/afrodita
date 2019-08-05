--
-- PostgreSQL database dump
--

-- Dumped from database version 11.4 (Ubuntu 11.4-1.pgdg16.04+1)
-- Dumped by pg_dump version 11.2

-- Started on 2019-07-23 02:30:01

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 196 (class 1259 OID 14296549)
-- Name: organization; Type: TABLE; Schema: public; Owner: jwbdbvwspnyesh
--

CREATE TABLE public.organization (
    id_organization bigint NOT NULL,
    name character varying(100) NOT NULL,
    rut character varying(25) NOT NULL
);


ALTER TABLE public.organization OWNER TO jwbdbvwspnyesh;

--
-- TOC entry 3866 (class 0 OID 0)
-- Dependencies: 196
-- Name: TABLE organization; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON TABLE public.organization IS 'Organizaciones registradas en el sistema';


--
-- TOC entry 3867 (class 0 OID 0)
-- Dependencies: 196
-- Name: COLUMN organization.id_organization; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON COLUMN public.organization.id_organization IS 'Identificador de la organización';


--
-- TOC entry 3868 (class 0 OID 0)
-- Dependencies: 196
-- Name: COLUMN organization.name; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON COLUMN public.organization.name IS 'Nombre de la organización';


--
-- TOC entry 3869 (class 0 OID 0)
-- Dependencies: 196
-- Name: COLUMN organization.rut; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON COLUMN public.organization.rut IS 'Rut comercial de la organización';


--
-- TOC entry 197 (class 1259 OID 14296555)
-- Name: grisk_enterprise_id_enterprise_seq; Type: SEQUENCE; Schema: public; Owner: jwbdbvwspnyesh
--

CREATE SEQUENCE public.grisk_enterprise_id_enterprise_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.grisk_enterprise_id_enterprise_seq OWNER TO jwbdbvwspnyesh;

--
-- TOC entry 3870 (class 0 OID 0)
-- Dependencies: 197
-- Name: grisk_enterprise_id_enterprise_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jwbdbvwspnyesh
--

ALTER SEQUENCE public.grisk_enterprise_id_enterprise_seq OWNED BY public.organization.id_organization;


--
-- TOC entry 198 (class 1259 OID 14296566)
-- Name: role; Type: TABLE; Schema: public; Owner: jwbdbvwspnyesh
--

CREATE TABLE public.role (
    id_role smallint NOT NULL,
    name character varying(50) NOT NULL,
    code character varying(25) NOT NULL
);


ALTER TABLE public.role OWNER TO jwbdbvwspnyesh;

--
-- TOC entry 3871 (class 0 OID 0)
-- Dependencies: 198
-- Name: TABLE role; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON TABLE public.role IS 'Roles para usuarios del sistema';


--
-- TOC entry 3872 (class 0 OID 0)
-- Dependencies: 198
-- Name: COLUMN role.id_role; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON COLUMN public.role.id_role IS 'Identificador del rol';


--
-- TOC entry 3873 (class 0 OID 0)
-- Dependencies: 198
-- Name: COLUMN role.name; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON COLUMN public.role.name IS 'Nombre del rol';


--
-- TOC entry 3874 (class 0 OID 0)
-- Dependencies: 198
-- Name: COLUMN role.code; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON COLUMN public.role.code IS 'Código interno del rol';


--
-- TOC entry 199 (class 1259 OID 14296572)
-- Name: grisk_role_id_role_seq; Type: SEQUENCE; Schema: public; Owner: jwbdbvwspnyesh
--

CREATE SEQUENCE public.grisk_role_id_role_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.grisk_role_id_role_seq OWNER TO jwbdbvwspnyesh;

--
-- TOC entry 3875 (class 0 OID 0)
-- Dependencies: 199
-- Name: grisk_role_id_role_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jwbdbvwspnyesh
--

ALTER SEQUENCE public.grisk_role_id_role_seq OWNED BY public.role.id_role;


--
-- TOC entry 200 (class 1259 OID 14296574)
-- Name: user; Type: TABLE; Schema: public; Owner: jwbdbvwspnyesh
--

CREATE TABLE public."user" (
    id_user bigint NOT NULL,
    username character varying(50) NOT NULL,
    pass character varying(100) NOT NULL,
    create_at timestamp without time zone,
    update_at timestamp without time zone NOT NULL,
    role smallint NOT NULL,
    organization bigint NOT NULL,
    enabled boolean NOT NULL,
    non_locked boolean NOT NULL,
    email character varying NOT NULL,
    token_restart character varying,
    token_confirm character varying
);


ALTER TABLE public."user" OWNER TO jwbdbvwspnyesh;

--
-- TOC entry 3876 (class 0 OID 0)
-- Dependencies: 200
-- Name: TABLE "user"; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON TABLE public."user" IS 'Usuarios del sistema';


--
-- TOC entry 3877 (class 0 OID 0)
-- Dependencies: 200
-- Name: COLUMN "user".id_user; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON COLUMN public."user".id_user IS 'Identificador del usuario';


--
-- TOC entry 3878 (class 0 OID 0)
-- Dependencies: 200
-- Name: COLUMN "user".username; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON COLUMN public."user".username IS 'Nombre interno del usuario';


--
-- TOC entry 3879 (class 0 OID 0)
-- Dependencies: 200
-- Name: COLUMN "user".pass; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON COLUMN public."user".pass IS 'Contraseña del usuario';


--
-- TOC entry 3880 (class 0 OID 0)
-- Dependencies: 200
-- Name: COLUMN "user".create_at; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON COLUMN public."user".create_at IS 'Fecha de creación del usuario';


--
-- TOC entry 3881 (class 0 OID 0)
-- Dependencies: 200
-- Name: COLUMN "user".update_at; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON COLUMN public."user".update_at IS 'Última fecha de actualización de datos del usuario';


--
-- TOC entry 3882 (class 0 OID 0)
-- Dependencies: 200
-- Name: COLUMN "user".role; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON COLUMN public."user".role IS 'Identificador del rol del usuario';


--
-- TOC entry 3883 (class 0 OID 0)
-- Dependencies: 200
-- Name: COLUMN "user".organization; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON COLUMN public."user".organization IS 'Identificador de la organización del usuario';


--
-- TOC entry 3884 (class 0 OID 0)
-- Dependencies: 200
-- Name: COLUMN "user".enabled; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON COLUMN public."user".enabled IS 'Estado de activación del usuario';


--
-- TOC entry 3885 (class 0 OID 0)
-- Dependencies: 200
-- Name: COLUMN "user".non_locked; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON COLUMN public."user".non_locked IS 'Estado de bloqueo de ingreso del usuario';


--
-- TOC entry 3886 (class 0 OID 0)
-- Dependencies: 200
-- Name: COLUMN "user".email; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON COLUMN public."user".email IS 'Correo electrónico del usuario';


--
-- TOC entry 3887 (class 0 OID 0)
-- Dependencies: 200
-- Name: COLUMN "user".token_restart; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON COLUMN public."user".token_restart IS 'Último token creado para el restablecimieto de contraseña del usuario';


--
-- TOC entry 3888 (class 0 OID 0)
-- Dependencies: 200
-- Name: COLUMN "user".token_confirm; Type: COMMENT; Schema: public; Owner: jwbdbvwspnyesh
--

COMMENT ON COLUMN public."user".token_confirm IS 'Último token creado para la activación de cuenta del usuario';


--
-- TOC entry 201 (class 1259 OID 14296580)
-- Name: grisk_user_id_user_seq; Type: SEQUENCE; Schema: public; Owner: jwbdbvwspnyesh
--

CREATE SEQUENCE public.grisk_user_id_user_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.grisk_user_id_user_seq OWNER TO jwbdbvwspnyesh;

--
-- TOC entry 3889 (class 0 OID 0)
-- Dependencies: 201
-- Name: grisk_user_id_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: jwbdbvwspnyesh
--

ALTER SEQUENCE public.grisk_user_id_user_seq OWNED BY public."user".id_user;


--
-- TOC entry 3714 (class 2604 OID 14296587)
-- Name: organization id_organization; Type: DEFAULT; Schema: public; Owner: jwbdbvwspnyesh
--

ALTER TABLE ONLY public.organization ALTER COLUMN id_organization SET DEFAULT nextval('public.grisk_enterprise_id_enterprise_seq'::regclass);


--
-- TOC entry 3715 (class 2604 OID 14296588)
-- Name: role id_role; Type: DEFAULT; Schema: public; Owner: jwbdbvwspnyesh
--

ALTER TABLE ONLY public.role ALTER COLUMN id_role SET DEFAULT nextval('public.grisk_role_id_role_seq'::regclass);


--
-- TOC entry 3716 (class 2604 OID 14296589)
-- Name: user id_user; Type: DEFAULT; Schema: public; Owner: jwbdbvwspnyesh
--

ALTER TABLE ONLY public."user" ALTER COLUMN id_user SET DEFAULT nextval('public.grisk_user_id_user_seq'::regclass);


--
-- TOC entry 3853 (class 0 OID 14296549)
-- Dependencies: 196
-- Data for Name: organization; Type: TABLE DATA; Schema: public; Owner: jwbdbvwspnyesh
--

COPY public.organization (id_organization, name, rut) FROM stdin;
1	GRisk	1-9
2	Automotora Valdivieso	2-8
3	Factory Capital	3-6
\.


--
-- TOC entry 3855 (class 0 OID 14296566)
-- Dependencies: 198
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: jwbdbvwspnyesh
--

COPY public.role (id_role, name, code) FROM stdin;
1	Root	ROOT
2	Administrador	ADMIN
3	Básico	BASIC
\.


--
-- TOC entry 3857 (class 0 OID 14296574)
-- Dependencies: 200
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: jwbdbvwspnyesh
--

COPY public."user" (id_user, username, pass, create_at, update_at, role, organization, enabled, non_locked, email, token_restart, token_confirm) FROM stdin;
4	boyarzun	$2a$10$9/VZ6mF8xfFQBSPgWAWJLORSZ9LeyhkPNYoRN5woj0l2Dg5RWMOjm	2019-03-26 00:00:00	2019-03-26 00:00:00	2	3	t	t	boyarzun@gmail.com	\N	\N
1	grisk	$2a$10$DIHi4e7WUSoUAWKHbGScEeKG37Lfnw5qsTeWZtElqUsjUhXqUJ0cO	2019-03-26 00:00:00	2019-03-26 00:00:00	2	1	t	t	grisk@gmail.com	\N	\N
2	prios	test	2019-03-26 00:00:00	2019-03-26 00:00:00	2	2	f	f	pa.riosramirez@gmail.com	ad5a7a3500f50fa753913ec83e90ffe2	abc
3	jpereira	$2a$10$Mre6xdBz2HcGqjvwVY1SfeIagPUG/QcOjGWDVLv81kbaF4PTVx2uG	2019-03-26 00:00:00	2019-03-26 00:00:00	3	2	t	t	jonathan.pereira.ing@gmail.com	e0b90ba31d23e0b3e7682d2c029a7a58	\N
\.


--
-- TOC entry 3890 (class 0 OID 0)
-- Dependencies: 197
-- Name: grisk_enterprise_id_enterprise_seq; Type: SEQUENCE SET; Schema: public; Owner: jwbdbvwspnyesh
--

SELECT pg_catalog.setval('public.grisk_enterprise_id_enterprise_seq', 14, true);


--
-- TOC entry 3891 (class 0 OID 0)
-- Dependencies: 199
-- Name: grisk_role_id_role_seq; Type: SEQUENCE SET; Schema: public; Owner: jwbdbvwspnyesh
--

SELECT pg_catalog.setval('public.grisk_role_id_role_seq', 3, true);


--
-- TOC entry 3892 (class 0 OID 0)
-- Dependencies: 201
-- Name: grisk_user_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: jwbdbvwspnyesh
--

SELECT pg_catalog.setval('public.grisk_user_id_user_seq', 12, true);


--
-- TOC entry 3718 (class 2606 OID 14297079)
-- Name: organization grisk_enterprise_pk; Type: CONSTRAINT; Schema: public; Owner: jwbdbvwspnyesh
--

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT grisk_enterprise_pk PRIMARY KEY (id_organization);


--
-- TOC entry 3720 (class 2606 OID 56207035)
-- Name: organization grisk_enterprise_un; Type: CONSTRAINT; Schema: public; Owner: jwbdbvwspnyesh
--

ALTER TABLE ONLY public.organization
    ADD CONSTRAINT grisk_enterprise_un UNIQUE (rut);


--
-- TOC entry 3722 (class 2606 OID 14297085)
-- Name: role grisk_role_pkey; Type: CONSTRAINT; Schema: public; Owner: jwbdbvwspnyesh
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT grisk_role_pkey PRIMARY KEY (id_role);


--
-- TOC entry 3724 (class 2606 OID 56207042)
-- Name: role grisk_role_un; Type: CONSTRAINT; Schema: public; Owner: jwbdbvwspnyesh
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT grisk_role_un UNIQUE (code);


--
-- TOC entry 3726 (class 2606 OID 14297089)
-- Name: user grisk_user_pkey; Type: CONSTRAINT; Schema: public; Owner: jwbdbvwspnyesh
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT grisk_user_pkey PRIMARY KEY (id_user);


--
-- TOC entry 3728 (class 2606 OID 56207439)
-- Name: user grisk_user_un; Type: CONSTRAINT; Schema: public; Owner: jwbdbvwspnyesh
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT grisk_user_un UNIQUE (username, email);


--
-- TOC entry 3729 (class 1259 OID 56207440)
-- Name: grisk_user_username_idx; Type: INDEX; Schema: public; Owner: jwbdbvwspnyesh
--

CREATE UNIQUE INDEX grisk_user_username_idx ON public."user" USING btree (username);


--
-- TOC entry 3730 (class 2606 OID 14297100)
-- Name: user grisk_user_grisk_enterprise_fk; Type: FK CONSTRAINT; Schema: public; Owner: jwbdbvwspnyesh
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT grisk_user_grisk_enterprise_fk FOREIGN KEY (organization) REFERENCES public.organization(id_organization);


--
-- TOC entry 3731 (class 2606 OID 14297105)
-- Name: user grisk_user_grisk_role_fk; Type: FK CONSTRAINT; Schema: public; Owner: jwbdbvwspnyesh
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT grisk_user_grisk_role_fk FOREIGN KEY (role) REFERENCES public.role(id_role);


INSERT INTO public."role" (id_role, "name", code) VALUES(1, 'Administrador', 'ADMIN');
INSERT INTO public."role" (id_role, "name", code) VALUES(2, 'Básico', 'BASIC');


--
-- TOC entry 3864 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: jwbdbvwspnyesh
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO jwbdbvwspnyesh;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- TOC entry 3865 (class 0 OID 0)
-- Dependencies: 607
-- Name: LANGUAGE plpgsql; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON LANGUAGE plpgsql TO jwbdbvwspnyesh;


-- Completed on 2019-07-23 02:30:19

--
-- PostgreSQL database dump complete
--


