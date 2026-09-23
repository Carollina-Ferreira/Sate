import { useState } from 'react';

import styles from './atletas.module.css';

import PerfilAtleta from './perfilAtletas.tsx';
import EditarAtleta from './editarAtleta.tsx';
import ClipesAtleta from './clipesAtleta.tsx';

import {
    Search,
    ChevronDown,
    Plus,
    SlidersHorizontal,
    Eye,
    BarChart3,
    Scissors
} from 'lucide-react';

interface Atleta {
    nome: string;
    equipe: string;
    posicao: string;
    modalidade: string;
    frequencia: number;
    cor: 'verde' | 'rosa' | 'azul';
}

const Atletas = () => {

    const [telaAtual, setTelaAtual] = useState<'lista' | 'perfil' | 'editar' | 'clipes'>('lista');

    const atletas: Atleta[] = [
        { nome: 'Rafael Souza', equipe: 'Falcões FC', posicao: 'Ponta', modalidade: 'Rugby', frequencia: 90, cor: 'verde' },
        { nome: 'Rafael Souza', equipe: 'Falcões FC', posicao: 'Ponta', modalidade: 'Rugby', frequencia: 90, cor: 'rosa' },
        { nome: 'Rafael Souza', equipe: 'Falcões FC', posicao: 'Ponta', modalidade: 'Rugby', frequencia: 90, cor: 'azul' },
        { nome: 'Rafael Souza', equipe: 'Falcões FC', posicao: 'Ponta', modalidade: 'Rugby', frequencia: 90, cor: 'verde' },
        { nome: 'Rafael Souza', equipe: 'Falcões FC', posicao: 'Ponta', modalidade: 'Rugby', frequencia: 90, cor: 'verde' },
        { nome: 'Rafael Souza', equipe: 'Falcões FC', posicao: 'Ponta', modalidade: 'Rugby', frequencia: 90, cor: 'azul' },
        { nome: 'Rafael Souza', equipe: 'Falcões FC', posicao: 'Ponta', modalidade: 'Rugby', frequencia: 90, cor: 'verde' },
        { nome: 'Rafael Souza', equipe: 'Falcões FC', posicao: 'Ponta', modalidade: 'Rugby', frequencia: 90, cor: 'rosa' }
    ];

    if (telaAtual === 'editar') {
        return <EditarAtleta onBack={() => setTelaAtual('perfil')} />;
    }

    if (telaAtual === 'clipes') {
        return <ClipesAtleta onBack={() => setTelaAtual('perfil')} />;
    }

    if (telaAtual === 'perfil') {
        return (
            <PerfilAtleta 
                onBack={() => setTelaAtual('lista')}
                onEdit={() => setTelaAtual('editar')}
                onClipes={() => setTelaAtual('clipes')}
            />
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h1 className={styles.title}>Veja seus atletas</h1>
                <button
                    className={styles.newAthleteButton}
                    onClick={() => ('/cadastro')}
                >
                    <Plus size={24} />
                    <span>Novo atleta</span>
                </button>
            </div>

            <div className={styles.filters}>
                <div className={styles.searchBox}>
                    <Search size={23} className={styles.searchIcon} />
                    <input type="text" placeholder="Buscar atleta..." />
                </div>
                <div className={styles.selectWrapper}>
                    <select className={styles.select}>
                        <option>Todas as equipes</option>
                        <option>Falcões FC</option>
                        <option>Poli Rugby</option>
                    </select>
                    <ChevronDown size={21} className={styles.selectIcon} />
                </div>
                <div className={styles.selectWrapper}>
                    <select className={styles.select}>
                        <option>Todas as modalidades</option>
                        <option>Futebol</option>
                        <option>Basquete</option>
                        <option>Rugby</option>
                    </select>
                    <ChevronDown size={21} className={styles.selectIcon} />
                </div>
                <button className={styles.filterButton}>
                    <SlidersHorizontal size={19} />
                    <span>Filtros</span>
                </button>
            </div>

            <div className={styles.athletesGrid}>
                {atletas.map((atleta, index) => (
                    <div className={styles.athleteCard} key={index}>
                        <div className={styles.cardNormal}>
                            <div className={`${styles.avatar} ${styles[atleta.cor]}`}>RS</div>
                            <div className={styles.info}>
                                <h2>{atleta.nome}</h2>
                                <p className={styles.team}>{atleta.equipe}</p>
                                <p className={styles.sport}>
                                    {atleta.posicao}<span>-</span>{atleta.modalidade}
                                </p>
                            </div>
                            <span className={`${styles.frequency} ${styles[atleta.cor]}`}>
                                {atleta.frequencia}%
                            </span>
                        </div>

                        <div className={styles.cardHover}>
                            <button 
                                className={styles.hoverButton}
                                onClick={() => setTelaAtual('perfil')}
                            >
                                <Eye size={19} />
                                <span>Perfil</span>
                            </button>
                            <button className={styles.hoverButton}>
                                <BarChart3 size={19} />
                                <span>Informações</span>
                            </button>
                            <button 
                                className={styles.hoverButton}
                                onClick={() => setTelaAtual('clipes')}
                            >
                                <Scissors size={19} />
                                <span>Clipes</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Atletas;