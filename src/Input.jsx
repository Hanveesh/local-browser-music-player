import { useState,useRef,useEffect } from "react"

function Input(){
    const [songsList,setSongsList] = useState(null);

    const [Song , setSong] = useState({ URL :  "" , "index" : null}) 

    const labelRef = useRef(null)

    const songRef = useRef(null)
    
    const [songName, setsongName] = useState("-Please choose a song-") 

    function setAnotherSong(i){
        const newSongURL = URL.createObjectURL(songsList[i])
        setSong({URL : newSongURL,index : i})
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
        setSong({URL : "", index : null});
        setsongName("-Please choose a song-")
    }

    useEffect(() => {
        if(songRef.current != null) {
            console.log(Song)
            songRef.current.play();
            labelRef.current.scrollIntoView({
                behaviour : "smooth",
                block : "center"
            })
        }

        console.log(labelRef)

        return () => {
        if (Song) {
            URL.revokeObjectURL(Song);
        }
    };
    } , [Song.URL]);

    function ChangeSong(e){
        const files = Array.from(e.target.files)
        const file = e.target.files[0] 
        if(files){
            setSongsList(files)
        }

        if (file) {
            const songURL = URL.createObjectURL(file);
            setsongName(file.name.slice(0,-4))
            setSong({URL : songURL, index : 0})
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
                    Song.URL && <>
                     <audio ref={songRef} className="rounded-md hover:cursor-pointer bg-white " onEnded={()=> setAnotherSong(Song.index + 1)} src={Song.URL} controls></audio> 
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
                return <li ref={Song.index == index ? labelRef : null} className={`flex justify-center ${Song.index == index ? "text-green-500" : null} items-center text-xl hover:cursor-pointer`} onClick={() => setAnotherSong(index)} key={index}>{item.name.slice(0,-4)}</li>
            })}
            </ul>
        </div>
        </>}
    </div>
        </>
    )
}

export default Input