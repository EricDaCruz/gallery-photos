import { Photo } from '../types/Photo'
import { storage } from '../libs/firebase'
import {
    ref,
    listAll,
    getDownloadURL,
    uploadBytes
} from 'firebase/storage'
import toast from 'react-hot-toast';


export const  getAllPhotos = async () => { 
    let list: Photo[] = [];
    const imagesFolder = ref(storage, 'images')
    const photoList = await listAll(imagesFolder)

    for(let i in photoList.items) {
        let urlPhoto = await getDownloadURL(photoList.items[i])
        list.push({
            name:photoList.items[i].name,
            url: urlPhoto
        })
    }

    return list
}

export const insertPhoto = async (file: File, list: Photo[]) => {
    if(['image/jpeg', 'image/jpg', 'image/png', 'image/svg'].includes(file.type)){
        let newFile = ref(storage, `images/${file.name}`)
        let upload = await uploadBytes(newFile, file)
        let urlPhoto = await getDownloadURL(upload.ref)
        for(let i in list){
            if(list[i].name === file.name){
                return new Error(`${file.name} já está cadastrada`)
            }
        }
        return {
            name: upload.ref.name,
            url: urlPhoto,
        } as Photo
    }else{
        return new Error('Tipo de arquivo negado')
    }
}