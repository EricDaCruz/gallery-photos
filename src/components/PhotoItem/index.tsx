import * as C from './styles'
import {useState} from 'react'
type Props = {
    name: string;
    url: string;
}

const PhotoItem = ({name, url}: Props) => {
    return(
        <C.Container >
            <img src={url} alt={name} />
            {name}
        </C.Container>
        
    )
}

export default PhotoItem;