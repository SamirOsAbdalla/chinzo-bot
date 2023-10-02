import { Schema, models, model } from "mongoose";

export interface TrackTime {
    time: string,
    timeHolder: string,
    carModel: string,
    convertedTime: string,
    tires: string
}

export interface Track {
    name: string,
    trackTimes: TrackTime[]
}

const trackTimeSchema = new Schema<TrackTime>({
    time: { type: String, required: true },
    timeHolder: { type: String, required: true },
    carModel: { type: String, required: true },
    convertedTime: { type: String, required: true },
    tires: { type: String, required: true },
})

const trackSchema = new Schema<Track>({
    name: { type: String, required: true },
    trackTimes: [{ type: trackTimeSchema, required: false }]
})

const TrackModel = models.Track || model<Track>("Track", trackSchema)
export default TrackModel