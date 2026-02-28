import { useState, useRef, useEffect } from "react"

function Input() {

    const refRandom = useRef(null)

    const [random, setRandom] = useState(false)

    const [songsList, setSongsList] = useState(null);

    const [PlayingState, setPlayingState] = useState("Pause")

    const [Song, setSong] = useState({ URL: "", "index": null })

    const labelRef = useRef(null)

    const ProgressBarRef = useRef(null)

    const AddSongref = useRef(null)

    const songRef = useRef(null)

    const [songName, setsongName] = useState("-Please choose a song-")


    function swap(tempArray,i,j){
        [tempArray[i],tempArray[j]] = [tempArray[j],tempArray[i]];
        return tempArray;
    }

    function shuffleSongsList(){
        let j = 0;

        setSongsList((p) => {

            const songName = songsList[Song.index].name
            let ind = Song.index

            let tempArray = [...p];
                for (let i = 0;i < songsList.length ;i++){

                    j = Math.round((Math.random()*(songsList.length - 1)) )
                    tempArray = swap(tempArray,i,j)
                }

            ind = tempArray.findIndex(p => p.name === songName )
            setSong((p) =>({ ...p,index: ind}))
                
            return tempArray;
        })
        
    }

    function changeRandom(){
        if (random) {
            refRandom.current.className = "randomBTN"
            setRandom(false)
        }
        else {
            refRandom.current.className = "trueBTN"
            console.log(refRandom.current.className)
            setRandom(true)
        }
        
    }

    function setAnotherSong(i,Pressed = false) {
        i = i % songsList.length ;
        i = (i === -1) ? songsList.length-1 : i;
        if(!Pressed){
            if(random){
                console.log("Random is On")
                i = Math.round(Math.random() * songsList.length)

            }
        }
        const newSongURL = URL.createObjectURL(songsList[i])
        setSong({ URL: newSongURL, index: i })
        setsongName(songsList[i].name.slice(0, -4))

    }

    
    function songPause(e) {
        if (songRef.current.paused) {
            setPlayingState("Pause")
            songRef.current.play()
        }
        else {
            setPlayingState("Play")
            songRef.current.pause()
        }
    }


    function songReset() {
        // songRef.current.pause()
        // setSongsList(null)
        // setSong({ URL: "", index: null });
        // setsongName("-Please choose a song-")

        songRef.current.currentTime = 0;
    }


    useEffect(() => {
        const audio = songRef.current
        const bar = ProgressBarRef.current

        if (!audio || !bar) return;


        function updateBar() {
            if (audio.duration) {
                bar.value = (audio.currentTime / audio.duration) * 100
            }
        }

        audio.addEventListener("timeupdate", updateBar)

        return () => {
            audio.removeEventListener("timeupdate", updateBar)
        }
    }, [Song.URL])


    useEffect(() => {
        if (songRef.current != null) {
            songRef.current.play();
            labelRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
        }

        return () => {
            if (Song) {
                URL.revokeObjectURL(Song.URL);
            }
        };
    }, [Song.URL]);

    function RemoveSong(i){
        let len = songsList.length

        if(len == 1){
            songReset();
            return
        }
        const Name = songsList[i].name
        

        if(Name == songsList[Song.index].name) {
            songRef.current.pause();
            const newSongURL = URL.createObjectURL(songsList[i == len-1 ?0 : (i + 1) ])
            setsongName(songsList[i == len-1 ?0 : (i + 1)].name.slice(0, -4))
            setSong({ URL: newSongURL, index: i ==len-1?0 : i })
            setSongsList(songsList.filter((w) =>w.name != Name))
            
            return
        }

        setSongsList(songsList.filter((w) =>w.name != Name))
        setSong(p =>({...p,index : (i < p.index) ? p.index - 1  : p.index }))

    }

    function UploadSong(e) {
        const files = Array.from(e.target.files)
        const file = e.target.files[0]
        if (files) {
            setSongsList(files)
        }

        if (file) {
            const songURL = URL.createObjectURL(file);
            setsongName(file.name.slice(0, -4))
            setSong({ URL: songURL, index: 0 })
        }
    }

    function AddSong(e) {
        const files = Array.from(e.target.files)
        if(files.length > 0) {
            setSongsList((p) => [...p,...files])
            console.log("Added")
        }
    }

    function ChangeTime(e) {
        songRef.current.currentTime = ((e.target.value / 100) * songRef.current.duration)
    }


    return (
        <>
            <div className="flex flex-row gap-6">

                <div className="flex flex-col gap-5 border p-30 rounded-2xl bg-[#292929] justify-center items-center">

                    <input className="hidden" onChange={e => UploadSong(e)} id="songs_input" type="file" accept="audio/*" multiple />

                    <label htmlFor="songs_input" className="h-10 w-20 border bg-white text-[#292929]  rounded flex justify-center items-center hover:scale-130 hover:cursor-pointer transition ease-in duration-150"  >Upload</label>

                    <div>
                        <div id="SongName">{songName}</div>

                    </div>
                    {
                        Song.URL && <>
                            <audio ref={songRef} className="rounded-md hover:cursor-pointer bg-white " onEnded={() => setAnotherSong((Song.index + 1)%songsList.length)} src={Song.URL} controls></audio>
                            <div className="flex flex-row gap-3">
                                <button onClick={(e) => songPause(e)}>{PlayingState}</button>
                                <button onClick={(e) => songReset(e)}>Reset</button>
                                <button ref={refRandom} className="randomBTN" onClick={()=> changeRandom()}>Random</button>
                            </div>

                            <div className="flex flex-col justify-center items-center">
                                <input className="w-70 " ref={ProgressBarRef} id="progress-bar" type="range" onClick={(e) => { ChangeTime(e) }} min={0} max={100} step={0.01}></input>
                                <div className="flex flex-row gap-10 mt-8">
                                <button className="w-20" onClick={() => setAnotherSong(Song.index-1)}>PREV</button>
                                <button className="w-20" onClick={() => setAnotherSong(Song.index+1)}>NEXT</button>
                                </div>
                            </div>

                        </>
                    }
                </div>
                {songsList && <>
                <div className="flex flex-col gap-4">
                    <div className="border overflow-auto h-130 rounded-2xl">
                        <ul className="flex py-3 px-10 flex-col gap-6">
                            
                            {songsList.map((item, index) => {
                                return <div key={index} className="flex gap-5 justify-center items-center">
                                     <li ref={Song.index == index ? labelRef : null}
                                     className={`flex justify-center ${Song.index == index ? "text-green-500" : null} items-center text-xl hover:cursor-pointer`}
                                      onClick={() => 
                                      setAnotherSong(index,true)}>
                                        {item.name.slice(0, -4)}
                                     </li> 
                                <button className="ml-auto" onClick={() => RemoveSong(index)}>-</button>  </div>
                            })}
                        </ul>
                        
                    </div>
                    <div className="flex flex-row justify-center align-center gap-10" >
                    <button onClick={shuffleSongsList}>Shuffle</button>
                    <input className="hidden" ref={AddSongref} onChange={(e) => AddSong(e)} type="file" multiple></input>
                    <button onClick={(e) => {AddSongref.current.click();}}>Add</button>                           
                    </div>

                </div>
                </>}
            </div>
        </>
    )
}

export default Input