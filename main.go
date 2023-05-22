package main

import (
	"fmt"
	"io"
	"net/http"
	"os"
)

func upload(w http.ResponseWriter, r *http.Request) {
	var work_dir = "files"
	// 文件夹不存在就创建
	if _, err := os.Stat(work_dir); os.IsNotExist(err) {
		err := os.MkdirAll(work_dir, 0755)
		if err != nil {
			return
		}
	}
	// 从请求中获取文件
	file, header, err := r.FormFile("file")
	if err != nil {
		fmt.Println(err)
		return
	}
	defer file.Close()

	// 创建一个新文件
	newFile, err := os.Create(work_dir + "/" + header.Filename)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer newFile.Close()

	// 将上传的文件内容复制到新文件中
	_, err = io.Copy(newFile, file)
	if err != nil {
		fmt.Println(err)
		return
	}

	// 返回上传成功的信息
	fmt.Fprintf(w, "文件上传成功")
}

func main() {
	http.Handle("/", http.StripPrefix("/", http.FileServer(http.Dir("page/"))))
	http.Handle("/files/", http.StripPrefix("/files", http.FileServer(http.Dir("files/"))))
	http.HandleFunc("/upload", upload)
	server := http.Server{Addr: ":8080"}
	server.ListenAndServe()
}
