<template>
  <!-- eslint-disable max-len -->
  <!-- eslint-disable-line -->
  <div class="bg-white rounded border border-gray-200 relative flex flex-col">
    <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
      <span class="card-title">Upload</span>
      <i class="fas fa-upload float-right text-green-400 text-2xl"></i>
    </div>
    <div class="p-6">
      <!-- Upload Dropbox -->
      <div
        class="w-full px-10 py-20 rounded text-center cursor-pointer border border-dashed border-gray-400 text-gray-400 transition duration-500 hover:text-white hover:bg-green-400 hover:border-green-400 hover:border-solid"
        :class="{ 'bg-green-400 border-green-400 border-solid': is_dragOver }"
        @drag.prevent.stop=""
        @dragstart.prevent.stop=""
        @dragend.prevent.stop="is_dragOver = false"
        @dragover.prevent.stop="is_dragOver = true"
        @dragenter.prevent.stop="is_dragOver = true"
        @dragleave.prevent.stop="is_dragOver = false"
        @drop.prevent.stop="upload($event)"
      >
        <h5>Drop your files here</h5>
      </div>
      <input type="file" multiple @change="upload($event)" />
      <hr class="my-6" />
      <!-- Progess Bars -->
      <div class="mb-4" v-for="uploadFile in uploadFiles" :key="uploadFile.name">
        <!-- File Name -->
        <div class="font-bold text-sm" :class="uploadFile.text_class"><i :class="uploadFile.icon"></i>{{ " " + uploadFile.name }}</div>
        <div class="flex h-4 overflow-hidden bg-gray-200 rounded">
          <!-- Inner Progress Bar -->
          <div class="transition-all progress-bar" :class="uploadFile.variant" :style="{ width: uploadFile.current_progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/*eslint-disable*/
import { storage, auth, db, collection, addDoc } from "@/includes/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

export default {
  name: "Upload",
  data() {
    return {
      is_dragOver: false,
      uploadFiles: [],
    };
  },
  methods: {
    upload($event) {
      this.is_dragOver = false;

      const files = $event.dataTransfer ? [...$event.dataTransfer.files] : [...$event.target.files]; // converting object into arrayish
      console.log(files);
      files.forEach((file) => {
        if (file.type !== "audio/mpeg") {
          console.log("file do not match");
          return;
        }

        const childRef = ref(storage, `songs/${file.name}`);
        const uploadTask = uploadBytesResumable(childRef, file);

        const uploadIndex =
          this.uploadFiles.push({
            uploadTask,
            current_progress: 0,
            name: file.name,
            variant: "bg-blue-400",
            icon: "fas fa-spinner fa-spin",
            text_class: "",
          }) - 1;

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
            this.uploadFiles[uploadIndex].current_progress = progress;
          },
          (error) => {
            this.uploadFiles[uploadIndex].variant = "bg-red-400";
            this.uploadFiles[uploadIndex].icon = "fa fa-times";
            this.uploadFiles[uploadIndex].text_class = "text-red-400";
            console.log(error);
          },
          async () => {
            const song = {
              uid: auth.currentUser.uid,
              display_name: auth.currentUser.displayName,
              original_name: uploadTask.snapshot.ref.name,
              modified_name: uploadTask.snapshot.ref.name,
              genre: "",
              comment_count: 0,
            };

            song.url = await getDownloadURL(uploadTask.snapshot.ref);

            console.log(song.url);

            // upload song
            await addDoc(collection(db, "songs"), { ...song });

            this.uploadFiles[uploadIndex].variant = "bg-green-400";
            this.uploadFiles[uploadIndex].icon = "fa fa-check";
            this.uploadFiles[uploadIndex].text_class = "text-green-400";
            console.log("success");
          }
        );
      });
    },
  },
};
</script>
