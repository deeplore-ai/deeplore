import { speechObserver } from "../observables/speechObserver";

let socket = new WebSocket(
  "wss://api.deepgram.com/v1/listen?language=fr&search=Emma%20Dubois&keywords=Emma&keywords=Dubois&keywords=Matthieu&keywords=Mancini&keywords=Manchini",
  ["token", "4cebb2572a5a31e8780f478ee7933df45c45a63d"]
);

setupSocket();

console.log({ socket });

socket.onopen = () => {
  console.log({ event: "onopen" });
};

socket.onerror = (error) => {
  console.log({ event: "onerror", error });
};

function setupSocket() {
  socket.onclose = () => {
    console.log({ event: "onclose" });
    socket = new WebSocket(
      "wss://api.deepgram.com/v1/listen?language=fr&search=Emma%20Dubois&keywords=Emma&keywords=Dubois&keywords=Matthieu&keywords=Mancini&keywords=Manchini",
      ["token", "4cebb2572a5a31e8780f478ee7933df45c45a63d"]
    );
    setupSocket();
  };
}

let mediaRecorder: MediaRecorder | null = null;

function createWebSocket() {
  if (socket.readyState === WebSocket.OPEN) {
    return socket;
  }
  socket = new WebSocket(
    "wss://api.deepgram.com/v1/listen?language=fr&search=Emma%20Dubois&keywords=Emma&keywords=Dubois&keywords=Matthieu&keywords"
  );
  return socket;
}

export function stopMediaRecorder() {
  mediaRecorder?.stop();
}

async function createMediaRecorder(onTranscript: (transcript: string) => void) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const socket = createWebSocket();

  mediaRecorder ??= new MediaRecorder(stream);

  socket.onmessage = (message) => {
    const received = JSON.parse(message.data);
    const transcript = (received.channel?.alternatives?.[0].transcript ??
      "") as string;
    if (transcript) {
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
}
