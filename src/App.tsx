import React from 'react';
import { useApi } from './hooks/useApi';
import { PostCard } from './components/PostCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { DataSourceIndicator } from './components/DataSourceIndicator';
import { ErrorMessage } from './components/ErrorMessage';
import type { Post } from './types/post';

function App() {
  const { data = [], loading, error, isFromCache } = useApi<Post[]>(
    'https://jsonplaceholder.typicode.com/posts'
  );

  const posts = data ? Object.values(data) : [];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
          <DataSourceIndicator isFromCache={isFromCache} />
        </header>

        {loading && <LoadingSpinner />}
        
        {error && <ErrorMessage message={error.message} />}

        {posts && Array.isArray(posts) && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;