import { useEffect, useState } from 'react';

import Notiflix from 'notiflix';

import { fetchQuery } from './api';
import { Wrapper } from './App.styled';
import { SearchBar } from './SearchBar/Searchbar';
import { Button } from './Button/Button';
import { Loader } from './Loader/Loader';
import { ModalWindow } from './Modal/Modal';
import { ImageGallery } from './ImageGallery/ImageGallery';

export const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalImages, setTotalImages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      return;
    }
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetchQuery(searchQuery, page);
        setImages(prevImages => [...prevImages, ...response.images]);
        setTotalImages(response.totalHits);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [searchQuery, page]);

  const searchQueryValue = value => {
    if (value === searchQuery) {
      Notiflix.Notify.warning('Enter another search query!');
      return;
    }
    setSearchQuery(value);
  };

  const openImageModal = largeImageURL => {
    setShowModal(largeImageURL);
  };

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  const showModalStateReset = () => {
    setShowModal(false);
  };

  return (
    <Wrapper>
      <SearchBar onSubmit={searchQueryValue} />
      <ImageGallery images={images} openImageModal={openImageModal} />
      {loading && <Loader />}
      {totalImages !== images.length && !loading && (
        <Button onClick={handleLoadMore} />
      )}

      {showModal && (
        <ModalWindow
          showModal={showModal}
          showModalStateReset={showModalStateReset}
          largeImageURL={showModal}
        />
      )}
    </Wrapper>
  );
};
