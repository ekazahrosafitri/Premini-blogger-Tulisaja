import { cn } from "@/lib/utils"

export default function Loading({text, light}: {text: string, light?: boolean}) {
    return (<div className={`z-[999] top-0 left-0 w-screen h-screen flex gap-x-4 ${light ? "bg-gray-100 text-gray-900" : "bg-gray-950 text-gray-100"} justify-center items-center text-2xl`}>
         <LoadingCircle/> {text}
      </div>)
}

export function LoadingText({text, light}: {text: string, light?: boolean}) {
  return (<div className={`flex ${light ? "text-gray-900" : " text-gray-100"} gap-x-4 justify-center items-center w-full text-md`}>
    <LoadingCircle className="border-t-slate-100"/> {text}
 </div>)
}

export function LoadingCircle({className}: {className?: string}) {
  return <div className={cn("w-6 h-6 border-4 border-blue-500 rounded-full animate-spin border-t-slate-100", className)}></div>
}