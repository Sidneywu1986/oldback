import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, Upload, ImageIcon } from "lucide-react";

interface FileUploadProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMB?: number;
  value?: string[];
  onChange?: (urls: string[]) => void;
  label?: string;
}

interface UploadingFile {
  file: File;
  progress: number;
  url?: string;
  error?: string;
}

export function FileUpload({
  accept = ".jpg,.jpeg,.png,.webp",
  multiple = false,
  maxFiles = 5,
  maxSizeMB = 5,
  value = [],
  onChange,
  label = "上传文件",
}: FileUploadProps) {
  const [uploading, setUploading] = useState<UploadingFile[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/v1/upload");
      Object.entries(headers).forEach(([k, v]) => xhr.setRequestHeader(k, v));

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploading((prev) =>
            prev.map((u) => (u.file === file ? { ...u, progress } : u))
          );
        }
      };

      xhr.onload = () => {
        const json = JSON.parse(xhr.responseText);
        if (json.code === 200) {
          resolve(json.data.url);
        } else {
          reject(new Error(json.message || "上传失败"));
        }
      };

      xhr.onerror = () => reject(new Error("网络错误"));
      xhr.send(formData);
    });
  }, []);

  const handleFiles = useCallback(
    async (files: FileList | File[]) => {
      const fileList = Array.from(files);

      if (!multiple && fileList.length > 1) {
        fileList.splice(1);
      }

      if (value.length + fileList.length > maxFiles) {
        alert(`最多上传 ${maxFiles} 个文件`);
        return;
      }

      const oversized = fileList.find((f) => f.size > maxSizeMB * 1024 * 1024);
      if (oversized) {
        alert(`文件大小不能超过 ${maxSizeMB}MB`);
        return;
      }

      const newUploading: UploadingFile[] = fileList.map((f) => ({
        file: f,
        progress: 0,
      }));
      setUploading((prev) => [...prev, ...newUploading]);

      const urls = [...value];
      for (const uf of newUploading) {
        try {
          const url = await uploadFile(uf.file);
          urls.push(url);
          onChange?.(urls);
          setUploading((prev) =>
            prev.map((u) =>
              u.file === uf.file ? { ...u, progress: 100, url } : u
            )
          );
        } catch (err: any) {
          setUploading((prev) =>
            prev.map((u) =>
              u.file === uf.file ? { ...u, error: err.message } : u
            )
          );
        }
      }

      setTimeout(() => {
        setUploading((prev) => prev.filter((u) => !u.url && !u.error));
      }, 2000);
    },
    [multiple, maxFiles, maxSizeMB, value, onChange, uploadFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const removeFile = useCallback(
    (index: number) => {
      const newUrls = value.filter((_, i) => i !== index);
      onChange?.(newUrls);
    },
    [value, onChange]
  );

  const imgSrc = (url: string) => {
    if (url.startsWith("http")) return url;
    return `${import.meta.env.VITE_API_BASE || ""}/..${url}`;
  };

  return (
    <div className="space-y-3">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          dragOver
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          拖拽文件到此处，或 <span className="text-blue-600 font-medium">点击上传</span>
        </p>
        <p className="text-xs text-gray-400 mt-1">
          支持 JPG、PNG、WEBP，单个文件不超过 {maxSizeMB}MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((u, i) => (
            <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
              <ImageIcon className="h-4 w-4 text-gray-400 shrink-0" />
              <span className="text-sm text-gray-600 truncate flex-1">{u.file.name}</span>
              {u.error ? (
                <span className="text-xs text-red-500">{u.error}</span>
              ) : u.url ? (
                <span className="text-xs text-green-600">✓ 完成</span>
              ) : (
                <Progress value={u.progress} className="w-20 h-2" />
              )}
            </div>
          ))}
        </div>
      )}

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((url, i) => (
            <div key={i} className="relative group">
              <img
                src={imgSrc(url)}
                alt={`已上传 ${i + 1}`}
                className="w-20 h-20 object-cover rounded border border-gray-200"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
