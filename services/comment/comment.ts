export interface ReadComment {
    id: number;
    content: string;
    created_at: string;
    user_id: string;
    sentiment?: string;
}

export interface CreateComment {
    content: string;
    user_id: string;
}