import {
  useEffect,
} from 'react';

import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import styles from './carregamento.module.css';


type LocationState = {
  destino?: string;
};


export default function Carregamento() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const state =
    location.state as
      | LocationState
      | null;


  useEffect(() => {
    const destino =
      state?.destino ||
      '/inicio';


    const timer =
      setTimeout(() => {
        navigate(
          destino,
          {
            replace: true,
          },
        );
      }, 1500);


    return () => {
      clearTimeout(
        timer,
      );
    };

  }, [
    navigate,
    state?.destino,
  ]);


  return (
    <main
      className={
        styles.page
      }
    >

      <div
        className={
          styles.content
        }
      >

        <div
          className={
            styles.brandMark
          }
          aria-hidden="true"
        >

          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline
              points="2 12 8 12 11 20 14 4 17 12 22 12"
            />
          </svg>

        </div>


        <h1>
          SATE
        </h1>


        <p>
          Preparando seu ambiente...
        </p>


        <div
          className={
            styles.loader
          }
        >
          <span />
          <span />
          <span />
        </div>

      </div>

    </main>
  );
}