import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  Clapperboard,
  FileSpreadsheet,
  LifeBuoy,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import styles from './ajuda.module.css';

type Categoria =
  | 'todas'
  | 'primeiros-passos'
  | 'equipes'
  | 'atletas'
  | 'partidas'
  | 'videos'
  | 'conta';

interface Duvida {
  id: number;
  categoria: Exclude<Categoria, 'todas'>;
  pergunta: string;
  resposta: string;
}

const categorias: { id: Categoria; nome: string }[] = [
  { id: 'todas', nome: 'Todas' },
  { id: 'primeiros-passos', nome: 'Primeiros passos' },
  { id: 'equipes', nome: 'Equipes' },
  { id: 'atletas', nome: 'Atletas' },
  { id: 'partidas', nome: 'Partidas' },
  { id: 'videos', nome: 'Análise de vídeos' },
  { id: 'conta', nome: 'Conta e segurança' },
];

const duvidas: Duvida[] = [
  {
    id: 1,
    categoria: 'primeiros-passos',
    pergunta: 'Para que serve o SATE?',
    resposta:
      'O SATE é um sistema de acompanhamento e treinamento esportivo. No site, o treinador pode organizar equipes e atletas, cadastrar partidas, analisar vídeos e acompanhar informações esportivas em um só lugar.',
  },
  {
    id: 2,
    categoria: 'primeiros-passos',
    pergunta: 'Como começar a usar o sistema?',
    resposta:
      'Após entrar na sua conta, conclua a configuração inicial, escolha sua modalidade e cadastre sua primeira equipe. Depois, vincule os atletas e registre partidas. O Dashboard reúne os dados cadastrados.',
  },
  {
    id: 3,
    categoria: 'primeiros-passos',
    pergunta: 'Onde encontro um resumo das informações?',
    resposta:
      'Na página Dashboard (Início), você encontra indicadores, calendário, próximas partidas e informações sobre as equipes. Os gráficos dependem dos registros e das análises já cadastradas.',
  },
  {
    id: 4,
    categoria: 'equipes',
    pergunta: 'Como cadastrar uma nova equipe?',
    resposta:
      'Abra Equipes e utilize a opção de criar uma equipe. Preencha os campos solicitados, como nome, modalidade e categoria, e salve. As equipes cadastradas aparecem na lista de gerenciamento.',
  },
  {
    id: 5,
    categoria: 'equipes',
    pergunta: 'Como editar os dados de uma equipe?',
    resposta:
      'Vá até Equipes, encontre a equipe desejada e abra a opção de edição. Atualize os dados e salve as alterações. Consulte a composição da equipe antes de alterar os vínculos dos atletas.',
  },
  {
    id: 6,
    categoria: 'atletas',
    pergunta: 'Como cadastrar ou consultar um atleta?',
    resposta:
      'Acesse Atletas para procurar atletas, abrir o perfil e consultar as informações disponíveis. Utilize as opções de cadastro e edição da própria página para atualizar os dados.',
  },
  {
    id: 7,
    categoria: 'atletas',
    pergunta: 'Como importar atletas de uma planilha?',
    resposta:
      'Na área de Atletas, procure a opção de importação. Prepare a planilha no formato aceito pelo sistema e confira os dados antes de confirmar. Nome e e-mail são informações importantes para identificar cada atleta.',
  },
  {
    id: 8,
    categoria: 'atletas',
    pergunta: 'Onde vejo a evolução de um atleta?',
    resposta:
      'Abra Atletas, selecione o atleta e entre no perfil. As informações de evolução e participação em eventos dependem das avaliações e marcações registradas nas partidas.',
  },
  {
    id: 9,
    categoria: 'partidas',
    pergunta: 'Como cadastrar uma partida?',
    resposta:
      'Acesse Partidas e escolha a opção de nova partida. Informe a equipe, o adversário, a data e os demais campos disponíveis. Salve para incluir a partida no calendário e na listagem.',
  },
  {
    id: 10,
    categoria: 'partidas',
    pergunta: 'Como abrir os detalhes de uma partida?',
    resposta:
      'Em Partidas, selecione a partida desejada. Na tela de detalhes é possível consultar suas informações e, quando disponível, gerenciar vídeos relacionados a ela.',
  },
  {
    id: 11,
    categoria: 'partidas',
    pergunta: 'Como as partidas aparecem no Dashboard?',
    resposta:
      'As partidas cadastradas alimentam a agenda, a lista de resultados e outras informações do Dashboard. O gráfico de ações utiliza os eventos registrados na análise de vídeo, quando houver dados classificados.',
  },
  {
    id: 12,
    categoria: 'videos',
    pergunta: 'Como começar a analisar um vídeo?',
    resposta:
      'Cadastre ou abra uma partida, adicione um vídeo e acesse a análise. Durante a reprodução, utilize as ferramentas disponíveis para registrar eventos e criar clipes.',
  },
  {
    id: 13,
    categoria: 'videos',
    pergunta: 'Qual é a diferença entre evento e clipe?',
    resposta:
      'Um evento registra uma ação esportiva e deve estar associado a um atleta. Um clipe destaca um trecho do vídeo e não exige a identificação de um atleta.',
  },
  {
    id: 14,
    categoria: 'videos',
    pergunta: 'O que significam ações boas, ruins, neutras e destaques?',
    resposta:
      'São classificações utilizadas para organizar as marcações da análise. Quando o gráfico de evolução utiliza a taxa de ações positivas, ele considera ações boas e destaques em relação ao total de ações classificadas.',
  },
  {
    id: 15,
    categoria: 'videos',
    pergunta: 'Por que o gráfico não mostra informações?',
    resposta:
      'O gráfico precisa de partidas com eventos classificados. Confirme se há vídeos com marcações, se essas marcações têm classificação e se o filtro de equipe e período está selecionado corretamente.',
  },
  {
    id: 16,
    categoria: 'conta',
    pergunta: 'Onde altero as configurações da minha conta?',
    resposta:
      'Abra o menu do seu perfil, no canto superior do site, e selecione Configurações. Nessa área você encontra as opções disponíveis para a sua conta.',
  },
  {
    id: 17,
    categoria: 'conta',
    pergunta: 'Como recuperar minha senha?',
    resposta:
      'Na página de login, selecione Esqueci minha senha e siga as instruções. A recuperação depende do e-mail associado à sua conta e da configuração de envio de mensagens do sistema.',
  },
  {
    id: 18,
    categoria: 'conta',
    pergunta: 'O que fazer se encontrar um erro?',
    resposta:
      'Confira se sua sessão ainda está ativa, atualize a página e tente novamente. Se o problema continuar, anote a mensagem de erro, a tela em que ocorreu e os passos para reproduzi-lo, para encaminhar à equipe responsável pelo SATE.',
  },
];

function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

const atalhos = [
  {
    titulo: 'Gerenciar equipes',
    descricao: 'Organize modalidades, categorias e times.',
    rota: '/equipes',
    Icone: Users,
  },
  {
    titulo: 'Consultar atletas',
    descricao: 'Acesse perfis, informações e evolução.',
    rota: '/atletas',
    Icone: BarChart3,
  },
  {
    titulo: 'Organizar partidas',
    descricao: 'Acompanhe jogos, resultados e agenda.',
    rota: '/partidas',
    Icone: CalendarDays,
  },
  {
    titulo: 'Analisar vídeos',
    descricao: 'Registre eventos e revise os clipes.',
    rota: '/videos',
    Icone: Clapperboard,
  },
];

export default function Ajuda() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria>('todas');

  const resultados = useMemo(() => {
    const termo = normalizar(busca);
    return duvidas.filter((duvida) => {
      const correspondeCategoria =
        categoriaAtiva === 'todas' || duvida.categoria === categoriaAtiva;
      const correspondeBusca =
        !termo ||
        normalizar(`${duvida.pergunta} ${duvida.resposta}`).includes(termo);
      return correspondeCategoria && correspondeBusca;
    });
  }, [busca, categoriaAtiva]);

  function limparFiltros() {
    setBusca('');
    setCategoriaAtiva('todas');
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.backRow}>
          <button className={styles.backLink} type="button" onClick={() => navigate('/inicio')}>
            <ArrowLeft size={16} /> Voltar ao início
          </button>
          <span className={styles.sectionTag}><LifeBuoy size={14} /> CENTRAL DE AJUDA</span>
        </div>

        <header className={styles.hero}>
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}><Sparkles size={15} /> SUPORTE E ORIENTAÇÕES</span>
            <h1>Como podemos <em>ajudar?</em></h1>
            <p>Encontre respostas e aprenda a aproveitar as ferramentas do SATE, desde o cadastro de equipes até a análise de vídeos.</p>
            <div className={styles.searchField}>
              <Search size={20} aria-hidden="true" />
              <input
                type="search"
                value={busca}
                onChange={(evento) => setBusca(evento.target.value)}
                placeholder="Busque por equipes, atletas, partidas..."
                aria-label="Pesquisar dúvidas na central de ajuda"
              />
              {busca && (
                <button type="button" onClick={() => setBusca('')} aria-label="Limpar pesquisa">
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
          <div className={styles.heroDecor} aria-hidden="true">
            <div className={styles.decorRing} />
            <div className={styles.decorIcon}><CircleHelp size={54} strokeWidth={1.5} /></div>
            <div className={styles.decorSparkle}>✦</div>
          </div>
        </header>

        <section className={styles.shortcuts} aria-labelledby="atalhos-ajuda">
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.overline}>ACESSO RÁPIDO</span>
              <h2 id="atalhos-ajuda">O que você quer fazer?</h2>
            </div>
            <p>Vá direto à área do sistema.</p>
          </div>
          <div className={styles.shortcutGrid}>
            {atalhos.map(({ titulo, descricao, rota, Icone }) => (
              <button key={rota} type="button" className={styles.shortcutCard} onClick={() => navigate(rota)}>
                <span className={styles.shortcutIcon}><Icone size={21} /></span>
                <strong>{titulo}</strong>
                <span className={styles.shortcutDescription}>{descricao}</span>
                <ArrowRight className={styles.shortcutArrow} size={17} />
              </button>
            ))}
          </div>
        </section>

        <section className={styles.faqSection} aria-labelledby="perguntas-ajuda">
          <div className={styles.sectionHeading}>
            <div>
              <span className={styles.overline}>TIRE SUAS DÚVIDAS</span>
              <h2 id="perguntas-ajuda">Perguntas frequentes</h2>
            </div>
            <span className={styles.resultCount} aria-live="polite">
              {resultados.length} {resultados.length === 1 ? 'resposta' : 'respostas'}
            </span>
          </div>

          <div className={styles.categoryList} role="group" aria-label="Filtrar perguntas por assunto">
            {categorias.map((categoria) => (
              <button
                key={categoria.id}
                type="button"
                aria-pressed={categoriaAtiva === categoria.id}
                className={`${styles.categoryButton} ${categoriaAtiva === categoria.id ? styles.categoryActive : ''}`}
                onClick={() => setCategoriaAtiva(categoria.id)}
              >
                {categoria.nome}
              </button>
            ))}
          </div>

          {resultados.length ? (
            <div className={styles.questions}>
              {resultados.map((duvida) => (
                <details className={styles.question} key={duvida.id}>
                  <summary>
                    <span className={styles.questionIcon}><CircleHelp size={17} /></span>
                    <span className={styles.questionTitle}>{duvida.pergunta}</span>
                    <ChevronDown className={styles.questionChevron} size={20} />
                  </summary>
                  <div className={styles.answer}><p>{duvida.resposta}</p></div>
                </details>
              ))}
            </div>
          ) : (
            <div className={styles.noResults} role="status">
              <Search size={30} />
              <h3>Nenhuma dúvida encontrada</h3>
              <p>Tente pesquisar outro termo ou veja todos os assuntos disponíveis.</p>
              <button type="button" onClick={limparFiltros}>Ver todas as perguntas</button>
            </div>
          )}
        </section>

        <section className={styles.footerBanner}>
          <div className={styles.footerIcon}><ShieldCheck size={25} /></div>
          <div className={styles.footerText}>
            <span className={styles.overline}>PRECISA AJUSTAR SUA CONTA?</span>
            <h2>Suas preferências em um só lugar.</h2>
            <p>Revise as opções de conta e segurança disponíveis para o treinador.</p>
          </div>
          <button type="button" onClick={() => navigate('/configuracoes')}>
            <Settings size={17} /> Configurações <ArrowRight size={16} />
          </button>
        </section>

        <footer className={styles.footerNote}>
          <FileSpreadsheet size={15} />
          <span>SATE — Treinar. Acompanhar. Evoluir.</span>
        </footer>
      </div>
    </main>
  );
}
