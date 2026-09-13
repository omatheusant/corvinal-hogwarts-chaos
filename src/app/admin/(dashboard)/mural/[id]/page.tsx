import { notFound } from "next/navigation";
import { PostForm } from "@/components/admin/post-form";
import { getAdminPostById } from "@/lib/admin/queries";
import { updatePost, deletePost } from "../actions";

export default async function EditPostPage(props: PageProps<"/admin/mural/[id]">) {
  const { id } = await props.params;
  const post = await getAdminPostById(id);
  if (!post) notFound();

  const boundUpdate = updatePost.bind(null, id);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl text-ivory">Editar publicação</h1>
        <form action={deletePost}>
          <input type="hidden" name="id" value={id} />
          <button type="submit" className="font-sans text-sm text-red-300 hover:underline">
            Excluir publicação
          </button>
        </form>
      </div>
      <PostForm key={post.id} post={post} action={boundUpdate} />
    </div>
  );
}
