const express = require("express");
const spotifyWebApi = require("spotify-web-api-node");

const app = express();
const port = 3001;

app.use(express.static(`${__dirname}/static`));
app.set("view engine", "pug");

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

app.get("/results", (req, res) => {
    let spotifyApi = new spotifyWebApi({
        clientId: 'a553526c85c44cdc8014afc63da0891a',
        clientSecret: '2805f74937134f028fbfad4dc9952c56',
        redirectUri: 'https://example.com/callback',
    });
    spotifyApi.clientCredentialsGrant()
    .then(
        (data) => {
            spotifyApi.setAccessToken(data.body['access_token']);
            if (!req.query.song) {
                spotifyApi.searchArtists(req.query.artist.trim(), {limit: 1})
                .then((data) => {
                    if (data.body.artists.items.length === 0)
                    {
                        res.render("failure", {
                            artist: req.query.artist
                        });
                    }
                    else
                    {
                        const artist = {
                            name: data.body.artists.items[0].name,
                            image: data.body.artists.items[0].images[2].url,
                            uri: data.body.artists.items[0].uri
                        }
                        res.render("artists", {
                            artist: req.query.artist,
                            data: artist
                        });
                    }
                }, (err) => {
                    console.log(`Error: ${err}`);
                });
            }
            else if (!req.query.artist) {
                const songs = [];
                spotifyApi.searchTracks(req.query.song.trim(), {limit: 5})
                .then((data) => {
                    if (data.body.tracks.items.length === 0)
                    {
                        res.render("failure", {
                            song: req.query.song
                        });
                    }
                    else
                    {
                        for (let song of data.body.tracks.items)
                        {
                            songs.push({
                                name: song.name,
                                image: song.album.images[1].url,
                                previewUrl: song.preview_url,
                                uri: song.uri,
                                artist: song.artists[0].name,
                                artistUri: song.artists[0].uri
                            });
                        }
                        res.render("songs", {
                            song: req.query.song,
                            data: songs
                        });
                    }
                }, (err) => {
                    console.log(`Error: ${err}`);
                });
            }
            else if (req.query.song && req.query.artist)
            {
                spotifyApi.searchTracks(`track:'${req.query.song.trim()}' artist:'${req.query.artist.trim()}'`, {limit: 1})
                .then((data) => {
                    if (data.body.tracks.items.length === 0)
                    {
                        res.render("failure", {
                            song: req.query.song,
                            artist: req.query.artist
                        });
                    }
                    else
                    {
                        const song = {
                            name: data.body.tracks.items[0].name,
                            image: data.body.tracks.items[0].album.images[1].url,
                            uri: data.body.tracks.items[0].uri,
                            previewUrl: data.body.tracks.items[0].preview_url,
                            artistUri: data.body.tracks.items[0].artists[0].uri
                        };
                        res.render("results", {
                            song: req.query.song,
                            artist: req.query.artist,
                            data: song
                        });
                    }
                }, (err) => {
                    console.log(`Error: ${err}`);
                })
            }
        }
    );
});

app.listen(port, () => {
    console.log(`Spotify Web Search App listening on port ${port}.`);
});