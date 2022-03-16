# movies-api

# Description

This is a simple API for retrieving movies from a database which is located in a db.json file.
Movies can be filtered by duration and genres

## Query Params

duration - with this params API returns a single random movie that has a runtime between <duration - 10> and <duration + 10>.
genres - with this param API returns all movies that contain at least one of the specified genres

If no query parameter is specified, the API will return a random movie
