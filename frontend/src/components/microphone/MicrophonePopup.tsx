"use client";
import mic from "../../../public/icons/mic.svg";
import Image from "next/image";
import {PuffLoader} from "react-spinners";
import {useState} from "react";

// TODO add recording functionality
// #### For now we will omit this functionality ####
interface Props {
    onClose: () => void;
}


const MicrophonePopup = ({onClose} : Props) => {

    const [isRecording, setRecording] = useState<boolean>(false);


    const toggleRecording = () => setRecording((prev) => {

        if (prev) {
            onClose();
        }

        return !prev
    });


    return (
        <section onClick={(e) => {
            if (
                e.target === e.currentTarget
            ){ onClose()}
        }} className="fixed flex align-center justify-center w-screen h-screen bg-black/40 z-1 top-0">
            <section className="flex align-center justify-center bg-white p-2 h-50 rounded-[30%] w-50 m-auto">
                <button onClick={toggleRecording} className="relative flex align-center justify-center rounded-[50%] active:bg-black/5 w-full h-full p-5">
                    <Image src={mic} alt={"mic"} height={80} width={80} />
                    <div className="absolute opacity-50">
                        <PuffLoader
                            color={"black"}
                            size={150}
                            loading={isRecording}/>
                    </div>
                </button>
            </section>
        </section>
    )
};

export default MicrophonePopup;