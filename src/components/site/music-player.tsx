"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "corvinal:musica";
const AUDIO_SRC = "/audio/tema.mp3";
const DEFAULT_VOLUME = 0.5;

type Prefs = {
  volume: number;
  muted: boolean;
};

const SERVER_PREFS: Prefs = { volume: DEFAULT_VOLUME, muted: false };

/**
 * Pequena "store" externa para a preferência de volume/mudo, no molde que o
 * `useSyncExternalStore` espera: um cache em memória (referência estável
 * entre chamadas quando nada mudou) mais uma lista de assinantes notificada
 * a cada gravação. Evita precisar de um `useEffect` que chama `setState`
 * só para hidratar a partir do localStorage — o próprio hook já sabe usar
 * `SERVER_PREFS` na renderização do servidor/hidratação e trocar para o
 * valor real assim que monta no cliente, sem descompasso.
 */
let cachedPrefs: Prefs | null = null;
const listeners = new Set<() => void>();

function readPrefsFromStorage(): Prefs {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...SERVER_PREFS };
    const parsed = JSON.parse(raw) as Partial<Prefs>;
    const volume =
      typeof parsed.volume === "number" && parsed.volume >= 0 && parsed.volume <= 1
        ? parsed.volume
        : DEFAULT_VOLUME;
    return { volume, muted: Boolean(parsed.muted) };
  } catch {
    return { ...SERVER_PREFS };
  }
}

function getSnapshot(): Prefs {
  if (!cachedPrefs) cachedPrefs = readPrefsFromStorage();
  return cachedPrefs;
}

function getServerSnapshot(): Prefs {
  return SERVER_PREFS;
}

function setPrefs(next: Prefs) {
  cachedPrefs = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // localStorage indisponível (modo privado, cota etc.) — a preferência
    // simplesmente não persiste entre visitas; a música continua funcionando.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Player de música ambiente da torre: flutua sobre o canto da tela em todas
 * as páginas do site público e começa a tocar em loop assim que o site
 * abre. Navegadores bloqueiam áudio COM SOM sem gesto do usuário — isso não
 * é uma limitação do código, é política de segurança do próprio navegador
 * e não tem contorno real. Por isso, se o autoplay com som for bloqueado, a
 * música já começa tocando muda (o loop roda igual) e o som é liberado
 * automaticamente no primeiro clique, toque ou tecla na página.
 */
export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const prefs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [isPlaying, setIsPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = prefs.volume;
    audio.muted = prefs.muted;
  }, [prefs.volume, prefs.muted]);

  // Autoplay ao carregar a página. Roda uma única vez, depois que o efeito
  // acima já aplicou volume/mudo salvos — então, se a pessoa já tinha
  // deixado mudo antes, a primeira tentativa de tocar já sai muda e tem
  // grande chance de ser aceita direto pelo navegador. Se ainda assim for
  // bloqueada (som ligado, sem gesto prévio), cai para tocar muda e libera
  // o som no primeiro gesto do usuário na página.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const savedMuted = getSnapshot().muted;
    let gestureUnmute: (() => void) | undefined;

    audio.play().catch(() => {
      audio.muted = true;
      audio.play().catch(() => setUnavailable(true));

      gestureUnmute = () => {
        audio.muted = savedMuted;
      };
      document.addEventListener("pointerdown", gestureUnmute, { once: true });
      document.addEventListener("keydown", gestureUnmute, { once: true });
    });

    return () => {
      if (gestureUnmute) {
        document.removeEventListener("pointerdown", gestureUnmute);
        document.removeEventListener("keydown", gestureUnmute);
      }
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      return;
    }
    audio.play().catch(() => setUnavailable(true));
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    setPrefs({ ...prefs, muted: !prefs.muted });
  }, [prefs]);

  const handleVolumeChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const next = Number(event.target.value);
      setPrefs({ volume: next, muted: next > 0 ? false : prefs.muted });
    },
    [prefs.muted],
  );

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-bronze/30 bg-ink/85 px-3 py-2 shadow-soft backdrop-blur-md">
      <audio
        ref={audioRef}
        src={AUDIO_SRC}
        loop
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => setUnavailable(true)}
      >
        Seu navegador não suporta reprodução de áudio.
      </audio>

      <button
        type="button"
        onClick={togglePlay}
        disabled={unavailable}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? "Pausar música ambiente" : "Tocar música ambiente"}
        title={unavailable ? "Música indisponível" : undefined}
        className="flex h-8 w-8 items-center justify-center rounded-full text-bronze-soft transition-colors hover:text-ivory disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <button
        type="button"
        onClick={toggleMute}
        disabled={unavailable}
        aria-pressed={prefs.muted}
        aria-label={prefs.muted ? "Reativar som" : "Mudo"}
        title={unavailable ? "Música indisponível" : undefined}
        className="flex h-8 w-8 items-center justify-center rounded-full text-bronze-soft transition-colors hover:text-ivory disabled:cursor-not-allowed disabled:opacity-40"
      >
        {prefs.muted || prefs.volume === 0 ? <MuteIcon /> : <VolumeIcon />}
      </button>

      <label className="sr-only" htmlFor="corvinal-volume">
        Volume da música ambiente
      </label>
      <input
        id="corvinal-volume"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={prefs.volume}
        onChange={handleVolumeChange}
        disabled={unavailable}
        className="h-1 w-20 cursor-pointer accent-bronze disabled:cursor-not-allowed sm:w-24"
      />
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M7 4.5v15l13-7.5-13-7.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <rect x="6" y="4.5" width="4" height="15" />
      <rect x="14" y="4.5" width="4" height="15" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4v-5z" />
      <path d="M16 9c1 1 1 5 0 6" />
      <path d="M18.5 7c2 2 2 8 0 10" />
    </svg>
  );
}

function MuteIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4v-5z" />
      <path d="M16.5 9.5l4 4m0-4l-4 4" />
    </svg>
  );
}
