<template>
  <!-- eslint-disable max-len -->

  <!-- Music Header -->
  <section class="w-full mb-8 py-14 text-center text-white relative">
    <div class="absolute inset-0 w-full h-full box-border bg-contain music-bg" style="background-image: url(/assets/img/song-header.png)"></div>
    <div class="container mx-auto flex items-center">
      <!-- Play/Pause Button -->
      <button type="button" class="z-50 h-24 w-24 text-3xl bg-white text-black rounded-full focus:outline-none" @click.prevent="playSong(song)">
        <i class="fas fa-play"></i>
      </button>
      <div class="z-50 text-left ml-8">
        <!-- Song Info -->
        <div class="text-3xl font-bold">{{ song.modified_name }}</div>
        <div>{{ song.genre }}</div>
      </div>
    </div>
  </section>
  <!-- Form -->
  <section class="container mx-auto mt-6">
    <div class="bg-white rounded border border-gray-200 relative flex flex-col">
      <div class="px-6 pt-6 pb-5 font-bold border-b border-gray-200">
        <!-- Comment Count -->
        <span class="card-title">Comments ({{ song.comment_count }})</span>
        <i class="fa fa-comments float-right text-green-400 text-2xl"></i>
      </div>
      <div class="p-6">
        <div class="text-white text-center font-bold p-5 mb-4" v-if="comment_show_alert" :class="comment_alert_variant">
          {{ comment_alert_message }}
        </div>
        <vee-form :validation-schema="schema" @submit="addComment" v-if="userLoggedIn">
          <vee-field
            as="textarea"
            name="comment"
            class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded mb-4"
            placeholder="Your comment here..."
          ></vee-field>
          <ErrorMessage class="text-red-600" name="comment" />
          <button type="submit" class="py-1.5 px-3 rounded text-white bg-green-600 block" :disabled="comment_in_submission">Submit</button>
        </vee-form>
        <!-- Sort Comments -->
        <select v-model="sort" class="block mt-4 py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded">
          <option value="1">Latest</option>
          <option value="2">Oldest</option>
        </select>
      </div>
    </div>
  </section>
  <!-- Comments -->
  <ul class="container mx-auto">
    <li class="p-6 bg-gray-50 border border-gray-200" v-for="comment in sortedComment" :key="comment.docID">
      <!-- Comment Author -->
      <div class="mb-5">
        <div class="font-bold">{{ comment.name }}</div>
        <time>{{ comment.datePosted }}</time>
      </div>

      <p>{{ comment.content }}</p>
    </li>
  </ul>
</template>

<script>
/*eslint-disable*/
import { doc, getDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import { auth, db, collection, addDoc } from "@/includes/firebase";
import { mapState, mapActions } from "vuex";

export default {
  name: "Song",
  data() {
    return {
      song: {},
      songComments: [],
      sort: "1",
      schema: {
        comment: "required|min:3",
      },
      comment_in_submission: false,
      comment_show_alert: false,
      comment_alert_variant: "bg-blue-500",
      comment_alert_message: "Please wait! Your comment is being submitted",
    };
  },
  computed: {
    ...mapState(["userLoggedIn"]),
    sortedComment() {
      return this.songComments.slice().sort((a, b) => {
        if (this.sort === "1") {
          return new Date(b.datePosted) - new Date(a.datePosted);
        }
        return new Date(a.datePosted) - new Date(b.datePosted);
      });
    },
  },
  async created() {
    const songId = this.$route.params.id;

    // create songReference
    const songRef = doc(db, "songs", songId);
    // get song from api
    const songSnap = await getDoc(songRef);

    // redirect to home if song doesn't exist
    if (!songSnap.exists()) {
      this.$router.push({ name: "home" });
      return;
    }
    // assign result data
    this.song = songSnap.data();

    const { sort } = this.$route.query;
    this.sort = sort === "1" || sort === "2" ? sort : "1";
    // fetch the comments of song
    this.getComment(songId);
  },
  methods: {
    ...mapActions(["playSong"]),
    async addComment(values, { resetForm }) {
      // console.log(values);
      this.comment_in_submission = true;
      this.comment_show_alert = true;
      this.comment_alert_variant = "bg-blue-500";
      this.comment_alert_message = "Please wait! Your comment is being submitted";

      // create comment object
      const comment = {
        content: values.comment,
        datePosted: new Date().toString(),
        sid: this.$route.params.id,
        name: auth.currentUser.displayName,
        uid: auth.currentUser.uid,
      };

      // uplod comment
      const commentRef = await addDoc(collection(db, "comments"), { ...comment });
      // console.log("Document written with ID: ", commentRef.id);

      // update the comment count of song
      this.song.comment_count += 1;
      const songnRef = doc(db, "songs", this.$route.params.id);
      await updateDoc(songnRef, {
        comment_count: this.song.comment_count,
      });

      const freshComment = {
        ...comment,
        docID: commentRef.id,
      };

      this.songComments.push(freshComment);

      // show the success message
      this.comment_in_submission = false;
      this.comment_alert_variant = "bg-green-500";
      this.comment_alert_message = "Comment added";

      // make input field empty after submittion
      resetForm();
    },
    async getComment(songId) {
      try {
        // create query
        const q = query(collection(db, "comments"), where("sid", "==", songId));
        // execute query
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const comment = {
            ...doc.data(),
            docID: doc.id,
          };
          this.songComments.push(comment);
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  watch: {
    sort(newValue) {
      if (newValue === this.$route.query.sort) {
        return;
      }

      this.$router.push({
        query: {
          sort: newValue,
        },
      });
    },
  },
};
</script>
