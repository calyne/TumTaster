var nowplaying = null;

if (localStorage["settings"] == undefined) {
  settings = defaultSettings;
} else {
  settings = JSON.parse(localStorage["settings"]);
}

chrome.extension.onRequest.addListener(
  function(message, sender, sendResponse) {
    if (message == 'getSettings') {
      sendResponse({settings: localStorage["settings"]});
    } else {
      addSong(message);
      sendResponse({});
    }
});

function addSong(newSong) {
  switch (settings["mp3player"]) {
    case "flash":
      var mySoundObject = soundManager.createSound({
        id: newSong.post_url,
        url: newSong.song_url,
        onloadfailed: function(){playnextsong(newSong.post_url)},
        onfinish: function(){playnextsong(newSong.post_url)}
      });
      break;
    case "html5":
      var newAudio = document.createElement('audio');
      newAudio.setAttribute('src', newSong.song_url);
      newAudio.setAttribute('id', newSong.post_url);
      var jukebox = document.getElementById('Jukebox');
      jukebox.appendChild(newAudio);
      break;
  }
}

function getJukebox() {
  var jukebox = document.getElementsByTagName('audio');
  return jukebox;
}

function removeSong(rSong) {
  var remove_song = document.getElementById(rSong);
  remove_song.parentNode.removeChild(remove_song);
}

function playSong(song_url,post_url) {
  switch (settings["mp3player"]) {
    case "flash":

      break;
    case "html5":
      play_song = document.getElementById(post_url);
      play_song.addEventListener('ended',play_song,false);
      play_song.play();
      pl = getJukebox();
      for(var x=0;x<pl.length;x++){
        if(pl[x].id!=post_url){
          pl[x].pause();
        }
      }
      break;
  }
}

function playnextsong(previous_song) {
  var bad_idea = null;
  var first_song = null;
  var next_song = null;

  switch (settings["mp3player"]) {
    case "flash":
      for (x in soundManager.sounds) {
        if (soundManager.sounds[x].sID != previous_song && bad_idea == previous_song && next_song == null) {
          next_song = soundManager.sounds[x].sID;
        }
        bad_idea = soundManager.sounds[x].sID;
        if (first_song == null) {
          first_song = soundManager.sounds[x].sID;
        }
      }

      if (settings["shuffle"]) {
        var s = Math.floor(Math.random()*soundManager.soundIDs.length+1);
        next_song = soundManager.soundIDs[s];
      }
      
      if (settings["repeat"] && bad_idea == previous_song) {
        next_song = first_song;
      }

      if (next_song != null) {
        var soundNext = soundManager.getSoundById(next_song);
        soundNext.play();
      }
      break;
    case "html5":
        var playlist = document.getElementsByTagName('audio');
        for (x in playlist) {
          if (playlist[x].src != previous_song && bad_idea == previous_song && next_song == null) {
            next_song = playlist[x];
          }
          bad_idea = playlist[x].song_url;
          if (first_song == null) {
            first_song = playlist[0].song_url;
          }
        }
        
        if (settings["shuffle"]) {
          var s = Math.floor(Math.random()*playlist.length+1);
          next_song = playlist[s];
        }
        
        if (settings["repeat"] && bad_idea == previous_song) {
          next_song = first_song;
        }
        
        if (next_song != null) {
          playlist[x].play();
        }
      break;
  }
}

function playrandomsong(previous_song) {
  var x = Math.floor(Math.random()*soundManager.soundIDs.length+1);
  var mySoundObject = soundManager.getSoundById(soundManager.soundIDs[x]);
  mySoundObject.play();
}

document.addEventListener("DOMContentLoaded", function () {
  soundManager.setup({"preferFlash": false});
/*  if (settings["mp3player"]=="flash") {
    var fileref=document.createElement('script');
    fileref.setAttribute("type","text/javascript");
    fileref.setAttribute("src", "soundmanager2.js");
    document.getElementsByTagName("head")[0].appendChild(fileref);
  } */
});