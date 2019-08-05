--
-- PostgreSQL database dump
--

-- Dumped from database version 11.4 (Ubuntu 11.4-1.pgdg16.04+1)
-- Dumped by pg_dump version 11.2

-- Started on 2019-07-23 02:37:35

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
-- TOC entry 197 (class 1259 OID 14442659)
-- Name: data_integration; Type: TABLE; Schema: public; Owner: fmftbiuoazlhhu
--

CREATE TABLE public.data_integration (
    id_data_integration bigint NOT NULL,
    organization bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    enabled boolean NOT NULL,
    bureau boolean NOT NULL
);


--
-- TOC entry 202 (class 1259 OID 14580881)
-- Name: data_integration_has_variable; Type: TABLE; Schema: public; Owner: fmftbiuoazlhhu
--

CREATE TABLE public.data_integration_has_variable (
    id_data_integration bigint NOT NULL,
    id_variable bigint NOT NULL
);



--
-- TOC entry 196 (class 1259 OID 14442657)
-- Name: data_integration_id_data_integration_seq; Type: SEQUENCE; Schema: public; Owner: fmftbiuoazlhhu
--

CREATE SEQUENCE public.data_integration_id_data_integration_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3929 (class 0 OID 0)
-- Dependencies: 196
-- Name: data_integration_id_data_integration_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER SEQUENCE public.data_integration_id_data_integration_seq OWNED BY public.data_integration.id_data_integration;


--
-- TOC entry 206 (class 1259 OID 14685298)
-- Name: node_tree; Type: TABLE; Schema: public; Owner: fmftbiuoazlhhu
--

CREATE TABLE public.node_tree (
    id_node_tree bigint NOT NULL,
    variable character varying(100),
    comparator character varying(50),
    value_comparator character varying(50),
    output boolean NOT NULL,
    label_output character varying(100),
    color character varying(10),
    parent bigint,
    tree bigint NOT NULL
);


--
-- TOC entry 205 (class 1259 OID 14685296)
-- Name: node_tree_id_node_tree_seq; Type: SEQUENCE; Schema: public; Owner: fmftbiuoazlhhu
--

CREATE SEQUENCE public.node_tree_id_node_tree_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3930 (class 0 OID 0)
-- Dependencies: 205
-- Name: node_tree_id_node_tree_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER SEQUENCE public.node_tree_id_node_tree_seq OWNED BY public.node_tree.id_node_tree;


--
-- TOC entry 208 (class 1259 OID 14685376)
-- Name: ratio; Type: TABLE; Schema: public; Owner: fmftbiuoazlhhu
--

CREATE TABLE public.ratio (
    id_ratio bigint NOT NULL,
    titule character varying(100) NOT NULL,
    organization bigint NOT NULL,
    color character varying(10) NOT NULL,
    post_result character varying(25) NOT NULL,
    operation character varying(100) NOT NULL,
    order_display smallint NOT NULL,
    enabled boolean NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- TOC entry 207 (class 1259 OID 14685374)
-- Name: ratio_id_ratio_seq; Type: SEQUENCE; Schema: public; Owner: fmftbiuoazlhhu
--

CREATE SEQUENCE public.ratio_id_ratio_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- TOC entry 3931 (class 0 OID 0)
-- Dependencies: 207
-- Name: ratio_id_ratio_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER SEQUENCE public.ratio_id_ratio_seq OWNED BY public.ratio.id_ratio;


--
-- TOC entry 210 (class 1259 OID 14688509)
-- Name: score; Type: TABLE; Schema: public; Owner: fmftbiuoazlhhu
--

CREATE TABLE public.score (
    id_score bigint NOT NULL,
    titule character varying(100) NOT NULL,
    organization bigint NOT NULL,
    variable character varying(100) NOT NULL,
    enabled boolean NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- TOC entry 209 (class 1259 OID 14688507)
-- Name: score_id_score_seq; Type: SEQUENCE; Schema: public; Owner: fmftbiuoazlhhu
--

CREATE SEQUENCE public.score_id_score_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3932 (class 0 OID 0)
-- Dependencies: 209
-- Name: score_id_score_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER SEQUENCE public.score_id_score_seq OWNED BY public.score.id_score;


--
-- TOC entry 212 (class 1259 OID 14688522)
-- Name: score_range; Type: TABLE; Schema: public; Owner: fmftbiuoazlhhu
--

CREATE TABLE public.score_range (
    id_score_range bigint NOT NULL,
    upper_limit smallint NOT NULL,
    lower_limit smallint NOT NULL,
    color character varying(10) NOT NULL,
    score bigint NOT NULL
);


--
-- TOC entry 211 (class 1259 OID 14688520)
-- Name: score_range_id_score_range_seq; Type: SEQUENCE; Schema: public; Owner: fmftbiuoazlhhu
--

CREATE SEQUENCE public.score_range_id_score_range_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3933 (class 0 OID 0)
-- Dependencies: 211
-- Name: score_range_id_score_range_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER SEQUENCE public.score_range_id_score_range_seq OWNED BY public.score_range.id_score_range;


--
-- TOC entry 204 (class 1259 OID 14665505)
-- Name: tree; Type: TABLE; Schema: public; Owner: fmftbiuoazlhhu
--

CREATE TABLE public.tree (
    id_tree bigint NOT NULL,
    titule character varying(100) NOT NULL,
    organization bigint NOT NULL,
    enabled boolean NOT NULL,
    created_at timestamp without time zone NOT NULL
);


--
-- TOC entry 203 (class 1259 OID 14665503)
-- Name: tree_id_tree_seq; Type: SEQUENCE; Schema: public; Owner: fmftbiuoazlhhu
--

CREATE SEQUENCE public.tree_id_tree_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3934 (class 0 OID 0)
-- Dependencies: 203
-- Name: tree_id_tree_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER SEQUENCE public.tree_id_tree_seq OWNED BY public.tree.id_tree;


--
-- TOC entry 199 (class 1259 OID 14461148)
-- Name: type_variable; Type: TABLE; Schema: public; Owner: fmftbiuoazlhhu
--

CREATE TABLE public.type_variable (
    id_type_variable bigint NOT NULL,
    name character varying(100) NOT NULL,
    code character varying(50) NOT NULL
);


--
-- TOC entry 198 (class 1259 OID 14461146)
-- Name: type_variable_id_type_variable_seq; Type: SEQUENCE; Schema: public; Owner: fmftbiuoazlhhu
--

CREATE SEQUENCE public.type_variable_id_type_variable_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- TOC entry 3935 (class 0 OID 0)
-- Dependencies: 198
-- Name: type_variable_id_type_variable_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER SEQUENCE public.type_variable_id_type_variable_seq OWNED BY public.type_variable.id_type_variable;


--
-- TOC entry 201 (class 1259 OID 14461174)
-- Name: variable; Type: TABLE; Schema: public; Owner: fmftbiuoazlhhu
--

CREATE TABLE public.variable (
    id_variable bigint NOT NULL,
    name character varying(100) NOT NULL,
    code character varying(50) NOT NULL,
    coordinate character varying(50) NOT NULL,
    default_value character varying(100) NOT NULL,
    type_variable bigint NOT NULL
);

--
-- TOC entry 200 (class 1259 OID 14461172)
-- Name: variable_id_variable_seq; Type: SEQUENCE; Schema: public; Owner: fmftbiuoazlhhu
--

CREATE SEQUENCE public.variable_id_variable_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 3936 (class 0 OID 0)
-- Dependencies: 200
-- Name: variable_id_variable_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER SEQUENCE public.variable_id_variable_seq OWNED BY public.variable.id_variable;


--
-- TOC entry 3747 (class 2604 OID 14442662)
-- Name: data_integration id_data_integration; Type: DEFAULT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.data_integration ALTER COLUMN id_data_integration SET DEFAULT nextval('public.data_integration_id_data_integration_seq'::regclass);


--
-- TOC entry 3751 (class 2604 OID 14685301)
-- Name: node_tree id_node_tree; Type: DEFAULT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.node_tree ALTER COLUMN id_node_tree SET DEFAULT nextval('public.node_tree_id_node_tree_seq'::regclass);


--
-- TOC entry 3752 (class 2604 OID 14685379)
-- Name: ratio id_ratio; Type: DEFAULT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.ratio ALTER COLUMN id_ratio SET DEFAULT nextval('public.ratio_id_ratio_seq'::regclass);


--
-- TOC entry 3753 (class 2604 OID 14688512)
-- Name: score id_score; Type: DEFAULT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.score ALTER COLUMN id_score SET DEFAULT nextval('public.score_id_score_seq'::regclass);


--
-- TOC entry 3754 (class 2604 OID 14688525)
-- Name: score_range id_score_range; Type: DEFAULT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.score_range ALTER COLUMN id_score_range SET DEFAULT nextval('public.score_range_id_score_range_seq'::regclass);


--
-- TOC entry 3750 (class 2604 OID 14665508)
-- Name: tree id_tree; Type: DEFAULT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.tree ALTER COLUMN id_tree SET DEFAULT nextval('public.tree_id_tree_seq'::regclass);


--
-- TOC entry 3748 (class 2604 OID 14461151)
-- Name: type_variable id_type_variable; Type: DEFAULT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.type_variable ALTER COLUMN id_type_variable SET DEFAULT nextval('public.type_variable_id_type_variable_seq'::regclass);


--
-- TOC entry 3749 (class 2604 OID 14461177)
-- Name: variable id_variable; Type: DEFAULT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.variable ALTER COLUMN id_variable SET DEFAULT nextval('public.variable_id_variable_seq'::regclass);


--
-- TOC entry 3906 (class 0 OID 14442659)
-- Dependencies: 197
-- Data for Name: data_integration; Type: TABLE DATA; Schema: public; Owner: fmftbiuoazlhhu
--


--
-- TOC entry 3911 (class 0 OID 14580881)
-- Dependencies: 202
-- Data for Name: data_integration_has_variable; Type: TABLE DATA; Schema: public; Owner: fmftbiuoazlhhu
--

--
-- TOC entry 3915 (class 0 OID 14685298)
-- Dependencies: 206
-- Data for Name: node_tree; Type: TABLE DATA; Schema: public; Owner: fmftbiuoazlhhu
--

--
-- TOC entry 3917 (class 0 OID 14685376)
-- Dependencies: 208
-- Data for Name: ratio; Type: TABLE DATA; Schema: public; Owner: fmftbiuoazlhhu
--


--
-- TOC entry 3919 (class 0 OID 14688509)
-- Dependencies: 210
-- Data for Name: score; Type: TABLE DATA; Schema: public; Owner: fmftbiuoazlhhu
--

--
-- TOC entry 3921 (class 0 OID 14688522)
-- Dependencies: 212
-- Data for Name: score_range; Type: TABLE DATA; Schema: public; Owner: fmftbiuoazlhhu
--

--
-- TOC entry 3913 (class 0 OID 14665505)
-- Dependencies: 204
-- Data for Name: tree; Type: TABLE DATA; Schema: public; Owner: fmftbiuoazlhhu
--


--
-- TOC entry 3908 (class 0 OID 14461148)
-- Dependencies: 199
-- Data for Name: type_variable; Type: TABLE DATA; Schema: public; Owner: fmftbiuoazlhhu
--

--
-- TOC entry 3910 (class 0 OID 14461174)
-- Dependencies: 201
-- Data for Name: variable; Type: TABLE DATA; Schema: public; Owner: fmftbiuoazlhhu
--



--
-- TOC entry 3937 (class 0 OID 0)
-- Dependencies: 196
-- Name: data_integration_id_data_integration_seq; Type: SEQUENCE SET; Schema: public; Owner: fmftbiuoazlhhu
--

SELECT pg_catalog.setval('public.data_integration_id_data_integration_seq', 1, false);


--
-- TOC entry 3938 (class 0 OID 0)
-- Dependencies: 205
-- Name: node_tree_id_node_tree_seq; Type: SEQUENCE SET; Schema: public; Owner: fmftbiuoazlhhu
--

SELECT pg_catalog.setval('public.node_tree_id_node_tree_seq', 1, false);


--
-- TOC entry 3939 (class 0 OID 0)
-- Dependencies: 207
-- Name: ratio_id_ratio_seq; Type: SEQUENCE SET; Schema: public; Owner: fmftbiuoazlhhu
--

SELECT pg_catalog.setval('public.ratio_id_ratio_seq', 1, false);


--
-- TOC entry 3940 (class 0 OID 0)
-- Dependencies: 209
-- Name: score_id_score_seq; Type: SEQUENCE SET; Schema: public; Owner: fmftbiuoazlhhu
--

SELECT pg_catalog.setval('public.score_id_score_seq', 1, false);


--
-- TOC entry 3941 (class 0 OID 0)
-- Dependencies: 211
-- Name: score_range_id_score_range_seq; Type: SEQUENCE SET; Schema: public; Owner: fmftbiuoazlhhu
--

SELECT pg_catalog.setval('public.score_range_id_score_range_seq', 1, false);


--
-- TOC entry 3942 (class 0 OID 0)
-- Dependencies: 203
-- Name: tree_id_tree_seq; Type: SEQUENCE SET; Schema: public; Owner: fmftbiuoazlhhu
--

SELECT pg_catalog.setval('public.tree_id_tree_seq', 1, false);


--
-- TOC entry 3943 (class 0 OID 0)
-- Dependencies: 198
-- Name: type_variable_id_type_variable_seq; Type: SEQUENCE SET; Schema: public; Owner: fmftbiuoazlhhu
--

SELECT pg_catalog.setval('public.type_variable_id_type_variable_seq', 1, false);


--
-- TOC entry 3944 (class 0 OID 0)
-- Dependencies: 200
-- Name: variable_id_variable_seq; Type: SEQUENCE SET; Schema: public; Owner: fmftbiuoazlhhu
--

SELECT pg_catalog.setval('public.variable_id_variable_seq', 1, false);


--
-- TOC entry 3764 (class 2606 OID 14580885)
-- Name: data_integration_has_variable data_integration_has_variable_pk; Type: CONSTRAINT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.data_integration_has_variable
    ADD CONSTRAINT data_integration_has_variable_pk PRIMARY KEY (id_data_integration, id_variable);


--
-- TOC entry 3756 (class 2606 OID 14442664)
-- Name: data_integration data_integration_pk; Type: CONSTRAINT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.data_integration
    ADD CONSTRAINT data_integration_pk PRIMARY KEY (id_data_integration);


--
-- TOC entry 3758 (class 2606 OID 14615843)
-- Name: data_integration data_integration_un; Type: CONSTRAINT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.data_integration
    ADD CONSTRAINT data_integration_un UNIQUE (id_data_integration);


--
-- TOC entry 3768 (class 2606 OID 14685303)
-- Name: node_tree node_tree_pk; Type: CONSTRAINT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.node_tree
    ADD CONSTRAINT node_tree_pk PRIMARY KEY (id_node_tree);


--
-- TOC entry 3770 (class 2606 OID 14688327)
-- Name: ratio ratio_pk; Type: CONSTRAINT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.ratio
    ADD CONSTRAINT ratio_pk PRIMARY KEY (id_ratio);


--
-- TOC entry 3772 (class 2606 OID 14688329)
-- Name: ratio ratio_un; Type: CONSTRAINT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.ratio
    ADD CONSTRAINT ratio_un UNIQUE (id_ratio);


--
-- TOC entry 3774 (class 2606 OID 14688530)
-- Name: score score_pk; Type: CONSTRAINT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.score
    ADD CONSTRAINT score_pk PRIMARY KEY (id_score);


--
-- TOC entry 3778 (class 2606 OID 14688527)
-- Name: score_range score_range_pk; Type: CONSTRAINT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.score_range
    ADD CONSTRAINT score_range_pk PRIMARY KEY (id_score_range);


--
-- TOC entry 3776 (class 2606 OID 14688532)
-- Name: score score_un; Type: CONSTRAINT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.score
    ADD CONSTRAINT score_un UNIQUE (id_score);


--
-- TOC entry 3766 (class 2606 OID 14665510)
-- Name: tree tree_pk; Type: CONSTRAINT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.tree
    ADD CONSTRAINT tree_pk PRIMARY KEY (id_tree);


--
-- TOC entry 3760 (class 2606 OID 14461191)
-- Name: type_variable type_variable_pk; Type: CONSTRAINT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.type_variable
    ADD CONSTRAINT type_variable_pk PRIMARY KEY (id_type_variable);


--
-- TOC entry 3762 (class 2606 OID 14461182)
-- Name: variable variable_pk; Type: CONSTRAINT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.variable
    ADD CONSTRAINT variable_pk PRIMARY KEY (id_variable);


--
-- TOC entry 3781 (class 2606 OID 14584261)
-- Name: data_integration_has_variable data_integration_has_variable_data_integration_fk; Type: FK CONSTRAINT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.data_integration_has_variable
    ADD CONSTRAINT data_integration_has_variable_data_integration_fk FOREIGN KEY (id_data_integration) REFERENCES public.data_integration(id_data_integration);


--
-- TOC entry 3780 (class 2606 OID 14584256)
-- Name: data_integration_has_variable data_integration_has_variable_variable_fk; Type: FK CONSTRAINT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.data_integration_has_variable
    ADD CONSTRAINT data_integration_has_variable_variable_fk FOREIGN KEY (id_variable) REFERENCES public.variable(id_variable);


--
-- TOC entry 3782 (class 2606 OID 14685304)
-- Name: node_tree node_tree_tree_fk; Type: FK CONSTRAINT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.node_tree
    ADD CONSTRAINT node_tree_tree_fk FOREIGN KEY (tree) REFERENCES public.tree(id_tree);


--
-- TOC entry 3783 (class 2606 OID 14688552)
-- Name: score_range score_range_score_fk; Type: FK CONSTRAINT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.score_range
    ADD CONSTRAINT score_range_score_fk FOREIGN KEY (score) REFERENCES public.score(id_score);


--
-- TOC entry 3779 (class 2606 OID 14580372)
-- Name: variable variable_type_variable_fk; Type: FK CONSTRAINT; Schema: public; Owner: fmftbiuoazlhhu
--

ALTER TABLE ONLY public.variable
    ADD CONSTRAINT variable_type_variable_fk FOREIGN KEY (type_variable) REFERENCES public.type_variable(id_type_variable);

        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Nombre', 'name', null, '--', 3, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Apellido paterno', 'apePad', null, '--', 3, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Apellido materno', 'apeMat', null, '--', 3, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Edad', 'indEdad', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Sexo', 'indSexo', null, '--', 3, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Nacionalidad', 'indNacionalidad', null, '--', 3, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Estado civil', 'indEstCiv', null, '--', 3, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Número de hijos', 'indNroHij', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Presenta fideicomiso financiero', 'indTieneFDEF', null, '--', 3, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de vehículos motorizados', 'indTotVehs', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Monto total del avaluo fiscal de vehículos motorizados', 'indMonVehs', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de bienes raíces', 'indTotBBRR', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Monto total del avaluo fiscal de los bienes raíces', 'indMonBBRR', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Grupo socio económico', 'indGrpSocEc', null, '--', 3, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Nivel educacional', 'indNivelEduc', null, '--', 3, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de documentos protestados dentro de los últimos 2 meses', 'indCantDoc02', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de documentos protestados dentro de los últimos 6 meses', 'indCantDoc06', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de documentos protestados dentro de los últimos 12 meses', 'indCantDoc12', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de documentos protestados dentro de los últimos 24 meses', 'indCantDoc24', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de documentos protestados dentro de los últimos 36 meses', 'indCantDoc36', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de documentos protestados aclarados dentro de los últimos 2 meses', 'indCantDocA02', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de documentos protestados aclarados dentro de los últimos 6 meses', 'indCantDocA06', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de documentos protestados aclarados dentro de los últimos 12 meses', 'indCantDocA12', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de documentos protestados aclarados dentro de los últimos 24 meses', 'indCantDocA24', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de documentos protestados aclarados dentro de los últimos 36 meses', 'indCantDocA36', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de documentos protestados no aclarados dentro de los últimos 2 meses', 'indCantDocNA02', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de documentos protestados no aclarados dentro de los últimos 6 meses', 'indCantDocNA06', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de documentos protestados no aclarados dentro de los últimos 12 meses', 'indCantDocNA12', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de documentos protestados no aclarados dentro de los últimos 24 meses', 'indCantDocNA24', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de documentos protestados no aclarados dentro de los últimos 36 meses', 'indCantDocNA36', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Monto total de documentos protestados dentro de los últimos 2 meses', 'indMonDoc02', null, '0,00', 2, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Monto total de documentos protestados dentro de los últimos 6 meses', 'indMonDoc06', null, '0,00', 2, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Monto total de documentos protestados dentro de los últimos 12 meses', 'indMonDoc12', null, '0,00', 2, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Monto total de documentos protestados dentro de los últimos 24 meses', 'indMonDoc24', null, '0,00', 2, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Monto total de documentos protestados dentro de los últimos 36 meses', 'indMonDoc36', null, '0,00', 2, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Monto total de documentos protestados aclarados dentro de los últimos 2 meses', 'indMonDocA02', null, '0,00', 2, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Monto total de documentos protestados aclarados dentro de los últimos 6 meses', 'indMonDocA06', null, '0,00', 2, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Monto total de documentos protestados aclarados dentro de los últimos 12 meses', 'indMonDocA12', null, '0,00', 2, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Monto total de documentos protestados aclarados dentro de los últimos 24 meses', 'indMonDocA24', null, '0,00', 2, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Monto total de documentos protestados aclarados dentro de los últimos 36 meses', 'indMonDocA36', null, '0,00', 2, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Monto total de documentos protestados no aclarados dentro de los últimos 2 meses', 'indMonDocNA02', null, '0,00', 2, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Monto total de documentos protestados no aclarados dentro de los últimos 6 meses', 'indMonDocNA06', null, '0,00', 2, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Monto total de documentos protestados no aclarados dentro de los últimos 12 meses', 'indMonDocNA12', null, '0,00', 2, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Monto total de documentos protestados no aclarados dentro de los últimos 24 meses', 'indMonDocNA24', null, '0,00', 2, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Monto total de documentos protestados no aclarados dentro de los últimos 36 meses', 'indMonDocNA36', null, '0,00', 2, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de cuentas corrientes canceladas dentro de los últimos 2 meses', 'indCantCCC02', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de cuentas corrientes canceladas dentro de los últimos 6 meses', 'indCantCCC06', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de cuentas corrientes canceladas dentro de los últimos 12 meses', 'indCantCCC12', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de cuentas corrientes canceladas dentro de los últimos 24 meses', 'indCantCCC24', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de cuentas corrientes canceladas dentro de los últimos 36 meses', 'indCantCCC36', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de tarjeta de crédito canceladas dentro de los últimos 2 meses', 'indCantTCC02', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de tarjeta de crédito canceladas dentro de los últimos 6 meses', 'indCantTCC06', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de tarjeta de crédito canceladas dentro de los últimos 12 meses', 'indCantTCC12', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de tarjeta de crédito canceladas dentro de los últimos 24 meses', 'indCantTCC24', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Cantidad de tarjeta de crédito canceladas dentro de los últimos 36 meses', 'indCantTCC36', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Puntaje score dentro de los últimos 2 meses', 'indPuntScore02', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Puntaje score dentro de los últimos 6 meses', 'indPuntScore06', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Puntaje score dentro de los últimos 12 meses', 'indPuntScore12', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Puntaje score dentro de los últimos 24 meses', 'indPuntScore24', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Puntaje score dentro de los últimos 36 meses', 'indPuntScore36', null, '0', 1, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Presenta boletín concursal dentro de los últimos 2 meses', 'indBolCon02', null, '--', 3, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Presenta boletín concursal dentro de los últimos 6 meses', 'indBolCon06', null, '--', 3, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Presenta boletín concursal dentro de los últimos 12 meses', 'indBolCon12', null, '--', 3, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Presenta boletín concursal dentro de los últimos 24 meses', 'indBolCon24', null, '--', 3, true);
        INSERT INTO public.variable (name, code, coordinate, default_value, type_variable, bureau) VALUES('Presenta boletín concursal dentro de los últimos 36 meses', 'indBolCon36', null, '--', 3, true);















--
-- TOC entry 3927 (class 0 OID 0)
-- Dependencies: 3
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: fmftbiuoazlhhu
--

REVOKE ALL ON SCHEMA public FROM postgres;
REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO fmftbiuoazlhhu;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- TOC entry 3928 (class 0 OID 0)
-- Dependencies: 640
-- Name: LANGUAGE plpgsql; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON LANGUAGE plpgsql TO fmftbiuoazlhhu;


-- Completed on 2019-07-23 02:38:03

--
-- PostgreSQL database dump complete
--

