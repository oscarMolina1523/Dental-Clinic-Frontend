// hooks/useImageUpload.ts
import { useState } from "react";

const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Sube una imagen a Imgbb y devuelve la URL.
   * @param imageFile - Archivo de imagen a subir.
   * @returns {Promise<string | null>} - URL de la imagen subida o null en caso de error.
   */
  const uploadImage = async (imageFile: File): Promise<string | null> => {
    setUploading(true); // Indicar que la subida está en curso
    setError(null); // Limpiar errores previos

    const formData = new FormData();
    formData.append("key", import.meta.env.VITE_IMAGE_TOKEN); // Clave API de Imgbb
    formData.append("image", imageFile); // Archivo de imagen

    try {
      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error uploading image");
      }

      const data = await response.json();
      return data.data.url; // Devolver la URL de la imagen ya subida
    } catch (err) {
      setError("Failed to upload image. Please try again."); // Manejo de error
      console.error(err);
      return null;
    } finally {
      setUploading(false); // Finalizar estado de carga
    }
  };

  return { uploadImage, uploading, error };
};

export default useImageUpload;