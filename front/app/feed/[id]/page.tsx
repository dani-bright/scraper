"use client";

import { use, useEffect, useState } from "react";
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

  useEffect(() => {
    if (!id) return;

    fetch(`http://127.0.0.1:3000/topics/${id}/posts`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="p-4">Chargement...</p>;
  if (!posts.length)
    return <p className="p-4">Aucun post trouvé pour ce sujet</p>;
  console.log(posts);
  return (
    <div className="grid grid-cols-1 gap-4 p-4">
      {posts.map((post) => (
        <Card key={post.id} className="hover:shadow-lg transition">
          <CardHeader className="flex items-center gap-2">
            {post.authorAvatarUrl && (
              <Image
                src={post.authorAvatarUrl}
                alt="seed avatar"
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
    </div>
  );
}
