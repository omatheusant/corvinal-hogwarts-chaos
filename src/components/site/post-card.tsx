import Link from "next/link";
import Image from "next/image";
import { ArchFrame } from "@/components/visual/arch-frame";
import { LibraryScene } from "@/components/visual/illustrations";
import { POST_CATEGORY_LABELS, type Post } from "@/types/domain";
import { formatLongDate } from "@/lib/format-date";

export function PostCard({ post }: { post: Post }) {
  const displayDate = post.category === "evento" && post.eventDate ? post.eventDate : post.publishedAt;

  return (
    <Link
      href={`/mural/${post.slug}`}
      className="group grid gap-5 sm:grid-cols-[minmax(0,7rem)_1fr] focus-visible:outline-2 focus-visible:outline-bronze-soft"
    >
      <ArchFrame className="aspect-3/4 w-full sm:w-28">
        {post.coverUrl ? (
          <Image src={post.coverUrl} alt="" fill className="object-cover" sizes="112px" />
        ) : (
          <LibraryScene className="h-full w-full" />
        )}
      </ArchFrame>
      <div className="space-y-2 self-center">
        <p className="eyebrow">
          {POST_CATEGORY_LABELS[post.category]}
          {displayDate && ` · ${formatLongDate(displayDate)}`}
        </p>
        <h3 className="font-display text-2xl text-ivory group-hover:text-bronze-soft">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="font-serif text-sm text-muted sm:text-base">{post.excerpt}</p>
        )}
      </div>
    </Link>
  );
}
