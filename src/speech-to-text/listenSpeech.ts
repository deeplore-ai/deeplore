const socket = new WebSocket("ws://api.deepgram.com/v1/listen", [
  "token",
  "4cebb2572a5a31e8780f478ee7933df45c45a63d",
]);

console.log({ socket });

socket.onopen = () => {
  console.log({ event: "onopen" });
};

socket.onmessage = (message) => {
  console.log({ event: "onmessage", message });
};

socket.onclose = () => {
  console.log({ event: "onclose" });
};

socket.onerror = (error) => {
  console.log({ event: "onerror", error });
};

let mediaRecorder: MediaRecorder | null = null;

// const connection = deepgram.listen.live({
//   model: "nova-2",
//   language: "fr-FR",
//   smart_format: true,
// });

// connection.on(LiveTranscriptionEvents.Open, () => {
//   connection.on(LiveTranscriptionEvents.Close, () => {
//     console.log("Connection closed.");
//   });

//   connection.on(LiveTranscriptionEvents.Transcript, (data) => {
//     console.log(data.channel.alternatives[0].transcript);
//   });

//   connection.on(LiveTranscriptionEvents.Metadata, (data) => {
//     console.log(data);
//   });

//   connection.on(LiveTranscriptionEvents.Error, (err) => {
//     console.error(err);
//   });
// });

// STEP 4: Fetch the audio stream and send it to the live transcription connection
async function createMediaRecorder() {
  if (mediaRecorder) {
    return mediaRecorder;
  }
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  mediaRecorder.ondataavailable = (e) => {
    console.log(e.data);
    //  socket.send(e.data);
  };
  return mediaRecorder;
}

export async function listenSpeech() {
  console.log("LISTENING");

  try {
    const mediaRecorder = await createMediaRecorder();

    mediaRecorder.start(100);
    console.log(mediaRecorder.state);
    console.log("recorder started");

    mediaRecorder.onstop = () => {
      console.log("recorder stopped");
    };
  } catch (error) {
    console.error(error);
  }
  //   record.style.background = "red";
  //   record.style.color = "black";
}
