import { useState } from "react"

function Input(){

    const [Song , setSong] = useState("")

    const [songName, setsongName] = useState("Please choose song")
    function ChangeImage(e){
        console.log(e);
        const file = e.target.files[0]

        if (file) {
            const songURL = URL.createObjectURL(file);
            setsongName(file.name.slice(0,-4))
            setSong(songURL)
        }
    }

    return(
        <>
        <div className="flex flex-col gap-5 border p-30 rounded-2xl bg-[#292929] justify-center items-center">
    
        <input className="hidden" onChange={e => ChangeImage(e)} id="songs_input" type="file" accept="audio/*" multiple/>
        <label htmlFor="songs_input" className="h-10 w-20 border bg-white text-[#292929]  rounded flex justify-center items-center hover:scale-130 hover:cursor-pointer transition ease-in duration-150"  >Upload</label>
        <div>
            <div id="SongName">{songName}</div>
        </div>
            <audio className="rounded mt-3" controls src={Song} ></audio>
        </div>
        </>
    )
}

export default Input