import { useState,useRef,useEffect } from "react"

function Input(){
    const [songsList,setSongsList] = useState(null);

    const [Song , setSong] = useState("") //useState() used to set the selected song

    const songRef = useRef(null)
    
    const [songName, setsongName] = useState("-Please choose a song-") //useState() to change the name of the song on the Site

    function setAnotherSong(i){
        const newSongURL = URL.createObjectURL(songsList[i])
        setSong(newSongURL)
        setsongName(songsList[i].name.slice(0,-4))

    }

    function songPause(e){
        songRef.current.pause()
    }

    function songPlay(){
        songRef.current.play()
    }

    function songReset(){
        songRef.current.pause()
        setSongsList(null)
        setSong("");
        setsongName("-Please choose a song-")
    }

    useEffect(() => {
        if(songRef.current != null) {
            console.log(Song)
            songRef.current.play();
        }

        return () => {
        if (Song) {
            URL.revokeObjectURL(Song);
        }
    };
    } , [Song]);

    function ChangeSong(e){
        const files = Array.from(e.target.files)
        const file = e.target.files[0] 
        if(files){
            setSongsList(files)
        }

        if (file) {
            const songURL = URL.createObjectURL(file);
            setsongName(file.name.slice(0,-4))
            setSong(songURL)
        }
    } 

    

    return(
        <>
    <div className="flex flex-row gap-6">

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
        {songsList && <>
            <div className="border overflow-auto h-130 rounded-2xl">
            <ul className="flex py-3 px-10 flex-col gap-6">
            {songsList.map( (item,index) => {
                return <li className="flex justify-center items-center text-xl hover:cursor-pointer" onClick={() => setAnotherSong(index)} key={index}>{item.name.slice(0,-4)}</li>
            })}
            </ul>
        </div>
        </>}
    </div>
        </>
    )
}

export default Input