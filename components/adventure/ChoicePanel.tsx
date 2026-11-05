import type { Question } from '../../lib/engine/types';
import { levelForVisual, variantForVisual } from '../../lib/engine/water-visuals';
import { WaterPuzzle } from './WaterPuzzle';

export function ChoicePanel({
  question,
  disabled,
  onChoose,
}: {
  question: Question;
  disabled: boolean;
  onChoose: (choiceId: string) => void;
}) {
  return (
    <section aria-label="Your choice" className="rounded-3xl bg-white p-5 shadow-md sm:p-6">
      <h2 className="font-story text-xl font-bold text-garden-900">{question.prompt}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            type="button"
            disabled={disabled}
            onClick={() => onChoose(option.id)}
            aria-label={`Choose ${option.label}`}
            className="flex min-h-[48px] flex-col items-center gap-2 rounded-2xl border-2 border-garden-200 bg-parchment px-3 py-4 font-semibold text-garden-900 hover:border-garden-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <WaterPuzzle
              level={levelForVisual(option.visualId)}
              variant={variantForVisual(option.visualId)}
              label={`${option.label} water level`}
            />
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
