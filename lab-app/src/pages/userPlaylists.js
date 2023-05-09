import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AddPlaylist(name, type){
    if (name == "" || name == null || type == null || type == ""){
        alert("Error! You have done something wrong!");
        return;
    }

    let pName = document.querySelector("#playlistName");
    let pType = document.querySelector("#playlistType");
    let confButton = document.querySelector("#confirmButton");
    pName.setAttribute("style", "display: none");
    pType.setAttribute("style", "display: none");
    confButton.setAttribute("style", "display: none");

    let url = "http://localhost:5000/playlist/create";
    let h = new Headers();
    h.append('Accept', 'application/json');
    let encoded = btoa(localStorage.getItem('username') + ':' + localStorage.getItem('password'));
    
    let auth = 'Basic ' + encoded;
    
    h.append('Authorization', auth);

    let body = JSON.stringify({name: name, state: type});

    fetch(url, {
        method:'POST',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': auth
        },
        body: body
    })
    .catch(error => console.error(error));
}

export function UserPrivatePlaylists(){
    const navigate = useNavigate();
    let [plName, setPlName] = useState("");
    let [playlistType, setPlaylistType] = useState("Public");

    function changeVisibility(){
        let pName = document.querySelector("#playlistName");
        let pType = document.querySelector("#playlistType");
        let confButton = document.querySelector("#confirmButton");

        if (pName.style.display == "none")
            pName.setAttribute("style", "display: inline-block");
        else pName.setAttribute("style", "display: none");

        if (pType.style.display == "none")
            pType.setAttribute("style", "display: inline-block");
        else pType.setAttribute("style", "display: none");

        if (confButton.style.display == "none")
            confButton.setAttribute("style", "display: inline-block");
        else confButton.setAttribute("style", "display: none");
    }

    function changeType(){
        if (playlistType == "Public") setPlaylistType("Private");
        else setPlaylistType("Public");
    }

    useEffect(() => {
        if (localStorage.length <= 0){
            alert("You do not have access");
            navigate("/login");
            return;
        }
    });

    let url = "http://localhost:5000/playlist/user/private";

    let h = new Headers();
    h.append('Accept', 'application/json');
    let encoded = btoa(localStorage.getItem('username') + ':' + localStorage.getItem('password'));
    
    let auth = 'Basic ' + encoded;
    
    h.append('Authorization', auth);
    
    let req = new Request(url, {
        method:'GET',
        headers:h,
        credentials:'same-origin'
    });

    let [pls, setPls] = useState(null);

    useEffect(() => {
        if (localStorage.length > 0){
            fetch(req)
            .then(response => response.json())
            .then(data => setPls(data))
        }
    }, []);

    return (
        <div className="playlists">
            <div className="label"><h1>Your private playlists</h1></div>
            <input type="button" value="Add playlist" id="add-button" onClick={changeVisibility} style={{display:"inline-block"}}></input>
            <input type="text" id="playlistName" name="playlistName" placeholder="Playlist Name" value={plName} onChange={e => setPlName(e.target.value)} style={{display:"none"}}></input>
            <input type="button" id="playlistType" value={playlistType} style={{display:"none", backgroundColor: "rgb(142,142,142)"}} onClick={changeType}></input>
            <input type="button" id="confirmButton" value="Confirm" onClick={e => AddPlaylist(plName, playlistType)} style={{display:"none"}}></input>
            <Link to="/"><input type="button" value="Delete playlist" id="delete-button" style={{display:"inline-block", backgroundColor: "rgb(122, 20, 20)"}}></input></Link>
            <div className="container">
                {pls && pls.map((pl) => {
                    return <>
                    <Link to={`/playlist/${pl.id}`}> 
                    <div className="playlist-button" key={pl.id}>
                        <h2 className="playlist-name">{pl.name}</h2>
                        <h4 className="playlist-creator">Creator: {pl.user_name}</h4>
                    </div>
                    </Link>
                    </>
                }
                )}
            </div>
        </div>
    );
}

export function UserPublicPlaylists(){

    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.length <= 0){
            alert("You do not have access");
            navigate("/login");
            return;   
        }
    });

    let url = "http://localhost:5000/playlist/user/public";

    let h = new Headers();
    h.append('Accept', 'application/json');
    let encoded = btoa(localStorage.getItem('username') + ':' + localStorage.getItem('password'));

    
    let auth = 'Basic ' + encoded;
    
    h.append('Authorization', auth);
    
    let req = new Request(url, {
        method:'GET',
        headers:h,
        credentials:'same-origin'
    });

    let [pls, setPls] = useState(null);

    useEffect(() => {
        if (localStorage.length > 0){
            fetch(req)
            .then(response => response.json())
            .then(data => setPls(data))
        }
    }, []);

    return (
        <div className="playlists">
            <div className="label"><h1>Your public playlists</h1></div>
            <Link to="/"><input type="button" value="Add playlist" id="add-button" style={{display:"inline-block"}}></input></Link>
            <Link to="/"><input type="button" value="Delete playlist" id="delete-button" style={{display:"inline-block"}}></input></Link>
            <div className="container">
                {pls && pls.map((pl) => 
                <Link to={`/playlist/${pl.id}`}> 
                <div className="playlist-button" key={pl.id}>
                    <h2 className="playlist-name">{pl.name}</h2>
                    <h4 className="playlist-creator">Creator: {pl.user_name}</h4>
                </div>
                </Link>
                )}
            </div>
        </div>
    );
}