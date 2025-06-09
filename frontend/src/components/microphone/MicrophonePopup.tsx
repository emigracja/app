"use client";
import mic from "../../../public/icons/mic.svg";
import Image from "next/image";
import { PuffLoader } from "react-spinners";
import { useState, useEffect, useRef } from "react";
import MicRecorder from "mic-recorder-to-mp3";

interface Props {
    onClose: () => void;
    onTranscriptionComplete: (text: string) => void;
}

const MicrophonePopup = ({ onClose, onTranscriptionComplete }: Props) => {
    const [isRecording, setIsRecording] = useState<boolean>(false);

    const recorderRef = useRef<MicRecorder | null>(null);

    useEffect(() => {
        const recorder = new MicRecorder({ bitrate: 128 });
        recorderRef.current = recorder;
    }, []);

    const startRecording = () => {
        if (recorderRef.current) {
            recorderRef.current.start()
                .then(() => {
                    setIsRecording(true);
                })
                .catch((e) => {
                    console.error("Error starting recording:", e);
                });
        }
    };

    const stopRecording = () => {
        if (recorderRef.current) {
            setIsRecording(false);

            // The .then() block can be async to allow for 'await'
            recorderRef.current.stop().getMp3()
                .then(async ([buffer, blob]) => {
                    const fileName = `recording-${new Date().toISOString()}.mp3`;
                    const mp3File = new File([blob], fileName, {
                        type: blob.type,
                        lastModified: Date.now()
                    });

                    // Send the MP3 file to the backend and wait for it to finish
                    await sendToTranscribeEndpoint(mp3File);

                    // Close the popup *after* the upload process has been initiated
                    onClose();
                })
                .catch((e) => {
                    console.error("Error stopping recording or getting MP3:", e);
                    onClose();
                });
        }
    };

    const sendToTranscribeEndpoint = async (file: File) => {
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:8080/ai/transcribe", {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`HTTP error! Status: ${response.status} - ${errorBody}`);
            }

            const result = await response.json();
            onTranscriptionComplete(result.transcription || "Could not parse transcription.");
        } catch (uploadError) {
            console.error("Error uploading file:", uploadError);
        }
    };

    return (
        <section
            onClick={(e) => e.target === e.currentTarget && onClose()}
            className="fixed flex flex-col items-center justify-center w-screen h-screen bg-black/40 z-10 top-0 left-0"
        >
            <section className="flex flex-col items-center justify-center bg-white p-2 h-52 w-52 rounded-[30%] m-auto">
                <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className="relative flex items-center justify-center rounded-[50%] active:bg-black/5 w-full h-full p-5"
                >
                    <Image src={mic} alt={"mic"} height={80} width={80} />
                    <div className="absolute opacity-50">
                        <PuffLoader color={"black"} size={150} loading={isRecording} />
                    </div>
                </button>
            </section>
        </section>
    );
};

export default MicrophonePopup;