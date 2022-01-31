<template>
  <!-- eslint-disable max-len -->
  <section class="container mx-auto mt-6">
    <div class="md:grid md:grid-cols-3 md:gap-4">
      <div class="col-span-1">
        <app-upload ref="upload" :addSong="addSong" />
      </div>
      <div class="col-span-2">
        <div class="bg-white rounded border border-gray-200 relative flex flex-col">
          <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
            <span class="card-title">My Songs</span>
            <i class="fa fa-compact-disc float-right text-green-400 text-2xl"></i>
          </div>
          <div class="p-6">
            <!-- Composition Items -->
            <app-composition-item
              v-for="(song, i) in songList"
              :key="song.docID"
              :song="song"
              :updateSong="updateSong"
              :index="i"
              :removeSong="removeSong"
              :updateUnsavedFlag="updateUnsavedFlag"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
/*eslint-disable*/
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "@/includes/firebase";
import AppUpload from "@/components/Upload.vue";
import AppCompositionItem from "@/components/CompositionItems.vue";

export default {
  name: "manage",
  data() {
    return {
      songList: [],
      UnsavedFlag: false,
    };
  },
  components: {
    AppUpload,
    AppCompositionItem,
  },
  async created() {
    try {
      const q = query(collection(db, "songs"), where("uid", "==", auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const song = {
          ...doc.data(),
          docID: doc.id,
        };
        this.songList.push(song);
      });
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    updateSong(index, value) {
      this.songList[index].modified_name = value.modified_name;
      this.songList[index].genre = value.genre;
    },
    removeSong(i) {
      this.songList.splice(i, 1);
    },
    addSong(song) {
      this.songList.push(song);
    },
    updateUnsavedFlag(value) {
      this.unsavedFlag = value;
    },
  },
  beforeRouteLeave(to, from, next) {
    if (!this.unsavedFlag) {
      next();
    } else {
      const leave = confirm("You have unsaved changes. Are you sure you want to leave?");
      next(leave);
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   this.$refs.upload.cancleUpload();
  //   next();
  // },
};
</script>
