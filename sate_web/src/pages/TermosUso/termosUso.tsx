import { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './termosUso.module.css';

const secoes = [
  { titulo: "1. Apresentação", itens: [{ tipo: "p", texto: "Bem-vindo(a) ao SATE — Sistema de Acompanhamento e Treinamento Esportivo." },
      { tipo: "p", texto: "O SATE é uma plataforma digital desenvolvida para auxiliar treinadores na organização de equipes, no gerenciamento de atletas e no acompanhamento da evolução esportiva, oferecendo recursos para registrar informações, analisar vídeos de partidas e organizar dados esportivos." },
      { tipo: "p", texto: "Estes Termos de Uso estabelecem as regras para acessar e utilizar a plataforma. Ao criar uma conta ou utilizar o SATE, o usuário declara que leu e compreendeu estes termos e concorda com as condições aqui descritas." },
      { tipo: "p", texto: "Caso não concorde com alguma das disposições, o usuário deverá deixar de utilizar a plataforma." }] },
  { titulo: "2. Definições", itens: [{ tipo: "p", texto: "Para fins destes Termos de Uso, considera-se:" },
      { tipo: "li", texto: "SATE: a plataforma digital Sistema de Acompanhamento e Treinamento Esportivo." },
      { tipo: "li", texto: "Usuário: a pessoa que acessa ou utiliza a plataforma." },
      { tipo: "li", texto: "Treinador: o usuário responsável pelo gerenciamento de equipes, cadastro de atletas e acompanhamento das informações esportivas." },
      { tipo: "li", texto: "Atleta: a pessoa cujas informações esportivas são cadastradas e acompanhadas por um treinador." },
      { tipo: "li", texto: "Conteúdo: os dados, documentos, planilhas, vídeos, imagens, registros e demais informações inseridos ou armazenados na plataforma." }] },
  { titulo: "3. Objetivo e funcionalidades da plataforma", itens: [{ tipo: "p", texto: "O SATE tem como objetivo facilitar a rotina de treinadores e contribuir para a organização e o acompanhamento do desenvolvimento esportivo." },
      { tipo: "p", texto: "Entre suas funcionalidades, podem estar incluídas:" },
      { tipo: "li", texto: "Cadastro e gerenciamento de atletas." },
      { tipo: "li", texto: "Criação e organização de equipes esportivas." },
      { tipo: "li", texto: "Registro e consulta de informações esportivas." },
      { tipo: "li", texto: "Acompanhamento do desempenho e da evolução dos atletas." },
      { tipo: "li", texto: "Envio, visualização e organização de vídeos de partidas." },
      { tipo: "li", texto: "Registro de eventos, marcações e observações em vídeos." },
      { tipo: "li", texto: "Importação e exportação de dados por meio de planilhas Excel." },
      { tipo: "li", texto: "Consulta de informações relacionadas às equipes e partidas cadastradas." },
      { tipo: "p", texto: "As funcionalidades poderão ser aprimoradas, atualizadas ou modificadas ao longo do desenvolvimento da plataforma, respeitados os direitos dos usuários e a legislação aplicável." }] },
  { titulo: "4. Cadastro e acesso à conta", itens: [{ tipo: "p", texto: "O acesso às áreas de gerenciamento do SATE poderá exigir a criação de uma conta." },
      { tipo: "p", texto: "Ao realizar o cadastro, o usuário se compromete a:" },
      { tipo: "li", texto: "Fornecer informações verdadeiras, completas e atualizadas." },
      { tipo: "li", texto: "Manter a confidencialidade de suas credenciais de acesso." },
      { tipo: "li", texto: "Não compartilhar sua conta de maneira que comprometa a segurança das informações." },
      { tipo: "li", texto: "Comunicar eventuais acessos não autorizados ou suspeitas de uso indevido." },
      { tipo: "li", texto: "Utilizar a plataforma de acordo com estes termos e com a legislação vigente." },
      { tipo: "p", texto: "O usuário será responsável pelas atividades realizadas por meio de sua conta, observadas as hipóteses de uso indevido por terceiros e as responsabilidades previstas em lei." },
      { tipo: "p", texto: "O SATE poderá adotar medidas de segurança e solicitar a atualização ou confirmação de informações quando necessário." }] },
  { titulo: "5. Responsabilidades do treinador", itens: [{ tipo: "p", texto: "O treinador é responsável pelas informações que cadastra, importa, modifica ou compartilha por meio da plataforma, observadas as responsabilidades legais de cada parte." },
      { tipo: "p", texto: "Cabe ao treinador:" },
      { tipo: "li", texto: "Cadastrar informações corretas e atualizadas sobre os atletas." },
      { tipo: "li", texto: "Utilizar os dados esportivos exclusivamente para finalidades legítimas." },
      { tipo: "li", texto: "Garantir que possui autorização ou outra base legal adequada para cadastrar e utilizar dados pessoais de terceiros." },
      { tipo: "li", texto: "Observar os direitos de privacidade, imagem e proteção de dados dos atletas." },
      { tipo: "li", texto: "Restringir o acesso às informações às pessoas autorizadas." },
      { tipo: "li", texto: "Verificar os dados importados por planilhas antes de utilizá-los." },
      { tipo: "li", texto: "Utilizar os registros e as análises esportivas de forma responsável." },
      { tipo: "p", texto: "O treinador não deverá inserir informações excessivas, ilegais, discriminatórias ou incompatíveis com a finalidade da plataforma." }] },
  { titulo: "6. Cadastro de atletas e dados de terceiros", itens: [{ tipo: "p", texto: "O SATE permite o registro de informações relacionadas aos atletas para fins de organização e acompanhamento esportivo." },
      { tipo: "p", texto: "Antes de cadastrar informações pessoais, imagens ou vídeos de terceiros, o treinador deverá verificar a existência de uma base legal adequada para esse tratamento, incluindo, quando aplicável, a obtenção de autorização ou consentimento válido." },
      { tipo: "p", texto: "Quando forem cadastrados dados de crianças e adolescentes, deverão ser observadas as exigências legais específicas, incluindo as regras de proteção integral e o melhor interesse da criança ou do adolescente." },
      { tipo: "p", texto: "O cadastro de um atleta na plataforma não significa, por si só, que ele autorizou qualquer uso público de seus dados, imagens ou vídeos." },
      { tipo: "p", texto: "As informações deverão ser utilizadas apenas para finalidades legítimas relacionadas à atividade esportiva e de acordo com a legislação aplicável." }] },
  { titulo: "7. Vídeos, imagens e análises esportivas", itens: [{ tipo: "p", texto: "A plataforma poderá permitir o envio e a análise de vídeos de partidas, incluindo a criação de marcações, clipes, eventos e observações." },
      { tipo: "p", texto: "Ao enviar um arquivo, o usuário declara que possui os direitos, as permissões ou a base legal necessária para utilizá-lo na plataforma." },
      { tipo: "p", texto: "É proibido utilizar o SATE para:" },
      { tipo: "li", texto: "Enviar vídeos ou imagens obtidos de forma ilícita." },
      { tipo: "li", texto: "Violar direitos autorais ou direitos de imagem de terceiros." },
      { tipo: "li", texto: "Compartilhar conteúdo íntimo, ofensivo, discriminatório ou ilegal." },
      { tipo: "li", texto: "Expor informações pessoais de atletas sem fundamento legítimo." },
      { tipo: "li", texto: "Utilizar gravações para constranger, perseguir ou prejudicar outras pessoas." },
      { tipo: "p", texto: "As análises registradas na plataforma têm finalidade de apoio ao acompanhamento esportivo. Elas não garantem resultados competitivos, desempenho específico ou evolução individual." }] },
  { titulo: "8. Importação e exportação de planilhas", itens: [{ tipo: "p", texto: "O SATE poderá disponibilizar recursos para importar e exportar informações por meio de planilhas eletrônicas, incluindo arquivos Excel." },
      { tipo: "p", texto: "O usuário deverá:" },
      { tipo: "li", texto: "Conferir os dados antes de importar uma planilha." },
      { tipo: "li", texto: "Verificar se os arquivos estão no formato aceito pela plataforma." },
      { tipo: "li", texto: "Garantir que possui autorização para utilizar os dados contidos nos arquivos." },
      { tipo: "li", texto: "Proteger os arquivos exportados contra acesso não autorizado." },
      { tipo: "li", texto: "Evitar armazenar ou compartilhar planilhas que contenham dados pessoais sem necessidade ou autorização legal." },
      { tipo: "p", texto: "A importação de arquivos poderá estar sujeita a limites de tamanho, formatos aceitos e validações técnicas." },
      { tipo: "p", texto: "O usuário é responsável por manter cópias de segurança dos arquivos que considerar importantes. A exportação não substitui as medidas de segurança e armazenamento que devem ser adotadas pelo próprio usuário." }] },
  { titulo: "9. Uso permitido e condutas proibidas", itens: [{ tipo: "p", texto: "O usuário compromete-se a utilizar a plataforma de maneira ética, segura e legal." },
      { tipo: "p", texto: "Não é permitido:" },
      { tipo: "li", texto: "Utilizar o SATE para atividades ilícitas ou fraudulentas." },
      { tipo: "li", texto: "Tentar acessar contas, equipes ou informações sem autorização." },
      { tipo: "li", texto: "Explorar falhas de segurança ou interferir no funcionamento do sistema." },
      { tipo: "li", texto: "Distribuir vírus, códigos maliciosos ou arquivos destinados a prejudicar a plataforma." },
      { tipo: "li", texto: "Utilizar informações de atletas para fins discriminatórios, abusivos ou incompatíveis com sua finalidade." },
      { tipo: "li", texto: "Copiar, reproduzir, comercializar ou explorar indevidamente os elementos protegidos da plataforma." },
      { tipo: "li", texto: "Inserir informações falsas com a intenção de prejudicar terceiros." },
      { tipo: "li", texto: "Utilizar a plataforma de forma que comprometa sua disponibilidade, integridade ou segurança." },
      { tipo: "p", texto: "A identificação de uso indevido poderá resultar na adoção de medidas proporcionais, incluindo restrição de acesso ou suspensão da conta, quando cabível, respeitados os direitos do usuário e a legislação aplicável." }] },
  { titulo: "10. Privacidade e proteção de dados pessoais", itens: [{ tipo: "p", texto: "O tratamento de dados pessoais realizado por meio do SATE deverá observar a legislação aplicável, especialmente a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD)." },
      { tipo: "p", texto: "Os dados poderão incluir informações de cadastro, dados de equipes e atletas, registros esportivos, vídeos e outras informações necessárias à utilização das funcionalidades da plataforma." },
      { tipo: "p", texto: "Os dados deverão ser tratados para finalidades legítimas, específicas e informadas, de acordo com a base legal aplicável." },
      { tipo: "p", texto: "O acesso às informações deverá ser limitado conforme as permissões e as necessidades de utilização da plataforma. Poderão ser adotadas medidas técnicas e administrativas para proteger os dados contra acessos não autorizados, perda, alteração ou divulgação indevida." },
      { tipo: "p", texto: "O usuário poderá exercer os direitos previstos na legislação aplicável, conforme sua relação com os dados e com o tratamento realizado." },
      { tipo: "p", texto: "As informações detalhadas sobre coleta, finalidade, compartilhamento, armazenamento, retenção e direitos dos titulares deverão constar na Política de Privacidade do SATE, documento complementar a estes Termos de Uso." }] },
  { titulo: "11. Segurança e disponibilidade", itens: [{ tipo: "p", texto: "O SATE buscará manter a plataforma funcional e adotar medidas adequadas para proteger suas informações." },
      { tipo: "p", texto: "Entretanto, poderão ocorrer interrupções temporárias decorrentes de manutenção, atualizações, falhas técnicas, indisponibilidade de serviços de terceiros ou situações alheias ao controle razoável da equipe responsável." },
      { tipo: "p", texto: "O usuário reconhece que serviços digitais estão sujeitos a riscos técnicos e deverá adotar boas práticas de segurança, como proteger suas credenciais e manter cópias de arquivos importantes." },
      { tipo: "p", texto: "O SATE não garante disponibilidade ininterrupta nem ausência absoluta de falhas. Essa disposição não exclui responsabilidades ou direitos que não possam ser afastados pela legislação aplicável." }] },
  { titulo: "12. Propriedade intelectual", itens: [{ tipo: "p", texto: "A marca SATE, sua identidade visual, seus elementos gráficos, sua interface, seu código-fonte e demais componentes próprios da plataforma são protegidos pela legislação aplicável, observados os direitos de terceiros." },
      { tipo: "p", texto: "A utilização da plataforma não concede ao usuário propriedade sobre esses elementos nem autorização para reproduzi-los ou comercializá-los sem a devida permissão." },
      { tipo: "p", texto: "Os dados, vídeos, imagens e demais materiais enviados pelo usuário continuam sujeitos aos direitos de seus respectivos titulares." },
      { tipo: "p", texto: "Ao enviar conteúdo, o usuário concede ao SATE apenas a autorização necessária para armazená-lo, processá-lo e disponibilizá-lo dentro das funcionalidades da plataforma, conforme sua configuração, finalidade e base legal aplicável." }] },
  { titulo: "13. Limitações da finalidade esportiva", itens: [{ tipo: "p", texto: "O SATE é uma ferramenta de apoio à organização e ao acompanhamento esportivo." },
      { tipo: "p", texto: "As informações, registros, estatísticas e análises disponibilizados não substituem o julgamento profissional do treinador nem garantem resultados esportivos específicos." },
      { tipo: "p", texto: "Cabe ao treinador interpretar os registros de acordo com o contexto de cada atleta e tomar decisões de forma responsável." },
      { tipo: "p", texto: "A plataforma não deverá ser considerada, por si só, uma garantia de desempenho, classificação, vitória ou desenvolvimento esportivo." }] },
  { titulo: "14. Suspensão, encerramento e exclusão da conta", itens: [{ tipo: "p", texto: "O usuário poderá solicitar o encerramento de sua conta por meio dos canais de atendimento disponibilizados pelo SATE." },
      { tipo: "p", texto: "A equipe responsável poderá restringir ou suspender o acesso quando houver indícios de fraude, violação destes termos, risco à segurança da plataforma ou descumprimento da legislação, observadas a proporcionalidade e as garantias legais aplicáveis." },
      { tipo: "p", texto: "O encerramento da conta não elimina automaticamente todos os dados armazenados. A exclusão, conservação ou anonimização das informações deverá observar a Política de Privacidade, as finalidades do tratamento e as obrigações legais aplicáveis." },
      { tipo: "p", texto: "Antes de encerrar a conta, recomenda-se que o usuário exporte os dados e arquivos que deseja conservar, quando esse recurso estiver disponível." }] },
  { titulo: "15. Alterações nestes Termos de Uso", itens: [{ tipo: "p", texto: "Estes Termos de Uso poderão ser atualizados para refletir mudanças nas funcionalidades, nos procedimentos de segurança ou nas exigências legais." },
      { tipo: "p", texto: "A versão vigente ficará disponível na plataforma, acompanhada da data da última atualização." },
      { tipo: "p", texto: "Quando uma alteração exigir comunicação específica ou novo consentimento, o SATE adotará as medidas adequadas conforme a legislação aplicável." }] },
  { titulo: "16. Legislação aplicável", itens: [{ tipo: "p", texto: "Estes Termos de Uso serão interpretados de acordo com as leis da República Federativa do Brasil." },
      { tipo: "p", texto: "Eventuais conflitos serão tratados pelos meios legalmente disponíveis, respeitando-se os direitos dos usuários e as regras de competência aplicáveis." }] },
  { titulo: "17. Contato", itens: [{ tipo: "p", texto: "Em caso de dúvidas, solicitações ou questões relacionadas à utilização do SATE, o usuário poderá entrar em contato pelos canais oficiais de atendimento da plataforma." },
      { tipo: "p", texto: "Responsável pela plataforma: [Inserir nome da pessoa física ou jurídica responsável pelo SATE]" },
      { tipo: "p", texto: "E-mail de contato: [Inserir e-mail oficial]" },
      { tipo: "p", texto: "Site: [Inserir endereço oficial do SATE]" }] }
];

interface TermosUsoProps {
  onFechar: () => void;
}

const TermosUso = ({ onFechar }: TermosUsoProps) => {
  useEffect(() => {
    const anterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onFechar();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = anterior;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onFechar]);

  return (
    <div className={styles.overlay} onMouseDown={(event) => {
      if (event.target === event.currentTarget) onFechar();
    }}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="termos-titulo">
        <header className={styles.header}>
          <div>
            <span className={styles.eyebrow}>SATE · Sistema de Acompanhamento e Treinamento Esportivo</span>
            <h2 id="termos-titulo">Termos de uso</h2>
            <p>Última atualização: 28 de outubro de 2026</p>
          </div>
          <button type="button" className={styles.close} onClick={onFechar} aria-label="Fechar termos">
            <X size={21} />
          </button>
        </header>
        <div className={styles.content}>
          <p>Bem-vindo(a) ao SATE — Sistema de Acompanhamento e Treinamento Esportivo.</p>
          {secoes.map((secao) => (
            <section className={styles.section} key={secao.titulo}>
              <h3>{secao.titulo}</h3>
              {secao.itens.map((item, index) => item.tipo === 'li' ? (
                <ul key={index}><li>{item.texto}</li></ul>
              ) : (
                <p key={index}>{item.texto}</p>
              ))}
            </section>
          ))}
          <p className={styles.finalNote}>Ao utilizar o SATE, o usuário declara estar ciente das regras descritas nestes Termos de Uso e compromete-se a utilizar a plataforma de maneira responsável, respeitando os direitos de outros usuários e a legislação vigente.</p>
        </div>
        <footer className={styles.footer}>
          <button type="button" onClick={onFechar}>Fechar termos</button>
        </footer>
      </section>
    </div>
  );
};

export default TermosUso;
