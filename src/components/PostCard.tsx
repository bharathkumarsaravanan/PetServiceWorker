import React from 'react';
import type { Post } from '../types/post';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">
        {post.title}
      </h2>
      <p className="text-gray-600">{post.body}</p>
    </article>
  );
}