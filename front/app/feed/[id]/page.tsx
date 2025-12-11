"use client";

import { use, useEffect, useState, useRef, useCallback } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";

type Post = {
  id: number;
  authorName: string;
  authorAvatarUrl?: string;
  content: string;
  url: string;
  postedAt: string;
  reactions: number;
  comments: number;
  shares: number;
};

export default function FeedPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async () => {
    if (!id || !hasMore) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://127.0.0.1:3000/topics/${id}/posts?page=${page}&limit=10`
      );
      const data: Post[] = await res.json();

      setPosts((prev) => [...prev, ...data]);
      if (data.length < 10) setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [id, page, hasMore]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore]);

  if (!posts.length && loading) return <p className="p-4">Chargement...</p>;
  if (!posts.length)
    return <p className="p-4">Aucun post trouvé pour ce sujet</p>;

  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {posts.map((post) => (
        <Card key={post.id} className="hover:shadow-lg transition">
          <CardHeader className="flex items-center gap-2">
            {post.authorAvatarUrl && (
              <Image
                src={post.authorAvatarUrl}
                alt="avatar"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full"
              />
            )}
            <div>
              <CardTitle>{post.authorName}</CardTitle>
              <CardDescription>{post.postedAt}</CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <p>
              {post.content.length > 200
                ? post.content.slice(0, 200) + "…"
                : post.content}
            </p>

            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 mt-2 block"
            >
              Voir le post
            </a>

            <div className="flex gap-4 text-sm mt-2 text-gray-500">
              <span>👍 {post.reactions}</span>
              <span>💬 {post.comments}</span>
            </div>
          </CardContent>
        </Card>
      ))}
      {loading && <p className="p-4">Chargement...</p>}
      <div ref={loaderRef} />
    </div>
  );
}
