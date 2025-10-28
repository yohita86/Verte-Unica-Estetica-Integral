import { useState } from "react";
import axios from "axios";

const ProfilePhotoUploader = () => {
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        setImage(URL.createObjectURL(file)); // guardás la vista previa local

        const formData = new FormData();
        formData.append("photo", file);

        try {
            const res = await axios.post("http://localhost:3000/users/upload-photo", formData, {
                withCredentials: true,
            });
            setImageUrl(res.data.imageUrl);
            alert("Imagen subida correctamente. URL: " + res.data.imageUrl);
        } catch {
            alert("Error al subir la imagen");
        }
    };

    return (
        <div>
            <h2>Subir Foto de Perfil</h2>
            <input type="file" accept="image/*" onChange={handleUpload} />
            {image && (
                <div>
                    <p>Vista previa local:</p>
                    <img src={image} alt="Preview" width={200} />
                </div>
            )}
            {imageUrl && (
                <div>
                    <p>Imagen subida:</p>
                    <img src={imageUrl} alt="Imagen subida" width={200} />
                </div>
            )}
        </div>
    );
};

export default ProfilePhotoUploader;
