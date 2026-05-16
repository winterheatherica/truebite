"use client";

import { useActionState, useEffect, useState } from "react";
import { submitReviewAction } from "./review-actions";

type Props = {
  restaurantId: string;
  restaurantName: string;
};

export default function ReviewForm({ restaurantId, restaurantName }: Props) {
  const action = submitReviewAction.bind(null, restaurantId);
  const [state, formAction, isPending] = useActionState(action, null);
  const [content, setContent] = useState("");

  useEffect(() => {
    if (state?.ok) {
      setContent("");
    }
  }, [state]);

  return (
    <form action={formAction} className="rounded-2xl border border-rp-border bg-rp-background p-5">
      <h3 className="text-base font-semibold text-rp-foreground">
        Tulis Review untuk {restaurantName}
      </h3>
      <p className="mt-1 text-xs text-rp-muted">
        Rating dihitung otomatis dari ceritamu — tulis pengalamanmu apa adanya.
      </p>

      <div className="mt-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-rp-muted">Ulasan</label>
          <textarea
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Ceritakan pengalaman kamu..."
            rows={4}
            disabled={isPending}
            className="mt-1 w-full resize-none rounded-xl border border-rp-border bg-white px-4 py-3 text-sm text-rp-foreground placeholder-rp-muted transition-all duration-200 focus:border-rp-primary/30 focus:outline-none focus:ring-2 focus:ring-rp-primary/10 disabled:bg-gray-100"
          />
        </div>

        {state?.error && (
          <p className="rounded-lg border border-rp-destructive/40 bg-rp-destructive/10 px-3 py-2 text-sm text-rp-destructive">
            {state.error}
          </p>
        )}
        {state?.ok && (
          <p className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
            Review terkirim, terima kasih!
          </p>
        )}

        <button
          type="submit"
          disabled={!content.trim() || isPending}
          className="bg-grad-rose-bloom w-full rounded-xl py-3 text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
        >
          {isPending ? "Mengirim..." : "Kirim Review"}
        </button>
      </div>
    </form>
  );
}
