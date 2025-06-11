"use client"
import Image from "next/image";
import send from "../../../public/icons/send.svg";
import mic from "../../../public/icons/mic.svg";
import React from "react";
import {RiseLoader} from "react-spinners";
import MicrophonePopup from "@/components/microphone/MicrophonePopup";
import axiosInstance from "@/utils/axios";
import axios from "axios";


const AiPage = () => {

    const [isRecordingOpen, setRecordingOpen] = React.useState<boolean>(false);
    const [isSending, setSending] = React.useState<boolean>(false);
    const [text, setText] = React.useState<string>("");

    const sendRequest = () => {
        setSending(true);
        if (text.trim() === "") {
            console.error("Text input is empty");
            setSending(false);
            return;
        }
        parse(text);
    }

    const parse = async (text: string) => {
        const formData = new FormData();
        formData.append("file", text);

        try {
            const body = new URLSearchParams();
            body.append('text', text);

            const response = await axiosInstance.post(
                "/ai/parse",
                body,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            const parsed = response.data.data.intent;
            console.log("Parsed intent:", parsed);
            location.pathname = `/${parsed}`;

        } catch (uploadError) {
            if (axios.isAxiosError(uploadError) && uploadError.response) {
                console.error("Error response from server:", uploadError.response.data);
            } else {
                console.error("Error parsing:", uploadError);
            }
        }
    }

    const closeRecordingPopUp = () => {
        setRecordingOpen(false);
    }

    const openRecordingPopUp = () => {
        setRecordingOpen(true);
    }

    return (
        <>
            <section className="flex flex-col w-full h-full align-center p-4 gap-4">
                <section className="text-md text-white">
                    This section allows you to use AI powered search to find the information you need.
                </section>
                <div className="flex w-full h-70 p-2 flex-col bg-white/90 rounded-md box-border gap-1">
                    <textarea
                        placeholder="Search..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="resize-none h-60 p-1"
                    />
                    <section className="flex flex-row-reverse gap-1">
                        <button onClick={sendRequest} className="flex align-center jusitfy-center active:bg-black/5 rounded-xl p-1">
                            <Image src={send} alt="send"/>
                        </button>
                        <button onClick={openRecordingPopUp}  className="flex align-center jusitfy-center active:bg-black/5 rounded-xl p-1">
                            <Image src={mic} alt={"mic"}/>
                        </button>
                    </section>
                </div>
                <section className="flex w-full align-center justify-center m-auto">
                    <RiseLoader className="opacity-80" color={"white"} loading={isSending}/>
                </section>
            </section>
            {isRecordingOpen ?  <MicrophonePopup onTranscriptionComplete={parse} onClose={closeRecordingPopUp}/> : null}
        </>
    );
};

export default AiPage;