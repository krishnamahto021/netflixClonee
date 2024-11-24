import { useState, useCallback, useEffect } from 'react';
import { Movie } from 'src/types/Movie';

export function useMyList() {
  const [myList, setMyList] = useState<Movie[]>(() => {
    const savedList = localStorage.getItem('myList');
    return savedList ? JSON.parse(savedList) : [];
  });

  useEffect(() => {
    localStorage.setItem('myList', JSON.stringify(myList));
  }, [myList]);

  const addToMyList = useCallback((movie: Movie) => {
    setMyList((prevList) => {
      if (!prevList.some((item) => item.id === movie.id)) {
        return [...prevList, movie];
      }
      return prevList;
    });
  }, []);

  const removeFromMyList = useCallback((movieId: number) => {
    setMyList((prevList) => prevList.filter((item) => item.id !== movieId));
  }, []);

  return { myList, addToMyList, removeFromMyList };
}