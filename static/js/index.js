let app = Vue.createApp({
    data() {
        return {
            song: true,
            artist: true, 
            submit: false,
            submitTitle: ''
        }
    },
    methods: {
        searchBySong() {
            this.song = !this.song;
            if (!this.song && !this.artist) {
                this.submit = true;
                this.submitTitle = 'Please choose a search criteria';
            } else {
                this.submit = false;
            }
        },
        searchByArtist() {
            this.artist = !this.artist;
            if (!this.song && !this.artist) {
                this.submit = true;
                this.submitTitle = 'Please choose a search criteria';
            } else {
                this.submit = false;
            }
        }
    }
}).mount("#search form");