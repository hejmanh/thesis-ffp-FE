"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import Button from "@/components/common/Button";
import { useGetSurveyQuestions, useSubmitSurvey } from "@/hooks/survey/useSurvey";
import { useTranslations } from "@/i18n/client";
import { cn } from "@/utils/cn";
import type { SurveyAnswer } from "@/types/survey";

interface SurveyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SCORES = [1, 2, 3, 4, 5] as const;


export default function SurveyModal({ isOpen, onClose }: SurveyModalProps) {
  const t = useTranslations("Survey");
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const { data: questions, isLoading: questionsLoading } = useGetSurveyQuestions(isOpen);
  const { mutateAsync: submitSurvey } = useSubmitSurvey();

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    function handleFocusTrap(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }

    const originalOverflow = document.body.style.overflow;

    return () => {
      window.removeEventListener("keydown", handleFocusTrap);
      document.body.style.overflow = originalOverflow;
      previouslyFocusedElement.current?.focus();
    };
  }, [isOpen]);

  function handleClose() {
    setAnswers({});
    setFeedback("");
    setError(null);
    setSubmitted(false);
    onClose();
  }

  function handleScore(questionId: number, score: number) {
    setAnswers((prev) => ({ ...prev, [questionId]: score }));
  }

  async function handleSubmit() {
    if (!questions) return;

    const answeredAll = questions.every((q) => answers[q.id] !== undefined);
    if (!answeredAll) {
      setError(t("errorAnswerAll"));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const surveyAnswers: SurveyAnswer[] = questions.map((q) => ({
        questionId: q.id,
        score: answers[q.id],
      }));
      await submitSurvey({ feedback, answers: surveyAnswers });
      setSubmitted(true);
    } catch {
      setError(t("errorSubmit"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
      role="presentation"
    >
      <div
        ref={modalRef}
        className="w-full max-w-2xl rounded-3xl bg-white shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="survey-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-h-[90vh] overflow-y-auto p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-15 w-15 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Icon icon="mdi:clipboard-text-outline" className="h-8 w-8 text-primary" />
              </span>
              <div>
                <h2 id="survey-modal-title" className="text-xl mb-2 font-bold text-slate-900">
                  {t("title")}
                </h2>
                <p className="text-sm text-slate-500">{t("subtitle")}</p>
              </div>
            </div>
          </div>
          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                <Icon icon="mdi:check-circle-outline" className="h-9 w-9 text-emerald-600" />
              </span>
              <h3 className="text-lg font-semibold text-slate-800">{t("thankYouTitle")}</h3>
              <p className="max-w-sm text-sm text-slate-500">{t("thankYouDesc")}</p>
              <Button onClick={handleClose} className="mt-2">
                {t("closeBtn")}
              </Button>
            </div>
          ) : questionsLoading ? (
            <div className="flex justify-center py-12">
              <Icon icon="mdi:loading" className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <p className="mb-4 ml-2 text-sm text-primary">{t("scoreDescription")}</p>
              <div className="space-y-6">
                {questions?.map((question, index) => (
                  <div
                    key={question.id}
                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <p className="mb-4 text-sm font-medium text-slate-800">
                      {index + 1}.{" "}
                      {question.questionText}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SCORES.map((score) => {
                        const selected = answers[question.id] === score;
                        return (
                          <button
                            key={score}
                            type="button"
                            title={t(`scoreLabels.${score}`)}
                            onClick={() => handleScore(question.id, score)}
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                              selected
                                ? "border-primary bg-primary text-white shadow-sm"
                                : "border-slate-200 bg-white text-slate-600 hover:border-primary/60 hover:bg-primary/5",
                            )}
                            aria-pressed={selected}
                            aria-label={`${score}: ${t(`scoreLabels.${score}`)}`}
                          >
                            {score}
                          </button>
                        );
                      })}
                    </div>
                    {answers[question.id] !== undefined ? (
                      <p className="mt-2 text-xs text-primary">
                        {t(`scoreLabels.${answers[question.id]}`)}
                      </p>
                    ) : null}
                  </div>
                ))}

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <label
                    htmlFor="survey-feedback"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    {t("feedbackLabel")}{" "}
                    <span className="font-normal text-slate-400">{t("feedbackOptional")}</span>
                  </label>
                  <textarea
                    id="survey-feedback"
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={t("feedbackPlaceholder")}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              {error ? (
                <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
              ) : null}

              <div className="mt-6 flex justify-end gap-3">
                <Button
                  onClick={handleSubmit}
                  disabled={
                    isSubmitting ||
                    !questions?.every((q) => answers[q.id] !== undefined)
                  }
                >
                  {isSubmitting ? (
                    <Icon icon="mdi:loading" className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {t("submitBtn")}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
