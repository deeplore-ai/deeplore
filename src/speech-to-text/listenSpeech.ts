import { speechObserver } from "../observables/speechObserver";

const socket = new WebSocket("wss://api.deepgram.com/v1/listen?language=fr", [
  "token",
  "4cebb2572a5a31e8780f478ee7933df45c45a63d",
]);

console.log({ socket });

socket.onopen = () => {
  console.log({ event: "onopen" });
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

async function createMediaRecorder(onTranscript: (transcript: string) => void) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  mediaRecorder ??= new MediaRecorder(stream);

  socket.onmessage = (message) => {
    const received = JSON.parse(message.data);
    const transcript = received.channel.alternatives[0].transcript as string;
    if (transcript && received.is_final) {
      onTranscript(transcript);
      console.log(transcript);
    }
  };

  mediaRecorder.ondataavailable = (e) => {
    console.log("Socket", socket.readyState);
    if (socket.readyState === WebSocket.OPEN) {
      console.log("sending data", e.data);
      socket.send(e.data);
    } else {
      console.log("socket not open", socket.readyState);
    }
  };
  return mediaRecorder;
}

export async function listenSpeech() {
  if (window.location.host.startsWith("localhost")) {
    console.log("Speech to text not working on localhost.");
    return;
  }

  try {
    const mediaRecorder = await createMediaRecorder((transcript) =>
      speechObserver.emit("speech", transcript)
    );

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
