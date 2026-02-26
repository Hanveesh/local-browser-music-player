import { useState,useRef } from "react"

function Input(){

    const [Song , setSong] = useState("") //useState() used to set the selected song

    
    const [songName, setsongName] = useState("-Please choose song-") //useState() to change the name of the song on the Site


    function ChangeSong(e){
        console.log(e); //printing the Event object to check the values
        const file = e.target.files[0] //getting The First song

        if (file) {
            const songURL = URL.createObjectURL(file); //creating a local Blob URL [temporary URL for that song]
            setsongName(file.name.slice(0,-4)) //removing the extension part of the Song
            setSong(songURL)//Adding the BlobURL as the present song to play it
        }
    } //ChangeSong function used to change the song

    return(
        <>
        <div className="flex flex-col gap-5 border p-30 rounded-2xl bg-[#292929] justify-center items-center">
        
            <input className="hidden" onChange={e => ChangeSong(e)} id="songs_input" type="file" accept="audio/*" multiple/>
            <label htmlFor="songs_input" className="h-10 w-20 border bg-white text-[#292929]  rounded flex justify-center items-center hover:scale-130 hover:cursor-pointer transition ease-in duration-150"  >Upload</label>
            
            <div>
                <div id="SongName">{songName}</div>
                
            </div>
                {
                    Song && <audio className="rounded hover:cursor-pointer bg-white " src={Song} controls></audio>
                }
        </div>
        </>
    )
}

export default Input