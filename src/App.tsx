import { useState, useEffect, FormEvent } from "react";
import * as C from "./App.styles";
import * as Photos from "./services/photos";
import { Photo } from "./types/Photo";
import ReactLoading from "react-loading";
import PhotoItem from "./components/PhotoItem";
import toast, { Toaster } from 'react-hot-toast';

const App = () => {
   const [loading, setLoading] = useState(false);
   const [uploading, setUploading] = useState(false);
   const [listPhotos, setListPhotos] = useState<Photo[]>([]);

   useEffect(() => {
      const getPhotos = async () => {
         setLoading(true);
         setListPhotos(await Photos.getAllPhotos());
         setLoading(false);
      };
      getPhotos();
   }, []);

   const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const file = formData.get("image") as File;
      if (file && file.size > 0) {
         setUploading(true);
         let result = await Photos.insertPhoto(file, listPhotos);
         setUploading(false);
         if (result instanceof Error) {
            toast.error(result.message);
         } else {
            toast.success(`Imagem cadastrada`)
            let newList = [...listPhotos];
            newList.push(result);
            setListPhotos(newList);
         }
      }else{
         toast("Insira uma imagem")
      }
   };

   return (
      <C.Container>
         <Toaster position="top-center" reverseOrder={false} />
         <C.Area>
            <C.Header>Galeria de Fotos</C.Header>

            <C.UploadForm method="POST" onSubmit={handleFormSubmit}>
               <input type="file" name="image" />
               <input type="submit" value="Enviar" />
               {uploading && "Enviando..."}
            </C.UploadForm>

            {loading && (
               <C.ScreenWarning>
                  <ReactLoading
                     type="spinningBubbles"
                     width="90px"
                     height="100%"
                  />
                  <div>Carregando...</div>
               </C.ScreenWarning>
            )}

            {!loading && listPhotos.length > 0 && (
               <C.PhotoList>
                  {listPhotos.map((item, index) => (
                     <PhotoItem key={index} name={item.name} url={item.url} />
                  ))}
               </C.PhotoList>
            )}

            {!loading && listPhotos.length === 0 && (
               <C.ScreenWarning>
                  <div className="emoji">😔</div>
                  <div>Ainda não há fotos...</div>
               </C.ScreenWarning>
            )}
         </C.Area>
      </C.Container>
   );
};

export default App;
