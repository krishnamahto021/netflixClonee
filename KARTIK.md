src/
  ├── components/
  │   ├── common/
  │   │   ├── Button/
  │   │   │   ├── PlayButton.tsx         # Merge all buttons into one component
  │   │   │   ├── MoreInfoButton.tsx     # with variants if needed
  │   │   │   └── NetflixIconButton.tsx
  │   │   ├── Logo.tsx
  │   │   ├── SearchBox.tsx
  │   │   ├── LoadingScreen/
  │   │   │   └── MainLoadingScreen.tsx
  │   │   └── chips/
  │   │       ├── AgeLimitChip.tsx
  │   │       ├── QualityChip.tsx
  │   │       └── MaturityRate.tsx
  │   │
  │   ├── video/
  │   │   ├── VideoCard.tsx              # Merge VideoItemWithHover.tsx
  │   │   ├── VideoSlider.tsx            # and VideoItemWithHoverPure.tsx
  │   │   ├── VideoPortal.tsx            # Combine portal-related components
  │   │   └── SimilarVideoCard.tsx
  │   │
  │   ├── grid/
  │   │   ├── GridPage.tsx
  │   │   └── GridWithInfiniteScroll.tsx
  │   │
  │   └── hero/
  │       └── HeroSection.tsx
  │
  ├── layouts/
  │   ├── MainLayout.tsx
  │   └── Navigation/
  │       └── NetflixNavigationLink.tsx
  │
  ├── pages/
  │   ├── HomePage.tsx
  │   ├── GenreExplore.tsx
  │   ├── MyList.tsx
  │   ├── SearchPage.tsx
  │   └── WatchPage.tsx
  │
  ├── hooks/
  │   ├── useIntersectionObserver.ts   # Keep this
  │   ├── useMyList.ts                 # Keep this
  │   ├── useOutsideClick.tsx          # Keep this
  │   ├── useWindowSize.ts             # Keep this
  │   └── useOffsetTop.ts              # Keep this
  │
  ├── context/
  │   └── MyListContext.tsx            # Replace Redux with this
  │
  ├── types/
  │   ├── Comment.ts
  │   ├── Genre.ts
  │   └── Movie.ts
  │
  ├── utils/
  │   ├── common.ts
  │   └── CustomClassNameSetup.ts
  │
  └── constants/
      └── index.ts                     # Move constants here