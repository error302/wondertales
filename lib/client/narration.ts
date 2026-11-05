'use client';

/** Read-aloud narration via the browser's built-in speech engine. No network, no cost. */

export function isNarrationSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speak(text: string): void {
  if (!isNarrationSupported()) {
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.slice(0, 500));
  utterance.rate = 0.95;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (!isNarrationSupported()) {
    return;
  }
  window.speechSynthesis.cancel();
}
