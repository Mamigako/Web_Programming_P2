// encapsulating all JS functions to run after DOM has loaded.

document.addEventListener('DOMContentLoaded', function () {


    let recordedTones = []; // Array to store recorded tones.
    let prev = 0; // time variable used later to calculate timing of recorded notes.

    
    // initialize synth + keys.
    const synth = new Tone.Synth().toDestination();
    
    const C4 = document.getElementById("c4");
    const Csharp4 = document.getElementById("c#4");
    const D4 = document.getElementById("d4");
    const Dsharp4 = document.getElementById("d#4");
    const E4 = document.getElementById("e4");
    const F4 = document.getElementById("f4");
    const Fsharp4 = document.getElementById("f#4");
    const G4 = document.getElementById("g4");
    const Gsharp4 = document.getElementById("g#4");
    const A4 = document.getElementById("a4");
    const Bflat4 = document.getElementById("bb4");
    const B4 = document.getElementById("b4");
    const C5 = document.getElementById("c5");
    const Csharp5 = document.getElementById("c#5");
    const D5 = document.getElementById("d5");
    const Dsharp5 = document.getElementById("d#5");
    const E5 = document.getElementById("e5");
    Tone.start();

//---------------------------------------------------------------------------------
    // Get all songs and load them into drop down menu.
    const getAllTunes = async () => {

        const url = 'http://localhost:3000/api/v1/tunes';

        // send get request.
        try {
            let response = await axios.get(url);
    
            console.log("Success: ", response.data);
    
            const drop_down_menu = document.getElementById('tunesDrop');

            // clear the drop down menu upon each new request.
            while (drop_down_menu.firstChild) {
                drop_down_menu.removeChild(drop_down_menu.firstChild);
            };
    
            // looping through tunes and populating/re-populating drop down menu.
            response.data.forEach(item => {
    
                const new_song = document.createElement('option');
                new_song.setAttribute('value', item.name);
                new_song.text = item.name;
                drop_down_menu.appendChild(new_song);
                console.log("Tune name: " + item.name);

            });

        }
        // log error in case of error.
        catch (error) {
        
            console.log(error);
        
        };
    };
//---------------------------------------------------------------------------------

// Initial loading songs from backend and initializing buttons/text field.
getAllTunes();
const Record_Button = document.getElementById("recordbtn");
const Stop_Button = document.getElementById("stopbtn");
const Record_Name_Input = document.getElementById("recordName");

//---------------------------------------------------------------------------------

    // Gets all tunes without populating the drop down.
    const getAllTunes_full = async () => {
        const url2 = 'http://localhost:3000/api/v1/tunes';
        let response = await axios.get(url2);
        return response.data;
    };
//---------------------------------------------------------------------------------
    // Recording start when recording button is pressed.
    function startRecording() {
        Record_Button.disabled = true;
        Stop_Button.disabled = false;
        recordedTones.length = 0; // Clear any previous recordings
        prev = Date.now(); // initialize time start point to calculate timing of notes.
        console.log("Recording started");
    };
//---------------------------------------------------------------------------------
    // Recording stop + call function to upload recorded tune.
    function stopRecording() {

        Record_Button.disabled = false;
        Stop_Button.disabled = true;
        console.log("Recording stopped");

        // check whether anything was recorded, if so, upload tune with name in text field or default name.
        if (recordedTones.length > 0) {
            const tuneName = Record_Name_Input.value || "No-name Tune";
            uploadTune(tuneName, recordedTones);
        };
    };
//---------------------------------------------------------------------------------
    // Upload tune to backend.
    async function uploadTune(tuneName, recordedTones) {

        const url_rec = 'http://localhost:3000/api/v1/tunes';
        
        // Create JS object.
        const newTune = {
            name: tuneName,
            tune: recordedTones,
        };
    
        // .post new tune    
        try {
            const response = await axios.post(url_rec, newTune);
            console.log("Tune uploaded successfully:", response.data);

            getAllTunes(); // Refresh dropdown with new tunes
            
            // Reset tune name text field.
            let tune_field = document.getElementById("recordName")
            tune_field.value = ''
        
        
        // print error in case of error.
        } catch (error) {
            console.error("Error uploading tune:", error);
        };
    };
//---------------------------------------------------------------------------------
    ///Play selected tune.
    async function play_tune() {
    let tunes = await getAllTunes_full();
    
    let tunes_name = document.getElementById("tunesDrop");
    let selectedIndex = tunes_name.selectedIndex;

    // Check by index if an option is selected.(if we check by name, it is not possible to play 2 no-name tunes.)
    if (selectedIndex !== -1 && selectedIndex < tunes.length) {
        const selectedTune = tunes[selectedIndex];

        // Play the tune, note for note.
        if (selectedTune) {
            selectedTune.tune.forEach(({ note, duration, timing }) => {
                synth.triggerAttackRelease(note, duration, `+${timing}`);
            });
        }
        // If no option is selected or the index is invalid, an error message is logged to the console.
    } else {
        console.error("No tune selected or invalid index.");
    }
};    
//---------------------------------------------------------------------------------
 
    // Play tune on play button click.
    const Play_Button = document.getElementById("tunebtn")
    Play_Button.addEventListener("click", async function () {
        await play_tune();
    });

//---------------------------------------------------------------------------------

//Start recording
Record_Button.addEventListener("click", startRecording);
//Stop recording
Stop_Button.addEventListener("click", stopRecording);

// Initialize note variable
let note;

// Onclick tones.
// When a key is clicked, the respective eventlistener is triggered and a synth note is produced.
// In addition, if recording is in progress, the timing is calculated and saved. The note is then pushed into the recordedTones array.

    C4.addEventListener('click',  () => {
        const now = Tone.now();
        synth.triggerAttackRelease("c4", "8n", now);
        if (!Stop_Button.disabled) {
            note = "C4";
            time = Date.now() - prev
            time = time/1000
            time = Number(time)
    
            recordedTones.push({ note, duration: "8n", timing: time });
            console.log(recordedTones)
        };
        
    });
    
    Csharp4.addEventListener('click', function () {
        const now = Tone.now();
        synth.triggerAttackRelease("c#4", "8n", now);
        if (!Stop_Button.disabled) {
            note = "C#4";
            time = Date.now() - prev
            time = time/1000
            time = Number(time)
    
            recordedTones.push({ note, duration: "8n", timing: time });
            console.log(recordedTones)
        };
        
    });

    D4.addEventListener('click', function () {
        const now = Tone.now();
        synth.triggerAttackRelease("d4", "8n", now);
        if (!Stop_Button.disabled) {
            note = "D4";
            time = Date.now() - prev
            time = time/1000
            time = Number(time)
    
            recordedTones.push({ note, duration: "8n", timing: time });
            console.log(recordedTones)
        };
        
    });

    Dsharp4.addEventListener('click', function () {
        const now = Tone.now();
        synth.triggerAttackRelease("d#4", "8n", now);
        if (!Stop_Button.disabled) {
            note = "D#4";
            time = Date.now() - prev
            time = time/1000
            time = Number(time)
    
            recordedTones.push({ note, duration: "8n", timing: time });
            console.log(recordedTones)
        };
        
    });

    E4.addEventListener('click', function () {
        const now = Tone.now();
        synth.triggerAttackRelease("e4", "8n", now);
        if (!Stop_Button.disabled) {
            note = "E4";
            time = Date.now() - prev
            time = time/1000
            time = Number(time)
    
            recordedTones.push({ note, duration: "8n", timing: time });
            console.log(recordedTones)
        };
        
    });

    F4.addEventListener('click', function () {
        const now = Tone.now();
        synth.triggerAttackRelease("f4", "8n", now);
        if (!Stop_Button.disabled) {
            note = "F4";
            time = Date.now() - prev
            time = time/1000
            time = Number(time)
    
            recordedTones.push({ note, duration: "8n", timing: time });
            console.log(recordedTones)
        };
        
    });

    Fsharp4.addEventListener('click', function () {
        const now = Tone.now();
        synth.triggerAttackRelease("f#4", "8n", now);
        if (!Stop_Button.disabled) {
            note = "F#4";
            time = Date.now() - prev
            time = time/1000
            time = Number(time)
    
            recordedTones.push({ note, duration: "8n", timing: time });
            console.log(recordedTones)
        };
        
    });

    G4.addEventListener('click', function () {
        const now = Tone.now();
        synth.triggerAttackRelease("g4", "8n", now);
        if (!Stop_Button.disabled) {
            note = "G4";
            time = Date.now() - prev
            time = time/1000
            time = Number(time)
    
            recordedTones.push({ note, duration: "8n", timing: time });
            console.log(recordedTones)
        };
        
    });

    Gsharp4.addEventListener('click', function () {
        const now = Tone.now();
        synth.triggerAttackRelease("g#4", "8n", now);
        if (!Stop_Button.disabled) {
            note = "G#4";
            time = Date.now() - prev
            time = time/1000
            time = Number(time)
    
            recordedTones.push({ note, duration: "8n", timing: time });
            console.log(recordedTones)
        };
        
    });

    A4.addEventListener('click', function () {
        const now = Tone.now();
        synth.triggerAttackRelease("a4", "8n", now);
        if (!Stop_Button.disabled) {
            note = "A4";
            time = Date.now() - prev
            time = time/1000
            time = Number(time)
    
            recordedTones.push({ note, duration: "8n", timing: time });
            console.log(recordedTones)
        };
        
    });

    Bflat4.addEventListener('click', function () {
        const now = Tone.now();
        synth.triggerAttackRelease("a#4", "8n", now);
        if (!Stop_Button.disabled) {
            note = "Bb4";
            time = Date.now() - prev
            time = time/1000
            time = Number(time)
    
            recordedTones.push({ note, duration: "8n", timing: time });
            console.log(recordedTones)
        };
        
    });

    B4.addEventListener('click', function () {
        const now = Tone.now();
        synth.triggerAttackRelease("b4", "8n", now);
        if (!Stop_Button.disabled) {
            note = "B4";
            time = Date.now() - prev
            time = time/1000
            time = Number(time)
    
            recordedTones.push({ note, duration: "8n", timing: time });
            console.log(recordedTones)
        };
        
    });

    C5.addEventListener('click', function () {
        const now = Tone.now();
        synth.triggerAttackRelease("c5", "8n", now);
        if (!Stop_Button.disabled) {
            note = "C5";
            time = Date.now() - prev
            time = time/1000
            time = Number(time)
    
            recordedTones.push({ note, duration: "8n", timing: time });
            console.log(recordedTones)
        };
        
    });

    Csharp5.addEventListener('click', function () {
        const now = Tone.now();
        synth.triggerAttackRelease("c#5", "8n", now);
        if (!Stop_Button.disabled) {
            note = "C#5";
            time = Date.now() - prev
            time = time/1000
            time = Number(time)
    
            recordedTones.push({ note, duration: "8n", timing: time });
            console.log(recordedTones)
        };
        
    });

    D5.addEventListener('click', function () {
        const now = Tone.now();
        synth.triggerAttackRelease("d5", "8n", now);
        if (!Stop_Button.disabled) {
            note = "D5";
            time = Date.now() - prev
            time = time/1000
            time = Number(time)
    
            recordedTones.push({ note, duration: "8n", timing: time });
            console.log(recordedTones)
        };
        
    });

    Dsharp5.addEventListener('click', function () {
        const now = Tone.now();
        synth.triggerAttackRelease("d#5", "8n", now);
        if (!Stop_Button.disabled) {
            note = "D#5";
            time = Date.now() - prev
            time = time/1000
            time = Number(time)
    
            recordedTones.push({ note, duration: "8n", timing: time });
            console.log(recordedTones)
        };
        
    });

    E5.addEventListener('click', function () {
        const now = Tone.now();
        synth.triggerAttackRelease("e5", "8n", now);
        if (!Stop_Button.disabled) {
            note = "E5";
            time = Date.now() - prev
            time = time/1000
            time = Number(time)
    
            recordedTones.push({ note, duration: "8n", timing: time });
            console.log(recordedTones)
        };
        
    });

 
  //Keyboard press tones.
  // When a key is pressed on the keyboard, the respective eventlistener is triggered and a synth note is produced.
  // In addition, if recording is in progress, the timing is calculated and saved. The note is then pushed into the recordedTones array.
document.addEventListener('keydown', function(event){

    if (event.key === 'a' || event.key === 'A') {
        const now = Tone.now();
        synth.triggerAttackRelease('c4','8n', now)
        note = "C4"
    }; 

    if (event.key === 'w' || event.key === 'W') {
        const now = Tone.now();
        synth.triggerAttackRelease('c#4','8n', now)
        note = "C#4"
    }; 

    if (event.key === 's' || event.key === 'S') {
        const now = Tone.now();
        synth.triggerAttackRelease('d4','8n', now)
        note = "D4"
    }; 

    if (event.key === 'e' || event.key === 'E') {
        const now = Tone.now();
        synth.triggerAttackRelease('d#4','8n', now)
        note = "D#4"
    }; 

    if (event.key === 'd' || event.key === 'D') {
        const now = Tone.now();
        synth.triggerAttackRelease('e4','8n', now)
        note = "E4"
    }; 

    if (event.key === 'f' || event.key === 'F') {
        const now = Tone.now();
        synth.triggerAttackRelease('f4','8n', now)
        note = "F4"
    }; 

    if (event.key === 't' || event.key === 'T') {
        const now = Tone.now();
        synth.triggerAttackRelease('f#4','8n', now)
        note = "F#4"
    }; 

    if (event.key === 'g' || event.key === 'G') {
        const now = Tone.now();
        synth.triggerAttackRelease('g4','8n', now)
        note = "G4"
    }; 

    if (event.key === 'y' || event.key === 'Y') {
        const now = Tone.now();
        synth.triggerAttackRelease('g#4','8n', now)
        note = "G#4"
    }; 

    if (event.key === 'h' || event.key === 'H') {
        const now = Tone.now();
        synth.triggerAttackRelease('a4','8n', now)
        note = "A4"
    }; 

    if (event.key === 'u' || event.key === 'U') {
        const now = Tone.now();
        synth.triggerAttackRelease('a#4','8n', now)
        note = "Bb4"
    }; 

    if (event.key === 'j' || event.key === 'J') {
        const now = Tone.now();
        synth.triggerAttackRelease('b4','8n', now)
        note = "B4"
    }; 

    if (event.key === 'k' || event.key === 'K') {
        const now = Tone.now();
        synth.triggerAttackRelease('c5','8n', now)
        note = "C5"
    }; 

    if (event.key === 'o' || event.key === 'O') {
        const now = Tone.now();
        synth.triggerAttackRelease('c#5','8n', now)
        note = "C#5"
    }; 

    if (event.key === 'l' || event.key === 'L') {
        const now = Tone.now();
        synth.triggerAttackRelease('d5','8n', now)
        note = "D5"
    }; 

    if (event.key === 'p' || event.key === 'P') {
        const now = Tone.now();
        synth.triggerAttackRelease('d#5','8n', now)
        note = "D#5"
    }; 

    if (event.key === ',' || event.key === ';') {
        const now = Tone.now();
        synth.triggerAttackRelease('e5','8n', now)
        note = "E5"
    }; 

    if (!Stop_Button.disabled) {
        time = Date.now() - prev
        time = time/1000
        time = Number(time)

        recordedTones.push({ note, duration: "8n", timing: time });
        console.log(recordedTones)
    };

}


)}

     );