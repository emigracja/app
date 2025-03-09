import { create } from "zustand";
// import { useRouter } from "next/router";
// import { useEffect } from "react";

export interface State {
  currentPath: string;
  setPath: (path: string) => void;
}

const useStore = create<State>((set) => ({
  currentPath: "/",
  setPath: (path) => set({ currentPath: path }),
}));

// export const useSyncPath = () => {
//   const router = useRouter();
//   const setPath = useStore((state) => state.setPath);

//   useEffect(() => {
//     setPath(router.asPath);

//     const handleRouteChange = (url: string) => {
//       setPath(url);
//     };

//     router.events.on("routeChangeComplete", handleRouteChange);
//     return () => {
//       router.events.off("routeChangeComplete", handleRouteChange);
//     };
//   }, [router, setPath]);
// };

export default useStore;
