import React from 'react';
import { useBrain } from '../../context/BrainContext.jsx';
import { ContentCard } from './ContentCard.jsx';
import { GridSkeleton } from '../common/Skeleton.jsx';
import { EmptyState } from '../common/EmptyState.jsx';

export const ContentGrid = () => {
  const { contents, isLoading, activeType, searchQuery } = useBrain();

  if (isLoading) {
    return <GridSkeleton count={6} />;
  }

  if (!contents || contents.length === 0) {
    return <EmptyState type={activeType} isSearching={Boolean(searchQuery.trim())} />;
  }

  const { viewMode } = useBrain();

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-3">
        {contents.map((item) => (
          <ContentCard key={item._id} item={item} isList={true} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {contents.map((item) => (
        <ContentCard key={item._id} item={item} isList={false} />
      ))}
    </div>
  );
};
