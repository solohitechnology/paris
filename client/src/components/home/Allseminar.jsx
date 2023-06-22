import React, { useState, useEffect } from 'react';
import './allserminar.css'
const Allseminar = () => {
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const fetchedImages = await fetchImagesFromServer();
        setImages(fetchedImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  const fetchImagesFromServer = () => {
    return new Promise((resolve) => {
      const fetchedImages = [
        {
          url: './logo1.jpeg',
          alt: 'Image 1',
          description: 'Description of Image 1',
          registerLink: 'http://localhost:4000/api/serminar/register',
        },
        {
          url: './.jpg',
          alt: 'Image 2',
          description: 'Description of Image 2',
          registerLink: 'http://localhost:4000/api/serminar/register',
        },
      ];
      resolve(fetchedImages);
    });
  };

  const getImageDescription = (image) => {
    return image ? image.description || 'No description available' : '';
  };

  const getRegisterLink = (image) => {
    return image ? image.registerLink || '#' : '#';
  };

  const previousImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };


  const currentImage = images[currentImageIndex];
  const imageDescription = getImageDescription(currentImage);
  const registerLink = getRegisterLink(currentImage);

  return (
    <div className="picture-slider">
      <button onClick={previousImage}>Previous</button>
      <div className="image-container">
        {images.length > 0 && currentImage ? (
          <img className="slide" src={currentImage.url} alt={currentImage.alt} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="image-description">
        <p>{imageDescription}</p>
        <a href={registerLink}>Register</a>
      </div>
      <button onClick={nextImage}>Next</button>
    </div>
  );
};

export default Allseminar;
