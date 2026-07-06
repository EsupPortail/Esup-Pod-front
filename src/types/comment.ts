export interface Comment {
  id: string;
  parent: number | null;
  direct_parent: number | null;
  author: number;
  author_picture: string | null;
  author_username: string | null;
  author_name: string;
  content: string;
  video: number;
  added: string;
  nbr_vote: number;
  is_owner: boolean;
  children: Comment[];
}

export interface CommentRequest {
  id: string;
  parent: number | null;
  direct_parent: number | null;
  content: string;
  video: number;
}
