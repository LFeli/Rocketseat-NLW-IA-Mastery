import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { FileVideo, Upload } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import { getFFmpeg } from "@/lib/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export function VideoInputForm () {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  function handleFileSelected(event: ChangeEvent<HTMLInputElement>){
    const { files } = event.currentTarget
  
    if(!files) {
      return
    }

    const selectedFile = files.item(0)

    setVideoFile(selectedFile)
  }

  async function convertVideoToAudio(video: File){
    console.log('Converte started')

    const ffmpeg = await getFFmpeg()

    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    // Debug for log 
    // ffmpeg.on('log', log => {
    //   console.log(log)
    // })

    ffmpeg.on('progress', progress => {
      console.log('Convert progress: ' + Math.round(progress.progress * 100))
    })

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3'
    ])

    const data = await ffmpeg.readFile('output.mp3')

    const audioFileBlob = new Blob([data], { type: 'audio/mp3' })
    const audioFile = new File([audioFileBlob], 'output.mp3', {
      type: 'audio/mpeg'
    })

    console.log('Convert finished.')

    return audioFile
  }

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const prompt = promptInputRef.current?.value

    if(!videoFile){
      return
    }

    const audioFile = await convertVideoToAudio(videoFile)

    console.log(audioFile)
  }

  const previewURL = useMemo(() => {
    if(!videoFile){
      return
    }

    return URL.createObjectURL(videoFile)
  }, [videoFile])



  return (
    <form className="space-y-6" onSubmit={handleUploadVideo}>
    <label  
      htmlFor="video"
      className="relative border flex rounded-md aspect-video cursor-pointer border-dashed text-sm flex-col gap-2 items-center justify-center text-muted-foreground hover:bg-primary-foreground/5"
    >
      {previewURL ? (
        <video src={previewURL} controls={false} className="pointer-events-none absolute inset-0" />
      ) : (
      <>
        <FileVideo className="w-4 h-4"/>
        Selecione um vídeo
      </>
      )}
    </label>

    <input type="file" id="video" accept="video/mp4" className="sr-only" onChange={handleFileSelected}/>

    <Separator />

    <div className="space-y-2">
      <Label htmlFor="transcription-prompt">Prompt de descrição</Label>
      <Textarea 
        id="transcription-prompt" 
        ref={promptInputRef}
        className=" h-20 leading-relaxed resize-none"
        placeholder="Inclua palavras-chaves mencionadas no vídeo separadas por vírgula (,)"
      />
    </div>

    <Button className="w-full" type="submit">
      Carregar vídeo
      <Upload className="w-4 h-4 ml-2"/>
    </Button>
  </form>
  )
}