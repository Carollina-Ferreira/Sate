import { useEffect, useRef } from 'react';
import styles from './turnstileWidget.module.css';

type TurnstileRenderOptions = {
  sitekey: string;
  action: string;
  callback: (token: string) => void;
  'expired-callback': () => void;
  'error-callback': () => void;
  theme?: 'light' | 'dark' | 'auto';
};

type TurnstileApi = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

interface TurnstileWidgetProps {
  action: 'signup' | 'auth';
  onToken: (token: string) => void;
}

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

const TurnstileWidget = ({ action, onToken }: TurnstileWidgetProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return undefined;

    let widgetId: string | null = null;
    let ativo = true;

    const renderizar = () => {
      if (!ativo || !containerRef.current || !window.turnstile || widgetId) return;

      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action,
        theme: 'light',
        callback: (token) => onToken(token),
        'expired-callback': () => onToken(''),
        'error-callback': () => onToken(''),
      });
    };

    if (window.turnstile) {
      renderizar();
    } else {
      let script = document.querySelector<HTMLScriptElement>('#sate-turnstile-script');

      if (!script) {
        script = document.createElement('script');
        script.id = 'sate-turnstile-script';
        script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      script.addEventListener('load', renderizar);
      script.addEventListener('error', () => onToken(''));
    }

    return () => {
      ativo = false;
      if (widgetId && window.turnstile) {
        window.turnstile.remove(widgetId);
      }
    };
  }, [action, onToken]);

  if (!siteKey) return null;

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.widget} />
    </div>
  );
};

export default TurnstileWidget;
