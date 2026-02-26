import { useState,useRef } from "react"

function Input(){

    const [Song , setSong] = useState("") //useState() used to set the selected song

    const songRef = useRef(null)
    
    const [songName, setsongName] = useState("-Please choose a song-") //useState() to change the name of the song on the Site

    function songPause(e){
        songRef.current.pause()//accesses the Ref and pauses it
        console.log(songRef)
    } //Custom function to change the song when Pause button is pressed

    function songPlay(){
        songRef.current.play()//accesses the Ref and plays it
        console.log(songRef)
    }//Custom function to change the song when Play button is pressed

    function songReset(){
        songRef.current.pause()//accesses the Ref and pause it
        setSong("");//removes the set
        setsongName("-Please choose a song-")//resets the name
        console.log(songRef)
    }//Custom function to reset the song when reset button is pressed

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
                    Song && <>
                     <audio ref={songRef} className="rounded-md hover:cursor-pointer bg-white " src={Song} controls></audio> 
                     <div className="flex flex-row gap-3">
                        <button onClick={(e) => songPause(e)}>Pause</button>
                        <button onClick={(e) => songPlay(e)}>Play</button>
                        <button onClick={(e) => songReset(e)}>Reset</button>
                     </div>
                      
                     </>
                }
        </div>
        </>
    )
}

export default Input