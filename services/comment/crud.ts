// Belum kelar bwang

import axios from "axios";
import { createSupabaseHeaders, createSupabaseRestUrl } from "../supabase/config";
import { SupabaseAuthSession } from "../supabase/auth";

import { analyzeSentiment } from "../sentiment/sentimentAnalysis";

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user_id: string;
}

function createComment(comment: Comment) {
    const sentiment = analyzeSentiment(comment.content);

    return axios.post(
        createSupabaseRestUrl("comments"),
        {
            content: comment.content,
            sentiment: sentiment,
            user_id: comment.user_id,
        },
        {
            headers: createSupabaseHeaders(),
        },
    );
}

function getComments() {
    return axios.get(createSupabaseRestUrl("comments"), {
        headers: createSupabaseHeaders(),
    });
}

export { createComment, getComments };