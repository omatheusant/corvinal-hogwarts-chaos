import { PostForm } from "@/components/admin/post-form";
import { createPost } from "../actions";

export default function NewPostPage() {
  return (
    <div className="space-y-8">
      <h1 className="font-display text-3xl text-ivory">Nova publicação</h1>
      <PostForm action={createPost} />
    </div>
  );
}
