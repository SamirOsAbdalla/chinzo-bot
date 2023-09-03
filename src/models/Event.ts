import { Schema, models, model } from "mongoose";


export interface EventType {
    name: string,
    usersAttending: string[],
    description: string,
    dateAndTime: string,
    location: string,
    googleMapsURL: string
}

const eventSchema = new Schema<EventType>({
    name: { type: String, required: true },
    usersAttending: { type: [String], required: false },
    description: { type: String, required: true },
    dateAndTime: { type: String, required: true },
    googleMapsURL: { type: String, required: true },
    location: { type: String, required: true },
})

const EventModel = models.Event || model<EventType>("Event", eventSchema)
export default EventModel
