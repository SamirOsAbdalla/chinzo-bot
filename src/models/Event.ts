import { Schema, models, model } from "mongoose";


export interface Event {
    name: string,
    usersAttending: string[],
    description: string,
    date: string,
    time: string
    location: string,
}

const eventSchema = new Schema<Event>({
    name: { type: String, required: true },
    usersAttending: { type: [String], required: false },
    description: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
})

const EventModel = models.Event || model<Event>("Event", eventSchema)
export default EventModel
