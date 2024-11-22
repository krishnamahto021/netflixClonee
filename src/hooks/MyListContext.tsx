import React, { createContext, useState, useContext, useEffect, ReactNode, useMemo } from 'react';
import { Movie } from 'src/types/Movie';

interface MyListContextType {
  myList: Movie[];
  addToMyList: (movie: Movie) => void;
  removeFromMyList: (movieId: number) => void;
}

const MyListContext = createContext<MyListContextType | undefined>(undefined);

export const MyListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [myList, setMyList] = useState<Movie[]>(() => {
    const savedList = localStorage.getItem('myList');
    return savedList ? JSON.parse(savedList) : [];
  });

  useEffect(() => {
    localStorage.setItem('myList', JSON.stringify(myList));
  }, [myList]);

  const addToMyList = (movie: Movie) => {
    setMyList((prevList) => {
      if (!prevList.some((item) => item.id === movie.id)) {
        return [...prevList, movie];
      }
      return prevList;
    });
  };

  const removeFromMyList = (movieId: number) => {
    setMyList((prevList) => prevList.filter((item) => item.id !== movieId));
  };

  // Memoize the value object
  const value = useMemo(
    () => ({
      myList,
      addToMyList,
      removeFromMyList,
    }),
    [myList] // Dependencies
  );

  return <MyListContext.Provider value={value}>{children}</MyListContext.Provider>;
};

export const useMyList = () => {
  const context = useContext(MyListContext);
  if (context === undefined) {
    throw new Error('useMyList must be used within a MyListProvider');
  }
  return context;
};
