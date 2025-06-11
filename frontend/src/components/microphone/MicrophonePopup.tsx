"use client";
import mic from "../../../public/icons/mic.svg";
import Image from "next/image";
import { PuffLoader } from "react-spinners";
import { useState, useEffect, useRef } from "react";
import MicRecorder from "mic-recorder-to-mp3";
import axiosInstance from "@/utils/axios";
import axios from "axios";

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

            recorderRef.current.stop().getMp3()
                .then(async ([buffer, blob]) => {
                    const fileName = `recording-${new Date().toISOString()}.mp3`;
                    const mp3File = new File([blob], fileName, {
                        type: blob.type,
                        lastModified: Date.now()
                    });

                    // Send the MP3 file to the backend
                    await sendToTranscribeEndpoint(mp3File);

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

            const response = await axiosInstance.post("/ai/transcribe", formData);

            const transcription = response.data.transcription;
            onTranscriptionComplete(transcription || "Could not parse transcription.");

        } catch (uploadError) {
            if (axios.isAxiosError(uploadError) && uploadError.response) {
                console.error("Error response from server:", uploadError.response.data);
            } else {
                console.error("Error uploading file:", uploadError);
            }
            onTranscriptionComplete("Error: Transcription failed.");
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