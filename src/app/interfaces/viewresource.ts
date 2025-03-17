export interface Resource {
    images: FileItem[];
    videos: FileItem[];
    documents: FileItem[];
    links:FileItem[]
}
  
export interface FileItem {
    type: string;
    url: string;
    name: string;
    sourcePath:string;
    page:string
}
  