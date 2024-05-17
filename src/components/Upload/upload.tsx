import React, {ChangeEvent, MouseEventHandler, useRef, useState} from 'react';
import Button, {ButtonType} from "../Button/button";
import uploadList from "./uploadList";
import axios from "axios";
import UploadList from "./uploadList";
export type UploadFileStatus='ready'|'uploading'|'success'|'error'
export interface UploadFile{
    uid:string
    size:number
    name:string
    status?:UploadFileStatus
    percent?:number
    raw?:File,
    response?:any
    error?:any,
}
export interface UploadProps {
    //服务器地址
    action: string
    //默认已经上传的文件
    defaultFileList?:UploadFile[]
    //生命周期钩子
    beforeUpload?: (file: File) => boolean | Promise<File>
    onProgress?: (percentage: number, file: File) => void
    onSuccess?: (data: any, file: File) => void
    onError?: (err: any, file: File) => void
    onChange?: (file: File) => void
    //用户点击删除文件时，触发的回调函数
    onRemove?:(file:UploadFile)=>void
}

const Upload = (props: UploadProps) => {
    const {
        action,
        defaultFileList,
        beforeUpload,
        onProgress,
        onSuccess,
        onError,
        onChange,
        onRemove
    } = props
    const fileInput = useRef<HTMLInputElement>(null)
    //用来存储所有的文件
    const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList||[]);
    const updateFileList = (updateFile: UploadFile, updateObj: Partial<UploadFile>) => {
        setFileList(prevList => {
            return prevList.map(file => {
                if (file.uid === updateFile.uid) {
                    return { ...file, ...updateObj }
                } else {
                    return file
                }
            })
        })
    }
    const handleClick = () => {
        //通过绑定在input上的ref,让button来执行input的click事件
        if (fileInput.current) {
            fileInput.current.click()
        }
    }
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) {
            return
        }
        uploadFiles(files)
        //将存储的文件清除 防止后续重复上传
        if (fileInput.current) {
            fileInput.current.value = ''
        }
    }
    const uploadFiles = (files: FileList) => {
        //这里的fileList是一个类数组
        const postFiles = Array.from(files)
        postFiles.forEach(file => {
            if (!beforeUpload) {
                post(file)
            } else {
                //用户可能需要用到下载的文件向后端发送请求 来判断是否合法  所以返回的结果可能是promise
                const result = beforeUpload(file)
                if (result && result instanceof Promise) {
                    console.log('trigger Promise')
                    result.then(processedFile => post(processedFile))
                } else if (result) {
                    post(file)
                }
            }
        })
    }
    const handleRemove = (file: UploadFile) => {
        setFileList((prevList) => {
            return prevList.filter(item => item.uid !== file.uid)
        })
        if (onRemove) {
            onRemove(file)
        }
    }
    //这里收到的file是每一个单独下载的文件
    const post = (file: File) => {
        let _file:UploadFile={
            uid:Date.now()+'upload-file',
            status:'ready',
            name:file.name,
            size:file.size,
            percent:0,
            raw:file
        }
        setFileList([_file,...fileList])
        const formData = new FormData()
        formData.append(file.name, file)
        axios.post(action, formData, {
            headers: {"Content-Type": 'multipart/form-data'},
            // 在 axios 中，onUploadProgress 是一个回调函数，
            // 用于监听文件上传的进度。当文件上传过程中发生进度变化时，
            // 该函数会被调用，并传入一个 ProgressEvent 对象作为参数 e。
            onUploadProgress:function (e){
                // @ts-ignore
                let percentage = Math.round((e.loaded * 100) / e.total)
                if (percentage <= 100) {
                    updateFileList(_file, { percent: percentage, status: 'uploading'})
                    if (onProgress) {
                        onProgress(percentage, file)
                    }
                }
            }
        }).then(res => {
            console.log(res.data)
            updateFileList(_file,{status:'success',response:res.data})
            console.log(fileList)
            if (onSuccess) {
                onSuccess(res.data, file)
            }
            if (onChange) {
                onChange(file)
            }
        }).catch(err => {
            console.log(err);
            updateFileList(_file,{status:'error',error:err})
            if (onError) {
                onError(err, file)
            }
            if (onChange) {
                onChange(file)
            }
        })
    }
    return (
        <div
            className='fish-upload-component'
        >
            <Button
                btnType={ButtonType.Primary}
                onClick={handleClick}
            >UploadFile</Button>
            <input
                multiple={true}
                className='fish-file-input'
                style={{display: 'none'}}
                ref={fileInput}
                onChange={handleFileChange}
                type="file"
            />
            <UploadList fileList={fileList} onRemove={handleRemove}/>
        </div>
    );
};
export default Upload;
