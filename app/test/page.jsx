"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

function Page() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [images, setImages] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(
        "http://localhost:3001/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setImageId(response.data.id);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get("http://localhost:3001/images");
        setImages(response.data);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchImages();
  }, [imageId]);

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
      {/* Mapear las imágenes y renderizarlas */}
      {images.map((image, index) => (
        <img
          key={index}
          src={`data:image/png;base64,${Buffer.from(image.image).toString(
            "base64"
          )}`}
          alt={`Image ${index}`}
        />
      ))}
    </div>
  );
}

export default Page;
