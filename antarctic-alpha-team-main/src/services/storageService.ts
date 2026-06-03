import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '@/firebase/config'

export const uploadFile = async (file: File, path: string): Promise<{ url: string; fileName: string }> => {
    const fileRef = ref(storage, path)
    const snapshot = await uploadBytes(fileRef, file)
    const url = await getDownloadURL(snapshot.ref)
    return { url, fileName: file.name }
}

export const deleteFile = async (url: string): Promise<void> => {
    const fileRef = ref(storage, url)
    await deleteObject(fileRef)
}
