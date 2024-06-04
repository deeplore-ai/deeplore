import { speechObserver } from "../observables/speechObserver";

// let socket = new WebSocket(
//   "wss://api.deepgram.com/v1/listen?language=fr&search=Emma%20Dubois&keywords=Emma&keywords=Dubois&keywords=Matthieu&keywords=Mancini&keywords=Manchini",
//   ["token", "4cebb2572a5a31e8780f478ee7933df45c45a63d"]
// );

// setupSocket();

// function setupSocket() {
//   socket.onclose = () => {
//     socket = new WebSocket(
//       "wss://api.deepgram.com/v1/listen?language=fr&search=Emma%20Dubois&keywords=Emma&keywords=Dubois&keywords=Matthieu&keywords=Mancini&keywords=Manchini",
//       ["token", "4cebb2572a5a31e8780f478ee7933df45c45a63d"]
//     );
//     setupSocket();
//   };
// }

let mediaRecorder: MediaRecorder | null = null;

// function createWebSocket() {
//   if (socket.readyState === WebSocket.OPEN) {
//     return socket;
//   }
//   socket = new WebSocket(
//     "wss://api.deepgram.com/v1/listen?language=fr&search=Emma%20Dubois&keywords=Emma&keywords=Dubois&keywords=Matthieu&keywords"
//   );
//   return socket;
// }

export function stopMediaRecorder() {
  mediaRecorder?.stop();
}

// async function createMediaRecorder(onTranscript: (transcript: string) => void) {
//   const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//   const socket = createWebSocket();

//   mediaRecorder ??= new MediaRecorder(stream);

//   socket.onmessage = (message) => {
//     const received = JSON.parse(message.data);
//     const transcript = (received.channel?.alternatives?.[0].transcript ??
//       "") as string;
//     if (transcript) {
//       onTranscript(transcript);
//     }
//   };

//   mediaRecorder.ondataavailable = (e) => {
//     if (socket.readyState === WebSocket.OPEN) {
//       socket.send(e.data);
//     } else {
//       // console.log("socket not open", socket.readyState);
//     }
//   };
//   return mediaRecorder;
// }

export async function listenSpeech() {
  // if (window.location.host.startsWith("localhost")) {
  //   console.log("Speech to text not working on localhost.");
  //   return;
  // }
  // try {
  //   const mediaRecorder = await createMediaRecorder((transcript) =>
  //     speechObserver.emit("speech", transcript)
  //   );
  //   mediaRecorder.start(100);
  //   mediaRecorder.onstop = () => {
  //     console.log("recorder stopped");
  //   };
  // } catch (error) {
  //   console.error(error);
  // }
}
